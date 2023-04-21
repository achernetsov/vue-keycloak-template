import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

import Keycloak, { type KeycloakConfig, type KeycloakInitOptions } from "keycloak-js";
import { useKeycloakStore } from '@/stores/keycloakStore';

const app = createApp(App)

app.use(createPinia())
app.use(router)

let keycloakConfig: KeycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL, realm: 'vue-template', clientId: 'front'
}

let keycloak = new Keycloak(keycloakConfig)
const keycloakStore = useKeycloakStore()
keycloakStore.keycloak = keycloak

let initOptions: KeycloakInitOptions = {
    onLoad: 'login-required',
    redirectUri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URL,
    enableLogging: true
}

keycloak.init(initOptions).then(auth => {
    if (!auth) {
        console.warn('Authentication failed')
    } else {
        console.log('Authenticated')
        app.mount('#app')
    }

    //Token Refresh
    setInterval(() => {
        keycloak.updateToken(70).then((refreshed) => {
            if (refreshed) {
                console.log('Token refreshed')
            } else {
                console.warn('Token not refreshed')
            }
        }).catch(() => {
            console.error('Failed to refresh token');
        });
    }, 6000)
}).catch(() => console.error("Authentication failed"))
