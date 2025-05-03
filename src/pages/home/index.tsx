import { FormEvent, useEffect, useState } from 'react'
import styles from './home.module.css'
import { Link, useNavigate } from 'react-router'
import { BsSearch } from 'react-icons/bs'


export interface CoinsProps{
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    roi: null | unknown;
    last_updated: string;
    formatedPrice?: string; 
    formatedVolume?: string;
    formatedMarket?: string;
}

export interface DataProps{
    data: CoinsProps[];
}

export function Home(){

    const [coins, setCoins] = useState<CoinsProps[]>([]);
    const [page, setPage] = useState<number>(0);
    const [input, setinput] = useState<string>("");
    const navigate = useNavigate();


    function formatPrice(atualPrice: number){

        const price = Intl.NumberFormat("en-US",
            { 
                style: 'currency',
                currency: "USD"
            }
        )

        return price.format(atualPrice);
    }


    function formatcompactPrice(atualPrice: number){

        const compactedPrice = Intl.NumberFormat("en-US", {
                
            currency: "USD",
            style: "currency",
            notation: "compact"
        })

        return compactedPrice.format(atualPrice);
    }
    

    useEffect(() => {
        
        async function getCoinsData(){

            fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&page=${page}`)
            .then(response => response.json())
            .then((data: CoinsProps[])  => {


                const formatedCoins = data.map((coin: CoinsProps) => {
                    
                    const coinFormated = {
                        ...coin,
                        formatedPrice: formatPrice(coin.current_price),
                        formatedVolume: formatcompactPrice(coin.total_volume),
                        formatedMarket: formatcompactPrice(coin.market_cap),
                    };
                    
                    return coinFormated;

                })

                const allCoins = [...coins, ...formatedCoins]
                setCoins(allCoins);
                console.log(coins);
                
            })
        }

        getCoinsData();

    }, [page]);

    function handleGetMore(){
        if(page === 0){
            setPage(10);
            return;
        }

        setPage(page + 10);
    }

    function handleSubmit(e: FormEvent){

        e.preventDefault();
        const  cripto = input.toLowerCase();
        console.log(cripto);

        if(cripto === "") return;
    
        navigate(`detail/${cripto}`);
    
    }


    return(
        
        <main>
            <div className={styles.container}>

                <form className={styles.inputForm} action="" onSubmit={handleSubmit}>
                    <input className={styles.input} type="text" placeholder='Nome da moeda' value={input} onChange={(e) => setinput(e.target.value)}/>
                    <button className={styles.buttonForm} type='submit'>
                        <BsSearch size={30} color='#fff'/>
                    </button>
                </form>

                <table>

                    <thead>
                        <tr className={styles.tableLine}>
                            <th scope='col'>Moeada</th>
                            <th scope='col'>Valor mercado</th>
                            <th scope='col'>Preço</th>
                            <th scope='col'>Volume</th>
                            <th scope='col'>Mudança 24H</th>
                        </tr>
                    </thead>

                    <tbody>

                        { coins.map((coin, index) => (
                            <tr  key={index} className={styles.tableLine}>

                                <td className={styles.td}>
                                    <div className={styles.currency}>
                                        <img src={coin.image} alt="Logo da moeda" className={styles.currencyImg}/>
                                        <Link to={`/detail/${coin.id}`} className={styles.linkCurrency}>
                                            <span>{coin.name} | {coin.symbol}</span>
                                        </Link>
                                        
                                    </div>
                                </td>
                              
                                <td className={styles.td} data-label="Valor Mercado: ">{coin.formatedMarket}</td>
                                <td className={styles.td} data-label="Preço: ">{coin.formatedPrice}</td>
                                <td className={styles.td} data-label="Volume: ">{coin.formatedVolume}</td>
                                <td className={ Number(coin.price_change_percentage_24h) < 0 ? styles.tdLoss : styles.tdPositive} data-label='Mudança 24H: ' >{Number(coin.price_change_percentage_24h).toFixed(2)}</td>
                            </tr>
                        ))}
                        
                    </tbody>

                </table>
                <button className={styles.button} onClick={ handleGetMore}>Carregar MAIS</button>
            </div>
        </main>

    )
}
