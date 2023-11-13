"use client";
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { RiBarChartHorizontalLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'
import Profile from '../Profile/Profile'
import auth from "../../../libraries/AuthLibrary";

const Header = ({ callback }) => {
  const [isToggle, seIsToggle] = useState(false)
  const [filterText, setFilterText] = useState('');
  const router = useRouter()

  

  const handleSearch = (e)=>{
    e.preventDefault();
    router.push(`/global-search/${filterText}`)
  }

  useEffect(() => {
    callback(isToggle)
  }, [isToggle])

  return (
    <header id="header" className={isToggle ? 'collapsed' : null}>
      <div className="header-top d-flex align-items-center justify-content-between">
        <div className='d-flex align-items-center'>
          <div className="btn loggol" onClick={() => seIsToggle(!isToggle)}>
            <RiBarChartHorizontalLine className="fs-4" />
          </div>
          <div className="productBtns">
            {
              (auth.type() === 'superadmin' || auth.type() === 'useradmin' || auth.type() === 'manageradmin') ?
                (
                  <Link className="bg_0" href="/order-sheets">
                    Order Sheets
                  </Link>
                ) : null
            }
            {
              (auth.type() === 'superadmin' || auth.type() === 'manageradmin') ?
                (
                  <Link className="bg_1" href="/stock">
                    Stock
                  </Link>
                ) : null
            }
            {
              (auth.type() === 'superadmin' || auth.type() === 'manageradmin' || auth.type() === 'accountadmin') ?
                (
                  <Link className="bg_2" href="/home-delivery">
                    Home Delivery
                  </Link>
                ) : null
            }
            {
              (auth.type() === 'superadmin' || auth.type() === 'manageradmin' || auth.type() === 'accountadmin') ?
                (
                  <Link className="bg_3" href="/courier">
                    Courier
                  </Link>
                ) : null
            }
            {
              (auth.type() === 'superadmin' || auth.type() === 'manageradmin') ?
                (
                  <Link className="bg_4" href="/return">
                    Return
                  </Link>
                ) : null
            }
            {
              (auth.type() === 'superadmin' || auth.type() === 'accountadmin') ?
                (
                  <Link className="bg_5" href="/payment">
                    Payment
                  </Link>
                ) : null
            }

          </div>
        </div>

        <div className="rightBox d-flex align-items-center">
          <form className="d-flex me-4" role="search" onSubmit={(e)=>handleSearch(e)}>
            <input
              className="form-control me-2 py-1"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </form>
          <Profile />
        </div>
      </div>
    </header>
  )
}

export default Header
