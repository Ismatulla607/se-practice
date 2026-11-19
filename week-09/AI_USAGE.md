# AI Usage Disclosure — Week 09

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | GPT-6 / ChatGPT Plus | Helped me draft and refine the JSON Schema, validation rules, and tool definition | tool/check_room.json |
| ChatGPT | GPT-6 / ChatGPT Plus | Helped me draft tool calls and analyze function-calling behavior | calls/, lab-report.md |
| ChatGPT | GPT-6 / ChatGPT Plus | Helped me think through permission decisions, checkpoint strategy, and report structure | lab-report.md |
| ChatGPT | GPT-6 / ChatGPT Plus | Helped me with documentation and submission configuration | AI_USAGE.md, submission.yml |
| ChatGPT | GPT-6 / ChatGPT Plus | Part 2 — function calling for R1, R2, R3 | calls/r1.json, calls/r2.json, calls/r3.txt |

**I wrote `tool/check_room.json` myself:** Yes — I designed the schema and validated it; ChatGPT helped me draft and refine parts of it, and I reviewed and confirmed every constraint (type, required, additionalProperties, minimum, maximum).

**I used an AI to explain a JSON Schema keyword or a check:** Yes — ChatGPT explained type, required, additionalProperties, minimum, and maximum, and I verified each explanation against the checker behavior.

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** Yes — I ran three separate fresh chats for R1–R3, saved the exact model replies, and pasted them verbatim into calls/ and section 4.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** Yes — all checker outputs were captured locally from real runs and pasted without edits.

**Anything I accepted from the AI without fully understanding it:** None. I reviewed every AI suggestion, understood the constraints, and verified the final submission myself.

Signed: Ismatulla Dulat 
Date: 2026-11-18
