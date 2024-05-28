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
import { validationRules } from '@/js/validationRules.js'

const router = useRouter()
const snackbar = useSnackbar()

const isLoading = ref(false)

const isFormValid = ref(false)
const form = ref(null)

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
  if (step.value > 1) {
    return true
  }

  return currency.value === null || operationType.value === null
})

const items = reactive(['General info', 'Preview'])
const step = ref(1)
const isLastItem = computed(() => step.value === items.length)

const nextOrSubmit = async () => {
  if (isLastItem.value) {
    return await createReservation()
  }
  if (step.value === 1 && !isFormValid.value) {
    form.value.validate()
    return
  }
  step.value++
}

onMounted(async () => {
  await setContacts()
  await setCurrencies()
})

//region watchers

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

async function getRate(currencyId) {
  await rateService.getRateByCurrency(currencyId)
    .then(data => {
      rate.value = data
    })
}

//endregion

const isFieldDisabled = computed(() => {
  if (step.value > 1) {
    return true
  }
  return false
})

//region validation rules

const contactValidationRules = computed(() => {
  let model = contact.value
  let rules = []

  rules.push(validationRules.isFieldRequired(model))
  return rules
})

const currencyValidationRules = computed(() => {
  let model = currency.value
  let rules = []

  rules.push(validationRules.isFieldRequired(model))
  return rules
})

const reservationStatusValidationRules = computed(() => {
  let model = reservationStatus.value
  let rules = []

  rules.push(validationRules.isFieldRequired(model))
  return rules
})

const operationTypeValidationRules = computed(() => {
  let model = operationType.value
  let rules = []

  rules.push(validationRules.isFieldRequired(model))
  return rules
})

const amountValidationRules = computed(() => {
  let model = amount.value
  let rules = []

  if(!isAmountDisabled.value) {
    rules.push(validationRules.isFieldRequired(model))

    let isPositiveAmount = typeof parseFloat(model) === 'number' && !isNaN(parseFloat(model)) && parseFloat(model) > 0
    rules.push((isPositiveAmount) || 'Amount must be a positive number')
  }

  return rules
})

//endregion

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createReservation() {
  let data = {
    contactId: contact.value.id,
    rateId: rate.value.id,
    operationId: operationType.value.id,
    statusId: reservationStatus.value.id,
    amount: amount.value,
  }
  isLoading.value = true
  let reservationCreatedSuccessfully = false
  try {
    await reservationService.createReservation(data)
    snackbar.add({
      type: 'success',
      text: `Reservation created successfully!`,
    })
    reservationCreatedSuccessfully = true
  } catch (error) {
    snackbar.add({
      type: 'error',
      text: error.message,
    })
  } finally {
    isLoading.value = false
    if(reservationCreatedSuccessfully) {
      await delay(1000)
      await router.push('/reservations/get')
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
                clearable
                :rules="contactValidationRules"
                return-object
                :disabled="isFieldDisabled"
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
                :rules="currencyValidationRules"
                clearable
                :disabled="isFieldDisabled"
              />
            </VCol>
            <VCol class="pa-5">
              <VSelect
                v-model="operationType"
                label="Operation Type"
                :items="operationTypes"
                item-title="name"
                :rules="operationTypeValidationRules"
                return-object
                :disabled="isFieldDisabled"
              />
            </VCol>
            <VCol class="pa-5">
              <VSelect
                v-model="reservationStatus"
                label="Reservation status"
                :items="reservationStatuses"
                item-title="name"
                :rules="reservationStatusValidationRules"
                return-object
                :disabled="isFieldDisabled"
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
                :rules="amountValidationRules"
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
