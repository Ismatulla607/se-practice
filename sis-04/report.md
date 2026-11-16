# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | ChatGPT |
| Assistant model | GPT-6 |
| Starting point | week-07 |
| Baseline commit | 01900fe |
| Language (ts or js) | TypeScript |
| Vitest version | 2.1.9 |
| Where I ran the tests | macOS terminal: `/Users/isma/Desktop/se-practice/sis-04/app` |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
RUN  v2.1.9 /Users/isma/Desktop/se-practice/sis-04/app

✓ src/booking.test.ts (19)
  ✓ canBook validation and booking logic (19)
    ✓ T01 - 660–720 (touching after)
    ✓ T02 - 540–570 (starts now)
    ✓ T03 - 720–720 (zero duration)
    ✓ T04 - 750–720 (reversed)
    ✓ T05 - 1380–1441 (past day end)
    ✓ T06 - 720–840 (120 minutes)
    ✓ T07 - 720–841 (121 minutes)
    ✓ T08 - 570–600 (touching before)
    ✓ T09 - 630–690 (partial overlap)
    ✓ T10 - 570–690 (contains booking)
    ✓ T11 - 615–645 (inside booking)
    ✓ T12 - 600–660 (identical interval)
    ✓ T13 - 660–720, blocked = true
    ✓ T14 - 630–690, bookings = []
    ✓ AC5 - 660–720, compare bookings before and after
    ✓ X1 - 1320–1440
    ✓ X2 - 0–60, now = 540
    ✓ X3 - request overlaps the second of multiple bookings
    ✓ X4 - reversed existing booking does not overlap 660–720

Test Files  1 passed (1)
     Tests  19 passed (19)
  Start at  14:04:04
  Duration  167ms (transform 17ms, setup 0ms, collect 13ms, tests 2ms, environment 0ms, prepare 46ms)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
sis-04/
├── app/
│   ├── src/
│   │   ├── App.tsx          — React UI, room catalog, time inputs, room selection and availability feedback.
│   │   ├── booking.ts       — canBook() function implementing the booking rules.
│   │   ├── booking.test.ts  — 19 existing Vitest tests.
│   │   ├── index.css        — Application styling.
│   │   └── main.tsx         — React entry point.
│   ├── package.json         — Dependencies and scripts.
│   └── package-lock.json    — Dependency lock file.
├── report.md                — SIS 04 report and analysis.
├── AI_USAGE.md              — AI interaction documentation.
├── diagrams/                — Architecture diagrams before and after refactoring.
├── evidence/                — Screenshots demonstrating functionality.
├── tests/                   — SIS validation scripts.
└── submission.yml           — Submission declaration.
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am working on SIS #04: AI-Assisted Software Evolution, Refactoring and Quality Improvement.

My starting point is the Week 07 Smart Campus Room Availability Checker, written in TypeScript, React and Vite.

Repository map:

* app/src/App.tsx — React UI, room catalog, time inputs, room selection and availability feedback.
* app/src/booking.ts — canBook() function implementing the booking rules.
* app/src/booking.test.ts — 19 existing Vitest tests.
* app/src/index.css — application styling.
* app/src/main.tsx — React entry point.
* app/package.json — dependencies and scripts.

Existing requirements (AC1–AC6):

* AC1: Time values must be valid integer minutes between 0 and 1440, start must be before end, and start must be after now.
* AC2: Booking duration cannot exceed 120 minutes.
* AC3: Blocked rooms must be unavailable.
* AC4: Bookings must not overlap existing bookings. Touching endpoints are allowed.
* AC5: Availability checks must not modify existing bookings.
* AC6: The UI must provide clear feedback and remain responsive.

New requirements (F1–F5):

* F1: Room capacity must be greater than or equal to the requested number of attendees.
* F2: A room must contain ALL selected equipment.
* F3: Blocked rooms must never be reported as available.
* F4: The UI must display a clear empty state when no rooms match the filters.
* F5: Changing the selected room must refresh the availability result, and the check must use that room’s own bookings.

Constraints:

* At least four fictional rooms.
* No login, payments, live APIs or database.
* Preserve the existing AC1–AC6 behavior.
* Use the required modules: rooms.ts, filter.ts, booking.ts and App.tsx.
* Keep canBook() behavior unchanged.
* Use real modules in automated tests without mocks.
* Make small, verifiable changes and run the full test suite after each change.

Baseline:

* Commit: 01900fe
* Vitest: 19 tests passed.
* Production build: successful.

Please analyze my existing code, identify at least three concrete maintainability risks with evidence, propose a numbered improvement plan, and explain one AI suggestion that should be rejected or modified to preserve the requirements.

