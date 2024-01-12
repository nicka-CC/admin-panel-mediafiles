import style from '@/app/admin/pages/pages/pages.module.scss'
type Props = {}

const HeaderComponent = (props: Props) => {
  return (
    <div className={style.header}>
        <h1>Страница / Редактирование страницы</h1>
    </div>
  )
}

export default HeaderComponent