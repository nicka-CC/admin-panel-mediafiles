import style from '@/app/admin/pages/pages/pages.module.scss'


type Props = {
    title: string
}
const TitleComponent = (props: Props) => {
  return (
    <div className={style.title}><p>{props.title}</p></div>
  )
}

export default TitleComponent