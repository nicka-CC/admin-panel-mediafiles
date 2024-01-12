import React, { MouseEventHandler } from 'react'
import styles from '@/src/components/Modals/modal.module.scss'
type Props = {
    setOpenModal: (openModal: boolean) => void;
}

const ModalExample = (props: Props) => {
    const CloseModal = () => {
        props.setOpenModal(false)
    }
  return (
    <div className={styles.modalContent}>
        <h1>ModalExample</h1>
        <button onClick={CloseModal}><p>Закрыть</p></button>
        </div>
  )
}

export default ModalExample