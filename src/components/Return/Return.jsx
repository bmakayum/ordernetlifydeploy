'use client'
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { toast } from 'react-toastify';
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin3Line } from 'react-icons/ri'
import DataTable from 'react-data-table-component'
import Button from 'react-bootstrap/Button'
import Cookies from "cookies-js";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { vandorList, getVandorById, updateOrderTrack } from "../../helpers/AppHelper";
import auth from "../../../libraries/AuthLibrary";
import FloatLoader from "@/utilities/loader/FloatLoader";

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




const Return = () => {

  const [stocks, setStocks] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
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
    {
      name: 'Action',
      cell: (row) => (
        <div>
          {
            (auth.type() === 'superadmin' || auth.type() === 'manageradmin') ?
              (
                <button onClick={() => handleTrack(row, '2')} className="bg_1 text-white btn btn-sm ms-2" disabled={`${row.track_id.props.track_id === 2 ? 'disabled' : ''}`} >Ready</button>
              ): null
          }
          
          {/* <button onClick={() => handleTrack(row, '6')} className="bg_5 text-white btn btn-sm ms-2" disabled={`${row.track_id.props.track_id === 6 ? 'disabled' : ''}`} >Payment</button> */}
          {/* <button onClick={() => handleEdit(row)} className="btn btn-primary btn-sm ms-2"><FiEdit className="fs-6" /></button>
          <button onClick={() => handleDelete(row)} className="btn btn-danger btn-sm ms-2"><RiDeleteBin3Line className="fs-6" /></button> */}
        </div>
      ),
    },
  ]

  const tableData = stocks
    .filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.color_size && item.color_size.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.address && item.address.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.code && parseInt(item.code) === parseInt(filterText)) ||
        (item.order_number && parseInt(item.order_number) === parseInt(filterText))
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
        price: element.price ? "৳ "+ element.price : "৳ 0",
        track_id: <Status track={element.track.name} track_id={element.track_id} />,
        vandor_id: element.vandor_id ? <Supplier vandor={getVandorById(element.vandor_id)} /> : '',
        note: element.note,
        order_id: element.order_id
      }
    });


  const loadReturnStock = async () => {
    await axios
      .get("/get-return-stocks", {
        headers: {
          Authorization: Cookies.get('access-token'),
          'content-type': 'multipart/form-data'
        },
        //cancelToken: this.axiosCancelSource.token
      })
      .then(async (response) => {
        //console.log(response.data.data)
        setStocks(response.data.data);
        setIsLoading(false)
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  const handleTrack = (row, updateTrackId) => {

    let formdata = new FormData();
    formdata.append('track_id', parseInt(updateTrackId));
    confirmAlert({
      title: '',
      message: 'Are you sure to do this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => axios
            .post("/stock/" + row.id, formdata, {
              headers: {
                Authorization: Cookies.get('access-token'),
                'content-type': 'multipart/form-data'
              },
              //cancelToken: this.axiosCancelSource.token
            })
            .then(async (response) => {
              if (response.data) {
                updateOrderTrack(row.order_id, updateTrackId);
                toast.success(response.data.msg, { autoClose: 3000 });
                loadReturnStock();
              } else {
                toast.error(response.data.msg, { autoClose: 3000 });
              }
            })
            .catch(error => {
              console.log(error.message);
            })
        },
        {
          label: 'No',
        }
      ]
    });
  }

  const handleRowSelected = (state) => {
    const rowIds = state.selectedRows.map((row) => row.id)
    setSelectedRows(rowIds);
    console.log(selectedRows);
  };


  useEffect(() => {
    setIsLoading(true)
    loadReturnStock();
  }, []);



  return (
    <>
      <div className="mb-4 d-flex align-items-center">
        <form role="search">
          <input
            className="form-control me-2 py-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </form>
      </div>

      <section id="return">
        <DataTable
          columns={columns}
          data={tableData}
          selectableRows
          customStyles={customCSS}
          onSelectedRowsChange={handleRowSelected}
        />
      </section>
      <FloatLoader isLoading={isLoading}/>
    </>
  )
}

export default Return
