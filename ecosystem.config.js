module.exports = {
  apps: [
    {
      name: "https://esther-voeroesmarty.sanity.studio",
      cwd: "/var/www/esther-voeroesmarty.sanity.studio",
      script: "npm",
      args: "run deploy",
      env: {
        SANITY_PROJECT_ID: "9aph7mv7",
      },
    },
  ],
};
