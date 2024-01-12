
import React from 'react'
import styles from '@/src/styles/Auth.module.scss'
import LoginMain from './main'


type Props = {}

const login = (props: Props) => {
  return (
    <>
        <div className={styles.container}>
          <LoginMain className={styles.contentMain} />
          </div>
    </>
  )
}

export default login