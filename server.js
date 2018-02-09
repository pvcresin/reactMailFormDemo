const express = require('express')
const bodyParser = require('body-parser')

express()
	.use(express.static('dist'))
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.post('/sendContactMessage', (req, res) => {
		console.log(req.body)
		res.json({
			server_receive_time: new Date().toString(),
			name: req.body.name,
			text: req.body.text,
		})
	})
	.listen(3000, () => {
		console.log('http://localhost:3000')
	})