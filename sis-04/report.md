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
| Starting point | Week 07 |
| Baseline commit | 01900fe |
| Language (ts or js) | TypeScript |
| Vitest version | 19/19 passed |
| Where I ran the tests | Successful |

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

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
