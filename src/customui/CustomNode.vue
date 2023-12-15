<template>
  <div class="node" :class="{ selected: data.selected }" :style="nodeStyles()" data-testid="node">
    <!--自定义标题-->
    <div class="title" data-testid="title">

      {{ data.label }}

    </div>

    <div id="leftLineDiv">
      <!-- Inputs-->
      <div class="input" v-for="[key, input] in inputs()" :key="'input' + key + seed" :data-testid="'input-' + key">
        <Ref class="input-socket" :emit="emit"
             :data="{ type: 'socket', side: 'input', key: key, nodeId: data.id, payload: input.socket }"
             data-testid="input-socket" />
        <div class="input-title" v-show="!input.control || !input.showControl" data-testid="input-title">{{ input.label }}
        </div>
        <Ref class="input-control" v-show="input.control && input.showControl" :emit="emit"
             :data="{ type: 'control', payload: input.control }" data-testid="input-control" />
      </div>
      <!-- Inputs END-->
    </div>

    <div id="rightLineDiv">
      <!-- Outputs-->
      <div class="output" v-for="[key, output] in outputs()" :key="'output' + key + seed" :data-testid="'output-' + key">
        <div class="output-title" data-testid="output-title">{{ output.label }}</div>
        <Ref class="output-socket" :emit="emit"
          :data="{ type: 'socket', side: 'output', key: key, nodeId: data.id, payload: output.socket }"
          data-testid="output-socket" />
      </div>
      <!-- Outputs END-->
    </div>

    <div >
      <!-- Controls-->
      <Ref class="control" v-for="[key, control] in controls()" :key="'control' + key + seed" :emit="emit"
           :data="{ type: 'control', payload: control }" :data-testid="'control-' + key" />
    </div>

  </div>
</template>


<script lang="js">
import { defineComponent } from 'vue'
import { Ref } from 'rete-vue-plugin'


function sortByIndex(entries) {
  entries.sort((a, b) => {
    const ai = a[1] && a[1].index || 0
    const bi = b[1] && b[1].index || 0
    return ai - bi
  })
  return entries
}

export default defineComponent({
  props: ['data', 'emit', 'seed'],
  methods: {
    nodeStyles() {
      return {
        width: Number.isFinite(this.data.width) ? `${this.data.width}px` : '',
        height: Number.isFinite(this.data.height) ? `${this.data.height}px` : ''
      }
    },
    inputs() {
      return sortByIndex(Object.entries(this.data.inputs))
    },
    controls() {
      return sortByIndex(Object.entries(this.data.controls))
    },
    outputs() {
      return sortByIndex(Object.entries(this.data.outputs))
    }
  },
  components: {
    Ref
  }
})
</script>

<style lang="scss" scoped>
@use "sass:math";
@import "./vars";

.node {
  //background: #5e6565;
  background-color: rgba(15, 15, 15, 0.55) !important;
  border: 1px solid rgb(0, 0, 0) !important;
  border-radius: 20px;
  cursor: pointer;
  box-sizing: border-box;
  width: $node-width;
  min-height: 100px;
  padding-bottom: 6px;
  position: relative;
  user-select: none;


  &:hover {
    background: #333;
  }

  &.selected {
    //border-color: red;
    box-shadow: rgb(203, 116, 3) 0 2px 6px 2px, rgb(201, 177, 68) 0 0 0 5px;
  }

  .title {
    color: white;
    font-family: sans-serif;
    font-size: 18px;
    padding: 6px 0 0;
    text-align: center;
    height: 30px;
    background: radial-gradient(85% 90% at 50% 50%, rgba(48, 180, 36, 0.62) 0%, transparent 80%);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  #leftLineDiv{
    left: 3px;
    margin: 2px 0 0 3px;
    vertical-align: middle;
    padding: 0;
    min-height: 20px;
    text-align: left;
    display: inline-block;
    width: calc($node-width * 0.95 / 2);


  }
  #rightLineDiv{
    right: 3px;
    margin: 2px 0 0 3px;
    vertical-align: top;
    padding: 0;
    min-height: 20px;
    text-align: right;
    display: inline-block;
    width: calc($node-width * 0.95 / 2);
  }
  .output {
    //display: flex;
    //flex-wrap: wrap;
    //position: absolute;
    right: 5px;
    text-align: right;
  }

  .input {
    //display: flex;
    //flex-wrap: wrap;
    left: 5px;
    //position: absolute;
    text-align: left;
  }

  .output-socket {
    text-align: right;
    margin-right: -1px;
    display: inline-block;
  }

  .input-socket {
    text-align: left;
    margin-left: -1px;
    display: inline-block;

  }

  .input-title,
  .output-title {
    vertical-align: middle;
    color: white;
    display: inline-block;
    font-family: sans-serif;
    font-size: 14px;
    margin: $socket-margin;
    line-height: $socket-size;
  }

  .input-control {
    z-index: 1;
    margin-top: 3px;
    margin-bottom: 3px;
    border-radius: 3px;
    margin-left: #{$socket-size + calc($socket-margin / 2)};
    width: calc($node-width - #{$socket-size + 4*$socket-margin});
    display: inline-block;
    text-align: center;
  }

  .control {
    left: 3px;
    margin-top: 3px;
    margin-bottom: 3px;
    border-radius: 3px;
    margin-left: #{$socket-size + calc($socket-margin / 2)};
    width: calc($node-width - #{$socket-size + 4*$socket-margin});
    display: inline-block;
    text-align: center;
  }
}
</style>
