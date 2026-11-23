# Week 10 — Lab report

**Name:**
**Group:**
**Date:**

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | ChatGPT |
| Exact model (with its version, or `not displayed`) | GPT-6 |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | Chat with pasted files and code |
| Starting point (`week-08` or `week-07`) | week-07 |
| Baseline commit — the checkpoint of Part 0 | `0d9a5a2` (from earlier terminal conversation; verify in local Git) |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | My computer, macOS Terminal |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |

## 2. Task 1 — the baseline

### 2.1 The project's commands

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | Baseline 19/19 tests passed on Mac |
| `npm test` | yes | pass | package.json test script runs vitest |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | No test:unit script in package.json |
| `npm run build` | yes | pass | tsc and Vite build passed |
| `npm run lint` | no | missing | No lint script or ESLint configuration |

### 2.2 The baseline test run

The baseline run was reported earlier in this conversation as 19/19 passing on Vitest 2.1.9, before the additional R2 test. **The original full terminal output was not preserved in this archive.** The following is a factual summary, not a verbatim transcript:

```text
npx vitest run
RUN v2.1.9
Test Files: 1 passed
Tests: 19 passed (19)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
[Original verbatim reply not available in this ZIP. Earlier conversation established that the assistant could not read a workspace-root AGENTS.md, used the supplied playbook text, reported npm run test:unit, and did not edit files. This is a summary, NOT an unedited quote.]
```

Which rules in its summary are wrong for this project, and how you know:

The original playbook's `npm run test:unit` script does not exist in `package.json`. Its instruction to reject touching endpoints contradicts AC4 in `README.md`. Real KBTU timetables, Supabase login and production Netlify deployment contradict the fictional, offline-only scope.

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

