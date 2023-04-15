import { ref } from 'vue'
import { defineStore } from 'pinia'
import type Keycloak from "keycloak-js";

// https://pinia.vuejs.org/getting-started.html
export const useKeycloakStore = defineStore('keycloakStore', () => {
  const keycloak = ref(null as Keycloak | null)

  return { keycloak }
})
