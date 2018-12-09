<template>
  <el-row :gutter="15" class="m-header">
    <el-col :span="5">
      <geo/>
    </el-col>
    <el-col :span="5">
      <user/>
    </el-col>
    <el-col :span="14">
      <navbar/>
    </el-col>
  </el-row>
</template>

<script>
  import Geo from './topbar/geo.vue'
  import User from './topbar/user.vue'
  import Navbar from './topbar/nav.vue'
  export default {
    components: {
      Geo,
      User,
      Navbar
    }
  }
</script>

<style lang="scss">
 @import "@/assets/css/public/header/index.scss";
</style>
