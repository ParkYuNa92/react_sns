import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    })

    if (!user)
      return res.status('401').json({
        error: '사용자가 발견되지 않았습니다.',
      })

    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: '이메일과 비밀번호가 일치 하지 않습니다.',
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      config.jwtSecret
    )

    res.cookie('t', token, {
      expire: new Date() + 9999,
    })

    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.log(err)
    return res.status('401').json({
      error: '로그인 할수 없습니다.',
    })
  }
}

const signout = (req, res) => {
  res.clearCookie('t')
  return res.status('200').json({
    message: 'signed out',
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth',
})

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!authorized) {
    return res.status('403').json({
      error: '권한이 없습니다.',
    })
  }
  next()
}

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
}
