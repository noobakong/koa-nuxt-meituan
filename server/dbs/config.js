export default {
  dbs: 'mongodb://127.0.0.1:27017/meituan',
  redis: {
    get host () {
      return '127.0.0.1'
    },
    get port () {
      return 6379
    }
  },
  // 邮件服务
  smtp: {
    get host() {
      return 'smtp.qq.com'
    },
    get user() {
      return '2492161235@qq.com'
    },
    // qq邮箱设置的授权码
    get pass() {
      return 'dlzpsnenqkkjdhhe'
    },
    // 生成验证码
    get code() {
      return () => {
        return Math.random().toString(16).slice(2,6).toUpperCase()
      }
    },
    // 生成过期时间
    get expire() {
      return () => {
        return new Date().getTime() + 60*1000
      }
    }
  },
}
