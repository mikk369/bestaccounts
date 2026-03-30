module.exports = {
    apps: [{
      name: "bestaccounts",
      script: "npm",
      args: "start",
      env: {
        PORT: 6770,
        NODE_ENV: "production"
      }
    }]
  };