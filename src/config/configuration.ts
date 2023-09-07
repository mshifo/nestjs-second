export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  secret: process.env.SECRET,
  database: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:
      process.env.NODE_ENV == 'testing'
        ? process.env.TESTING_DB
        : process.env.DB_NAME,
    synchronize: process.env.NODE_ENV == 'production' ? false : true,
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
  },
});
