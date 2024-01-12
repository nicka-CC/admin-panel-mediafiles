import React, { MouseEventHandler } from 'react'
import styles from '@/src/components/Modals/modal.module.scss'
type Props = {
    setOpenModalll: (openModalll: boolean) => void;
}

const QDEL = (props: Props) => {
    const CloseModalll = () => {
        props.setOpenModalll(false)
    }
  return (
    <div className={styles.modalContent}>
        <div className={styles.confirmModal}>
            <p>Вы уверены в своем решении?</p>
            <button >Да</button>
            <button >Нет</button>
          </div>
        </div>
  )
}

export default QDEL