<script setup>
import { ref, onMounted } from 'vue'
import CurrencyModalWindow from '../../../views/modals/CurrencyModalWindow.vue'
import currencyService from '@/js/services/currencyService'
import { useSnackbar, Vue3Snackbar } from 'vue3-snackbar'

const snackbar = useSnackbar()

const actualCurrencies = ref([])
const isLoading = ref(false)

//region dialog

const isShownCurrencyDialog = ref({})

const closeCurrencyDialog = value => {
  isShownCurrencyDialog.value[value.id] = !value.state
}

const updateCurrencyInList = updatedCurrency => {
  let index = actualCurrencies.value.findIndex(currency => currency.id === updatedCurrency.id)
  if(index !== -1) {
    let foundCurrency = actualCurrencies.value[index]
    foundCurrency.code = updatedCurrency.code
    foundCurrency.description = updatedCurrency.description
    foundCurrency.symbol = updatedCurrency.symbol

    let closeObject = {
      id: updatedCurrency.id,
      state: true,
    }
    closeCurrencyDialog(closeObject)
    snackbar.add({
      type: 'success',
      text: 'Currency updated successfully!',
    })
  }
}

const pushCreatedCurrencyToList = createdCurrency => {
  let currency = {
    id: createdCurrency.id,
    code: createdCurrency.code,
    description: createdCurrency.description,
    symbol: createdCurrency.symbol,
  }

  actualCurrencies.value.push(currency)
  let closeObject = {
    id: "new",
    state: true,
  }
  closeCurrencyDialog(closeObject)
  snackbar.add({
    type: 'success',
    text: 'Currency created successfully!',
  })
}

//endregion

onMounted(async () => {
  await setActualCurrencies()
  isShownCurrencyDialog.value["new"] = false
})

//region value setters

async function setActualCurrencies() {
  actualCurrencies.value = await currencyService.getCurrencies()
}

//endregion

async function deleteCurrency(id) {
  try {
    //snackbar.clear()
    isLoading.value = true
    let deletedCurrency = await currencyService.deleteCurrency(id)
    let deletedCurrencyIndex = actualCurrencies.value.findIndex(item => item.id === deletedCurrency.id)
    if (deletedCurrencyIndex !== -1) {
      actualCurrencies.value.splice(deletedCurrencyIndex, 1)
    }
    snackbar.add({
      type: 'success',
      text: 'Currency deleted successfully!',
    })
  } catch (error) {
    snackbar.add({
      type: 'error',
      text: error.message,
    })
  } finally {
    isLoading.value = false
  }

}
</script>

<template>
  <VCard>
    <!-- Header -->
    <VCardTitle>
      <div class="d-flex pa-2 align-center justify-space-between w-100">
        <div class="text-center flex-grow-1">
          Currency panel
        </div>
        <VBtn @click="isShownCurrencyDialog['new'] = true" class="ml-auto">
          <VIcon icon="ri-add-line" />
          <span>Add currency</span>
        </VBtn>

        <VDialog v-model="isShownCurrencyDialog['new']">
          <CurrencyModalWindow
            :currencies="actualCurrencies"
            @push-created-currency-to-list="pushCreatedCurrencyToList"
            @close-add-currency-dialog="closeCurrencyDialog"
          />
        </VDialog>
      </div>
    </VCardTitle>
    <!--  -->

    <!-- List of currencies -->
    <VList>
      <!-- List title -->
      <VListItem class="bg-var-theme-background">
        <VRow>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Code
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Description
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Symbol
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
      <!-- -->

      <!-- List content -->
      <VListItem v-if="actualCurrencies.length === 0">
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
        v-if="actualCurrencies.length > 0"
        v-for="currency in actualCurrencies"
        :key="currency.id"
      >
        <VRow>
          <VCol>
            <VListItemTitle>
              {{ currency.code }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ currency.description }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ currency.symbol }}
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
              @click="isShownCurrencyDialog[currency.id] = true"
            >
              <VIcon icon="ri-settings-4-fill" />
            </VBtn>

            <VDialog v-model="isShownCurrencyDialog[currency.id]">
              <CurrencyModalWindow
                :currency="currency"
                @update-currency-in-list="updateCurrencyInList"
                @close-add-currency-dialog="closeCurrencyDialog"
              />
            </VDialog>
            <!-- -->

            <!-- Delete currency button -->
            <VBtn
              color="secondary"
              variant="text"
              @click="deleteCurrency(currency.id)"
            >
              <VIcon icon="ri-delete-bin-5-line" />
            </VBtn>
            <!-- -->
          </VCol>
        </VRow>
      </VListItem>
      <!-- -->
    </VList>
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
  />
</template>
