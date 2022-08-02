const { MessageMedia } = require('whatsapp-web.js');
const FakeYou = require('fakeyou.js');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');
const axios = require('axios');

class Bot {
	constructor (client) {
		this.client = client;
		this.username = process.env.IMGFLIP_USERNAME;
		this.password = process.env.IMGFLIP_PASSWORD;
		this.fy = new FakeYou.Client({
			usernameOrEmail: process.env.FAKEYOU_USERNAME,
			password: process.env.FAKEYOU_PASSWORD
		});
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
			Guyholdingcardboard: '216951317',
			Monkeypuppet: '148909805',
			Therock: '21735'
		};
	}

	async init () {
		await this.fy.start()
	}

	capitalize (str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}

	help (message) {
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

		help.map(helpLine => formattedHelp += helpLine + '\n')
		this.client.sendMessage(message.from, formattedHelp)
	}

	async generateAudio (voice, text, commandMsg) {
		try {
			await this.fy.makeTTS(voice, text)

			let model = this.fy.searchModel(voice).first();

			if (model) {
				let res = await model.request(text);
				let audioURL = 'https://storage.googleapis.com/vocodes-public';

				await exec(`ffmpeg -i ${audioURL + res.audioPath} -vn -ar 44100 -ac 2 -b:a 192k audio.mp3`)

				const media = MessageMedia.fromFilePath(path.join(__dirname, 'audio.mp3'));
				commandMsg.reply(media)

				fs.unlink(path.join(__dirname, 'audio.mp3'), (err) => {
					if (err) throw err
				})
			}
		} catch (error) {
			console.log(error)
		}
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

		let formattedURL = `https://api.imgflip.com/caption_image?template_id=${templateID}&username=${this.username}&password=${this.password}&text0=${text0}`;

		if (text1 !== undefined) {
			formattedURL += `&text1=${text1}`;
		}

		axios.post(formattedURL)
		.then(async res => {
			const media = await MessageMedia.fromUrl(res.data.data.url);
			commandMsg.reply(media)
		}).catch(error => console.log(error))
	}
}

module.exports = Bot;
