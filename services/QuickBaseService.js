const axios = require('axios').default;
const { default: Axios } = require('axios');

const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'QB-Realm-Hostname': 'eternalinvestments.quickbase.com',
    'Authorization': 'QB-USER-TOKEN b5pjaf_nykk_bm57maxmibwhmdp4uvudbwv9iiy',
    'User-Agent': 'DeveloperQB',

}

const getUser =  (user) => {
    const body = {
        "from": "bqspvwtgy",
        "select": [
        6,9,14,3
        ],
        "where": "{6.CT.'"+ user.username +"'}",
    };
    return axios.post('https://api.quickbase.com/v1/records/query', JSON.stringify(body), {
        headers: headers
    })
}

module.exports = {
    getUser
}