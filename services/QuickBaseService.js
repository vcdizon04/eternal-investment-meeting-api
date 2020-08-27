const axios = require('axios').default;
const { default: Axios } = require('axios');
const { getAllPresents } = require('./MeetingService');

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
        6,9,14,3,60,269,19,13
        ],
        "where": "{6.CT.'"+ user.username +"'}",
    };
    return axios.post('https://api.quickbase.com/v1/records/query', JSON.stringify(body), {
        headers: headers
    })
}

const getAllAbsents = () => {
    let userIds = '';
    const presents = getAllPresents();
    presents.forEach(user => {
        userIds += `${user.id},`
    })
    userIds = userIds.substring(0, userIds.length);
    console.log(userIds);
    let body = {
        "from": "bqspvwtgy",
        "select": [
        6,9,14,3,60,269,19,13
        ],
        "where": `{3.XHAS.'${userIds}'}AND{13.CT.'Active'}`,
    };
    body = JSON.stringify(body);
    return axios.post('https://api.quickbase.com/v1/records/query', body, {
        headers: headers
    })
}

module.exports = {
    getUser,
    getAllAbsents
}