"use client";
import React from 'react'
import GlobalSearch from '@/components/GlobalSearch/GlobalSearch';


const page = ({ params }) => {
  return (
    <>
      <GlobalSearch query={params.query} />
    </>
  )
}

export default page