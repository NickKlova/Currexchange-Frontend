<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CurrencyModalWindow from '../../../views/modals/CurrencyModalWindow.vue'
import { backendEndpointConstants } from '@/pages/js/consts/backendEndpointConsts'

export default {
  components: { CurrencyModalWindow },
  setup() {
    const actualCurrencies = ref([])
    const isShownCurrencyDialog = ref({})

    onMounted(() => {
      setCurrenciesProps()
      isShownCurrencyDialog.value["new"] = false
    })

    function setCurrenciesProps() {
      axios.get(backendEndpointConstants.currencyController.getCurrencies)
        .then(response => {
          actualCurrencies.value = response.data
        })
        .catch(error => {
          console.error('Error when receiving currency:', error)
        })
    }

    function deleteCurrency(id) {
      let query = backendEndpointConstants.currencyController.deleteCurrency + id
      axios.delete(query)
        .then(response => {
          let currency = actualCurrencies.value.findIndex(currency => currency.id === id)
          if (currency !== -1) {
            actualCurrencies.value.splice(currency, 1)
          }
        })
        .catch(error => {
          console.error('Error when deleting currency:', error)
        })
    }

    const closeCurrencyDialog = value => {
      isShownCurrencyDialog.value[value.id] = !value.state
    }

    const updateCurrencyInList = updatedCurrency => {
      let index = actualCurrencies.value.findIndex(currency => currency.id === updatedCurrency.id)
      if(index !== -1) {
        actualCurrencies.value[index].code = updatedCurrency.code

        //actualCurrencies[index].description = updatedCurrency.description
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

        //description: createdCurrency.description,
      }

      actualCurrencies.value.push(currency)

      let closeObject = {
        id: "new",
        state: true,
      }
      closeCurrencyDialog(closeObject)
    }

    return {
      actualCurrencies,
      isShownCurrencyDialog,
      closeCurrencyDialog,
      pushCreatedCurrencyToList,
      updateCurrencyInList,
      deleteCurrency,
    }
  },
}
</script>

<template>
  <VCard>
    <!-- Header -->
    <div class="d-flex justify-end pa-5">
      <VBtn @click="isShownCurrencyDialog['new']=true">
        <VIcon icon="ri-add-line" />
        <span>Add currency</span>
      </VBtn>

      <VDialog v-model="isShownCurrencyDialog['new']">
        <CurrencyModalWindow
          @push-created-currency-to-list="pushCreatedCurrencyToList"
          @close-add-currency-dialog="closeCurrencyDialog"
        />
      </VDialog>
    </div>
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
              {{ currency.id }}
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
