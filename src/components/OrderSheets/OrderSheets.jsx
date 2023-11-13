"use client";
import Link from 'next/link'
import React, {useState, useEffect} from 'react';
import { CgFileDocument } from "react-icons/cg";
import axios from "axios";
import Cookies from "cookies-js";
import auth from "../../../libraries/AuthLibrary";

const OrderSheets = () => {
  const [orderSheets, setOrderSheets] = useState([]);

  const loadOrderSheet = async()=>{
    await axios
      .get("/ordersheets", {
        headers: {
          Authorization: Cookies.get('access-token'),
          //Authorization: auth.token(),
          'content-type': 'multipart/form-data'
        },
        //cancelToken: this.axiosCancelSource.token
      })
      .then(async (response) => {
        console.log(response.data)
        setOrderSheets(response.data.data);
      })
      .catch(error => {
        console.log(error.message);
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

  useEffect(() => {
    loadOrderSheet();
  }, []);

  return (
    <>
      <div id="srderSheets" className='mb-4'>
          {
            orderSheets.map((ordersheet, key)=>
              <Link key={ordersheet.id} className='orderSheetBtn' href={`/order-sheets/${ordersheet.id}`}><CgFileDocument className='me-2 mb-1 fs-5'/>{ordersheet.name}</Link>
            )
          }
          
      </div>
    </>
  )
}

export default OrderSheets
