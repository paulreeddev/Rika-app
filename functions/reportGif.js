const mysql = require("mysql");
const util = require("util");

const db = mysql.createConnection({
  database: DATABASE_NAME,
  user: USER_NAME,
  username: USER_NAME,
  host: HOST_NAME,
  password: PASSWORD,
  ssl: true,
});

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

exports.handler = async function (event, context) {
  if (context.clientContext.user) {
    const cquery = util.promisify(db.query).bind(db);
    const reactionGifId = JSON.parse(event.body).reactionGifId;
    const contributor = await createIfNotExist(context.clientContext.user);
    const report = JSON.parse(event.body).report;
    let reportGifSql = `INSERT INTO reports (report, reactionGifId, createdDate, contributedById)
    VALUES ('${report}', ${reactionGifId}, CURRENT_TIMESTAMP ,${contributor.id});`;
    const rateGifSqlRows = await cquery(reportGifSql);
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
