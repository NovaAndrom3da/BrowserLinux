<script lang="ts">
  export let isBeingDragged: boolean;
  import { theme } from '🍎/stores/theme.store';
</script>

<section class="container">
  <header class="titlebar app-window-drag-handle" />
    
  <aside class:light={$theme.scheme === 'light'}>
    <nav class="folder-sidebar">
      <button class="folder-sidebar-item"><img src="/assets/app-icons/Papirus/places/folder-adwaita-applications.svg" class="folder-sidebar-icon"/>Applications</button>
      <button class="folder-sidebar-item"><img src="/assets/app-icons/Papirus/places/user-adwaita-desktop.svg" class="folder-sidebar-icon" />Desktop</button>
      <button class="folder-sidebar-item"><img src="/assets/app-icons/Papirus/places/folder-adwaita-documents.svg" class="folder-sidebar-icon" />Documents</button>
      <button class="folder-sidebar-item"><img src="/assets/app-icons/Papirus/places/folder-adwaita-download.svg" class="folder-sidebar-icon" />Downloads</button>
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

  .folder-sidebar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 40px;
    position: absolute;
    margin-left: 5px;
  }
  
  .folder-sidebar-icon {
    width: 48px;
    height: 48px;
  }
  
</style>
