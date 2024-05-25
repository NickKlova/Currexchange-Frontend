<script setup>
import { computed, reactive, ref, watch } from 'vue'
import rateService from '@/js/services/rateService'
import transactionService from '@/js/services/transactionService'
import currencyService from '@/js/services/currencyService'
import reservationService from '@/js/services/reservationService'
import contactService from '@/js/services/contactService'
import { Vue3Snackbar, useSnackbar } from "vue3-snackbar"
import { useRouter } from 'vue-router'

const router = useRouter()
const snackbar = useSnackbar()

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

const items = reactive(['General info', 'Additional info', 'Preview'])
const step = ref(1)
const isLastItem = computed(() => step.value === items.length)

const contacts = ref([])
const contact = ref()

const reservations = ref([])
const reservation = ref()

function setContacts() {
  return contactService.getContacts()
    .then(data => {
      contacts.value = data
    })
}

function setReservations() {
  return reservationService.getReservations()
    .then(data => {
      reservations.value = data
    })
}

const nextOrSubmit = () => {
  if (isLastItem.value) {
    return createTransaction()
  }
  step.value++
}

onMounted(() => {
  setContacts().then(() => {
    return setReservations()
  })
    .then(() => {
      return setContacts()
    })
    .then(() => {
      setCurrencies()
    })
})

function setCurrencies() {
  currencyService.getCurrencies()
    .then(data=>{
      currencies.value = data
    })
}

const currencies = ref([])
const returnedCurrenciesSuggestion = ref([])
const acceptedCurrenciesSuggestion = ref([])

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

function createTransaction() {
  isLoading.value = true
  let data = {
    rateId: rate.value.id,
    isSale: true,
    amount: amount.value,
    contactId: contact.value.id,
  }
  transactionService.createTransaction(data)
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
        text: 'Can\'t create transaction',
      }
      snackbar.add(errorObj)
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<template>
  <VDialog
    v-model="isLoading"
    :persistent="isLoading"
  >
    <VProgressCircular
      v-if="isLoading"
      color="primary"
      :size="100"
      :width="10"
      indeterminate
      class="ma-auto"
    />
  </VDialog>

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

    <VStepperWindow v-if="step === 2">
      <VRow>
        <VCol class="pa-5">
          <VAutocomplete
            v-model="contact"
            label="Contact"
            :items="contacts"
            item-title="fullName"
            return-object
            clearable
          />
        </VCol>
        <VCol class="pa-5">
          <VAutocomplete
            v-model="reservation"
            label="Reservations"
            :items="reservations"
            item-title="id"
            return-object
            hide-details
            clearable
            outlined
          />
        </VCol>
      </VRow>
    </VStepperWindow>

    <VStepperWindow v-if="step === 3">
      <VStepperHeader class="text-h3">
        Preview
      </VStepperHeader>

      <VStepperWindow>
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
              v-model="amount"
              hide-details="auto"
              type="number"
              label="Rate"
              disabled
            />
          </VCol>
          <VCol class="pa-5">
            <VTextField
              v-model="amount"
              hide-details="auto"
              type="number"
              label="Returned amount"
              disabled
            />
          </VCol>
        </VRow>

        <VRow>
          <VCol class="pa-5">
            <VAutocomplete
              label="Contact"
              :items="['nick', 'evgeniy', 'pavlo']"
              disabled
            />
          </VCol>
          <VCol class="pa-5">
            <VAutocomplete
              label="Reservations"
              :items="['reservation 1 - date - amount - currency', 'reservation 2', 'reservation 3']"
              hide-details
              outlined
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
