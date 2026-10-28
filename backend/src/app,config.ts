const configuration = () => ({
  database: {
    driver: process.env.DATABASE_DRIVER,
    url: process.env.DATABASE_URL,
  },
  port: Number(process.env.PORT) || 3000,
});

export default configuration;
