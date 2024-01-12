import style from '@/app/admin/pages/pages/pages.module.scss'

type Props = {}

const ChangeComponent = (props: Props) => {
  return (
    <div className={style.change}>
        <div className={style.frame1}>
            <p>Оригинал</p>
        </div>
        <div className={style.frame2}>
            <p>Редактирование</p>
        </div>
    </div>
  )
}

export default ChangeComponent