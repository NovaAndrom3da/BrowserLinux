<script lang="ts">
  import { appsConfig } from '🍎/configs/apps/apps-config';

  export let appID: string;
  
  const { icon, title } = appsConfig[appID];
</script>

<header class="titlebar app-window-drag-handle" onclick="window.cmdprompt.focus();">
  <img src="/assets/app-icons/Papirus/apps/{icon}" alt="{title} Icon" class="appicon" /><span>{title}</span>
</header>

<style lang="scss">
  .titlebar {
    display: flex;
    justify-content: left;
    position: fixed;

    padding: 0.9rem 1rem;

    width: 100%;

    span {
      color: hsla(var(--system-color-dark-hsl), 0.8);
      font-weight: 500;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
    }
  }

  .appicon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
</style>