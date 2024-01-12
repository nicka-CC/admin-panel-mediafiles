import React, { ReactNode } from 'react'
import {MdArrowForwardIos} from 'react-icons/md'
import style from '@/src/styles/ComponentsStyle/sidebar.module.scss'
type Props = {
    name: string;
    component: ReactNode;
    onClick?: () => void;
    navOpen: boolean;
    select?: boolean;
}

const SidebarButton = (props: Props) => {
  return (
    <button onClick={props.onClick} className={style.sidebarButton} style={props.select ? {backgroundColor: '#EAF5FF',borderRadius: "5px"}: {}}>
        <div className={style.sidebarButtonLeft}>
        {props.name == 'Скрыть' && !props.navOpen ? <MdArrowForwardIos className={style.sidebarButtonRight} size={24}/>: props.component}
        <p>{props.name}</p>
        </div>
        {props.name != 'Скрыть' && props.navOpen && <MdArrowForwardIos className={style.sidebarButtonRight} size={24}/>}
    </button>
  )
}

export default SidebarButton