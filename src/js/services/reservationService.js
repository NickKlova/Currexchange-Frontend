import axios from 'axios'
import { backendEndpointConstants } from '@/js/consts/backendEndpointConsts'

function createReservation(data) {
  return axios.post(backendEndpointConstants.reservationController.createReservation, data)
}

function getReservations() {
  return axios.get(backendEndpointConstants.reservationController.getReservations)
    .then(response => {
      return response.data
    })
}

function deleteReservation(id) {
  return axios.delete(backendEndpointConstants.reservationController.deleteReservation(id))
    .then(response => {
      return response.data
    })
}

export default {
  getReservations,
  deleteReservation,
  createReservation,
}
