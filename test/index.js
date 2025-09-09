const assert = require('node:assert');
const { test, describe, beforeEach, after } = require('node:test');

const cache = require('memory-cache');

const Ups = require('../index');

beforeEach(() => {
    cache.clear();
});

after(() => {
    cache.clear();
});

describe('getAccessToken', () => {
    test('should return an error for invalid environment_url', async () => {
        const ups = new Ups({
            environment_url: 'invalid'
        });

        await assert.rejects(ups.getAccessToken(), { message: 'Failed to parse URL from invalid/security/v1/oauth/token' });
    });

    test('should return an error for non 200 status code', async () => {
        const ups = new Ups({
            environment_url: 'https://httpbin.org/status/500#'
        });

        await assert.rejects(ups.getAccessToken(), { message: 'Internal Server Error', status: 500 });
    });

    test('should return a valid access token', async () => {
        const ups = new Ups({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        const accessToken = await ups.getAccessToken();

        assert(accessToken);
        assert(accessToken.access_token);
        assert(accessToken.client_id);
        assert(accessToken.expires_in);
        assert.strictEqual(accessToken.token_type, 'Bearer');
    });

    test('should return the same access token on subsequent calls', async () => {
        const ups = new Ups({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        const accessToken1 = await ups.getAccessToken();
        const accessToken2 = await ups.getAccessToken();

        assert.deepStrictEqual(accessToken2, accessToken1);
    });
});

describe('getTracking', () => {
    test('should return tracking data for test tracking number', async () => {
        const ups = new Ups({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        const tracking = await ups.getTracking('1Z5338FF0107231059');

        assert(tracking);
        assert(tracking.trackResponse);
    });

    test('should handle error for blank tracking number', async () => {
        const ups = new Ups({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        await assert.rejects(ups.getTracking(null));
    });
});