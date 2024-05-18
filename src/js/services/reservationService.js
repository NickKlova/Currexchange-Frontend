import axios from 'axios'
import { backendEndpointConstants } from '@/js/consts/backendEndpointConsts'

function createReservation(data) {
  return axios.post(backendEndpointConstants.reservationController.createReservation, data)
}

export default {
  createReservation,
}
