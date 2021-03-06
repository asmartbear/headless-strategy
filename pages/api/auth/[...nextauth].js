import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  site: process.env.NODE_ENV === "development" ? "localhost:3000" : 'https://h0ylvht5jmugz6jwyotc0itl4.js.wpenginepowered.com/',

  // Will supply this below, depending on what's configured
  providers: [],

  // A database is optional, but required to persist accounts in a database
//   database: process.env.DATABASE_URL,
}

// console.log("auth-api: site=",options.site," env=",process.env,", google client ID=",process.env.GOOGLE_CLIENT_ID)

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "foo";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "bar";

// Configure Google Auth
if ( GOOGLE_CLIENT_ID ) {
  options.providers.push(
    Providers.Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
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