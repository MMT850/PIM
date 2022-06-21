// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
const axios = require("axios");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();


//Bearer token for DX API
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImM2ZTQxOGQ3MGVlNjNkMDA3ZmI2NmFhMzYyM2U3M2Q2NzZlYmQ2Njk2NzQzOGNiOGVjODdjMTcwNWJmYmMxZGQzNmU3ZWE1ZDQ0NDQ4YTlhIn0.eyJhdWQiOiIxIiwianRpIjoiYzZlNDE4ZDcwZWU2M2QwMDdmYjY2YWEzNjIzZTczZDY3NmViZDY2OTY3NDM4Y2I4ZWM4N2MxNzA1YmZiYzFkZDM2ZTdlYTVkNDQ0NDhhOWEiLCJpYXQiOjE2MjMyNDEwMzEsIm5iZiI6MTYyMzI0MTAzMSwiZXhwIjo0Nzc4OTE0NjMxLCJzdWIiOiIyOCIsInNjb3BlcyI6W119.BiIQJgoJ6lyVxiQ2FppMmiZFGSPO5LA-Fc-o91aIabgveoW-G6XprAm_uUClwuOvUHPedqlThsZFokB9VWx9zLLaJ31RX_-e7o-tbJVJLMcdo-IeGr2Y3-o0zo2Jq3_uipdUnjXu9X4rK76RAs8h9mPGXsPc2cN6n55trAVREJQXgpym5IyO-Hu9iiXyZahwAiB13a839LgNzK1OO1kcMuMTFLNpj5grlMQ3b7QXrg5ark4Sd6rBfEnQlk-g3lKKcEb2W3Bk30_HmmBlMG5u8FcGihrFoirdY_6_WFJ_SVZeOmymAjhRUQXBzYDa21NZZiQo0fT9Vs-mJzJASZTo2iI_0jnrULwDCztyHL1NM0i7Akq4beSthidaa2X2O4vBvesvklUPoKU6kcdjlV03d7_HKiMC5klh9OhqIPA8roMIHLmiASIaxWNu_i6scIf5PImlovoyuwD03QC_6aGF8FBq2zEQ17TIw0xeK3tKdBE2sbwfFQyV1EOlmfYW9e_JmyxsWbbpPbVXhgjKqEXamTBGpiprjbETF3C6Io1tyj54pDuOnKkdaTpOGJvwCTvj6fXlPooRURwMHa-l9892M_7S3z8pyERpwrsavVmTop06tfks-6XKtOR9T0w1GLsKVb2Gq_aQKgwRlZlJ912OdBAxrvkbbLqPeVQSneVOxf0";
const config = {
  headers: { Authorization: `Bearer ${token}`}
}


// Main functions that call functions to populate firestore from all API data.

//#region Cloud Scheduled Functions
exports.getTixAPI = functions.region('europe-west3').pubsub.schedule('every 30 minutes').onRun(async () => {
  const infoApiTix = await getAPIFields();
  return await getEventsTix(infoApiTix[0]);
});

exports.getTicketmasterAPI = functions.region('europe-west3').pubsub.schedule('every 30 minutes').onRun(async () => {
  const infoApiTicketmaster = await getAPIFields();
  return await getEventsTicketmaster(infoApiTicketmaster[1]);
});

exports.getDxAPI = functions.region('europe-west3').pubsub.schedule('every 30 minutes').onRun(async () => {
  const infoApiDx = await getAPIFields();
  return await getEventsDX(infoApiDx[2]);
});

exports.getTicketCoAPI = functions.region('europe-west3').pubsub.schedule('every 30 minutes').onRun(async () => {
  const infoApiTicketCO = await getAPIFields();
  return await getEventsTicketCo(infoApiTicketCO[3]);
});

//#endregion

//#region https Functions 
exports.manualGetTixAPI = functions.region('europe-west3').https.onCall(async () => {
  const infoApiTix = await getAPIFields();
  return await getEventsTix(infoApiTix[0]);

});

exports.manualGetTicketmasterAPI = functions.region('europe-west3').https.onCall(async () => {
  const infoApiTicketmaster = await getAPIFields();
  return await getEventsTicketmaster(infoApiTicketmaster[1]);

});

exports.manualGetDxAPI = functions.region('europe-west3').https.onCall(async () => {
  const infoApiDx = await getAPIFields();
  return await getEventsDX(infoApiDx[2]);

});

exports.manualGetTicketCoAPI = functions.region('europe-west3').https.onCall(async () => {
  const infoApiTicketCO = await getAPIFields();
  return await getEventsTicketCo(infoApiTicketCO[3]);

});
//#endregion 

//#region test

// exports.fillFirestoreTestData = functions.region('europe-west3').https.onRequest(async () => {
//   testTix = [
//     {
//       name: 'ArendalKulturhus',
//       apiKey: 'a9a8392408f64a9e',
//       api: 'TIX'
//     },
//     {
//       name: "MossKulturhus",
//       apiKey: "2e3aa1d4758049c9",
//       api: 'TIX'
//     },
//   ]
//   testTicketmaster = [
//     {
//       name: 'OperaØstfold',
//       apiKey: '2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL',
//       venueId: '2263,16749,9989,18217',
//       api: 'Ticketmaster'
//     },
//   ]
//   testDx = [
//     {
//       name: 'LillestrømKultursenter',
//       partnerId: '120',
//       api: 'DX'
//     },
//   ]
//   testTicketCo = [
//     {
//       name: 'Sarpsborg',
//       token: 'knSXQtgBsE-yXeGcKUVf',
//       api: 'TicketCo'
//     },
//   ]
//   for (let i = 0; i < testTix.length; i++) {

//     const eventGroupId = testTix[i]["name"].toString();
//     const eventRef = admin
//       .firestore()
//       .collection(`konserthus`)
//       .doc(eventGroupId);

//     const res = await eventRef.set(testTix[i]);
//     console.log(res);
//   };
//   for (let i = 0; i < testTicketmaster.length; i++) {