The review was requested in a ChatGPT conversation using the read-only instruction below. No repository write access was granted in that review; code changes happened in a separate subsequent step.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
[The complete original review response is not present in the uploaded archive. The following is a non-verbatim summary from the conversation, NOT a direct quote:]
The reviewer raised nine risks: it incorrectly argued that touching endpoints should be rejected; noted that App.tsx ignored room.blocked; flagged editable current time and stale results after changing form inputs; found no integer-minute validation in booking.ts; identified missing test:unit; discussed conditional client-side authorization and real-timetable privacy concerns; and identified unsafe Netlify and Supabase directions in AGENTS.md. Each claim needs code or contract verification, not blind acceptance.
```

### 3.2 Challenging the AI's claims

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | Touching endpoints should be rejected | Correctness | README.md AC4; src/booking.test.ts T01 and T08 | unsupported | The acceptance contract explicitly permits touching intervals. |
| 2 | Room-level blocked flag was ignored | Correctness | Earlier App.tsx check call; patched App.tsx now uses `blocked || room.blocked` | confirmed | The earlier call used only the UI checkbox. |
| 3 | A changed form can show an old result | Reliability | Earlier App.tsx state handling; current input onChange handlers | confirmed | Previous inputs did not reset result; current handlers clear it. |
| 4 | Fractional minutes were accepted | Correctness | Baseline booking.ts and current `Number.isInteger` guard; R2 test | confirmed | The original range comparisons accepted fractional values. |
| 5 | `npm run test:unit` does not exist | Agent operations | app/package.json scripts and original provided/AGENTS.md | confirmed | Only `test` and `build` exist among those scripts. |
| 6 | Client-side checks alone cannot authorize a real booking | Security | README.md scope and App.tsx | unsupported | There is no booking API, account, or persistent reservation system in scope. |
| 7 | Real timetable guidance risks privacy | Privacy | provided/AGENTS.md and README.md constraints | plausible | Original instructions requested real KBTU data; current app uses fictional data. |
| 8 | Playbook could cause unreviewed production deploy | Agent operations | provided/AGENTS.md final section | confirmed | It explicitly instructed `npx netlify deploy --prod`. |

## 4. Task 4 — the risk register

### 4.1 The register

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Agent operations | Unsafe playbook → agent deploys or adds login → unauthorized changes | app/AGENTS.md | Original provided/AGENTS.md demanded production Netlify and suggested Supabase | confirmed | 3 | 3 | 9 | Restrict agent instructions; no external deployment | Student | Diff original versus app/AGENTS.md and A1–C6 |
| R2 | Correctness | Missing integer validation → fractional minute accepted → invalid availability result | app/src/booking.ts | Original comparisons lacked Number.isInteger; R2 test now passes | confirmed | 2 | 3 | 6 | Guard integer inputs and add regression test | Student | R2 test and full suite |
| R3 | Reliability | Missing UI reset → stale result shown after edit → misleading availability | app/src/App.tsx | Earlier handlers did not clear result | confirmed | 2 | 2 | 4 | Reset result and error on form changes | Student | Manual UI change-and-recheck |
| R4 | Correctness | Room flag omitted → blocked room may appear free → wrong result | app/src/App.tsx | Earlier call passed only checkbox | confirmed | 2 | 2 | 4 | Pass checkbox OR room blocked | Student | Inspect check() and add UI test later |
| R5 | Agent operations | Missing script → agent runs test:unit → cannot verify patch | missing: npm run test:unit | Original playbook command missing in package.json | confirmed | 2 | 2 | 4 | Use npx vitest run in playbook | Student | npm script list and A3 |
| R6 | Maintainability | No formatter or linter → inconsistent edits → harder review | missing: lint and formatter | package.json has neither tool | plausible | 2 | 2 | 4 | Add tools in later maintenance work | Student | Readiness 1a and 1b |
| R7 | Privacy | Real timetable request → real schedule copied → data exposure | app/AGENTS.md | Original playbook requested real KBTU timetable | plausible | 1 | 3 | 3 | Keep fictional room and bookings | Student | C1 and code review |

### 4.2 The top two for action

1. **R1** — Score 3 × 3 = 9: the original agent playbook explicitly allowed a production deploy and adding an external Supabase service, despite the offline scope.
2. **R2** — Score 2 × 3 = 6: baseline booking.ts did not enforce integer-minute inputs; the new R2 test demonstrates the intended rejection after the fix.

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No prettier dependency or config in app/ |
| 1b | Linter | no | No eslint dependency or config; npm run lint missing |
| 1c | Type checks | yes | app/tsconfig.json and TypeScript dependency; npm run build uses tsc |
| 1d | Unit tests | yes | app/src/booking.test.ts and vitest dependency |
| 1e | Pinned dependencies (lockfile) | yes | app/package-lock.json |
| 2a | `.env.example` | no | No app/.env.example; app does not use external credentials |
| 2b | Architecture notes | no | No app/README.md; AGENTS.md describes basic file roles but not a separate architecture note |
| 2c | `AGENTS.md` | yes | app/AGENTS.md |
| 3a | CI | no | No app/.github/workflows/ |
| 3b | Pre-commit hooks | no | No Husky or pre-commit configuration |
| 3c | Integration checks | no | Only pure booking unit tests, no UI integration test |
| 3d | Reviewable evidence | no | No PR template or CI artifact in app/ |

### 5.2 The level and the gaps

**Level:** 0

**Missing evidence for the next level:**
- Level 1 requires four of five rows. Currently 1c, 1d, 1e are present (3/5). Add a formatter configuration for 1a or a linter configuration for 1b to reach 4/5.
- The root week-10/README.md is accurate about the contract and hand-in requirements. The app folder is small and understandable, but lacks its own architecture README and CI automation.

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
[Verbatim external AI reply not present in this ZIP. Non-verbatim summary:]
The reviewer identified the demand for real KBTU room names and timetable, the optional Supabase login and database, the incorrect touching-endpoint overlap rule, missing AC6, no explicit ban on secrets, a Netlify production deployment instruction, no requirement to run passing tests before acceptance, and the nonexistent npm run test:unit command. It suggested a minimal patch and waited for approval.
```

