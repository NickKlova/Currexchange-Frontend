<script setup>
import { computed, reactive, ref, watch } from 'vue'
import rateService from '@/js/services/rateService'
import contactService from '@/js/services/contactService'
import currencyService from '@/js/services/currencyService'
import { Vue3Snackbar, useSnackbar } from "vue3-snackbar"
import { useRouter } from 'vue-router'
import reservationService from '@/js/services/reservationService'
import isVarEmpty from '@/js/helper'

const router = useRouter()
const snackbar = useSnackbar()

const contacts = ref([])
const contact = ref(null)

const acceptedCurrency = ref(null)

const returnedCurrency = ref(null)

const amount = ref(null)
const returnedAmount = ref(null)

const rate = ref({
  sellRate: null,
})

const isLoading = ref(false)
const isRateLoading = ref(false)
const isAcceptedCurrenciesLoading = ref(false)
const isReturnedCurrenciesLoading = ref(false)
const currencies = ref([])
const returnedCurrenciesSuggestion = ref([])
const acceptedCurrenciesSuggestion = ref([])

const items = reactive(['General info', 'Preview'])
const step = ref(1)
const isLastItem = computed(() => step.value === items.length)

const nextOrSubmit = () => {
  if (isLastItem.value) {
    return createReservation()
  }
  step.value++
}

onMounted(() => {
  setContacts()
    .then(() => {
      setCurrencies()
    })
})

function setContacts() {
  return contactService.getContacts()
    .then(data => {
      contacts.value = data
    })
}

function setCurrencies() {
  currencyService.getCurrencies()
    .then(data=>{
      currencies.value = data
    })
}

const acceptedCurrencies = computed(() => {
  if (returnedCurrency.value !== null) {
    return [...acceptedCurrenciesSuggestion.value]
  }

  return [...currencies.value]
})

const returnedCurrencies = computed(() => {
  if (acceptedCurrency.value !== null) {
    return [...returnedCurrenciesSuggestion.value]
  }

  return [...currencies.value]
})

watch(acceptedCurrency, async () => {
  if(acceptedCurrency.value !== null) {
    await rateService.getCurrenciesForReturnedCurrency(acceptedCurrency.value.id)
      .then(data => {
        returnedCurrenciesSuggestion.value = data
      })
      .catch(err => {
        returnedCurrenciesSuggestion.value = []
      })

    if(returnedCurrency.value !== null) {
      await setCurrencyPairRate()
    }

    return
  }
  rate.value.sellRate = null
})

watch(returnedCurrency, async () => {
  if(returnedCurrency.value !== null) {
    await rateService.getCurrenciesForAcceptedCurrency(returnedCurrency.value.id)
      .then(data => {
        acceptedCurrenciesSuggestion.value = data
      })
      .catch(err => {
        acceptedCurrenciesSuggestion.value = []
      })

    if(acceptedCurrency.value !== null) {
      await setCurrencyPairRate()
    }

    return
  }
  rate.value.sellRate = null
})

watch(amount, () => {
  returnedAmount.value = amount.value * rate.value.sellRate
})

async function setCurrencyPairRate() {
  isRateLoading.value = true
  await rateService.getRateByCurrencies(acceptedCurrency.value.id, returnedCurrency.value.id)
    .then(data => {
      rate.value = data
    })
    .catch(error => {
      let errObj = {
        type: 'error',
        text: 'It is impossible to get the rate for such a pair of currencies',
      }
      snackbar.add(errObj)
    })
    .finally(() => {
      isRateLoading.value = false
    })
}

const isAmountDisabled = computed(() => {
  return !(returnedCurrency.value !== null && acceptedCurrency.value !== null)
})

function isAllRequiredFieldsFill() {
  return !(isVarEmpty(contact.value) || isVarEmpty(rate.value) || isVarEmpty(amount.value))
}

