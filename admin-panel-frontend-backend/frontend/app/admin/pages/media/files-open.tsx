'use client'
import React, { useEffect, useState } from 'react'
import style from './filesOpen.module.scss'
import Image from 'next/image'
import srch from '@/public/media/close_window.svg'
import klen from '@/public/media/klen.jpg'
import { useRouter } from 'next/navigation'
import * as Api from '@/app/api'
type FilesData = {
    id: number;
    filename: string;
    size: string;
    filepath: string;
    alt: string;
    createdAt: string;
    updatedAt: string;
    miniature: {
      id: number;
      size: string;
      filepath: string;
      filepathSystem: string;
      createdAt: string;
      updatedAt: string;
      fileId: number;
    };
  };
type Props = {
    setOpenModall: (openModal: boolean) => void;
    fileId: number;
  }
  export function FilesOpen(props: Props) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [fileData, setFileData] = useState<FilesData | null>(null);
    const [editedAlt, setEditedAlt] = useState<string>('');
    const [editedFilename, setEditedFileName] = useState<string>('');
    const [editedCompression, setEditedCompression] = useState<string>('');
    const [shouldSendPatch, setShouldSendPatch] = useState<boolean>(false);
  
    const CloseModall = () => {
      props.setOpenModall(false);
    };
    
    const handleDelete = async () => {
      try {
        const res = await Api.files.DeleteFile([props.fileId]);
        console.log('Files deleted successfully');
      } catch (error) {
        console.error('Failed to delete files:', error);
      }
    };




    const handleSave = async () => {
      if (
          editedAlt !== fileData?.alt ||
          editedCompression !== fileData?.compression
      ) {
          setShouldSendPatch(true);
      }
  };

  const fetchData = async () => {
  };

  const sendPatchRequest = async () => {
    try {
      const compressionValue = parseInt(editedCompression);

      const patchData = {
        file_id: Number(props.fileId),
        filename: editedFilename || fileData?.filename || '',
        alt: editedAlt || fileData?.alt || '',
        compression: compressionValue,
      };

      const res5 = await Api.files.FilesUpdate(patchData);

      if (res5.ok) {
        console.log('Информация о файле успешно обновлена');
        fetchData(); 
      } else {
        console.error('Не удалось обновить информацию о файле:', res5);
      }
    } catch (error) {
      console.error('Ошибка при обновлении информации о файле:', error);
    }
  };
  useEffect(() => {
      if (shouldSendPatch) {
          sendPatchRequest();
          setShouldSendPatch(false);
      }
  }, [shouldSendPatch]);

    const Dfile = async () => {
      try {
         const res = await Api.files.GetMiniatureFile(props.fileId);
        const responseData2 = await res.json();   
        const res2 = await Api.files.GetInfoFile(props.fileId);
        const responseData = await res2.json();    
        if (responseData2 && !responseData2.error) {
          setImageSrc(responseData.filepath);
        } else {
          console.log('Error fetching miniature file:', responseData);
        }
    
        if (res2 && !res2.error) {
          setFileData(responseData); // Теперь используем responseData вместо res2.data
        } else {
          console.log('Error fetching file info:', res2);
        }
      } catch (error) {
        console.error(error);
      }
    };

      const handleDownloadOriginal = async () => {
        try {
          const res3 = await Api.files.GetInfoFile(props.fileId);
          if (res3.ok) {
            const responseData3 = await res3.json();
            const downloadLink = document.createElement('a');
            downloadLink.href = responseData3.filepath; // Используем ссылку на оригинальный файл
            downloadLink.download = responseData3.filename || 'file';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          } else {
            console.log('Error fetching file info:', res3);
          }
        } catch (error) {
          console.error(error);
        }
      }
    

  
    useEffect(() => {
      Dfile();
    }, [props.fileId]);
    useEffect(() => {
      if (shouldSendPatch) {
          sendPatchRequest();
          setShouldSendPatch(false);
      }
  }, [shouldSendPatch]);
  useEffect(() => {
    setEditedAlt(fileData?.alt || '');
    setEditedFileName(fileData?.filename || '');
}, [fileData]);
  useEffect(() => {
    Dfile();
  }, [props.fileId]);

    
    return(
        <>
        
        <div className={style.filesOpen}>

        <div className={style.modWindow}>
            <div className={style.mod_container}>

                <div className={style.mod_header}>
                    <div className={style.header_text}>Свойства файла</div>
                    <div className={style.close_btn}>
                        <button onClick={CloseModall}>
                        <Image src={srch}/>
                        </button>
                    </div>
                    
                </div>
                
                <div className={style.mod_main}>
               
                <div className={style.mod_image}>
                    {imageSrc ? (
                    <Image
                    src={imageSrc}
                    alt={fileData?.alt || "Изображение файла"}
                    width={100}
                    height={100}
                    className={style.img_mod}
                    onError={(e) => console.error('Error loading image:', e)}
                  />
                    ) : (
                    <p>Loading...</p>
                    )}
                    <div className={style.img_good_about}>
                    Примечание: сжатие применится после нажатия на кнопку “сохранить”
                    </div>
                </div>
               
                <div className={style.mod_info}>
                    <div className={style.fill_name}>
                        <div className={style.fill_name_g}>Название файла:</div>
                        <div className={style.fill_name_file}><input type="text"
                        value={editedFilename || ''}
                        onChange={(e) => setEditedFileName(e.target.value)}></input>
                      </div>
                    </div>

                    <div className={style.fill_name}>
                        <div className={style.marg_tp}>
                            <div className={style.fill_name_g}>Название атрибута alt:</div>
                            <div className={style.info_file_atribyt}><input
                            type="text"
                            value={editedAlt || ''}
                            onChange={(e) => setEditedAlt(e.target.value)}
                        />
                                        </div>
                        </div>
                    </div>

                    <div className={style.file_compression}>
                        <div className={style.marg_tp}>
                            <div className={style.file_compression_item}>Сжатие:</div>
                            <form className={style.compression_selec}>
                            <select
                                            className={style.select}
                                            value={editedCompression}
                                            onChange={(e) => setEditedCompression(e.target.value)}
                                        >
                                            <option value={1}>100%</option>
                                            <option value={10}>90%</option>
                                            <option value={20}>80%</option>
                                            <option value={30}>70%</option>
                                            <option value={40}>60%</option>
                                            <option value={50}>50%</option>
                                            <option value={60}>40%</option>
                                            <option value={70}>30%</option>
                                            <option value={80}>20%</option>
                                            <option value={89}>10%</option>
                                            <option value={99}>отсутствует</option>
                                        </select>
                                        
                            </form>
                        </div>
                    </div>

                    <div className={style.file_size}>
                        <div className={style.marg_tp}>
                            <div className={style.file_size_}>Размер файла:</div>
                            <div className={style.file__size}>{fileData?.size || 'N/A'}</div>
                        </div>
                    </div>
                </div>
                </div>
                
                <div  className={style.mode_footer}>
                    <div className={style.mf_download}>
                        <button onClick={handleDownloadOriginal} className={style.mf_download}>Скачать оригинал</button>
                    </div>

                    <div className={style.mff_dd}>
                        <div className={style.mf_del_down}>
                        <button className={style.mfi_delete} onClick={handleDelete}>Удалить</button>
                        <button className={style.mfi_download} onClick={handleSave}>Сохранить</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        
        </>
    )
}