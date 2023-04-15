# Overview

Template for vue application accessing protected API using keycloak for security.

Components:
* Vue app (vue3, typescript, composition API, Pinia, Router) + [keycloak-js lib](https://www.keycloak.org/securing-apps/vue)
* Backend service with protected API (quarkus)
* Keycloak

# Quickstart

1. Start keycloak:

```shell
docker-compose up -d
```

Keycloak will import realm with settings, but without users. Go to http://localhost:8081, login as admin / admin, and create user alice with password alice.

2. Start back

JDK 17+ is needed.

```shell
cd back && ./mvnw quarkus:dev
```

3. Start front

Install dependencies before running: ```cd front && npm i```

Run:

```shell
cd front && npm run dev
```

4. Open frontend app http://127.0.0.1:5173/, login: user=alice, password=alice

You'll see "Data: secret data from protected api; updated on {timestamp}" - this data is returned from ProtectedResource.java

# Protected API

Quarkus app, with protected API /api/protected, returning string with timestamp for authenticated users with role "user".

See https://quarkus.io/guides/security-openid-connect

After running with ```./mvnw quarkus:dev```, go to http://localhost:8080/q/dev/io.quarkus.quarkus-oidc/provider to check resources protection.

# Keycloak config
Keycloak will be started with imported realm "vue-template".

Keycloak admin panel:

http://localhost:8081

user: admin, password: admin

2 clients created:
* front
* back

front settings:
* Client authentication = OFF (public access)
* Standard flow = ON
* Direct access grants = ON

back 
* Client authentication = ON
* Standard flow = ON
* Direct access grants = ON

Create user alice with password alice.

role "user" is created and added into default roles, so alice's access token will contain "user" role, allowing her to access protected /time resource: http://localhost:8081/admin/master/console/#/vue-template/realm-settings/user-registration 

# Vue app

## Running
Vue app created using https://github.com/vuejs/create-vue

```shell
npm create vue@3
```

Chosen options:
* Add Typescript = Yes
* Router = Yes
* Pinia = Yes
* ESLint = Yes
* Prettier = Yes

All other options are defaults.

Protected API is proxied to avoid CORS, see vite.config.ts

Install: ```npm i```

Run: ```npm run dev```

## Vue Keycloak config

See [keycloak-js lib](https://www.keycloak.org/securing-apps/vue)

Keycloak-js installed: ```npm i keycloak-js --save```

Pinia keycloak store created to allow components access keycloak for token (/stores/keycloakStore.ts):

```typescript
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type Keycloak from "keycloak-js";

// https://pinia.vuejs.org/getting-started.html

export const useKeycloakStore = defineStore('keycloakStore', () => {
  const keycloak = ref(null as Keycloak | null)

  return { keycloak }
})

```

Keycloak is initialized and saved into store. Vue app is mounted when user successfully authenticated, and token refresh timer started.

main.ts:

```typescript
import Keycloak, { type KeycloakConfig, type KeycloakInitOptions } from "keycloak-js";
import { useKeycloakStore } from '@/stores/keycloakStore';

const app = createApp(App)

app.use(createPinia())
app.use(router)

let keycloakConfig: KeycloakConfig = {
    url: 'http://localhost:8081', realm: 'vue-template', clientId: 'front'
}

let keycloak = new Keycloak(keycloakConfig)
const keycloakStore = useKeycloakStore()
keycloakStore.keycloak = keycloak

let initOptions: KeycloakInitOptions = {
    onLoad: 'login-required',
    redirectUri: 'http://localhost:4040/callback',
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
```

components/Protected.vue calls API with access token from keycloak:

```typescript
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
```