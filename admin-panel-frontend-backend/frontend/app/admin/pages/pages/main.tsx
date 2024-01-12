'use client'
import React, { ReactNode } from 'react'
import style from './pages.module.scss'
import HeaderComponent from '@/src/components/PagesComponents/HeaderComponent'
import PublishComponent from '@/src/components/PagesComponents/PublishComponent'
import ChangeComponent from '@/src/components/PagesComponents/ChangeComponent'
import TitleComponent from '@/src/components/PagesComponents/TitleComponent'
import TextEditorComponent from '@/src/components/PagesComponents/TextEditorComponent'

type Props = {
  setOpenModal: (openModal: boolean) => void
}

const PagesMain = (props: Props) => {
  const title = 'Главная страница'
  const CloseModal = () => {
    props.setOpenModal(true)
}
  return (
    <>
    <div className={style.containter}>
      <div className={style.main}>
        <HeaderComponent/>
        <ChangeComponent/>
        <button onClick={CloseModal}><p>Открыть модалку</p></button>
        <TitleComponent title={title}/>
        <TextEditorComponent/>
      </div>
      <div className={style.mainside}>
        <PublishComponent/>
      </div>
    </div>
    </>
  )
}

export default PagesMain