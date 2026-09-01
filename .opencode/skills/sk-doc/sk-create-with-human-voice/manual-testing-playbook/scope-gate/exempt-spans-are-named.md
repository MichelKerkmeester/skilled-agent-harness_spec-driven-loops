---
title: "HVS-001 -- Every exempt span is named in the report"
description: "This scenario validates the scope gate for `HVS-001`. It confirms the gate runs before the first finding and that each declined span is named in the report with its class and its reason."
stage: routing
version: 1.0.0.0
---

# HVS-001 -- Every exempt span is named in the report

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HVS-001`.

---

## 1. OVERVIEW

This scenario validates the scope gate for `HVS-001`. It confirms the gate runs before the first finding and that each declined span is named in the report with its class and its reason.

### Why This Matters

Two runs produce the same diff and mean opposite things. One read the quoted paragraph, recognised it as text the document is only carrying and declined it. The other never looked. Nothing in the output tells them apart unless the first one says so.

That record is what stops the same span being re-litigated. Without it the next pass re-flags the quotation, decides again and possibly decides differently. The gate is also cheap to skip and invisible when skipped, which is why it is graded on its own rather than folded into whichever edit followed it. It runs before the first finding on both operations this mode routes, `apply` and `score` alike.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HVS-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the scope gate runs before any finding and that every declined span appears in the report with its class and reason
- Real user request: `Give this document a voice pass. Parts of it are quoted from a vendor's error output, so watch out.`
- Prompt: `Do a voice pass on this file. Some of it is quoted material, so be careful.`
- Expected execution process: `references/scope-and-exemptions.md` loads before any reading for findings, the target is walked once to classify spans against section 3, the exempt spans are written down and only then does the mechanical pass run.
- Expected signals: the report carries one row per exemption, each naming the span, the class from section 3 and the reason. The order is visible in the transcript: classification precedes the first finding.
- Desired user-visible outcome: the user can see which spans were out of bounds and why, so the same spans are not re-decided on the next run.
- Pass/fail: PASS when the gate runs first and every declined span carries a class and a reason. FAIL when the report has no exemption rows on a file that carries quoted material, or when the first finding precedes the classification.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Do a voice pass on this file. Some of it is quoted material, so be careful.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HVS-001 | Every exempt span is named | Verify the scope gate runs before the first finding and that each declined span is recorded with its class and reason | `Do a voice pass on this file. Some of it is quoted material, so be careful.` | 1. `agent: Read references/scope-and-exemptions.md` -> 2. `agent: Walk the target once and classify every span against section 3` -> 3. `agent: Read assets/voice-report-template.md and fill the Scope block` -> 4. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <target>` | Step 1: the gate loads before anything else. Step 2: each carried span is named with its class. Step 3: the Scope block has one row per exemption, each with a reason. Step 4: the mechanical pass runs after the classification, not before | The prompt as typed, the ordered transcript showing classification before the first finding, the filled Scope block, the scanner block and the count of exempt spans against the count of carried spans in the target | PASS when the gate runs first and every declined span carries a class and a reason. FAIL when exemption rows are absent or the first finding precedes the classification | 1. Check the transcript order. A classification written after the findings is a reconstruction, and it usually matches the findings rather than the document. 2. Compare the exemption count against the carried spans in the target. A short list means the walk stopped early. 3. Check each row has a reason rather than only a class. A class with no reason is a label, and the next pass cannot act on it |

### Commands

1. `agent: Read references/scope-and-exemptions.md before reading the target for findings`
2. `agent: Walk the target once and classify every span against section 3`
3. `agent: Read assets/voice-report-template.md and fill the Scope block, one row per exemption`
4. `bash: python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <target>`

### Expected

Step 1 loads the gate, which is the ALWAYS-level resource on every path. Step 2 answers the gate's single question for each span: did this document's author choose these words, and are they free to choose different ones. Step 3 writes the answer down in the shape the report template fixes, one line per exemption carrying the span, the class and the reason. Step 4 runs the mechanical pass, and it runs last, because deciding what may be touched comes before deciding what to change.

### Evidence

Capture the prompt exactly as typed, the ordered transcript proving classification came before the first finding, the filled Scope block with one row per exemption, the scanner block and a count of carried spans in the target set against the count of exemption rows. Record the reason text for each row, since a row with a class and no reason is the common near-miss.

### Pass / Fail

- **Pass**: the gate loads first, every carried span is classified and each exemption row names the span, the class and the reason.
- **Fail**: the report carries no exemption rows on a file with quoted material, the classification appears after the findings or a row names a class with no reason.

### Failure Triage

1. Read the transcript in order. A classification that appears after the findings was reconstructed from them, and a reconstruction agrees with the findings by construction.
2. Count the carried spans in the target and compare against the exemption rows. A gate that walked half the file produces a plausible short list.
3. Read each reason. "Quoted" is a class. "Changing it changes what the vendor's tool printed" is a reason, and only the second survives contact with the next pass.
4. If no rows exist at all, confirm `references/scope-and-exemptions.md` was loaded. Its absence explains every downstream symptom in this scenario.

### Optional Supplemental Checks

Run the same prompt against a target with no carried spans at all. The report should still carry a Scope block, with the exemption row reading `None`. An empty block on a clean target is the same omission as a missing block on a dirty one, and the template treats it that way.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no catalog cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`references/scope-and-exemptions.md`](../../references/scope-and-exemptions.md) | Primary anchor, sections 2, 3 and 6 |
| [`assets/voice-report-template.md`](../../assets/voice-report-template.md) | The Scope block and the row shape an exemption takes |
| [`SKILL.md`](../../SKILL.md) | Section 3 step 1, rule ALWAYS 1 and success criterion 1 |

---

## 5. SOURCE METADATA

- Group: SCOPE GATE
- Playbook ID: HVS-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `scope-gate/exempt-spans-are-named.md`
