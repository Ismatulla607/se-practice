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

- **Tool:** Gemini (web)
- **Model:** Gemini 3
- **Date:** 2026-10-11
- **Purpose:** contextual draft

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.10 (Software-controlled drones) for a first-year-level university assignment.

My scenario is: Users are drone pilots employed by an inspection company, structural engineers who look at the footage, people living in the buildings next door, and the city aviation office that issues flight permits. The problem: a small inspection firm, SkyInspect KZ (fictional), wants to check façades of tall buildings with a drone instead of sending climbers. The drone circles the building, records video, uploads it to a cloud bucket, and a detection model marks possible cracks. The firm saves money and nobody hangs off a rope. The catch: residents in nearby blocks say the drone can see into their windows, and if the drone falls, it lands on a street where people walk. Two constraints: (1) flights must follow the fictional City Drone Regulation 2026, which bans filming private windows without written consent; (2) the drone must keep at least 5 m from any residential window, for both collision and privacy reasons. One risk: if the navigation unit fails or the radio link drops, the drone can fall onto a pedestrian area or drift uncontrolled along a wall of windows, hurting someone and leaking private footage. My initial ideas are: (1) Set hard geofences so the drone physically cannot enter a no-fly buffer around windows. (2) Give the pilot a kill switch that still works when the control link is lost. (3) Blur or block residential windows on the drone itself, before any footage is uploaded. (4) Keep a flight log — position, time, pilot ID — so any incident can be reconstructed. (5) Tell residents about planned flights in advance and explain what is recorded. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```As your software engineering tutor, I have reviewed your scenario for Topic 1.10. You have framed a realistic and well-scoped socio-technical problem that bridges software architecture, safety-critical systems, and regulatory compliance.

Below is a 400–500 word professional explanation draft incorporating your scenario details, followed by an analysis of facts versus assumptions, key trade-offs, and verification claims.

---

### Part 1: System Explanation Draft

SkyInspect KZ is modernizing urban building maintenance by replacing traditional rope-access climbers with software-controlled drones for exterior façade inspections. In this operational workflow, autonomous or semi-autonomous drones circle tall buildings to capture high-resolution video footage. This data is subsequently uploaded to a cloud storage bucket, where an automated detection model identifies structural cracks and anomalies. While this approach significantly reduces labor expenses and eliminates the physical dangers associated with workers hanging from ropes, it introduces complex safety, privacy, and regulatory hurdles.

Operating in dense urban environments creates immediate operational friction. The primary constraints are shaped by the fictional City Drone Regulation 2026, which bans filming private windows without explicit written consent, and a strict internal engineering requirement that the drone maintain at least a 5-meter buffer from all residential windows. Major operational risks include navigation unit failures or radio link drops, which could cause the aircraft to drift uncontrollably along glass façades or crash into pedestrian areas below.

To mitigate these risks, the engineering team has proposed five foundational strategies:

1. **Hardware-Enforced Geofencing:** Establish virtual boundaries using onboard software to physically prevent the drone from breaching the 5-meter no-fly buffer around windows.
2. **Autonomous Failsafes and Redundant Cut-offs:** Ensure the drone can safely execute a controlled landing or trigger a Return-to-Home protocol even if the primary control link is severed.
3. **Onboard Privacy Masking:** Utilize edge computing to blur or redact private windows directly on the drone *before* any video stream leaves the device for cloud storage.
4. **Immutable Flight Logging:** Record timestamps, precise coordinates, and operator IDs to ensure full accountability and simplify post-incident audits.
5. **Proactive Resident Notification:** Build community trust by communicating flight schedules and data collection scopes ahead of time.

Successfully deploying this system requires navigating difficult design trade-offs between processing power, battery weight, and regulatory compliance. By addressing privacy and safety at the software architecture level, SkyInspect KZ can protect pedestrians, respect resident resident privacy, and satisfy municipal aviation authorities. *(387 words)*

---

### Part 2: Fact vs. Assumption Breakdown

* **Facts (Givens from your scenario):**
* SkyInspect KZ is a fictional small inspection firm.
* City Drone Regulation 2026 bans filming private windows without written consent.
* Internal constraint requires keeping at least a 5-meter buffer from residential windows.
* Technical risks include navigation failure, radio link loss, pedestrian safety hazards, and privacy leaks.


* **Assumptions (Implicit or unverified claims in your initial ideas):**
* *Assumption on Kill Switches:* Assuming a standard remote "kill switch" can work independently when the control link is lost (ignoring that a lost link means standard radio commands cannot reach the drone; a failsafe must instead rely on an autonomous loss-of-link protocol or a secondary cellular/satellite link).
* *Assumption on GPS Reliability:* Assuming standard GPS/GNSS is accurate enough to maintain a strict 5-meter geofence in an urban canyon surrounded by glass and concrete.
* *Assumption on Edge Compute:* Assuming the drone's onboard hardware has enough processing power and battery capacity to run real-time video masking/blurring without severely reducing flight times.



---

### Part 3: Trade-offs Analysis

1. **Geofence Strictness vs. Inspection Coverage:**
* *Trade-off:* Setting a hard 5-meter buffer keeps residents private and reduces collision risks, but it may prevent the camera from getting close enough to detect micro-cracks on recessed architectural features or window frames.


2. **Onboard Real-time Blurring vs. Payload & Battery Life:**
* *Trade-off:* Processing video locally on an edge computing module (like a lightweight AI chip) protects privacy before cloud upload, but it adds weight, increases power draw, and shortens flight times per battery charge.


3. **Autonomous Failsafes vs. Unpredictable Urban Drift:**
* *Trade-off:* Programming the drone to automatically return home upon losing a signal is safe in open fields, but in a narrow urban courtyard, blind autonomous movement could cause it to collide with balconies or building facades.



---

### Part 4: Claims to Verify

Before finalizing your assignment submission, you should verify or address these technical details:

* **The Kill Switch Paradox:** Clarify how a kill switch functions during a radio link drop. (Does it rely on a cellular 4G/5G backup network, or is it an autonomous watchdog timer?)
* **Urban GPS Multipath Error:** Investigate how tall reflective buildings degrade GPS signals and whether optical flow or LiDAR sensors are required for precise 5-meter positioning.
* **Legal Compliance of Redaction:** Check if processing raw video through volatile memory on the drone to blur windows technically violates regulations that ban "filming" private windows, or if zero-latency hardware masking is legally sufficient.
```

