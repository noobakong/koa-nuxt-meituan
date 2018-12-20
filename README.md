# vue美团

## 前期准备

nuxt官方脚手架
​	解决scss
​	解决bable

redis

mongoose

## 需求分析

使用vuex减少网络请求
​	城市确认
​	用户确认

组件复用

语义化

## 头部

头部组件拆分
​	左中右 -- element分栏间隔

​	搜索框状态 v-if
​		聚焦
​			输入值
​			没输入值	

​		不聚焦

- 善于利用好dom结构来布局，合理的利用html标签来使结构更清晰和简单。
- 设计程序前认真思考怎么拆分组件更加有调理，使开发更简单
- 认真思考交互，将看似复杂都东西简单化实现

## 首页静态

### 菜单的实现

#### 数据组件实现

这里充分的使用组件化思想

- 设立两个同级的dom结构，一是父菜单 二是子菜单 不需要重复大量的dom结构
-  构建良好的数据结构，使得数据能够完美套入模板之中。

#### 显示效果实现

> 巧妙地使用鼠标划入划出事件来判断数据显示的状态

**鼠标划入nav**

`enterbaba` 函数进入  --》 `this.kind`改变 -- 》this.kind控制的子菜单层显示 --》计算属性`curdetail` 改变 --》子菜单随着改变 

**鼠标划出nav**

`leavebaba`函数出发 --》 `this.kind`为空 --》子菜单消失 

> 这里要使用定时器加一个150ms的延迟，解决划入子菜单就消失的问题

**鼠标划入子菜单**

鼠标划入子菜单的时候，清楚定时器，这样子菜单就不会消失了，上述的定时器延迟的150ms就是留给这个的判断时间

**鼠标划出子菜单**

 `this.kind`为空 --》子菜单消失 



## 登录注册接口

- 功能及数据库等模块分析清楚，方便后续开发调用
- element表单组件的简单使用
- passport的使用 （待深入学习）
- 合理的使用await async语法糖简化开发流程
- smtp邮件服务的使用
- 拿数据的时候是使用es6的结构赋值，非常方便



## 首页数据接口

获取数据：

1. 页面加载完成后，使用vue钩子函数再次发送请求

2. 使用ssr，在后台渲染好数据，发到前端页面

### nuxtServerInit 方法

如果在状态树中指定了 `nuxtServerInit` 方法，Nuxt.js 调用它的时候会将页面的上下文对象作为第2个参数传给它（服务端调用时才会酱紫哟）。当我们想将服务端的一些数据传到客户端时，这个方法是灰常好用的。

举个例子，假设我们服务端的会话状态树里可以通过 `req.session.user` 来访问当前登录的用户。将该登录用户信息传给客户端的状态树，我们只需更新 `store/index.js` 如下：

```
actions: {
nuxtServerInit ({ commit }, { req }) {
if (req.session.user) {
commit('user', req.session.user)
}
}
}
```

> 如果你使用_状态树模块化_的模式，只有主模块（即 `store/index.js`）适用设置该方法（其他模块设置了也不会被调用）。

