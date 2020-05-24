var UserService = require("./user.service");
var config = require("../../config/environment");

exports.register = function (req, res) {
  var data = req.body;
  UserService.registerUser(data)
    .on("SUCCESS", function () {
      res.status(200).send({
        code: "5000",
        message: "Registered successfully, please visit your registered email to activate your account.",
        email: data.email,
      });
    })
    .on("DUPLICATE", function () {
      res.status(409).send({
        code: 5001,
        message: "User allready exist.",
      });
    })
    .on("INVALID_EMAIL", function () {
      res.status(403).send({
        code: 5002,
        message: "Entered email is invalid.",
      });
    })
    .on("ERROR", function () {
      res.status(404).send({
        code: 5003,
        message: "Error while registering user",
      });
    })
    .on("INCOMPLETE_DATA", function () {
      res.status(422).send({
        code: 5004,
        message: "Please enter complete data of user.",
      });
    })
    .on("PASSWORD_MISMATCH", function () {
      res.status(403).send({
        code: 5005,
        message: "Password and confirm password are not matching.",
      });
    });
};

exports.verifyUser = function (req, res) {
  var data = req.query;
  UserService.verifyUser(data)
    .on("SUCCESS", function () {
      // res.status(200).send({
      //     code: 5000,
      //     message: 'Account verified successfully'
      // });
      res.redirect(
        config.websiteUrl + "/login?message=Account verified successfully"
      );
    })
    .on("ERROR", function (error) {
      // res.status(401).send({
      //     code: 5005,
      //     message:'un-authorized link',
      //     details:error
      // });
      res.redirect(config.websiteUrl + "/error?message=Un-authorized link");
    })
    .on("EXPIRED", function () {
      // res.status(410).send({
      //     code: 5006,
      //     message: 'Account verification link expired.'
      // });
      res.redirect(
        config.websiteUrl + "/error?message=Account verification link expired"
      );
    });
};

exports.login = function (req, res) {
  var data = req.body;
  UserService.loginUser(data)
    .on("SUCCESS", function (data) {
      res.set({ authToken: data.token });
      res
        .status(200)
        .send({
          code: "5000",
          message: "Login successfully.",
          user: data.user[0]
        });
    })
    .on("INVALID_EMAIL", function () {
      res
        .status(403)
        .send({ code: "5001", message: "Entered email is invalid." });
    })
    .on("ERROR", function () {
      res
        .status(404)
        .send({ code: "5002", message: "Error while user loging" });
    })
    .on("INCOMPLETE_DATA", function () {
      res
        .status(422)
        .send({ code: "5003", message: "Please enter complete data of user." });
    })
    .on("USER_NOT_FOUND", function () {
      res.status(404).send({ code: "5004", message: "User not found" });
    });
};
