# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js library for the UPS API that provides OAuth authentication and package tracking functionality. The library has been migrated from the legacy `request` library to native `fetch` API and from Mocha to Node.js native test runner.

## Development Commands

**Testing:**
- `npm test` - Run all tests using Node.js native test runner
- `node --test test/index.js` - Run specific test file
- Tests are grouped using `describe()` blocks and use async/await patterns

**Key Environment Variables:**
- `CLIENT_ID` - UPS API client ID (required for tests)
- `CLIENT_SECRET` - UPS API client secret (required for tests)

## Architecture

The library exports a single constructor function `Ups` that creates instances with two main methods:

- `getAccessToken()` - OAuth 2.0 authentication with UPS API, includes automatic caching using memory-cache
- `getTracking(inquiryNumber, options)` - Track packages using UPS Tracking API

**Authentication Flow:**
1. OAuth uses Basic auth with client_id:client_secret encoded in Authorization header
2. Access tokens are cached in memory with half the token's lifetime as TTL
3. All API calls use Bearer token authentication

**Environment URLs:**
- Test: `https://wwwcie.ups.com` (default)
- Production: `https://onlinetools.ups.com`

**API Implementation Details:**
- Uses native `fetch` API instead of legacy request library
- OAuth endpoint: `/security/v1/oauth/token`
- Tracking endpoint: `/api/track/v1/details/{inquiryNumber}`
- Tracking requires `transId` (UUID) and `transactionSrc` headers

**Test Data:**
- Test tracking numbers: `1Z5338FF0107231059`, `1Z12345E0205271688`
- UPS test environment returns consistent mock responses regardless of tracking number used

**Memory Management:**
- Tests use `after()` hook to clear memory cache to prevent test runner from hanging
- Cache is cleared before each test with `beforeEach()` hook