<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <!-- 省份下拉 -->
    <el-select v-model="pvalue" placeholder="省份">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <!-- 城市下拉 -->
    <el-select v-model="cvalue" :disabled="!city.length" placeholder="城市">
      <el-option
        v-for="item in city"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <!-- 城市搜索 -->
    <span class="name">直接搜索:</span>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>

<script>
import _ from 'lodash'
  export default {
    data () {
      return {
        province: [],
        pvalue: '',
        city: [],
        cvalue: '',
        input: '',
        citise:[]
      }
    },
    watch: {
      pvalue: async function(newPvalue) {
        let self = this
        let {status,data:{city}} = await self.$axios.get(`/geo/province/${newPvalue}`)
        if (status === 200) {
          self.city = city.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
          self.cvalue = ''
        }
      }
    },
    async mounted () {
      let self = this
      let {status,data: {province}} = await self.$axios.get('/geo/province')
      if (status === 200) {
        self.province = province.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }
    },
    methods: {
      querySearchAsync:_.debounce(async function (query,cb) {
        let self = this
        if (self.citise.length) {
          cb(self.citise.filter(item => item.value.indexOf(query)>-1))
        } else {
          let {status,data:{city}} = await self.$axios.get('/geo/city')
          if (status === 200) {
            self.citise = city.map(item => {
              return {
                value:item.name
              }
            })
            cb(self.citise.filter(item => item.value.indexOf(query)>-1))
          } else {
            cb([])
          }
        }
      },200),
      async handleSelect (item) {
        this.$store.state.geo.position.city = item.value
        const { status: status3, data: { result } } = await this.$axios.get('/search/hotPlace', {
          params: {
            city: this.$store.state.geo.position.city.replace('市', '')
          }
        })
        this.$store.commit('home/setHotPlace', status3 === 200 ? result : [])
      }
    },
  }
</script>

<style lang="scss">
  @import "@/assets/css/changecity/iselect.scss";
</style>
