# Lab Report — Week 03 Requirements Engineering with AI

## 1. Environment & Setup

- **AI Model:** chatGPT-4o 
- **Branch:** `week-03`
- **Scope Statement:** All deliverables were generated strictly within the Smart Campus study room booking scenario.

---

## 2. Original AI Output — User Stories (Part 1)

> Raw response from Prompt 1:

Student Goals:
Students want to find available study rooms, book a suitable room for a chosen time, view or manage their bookings, and avoid booking conflicts.

Administrator Goals:
Administrators want to manage study rooms, control room availability, monitor bookings, and handle booking-related issues.

User Stories:
1. As a Student, I want to view available study rooms, so that I can choose a room that fits my needs. (Priority: High, Assumption: The system contains a list of study rooms and their availability.)
2. As a Student, I want to book an available study room for a specific time, so that I can reserve a place to study. (Priority: High, Assumption: Students can make bookings only for available time slots.)
3. As a Student, I want to view my current and upcoming bookings, so that I can keep track of my reserved rooms. (Priority: Medium, Assumption: The system stores each student's bookings.)
4. As a Student, I want to cancel my booking, so that I can release the room when I no longer need it. (Priority: Medium, Assumption: Students are allowed to cancel their own bookings.)
5. As an Administrator, I want to add or remove study rooms, so that the system reflects the rooms currently available on campus. (Priority: High, Assumption: Administrators have permission to manage room records.)
6. As an Administrator, I want to view all study room bookings, so that I can monitor room usage. (Priority: High, Assumption: Administrators can access booking information for all rooms.)
7. As an Administrator, I want to block a study room for a specific time, so that the room cannot be booked when it is unavailable. (Priority: High, Assumption: Administrators can mark rooms as unavailable.)
8. As an Administrator, I want to manage booking conflicts, so that each study room is assigned to only one booking for the same time slot. (Priority: High, Assumption: The system checks room availability before confirming a booking.)

---

## 3. Story Review (Part 2)

| Story ID / Raw # | Decision | Rationale for change / keeping |
| --- | --- | --- |
| Raw #1 -> US-01 | Kept | Valid Student goal directly matching room availability search. |
| Raw #2 -> US-02 | Kept | Valid core functional goal matching study room booking. |
| Raw #3 -> US-03 | Kept | Valid booking management feature for Students. |
| Raw #4 -> US-04 | Kept | Valid booking cancellation feature. |
| Raw #5 -> US-05 | Rewritten | AI included 'add/remove study rooms' which is out-of-scope. Modified to 'block or unblock study room' to align with scenario bounds. |
| Raw #6 -> US-06 | Kept | Matches Administrator goal for monitoring usage. |
| Raw #7 | Merged | Combined with US-05 to cover room blocking/unblocking under a single story. |
| Raw #8 | Dropped | Managing booking conflicts is a system validation/business rule mechanism, not a separate human actor story. |

---

## 4. Original AI Output — Acceptance Criteria (Part 3)

> Raw response from Prompt 2:

US-01 — View Available Study Rooms
Assumptions:
- The system contains registered study rooms.
- Room availability is based on existing bookings and administrator blocks.
- Students can search for rooms by a future date and time.
Acceptance Criteria:
- Successful availability search: Given a student selects a future date and time, When the student searches for available rooms, Then the system displays rooms that are not booked and are not blocked during that time.
- Past time validation: Given a student selects a date and time in the past, When the student searches for available rooms, Then the system rejects the search and indicates that bookings must be in the future.
- Booked room exclusion: Given a room already has a booking overlapping the selected time, When the student searches for available rooms, Then that room is not shown as available.
- Blocked room exclusion: Given an administrator has blocked a room for the selected time, When the student searches for available rooms, Then the blocked room is not shown as available.

US-02 — Book an Available Study Room
Assumptions:
- Only students can create their own room bookings.
- A booking has a start time and end time.
- The system checks room availability before confirming a booking.
Acceptance Criteria:
- Successful booking: Given a student selects an available room and a future time, When the student submits a booking with a duration of two hours or less, Then the system confirms the booking and records it for the student.
- Maximum duration validation: Given a student selects a future booking time, When the requested duration is longer than two hours, Then the system rejects the booking and informs the student that the maximum duration is two hours.
- Past booking validation: Given a student selects a start time in the past, When the student submits the booking, Then the system rejects the booking and indicates that bookings must be in the future.
- Overlapping booking: Given another booking already uses the selected room during part or all of the requested time, When the student attempts to confirm the booking, Then the system rejects the booking and indicates that the room is unavailable for that time.
- Blocked room: Given the selected room is blocked by an administrator during the requested time, When the student attempts to book it, Then the system rejects the booking and indicates that the room is unavailable.

US-03 — View My Current and Upcoming Bookings
Assumptions:
- The system stores bookings associated with individual students.
- Students can only view their own bookings.
- Past bookings may be separated from current and upcoming bookings.
Acceptance Criteria:
- Successful viewing: Given a student has current or upcoming bookings, When the student opens their bookings, Then the system displays their room, date, start time, and end time.
- Upcoming bookings only: Given the student has both past and future bookings, When the student views upcoming bookings, Then the system displays only bookings scheduled for the future.
- No bookings: Given a student has no current or upcoming bookings, When the student opens their bookings, Then the system displays a message indicating that there are no upcoming bookings.

---

## 5. Criteria Review (Part 3)

| Story ID | Criteria Count | Adjustments made during review |
| --- | --- | --- |
| US-01 | 4 (AC-01 to AC-04) | Formatted into standard Given/When/Then blocks with explicit IDs. Included past validation and administrator block checks. |
| US-02 | 5 (AC-05 to AC-09) | Formatted with explicit IDs. Confirmed maximum duration enforcement (2 hours) and overlap rejection rules. |
| US-03 | 3 (AC-10 to AC-12) | Formatted with explicit IDs. Verified clear differentiation between active/upcoming bookings and empty states. |

---

## 6. Original AI Output — Use Case Diagram (Part 4)

```plantuml
@startuml
left to right direction

actor Student
actor Administrator

rectangle "Smart Campus Study Room Booking System" {
    usecase "View availability" as UC1
    usecase "Book room" as UC2
    usecase "Cancel booking" as UC3
    usecase "Block or unblock room" as UC4
    usecase "Review usage" as UC5
    usecase "Send confirmation" as UC6
}

Student --> UC1
Student --> UC2
Student --> UC3

Administrator --> UC4
Administrator --> UC5

UC2 .> UC1 : <<include>>
UC2 .> UC6 : <<include>>

@enduml

---

## 7. Diagram Review (Part 4)

Element / Relationship,Evaluation,Action / Rationale
Student associations,Correct,"Connected strictly to View availability, Book room, and Cancel booking."
Administrator associations,Correct,Connected strictly to Block or unblock room and Review usage.
UC6 Send confirmation association,Correct,The AI correctly avoided linking human actors directly to automated notification dispatch.
UC2 .> UC1 : <<include>>,Optional / Removed,Removed mandatory inclusion dependency between Book room and View availability to keep core transaction flows decoupled.

---

## 8. Traceability Review (Part 5)

| Story ID | Use Case ID | Coverage Status | Notes / Rationale |
| --- | --- | --- | --- |
| US-01 | UC-01 | Covered | `View available rooms` directly maps to `UC-01 (View availability)`. |
| US-02 | UC-02 | Covered | `Book an available study room` directly maps to `UC-02 (Book room)`. |
| US-03 | UC-01 | Covered | `View my current and upcoming bookings` utilizes `UC-01 (View availability / status)`. |
| US-04 | UC-03 | Covered | `Cancel my booking` directly maps to `UC-03 (Cancel booking)`. |
| US-05 | UC-04 | Covered | `Block or unblock a study room` directly maps to `UC-04 (Block or unblock room)`. |
| US-06 | UC-05 | Covered | `View study room bookings and usage reports` directly maps to `UC-05 (Review usage)`. |

*All 6 User Stories and 5 Use Cases are fully bidirectional and verified against `traceability.md`.*

---

## 9. Checker Runs

All local automated tests were executed using the repository verification scripts:

1. **Requirements Structure Check (`check_requirements.py`):**
   - **Result:** `23 PASS · 0 FAIL · 0 ERROR`
   - **Summary:** Verified all User Stories, Acceptance Criteria (Given/When/Then), PlantUML boundary requirements, and Traceability Matrix completeness without any missing placeholders or vocabulary violations.

2. **Submission Metadata Validation (`validate_submission.py`):**
   - **Result:** `21 PASS · 0 FAIL · 0 ERROR`
   - **Summary:** Validated `submission.yml` structure, git commit hash matching, required counts, assumptions, and honesty declarations.

---

## 10. Conclusion

During Week 03, requirements engineering was successfully executed using an AI-assisted workflow for the Smart Campus study room booking system. 

Key takeaways:
- **Filtering & Refinement:** Raw AI outputs required strict human review to eliminate out-of-scope concepts (such as system maintenance or administrative room creation) and to properly merge overlapping user requirements.
- **Formality in Acceptance Criteria:** Converting loose requirements into concrete Given/When/Then statements ensured both happy paths and boundary/error conditions (e.g., max 2-hour duration, overlapping bookings) were testable.
- **Traceability & Validation:** Establishing direct traceability between User Stories, PlantUML Use Cases, and test scripts verified 100% requirements coverage with zero failing tests.