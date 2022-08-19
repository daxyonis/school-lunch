<script>
  import { user } from '../../stores.js'
</script>

<div>
  <nav class="breadcrumb" aria-label="breadcrumbs">
    <ul>
      <li>
        <a href="/">Accueil</a>
      </li>
      <li>
        <a href="/admin/manage-menus">Administration des menus</a>
      </li>
      <li class="is-active">
        <a href="/#">{$user.schoolName}</a>
      </li>
    </ul>
  </nav>
</div>