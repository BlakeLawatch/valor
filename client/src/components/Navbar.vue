<template>
  <nav class="navbar p-3 navbar-expand-lg navbar-dark navbar-bg px-3">
    <router-link v-if="route.name != 'Home'" class="navbar-brand d-flex" :to="{ name: 'Home' }">
      <div class="d-flex align-items-center">
        <img alt="logo" :src="logo_img" height="70" />
        <p class="valor mb-0 px-2"> Valor</p>
      </div>
    </router-link>
    <div v-else role="button" class="navbar-brand d-flex">
      <div @click="reload()" class="d-flex align-items-center">
        <img alt="logo" :src="logo_img" height="70" />
        <p class="valor mb-0 px-2"> Valor</p>
      </div>
    </div>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
      aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto">
        <li>
          <router-link :to="{ name: 'About' }" class="btn color-match lighten-30 selectable text-uppercase">
            About Us
          </router-link>
        </li>
      </ul>
      <!-- LOGIN COMPONENT HERE -->
      <Login />
    </div>
  </nav>
</template>

<script>
import { useRoute } from 'vue-router';
import Login from './Login.vue';
import logo_img from '../assets/img/panda.png'

export default {
  setup() {
    const route = useRoute()
    return {
      route,
      logo_img,
      reload() {
        window.location.reload()
      }
    }
  },
  components: { Login }
}
</script>

<style scoped>
a:hover {
  text-decoration: none;
}

.nav-link {
  text-transform: uppercase;
}

.navbar-bg {
  background-color: #242726;
}

.valor {

  height: 61px;

  font-family: 'Press Start 2P';
  font-style: normal;
  font-weight: 400;
  /* font-size: 64px; */
  line-height: 64px;

  color: #FFFFFF;

  text-shadow: 0px 4px 4px #FC65C2;

}

.color-match {
  background-color: #2ca58d;
  color: white;
}

.color-match:hover {
  background-color: #24806e;
  color: #f0f0f0;
}

@media screen and (min-width: 768px) {
  nav {
    height: 64px;
  }
}
</style>
