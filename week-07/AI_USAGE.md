# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
I am responsible for the accuracy, testing and integrity of everything submitted.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Gemini | Gemini 3 | Helped extract `canBook` and generated the first 17-case test suite | `app/src/booking.ts`, `suites/first/booking.test.ts` |
| Copilot in VS Code | Not displayed | Reviewed the first suite, added X3 and X4 to the final suite, ran tests/build/mutants and browser checks, and helped complete the report | `app/src/booking.test.ts`, `lab-report.md`, `submission.yml`, `AI_USAGE.md`, `evidence/ui-1.png`–`evidence/ui-5.png` |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes

Gemini 3 helped move the availability decision from `App.tsx` into `app/src/booking.ts`. The existing conditions were retained; I checked the extraction against the starter implementation and the expected AC cases.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes

Copilot in VS Code reviewed coverage and helped prepare the report. The model name was not displayed.

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every test in my final suite — its input, its expected result and the AC behind it — without the assistant:** no

**Anything I accepted from the AI without fully understanding it:**

`app/src/booking.test.ts`, X4: the reversed-existing-booking case records the current result (`true`); no AC defines that behavior, so it is only a documented assumption.

Signed: Ismatulla Dulat
Date: 6 November 2026
