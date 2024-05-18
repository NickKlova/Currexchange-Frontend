<script setup>
import reservationService from '@/js/services/reservationService'

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
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Amount
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Contact
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
              {{ reservation.rate.baseCurrency.code }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ reservation.rate.targetCurrency.code }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ reservation.rate.sellRate }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ reservation.amount }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ reservation.contact.fullName }}
            </VListItemTitle>
          </VCol>
          <VCol
            cols="1"
            class="d-flex justify-end"
          >
            <!-- Delete currency button -->
            <VBtn
              color="secondary"
              variant="text"
              @click="deleteReservation(reservation.id)"
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
