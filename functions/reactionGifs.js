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

// connect to database
// const connect = await db.connect((err) => {
//   if (err) {
//     console.log("unable to connect!");
//     console.log(err);
//   } else {
//     console.log("Connected Successfully!");
//   }
// });

exports.handler = async function (event, context) {
  console.log(event.queryStringParameters.q, event.queryStringParameters.size);
  const query = event.queryStringParameters.q;
  const size = event.queryStringParameters.size
    ? event.queryStringParameters.size
    : 10;
  if (size > 10) {
    size = 10;
  }
  const minimumRating = event.queryStringParameters.rating
    ? event.queryStringParameters.rating
    : 0;
  const duplicate = event.queryStringParameters.dulplicate
    ? event.queryStringParameters.dulplicate
    : false;

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request" }),
    };
  }

  console.log(query, size, minimumRating, duplicate);

  let sql = `select * from reactionGifs where emoji='${query}' and averageRating >= ${minimumRating} limit ${size};`;
  const cquery = util.promisify(db.query).bind(db);
  const rows = await cquery(sql);
  console.log("results for ", sql, rows);
  return {
    statusCode: 200,
    body: JSON.stringify(rows),
  };
};
