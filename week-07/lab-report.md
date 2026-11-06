# Week 07 — Lab report

**Name:** Ismatulla Dulat
**Group:** mon (16:00-19:00)
**Date:** 6 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | starter |
| Bolt project link (or `not shared`, and why) | not shared; this submission uses the provided starter |
| Assistant that generated the tests (tool) | Gemini |
| Exact model (with its version, or `not displayed`) | Gemini 3 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | My computer |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |
| Test command | `npx vitest run src/first-run.test.ts` for the first suite; `npm test` for the final suite, from `week-07/app/` |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | `app/src/App.tsx`, inside the page component's `check()` function |
| Its inputs | Start/end/current time converted to minutes, blocked state, and the selected room's bookings |
| What it returned | A boolean availability decision |
| How the page used it | `check()` placed the boolean in React state; the page rendered Available or Unavailable |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->

Before extraction, the decision lived inside `check()` in `app/src/App.tsx`. That function converted the time inputs to minutes, applied the interval, duration, blocked-room, and overlap rules, then stored the resulting boolean for display. I moved those same conditions into the exported `canBook` function in `app/src/booking.ts`. The page still converts inputs and shows validation messages, then calls `canBook` with the same values and renders its boolean result. I preserved the conditions and their order; the extraction did not intentionally change booking decisions.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The new booking starts exactly when the existing booking ends, so there is no overlap. |
| T02 | 540–570 (starts now) | false | AC1 | The start time must be later than the current time, not equal to it. |
| T03 | 720–720 (zero duration) | false | AC1 | A booking must have a positive duration because start must be less than end. |
| T04 | 750–720 (reversed) | false | AC1 | The end time is earlier than the start time, so the interval is invalid. |
| T05 | 1380–1441 (past day end) | false | AC1 | The end time exceeds 1440 minutes, which is outside the allowed day. |
| T06 | 720–840 (120 minutes) | true | AC2 | A booking lasting exactly 120 minutes is allowed and does not overlap another booking. |
| T07 | 720–841 (121 minutes) | false | AC2 | The duration exceeds the maximum allowed limit of 120 minutes. |
| T08 | 570–600 (touching before) | true | AC4 | The new booking ends exactly when the existing booking starts, so there is no overlap. |
| T09 | 630–690 (partial overlap) | false | AC4 | The requested interval overlaps the existing booking from 630 to 660. |
| T10 | 570–690 (contains booking) | false | AC4 | The requested interval completely contains the existing booking. |
| T11 | 615–645 (inside booking) | false | AC4 | The requested interval is completely inside an existing booking. |
| T12 | 600–660 (identical interval) | false | AC4 | The requested interval is identical to an existing booking, so it conflicts. |
| T13 | 660–720, blocked = true | false | AC3 | A blocked room cannot be booked even when the requested time is free. |
| T14 | 630–690, bookings = [] | true | AC4 | There are no existing bookings, so the requested time does not conflict with anything. |
| AC5 | 660–720, compare bookings before and after | true, data unchanged | AC5 | Checking availability must not add, remove or modify any existing bookings. |
| X1 | 1320–1440 | true | AC1 | Ending exactly at midnight is valid because 1440 is the maximum allowed end time. |
| X2 | 0–60, now = 540 | false | AC1 | The requested booking starts before the current time and must be rejected. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, AC mapping, and any unclear requirements. We will run the tests ourselves.

I followed this with AC1–AC6, the existing `app/src/booking.ts`, the full reviewed case table from section 3, and the requested test-file requirements: one isolated named test per case, exact boolean assertions, fixed fixtures, no mocks/skips/random values, and an AC5 immutability assertion.
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Here is the complete Vitest test file, run command, AC mapping, and flagged requirements based on your specifications.

Run Command
To execute the test file using Vitest from your project root, run:
npx vitest run app/src/booking.test.ts

Acceptance Criteria (AC) Mapping
T01 AC4: touching after; T02 AC1: start equals now; T03 AC1: zero duration; T04 AC1: reversed interval; T05 AC1: end exceeds 1440; T06 AC2: exactly 120 minutes; T07 AC2: 121 minutes; T08 AC4: touching before; T09 AC4: partial overlap; T10 AC4: contains booking; T11 AC4: inside booking; T12 AC4: identical interval; T13 AC3: blocked room; T14 AC4: empty bookings; AC5: result and bookings immutability; X1 AC1: end at 1440; X2 AC1: start before now.

Flagged Unclear Requirements
AC6 is UI feedback. `canBook` is a pure boolean function and does not render DOM or validation messages, so AC6 requires a separate UI or integration check rather than a unit test of `booking.ts`.

The generated test-file code is preserved unchanged in `suites/first/booking.test.ts`.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | T06, maximum duration | Exact `true` assertion matches AC2; exactly 120 minutes is allowed, so this is not an expected-value copied from faulty code. | accept | AC2 permits a duration of exactly 120 minutes. |
| 2 | T01 and T08, touching endpoints | Exact `true` assertions cover both endpoint directions; neither relies on “did not throw.” | accept | AC4 explicitly allows touching endpoints. |
| 3 | Import and case coverage | The real `./booking` import works when the suite is run beside the module; the first-suite file itself is stored elsewhere, so I ran an unchanged copy beside the module. The first suite also lacked a case that overlaps a second booking. | revise | Use the correct run location without modifying the preserved first suite; add X3 to cover a multi-booking list (AC4). |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
RUN  v2.1.9 /Users/isma/Desktop/se-practice/week-07/app

 ✓ src/first-run.test.ts (17 tests) 2ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  18:04:14
   Duration  198ms (transform 17ms, setup 0ms, collect 15ms, tests 2ms, environment 0ms, prepare 32ms)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | The first suite passed all 17 tests. | Not applicable; no assertion, import, timing, or discovery failures occurred. | Not applicable | No repair was needed. |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

