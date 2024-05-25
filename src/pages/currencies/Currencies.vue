<script setup>
import { ref, onMounted } from 'vue'
import CurrencyModalWindow from '../../../views/modals/CurrencyModalWindow.vue'
import currencyService from '@/js/services/currencyService'

const actualCurrencies = ref([])
const isShownCurrencyDialog = ref({})

onMounted(() => {
  setActualCurrencies()
  isShownCurrencyDialog.value["new"] = false
})

function setActualCurrencies() {
  currencyService.getCurrencies()
    .then(data => {
      actualCurrencies.value = data
    })
}

function deleteCurrency(id) {
  currencyService.deleteCurrency(id)
    .then(deletedCurrency => {
      let currency = actualCurrencies.value.findIndex(item => item.id === deletedCurrency.id)
      if (currency !== -1) {
        actualCurrencies.value.splice(currency, 1)
      }
    })
}

const closeCurrencyDialog = value => {
  isShownCurrencyDialog.value[value.id] = !value.state
}

const updateCurrencyInList = updatedCurrency => {
  let index = actualCurrencies.value.findIndex(currency => currency.id === updatedCurrency.id)
  if(index !== -1) {
    actualCurrencies.value[index].code = updatedCurrency.code

    let closeObject = {
      id: updatedCurrency.id,
      state: true,
    }
    closeCurrencyDialog(closeObject)
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
}
</script>

<template>
  <VCard>
    <!-- Header -->
    <VCardTitle>
      <div class="d-flex justify-end pa-5">
        <h1 class="mr-auto">
          Currency panel
        </h1>
        <VBtn @click="isShownCurrencyDialog['new']=true">
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
      <VListItem
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
            class="d-flex justify-end"
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
</template>
