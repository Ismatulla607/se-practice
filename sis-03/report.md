# SIS #03 — Report: Smart Campus Room Availability Checker



## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Coding assistant (tool) | Gemini |
| Coding assistant model | Gemini 3 (Auto) |
| Bolt.new model | not displayed |
| Bolt project link | https://smart-campus-room-av-g1tc.bolt.host |
| Language | Python |
| Path | A |
| Python v1 from | fresh |
| Web v1 from | fresh |

## 2. Baseline — before any new AI exchange

<!-- Written by you, without AI, before the first exchange of this SIS. Commit and push it
     first (README §2). Reusing Week 05/06 work does not exempt you: this section is new. -->

### 2.1 Scope in my own words

**Scope:** This system is meant to check whether a selected campus room is available for a specific time. It takes the chosen room and the chosen time and shows only one result: Available or Unavailable. The system does not create or confirm any bookings. Login, database, backend, external APIs, and payments are outside the scope.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | The start and end times must be integer minutes between 0 and 1440. The start time must be before the end time and strictly later than the current time (now). |
| AC2 | The requested time duration can be no longer than 120 minutes. A duration of exactly 120 minutes is allowed. |
| AC3 | If the room is marked as blocked, the request must always be unavailable. |
| AC4 | The requested time must not overlap with any existing booking. Touching an existing booking exactly at its start or end time is allowed. |
| AC5 | The page must clearly display the result as either Available or Unavailable, and checking availability must not change or modify existing bookings. |
| AC6 | The user must receive clear and understandable validation feedback, and the page must function properly on narrow or mobile screens. |

### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | The program might mistakenly treat a requested time that only touches an existing booking as an overlap. | AC4 | With existing (600, 660), I will check 660–720. It should be Available. |
| 2 | The program might allow a request to start exactly at the current time. | AC1 | With now = 540, I will check 540–570. It should be Unavailable. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Start time of the requested slot | integer minutes, 0–1440 |
| `end` | End time of the requested slot | integer minutes, 0–1440 |
| `now` | Current time | integer minutes, 0–1440 |
| `blocked` | Whether the room is blocked | boolean |
| `existing` | Existing bookings | list of (start, end) intervals |
| returns | Whether the requested time is valid | boolean, True or False |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. All time values are represented as integer minutes from the beginning of the day.
2. Checking availability does not modify the existing bookings.

**Checked manually:**

- I will manually check boundary cases such as exactly 120 minutes, 121 minutes, a start time equal to now, and a request touching an existing booking.

