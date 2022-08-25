<script>
  import axios from 'axios'
  import Icon from 'svelte-awesome'
  import { refresh } from 'svelte-awesome/icons'
  import { Navigate } from 'svelte-router-spa'
  import { fly } from 'svelte/transition'

  let step = 1
// some more state we will need soon
let emailMessage
let schoolNameMessage
let passwordMessage
let registrationErrorMessage
let registrationSuccessMessage
let registrationLoading = false

// organize the registration form state in an object
let registrationForm = {
    email: null,
    schoolName: null,
    password: null,
    passwordConfirm: null,
  }

const checkEmail = () => {
  const regEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!registrationForm.email.match(regEx)) {
    return { valid: false, message: 'Addresse courriel invalide' }
  }
  return {
    valid: true,
  }
}

const checkSchoolName = () => {
  const regEx = /([A-Za-z\s]){3,}/;
  if(!registrationForm.schoolName.match(regEx)) {
    return {
      valid: false,
      message: 'Nom école invalide : seul les caractères alphabétiques sont acceptés.'
    }
  }
  return  {
    valid: true
  }  
}


const checkPassword = () => {
  const regEx =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
  if (!registrationForm.password.match(regEx)) {
    return {
      valid: false,
      message:        
        'Le mot de passe doit contenir entre 8-15 caractères, des lettres minuscules et majuscules et des nombres ou caractères spéciaux.',
    }
  }
  if (registrationForm.password !== registrationForm.passwordConfirm) {
    return {
      valid: false,
      message: 'Les mots de passe ne concordent pas',
    }
  }
  return {
    valid: true,
  }
}  

  const completeStep1 = () => {
    let valid;
    emailMessage = null;
    schoolNameMessage = null;

    ({ valid, message:emailMessage } = checkEmail());
    if (!valid) {
      return
    }

    ({ valid, message:schoolNameMessage } = checkSchoolName());
    if(!valid) {      
      return
    }

    step = 2
  }

  const register = async () => {
    passwordMessage = null
    const { valid, message } = checkPassword()

    if (!valid) {
      passwordMessage = message
      return
    }

    try {
      registrationLoading = true
      await axios.post(`${process.env.API_ROOT}/api/users`, registrationForm)
      registrationLoading = false

      registrationSuccessMessage = "Merci pour l'enregistrement, vous serez redirigé au login..."
      await new Promise(f => setTimeout(f, 1800)) // 1.8 second timeout

      // redirect the user
      window.history.replaceState(null, null, '/admin/manage-menus')
      window.location.reload()
    } catch (e) {
      registrationLoading = false
      registrationErrorMessage = e.response.data.message
    }
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
        {#if step === 1}
        <div class="field">
          <label class="label">Adresse courriel</label>
          <div class="control">
            <input
              bind:value="{registrationForm.email}"
              type="text"
              placeholder="Entrez votre adresse courriel"
              class="input" />
          </div>
          {#if emailMessage}
            <p class="help is-danger">{emailMessage}</p>
          {/if}
        </div>
        <div class="field">
          <label class="label">Nom de l'école</label>
          <div class="control">
            <input
              bind:value="{registrationForm.schoolName}"
              type="text"
              placeholder="Entrez le nom de l'école"
              class="input" />
          </div>
          {#if schoolNameMessage}
            <p class="help is-danger">{schoolNameMessage}</p>
          {/if}         
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button on:click="{() => completeStep1()}" class="button is-link is-outlined">Go</button>
          </div>
        </div>
        {:else if step === 2}
        <div id="passwordBlock" in:fly="{{ x: 400, duration: 1000 }}">
          <div class="field">
            <label class="label">Mot de passe</label>
            <div class="control">
              <input bind:value="{registrationForm.password}" type="password" placeholder="Entrez un mot de passe" class="input" />
            </div>
          </div>
          <div class="field">
            <label class="label">Confirmez le mot de passe</label>
            <div class="control">
              <input bind:value="{registrationForm.passwordConfirm}" type="password" placeholder="Confirmez le mot de passe" class="input" />
            </div>
            {#if passwordMessage}
              <p class="help is-danger">{passwordMessage}</p>
            {/if}
          </div>
          {#if registrationLoading}
            <Icon spin data="{refresh}" scale="3" />
          {/if}
          {#if registrationErrorMessage}
            <div class="notification is-warning">{registrationErrorMessage}</div>
          {/if}
          {#if registrationSuccessMessage}
            <div class="notification is-info">{registrationSuccessMessage}</div>
          {/if}
          <div class="field is-grouped">
            <div class="control">
              <button on:click="{register}" class="button is-link is-outlined">Envoyer</button>
            </div>
          </div>
        </div>
        {/if}
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