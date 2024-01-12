'use client'
import Sidebar from '@/src/components/Base/Sidebar'
import React, { useState } from 'react'
import styles from '@/src/styles/base.module.scss'
import Header from '@/src/components/Base/Header'
import Main from '@/src/components/Base/Main'
import PagesMain from './main'
import Modal from '@/src/components/Modals/Modal'
import ModalExample from './ModalExample'
type Props = {}

const IndexPage = (props: Props) => {
  const [openModal,setOpenModal] = useState(false)
  return (
    <>
      <main>
        {openModal &&
        <Modal>
            <ModalExample setOpenModal={setOpenModal}/>
        </Modal>
        }
        <div className={styles.container}>
          <Sidebar className={styles.sidebar}/>
          <div className={styles.content}>
          <Header className={styles.header} name={'Тестинг'} role={'Админ'}/>
          <Main children={<PagesMain setOpenModal={setOpenModal}/>} className={styles.contentMain}/>
          </div>
        </div>
      </main>
    </>
  )
}

export default IndexPage