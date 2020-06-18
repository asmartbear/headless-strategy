import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  site: process.env.SITE || 'http://localhost:3000',

  // Configure one or more authentication providers
  providers: [

    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    Providers.Credentials({
      authorize: async (credentials) => {
        const user = getUserFromCredentials(credentials) // You need to add this!
        if (user) {
          return Promise.resolve(user)
        } else {
          return Promise.resolve(false)
        }
      }
    })
  ],

  // A database is optional, but required to persist accounts in a database
//   database: process.env.DATABASE_URL,
}

function getUserFromCredentials(creds) {
  if (creds.secret === process.env.MANUAL_AUTH_SECRET) {
    return true;
  }
  return false;
}

export default (req, res) => NextAuth(req, res, options)