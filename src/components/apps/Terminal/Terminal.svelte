<section class="container">
  <header class="titlebar app-window-drag-handle" />
  <section class="content main-area" style="margin-top: 5px;">
    <div id="cmdprompt" style="width: 98%; height: 100%; overflow-x: hidden;" tabindex="0"></div>
  </section>
</section>

<script lang="ts">
  export let isBeingDragged: boolean;
  setTimeout(function(){
    window.cmdprompt = document.querySelector("#cmdprompt");
    cmdprompt.addEventListener('keydown', cmdprompt_keydown);
    cmdprompt.innerHTML = color("Start typing...", "green") + " " + color(">>", "lightblue");
  }, 50);
</script>

<style lang="scss">
  .container {
    background-color: rgb(15, 15, 15, 0.8);
    padding: 1px;

    border-radius: inherit;

    display: grid;
    grid-template-rows: auto 1fr;
  }

  header {
    padding: 0.9rem;
  }

  :global(.tl-container.vscode) {
    top: 0.6rem;
    left: 0.6rem;
  }

  #cmdprompt {
    background-color: rgb(15, 15, 15, 0);
    outline: none;
  }
</style>
