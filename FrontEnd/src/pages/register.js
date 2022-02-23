import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";

import {
    Link,

} from "react-router-dom";
import Swal from 'sweetalert2';

const validator = require('validator');

export default function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fullnmae, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [repassword, setRepassword] = useState("");
    const [phone, setPhone] = useState("");


    function ValidateToken() {
        if(!localStorage.getItem("token")) {
            return false;
        }

        //send axios request to server to validate token with custom header
        axios.post("http://localhost:8000/api/user/validatetoken", {},{
            headers: {
                "x-auth-token": localStorage.getItem("token")
            }
        }).then(res => {
                console.log(res);
                console.log(res.data);
                window.location.href = "/#/myaccount";
        }).catch(err => {
                console.log(err);
        });
    }
    
    useEffect(() => {
        console.log("validating token");
        ValidateToken();
    }, []);


    function HandleSubmit(e) {
        //check if fields are not empty
        if (email === "" || password === "" || fullnmae === "" || username === "" || repassword === "" || phone === "") {
            setError("Please enter all fields");
            return;
        }
        if (password !== repassword) {
            setError("Password does not match");
            return;
        }
        if(password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        if(!validator.isEmail(email)) {
            setError("Email is not valid");
            return;
        }
        //username cannot contain numbers only and only symbols
        if(!validator.isAlphanumeric(username)) {
            setError("Username must contain only letters and numbers");
            return;
        }
        
        if(!validator.isMobilePhone(phone,'any')) {
            setError("Phone number is not valid");
            return;
        }

        axios.post("http://localhost:8000/api/user/register", {
            username: username,
            email: email,
            password: password,
            repeatPassword : repassword,
            fullname: fullnmae,
            phone: phone
        }).then((res) => {
            console.log(res.data);
            if (res.data.data) {
                setError("");
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'You have successfully registered',
                })
                setTimeout(() => {
                    window.location.href = "/#/login";
                }, 3000);
                
            } else {
                setError("");
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.message
                })
            }
        }).catch((err) => {
            console.log(err);
            setError("");
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.message
            })
        });
    }
    return (
        <section className="h-100">
            <div className="container h-100">
                <div className="row justify-content-sm-center h-100">
                    <div className="col-5 col-md-6">
                        <div className="text-center my-5">
                        </div>
                        <div className="card shadow-lg">
                            <div className="card-body p-5">
                                <h1 className="fs-4 card-title fw-bold mb-4">Register</h1>
                                <form className="needs-validation">

                                    <div className="mb-3">
                                        {/* section for errors */}
                                        {error ? (
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                            ) : null}
                                        
                                        <label className="mb-2 text-muted">E-Mail Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required />
                                    </div>

                                    <div className="mb-3">
                                        <div className="mb-2 w-100">
                                            <label className="text-muted">Username</label>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="form-control"
                                            placeholder="Enter Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            />
                                    </div>

                                    <div className="mb-3">
                                        <div className="mb-2 w-100">
                                            <label className="text-muted">Full Name</label>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="form-control"
                                            placeholder="Enter Fullname"
                                            value={fullnmae}
                                            onChange={(e) => setFullname(e.target.value)}
                                            />
                                    </div>


                                    <div className="mb-3">
                                        <div className="mb-2 w-100">
                                            <label className="text-muted" >Password</label>
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="form-control"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            />
                                    </div>


                                    <div className="mb-3">
                                        <div className="mb-2 w-100">
                                            <label className="text-muted" >Confirm Password</label>
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="form-control"
                                            placeholder="Re-Enter password"
                                            value={repassword}
                                            onChange={(e) => setRepassword(e.target.value)}
                                            />
                                    </div>

                                    {/* phone number */}
                                    <div className="mb-3">
                                        <div className="mb-2 w-100">
                                            <label className="text-muted" >Phone Number</label>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="form-control"
                                            placeholder="+94766415879 / 0766412759"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            />
                                    </div>



                                    <button onClick={e => HandleSubmit(e)} type="button" className="btn btn-success btn-block">
                                        Register
                                    </button>
                                    
                                </form>
                            </div>
                            <div className="card-footer py-3 border-0">
                                <div className="text-center">
                                    <Link to="/login" className="text-dark">
                                        <span className="fw-bold">Already have an account?  </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </section>
    )
}

