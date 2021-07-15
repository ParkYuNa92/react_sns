import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import auth from './../auth/auth-helper'
import { Link, withRouter } from 'react-router-dom'

const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: '#ffa726' }
  else return { color: '#ffffff' }
}
const Menu = withRouter(({ history }) => (
  <AppBar position='static'>
    <Toolbar>
      <Typography variant='h6' color='inherit'>
        MERN 소셜
      </Typography>
      <Link to='/'>
        <IconButton aria-label='홈' style={isActive(history, '/')}>
          <HomeIcon />
        </IconButton>
      </Link>
      {!auth.isAuthenticated() && (
        <span>
          <Link to='/signup'>
            <Button style={isActive(history, '/signup')}>회원가입</Button>
          </Link>
          <Link to='/signin'>
            <Button style={isActive(history, '/signin')}>로그인</Button>
          </Link>
        </span>
      )}
      {auth.isAuthenticated() && (
        <span>
          <Link to={'/user/' + auth.isAuthenticated().user._id}>
            <Button style={isActive(history, '/user/' + auth.isAuthenticated().user._id)}>나의 프로필</Button>
          </Link>
          <Button
            color='inherit'
            onClick={() => {
              auth.clearJWT(() => history.push('/'))
            }}
          >
            로그아웃
          </Button>
        </span>
      )}
    </Toolbar>
  </AppBar>
))

export default Menu
