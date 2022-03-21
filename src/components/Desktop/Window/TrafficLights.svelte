<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import CloseIcon from '🍎/components/SVG/traffic-lights/CloseSVG.svelte';
  import GreenLight from '🍎/components/SVG/traffic-lights/GreenLight.svelte';
  import MinimizeSvg from '🍎/components/SVG/traffic-lights/MinimizeSVG.svelte';
  import { appsConfig } from '🍎/configs/apps/apps-config';
  import type { AppID } from '🍎/stores/apps.store';
  import { activeApp } from '🍎/stores/apps.store';

  export let appID: AppID;

  const dispatch = createEventDispatcher();

  function minimizeApp() {
    dispatch('minimize-app');
  }
  
  function closeApp() {
    dispatch('close-app');
  }

  function maximizeApp() {
    dispatch('maximize-click');
  }
</script>

<div class="container" class:unfocused={$activeApp !== appID}>
  <button class="minimize-btn" on:click={minimizeApp}> <MinimizeSvg /> </button>
  <button class="stretch-btn" on:click={maximizeApp}>
    <GreenLight expandable={appsConfig[appID].expandable} />
  </button>
  <button class="close-btn" on:click={closeApp}> <CloseIcon /> </button>
</div>

<style lang="scss">
  .container {
    --button-size: 0.8rem;

    justify-content: right;

    // pointer-events: none;

    display: grid;
    grid-template-columns: repeat(3, var(--button-size));
    align-items: center;
    gap: 0.6rem;

    height: 100%;

    &.unfocused button {
      --bgcolor: #b6b6b7;
      --border-color: hsla(var(--system-color-dark-hsl), 0.5);
    }

    :global(svg) {
      opacity: 0;
    }

    &:hover {
      button {
        transform: scale(1.2);
      }

      :global(svg) {
        opacity: 1;
      }
    }
  }

  button {
    height: var(--button-size);
    width: var(--button-size);

    // pointer-events: initial;

    border-radius: 16px;

    background-color: var(--bgcolor);
    box-shadow: 0 0 0 0.5px var(--border-color);

    transition: transform 100ms ease-in;
  }

  .close-btn {
    --bgcolor: #ff5f56;
    --border-color: #e0443e;
  }

  .stretch-btn {
    --bgcolor: #27c93f;
    --border-color: #1aab29;

    :global(svg) {
      transform: rotate(90deg);
    }
  }

  .minimize-btn {
    --bgcolor: #ffbd2e;
    --border-color: #dea123;
  }
</style>