## 3. Python v1 review

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not isinstance(start, int) or not isinstance(end, int) or not isinstance(now, int):` | AC1 | Yes | It rejects start, end, or now when they are not integer values. |
| `if not (0 <= start < end <= 1440):` | AC1 | Yes | It checks the allowed daily range and also requires start to be before end. |
| `if start <= now:` | AC1 | Yes | It rejects a request that starts now or in the past, so start must be strictly later than now. |
| `if (end - start) > 120:` | AC2 | Yes | It rejects durations longer than 120 minutes while allowing exactly 120 minutes. |
| `if blocked:` | AC3 | Yes | It rejects every request when the room is blocked. |
| `if max(start, ex_start) < min(end, ex_end):` | AC4 | Yes | It detects an actual overlap using a strict comparison, so intervals that only touch at an endpoint are allowed. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Create a responsive single-page prototype called "Smart Campus Room Availability Checker".

The page is only for checking whether one selected campus room is available for a requested time. It must never create, confirm, or save a booking.

Use fictional data only.

Page requirements:
- Show one selected room, for example "Room A-101".
- Show whether the room is blocked or not.
- Show the room's existing bookings.
- Let the user enter a start time and an end time.
- Provide a "Check Availability" button.
- After checking, clearly show exactly one result: "Available" or "Unavailable".
- Show clear and understandable validation feedback when the entered time is invalid.
- The page must remain usable on a narrow/mobile screen around 375 px wide.

Availability rules:
- Treat time as integer minutes from 0 to 1440 internally.
- 0 <= start < end <= 1440.
- The requested start must be strictly later than the current time.
- Maximum duration is 120 minutes; exactly 120 minutes is allowed.
- A blocked room is always unavailable.
- The requested time must not overlap an existing booking.
- Touching an existing booking exactly at its start or end is allowed.
- Checking availability must not modify the existing bookings.

For the prototype data use:
- current time: 540 minutes (09:00)
- blocked: false
- existing booking: 600–660 minutes (10:00–11:00)

Keep the scope limited to this checker. Do not add login, database, backend, external APIs, payments, booking creation, booking confirmation, or unrelated features.

Generate the first working version only. Do not perform a cleanup or second design pass yet.
~~~~

| Generated file or component | Path | Its role |
| --- | --- | --- |
| Main application component | `src/App.tsx` | Implements the room availability UI, validation and availability result. |
| Application styles | `src/index.css` | Provides the responsive layout and visual styling for the prototype. |

**What v1 does:**

- Shows one fixed room (Room A-101), current time 09:00, blocked status, and the fictional 10:00–11:00 booking. It accepts start/end times, validates the request, and displays Available or Unavailable with feedback. The layout works at 375 px, but some required test states cannot be entered through the v1 UI.

## 5. Test cases — executed on both artifacts

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Not testable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | Available |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Unavailable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Not testable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Available | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |

## 6. Traceability

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py`; `web/final/src/App.tsx` | T1, T6, T7, T8, T9 | Valid boundaries accepted; invalid order, starts-now and values above 1440 rejected | Python matched; web T8/T9 were not testable | Python and page matched expected results |
| AC2 | `code/booking.py`; `web/final/src/App.tsx` | T4, T5 | 120 minutes Available; 121 minutes Unavailable | Matched expected | Matched expected |
| AC3 | `code/booking.py`; `web/final/src/App.tsx` | T3 | Blocked room Unavailable | Python False; page Not testable | Python False; page Unavailable |
| AC4 | `code/booking.py`; `web/final/src/App.tsx` | T1, T2, T10 | Touching allowed; overlaps rejected | Python matched; page T10 not testable | Python and page matched expected results |
| AC5 | `code/booking.py`; `web/final/src/App.tsx` | T11 | Clear result and existing bookings unchanged | Python True and unchanged; page Available | Python True and unchanged; page Available |
| AC6 | `web/final/src/App.tsx`; `web/final/src/index.css` | T5, T6, T7, T12 | Clear validation and usable narrow layout | Validation shown; T12 Available | Validation shown; T12 Available |

## 7. Issue log

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | The v1 time input could not represent end = 1440, so the required midnight boundary could not be tested. | T8, T9 | High | Replaced the native time inputs with integer-minute inputs, allowed 1440 and rejected values above 1440. | T8 showed Available for 1380–1440; T9 showed Unavailable for 1380–1441. |
| 2 | The v1 page fixed blocked = false and used fixed existing bookings, so required states were not testable. | T3, T10 | Medium | Added prototype-only Room blocked and Include test booking 700–760 controls without adding booking creation. | T3 showed Unavailable when blocked; T10 showed Unavailable with the 700–760 test booking enabled. |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 1: the v1 time input could not test the 1440-minute boundary, while the repaired prototype accepts 1380–1440 and shows Available.

## 8. Critique decisions

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | The web UI cannot represent 24:00, so the end-of-day boundary cannot be tested. | I tried T8 with 23:00–24:00, but the time input did not allow 24:00. | Accept | AC1 allows end = 1440, so T8 must be testable. |
| 2 | The blocked state should be exposed so blocked-room rejection can be tested. | In v1 the page only displayed “Not blocked” and provided no way to test blocked = true. | Accept | AC3 requires a blocked room to always be rejected; T3 was Not testable. |
| 3 | The web page should handle cross-midnight ranges. | I compared the recommendation with AC1 and T9. | Reject | AC1 requires end <= 1440. T9 intentionally checks that 1441 is rejected, so cross-midnight booking support would expand the required scope. |

