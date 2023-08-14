const { MessageMedia } = require('whatsapp-web.js');
const { createClient } = require('pexels');
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
		this.pexelsClient = createClient(process.env.PEXELS_API_KEY);
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

	capitalize (str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}

	help (message, type) {
		let help = [];
		if (type === '') {
			help = [
				'Whatsapp bot - made by Ismael',
				'',
				'Commands:',
				'!help - Display help',
				'!meme - Generate a meme',
				'!image - Display an image',
				'!weather - Get weather data'
			];
		} else if (type === 'meme') {
			help = [
				' !meme drake "creating branches" "working on master"',
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
				'- therock',
				'',
				'Uses imgflip API: https://imgflip.com/api'
			];
		} else if (type === 'image') {
			help = [
				' !image "landscape"',
				'',
				'Uses Pexels API: https://api.pexels.com'
			];
		} else if (type === 'weather') {
			help = [
				'!weather Montevideo',
				'',
				'Response example:',
				'',
				'Weather in Montevideo:',
				'Temperature: 11C',
				'Humidity: 42%',
				'Wind Speed: 7Km/h'
			];
		}
			
		let formattedHelp = '';

		help.map(helpLine => formattedHelp += helpLine + '\n')
		this.client.sendMessage(message.from, formattedHelp)
	}

	generateImage (commandMsg) {
		let query = commandMsg.body.split(' ').slice(1).join(' ');
		let url = `https://api.pexels.com/v1/search?query=${query}&per_page=15`;

		axios.get(url, {
			headers: {
				authorization: process.env.PEXELS_API_KEY
			}
		}).then(async res => {
			let imageIndex = Math.floor(Math.random() * res.data.photos.length - 1);
			if (res.data.photos.length > 0) {
				const media = await MessageMedia.fromUrl(res.data.photos[imageIndex].src.medium);
				commandMsg.reply(media)
			}
		})
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

	getWeather (message, location) {
		let lat;
		let lon;

		axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}`)
		.then(async res => {
			lat = res.data[0].lat;
			lon = res.data[0].lon;


			axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`)
			.then(async res => {
				let { temp, humidity, wind_speed } = res.data.current;
				
				let response = `Weather in ${location}:\nTemperature: ${temp}C\nHumidity: ${humidity}%\nWind Speed: ${wind_speed}Km/h`;
				
				this.client.sendMessage(message.from, response)
			})
			.catch (error => {
				console.log(error);
			});
		})
		.catch((error) => {
			console.log(error);
		});

	}

	run (message) {
		let command = message.body.split(' ')[0];

		if (command === '!help') {
			let commandParam = '';
			if (message.body.split(' ').length > 1) {
				commandParam = message.body.split(' ')[1];
			}

			this.help(message, commandParam)
		} else if (command === '!meme') {
			this.generateMeme(message)
		} else if (command === '!image') {
			this.generateImage(message)
		} else if (command === '!weather') {
			let location;

			if (message.body.split(' ').length > 1) {
				location = message.body.split(' ')[1];
				this.getWeather(message, location);
			} else {
				this.client.sendMessage(message.from, 'Invalid location, use "!help weather" for help');
			}

		}
	}
}

module.exports = Bot;
