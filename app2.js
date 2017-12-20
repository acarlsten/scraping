const fs = require('fs')
const jsonexport = require('jsonexport')

var osmosis = require('osmosis')

var saveFile = (emails) => {
  fs.writeFileSync('Test.json', JSON.stringify(emails))
}

let savedData = []
osmosis
  .get('http://forskning.mah.se/org/fak/5')
  .set([
    osmosis
      .find('#Toggle')
      .find('b>a')
      .set('name')
      .follow('@href')
      .find('.advanced-content')
      .find('h2+table')
      .contains('mah.se')
      .set({email: 'td+'})
      .data((data) => savedData.push(data))
  ])
  .done(() => {
    fs.writeFileSync('fil.json', JSON.stringify(savedData, null, 4))
    var reader = fs.createReadStream('fil.json')
    var writer = fs.createWriteStream('out.csv')
 
    reader.pipe(jsonexport()).pipe(writer)
  })



// var x = Xray().throttle(2, 1000)

// // var reader = x('http://forskning.mah.se/org/fak/5', '#Toggle', ['b'], [{
// //   name: 'a',
// //   link: 'a@href'
// // }])
// //   .stream(console.log())


// // var writer = fs.createWriteStream('names.csv')

// // var options = {
// //   rowDelimiter: '',
// //   headers: ['Namn']
// // }
// // reader.pipe(jsonexport(options)).pipe(writer)
// var fetchNames = () => {
//   try {
//     var namesandlinks = fs.readFileSync('namesandlinks.json')
//     return JSON.parse(namesandlinks)
//   } catch (e) {
//     return []
//   }
// }


// var csvconvert = () => {
//   var reader = fs.createReadStream('namesandlinks.json')
//   var writer = fs.createWriteStream('out.csv')
//   reader.pipe(jsonexport()).pipe(writer)
// }

// var scrape = () => {x('http://forskning.mah.se/org/fak/5', '#Toggle', [{
//   name: ['b a'],
//   link: ['b a@href']
// }])((err, res) => {
//   if(err) {
//     console.log(err)
//   } else {
//     fs.writeFileSync('namesandlinks.json', JSON.stringify(res))

//     var links = {res}
//     links = links.res[0].link

//     links.forEach((link) => {
//       x(link, '.advanced-content', [{
//         email: 'h2+table td+'
//       }]) ((err, res) => {
//         var names = fetchNames()
//         var email = res 
//         names.push(email)
//         saveFile(names)
//       })
//     })
//   }
// })}

// scrape()

