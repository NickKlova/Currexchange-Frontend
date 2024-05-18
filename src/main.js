import { createApp } from 'vue'
import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { SnackbarService } from "vue3-snackbar"

// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import "vue3-snackbar/styles"

// Create vue app
const app = createApp(App)

app.use(SnackbarService)

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
