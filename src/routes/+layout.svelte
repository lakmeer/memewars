<script lang="ts">
  import '../app.css'
  //import app from '$stores/app'
  export let data
</script>

<main class="mx-auto flex min-h-screen">
  <article class="w-full p-4">
    <slot />
  </article>
</main>
