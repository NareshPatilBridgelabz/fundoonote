import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { Container, Card, Snackbar, IconButton } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
// import BodyImages from 'react-body-images'
import CloseIcon from '@material-ui/icons/Close'
import TextField from '@material-ui/core/TextField'
import { registration } from '../controller/apiController'
import { Row, Col } from 'react-grid-system'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAling: 'center',
    color: theme.palette.text.secondary
  }
}))
const theme=createMuiTheme({
 overrides:{
     MuiCard:{
         root:{

         }
     }
 }
})

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      Email: '',
      Password: '',
      snackbarOpen: false,
      snackbarMessage: ''
    }
  }
  handleChange = e =>
    this.setState({
      data: { ...this.state.data, [e.target.id]: e.target.value }
    })
  onSubmit = () => {
    const errors = this.validate(this.state)
    // alert('Submitted')
    console.log(errors)
    console.log('PasswordAgain : ' + this.state.Email)
    if (this.state.Firstname === '') {
      console.log('firstname is empty')
      this.setState({ snackbarOpen: true, snackbarMessage: 'Enter first name' })
    } else if (this.state.Lastname === '') {
      this.setState({ snackbarOpen: true, snackbarMessage: 'Enter last name' })
      console.log('lastname is empty')
    } else if (errors.email || this.state.Email === '') {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'Enter propper email-ID.   '
      })
    } else if (this.state.Country === '') {
      this.setState({ snackbarOpen: true, snackbarMessage: 'Enter country ' })
      console.log('lastname is empty')
    } else if (this.state.Password === '') {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'Enter correct password'
      })
      console.log('password is empty')
    } else if (this.state.Passwordagain === '') {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'Enter same password'
      })
      console.log('requires same password')
    } else {
      let formData = new FormData()
      console.log('formaData in registration.jsx ')
      // console.log(formData)
      formData.append('firstName', this.state.Firstname)
      formData.append('lastname', this.state.Lastname)
      formData.append('email', this.state.Email)
      formData.append('password', this.state.Password)
      formData.append('country', this.state.Country)

      // for (var [key, value] of formData.entries()) {
      //   console.log(key, value)
      // }

      let sendData = {
        email: this.state.Email,
        password: this.state.Password,
      }
      
      console.log(JSON.stringify(sendData));
      registration(sendData)
        .then(response => {
          console.log('response')
          console.log(response)
          if (response.status === 200) {
            this.setState({
              snackbarOpen: true,
              snackbarMessage: "Succefully Registered."
            })
            // this.props.history.push('/login')
            // setTimeout(() => {
            //   this.props.history.push('/login')
            // }, 2000)

            console.log('RESPONSE :', response)
          } else {
            console.log('fgtgybhbyunyuhnjunujuju')
          }
        })
        .catch()
    }
  }

  validate = data => {
    const errors = {}
    if (!/([A-Z0-9a-z_-][^@])+?@[^$#<>?]+?\.[\w]{2,4}/.test(data.Email))
      errors.email = 'Invalid email'

    return errors
  }

  onchangeEmail = event => {
    this.setState({ Email: event.target.value })
  }

  onchangePassword = event => {
    if (event.target.value.match('^[A-Za-z0-9]*$') != null) {
      // console.log("on click function is working", event.target.value)
      this.setState({ Password: event.target.value })
    } else {
      // console.log("on click function is not working", event.target.value)
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'enter correct password'
      })
    }
  }


  SnackbarClose = e => {
    this.setState({ snackbarOpen: false })
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
    console.log(this.setState({ [e.target.name]: e.target.value }))
  }
  handleCloseSnackbar = () => {
    this.setState({ snackbarOpen: false })
  }
  render () {
    const classes = { useStyles }

    return (
      <div className='card_style' style={{
        
        backgroundImage:
          'url(https://www.wallpaperup.com/uploads/wallpapers/2013/07/31/125720/dbd69902189b43062d45d1165907ead8-700.jpg)',
        backgroundSize: '100% 100%'
      }}>
        <Container>
          <Row>
            <Col sm={8}>{/* One of three columns */}</Col>
            <Col sm={4}>
            <MuiThemeProvider theme={theme}>
              <Card
                style={{
                  display: 'flex',
                  justifyContent: 'left-center',
                  flexDirection: 'column',
                  height: '68vh',
                  boxShadow: '0px 0px 10px 2px',
                  marginTop: '100px',
                  paddingBottom: '10px',
                  backgroundImage:
                    'url(https://cdn.hipwallpaper.com/i/10/69/yrxv7k.png)',
                  backgroundSize: '120% 120%'
                }}
              >
                <div className='mainReg'>
                  <div maxWidth='5px' fixed>
                    <form className='Register' onSubmit={this.onSubmit}>
                      <h1 className='' > Login page </h1>

                      <Snackbar
                        style={{
                          backgroundColor: 'teal'
                        }}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center'
                        }}
                        open={this.state.snackbarOpen}
                        autoHideDuration={6000}
                        onClose={this.snackbarOpen}
                        action={
                          <IconButton
                            aria-label='close'
                            color='inherit'
                            onClick={this.handleCloseSnackbar}
                          >
                            <CloseIcon />
                          </IconButton>
                        }
                        message={
                          <span id='message-id'>
                            {' '}
                            {this.state.snackbarMessage}{' '}
                          </span>
                        }
                      >
                        <Alert
                          onClose={this.handleCloseSnackbar}
                          severity='error'
                        >
                          {this.state.snackbarMessage}
                        </Alert>
                      </Snackbar>

                      
                      <div>
                        <TextField
                          required={true}
                          id='Email'
                          label='Email'
                          variant='outlined'
                          size='small'
                          value={this.state.Email}
                          onChange={this.onchangeEmail}
                        />
                      </div>
                      <br></br>

                      <div>
                        <TextField
                          required={true}
                          error={this.state.error}
                          id='Password'
                          label='Password'
                          type='password'
                          variant='outlined'
                          size='small'
                          value={this.state.Password}
                          onChange={this.onchangePassword}
                          className={classes.paper}
                        />
                      </div>
                      <br></br>

                      <div className='row'>
                        <div className='col s6 Reg-button'>
                          <Button
                            variant='outlined'
                            size='medium'
                            color='primary'
                            className={classes.paper}
                            style={{
                              color: 'blue',
                              margin: '10px'
                            }}
                            onClick={this.onSubmit}
                          >
                            Submit
                          </Button>
                        </div>
                        
                      </div>
                    </form>
                  </div>
                </div>
              </Card>
              </MuiThemeProvider>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default withRouter(Login)
