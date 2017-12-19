const fs = require('fs')
const Xray = require('x-ray')
const jsonexport = require('jsonexport')

var x = Xray().throttle(2, 1000)

// var reader = x('http://forskning.mah.se/org/fak/5', '#Toggle', ['b'], [{
//   name: 'a',
//   link: 'a@href'
// }])
//   .stream(console.log())


// var writer = fs.createWriteStream('names.csv')

// var options = {
//   rowDelimiter: '',
//   headers: ['Namn']
// }
// reader.pipe(jsonexport(options)).pipe(writer)
var fetchNames = () => {
  try {
    var namesandlinks = fs.readFileSync('namesandlinks.json')
    return JSON.parse(namesandlinks)
  } catch (e) {
    return []
  }
}

var saveFile = (emails) => {
  fs.writeFileSync('namesandlinks.json', JSON.stringify(emails))
}
var csvconvert = () => {
  var reader = fs.createReadStream('namesandlinks.json')
  var writer = fs.createWriteStream('out.csv')
  reader.pipe(jsonexport()).pipe(writer)
}

var scrape = () => {x('http://forskning.mah.se/org/fak/5', '#Toggle', [{
  name: ['b a'],
  link: ['b a@href']
}])((err, res) => {
  if(err) {
    console.log(err)
  } else {
    fs.writeFileSync('namesandlinks.json', JSON.stringify(res))

    var links = {res}
    links = links.res[0].link

    links.forEach((link) => {
      x(link, '.advanced-content', [{
        email: 'h2+table td+'
      }]) ((err, res) => {
        var names = fetchNames()
        var email = res 
        names.push(email)
        saveFile(names)
      })
    })
  }
})}

scrape()

