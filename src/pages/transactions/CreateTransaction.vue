<script setup>
import { computed, reactive, ref, watch } from 'vue'

import rateService from '@/js/services/rateService'
import transactionService from '@/js/services/transactionService'
import currencyService from '@/js/services/currencyService'
import reservationService from '@/js/services/reservationService'
import contactService from '@/js/services/contactService'

import { Vue3Snackbar, useSnackbar } from 'vue3-snackbar'
import { useRouter } from 'vue-router'

import { operationTypes } from '@/js/consts/operationTypesConsts.js'
import { validationRules } from '@/js/validationRules.js'

const router = useRouter()
const snackbar = useSnackbar()

//region stepper fields

const items = reactive(['Info', 'Preview'])
const step = ref(1)
const isLastItem = computed(() => step.value === items.length)

//endregion

//region form fields

const isFormValid = ref(false)
const form = ref(null)

//endregion

//region fields

const isLoading = ref(false)
const isReservationType = ref(false)
const contacts = ref([])
const reservations = ref([])
const currencies = ref([])

const contact = ref()
const currency = ref(null)
const reservation = ref(null)
const operationType = ref(null)
const rate = ref(null)
const rateTextValue = ref(null)
const amount = ref(null)
const returnedAmount = ref(null)

//endregion

//region next or submit stepper

const nextOrSubmit = async () => {
  if (isLastItem.value) {
    return createTransaction()
  }
  if (step.value === 1 && !isFormValid.value) {
    form.value.validate()
    return
  }
  step.value++
}

//endregion

onMounted(async () => {
  await setContacts()
  await setCurrencies()
})

//region watchers

watch(contact, async (newValue) => {
  if (contact.value !== null) {
    await setReservations(contact.value.id)
  }
  if (newValue === null) {
    reservations.value = []
  }
})

watch(currency, async (newValue) => {
  if (!isReservationType.value) {
    if (currency.value !== null) {
      await setRate(newValue.id)
      rateTextValue.value = null
      operationType.value = null
    }
    if (currency.value === null) {
      rateTextValue.value = null
      operationType.value = null
      rate.value = null
      return
    }
  }
})

watch(operationType, async (newValue) => {
  if (!isReservationType.value) {
    if (newValue !== null) {
      if (newValue.id === "c2d4e3f6-63a4-4d58-bc63-ad6e2e7b3fb6") {
        return rateTextValue.value = rate.value.sellRate
      }
      return rateTextValue.value = rate.value.buyRate
    }
    rateTextValue.value = null
  }
})

watch(amount, (newValue) => {
  returnedAmount.value = Math.round((newValue * rateTextValue.value) * 100) / 100
})

watch(reservation, (newValue) => {
 currency.value = newValue.rate.currency
  operationType.value = newValue.operationType
  rate.value = newValue.rate
  amount.value = newValue.amount
  if (newValue.operationType.id === "e3b0c442-98fc-1c14-9afd-2fb77c6076f6") {
    rateTextValue.value = newValue.rate.buyRate
  }
  if (newValue.operationType.id === "c2d4e3f6-63a4-4d58-bc63-ad6e2e7b3fb6") {
    rateTextValue.value = newValue.rate.sellRate
  }

})

watch(isReservationType, () => {
  form.value.reset()
})

//endregion

//region blocking fields

const isDisabledForPreview = computed(() => {
  if (isLastItem.value) {
    return true
  }
  return false
})

const isReservationFieldDisabled = computed(() => {
  if(isReservationType.value) {
    return true
  }
  if(isFieldDisabled.value) {
    return true
  }
  return false
})

const isFieldDisabled = computed(() => {
  if(isDisabledForPreview.value) {
    return true
  }
  return false
})

const isAmountDisabled = computed(() => {
  if (isDisabledForPreview.value) {
    return true
  }
  if(isReservationType.value) {
    return true
  }
  return currency.value === null || operationType.value === null
})

//endregion

//region value setters

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

async function setReservations(contactId) {
  await reservationService.getReservationsByContact(contactId).then(data => reservations.value = data)
}

async function setRate(currencyId) {
  await rateService.getRateByCurrency(currencyId)
    .then(data => rate.value = data)
}

//endregion

//region validation rules

const contactValidationRules = computed(() => {
  let model = contact.value
  let rules = []

  if (isReservationType.value) {
    rules.push(validationRules.isFieldRequired(model))
  }
  return rules
})

