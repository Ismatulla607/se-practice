# Traceability — use cases → stories → criteria

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | AC-01, AC-02, AC-03, AC-04 | No |
| UC-02 Book room | US-02 | AC-05, AC-06, AC-07, AC-08, AC-09 | No |
| UC-03 Cancel booking | US-04 | None | Yes (No AC generated) |
| UC-04 Block or unblock room | US-05 | None | Yes (No AC generated) |
| UC-05 Review usage | US-06 | None | Yes (No AC generated) |
| UC-06 Send confirmation | None | None | Yes (System internal action) |

**Stories that belong to no use case:** US-03 (View My Bookings) — matches user management view, not mapped to a primary core use case.

**What the gaps tell you:** Acceptance criteria were generated only for 3 selected stories as instructed. Secondary actions (`Cancel booking`, `Block room`, `Review usage`) lack detailed ACs, and `Send confirmation` is an automated system step without a standalone user story.