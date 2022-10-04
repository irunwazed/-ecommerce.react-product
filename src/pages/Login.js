

import React, { useState } from "react";
import {Button, Card, Form, Spinner } from "react-bootstrap";
import axios from 'axios';


const baseUrl = 'http://127.0.0.1:8000/';

const Login = () => {

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);


	const handleLogin = (data) => {
		setLoading(true);
    axios.post(baseUrl+'api/login', data).then(res => {
			localStorage.setItem('token', res.data.token);
			
			window.location.replace("/");
      setLoading(false);
    }).catch(err => {
      console.log(err.message);
      setLoading(false);
    })
	}

  const handleChange = (event) => {
    const {name, value, files} = event.target;
    if(name === 'image'){
      setForm(values => ({...values, [name]: files[0]}))
    }else{
      setForm(values => ({...values, [name]: value}))
    }
  }

  return(
    <div className="container">
      <h1>Login</h1>
      <br/>
			<Card style={{padding: 20}}>
				{loading?(<center ><Spinner animation="border" variant="danger" /> <span style={{fontSize: 30}}>loading</span></center>):null}
					<Form onSubmit={(e) => {e.preventDefault(); handleLogin(form)}}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="username" value={form.username}  onChange={handleChange} required/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required/>
              </Form.Group>
							<Button type = 'submit' variant="primary" >
								Simpan
							</Button>
            </Form>
					</Card>
    </div>
  );
}
export default Login;