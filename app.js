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
        .set({title: '.usr_befatt'})
        .find('h2+table')
        .contains('mah.se')
        .set({email: 'td+'})
        .data((data) => {
          console.log(data)
          savedData.push(data)
        })
    ])
    .done(() => {
      fs.writeFileSync(`${name}.json`, JSON.stringify(savedData, null, 4))
      var reader = fs.createReadStream(`Malmö-${name}.json`)
      var writer = fs.createWriteStream(`Malmö-${name}.csv`)
  
      reader.pipe(jsonexport({rename: ['Namn', 'Befattning', 'Epost']})).pipe(writer)
    })
}

// helper function to parse spamspan which LU uses
var emailParser = (file, uni) => {
  var emails = JSON.parse(fs.readFileSync(`${file}`))

  emails.forEach((person) => {
    var oldmail = person.email
    if(uni === 'lu') {
      var newmail = oldmail.replace(/ \[dot\] /g, '.').replace(/ \[at\] /g, '@')
    } else if (uni === 'uu') {
      var newmail = oldmail.replace(/ \[dot\] /g, '.').replace(/\[AT-tecken\]/g, '@')
    }
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
          title: '.roles',
          email: '.spamspan'
        })
        .data((data) => {
          console.log(data)
          savedData.push(data)
        })
    ])
    .done(() => {
      fs.writeFileSync(`${name}.json`, JSON.stringify(savedData, null, 4))
      emailParser(`${name}.json`, 'lu')
      var reader = fs.createReadStream(`Lund-${name}.json`)
      var writer = fs.createWriteStream(`Lund-${name}.csv`)
  
      reader.pipe(jsonexport({rename: ['Namn', 'Befattning', 'Epost']})).pipe(writer)
    })
}

//UU-institutioner: http://katalog.uu.se/
var uuScraper = (fakultet, name) => {
  let savedData = []
  osmosis
    .get(`http://katalog.uu.se/orginfo/?orgId=${fakultet}`)
    .set([
      osmosis
        .find('.unitEmployeeListContainer li')
        .contains('uu.se')
        .set({
          name: '.emp-name',
          title: '.emp-title',
          email: '.emp-email'
        })
        .data((data) => {
          console.log(data)
          savedData.push(data)
        })
    ])
    .done(() => {
      fs.writeFileSync(`${name}.json`, JSON.stringify(savedData, null, 4))
      emailParser(`${name}.json`, 'uu')
      var reader = fs.createReadStream(`Uppsala-${name}.json`)
      var writer = fs.createWriteStream(`Uppsala-${name}.csv`)
  
      reader.pipe(jsonexport({rename: ['Namn', 'Befattning', 'Epost']})).pipe(writer)
    })
}

//SU-institutioner - SOCIOLOGI
var suSocScraper = (name) => {
  let savedData = []
  osmosis
    .get('http://www.sociology.su.se/om-oss/kontakt/personal')
    .set([
      osmosis
        .find('table tr')
        .find('td>a')
        .set('name')
        .follow('@href')
        .find('.profile-info')
        .contains('@sociology.su.se')
        .set({
          title: '.employee-title',
          email: '.work-place-info a:last'
        })
        .data((data) => {
          console.log(data)
          savedData.push(data)
        })
    ])
    .done(() => {
      fs.writeFileSync(`${name}.json`, JSON.stringify(savedData, null, 4))
      var reader = fs.createReadStream(`${name}.json`)
      var writer = fs.createWriteStream(`${name}.csv`)
  
      reader.pipe(jsonexport({rename: ['Namn', 'Befattning', 'Epost']})).pipe(writer)
    })
}

