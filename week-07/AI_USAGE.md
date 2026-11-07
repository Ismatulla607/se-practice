# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
I am responsible for the accuracy, testing and integrity of everything submitted.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Gemini | Gemini 3 | Received the original test-generation prompt and produced the first 17-test suite. | `suites/first/booking.test.ts` |
| ChatGPT | GPT-6 | Assisted with extracting `canBook`, preparing the test plan, and providing implementation guidance. | `app/src/booking.ts`, `app/src/App.tsx`, `lab-report.md` |
| GitHub Copilot in VS Code | Model not displayed | Assisted with reviewing test coverage, adding X3 and X4, configuring the test environment, checking results, and preparing documentation. | `app/src/booking.test.ts`, `app/package.json`, `app/.gitignore`, `lab-report.md`, `submission.yml`, `AI_USAGE.md` |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes

ChatGPT assisted with extracting the booking logic from `App.tsx` into `booking.ts`. The existing booking conditions were retained.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes

Gemini 3 generated the original 17-test suite. ChatGPT provided additional implementation guidance, and GitHub Copilot assisted with later testing and documentation tasks.

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes

The original Gemini-generated suite was saved without modifications in `suites/first/booking.test.ts`.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

The test and mutation results recorded in the report came from real runs, but some outputs were summarized rather than pasted in full.

**I can explain every test in my final suite — its input, its expected result and the AC behind it — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**

X3 and X4 were added during the improvement stage. X4 checks the current behavior for a reversed existing booking, which is not explicitly defined by the acceptance criteria.

Signed: Ismatulla Dulat
Date: 6 November 2026