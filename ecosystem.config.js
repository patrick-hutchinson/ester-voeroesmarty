module.exports = {
  apps: [
    {
      name: 'esther-voeroesmarty.0to9.studio',
      cwd: '/var/www/esther-voeroesmarty.0to9.studio',
      script: 'npm',
      args: 'run deploy',
      env: {
        SANITY_PROJECT_ID: '9aph7mv7'
      },
    },
  ],
};