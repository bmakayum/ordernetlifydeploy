"use client";
import React from 'react'
import axios from "axios";
import auth from "../../../libraries/AuthLibrary";
// import AddProduct from '../../components/addProduct/addProduct'



const dashboard = () => {

  // useEffect(() => {
  //   axios
  //     .get("/user/4", {
  //       headers: {
  //         Authorization: Cookies.get('access-token'),
  //         'content-type': 'multipart/form-data'
  //       },
  //       //cancelToken: this.axiosCancelSource.token
  //     })
  //     .then(async (response) => {
  //       console.log(response.data)

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

  // }, []);




  return (
    <>
      <h3 className='text-muted'> Welcome Dashboard </h3>
    </>
  )
}

export default dashboard