// database connection
const dbconnection = require("../Database/databaseconfig");
const { v4: uuidv4 } = require("uuid");
async function get_all_questions(req, res) {
  try {
    const [rows] = await dbconnection.query(
      `SELECT 
         questions.questionid, 
         questions.userid, 
         questions.title, 
         questions.tag, 
         questions.description,
         users.username, 
         DATE_FORMAT(questions.created_at, '%Y-%m-%dT%H:%i:%s') AS created_at
       FROM questions
       INNER JOIN users ON questions.userid = users.userid
       WHERE questions.is_deleted = 0
       ORDER BY questions.created_at ASC`
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No questions found",
      });
    }

    res.status(200).json({
      status: "success",
      total_questions: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching questions",
      error: error.message,
    });
  }
}

async function get_single_question(req, res) {
  const { questionid } = req.params; // path variable

  // Validate questionid
  if (!questionid ) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or missing question_id.",
    });
  }

  try {
    const [rows] = await dbconnection.query(
      `SELECT questions.questionid, questions.userid, questions.title, questions.tag, questions.description,
             users.username
      FROM questions
      INNER JOIN users ON questions.userid = users.userid
      WHERE questions.questionid = ? AND questions.is_deleted = 0
    `,
      [questionid]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Question not found",
      });
    }

    // Return the single question
    res.status(200).json({
      status: "success",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching the question",
      error: error.message,
    });
  }
}

async function post_question(req, res) {
  const { title, tag, description } = req?.body;
  // const title = req?.body?.title;
  // const questionid = req?.body?.questionid;
  // const tag = req?.body?.tag;
  // const description = req?.body?.description;

  //  Validate request body
  if (!title || title.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Title is required.",
    });
  }
  if (!description || description.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Description is required.",
    });
  }

  if (!tag || tag.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Tag is required.",
    });
  }

  try {
    //  Insert new question
    const questionid = uuidv4();
    const [result] = await dbconnection.query(
      `INSERT INTO questions (questionid,userid, title, tag, description) VALUES (?,?, ?, ?, ?)`,
      [questionid,req.user.userid, title, tag, description]
    );

    // console.log("Result =================", result);

    //  Respond with 201 Created
    res.status(201).json({
      status: "success",
      message: "Question created successfully",
      data: {
        questionid: result.questionid,
        userid: req.user.userid,
        title,
        tag,
        description,
      },
    });
  } catch (error) {
    console.error(error);
    //  Server error handling
    res.status(500).json({
      status: "error",
      message: "Server error while creating question",
      error: error.message,
    });
  }
}
async function update_question(req, res) {
  const { questionid } = req.params;
  const { title, description, tag } = req.body;
  const userid = req.user.userid;

  try {
    //  Check if question exists
    const [rows] = await dbconnection.query(
      "SELECT * FROM questions WHERE questionid = ? AND is_deleted = 0",
      [questionid]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found or already deleted",
      });
    }

    //  Check if user owns this question
    if (rows[0].userid !== userid) {
      return res.status(403).json({
        status: "fail",
        message: "You are not allowed to update this question",
      });
    }

    //  Trim inputs to prevent false "no changes"
    const newTitle = title?.trim() ?? rows[0].title;
    const newDescription = description?.trim() ?? rows[0].description;
    const newTag = tag?.trim() ?? rows[0].tag;

    //  Check if nothing changed
    if (
      newTitle === rows[0].title &&
      newDescription === rows[0].description &&
      newTag === rows[0].tag
    ) {
      return res.json({
        status: "no_change",
        message: "No changes made to the question",
      });
    }

    //  Update only if something changed
    await dbconnection.query(
      "UPDATE questions SET title = ?, description = ?, tag = ? WHERE questionid = ?",
      [newTitle, newDescription, newTag, questionid]
    );

    return res.json({
      status: "success",
      message: "Question updated successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "fail",
      message: "Server error",
    });
  }
}

async function delete_question(req, res) {
  const { questionid } = req.params;
  const userid = req.user.userid;

  try {
    // Check if question exists and belongs to user
    const [rows] = await dbconnection.query(
      "SELECT * FROM questions WHERE questionid = ? AND is_deleted = 0",
      [questionid]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({
          status: "fail",
          message: "Question not found or already deleted",
        });
    }

    if (rows[0].userid !== userid) {
      return res
        .status(403)
        .json({
          status: "fail",
          message: "You are not allowed to delete this question",
        });
    }

    // Soft delete
    await dbconnection.query(
      "UPDATE questions SET is_deleted = 1 WHERE questionid = ?",
      [questionid]
    );

    return res.json({
      status: "success",
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "fail", message: "Server error" });
  }
}


module.exports = {
  get_all_questions,
  get_single_question,
  post_question,
  update_question,
  delete_question
};
