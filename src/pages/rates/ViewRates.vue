<script setup>
import rateService from '@/js/services/rateService'

const rates = ref([])

onMounted(() => {
  setRates()
})

function setRates() {
  rateService.getRates()
    .then(data => {
      rates.value = data
    })
}
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex justify-center pa-5">
      Rate panel
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
              Description
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
        </VRow>
      </VListItem>

      <VListItem v-if="rates.length === 0">
        <VRow>
          <VCol
            cols="12"
            class="d-flex justify-center pa-15"
          >
            <VIcon
              icon="ri-database-2-fill"
              class="mr-3"
            />
            No data
          </VCol>
        </VRow>
      </VListItem>

      <VListItem
        v-if="rates.length > 0"
        v-for="rate in rates"
        :key="rate.id"
      >
        <VRow>
          <VCol>
            <VListItemTitle>
              {{ rate.currency.code }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ rate.currency.description }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ rate.buyRate }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ rate.sellRate }}
            </VListItemTitle>
          </VCol>
        </VRow>
      </VListItem>
    </VList>
  </VCard>
</template>
