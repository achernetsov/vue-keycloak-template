<script setup lang="ts">

import { useKeycloakStore } from '@/stores/keycloakStore';
import { onMounted, ref } from 'vue';

const protectedData = ref("")

function fetchProtectedData() {

    const keycloak = useKeycloakStore().keycloak
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${keycloak?.token}`);
    var requestOptions = {
        headers: myHeaders,
    };

    fetch('/api/protected', requestOptions)
        .then(response => response.text())
        .then(text => {
            protectedData.value = text
        }
        )
        .catch(err => console.error(err))
}

onMounted(() => {
    console.log("Mounted")
    fetchProtectedData()
})
</script>

<template>
    <h3>Data: {{ protectedData }}</h3>
</template>