<script>
  import { user } from '../../stores.js'
  import { onMount } from 'svelte'
  import axios from 'axios'
  import Icon from 'svelte-awesome'
  import { refresh } from 'svelte-awesome/icons'
  import { add, parseISO, format } from 'date-fns'
  import { fr } from 'date-fns/locale'

  export let currentRoute
  let routeLunchWeekId = currentRoute.namedParams.lunchWeekId
  let lunchWeek = {
    lunchDays : []
  } // the lunchWeek state variable
  let loading = true
  let saving = false
  let publishing = false

  const seedLunchDays = () => {
    const weekOfDate = parseISO(lunchWeek.weekOf)
    for (let i = 0; i < 5; i++) {
      const calculatedDay = add(weekOfDate, { days: i })
      const formattedDay = format(calculatedDay, 'yyyy-MM-dd')
      if (lunchWeek.lunchDays.some(x => x.day === formattedDay)) {
        continue
      }
     
      const lunchDay = {
        day: formattedDay,
        lunchWeekId: lunchWeek.lunchWeekId,
        menuDetails: null,
      }

      lunchWeek.lunchDays.splice(i, 0, lunchDay)
    }
  }

  onMount(async () => {
    try {
      const response = await axios.get(`${process.env.API_ROOT}/api/lunch-week/${routeLunchWeekId}`)
      lunchWeek = response.data // set the state
      seedLunchDays()
      loading = false
    } catch (e) {
      console.error(e)
    }
  })

  const save = async () => {
    saving = true
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (let i = 0; i < lunchWeek.lunchDays.length; i++) {
      const lunchDay = lunchWeek.lunchDays[i]
      
      // if the item has an id, do a PUT
      if (lunchDay.lunchDayId) {
        await axios.put(`${process.env.API_ROOT}/api/lunch-week/${routeLunchWeekId}/lunch-day/${lunchDay.lunchDayId}`, lunchDay)
        
      // otherwise do a POST and assign the resulting ID
      } else {
        const response = await axios.post(`${process.env.API_ROOT}/api/lunch-week/${routeLunchWeekId}/lunch-day`, lunchDay)
        lunchDay.lunchDayId = response.data.lunchDayId
      }
    }
    saving = false
  }

  const togglePublish = async () => {
    publishing = true
    // Copy the lunchweek object
    let lunchWeekPayload = JSON.parse(JSON.stringify(lunchWeek))    

    // toggle the lunchWeek.isPublished property
    lunchWeekPayload.isPublished = !lunchWeekPayload.isPublished

    await new Promise(resolve => setTimeout(resolve, 1000));

    // remove the lunchDays
    delete lunchWeekPayload.lunchDays
    await axios.put(`${process.env.API_ROOT}/api/lunch-week/${routeLunchWeekId}`, lunchWeekPayload)

    // if successful, update the main lunchWeek object's state so that Svelte will react
    lunchWeek.isPublished = !lunchWeek.isPublished
    publishing = false
  }
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
      <li>
        <a href="/#">{$user.schoolName}</a>
      </li>
      <li class="is-active">
        <a href="/#">{routeLunchWeekId}</a>
      </li>
    </ul>
  </nav>
  {#if loading}
    <div class="section">
      <Icon spin data="{refresh}" scale="3" />
    </div>
  {:else}
    <section>{JSON.stringify(lunchWeek)}</section>
    <section>
      <div class="buttons">
        <button class="{'button is-link is-small' + (saving ? ' is-loading' : '')}" on:click="{() => save()}">
          Save
        </button>
        <button class="{'button is-text is-small' + (publishing ? ' is-loading' : '')}" on:click="{() => togglePublish()}">
          {lunchWeek.isPublished ? 'Unpublish' : 'Publish'}
        </button>
      </div>
    </section>
    <section class="mt-2">
      <div class="columns">
        {#each lunchWeek.lunchDays as lunchDay}
          <div class="column">
            <div class="field">
              <label class="label">{format(parseISO(lunchDay.day), 'EEE MM/dd/yyyy', { locale: fr })}</label>
              <div class="control">
                <textarea bind:value="{lunchDay.menuDetails}" class="textarea" rows="10"></textarea>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>