<template>
  <a-button
      @pointerdown.stop=""
      @dblclick.stop=""
      @click="data.onClick"
  >{{ data.label }}</a-button>
</template>

<script>
import { Button } from "ant-design-vue";

export default {
  props: ['data'],
  created() {
    console.log(this.data)
  },
  components: {
    AButton: Button
  }
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import "./vars";

.socket {
  display: inline-block;
  cursor: pointer;
  border: 1px solid #ffffff;
  width: $socket-size;
  height: $socket-size;
  vertical-align: middle;
  background: rgba(255, 255, 255, 0.28);
  z-index: 2;
  box-sizing: border-box;
  border-radius: 30%;

  &:hover {
    background: #4cd326;
  }
}
</style>
