import styles from './notfound.module.css'
import { Link } from 'react-router'


export function NotFound(){
    return(
        <div className={styles.container}>
            <h1 className={styles.title}>Ops, ocorreu um erro! </h1>
            <Link className={styles.linkBackHome} to={'/'}>
                Clique aqui para voltar ao início
            </Link>
        </div>
    )
}
