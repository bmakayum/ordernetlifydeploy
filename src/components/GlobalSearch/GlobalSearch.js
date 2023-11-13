'use client'
import React, { useState, useEffect } from 'react'
import axios from "axios";
import Cookies from "cookies-js";
import auth from "../../../libraries/AuthLibrary";
import FloatLoader from "@/utilities/loader/FloatLoader";
import DataTable from 'react-data-table-component'
import { vandorList, getVandorById, updateOrderTrack } from "../../helpers/AppHelper";


const Status = (track) => {
  return (
    <>
      {/* <span className={"bg_3 py-1 px-2 text-white rounded d-inline-block"}> */}
      <span className={
        `${track.track_id === 1 ? 'bg-info py-1 px-2 text-white rounded d-inline-block' :
          track.track_id === 2 ? 'bg_1 py-1 px-2 text-white rounded d-inline-block' :
            track.track_id === 3 ? 'bg_2 py-1 px-2 text-white rounded d-inline-block' :
              track.track_id === 4 ? 'bg_3 py-1 px-2 text-white rounded d-inline-block' :
                track.track_id === 5 ? 'bg_4 py-1 px-2 text-white rounded d-inline-block' :
                  track.track_id === 6 ? 'bg_5 py-1 px-2 text-white rounded d-inline-block' :
                    ''
        }`}>
        {track.track}
      </span>
    </>
  )
}

const Supplier = (vandor) => {
  return (
    <>
      <span className="py-1 px-2 rounded d-inline-block">
        {vandor.vandor.label}
      </span>
    </>
  )
}



const GlobalSearch = (props) => {

  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const customCSS = {
    rows: {
      style: {
        minHeight: '30px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        background: '#666',
        color: '#fff',
        fontSize: '15px',
        border: '1px solid #2222',
      },
    },
    cells: {
      style: {
        padding: '8px',
        border: '1px solid #ddd',
        marginBottom: '10px',
      },
    },
  }

  const columns = [
    {
      name: 'S/N',
      selector: (row) => row.sn,
    },
    {
      name: 'Date',
      selector: (row) => row.date,
    },
    {
      name: 'Code',
      selector: (row) => row.code,
    },
    {
      name: 'Order No.',
      selector: (row) => row.order_number,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
    },
    {
      name: 'Address & Number',
      selector: (row) => row.address,
    },
    {
      name: 'Color & Size',
      selector: (row) => row.color_size,
    },
    {
      name: 'Taka',
      selector: (row) => row.price,
    },
    {
      name: 'Supplier',
      selector: (row) => row.vandor_id,
    },
    {
      name: 'Status',
      selector: (row) => row.track_id,
    },
    {
      name: 'Note',
      selector: (row) => row.note,
    },
    
  ]

  const tableData = stocks
      .filter(
        (item) =>
          (props.query) ?
            (item.name && item.name.toLowerCase().includes(props.query.toLowerCase())) ||
            (item.color_size && item.color_size.toLowerCase().includes(props.query.toLowerCase())) ||
            (item.address && item.address.toLowerCase().includes(props.query.toLowerCase())) ||
            (item.code && parseInt(item.code) === parseInt(props.query)) ||
            (item.order_number && parseInt(item.order_number) === parseInt(props.query))
          :
          item
      )
    .map((element, key) => {
      return {
        id: element.id,
        sn: key + 1,
        name: element.name,
        date: element.date,
        code: element.code,
        order_number: element.order_number,
        address: element.address,
        color_size: element.color_size,
        price: element.price ? element.price + ' ৳' : '0 ৳',
        track_id: <Status track={element.track.name} track_id={element.track_id} />,
        vandor_id: element.vandor_id ? <Supplier vandor={getVandorById(element.vandor_id)} /> : '',
        note: element.note,
        order_id: element.order_id
      }
    });



  const loadStock = async () => {
    await axios
      .get("/get-all-stocks", {
        headers: {
          Authorization: Cookies.get('access-token'),
          'content-type': 'multipart/form-data'
        },
        //cancelToken: this.axiosCancelSource.token
      })
      .then(async (response) => {
        console.log(response.data.data);
        setStocks(response.data.data);
        setIsLoading(false)
      })
      .catch(error => {
        console.log(error.message);
      });
  }


  useEffect(() => {
    console.log(props.query)
    setIsLoading(true)
    loadStock();
  }, []);


  return (
    <>
      <DataTable
        columns={columns}
        data={tableData}
        selectableRows
        customStyles={customCSS}
        //onSelectedRowsChange={handleRowSelected}
      />
      <FloatLoader isLoading={isLoading}/>
    </>
  )
}

export default GlobalSearch