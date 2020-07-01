module.exports = () => {
  return {
    env: {
      WP_URL: process.env.WP_URL || "https://strategyprod.wpengine.com",
      MANUAL_AUTH: !! process.env.MANUAL_AUTH_SECRET,
    },
  };
};
