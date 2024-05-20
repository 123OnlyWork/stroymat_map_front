import { FC } from 'react'
import styles from './AboutUsPage.module.css'; // Импортируем файл стилей

const AboutUsPage: FC = () => {
  return (
    <div className={styles.aboutUsPage}> {/* Применяем класс стилей к контейнеру */}
      <h2>ЭТОТ САЙТ СДЕЛАН ИСКЛЮЧИТЕЛЬНО ДЛЯ ВКР , НИКАКИЕ СТРОИТЕЛЬНЫЕ МАТЕРИАЛЫ ЗДЕСЬ НЕ ПРОДАЮТСЯ , ОПЛАЧИВАТЬ НИЧЕГО НЕ НУЖНО , ЛЮБЫЕ ДЕНЬГИ КОТОРЫЕ ВЫ ОПЛАТИТЕ ЗА ТОВАР БУДТ ПОТЕРЕНЫ , ПОТОМУ ЧТО НИКАКОГО ТОВАРА НЕТ!!!</h2> 
    </div>
  )
}

export default AboutUsPage

