<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { backendEndpointConstants } from '@/pages/js/consts/backendEndpointConsts'

export default {
  emits: ['closeAddCurrencyDialog', 'pushCreatedCurrencyToList', 'updateCurrencyInList'],
  props: {
    currency: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const isModifiedState = ref(false)
    const currencyCode = ref('')
    const currencyDescription = ref('')

    onMounted(() => {
      if(props.currency !== null) {
        setCurrenciesModifiedState()
      }
    })

    function setCurrenciesModifiedState() {
      isModifiedState.value = true
      currencyCode.value = props.currency.code
      currencyDescription.value = props.currency.description
    }

    function closeDialogWindow() {
      if (!isModifiedState.value) {
        let closeObject = {
          id: "new",
          state: true
        }
        emit('closeAddCurrencyDialog', closeObject)
      }
      else {
        let closeObject = {
          id: props.currency.id,
          state: true
        }
        emit('closeAddCurrencyDialog', closeObject)
      }

    }

    function saveOrUpdateCurrency() {
      if(isModifiedState.value) {
        let data = {
          code: currencyCode.value,
          //description: currencyDescription.value,
        }
        axios.patch(backendEndpointConstants.currencyController.updateCurrency+props.currency.id, data)
          .then(response => {
            let modifiedCurrency = response.data
            updateCurrencyInList(modifiedCurrency)
          })
          .catch(error => {
            console.error('Error when adding currency:', error)
          })
        return;
      }
      let data = {
        code: currencyCode.value,
        //description: currencyDescription.value,
      }
      axios.post(backendEndpointConstants.currencyController.createCurrency, data)
        .then(response => {
          let createdCurrency = response.data
          pushCreatedCurrencyToList(createdCurrency)
        })
        .catch(error => {
          console.error('Error when adding currency:', error)
        })
    }

    function updateCurrencyInList(currency) {
      emit('updateCurrencyInList', currency)
    }

    function pushCreatedCurrencyToList(currency) {
      emit('pushCreatedCurrencyToList', currency)
    }

    return {
      currencyCode,
      currencyDescription,
      saveOrUpdateCurrency,
      closeDialogWindow,
    }
  },
}
</script>

<template>
  <VCard>
    <!-- Close button in header -->
    <div class="d-flex justify-end pa-5">
      <VBtn @click="closeDialogWindow">
        Close
      </VBtn>
    </div>
    <!-- -->

    <!-- Edit container -->
    <VContainer>
      <VRow>
        <VCol>
          <VTextField
            v-model="currencyCode"
            label="Code"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="currencyDescription"
            label="Description"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol class="d-flex justify-center">
          <VBtn
            color="success"
            @click="saveOrUpdateCurrency"
          >
            Save
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
    <!-- -->
  </VCard>
</template>
