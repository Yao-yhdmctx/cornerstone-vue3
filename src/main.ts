import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import vuetify from "./plugins/vuetify"
import router from './router'
import {createPinia} from 'pinia'
const app = createApp(App)

app.use(vuetify)
app.use(router)
app.use(createPinia())
app.mount('#app')