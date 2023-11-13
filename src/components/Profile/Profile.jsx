'use client'
import React, { useState, useEffect } from 'react'
import Image from 'react-bootstrap/Image'
import Dropdown from 'react-bootstrap/Dropdown'
import { RxExit } from 'react-icons/rx'
import { RiFileEditLine } from 'react-icons/ri'
import Link from 'next/link'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import auth from "../../../libraries/AuthLibrary";
import { toast } from 'react-toastify';
import axios from "axios";
import Cookies from "cookies-js";
import {store} from '../../../store'
import { useDispatch, useSelector } from 'react-redux';
import { FILE_URL } from "../../../config/AppConfig";

const Profile = () => {

  const [mystate, setMystate] = useState({
    id: '',
    username: '',
    type: '',
    firstName: '',
    lastName: '',
    image: '',
    file: ''
  })

  const user = useSelector((state) => state.user)

  const handleLogout = (e) => {
    axios
      .get("/user/logout", {
        headers: {
          Authorization: Cookies.get('access-token'),
          'content-type': 'multipart/form-data'
        },
        //cancelToken: this.axiosCancelSource.token
      })
      .then(async (response) => {
        toast.success(response.data.msg, {autoClose: 3000});
        setTimeout(() => {
          auth.logout(() => {
            window.location.href = "/";
          });
        }, 500);
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

  }

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

  useEffect(() => {
    loadUser()
  }, [user]);


  return (
    <>
      <div id="profile">
        <Dropdown>
          <Dropdown.Toggle id="profileImage">
            <Image
              src={
                (mystate.image) ? `${FILE_URL}/public/upload/${mystate.image}` : '/profile.png'  
              }
              roundedCircle
              alt='img'
            />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {/* <b className="text-center mt-2">{(store.getState().user.user.firstName)? store.getState().user.user.firstName: auth.user.data.firstName}  {(store.getState().user.user.lastName) ? store.getState().user.user.lastName : auth.user.data.lastName }</b> */}
            <b className="text-center mt-2">
              {
                (mystate.firstName  || mystate.lastName ) ? mystate.firstName + ' ' + mystate.lastName :  auth.type()
              }
            </b>
            <p className="mb-0 mt-2">
              <Link href="/profile-view">
                <RiFileEditLine className="me-2 mb-1 fs-6" />
                Profile
              </Link>
            </p>
            <p className="mb-0 mt-2">
              <button onClick={handleLogout}>
                <RxExit className="me-2 mb-1 fs-6" />
                Logout
              </button>
            </p>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  )
}

export default Profile
