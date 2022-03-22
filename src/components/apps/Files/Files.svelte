<script lang="ts">
  export let isBeingDragged: boolean;
  import { theme } from '🍎/stores/theme.store';
  import { colors } from '🍎/configs/theme/colors.config';
  const { hsl } = colors[colorID][$theme.scheme];
  import { pinnedFolders } from '🍎/configs/apps/pinned-folders';

  function openFolder(dir) {
    console.log(dir);
  }
</script>

<section class="container">
  <header class="titlebar app-window-drag-handle" />
    
  <aside class:light={$theme.scheme === 'light'}>
    <nav class="folder-sidebar">
      {#each Object.keys(pinnedFolders) as pinnedFolder}
        <button 
          class="folder-sidebar-item"
          onclick="openFolder({pinnedFolders[pinnedFolder][directory]});"
          >
            <img 
              src="/assets/app-data/Papirus/places/{pinnedFolders[pinnedFolder][icon]}"
              class="folder-sidebar-icon"
            />
            {pinnedFolders[pinnedFolder][title]}
        </button>
      {/each}
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

  .folder-sidebar-item {
    transition-duration: 0.2s;
  }

  .folder-sidebar-item:hover {
    /*background-color: hsl({hsl});*/
  }
  
  .folder-sidebar-icon {
    width: 48px;
    height: 48px;
  }

</style>
