<script setup>
import currencyService from '@/js/services/currencyService'
import rateService from '@/js/services/rateService'
import { Vue3Snackbar, useSnackbar } from "vue3-snackbar"
import isVarEmpty from "@/js/helper"

const props = defineProps({
  rate: {
    type: Object,
    default: null,
  },
})

const snackbar = useSnackbar()

const emits = defineEmits(['closeModifyRateDialog', 'updateRateInList'])

const currencies = ref([])

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

const rateNum = ref(null)

onMounted(() => {
  fillRateFields()
  setCurrencies()
})

function isAllRequiredFieldsFill() {
  return !isVarEmpty(rateNum.value)
}

function fillRateFields() {
  acceptedCurrency.value = props.rate.baseCurrency
  returnedCurrency.value = props.rate.targetCurrency
  rateNum.value = props.rate.sellRate
}

function setCurrencies() {
  currencyService.getCurrencies()
    .then(response=>{
      currencies.value = response
    })
}

function closeDialogWindow() {
  let closeObject = {
    id: props.rate.id,
    state: true,
  }
  emits('closeModifyRateDialog', closeObject)
}

function updateRate() {
  if(!isAllRequiredFieldsFill()) {
    let errorObj = {
      type: 'error',
      text: 'Fill all fields',
    }
    snackbar.add(errorObj)

    return
  }
  let data = {
    baseCurrencyId: acceptedCurrency.value.id,
    targetCurrencyId: returnedCurrency.value.id,
    sellRate: rateNum.value,
    buyRate: rateNum.value,
  }
  rateService.updateRate(props.rate.id, data)
    .then((rate) => {
      updateRateInList(rate)
    })
}

function updateRateInList(rate) {
  emits('updateRateInList', rate)
}
</script>

<template>
  <Vue3Snackbar
    bottom
    right
    :duration="2000"
  />
  <VCard>
    <!-- Close button in header -->
    <div class="d-flex justify-end pa-5">
      <VBtn @click="closeDialogWindow">
        Close
      </VBtn>
    </div>
    <!-- -->

    <!-- Edit container -->
    <VContainer>
      <VRow>
        <VCol>
          <VTextField
            v-model="acceptedCurrency.code"
            label="Accepted currency"
            disabled
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="returnedCurrency.code"
            label="Accepted currency"
            disabled
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VTextField
            v-model="rateNum"
            label="Rate"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol class="d-flex justify-center">
          <VBtn
            color="success"
            @click="updateRate"
          >
            Save
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
    <!-- -->
  </VCard>
</template>

