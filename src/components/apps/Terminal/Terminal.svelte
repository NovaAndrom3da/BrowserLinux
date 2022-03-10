<section class="container" onclick="window.cmdprompt.focus();">
  <header class="titlebar app-window-drag-handle" onclick="window.cmdprompt.focus();" />
  <section class="content main-area" style="margin-top: 5px;">
    <div id="cmdprompt" style="width: 100%; height: 100%; overflow-x: hidden;" tabindex="0" autofocus></div>
  </section>
</section>

<script lang="ts">
  export let isBeingDragged: boolean;
  setTimeout(function(){
    window.cmdprompt = document.querySelector("#cmdprompt");
    cmdprompt.addEventListener('keydown', cmdprompt_keydown);
    cmdprompt.innerHTML = color(window.env["USERDIR"], "green") + " " + color(">>", "lightblue");
    window.triggerPrompt = function() {
      window.cmdprompt_keydown({"key": "", "shiftKey": false, "ctrlKey": false});
    }
    setTimeout(function(){
      cmdprompt.clientWidth = String(cmdprompt.parentElement.clientWidth);
      cmdprompt.clientHeight = String(cmdprompt.parentElement.clientHeight);
    }, 50);
  }, 50);
</script>

<style lang="scss">
  .container {
    background-color: rgb(15, 15, 15, 0.8);
    padding: 1px;

    border-radius: inherit;

    display: grid;
    grid-template-rows: auto 1fr;
    word-break: break-all;
    word-wrap: break-word;
    overflow-x: hidden;
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
    box-shadow: none;
  }
</style>
