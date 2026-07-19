---
title: "PROVENANCE-001 -- Source-Of-Truth Router Card Sorts Each Value"
description: "This scenario validates the source-of-truth router card for PROVENANCE-001. It confirms the fill-in card sorts every value bound for a v3 Style Reference into measured, brief-provided, inferred or absent before writing, so only measured values land in token tables, doubtful values are recorded with their origin, while a brief-only request with no live site is routed out of scope as forward-authoring."
contextType: reference
version: 1.0.0.1
expected_intent: EXTRACT_WRITE
expected_resources:
  - references/design-md-format.md
  - references/writing-style-guide.md
  - references/color-role-taxonomy.md
  - references/component-taxonomy.md
  - references/anti-patterns.md
  - references/authoring-boundary.md
  - references/extraction-workflow.md
  - references/troubleshooting.md
  - assets/design-md-prompt-template.md
  - assets/cardinal-rules-card.md
  - assets/source-of-truth-router-card.md
---

**Exact prompt**

```
Walk through each value in this design system and tell me where it came from before we trust it.
```

# PROVENANCE-001 -- Source-Of-Truth Router Card Sorts Each Value

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `PROVENANCE-001`.

---

## 1. OVERVIEW

This scenario validates the source-of-truth router card for `PROVENANCE-001`. The card is a one-page fill-in tool a writer walks before writing values into a Style Reference. It asks one ordered question per value, and the first yes decides the origin: present in `tokens.json` is measured, stated in the brief is brief-provided, a characterization of a measured value is inferred, while not captured at all is absent. It then routes each origin to its place: measured values into token tables unlabeled, brief-provided values into prose as a stated intent, inferred claims marked `[INFERRED]` with a cited token, absent values stamped or omitted. A doubtful-values table records any value whose origin was not obvious, so the boundary call is on the record. The card carries the same stop check as the boundary reference: a value with no measured token and no honest brief, inferred or absent origin is an invention and is removed.

### Why This Matters

The cardinal rule binds every tabled value to `tokens.json`, but enforcement depends on each value being sorted correctly before it is written. The card makes that sort explicit and repeatable rather than a judgment held in the writer's head. An unlabeled value is a promise it was measured, so if the writer cannot point to its row in `tokens.json`, it does not go in unlabeled. This scenario proves the card actually catches the doubtful values, keeps brief-provided and inferred values out of the token tables and routes a brief-only request with no live site away from this mode instead of loosening fidelity to fit it.

---

## 2. SCENARIO CONTRACT

