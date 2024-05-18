<script setup>
import { computed, reactive, ref, watch } from 'vue'
import rateService from '@/js/services/rateService'
import transactionService from '@/js/services/transactionService'
import currencyService from '@/js/services/currencyService'
import { Vue3Snackbar, useSnackbar } from "vue3-snackbar"
import { useRouter } from 'vue-router'

const router = useRouter()
const snackbar = useSnackbar()

const acceptedCurrency = ref(null)
const returnedCurrency = ref(null)
const amount = ref(null)
const returnedAmount = ref(null)
const acceptedCurrencies = ref([])
const returnedCurrencies = ref([])

const rate = ref({
  sellRate: null,
})

const isLoading = ref(false)
const isRateLoading = ref(false)
const isAcceptedCurrenciesLoading = ref(false)
const isReturnedCurrenciesLoading = ref(false)
const isAmountEnabled = ref(false)

const items = reactive(['General info', 'Preview'])
const step = ref(1)
const isLastItem = computed(() => step.value === items.length)

const nextOrSubmit = () => {
  if (isLastItem.value) {
    return createTransaction()
  }
  step.value++
}

watch([acceptedCurrency, returnedCurrency], () => {
  if (acceptedCurrency.value !== null && returnedCurrency.value !== null) {
    setCurrencyPairRate()
    isAmountEnabled.value = true
  }
  rate.value.sellRate = null
  isAmountEnabled.value = false
})

watch(amount, value => {
  returnedAmount.value = rate.value.sellRate * amount.value
})

function setCurrencyPairRate() {
  isRateLoading.value = true
  rateService.getRateByCurrencies(acceptedCurrency.value.id, returnedCurrency.value.id)
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

function setAcceptedCurrencies() {
  isAcceptedCurrenciesLoading.value = true
  if (returnedCurrency.value == null) {
    setCurrencies(acceptedCurrencies)
      .finally(() => {
        isAcceptedCurrenciesLoading.value = false
      })
  }
  else {
    rateService.getCurrenciesForAcceptedCurrency(returnedCurrency.value.id)
      .then(data=>{
        acceptedCurrencies.value = data
      })
      .catch(error => {
        acceptedCurrencies.value = null
        let errorObj = {
          type: 'error',
          text: 'There are no returned currencies that we can accept for this currency',
        }
        snackbar.add(errorObj)
      })
      .finally(() => {
        isAcceptedCurrenciesLoading.value = false
      })
  }
}

function setReturnedCurrencies() {
  isReturnedCurrenciesLoading.value = true
  if (acceptedCurrency.value == null) {
    setCurrencies(returnedCurrencies)
      .finally(() => {
        isReturnedCurrenciesLoading.value = false
      })
  }
  else {
    rateService.getCurrenciesForReturnedCurrency(acceptedCurrency.value.id)
      .then(data=>{
        returnedCurrencies.value = data
      })
      .catch(error => {
        returnedCurrencies.value = null
        let errorObj = {
          type: 'error',
          text: 'There are no accepted currencies that we can return for this currency',
        }
        snackbar.add(errorObj)
      })
      .finally(() => {
        isReturnedCurrenciesLoading.value = false
      })
  }
}

function setCurrencies(reactiveVariable) {
  return currencyService.getCurrencies()
    .then(data => {
      reactiveVariable.value = data
    })
    .catch(error => {
      let errObj = {
        type: 'error',
        text: 'Can\'t get available currencies',
      }
      snackbar.add(errObj)
    })
}

function createTransaction() {
  isLoading.value = true
  let data = {
    rateId: rate.value.id,
    isSale: true,
    amount: amount.value,
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
  <VStepper
    v-model="step"
    :items="items"
  >
    <VStepperWindow v-if="step === 1">
      <VRow>
        <VCol class="pa-5">
          <VAutocomplete
            label="contacts"
            :items="['contact1', 'contact2', 'contact3']"
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
            @click="setAcceptedCurrencies"
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
            @click="setReturnedCurrencies"
          />
        </VCol>
        <VCol class="pa-5">
          <VTextField
            v-model="amount"
            hide-details="auto"
            type="number"
            label="Amount"
            :disabled="isAmountEnabled"
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
      <VStepperHeader class="text-h3">
        Preview
      </VStepperHeader>

      <VStepperWindow>
        <VRow>
          <VCol class="pa-5">
            <VAutocomplete
              label="Contact"
              :items="['nick', 'evgeniy', 'pavlo']"
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
