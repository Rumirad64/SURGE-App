
const validator = require('validator');
const argon2 = require('argon2');

module.exports = class UserModel {         //Little of OOP :)
    constructor(body) {
        this.username = body.username;
        this.password = body.password;
        this.repeatPassword = body.repeatPassword;
        this.email = body.email;
        this.phone = body.phone;
        this.fullname = body.fullname;
        //console.log(this);
    }
    validate() {
        //check one of these fields is empty
        if (!this.username || !this.password || !this.email || !this.phone || !this.fullname || !this.repeatPassword) {
            throw new Error("Bad request! One or more fields are empty");
        }
        //check if password and repeat password are the same
        if (this.password.trim() !== this.repeatPassword.trim()) {
            throw new Error("Passwords do not match");
        }
        //check if email is valid
        if (!validator.isEmail(this.email)) {
            throw new Error("Invalid Email");
        }
        //check if phone is valid
        if (!validator.isMobilePhone(this.phone, 'any')) {
            throw new Error("Invalid phone number");
        }
        if(this.username.length < 4){
            throw new Error("Username must be at least 4 characters long");
        }
        if(this.password.trim().length < 4){
            throw new Error("Password must be at least 8 characters long");
        }
    }

    async hashPassword() {
        try{
        const hash = await argon2.hash(this.password); //? why do we stick to bcrypt? :) lets try modern hashing algorithms
        this.password = hash;
        }catch(err){
            throw new Error(err);
        }
    }

    //? returns JSON object with user data
    GetUser() {
        return this;
    }
}
