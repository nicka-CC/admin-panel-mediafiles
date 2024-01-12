

import main from '@/src/styles/ComponentsStyle/main.module.scss'
type Props = {
    
}

const AppMain = async(props: Props) => {
  return (
    <div className={main.containter}>
    <h1 className={main.text}>Добро пожаловать в панель администратора your-site.com!</h1>
    </div>
  )
}

export default AppMain