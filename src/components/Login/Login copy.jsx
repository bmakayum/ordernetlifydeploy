'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from "axios";
import Cookies from "cookies-js";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserLock } from 'react-icons/fa'
import Form from 'react-bootstrap/Form'
import auth from "../../../libraries/AuthLibrary";
import { ADD_USER } from '../../../store/reducers/userSlice';

const Login = () => {
  //const router = useRouter();
  const dispatch = useDispatch();
  const [mystate, setMystate] = useState({
    username: '',
    password: '',
  })

  const handleChange = (e) => {
    setMystate({ ...mystate, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append('username', mystate.username);
    formdata.append('password', mystate.password);
    axios
      .post("/user/login", formdata, {
        // headers: {
        //   Authorization: Cookies.get('access-token'),
        //   'content-type': 'multipart/form-data'
        // },
        //cancelToken: this.axiosCancelSource.token
      })
      .then(async (response) => {
        if (response.data.msg && response.data.data.token) {
          let token_type = "Bearer";
          let dataObj = await auth.generate(response.data.data.token, token_type, response.data.data.type, response.data.data.id);
          console.log(dataObj);
          await dispatch(ADD_USER(dataObj))
          //toast(response.data.msg,{theme: "light",});
          toast.success(response.data.msg, {autoClose: 3000});
          setTimeout(() => {
            auth.login(() => {
              window.location.href = "/dashboard";
            });
          }, 500);

          if (response.status === 201) {
            toast.error('Authentication problem', {autoClose: 3000});
          }
        }
      })
      .catch(error => {
        // if (axios.isCancel(error)) {
        //     console.log(error.message);
        // } else {
        //     toastNotify(toast, 'error', error);
        // }
        // makeInputErrors(error, (errors) => {
        //     this.setState({errors});
        // });
      });


    // const username = e.target.value;
    // const password = e.target.value;
    // if (!username) {
    //     alert('Please enter your name.')
    //     return false
    // }

    // if (password.length < 3) {
    //     alert('Roll Number should be at least 3 digits long.')
    //     return false
    // }

  }



  return (
    <>
      <div className="d-flex justify-content-center">
        <section id="login" style={{marginLeft:'150px', marginBottom:'50px'}}>
          <div className="loginicon text-center">
            <FaUserLock className="text-center" />
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control type="text" name='username' required onChange={handleChange} placeholder="user name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name='password' required onChange={handleChange} placeholder="password" />
            </Form.Group>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label className="form-check-label" />
              Remember me
            </div>

            <div className="text-center mt-4">
              <button type="submit" id="formSubmit" className="loginBtn">Login</button>
            </div>
          </Form>
        </section>
      </div>

    </>
  )
}

export default Login
