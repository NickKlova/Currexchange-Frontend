<script setup>
import fundService from '@/js/services/fundService'
import { Vue3Snackbar, useSnackbar } from "vue3-snackbar"
import { ref } from 'vue'

//region props

const props = defineProps({
  fund: {
    type: Object,
    default: null,
  },
})

//endregion

//region emits

const emits = defineEmits(['closeModifyFundDialog', 'updateFundInList'])

function updateFundInList(fund) {
  emits('updateFundInList', fund)
}

function closeDialogWindow() {
  let closeObject = {
    id: props.fund.id,
    state: true,
  }
  emits('closeModifyFundDialog', closeObject)
}

//endregion

//region form fields

const isLoading = ref(null)
const isFormValid = ref(false)
const form = ref(null)

//endregion

const snackbar = useSnackbar()

//region fields

const currency = ref(null)
const fundAmount = ref(null)

//endregion

onMounted(() => {
  currency.value = props.fund.currency
  fundAmount.value = props.fund.amount
})

async function updateFund() {
  if(!isFormValid.value) {
    form.value.validate()
    return
  }
  let body = {
    currencyId: currency.value.id,
    amount: fundAmount.value,
  }
  try {
    isLoading.value = true
    let data = await fundService.updateFund(props.fund.id, body)
    updateFundInList(data)
  } catch (error) {
    snackbar.add({
      type: "error",
      text: error.message,
    })
  } finally {
    isLoading.value = false
  }
}

//region validation rules

const fundValidationRules = computed(() => {
  let model = fundAmount.value
  let rules = []

  let isPositiveAmount = typeof parseFloat(model) === 'number' && !isNaN(parseFloat(model)) && parseFloat(model) > 0
  rules.push((isPositiveAmount) || 'Amount must be a positive number')
  return rules
})

//endregion
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
      <VForm
        v-model="isFormValid"
        ref="form"
      >
        <VRow>
          <VCol>
            <VAutocomplete
              v-model="currency"
              label="Code"
              return-object
              disabled
              item-title="code"
            />
          </VCol>
          <VCol>
            <VAutocomplete
              v-model="currency"
              label="Description"
              return-object
              disabled
              item-title="description"
            />
          </VCol>
          <VCol>
            <VTextField
              v-model="fundAmount"
              label="Fund"
              :rules="fundValidationRules"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol class="d-flex justify-center">
            <VBtn
              :disabled="!isFormValid"
              color="success"
              @click="updateFund"
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
  ></Vue3Snackbar>
</template>
