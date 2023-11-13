"use client";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin3Line } from "react-icons/ri";
import { MdAdd } from "react-icons/md";
import DataTable from "react-data-table-component";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Cookies from "cookies-js";
import Select from "react-select";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { vandorList, getVandorById, updateOrderTrack } from "../../helpers/AppHelper";
import OrderEditModal from "./OrderEditModal";
import auth from "../../../libraries/AuthLibrary";
import FloatLoader from "@/utilities/loader/FloatLoader";

const Status = (track) => {
    return (
        <>
            {/* <span className={"bg_3 py-1 px-2 text-white rounded d-inline-block"}> */}
            <span
                className={`${track.track_id === 1
                    ? "bg-secondary py-1 px-2 text-white rounded d-inline-block"
                    : track.track_id === 2
                        ? "bg_1 py-1 px-2 text-white rounded d-inline-block"
                        : track.track_id === 3
                            ? "bg_2 py-1 px-2 text-white rounded d-inline-block"
                            : track.track_id === 4
                                ? "bg_3 py-1 px-2 text-white rounded d-inline-block"
                                : track.track_id === 5
                                    ? "bg_4 py-1 px-2 text-white rounded d-inline-block"
                                    : track.track_id === 6
                                        ? "bg_5 py-1 px-2 text-white rounded d-inline-block"
                                        : ""
                    }`}
            >
                {track.track}
            </span>
        </>
    );
};

const Supplier = (vandor) => {
    return (
        <>
            <span className="py-1 px-2 rounded d-inline-block">{vandor.vandor.label}</span>
        </>
    );
};

