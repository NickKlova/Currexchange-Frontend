<script setup>
import reservationService from '@/js/services/reservationService'
import CurrencyModalWindow from '../../../views/modals/CurrencyModalWindow.vue'
import { ref } from 'vue'
import ReservationModalWindow from '../../../views/modals/ReservationModalWindow.vue'

const isShownReservationDialog = ref({})

const closeReservationDialog = value => {
  isShownReservationDialog.value[value.id] = !value.state
}

const updateReservationInList = updatedReservation => {
  let index = reservations.value.findIndex(reservation => reservation.id === updatedReservation.id)
  if(index !== -1) {
    reservations.value[index].status = updatedReservation.status

    let closeObject = {
      id: updatedReservation.id,
      state: true,
    }
    closeReservationDialog(closeObject)
  }
}

const reservations = ref([])

onMounted(() => {
  setReservations()
})

function setReservations() {
  reservationService.getReservations()
    .then(data => {
      reservations.value = data
    })
}

function deleteReservation(id) {
  reservationService.deleteReservation(id)
    .then(deletedReservation => {
      let reservationIndex = reservations.value.findIndex(item => item.id === deletedReservation.id)
      if (reservationIndex !== -1) {
        reservations.value.splice(reservationIndex, 1)
      }
    })
}

function getColor(reservation) {
  if (reservation.status.id === '12345678-9abc-def0-1234-56789abcdef0') {
    return 'error'
  }
  if (reservation.status.id === '8e4f2c7d-91b3-4a5f-9b6d-3e7a8b9c1d0e') {
    return 'success'
  }
  if (reservation.status.id === 'a1b2c3d4-e5f6-7890-abcd-ef1234567890') {
    return 'secondary'
  }
  return 'primary'
}
</script>

<template>
  <VCard>
    <VCardTitle>
      <h1 class="pa-5">Reservation panel</h1>
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
              Operation type
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Rate
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Amount
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Returned amount
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Contact
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Reservation status
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Date
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
        v-for="reservation in reservations"
        :key="reservation.id"
      >
        <VRow>
          <VCol>
            <VListItemTitle>
              {{ reservation.rate.currency.code }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ reservation.operationType.name }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ reservation.operationType.id === "e3b0c442-98fc-1c14-9afd-2fb77c6076f6" ? reservation.rate.buyRate : reservation.rate.sellRate }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ reservation.amount }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ reservation.operationType.id === "e3b0c442-98fc-1c14-9afd-2fb77c6076f6" ? Math.round((reservation.rate.buyRate * reservation.amount)*100)/100 : Math.round((reservation.rate.sellRate * reservation.amount)*100)/100 }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ reservation.contact.fullName }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              <VChip :color="getColor(reservation)">
                {{ reservation.status.name }}
              </VChip>
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
                {{ new Date(reservation.createdOn).toLocaleDateString() + " " + new Date(reservation.createdOn).toLocaleTimeString() }}
            </VListItemTitle>
          </VCol>
          <VCol
            cols="1"
            class="d-flex justify-center"
          >
            <!-- Update reservation button -->
            <VBtn
              color="secondary"
              variant="text"
              @click="isShownReservationDialog[reservation.id] = true"
            >
              <VIcon icon="ri-settings-4-fill" />
            </VBtn>

            <VDialog v-model="isShownReservationDialog[reservation.id]">
              <ReservationModalWindow
                :reservation="reservation"
                @update-reservation-in-list="updateReservationInList"
                @close-reservation-dialog="closeReservationDialog"
              />
            </VDialog>
            <!-- -->
          </VCol>
        </VRow>
      </VListItem>
    </VList>
  </VCard>
</template>
