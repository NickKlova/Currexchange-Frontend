<script setup>
import rateService from '@/js/services/rateService'
import RateModalWindow from '../../../views/modals/RateModalWindow.vue'

const rates = ref([])
const isShownRateDialog = ref({})

onMounted(() => {
  setRates()
})

const closeRateDialog = value => {
  isShownRateDialog.value[value.id] = !value.state
}

const updateRateInList = updatedRate => {
  let index = rates.value.findIndex(rate => rate.id === updatedRate.id)
  if(index !== -1) {
    rates.value[index] = updatedRate

    let closeObject = {
      id: updatedRate.id,
      state: true,
    }
    closeRateDialog(closeObject)
  }
}

function setRates() {
  rateService.getRates()
    .then(data => {
      rates.value = data
      console.log(rates.value)
    })
}

function deleteRate(id) {
  rateService.deleteRate(id)
    .then(deletedRate => {
      let rateIndex = rates.value.findIndex(item => item.id === deletedRate.id)
      if (rateIndex !== -1) {
        rates.value.splice(rateIndex, 1)
      }
    })
}
</script>

<template>
  <VCard>
    <VCardTitle>
      <h1 class="pa-5">Rate panel</h1>
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
        v-for="rate in rates"
        :key="rate.id"
      >
        <VRow>
          <VCol>
            <VListItemTitle>
              {{ rate.baseCurrency.code }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ rate.targetCurrency.code }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ rate.sellRate }}
            </VListItemTitle>
          </VCol>
          <VCol
            cols="1"
            class="d-flex justify-end"
          >
            <!-- Update currency button -->
            <VBtn
              color="secondary"
              variant="text"
              @click="isShownRateDialog[rate.id] = true"
            >
              <VIcon icon="ri-settings-4-fill" />
            </VBtn>

            <VDialog v-model="isShownRateDialog[rate.id]">
              <RateModalWindow
                :rate="rate"
                @updateRateInList="updateRateInList"
                @closeModifyRateDialog="closeRateDialog"
              />
            </VDialog>
            <!-- -->

            <!-- Delete currency button -->
            <VBtn
              color="secondary"
              variant="text"
              @click="deleteRate(rate.id)"
            >
              <VIcon icon="ri-delete-bin-5-line" />
            </VBtn>
            <!-- -->
          </VCol>
        </VRow>
      </VListItem>
    </VList>
  </VCard>
</template>
