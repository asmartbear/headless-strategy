module.exports = () => {
  return {
    env: {
      WP_URL: process.env.WP_URL || "https://strategyprod.wpengine.com",
      BASIC_AUTH: !! process.env.BASIC_AUTH_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      SITE: process.env.SITE,
    },
  };
};
