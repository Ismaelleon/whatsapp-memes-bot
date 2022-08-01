const axios = require('axios');

async function main () {
	try {
		const res = await axios.get('https://flagcdn.com/w320/uy.png', { responseType: 'arraybuffer' });

		let base64Image = Buffer.from(res.data, 'binary').toString('base64');

		console.log(base64Image)
	} catch (error) {
		console.log(error)
	}
}

main()
