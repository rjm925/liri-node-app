console.log('Keys loaded\n');

//Twitter Keys
var twitterKeys = {
  consumer_key: '2GPwyoyxdQ5YXEmadW3RymxXc',
  consumer_secret: 'JZCgSZT9dlkopDgrdHL2MvcGrLg3cAkZ6tZb4IHnj8iIQEU9RV',
  access_token_key: '910891797588664320-7CtTxrlyWM3eUz4knBNyG78Af09pxYQ',
  access_token_secret: 'gjosfayJZFXgQ75wQXTAwXUHOu2j2N8ziK3E08nDWuoF2',
}

//Spotify Keys
var spotifyKeys = {
	id: 'fd81302a0b5c4f34b9aac143f9205286',
	secret: 'b1ccd5d069284f69b1995aa6f6493940'
}

//exports Keys to liri.js
module.exports = {
	twitterKeys: twitterKeys,
	spotifyKeys: spotifyKeys
}