// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
const axios = require("axios");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
db.settings({ ignoreUdefinedProperties: true });


// Main function that populates firestore from all API data.
exports.getAllAPI = functions.https.onRequest(async () => {
  return oseana();
  //oseana(), stavanagerKonserthus(), ullensaker(), brottetAmfi();
});

//#region Stavangeren (Tickemaster)
async function stavangeren(){
  return await axios.get("https://app.ticketmaster.eu/mfxapi/v2/events?apikey=2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL&domain=norway&venue_ids=6253,6255,13077&rows=250")
  .then(response => {
    const stavangerenEvents = response.data["events"];
    stavangerenEvents.map(async element => {
      const stavangerenEventID = element.id;
      return stavangerenEventData(stavangerenEventID);
    });
  })
  .catch(error => {
    console.log(error);
  });
};

// Function that imports a single events data which is re-written to match the structure of the TIX API. 
async function stavangerenEventData(stavangerenEventID) {
  return await axios.get(`https://app.ticketmaster.eu/mfxapi/v2/events/${stavangerenEventID}?apikey=2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL&domain=norway&venue_ids=6253,6255,13077&rows=250`)
  .then(async response => {
    const eventGroupId = response.data;


    const categories = [];
    await eventGroupId.categories.map(async element => {
      categories.push(element.name);
      categories.push(element.subcategories[0].name);
      return categories.join(', ');
    });

    let local_date;
    try {
      local_date = eventGroupId.local_event_date.value;
    }
    catch(err){
      local_date = 'No date';
    }
    
    let price_min;
    let price_max;
    try {
      price_min = eventGroupId.price_ranges.including_ticket_fees.min;
      price_max = eventGroupId.price_ranges.including_ticket_fees.max;
    }
    catch(err){
      price_min = 'No price';
      price_max = 'No price';
    }
    

    
    
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
                "StartDate": local_date,
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
                "MinPrice": price_min,
                "MaxPrice": price_max,
                "Prices": [],
                "Benefits": []
            }
        ]
    }

    //Add reworkedEvent to firestore
    const eventRef = admin.firestore().collection(`konserthus/stavangeren/events`).doc(reworkedEvent.EventGroupId);
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });

}
//#endregion

//#region Brottet Amfi (Tickemaster) Ingen eventer fra api?
async function brottetAmfi(){
  return await axios.get("https://app.ticketmaster.eu/mfxapi/v2/events?apikey=2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL&domain=norway&venue_ids=14597&rows=250")
  .then(response => {
    const brottetAmfiEvents = response.data["events"];
    brottetAmfiEvents.map(async element => {
      const brottetAmfiEventID = element.id;
      return brottetAmfiEventData(brottetAmfiEventID);
    });
  })
  .catch(error => {
    console.log(error);
  });
};

// Function that imports a single events data which is re-written to match the structure of the TIX API. 
async function brottetAmfiEventData(brottetAmfiEventID) {
  return await axios.get(`https://app.ticketmaster.eu/mfxapi/v2/events/${brottetAmfiEventID}?apikey=2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL&domain=norway`)
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
    const eventRef = admin.firestore().collection(`konserthus/brottetAmfi/events`).doc(reworkedEvent.EventGroupId);
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });

}
//#endregion

//#region Oseana (Ticketmaster)


// Gets ticketmaster event id's so they can be passed to the importEventData function.
async function oseana(){
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
};

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
    console.log(eventGroupId.id)

    let attractionsId;
    let attractionsName;
    try{
      attractionsId = eventGroupId.attractions[0].name;
      attractionsName = eventGroupId.attractions[0].name;
    }
    catch(err){
      attractionsId = 'Not available';
      attractionsName = 'Not available';
    };


    let price_min;
    let price_max;
    try {
      price_min = eventGroupId.price_ranges.including_ticket_fees.min;
      price_max = eventGroupId.price_ranges.including_ticket_fees.max;
    }
    catch(err){
      price_min = 'No price';
      price_max = 'No price';
    };


    let image;
    try {
      image = eventGroupId.images.standard.url;
    }
    catch(err){
      image = 'No image';
    };


    let description;
    if (typeof description === 'undefined') {
      description = 'No description';

    }else{
      description = eventGroupId.description;
    };

    
    const reworkedEvent = 
    {
        "ExternalReferenceNumber": "",
        "EventGroupId": eventGroupId.id,
        "Name": eventGroupId.name,
        "SubTitle": "",
        "Description": description,
        "ImageCacheKey": "",
        "EventImagePath": image,
        "FeaturedImagePath": image,
        "PosterImagePath": image,
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
                "EventId": attractionsId,
                "DefaultEventGroupId": "",
                "Name": attractionsName,
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
                "MinPrice": price_min,
                "MaxPrice": price_max,
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

//#endregion

//#region Ullensaker (Ticketmaster)
async function ullensaker(){
  return await axios.get("https://app.ticketmaster.eu/mfxapi/v2/events?apikey=2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL&domain=norway&venue_ids=7555,7557,7559,7561,7581,20269&rows=250")
  .then(response => {
    const ullensakerEvents = response.data["events"];
    ullensakerEvents.map(async element => {
      const ullensakerEventID = element.id;
      return ullensakerEventData(ullensakerEventID);
    });
  })
  .catch(error => {
    console.log(error);
  });
};

// Function that imports a single events data which is re-written to match the structure of the TIX API. 
async function ullensakerEventData(ullensakerEventID) {
  return await axios.get(`https://app.ticketmaster.eu/mfxapi/v2/events/${ullensakerEventID}?apikey=2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL&domain=norway`)
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
    const eventRef = admin.firestore().collection(`konserthus/ullensaker/events`).doc(reworkedEvent.EventGroupId);
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });

}

//#endregion

//#region Stavanger Konserthus (TIX)

async function stavanagerKonserthus(){
  return await axios.get("https://eventapi.tix.no/v2/Events/c359ed7aa32e48ba")
  .then(response => {
    return importEventDataTIX(response.data);
  })
  .catch(error => {
    console.log(error);
  });
};

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
//#endregion
