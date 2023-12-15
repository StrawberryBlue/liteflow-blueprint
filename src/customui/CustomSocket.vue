<template>
  <div class="socket" :title="data.name"></div>
</template>

<script>
export default {
  props: ['data']
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
