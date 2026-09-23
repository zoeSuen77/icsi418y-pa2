# Verification record

Verified locally on September 23, 2026, using Node.js 24.15.0, MongoDB 7.0.14, and installed Google Chrome on macOS 13.5.

| Check | Result |
| --- | --- |
| `npm test` | 19 API integration tests passed against real MongoDB and HTTP requests |
| `PLAYWRIGHT_CHANNEL=chrome npm run test:ui` | 5 browser tests passed |
| `npm run build` | Production build passed |
| `npm audit --omit=dev --audit-level=high` | 0 production dependency vulnerabilities reported |
| Desktop visual review | Login and signup inspected at 1440 × 960 |
| Mobile visual review | Signup inspected at 375 × 812; both forms tested for overflow |
| Database persistence | A record remained after stopping and restarting MongoDB with the demo's disk-storage configuration |

The browser test created a user through React, confirmed its document and hashed password in MongoDB, rejected a duplicate, and verified failed and successful login. Separate tests covered network failure, server failure, password visibility, and mobile layout. The browser test user was removed after the run.

API coverage includes all four required signup fields, both login fields, unknown username, wrong password, successful signup/login, document field names, hashed storage, unique usernames under concurrent requests, normalized usernames, exact password comparison, malformed/oversized JSON, CORS, and failures caused by a disconnected MongoDB client.

The downloaded MongoDB 8 executable and Playwright's current downloadable Chromium were incompatible with this computer's macOS version. Final tests instead used MongoDB 7.0.14 and the already installed Chrome; both completed successfully.

Atlas connectivity is not verified: it requires the owner's Atlas account, connection string, and IP access configuration. The Zoom video and Brightspace submission require the student's own recording and submission.