## 9. Coding-agent analysis

### 9.1 The loop

| User goal | Make T3, T8, T9 and T10 testable without expanding the project scope. |
| Model / plan | Gemini reviewed the v1 results and proposed focused repairs for the time input, blocked state and test booking. |
| Tool call | I sent a focused repair prompt to the existing Bolt project. |
| Observation | Bolt changed the controls; T3 and T10 became Unavailable, T8 Available, and T9 Unavailable. |
| Next step | Export the final prototype, rerun tests and run the SIS checker. |
| Human review | I rejected cross-midnight support because AC1 requires end <= 1440. |

### 9.2 Context, tools and permissions

| Gemini | SIS requirements and v1 test results | Generated plan, code, critique and repair suggestions | Observed |
| Bolt.new | Existing web project and repair prompt | Edited and built the web prototype | Observed |
| Gemini model internals | Prompt and conversation context | Internal reasoning is not directly visible | Assumed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting AI changes, I compared them with AC1–AC6 and the fixed scope, preserved the original artifacts, rejected cross-midnight support, and retested the repaired boundary, blocked-room, and overlap cases before keeping the final version.

**Reliability, security, responsibility:** AI output can look correct while still violating requirements, so I used executable tests and observed page behavior instead of trusting generated explanations. I also checked the final source for out-of-scope network, login, backend, database, and storage behavior. The human reviewer remains responsible for scope decisions, tool permissions, evidence, tests, and final acceptance.

## 10. Reflection

For me AI-assisted coding and vibe coding were pretty different. With Python it was easier to understand what was happening because the function was small and I could test every rule separately. Bolt was much faster for creating the interface, but at first I did not notice that some test cases were impossible to check in the UI.

One reliability risk is that AI can misunderstand a requirement even when the code looks correct. For usability, the first version could not properly test 1440 minutes or the blocked state. There is also a security risk because generated projects can add network calls or dependencies that I did not ask for.

I think tests, permissions and final review still should be checked by a person. I rejected the AI suggestion about cross-midnight bookings because it was outside AC1. Next time I would make validation and test controls more clear from the first version without adding unnecessary features.

## 11. Appendix A — AI exchanges


### B1

- **Tool:** Gemini
- **Model:** Gemini 3 (Auto)
- **Date:** 2026-11-01
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
Create a short implementation plan for the Smart Campus Room Availability Checker.

The Python function must be:
can_book(start, end, now, blocked, existing)

Requirements:
- start, end, and now are integer minutes from 0 to 1440
- 0 <= start < end <= 1440
- start must be strictly later than now
- maximum booking duration is 120 minutes; exactly 120 is allowed
- if blocked is True, the request is unavailable
- the requested interval must not overlap any existing booking
- touching an existing booking exactly at its endpoint is allowed
- the function only checks availability and must not modify existing bookings

Do not write code yet.

Give me a short implementation plan and explain the validation order. Mention which acceptance criterion (AC1–AC4) each step checks.
~~~~

**Response:**

~~~~text
Here is a short implementation plan and validation order for the Smart Campus Room Availability Checker, mapped to the required acceptance criteria (AC1–AC4).

Acceptance Criteria Definition

AC1 (Time & Duration Constraints): Validates integer bounds (0 <= start < end <= 1440), future booking timing (start > now), and maximum duration limit (<= 120 minutes).

AC2 (Room Status): Validates that the room is not administratively blocked.

AC3 (Conflict Detection): Validates that the requested interval does not overlap with any existing bookings (while allowing endpoint touching).

AC4 (Read-Only Safety): Ensures the function performs a purely analytical check without mutating any state.

Implementation Plan & Validation Order

