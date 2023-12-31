import { createRouter, createWebHashHistory } from 'vue-router'
import { authGuard } from '@bcwdev/auth0provider-client'

function loadPage(page) {
  return () => import(`./pages/${page}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: loadPage('HomePage')
  },
  {
    path: '/about',
    name: 'About',
    component: loadPage('AboutPage')
  },
  {
    path: '/account/:accountId',
    name: 'Account',
    component: loadPage('AccountPage'),
    beforeEnter: authGuard
  },
  {
    path: '/game/:gameId',
    name:'ActiveGame',
    component: loadPage('ActiveGamePage')

  },
  {
    path: '/tournament/:tournamentId',
    name:'ManageTournament',
    component: loadPage('ManageTournamentPage')

  },
  {
    path: '/tournaments/:tournamentId',
    name:'TournamentInfoPage',
    component: loadPage('TournamentInfoPage')

  },
]

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})
