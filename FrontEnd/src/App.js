import logo from './logo.svg';
import './App.css';

import {
	BrowserRouter,
	HashRouter,
	Routes,
	Route,
	Link
} from "react-router-dom";

import React from 'react';
import NavBar from './components/navbar';

import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import MyAccount from './pages/myaccount';

//! because of NGINX i am using hashrouter. Then does not need nginx further configurations.

function App(props) {
	return (
		<>
			<NavBar />
			<HashRouter>
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route path="/myaccount" element={<MyAccount />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					
				</Routes>
			</HashRouter>
		</>
	);
}

export default App;
