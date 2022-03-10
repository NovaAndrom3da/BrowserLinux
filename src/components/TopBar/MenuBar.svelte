<script lang="ts">
  import { clickOutside, elevation, focusOutside } from '🍎/actions';
  import { activeMenu, menuBarMenus } from '🍎/stores/menubar.store';
  import Menu from './Menu.svelte';
</script>

<div
  class="container"
  use:clickOutside={{ callback: () => ($activeMenu = '') }}
  use:focusOutside={{ callback: () => ($activeMenu = '') }}
><!--
  {#each Object.entries($menuBarMenus) as [menuID, menuConfig]}
    <div>
      <div style:height="100%">
        <button
          class="menu-button"
          class:default-menu={menuID === 'default'}
          style:--scale={$activeMenu === menuID ? 1 : 0}
          on:click={() => ($activeMenu = menuID)}
          on:mouseover={() => $activeMenu && ($activeMenu = menuID)}
          on:focus={() => ($activeMenu = menuID)}
        >
          {menuConfig.title}
        </button>
      </div>

      <div
        class="menu-parent"
        style:visibility={$activeMenu === menuID ? 'visible' : 'hidden'}
        use:elevation={'menubar-menu-parent'}
      >
        <Menu menu={menuConfig.menu} />
      </div>
    </div>
  {/each}-->
</div>

<style lang="scss">
  .container {
    height: 100%;

    display: flex;
    position: relative;
  }

  .menu-parent {
    position: absolute;
    margin-top: 1.5px;
  }
</style>
