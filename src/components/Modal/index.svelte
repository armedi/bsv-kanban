<script>
  export let overlayClick = () => {}
</script>

<div
  class="z-50 fixed top-0 left-0 w-screen h-screen flex justify-center items-center"
  style="background-color: hsla(226, 25%, 13%, 0.50)"
  on:click={(e) => {
    e.stopPropagation()
    overlayClick()
  }}
>
  <div on:click={e => e.stopPropagation()}>
    <slot></slot>
  </div>
</div>