// SU - STATSVETENSKAP
var suStatsScraper = (name) => {
  let savedData = []
  osmosis
    .get('http://www.statsvet.su.se/om-oss/kontakt/all-personal')
    .set([
      osmosis
        .find('table tr')
        .set({
          name: 'a:first',
          title: 'td:skip-first(1)',
          email: 'a:last'
        })
        .data((data) => {
          console.log(data)
          savedData.push(data)
        })
    ])
    .done(() => {
      fs.writeFileSync(`${name}.json`, JSON.stringify(savedData, null, 4))
      var reader = fs.createReadStream(`${name}.json`)
      var writer = fs.createWriteStream(`${name}.csv`)
  
      reader.pipe(jsonexport({rename: ['Namn', 'Befattning', 'Epost']})).pipe(writer)
    })
}

// GU - Sociologi

var guSocScraper = (name) => {
  let savedData = []
  osmosis
    .get('https://socav.gu.se/om_institutionen/?selectedTab=2&itemsPerPage=-1')
    .set([
      osmosis
        .find('table tr')
        .contains('gu.se')
        .set({
          name: 'a:first',
          title: 'td:skip-first(1)',
          email: 'a:last'
        })
        .data((data) => {
          console.log(data)
          savedData.push(data)
        })
    ])
    .done(() => {
      fs.writeFileSync(`${name}.json`, JSON.stringify(savedData, null, 4))
      emailParser(`${name}.json`, 'uu')
      var reader = fs.createReadStream(`${name}.json`)
      var writer = fs.createWriteStream(`${name}.csv`)
  
      reader.pipe(jsonexport({rename: ['Namn', 'Befattning', 'Epost']})).pipe(writer)
    })
}

// GU - Statsvetenskap

var guStatsScraper = (name) => {
  let savedData = []
  osmosis
    .get('https://pol.gu.se/om/?selectedTab=2&itemsPerPage=-1')
    .set([
      osmosis
        .find('table tr')
        .contains('gu.se')
        .set({
          name: 'a:first',
          title: 'td:skip-first(1)',
          email: 'a:last'
        })
        .data((data) => {
          console.log(data)
          savedData.push(data)
        })
    ])
    .done(() => {
      fs.writeFileSync(`${name}.json`, JSON.stringify(savedData, null, 4))
      emailParser(`${name}.json`, 'uu')
      var reader = fs.createReadStream(`${name}.json`)
      var writer = fs.createWriteStream(`${name}.csv`)
  
      reader.pipe(jsonexport({rename: ['Namn', 'Befattning', 'Epost']})).pipe(writer)
    })
}

var umuScraper = (fakultet, name) => {
  let savedData = []
  osmosis
    .get(`www.${fakultet}.umu.se/om-institutionen/personal`)
    .set([
      osmosis
        .find('.informationContainer')
        .contains('umu.se')
        .set({
          name: '.personName',
          title: '.personTitle',
          email: 'a.mail.linkableItem'
        })
        .data((data) => {
          console.log(data)
          savedData.push(data)
        })
    ])
    .done(() => {
      fs.writeFileSync(`${name}.json`, JSON.stringify(savedData, null, 4))
      emailParser(`${name}.json`, 'uu')
      var reader = fs.createReadStream(`Umeå-${name}.json`)
      var writer = fs.createWriteStream(`Umeå-${name}.csv`)
  
      reader.pipe(jsonexport({rename: ['Namn', 'Befattning', 'Epost']})).pipe(writer)
    })
}

// mahScraper('5', 'Institutionen för globala politiska studier (GPS)')
// luScraper('v1000693', 'Statsvetenskapliga institutionen')
// luScraper('v1000692', 'Sociologiska institutionen')
// uuScraper('HS13:1', 'Statsvetenskapliga institutionen')
// uuScraper('HS11:1', 'Sociologiska institutionen')
// uuScraper('HS3', 'Institutionen för freds- och konfliktforskning')
// suSocScraper('Uppsala - Sociologiska institutionen') //Bara sociologiska
// suStatsScraper('Uppsala - Statsvetenskapliga institutionen') //Bara stats
// guSocScraper('Göteborg - Sociologiska institutionen')
// guStatsScraper('Göteborg - Statsvetenskapliga institutionen')
// umuScraper('soc', 'Sociologiska institutionen')
umuScraper('pol', 'Statsvetenskapliga institutionen')