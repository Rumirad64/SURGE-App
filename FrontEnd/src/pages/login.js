import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";

import {
    Link,

} from "react-router-dom";

import Swal from 'sweetalert2';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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
        //check if email and password are not empty
        if (email === "" || password === "") {
            setError("Please enter email and password");
            return;
        }  


        axios.post("http://localhost:8000/api/user/login", {
                username: email,
                password: password,
        }).then((res) => {
                console.log(res.data);
                if(res.data.data) {
                    localStorage.setItem("token", res.data.data.token);
                    window.location.href = "/#/myaccount";
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.data.message
                    })
                }
        }).catch((err) => {
                console.log(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.message
                })
        });
        
    }

    return (
        /* create login  box with username and password */
        <section className="h-100">
            <div className="container h-100">
                <div className="row justify-content-sm-center h-100">
                    <div className="col-5 col-md-6">
                        <div className="text-center my-5">
                        </div>
                        <div className="card shadow-lg">
                            <div className="card-body p-5">
                                <h1 className="fs-4 card-title fw-bold mb-4">Login</h1>
                                <form className="needs-validation">
                                    <div className="mb-3">

                                        {/* section for errors */}
                                        {error ? (
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                            ) : null}
                                        
                                        

                                        <label className="mb-2 text-muted" for="email">E-Mail Address or Username</label>
                                        <input
                                            type="text"
                                            required
                                            className="form-control"
                                            placeholder="Enter email or username"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            />
                                        <div className="invalid-feedback">
                                            Email is invalid
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="mb-2 w-100">
                                            <label className="text-muted" for="password">Password</label>
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="form-control"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            />
                                        <div className="invalid-feedback">
                                            Password is required
                                        </div>
                                    </div>

                                        <button onClick={e => HandleSubmit(e)} type="button" className="btn btn-primary btn-block">
                                            Login
                                        </button>
                                    
                                </form>
                            </div>
                            <div className="card-footer py-3 border-0">
                                <div className="text-center">
                                    <Link to="/register" className="text-dark">
                                        <span className="fw-bold">Don't have an account?</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </section>
    );
}



