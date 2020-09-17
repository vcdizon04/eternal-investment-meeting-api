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
        "from": process.env.ATTENDANCE_TABLE,
        "select": [
            3,11
        ],
        "where": `{11.CT.'${fullName}'}`,
    };
    return axios.post('https://api.quickbase.com/v1/records/query', JSON.stringify(body), {
        headers: headers
    })
}

const getAttendanceByFullnameToday = (id) => {
    const toDay = moment().format('MM-DD-YYYY');
    const body = {
        "from": process.env.ATTENDANCE_TABLE,
        "select": [
            3,11,6,13,8
        ],
    
        "where": `{9.EX.'${id}'}AND{6.EX.'${toDay}'}`,
    };
    return axios.post('https://api.quickbase.com/v1/records/query', JSON.stringify(body), {
        headers: headers
    })
}

const addRemarks = async (id, username, reason) => {
    const currentHours = new Date().getHours();

    const body = {
        "to": process.env.ATTENDANCE_TABLE,
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
    updateAbsentUser(id, username, reason);
    return axios.post('https://api.quickbase.com/v1/records', JSON.stringify(body), {
        headers: headers
    })
}

const updateAttendance = async (id) => {
    const body = {
       "to": process.env.ATTENDANCE_TABLE,
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

    return axios.post('https://api.quickbase.com/v1/records', JSON.stringify(body), {
        headers: headers
    })
}

const addAttendance = async (id, status) => {
    const body = {
       "to": process.env.ATTENDANCE_TABLE,
        "data": [
            {
                "9": {
                    "value": id
                },
                "6": {
                    "value": moment().format('YYYY-MM-DD')
                },
                "13": {
                    "value": moment().format('HH:MM')
                },
                "8": {
                    "value": status
                },
                "46": {
                    "value": true
                }
                
            }
        ]
    };

    return axios.post('https://api.quickbase.com/v1/records', JSON.stringify(body), {
        headers: headers
    })
}

const updateAbsentsAttendance = async (ids) => {
    const body = {
       "to": process.env.ATTENDANCE_TABLE,
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

    return axios.post('https://api.quickbase.com/v1/records', JSON.stringify(body), {
        headers: headers
    })
}

const getAllAttendance = () => {
    const body = {
        "from": process.env.ATTENDANCE_TABLE,
        "select": [
            3,11,6,22
        ],
        "where": `{6.CT.'${moment().format('MM-DD-YYYY')}'}`
    };
    return axios.post('https://api.quickbase.com/v1/records/query', JSON.stringify(body), {
        headers: headers
    })
}

const getUser =  (user) => {
    const body = {
        "from": process.env.STAFF_TABLE,
        "select": [
        6,9,14,3,60,269,19,13,119
        ],
        "where": "{6.EX.'"+ user.username +"'}"
    };
    return axios.post('https://api.quickbase.com/v1/records/query', JSON.stringify(body), {
        headers: headers
    })
}

const updatePassword = async (id, password) => {
    const body = {
       "to": process.env.STAFF_TABLE,
        "data": [
            {
                "3": {
                    "value": id
                },
                "14": {
                    "value": password
                }
                
            }
        ],
        "fieldsToReturn": [
            6,9,14,3,60,269,19,13,119
        ]
    };
    return axios.post('https://api.quickbase.com/v1/records', JSON.stringify(body), {
        headers: headers
    })
}

const getAllAbsents = () => {
    let body = {
        "from": process.env.STAFF_TABLE,
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
    addRemarks,
    updatePassword,
    getAttendanceByFullnameToday,
    addAttendance
}