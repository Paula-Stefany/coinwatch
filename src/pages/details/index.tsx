import { useEffect, useState } from 'react';
import styles from './details.module.css'
import { useParams, useNavigate } from 'react-router'
import { CoinsProps } from '../home'

interface ResponseData{
    data: CoinsProps;
}

interface ErrorData{
    error: string;
}

type DataProps = ResponseData | ErrorData;

export function Details(){

    const { cripto } = useParams();
    const [coin, setCoin] = useState<CoinsProps>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        async function getCoinData(){

            try{
        
                fetch(`https://api.coincap.io/v2/assets/${cripto}`)
                .then(response => response.json())
                .then((data: DataProps) => {

                    if("error" in data){
                        navigate("/");
                        return;
                    };

                    if("data" in data){

                        const price = Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD"
                        })

                        const formatedPriceField = Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            notation: "compact"
                        })

                        const prevCoin = data.data;

                        const additionalFormatedFields = {
                            ...prevCoin,
                            formatedPrice : price.format(Number(data.data.priceUsd)),
                            formatedVolume : formatedPriceField.format(Number(data.data.volumeUsd24Hr)),
                            formatedMarket : formatedPriceField.format(Number(data.data.marketCapUsd))
                        }

                        setCoin(additionalFormatedFields);
                        setLoading(false);
                    };

                })  
            } catch (error) {
                console.log(error);
                navigate("/");
            }
 
        }

        getCoinData();

    }, [])

    if(loading || !coin){
        return (
            <div className={styles.container}>
                <h2>Carregando moedas...</h2>
            </div>
            
        )
    }

    return(
        <div className={styles.container}>
            
            <div className={styles.blockCenter}>

                <h1 className={styles.title}>{coin?.name}</h1>
                <span className={styles.symbol}>{coin?.symbol}</span>

            </div>

            <section className={styles.content}>
                <div className={styles.currencyContent}>
                    <img className={styles.currencyImage} src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLocaleLowerCase()}@2x.png`} alt="Logo da Moeda" />
                    <h1>{coin.name} | {coin.symbol}</h1>
                </div>
                
                <p>
                    <strong>Preço: </strong> {coin.formatedPrice}
                </p>
                <p>
                    <strong>Volume</strong> {coin.formatedVolume}
                </p>
                <p>
                    <strong>Mercado: </strong> {coin.formatedMarket}
                </p>
                <p className={Number(coin.changePercent24Hr) < 0 ? styles.loss : styles.win }>
                    <strong>Mudança 24H: </strong> {Number(coin.changePercent24Hr).toFixed(3)}
                </p>
            </section>

        </div>
    )
}
