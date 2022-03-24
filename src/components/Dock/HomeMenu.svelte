<script lang="ts" context="module">
  export var showingMenu = false;
  
  export function showHomeMenu() {
    showingMenu = !showingMenu;
  }
</script>

<div
  style:display={["none", "grid"][showingMenu]}
  class="homemenu"
>Bees</div>


<style lang="scss">
  .homemenu {
    border-radius: 16px;
    border: 1px solid rgb(20, 20, 20, 0.5);
    background-color: rgb(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    width: 500px;
    height: 500px;
    position: absolute;
    left: 100px;
    top: 100px;
  }
</style>