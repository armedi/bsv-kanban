<script>
  import bsv from "bsv"
  import uuid from "uuid/v1"
  import { afterUpdate } from "svelte"
  import Icon from "svelte-awesome"
  import { plusCircle, times } from "svelte-awesome/icons"
  import MoneyButton from "svelte-money-button"
  import { tasks } from "../../store"

  let showInput = false
  let input
  let nextTaskId = uuid()
  let newTaskName = ""

  const prepareData = taskName => JSON.stringify({ name: taskName, status: 0 })

  const handleCreate = payment => {
    tasks.add({
      id: nextTaskId,
      name: newTaskName,
      status: 0,
      updatedAt: new Date(payment.createdAt).getTime()
    })
    newTaskName = ""
    nextTaskId = uuid()
  }

  $: input && input.focus()
</script>

<div
  class="inline-flex items-center text-gray-600 hover:text-orange-700 cursor-pointer h-10"
  on:click={() => {
    showInput = true
  }}>
  {#if showInput}
    <span
      class="text-red-500"
      on:click|stopPropagation={() => {
        showInput = false
      }}>
      <Icon data={times} scale="1.5" />
    </span>
    <input
      bind:this={input}
      class="border shadow rounded h-full inline-block mx-4 px-3 w-64"
      bind:value={newTaskName}
      on:keyup={e => {
        if (e.which === 13) {
          tasks.add(e.target.value)
          showInput = false
        } else if (e.which === 27) {
          showInput = false
        }
      }} />
    <MoneyButton
      label="Create Task"
      successMessage="It's done"
      cryptoOperations={[
        {
          name: 'myPublicKey',
          method: 'public-key',
          key: 'identity' 
        }, 
        {
          name: 'mySignature',
          method: 'sign',
          data: prepareData(newTaskName),
          dataEncoding: 'utf8',
          key: 'identity',
          algorithm: 'bitcoin-signed-message' 
        }
      ]}
      outputs={[{ 
        script: bsv.Script.buildSafeDataOut([
          process.env.BITCOM,
          '#{myPublicKey}',
          nextTaskId,
          prepareData(newTaskName),
          '#{mySignature}'
        ]).toASM(),
        amount: '0',
        currency: 'BSV'
      }]}
      disabled={!newTaskName}
      onPayment={handleCreate} />
  {:else}
    <Icon data={plusCircle} scale="1.75" class="inline-block" />
    <span class="inline-block ml-3 font-semibold text-lg">Create New Task</span>
  {/if}
</div>
