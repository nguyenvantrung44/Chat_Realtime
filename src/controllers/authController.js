import {validationResult} from "express-validator/check";
import {auth} from "./../services/index";
import {transSuccess} from "./../../lang/vi";

let getLoginRegister = (req,res)=>{
  return res.render("auth/master",{
    errors: req.flash("errors"),
    success: req.flash("success")
  });
};

let postRegister = async (req, res) => {
  let errorArr = [];
  let successArr = [];

  let validationErrors = validationResult(req); // trả về false nếu có lỗi xảy ra
                                                /** validationErrors.mapped() trả về dữ liệu các-
                                                 trường và các lỗi msg */  
  if(!validationErrors.isEmpty()){
    let errors = Object.values(validationErrors.mapped());

    errors.forEach(item => {
      errorArr.push(item.msg);
    });

    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
  try {
    let createUserSuccess = await auth.register(req.body.email, req.body.gender,req.body.password, req.protocol,req.get("host"));
    successArr.push(createUserSuccess);
    req.flash("success", successArr);
    return res.redirect("/login-register");
  } catch (error) {
    errorArr.push(error);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};

let verifyAccount = async (req, res) => {
  let errorArr = [];
  let successArr = [];
  try {
    let verifySuccess = await auth.verifyAccount(req.params.token);
    successArr.push(verifySuccess);
    req.flash("success", successArr);
    return res.redirect("/login-register");
  } catch (error) {
    errorArr.push(error);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};

let getLogOut = (req, res) => {
  req.logout(); //remove session passport
  req.flash("success", transSuccess.logout_success);
  return res.redirect("/login-register");
};

// check xem da login hay chua ?
let checkLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    return res.redirect("/login-register");
  }
  next();
};

// check xem da logout hay chua ?
let checkLoggedOut = (req, res, next) => {
  if(req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};



module.exports = {
  getLoginRegister : getLoginRegister,
  postRegister: postRegister,
  verifyAccount: verifyAccount,
  getLogOut: getLogOut,
  checkLoggedIn: checkLoggedIn,
  checkLoggedOut: checkLoggedOut
};
