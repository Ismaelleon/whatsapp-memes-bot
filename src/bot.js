class Bot {
	constructor () {
		this.username = process.env.IMGFLIP_USERNAME;
		this.password = process.env.IMGFLIP_PASSWORD;
		this.memesID = {
			Drake: '181913649',
			Twobuttons: '87743020',
			Onedoesnotsimply: '61579',
			Changemymind: '129242436',
			Distractedboyfriend: '112126428',
			Unodrawcards: '217743513',
			Buffvscheems: '247375501',
			Epichandshake: '135256802',
			Sadpabloescobar: '80707627',
			Alwayshasbeen: '252600902',
			GuyHoldingCardboard: '216951317',
			Monkeypuppet: '148909805',
			Therock: '21735'
		};
	}

	capitalize (str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}

	help () {
		let help = [
			'Ejemplo: !meme drake "Bot de banderas" "Bot de memes"',
			'',
			'memes: ',
			'- drake',
			'- twobuttons',
			'- onedoesnotsimply',
			'- changemymind',
			'- distractedboyfriend',
			'- unodrawcards',
			'- buffyvscheems',
			'- sadpabloescobar',
			'- alwayshasbeen',
			'- guyholdingcardboard',
			'- monkeypuppet',
			'- therock'
		];
		
		let formattedHelp = '';

		help.map(helpLine => helpFormatted += helpLine + '\n')
		client.sendMessage(message.from, formattedHelp)
	}

	generateMeme (commandMsg) {
		let msg = commandMsg.body.replace(/“|”/g, '"')
		let memeData = msg.split(' '),
			memeTexts =  msg.split('"').slice(1);

		memeTexts = memeTexts.filter(el => {
			if (el !== '' && el !== ' ' && el !== '!meme') {
				return el
			}
		});

		let templateName = this.capitalize(memeData[1]);
		let templateID = this.memesID[`${templateName}`],
			text0 = memeTexts[0],
			text1 = memeTexts[1];

		let formattedURL = `https://api.imgflip.com/caption_image?template_id=${templateID}&username=${this.username}&password=${this.password}&text0=${text0}&text1=${text1}`;

		axios.post(formattedURL)
		.then(async res => {
			const imageRes = await axios.get(res.data.data.url, { responseType: 'arraybuffer' });

			let base64Image = Buffer.from(imageRes.data, 'binary').toString('base64');
			let media = new MessageMedia('image/png', base64Image);

			commandMsg.reply(media)
		}).catch(error => console.log(error))
	}
}

module.exports = Bot;
