import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'

// reset.css
import './style/reset.css'

const pinia = createPinia()

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
