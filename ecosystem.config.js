module.exports = {
  apps: [
    {
      name: "remote-nas-server",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
