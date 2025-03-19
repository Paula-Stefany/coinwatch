import { FormEvent, useEffect, useState } from 'react'
import styles from './home.module.css'
import { Link, useNavigate } from 'react-router'
import { BsSearch } from 'react-icons/bs'


export interface CoinsProps{
    changePercent24Hr: string;
    explorer: string;
    id: string;
    marketCapUsd: string;
    maxSupply: string;
    name: string;
    priceUsd: string;
    rank: string;
    supply: string;
    symbol: string;
    volumeUsd24Hr: string;
    vwap24Hr: string;
    formatedPrice?: string; 
    formatedVolume?: string;
    formatedMarket?: string;
}

export interface DataProps{
    data: CoinsProps[];
}

export function Home(){

    const [coins, setCoins] = useState<CoinsProps[]>([]);
    const [offset, setOffset] = useState<number>(0);
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

            fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`)
            .then(response => response.json())
            .then((data: DataProps)  => {

                const listCoins = data.data;

                // Adicionando os campos formatados
                const formatedCoins = listCoins.map((coin: CoinsProps) => {
                    
                    const coinFormated = {
                        ...coin,
                        formatedPrice: formatPrice(Number(coin.priceUsd)),
                        formatedVolume: formatcompactPrice(Number(coin.volumeUsd24Hr)),
                        formatedMarket: formatcompactPrice(Number(coin.marketCapUsd)),
                    };
                    
                    return coinFormated;

                })

                
                const allCoins = [...coins, ...formatedCoins]
                setCoins(allCoins);
                
                
            })
        }

        getCoinsData();

    }, [offset]);

    function handleGetMore(){
        if(offset === 0){
            setOffset(10);
            return;
        }

        setOffset(offset + 10);
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
                                        <img src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} alt="Logo da moeda" className={styles.currencyImg}/>
                                        <Link to={`/detail/${coin.id}`} className={styles.linkCurrency}>
                                            <span>{coin.name} | {coin.symbol}</span>
                                        </Link>
                                        
                                    </div>
                                </td>
                              
                                <td className={styles.td} data-label="Valor Mercado: ">{coin.formatedMarket}</td>
                                <td className={styles.td} data-label="Preço: ">{coin.formatedPrice}</td>
                                <td className={styles.td} data-label="Volume: ">{coin.formatedVolume}</td>
                                <td className={ Number(coin.changePercent24Hr) < 0 ? styles.tdLoss : styles.tdPositive} data-label='Mudança 24H: ' >{Number(coin.changePercent24Hr).toFixed(2)}</td>
                            </tr>
                        ))}
                        
                    </tbody>

                </table>
                <button className={styles.button} onClick={ handleGetMore}>Carregar MAIS</button>
            </div>
        </main>

    )
}
