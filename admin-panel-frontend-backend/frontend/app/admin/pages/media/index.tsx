'use client'
import Sidebar from '@/src/components/Base/Sidebar'
import React, { useState } from 'react'
import styles from '@/src/styles/base.module.scss'
import Header from '@/src/components/Base/Header'
import Main from '@/src/components/Base/Main'
import PagesMain from './main'
import Modal from '@/src/components/Modals/Modal'
import { FilesOpen } from './files-open'
import { Newfiles } from './newfiles'
import QDEL from './QuestionDELETE'
type Props = {
    setOpenModal: (openModal: boolean) => void;
    setOpenModall: (openModall: boolean) => void;
    setOpenModalll: (openModall: boolean) => void;
}

const IndexPage = (props: Props) => {
  const [openModal,setOpenModal] = useState(false);
  const [openModall,setOpenModall] = useState(false);
  const [openModalll,setOpenModalll] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<number>(Number);
  return (
    <>
      <main>
        {openModal &&
        <Modal>
            <Newfiles setOpenModal={setOpenModal}/>
            
        </Modal>
        
        }
        {openModall &&
        <Modal>
            {/* <FilesOpen setOpenModall={(openModall: boolean) => {}} fileId={8} /> */}
            <FilesOpen setOpenModall={setOpenModall} fileId={selectedFileId} />
        </Modal>
        }
        {openModalll &&
        <Modal>
            <QDEL setOpenModalll={setOpenModalll}/>
            
        </Modal>
        
        }
        <div className={styles.container}>
          <Sidebar className={styles.sidebar}/>
          <div className={styles.content}>
          <Header className={styles.header} name={'Тестинг'} role={'Админ'}/>
          <Main children={<PagesMain setOpenModal={setOpenModal} setOpenModall={setOpenModall} setOpenModalll={setOpenModalll} setSelectedFileId={setSelectedFileId}/>} className={styles.contentMain}></Main>
          </div>
        </div>
      </main>
    </>
  )
}

export default IndexPage