<script>
  import { Route } from 'svelte-router-spa'
  import { onMount } from 'svelte'
  import { user } from '../../stores.js'

  export let currentRoute

  let initialized = false

   // The onMount lifecycle function
   onMount(() => {
    // Svelte stores are written to by calling set
    user.set({
      name: 'Usager Test',
      schoolName: 'École Test',
    })
    initialized = true
  })
</script>

<div>  
  {#if initialized}
  <Route {currentRoute} />
  {/if}
</div>