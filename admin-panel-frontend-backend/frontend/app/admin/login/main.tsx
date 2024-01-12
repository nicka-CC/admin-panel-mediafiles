'use client'
import {FormEventHandler, useState} from 'react'
import styles from '@/src/styles/Auth.module.scss'
import Link from 'next/link'
import EyeClose from '@/src/components/Icons/EyeClose'
import EyeOpen from '@/src/components/Icons/EyeOpen'
import { useRouter } from 'next/navigation'
import * as Api from '@/app/api'
type Props = {
  className: string
}

const LoginMain = (props: Props) => {
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [password, setPassword] = useState('');
    const [err, setErr] = useState(false)
    const [load,setLoad] = useState(false)
    const [email,setEmail] = useState('')
    const router = useRouter()
    const togglePasswordVisibility = () => {
      setPasswordVisibility(!isPasswordVisible);
    };
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
      event.preventDefault()
        const res = await Api.auth.login({email,password})
      if (res && !res.error){
        router.push('/admin')
      }else{
        console.log(res)
      }
    }
    const inputType = isPasswordVisible ? 'text' : 'password';
  return (
    <form onSubmit={handleSubmit} className={styles.block}>
      <div className={styles.header}>
        <p>Вход</p>
      </div>
      <div className={styles.input}>
        <p>Email</p>
        <input
            className={styles.passwordInput}
            type='text'
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
      </div>
      <div className={styles.password}>
        <div className={styles.passwordLabel}>
          <h1>Password</h1>
          <Link href='/forgot'>
            <p>Забыли пароль?</p>
          </Link>
          </div>
          <div className={styles.inputContainer}>
          <input
            className={styles.passwordInput}
            type={inputType}
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <button
            className={styles.eyeButton}
            onClick={togglePasswordVisibility}
            type="button"
          >
            {isPasswordVisible? <EyeClose/> : <EyeOpen />}
          </button>
        </div>
      </div>
      <button type="submit" className={styles.cta}>
        <p>Продолжить</p>
      </button>
      </form>
  )
}

export default LoginMain