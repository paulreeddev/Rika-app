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
    const rating = JSON.parse(event.body).rating;

    // check if the user already rated the gif before
    let gifRatingsql = `SELECT id FROM ratings where reactionGifId=${reactionGifId} AND contributedById=${contributor.id};`;
    const gifRatingRows = await cquery(gifRatingsql);
    if (gifRatingRows.length != 0) {
      // update existing rating
      let updateReactionGifsql = `UPDATE ratings
    SET rating = ${rating}
    WHERE reactionGifId=${reactionGifId} AND contributedById=${contributor.id};`;
      const updateReactionGifRows = await cquery(updateReactionGifsql);
    } else {
      // insert into ratings
      let rateGifSql = `INSERT INTO ratings (rating, reactionGifId, createdDate, contributedById)
VALUES (${rating}, ${reactionGifId}, CURRENT_TIMESTAMP ,${contributor.id});`;
      const rateGifSqlRows = await cquery(rateGifSql);
    }

    // get average rating
    let averageRatingsql = `SELECT AVG(rating) FROM ratings where reactionGifId=${reactionGifId};`;
    const averageRatingRows = await cquery(averageRatingsql);
    const averageRating = averageRatingRows[0]["AVG(rating)"];
    if (averageRating) {
      let updateReactionGifsql = `UPDATE reactionGifs
    SET averageRating = ${averageRating}
    WHERE id = ${reactionGifId};`;
      console.log(updateReactionGifsql);
      const updateReactionGifRows = await cquery(updateReactionGifsql);
    }
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorised user" }),
    };
  }
  return {
    statusCode: 204,
  };
};
