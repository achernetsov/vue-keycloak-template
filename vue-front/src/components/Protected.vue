<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useKeycloakStore } from '@/stores/keycloakStore';

const profile = ref("")

function fetchProfile() {

    const keycloak = useKeycloakStore().keycloak
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${keycloak?.token}`);
    var requestOptions = {
        headers: myHeaders,
    };

    fetch('/api/protected', requestOptions)
        .then(response => response.text())
        .then(text => {
            profile.value = text
        }
        )
        .catch(err => console.error(err))
}

onMounted(() => {
    console.log("Mounted")
    setInterval(()=>{
        fetchProfile()
    },1000)
})
</script>

<template>
    <h3>Data: {{ profile }}</h3>
</template>