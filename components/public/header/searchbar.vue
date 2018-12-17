<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3" class="left">
        <img src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png" alt="美团">
      </el-col>
      <el-col :sapn="15" class="center">
        <!-- 搜索框 -->
        <div class="wrapper">
          <el-input
            v-model="search"
            placeholder="吃啥子嘛"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="input"
          ></el-input>
          <button class="el-button el-button--primary"><i class="el-icon-search"/></button>
          <!-- 热门推荐 -->
          <dl v-if="isHotPlace" class="hotPlace">
            <dt>热门搜索</dt>
            <dd v-for="(item, index) in hotPlace" :key="index">{{item.name}}</dd>
          </dl>
          <!-- 搜索列表 -->
          <dl v-if="isSearchList" class="searchList">
            <dd v-for="(item, index) in searchList" :key="index">{{item.name}}</dd>
          </dl>
        </div>
        <!-- 搜索框下的推荐 -->
        <p class="suggest">
          <a v-for="(item, index) in hotPlace" :key="index">{{item.name}}</a>
        </p>
        <!-- 导航 -->
        <ul class="nav">
          <li>
            <nuxt-link to="/" class="takeout">美团外卖</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="movie">瞄眼电影</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="hotel">美团钟点房</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="apartment">民宿/公寓</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="business">商家入坑</nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" class="right">
        <ul class="security">
          <li><i class="refund"></i><p class="txt">吃了退</p></li>
          <li><i class="single"></i><p class="txt">不满意自杀</p></li>
          <li><i class="refund"></i><p class="txt">过期不退</p></li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    data() {
      return {
        isFocus: false,
        search: '',
        // hotPlace: this.$store.state.home.hotPlace.slice(0,6),
        searchList: []
      }
    },
    computed: {
      isHotPlace () {
        return this.isFocus && !this.search
      },
      isSearchList() {
        return this.isFocus && this.search
      },
      hotPlace () {
        return this.$store.state.home.hotPlace.slice(0,6)
      }
    },
    methods: {
      handleFocus() {
        this.isFocus = true
      },
      handleBlur() {
        setTimeout(() => {
          this.isFocus = false
        }, 300)
      },
      input:_.debounce(async function() {
        console.log('aaa')
        let self = this
        let city = self.$store.state.geo.position.city.replace('市', '')
        self.searchList = []
        let {status,data: {top}} = await self.$axios.get('/search/top', {
          params: {
            input: self.search,
            city
          }
        })
        self.searchList = top.length ? top.slice(0,10) : [{name:'你搜的是啥啊~木有找到QAQ'}]
      },300)
    },
  }
</script>

<style scoped>

</style>
