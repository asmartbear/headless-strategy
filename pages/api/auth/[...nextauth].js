import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  site: process.env.SITE || 'http://localhost:3000',

  // Will supply this below, depending on what's configured
  providers: [],

  // A database is optional, but required to persist accounts in a database
//   database: process.env.DATABASE_URL,
}

console.log("auth: basic secret:", process.env.BASIC_AUTH_SECRET)

// Configure Google Auth
if ( process.env.GOOGLE_CLIENT_ID ) {
  options.providers.push(
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  );
}

// Configure Local Auth
if ( process.env.BASIC_AUTH_SECRET ) {
  options.providers.push(
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
  );
}

function getUserFromCredentials(creds) {
  if (creds.secret === process.env.BASIC_AUTH_SECRET) {
    return true;
  }
  return false;
}

export default (req, res) => NextAuth(req, res, options)