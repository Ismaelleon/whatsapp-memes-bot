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

client.on('message', message => bot.run(message))
client.on('message_create', message => bot.run(message))

client.initialize()
