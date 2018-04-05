import request from 'superagent'

const CURRENT_TIME = new Date(Date.now()).toISOString();
import {CALENDAR_ID, API_KEY} from './config';

const GOOGLE_CAL_URL = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${CURRENT_TIME}`;

function extractGoogleCalLocation(location) {
    const newLocation = [];

    function checkZipCity(raw) {
        let splitted = raw.trim().split(/\s/);
        if (raw.trim().match(/^[0-9]{4,5}/)) {
            newLocation.zip = raw.trim().match(/^[0-9]{4,5}/g)[0];
            newLocation.city = splitted.slice(1).join(" ");
            return true;
        } else if (!raw.trim().match(/[0-9]{4,5}\s+/g) && !checkAddress(raw)) { // no zip
            newLocation.city = splitted.join(" ");
            return true;
        } else
            return false;
    }

    function checkCountry(raw) {
        // no digits or .
        if (!raw.match(/([0-9]{1,}|\.)/)) {
            newLocation.country = raw;
            return true;
        } else return false;
    }

    function checkAddress(raw) {
        if (raw.trim().match(/([A-Za-z])+[\.]?\s+[0-9]+/g)) {
            newLocation.address = raw.trim();
            return true;
        } else return false;
    }

    if (location !== undefined) {
        location = location.split(/,/ig);

    const locLen = location.length;
    if (locLen > 1) {
        for (let i = 0; i < locLen; i++) {
            if (newLocation.city === undefined)
                checkZipCity(location[i]);
            if (newLocation.address === undefined)
                checkAddress(location[i]);
            if (newLocation.country === undefined && !(locLen === 2 && i == 0))
                checkCountry(location[i]);
        }
    } else {
        checkZipCity(location[0]);
    }
    }
    return newLocation

}

export function getEvents(callback) {
    request
        .get(GOOGLE_CAL_URL)
        .end((err, resp) => {
            if (!err) {
                const events = [];
                JSON.parse(resp.text).items.map((event) => {
                    if(event.status !== "cancelled") {
                        events.push({
                            start: event.start.date || event.start.dateTime,
                            end: event.end.date || event.end.dateTime,
                            title: event.summary,
                            location: extractGoogleCalLocation(event.location),
                            full: event,
                        })
                    }
                });
                callback(events)
            } else {
                console.log("Error: Connection to Calendar can't established", err, resp);
                resp = JSON.parse(resp.text);
                console.log(resp);
                if (resp.error) {
                    console.log("Error-Code:" + resp.error.code, resp.error.message);
                }

            }
        })
}