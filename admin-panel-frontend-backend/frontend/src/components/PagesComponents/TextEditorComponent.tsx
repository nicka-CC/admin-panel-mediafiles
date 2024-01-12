'use client'
import React, { useEffect, useState } from 'react'
import style from '@/app/admin/pages/pages/pages.module.scss'
import dynamic from 'next/dynamic'
const CKeditor = dynamic(() => import("@/src/components/CkEditor/CKEditor"), { ssr: false });
type Props = {}
const TextEditorComponent = () => {
    const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
    const [data, setData] = useState<string>("");
  
    useEffect(() => {
      setEditorLoaded(true);
    }, [])
    return (
      <div className={style.textEditor}>
        <CKeditor
          name="description"
          onChange={(data: string) => {
            setData(data);
          }}
          editorLoaded={editorLoaded}
        />
        {JSON.stringify(data)}
      </div>
    );
  }
export default TextEditorComponent