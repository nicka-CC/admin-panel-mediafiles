'use client'
import React from 'react'
import style from '@/app/admin/pages/pages/pages.module.scss'

import Pagination from './../../../../src/components/Addons/Pagination'

type Props = {
    pages: DataDTO;
    currentPage: number;
    setCurrentPage: (arg: number) => void;
}

const FilesPagination = ({pages,setCurrentPage,currentPage}: Props) => {

    let arr = Array.from({ length: pages?.total_pages || 0 }, (_, i) => i + 1);
  return (
    <div className={style.records_control_header}>
        <div className={style.container_inner}>
            <div className={style.pagination}>
            <Pagination pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            </div>
        </div>
    </div>
  )
}

export default FilesPagination