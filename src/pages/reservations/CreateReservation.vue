<script setup>
import { computed, reactive, ref, watch } from 'vue'
import rateService from '@/js/services/rateService'
import contactService from '@/js/services/contactService'
import currencyService from '@/js/services/currencyService'
import { Vue3Snackbar, useSnackbar } from "vue3-snackbar"
import { useRouter } from 'vue-router'
import reservationService from '@/js/services/reservationService'
import isVarEmpty from '@/js/helper'
import { operationTypes } from '@/js/consts/operationTypesConsts'
import { reservationStatuses } from '@/js/consts/reservationStatusesConsts'

const router = useRouter()
const snackbar = useSnackbar()

const contacts = ref([])
const currencies = ref([])

const contact = ref(null)
const reservationStatus = ref(null)
const currency = ref(null)
const amount = ref(null)
const returnedAmount = ref(null)
const rate = ref(null)
const operationType = ref(null)

const rateTextValue = computed(() => {
  if (operationType.value !== null && rate.value !== null) {
    if (operationType.value.id === "e3b0c442-98fc-1c14-9afd-2fb77c6076f6") {
      return rate.value.buyRate
    }
    return rate.value.sellRate
  }
  return ""
})

const isAmountDisabled = computed(() => {
  return currency.value === null || operationType.value === null
})

const items = reactive(['General info', 'Preview'])
const step = ref(1)
const isLastItem = computed(() => step.value === items.length)

const nextOrSubmit = async () => {
  if (isLastItem.value) {
    return await createReservation()
  }
  step.value++
}

onMounted(async () => {
  await setContacts()
  await setCurrencies()
})

watch(amount, (newValue) => {
  returnedAmount.value = Math.round((newValue * rateTextValue.value) * 100) / 100
})

watch(currency, async (newValue) => {
  if (newValue !== null) {
    return await getRate(newValue.id)
  }
  rate.value = null
  rateTextValue.value = null
})

async function setContacts() {
  await contactService.getContacts()
    .then(data => {
      contacts.value = data
    })
}

async function setCurrencies() {
  await currencyService.getCurrencies()
    .then(data => {
      currencies.value = data
    })
}

async function getRate(currencyId) {
  await rateService.getRateByCurrency(currencyId)
    .then(data => {
      rate.value = data
    })
}

async function createReservation() {
  let data = {
    contactId: contact.value.id,
    rateId: rate.value.id,
    operationId: operationType.value.id,
    statusId: reservationStatus.value.id,
    amount: amount.value,
  }

  await reservationService.createReservation(data)
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
}
</script>

<template>
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
              v-model="currency"
              label="Currency"
              :items="currencies"
              item-title="code"
              return-object
              clearable
            />
          </VCol>
          <VCol class="pa-5">
            <VSelect
              v-model="operationType"
              label="Operation Type"
              :items="operationTypes"
              item-title="name"
              return-object
            />
          </VCol>
          <VCol class="pa-5">
            <VSelect
              v-model="reservationStatus"
              label="Reservation status"
              :items="reservationStatuses"
              item-title="name"
              return-object
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VTextField
              v-model="amount"
              hide-details="auto"
              type="number"
              label="Amount"
              :disabled="isAmountDisabled"
            />
          </VCol>
          <VCol class="pa-5">
            <VTextField
              v-model="rateTextValue"
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

    <VStepperWindow v-if="step === 2">
      <VStepperHeader class="text-h3">
        Confirmation
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
              disabled
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol class="pa-5">
            <VAutocomplete
              v-model="currency"
              label="Currency"
              :items="currencies"
              item-title="code"
              return-object
              clearable
              disabled
            />
          </VCol>
          <VCol class="pa-5">
            <VSelect
              v-model="operationType"
              label="Operation Type"
              :items="operationTypes"
              item-title="name"
              return-object
              disabled
            />
          </VCol>
          <VCol class="pa-5">
            <VSelect
              v-model="reservationStatus"
              label="Reservation status"
              :items="reservationStatuses"
              item-title="name"
              return-object
              disabled
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VTextField
              v-model="amount"
              hide-details="auto"
              type="number"
              label="Amount"
              disabled
            />
          </VCol>
          <VCol class="pa-5">
            <VTextField
              v-model="rateTextValue"
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

  <Vue3Snackbar
    bottom
    right
    :duration="500"
  />
</template>
