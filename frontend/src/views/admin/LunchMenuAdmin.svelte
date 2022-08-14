<script>
  import { user } from '../../stores.js'
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
</div>
<div class='section'>
  <div class='container'>
  <h1 class="title is-4">Administration des Menus / {$user.schoolName}</h1>
  </div>
</div>