Operators run the exact steps for `PROVENANCE-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the router card sorts every doubtful value by origin and routes each origin correctly, so no value is fabricated or backfilled
- Real user request: `Walk through each value in this design system and tell me where it came from before we trust it.`
- Prompt: `Walk through each value in this design system and tell me where it came from before we trust it.`
- Expected execution process: take the written Style Reference and `tokens.json`. For each value whose origin is not obvious, walk the card's ordered questions and assign exactly one origin. Confirm measured values trace to a `tokens.json` row, brief-provided values stay in prose, inferred claims carry `[INFERRED]` and cite a measured token, absent values are stamped or omitted. Fill the doubtful-values table with each value, its origin and the token it traces to or the reason it is absent. Run the card's stop check and confirm every box passes
- Expected signals: every token-table value resolves to Measured with a `tokens.json` row. No brief-provided value sits in a token table. Every inference is marked `[INFERRED]` and cites a measured token. Every absent value is stamped or omitted. The doubtful-values table names a real origin for each listed value. The stop check passes
- Desired user-visible outcome: the agent produces a completed origin sort that names, for each doubtful value, whether it is measured (and which token), brief-provided, inferred (and the cited token) or absent, with no value left as an unexplained invention

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Card-driven sorting is read-only and stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Waves 1 (SETUP-001 PASS) and 2 (EXTRACT-001 PASS) must be complete. A faithful v3 Style Reference must exist, written from the Wave 2 tokens.json per the v3 format specification in `references/design-md-format.md`. Load `assets/source-of-truth-router-card.md` as the sorting tool.

1. collect the measured token set: `bash: node -e "const t = require('./<--output>/tokens.json'); console.log('HEX:', t.colorTokens.map(c=>c.hex)); console.log('MAXWIDTH:', t.spacingSystem?.maxContentWidth)"` (run from the repo root)  # -> the measured set the card sorts against
2. sort each doubtful value: for every value whose origin is not obvious, walk the card's ordered questions and assign one origin (measured, brief-provided, inferred or absent)  # -> one origin per value, first yes wins
3. confirm measured values are tabled and traceable: read the Tokens tables and confirm each value resolves to a row in the step 1 set  # -> every tabled value is measured
4. confirm inferred claims are marked and cited: `bash: rg '\[INFERRED\]' <style-reference.md>`  # -> each inference cites the measured token it rests on
5. fill the doubtful-values table from the card: record each value, its origin and the token it traces to or why it is absent  # -> the boundary call is on the record, no row left as an invention
6. run the card's stop check and confirm every box passes  # -> last box confirms this is live-surface extraction, not brief-only forward-authoring

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PROVENANCE-001 | Source-of-truth router card | Verify the card sorts each value into measured, brief-provided, inferred or absent, keeps only measured values in token tables and records the doubtful values with their origin | `Walk through each value in this design system and tell me where it came from before we trust it.` | 1. `read: <--output>/tokens.json` (collect the measured set) -> 2. for each doubtful value, walk the card's ordered questions and assign one origin -> 3. `read: <style-reference.md>` confirm token tables hold only measured values -> 4. `bash: rg '\[INFERRED\]' <style-reference.md>` confirm inferences cite a measured token -> 5. fill the doubtful-values table (value, origin, token or reason absent) -> 6. run the card's stop check | Step 1: measured set collected. Step 2: one origin per value, first yes wins. Step 3: token tables measured-only. Step 4: inferences marked and cited. Step 5: doubtful-values table names a real origin per row. Step 6: stop check passes, including the last box (live surface, not forward-authoring) | Transcript of the measured-set listing, the per-value origin sort, the token-table trace, the [INFERRED] grep, the completed doubtful-values table and the stop-check result | PASS if every value resolves to exactly one of the four origins AND token tables contain only measured values AND every inference is marked `[INFERRED]` with a cited token AND the doubtful-values table leaves no row as an unexplained invention AND the stop check passes. FAIL if a value cannot name a measured token yet is not honestly brief-provided, inferred or absent (an invention) OR a brief-provided value sits in a token table OR the stop check's last box fails and the request is treated as in-scope | 1. If a value is an invention (no measured token, not honestly brief-provided, inferred or absent), remove it. 2. If a brief-provided value sits in a token table, move it to prose as a stated intent. 3. If an inference lacks a cited token, add the citation or drop the claim. 4. If the stop check's last box fails, this is forward-authoring: route it to the separate design-spec decision and do not loosen fidelity to fit it. 5. Cross-check the sort against `references/authoring-boundary.md`. |

### Optional Supplemental Checks

Cross-read the completed doubtful-values table against `references/authoring-boundary.md` Section 3 to confirm each origin was routed to the right place. Run `validate.ts` and confirm `claimsScore >= 80` and zero phantom-color findings, the automated backstops for inference provenance and measured-value provenance that the card enforces by hand. When the request supplies a brief but no live URL, confirm the card's last stop-check box fails and the scenario routes the request out of scope rather than producing a Style Reference.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/source-of-truth-router-card.md` | The fill-in card that sorts each value by origin and records the doubtful values |
| `../../references/authoring-boundary.md` | The four origins, the source-of-truth labels and the forward-authoring out-of-scope rule the card enforces |
| `../../assets/cardinal-rules-card.md` | One-page fidelity checklist for pre-validate self-check |
| `../../backend/scripts/validate.ts` | Fidelity validator. `checkPhantomColors` covers measured-value provenance and `claimsScore` covers inference provenance |
| `../../backend/scripts/formatters-v3.ts` | Deterministic v3 emitters that emit measured values verbatim so the card's measured rows land in token tables unchanged |
| `../../references/design-md-format.md` | v3 Style Reference section specification and the cardinal rules the card protects |
| `../../SKILL.md` | §2 SMART ROUTING card loading rule, §3 Cardinal Fidelity Rule, §5 References and Reference Loading Notes |

---

## 5. SOURCE METADATA

- Group: Source-of-Truth
- Playbook ID: PROVENANCE-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `source-of-truth/source-of-truth-card.md`
