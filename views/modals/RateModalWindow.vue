<script setup>
import currencyService from '@/js/services/currencyService'
import rateService from '@/js/services/rateService'

const props = defineProps({
  rate: {
    type: Object,
    default: null,
  },
})

const emits = defineEmits(['closeModifyRateDialog', 'updateRateInList'])

const currencies = ref([])
const acceptedCurrency = ref(null)
const returnedCurrency = ref(null)
const rateNum = ref(null)

onMounted(() => {
  fillRateFields()
  setCurrencies()
})

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
          <VAutocomplete
            v-model="acceptedCurrency"
            label="Accepted currency"
            :items="currencies"
            return-object
            clearable
            item-title="code"
          />
        </VCol>
        <VCol>
          <VAutocomplete
            v-model="returnedCurrency"
            label="Returned currency"
            :items="currencies"
            return-object
            clearable
            item-title="code"
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

