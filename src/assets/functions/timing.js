function calcTime(oldTime) {
    let lastActive = new Date(oldTime),
        acStatusObj = {
            time: {
                localTime: lastActive.toLocaleString(),
                _inMiliSec: lastActive.getTime(),
            },
            timing: {
                min: Math.floor((new Date().getTime() - lastActive.getTime()) / 1000 / 60),
                hr: 0,
                day: 0,
            },
        },
        returnStatus = "active";

    // get hours and days
    acStatusObj.timing.hr = Math.floor(
        acStatusObj.timing.min > 59 ? acStatusObj.timing.min / 60 : 0
    );
    acStatusObj.timing.day = Math.floor(
        acStatusObj.timing.hr >= 24 ? acStatusObj.timing.hr / 24 : 0
    );

    // setup calc function
    if (acStatusObj.timing.day > 0) {
        returnStatus =
            acStatusObj.timing.day + (acStatusObj.timing.day > 1 ? " days" : " day");
    } else if (acStatusObj.timing.hr > 0) {
        returnStatus =
            acStatusObj.timing.hr + (acStatusObj.timing.hr > 1 ? " hours" : " hour");
    } else if (acStatusObj.timing.min > 5) {
        returnStatus = acStatusObj.timing.min + " minutes";
    }
    return returnStatus === 'active' ? 'active' : returnStatus+' ago';
}

export default calcTime;