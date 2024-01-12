import React, { useCallback, useState } from 'react';
import style from './newfiles.module.scss';
import Image from 'next/image';
import srch from '@/public/media/close_window.svg';
import * as Api from '@/app/api';
import { useRouter } from 'next/navigation';
import { IProduct } from './models';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

type Props = {
  setOpenModal: (openModal: boolean) => void;
  onCreate: (product: IProduct) => void;
};

export function Newfiles(props: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const CloseModal = () => {
    props.setOpenModal(false);
  };


  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const SubmitHandler = async () => {
    if (file) {
      const File = new FormData();
      File.append('filename', file.name); // Полное имя файла с расширением
      File.append('alt', 'значение_по_умолчанию'); // Значение по умолчанию для alt
      File.append('compression', 100);
      File.append('file', file);

      try {
        console.log(File);
        
        const response = Api.files.new_file(File)
        const JSONData = (await response).json()
        props.onCreate(JSONData.data);
        props.setOpenModal(false);

      } catch (error) {
        console.error('Error uploading file:', error);
      } 
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop,
    accept: 'image/jpeg, image/png', });
  return (
    <>
      <div className={style.background}>
        <div className={style.mod_window}>
          <div className={style.mod_container}>
            <div className={style.mod_header}>
              <div className={style.header_text}>Добавить файл</div>

              <div className={style.close_btn}>
                <button onClick={CloseModal}>
                  <Image src={srch} />
                </button>
              </div>
            </div>
            <div>
            <div className={style.mod_main}>
  <div className={style.file_p} {...getRootProps()}>
    <input type="file" className={style.file} {...getInputProps()} />
    <div className={style.file_p_text}>Выберите файл</div>
  </div>
</div>
              <div className={style.mod_foot}>
                <div className={style.mf_f}>
                  <button className={style.mf_o} type="button" onClick={CloseModal}>
                    Отменить
                  </button>
                  <button className={style.mf_g} onClick={SubmitHandler} type="button">
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
