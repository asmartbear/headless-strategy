module.exports = () => {
  return {
    env: {
      WP_URL: process.env.WP_URL || "https://strategyprod.wpengine.com",
    },
  };
};
