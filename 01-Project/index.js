const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 9000;

app.use(express.urlencoded({ extended: false }));

const getUserByID = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
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

const getHtmlRenderData = (req, res) => {
  const html = `
  <ul>

  ${users.map((user) => `<li> ${user.first_name} </li>`).join("")}

  </ul>
  `;
  res.send(html);
};
const getAllUsers = (req, res) => {
  return res.json(users);
};
const createNewUserByPostMethod = (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Success", id: users.length });
  });
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
