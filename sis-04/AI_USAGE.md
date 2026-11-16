# AI Usage Disclosure — SIS #04

Generative AI use level D. All source changes, prompts and verifications are disclosed in `report.md` §8.

| Tool | Exact model / plan | Date | Used for | Files |
| --- | --- | --- | --- | --- |
| ChatGPT | GPT-6 | 2026-11-16 | Baseline analysis and plan | `report.md` §2–3 |
| ChatGPT | GPT-6 | 2026-11-16 | Room catalog and test-first filtering | `app/src/rooms.ts`, `filter.ts`, `filter.test.ts` |
| ChatGPT | GPT-6 | 2026-11-16 | Room booking wrapper and UI | `booking.ts`, `booking.test.ts`, `App.tsx` |
| ChatGPT | GPT-6 | 2026-11-16 | Submission preparation, diagrams, test IDs and documentation | `report.md`, `diagrams/`, `app/README.md`, `AI_USAGE.md` |

**The assistant wrote, or helped write, tests in `app/`:** yes. Test expectations are based on AC1–AC5, F1–F5, and B1–B6, not derived from function output. F4 and INT tests were added after the user's last verified 26-test run and require rerunning.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes for the 19- and 26-test runs shown; the final 28-test run has not yet been pasted.

**Every number in report.md section 7 was measured the way its row says:** baseline and last confirmed figures are measured; the 28-test state is explicitly marked pending.

**I shared no credentials, keys or private data with any tool:** confirm personally before submitting.

**Everything I submitted, I can explain and defend in class:** confirm personally after reviewing the source.

**Anything I accepted from AI without fully understanding it:** review the final changes before declaring none.

Signed: [student to confirm]  
Date: 2026-11-16