const OrderSheet_1 = (props) => {
    const [mystate, setMystate] = useState({
        date: "",
        code: "",
        order_number: "",
        name: "",
        address: "",
        phone: "",
        color_size: "",
        price: "",
        ordercategory_id: props.sheetId,
        vandor_id: "",
        track_id: "1",
        note: "",
    });
    const [selectedOption, setSelectedOption] = useState(null);
    const [orderSheets, setOrderSheets] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [orderid, setOrderid] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false)
        setRefresh(false)
    };
    const handleRefresh = () => setRefresh(true);
    const handleShow = (row) => {
        setShow(true);
        setOrderid(row.id);
    }

    const reset = () => {
        setMystate({
            date: "",
            code: "",
            order_number: "",
            name: "",
            address: "",
            phone: "",
            color_size: "",
            price: "",
            ordercategory_id: props.sheetId,
            vandor_id: "",
            track_id: "1",
            note: "",
        });
        setSelectedOption(null)
    };

    const customCSS = {
        rows: {
            style: {
                minHeight: "30px",
            },
        },
        headCells: {
            style: {
                paddingLeft: "8px",
                paddingRight: "8px",
                background: "#666",
                color: "#fff",
                fontSize: "15px",
                border: "1px solid #2222",
            },
        },
        cells: {
            style: {
                padding: "8px",
                border: "1px solid #ddd",
                marginBottom: "10px",
            },
        },
    };

    const columns = [
        {
            name: "S/N",
            selector: (row) => row.sn,
        },
        {
            name: "Date",
            selector: (row) => row.date,
        },
        {
            name: "Code",
            selector: (row) => row.code,
        },
        {
            name: "Order No.",
            selector: (row) => row.order_number,
        },
        {
            name: "Name",
            selector: (row) => row.name,
        },
        {
            name: "Address & Number",
            selector: (row) => row.address,
        },
        {
            name: "Color & Size",
            selector: (row) => row.color_size,
        },
        {
            name: "Taka",
            selector: (row) => row.price,
        },
        {
            name: "Supplier",
            selector: (row) => row.vandor_id,
        },
        {
            name: "Status",
            selector: (row) => row.track_id,
        },
        {
            name: "Note",
            selector: (row) => row.note,
        },
        {
            name: "Action",
            cell: (row) => (
                <div>
                    {
                        (auth.type() === 'superadmin' || auth.type() === 'manageradmin') ?
                            (
                                <button
                                    onClick={() => handleReadyStock(row)}
                                    className="bg_1 text-white btn btn-sm ms-2"
                                    disabled={`${row.track_id.props.track_id !== 1 ? "disabled" : ""}`}
                                >
                                    Ready
                                </button>
                            ) : null
                    }
                    {
                        (auth.type() === 'superadmin') ?
                            (
                                <button
                                    //onClick={() => handleEdit(row)} 
                                    onClick={() => handleShow(row)}
                                    className="btn btn-primary btn-sm ms-2">
                                    <FiEdit className="fs-6" />
                                </button>
                            ) : null
                    }
                    {
                        (auth.type() === 'superadmin') ?
                            (
                                <button onClick={() => handleDelete(row)} className="btn btn-danger btn-sm ms-2">
                                    <RiDeleteBin3Line className="fs-6" />
                                </button>
                            ) : null
                    }
                </div>
            ),
        },
    ];

    const tableData = orderSheets
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
                price: element.price ? "৳ "+element.price  : "৳ 0",
                amount: element.price,
                track_id: <Status track={element.track.name} track_id={element.track_id} />,
                vandor_id: element.vandor_id ? <Supplier vandor={getVandorById(element.vandor_id)} /> : "",
                note: element.note,
            };
        });


    const loadOrdersBySheet = async () => {
        await axios
            .get("/get-order-by-sheet/" + props.sheetId, {
                headers: {
                    Authorization: Cookies.get("access-token"),
                    "content-type": "multipart/form-data",
                },
                //cancelToken: this.axiosCancelSource.token
            })
            .then(async (response) => {
                setOrderSheets(response.data.data);
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    const handleChange = (e) => {
        setMystate({ ...mystate, [e.target.name]: e.target.value });
    };

    const handleSelect = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)
        let formdata = new FormData();
        formdata.append("date", mystate.date);
        formdata.append("code", mystate.code);
        formdata.append("order_number", mystate.order_number ? parseInt(mystate.order_number) : "");
        formdata.append("name", mystate.name);
        formdata.append("address", mystate.address);
        formdata.append("phone", mystate.phone);
        formdata.append("color_size", mystate.color_size);
        formdata.append("price", mystate.price ? parseInt(mystate.price) : "");
        formdata.append("ordercategory_id", parseInt(mystate.ordercategory_id));
        //formdata.append("vandor_id", mystate.vandor_id ? parseInt(mystate.vandor_id) : "");
        formdata.append("vandor_id", selectedOption ? parseInt(selectedOption.value) : "");
        formdata.append("track_id", parseInt(mystate.track_id));
        formdata.append("note", mystate.note);

        axios
            .post("/order", formdata, {
                headers: {
                    Authorization: Cookies.get("access-token"),
                    "content-type": "multipart/form-data",
                },
                //cancelToken: this.axiosCancelSource.token
            })
            .then(async (response) => {
                if (response.data) {
                    toast.success(response.data.msg, { autoClose: 3000 });
                    loadOrdersBySheet();
                    reset();
                    setIsLoading(false)
                } else {
                    toast.error(response.data.msg, { autoClose: 3000 });
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    const handleReadyStock = (row) => {
        // console.log(row);

        let formdata = new FormData();
        formdata.append("order_id", parseInt(row.id));
        formdata.append("date", row.date ? row.date : "");
        formdata.append("code", row.code ? row.code : "");
        formdata.append("order_number", row.order_number ? parseInt(row.order_number) : "");
        formdata.append("name", row.name ? row.name : "");
        formdata.append("address", row.address ? row.address : "");
        formdata.append("phone", row.phone ? row.phone : "");
        formdata.append("color_size", row.color_size ? row.color_size : "");
        formdata.append("price", row.amount ? parseInt(row.amount) : "");
        formdata.append("ordercategory_id", parseInt(props.sheetId));
        formdata.append("vandor_id", row.vandor_id ? row.vandor_id.props.vandor.value : "");
        formdata.append("track_id", parseInt("2"));
        formdata.append("note", row.note ? row.note : "");
        // for (var pair of formdata.entries()) {
        //   console.log(pair[0] + ', ' + pair[1]);
        // }
        confirmAlert({
            title: "",
            message: "Are you sure to do this?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () =>
                        axios
                            .post("/stock", formdata, {
                                headers: {
                                    Authorization: Cookies.get("access-token"),
                                    "content-type": "multipart/form-data",
                                },
                            })
                            .then(async (response) => {
                                if (response.data) {
                                    toast.success(response.data.msg, { autoClose: 3000 });
                                    await updateOrderTrack(row.id, "2");
                                    loadOrdersBySheet();
                                } else {
                                    toast.error(response.data.msg, { autoClose: 3000 });
                                }
                            })
                            .catch((error) => {
                                if (axios.isCancel(error)) {
                                    console.log(error.message);
                                } else {
                                    toast.error(error, { autoClose: 3000 });
                                }
                            }),
                },
                {
                    label: "No",
                },
            ],
        });
    };

    // const handleEdit = (row) => {
    //     console.log(row.id);
    // };

    const handleDelete = (row) => {
        console.log(row.id);
        confirmAlert({
            title: "",
            message: "Are you sure to do this?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () =>
                        axios
                            .delete("/order/" + row.id, {
                                headers: {
                                    Authorization: Cookies.get("access-token"),
                                    "content-type": "multipart/form-data",
                                },
                                //cancelToken: this.axiosCancelSource.token
                            })
                            .then(async (response) => {
                                if (response.data) {
                                    toast.success(response.data.msg, { autoClose: 3000 });
                                    loadOrdersBySheet();
                                } else {
                                    toast.error(response.data.msg, { autoClose: 3000 });
                                }
                            })
                            .catch((error) => {
                                console.log(error.message);
                            }),
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const handleRowSelected = (state) => {
        const rowIds = state.selectedRows.map((row) => row.id);
        setSelectedRows(rowIds);
        console.log(selectedRows);
    };

    const handleMultiDelete = async (e) => {
        e.preventDefault();
        if (selectedRows.length === 0) {
            return toast.error("Please selected rows");
        }

        let formdata = new FormData();
        formdata.append("ids", JSON.stringify(selectedRows));

        confirmAlert({
            title: "",
            message: "Are you sure to do this?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () =>
                        await axios
                            .post("/delete-multi-orders", formdata, {
                                headers: {
                                    Authorization: Cookies.get("access-token"),
                                    "content-type": "multipart/form-data",
                                },
                                //cancelToken: this.axiosCancelSource.token
                            })
                            .then(async (response) => {
                                console.log(response);
                                if (response.data) {
                                    toast.success(response.data.msg, { autoClose: 3000 });
                                    loadOrdersBySheet();
                                    setSelectedRows([]);
                                } else {
                                    toast.error(response.data.msg, { autoClose: 3000 });
                                }
                            })
                            .catch((error) => {
                                console.log(error.message);
                            }),
                },
                {
                    label: "No",
                },
            ],
        });
    };

    useEffect(() => {
        setIsLoading(true)
        loadOrdersBySheet();
    }, [refresh]);

    const [open, setOpen] = useState(false);

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
                {
                    (auth.type() === 'superadmin') ?
                        (
                            <Button className="py-2 me-4 bg-danger border-0" onClick={handleMultiDelete}>
                                All Delete
                            </Button>
                        ) : null
                }

            </div>

            {/* ================================== Add Order Start Here ================================== */}
            <div className="mb-4">
                {
                    (auth.type() === 'superadmin' || auth.type() === 'useradmin') ?
                        (
                            <Button className="py-2 me-4 mb-2 bg-secondary border-0" onClick={() => setOpen(!open)} aria-controls="addOrder" aria-expanded={open}>
                                <MdAdd className="fs-6 mb-1" /> Add Order
                            </Button>
                        ) : null
                }

                <Collapse in={open}>
                    <div id="addOrder" className="w-50">
                        <Form onSubmit={(e) => handleSubmit(e)}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">
                                            Date
                                        </label>
                                        <input
                                            name="date"
                                            type="date"
                                            value={mystate.date}
                                            className="form-control"
                                            id="date"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">
                                            Code
                                        </label>
                                        <input
                                            name="code"
                                            type="text"
                                            value={mystate.code}
                                            className="form-control"
                                            id=""
                                            placeholder="Ex: In"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">
                                            Order Number
                                        </label>
                                        <input
                                            name="order_number"
                                            type="number"
                                            value={mystate.order_number}
                                            className="form-control"
                                            id=""
                                            placeholder="Ex: 11"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">
                                            Name
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            value={mystate.name}
                                            className="form-control"
                                            id=""
                                            placeholder="Name here"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">
                                            Address & Phone Number
                                        </label>
                                        <input
                                            name="address"
                                            type="text"
                                            value={mystate.address}
                                            className="form-control"
                                            placeholder="Ex: Mohammadpur-1207, Dhaka. 01912345678"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">
                                            Color & Size
                                        </label>
                                        <input
                                            name="color_size"
                                            type="text"
                                            value={mystate.color_size}
                                            className="form-control"
                                            placeholder="Ex: Golden= Sofa 3+2+1 (Victory) "
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">
                                            Price
                                        </label>
                                        <input
                                            name="price"
                                            type="number"
                                            value={mystate.price}
                                            className="form-control"
                                            id=""
                                            placeholder="Ex: 65000"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-3 form-group">
                                        <label> Select Vandor </label>
                                        <div className="selectOrder">
                                            <Select
                                                name="vador_id"
                                                options={vandorList}
                                                value={selectedOption}
                                                onChange={handleSelect}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlTextarea1" className="form-label">
                                            Note
                                        </label>
                                        <textarea
                                            name="note"
                                            value={mystate.note}
                                            className="form-control"
                                            id="exampleFormControlTextarea1"
                                            rows="3"
                                            placeholder="type here"
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" variant="success">
                                Save Order
                            </Button>
                        </Form>
                    </div>
                </Collapse>
            </div>
            {/* ================================== Add Order End Here ================================== */}

            <section id="orderSheet_1">
                <DataTable columns={columns} data={tableData} selectableRows customStyles={customCSS} onSelectedRowsChange={handleRowSelected} />
            </section>
            {
                (show === true)?
                <OrderEditModal show={show} handleClose={handleClose} orderid={orderid} handleRefresh={handleRefresh} />
                :null
            }
            {/* <OrderEditModal show={show} handleClose={handleClose} orderid={orderid} handleRefresh={handleRefresh} /> */}
            <FloatLoader isLoading={isLoading} />
        </>
    );
};

export default OrderSheet_1;