### B2 — Critique (Prompt B)

- **Tool:** Gemini (web)
- **Model:** Gemini 3
- **Date:** 2026-10-11
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: What practical safeguards does a drone-based building inspection service need so it does not endanger people, intrude on residents' privacy, and leaves a clear trail when something goes wrong?.
Scenario: Users are drone pilots employed by an inspection company, structural engineers who look at the footage, people living in the buildings next door, and the city aviation office that issues flight permits. The problem: a small inspection firm, SkyInspect KZ (fictional), wants to check façades of tall buildings with a drone instead of sending climbers. The drone circles the building, records video, uploads it to a cloud bucket, and a detection model marks possible cracks. The firm saves money and nobody hangs off a rope. The catch: residents in nearby blocks say the drone can see into their windows, and if the drone falls, it lands on a street where people walk. Two constraints: (1) flights must follow the fictional City Drone Regulation 2026, which bans filming private windows without written consent; (2) the drone must keep at least 5 m from any residential window, for both collision and privacy reasons. One risk: if the navigation unit fails or the radio link drops, the drone can fall onto a pedestrian area or drift uncontrolled along a wall of windows, hurting someone and leaking private footage. Draft: As your software engineering tutor, I have reviewed your scenario for Topic 1.10. You have framed a realistic and well-scoped socio-technical problem that bridges software architecture, safety-critical systems, and regulatory compliance.

Below is a 400–500 word professional explanation draft incorporating your scenario details, followed by an analysis of facts versus assumptions, key trade-offs, and verification claims.

---

### Part 1: System Explanation Draft

SkyInspect KZ is modernizing urban building maintenance by replacing traditional rope-access climbers with software-controlled drones for exterior façade inspections. In this operational workflow, autonomous or semi-autonomous drones circle tall buildings to capture high-resolution video footage. This data is subsequently uploaded to a cloud storage bucket, where an automated detection model identifies structural cracks and anomalies. While this approach significantly reduces labor expenses and eliminates the physical dangers associated with workers hanging from ropes, it introduces complex safety, privacy, and regulatory hurdles.

