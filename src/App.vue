<template>
  <div id="app">
<!--    <img alt="Vue logo" src="./assets/logo.svg">-->
    <span id="title">Welcome to use liteflow-blueprint</span>
    <div class="rete" ref="rete"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createEditor } from './rete';

export default defineComponent({
  name: 'App',
  async mounted() {
    console.log(this.$refs)
    // await createEditor(this.$refs.rete as HTMLElement)
    await createEditor(this.$refs.rete as HTMLElement)
  }
});
</script>

<style>
body{
  background-color: #333333;
}

#app {
  //font-family: Avenir, Helvetica, Arial, sans-serif;
  //-webkit-font-smoothing: antialiased;
  //-moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #a86634;
  margin-top: 0;
  width: 100%;
}

.rete {
  position: relative;
  height: 92vh;
  font-size: 1rem;
  margin: 0 0;
  border-radius: 1em;
  text-align: left;
  border: 3px solid #5e6565;

  background-color: #262626;
  opacity: 1;
  background-image:
      linear-gradient(#0f0f0f 1.5px,transparent 0),
      linear-gradient(90deg,#0f0f0f 1.5px,transparent 0),
      linear-gradient(#333 1.5px,transparent 0),
      linear-gradient(90deg,#333 1.5px,#262626 0);
  background-size: 200px 200px,200px 200px,25px 25px,25px 25px;
  background-position: -1.5px -1.5px,-1.5px -1.5px,-1.5px -1.5px,-1.5px -1.5px;
}

#title{
  //padding-left: 10px;
  font-weight: bold;
  font-size: 24px;
}

[rete-context-menu] {
  width: 180px !important;

  .block{
    background: #333333FF;
    border-bottom: 1px dashed #0f0f0f;

    &:hover {
      background: #4cd326;
    }
  }

  .block:first-child input {
    background: #333333FF;
  }
  .block.item {
    background: grey;
  }
}

</style>
