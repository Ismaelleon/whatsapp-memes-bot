# Whatsapp Memes Bot

### Features (commands between parenthesis)
 - Audio generation using [Fakeyou](https://fakeyou.com) (!audio)
 - Displaying images from [Pexels](https://pexels.com) (!image)
 - Generating memes with [ImgFlip](https://imgflip.com) (!meme)

### Prerequisites
 - [Node.js](https://nodejs.org)
 - [MongoDB](https://mongodb.com)

### Installation
1. Clone this repo
```sh
git clone https://github.com/Ismaelleon/whatsapp-memes-bot
```

2. Install NPM Packages
```sh
cd whatsapp-memes-bot/
npm install
```

3. Export authentication data
```sh
export IMGFLIP_USERNAME=yourusername
export IMGFLIP_PASSWORD=yourpassword
export FAKEYOU_USERNAME=yourusername
export FAKEYOU_PASSWORD=yourpassword
export PEXELS_API_KEY=yourpexelsapikey
```

4. Start server and scan the qr code with whatsapp app
```sh
npm start
```
