import styles from './header.module.css'
import { Link } from 'react-router'


export function Header(){

    return(
        <header className={styles.header}>
            <Link className={styles.headerTitle} to="/">
                COINWATCH
            </Link>
        </header>
    )

}
