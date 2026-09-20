# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Ismatulla Dulat
**Group:** Monday 16:00-19:00
**Date:** 20.09.2026

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | Gemini |
| Exact model name | Gemini 3.6 Flash |
| Implementation language | Python 3.14.4 |
| Date of the runs | 20.09.2026 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:
n/a — used Python

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):
Write Python code to analyze student marks.



**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. Input format: dictionary `{name: mark}` instead of a list of numbers.
2. Function name: `analyze_student_marks` instead of `analyze_marks`.
3. Empty input returns the string `"No data provided."` instead of raising `ValueError`.
4. Return structure: nested dictionary with `summary` and `student_details`.
5. Key names: `"Average Mark"`, `"Highest Mark"`, `"Pass Rate"` instead of `average`, `highest`, `pass_rate`.
6. Added a letter-grade system (A/B/C/D/F) that was never requested.
7. Added an `if __name__ == "__main__"` block with a worked example and printed table.
8. `pass_rate` is rounded to 1 decimal and returned as a string `"66.7%"`, not a number.

**Questions it should have asked and did not:**

1. Should the input be a list of numbers or a dictionary with student names?
2. What should the function be named and which keys should the returned dictionary use?

**Is the function named `analyze_marks` with the required signature?** No — it is called `analyze_student_marks`.

**First impression before testing** (one sentence — you will compare this with section 6 later):

The output does not match the required signature at all, so the harness cannot even import it.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.


**What B fixed compared to A:**

1. Correct function name and signature `analyze_marks(marks, pass_mark=50)`.
2. Correct return keys: `average`, `highest`, `lowest`, `pass_rate`.
3. Correct validation: `ValueError` for empty list, non-numeric values, and out-of-range values.
4. No extra features (no grades, no CLI, no `__main__` block).

**What B still leaves open:**

1. Rounding rule for `pass_rate` — is it a raw float or rounded? B returned `66.66666666666666`.
2. Whether `average` should also be rounded.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.


**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes |
| decimals | yes |
| custom pass_mark | yes |
| empty list | yes |
| text value | yes (`"eighty"`) |
| below 0 / above 100 | yes (both) |

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes — both give 6/6 PASS.

**Assumptions C stated explicitly before the code:**

C stated that `pass_rate` should be rounded to 2 decimal places, and that all other values should remain unrounded.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):
You are a Python developer.

Implement a function analyze_marks(marks, pass_mark=50) that returns a dictionary
with exactly these four keys: "average", "highest", "lowest", "pass_rate".

Rules:

marks is a list of numeric values (int or float), each between 0 and 100 inclusive.

pass_mark is a number, default 50. A mark passes if it is >= pass_mark.

average = mean of all marks.

highest = maximum mark.

lowest = minimum mark.

pass_rate = (number of passing marks / total marks) * 100, rounded to 2 decimal places.

Do NOT round average, highest, or lowest.

Validation:

If marks is empty, raise ValueError.

If any element is not a number (bool excluded, strings excluded), raise ValueError.

If any element is outside [0, 100], raise ValueError.

Constraints:

Use only the Python standard library. No external libraries.

Do not add a CLI, file I/O, extra features, grade letters, or a main block.

Return only the function, plus a short explanation of any remaining assumptions.


**What I deliberately added that A, B and C did not have:**

1. Explicit rounding rule for `pass_rate` (2 decimal places) and explicit instruction NOT to round the other three values.
2. Explicit exclusion of `bool` and `str` from valid numeric types.
3. Explicit ban on noise: no CLI, no file I/O, no grade letters, no `__main__` block.
4. Exact list of required keys, so the return shape is unambiguous.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**

The spec says `pass_rate 66.67` for case 1, but does not say whether it should be rounded or kept as a raw float. Prompt B returned `66.66666666666666`, which passes only because of the 0.01 tolerance. I resolved it in Prompt D by requiring `round(..., 2)` for `pass_rate` only.

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1–6 | The harness could not import the file: `ERROR: prompt_a.py defines no callable named 'analyze_marks'`. The function was named `analyze_student_marks` and took a dictionary. |

### Pasted terminal output — all four runs

**Prompt A**
ERROR: prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.

**Prompt B**
========================================================================
analyze_marks harness — prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok

case 1 PASS analyze_marks([40, 60, 80], 50)
expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
got : average=60.0, highest=80.0, lowest=40.0, pass_rate=66.66666666666666

case 2 PASS analyze_marks([100], 50)
expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
got : average=100.0, highest=100.0, lowest=100.0, pass_rate=100.0

case 3 PASS analyze_marks([49.5, 50], 50)
expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
got : average=49.75, highest=50.0, lowest=49.5, pass_rate=50.0

case 4 PASS analyze_marks([], 50)
expect: ValueError
got : raised ValueError: The marks list cannot be empty.

case 5 PASS analyze_marks([40, '60'], 50)
expect: ValueError
got : raised ValueError: Invalid value '60'. All marks must be numeric.