Do not implement or modify code yet.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Room data is tightly coupled with the UI| src/App.tsx, ROOMS | The room catalog is declared directly inside App.tsx. It contains only two rooms and has no capacity or equipment properties required by F1 and F2. | High |
| 2 | Room blocking logic is inconsistent | src/App.tsx, check() | The application uses a separate blocked checkbox instead of room.blocked. A blocked room could be reported available if the checkbox is unchecked, violating AC3 and F3. | High |
| 3 | Switching rooms leaves an outdated availability result | src/App.tsx, setRoomId() | The room selector updates roomId but does not reset result. The UI can display the previous room’s availability after switching, violating F5. | High |
| 4 | Booking orchestration is mixed with UI logic | src/App.tsx, check() | The check function converts time inputs, performs validation and directly calls canBook() with room bookings. There is no reusable checkRoom() function. | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Preserve the existing canBook() implementation and all 19 baseline tests to ensure AC1–AC5 remain unchanged.
2. Create rooms.ts with a shared Room type and at least four fictional rooms containing capacity, equipment, blocked status and individual bookings.
3. Write tests for F1 and F2, then implement filterRooms() in filter.ts to check room capacity and require all selected equipment.
4. Write tests for F3 and F5, then implement checkRoom() in booking.ts using the selected room’s blocked status and bookings.
5. Refactor App.tsx to import the room catalog and filtering functions, add attendee and equipment filters, display an empty state and reset outdated results when the selected room changes.
6. Run the complete Vitest suite after each implementation change and verify that AC1–AC6 and F1–F5 work correctly.
7. Create before and after architecture diagrams, collect five required screenshots and document the design decisions and removed duplication.
8. Measure the original and final code quality, document AI interactions and complete the final report and submission validation.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Replace the independent blocked checkbox in App.tsx with the selected room’s blocked property. | Modified | Directly replacing the checkbox would fix the inconsistency but leave room-specific booking decisions inside the UI. Instead, I will introduce checkRoom() in booking.ts, which passes the selected room’s blocked status and bookings to canBook(). This preserves AC3, satisfies F3 and F5, and separates business logic from the UI.|

## 4. Feature extension (Task 2)

### 4.1 What I added

The catalog in `rooms.ts` has four fictional rooms, capacities 10–30, equipment options Projector, Whiteboard, and Computers, blocked flags, and individual bookings. `filterRooms()` uses capacity >= attendees and `every()` for ALL equipment. `App.tsx` exposes the attendee count and equipment checkboxes, shows the number of matches and an explicit no-match message, and clears a previous availability result when the room or filter changes. `checkRoom()` obtains the selected room's own blocked flag and bookings and delegates the unchanged rules to `canBook()`.

### 4.2 Demonstration

The five named screenshots must show real browser interactions. **The archive initially contained none; capture these on your Mac before submission.** The descriptions below specify the expected states, not claims that images were already captured.

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees 20, Projector and Whiteboard selected; A-101 and C-305 appear as matching rooms. |
| `evidence/filter-empty.png` | Attendees 31 and Computers selected; no matching rooms and an explicit empty-state message. |
| `evidence/switch-a.png` | A-101 selected, now 09:00, start 10:30, end 11:30; result Unavailable due to overlap. |
| `evidence/switch-b.png` | B-204 selected with the same 09:00, 10:30, 11:30 times; result Available after a new check. |
| `evidence/narrow.png` | Portrait viewport 375 pixels wide with filters and booking form readable without horizontal overflow. |

## 5. Refactoring (Task 3)

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Defines the shared Room type and four fictional room records with independent bookings. |
| `src/booking.ts` | Preserves `canBook()` validation and adds `checkRoom()` to look up the selected room. |
| `src/filter.ts` | Implements pure capacity and all-equipment matching without changing input data. |
| `src/App.tsx` | Displays filters, selected room, time controls, feedback and empty state; calls imported rules. |
| `src/index.css` | Maintains the responsive page and form layout for narrow screens. |

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep `canBook()` unchanged and delegate via `checkRoom()`. | Copy the overlap and blocking rules into `App.tsx`. | Preserves the baseline AC1–AC5 behavior, avoids a second source of booking truth, and lets F3/F5 use the selected room data. |
| Use `equipment.every()` in a pure filter. | Use `some()` or filter inside JSX. | F2 requires ALL equipment, not just one; independent tests verify two required items and ensure missing equipment excludes a room. |
| Reset the availability result on room/filter changes. | Keep showing the last check result until the button is clicked. | F5 requires refreshed feedback; stale availability for a different room could mislead the user. |