//     const eventGroupId = testTicketmaster[i]["name"].toString();
//     const eventRef = admin
//       .firestore()
//       .collection(`konserthus`)
//       .doc(eventGroupId);

//     const res = await eventRef.set(testTicketmaster[i]);
//     console.log(res);
//   };
//   for (let i = 0; i < testDx.length; i++) {

//     const eventGroupId = testDx[i]["name"].toString();
//     const eventRef = admin
//       .firestore()
//       .collection(`konserthus`)
//       .doc(eventGroupId);

//     const res = await eventRef.set(testDx[i]);
//     console.log(res);
//   };
//   for (let i = 0; i < testTicketCo.length; i++) {

//     const eventGroupId = testTicketCo[i]["name"].toString();
//     const eventRef = admin
//       .firestore()
//       .collection(`konserthus`)
//       .doc(eventGroupId);

//     const res = await eventRef.set(testTicketCo[i]);
//     console.log(res);
//   };
//   return "done";
// });

// exports.getAPIFields = functions.region('europe-west3').https.onRequest(async () => {
//   return await getAPIFields();
// });

let tix = [];
let ticketmaster = [];
let dx = [];
let ticketco = [];
async function getAPIFields(){ //AVSLUTTET HER, Må bare få inn dataen fra TicketCo her nå, så kna man teste om det fungere gjennom cloud functions.
  let _tix = [];                
  let _ticketmaster = [];
  let _dx = [];
  let _ticketco = [];
  let name; 
  let apiKey;
  let venueId;
  let partnerId;
  let token;

  const concertHalls = admin.firestore().collection('konserthus');
  const snapshot = await concertHalls.get();
  snapshot.forEach(doc => {
    switch(doc.data().api.toLowerCase()){
      case "tix":
        name = doc.data().name;
        apiKey = doc.data().apiKey;
        _tix.push({name, apiKey});
        break;
      case "ticketmaster":
        name = doc.data().name;
        apiKey = doc.data().apiKey;
        venueId = doc.data().venueId;
        _ticketmaster.push({name, apiKey, venueId});
        break;
      case "dx":
        name = doc.data().name;
        partnerId = doc.data().partnerId;
        _dx.push({name, partnerId});
        break;
      case "ticketco":
        name = doc.data().name;
        token = doc.data().token;
        _ticketco.push({name, token});
        break;
    }
  });
  tix = _tix;
  ticketmaster = _ticketmaster;
  dx = _dx;
  ticketco = _ticketco;
  return [tix, ticketmaster, dx, ticketco];
};
//#endregion

//#region DX API
let newDate = new Date()
let formatedDate = newDate.toISOString().split('T')[0];
const dxAPI = [
  // {
  //   "all": `https://public.dx.no/v1/partners/178/events/?size=50&order_by=nowfuturepast`,
  //   "single": `https://public.dx.no/v1/partners/178/events/`,
  //   "name": "Fredrikstadguttane"
  // },
  // {
  //   "all": `https://public.dx.no/v1/partners/318/events/?size=50&order_by=nowfuturepast`,
  //   "single": `https://public.dx.no/v1/partners/318/events/`,
  //   "name": "NIA"
  // },
  // {
  //   "all": `https://public.dx.no/v1/partners/168/events/?size=50&order_by=nowfuturepast`,
  //   "single": `https://public.dx.no/v1/partners/168/events/`,
  //   "name": "BølgenKino"
  // },
  // {
  //   "all": `https://public.dx.no/v1/partners/120/events/?size=50&order_by=nowfuturepast`,
  //   "single": `https://public.dx.no/v1/partners/120/events/`,
  //   "name": "LillestrømKulturhus"
  // },
  // {
  //   "all": `https://public.dx.no/v1/partners/106/events/?size=50&order_by=nowfuturepast`,
  //   "single": `https://public.dx.no/v1/partners/106/events/`,
  //   "name": "LørenskogHus"
  // },
  // {
  //   "all": `https://public.dx.no/v1/partners/301/events/?size=50&order_by=nowfuturepast`,
  //   "single": `https://public.dx.no/v1/partners/301/events/`,
  //   "name": "Storstova"
  // },
];

