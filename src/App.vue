<template>
  <div id="app">
    <div id="title">
      <span id="title" @click="choreography()">Welcome to use liteflow-blueprint</span>
    </div>
<!--    <button id="btn" @click="choreography()">编排</button>-->
    <div class="rete" ref="rete"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { result } from './nodes/Result';
import { createEditor } from './rete';

export default defineComponent({
  name: 'App',
  async mounted() {
    console.log(this.$refs)
    // await createEditor(this.$refs.rete as HTMLElement)
    await createEditor(this.$refs.rete as HTMLElement)
  },
  methods: {
    // 获取编排结果
    choreography() {
      alert(result.data);
    }
  }

});
</script>

<style>
body{
  background-color: #333333;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #a86634;
  margin-top: 0;
  width: 100%;
}
#title{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 50px;
  line-height: 50px;
  background-color: #333333;
  color: #a86634;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.rete {
  position: relative;
  height: 92vh;
  //width: 80%;
  font-size: 1rem;
  margin: 0 0;
  box-sizing: border-box;
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
      background: #5e6565;
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
