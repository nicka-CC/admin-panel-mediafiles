'use client'

import {useState,useEffect} from 'react'
import styles from '@/src/styles/ComponentsStyle/sidebar.module.scss'
import Image from 'next/image'
import Cheese from '@/public/1658339292_50-klublady-ru-p-tatu-sir-foto-55.jpg'
import SidebarButton from '../Buttons/SidebarButton'
import {MdOutlineAccountCircle, MdOutlineArrowBackIos, MdOutlineDescription, MdOutlineFilter, MdOutlineHome, MdOutlinePushPin, MdOutlineSettings, MdSearch} from 'react-icons/md'
import {AiOutlineFolderOpen} from 'react-icons/ai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
type Props = {
  className: string
}

const Sidebar = (props: Props) => {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname()
  const toggleNav = () => {
    setNavOpen(!navOpen);
  };
  useEffect(() => {
    navOpen ? openSidebar() : closeSidebar()
  },[navOpen])
  function openSidebar() {
    document.documentElement.style.setProperty('--sidebar-width', '300px');
  }
  
  // Закрыть sidebar
  function closeSidebar() {
    document.documentElement.style.setProperty('--sidebar-width', '80px');
  }
  return (
    <div className={`${styles.sidebar} ${navOpen ? styles.open : ''}`}>
        <header>
            <Image src={Cheese} alt='Сыр' width={navOpen? 260: 40} height={navOpen? 85: 40}/>
        </header>
        <nav >
            <Link href='/admin'><SidebarButton select={pathname === '/admin'? true: false} navOpen={navOpen} name={'Главная'} component={<MdOutlineHome size={24}/>}/></Link>
            <Link href='/admin/pages/media'><SidebarButton select={pathname === '/admin/pages/media' ? true: false} navOpen={navOpen} name={'Медиафайлы'} component={<AiOutlineFolderOpen size={24}/>}/></Link>
            <Link href='/admin/pages/records'><SidebarButton select={pathname === '/admin/pages/records' ? true: false} navOpen={navOpen} name={'Записи'} component={<MdOutlinePushPin size={24}/>}/></Link>
            <Link href='/admin/pages/pages'><SidebarButton select={pathname === '/admin/pages/pages' ? true: false} navOpen={navOpen} name={'Страницы'} component={<MdOutlineDescription size={24}/>}/></Link>
            <Link href='/admin/pages/slider'><SidebarButton select={pathname === '/admin/pages/slider' ? true: false} navOpen={navOpen} name={'Слайдер'} component={<MdOutlineFilter size={24}/>}/></Link>
            <Link href='/admin/pages/seo'><SidebarButton select={pathname === '/admin/pages/seo' ? true: false} navOpen={navOpen} name={'SEO'} component={<MdSearch size={24}/>}/></Link>
            <Link href='/admin/pages/users'><SidebarButton select={pathname === '/admin/pages/users' ? true: false} navOpen={navOpen} name={'Пользователи'} component={<MdOutlineAccountCircle size={24}/>}/></Link>
            <Link href='/admin/pages/settings'><SidebarButton select={pathname === '/admin/pages/settings' ? true: false} navOpen={navOpen} name={'Настройки'} component={<MdOutlineSettings size={24}/>}/></Link>
            <SidebarButton navOpen={navOpen} onClick={toggleNav} name={'Скрыть'} component={<MdOutlineArrowBackIos size={24}/>}/>
        </nav>
    </div>
  )
}

export default Sidebar