# AI Usage Disclosure — Week 10

Generative AI use level D — AI-integrated; work and testing remain the student's responsibility.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | GPT-6 | Read-only review of risks, constraints and AGENTS.md; original external answers not preserved verbatim in the archive | None during read-only review |
| ChatGPT | GPT-6 | Draft AGENTS.md policy patch and risk register | app/AGENTS.md, lab-report.md |
| ChatGPT | GPT-6 | Code fixes, test, UI changes, packaging and report completion | app/src/booking.ts, app/src/booking.test.ts, app/src/App.tsx, lab-report.md, AI_USAGE.md, submission.yml |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no change afterwards:** no — no archived Git status output establishes this.

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** no — the final report was substantially drafted by an assistant; the student should review each claim.

**Every change to `app/` was reviewed by me as a diff before I accepted it:** no — the patched ZIP was installed before a recorded diff approval.

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** yes — ChatGPT GPT-6 prepared the current report and earlier external review prompts.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** no — the baseline output is a clearly labelled summary, and the final run is copied from the user's terminal message.

**I can explain every score in my register, and why my release decision follows from it, without the assistant:** not yet confirmed — the student must review and defend the decision.

**Anything I accepted from the AI without fully understanding it:** The student should review the integer guard in app/src/booking.ts and UI result reset in app/src/App.tsx before signing.

Signed: Ismatulla Dulat (draft; confirm before submission)
Date: 2026-11-23
