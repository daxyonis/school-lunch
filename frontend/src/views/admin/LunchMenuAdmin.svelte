<script>
  import { user } from '../../stores.js'
  import { onMount } from 'svelte'
  import { navigateTo } from 'svelte-router-spa' 
  import axios from '../../axios-global'
  import Icon from 'svelte-awesome'
  import { refresh, times } from 'svelte-awesome/icons'

  export let currentRoute

  let lunchWeekList = []
  let loading = true
  let showDeleteModal = false
  let weekToDelete = {}

  let showCreateModal = false
  let createWeekOfDate = null

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

const openCreateModal = () => {
  showCreateModal = true
}

const createLunchWeek = async () => {
  showCreateModal = false
  let newLunchWeek = {
    weekOf: createWeekOfDate, // createWeekOfDate will contain the input from the user
    isPublished: false,
  }
  try {
    loading = true

    // since this is a POST, we need to send a lunchWeek object as the body of the request
    const response = await axios.post(`${process.env.API_ROOT}/api/lunch-week`, newLunchWeek)
    const lunchWeekId = response.data.lunchWeekId
    
    // populate the newLunchWeek with the id from the server response
    newLunchWeek.lunchWeekId = lunchWeekId

    // push the result into lunchWeek list, so that
    // Svelte will update the table
    lunchWeekList.push(newLunchWeek)
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
  <button class="button is-info is-light is-small mb-1" on:click="{() => openCreateModal()}">
    Ajouter une semaine
  </button>
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
      <td>{lunchWeek.isPublished ? 'Oui' : 'Non'}</td>
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
      <button class="button is-info" on:click="{deleteLunchWeek(weekToDelete)}">Oui, effacer</button>
      <button class="button" on:click="{() => (showDeleteModal = false)}">Annuler</button>
    </footer>
  </div>
</div>

<div class="{showCreateModal ? 'modal is-active' : 'modal'}">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Créer une semaine de menus</p>
      <button class="delete" on:click="{() => (showCreateModal = false)}" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      <div class="field">
        <label class="label">Semaine du</label>
        <div class="control">
          <!-- bind users input for the Week Of Date to the createWeekOfDate state var -->
          <input bind:value="{createWeekOfDate}" type="date" class="input" placeholder="yyyy-mm-dd" />
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-info" on:click="{() => createLunchWeek()}">Continue</button>
      <button class="button" on:click="{() => (showCreateModal = false)}">Cancel</button>
    </footer>
  </div>
</div>