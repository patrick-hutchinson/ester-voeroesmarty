module.exports = {
  apps: [
    {
      name: "esther-voeroesmarty", // Name of your app, not the URL
      cwd: "/var/www/esther-voeroesmarty.sanity.studio", // Correct the working directory path
      script: "npm",
      args: "run deploy",
      env: {
        SANITY_PROJECT_ID: "9aph7mv7", // Sanity project ID
      },
    },
  ],
};
