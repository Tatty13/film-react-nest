const configuration = () => ({
  database: {
    driver: process.env.DATABASE_DRIVER,
    url: process.env.DATABASE_URL,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  port: Number(process.env.PORT) || 3000,
});

export default configuration;
