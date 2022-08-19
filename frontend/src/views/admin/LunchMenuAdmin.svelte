<script>
  import { user } from '../../stores.js'
  import { onMount } from 'svelte'
  import { navigateTo } from 'svelte-router-spa' 
  import axios from 'axios'
  import Icon from 'svelte-awesome'
  import { refresh, times } from 'svelte-awesome/icons'

  export let currentRoute

  let lunchWeekList = []
  let loading = true
  let showDeleteModal = false
  let weekToDelete = {}

  onMount(async () => {
    try {      
      let response = await axios.get(`${process.env.API_ROOT}/api/lunch-week`)
      lunchWeekList = response.data      
      loading = false
    } catch (e) {
      console.error('Error fetching data')
    }    
  })

  const openLunchWeekDetails = lunchWeek => {
    const route = `/admin/manage-menus/week-details/${lunchWeek.lunchWeekId}`
    navigateTo(route)
  }

  const openDeleteModal = (lunchWeek) => {
    weekToDelete = lunchWeek
    showDeleteModal = true
  }

  const deleteLunchWeek = async lunchWeek => {
    showDeleteModal = false
    const lunchWeekId = lunchWeek.lunchWeekId
    try {
      // show the loading spinner and call the delete endpoint
      loading = true
      await axios.delete(`${process.env.API_ROOT}/api/lunch-week/${lunchWeekId}`)

      // find the index of the passed in lunchWeek and use splice to remove it
      const deletedIndex = lunchWeekList.findIndex(x => x.lunchWeekId === lunchWeekId)
      lunchWeekList.splice(deletedIndex, 1)
      loading = false
    } catch (e) {
      loading = false
      console.error(e)
    }
}
</script>

<style>
  .clickable {
    cursor: pointer;
  }
</style>

<div>
  <nav class="breadcrumb" aria-label="breadcrumbs">
    <ul>
      <li>
        <a href="/">Accueil</a>
      </li>
      <li>
        <a href="/admin/manage-menus">Administration des Menus</a>
      </li>
      <li class="is-active">
        <a href="/#">{$user.schoolName}</a>
      </li>
    </ul>
  </nav>
  {#if loading}
  <div class="section">
    <Icon spin data="{refresh}" scale="3" />
  </div>
  {:else}
  <table class="table">
    <thead>
      <tr>
        <th>Semaine du</th>
        <th>Publié</th>
        <th></th>
      </tr>
    </thead>
    {#each lunchWeekList as lunchWeek}
    <tr>
      <td on:click="{openLunchWeekDetails(lunchWeek)}" class="has-text-link clickable">{lunchWeek.weekOf}</td>
      <td>{lunchWeek.isPublished}</td>
      <td on:click="{openDeleteModal(lunchWeek)}" class="has-text-grey-light clickable">
        <Icon style="margin-top: 4px;" data="{times}" />
      </td>
    </tr>
    {/each}
  </table>
  {/if}
</div>

<div class="{showDeleteModal ? 'modal is-active' : 'modal'}">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Attention</p>
      <button class="delete" on:click="{() => (showDeleteModal = false)}" aria-label="close"></button>
    </header>
    <section class="modal-card-body">Effacer la Semaine du {weekToDelete.weekOf}?</section>
    <footer class="modal-card-foot">
      <button class="button is-success" on:click="{deleteLunchWeek(weekToDelete)}">Oui, effacer</button>
      <button class="button" on:click="{() => (showDeleteModal = false)}">Annuler</button>
    </footer>
  </div>
</div>