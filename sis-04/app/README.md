# Smart Campus Room Availability Checker

React + TypeScript + Vite application. Fictional room data only; no backend or booking writes.

## Setup

From `sis-04/app/`:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Run tests

```bash
npx vitest run
npm run build
```

From `sis-04/` run `python3 tests/check_sis.py` and `python3 tests/validate_submission.py` after filling the submission declaration.

## How to use

Choose attendees and all required equipment; select a matching room. Enter current, start, and end times, then click **Check availability**. Blocked rooms are displayed as blocked and always return Unavailable. Changing rooms clears the previous result. An empty matching list shows an explanatory message.
