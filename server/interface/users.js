import Router from 'koa-router'
// 用于管理多个人申请验证码的负载均衡问题，这里如果使用hash表来管理的话，会出现很多性能问题
import Redis from 'koa-redis'
// 基于node发送邮件的一个包
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from './utils/axios'

let router = new Router({
  prefix: '/users',
})

let Store = new Redis().client


/*
注册接口
 */
router.post('/signup',async (ctx) => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body

  if (code) { // 用户输入验证码
    // 给用户发验证码的同时，会将验证码和过期时间存放到redis中，这里将其取出来和用户输入的code做对比
    const saveCode = await Store.hget(`nodemail:${username}`,'code')
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if(code === saveCode) { // 验证码正确
      if(new Date().getTime() -saveExpire > 0) { // 判断是否过期
        ctx.body={
          code: -1,
          msg: '验证码过期啦~~ 重新获取吧'
        }
        return false
      }
    } else { // 验证阿妈错误
      ctx.body= {
        code: -1,
        msg: '验证码不对哦'
      }
    }
  } else { // 用户没填验证码
    ctx.body = {
      code: -1,
      msg: '请填写验证码啊啊啊啊'
    }
  }

  // 查库如果用户名存在
  let user = await User.find({
    username
  })
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '用户名已经被注册了哦'
    }
    return
  }

  // 存入数据库
  let newuser = await User.create({
    username,
    password,
    email
  })
  // console.log(newuser)
  if(newuser) { // 写库成功
    let res = await axios.post('/users/signin', { // 调到登录接口
      username,
      password
    })
    if (res.data&& res.data.code === 0) { // 接口响应正常
      ctx.body = {
        code: 0,
        msg: '注册成功啦啦',
        user: res.data.user
      }
    } else { // 响应失败
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else { // 写库失败
    ctx.body = {
      code: -1,
      msg: '注册出现问题导致失败'
    }
  }
})


/*
登录接口
 */
router.post('/signin', async (ctx, next) => {
  // 调用local策略
  return Passport.authenticate('local', (error, user, info, status) => {
    if (error) {
      ctx.body = {
        code: -1,
        msg: error
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})


/*
获取验证码接口
 */
router.post('/verify', async (ctx,next) => {
  let username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`,'expire')
  if (new Date().getTime() - saveExpire < 0) { // 没过期的时候
    ctx.body = {
      code: -1,
      msg: '您已经请求过验证码啦啦啦，快去邮箱看看！'
    }
    return false
  }
  /*
  发邮件相关的信息
   */
  // 发送对象
  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user:Email.smtp.user,
      pass:Email.smtp.pass
    }
  })

  // 接收对象
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email:ctx.request.body.email,
    user:ctx.request.body.username
  }

  // 邮件内容
  let mailOptions = {
    from: `"好嗨哦~" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '<<来了~老哥~~ 注册码>>',
    html: `您在黑河腰子姐注册的邀请码是 ${ko.code}`,
  }

  await transporter.sendMail(mailOptions,(err,info) => {
    if (err) {
      return console.log(err)
    } else {
      // 将信息存入redis
      Store.hmset(`nodemail:${ko.user}`,'code',ko.code,'expire',ko.expire,'email',ko.email)
    }
  })

  ctx.body= {
    code: 0,
    msg: '验证码已发送，耐心等待哦~ 有限期一分钟哦'
  }
})



/*
退出
 */
 router.get('/exit',async (ctx,next) => {
   await ctx.logout()
   if (!ctx.isAuthenticated()) {
     ctx.body={
       code: 0
     }
   } else {
     ctx.body = {
       code: -1
     }
   }
 })

 /*
获取用户名
 */
router.get('/getUser', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const {username,email} = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

export default router
