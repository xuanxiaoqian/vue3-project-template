<template>
  <div class="home">你好我是主页</div>
</template>

<script setup lang="ts">
// import loginApi from '/@/api/login/login';

// loginApi.login({userName:'root',passWord:'123456'}).then(res=>{
//     console.log(res.data);
// })

import usePoint from '/@/hooks/usePoint'

let point = usePoint()
console.log(point)
</script>

<style lang="scss" scoped>
.home {
  color: $assist-color;
}
</style>
