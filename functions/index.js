// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
const axios = require("axios");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();


// -----------------------------------------------------------------------------------------------------------------------
//Oseana (Ticketmaster)

// Gets ticketmaster event id's so they can be passed to the importEventData function.
exports.getFromAPIoseana = functions.https.onRequest(async () => {
  return await axios.get("https://app.ticketmaster.eu/mfxapi/v2/events?apikey=JOh9A34IeevwhAOfivflIj1L2uAheycV&domain=norway&venue_ids=9589&rows=250")
  .then(response => {
    const oseanaEvents = response.data["events"];
    oseanaEvents.map(async element => {
      const eventID = element.id
      return importEventData(eventID);
    });
  })
  .catch(error => {
    console.log(error);
  });
});

// Function that imports a single events data which is re-written to match the structure of the TIX API. 
async function importEventData(eventID) {
  return await axios.get(`https://app.ticketmaster.eu/mfxapi/v2/events/${eventID}?apikey=JOh9A34IeevwhAOfivflIj1L2uAheycV&domain=norway`)
  .then(async response => {
    const eventGroupId = response.data;

    const categories = [];
    await eventGroupId.categories.map(async element => {
      categories.push(element.name);
      categories.push(element.subcategories[0].name);
      return categories.join(', ');
    });
    
    const reworkedEvent = 
    {
        "ExternalReferenceNumber": "",
        "EventGroupId": eventGroupId.id,
        "Name": eventGroupId.name,
        "SubTitle": "",
        "Description": eventGroupId.description,
        "ImageCacheKey": "",
        "EventImagePath": eventGroupId.images.standard.url,
        "FeaturedImagePath": eventGroupId.images.standard.url,
        "PosterImagePath": eventGroupId.images.standard.url,
        "ExternalUrl": "",
        "IsFilm": false,
        "PurchaseUrls": [
            {
                "LanguageName": "Norsk",
                "Culture": "nb-NO",
                "TwoLetterCulture": "nb",
                "Link": eventGroupId.url,
            }
        ],
        "Translations": [],
        "Dates": [
            {
                "EventId": eventGroupId.attractions[0].id,
                "DefaultEventGroupId": "",
                "Name": eventGroupId.attractions[0].name,
                "StartDate": eventGroupId.local_event_date.value,
                "StartDateUTCUnix": "",
                "EndDate": "",
                "EndDateUTCUnix": "",
                "WaitingList": false,
                "OnlineSaleStart": eventGroupId.on_sale_date.value,
                "OnlineSaleStartUTCUnix": "",
                "OnlineSaleEnd": eventGroupId.off_sale_date.value,
                "OnlineSaleEndUTCUnix": "",
                "Venue": eventGroupId.venue.name,
                "Hall": "",
                "Promoter": eventGroupId.promoter.name,
                "SoldOut": eventGroupId.properties.sold_out,
                "Duration": "",
                "SaleStatus": eventGroupId.properties.cancelled,
                "SaleStatusText": eventGroupId.properties.schedule_status,
                "Capacity": "",
                "Remaining": "",
                "Categories": categories.toString(),
                "CategoryTranslations": {},
                "Tags": "",
                "Translations": [],
                "PurchaseUrls": [
                    {
                        "LanguageName": "Norsk",
                        "Culture": "nb-NO",
                        "TwoLetterCulture": "nb",
                        "Link": eventGroupId.url,
                    },
                ],
                "ProductPurchaseUrls": [],
                "Products": [],
                "MinPrice": eventGroupId.price_ranges.including_ticket_fees.min,
                "MaxPrice": eventGroupId.price_ranges.including_ticket_fees.max,
                "Prices": [],
                "Benefits": []
            }
        ]
    }

    //Add reworkedEvent to firestore
    const eventRef = admin.firestore().collection(`konserthus/oseana/events`).doc(reworkedEvent.EventGroupId);
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });

}


// -----------------------------------------------------------------------------------------------------------------------
// Stavanger Konserthus (TIX)

exports.getFromAPItix = functions.https.onRequest(async () => {
  return await axios.get("https://eventapi.tix.no/v2/Events/c359ed7aa32e48ba")
  .then(response => {
    return importEventDataTIX(response.data);
  })
  .catch(error => {
    console.log(error);
  });
});

/**
 * Imports the Tix API data into firestore
 * @param {Object} events
 * @return {Promise<void>}
 */
 async function importEventDataTIX(events) {

   for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/stavangerkonserthus/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
