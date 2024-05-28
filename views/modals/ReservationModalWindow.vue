<script setup>
import { operationTypes } from '@/js/consts/operationTypesConsts.js'
import { reservationStatuses } from '@/js/consts/reservationStatusesConsts.js'
import reservationService from '@/js/services/reservationService'
const props = defineProps({
  reservation: {
    type: Object,
    default: null,
  }
})

const emits = defineEmits(['closeReservationDialog', 'updateReservationInList'])

const reservationStatus = ref(null)
const reservationModel = ref(null)
onMounted(() => {
  reservationModel.value = props.reservation
  reservationStatus.value = props.reservation.status
})

function closeDialogWindow() {
    let closeObject = {
      id: props.reservation.id,
      state: true,
    }
    emits('closeReservationDialog', closeObject)
}

function updateReservationInList(currency) {
  emits('updateReservationInList', currency)
}

async function updateReservation() {
  let data = {
    contactId: reservationModel.value.contact.id,
    rateId: reservationModel.value.rate.id,
    operationId: reservationModel.value.operationType.id,
    statusId: reservationStatus.value.id,
    amount: reservationModel.value.amount
  }
  let response = await reservationService.updateReservation(reservationModel.value.id, data)
  updateReservationInList(response)
}

</script>

<template>
  <VCard>
    <div class="d-flex justify-end pa-5">
      <h2 class="mr-auto">
        Reservation editor
      </h2>

      <VBtn @click="closeDialogWindow">
        Close
      </VBtn>
    </div>

    <VContainer>
      <VRow>
        <VCol class="pa-5">
          <VSelect
            v-model="reservationStatus"
            label="Reservation status"
            :items="reservationStatuses"
            item-title="name"
            return-object
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol class="d-flex justify-center">
          <VBtn
            color="success"
            @click="updateReservation"
          >
            Save
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VCard>
</template>