case 6 PASS analyze_marks([-1, 50, 101], 50)
expect: ValueError
got : raised ValueError: Mark '-1' is out of range. Marks must be between 0 and 100.

RESULT 6 PASS · 0 FAIL · 0 ERROR (prompt_b.py)
========================================================================

**Prompt C**
Single mark test:
{'average': 75.0, 'highest': 75.0, 'lowest': 75.0, 'pass_rate': 100.0}

Decimals test:
{'average': 65.5, 'highest': 88.7, 'lowest': 45.5, 'pass_rate': 66.67}

Custom pass_mark (pass_mark=70):
{'average': 60.0, 'highest': 80.0, 'lowest': 40.0, 'pass_rate': 33.33}

Empty list test:
Caught expected error: The marks list cannot be empty.

Text value test:
Caught expected error: Invalid non-numeric value found: eighty

6a. Mark below 0 test:
Caught expected error: Mark out of range [0, 100]: -5

6b. Mark above 100 test:
Caught expected error: Mark out of range [0, 100]: 105
========================================================================
analyze_marks harness — prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok

case 1 PASS analyze_marks([40, 60, 80], 50)
expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
got : average=60.0, highest=80.0, lowest=40.0, pass_rate=66.67

case 2 PASS analyze_marks([100], 50)
expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
got : average=100.0, highest=100.0, lowest=100.0, pass_rate=100.0

case 3 PASS analyze_marks([49.5, 50], 50)
expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
got : average=49.75, highest=50.0, lowest=49.5, pass_rate=50.0

case 4 PASS analyze_marks([], 50)
expect: ValueError
got : raised ValueError: The marks list cannot be empty.

case 5 PASS analyze_marks([40, '60'], 50)
expect: ValueError
got : raised ValueError: Invalid non-numeric value found: 60

case 6 PASS analyze_marks([-1, 50, 101], 50)
expect: ValueError
got : raised ValueError: Mark out of range [0, 100]: -1

RESULT 6 PASS · 0 FAIL · 0 ERROR (prompt_c.py)
========================================================================


**Prompt D**
========================================================================
analyze_marks harness — prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok

case 1 PASS analyze_marks([40, 60, 80], 50)
expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
got : average=60.0, highest=80, lowest=40, pass_rate=66.67

case 2 PASS analyze_marks([100], 50)
expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
got : average=100.0, highest=100.0, lowest=100.0, pass_rate=100.0

case 3 PASS analyze_marks([49.5, 50], 50)
expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
got : average=49.75, highest=50.0, lowest=49.5, pass_rate=50.0

case 4 PASS analyze_marks([], 50)
expect: ValueError
got : raised ValueError: The marks list cannot be empty.

case 5 PASS analyze_marks([40, '60'], 50)
expect: ValueError
got : raised ValueError: Invalid element type str: expected int or float.

case 6 PASS analyze_marks([-1, 50, 101], 50)
expect: ValueError
got : raised ValueError: Mark -1 is out of the valid range [0, 100].

RESULT 6 PASS · 0 FAIL · 0 ERROR (prompt_d.py)
========================================================================


---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 0 | 2 | 0 |
| Assumptions stated | 0 | 1 | 2 | 2 |
| Noise (2 = none) | 0 | 2 | 1 | 2 |
| **Total / 10** | 0 | 7 | 9 | 8 |

**Prompt length, in words:** A 7 · B 52 · C 79 · D 118

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

B added 45 words and gained 7 points (6.4 words/point). C added 27 words and gained 2 points (13.5 words/point). D added 39 words but lost 1 point versus C because D dropped the required tests. The marginal value of extra words drops sharply after B.

---

## 8. Conclusion — 150–200 words
Prompt B is the best prompt by the score (7/10, tied with C on correctness and requirement coverage but without C's noise). Prompt C scored highest overall (9/10) because it added self-tests, but those tests were written by the same AI that wrote the code, so they verify nothing the harness does not already check. At work I would use Prompt D, because it is the only prompt that explicitly resolves the rounding ambiguity.

The single addition that bought the most correctness was the explicit function name and return keys in Prompt B. In Prompt A the function was called analyze_student_marks, so the harness could not even import it — all six cases were ERROR. Naming the function and the four keys moved the score from 0/6 to 6/6 without changing any logic.

Prompt C's added self-tests were partly noise: they duplicated coverage that the harness already provides.

The ambiguity I found was the rounding of pass_rate. The spec asks for 66.67 but does not say whether to round. Prompt B returned 66.66666666666666; Prompt D fixed this by requiring round(..., 2) only on pass_rate, and explicitly forbidding rounding on the other three values.


**Word count:** 189

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. If the model writes its own tests, and those tests pass, why is that not evidence that the code is correct?
2. Prompt C and Prompt D both pass all six cases — which one is actually better engineering practice, and why?