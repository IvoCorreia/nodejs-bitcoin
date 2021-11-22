require('dotenv-safe').config()
const { parse } = require('querystring');
const { MercadoBitcoin, MercadoBitcoinTrade } = require('./api');
const infoApi = new MercadoBitcoin({ currency: 'BTC' });
const tradeApi = new MercadoBitcoinTrade({
    currency: 'BTC',
    KEY: process.env.KEY,
    SECRET: process.env.SECRET,
    PIN: process.env.PIN
});


async function getQuantity(coin, price, isBuy) {

    price = parseFloat(price);
    coin = isBuy ? 'brl' : coin.toLowerCase();
    const data = await tradeApi.getAccountInfo();
    const balance = parseFloat(data.balance[coin].avaliable.toFixed(5));

    if (isBuy && balance < 100) return console.error("Saldo insuficiente");
    console.log("Saldo disponivel de ${coin}: ${balance}");

    let qty = 0;
    if (isBuy) qty = parseFloat((balance / price.toFixed(8)));
    return qty - 0.00000001




}


setInterval(async () => {

    const response = await infoApi.ticker();

    console.log(response);

    if (response.ticker.sell > 324454) {
        
        
        console.log('tá caro... aguardar');



    } else {



        try {

            const qty = getQuantity('BRL',response.ticker.sell, true);
            console.log("qnt possivel de comprar "+qty);
            const data = await tradeApi.placeBuyOrder(qty,response.ticker.sell);
            const data = {
                "order_id": 3,
                "coin_pair": "BRLBTC",
                "order_type": 1,
                "category": "limit",
                "status": 4,
                "has_fills": true,
                "quantity": "1.00000000",
                "limit_price": "900.00000",
                "executed_quantity": "1.00000000",
                "executed_price_avg": "900.00000",
                "fee": "0.00300000",
                "created_timestamp": "1453835329",
                "updated_timestamp": "1453835329",
                "operations": [                    {
                        "operation_id": 1,
                        "quantity": "1.00000000",
                        "price": "900.00000",
                        "fee_rate": "0.30",
                        "executed_timestamp": "1453835329"
                    }                ]

            }



            let vender= true;

            if(vender){


                const data2= tradeApi.placeSellOrder(data.quantity,(parseFloat(data.executed_price_avg)*parseFloat(process.env.PROFITABILITY)).toFixed(5) );

                console.log('ordem inserida'+data2);

            }






        } catch (error) {

            console.error(error);
        }


    }

}, process.env.CRAWLER_INTERVAL);