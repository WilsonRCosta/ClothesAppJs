// DON'T DO THIS - THE RIGHT WAY WOULD BE TO SEND THIS TO AN API

const fs = require('browserify-fs');
const file = './json-files/users.json'
const TOKEN_KEY = 'TOKEN_KEY'

const USER_KEY = 'USER_KEY'

export function service() {
    return {
      signup: (username, password) => {
        fs.writeFile(file, JSON.stringify({username, password}), (err, data) => {
          if (err) return err
          sessionStorage.setItem(USER_KEY, JSON.stringify({username, password}))
          sessionStorage.setItem(TOKEN_KEY, `Bearer ${generateToken()}`)
          console.log(JSON.parse(data))
          return data
        })
      },

      login: (username, password) => {
        fs.readFile(file, 'utf-8', (err, data) => {
          if (err) return err
          sessionStorage.setItem(USER_KEY, JSON.stringify({username, password}))
          sessionStorage.setItem(TOKEN_KEY, `Bearer ${generateToken()}`)
          console.log(JSON.parse(data))
          return data
        })
      },

      logout: () => {
          sessionStorage.removeItem(USER_KEY)
          sessionStorage.removeItem(TOKEN_KEY)
      }
    }
}

function generateToken() {
  return Math.random().toString(36).substr(2)
}