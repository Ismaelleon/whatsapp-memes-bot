const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const dotenv = require('dotenv');

dotenv.config()

const Bot = require('./bot')

const client = new Client({
	authStrategy: new LocalAuth()
});

const bot = new Bot(client);
bot.init()

client.on('qr', qr => {
	qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
	console.log('Client is ready!')
})

client.on('message', message => {
	try {
		if (message.body.slice(0, 5) === '!meme') {
			if (message.body.split(' ')[1] === 'help') {
				bot.help(message)
			} else {
				bot.generateMeme(message)
			}
		} else if (message.body.slice(0, 6) === '!audio') {
			let voice = message.body.split(' ').slice(1, 2),
				text = message.body.split(' ').slice(2).join(' ').replace(/"/g, '');
			bot.generateAudio(voice, text)
		}
	} catch (error) {
		console.log(error)
	}
})

client.on('message_create', message => {
	try {
		if (message.body.slice(0, 5) === '!meme') {
			if (message.body.split(' ')[1] === 'help') {
				bot.help(message)
			} else {
				bot.generateMeme(message)
			}
		} else if (message.body.slice(0, 6) === '!audio') {
			let voice = message.body.split(' ').slice(1, 2).join(),
				text = message.body.split(' ').slice(2).join(' ').replace(/"/g, '');
			bot.generateAudio(voice, text, message)
		}

	} catch (error) {
		console.log(error)
	}
})

client.initialize()
