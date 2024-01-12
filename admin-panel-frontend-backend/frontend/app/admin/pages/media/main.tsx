'use client'
import React, { useEffect, useState } from 'react'
import styles from '@/src/styles/ComponentsStyle/main.module.scss'
import style from './media.module.scss'
import { Modal } from '@/src/components/media/contentmedia'
import Image from 'next/image'
import srch from '@/public/media/search.svg'
import del from '@/public/media/delete__icon-inactive.svg'
import delR from '@/public/media/delete-red.svg'
import add from '@/public/media/add.svg'
import klen from '@/public/media/klen.jpg'
import { IProduct } from './models'
import styless from './file.module.scss'

import { products } from './products'
import * as Api from '@/app/api'
import { useRouter } from 'next/navigation'
import FilesPagination from './filespagination'

type Props = {
  setOpenModal: (openModal: boolean) => void;
  setOpenModall: (openModall: boolean) => void;
  setOpenModalll: (openModal: boolean) => void;
  setSelectedFileId: (fileId: number) => void;
}

interface FetchDataDTO {
  currentPage: number,
  setPages: (arg: DataDTO) => void,
  filename?: string,  // Добавлен параметр для поиска
}


const MediaMain = (props: Props) => {

  const [openModall, setOpenModall] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [searchResults, setSearchResults] = useState<DataDTO>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [filename, setFilename] = useState('');
  const router = useRouter();
  const CloseModal = () => {
    props.setOpenModal(true)
  }
  const CloseModall = (fileId) => {
    console.log(fileId);
    
    props.setOpenModall(true)
  }
const fetchData = async ({ currentPage, setPages, filename }: FetchDataDTO) => {
  try {
    const data = await Api.files.SearchFilesG(currentPage, 22, filename || ''); // Передача filename в запрос
    console.log(data);

    if (!data.ok) {
      throw new Error('Failed to fetch data');
    }
    setPages(await data.json());
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
  const handleFileClick = (productId: number) => {
    const index = selectedFiles.indexOf(productId);
    if (index === -1) {
      setSelectedFiles([...selectedFiles, productId]);
    } else {
      const newSelectedFiles = selectedFiles.filter((id) => id !== productId);
      setSelectedFiles(newSelectedFiles);
    }
  };


  const CloseModalll = () => {
    props.setOpenModalll(true);
  };


  // const handleDelete = async () => {
  //   setShowDeleteModal(true);
  // };
  const handleConfirmDelete = async () => {
    try {
      const res = await Api.files.DeleteFile(selectedFiles);
      console.log('Files deleted successfully');
  
      // Опционально: сбросьте выбранные файлы после успешного удаления
      setSelectedFiles([]);
  
      // После удаления файлов, можно также обновить страницу или обновить список файлов
      fetchData({ currentPage, setPages, filename });
    } catch (error) {
      console.error('Failed to delete files:', error);
    } finally {
      // Закрываем модальное окно после завершения удаления
      setShowDeleteModal(false);
    }
  };
  
  const handleCancelDelete = () => {
    // Отмена удаления - закрыть модальное окно
    setShowDeleteModal(false);
  };

  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState(''); // Добавлено состояние для поиска
  const [pages, setPages] = useState<DataDTO>();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(event.target.value);
  };
  
  const handleSearch = () => {
    console.log(filename);
    
    
    fetchData({ currentPage: 1, setPages, filename });
  };

  useEffect(() => {
    fetchData({ currentPage, setPages});
  }, [currentPage, searchTerm]);
  

  return (
    <main>
      <div className={style.mainN}>
        <div className={style.media_container}>
          <div className={style.media_header}>
            <div className={style.item1}>Медиафайлы</div>
            <div className={style.search_container}>
              <div className={style.search_bar_container}>
                <div className={style.searches}>
                  <label className={style.search1}>
                      <input
                        type="text"
                        className={style.search1}
                        placeholder="Введите текст..."
                        value={filename} // измените значение на filename
                        onChange={handleSearchChange} // измените обработчик на handleSearchChange
                      />
                  </label>
                  <button type="button" onClick={handleSearch}>
                    <Image src={srch} alt="search" className={style.search2} />
                  </button>
                </div>
              </div>
              <div>
                <button type="button" className={style.search_btn} onClick={handleSearch}>
                  Поиск
                </button>
              </div>
            </div>
            <div className={style.del_add}>
            <div className={`${style.delete} ${selectedFiles.length > 0 ? styles.delete_container_active : ''}`}>
              <button className={style.delete_container} onClick={handleConfirmDelete} type="button">
                <Image src={selectedFiles.length > 0 ? delR : del} alt="delete" className={style.delete_icon} />
                <p className={`${style.delete_text} ${selectedFiles.length > 0 ? styles.delete_text_red : styles.delete_text_norm}`}>удалить</p>
              </button>
            </div>
              <div className={style.adds}>
                <form>
                  <button type="button" onClick={CloseModal} className={style.add}>
                    <Image src={add} alt="+" className={style.add_img} />
                    <p className={style.add_text}>добавить</p>
                  </button>
                </form>
              </div>
            </div>
          </div>



      <div className={style.files}>
        {pages && pages.rows && pages.rows.map((file) => (
          <div className={`${style.file} ${selectedFiles.includes(file.id) ? styless.file_active : ''}`} key={file.id}>
            <label>
              <input
                type='checkbox'
                className={style.file_choose}
                id={`checkbox_${file.id}`}
                checked={selectedFiles.includes(file.id)}
                onChange={() => {
                  
                  handleFileClick(file.id);
                  if (file.id !== null) {
                    props.setSelectedFileId(file.id);
                  }
                }}
              />
            </label>
            <button onClick={() => CloseModall(file.id)}
            onChange={() => {
              handleFileClick(file.id);
              if (file.id !== null && e.parentNode) {
                props.setSelectedFileId(file.id);
              }
            }}>
              <Image
                src={file.miniature ? file.miniature.filepath : klen}
                width={140}
                height={140}
                alt={`Image ${file.id}`}
                className={style.file_img}
                onError={(e) => console.error('Error loading image:', e)}
              />
            </button>
          </div>
        ))}
      </div>




          <FilesPagination pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
      </div>
    </main>
  );
};

export default MediaMain;
