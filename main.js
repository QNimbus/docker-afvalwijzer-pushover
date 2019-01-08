// Pushover
const Pushover = require('pushover-notifications')
const pushover = new Pushover({
    user: process.env['PUSHOVER_USER'],
    token: process.env['PUSHOVER_TOKEN'],
});

// Request
const request = require('request-promise');

// Cheerio
const cheerio = require('cheerio');
const $ = cheerio;

// MomentJS
const moment = require('moment');

// Constants
const containerType = Object.freeze({
    'kunststof': 'PMD container (grijs - groot)',
    'GFT': 'GFT container (groen)',
    'restafval': 'Restafval container (grijs - klein)',
    'papier': 'Papier container (blauw)',
    'kerstbomen': 'Kerstboom'
});

// Config
const msgSound = process.env['PUSHOVER_SOUND'] || 'tugboat';
const msgPriority = process.env['PUSHOVER_PRIORITY'] || 0;
const msgTitle = process.env['PUSHOVER_TITLE'] || 'Container herinnering';
const dayOffset = process.env['DAYOFFSET'] || 0;
const zipCode = process.env['ZIPCODE'];
const houseNumber = process.env['HOUSENUMBER'];
const houseNumberAddition = process.env['HOUSENUMBER_ADDITION'] || '';
const url = `https://www.afvalwijzer-arnhem.nl/applicatie?ZipCode=${zipCode}&HouseNumber=${houseNumber}&HouseNumberAddition=${houseNumberAddition}`;

async function getUpcomingDates() {
    try {
        // Get HTML page
        let htmlString = await request(url);

        let afvalTypes = new Object;
        let htmlObjects = $('div#pickupdates li', htmlString);

        for (let index = 0, length = htmlObjects.length; index < length; index++) {
            let htmlObject = htmlObjects[index];
            let afvalType = htmlObject.attribs.class;

            afvalTypes[afvalType] = new Object;

            htmlObject.children.forEach(child => {
                switch (child.type) {
                    case 'text': {
                        // Strip all whitespace from element body
                        // What remains should be a date
                        let contents = child.data.replace(/^[ \s]+|[ \s]+$/g, '');
                        if (contents.length > 0) {
                            let date = moment(contents, 'D-M-YYYY');
                            afvalTypes[afvalType].date = date;
                        };
                        break;
                    }
                    case 'tag': {
                        // Strip all whitespace from element body
                        // What remains should be the container description
                        let contents = child.firstChild.data.replace(/^[ \s]+|[ \s]+$/g, '');
                        afvalTypes[afvalType].desc = contents;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
        }
        return afvalTypes;
    } catch (error) {
        console.log(error);
    }
}

async function main() {
    // Gets upcoming dates for the containers in JSON format (e.g. { 'papier': { 'omschrijving: 'Papier en karton', 'datum': '2019-01-12T00:00:00.000' } })
    let upcomingDates = await getUpcomingDates();
    let notified = false;
    let dayString = '';

    dayString = ['Vandaag', 'Morgen', 'Overmorgen'][dayOffset] || `Over ${dayOffset} dagen`;
    
    // Loop through upcoming dates and see if any is for today or tomorrow
    Object.entries(upcomingDates).forEach(
        ([type, obj]) => {
            let checkDate = moment().add(dayOffset, 'day');

            if (moment(obj.date).isSame(checkDate, 'day')) {
                var msg = {
                    message: `${dayString} moet de '${containerType[type] || type + ' container'}' aan de weg`,
                    title: msgTitle,
                    sound: msgSound,
                    priority: msgPriority,
                };

                pushover.send(msg, function (err, result) {
                    if (err) {
                        throw err
                    }
                    console.log(`[${moment().format('DD-MM-YYYY HH:MM')}] Pushover notificatie verstuurd: '${msg.message}' :: ${result}`);
                });
                notified = true;
            }
        }
    );

    notified || console.log(`[${moment().format('DD-MM-YYYY HH:MM')}] ${dayString} wordt er geen container opgehaald...`);
}

main();