The function will execute validation checks in a strict fail-fast order (checking fast/cheap logical constraints first before iterating through existing booking lists).

Step 1: Basic Time & Duration Validation (AC1)

Checks:
Ensure all time parameters are within the valid 0–1440 minute window, with 0 <= start < end.
Verify that the booking starts strictly in the future (start > now).
Verify that the duration does not exceed 120 minutes (end - start <= 120).

Action: If any condition fails, immediately return False.

Step 2: Room Blocked Status Check (AC2)

Checks:
Evaluate the blocked parameter.

Action: If blocked is True, immediately return False since the room is unavailable for reservations.

Step 3: Existing Booking Overlap Check (AC3)

Checks:
Iterate through the collection of existing bookings (each defined by an interval [e_start, e_end]).
Test for an overlap condition. Two intervals overlap if and only if the requested start is strictly before the existing end, and the requested end is strictly after the existing start (start < e_end and end > e_start).

Note on endpoints: Because the check uses strict inequalities (< and >), a request that touches an existing booking precisely at its boundary (e.g., requested [200, 300] where existing is [100, 200]) correctly evaluates to non-overlapping.

Action: If any overlap is detected, return False.

Step 4: Final Return / Read-Only Verification (AC4)

Checks:
If all previous validation checks pass without failing or finding conflicts, the function confirms availability.

Action: Return True without modifying any input arguments or external states.

Would you like to proceed with writing the Python implementation based on this validation order?
~~~~

### B2

- **Tool:** Gemini
- **Model:** Gemini 3 (Auto)
- **Date:** 2026-11-01
- **Stage:** Generate
- **Source:** this SIS

**Prompt:**

~~~~text
Now generate the first Python version of the function.

Use this exact signature:
can_book(start, end, now, blocked, existing)

Follow these requirements exactly:

AC1: start, end, and now must be integer minutes. The valid range is 0 to 1440, with 0 <= start < end <= 1440, and start must be strictly later than now.

AC2: the requested duration must be at most 120 minutes. Exactly 120 minutes is allowed.

AC3: if blocked is True, the request must be rejected.

AC4: reject the request if it overlaps any existing booking. Touching an existing booking exactly at an endpoint is allowed.

The function must only check availability and must not modify the existing bookings.

Return only the Python code for this first version. Do not revise or improve it after generating it.
~~~~

**Response:**

~~~~text
def can_book(start, end, now, blocked, existing):
    if not isinstance(start, int) or not isinstance(end, int) or not isinstance(now, int):
        return False
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False
    if (end - start) > 120:
        return False
    if blocked:
        return False
    for ex_start, ex_end in existing:
        if max(start, ex_start) < min(end, ex_end):
            return False
    return True
~~~~

### B3

- **Tool:** Gemini
- **Model:** Gemini 3 (Auto)
- **Date:** 2026-11-01
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
Review the following v1 results of my Smart Campus Room Availability Checker against AC1–AC6.

Python v1 results:
T1 True
T2 False
T3 False
T4 True
T5 False
T6 False
T7 False
T8 True
T9 False
T10 False
T11 True
The existing bookings list remained unchanged after T11.

Web v1 results:
T1 Available
T2 Unavailable
T3 Not testable because blocked is fixed to false
T4 Available
T5 Unavailable
T6 Unavailable
T7 Unavailable
T8 Not testable because the time input cannot represent 24:00
T9 Not testable because the UI cannot represent a time after midnight
T10 Not testable because existing bookings are fixed
T11 Available
T12 Available at 375px width

Acceptance criteria:
AC1: integer minutes, 0 <= start < end <= 1440, start strictly later than now.
AC2: duration <= 120 minutes; exactly 120 allowed.
AC3: blocked room must always be rejected.
AC4: overlaps rejected; endpoint touching allowed.
AC5: clear Available/Unavailable result and checking must not mutate bookings.
AC6: understandable validation feedback and usable narrow/mobile layout.

