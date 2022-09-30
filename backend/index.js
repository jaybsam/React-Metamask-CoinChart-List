const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

async function getPriceFeed(){

	const siteUrl = 'https://coinmarketcap.com';

	const { data } = await axios({
		method: "GET",
		url: siteUrl
	});



	const $ = cheerio.load(data);
	const elemSelector = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr';

	const keys = [
	'ranks',
	'name',
	'price',
	'24h',
	'7d',
	'marketCap',
	'volume',
	'circulatingSupply'
	]

	const coinArr = [];

	$(elemSelector).each((parentIdx, parentElem) => {
		let keyIdx = 0;
		const coinObj = {};

		if(parentIdx <= 9){
			$(parentElem).children().each((childIdx, childElem) => {
				console.log("=======================")
				console.log($(childElem).html())
				let tdvalue = $(childElem).text();

				if(keyIdx === 1 || keyIdx === 6){
					tdvalue = $('p:first-child', $(childElem).html()).text();
				}

				if(tdvalue){
					coinObj[keys[keyIdx]] = tdvalue;

					keyIdx++;
				}
			})

			coinArr.push(coinObj);
		}
	});

	return coinArr;
}


const app = express();
app.get("/api/price-feed", async(req, res) => {
	const priceFeed = await getPriceFeed();

	return res.status(200).json({
		result: priceFeed
	})
});

app.listen(4000, () => {
	console.log("Running on port 3000");
})