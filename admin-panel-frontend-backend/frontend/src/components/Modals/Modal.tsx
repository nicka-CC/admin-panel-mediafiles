import React from 'react'
import styles from './modal.module.scss'
type Props = {}

const Modal = ({
    children,
  }: {
    children: React.ReactNode
  }) => {

  return (
    <div className={styles.modal}>
      {children}
    </div>
  )
}

export default Modal