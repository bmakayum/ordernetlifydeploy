'use client'
import React from 'react'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin3Line } from 'react-icons/ri'

const ProductList = () => {
  return (
    <>
      <section id="productList">
        <div className="row">
          {/* <div className="col-lg-3">
            <div className="selectOrder">
              <select
                className="form-select form-select-lg mb-3 mb-5"
                aria-label=".form-select-lg example"
                defaultValue={0}
              >
                <option value="0">Select Order Sheet</option>
                <option value="1">Order Sheet - 1</option>
                <option value="2">Order Sheet - 2</option>
                <option value="3">Order Sheet - 3</option>
                <option value="4">Order Sheet - 4</option>
                <option value="5">Order Sheet - 5</option>
                <option value="6">Order Sheet - 6</option>
                <option value="7">Order Sheet - 7</option>
                <option value="8">Order Sheet - 8</option>
                <option value="9">Order Sheet - 9</option>
                <option value="10">Order Sheet - 10</option>
              </select>
            </div>
          </div> */}
          <div className="col-lg-3">
            <form className="d-flex me-4 mb-5" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>

        <table className="table">
          <thead className='bg-light'>
            <tr>
              <th scope="col">S/N</th>
              <th scope="col">Name</th>
              <th scope="col">Date</th>
              <th scope="col">Code</th>
              <th scope="col">Order No.</th>
              <th scope="col">Address</th>
              <th scope="col">Color And Size</th>
              <th scope="col">Taka</th>
              <th scope="col" className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Jiaur Rahman</td>
              <td>15-09-2023</td>
              <td>In</td>
              <td>11</td>
              <td className="addressColumn">
                Mohammadpur-1207, Dhaka. Mohammadpur-1207, Dhaka.
                Mohammadpur-1207, Dhaka. 019123456789
              </td>
              <td>Golden= Sofa 3+2+1 (Victory)</td>
              <td>35000</td>
              <td className='text-center'>
                <button type="button" className="btn btn-primary btn-sm">
                  Stock
                </button>
                <button type="button" className="btn btn-primary btn-sm ms-2">
                  <FiEdit className="fs-6" />
                </button>
                <button type="button" className="btn btn-danger btn-sm ms-2">
                  <RiDeleteBin3Line className="fs-6" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  )
}

export default ProductList
