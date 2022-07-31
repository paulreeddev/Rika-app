# Rika: Power up your app with gifs
Rika collects and provides a quality gifs through a simple API which is used to power up chat based application and comment posts. You can learn more about the project on this [hashnode blog post](https://mulu.hashnode.dev/rika-power-up-your-app-with-gifs)

## Project setup
### Database
Aquire and fill out this variables, this app is tested on Planetscale server less database, you can check it out [here](https://planetscale.com).
```
database: DATABASE_NAME,
user: USER_NAME,
username: USER_NAME,
host: HOST_NAME,
password: PASSWORD,
```

### AWS S3
Policy is need to create, delete and getObject on a bucket, and allow bucket to be accessed public
```
const bucketName = BUCKET_NAME;
const region = REGION;
const accessKeyId = ACCESSKEYID;
const secretAccessKey = SECRETACCESSKEY;
```
## To run the application

if you haven't installed netlify-cli
```
npm install netlify-cli -g
```
### Intall dependencies

```
yarn install
```

### Compiles and hot-reloads for development
```
netlify dev
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

Made as part of [PlanetScale](https://planetscale.com) x [Hashnode](https://hashnode.com) hackathon.
