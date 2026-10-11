# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.10

---

## 1. Scenario

**Question:** What practical safeguards does a drone-based building inspection service need so it does not endanger people, intrude on residents' privacy, and leaves a clear trail when something goes wrong?

**Users:** Drone pilots employed by the inspection company; structural engineers who look at the footage; people living in the buildings next door; the city aviation office that issues flight permits.

**Problem:** A small inspection firm, SkyInspect KZ (fictional), wants to check façades of tall buildings with a drone instead of sending climbers. The drone circles the building, records video, uploads it to a cloud bucket, and a detection model marks possible cracks. The firm saves money and nobody hangs off a rope. The catch: residents in nearby blocks say the drone can see into their windows, and if the drone falls, it lands on a street where people walk.

**Constraints:** (1) Flights must follow the fictional City Drone Regulation 2026, which bans filming private windows without written consent. (2) The drone must keep at least 5 m from any residential window, for both collision and privacy reasons.

**Risk:** If the navigation unit fails or the radio link drops, the drone can fall onto a pedestrian area or drift uncontrolled along a wall of windows, hurting someone and leaking private footage.

**Assumptions:** SkyInspect KZ, CloudSecure KZ, CrackDetect AI, City Drone Regulation 2026, and the City Aviation Department are invented for this assignment. All data is assumed stored in a fictional cloud.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

(write here)

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

(write here)

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

(write here)

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

(write here)

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- (write here)

## 7. Appendix A — Initial outline

<!-- Written BEFORE you run Prompt A. Five points, your own words, numbered. These are the
     "five points" you paste into Prompt A. -->

1. Set hard geofences so the drone physically cannot enter a no-fly buffer around windows.
2. Give the pilot a kill switch that still works when the control link is lost.
3. Blur or block residential windows on the drone itself, before any footage is uploaded.
4. Keep a flight log — position, time, pilot ID — so any incident can be reconstructed.
5. Tell residents about planned flights in advance and explain what is recorded.

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** contextual draft

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

### B2 — Critique (Prompt B)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** critical review of the draft

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

### B3 — Revision (Prompt C)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |
