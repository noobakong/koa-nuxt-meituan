<template>
  <div
    :id="id"
    :style="{width:width+'px',height:height+'px',margin:'34px auto'}"
  ></div>
</template>

<script>
  export default {
    props: {
      width: {
        type: Number,
        default: 300
      },
      height: {
        type: Number,
        default: 300
      },
      point: {
        type: Array,
        default: () => {
          return [116.46, 39.92]
        }
      }
    },
    data () {
      return {
        id: `map`,
        key: '435d1f4aaccb0077e46c32955f5b7641',
      }
    },
    watch: {
      point: (val, old) => {
        this.map.setCenter(val)
        this.marker.setPosition(val)
      }
    },
    // 需要拿到window对象，只能在挂载后执行
    mounted () {
      this.id = `map${Math.random().toString().slice(4, 6)}`
      var that = this
      window.onmaploaded = () => {
        let map = new window.AMap.Map(this.id, {
          resizeEnable: true,
          zoom: 11,
          center: this.point
        })
        this.map = map
        window.AMap.plugin('AMap.ToolBar', () => {
          let toolbar = new window.AMap.ToolBar()
          map.addControl(toolbar)
          let marker = new window.AMap.Marker({
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            position: this.point
          })
          this.marker = marker
          marker.setMap(map)
        })
      }
      const url = `https://webapi.amap.com/maps?v=1.4.10&key=${this.key}&callback=onmaploaded`
      let jsapi = document.createElement('script')
      jsapi.charset = 'utf-8'
      jsapi.src = url
      document.head.appendChild(jsapi)
      window.onscroll = function () {
          var Map = document.getElementById(that.id)
          var t = document.documentElement.scrollTop||document.body.scrollTop
          console.log(t)
          if (t > 200) {
            Map.style.position = 'fixed',
            Map.style.top = '-32px'
          } else {
            Map.style.position = 'relative'
            Map.style.top = '0'
          }
        }
    },
    destroyed () {
      window.onscroll=''
    }
  }
</script>
