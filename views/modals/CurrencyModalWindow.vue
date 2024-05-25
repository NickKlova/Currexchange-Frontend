<script setup>
import { ref, onMounted } from 'vue'
import currencyService from '@/js/services/currencyService'
import { Vue3Snackbar, useSnackbar } from "vue3-snackbar"
import isVarEmpty from "@/js/helper"

const snackbar = useSnackbar()

const props = defineProps({
  currency: {
    type: Object,
    default: null,
  },
  currencies: {
    type: Array,
    default: null,
  }
})

const emits = defineEmits(['closeAddCurrencyDialog', 'pushCreatedCurrencyToList', 'updateCurrencyInList'])

const isModifiedState = ref(false)
const currenciesModel = ref([])

const currencyModel = ref({
  id: null,
  code: null,
  description: null,
  symbol: null,
})

onMounted(async () => {
  if(props.currency !== null) {
    setCurrenciesModifiedState()
  }
  if(props.currencies !== null) {
    await setCurrenciesModel()
  }
})

async function setCurrenciesModel() {
  await currencyService.getBankGovCurrencies()
    .then(govCurrencies => {
      currenciesModel.value = govCurrencies.filter(govItem => {
        return !props.currencies.some(currencyItem => currencyItem.code === govItem.code)
      })
    })
}

function setCurrenciesModifiedState() {
  isModifiedState.value = true
  currencyModel.value = props.currency
}

function closeDialogWindow() {
  if (!isModifiedState.value) {
    let closeObject = {
      id: "new",
      state: true,
    }
    emits('closeAddCurrencyDialog', closeObject)
  }
  else {
    let closeObject = {
      id: props.currency.id,
      state: true,
    }
    emits('closeAddCurrencyDialog', closeObject)
  }
}

function isAllFieldsFilled() {
  return !(isVarEmpty(currencyModel.value.code) ||
    isVarEmpty(currencyModel.value.description) ||
    isVarEmpty(currencyModel.value.symbol))
}

async function saveOrUpdateCurrency() {
  if (!isAllFieldsFilled()) {
    snackbar.add({
      type: 'error',
      text: 'Fill all fields!',
    })

    return
  }


  if(isModifiedState.value) {
    let data = {
      code: currencyModel.value.code,
      description: currencyModel.value.description,
      symbol: currencyModel.value.symbol,
      id: currencyModel.value.id
    }

    return await currencyService.updateCurrency(currencyModel.value.id, data)
      .then(modifiedCurrency => {
        updateCurrencyInList(modifiedCurrency)
      })
  }

  let data = {
    code: currencyModel.value.code,
    description: currencyModel.value.description,
    symbol: currencyModel.value.symbol,
    bankGovId: currencyModel.value.id
  }

  await currencyService.createCurrency(data)
    .then(response => {
      pushCreatedCurrencyToList(response)
    })
}

function updateCurrencyInList(currency) {
  emits('updateCurrencyInList', currency)
}

function pushCreatedCurrencyToList(currency) {
  emits('pushCreatedCurrencyToList', currency)
}
</script>

<template>
  <VCard>
    <!-- Close button in header -->
    <div class="d-flex justify-end pa-5">
      <h2 class="mr-auto">
        Currency editor
      </h2>

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
            v-model="currencyModel"
            :items="currenciesModel"
            label="Currency"
            return-object
            item-title="code"
            clearable
            :disabled="isModifiedState"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="currencyModel.description"
            label="Description"
          />
        </VCol>
      </VRow>
      <VRow cols="3">
        <VCol />
        <VCol>
          <VTextField
            v-model="currencyModel.symbol"
            label="Symbol"
          />
        </VCol>
        <VCol />
      </VRow>
      <VRow>
        <VCol class="d-flex justify-center">
          <VBtn
            color="success"
            @click="saveOrUpdateCurrency"
          >
            Save
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
    <!-- -->
  </VCard>

  <Vue3Snackbar
    bottom
    right
    duration="500"
  />
</template>