Actual first-run output:
RUN  v2.1.9 /Users/isma/Desktop/se-practice/week-07/app
 ✓ src/first-run.test.ts (17 tests) 2ms
 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  18:04:14
   Duration  198ms (transform 17ms, setup 0ms, collect 15ms, tests 2ms, environment 0ms, prepare 32ms)
```

Assistant review: The 17 original cases use fixed inputs, exact boolean assertions, fresh booking arrays, and the real function. Their expected values agree with AC1–AC5; do not change T06 or either touching-endpoint expectation. AC6 remains a browser check, not a `canBook` unit test. The first suite does not check a conflict with a second booking, so I added X3. I also added X4 to record the explicitly unspecified behavior for a reversed existing booking. No production-rule fix was indicated by the first run.

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
RUN  v2.1.9 /Users/isma/Desktop/se-practice/week-07/app

 ✓ src/booking.test.ts (19 tests) 2ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  18:05:55
   Duration  277ms (transform 18ms, setup 0ms, collect 17ms, tests 2ms, environment 0ms, prepare 39ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06, X1 | Both exact-120-minute requests became unavailable. |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, AC5 | Both permitted touching directions became unavailable; AC5's available request also failed. |
| M3 | Remove the blocked-room rejection | Detected | T13 | The blocked request incorrectly became available. |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
M1 — duration >= 120
RUN  v2.1.9 /Users/isma/Desktop/se-practice/week-07/app
 ❯ src/booking.test.ts (19 tests | 2 failed) 5ms
   × canBook validation and booking logic > T06 - 720–840 (120 minutes) 2ms
     → expected false to be true // Object.is equality
   × canBook validation and booking logic > X1 - 1320–1440 1ms
     → expected false to be true // Object.is equality
 Test Files  1 failed (1)
      Tests  2 failed | 17 passed (19)
   Start at  18:05:25
   Duration  222ms (transform 16ms, setup 0ms, collect 14ms, tests 5ms, environment 0ms, prepare 31ms)

M2 — touching endpoints treated as overlap
RUN  v2.1.9 /Users/isma/Desktop/se-practice/week-07/app
 ❯ src/booking.test.ts (19 tests | 3 failed) 4ms
   × canBook validation and booking logic > T01 - 660–720 (touching after) 3ms
   × canBook validation and booking logic > T08 - 570–600 (touching before) 0ms
   × canBook validation and booking logic > AC5 - 660–720, compare bookings before and after 0ms
 Test Files  1 failed (1)
      Tests  3 failed | 16 passed (19)
   Start at 18:05:33
   Duration 223ms (transform 16ms, setup 0ms, collect 15ms, tests 4ms, environment 0ms, prepare 33ms)

M3 — blocked-room rejection removed
RUN  v2.1.9 /Users/isma/Desktop/se-practice/week-07/app
 ❯ src/booking.test.ts (19 tests | 1 failed) 5ms
   × canBook validation and booking logic > T13 - 660–720, blocked = true 2ms
 Test Files  1 failed (1)
      Tests  1 failed | 18 passed (19)
   Start at 18:05:44
   Duration 191ms (transform 16ms, setup 0ms, collect 14ms, tests 5ms, environment 0ms, prepare 35ms)
```

All three changes reverted, and the full suite run again (section 6.3): yes

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | The page showed Available and still listed 10:00–11:00. | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | The result changed to Unavailable while the booking remained listed. | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Clearing Start showed “Fill in the current time, the start and the end.” and cleared the previous result. | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | At 375 px the form stacked vertically; labels, inputs, button, result, and booking remained accessible. Screenshot is portrait. | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | After repeated checks the existing booking was still 10:00–11:00; no booking was added or changed. | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The final 19-test suite passed after all three mutants were restored; no known FAIL or ERROR remains. |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 17 / 0 | 19 / 19 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC5 covered by T01–T14, AC5, X1, and X2; AC6 is not a unit-test requirement. | Same AC coverage, plus X3 checks a second booking and X4 records an unspecified invalid-existing-booking case; AC6 remains manual. |
| Selected mutants detected | Not run against the first suite. | 3 of 3: M1 by T06 and X1, M2 by T01/T08/AC5, M3 by T13. |
| Accepted / revised / rejected tests | Accepted all 17 assertions; ran an unchanged copy beside the module so its relative import resolved. | Retained the original 17 and added X3 and X4. |
| Remaining limitations | No test for multiple existing bookings; UI behavior is outside the unit suite. | Invalid existing bookings are unspecified by the AC; sample data is fictional and UI checks are browser evidence, not automated UI tests. |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

`canBook` returned `true` for the 660–720 request with the reversed existing booking `{ start: 700, end: 650 }`. No AC defines how malformed existing bookings should be handled, so this is an observed assumption, not a required outcome. The final suite records it in X4.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->

The first suite's expected values were not wrong, but it had a coverage gap: every test used at most one existing booking. While checking AC4, I added X3, where the conflict is with the second booking; an implementation that only checked the first could otherwise pass the original 17 cases. I also checked three deliberate defects. The final tests caught rejecting exactly 120 minutes, treating touching endpoints as overlaps, and ignoring a blocked room. A green run proves these 19 fixed examples return the expected booleans and that the AC5 example leaves its array unchanged. It does not prove every possible interval or guarantee the browser works on every device, so I checked the page separately at desktop and phone width. One limitation remains: no acceptance criterion defines what malformed existing booking data means. The current `true` result for a reversed booking is therefore recorded as an assumption, not claimed as correct. The room data is also fictional, so this does not verify persistence or real bookings.
