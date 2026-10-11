# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Ismatulla Dulat |
| Group | MON 16:00-19:00 |
| AI assistant | Gemini |
| Exact model | gemini-3.6-flash |
| Renderer | PlantUML web server |
| Behaviour diagram | activity |
| Stories used | the reference set from README §3 |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```
### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```
### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate a UML activity diagram in PlantUML for Book room. Show the initial node, actions, guarded decisions, and final nodes. Check the time range, blocked-room status, and overlapping bookings. Show confirmation after success and rejection after failure. Use branches rather than parallel paths unless concurrency is required.
```
### 2.4 Focused correction prompts (if you sent any)

```text
none
```
### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```
---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** Only logged-in users can perform actions; the system maintains real-time data; administrators have authority to block/unblock; users have appropriate interfaces.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student - Receive Booking Confirmation | Student is linked to a confirmation use case, but R4 makes confirmation an outcome of booking, not a user goal. | R4 / US-01 | Removed the Student - UC3 association; kept only UC2 ..> UC3 include. |
| 2 | UC2 ..> UC3 include | The include has no justification comment required by the notation conventions. | README section 4 | Added a why comment above the include. |


---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One student makes 0..* bookings | Each booking belongs to exactly 1 student | 1 / 0..* |
| Room — Booking | One room is reserved for 0..* bookings | Each booking is reserved for exactly 1 room | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: A note on `Booking` states that active bookings for the same room must not overlap.
- R3: `Room.isBlocked` is an attribute; the booking flow checks it before creation, but multiplicity cannot express "blocked rooms reject new bookings".

### 4.3 Assumptions

- A1: Touching bookings are treated as overlapping (a booking ending 14:00 and one starting 14:00 conflict) — declared as `not-allowed`.
- A2: Blocking a booked room keeps existing bookings — declared as `keep-bookings`.


### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Booking (no note) | R2 cannot be expressed with multiplicities; the original had no note. | R2 | Added a note on `Booking` stating the no-overlap rule. |
| 2 | Administrator — Room association | An administrator–room association is not a domain relationship justified by the scenario. | Scenario: administrators block/unblock rooms | Removed the association from the domain class diagram. |


---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3B activity — it shows the three rule checks as sequential decisions, which matches R1–R3 better than a sequence diagram.

**Design components added beyond the domain model:** none (activity diagram).

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Decision labels | The AI used combined wording for R1; the guard needed to be explicit and labelled. | R1 | Verified each decision has a labelled guard; kept separate decisions for R1, R3, R2. |


---

## 6. AI critique

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | Missing rule logic for cancellation and room unblocking | UC4, cancel(), unblockRoom() | reject | The lab asks for ONE behaviour diagram for "Book room", not a cancellation flow. R1–R4 do not require a cancel activity diagram. |
| 2 | Inconsistent naming: duration vs durationMinutes | Activity diagram, Booking.durationMinutes | accept | Standardized the attribute to `durationMinutes` across the class diagram and the activity diagram parameters. |
| 3 | Method mismatch: cancelBooking vs cancel | Student.cancelBooking(), Booking.cancel() | accept | Student delegates to Booking.cancel(); clarified in the class diagram that Student initiates and Booking performs the state change. |
| 4 | No Report class for reviewUsageReport() | UC7, Administrator.reviewUsageReport() | reject | Report generation is out of scope for this lab's domain model; UC7 is a use case, not a domain class. |
| 5 | `<<include>>` should be `<<extend>>` for UC3 | UC2 ..> UC3 | reject | R4 states confirmation is an automatic outcome of a successful booking, so `<<include>>` is correct. The failure path is handled inside UC2. |

---

## 7. Consistency table

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book a Study Room | Booking.startTime, Booking.durationMinutes | Decision: "Is duration > 0 AND <= 2 hours AND Start Time is in future?" |
| R2 | Book a Study Room | Booking (note), Room | Decision: "Does booking overlap with an existing active booking?" |
| R3 | Book a Study Room | Room.isBlocked | Decision: "Is the requested room currently blocked?" |
| R4 | Receive Booking Confirmation | Booking.confirmationCode | Action: "Display booking confirmation [R4]" |
| US-01 | Book a Study Room | Student, Booking, Room | Create booking record, generate confirmation |
| US-01 | Receive Booking Confirmation | Booking.confirmationCode | Action: "Display booking confirmation [R4]" |
| US-02 | View Room Availability | Room.isAvailable() | — (precondition for booking) |
| US-03 | Cancel Own Booking | Student.cancelBooking(), Booking.cancel() | — (separate flow, not in this activity diagram) |
| US-04 | Block a Room | Room.setBlockedStatus(), Room.isBlocked | Decision: "Is the requested room currently blocked?" |
| US-05 | Unblock a Room | Room.setBlockedStatus(), Room.isBlocked | — (enables booking after unblock) |
| US-06 | Review Room Usage | Administrator.reviewUsageReport() | — (out of scope for booking flow) |

---

## 8. Change log

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Student - UC3 (Receive Booking Confirmation) | Association removed; only UC2 ..> UC3 include remains | R4: confirmation is an outcome of booking, not a student goal (UC5). |
| 2 | class | No note for R2 | note right of Booking stating R2 no-overlap | R2 cannot be expressed with multiplicities (CL8). |
| 3 | activity | Original had three decisions but no explicit R1 guard wording | Kept three separate decisions with labelled guards for R1, R3, R2 | Each rule must be checkable separately (AC2, AC3). |

---

## 9. Checker output

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (7 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
AC1  PASS  initial and final nodes present
AC2  PASS  separate decisions check R1, R3 and R2 (3 decisions)
AC3  PASS  every branch has a labelled guard
AC4  PASS  no parallel paths
AC5  PASS  confirmation on success, rejection on failure
AC6  PASS  creation comes after all rule checks
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 2 assumption(s) declared
LR5  PASS  1 behaviour-diagram findings in §5
LR6  PASS  4 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story

SUMMARY pass=35 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the whole criterion.
FAILs I am keeping, and why: none

```
---

## 10. Conclusion (120–180 words)

The AI got the use-case diagram most wrong: it linked the Student actor directly to "Receive Booking Confirmation", which violates R4 because confirmation is an outcome of a successful booking, not a user goal. It also omitted the required `' why:` comment above the `<<include>>`. If nobody had reviewed this, the code would have exposed a "confirm booking" endpoint to the student as if it were a standalone action, and the include would have been undocumented. The critique correctly flagged the duration/durationMinutes naming mismatch and the cancelBooking vs cancel method split, both of which I accepted and fixed. It also claimed that `<<include>>` should be `<<extend>>` for UC3; I rejected that because R4 makes confirmation automatic on success, so include is the correct relationship. The critique's claim about a missing cancellation activity diagram was also rejected — this lab requires only one behaviour diagram for the booking flow.
