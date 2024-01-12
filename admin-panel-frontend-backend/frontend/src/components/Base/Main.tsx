import React, { ReactNode } from 'react'
import styles from '@/src/styles/ComponentsStyle/main.module.scss'
type Props = {
    className?: string,
    children: ReactNode,
}

const Main = (props: Props) => {
  return (
    <div className={styles.main}>
       {props.children}
    </div>
  )
}

export default Main