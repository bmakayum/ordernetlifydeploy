'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'react-bootstrap/Image'
import Form from "react-bootstrap/Form";
import Dropdown from 'react-bootstrap/Dropdown'
import { RxExit } from 'react-icons/rx'
import { RiFileEditLine } from 'react-icons/ri'
import Link from 'next/link'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import axios from "axios";
import Cookies from "cookies-js";
import { toast } from 'react-toastify';
import auth from "../../../libraries/AuthLibrary";
import { FILE_URL } from "../../../config/AppConfig";

import { store } from '../../../store'
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_USER } from '../../../store/reducers/userSlice';
import FloatLoader from "@/utilities/loader/FloatLoader";

const ProfileView = () => {
  const dispatch = useDispatch();
  const [mystate, setMystate] = useState({
    id: '',
    username: '',
    type: '',
    firstName: '',
    lastName: '',
    image: '',
    file: ''
  })
  const [submitButtonText, setSubmitButtonText] = useState('Update');
  const fileRef = useRef();
  const [isLoading, setIsLoading] = useState(false);




  const loadUser = async () => {
    await axios
      .get("/user/" + auth.user.data.id, {
        headers: {
          Authorization: Cookies.get('access-token'),
          'content-type': 'multipart/form-data'
        },
        //cancelToken: this.axiosCancelSource.token
      })
      .then(async (response) => {
        setMystate({
          id: response.data.data.id,
          username: response.data.data.username,
          type: response.data.data.type,
          firstName: (response.data.data.firstName) === null ? '': response.data.data.firstName,
          lastName: (response.data.data.lastName) === null ? '' : response.data.data.lastName,
          image: response.data.data.image,
          file: ''
        });
        
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  const handleChange = (e) => {
    e.preventDefault();
    setMystate({ ...mystate, [e.target.name]: e.target.value });
  }

  const handleUploadFile = (e) => {
    e.preventDefault();
    setMystate({ ...mystate, [e.target.name]: e.target.files[0] });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (mystate.id && submitButtonText === "Update") {
      handleUpdate(mystate.id);
    }
  }

  const handleUpdate = (id) => {
    let formdata = new FormData();
    for (let [key, value] of Object.entries(mystate)) {
      formdata.append(key, value);
    }
    axios
      .post("/user/" + id, formdata, {
        headers: {
          Authorization: Cookies.get('access-token'),
          'content-type': 'multipart/form-data'
        },
        //cancelToken: this.axiosCancelSource.token
      })
      .then(async (response) => {
        if (response.data) {
          toast.success(response.data.msg, { autoClose: 3000 });
          await loadUser();
          fileRef.current.value = "";
          await dispatch(UPDATE_USER({ firstName: mystate.firstName, lastName: mystate.lastName, image: mystate.image }))
          setIsLoading(false);
        } else {
          toast.error(response.data.msg, { autoClose: 3000 });
        }
      })
      .catch(error => {
        console.log(error.message);
      });

  }

  useEffect(() => {
    loadUser();
  }, []);


  return (
    <>
      <div id="profileView">
        <Form onSubmit={(e) => handleSubmit(e)}>
          <div className="profileViewBox text-center mb-3">
            <Image src={(mystate.image) ? `${FILE_URL}/public/upload/${mystate.image}` : '/profile.png'} roundedCircle alt="img" />

            <h4 className="mb-1">{(mystate.firstName) ? mystate.firstName : ''} {(mystate.lastName) ? mystate.lastName : ''}</h4>
            <h6 className="mb-3">
              <i>{mystate.type}</i>
            </h6>

            <div className="inputProfile_img text-start">
              <label htmlFor="formFile" className="form-label">
                Change Picture
              </label>
              <input
                className="form-control"
                type="file"
                name='file'
                id="formFile"
                ref={fileRef}
                onChange={(e) => handleUploadFile(e)}
              />
            </div>
          </div>
          <div className="profileText">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                First Name
              </label>
              <input
                type="text"
                name='firstName'
                className="form-control"
                id="firstName"
                placeholder="First Name"
                value={mystate.firstName}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                name='lastName'
                className="form-control"
                id="lastName"
                placeholder="Last Name"
                value={mystate.lastName}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <button className="btn btn-md btn-secondary">Update</button>
          </div>
        </Form>
      </div>
      <FloatLoader isLoading={isLoading}/>
    </>
  )
}

export default ProfileView
