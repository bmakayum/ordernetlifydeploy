"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { CgFileDocument } from "react-icons/cg";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin3Line } from "react-icons/ri";
import axios from "axios";
import Cookies from "cookies-js";
import { toast } from 'react-toastify';
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { reloadPage } from "../../helpers/AppHelper";
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_SHEET } from '../../../store/reducers/sheetSlice';
import FloatLoader from "@/utilities/loader/FloatLoader";

const CreateOrderSheet = () => {
   const dispatch = useDispatch();
   const [mystate, setMystate] = useState({
      id: '',
      name: '',
   })
   const [submitButtonText, setSubmitButtonText] = useState('Submit');
   const [ordersheets, setOrdersheets] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   const reset = () => {
      setMystate({
         id:'',
         name: ''
      })
   }

   const handleAddNew = ()=>{
      reset();
      setSubmitButtonText('Submit');
   }


   const loadOrdersSheets = async () => {
      await axios
         .get("/ordersheets", {
            headers: {
               Authorization: Cookies.get('access-token'),
               'content-type': 'multipart/form-data'
            },
            //cancelToken: this.axiosCancelSource.token
         })
         .then(async (response) => {
            //console.log(response.data.data)
            setOrdersheets(response.data.data);
            setIsLoading(false)
         })
         .catch(error => {
            console.log(error.message);
         });
   }

   const handleChange = (e) => {
      setMystate({ ...mystate, [e.target.name]: e.target.value });
   }

   const handleSubmit = (e) => {
      e.preventDefault();
      setIsLoading(true)
      if (mystate.id && submitButtonText === "Update") {
         handleUpdate(mystate.id);
      } else {
         handleCreate();
      }
   }

   const handleCreate = async () => {
      console.log(submitButtonText);
      let formdata = new FormData();
      formdata.append('name', mystate.name);
      axios
         .post("/ordersheet", formdata, {
            headers: {
               Authorization: Cookies.get('access-token'),
               'content-type': 'multipart/form-data'
            },
            //cancelToken: this.axiosCancelSource.token
         })
         .then(async (response) => {
            if (response.data) {
               toast.success(response.data.msg, { autoClose: 3000 });
               await loadOrdersSheets();
               reset();
               await dispatch(UPDATE_SHEET(ordersheets))
               setIsLoading(false)
            } else {
               toast.error(response.data.msg, { autoClose: 3000 });
            }
         })
         .catch(error => {
            console.log(error.message);
         });

   }

   const handleUpdate = (id) => {
      console.log(submitButtonText);
      let formdata = new FormData();
      formdata.append('name', mystate.name);
      axios
         .post("/ordersheet/"+id, formdata, {
            headers: {
               Authorization: Cookies.get('access-token'),
               'content-type': 'multipart/form-data'
            },
            //cancelToken: this.axiosCancelSource.token
         })
         .then(async (response) => {
            if (response.data) {
               toast.success(response.data.msg, { autoClose: 3000 });
               loadOrdersSheets();
               await dispatch(UPDATE_SHEET(ordersheets))
               //reset();
               setIsLoading(false)
            } else {
               toast.error(response.data.msg, { autoClose: 3000 });
            }
         })
         .catch(error => {
            console.log(error.message);
         });


   }

   const handleEdit = (e, id)=>{
      e.preventDefault();
      console.log(id);
      axios
         .get("/ordersheet/"+id, {
            headers: {
               Authorization: Cookies.get('access-token'),
               'content-type': 'multipart/form-data'
            },
            //cancelToken: this.axiosCancelSource.token
         })
         .then(async (response) => {
            console.log(response.data.data)
            setMystate({
               ...response.data.data,
               id:response.data.data.id,
               name:response.data.data.name
            })
            setSubmitButtonText("Update")
            //setOrdersheets(response.data.data);
            await dispatch(UPDATE_SHEET(ordersheets))
         })
         .catch(error => {
            console.log(error.message);
         });

   }

   const handleDelete = (id) => {
      confirmAlert({
        title: '',
        message: 'Are you sure to do this?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => axios
              .delete("/ordersheet/" + id, {
                headers: {
                  Authorization: Cookies.get('access-token'),
                  'content-type': 'multipart/form-data'
                },
                //cancelToken: this.axiosCancelSource.token
              })
              .then(async (response) => {
                if (response.data) {
                  toast.success(response.data.msg, { autoClose: 3000 });
                  loadOrdersSheets();
                  await dispatch(UPDATE_SHEET(ordersheets))
                  setIsLoading(false)
                } else {
                  toast.error(response.data.msg, { autoClose: 3000 });
                }
              })
              .catch(error => {
                console.log(error.message);
                toast.error('This order sheet all ready used', { autoClose: 3000 });
              })
          },
          {
            label: 'No',
          }
        ]
      });
  
    }

   useEffect(() => {
      setIsLoading(true)
      loadOrdersSheets();
   }, []);


   return (
      <>
         <div id="creatOrderSheet">
            <Form onSubmit={(e) => handleSubmit(e)}>
               <label htmlFor="exampleFormControlInput1" className="form-label">
                  Creat Order Sheets
               </label>
               <div className="d-flex align-items-center">
                  <input
                     type="text"
                     name='name'
                     value={mystate.name}
                     className="form-control inputOrderSheet"
                     id=""
                     placeholder="Name here"
                     onChange={handleChange}
                  />
                  <button className="btn btn-success py-2 px-3 h-100 ms-3">{submitButtonText}</button>
                  <button type='button' className="btn btn-danger py-2 px-3 h-100 ms-3" onClick={()=>handleAddNew()}>Cancel</button>
               </div>
            </Form>

            <div className="orderSheetBox mt-5 w-50 ">
               {
                  ordersheets.map((ordersheet, key) =>
                     <div className="orderSheetList bg-white mb-3 rounded position-relative" key={key}>
                        <p className="mb-0 fw-bold">
                           <CgFileDocument className="me-2 mb-1 fs-5" />
                           {ordersheet.name}
                        </p>
                        <div className="actionBtns position-absolute">
                           <button
                              type="button"
                              className="btn btn-primary btn-sm ms-2"
                              onClick={(e)=>handleEdit(e, ordersheet.id)}
                           >
                              <FiEdit className="fs-6" />
                           </button>
                           <button
                              type="button"
                              className="btn btn-danger btn-sm ms-2"
                              onClick={()=>handleDelete(ordersheet.id)}
                           >
                              <RiDeleteBin3Line className="fs-6" />
                           </button>
                        </div>
                     </div>
                  )
               }

            </div>
         </div>
         <FloatLoader isLoading={isLoading}/>
      </>
   );
};

export default CreateOrderSheet;
