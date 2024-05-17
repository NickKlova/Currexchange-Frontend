<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import currencyService from '@/pages/js/currencyService'
import rateService from '@/pages/js/rateService'
import transactionService from '@/pages/js/transactionService'
// step general info
const acceptedCurrency = ref(null)
const returnedCurrency = ref(null)
const amount = ref(null)
const isLoading = ref(false)
const rate = ref({
  sellRate: null,
})

const isAmountEnabled = ref(false)
const returnedAmount = ref(null)

const currencies = ref([])
const items = reactive(['General info', 'Addition info', 'Preview'])
const step = ref(1)
const acceptedCurrencies = ref([])
const returnedCurrencies = ref([])

watch([acceptedCurrency, returnedCurrency], () => {
  if (acceptedCurrency.value !== null && returnedCurrency.value !== null) {
    setCurrencyPairRate()
    isAmountEnabled.value = true
  }
  isAmountEnabled.value = false
})

watch(amount, value => {
  returnedAmount.value = rate.value.sellRate * amount.value
})

function setCurrencyPairRate() {
  rateService.getRateByCurrencies(acceptedCurrency.value.id, returnedCurrency.value.id)
    .then(data => {
      rate.value = data
    })
}

function setAcceptedCurrencies() {
  if (returnedCurrency.value == null) {
    setCurrencies(acceptedCurrencies)
  }
  else {
    rateService.getCurrenciesForAcceptedCurrency(returnedCurrency.value.id)
      .then(data=>{
        acceptedCurrencies.value = data
      })
      .catch(error => {
        acceptedCurrencies.value = null
      })
  }
}

function setReturnedCurrencies() {
  if (acceptedCurrency.value == null) {
    setCurrencies(returnedCurrencies)
  }
  else {
    rateService.getCurrenciesForReturnedCurrency(acceptedCurrency.value.id)
      .then(data=>{
        returnedCurrencies.value = data
      })
      .catch(error => {
        returnedCurrencies.value = null
      })
  }
}

function setCurrencies(refVariable) {
  currencyService.getCurrencies()
    .then(data => {
      refVariable.value = data
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

const isLastItem = computed(() => step.value === items.length)

const nextOrSubmit = () => {
  if (isLastItem.value) {
    submitStepper()
  }
  step.value++
}

function submitStepper() {
  isLoading.value = true
  let data = {
    rateId: rate.value.id,
    isSale: true,
    amount: amount.value,
  }
  transactionService.createTransaction(data)
    .then(info => {
      isLastItem.value = false
    })
    .catch(err=>{
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
      class="ma-auto">
    </VProgressCircular>
  </VDialog>-->
  <VDialog v-model="isLoading">
    Error
  </VDialog>

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
            label="Contact"
            :items="['nick', 'evgeniy', 'pavlo']"
          />
        </VCol>
        <VCol class="pa-5">
          <VAutocomplete
            label="Reservations"
            :items="['reservation 1 - date - amount - currency', 'reservation 2', 'reservation 3']"
            hide-details
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
              :items="currencies"
              item-title="code"
              disabled
            />
          </VCol>
          <VCol class="pa-5">
            <VAutocomplete
              v-model="returnedCurrency"
              label="Returned currency"
              :items="currencies"
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