### 6.2 Findings and my decisions

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | Real KBTU timetable | conflicting | approve | Replace with fictional room and bookings to meet C1. |
| 2 | AC4 touching endpoints rejected | conflicting | approve | README AC4 permits touching. |
| 3 | AC6 absent | missing | approve | Restore desktop and mobile feedback acceptance. |
| 4 | `npm run test:unit` | conflicting | approve | Use existing `npx vitest run`. |
| 5 | Supabase login and database | conflicting | approve | No login or database is permitted. |
| 6 | Netlify production deploy | conflicting | approve | External deployment is forbidden. |
| 7 | No secret restriction or test gate | missing | approve | Add no-secrets and tests-before-acceptance rules. |
| 8 | Broad file editing permission | potentially risky | modify | Keep current permissions but require review before acceptance. |

### 6.3 The approved patch

Diff of original supplied playbook against the patched file. **This is a reconstructed comparison, not an archived Git diff.**

```diff
--- a/app/AGENTS.md
+++ b/app/AGENTS.md
@@ -9,30 +9,31 @@
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with fictional bookings; never use real personal data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings touching only at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npx vitest run`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add login, a database, or external production services.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Never introduce secrets or deploy externally; run tests before proposing acceptance.
```

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R2**. The R2 test was added to the delivered app after the fix. **No genuine pre-fix failing terminal output is available.** Do not treat the passing final run as evidence of a red-green test sequence.

```text
NOT RUN / NOT PRESERVED: no pre-fix failing Vitest output available.
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1280 px (target; not yet checked) | Availability and validation feedback after editing times | Not yet manually verified | `evidence/ui-desktop.png` (missing) |
| Mobile | 390 px (target; not yet checked) | Layout, input accessibility and feedback | Not yet manually verified | `evidence/ui-mobile.png` (missing) |

### 7.3 Tests and checks I did not run

- A true pre-fix failing R2 regression run was not recorded; only the final green run is available.
- Manual desktop and mobile browser checks and screenshots are still pending.
- No end-to-end or integration test suite exists in this app; no lint script exists.
- `npm audit` remediation was not performed; earlier npm install reported six dependency advisories.

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R2

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Disclosure:** The exact refactor prompt is recorded here as the assignment's required prompt; there is **no evidence it was actually sent to the external assistant**. The code fix was prepared in a later assistant-assisted patch.

**Problem → pattern → benefit:** The original pure `canBook` function accepted fractional minutes. A small input-validation guard was added inside the existing pure function, with no new dependency or unnecessary Strategy or Adapter pattern. This keeps the interface stable and makes invalid input rejection explicit; the R2 regression test now passes.

**What I rejected from the agent's patch, and why:** No separate recorded rejected patch exists. The final edit kept the function signature and avoided new dependencies.

The diff I approved (`git diff`):

```diff
--- a/app/src/booking.ts
+++ b/app/src/booking.ts
@@
 }: BookingInput): boolean {
-  if (!(0 <= start && start < end && end <= 1440)) return false;
+  if (![start, end, now].every(Number.isInteger)) return false;
+  if (!(0 <= now && now <= 1440)) return false;
+  if (!(0 <= start && start < end && end <= 1440)) return false;
```

Also added `R2 AC1: fractional minutes are rejected` to `src/booking.test.ts`. This diff is a comparison based on earlier baseline content, not a captured Git diff.

### 8.2 The second mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit line. Otherwise leave both empty.

```text
Not applicable: the refactor is documented in section 8.1.
```

**Problem → pattern → benefit:** The original agent playbook authorized out-of-scope operations. A minimal instruction-only patch replaced unsafe commands and policies; it did not require a design pattern or change the booking API.

**What I rejected from the agent's patch, and why:** I did not add a Supabase backend, real student timetable, or Netlify deployment because all contradict the scope.

The diff I approved (`git diff`):

```diff
--- a/app/AGENTS.md
+++ b/app/AGENTS.md
@@ -9,30 +9,31 @@
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with fictional bookings; never use real personal data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings touching only at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npx vitest run`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add login, a database, or external production services.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Never introduce secrets or deploy externally; run tests before proposing acceptance.
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R2 | 2 | 3 | 6 | 1 | 3 | 3 | Integer guard and passing R2 test; missing red-phase log remains an evidence gap |
| R1 | 3 | 3 | 9 | 1 | 3 | 3 | Patched AGENTS.md passes A1-A3 and C1-C6; an agent can still disregard instructions |

