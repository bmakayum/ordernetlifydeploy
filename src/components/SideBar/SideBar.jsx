'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Accordion from 'react-bootstrap/Accordion'
import { BiHomeAlt2, BiSpreadsheet } from 'react-icons/bi'
import { LuClipboardEdit } from 'react-icons/lu'
import { CgFileDocument } from 'react-icons/cg'
import auth from '../../../libraries/AuthLibrary'
import { toast } from 'react-toastify'
import axios from 'axios'
import Cookies from 'cookies-js'
import { useDispatch, useSelector } from 'react-redux'

const Navbar = ({ isToggle }) => {
  const [orderSheets, setOrderSheets] = useState([])
  const sheet = useSelector((state) => state.sheet)

  // const handleLogout = (e) => {
  //   axios
  //     .get("/user/logout", {
  //       headers: {
  //         Authorization: Cookies.get('access-token'),
  //         'content-type': 'multipart/form-data'
  //       },
  //       //cancelToken: this.axiosCancelSource.token
  //     })
  //     .then(async (response) => {
  //       console.log(response.data)
  //       toast.success(response.data.msg, {autoClose: 3000});
  //       setTimeout(() => {
  //         auth.logout(() => {
  //           window.location.href = "/";
  //         });
  //       }, 500);
  //     })
  //     .catch(error => {
  //       // if (axios.isCancel(error)) {
  //       //     console.log(error.message);
  //       // } else {
  //       //     toastNotify(toast, 'error', error);
  //       // }
  //       // makeInputErrors(error, (errors) => {
  //       //     this.setState({errors});
  //       // });
  //     });

  // }

  const loadOrderSheet = async () => {
    await axios
      .get('/ordersheets', {
        headers: {
          Authorization: Cookies.get('access-token'),
          //Authorization: auth.token(),
          'content-type': 'multipart/form-data',
        },
        //cancelToken: this.axiosCancelSource.token
      })
      .then(async (response) => {
        setOrderSheets(response.data.data)
      })
      .catch((error) => {
        console.log(error.message)
        // if (axios.isCancel(error)) {
        //     console.log(error.message);
        // } else {
        //     toastNotify(toast, 'error', error);
        // }
        // makeInputErrors(error, (errors) => {
        //     this.setState({errors});
        // });
      })
  }

  useEffect(() => {
    loadOrderSheet()
  }, [sheet])

  return (
    <>
      <aside id="sideBarBox" className={isToggle ? 'collapsed' : null}>
        <div className="logoBox mb-1 border-bottom text-center">
          {/* <h4 className="mb-0 py-4 px-2 text-center logo">Logo</h4> */}
          <Image
            className="logo"
            src="/logo.jpg"
            width={200}
            height={70}
            alt="logo"
          />
        </div>
        <div className="menuBox">
          {/* <button className='btn btn-info' onClick={handleLogout}>logout</button> */}

          <Link
            className="navLink d-block d-flex align-items-center"
            href="/dashboard"
          >
            <BiHomeAlt2 className="me-2 mb-1 fs-5" />
            Dashboard
          </Link>

          {
            (auth.type() === 'superadmin') &&
            (<Link
              className="navLink mt-3 d-block d-flex align-items-center"
              href="/create-order-sheet"
            >
              <LuClipboardEdit className="me-2 fs-5" />
              Create Order Sheets
            </Link>)
          }


          {
            (auth.type() === 'superadmin' || auth.type() === 'useradmin' || auth.type() === 'manageradmin') ?
              (
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <CgFileDocument className="me-2 mb-1 fs-5" />
                      Order Sheets
                    </Accordion.Header>
                    <Accordion.Body>
                      {
                        orderSheets.map((ordersheet, key) =>
                          <Link className="d-block" href={`/order-sheets/${ordersheet.id}`} key={key}>
                            <BiSpreadsheet className="me-2 fs-6 mb-1" />
                            {ordersheet.name}
                          </Link>
                        )
                      }

                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )

              : null

          }

        </div>
      </aside>
    </>
  )
}

export default Navbar
