<script>
  import { user } from '../../stores.js'
  import { onMount } from 'svelte'
  import { navigateTo } from 'svelte-router-spa' 
  import axios from 'axios'
  import Icon from 'svelte-awesome'
  import { refresh } from 'svelte-awesome/icons'

  export let currentRoute

  let lunchWeekList = []
  let loading = true

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
</script>

<div>
  <nav class="breadcrumb" aria-label="breadcrumbs">
    <ul>
      <li>
        <a href="/">Home</a>
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
        <th>Week Of</th>
        <th>Published</th>
      </tr>
    </thead>
    {#each lunchWeekList as lunchWeek}
    <tr on:click="{openLunchWeekDetails(lunchWeek)}" class="has-text-link" style="cursor: pointer" >
      <td>{lunchWeek.weekOf}</td>
      <td>{lunchWeek.isPublished}</td>
    </tr>
    {/each}
  </table>
  {/if}
</div>