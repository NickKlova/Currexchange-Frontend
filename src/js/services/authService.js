import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const API_URL = 'http://localhost:5034/api/user/login' // замените на ваш API URL

class AuthService {
  login(user) {
    return axios
      .post(`${API_URL}?login=${user.username}&password=${user.password}`)
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data
      })
  }

  logout() {
    localStorage.removeItem('user')
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'))
  }

  getRole() {
    const user = this.getCurrentUser()
    if (user && user.accessToken) {
      const decodedToken = jwtDecode(user.accessToken)

      return user.role
    }

    return null
  }
}

export default new AuthService()
