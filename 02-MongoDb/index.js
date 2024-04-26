const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");

const { type } = require("os");
const app = express();
const PORT = 9000;

//connection
mongoose
  .connect("mongodb://127.0.0.1:27017/youtube-app-1")
  .then(() => console.log("connected"))
  .catch((err) => console.log("Mongo Error", err));

// schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      Unique: true,
    },
    jobTitle: {
      tyoe: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

const userDb = mongoose.model("user", userSchema);

app.use(express.urlencoded({ extended: false }));

const getUserByID = async (req, res) => {
  const userResult = await userDb.findById(req.params.id);
  return res.json(userResult);
};
const updateUserById = (req, res) => {
  const id = Number(req.params.id);
  const userUpdate = users.find((user) => user.id === id);
  if (!userUpdate) {
    return res.json({
      status: "Unsuccesful",
      message: "User with id " + id + " is not found ",
    });
  }
  const userIndex = users.indexOf(userUpdate); // e.g id = 3 , updateIndex = 2;

  users[userIndex] = userUpdate;

  Object.assign(userUpdate, req.body);

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({
      status: "Updated succesfully",
      data: { users: userUpdate }, // or we can write as " data: users[userIndex] "
    });
  });
};

const deleteUserById = (req, res) => {
  const id = Number(req.params.id);
  const deleteUser = users.find((user) => user.id === id);

  if (!deleteUser) {
    return res.json({
      status: "Unsuccesful",
      message: "User with id " + id + " is not found ",
    });
  }

  const deleteIndex = users.indexOf(deleteUser);
  const deletedUser = users.splice(deleteIndex, 1);

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(404).json({
      status: "Deleted succesfully",
      deletedUser,
    });
  });
};

const getHtmlRenderData = async (req, res) => {
  const userResult = await userDb.find({});
  const html = `
  <ul>

  ${userResult
    .map((user) => `<li> ${user.firstName} - ${user.email}</li>`)
    .join("")}

  </ul>
  `;
  res.send(html);
};
const getAllUsers = async (req, res) => {
  const userResult = await userDb.find({});
  return res.json(userResult);
};
const createNewUserByPostMethod = async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "All field are required" });
  }

  const result = await userDb.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  console.log("result", result);
  return res.status(201).json({ msg: "success" });
};

app
  .route("/api/users/:id")
  .get(getUserByID)
  .patch(updateUserById)
  .delete(deleteUserById);

app.route("/api/users").get(getAllUsers).post(createNewUserByPostMethod);

app.get("/users", getHtmlRenderData);

app.listen(PORT, () => {
  console.log(`Server is started at ${PORT}`);
});
