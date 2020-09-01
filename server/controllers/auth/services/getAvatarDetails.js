const gravatar = require('gravatar');

function getAvatarDetails(email) {
    return gravatar.url(email, {
        r: 'pg',
        d: 'mm',
        s: '200',
    })
}

module.exports = { getAvatarDetails };