'use client'
import { useEffect, useState } from 'react'
import styles from '@/src/styles/ComponentsStyle/header.module.scss'
import { TfiArrowCircleDown } from "react-icons/tfi";
import Profile from '../Icons/Profile';
import { MdArrowForwardIos } from 'react-icons/md';
import LogOut from '../Icons/LogOut';
import * as Api from '@/app/api'
import { useRouter } from 'next/navigation';
type Props = {
  name: string,
  role: string,
  className: string 
}

const Header = (props: Props) => {
  const [dropmenu, setDropMenuOpen] = useState(false);
  const route = useRouter()
  const toggleDrop = () => {
    setDropMenuOpen(!dropmenu);
  };
  const LogOutClick = () => {
    Api.auth.logout();
    route.push('/admin/login')
  }
  return (
    <div className={styles.header}>
        <button className={styles.button}>
          <p>Перейти на сайт</p>
        </button>
        <div onClick={toggleDrop} className={styles.user}>
          <div style={{display: 'flex', alignItems: 'flex-end',flexDirection:'column'}}>
            <p style={{fontSize: '14px'}}>{props.name}</p>
            <p style={{fontSize: '8px'}}>{props.role}</p>
          </div>
          <TfiArrowCircleDown style={{paddingLeft: '10px'}} size={24}/>
        </div>
        {dropmenu &&
        <div className={styles.dropmenu}>
          <div>
            <Profile/>
            <p>Аккаунт</p>
            <MdArrowForwardIos style={{color: "#003D6C"}} size={16}/>
          </div>
          <div onClick={LogOutClick}>
            <LogOut/>
            <p>Выход</p>
            <MdArrowForwardIos style={{color: "#003D6C"}} size={16}/>
          </div>
        </div>
        }
    </div>
  )
}

export default Header