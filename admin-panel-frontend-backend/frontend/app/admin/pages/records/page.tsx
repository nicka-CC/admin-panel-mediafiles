import Sidebar from '@/src/components/Base/Sidebar'
import React from 'react'
import styles from '@/src/styles/base.module.scss'
import Header from '@/src/components/Base/Header'
import Main from '@/src/components/Base/Main'
import RecordsMain from './main'
import Head from 'next/head'
type Props = {}

const records = (props: Props) => {
  return (
    <>
      <main>
        <div className={styles.container}>
          <Sidebar className={styles.sidebar}/>
          <div className={styles.content}>
          <Header className={styles.header} name={'Тестинг'} role={'Админ'}/>
          <Main children={<RecordsMain/>} className={styles.contentMain}/>
          </div>
        </div>
      </main>
    </>
  )
}

export default records