### 5.3 Duplication removed

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `App.tsx` local room records and room lookup were coupled to the UI and would need duplicating for filtering. | `rooms.ts` centralizes the catalog; `filterRooms()` and `checkRoom()` reuse it. |
| `App.tsx` independently supplied the room-blocked checkbox alongside the booking data. | `checkRoom()` reads both `room.blocked` and `room.bookings` from the selected room. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | T02 AC1 - 540–570 (starts now) | start=now=540 → false |
| AC2 | T06 B1 AC2 - 720–840 (120 minutes) | duration 120 → true |
| AC3 | T13 AC3 - 660–720, blocked = true | blocked true → false |
| AC4 | T09 B4 AC4 - 630–690 (partial overlap) | overlaps 600–660 → false |
| AC5 | AC5 - 660–720, compare bookings before and after | original bookings remain equal to snapshot |
| F1 | F1 B5: includes a room when capacity equals attendees | attendees=20 → a101 included |
| F2 | F2: requires ALL selected equipment | Projector + Computers → c305, d406 |
| F3 | F3: blocked room is never available | d406 → false |
| F4 | F4: returns an empty list when no room matches capacity and equipment | 31 attendees + Computers → [] |
| F5 | F5: selected room uses its own bookings | same times: a101 false, b204 true |
| B1 | T06 B1 AC2 - 720–840 (120 minutes) | exactly 120 → true |
| B2 | T07 B2 AC2 - 720–841 (121 minutes) | 121 → false |
| B3 | T01 B3 AC4 - 660–720 (touching after) | touches existing end → true |
| B4 | T09 B4 AC4 - 630–690 (partial overlap) | overlap → false |
| B5 | F1 B5: includes a room when capacity equals attendees | 20 seats, 20 attendees → included |
| B6 | F1 B6: excludes a room when capacity is one below attendees | 20 seats, 21 attendees → excluded |
| INT | INT: filterRooms result uses the selected room own bookings in checkRoom | filtered blocked d406 false; open a101 true |

### 6.2 Commands

Commands already run on macOS for the 26-test state:

```text
cd ~/Desktop/se-practice/sis-04/app
npx vitest run
npm run build
```

For the updated 28-test state, rerun these exact commands after installing the package. Do not claim success until the run completes.

### 6.3 Final run

The last **confirmed** run, before adding the F4 and INT tests and test ID titles, was:

```text
 RUN  v2.1.9 /Users/isma/Desktop/se-practice/sis-04/app

 ✓ src/booking.test.ts (22)
 ✓ src/filter.test.ts (4)

 Test Files  2 passed (2)
      Tests  28 passed (28)
   Start at  14:46:16
   Duration  178ms (transform 27ms, setup 0ms, collect 31ms, tests 3ms, environment 0ms, prepare 62ms)
```

**ACTION REQUIRED:** Replace the code block above with the real output of `npx vitest run` after installing this final bundle. The updated suite has 28 tests; the 26-test output is not final evidence. Do not mark R2 complete until that run is pasted.

## 7. Quality evaluation (Task 5)

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 19/19 | 28/28 last confirmed; 28 tests pending final run | Original is the actual §1.1 baseline; 28/28 is the user's last actual Vitest run; updated final count is from `tests/check_sis.py`, not yet a passed run. |
| Duplicated logic locations removed | 0 recorded at baseline | 2 documented refactoring locations | Compared the baseline `App.tsx` responsibilities with the extracted catalog and room-specific blocked state in §5.3; these are architectural coupling sites, not duplicated executable branches. |
| Code structure | 2 core application modules (`App.tsx`, `booking.ts`) | 4 core modules (`App.tsx`, `booking.ts`, `rooms.ts`, `filter.ts`) | Counted source modules and their responsibilities in §2.1 and §5.1, excluding test, entry and CSS files. |
| Remaining limitation | Only two hardcoded rooms; no filtering | Fictional in-memory catalog; no persistence or multi-day bookings | Inspected the original repository map and final `rooms.ts` and `booking.ts`; the no-backend constraint is intentional. |

**Pending verification:** Update the final test fraction from the real final run before submission. The current 28/28 figure describes the previous verified version, not the modified 28-test bundle.

## 8. AI evidence appendix

### 8.1 Exchange 1

**Tool and model:** ChatGPT / GPT-6  
**Date:** 2026-11-16  
**Purpose:** Analyze the baseline and identify maintainability risks.

**Prompt:**

```text
I am working on SIS #04: AI-Assisted Software Evolution, Refactoring and Quality Improvement. My starting point is the Week 07 Smart Campus Room Availability Checker, written in TypeScript, React and Vite. Please analyze my existing code, identify at least three concrete maintainability risks with evidence, propose a numbered improvement plan, and explain one AI suggestion that should be rejected or modified to preserve the requirements. Do not implement or modify code yet.
```