async function getEventsDX(dx){
  console.log(dx);
  for (let i = 0; i < dx.length; i++) {
    await axios.get('https://public.dx.no/v1/partners/'+ dx[i].partnerId +'/events/?size=50&order_by=nowfuturepast' +'&after_date='+ formatedDate, config)
    .then(response => {
      
      const events = response.data["data"];
      events.map(async element => {
        
        const eventID = element.event_id
        await axios.get('https://public.dx.no/v1/partners/'+ dx[i].partnerId +'/events/' + eventID, config)
        .then(async response => {
          
          const eventGroupId = response.data["data"];

          let prices;
          try {
            prices  = eventGroupId.ticket_sales[0].price_categories.map(element => element.price);
          }
          catch{
            prices = "No prices";
          }

          let description;
          try {
            description = eventGroupId.production.contents[0].body;
          }
          catch(err){
            description = 'No description';
          }

          let image;
          try {
            let imageType = eventGroupId.production.assets.find(image => image.type === "image" || image.type === "poster")
            image = imageType.url;
          }
          catch(err){
            image = 'No image';
          }

          let tags;
          try {
            tags = eventGroupId.production.tags.toString();
          }
          catch(err){
            tags = 'No tags';
          }
          const id = eventGroupId.event_id;
          const name = eventGroupId.title;
          const priceMin = Math.min(...prices);
          const priceMax = Math.max(...prices);
          const purchaseUrlNb = eventGroupId.purchase_url;
          const purchaseUrlEn = eventGroupId.purchase_url;
          const purchaseUrlSv = eventGroupId.purchase_url;
          const categories = "";
          const capacity = eventGroupId.ticket_sales[0].capacity;
          const remaining = eventGroupId.ticket_sales[0].available;
          const startDate = eventGroupId.begin;
          const endDate = eventGroupId.end;
          //const sold = eventGroupId.ticket_sales[0].sold;
          //const locationName = eventGroupId.location_name;

          const reworkedEvent = 
          {
              "ExternalReferenceNumber": "",
              "EventGroupId": id,
              "Name": name,
              "SubTitle": "",
              "Description": description,
              "ImageCacheKey": "",
              "EventImagePath": image,
              "FeaturedImagePath": image,
              "PosterImagePath": image,
              "ExternalUrl": "",
              "IsFilm": "",
              "PurchaseUrls": [
                {
                    "LanguageName": "Norsk",
                    "Culture": "nb-NO",
                    "TwoLetterCulture": "nb",
                    "Link": purchaseUrlNb
                },
                {
                    "LanguageName": "Svensk",
                    "Culture": "sv-SE",
                    "TwoLetterCulture": "sv",
                    "Link": purchaseUrlSv
                },
                {
                    "LanguageName": "English",
                    "Culture": "en-GB",
                    "TwoLetterCulture": "en",
                    "Link": purchaseUrlEn
                }
              ],
              "Translations": [],
              "Dates": [
                  {
                      "EventId": id,
                      "DefaultEventGroupId": "",
                      "Name": name,
                      "StartDate": startDate,
                      "StartDateUTCUnix": "",
                      "EndDate": endDate,
                      "EndDateUTCUnix": "",
                      "WaitingList": "",
                      "OnlineSaleStart": "",
                      "OnlineSaleStartUTCUnix": "",
                      "OnlineSaleEnd": "",
                      "OnlineSaleEndUTCUnix": "",
                      "Venue": "",
                      "Hall": "",
                      "Promoter": "",
                      "SoldOut": "",
                      "Duration": "",
                      "SaleStatus": "",
                      "SaleStatusText": "",
                      "Capacity": capacity,
                      "Remaining": remaining,
                      "Categories": categories,
                      "CategoryTranslations": {},
                      "Tags": tags,
                      "Translations": [],
                      "PurchaseUrls": [
                        {
                            "LanguageName": "Norsk",
                            "Culture": "nb-NO",
                            "TwoLetterCulture": "nb",
                            "Link": purchaseUrlNb
                        },
                        {
                            "LanguageName": "Svensk",
                            "Culture": "sv-SE",
                            "TwoLetterCulture": "sv",
                            "Link": purchaseUrlSv
                        },
                        {
                            "LanguageName": "English",
                            "Culture": "en-GB",
                            "TwoLetterCulture": "en",
                            "Link": purchaseUrlEn
                        }
                      ],
                      "ProductPurchaseUrls": [],
                      "Products": [],
                      "MinPrice": priceMin,
                      "MaxPrice": priceMax,
                      "Prices": [],
                      "Benefits": []
                  }
              ]
          };
          //Add reworkedEvent to firestore
          const eventRef = admin.firestore().collection(`konserthus/${dx[i]["name"]}/events`).doc(eventGroupId.event_id.toString());
          const res = await eventRef.set(reworkedEvent);
          console.log(res);
          })
        .catch(error => {
          console.log(error);
        });
      });
    })
    .catch(error => {
      console.log(error);
    });
  }
};
//#endregion

//#region TicketCo API, Ikke alle som har status key, så må kansje finne en annen løsning for å hente nåverende eventer.
const TicketCoAPI = [
  // {
  //   "token": `_yeEt434ywPyD3TdkFaY`,
  //   "name": "MyMotown"
  // },
  // {
  //   "token": `knSXQtgBsE-yXeGcKUVf`,
  //   "name": "Sarpsborg"
  // },
];
async function getEventsTicketCo(ticketco){
  for (let i = 0; i < ticketco.length; i++) {
    await axios.get(`https://ticketco.events/api/public/v1/events?token=` + ticketco[i]["token"] + `&status=active`)
    .then(response => {
      
      const events = response.data["events"];
      events.map(async element => {
        
        const eventID = element.id
        await axios.get(`https://ticketco.events/api/public/v1/events/` + eventID + '?token=' + ticketco[i]["token"])
        .then(async response => {
          
          const eventGroupId = response.data;

          const id = eventGroupId.id;
          const name = eventGroupId.title;
          const description = eventGroupId.description;
          const startDate = eventGroupId.start_at;
          const endDate = eventGroupId.end_at;
          const image = eventGroupId.image.url;
          const priceMin = eventGroupId.event_minimum_price;
          const priceMax = eventGroupId.event_maximum_price;
          const purchaseUrlNb = eventGroupId.locale_urls.nb;
          const purchaseUrlEn = eventGroupId.locale_urls.en;
          const purchaseUrlSv = eventGroupId.locale_urls.sv;
          const categories = eventGroupId.event_categories;
          const tags = eventGroupId.tags.toString();
          const capacity = eventGroupId.total_capacities;
          const remaining = eventGroupId.total_available;
          //const sold = eventGroupId.total_sold;
          const locationName = eventGroupId.location_name;
      

          const reworkedEvent = 
          {
              "ExternalReferenceNumber": "",
              "EventGroupId": id,
              "Name": name,
              "SubTitle": "",
              "Description": description,
              "ImageCacheKey": "",
              "EventImagePath": image,
              "FeaturedImagePath": image,
              "PosterImagePath": image,
              "ExternalUrl": "",
              "IsFilm": "",
              "PurchaseUrls": [
                {
                    "LanguageName": "Norsk",
                    "Culture": "nb-NO",
                    "TwoLetterCulture": "nb",
                    "Link": purchaseUrlNb
                },
                {
                    "LanguageName": "Svensk",
                    "Culture": "sv-SE",
                    "TwoLetterCulture": "sv",
                    "Link": purchaseUrlSv
                },
                {
                    "LanguageName": "English",
                    "Culture": "en-GB",
                    "TwoLetterCulture": "en",
                    "Link": purchaseUrlEn
                }
              ],
              "Translations": [],
              "Dates": [
                  {
                      "EventId": id,
                      "DefaultEventGroupId": "",
                      "Name": name,
                      "StartDate": startDate,
                      "StartDateUTCUnix": "",
                      "EndDate": endDate,
                      "EndDateUTCUnix": "",
                      "WaitingList": "",
                      "OnlineSaleStart": "",
                      "OnlineSaleStartUTCUnix": "",
                      "OnlineSaleEnd": "",
                      "OnlineSaleEndUTCUnix": "",
                      "Venue": "",
                      "Hall": "",
                      "Promoter": "",
                      "SoldOut": "",
                      "Duration": "",
                      "SaleStatus": "",
                      "SaleStatusText": "",
                      "Capacity": capacity,
                      "Remaining": remaining,
                      "Categories": categories,
                      "CategoryTranslations": {},
                      "Tags": tags,
                      "Translations": [],
                      "PurchaseUrls": [
                        {
                            "LanguageName": "Norsk",
                            "Culture": "nb-NO",
                            "TwoLetterCulture": "nb",
                            "Link": purchaseUrlNb
                        },
                        {
                            "LanguageName": "Svensk",
                            "Culture": "sv-SE",
                            "TwoLetterCulture": "sv",
                            "Link": purchaseUrlSv
                        },
                        {
                            "LanguageName": "English",
                            "Culture": "en-GB",
                            "TwoLetterCulture": "en",
                            "Link": purchaseUrlEn
                        }
                      ],
                      "ProductPurchaseUrls": [],
                      "Products": [],
                      "MinPrice": priceMin,
                      "MaxPrice": priceMax,
                      "Prices": [],
                      "Benefits": []
                  }
              ]
          };
          //Add reworkedEvent to firestore
          const eventRef = admin.firestore().collection(`konserthus/${ticketco[i]["name"]}/events`).doc(eventGroupId.id.toString());
          const res = await eventRef.set(reworkedEvent);
          console.log(res);
          })
        .catch(error => {
          console.log(error);
        });
      });
    })
    .catch(error => {
      console.log(error);
    });
  }
};
//#endregion

