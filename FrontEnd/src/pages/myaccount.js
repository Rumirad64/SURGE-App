import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";

import {
    Link,

} from "react-router-dom";

import Swal from 'sweetalert2';

const validator = require('validator');

export default function MyAccount() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [repassword, setRepassword] = useState("");
    const [phone, setPhone] = useState("");

    function ValidateToken() {
        if (!localStorage.getItem("token")) {
            window.location.href = "/#/login";
        }

        //send axios request to server to validate token with custom header
        axios.post("http://localhost:8000/api/user/validatetoken", {}, {
            headers: {
                "x-auth-token": localStorage.getItem("token")
            }
        }).then(res => {
            console.log(res);
            console.log(res.data);
        }).catch(err => {
            console.log(err);
            window.location.href = "/#/login";
        });
    }
    //function on load
    useEffect(() => {
        console.log("validating token");
        ValidateToken();

        //get user info
        axios.get("http://localhost:8000/api/user/me", {
            headers: {
                "x-auth-token": localStorage.getItem("token")
            }
        }).then(res => {
            console.log(res.data);
            setFullname(res.data.data.fullname);
            setUsername(res.data.data.username);
            setPhone(res.data.data.phone);
            setEmail(res.data.data.email);
            setPassword("");
            setRepassword("");

        }).catch(err => {
            console.log(err);
        }
        );
    }, []);

    function HandleSubmit(e) {

        //check if fields are not empty
        if (email === "" || password === "" || fullname === "" || username === "" || repassword === "" || phone === "") {
            setError("Please enter all required fields");
            return;
        }
        if (password !== repassword) {
            setError("Password does not match");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        if (!validator.isEmail(email)) {
            setError("Email is not valid");
            return;
        }
        //username cannot contain numbers only and only symbols
        if (!validator.isAlphanumeric(username)) {
            setError("Username must contain only letters and numbers");
            return;
        }

        if (!validator.isMobilePhone(phone, 'any')) {
            setError("Phone number is not valid");
            return;
        }

        

        axios.post("http://localhost:8000/api/user/update", {
            username: username,
            email: email,
            password: password,
            repeatPassword: repassword,
            fullname: fullname,
            phone: phone
        }, {
            headers: {
                "x-auth-token": localStorage.getItem("token")
            }
        }).then((res) => {
            console.log(res.data);
            if (res.data.data) {
                setError("");
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: res.data.message
                });
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.message
                });
            }
        }).catch((err) => {
            console.log(err);
            setError(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            });
        });
    }

    return (
        <section className="h-100">
            <div className="container h-100">
                <div className="row justify-content-sm-center h-100">
                    <div className="col-5 col-md-10">
                        <div className="text-center my-5">
                        </div>
                        <div className="card shadow-lg">
                            <div className="card-body p-5">
                                <h1 className="fs-4 card-title fw-bold mb-4">Hi {username} ! You can edit your info here !</h1>
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
                                            <label className="text-muted">Username. <span className='text-danger'>You cannot change it!</span> </label>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="form-control"
                                            placeholder="Enter Username"
                                            value={username}
                                            disabled={true}
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
                                            value={fullname}
                                            onChange={(e) => setFullname(e.target.value)}
                                        />
                                    </div>


                                    <div className="mb-3">
                                        <div className="mb-2 w-100">
                                            <label className="text-muted" >New Password</label>
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="form-control"
                                            placeholder="Enter New Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>


                                    <div className="mb-3">
                                        <div className="mb-2 w-100">
                                            <label className="text-muted" >Confirm New Password</label>
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="form-control"
                                            placeholder="Confirm New password"
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
                                            placeholder="+94766415879"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>



                                    <button onClick={e => HandleSubmit(e)} type="button" className="text-white btn btn-warning btn-block">
                                        Save Changes
                                    </button>

                                </form>
                            </div>
                            <div className="card-footer py-3 border-0">
                                <div className="text-center">
                                    {/* logout button */}
                                    <button onClick={() => {
                                        Swal.fire({
                                            title: 'Are you sure?',
                                            text: "You want to logout?",
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Yes, logout!'
                                        }).then((result) => {
                                            if (result.value) {
                                                localStorage.removeItem("token");
                                                ValidateToken();
                                            }
                                        })



                                        
                                    }} className="btn btn-danger btn-block">Logout</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>

    )
}

