<script>
  import { Navigate } from 'svelte-router-spa'

  let emailAddress
  let schoolName

  function register() {
    alert(`Email is ${emailAddress} and School Name is ${schoolName}`)
  }
</script>

<div class="notification is-info is-light">
  <div class="columns">
    <div class="column">
      <div class="content">
        <h1>Publiez facilement vos menus scolaires</h1>
        <p>
          Nous facilitons la publication de vos menus scolaires hebdomadaires sur le web et les fournissons aux élèves et aux parents dans un format adapté au mobile.
        </p>
        <p>
          Entrez seulement les détails du menu et pressez publiez ! Enregistrez-vous et débutez dès aujourd'hui.
        </p>
      </div>
    </div>
    <div class="column">
      <div class="content">
        <h3>Enregistrez-vous maintenant</h3>
        <div class="field">
          <label class="label">Adresse courriel</label>
          <div class="control">
            <input
              bind:value="{emailAddress}"
              type="text"
              placeholder="Entrez votre adresse courriel"
              class="input" />
          </div>
        </div>
        <div class="field">
          <label class="label">Nom de l'école</label>
          <div class="control">
            <input
              bind:value="{schoolName}"
              type="text"
              placeholder="Entrez le nom de l'école"
              class="input" />
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button on:click="{register}" class="button is-link is-outlined">Go</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="container">
  <div class="content" style="line-height: 30px;">
    <center>
      <span>Déjà enregistré ?</span>
      <Navigate to="/admin/manage-menus">
        <button class="button is-small is-text">Connectez-vous</button>
      </Navigate>
    </center>
  </div>
</div>