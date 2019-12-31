<script>
  import bsv from 'bsv'
  import Icon from 'svelte-awesome'
  import { trash } from 'svelte-awesome/icons'
  import MoneyButton from 'svelte-money-button'
  import Modal from '../../../Modal/index.svelte'
  import { tasks } from '../../../../store'

  export let task
  export let styles

  let card
  let moneyButtonPosition = null

  const handleDelete = e => {
    window.card = card
    const center = {
      x: card.offsetLeft + Math.round(card.offsetWidth / 2), 
      y: card.offsetTop + Math.round(card.offsetHeight / 2)
    }
    moneyButtonPosition = { x: center.x - 98, y: center.y - 25 }
  }

  const handlePayment = () => {
    tasks.delete(task.id)
  }

  const handleDragStart = e => {
    e.dataTransfer.setData('type', 'task')
    e.dataTransfer.setData('item', JSON.stringify(task))
  }
</script>

<div
  bind:this={card}
  draggable={true}
  on:dragstart={handleDragStart}
  class={`group border-t ${styles.headerBorderColor} shadow-md h-16 mx-2 my-4 flex items-center justify-center cursor-move relative`}>
  <p>{task.name}</p>
  <div
    class='w-8 h-8 text-red-600 absolute right-0 bottom-0 hidden
    group-hover:flex items-center justify-center cursor-default'
    on:click={handleDelete}>
    <Icon data={trash} />
  </div>
</div>

{#if moneyButtonPosition}
  <Modal overlayClick={() => moneyButtonPosition = null}>
    <div class="fixed" style={`top: ${moneyButtonPosition.y}px; left: ${moneyButtonPosition.x}px;`}>
      <MoneyButton
        label="Swipe to delete"
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
            data: JSON.stringify({ name: task.name, status: -1 }),
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
              task.id,
              JSON.stringify({ name: task.name, status: -1 }),
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