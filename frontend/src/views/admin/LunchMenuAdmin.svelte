<script>
  import { user } from '../../stores.js'
  import { onMount } from 'svelte'
  import { navigateTo } from 'svelte-router-spa' 
  import axios from 'axios'

  export let currentRoute;

  let lunchWeekList = []

  onMount(async () => {
    try {
      let response = await axios.get('http://localhost:3000/api/lunch-week')
      lunchWeekList = response.data
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
</div>