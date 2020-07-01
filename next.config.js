module.exports = () => {
  return {
    env: {
      WP_URL: process.env.WP_URL || "https://strategyprod.wpengine.com",
      BASIC_AUTH: !! process.env.BASIC_AUTH_SECRET,
    },
  };
};