Identify specific defects or limitations in v1. For each claim, reference the relevant AC and test case. Do not write replacement code yet. Recommend only focused repairs that stay within the existing scope.
~~~~

**Response:**

~~~~text
Here is a focused review of the v1 results for the Smart Campus Room Availability Checker mapped against acceptance criteria AC1–AC6, highlighting specific defects and limitations without introducing replacement code.

Summary of v1 Defects & Limitations

AC1 / Web T8, T9: Partial limitation. The Web UI cannot represent 24:00 (end = 1440) or times extending past midnight, blocking end-of-day boundary testing.

AC2: Met / needs UI validation. Logic handles constraints correctly in Python, but Web UI lacks explicit feedback when duration exceeds 120 minutes.

AC3 / Web T3: Defect. The blocked state is hardcoded to false in the web interface, rendering AC3 untestable.

AC4: Met. Endpoint touching and overlap rejections function correctly in the core evaluation logic.

AC5 / Python T11, Web T10: Partial limitation. Python correctly preserves the bookings list, but Web T10 is untestable because existing mock bookings are static.

AC6 / Web T3, T8, T9, T10, T12: Partial limitation. Narrow/mobile layout renders correctly at 375px, but validation feedback is missing or blocked by UI rigidness for boundary/state edge cases.

Detailed Breakdown by Acceptance Criteria

1. AC1: Time Boundaries & Now Constraints
Defect / Limitation: Web T8 & T9 Failure.
Analysis: The web input controls cannot represent 24:00 (end time of 1440 minutes) or times past midnight. This prevents validation of end-of-day closing hours and overnight shifts.

2. AC3: Blocked Room Rejection
Defect / Limitation: Web T3 Failure.
Analysis: The blocked property in the web version is statically fixed to false. As a result, users cannot test whether a room marked as maintenance-blocked is correctly rejected.

3. AC5: Immutability of Bookings & Result Clarity
Defect / Limitation: Web T10 Limitation.
Analysis: While Python successfully verified that checking availability does not mutate the existing bookings list (T11), the web version cannot verify this behavior because existing bookings are fixed and non-dynamic (T10).

4. AC6: Validation Feedback & Mobile Responsiveness
Defect / Limitation: Web T3, T8, T9, T10 Feedback Gaps.
Analysis: While the mobile layout successfully adapts at 375px width (T12), the interface lacks informative validation feedback when inputs hit structural limitations, leading to silent failures or untestable edge cases.

Recommended Focused Repairs

1. Web Time Inputs (AC1): Update time picker inputs or parsing logic to accept 24:00 (1440 minutes) and handle cross-midnight ranges correctly.
2. Dynamic Blocked State (AC3): Expose the blocked attribute as a togglable control or state variable in the web interface so blocked room rejections can be actively tested.
3. Dynamic Bookings State (AC5 & AC6): Make existing bookings modifiable or inspectable in the web application to ensure availability checks do not inadvertently alter state, and implement clear inline validation messages for unsupported inputs.

Would you like to proceed with drafting the specific code fixes for the web input restrictions and blocked state toggling?

- Target specific component or file for v2 patches
- Review unit test coverage expansion for edge cases
~~~~

### B4

- **Tool:** Gemini
- **Model:** Gemini 3 (Auto)
- **Date:** 2026-11-01
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
Create a focused repair for the web prototype based on the verified v1 issues.

Do not expand the scope and do not add login, backend, database, APIs, payments, booking creation, or booking confirmation.

Repair these issues:

1. AC1 / T8 and T9:
The current HTML time picker cannot represent the required exact end boundary of 1440 minutes (24:00), and it also prevents testing an invalid value above 1440.
Change the time entry to integer-minute inputs for start and end, with the valid range clearly explained as 0–1440. The validation must allow end = 1440 and reject end > 1440.

2. AC3 / T3:
Add a simple blocked-state control so blocked = true can be tested. When blocked is true, the result must always be Unavailable.