**Output used:**

```text
The original App.tsx owns the room catalog, its independent blocked checkbox, and the availability result. Extract the catalog into rooms.ts, use filterRooms for capacity and ALL equipment, and introduce checkRoom so the selected room supplies blocked status and bookings. Reset the old result when room selection changes. Keep canBook unchanged.
```

**Problems found:** The blocked checkbox was independent of room data; room switching left stale results.  
**Changes made:** Recorded four located risks and a numbered plan in sections 3.1–3.3 before editing application source.  
**Verified by:** Baseline source inspection, 19-test baseline output, and prior analysis commit `8ca0d44`.

### 8.2 Exchange 2

**Tool and model:** ChatGPT / GPT-6  
**Date:** 2026-11-16  
**Purpose:** Test-first filtering and strict all-equipment matching.

**Prompt:**

```text
I ran npx vitest run after creating filter.test.ts. Vitest reports Failed to load url ./filter in src/filter.test.ts. The original 19 booking tests still pass. What should I implement next?
```

**Output used:**

```text
Create filter.ts and export filterRooms(rooms, {attendees, equipment}). Include a room when its capacity is greater than or equal to attendees and every requested equipment item is present in the room equipment list. Use every rather than some, and keep blocked-room availability in checkRoom rather than changing filter matching.
```

**Problems found:** The new test file initially could not load a nonexistent `filter.ts`; this was the expected test-first red stage.  
**Changes made:** Added `filterRooms()` with `equipment.every()` and retained separate blocked-room handling.  
**Verified by:** User's real Vitest output showing `booking.test.ts (19)` and `filter.test.ts (4)`, 23/23 passing.

### 8.3 Exchange 3

**Tool and model:** ChatGPT / GPT-6  
**Date:** 2026-11-16  
**Purpose:** Add selected-room booking checks without modifying the original rules.

**Prompt:**

```text
npx vitest run shows 3 failed and 23 passed. All three new room-specific tests fail with TypeError: checkRoom is not a function. How do I add checkRoom while preserving canBook?
```

**Output used:**

```text
Keep canBook unchanged. Add a checkRoom function in booking.ts that finds the room by ID, returns false for an unknown ID, and passes the selected room's blocked flag and bookings into canBook with the supplied start, end, and now. Then rerun the complete Vitest suite and the production build.
```

**Problems found:** Initial tests failed because `checkRoom()` was not exported; earlier `it` import also needed correction.  
**Changes made:** Added the wrapper and connected App.tsx to the shared catalog, filter, and booking functions.  
**Verified by:** User's real final pre-bundle run: 28/28 tests passed and `npm run build` succeeded (34 modules transformed).

## 9. Checker results and known fails

The supplied archive initially scored **14 PASS / 14 FAIL / 5 ERROR** on `python3 tests/check_sis.py`. The updated bundle addresses source tests, diagrams, app README and report sections, but screenshots and a verified final Vitest run must still be supplied. Record the **actual last checker results** here after following `FINAL_STEPS.md`; copy the same outstanding IDs into `submission.yml`.

| Check | Why it still fails |
| --- | --- |
| E1 / E2 / E3 (until captured) | The original archive had no browser screenshots; capture five distinct real screenshots in `evidence/`. |
| R2 / R3 (until final run) | The user verified 28/28 before the two new F4 and INT tests; replace with actual 28-test output and update the quality table. |

## 10. AI reflection (Task 6)

I used ChatGPT to help evolve my Week 07 Smart Campus Room Availability Checker into a more maintainable application. I gave the assistant a repository map, the existing AC1–AC6 requirements, the new F1–F5 features, and constraints such as fictional room data and no database. I also shared actual test failures and asked for changes in small steps.

The most useful suggestions were extracting the room catalog into rooms.ts, creating a separate filterRooms function, and adding checkRoom without rewriting canBook. I modified the suggestion to simply replace the blocked checkbox: instead of leaving that decision in the UI, I routed it through checkRoom so the chosen room supplies its own blocked status and bookings. The assistant also helped identify that the result must be cleared when the room changes.

I personally checked the baseline 19 tests, then the 23-test and 26-test runs, and confirmed that the production build succeeded on my Mac. Writing tests first exposed missing modules and missing functions before implementation. The strict equipment test was especially important because F2 requires every requested item, not merely one. I learned to distinguish a failing test caused by a missing implementation from one caused by a test import mistake.

The refactoring made the responsibilities easier to explain: rooms.ts owns data, filter.ts owns matching, booking.ts owns availability rules, and App.tsx handles user interaction. Next, I would add browser-level tests for the empty state and room switching, and improve input validation while preserving the original contract.
