<template>
  <div class="m-menu">
    <!-- 导航栏 -->
    <dl class="nav" @mouseleave="leavebaba">
      <dt>全部分类</dt>
      <dd
        v-for="item in $store.state.home.menu"
        :key="item.type"
        @mouseenter="enterbaba"
      >
        <i :class="item.type"/>{{item.name}}<span class="arrow"/>
      </dd>
    </dl>
    <!-- 子菜单 -->
    <div
      v-if="kind"
      class="detail"
      @mouseenter="enterKind"
      @mouseleave="leaveKind"
    >
      <template v-for="(item, index) in curdetail.child">
        <h4 :key="index">{{item.title}}</h4>
        <span v-for="v of item.child" :key="v">
          {{v}}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        kind: ''
        // menu:[{
        //   type: 'food',
        //   name: '美食',
        //   child:[{
        //     title: '美食',
        //     child: ['代金券', '甜点饮品','火锅','自助餐','代金券', '甜点饮品','火锅','自助餐']
        //   }]
        // },{
        //   type: 'takeout',
        //   name: '外卖',
        //   child:[{
        //     title: '外卖',
        //     child: ['美团外卖']
        //   }]
        // },{
        //   type: 'hotel',
        //   name: '酒店',
        //   child:[{
        //     title: '酒店星级',
        //     child: ['经济型', '舒适/三星', '高档/四星', '豪华/五星']
        //   }]
        // }]
      }
    },
    computed: {
      curdetail () {
        return this.$store.state.home.menu.filter(item => item.type == this.kind)[0]
      }
    },
    methods: {
      leavebaba () {
        this._timer = setTimeout(() => {
          this.kind = ''
        }, 150)
      },
      enterbaba(e) {
        this.kind = e.target.querySelector('i').className
      },
      enterKind() {
        clearTimeout(this._timer)
      },
      leaveKind() {
        this.kind = ''
      }
    }
  }
</script>
