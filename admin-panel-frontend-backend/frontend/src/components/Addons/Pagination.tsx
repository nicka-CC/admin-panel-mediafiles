'use client'
import React from 'react'
import Arrow from '../Icons/Arrow';
import style from '@/src/styles/Addons/Pagination.module.scss'
type Props = {
    pages: DataDTO;
    currentPage: number;
    setCurrentPage: (arg: number) => void;
}

const Pagination = ({pages,setCurrentPage,currentPage}: Props) => {
    
    const getPageNumberGroup = (total_pages: number) => {
        let start = Math.floor((currentPage - 1) / total_pages) * total_pages;
        console.log(new Array(total_pages).fill(" ").map((_, index) => start + index + 1));
        return new Array(total_pages).fill(" ").map((_, index) => start + index + 1);
      };
      let arr = pages ? getPageNumberGroup(pages.total_pages) : [1]
      
  return (
    <div className={style.pagination}>
    <button onClick={() => setCurrentPage(currentPage > 1 ? currentPage-1: 1)}>
        <Arrow style={{transform: 'rotate(90deg)'}}/>
    </button>
    {pages?.count <= 5 ? 
    <button style={{background: '#cecee4',borderRadius: '5px', boxShadow: '3px 3px 10px 3px #dddddd'}}>
        1
    </button>
    :
    arr?.map(
        (el: number) => 
        <button style={currentPage === el ? {background: '#cecee4',borderRadius: '5px', boxShadow: '3px 3px 10px 3px #dddddd'}: {}} key={el} onClick={() => setCurrentPage(el)}>
            {el}
        </button>
        )
    }
    <button onClick={() => setCurrentPage(currentPage < pages?.total_pages ? currentPage+1: currentPage)}>
        <Arrow style={{transform: 'rotate(-90deg)'}}/>
        </button>
    </div>
  )
}

export default Pagination