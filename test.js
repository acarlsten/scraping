const fs = require('fs')

var emailParser = (file) => {
  var emails = JSON.parse(fs.readFileSync(`${file}`))

  emails.forEach((person) => {
    var oldmail = person.email
    var newmail = oldmail.replace(/ \[dot\] /g, '.').replace(/ \[at\] /g, '@')
    person.email = newmail
    return person
  })

  fs.writeFileSync(JSON.stringify(emails))
}