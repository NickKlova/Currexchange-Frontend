<script setup>
import fundService from '@/js/services/fundService'
import FundModalWindow from '../../../views/modals/FundModalWindow.vue'

const funds = ref([])
const isShownFundDialog = ref({})

onMounted(() => {
  setFunds()
})

function setFunds() {
  fundService.getFunds().then(data=> {
    funds.value = data
  })
}

const closeFundDialog = value => {
  isShownFundDialog.value[value.id] = !value.state
}

const updateFundInList = updatedFund => {
  let index = funds.value.findIndex(fund => fund.id === updatedFund.id)
  if(index !== -1) {
    funds.value[index] = updatedFund

    let closeObject = {
      id: updatedFund.id,
      state: true,
    }
    closeFundDialog(closeObject)
  }
}
</script>

<template>
  <VCard>
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
              Fund
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
        v-for="fund in funds"
        :key="fund.id"
      >
        <VRow>
          <VCol>
            <VListItemTitle>
              {{ fund.currency.code }}
            </VListItemTitle>
          </VCol>
          <VCol>
            {{ fund.currency.description }}
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ fund.amount }}
            </VListItemTitle>
          </VCol>
          <VCol
            cols="1"
            class="d-flex justify-center"
          >
            <!-- Update currency button -->
            <VBtn
              color="secondary"
              variant="text"
              @click="isShownFundDialog[fund.id] = true"
            >
              <VIcon icon="ri-settings-4-fill" />
            </VBtn>

            <VDialog v-model="isShownFundDialog[fund.id]">
              <FundModalWindow
                :fund="fund"
                @updateFundInList="updateFundInList"
                @closeModifyFundDialog="closeFundDialog"
              />
            </VDialog>
            <!-- -->
          </VCol>
        </VRow>
      </VListItem>
    </VList>
  </VCard>
</template>
