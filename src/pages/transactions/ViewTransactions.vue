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
              {{ transaction.amount }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ transaction.reservation == null ? "none" : transaction.reservation.id }}
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
