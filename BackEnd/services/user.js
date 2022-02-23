const UserSchema = require("../models/userSchema.js");
const UserModel = require("../models/UserModel");

const jwt = require("jsonwebtoken");
const argon2 = require('argon2');

const RegisterUser = async (body) => {
	console.log("In Register()");
	const newuser = new UserModel(body);
	try {
		newuser.validate();
		await newuser.hashPassword();
	} catch (err) {
		console.log(err);
		throw new Error(err);
	}
	try {
		//find email or username already in db
		const exist = await UserSchema.findOne({ $or: [{ email: newuser.email }, { username: newuser.username }], });
		if (exist) {
			throw new Error("Username or Email already exists");
		}
		const newUser = new UserSchema(newuser.GetUser());
		const user = await newUser.save();
		return user;
	}
	catch (err) {
		console.log(err);
		throw new Error(err);
	}
};

const LoginUser = async (body) => {
	let { username, password } = body;
	if (!username || !password) {
		throw new Error("Username or Password is missing");
	}
	try {
		//find user in db by username or email
		const user = await UserSchema.findOne({ $or: [{ email: username }, { username: username }] });
		if (!user) {
			throw new Error("Username or Email not found");
		}
		//compare password
		const match = await argon2.verify(user.password, password);
		if (!match) {
			throw new Error("Password is incorrect");
		}
		const token = jwt.sign({
			_id: user._id,
			username: user.username,
			email: user.email
		}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
		return token;
	} catch (err) {
		console.log(err);
		throw new Error(err);
	}
};

const GetUser = async (id) => {
	try {
		//get user from db only username email fullname phone field by _id
		const user = await UserSchema.findById(id, { username: 1, email: 1, fullname: 1, phone: 1 });
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	} catch (err) {
		console.log(err);
		throw new Error(err);
	}
};

const UpdateUser = async (jwtpayload, body) => {
	const newuser = new UserModel(body);
	try {
		newuser.validate();  // all users are evil
		await newuser.hashPassword();
	}
	catch (err) {
		throw new Error(err);
	}
	const _id = jwtpayload._id;  //id comes from auth middleware

	newuser.username = jwtpayload.username; //! disable username change by overwriting with old username

	//find email is already in db and not the same as the current user
	const user = await UserSchema.findOne({ $and: [{ email: newuser.email }, { _id: { $ne: _id } }] });
	if (user) {
		throw new Error("Email already exists");
	}
	const newUser = await UserSchema.findByIdAndUpdate(_id, { $set: newuser.GetUser() }, { new: true });
	return newUser;
};




//export Register function
exports.RegisterUser = RegisterUser;
exports.LoginUser = LoginUser;
exports.GetUser = GetUser;
exports.UpdateUser = UpdateUser;
