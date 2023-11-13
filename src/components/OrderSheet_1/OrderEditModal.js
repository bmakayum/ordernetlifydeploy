"use client";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import axios from "axios";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Cookies from "cookies-js";
import Select from "react-select";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { vandorList, getVandorById, updateOrderTrack } from "../../helpers/AppHelper";
import FloatLoader from "@/utilities/loader/FloatLoader";

const OrderEditModal = (props) => {
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
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);




    const loadOrderById = async () => {
        let id = props.orderid;
        await axios
            .get(`/order/${id}`, {
                headers: {
                    Authorization: Cookies.get("access-token"),
                    "content-type": "multipart/form-data",
                },
                //cancelToken: this.axiosCancelSource.token
            })
            .then(async (response) => {
                setMystate({
                    date: response.data.data.date,
                    code: response.data.data.code,
                    order_number: response.data.data.order_number,
                    name: response.data.data.name,
                    address: response.data.data.address,
                    phone: response.data.data.phone,
                    color_size: response.data.data.color_size,
                    price: response.data.data.price,
                    ordercategory_id: response.data.data.ordercategory_id,
                    vandor_id: response.data.data.vandor_id,
                    track_id: response.data.data.track_id,
                    note: response.data.data.note,
                })
                if(response.data.data.vandor_id){
                    setSelectedOption(getVandorById(response.data.data.vandor_id));
                }
                
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    const handleChange = (e) => {
        setMystate({ ...mystate, [e.target.name]: e.target.value });
    };

    const handleSelect = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)
        console.log(mystate);
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
        // formdata.append("vandor_id", mystate.vandor_id ? parseInt(mystate.vandor_id) : "");
        formdata.append("vandor_id", selectedOption ? parseInt(selectedOption.value) : "");
        formdata.append("track_id", parseInt(mystate.track_id));
        formdata.append("note", mystate.note);

        axios
            .post("/order/" + props.orderid, formdata, {
                headers: {
                    Authorization: Cookies.get("access-token"),
                    "content-type": "multipart/form-data",
                },
                //cancelToken: this.axiosCancelSource.token
            })
            .then(async (response) => {
                console.log(response)
                if (response.data) {
                    props.handleRefresh();
                    toast.success(response.data.msg, { autoClose: 3000 });
                    setTimeout(() => {
                        props.handleClose();
                    }, 100);
                    setIsLoading(false)
                    //props.handleClose();
                    //loadOrdersBySheet(props.sheetId);
                    //reset();
                } else {
                    toast.error(response.data.msg, { autoClose: 3000 });
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    };



    useEffect(() => {
        loadOrderById();
    }, [props.orderid]);

    return (
        <>
            <Modal show={props.show}
                onHide={props.handleClose}
            >
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">
                                        Date
                                    </label>
                                    <input name="date" type="date" value={mystate.date} className="form-control" id="date" onChange={handleChange} />
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
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">
                                        Select Vandor
                                    </label>
                                    <div className="selectOrder">
                                        <Select
                                            name="vador_id"
                                            value={selectedOption}
                                            options={vandorList}
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary"
                            onClick={props.handleClose}
                        >
                            Close
                        </Button>
                        <Button type="submit" variant="success">
                            Save Order
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <FloatLoader isLoading={isLoading} />
        </>
    )
}

export default OrderEditModal