<script context='module'>
  const classNames = {
    0: {
      header: 'Todo',
      headerBgColor: 'bg-red-100',
      borderColor: 'border-red-100',
      textColor: 'text-red-800',
      headerBorderColor: 'border-red-800'
    },
    1: {
      header: 'Doing',
      headerBgColor: 'bg-orange-100',
      borderColor: 'border-orange-100',
      textColor: 'text-orange-800',
      headerBorderColor: 'border-orange-800'
    },
    2: {
      header: 'Done',
      headerBgColor: 'bg-green-100',
      borderColor: 'border-green-100',
      textColor: 'text-green-800',
      headerBorderColor: 'border-green-800'
    }
  }
</script>

<script>
  import bsv from 'bsv'
  import MoneyButton from 'svelte-money-button'
  import Card from './Card/index.svelte'
  import Modal from '../../Modal/index'
  import { tasks as tasksStore } from '../../../store'

  export let status
  export let tasks

  let isDraggedOver = false
  let moneyButtonPosition = null
  let updatedTask = null

  const { header, headerBgColor, borderColor, textColor, headerBorderColor } = classNames[status]


  const handleDragOver = e => {
    e.preventDefault()
  }

  const handleDragEnter = e => {
    isDraggedOver = true
  }

  const handleDragLeave = e => {
    isDraggedOver = false
  }

  const handleDrop = e => {
    isDraggedOver = false
    const type = e.dataTransfer.getData('type')
    if (type !== 'task') return
    const task = JSON.parse(e.dataTransfer.getData('item'))
    if (task.status === status) return
    updatedTask = task
    moneyButtonPosition = { x: e.clientX - 98, y: e.clientY - 25}
  }

  const prepareData = task => {
    return JSON.stringify({ name: task.name, status })
  }

  const handlePayment = () => {
    tasksStore.update(updatedTask.id, status)
    moneyButtonPosition = null
  }
</script>


<div class={`sm:min-h-full flex flex-col bg-white shadow ${borderColor}`}>
  <div class={`flex-none border-b ${headerBgColor} ${headerBorderColor}`}>
    <h1
      class={`text-center font-semibold text-lg text-gray-600 px-2 py-4 ${textColor}`}>
      {header}
    </h1>
  </div>
  <div
    class={`flex-1 ${isDraggedOver ? headerBgColor : ''}`}
    on:dragover={handleDragOver}
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
  >
    {#each tasks as task (task.id)}
      <Card {task} styles={classNames[status]} />
    {/each}
  </div>
</div>

{#if moneyButtonPosition}
  <Modal overlayClick={() => moneyButtonPosition = null}>
    <div class="fixed" style={`top: ${moneyButtonPosition.y}px; left: ${moneyButtonPosition.x}px;`}>
      <MoneyButton
        label="Swipe to update"
        successMessage="Let's go!"
        cryptoOperations={[
          {
            name: 'myPublicKey',
            method: 'public-key',
            key: 'identity' // default value
          },
          {
            name: 'mySignature',
            method: 'sign',
            data: prepareData(updatedTask),
            dataEncoding: 'utf8',
            key: 'identity', // default value
            algorithm: 'bitcoin-signed-message' // default value
          },
        ]}
        outputs={[
          {
            script: bsv.Script.buildSafeDataOut([
              process.env.BITCOM,
              '#{myPublicKey}',
              updatedTask.id,
              prepareData(updatedTask),
              '#{mySignature}'
            ]).toASM(),
            amount: "0",
            currency: "BSV"
          }
        ]}
        onPayment={handlePayment}
      />
    </div>
  </Modal>
{/if}