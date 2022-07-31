var cuid = require("cuid");
const mysql = require("mysql");
const S3 = require("aws-sdk/clients/s3");
const util = require("util");

const bucketName = BUCKET_NAME;
const region = REGION;
const accessKeyId = ACCESSKEYID;
const secretAccessKey = SECRETACCESSKEY;

const db = mysql.createConnection({
  database: DATABASE_NAME,
  user: USER_NAME,
  username: USER_NAME,
  host: HOST_NAME,
  password: PASSWORD,
  ssl: true,
});

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// connect to database
// db.connect((err) => {
//   if (err) {
//     console.log("unable to connect!");
//     console.log(err);
//   } else {
//     console.log("Connected Successfully!");
//   }
// });

// uploads a file to s3
function uploadFile(file) {
  const uploadParams = {
    Bucket: bucketName,
    Body: file.content,
    Key: cuid() + "_" + file.filename,
  };

  return s3.upload(uploadParams).promise();
}
// exports.uploadFile = uploadFile;

// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}

async function createIfNotExist(user) {
  const cquery = util.promisify(db.query).bind(db);
  let getUsersql = `select * from contributors where netlifyUserId='${user.sub}';`;
  const users = await cquery(getUsersql);
  console.log(user);
  if (users.length > 0) {
    return users[0];
  }

  let createUserSql = `INSERT INTO contributors (netlifyUserId,username, email, createdDate)
    VALUES ('${user.sub}', '${user.user_metadata.full_name}', '${user.email}', CURRENT_TIMESTAMP);`;
  const createdUser = await cquery(createUserSql);
  console.log("created a new user");
  return await createIfNotExist(user);
}

const { parse } = require("aws-multipart-parser");
exports.handler = async function (event, context) {
  if (context.clientContext.user) {
    const formData = parse(event, true);
    const data = JSON.parse(formData.data);
    const file = formData["files.gif"];
    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "gif must not be null." }),
      };
    } else if (file.contentType != "image/gif") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid file type." }),
      };
    }
    const contributor = await createIfNotExist(context.clientContext.user);
    const uploadResult = await uploadFile(file);
    const emoji = decodeURIComponent(escape(data.emoji));
    const filePath = uploadResult.Location;
    let sql = `INSERT INTO reactionGifs (emoji, gifFilePath, createdDate, contributedById) VALUES ('${emoji}', '${filePath}', CURRENT_TIMESTAMP,${contributor.id});`;
    const dbResult = await db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return {
          statusCode: 500,
          body: JSON.stringify(err),
        };
      }
    });
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorised user" }),
    };
  }
  return {
    statusCode: 201,
  };
};
