// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
const axios = require("axios");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
db.settings({ ignoreUdefinedProperties: true });


// Main function that calls functions to populate firestore from all API data.
exports.getAllAPI = functions.https.onRequest(async () => {
  return  myMotown(), operaOstfold(), oseana(), stavanagerKonserthus(), ullensaker(), brottetAmfi(), 
  stavangeren(), mossKulturhus(), solaKulturhus(), aelvespeilet(), drammenUnion(), 
  drammenTeater(), notteroyKulturhus(), kongsberg(), ibsenhuset(), arendalKulturhus(), 
  askimKulturhus(), sandnesKulturhus(), bolgenKulturhus();;

});

//#region Bølgen Kino (TicketCo)
async function myMotown(){
  return await axios.get("https://ticketco.events/api/public/v1/events/?token=_yeEt434ywPyD3TdkFaY")
  .then(response => {
    const oseanaEvents = response.data["events"];
    oseanaEvents.map(async element => {
      const eventID = element.id
      return myMotownEventData(eventID);
    });
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
async function myMotownEventData(eventID) {
  return await axios.get(`https://ticketco.events/api/public/v1/events/${eventID}?token=_yeEt434ywPyD3TdkFaY`)
  .then(async response => {
    const eventGroupId = response.data;
    console.log(eventGroupId.id);
    //Add reworkedEvent to firestore
    const eventRef = admin.firestore().collection(`konserthus/mymotown/events`).doc(eventGroupId.id.toString());
    const res = await eventRef.set(eventGroupId);
    console.log(res);

    // const categories = [];
    // await eventGroupId.categories.map(async element => {
    //   categories.push(element.name);
    //   categories.push(element.subcategories[0].name);
    //   return categories.join(', ');
    // });
    // let local_date;
    // try {
    //   local_date = eventGroupId.local_event_date.value;
    // }
    // catch(err){
    //   local_date = 'No date';
    // }

    // let attractionsId;
    // let attractionsName;
    // try{
    //   attractionsId = eventGroupId.attractions[0].name;
    //   attractionsName = eventGroupId.attractions[0].name;
    // }
    // catch(err){
    //   attractionsId = 'Not available';
    //   attractionsName = 'Not available';
    // };


    // let price_min;
    // let price_max;
    // try {
    //   price_min = eventGroupId.price_ranges.including_ticket_fees.min;
    //   price_max = eventGroupId.price_ranges.including_ticket_fees.max;
    // }
    // catch(err){
    //   price_min = 'No price';
    //   price_max = 'No price';
    // };


    // let image;
    // try {
    //   image = eventGroupId.images.standard.url;
    // }
    // catch(err){
    //   image = 'No image';
    // };


    // let description = eventGroupId.description;

    // if (typeof description !== 'undefined') {
    //   description = description;

    // }else{
    //   description = "No description";
    // };
    
    
    // const reworkedEvent = 
    // {
    //     "ExternalReferenceNumber": "",
    //     "EventGroupId": eventGroupId.id,
    //     "Name": eventGroupId.name,
    //     "SubTitle": "",
    //     "Description": description,
    //     "ImageCacheKey": "",
    //     "EventImagePath": image,
    //     "FeaturedImagePath": image,
    //     "PosterImagePath": image,
    //     "ExternalUrl": "",
    //     "IsFilm": false,
    //     "PurchaseUrls": [
    //         {
    //             "LanguageName": "Norsk",
    //             "Culture": "nb-NO",
    //             "TwoLetterCulture": "nb",
    //             "Link": eventGroupId.url,
    //         }
    //     ],
    //     "Translations": [],
    //     "Dates": [
    //         {
    //             "EventId": attractionsId,
    //             "DefaultEventGroupId": "",
    //             "Name": attractionsName,
    //             "StartDate": local_date,
    //             "StartDateUTCUnix": "",
    //             "EndDate": "",
    //             "EndDateUTCUnix": "",
    //             "WaitingList": false,
    //             "OnlineSaleStart": eventGroupId.on_sale_date.value,
    //             "OnlineSaleStartUTCUnix": "",
    //             "OnlineSaleEnd": eventGroupId.off_sale_date.value,
    //             "OnlineSaleEndUTCUnix": "",
    //             "Venue": eventGroupId.venue.name,
    //             "Hall": "",
    //             "Promoter": eventGroupId.promoter.name,
    //             "SoldOut": eventGroupId.properties.sold_out,
    //             "Duration": "",
    //             "SaleStatus": eventGroupId.properties.cancelled,
    //             "SaleStatusText": eventGroupId.properties.schedule_status,
    //             "Capacity": "",
    //             "Remaining": "",
    //             "Categories": categories.toString(),
    //             "CategoryTranslations": {},
    //             "Tags": "",
    //             "Translations": [],
    //             "PurchaseUrls": [
    //                 {
    //                     "LanguageName": "Norsk",
    //                     "Culture": "nb-NO",
    //                     "TwoLetterCulture": "nb",
    //                     "Link": eventGroupId.url,
    //                 },
    //             ],
    //             "ProductPurchaseUrls": [],
    //             "Products": [],
    //             "MinPrice": price_min,
    //             "MaxPrice": price_max,
    //             "Prices": [],
    //             "Benefits": []
    //         }
    //     ]
    // }
    })
  .catch(error => {
    console.log(error);
  });
}
//#endregion

//#region Opera Østfold (Ticketmaster) Ingen feil
async function operaOstfold(){
  return await axios.get("https://app.ticketmaster.eu/mfxapi/v2/events?apikey=2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL&domain=norway&venue_ids=2263,16749,9989,18217&rows=250")
  .then(response => {
    const operaOstfoldEvents = response.data["events"];
    operaOstfoldEvents.map(async element => {
      const operaOstfoldEventID = element.id;
      return operaOstfoldEventData(operaOstfoldEventID);
    });
  })
  .catch(error => {
    console.log(error);
  });
};

// Function that imports a single events data which is re-written to match the structure of the TIX API. 
async function operaOstfoldEventData(operaOstfoldEventID) {
  return await axios.get(`https://app.ticketmaster.eu/mfxapi/v2/events/${operaOstfoldEventID}?apikey=JOh9A34IeevwhAOfivflIj1L2uAheycV&domain=norway`)
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

    let description = eventGroupId.description;

    if (typeof description !== 'undefined') {
      description = description;

    }else{
      description = "No description";
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
    const eventRef = admin.firestore().collection(`konserthus/operaøstfold/events`).doc(reworkedEvent.EventGroupId);
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });

}
//#endregion

//#region Stavangeren (Tickemaster) Ingen feil 
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


    let description = eventGroupId.description;

    if (typeof description !== 'undefined') {
      description = description;

    }else{
      description = "No description";
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
    let local_date;
    try {
      local_date = eventGroupId.local_event_date.value;
    }
    catch(err){
      local_date = 'No date';
    }

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


    let description = eventGroupId.description;

    if (typeof description !== 'undefined') {
      description = description;

    }else{
      description = "No description";
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
    const eventRef = admin.firestore().collection(`konserthus/brottetAmfi/events`).doc(reworkedEvent.EventGroupId);
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });

}
//#endregion

//#region Oseana (Ticketmaster) Ingen feil


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
    let local_date;
    try {
      local_date = eventGroupId.local_event_date.value;
    }
    catch(err){
      local_date = 'No date';
    }

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


    let description = eventGroupId.description;

    if (typeof description !== 'undefined') {
      description = description;

    }else{
      description = "No description";
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
    const eventRef = admin.firestore().collection(`konserthus/oseana/events`).doc(reworkedEvent.EventGroupId);
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });

}