这时[context](https://zh.nuxtjs.org/api/context)被赋予`nuxtServerInit`作为第二个参数，它与`asyncData`或`fetch`方法相同。

`nuxtServerInit` 方法接收的上下文对象和 `fetch` 的一样，但不包括 `context.redirect()` 和 `context.error()`。

> 注意：异步`nuxtServerInit`操作必须返回Promise来通知`nuxt`服务器等待它们。

```
actions: {
async nuxtServerInit({ dispatch }) {
await dispatch('core/load')
}
}
```

### geo

使用ssr来获取当前ip地址

- 编写geo接口 index中引用

- 编写nuxt状态树store中的内容

  - geo模块

  - index模块

    > index中调用nuxtServ erInit

- 更改geo组件的城市数据

  > $store.state.geo.position.city

如法炮制我们可以将menu city等数据接口完善，后续使用

### search

获取搜索相关的数据

- 编写search路由接口，在index中引用
- 编写searchbar.vue
  - 使用loadsh完成输入延迟效果
  - 调整vue文件的变量

这一部分基本都是大同小异，写接口，获取数据，整合页面。

热门地点

​	是通过 geo获取位置 --》请求热门地点接口获得数据 --》 渲染

搜索

​	获取geo位置  + 通过输入框的值 -》 匹配搜索结果



### artistic

在这里获取artistic组件数据，使用了`over`函数

鼠标移动到哪就请求哪的数据

另外在页面mounted的时候主动请求一下，解决首次刷新空数据的情况

**注意：**

我们在向后端请求接口的时候，虽然有规定接口规范，但是为了保证高效性和避免不必要的麻烦，我们再接到数据后，可以使用filter或者map等方法，来将我们的数据包装成为更为我们前台页面所用的数据。





## 切换城市

- element搭建三行布局

- 使用element组件库表单

### 省份选择器

- 如何使省份和城市关联？

  - 城市选择器上加上`:disabled="!city.length"` 当没有城市数据的时候禁止选择
  - `mounted`加载时请求所有的省份数据
  - 使用watch --》 pvalue改变 --》 cvalue改变   

- 远程搜索查询实现

  - 饿了么远程表单使用

  - 完善element远程搜索表单的querySearchAsync方法

    - 使用loadsh组件实现延迟

    - 使用indexOf查询匹配相应的城市

      ```js
      ...
      cb(self.citise.filter(item => item.value.indexOf(query)>-1))
      ...
      ```

### 热门城市

- 使用 dl dt+dd 的dom布局
- 请求热门城市接口获取数据挂载页面即可



### 城市字母分类

> 我们要时刻考虑怎么利用数据结构和合理使用dom节点使我们项目更简洁，而且易维护

- 24个英文字母导航器如何最好的创建

  - dom结构使用dl dt dd的形式 在dd中循环26个英文字母

    ```vue
    <dl class="m-categroy">
        <dt>按拼音首字母选择：</dt>
        <dd v-for="item in list" :key="item">
            <a :href="'#city-'+item">{{item}}</a>
        </dd>
     </dl>
    ```

  - 将字母放在a链接中，使用hash定位

  - 使用字符串的split方法巧妙的创建英文字母数组

    ```js
    list: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    ```

- 创建子项

  - dom仍使用dl dt dd的形式

    ```js
        <dl v-for="item in block" :key="item.title" class="m-categroy-section">
          <dt :id="'city-'+item.title">{{item.title}}</dt>
          <dd>
            <span v-for="c in item.city" :key="c">{{c}}</span>
          </dd>
        </dl>
    ```

  - 在dt上使用id来和上面的hash挑战a链接做匹配

- 如何在mounted挂载时，把乱序的所有城市给转换为按字母排序的城市

  - 使用js-pinyin这个库，将中文转换为拼音

  - 循环遍历city的每一项-》转化为拼音-》截取首字母-》如果首字母a-z范围内，添加到临时对象d中

    > 检查d对象中是否含有首字母拼音的键名，没有则创建此键名，键值为一个数组，有这个键名则push到键值数组中，这样就能到到一个对象，键名为a-z字母，键值为包含子项的数组

  - 将d对象转化为数组

  - 使用sort给数组排序 按照首字母  *使用charCodeAt()将字母转化为数字比较*

  - 将这个数组赋值给this下的block数组

  ```js
  let p,c
  let d = {}
  city.forEach(item => {
      // 转换为拼音
      p=pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0,1)
      // 截取首字母
      c=p.charCodeAt(0)
      // 取a-z
      if (c>96&&c<123) {
          if (!d[p]) {
              d[p] = []
          }
          d[p].push(item.name)
      }
  })
  for (let [k,v] of Object.entries(d)) {
      blocks.push({
          title:k.toUpperCase(),
          city:v
      })
  }
  blocks.sort((a,b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
  })
  
  self.blocks = blocks
  ```

  数据结构很重要！！！

## 产品展示页

### 面包屑

- element面包屑组件
- vuex获取城市
- 父子组件传值keyword获取搜索内容

### 导航条

- 使用两个 dl > dt+dt+dd 的dom结构
- dd dom结构加入iselect组件

### 产品列表

- dl > dd 放操作导航
- ul ＞　item组件放详细产品列表

### 地图功能

- 高德地图开放API
- 生成地图控件
- 加入地图插件

### 重要点

- 这里获取的数据是在nuxt的 asyncData钩子执行的，他的返回值会和vue的data想结合

- **更改数据json的映射关系很容易改**
  **页面dom结构很麻烦**
  **前后端开发的时候，可以不必相互太过依赖**
  **中间进行一层数据操作转化即可。**

- nuxt ayncData钩子整合数据

  ```js
      async asyncData (ctx) {
        // get请求获取keyword
        let keyword = ctx.query.keyword
        // 获取城市
        let city = ctx.store.state.geo.position.city
        let { status, data: { count, pois } } = await ctx.$axios.get('/search/resultByKeywords', {
          params: {
            keyword,
            city
          }
        })
        console.log(pois)
        let { status: status2, data: { areas, types } } = await ctx.$axios.get('/categroy/crumbs', {
          params: {
            city
          }
        })
        // // 数据映射
        if (status === 200 && count > 0 && status2 === 200) {
          return {
            list: pois.filter(item => item.photos.length).map(item => {
              return {
                type: item.type,
                img: item.photos[0].url,
                name: item.name,
                comment: Math.floor(Math.random() * 10000),
                rate: Number(item.biz_ext.rating),
                price: Number(item.biz_ext.cost),
                scene: item.tag,
                tel: item.tel,
                status: '可订明日',
                location: item.location,
                module: item.type.split(';')[0]
              }
            }),
            keyword,
            areas: areas.filter(item => item.type !== '').slice(0, 5),
            types: types.filter(item => item.type !== '').slice(0, 5),
            point: (pois.find(item => item.location).location || '').split(',')
          }
        }
      }
  ```


**注意：**开发过程中处理大量数据的时候，一定要先把数据简单的过滤一遍，将非法的数据剔除。

## 详情页

### 子组件编写

- crumbs 面包屑
- summary 概述信息
- list 套餐列表
  - item子项组件

### detail主页面

**一些需要注意的地方**

- 数据要先过滤一遍，剔除无效项
-  客户端拿不到请求参数，只能在服务器中拿到keyword和type，这里在nuxt的asyncData钩子里获取数据
- asyncData返回的data会和vue中的data做merge

## 购物车

- 安全起见购物车接口使用post

- 点击购买后的流程

  - 客户端通过点击函数createCart函数向服务端请求创建购物车

    - 传入id （mooc数据）和 detail

  - 服务端创建购物车并返回购物车id （cartNo不是上面的id）给客户端

  - 客户端重定向到 cart?id 页面

    - ```js
      window.location.href = `/cart/?id=${id}`
      ```

  - page下的cart页面在asyncData钩子函数下通过ssr的方式获得数据

    - 通过传入ctx.query.body的购物车的id值请求 getCart接口获得数据
    - 在getCart逻辑中，通过查找数据库的id 返回对应的商品数据

  > 点击购买经历了 创建 -》 存库 -》 取库 一系列操作。



## 订单页

- 编写订单model和订单接口
  - order模型的创建
  - `createOrder`和`getOrders`接口的创建
- 在cart.vue中完善submit方法
  - 点击请求`createOrder`方法 传入购物车id 商品数量和价格
  - 服务端根据id查找数据库中的购物车信息，将order数据保存数据库
  - 跳转到order页面
- order页面
  - 使用饿了么tags组件
  - 点击更改v-modle值 实现切换
  - asyncData钩子中，请求getOrders接口 获取所有的order，赋值给list和cur
  - activeNmae和list的改变 都会使cur的数据重新筛选一次