Operating in dense urban environments creates immediate operational friction. The primary constraints are shaped by the fictional City Drone Regulation 2026, which bans filming private windows without explicit written consent, and a strict internal engineering requirement that the drone maintain at least a 5-meter buffer from all residential windows. Major operational risks include navigation unit failures or radio link drops, which could cause the aircraft to drift uncontrollably along glass façades or crash into pedestrian areas below.

To mitigate these risks, the engineering team has proposed five foundational strategies:

1. **Hardware-Enforced Geofencing:** Establish virtual boundaries using onboard software to physically prevent the drone from breaching the 5-meter no-fly buffer around windows.
2. **Autonomous Failsafes and Redundant Cut-offs:** Ensure the drone can safely execute a controlled landing or trigger a Return-to-Home protocol even if the primary control link is severed.
3. **Onboard Privacy Masking:** Utilize edge computing to blur or redact private windows directly on the drone *before* any video stream leaves the device for cloud storage.
4. **Immutable Flight Logging:** Record timestamps, precise coordinates, and operator IDs to ensure full accountability and simplify post-incident audits.
5. **Proactive Resident Notification:** Build community trust by communicating flight schedules and data collection scopes ahead of time.

Successfully deploying this system requires navigating difficult design trade-offs between processing power, battery weight, and regulatory compliance. By addressing privacy and safety at the software architecture level, SkyInspect KZ can protect pedestrians, respect resident resident privacy, and satisfy municipal aviation authorities. *(387 words)*

---

### Part 2: Fact vs. Assumption Breakdown

* **Facts (Givens from your scenario):**
* SkyInspect KZ is a fictional small inspection firm.
* City Drone Regulation 2026 bans filming private windows without written consent.
* Internal constraint requires keeping at least a 5-meter buffer from residential windows.
* Technical risks include navigation failure, radio link loss, pedestrian safety hazards, and privacy leaks.


* **Assumptions (Implicit or unverified claims in your initial ideas):**
* *Assumption on Kill Switches:* Assuming a standard remote "kill switch" can work independently when the control link is lost (ignoring that a lost link means standard radio commands cannot reach the drone; a failsafe must instead rely on an autonomous loss-of-link protocol or a secondary cellular/satellite link).
* *Assumption on GPS Reliability:* Assuming standard GPS/GNSS is accurate enough to maintain a strict 5-meter geofence in an urban canyon surrounded by glass and concrete.
* *Assumption on Edge Compute:* Assuming the drone's onboard hardware has enough processing power and battery capacity to run real-time video masking/blurring without severely reducing flight times.



---

### Part 3: Trade-offs Analysis

1. **Geofence Strictness vs. Inspection Coverage:**
* *Trade-off:* Setting a hard 5-meter buffer keeps residents private and reduces collision risks, but it may prevent the camera from getting close enough to detect micro-cracks on recessed architectural features or window frames.


2. **Onboard Real-time Blurring vs. Payload & Battery Life:**
* *Trade-off:* Processing video locally on an edge computing module (like a lightweight AI chip) protects privacy before cloud upload, but it adds weight, increases power draw, and shortens flight times per battery charge.


3. **Autonomous Failsafes vs. Unpredictable Urban Drift:**
* *Trade-off:* Programming the drone to automatically return home upon losing a signal is safe in open fields, but in a narrow urban courtyard, blind autonomous movement could cause it to collide with balconies or building facades.



---

### Part 4: Claims to Verify

Before finalizing your assignment submission, you should verify or address these technical details:

* **The Kill Switch Paradox:** Clarify how a kill switch functions during a radio link drop. (Does it rely on a cellular 4G/5G backup network, or is it an autonomous watchdog timer?)
* **Urban GPS Multipath Error:** Investigate how tall reflective buildings degrade GPS signals and whether optical flow or LiDAR sensors are required for precise 5-meter positioning.
* **Legal Compliance of Redaction:** Check if processing raw video through volatile memory on the drone to blur windows technically violates regulations that ban "filming" private windows, or if zero-latency hardware masking is legally sufficient..
```

**Response:**

```Here is a critical review of your draft against your specific question, scenario constraints, and risks.

