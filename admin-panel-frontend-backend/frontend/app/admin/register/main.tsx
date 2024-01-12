'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import styles from '@/src/styles/Auth.module.scss'
import EyeOpen from '@/src/components/Icons/EyeOpen'
import EyeClose from '@/src/components/Icons/EyeClose'
import Input from '@/src/components/Auth/Input'
import { useRouter } from 'next/navigation';
import Load from '@/src/components/Addons/Load'
import LoadStyle from '@/src/styles/Addons/Load.module.scss'
import * as Api from '@/app/api'
type Props = {
  className: string,
}
const RegisterMain = (props: Props) => {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordVisibleConfirm, setPasswordVisibilityConfirm] = useState(false);
  const [err, setErr] = useState(false)
  const [loading,setLoad] = useState(false)
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const inputTypeConfirm = isPasswordVisibleConfirm ? 'text' : 'password';
  const inputType = isPasswordVisible ? 'text' : 'password';
  const router = useRouter();
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };
  const togglePasswordVisibilityConfirm = () => {
    setPasswordVisibilityConfirm(!isPasswordVisibleConfirm);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await Api.auth.register({name: name,email: email,password: password})
      console.log(response)
    }
    catch (err){
      console.log(err)
    }
  };
  if (loading) {
    return (
      <div className={LoadStyle.LoadPage}>
        <Load/>
      </div>
    )
  }
  return (
    <>
    <form onSubmit={handleSubmit} className={styles.block} autoComplete='new-password'>
      <div className={styles.header}>
        <p>Регистрация</p>
      </div>
      <div className={styles.input}>
        <p>Имя Пользователя</p>
        <Input
            className={styles.passwordInput}
            type='text'
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
      </div>
      <div className={styles.input}>
        <p>Email</p>
        <Input
            className={styles.passwordInput}
            type='text'
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
      </div>
      <div className={styles.password}>
        {/* <div className={styles.passwordLabel}><h1>Password</h1><p>Забыли пароль?</p></div> */}
        <div className={styles.passwordLabel}><h1>Пароль</h1></div>
          <div className={styles.inputContainer}>
          <Input
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
      <div className={styles.password}>
        <div className={styles.passwordLabel}><h1>Подтвердить Пароль</h1></div>
          <div className={styles.inputContainer}>
          <Input
            className={styles.passwordInput}
            type={inputTypeConfirm}
            value={passwordConfirm}
            onChange={(e: any) => setPasswordConfirm(e.target.value)}
          />
          <button
            className={styles.eyeButton}
            onClick={togglePasswordVisibilityConfirm}
            type="button"
          >
            {isPasswordVisibleConfirm? <EyeClose/> : <EyeOpen />}
          </button>
        </div>
      </div>
      <button type="submit" className={styles.cta}>
        <p>Продолжить</p>
      </button>
      </form>
    </>
  )
}

export default RegisterMain