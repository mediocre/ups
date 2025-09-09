# ups

[![Test](https://github.com/mediocre/ups/actions/workflows/test.yml/badge.svg)](https://github.com/mediocre/ups/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/mediocre/ups/badge.svg)](https://coveralls.io/github/mediocre/ups)

The Power of UPS on Your Digital Platform. Our APIs power the data connections needed to deliver value to customers through e-commerce platforms, supply chain visibility solutions and direct integrations.

## Installation

```
$ npm install @mediocre/ups
```

## Usage

```javascript
const UPS = require('@mediocre/ups');

const ups = new UPS({
    client_id: 'your_client_id',
    client_secret: 'your_client_secret',
    environment_url: 'https://wwwcie.ups.com' // Use https://onlinetools.ups.com for production
});
```

## Documentation

- https://developer.ups.com/

## Methods

### getAccessToken()

The UPS OAuth Client Credentials API helps retrieve an OAuth Bearer token when the integration owner is also the UPS shipper. The integration owner uses their UPS login credentials, and the UPS account number, to receive a token that can be used in the authorization HTTP header of subsequent API calls to UPS APIs like the Ship API, Track API, etc.

See: https://developer.ups.com/tag/OAuth-Client-Credentials?loc=en_US

```javascript
const accessToken = await ups.getAccessToken();

console.log(accessToken);
// {
//     access_token: '...',
//     client_id: 'your_client_id',
//     expires_in: '14400',
//     token_type: 'Bearer'
// }
```

### getTracking(inquiryNumber, options)

The Track API helps retrieves current status of shipments such as Small Package 1Z, Infonotice, Mail Innovations, FGV, or UPS Freight shipments using the package number or the reference number. The tracking response data typically includes package movements/activities, destination UPS access point information, expected delivery dates/times, etc. Required parameters are the inquiryNumber, transaction ID, and transaction source. The response returns an array of shipment objects containing detailed tracking information and status for the package(s) associated with the inquiryNumber, including current status, activity history, delivery details, package details, and more.

See: https://developer.ups.com/tag/Tracking?loc=en_US

```javascript
const tracking = await ups.getTracking('1Z12345E0205271688');

console.log(tracking);
// {
//     trackResponse: {
//         shipment: [{
//             package: [{
//                 trackingNumber: '1Z12345E0205271688',
//                 activity: [...],
//                 currentStatus: { ... },
//                 deliveryDate: [...],
//                 deliveryInformation: { ... }
//             }]
//         }]
//     }
// }
```

## License

Apache-2.0