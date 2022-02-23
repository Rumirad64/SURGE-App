import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        
        <div className="container">
            <div className="row">
                <div className="col-sm-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Login</h5>
                            <p className="card-text">To login</p>
                            <Link to="/login" className="btn btn-primary">Login</Link>
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Register</h5>
                            <p className="card-text">To register.</p>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">My Account</h5>
                            <p className="card-text">To view my account and edit info</p>
                            <Link to="/myaccount" className="btn btn-primary">My Account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    

    )
}

