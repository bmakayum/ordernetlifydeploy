"use client";
import React from 'react'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin3Line } from "react-icons/ri";
import OrderSheet_1 from "../../../components/OrderSheet_1/OrderSheet_1";



const page = ({ params }) => {



  return (
    <>
      <OrderSheet_1 sheetId={params.sheetId} />
    </>
  )
}

export default page