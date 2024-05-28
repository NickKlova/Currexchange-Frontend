import axios from 'axios'
import { backendEndpointConstants } from '@/js/consts/backendEndpointConsts'

function createTransaction(data) {
  return axios.post(backendEndpointConstants.transactionController.createTransaction, data)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error(error)
      throw error
    })
}

function getTransactions() {
  return axios.get(backendEndpointConstants.transactionController.getTransactions)
    .then(response => {
      return response.data
    })
}

export default {
  getTransactions,
  createTransaction,
}
