<script>
  import { Route } from 'svelte-router-spa'
  export let currentRoute
</script>

<div>
  Admin Layout
  <Route {currentRoute} />
</div>