//#endregion

//#region Ullensaker (Ticketmaster) Ingen feil
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
    let local_date;
    try {
      local_date = eventGroupId.local_event_date.value;
    }
    catch(err){
      local_date = 'No date';
    }

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


    let description = eventGroupId.description;

    if (typeof description !== 'undefined') {
      description = description;

    }else{
      description = "No description";
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
    const eventRef = admin.firestore().collection(`konserthus/ullensaker/events`).doc(reworkedEvent.EventGroupId);
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });

}

//#endregion

//#region Stavanger Konserthus (TIX) Ingen feil


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

//#region Moss kulturhus (TIX) Ingen feil

async function mossKulturhus(){
  return await axios.get("https://eventapi.tix.no/v2/Events/2e3aa1d4758049c9/")
  .then(response => {
    return mossEventDataTIX(response.data);
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
async function mossEventDataTIX(events) {

  for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/mosskulturhus/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
//#endregion

//#region Sola Kulturhus (TIX) Ingen feil
async function solaKulturhus(){
  return await axios.get("https://eventapi.tix.no/v2/Events/625a4ae28f9340ef/")
  .then(response => {
    return solaEventDataTIX(response.data);
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
async function solaEventDataTIX(events) {

  for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/solakulturhus/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
//#endregion

//#region Bølgen Kulturhus (TIX) Ingen feil
async function bolgenKulturhus(){
  return await axios.get("https://eventapi.tix.no/v2/Events/8efc856f1b704a94/")
  .then(response => {
    return bolgenEventDataTIX(response.data);
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
async function bolgenEventDataTIX(events) {

  for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/bølgenkulturhus/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
//#endregion

//#region Sandnes Kulturhus (TIX) Ingen feil
async function sandnesKulturhus(){
  return await axios.get("https://eventapi.tix.no/v2/Events/97bd45c4aa32fe43/")
  .then(response => {
    return sandnesEventDataTIX(response.data);
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
async function sandnesEventDataTIX(events) {

  for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/sandneskulturhus/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
//#endregion

//#region Askim Kulturhus (TIX) Ingen feil
async function askimKulturhus(){
  return await axios.get("https://eventapi.tix.no/v2/Events/3a056daed43e480b/")
  .then(response => {
    return askimEventDataTIX(response.data);
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
async function askimEventDataTIX(events) {

  for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/askimkulturhus/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
//#endregion

//#region Arendal Kulturhus (TIX) Ingen feil
async function arendalKulturhus(){
  return await axios.get("https://eventapi.tix.no/v2/Events/a9a8392408f64a9e/")
  .then(response => {
    return arendalEventDataTIX(response.data);
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
async function arendalEventDataTIX(events) {

  for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/arendalkulturhus/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
//#endregion

//#region Ibsenhuset (TIX) Ingen feil
async function ibsenhuset(){
  return await axios.get("https://eventapi.tix.no/v2/Events/9dc82c6662d44644/")
  .then(response => {
    return ibsenhusetEventDataTIX(response.data);
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
async function ibsenhusetEventDataTIX(events) {

  for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/ibsenhuset/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
//#endregion

//#region Kongsberg Kulturhus (TIX) Ingen feil
async function kongsberg(){
  return await axios.get("https://eventapi.tix.no/v2/Events/0f904f1629c04bb0/")
  .then(response => {
    return kongsbergEventDataTIX(response.data);
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
async function kongsbergEventDataTIX(events) {

  for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/kongsberg/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
//#endregion

//#region Nøtterøy (TIX) Ingen feil
async function notteroyKulturhus(){
  return await axios.get("https://eventapi.tix.no/v2/Events/q58NgeZx9cx29Abw/")
  .then(response => {
    return notteroyEventDataTIX(response.data);
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
async function notteroyEventDataTIX(events) {

  for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/nøtteroy/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
//#endregion

//#region Drammen Scener - Drammens teater (TIX) Ingen feil
async function drammenTeater(){
  return await axios.get("https://eventapi.tix.no/v2/Events/7ed571aa6e8d4cf7/")
  .then(response => {
    return drammenTeaterEventDataTIX(response.data);
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
async function drammenTeaterEventDataTIX(events) {

  for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/drammenteater/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
//#endregion

//#region Drammen Scener - Union Scene (TIX) Ingen feil
async function drammenUnion(){
  return await axios.get("https://eventapi.tix.no/v2/Events/81435037e05845d6/")
  .then(response => {
    return drammenUnionEventDataTIX(response.data);
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
async function drammenUnionEventDataTIX(events) {

  for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/drammenunion/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
//#endregion

//#region Ælvespeilet (TIX) Ingen feil
async function aelvespeilet(){
  return await axios.get("https://eventapi.tix.no/v2/Events/4e46b9b97b3a4647/")
  .then(response => {
    return aelvespeiletEventDataTIX(response.data);
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
async function aelvespeiletEventDataTIX(events) {

  for (let i = 0; i < events.length; i++) {
    const eventGroupId = events[i]["EventGroupId"].toString();
    const eventRef = admin
      .firestore()
      .collection("konserthus/ælvespeilet/events")
      .doc(eventGroupId);

    const res = await eventRef.set(events[i]);

    console.log(res);
  }
}
//#endregion