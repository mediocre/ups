const crypto = require('crypto');

const cache = require('memory-cache');
const createError = require('http-errors');

function Ups(args) {
    const options = Object.assign({
        environment_url: 'https://wwwcie.ups.com'
    }, args);

    /**
     * The UPS OAuth Client Credentials API helps retrieve an OAuth Bearer token when the integration owner is also the UPS shipper. The integration owner uses their UPS login credentials, and the UPS account number, to receive a token that can be used in the authorization HTTP header of subsequent API calls to UPS APIs like the Ship API, Track API, etc.
     * @see https://developer.ups.com/tag/OAuth-Client-Credentials?loc=en_US
     */
    this.getAccessToken = async () => {
        const url = `${options.environment_url}/security/v1/oauth/token`;
        const key = `${url}?client_id=${options.client_id}`;

        // Try to get the access token from memory cache
        const accessToken = cache.get(key);

        if (accessToken) {
            return accessToken;
        }

        const formData = new URLSearchParams({
            client_id: options.client_id,
            client_secret: options.client_secret,
            grant_type: 'client_credentials'
        });

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`${options.client_id}:${options.client_secret}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        if (!res.ok) {
            const err = createError(res.status);
            err.response = await res.json().catch(() => ({}));
            throw err;
        }

        const json = await res.json();

        // Put the access token in memory cache
        cache.put(key, json, Number(json.expires_in) * 1000 / 2);

        return json;
    };

    /**
     * The Track API helps retrieves current status of shipments such as Small Package 1Z, Infonotice, Mail Innovations, FGV, or UPS Freight shipments using the package number or the reference number.
     * The tracking response data typically includes package movements/activities, destination UPS access point information, expected delivery dates/times, etc.
     * Required parameters are the inquiryNumber, transaction ID, and transaction source.
     * The response returns an array of shipment objects containing detailed tracking information and status for the package(s) associated with the inquiryNumber, including current status, activity history, delivery details, package details, and more.
     * @see https://developer.ups.com/tag/Tracking?loc=en_US
     */
    this.getTracking = async (inquiryNumber, _options = {}) => {
        const accessToken = await this.getAccessToken();

        const query = new URLSearchParams(_options);

        const res = await fetch(`${options.environment_url}/api/track/v1/details/${inquiryNumber}?${query.toString()}`, {
            headers: {
                'Authorization': `Bearer ${accessToken.access_token}`,
                'transId': crypto.randomUUID(),
                'transactionSrc': 'ups'
            }
        });

        if (!res.ok) {
            const err = createError(res.status);
            err.response = await res.json().catch(() => ({}));
            throw err;
        }

        return await res.json();
    };
}

module.exports = Ups;