# Dynamic user table

A Hebrew React/TypeScript interface for managing rows and dynamic columns.
Useful as a portfolio example of an editable administrative interface.

## Features

- Inline row editing and required fields.
- Dynamic columns with protected system fields.
- Automatic browser-local persistence, including drafts.
- JSON backup export and validated import with replacement confirmation.
- Digit-only phone/ID fields preserve leading zeros.
- Corrupt stored data is not automatically overwritten.

## Run and check

Requires Node.js 22.21 or later in the Node 22 release line.

```sh
npm ci
npm run dev
npm test
npm run lint
npm run build
```

## Demo

Add a synthetic user, create a custom column, edit values and refresh the page.
Export a JSON backup, make changes, then import the backup to restore it.
Use fictitious names, phone numbers and identifiers for demonstrations.

## Storage limits

Data belongs to this browser and origin; there is no server or cross-device sync.
Clearing browser data removes the local copy. Export backups regularly.
Imports support this application's version-1 JSON format, up to 5 MiB,
100 columns and 10,000 rows. These are validation ceilings, not performance guarantees.
Use one tab for editing; concurrent tabs are not reconciled. If storage is unavailable
or full, the application displays a warning. Keep an exported backup before closing.

## Architecture and checks

`useTableManager` manages mutations and persistence; `tableStorage` validates
external data. Context providers handle confirmation and notifications.
Node tests cover backup round trips, schema tampering and corrupt storage;
GitHub Actions runs tests, lint and build. Browser accessibility and performance
audits remain future work. This is a local demo, not a multi-user CRM.
