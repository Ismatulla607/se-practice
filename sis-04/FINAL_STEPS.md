# SIS-04: final steps on your Mac

This folder contains the updated application, 28 Vitest tests, report, architecture diagrams and submission preparation. **It is not yet submitted.** No real screenshots were present in the uploaded archive. The final 28-test run must be executed on your machine.

## 1. Put files into the existing Git branch

Do **not** delete the entire `se-practice` repository: it contains your baseline and analysis commits. Confirm your branch first:

```bash
cd ~/Desktop/se-practice
git branch --show-current
```

It must print `sis-04`. Extract the downloaded ZIP and **copy the contents of its `sis-04/` folder into the existing `~/Desktop/se-practice/sis-04/` folder** (replace files when asked). Keep the original `.git` folder in `se-practice` unchanged.

## 2. Run the app and capture FIVE real screenshots

```bash
cd ~/Desktop/se-practice/sis-04/app
npm ci
npm run dev
```

Open the local Vite URL (usually `http://localhost:5173/`) in Chrome. Save the following real screenshots to `~/Desktop/se-practice/sis-04/evidence/` with **exact** filenames:

1. `filter-match.png`: attendees **20**; check **Projector** and **Whiteboard**; show A-101 and C-305 as matching.
2. `filter-empty.png`: attendees **31**, select **Computers**; show the no-matching-rooms message.
3. `switch-a.png`: clear equipment; attendees **1**; select **A-101**; current **09:00**, start **10:30**, end **11:30**; click Check; screenshot **Unavailable**.
4. `switch-b.png`: keep **exactly the same times**, change room to **B-204**; click Check again; screenshot **Available**.
5. `narrow.png`: Chrome DevTools → device toolbar → set width **375 px**, portrait; screenshot the usable form.

You can take a Mac screenshot with `Cmd+Shift+4`, then rename/move it to `evidence/`. Do not rename unrelated photos or create simulated screenshots.

## 3. Generate REAL test evidence and validate

Stop the dev server with Ctrl+C, then:

```bash
cd ~/Desktop/se-practice/sis-04
python3 finish_local.py
python3 tests/check_sis.py
```

The helper runs `npx vitest run` and `npm run build`, pastes actual output into `report.md`, and updates checker counts. After the five screenshots exist, rerun `python3 finish_local.py` so the checker counts reflect them. **Aim for 33 PASS / 0 FAIL / 0 ERROR**.

## 4. Personal declaration (required)

Open `submission.yml`. Fill in your **real** university-registered name, student ID and group. Confirm GitHub username, then inspect `review_findings` and the four `honesty` answers. Do not claim `yes` unless true. In `AI_USAGE.md`, sign with your name and review the honesty declarations. **Rewrite/personalize the draft reflection in report.md §10 in your own words (200–300 words).** Check the 3 AI exchange excerpts against the chat and adjust any wording that is not exact.

## 5. Git commits and final declaration

From repository root:

```bash
cd ~/Desktop/se-practice
git status
git add sis-04/
git commit -m "sis-04: room catalog tests refactoring and evidence"
git rev-parse --short HEAD
```

Put that **actual** hash into `sis-04/submission.yml` → `checker.commit`. Run:

```bash
cd sis-04
python3 tests/check_sis.py
python3 tests/validate_submission.py
```

Fix all unexpected errors. Then:

```bash
cd ~/Desktop/se-practice
git add sis-04/submission.yml sis-04/report.md sis-04/AI_USAGE.md
git commit -m "sis-04: final submission declaration"
git push -u origin sis-04
```

Create a GitHub PR from `sis-04` to `main`, title `SIS 04 - Room catalog and refactoring - <Surname Name>`, use the five description sections in `sis-04/SETUP.md` if present (otherwise check the original assignment archive for it), **leave the PR OPEN**, and submit **the PR URL** through Teams → Add work → Link. Deadline: 22 November 2026 23:59 Almaty.
