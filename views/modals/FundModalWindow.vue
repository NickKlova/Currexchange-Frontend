<script setup>
import fundService from '@/js/services/fundService'

const props = defineProps({
  fund: {
    type: Object,
    default: null,
  },
})

const emits = defineEmits(['closeModifyFundDialog', 'updateFundInList'])

const currency = ref(null)
const fundAmount = ref(null)

onMounted(() => {
  currency.value = props.fund.currency
  fundAmount.value = props.fund.amount
})

function updateFund() {
  let data = {
    currencyId: currency.value.id,
    amount: fundAmount.value
  }
  fundService.updateRate(props.fund.id, data)
    .then((fund) => {
      updateFundInList(fund)
    })
}

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
            v-model="currency"
            label="Accepted currency"
            return-object
            disabled
            item-title="code"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="fundAmount"
            label="Fund"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol class="d-flex justify-center">
          <VBtn
            color="success"
            @click="updateFund"
          >
            Save
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
    <!-- -->
  </VCard>
</template>
