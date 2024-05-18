import axios from 'axios'
import { backendEndpointConstants } from '@/js/consts/backendEndpointConsts'

function createTransaction(data) {
  return axios.post(backendEndpointConstants.transactionController.createTransaction, data)
}

export default {
  createTransaction,
}