### 8.4 The final run

The following is copied from the user's actual Mac terminal run after installing the patched ZIP:

```text
> smart-campus-availability@0.0.0 test
> vitest run

 RUN  v2.1.9 /Users/isma/Desktop/se-practice/week-10/app

 ✓ src/booking.test.ts (20)
   ✓ canBook validation and booking logic (20)
     ✓ T01 - 660–720 (touching after)
     ✓ T02 - 540–570 (starts now)
     ✓ T03 - 720–720 (zero duration)
     ✓ T04 - 750–720 (reversed)
     ✓ T05 - 1380–1441 (past day end)
     ✓ T06 - 720–840 (120 minutes)
     ✓ T07 - 720–841 (121 minutes)
     ✓ T08 - 570–600 (touching before)
     ✓ T09 - 630–690 (partial overlap)
     ✓ T10 - 570–690 (contains booking)
     ✓ T11 - 615–645 (inside booking)
     ✓ T12 - 600–660 (identical interval)
     ✓ T13 - 660–720, blocked = true
     ✓ T14 - 630–690, bookings = []
     ✓ AC5 - 660–720, compare bookings before and after
     ✓ X1 - 1320–1440
     ✓ X2 - 0–60, now = 540
     ✓ X3 - request overlaps the second of multiple bookings
     ✓ X4 - reversed existing booking does not overlap 660–720
     ✓ R2 AC1: fractional minutes are rejected

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  12:44:17
   Duration  210ms (transform 19ms, setup 0ms, collect 16ms, tests 2ms, environment 0ms, prepare 39ms)
```

The same terminal run reported `npm run build` passing: `tsc && vite build`, 32 modules transformed, build completed in 226ms.

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

| Rule | What I require |
| --- | --- |
| Isolation | Work on a separate Git branch from the current week-10 checkpoint; never rewrite main or other course branches. |
| Permitted files | Only modify week-10/app/src/booking.ts, booking.test.ts and App.tsx when the approved risk requires it. |
| Commands | Run npm test, npx vitest run and npm run build in week-10/app before proposing changes. |
| Prohibited actions | Never deploy externally, add real KBTU data, create a database, add login or commit secrets. |
| Required evidence | Attach the exact test and build output, a narrow Git diff and the associated risk ID. |
| Before merging or deploying | Wait for my review of the diff and all green tests; deployment is explicitly prohibited. |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

The clean archive checker run returned 27 PASS, 2 FAIL, 2 ERROR. The remaining issues are real evidence gaps, not hidden failures.

| Check | Why it stays |
| --- | --- |
| R1 | Original full pre-change baseline Vitest output was not archived; only a factual 19/19 summary exists. |
| R2 | No actual pre-fix failing run of the R2 regression test was captured. |
| E1 | Desktop browser screenshot has not been supplied. |
| E2 | Mobile browser screenshot has not been supplied. |

The original external AI replies are also not available verbatim, although the format checker accepts the explicitly labelled summaries in sections 2.3, 3.1 and 6.1. They should be replaced with genuine replies if recoverable.

---

## 10. Release decision and conclusion

**Decision:** CONDITIONAL

R1 was a high-priority agent-operations risk because the original instructions encouraged production deployment and adding an unnecessary database. The revised AGENTS.md prohibits these actions and passes the provided constraint checks. R2 was a correctness risk: the original booking logic accepted fractional minutes, while the current implementation rejects them and all 20 unit tests pass. Both residual scores are now 3, but the release is conditional rather than unconditional. A genuine failing test run before the R2 fix was not preserved, and the desktop and mobile screenshots have not been supplied. There are also no automated UI integration tests or CI checks. I would allow further local review, but I would not approve external deployment or final acceptance until the remaining evidence gaps are addressed.

