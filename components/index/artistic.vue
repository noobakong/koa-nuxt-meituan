<template>
  <section class="m-istyle">
    <dl>
      <dt>有格调</dt>
      <dd
        :class="{active:kind==='all'}"
        kind="all"
        keyword="景点">全部
      </dd>
      <dd
        :class="{active:kind==='part'}"
        kind="part"
        keyword="美食">约会聚餐
      </dd>
      <dd
        :class="{active:kind==='spa'}"
        kind="spa"
        keyword="丽人">丽人SPA
      </dd>
      <dd
        :class="{active:kind==='movie'}"
        kind="movie"
        keyword="电影">电影演出
      </dd>
      <dd
        :class="{active:kind==='travel'}"
        kind="travel"
        keyword="旅游">品质出游
      </dd>
    </dl>
    <ul class="ibody">
      <li v-for="(item, index) in cur" :key="index">
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img :src="item.img" class="image">
          <ul class="cbody">
            <li class="title">{{item.title}}</li>
            <li class="pos"><span>{{item.pos}}</span></li>
            <li class="price">￥<em>{{item.price}}</em><span>/起</span></li>
          </ul>
        </el-card>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      kind: 'all',
      list: {
        all: [{
          title: '大虾啊啊啊',
          pos: '李想4人餐，提供免费WiFi',
          price: 221,
          img: '//p0.meituan.net/msmerchant/4c295c4d7974bbb163e0778aae993421107668.jpg@368w_208h_1e_1c'
        }],
        part: [{
          title: '约会聚餐',
          pos: '李想4人餐，提供免费WiFi',
          price: 221,
          img: '//p0.meituan.net/msmerchant/4c295c4d7974bbb163e0778aae993421107668.jpg@368w_208h_1e_1c'
        }],
        spa: [{
          title: 'SPAAAAAA',
          pos: '李想4人餐，提供免费WiFi',
          price: 221,
          img: '//p0.meituan.net/msmerchant/4c295c4d7974bbb163e0778aae993421107668.jpg@368w_208h_1e_1c'
        }]
      }
    }
  },
  computed: {
    cur () {
      return this.list[this.kind]
    }
  }
};
</script>

<style lang='scss'>
@import "@/assets/css/index/artistic.scss";
</style>
