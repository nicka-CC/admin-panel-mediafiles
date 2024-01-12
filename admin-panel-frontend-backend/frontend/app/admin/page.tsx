
import Sidebar from '@/src/components/Base/Sidebar'
import styles from '@/src/styles/base.module.scss'
import Header from '@/src/components/Base/Header'
import Main from '@/src/components/Base/Main'
import AppMain from './main'
export default async function Home() {

  return (
    <>
      <main>
        <div className={styles.container}>
          <Sidebar className={styles.sidebar}/>
          <div className={styles.content}>
          <Header className={styles.header} name={'Тестинг'} role={'Админ'}/>
            <Main children={<AppMain/>} className={styles.contentMain}/>
          </div>
        </div>
      </main>
    </>
  )
}