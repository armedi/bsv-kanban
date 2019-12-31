<script>
  import Column from "./Column/index.svelte"
  import { tasks } from "../../store"

  $: sortedTasks = $tasks.slice().sort((a, b) => a.updatedAt - b.updatedAt)
</script>

<style>
  @media (min-width: 768px) {
    .columns {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1rem;
    }
  }
  @media (min-width: 768px) and (max-width: 800px) {
    .columns {
      margin-left: 1rem;
      margin-right: 1rem;
    }
  }
</style>

<div class="columns sm:min-h-full">
  <div class="mb-6">
    <Column status={0} tasks={sortedTasks.filter(t => t.status === 0)} />
  </div>
  <div class="mb-6">
    <Column status={1} tasks={sortedTasks.filter(t => t.status === 1)} />
  </div>
  <div class="mb-6">
    <Column status={2} tasks={sortedTasks.filter(t => t.status === 2)} />
  </div>
</div>
