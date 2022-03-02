<script lang="ts">
  export let isBeingDragged: boolean;
  import { theme } from '🍎/stores/theme.store';
</script>

<section class="container">
  <header class="titlebar app-window-drag-handle" />
    
  <aside class:light={$theme.scheme === 'light'}>
    <nav>
      <button class="">Applications</button>
      <button class="">Desktop</button>
      <button class="">Documents</button>
      <button class="">Downloads</button>
    </nav>
  </aside>

  <section class="content main-area" style="margin-top: 5px;">
    Here is some <b>content</b>!
  </section>
</section>

<style lang="scss">
  .container {
    background-color: var(--system-color-light);
    border-radius: inherit;
    padding: 1px;
  }

  .titlebar {
    padding: 1rem 1rem;

    width: 100%;

    position: absolute;
    top: 0;
    left: 0;
  }

  .main-area {
    font-size: 1.618rem;
    color: var(--system-color-light-contrast);

    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