const reservationValidationRules = computed(() => {
  let model = reservation.value
  let rules = []

  if (isReservationType.value) {
    rules.push(validationRules.isFieldRequired(model))
  }
  return rules
})

const amountValidationRules = computed(() => {
  let model = amount.value
  let rules = []

  if (!isReservationType.value && !isAmountDisabled.value) {
    rules.push(validationRules.isFieldRequired(model))

    let isPositiveAmount = typeof parseFloat(model) === 'number' && !isNaN(parseFloat(model)) && parseFloat(model) > 0
    rules.push((isPositiveAmount) || 'Amount must be a positive number')
  }
  return rules
})

const currencyValidationRules = computed(() => {
  let model = currency.value
  let rules = []

  if (!isReservationType.value) {
    rules.push(validationRules.isFieldRequired(model))
  }
  return rules
})

const operationTypeValidationRules = computed(() => {
  let model = operationType.value
  let rules = []

  if (!isReservationType.value) {
    rules.push(validationRules.isFieldRequired(model))
  }
  return rules
})

//endregion

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createTransaction() {
  let data = {}
  if (isReservationType.value) {
    data = {
      contactId: contact.value.id,
      rateLog: {
        currencyId: rate.value.currency.id,
        buyRate: rate.value.buyRate,
        sellRate: rate.value.sellRate,
      },
      typeId: "D4F6E2A1-9C3B-4D8E-7F2A-5C1E3B4F6A9D",
      operationId: operationType.value.id,
      reservationId: reservation.value.id,
      amount: amount.value,
    }
  }
  if(!isReservationType.value) {
    data = {
      rateLog: {
        currencyId: rate.value.currency.id,
        buyRate: rate.value.buyRate,
        sellRate: rate.value.sellRate,
      },
      operationId: operationType.value.id,
      typeId: "F2C1A3E5-4D6B-4E8F-9A7C-5B1D3E4F6A7B",
      amount: amount.value,
    }
    if (!!contact.value) {
      data.contactId = contact.value.id
    }
  }

  isLoading.value = true
  let transactionCreatedSuccessfully = false
  try {
    await transactionService.createTransaction(data)
    snackbar.add({
      type: 'success',
      text: 'Transaction created successfully!',
    })
    transactionCreatedSuccessfully = true
  } catch (error) {
    snackbar.add({
      type: 'error',
      text: error.message,
    })
  } finally {
    isLoading.value = false
    if(transactionCreatedSuccessfully) {
      await delay(1000)
      await router.push('/transactions/get')
    }
  }
}
</script>

<template>
  <VStepper
    v-model="step"
    :items="items"
  >
    <VStepperWindow>
      <VSwitch class="pb-5 d-flex justify-end"
        v-model="isReservationType"
        label="Issuing a reservation"
         :disabled="isFieldDisabled"
      />
      <VForm
        v-model="isFormValid"
        ref="form"
      >
        <VRow>
          <VCol class="pa-5">
            <VAutocomplete
              v-model="contact"
              label="Contact"
              :items="contacts"
              item-title="fullName"
              return-object
              :disabled="isFieldDisabled"
              :rules="contactValidationRules"
              clearable
            />
          </VCol>
          <VCol class="pa-5">
            <VAutocomplete
              v-model="reservation"
              v-if="isReservationType"
              label="Reservation"
              :items="reservations"
              item-title="id"
              return-object
              :disabled="isFieldDisabled"
              :rules="reservationValidationRules"
              clearable
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
              :disabled="isReservationFieldDisabled"
              :rules="currencyValidationRules"
            />
          </VCol>
          <VCol class="pa-5">
            <VAutocomplete
              v-model="operationType"
              label="Operation type"
              :items="operationTypes"
              item-title="name"
              return-object
              clearable
              :disabled="isReservationFieldDisabled"
              :rules="operationTypeValidationRules"
            />
          </VCol>
          <VCol class="pa-5">
            <VTextField
              v-model="amount"
              hide-details="auto"
              type="number"
              label="Amount"
              :disabled="isAmountDisabled"
              :rules="amountValidationRules"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol class="pa-5">
            <VTextField
              v-model="rateTextValue"
              hide-details="auto"
              type="number"
              label="Rate"
              disabled
              :disabled="isReservationFieldDisabled"
            />
          </VCol>
          <VCol class="pa-5">
            <VTextField
              v-model="returnedAmount"
              hide-details="auto"
              type="number"
              label="Returned amount"
              disabled
              :disabled="isReservationFieldDisabled"
            />
          </VCol>
        </VRow>
      </VForm>
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
</template>
