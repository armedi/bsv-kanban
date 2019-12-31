<script>
  import bsv from "bsv"
  import MoneyButton from "svelte-money-button"
  import Navbar from "./components/Navbar/index.svelte"
  import NewTask from "./components/NewTask/index.svelte"
  import Columns from "./components/Columns/index.svelte"
  import fetchTasks from "./utils/fetchTasks"
  import { user, tasks } from "./store"

  let tasksIsLoaded = false

  $: {
    $user && fetchTasks($user).then(userTasks => {
      tasksIsLoaded = true
      tasks.set(userTasks)
    })
  }
</script>

<main class="min-h-screen sm:flex sm:flex-col">
  <section class="sm:flex-none mb-8">
    <Navbar />
  </section>
  <section class="container mx-auto sm:flex sm:flex-col sm:flex-1">
    <section
      class="sm:flex-none mb-8 ml-4 flex items-center"
      style="min-height: 50px">
      {#if $user}
        {#if tasksIsLoaded}
          <NewTask />
        {:else}
          <p class="text-gray-600 font-light">Querying blockchain data...</p>
        {/if}
      {:else}
        <p class="mr-4 text-lg text-gray-600">
          Please swipe the
          <a
            href="https://moneybutton.com"
            class="font-bold"
            style="color: #4772f6">
            button
          </a>
          so I can search for your tasks list
        </p>
        <MoneyButton
          label="Swipe to start"
          successMessage="Let's go!"
          cryptoOperations={[{ name: 'myPublicKey', method: 'public-key', key: 'identity' }]}
          onCryptoOperations={cryptoOperations => {
            const { paymail, value: publicKey } = cryptoOperations[0]
            user.set({
              paymail,
              publicKey,
              address: bsv.Address.fromPublicKey(
                bsv.PublicKey.fromString(publicKey)
              ).toString()
            })
          }} />
      {/if}
    </section>
    <section class="sm:flex-1 h-px">
      <Columns />
    </section>
  </section>
</main>