//#region Ticketmaster API
const TicketmasterAPI = [
  // {
  //   "apiKey": "2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL",
  //   "parameters": `&domain=norway&venue_ids=2263,16749,9989,18217&rows=250`,
  //   "name": "OperaØstfold"
  // },
  // {
  //   "apiKey": "2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL",
  //   "parameters": `&domain=norway&venue_ids=7555,7557,7559,7561,7581,20269&rows=250`,
  //   "name": "Ullensaker"
  // },
  // {
  //   "apiKey": "2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL",
  //   "parameters": `&domain=norway&venue_ids=14597&rows=250`,
  //   "name": "BrottetAmfi"
  // },
  // {
  //   "apiKey": "2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL",
  //   "parameters": `&domain=norway&venue_ids=6253,6255,13077&rows=250`,
  //   "name": "Stavangeren"
  // },
  // {
  //   "apiKey": "2ymb1MA5BlA2HiZUJWMmAwLW26A5wCEL",
  //   "parameters": `&domain=norway&venue_ids=9589&rows=250`,
  //   "name": "Oseana"
  // },

];
async function getEventsTicketmaster(ticketmaster){
  console.log(ticketmaster);
  for (let i = 0; i < ticketmaster.length; i++) {
    await axios.get(`https://app.ticketmaster.eu/mfxapi/v2/events?apikey=` + ticketmaster[i]["apiKey"] + "&domain=norway&venue_ids=" + ticketmaster[i]["venueId"] + "&rows=250")
    .then(response => {
      const events = response.data["events"];

      events.map(async element => {
        const eventID = element.id

        await axios.get(`https://app.ticketmaster.eu/mfxapi/v2/events/` + eventID + '?apikey=' +  ticketmaster[i]["apiKey"] + `&domain=norway`)
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
          try{
            attractionsId = eventGroupId.attractions[0].id;
          }
          catch(err){
            attractionsId = 'Not available';
          };

          let attractionsName;
          try{
            attractionsName = eventGroupId.attractions[0].name;
          }
          catch(err){
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
          const eventRef = admin.firestore().collection(`konserthus/${ticketmaster[i]["name"]}/events`).doc(reworkedEvent.EventGroupId);
          const res = await eventRef.set(reworkedEvent);
          console.log(res);
          })
        .catch(error => {
          console.log(error);
        });
      });
    })
    .catch(error => {
      console.log(error);
    });
  }
};
//#endregion

//#region TIX API
const tixAPI = [
  // {
  //   "apiKey": "2d31a411de6342a1",
  //   "name": "StavangerKonserthus"
  // },
  // {
  //   "apiKey": "2e3aa1d4758049c9",
  //   "name": "MossKulturhus"
  // },
  // {
  //   "apiKey": "625a4ae28f9340ef",
  //   "name": "SolaKulturhus"
  // },
  // {
  //   "apiKey": "8efc856f1b704a94",
  //   "name": "BølgenKulturhus"
  // },
  // {
  //   "apiKey": "97bd45c4aa32fe43",
  //   "name": "SandnesKulturhus"
  // },
  // {
  //   "apiKey": "3a056daed43e480b",
  //   "name": "AskimKulturhus"
  // },
  // {
  //   "apiKey": "a9a8392408f64a9e",
  //   "name": "ArendalKulturhus"
  // },
  // {
  //   "apiKey": "9dc82c6662d44644",
  //   "name": "Ibsenhuset"
  // },
  // {
  //   "apiKey": "0f904f1629c04bb0",
  //   "name": "Kongsberg"
  // },
  // {
  //   "apiKey": "q58NgeZx9cx29Abw",
  //   "name": "Nøtterøy"
  // },
  // {
  //   "apiKey": "7ed571aa6e8d4cf7",
  //   "name": "DrammenTeater"
  // },
  // {
  //   "apiKey": "81435037e05845d6",
  //   "name": "DrammenUnionScene"
  // },
  // {
  //   "apiKey": "4e46b9b97b3a4647",
  //   "name": "Ælvespeilet"
  // },
];

