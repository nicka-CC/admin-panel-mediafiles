import React from 'react'
import styles from '@/src/styles/Auth.module.scss'
import RegisterMain from './main'


type Props = {}

const register = (props: Props) => {
  
  return (
    <>
        <div className={styles.container}>
          <RegisterMain className={styles.contentMain} />
          </div>
    </>
  )
}
export default register