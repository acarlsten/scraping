const fs = require('fs')
const jsonexport = require('jsonexport')
var osmosis = require('osmosis')

//MAH-institutioner: http://forskning.mah.se/organisation
var mahScraper = (fakultet, name) => {
  let savedData = []
  osmosis
    .get(`http://forskning.mah.se/org/fak/${fakultet}`)
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
      var writer = fs.createWriteStream(`${name}.csv`)
  
      reader.pipe(jsonexport({rename: ['Namn', 'Epost']})).pipe(writer)
    })
}

// helper function to parse spamspan which LU uses
var emailParser = (file) => {
  var emails = JSON.parse(fs.readFileSync(`${file}`))

  emails.forEach((person) => {
    var oldmail = person.email
    var newmail = oldmail.replace(/ \[dot\] /g, '.').replace(/ \[at\] /g, '@')
    person.email = newmail
    return person
  })

  fs.writeFileSync(`${file}`, JSON.stringify(emails))
}

///LU-institutioner: https://www.lu.se/om-universitetet/ledning-och-organisation/institutioner
var luScraper = (fakultet, name) => {
  let savedData = []
  osmosis
    .get(`https://www.lu.se/lucat/group/${fakultet}`)
    .set([
      osmosis
        .find('.lucat-user')
        .set({
          name: '.name > a',
          email: '.spamspan'
        })
        .data((data) => savedData.push(data))
    ])
    .done(() => {
      fs.writeFileSync('fil.json', JSON.stringify(savedData, null, 4))
      emailParser('fil.json')
      var reader = fs.createReadStream('fil.json')
      var writer = fs.createWriteStream(`${name}.csv`)
  
      reader.pipe(jsonexport({rename: ['Namn', 'Epost']})).pipe(writer)
    })
}

luScraper('v1000065', 'Institutionen för kommunikation och medier')



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