function createReservation() {
  if(!isAllRequiredFieldsFill()) {
    let errorObj = {
      type: 'error',
      text: 'Fill all fields!',
    }
    snackbar.add(errorObj)

    return
  }

  isLoading.value = true
  let data = {
    contactId: contact.value.id,
    rateId: rate.value.id,
    amount: amount.value,
    isSell: true,
  }
  reservationService.createReservation(data)
    .then(info => {
      let successObj = {
        type: 'success',
        text: 'Transaction successfully created',
      }
      snackbar.add(successObj)
      setTimeout(() => {
        router.push('/base')
      }, 2000)
    })
    .catch(err=>{
      let errorObj = {
        type: 'error',
        text: 'Can\'t create reservation',
      }
      snackbar.add(errorObj)
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<template>
  <Vue3Snackbar
    bottom
    right
    :duration="2000"
  />
  <VStepper
    v-model="step"
    :items="items"
  >
    <VStepperWindow v-if="step === 1">
      <VStepperHeader class="text-h3">
        Reservation Information
      </VStepperHeader>

      <VStepperWindow>
        <VRow>
          <VCol class="pa-5">
            <VAutocomplete
              v-model="contact"
              label="Contact"
              :items="contacts"
              item-title="fullName"
              clearable
              return-object
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol class="pa-5">
            <VAutocomplete
              v-model="acceptedCurrency"
              label="Accepted currency"
              :items="acceptedCurrencies"
              item-title="code"
              :loading="isAcceptedCurrenciesLoading"
              return-object
              clearable
            />
          </VCol>
          <VCol class="pa-5">
            <VAutocomplete
              v-model="returnedCurrency"
              label="Returned currency"
              :items="returnedCurrencies"
              item-title="code"
              :loading="isReturnedCurrenciesLoading"
              return-object
              clearable
            />
          </VCol>
          <VCol class="pa-5">
            <VTextField
              v-model="amount"
              hide-details="auto"
              type="number"
              label="Amount"
              :disabled="isAmountDisabled"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol class="pa-5">
            <VTextField
              v-model="rate.sellRate"
              hide-details="auto"
              type="number"
              label="Rate"
              :loading="isRateLoading"
              disabled
            />
          </VCol>
          <VCol class="pa-5">
            <VTextField
              v-model="returnedAmount"
              hide-details="auto"
              type="number"
              label="Returned amount"
              disabled
            />
          </VCol>
        </VRow>
      </VStepperWindow>
    </VStepperWindow>

    <VStepperWindow v-if="step === 2">
      <VStepperHeader class="text-h3">
        Preview
      </VStepperHeader>

      <VStepperWindow>
        <VRow>
          <VCol class="pa-5">
            <VAutocomplete
              v-model="contact"
              label="Contact"
              :items="contacts"
              item-title="fullName"
              disabled
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol class="pa-5">
            <VAutocomplete
              v-model="acceptedCurrency"
              label="Accepted currency"
              :items="acceptedCurrencies"
              item-title="code"
              disabled
            />
          </VCol>
          <VCol class="pa-5">
            <VAutocomplete
              v-model="returnedCurrency"
              label="Returned currency"
              :items="returnedCurrencies"
              item-title="code"
              disabled
            />
          </VCol>
          <VCol class="pa-5">
            <VTextField
              v-model="amount"
              hide-details="auto"
              type="number"
              label="Amount"
              disabled
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol class="pa-5">
            <VTextField
              v-model="rate"
              hide-details="auto"
              type="number"
              label="Rate"
              disabled
            />
          </VCol>
          <VCol class="pa-5">
            <VTextField
              v-model="returnedAmount"
              hide-details="auto"
              type="number"
              label="Returned amount"
              disabled
            />
          </VCol>
        </VRow>
      </VStepperWindow>
    </VStepperWindow>

    <template #next>
      <VBtn
        :disabled="false"
        :color="isLastItem ? 'success' : 'primary'"
        @click="nextOrSubmit"
      >
        {{ isLastItem ? 'Submit' : 'Next' }}
      </VBtn>
    </template>
  </VStepper>
</template>
