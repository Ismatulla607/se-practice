# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Ismatulla Dulat
**Student ID:** 24B031734
**GitHub:** ismatulla607
**Group:** MON 16:00–19:00

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | ChatGPT |
| Exact model (or "not displayed") | GPT-6 |
| Three fresh chats for R1, R2, R3? (yes / no) | no — drafts generated in one conversation; repeat in separate chats before submission |
| Python version (`python --version`) | Python 3.13.5 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Check whether a room is available for a requested time interval. All times use whole minutes since midnight in the range 0–1440. Supply the current time, blocked status and existing bookings. This tool only checks availability; it does not save a booking or modify any state.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Whole minutes since midnight."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Whole minutes since midnight."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Whole minutes since midnight."
      },
      "blocked": {
        "type": "boolean",
        "description": "Whether the room is blocked."
      },
      "bookings": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            }
          },
          "required": [
            "start",
            "end"
          ],
          "additionalProperties": false
        },
        "description": "Existing bookings, possibly empty."
      }
    },
    "required": [
      "start",
      "end",
      "now",
      "blocked",
      "bookings"
    ],
    "additionalProperties": false
  }
}
```

| Field | Constraint | What goes wrong without it |
| --- | --- | --- |
| start | `type: integer` | Fractional or string times could enter the tool. |
| start | `minimum: 0`, `maximum: 1440` | Times outside one day could be accepted. |
| end | `type: integer` | Fractional or string times could enter the tool. |
| end | `minimum: 0`, `maximum: 1440` | Times outside one day could be accepted. |
| now | `type: integer` | Fractional or string times could enter the tool. |
| now | `minimum: 0`, `maximum: 1440` | Times outside one day could be accepted. |
| blocked | `type: boolean` | A string like `"false"` is not a boolean. |
| bookings | `type: array` | A non-list could be supplied. |
| bookings.items | `type: object` | A pair such as `[660,720]` could be accepted. |
| bookings.items.start/end | `type: integer`, `minimum: 0`, `maximum: 1440` | Booking times could be invalid. |
| bookings.items | `required: [start,end]` | Incomplete booking records could pass. |
| bookings.items | `additionalProperties: false` | Unknown booking fields could silently pass. |
| root | `required: [start,end,now,blocked,bookings]` | A required input could be missing. |
| root | `additionalProperties: false` | Unexpected fields could be accepted. |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | No change; already passed. |
| S02 | PASS | PASS | No change; already passed. |
| S03 | FAIL | PASS | Added strict type/range/required/extra-field validation. |
| S04 | FAIL | PASS | Added strict type/range/required/extra-field validation. |
| S05 | FAIL | PASS | Added strict type/range/required/extra-field validation. |
| S06 | FAIL | PASS | Added strict type/range/required/extra-field validation. |
| S07 | FAIL | PASS | Added strict type/range/required/extra-field validation. |
| S08 | FAIL | PASS | Added strict type/range/required/extra-field validation. |
| S09 | FAIL | PASS | Added strict type/range/required/extra-field validation. |
| S10 | FAIL | PASS | Added strict type/range/required/extra-field validation. |
| S11 | PASS | PASS | No change; already passed. |
| S12 | FAIL | PASS | Added strict type/range/required/extra-field validation. |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```

Matches the requested times and touching booking; availability is decided by canBook. **Provisional draft from this conversation, not an independently captured fresh-chat reply.**

### R2

```text
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```

Matches 13:30 = 810, 14:00 = 840, 16:30 = 990. The model should call the tool even though blocked and over 120 minutes; canBook rejects. **Provisional draft from this conversation, not an independently captured fresh-chat reply.**

### R3

```text
What exact start and end times tomorrow, what is the current time, is the room blocked, and what bookings already exist?
```

The request lacks exact start/end, now, blocked status and existing bookings. The draft asks instead of inventing values. **Provisional draft from this conversation, not an independently captured fresh-chat reply.**

## 5. What the schema cannot check

AC1: the schema enforces integer minutes within 0–1440, but cannot compare `start < end` or `start > now` with the permitted keywords. AC2: the 120-minute maximum needs `end - start`, which the schema cannot calculate. AC3: the blocked flag is type-checked but the schema cannot conditionally reject a request when it is true. AC4: overlaps with existing bookings require interval comparisons. AC5: the schema cannot prove the implementation has no side effects or never saves a booking. AC6: page feedback is a UI behavior outside the tool schema. The canBook implementation and UI must enforce these rules.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | A read-only availability check is within the user request and does not save data. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading source code is non-destructive, provided no secrets are exposed. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | ask | Changing the 120-minute policy violates AC2 and requires explicit approval and updated tests. |
| A4 | run `npm test` in `week-08/app` | allow | Running tests is normally safe, though the agent should inspect scripts for side effects. |
| A5 | run `git reset --hard` to undo its own last three edits | ask | Hard reset destroys uncommitted changes and may discard work unrelated to the agent. |
| A6 | `git commit` its change on the `week-09` branch | ask | A commit changes repository history and should follow review of the exact diff. |
| A7 | `git push` to `main` | block | Pushing directly to main bypasses the required review and open PR workflow. |
| A8 | send the contents of `.env` to an MCP server it found online | block | Sending .env to an unknown server risks leaking credentials and secrets. |

## 7. Checkpoint

A real local checkpoint was created in this generated folder: `5706579` (`git log --oneline`). It is **not** a commit in my `se-practice` GitHub repository. After copying into the real repository, I must create and record a new checkpoint SHA there before permitting edits. In this local folder, `git reset --hard 5706579` restores tracked files to this checkpoint and discards tracked uncommitted changes and later committed changes on the current branch; untracked files are not removed. Use only after checking `git status` and obtaining approval.

## 8. Checker output

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls/r2.json: a call to check_room
PASS  F5    calls/r2.json: arguments valid against your schema
PASS  F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

None. All 30 checks pass in the local generated folder. Fresh-chat evidence and the real repository PR remain outstanding.

## 10. Conclusion (80–150 words)

The tool schema and the booking function have different responsibilities. The schema rejects malformed input, such as S03 where the end time is a string, and S08 where a booking has no end. It cannot determine whether a request lasts more than 120 minutes or overlaps another booking; those are rules for canBook. R2 demonstrates this boundary: even though the room is blocked and the requested duration is too long, the model should still form the correct tool call. The function then decides Unavailable. R3 demonstrates a separate risk: a model may invent missing time and room information, so asking a question is safer. Finally, A8 shows why an agent needs permissions beyond input validation: valid tool access never authorizes disclosure of secret environment variables.
