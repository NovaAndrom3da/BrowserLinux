<script lang="ts">
  import { showHomeMenu } from '🍎/components/Dock/HomeMenu.svelte'
</script>

<button 
  class="homebtn"
  on:click={showHomeMenu}
>
  <img 
    class="homebtn_icon" 
    src="/assets/app-icons/Papirus/apps/distributor-logo-lubuntu.svg" 
    alt="Start Button" 
  />
</button>

<style lang="scss">
  .homebtn {
    width: 3.5rem;
    height: 3.5rem;
    color: var(--system-color-dark);
    border-radius: 50px;
    transition-duration: 0.15s;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1rem;
  }

  .homebtn:hover {
    background-color: rgb(100,100,100,0.5);
  }

  .homebtn:active {
    background-color: rgb(150,150,150,0.5);
  }

  .homebtn_icon {
    border-radius: 50px;
    width: 2.5rem;
    height: 2.5rem;
  }
</style>