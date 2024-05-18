<script setup>
import { ref, onMounted } from 'vue'
import currencyService from '@/js/services/currencyService'

const props = defineProps({
  currency: {
    type: Object,
    default: null,
  },
})

const emits = defineEmits(['closeAddCurrencyDialog', 'pushCreatedCurrencyToList', 'updateCurrencyInList'])

const isModifiedState = ref(false)
const currencyCode = ref('')
const currencyDescription = ref('')

onMounted(() => {
  if(props.currency !== null) {
    setCurrenciesModifiedState()
  }
})

function setCurrenciesModifiedState() {
  isModifiedState.value = true
  currencyCode.value = props.currency.code
  currencyDescription.value = props.currency.description
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

function saveOrUpdateCurrency() {
  let data = {
    code: currencyCode.value,
  }

  if(isModifiedState.value) {
    return currencyService.updateCurrency(props.currency.id, data)
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
            v-model="currencyCode"
            label="Code"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="currencyDescription"
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