---

### 1. The Audit Trail Gap: Flight Logs vs. Data Leak Forensics

* **Why it matters:** Your question specifically asks for safeguards that leave a **clear trail when something goes wrong**, particularly if a privacy leak or crash occurs. Your draft lists "Immutable Flight Logging" (timestamps, coordinates, operator IDs), but this only covers *flight movement*. If a resident claims their window was filmed and leaked to the cloud, flight logs do not prove what the camera captured, how the data was handled in transit, or who accessed the cloud bucket.
* **How to check it:** Review your threat model by asking: *"If a city auditor or police officer subpoenas our records after a privacy complaint, can we prove with cryptographic certainty what the camera saw and who accessed it?"* Check if your cloud storage architecture includes end-to-end encryption, write-once-read-many (WORM) storage, and identity-access audit logs.
* **Counterexample / Alternative Interpretation:** Instead of relying solely on software flight logs, an alternative approach is a cryptographically secured "data ledger" (or tamper-evident hardware black-box on the drone) that records a cryptographic hash of every video frame alongside sensor telemetry, allowing auditors to verify data integrity without exposing raw private footage.

### 2. The GPS Multipath Illusion vs. The 5-Meter Geofence

* **Why it matters:** The draft assumes "Hardware-Enforced Geofencing" can reliably enforce the strict 5-meter window buffer. However, in dense urban canyons surrounded by glass, steel, and concrete, standard consumer or commercial GPS/GNSS suffers from severe **multipath errors** (where satellite signals bounce off buildings, causing location errors of 10 to 20 meters). If the drone thinks it is 6 meters away when it is actually 3 meters away, it violates the regulation and risks a collision.
* **How to check it:** Investigate technical specifications for urban drone localization. Research how GNSS signal degradation behaves near high-rise façades and check whether standard GPS is sufficient or if redundant localization (such as RTK-GPS, onboard LiDAR, or computer vision-based optical flow) is required.
* **Counterexample / Alternative Interpretation:** Instead of relying on absolute GPS coordinates for the geofence, the system could rely on relative positioning—using onboard LiDAR or depth cameras to constantly measure the physical distance between the drone and the building facade in real time, ignoring GPS coordinates entirely for proximity enforcement.

### 3. Legal Compliance of Edge AI Blurring vs. The Definition of "Filming"

* **Why it matters:** The draft suggests using edge computing to blur or redact private windows *before* the video leaves the device. However, City Drone Regulation 2026 bans **filming** private windows without written consent. Legally, if the camera sensor captures raw, unredacted pixels into the drone’s volatile frame buffer—even for a millisecond before the AI chip processes and blurs them—a strict legal interpretation of "filming" may have already been violated.
* **How to check it:** Check the legal definitions of electronic surveillance and recording in local aviation and privacy statutes. Determine whether capturing raw frames into memory constitutes "recording/filming" under the law.
* **Counterexample / Alternative Interpretation:** Rather than software-based post-processing or AI blurring, an alternative compliance mechanism is **hardware-level sensor masking** (e.g., using pre-programmed 3D building CAD boundaries to mechanically or electronically blank out pixel sensors or shut off the video pipeline the moment the drone's line-of-sight intersects a window zone).

### 4. Integration Gap with the City Aviation Office

* **Why it matters:** Your scenario explicitly includes the **city aviation office** that issues flight permits, but your draft's five strategies focus entirely on internal engineering controls (geofencing, logging, privacy). The draft misses how the city aviation office verifies compliance or handles incident reporting.
* **How to check it:** Look at how municipal drone permits are typically managed. Ask whether the city requires live telemetry feeds, pre-approved flight corridors, or automated incident notification APIs when a safety or privacy threshold is breached.
* **Counterexample / Alternative Interpretation:** Instead of treating the city aviation office as a passive entity that only issues permits upfront, the architecture could include an automated compliance API that streams proof-of-compliance logs (demonstrating that the drone never breached the 5-meter buffer) directly to the municipal authority after every flight.
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
