module.exports = {
  apps: [
    {
      name: "nas-server",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
