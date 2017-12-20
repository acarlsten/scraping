const fs = require('fs')

var file = fs.readFileSync('namesandlinks.json')

var document = JSON.stringify(file)

var names = document.ma,e
names = document.name

console.log(typeof document)