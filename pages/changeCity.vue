<template>
  <div class="page-changeCity">
    <el-row>
      <el-col :sapn="24">
        <iselect/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :sapn="24">
        <hot-city/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :sapn="24">
        <categroy/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Iselect from '@/components/changeCity/iselect'
  import HotCity from '@/components/changeCity/hotCity'
  import Categroy from '@/components/changeCity/categroy'
  export default {
    components: {
      Iselect,
      HotCity,
      Categroy
    }
  }
</script>

<style scoped>

</style>
