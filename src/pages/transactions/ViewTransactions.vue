<script setup>
import transactionService from '@/js/services/transactionService'

const transactions = ref([])

onMounted(() => {
  setTransactions()
})

function setTransactions() {
  transactionService.getTransactions()
    .then(data => {
      transactions.value = data
    })
}
</script>

<template>
  <VCard>
    <VCardTitle>
      <h1 class="pa-5">Transaction panel</h1>
    </VCardTitle>
    <VList>
      <VListItem class="bg-var-theme-background">
        <VRow>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Accepted currency
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Returned currency
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Rate
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Amount
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Contact
            </VListItemTitle>
          </VCol>
          <VCol
            cols="1"
            class="d-flex justify-center"
          >
            <VListItemTitle class="font-weight-bold">
              Actions
            </VListItemTitle>
          </VCol>
        </VRow>
      </VListItem>

      <VListItem
        v-for="transaction in transactions"
        :key="transaction.id"
      >
        <VRow>
          <VCol>
            <VListItemTitle>
              {{ transaction.rate.baseCurrency.code }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ transaction.rate.targetCurrency.code }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ transaction.rate.sellRate }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ transaction.amount }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ transaction.contact.fullName }}
            </VListItemTitle>
          </VCol>
          <VCol
            cols="1"
            class="d-flex justify-end"
          >

          </VCol>
        </VRow>
      </VListItem>
    </VList>
  </VCard>
</template>
