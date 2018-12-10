import Router from 'koa-router';
import Redis from 'koa-redis';
import nodeMailer from 'nodemailer';
import User from '../models/users';
import Passport from './utils/passport';
import Email from '../config';
import axios from './utils/axios';

const NODEMAIL = 'nodemail'

let usersRouter = new Router({
  prefix: '/users'
})

let Store = new Redis().client
// 注册
usersRouter.post('/signup', async ctx => {
  const {username, password, email, code} = ctx.request.body

  // 判断code
  if (code) {
    const saveCode = await Store.hget(`${NODEMAIL}${username}`, 'code');
    const saveExpire = await Store.hget(`${NODEMAIL}${username}`, 'expire');
    if (String(code) === String(saveCode)) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已经过期，请重新尝试'
        };
        return false;
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      };
      return false;
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    };
  }
  // 判断用户名
  let user = await User.find({username})
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '账号已经注册'
    };
    return false;
  }

  let nuser = await User.create({
    username,
    password,
    email
  });
  console.log(nuser)
  // 注册成功登录
  if (nuser) {
    let res = await axios.post('/users/signin', {username, password});
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      };
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      };
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    };
  }
})
// 登录
usersRouter.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', (error, user, info, status) => {
    if (error) {
      ctx.body = {
        code: -1,
        msg: error
      };
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        };
        return ctx.login(user);
      } else {
        ctx.body = {
          code: -1,
          msg: info
        };
      }
    }
  })(ctx, next);
})
// 获取验证码
usersRouter.post('/verity', async (ctx, next) => {
  let {username, email} = ctx.request.body
  const saveExpire = Store.hget(`${NODEMAIL}${username}`, 'expire')
  if (saveExpire && +new Date() < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁'
    };
    return false;
  }
  let transporter = nodeMailer.createTransport({
    service: 'qq',
    host: Email.smtp.host,
    post: Email.smtp.post,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass,
    }
  })
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: email,
    user: username
  };

  // 邮件内容
  let mailOption = {
    from: `美团邮件认证 <${Email.smtp.user}>`,
    to: ko.email,
    subject: '《美团网站》注册码',
    html: `您在美团网中注册的邀请码是 ${ko.code}`
  };
  // 发送邮件获取验证码
  await transporter.sendMail(mailOption, (err, info) => {
    if (err) {
      ctx.body = {
        code: -1,
        msg: '邮件发送失败'
      }
      console.log(err);
    } else {
      Store.hmset(`${NODEMAIL}${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email);
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  };
})
// 退出
usersRouter.get('/exit', async (ctx, next) => {
  // 注销
  await ctx.logout()
  // 二次验证
  if (Object.keys(ctx.session.passport).length === 0) {
    ctx.body = {
      code: 0
    };
  } else {
    ctx.body = {
      code: -1
    };
  }
})
// 获取用户名
usersRouter.get('/getUser', async (ctx, next) => {
  if (ctx.session.passport && ctx.session.passport.user) {
    const {username, email} = ctx.session.passport.user;
    ctx.body = {
      user: username,
      email
    };
  } else {
    ctx.body = {
      user: '',
      email: ''
    };
  }
});
export default usersRouter;
