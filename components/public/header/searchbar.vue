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
            <dd v-for="(item, index) in hotPlace" :key="index">{{item}}</dd>
          </dl>
          <!-- 搜索列表 -->
          <dl v-if="isSearchList" class="searchList">
            <dd v-for="(item, index) in searchList" :key="index">{{item}}~</dd>
          </dl>
        </div>
        <!-- 搜索框下的推荐 -->
        <p class="suggest">
          <a href="#">黑河腰子姐</a>
          <a href="#">黑河腰子姐</a>
          <a href="#">黑河腰子姐</a>
          <a href="#">黑河腰子姐</a>
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
          <li><i class="refund"><p class="txt">吃了退</p></i></li>
          <li><i class="single"><p class="txt">不满意自杀</p></i></li>
          <li><i class="refund"><p class="txt">过期不退</p></i></li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isFocus: false,
        search: '',
        hotPlace: ['来了老弟','来了老弟','来了老弟','来了老弟'],
        searchList: ['好嗨哦','好嗨哦','好嗨哦','好嗨哦','好嗨哦']
      }
    },
    computed: {
      isHotPlace () {
        return this.isFocus && !this.search
      },
      isSearchList() {
        return this.isFocus && this.search
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
      input() {
        console.log('input')
      }
    },
  }
</script>

<style scoped>

</style>
