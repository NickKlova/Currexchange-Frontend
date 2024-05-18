<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import currencyService from '@/js/services/currencyService'
import rateService from '@/js/services/rateService'
import { useRouter } from 'vue-router'
import { Vue3Snackbar, useSnackbar } from "vue3-snackbar"
import isVarEmpty from "@/js/helper"

const snackbar = useSnackbar()
const router = useRouter()
const items = reactive(['Rate information', 'Confirmation'])
const step = ref(1)
const isLastItem = computed(() => step.value === items.length)

const acceptedCurrency = ref({
  id: null,
  code: null,
  description: null,
  symbol: null,
})

const returnedCurrency = ref({
  id: null,
  code: null,
  description: null,
  symbol: null,
})

const currencies = ref([])
const rate = ref(null)

const acceptedCurrencies = computed(() => {
  if (returnedCurrency.value !== null) {
    return [...currencies.value].filter(curr=>curr.id !== returnedCurrency.value.id)
  }

  return [...currencies.value]
})

const returnedCurrencies = computed(() => {
  if (acceptedCurrency.value !== null) {
    return [...currencies.value].filter(curr=>curr.id !== acceptedCurrency.value.id)
  }

  return [...currencies.value]
})

onMounted(() => {
  setCurrencies(currencies)
})

function isAllRequiredFieldFill() {
  return !(isVarEmpty(acceptedCurrency.value) || isVarEmpty(returnedCurrency.value) || isVarEmpty(rate.value))
}

function setCurrencies(reactiveVariable) {
  return currencyService.getCurrencies()
    .then(data => {
      reactiveVariable.value = data
    })
}

const nextOrSubmit = () => {
  if (isLastItem.value) {
    if (isAllRequiredFieldFill()) {
      return createRate()
    }
    let errorObj = {
      type: 'error',
      text: 'Fill all fields',
    }
    snackbar.add(errorObj)

    return
  }

  step.value++
}

function createRate() {
  let data = {
    "baseCurrencyId": acceptedCurrency.value.id,
    "targetCurrencyId": returnedCurrency.value.id,
    "sellRate": rate.value,
    "buyRate": rate.value,
  }
  rateService.createRate(data)
    .then(() => {
      router.push('/base')
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
      <VRow>
        <VCol class="pa-5">
          <VAutocomplete
            v-model="acceptedCurrency"
            label="Accepted currency"
            :items="acceptedCurrencies"
            return-object
            clearable
            item-title="code"
          />
        </VCol>
        <VCol class="pa-5">
          <VAutocomplete
            v-model="returnedCurrency"
            label="Returned currency"
            :items="returnedCurrencies"
            return-object
            clearable
            item-title="code"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol class="pa-5">
          <VTextField
            v-model="rate"
            label="Rate"
          />
        </VCol>
      </VRow>
    </VStepperWindow>

    <VStepperWindow v-if="step === 2">
      <VRow>
        <VCol class="pa-5">
          <VTextField
            v-model="acceptedCurrency.code"
            label="Accepted currency"
            disabled
          />
        </VCol>
        <VCol class="pa-5">
          <VTextField
            v-model="returnedCurrency.code"
            label="Returned currency"
            disabled
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol class="pa-5">
          <VTextField
            v-model="rate"
            label="Rate"
            disabled
          />
        </VCol>
      </VRow>
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

