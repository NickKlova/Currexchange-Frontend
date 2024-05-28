<script setup>
import { onMounted, ref, watch } from 'vue'
import currencyService from '@/js/services/currencyService'
import { validationRules } from '@/js/validationRules'
import { useSnackbar, Vue3Snackbar } from 'vue3-snackbar'

const snackbar = useSnackbar()

//region form fields

const isLoading = ref(false)
const isFormValid = ref(false)
const form = ref(null)

//endregion

//region currency fields

const currencyModel = ref(null)
const currencyDescription = ref(null)
const currencySymbol = ref(null)

//endregion

//region props: currency, currencies

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

//endregion

//region emits

const emits = defineEmits(['closeAddCurrencyDialog', 'pushCreatedCurrencyToList', 'updateCurrencyInList'])

function updateCurrencyInList(currency) {
  emits('updateCurrencyInList', currency)
}

function pushCreatedCurrencyToList(currency) {
  emits('pushCreatedCurrencyToList', currency)
}
//endregion

//region dialog functions

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

//endregion

const isModifiedState = ref(false)
const currenciesModel = ref([])


onMounted(async () => {
  if(props.currency !== null) {
    setCurrenciesModifiedState()
  }
  if(props.currencies !== null) {
    await setCurrenciesModel()
  }
})

//region watchers

watch(currencyModel, (newCurrencyValue) => {
  if(!newCurrencyValue) {
    currencyDescription.value = null
    currencySymbol.value = null
    return
  }
  currencyDescription.value = currencyModel.value.description
  currencySymbol.value = currencyModel.value.symbol
})

//endregion

//region value setters

async function setCurrenciesModel() {
  let data = await currencyService.getBankGovCurrencies()
  currenciesModel.value = data.filter(govItem => {
    return !props.currencies.some(currencyItem => currencyItem.code === govItem.code)
  })
}

function setCurrenciesModifiedState() {
  isModifiedState.value = true
  currencyModel.value = props.currency
}

//endregion

//region validation rules

const currencyValidationRules = computed(() => {
  let model = currencyModel.value
  let rules = []

  if(!isModifiedState.value) {
    rules.push(validationRules.isFieldRequired(model))
  }
  return rules
})

const descriptionValidationRules = computed(() => {
  let model = currencyDescription.value
  let rules = []

  rules.push(validationRules.isFieldRequired(model))
  return rules
})

const symbolValidationRules = computed(() => {
  let model = currencySymbol.value
  let rules = []

  const regex = /^[^a-zA-Z0-9]$/;
  let isModelHasOneSymbol = regex.test(model)
  rules.push(isModelHasOneSymbol || 'Must contains only 1 symbol')
  return rules
})

//endregion

//region save or update currency

async function saveOrUpdateCurrency() {
  if(!isFormValid.value) {
    form.value.validate()
    return
  }

  let isOperationSuccess = false
  let data = null
  try {
    isLoading.value = true
    isModifiedState.value ? data = await updateCurrency() : data = await saveCurrency()
    isOperationSuccess = true
  } catch (error) {
    snackbar.add({
      type: 'error',
      text: error.message,
    })
  } finally {
    isLoading.value = false
    if (isOperationSuccess) {
      isModifiedState.value ? updateCurrencyInList(data) : pushCreatedCurrencyToList(data)
    }
  }

}

async function saveCurrency() {
  let body = {
    code: currencyModel.value.code,
    description: currencyDescription.value,
    symbol: currencySymbol.value,
    bankGovId: currencyModel.value.id
  }

  return currencyService.createCurrency(body)
}

async function updateCurrency() {
  let body = {
    code: currencyModel.value.code,
    description: currencyDescription.value,
    symbol: currencySymbol.value,
    id: currencyModel.value.id
  }

  return currencyService.updateCurrency(currencyModel.value.id, body)
}

//endregion
</script>

<template>
  <VCard>
    <!-- Close button in header -->
    <div class="d-flex justify-end pa-5">
      <h3 class="mr-auto font-weight-regular">
        Currency editor
      </h3>

      <VBtn @click="closeDialogWindow">
        Close
      </VBtn>
    </div>
    <!-- -->

    <!-- Edit container -->
    <VContainer>
      <VForm
        v-model="isFormValid"
        ref="form"
      >
          <VRow>
            <VCol>
              <VAutocomplete
                v-model="currencyModel"
                :items="currenciesModel"
                label="Currency"
                return-object
                item-title="code"
                :disabled="isModifiedState"
                :rules="currencyValidationRules"
                clearable
              />
            </VCol>
            <VCol>
              <VTextField
                v-model="currencyDescription"
                label="Description"
                :rules="descriptionValidationRules"
              />
            </VCol>
          </VRow>
          <VRow cols="3">
            <VCol />
            <VCol>
              <VTextField
                v-model="currencySymbol"
                label="Symbol"
                :rules="symbolValidationRules"
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
      </VForm>
    </VContainer>
    <!-- -->
  </VCard>

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
    duration="2000"
  />
</template>
