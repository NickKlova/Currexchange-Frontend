<script setup>
import fundService from '@/js/services/fundService'
import FundModalWindow from '../../../views/modals/FundModalWindow.vue'
import { Vue3Snackbar, useSnackbar } from "vue3-snackbar"

const snackbar = useSnackbar()

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

    snackbar.add({
      type: "success",
      text: "Fund is updated successfully!"
    })
  }
}
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex justify-center pa-5">
      Fund panel
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
              Amount
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

      <VListItem v-if="funds.length === 0">
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
        v-if="funds.length > 0"
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

  <Vue3Snackbar
    bottom
    right
    duration="2000"
  ></Vue3Snackbar>
</template>
