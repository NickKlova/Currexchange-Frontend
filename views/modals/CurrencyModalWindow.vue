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
})

const emits = defineEmits(['closeAddCurrencyDialog', 'pushCreatedCurrencyToList', 'updateCurrencyInList'])

const currencyModel = ref({
  id: null,
  code: null,
  description: null,
  symbol: null,
})


const isModifiedState = ref(false)

onMounted(() => {
  if(props.currency !== null) {
    setCurrenciesModifiedState()
  }
})

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

function isAllFieldsFill() {
  return !(isVarEmpty(currencyModel.value.code) ||
    isVarEmpty(currencyModel.value.description) ||
    isVarEmpty(currencyModel.value.symbol))
}

function saveOrUpdateCurrency() {
  let data = {
    code: currencyModel.value.code,
    description: currencyModel.value.description,
    symbol: currencyModel.value.symbol,
  }

  if (!isAllFieldsFill()) {
    let errorObj = {
      type: 'error',
      text: 'Fill all fields',
    }
    snackbar.add(errorObj)

    return
  }

  if(isModifiedState.value) {
    return currencyService.updateCurrency(currencyModel.value.id, data)
      .then(modifiedCurrency => {
        updateCurrencyInList(modifiedCurrency)
      })
  }
  currencyService.createCurrency(data)
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
  <Vue3Snackbar
    bottom
    right
  ></Vue3Snackbar>
  <VCard>
    <!-- Close button in header -->
    <div class="d-flex justify-end pa-5">
      <h1 class="mr-auto">
        Currency editor
      </h1>
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
            v-model="currencyModel.code"
            label="Code"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="currencyModel.symbol"
            label="Symbol"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VTextField
            v-model="currencyModel.description"
            label="Description"
          />
        </VCol>
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
</template>
