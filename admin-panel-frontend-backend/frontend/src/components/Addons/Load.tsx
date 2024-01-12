import style from '@/src/styles/Addons/Load.module.scss'
const Load = () => {
  return (
    <div style={{height: '100vh', width: '100wh',display: 'flex',justifyContent: 'center', alignItems: 'center'}}>
    <div className={style.spinner}></div>
    </div>
  )
}

export default Load