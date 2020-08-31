const axios = require('axios').default;
const { default: Axios } = require('axios');
const { getAllPresents, updateAbsentUser } = require('./MeetingService');
const moment = require("moment");

const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'QB-Realm-Hostname': 'eternalinvestments.quickbase.com',
    'Authorization': 'QB-USER-TOKEN b5pjaf_nykk_bm57maxmibwhmdp4uvudbwv9iiy',
    'User-Agent': 'DeveloperQB',

}

const getAttendanceByFullname = (fullName) => {
    const body = {
        "from": "bqspvwtx9",
        "select": [
            3,11
        ],
        "where": `{11.CT.'${fullName}'}`,
    };
    return axios.post('https://api.quickbase.com/v1/records/query', JSON.stringify(body), {
        headers: headers
    })
}

const addRemarks = async (id, reason) => {
    const currentHours = new Date().getHours();

    const body = {
        "to": "bqspvwtx9",
         "data": [
             {
                 "3": {
                     "value": id
                 },
                 [currentHours >= 13 && currentHours < 19 ? '102' : '103']: {
                     "value": false
                 },
                 "108": {
                     "value": true
                 },
                "112": {
                    "value": true
                },
                "113": {
                    "value": `${reason}`
                },
             }
         ],
     };
    updateAbsentUser(id, reason);
    return axios.post('https://api.quickbase.com/v1/records', JSON.stringify(body), {
        headers: headers
    })
}

const updateAttendance = async (id) => {
    const body = {
       "to": "bqspvwtx9",
        "data": [
            {
                "3": {
                    "value": id
                },
                
            }
        ],
    };
    const currentHours = new Date().getHours();

    if(currentHours >= 13 && currentHours < 19 ) {
        body.data[0]['59'] = {
            "value": true
        }
    
            
    } else {
        body.data[0]['99'] = {
            "value": true
        }
    }

    console.log(JSON.stringify(body))

    return axios.post('https://api.quickbase.com/v1/records', JSON.stringify(body), {
        headers: headers
    })
}

const updateAbsentsAttendance = async (ids) => {
    const body = {
       "to": "bqspvwtx9",
        "data": [
           
        ],
    };
    const currentHours = new Date().getHours();
    ids.forEach(id => {
        const data =  {
            "3": {
                "value": id
            },
        };
    
        if(currentHours >= 13 && currentHours < 19 ) {
            data['102'] = {
                "value": true
            }
        
                
        } else {
            data['103'] = {
                "value": true
            }
        }

        body.data.push(data);
    
    })

    console.log(JSON.stringify(body))
    return axios.post('https://api.quickbase.com/v1/records', JSON.stringify(body), {
        headers: headers
    })
}

const getAllAttendance = () => {
    const body = {
        "from": "bqspvwtx9",
        "select": [
            3,11,6
        ],
        "where": `{6.CT.'${moment().format('MM-DD-YYYY')}'}`
    };
    console.log(body);
    return axios.post('https://api.quickbase.com/v1/records/query', JSON.stringify(body), {
        headers: headers
    })
}

const getUser =  (user) => {
    const body = {
        "from": "bqspvwtgy",
        "select": [
        6,9,14,3,60,269,19,13,119
        ],
        "where": "{6.EX.'"+ user.username +"'}"
    };
    return axios.post('https://api.quickbase.com/v1/records/query', JSON.stringify(body), {
        headers: headers
    })
}

const getAllAbsents = () => {
    let body = {
        "from": "bqspvwtgy",
        "select": [
        6,9,14,3,60,269,19,13,119
        ],
        "where": `{13.EX.'Active'}`
    };
    body = JSON.stringify(body);
    return axios.post('https://api.quickbase.com/v1/records/query', body, {
        headers: headers
    })
}

module.exports = {
    getUser,
    getAllAbsents,
    getAttendanceByFullname,
    updateAttendance,
    getAllAttendance,
    updateAbsentsAttendance,
    addRemarks
}