/**
 * Imports the Tix API data into firestore
 * @param {Object} events
 * @return {Promise<void>}
 */

async function getEventsTix(tix){
  for (let i = 0; i < tix.length; i++) {
    await axios.get("https://eventapi.tix.no/v2/Events/" + tix[i]["apiKey"])
    .then(async response => {
      const events = response.data;
      
      for (let j = 0; j < events.length; j++) {
        
        const eventGroupId = events[j]["EventGroupId"].toString();
        const eventRef = admin
          .firestore()
          .collection(`konserthus/${tix[i]["name"]}/events`)
          .doc(eventGroupId);
    
        const res = await eventRef.set(events[j]);
        console.log(res);
      }
    })
    .catch(error => {
      console.log(error);
    });
  };
};
//#endregion


//--------------------- Hente inn fra induviduell konserthus for testing ---------------------

//#region Fredrikstadguttane (DX)


async function fredrikstadguttane(){
  console.log(formatedDate);
  return await axios.get(`https://public.dx.no/v1/partners/178/events/?size=50&after_date=${formatedDate}&order_by=nowfuturepast`, config)
  .then(response => {
    const fredrikstadguttaneEvents = response.data["data"];
    fredrikstadguttaneEvents.map(async element => {
      const eventID = element.event_id
      //console.log(eventID);
      return fredrikstadguttaneEventData(eventID);
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
async function fredrikstadguttaneEventData(eventID) {
  return await axios.get(`https://public.dx.no/v1/partners/178/events/${eventID}`, config)
  .then(async response => {
    const eventGroupId = response.data["data"];

    let prices = eventGroupId.ticket_sales[0].price_categories.map(element => element.price);

    const id = eventGroupId.event_id;
    const name = eventGroupId.title;

    let description;
    try {
      description = eventGroupId.production.contents[0].body;
    }
    catch(err){
      description = 'No description';
    }
    const startDate = eventGroupId.begin;
    const endDate = eventGroupId.end;

    let image;
    try {
      let imageType = eventGroupId.production.assets.find(image => image.type === "image" || image.type === "poster")
      image = imageType.url;
    }
    catch(err){
      image = 'No image';
    }

    const priceMin = Math.min(...prices);
    const priceMax = Math.max(...prices);
    const purchaseUrlNb = eventGroupId.purchase_url;
    const purchaseUrlEn = eventGroupId.purchase_url;
    const purchaseUrlSv = eventGroupId.purchase_url;
    const categories = "";
    let tags;
    try {
      tags = eventGroupId.production.tags.toString();
    }
    catch(err){
      tags = 'No tags';
    }
    const capacity = eventGroupId.ticket_sales[0].capacity;
    const remaining = eventGroupId.ticket_sales[0].available;
    //const sold = eventGroupId.ticket_sales[0].sold;
    //const locationName = eventGroupId.location_name;

    const reworkedEvent = 
    {
        "ExternalReferenceNumber": "",
        "EventGroupId": id,
        "Name": name,
        "SubTitle": "",
        "Description": description,
        "ImageCacheKey": "",
        "EventImagePath": image,
        "FeaturedImagePath": image,
        "PosterImagePath": image,
        "ExternalUrl": "",
        "IsFilm": "",
        "PurchaseUrls": [
          {
              "LanguageName": "Norsk",
              "Culture": "nb-NO",
              "TwoLetterCulture": "nb",
              "Link": purchaseUrlNb
          },
          {
              "LanguageName": "Svensk",
              "Culture": "sv-SE",
              "TwoLetterCulture": "sv",
              "Link": purchaseUrlSv
          },
          {
              "LanguageName": "English",
              "Culture": "en-GB",
              "TwoLetterCulture": "en",
              "Link": purchaseUrlEn
          }
        ],
        "Translations": [],
        "Dates": [
            {
                "EventId": id,
                "DefaultEventGroupId": "",
                "Name": name,
                "StartDate": startDate,
                "StartDateUTCUnix": "",
                "EndDate": endDate,
                "EndDateUTCUnix": "",
                "WaitingList": "",
                "OnlineSaleStart": "",
                "OnlineSaleStartUTCUnix": "",
                "OnlineSaleEnd": "",
                "OnlineSaleEndUTCUnix": "",
                "Venue": "",
                "Hall": "",
                "Promoter": "",
                "SoldOut": "",
                "Duration": "",
                "SaleStatus": "",
                "SaleStatusText": "",
                "Capacity": capacity,
                "Remaining": remaining,
                "Categories": categories,
                "CategoryTranslations": {},
                "Tags": tags,
                "Translations": [],
                "PurchaseUrls": [
                  {
                      "LanguageName": "Norsk",
                      "Culture": "nb-NO",
                      "TwoLetterCulture": "nb",
                      "Link": purchaseUrlNb
                  },
                  {
                      "LanguageName": "Svensk",
                      "Culture": "sv-SE",
                      "TwoLetterCulture": "sv",
                      "Link": purchaseUrlSv
                  },
                  {
                      "LanguageName": "English",
                      "Culture": "en-GB",
                      "TwoLetterCulture": "en",
                      "Link": purchaseUrlEn
                  }
                ],
                "ProductPurchaseUrls": [],
                "Products": [],
                "MinPrice": priceMin,
                "MaxPrice": priceMax,
                "Prices": [],
                "Benefits": []
            }
        ]
    };
    //Add reworkedEvent to firestore
    const eventRef = admin.firestore().collection(`konserthus/fredrikstadguttane/events`).doc(eventGroupId.event_id.toString());
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });
}
//#endregion

//#region NIA (DX)

async function nia(){
  console.log(formatedDate);
  return await axios.get(`https://public.dx.no/v1/partners/318/events/?size=50&after_date=${formatedDate}&order_by=nowfuturepast`, config)
  .then(response => {
    const niaEvents = response.data["data"];
    niaEvents.map(async element => {
      const eventID = element.event_id
      //console.log(eventID);
      return niaEventData(eventID);
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
async function niaEventData(eventID) {
  return await axios.get(`https://public.dx.no/v1/partners/318/events/${eventID}`, config)
  .then(async response => {
    const eventGroupId = response.data["data"];

    let prices = eventGroupId.ticket_sales[0].price_categories.map(element => element.price);

    const id = eventGroupId.event_id;
    const name = eventGroupId.title;

    let description;
    try {
      description = eventGroupId.production.contents[0].body;
    }
    catch(err){
      description = 'No description';
    }
    const startDate = eventGroupId.begin;
    const endDate = eventGroupId.end;

    let image;
    try {
      let imageType = eventGroupId.production.assets.find(image => image.type === "image" || image.type === "poster")
      image = imageType.url;
    }
    catch(err){
      image = 'No image';
    }

    const priceMin = Math.min(...prices);
    const priceMax = Math.max(...prices);
    const purchaseUrlNb = eventGroupId.purchase_url;
    const purchaseUrlEn = eventGroupId.purchase_url;
    const purchaseUrlSv = eventGroupId.purchase_url;
    const categories = "";
    let tags;
    try {
      tags = eventGroupId.production.tags.toString();
    }
    catch(err){
      tags = 'No tags';
    }
    const capacity = eventGroupId.ticket_sales[0].capacity;
    const remaining = eventGroupId.ticket_sales[0].available;
    //const sold = eventGroupId.ticket_sales[0].sold;
    //const locationName = eventGroupId.location_name;

    const reworkedEvent = 
    {
        "ExternalReferenceNumber": "",
        "EventGroupId": id,
        "Name": name,
        "SubTitle": "",
        "Description": description,
        "ImageCacheKey": "",
        "EventImagePath": image,
        "FeaturedImagePath": image,
        "PosterImagePath": image,
        "ExternalUrl": "",
        "IsFilm": "",
        "PurchaseUrls": [
          {
              "LanguageName": "Norsk",
              "Culture": "nb-NO",
              "TwoLetterCulture": "nb",
              "Link": purchaseUrlNb
          },
          {
              "LanguageName": "Svensk",
              "Culture": "sv-SE",
              "TwoLetterCulture": "sv",
              "Link": purchaseUrlSv
          },
          {
              "LanguageName": "English",
              "Culture": "en-GB",
              "TwoLetterCulture": "en",
              "Link": purchaseUrlEn
          }
        ],
        "Translations": [],
        "Dates": [
            {
                "EventId": id,
                "DefaultEventGroupId": "",
                "Name": name,
                "StartDate": startDate,
                "StartDateUTCUnix": "",
                "EndDate": endDate,
                "EndDateUTCUnix": "",
                "WaitingList": "",
                "OnlineSaleStart": "",
                "OnlineSaleStartUTCUnix": "",
                "OnlineSaleEnd": "",
                "OnlineSaleEndUTCUnix": "",
                "Venue": "",
                "Hall": "",
                "Promoter": "",
                "SoldOut": "",
                "Duration": "",
                "SaleStatus": "",
                "SaleStatusText": "",
                "Capacity": capacity,
                "Remaining": remaining,
                "Categories": categories,
                "CategoryTranslations": {},
                "Tags": tags,
                "Translations": [],
                "PurchaseUrls": [
                  {
                      "LanguageName": "Norsk",
                      "Culture": "nb-NO",
                      "TwoLetterCulture": "nb",
                      "Link": purchaseUrlNb
                  },
                  {
                      "LanguageName": "Svensk",
                      "Culture": "sv-SE",
                      "TwoLetterCulture": "sv",
                      "Link": purchaseUrlSv
                  },
                  {
                      "LanguageName": "English",
                      "Culture": "en-GB",
                      "TwoLetterCulture": "en",
                      "Link": purchaseUrlEn
                  }
                ],
                "ProductPurchaseUrls": [],
                "Products": [],
                "MinPrice": priceMin,
                "MaxPrice": priceMax,
                "Prices": [],
                "Benefits": []
            }
        ]
    };
    //Add reworkedEvent to firestore
    const eventRef = admin.firestore().collection(`konserthus/NIA/events`).doc(eventGroupId.event_id.toString());
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });
}
//#endregion

//#region Bølgen Kino (DX) 

async function bolgenKino(){
  console.log(formatedDate);
  return await axios.get(`https://public.dx.no/v1/partners/168/events/?size=50&after_date=${formatedDate}&order_by=nowfuturepast`, config)
  .then(response => {
    const bolgenEvents = response.data["data"];
    bolgenEvents.map(async element => {
      const eventID = element.event_id
      //console.log(eventID);
      return bolgenKinoEventData(eventID);
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
async function bolgenKinoEventData(eventID) {
  return await axios.get(`https://public.dx.no/v1/partners/168/events/${eventID}`, config)
  .then(async response => {
    const eventGroupId = response.data["data"];
    
    let prices = eventGroupId.ticket_sales[0].price_categories.map(element => element.price);

    const id = eventGroupId.event_id;
    const name = eventGroupId.title;
    
    let description;
    try {
      description = eventGroupId.production.contents[0].body;
    }
    catch(err){
      description = 'No description';
    }
    const startDate = eventGroupId.begin;
    const endDate = eventGroupId.end;

    let image;
    try {
      let imageType = eventGroupId.production.assets.find(image => image.type === "image" || image.type === "poster")
      image = imageType.url;
    }
    catch(err){
      image = 'No image';
    }

    const priceMin = Math.min(...prices);
    const priceMax = Math.max(...prices);
    const purchaseUrlNb = eventGroupId.purchase_url;
    const purchaseUrlEn = eventGroupId.purchase_url;
    const purchaseUrlSv = eventGroupId.purchase_url;
    const categories = "";
    let tags;
    try {
      tags = eventGroupId.production.tags.toString();
    }
    catch(err){
      tags = 'No tags';
    }
    const capacity = eventGroupId.ticket_sales[0].capacity;
    const remaining = eventGroupId.ticket_sales[0].available;
    //const sold = eventGroupId.ticket_sales[0].sold;
    //const locationName = eventGroupId.location_name;

    const reworkedEvent = 
    {
        "ExternalReferenceNumber": "",
        "EventGroupId": id,
        "Name": name,
        "SubTitle": "",
        "Description": description,
        "ImageCacheKey": "",
        "EventImagePath": image,
        "FeaturedImagePath": image,
        "PosterImagePath": image,
        "ExternalUrl": "",
        "IsFilm": "",
        "PurchaseUrls": [
          {
              "LanguageName": "Norsk",
              "Culture": "nb-NO",
              "TwoLetterCulture": "nb",
              "Link": purchaseUrlNb
          },
          {
              "LanguageName": "Svensk",
              "Culture": "sv-SE",
              "TwoLetterCulture": "sv",
              "Link": purchaseUrlSv
          },
          {
              "LanguageName": "English",
              "Culture": "en-GB",
              "TwoLetterCulture": "en",
              "Link": purchaseUrlEn
          }
        ],
        "Translations": [],
        "Dates": [
            {
                "EventId": id,
                "DefaultEventGroupId": "",
                "Name": name,
                "StartDate": startDate,
                "StartDateUTCUnix": "",
                "EndDate": endDate,
                "EndDateUTCUnix": "",
                "WaitingList": "",
                "OnlineSaleStart": "",
                "OnlineSaleStartUTCUnix": "",
                "OnlineSaleEnd": "",
                "OnlineSaleEndUTCUnix": "",
                "Venue": "",
                "Hall": "",
                "Promoter": "",
                "SoldOut": "",
                "Duration": "",
                "SaleStatus": "",
                "SaleStatusText": "",
                "Capacity": capacity,
                "Remaining": remaining,
                "Categories": categories,
                "CategoryTranslations": {},
                "Tags": tags,
                "Translations": [],
                "PurchaseUrls": [
                  {
                      "LanguageName": "Norsk",
                      "Culture": "nb-NO",
                      "TwoLetterCulture": "nb",
                      "Link": purchaseUrlNb
                  },
                  {
                      "LanguageName": "Svensk",
                      "Culture": "sv-SE",
                      "TwoLetterCulture": "sv",
                      "Link": purchaseUrlSv
                  },
                  {
                      "LanguageName": "English",
                      "Culture": "en-GB",
                      "TwoLetterCulture": "en",
                      "Link": purchaseUrlEn
                  }
                ],
                "ProductPurchaseUrls": [],
                "Products": [],
                "MinPrice": priceMin,
                "MaxPrice": priceMax,
                "Prices": [],
                "Benefits": []
            }
        ]
    };
    //Add reworkedEvent to firestore
    const eventRef = admin.firestore().collection(`konserthus/bølgenkino/events`).doc(eventGroupId.event_id.toString());
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });
}
//#endregion

//#region Sarpsborg (TicketCo) 
async function sarpsborg(){
  return await axios.get("https://ticketco.events/api/public/v1/events?token=knSXQtgBsE-yXeGcKUVf")
  .then(response => {
    const sarpsborgEvents = response.data["events"];
    sarpsborgEvents.map(async element => {
      const eventID = element.id
      return sarpsborgEventData(eventID);
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
async function sarpsborgEventData(eventID) {
  return await axios.get(`https://ticketco.events/api/public/v1/events/${eventID}?token=knSXQtgBsE-yXeGcKUVf`)
  .then(async response => {
    const eventGroupId = response.data;

    const id = eventGroupId.id;
    const name = eventGroupId.title;
    const description = eventGroupId.description;
    const startDate = eventGroupId.start_at;
    const endDate = eventGroupId.end_at;
    const image = eventGroupId.image.url;
    const priceMin = eventGroupId.event_minimum_price;
    const priceMax = eventGroupId.event_maximum_price;
    const purchaseUrlNb = eventGroupId.locale_urls.nb;
    const purchaseUrlEn = eventGroupId.locale_urls.en;
    const purchaseUrlSv = eventGroupId.locale_urls.sv;
    const categories = eventGroupId.event_categories;
    const tags = eventGroupId.tags.toString();
    const capacity = eventGroupId.total_capacities;
    const remaining = eventGroupId.total_available;
    //const sold = eventGroupId.total_sold;
    const locationName = eventGroupId.location_name;

    console.log(tags);
    const reworkedEvent = 
    {
        "ExternalReferenceNumber": "",
        "EventGroupId": id,
        "Name": name,
        "SubTitle": "",
        "Description": description,
        "ImageCacheKey": "",
        "EventImagePath": image,
        "FeaturedImagePath": image,
        "PosterImagePath": image,
        "ExternalUrl": "",
        "IsFilm": "",
        "PurchaseUrls": [
          {
              "LanguageName": "Norsk",
              "Culture": "nb-NO",
              "TwoLetterCulture": "nb",
              "Link": purchaseUrlNb
          },
          {
              "LanguageName": "Svensk",
              "Culture": "sv-SE",
              "TwoLetterCulture": "sv",
              "Link": purchaseUrlSv
          },
          {
              "LanguageName": "English",
              "Culture": "en-GB",
              "TwoLetterCulture": "en",
              "Link": purchaseUrlEn
          }
        ],
        "Translations": [],
        "Dates": [
            {
                "EventId": id,
                "DefaultEventGroupId": "",
                "Name": name,
                "StartDate": startDate,
                "StartDateUTCUnix": "",
                "EndDate": endDate,
                "EndDateUTCUnix": "",
                "WaitingList": "",
                "OnlineSaleStart": "",
                "OnlineSaleStartUTCUnix": "",
                "OnlineSaleEnd": "",
                "OnlineSaleEndUTCUnix": "",
                "Venue": locationName,
                "Hall": "",
                "Promoter": "",
                "SoldOut": "",
                "Duration": "",
                "SaleStatus": "",
                "SaleStatusText": "",
                "Capacity": capacity,
                "Remaining": remaining,
                "Categories": categories,
                "CategoryTranslations": {},
                "Tags": "",
                "Translations": [],
                "PurchaseUrls": [
                  {
                      "LanguageName": "Norsk",
                      "Culture": "nb-NO",
                      "TwoLetterCulture": "nb",
                      "Link": purchaseUrlNb
                  },
                  {
                      "LanguageName": "Svensk",
                      "Culture": "sv-SE",
                      "TwoLetterCulture": "sv",
                      "Link": purchaseUrlSv
                  },
                  {
                      "LanguageName": "English",
                      "Culture": "en-GB",
                      "TwoLetterCulture": "en",
                      "Link": purchaseUrlEn
                  }
                ],
                "ProductPurchaseUrls": [],
                "Products": [],
                "MinPrice": priceMin,
                "MaxPrice": priceMax,
                "Prices": [],
                "Benefits": []
            }
        ]
    };
    //Add reworkedEvent to firestore
    const eventRef = admin.firestore().collection(`konserthus/sarpsborg/events`).doc(eventGroupId.id.toString());
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });
}
//#endregion

//#region My Motown (TicketCo) 
async function myMotown(){
  return await axios.get("https://ticketco.events/api/public/v1/events/?token=_yeEt434ywPyD3TdkFaY")
  .then(response => {
    const myMotownEvents = response.data["events"];
    myMotownEvents.map(async element => {
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

    const id = eventGroupId.id;
    const name = eventGroupId.title;
    const description = eventGroupId.description;
    const startDate = eventGroupId.start_at;
    const endDate = eventGroupId.end_at;
    const image = eventGroupId.image.url;
    const priceMin = eventGroupId.event_minimum_price;
    const priceMax = eventGroupId.event_maximum_price;
    const purchaseUrlNb = eventGroupId.locale_urls.nb;
    const purchaseUrlEn = eventGroupId.locale_urls.en;
    const purchaseUrlSv = eventGroupId.locale_urls.sv;
    const categories = eventGroupId.event_categories;
    const tags = eventGroupId.tags.toString();
    const capacity = eventGroupId.total_capacities;
    const remaining = eventGroupId.total_available;
    //const sold = eventGroupId.total_sold;
    const locationName = eventGroupId.location_name;

    console.log(tags);
    const reworkedEvent = 
    {
        "ExternalReferenceNumber": "",
        "EventGroupId": id,
        "Name": name,
        "SubTitle": "",
        "Description": description,
        "ImageCacheKey": "",
        "EventImagePath": image,
        "FeaturedImagePath": image,
        "PosterImagePath": image,
        "ExternalUrl": "",
        "IsFilm": "",
        "PurchaseUrls": [
          {
              "LanguageName": "Norsk",
              "Culture": "nb-NO",
              "TwoLetterCulture": "nb",
              "Link": purchaseUrlNb
          },
          {
              "LanguageName": "Svensk",
              "Culture": "sv-SE",
              "TwoLetterCulture": "sv",
              "Link": purchaseUrlSv
          },
          {
              "LanguageName": "English",
              "Culture": "en-GB",
              "TwoLetterCulture": "en",
              "Link": purchaseUrlEn
          }
        ],
        "Translations": [],
        "Dates": [
            {
                "EventId": id,
                "DefaultEventGroupId": "",
                "Name": name,
                "StartDate": startDate,
                "StartDateUTCUnix": "",
                "EndDate": endDate,
                "EndDateUTCUnix": "",
                "WaitingList": "",
                "OnlineSaleStart": "",
                "OnlineSaleStartUTCUnix": "",
                "OnlineSaleEnd": "",
                "OnlineSaleEndUTCUnix": "",
                "Venue": locationName,
                "Hall": "",
                "Promoter": "",
                "SoldOut": "",
                "Duration": "",
                "SaleStatus": "",
                "SaleStatusText": "",
                "Capacity": capacity,
                "Remaining": remaining,
                "Categories": categories,
                "CategoryTranslations": {},
                "Tags": "",
                "Translations": [],
                "PurchaseUrls": [
                  {
                      "LanguageName": "Norsk",
                      "Culture": "nb-NO",
                      "TwoLetterCulture": "nb",
                      "Link": purchaseUrlNb
                  },
                  {
                      "LanguageName": "Svensk",
                      "Culture": "sv-SE",
                      "TwoLetterCulture": "sv",
                      "Link": purchaseUrlSv
                  },
                  {
                      "LanguageName": "English",
                      "Culture": "en-GB",
                      "TwoLetterCulture": "en",
                      "Link": purchaseUrlEn
                  }
                ],
                "ProductPurchaseUrls": [],
                "Products": [],
                "MinPrice": priceMin,
                "MaxPrice": priceMax,
                "Prices": [],
                "Benefits": []
            }
        ]
    };
    //Add reworkedEvent to firestore
    const eventRef = admin.firestore().collection(`konserthus/mymotown/events`).doc(eventGroupId.id.toString());
    const res = await eventRef.set(reworkedEvent);
    console.log(res);
    })
  .catch(error => {
    console.log(error);
  });
}
//#endregion

//#region Opera Østfold (Ticketmaster) 
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

//#region Moss kulturhus (TIX) 

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

//#region Sola Kulturhus (TIX) 
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

//#region Bølgen Kulturhus (TIX) 
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

//#region Sandnes Kulturhus (TIX) 
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

//#region Askim Kulturhus (TIX) 
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

//#region Arendal Kulturhus (TIX) 
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

//#region Ibsenhuset (TIX) 
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

//#region Kongsberg Kulturhus (TIX) 
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

//#region Nøtterøy (TIX) 
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

//#region Drammen Scener - Drammens teater (TIX) 
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

//#region Drammen Scener - Union Scene (TIX) 
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

//#region Ælvespeilet (TIX) 
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