3. AC4 / T10:
Add a minimal way to test the additional fictional existing booking (700, 760), while keeping the default existing booking (600, 660). This is only test data for availability checking and must not create or confirm bookings.

Keep:
- one selected room
- now = 540
- maximum duration = 120 minutes
- endpoint touching allowed
- clear Available / Unavailable result
- understandable validation messages
- responsive layout at about 375px
- availability checks read-only

Do not implement cross-midnight bookings. AC1 requires end <= 1440.

Give me the exact focused changes needed for the existing Bolt web prototype. Do not redesign unrelated parts of the page.
~~~~

**Response:**

~~~~text
To address the verified v1 issues while keeping the scope strictly focused, update your Bolt web prototype with the following exact, minimal changes.

1. Integer-Minute Time Inputs (AC1 / T8 & T9)

Replace HTML time pickers with numeric integer inputs to support full minute values from 0 to 1440, where 1440 represents 24:00.

The validation must reject values below 0 or above 1440, require end to be greater than start, and reject durations above 120 minutes. Exactly 120 minutes remains valid.

2. Room Blocked State Control (AC3 / T3)

Add a toggle or checkbox so testers can simulate a blocked room. If the room is blocked, show Unavailable and stop the availability check.

3. Test Data Controls for Existing Bookings (AC4 / T10)

Keep the default existing booking 600–660 and add a checkbox that includes the fictional test booking 700–760.

The overlap rule must use strict comparisons so endpoint touching remains allowed.

Keep availability checking read-only. Do not add booking creation, login, backend, database, APIs, payments, or unrelated features.
~~~~
## 12. Appendix B — Test output

### 12.1 Your suite

~~~~text
test_bool_is_not_integer_time (test_booking.TestCanBook.test_bool_is_not_integer_time) ... ok
test_equal_start_end (test_booking.TestCanBook.test_equal_start_end) ... ok
test_existing_inside_request (test_booking.TestCanBook.test_existing_inside_request) ... ok
test_existing_list_order_is_unchanged (test_booking.TestCanBook.test_existing_list_order_is_unchanged) ... ok
test_now_out_of_range (test_booking.TestCanBook.test_now_out_of_range) ... ok
test_request_inside_existing (test_booking.TestCanBook.test_request_inside_existing) ... ok
test_result_is_real_false_boolean (test_booking.TestCanBook.test_result_is_real_false_boolean) ... ok
test_result_is_real_true_boolean (test_booking.TestCanBook.test_result_is_real_true_boolean) ... ok
test_t10_second_booking (test_booking.TestCanBook.test_t10_second_booking) ... ok
test_t11_same_check_twice (test_booking.TestCanBook.test_t11_same_check_twice) ... ok
test_t1_touching (test_booking.TestCanBook.test_t1_touching) ... ok
test_t2_overlap (test_booking.TestCanBook.test_t2_overlap) ... ok
test_t3_blocked (test_booking.TestCanBook.test_t3_blocked) ... ok
test_t4_exactly_120 (test_booking.TestCanBook.test_t4_exactly_120) ... ok
test_t5_121_minutes (test_booking.TestCanBook.test_t5_121_minutes) ... ok
test_t6_starts_now (test_booking.TestCanBook.test_t6_starts_now) ... ok
test_t7_reversed (test_booking.TestCanBook.test_t7_reversed) ... ok
test_t8_midnight (test_booking.TestCanBook.test_t8_midnight) ... ok
test_t9_past_midnight (test_booking.TestCanBook.test_t9_past_midnight) ... ok

----------------------------------------------------------------------
Ran 19 tests in 0.000s

OK
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| X4 | The original Bolt v1 prompt contains the required rules, but I did not label them explicitly as AC1–AC6. I kept the original prompt unchanged because it is evidence of what I actually sent. | In a future run I would explicitly write the AC1–AC6 labels in the initial Bolt prompt. |
