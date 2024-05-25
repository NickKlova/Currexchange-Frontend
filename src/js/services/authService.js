import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const API_URL = 'http://localhost:5034/api/user/login' // замените на ваш API URL

class AuthService {
  login(user) {
    return axios
      .post(`${API_URL}?login=${user.username}&password=${user.password}`)
      .then(response => {
        if (response.data.token) {
          let obj = {
            role: response.data.user.role.name,
            token: response.data.token,
          }
          console.log(JSON.stringify(obj))
          localStorage.setItem('user', JSON.stringify(obj))
        }

        return response.data
      })
  }

  logout() {
    localStorage.removeItem('user')
  }

  getCurrentUser() {
    try {
      let some = JSON.parse(localStorage.getItem('user'))
      return some
    }
    catch (error) {
      return null
    }
  }

  getRole() {
    const user = this.getCurrentUser()
    if (user && user.token) {
      const decodedToken = jwtDecode(user.token)

      return user.role
    }

    return null
  }
}

export default new AuthService()
