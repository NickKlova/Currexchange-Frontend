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
    <VCardTitle class="d-flex justify-center pa-5">
      Transaction panel
    </VCardTitle>
    <VList>
      <VListItem class="bg-var-theme-background">
        <VRow>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Currency
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Operation
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Buy rate
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Sell rate
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Amount
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Reservation
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Date
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
              {{ transaction.rateLog.currency.code }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ transaction.operationType.name }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ transaction.rateLog.buyRate }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ transaction.rateLog.sellRate }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ transaction.amount + transaction.rateLog.currency.symbol }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ transaction.reservation == null ? "none" : transaction.reservation.id }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ new Date(transaction.createdOn).toLocaleDateString() + " " + new Date(transaction.createdOn).toLocaleTimeString() }}
            </VListItemTitle>
          </VCol>
        </VRow>
      </VListItem>
    </VList>
  </VCard>
</template>
