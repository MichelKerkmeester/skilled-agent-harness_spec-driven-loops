---
title: Deep Review Strategy - 012-deep-loop-command-offers (lineage deepseek-max-1)
description: Traceability review of the deep-loop command offer packet, one dimension and one protocol slice per iteration.
version: 1.0.0
---

# Deep Review Strategy - Lineage deepseek-max-1

## 1. OVERVIEW

### Purpose

Persistent tracking for this review lineage: which dimensions remain, what was found (P0/P1/P2), which review approaches worked or failed, and where the next iteration looks.

### Usage

- Init: the lineage executor wrote this file before the first iteration.
- Per iteration: the iteration reads Next Focus, reviews the assigned slice, updates dimensions, counts and Next Focus.
- Mutability: mutable in place; the reducer may rewrite any machine-owned block.

---

## 2. TOPIC

Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (`spec-folder`), generation 1 of fan-out lineage `deepseek-max-1`.

Operator review focus, bound on every iteration: finish the `spec_code` and `checklist_evidence` traceability protocols. Check every REQ in `spec.md` against the code that implements it or the decision that records it, and every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Whether the gate rules are the right product decision. The operator decided them (D1, D2, ADR-005, ADR-006, ADR-008).
- Rebuilding the advisor and rerunning its suites as a release gate. The closure docs cite their runs; this review checks that those citations resolve against the tree.
- Changing any reviewed file. The review is observation-only.
- Packet 013's own closure state beyond the REQ-034 evidence pointer this packet owns.

---

## 5. STOP CONDITIONS

- All four configured dimensions covered and both core traceability protocols recorded, then the `max-iterations` cap (7) ends the run with `maxIterationsReached`.
- An active P0 that makes a REQ claim false forces the FAIL verdict whatever the coverage.
- No write outside the lineage directory.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 19
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading the exact cited line in each `Met` row rather than the row's prose: it separated the claims that hold from the pointers that moved, in one pass (iteration 1)
- Counting the checkboxes and re-reading the summary rows: the Verification Summary arithmetic is exact, which removed a whole suspected class in one call (iteration 2)
- Searching the changed code for the forbidden label pattern instead of trusting CHK-011: the hygiene gate is genuinely clean (iteration 2)
- Tracing each sixth-round requirement to its producer symbol and then to the fixture column that pins it: every behaviour claim held, so the slice closed on two count cells (iteration 3)

---

## 9. WHAT FAILED

- Grepping a symbol name and accepting the first hit: the symbol exists, so a stale citation can pass a name-only check while the quoted line is wrong (iteration 1)
- Checking a Python list anchor against the test module instead of the script module: three anchors looked blank until the wrong-file read was caught (iteration 2)
- Trusting a cell's count without re-running the cell's own command: `rg -c 'refusal-verb-'` printed 12 against the cell's 11 (iteration 3)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "A deep command can start without the operator": both deep rows are `ask`, and the `run` row is the diagnosis only. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "A deep command can start without the operator": both deep rows are `ask`, and the `run` row is the diagnosis only.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A mode-free plural ask still serves a command": `plural-deep-loops-served` carries `servedRun: null`, matching ADR-008 and the singular row. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "A mode-free plural ask still serves a command": `plural-deep-loops-served` carries `servedRun: null`, matching ADR-008 and the singular row.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A no-edit clause still withholds a read-only loop": `run a deep review of the parser but don't change anything` serves `/deep:review`. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "A no-edit clause still withholds a read-only loop": `run a deep review of the parser but don't change anything` serves `/deep:review`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A prompt can be interpreted by a shell": the spawn shape is argv-only and the prompt travels on stdin. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "A prompt can be interpreted by a shell": the spawn shape is argv-only and the prompt travels on stdin.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A refused loop phrase still supplies the mode cue": the deferred route serves the asked mode for `run deep reviews on the parser, but skip the deep research`. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "A refused loop phrase still supplies the mode cue": the deferred route serves the asked mode for `run deep reviews on the parser, but skip the deep research`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A spec label or path leaked into the changed code comments": the hygiene search over five changed files prints nothing. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "A spec label or path leaked into the changed code comments": the hygiene search over five changed files prints nothing.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "REQ-001 to REQ-004 regressed into code": the probe artifact is a 69-row array and the keep/negative rows are quoted from it; nothing in the gate contradicts them. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "REQ-001 to REQ-004 regressed into code": the probe artifact is a 69-row array and the keep/negative rows are quoted from it; nothing in the gate contradicts them.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "T076's whole array-anchor list is stale": ten of its fifteen anchors land on or inside the list they name. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "T076's whole array-anchor list is stale": ten of its fifteen anchors land on or inside the list they name.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The built module lags the ninth-round source": every ninth-round behaviour the probe exercised is served from `dist`. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "The built module lags the ninth-round source": every ninth-round behaviour the probe exercised is served from `dist`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The corpus `false_offer_attached` count regressed": it is 1 of 57, the V7 near-miss row the packet added by design. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "The corpus `false_offer_attached` count regressed": it is 1 of 57, the V7 near-miss row the packet added by design.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The cross-packet pointer to packet 013 is dead": `013-.../implementation-summary.md:123` resolves and states the degraded-path evidence. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "The cross-packet pointer to packet 013 is dead": `013-.../implementation-summary.md:123` resolves and states the degraded-path evidence.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The deep-loop names in the hub router were dropped": both aliases are present in `hub-router.json:34` and mirrored at `ROUTER.md:63`. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "The deep-loop names in the hub router were dropped": both aliases are present in `hub-router.json:34` and mirrored at `ROUTER.md:63`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The fused doctor row ignores a refusal": `withholdDeepLoopDoctorWithoutRun` calls `isRunRefused` at `fusion.ts:1084`, and the two withhold cases pass. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "The fused doctor row ignores a refusal": `withholdDeepLoopDoctorWithoutRun` calls `isRunRefused` at `fusion.ts:1084`, and the two withhold cases pass.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The limitations list lost the typed-on-stuck line": limitation 6 states it in the ADR-005 wording. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "The limitations list lost the typed-on-stuck line": limitation 6 states it in the ADR-005 wording.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The mode guard covers only the deferred route": `routedLoopMode` is read at `:1592` (the routed single-target branch) and defined at `:1648`. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "The mode guard covers only the deferred route": `routedLoopMode` is read at `:1592` (the routed single-target branch) and defined at `:1648`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The mode guard runs only on the deferred route": the routed research route serves `/deep:review` for the ask that names review. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "The mode guard runs only on the deferred route": the routed research route serves `/deep:review` for the ask that names review.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The offer section is missing from one presentation file": both files carry the heading and the composed flag. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "The offer section is missing from one presentation file": both files carry the heading and the composed flag.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The packet's status and closure statement disagree": both say the run is open and name AC-040. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "The packet's status and closure statement disagree": both say the run is open and name AC-040.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The Python head counts characters rather than UTF-16 units": `_advisor_prompt_head` adds two units above `0xFFFF` before comparing with `ADVISOR_PROMPT_MAX_CHARS`. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "The Python head counts characters rather than UTF-16 units": `_advisor_prompt_head` adds two units above `0xFFFF` before comparing with `ADVISOR_PROMPT_MAX_CHARS`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The refusal vocabulary is missing a lead the fixture pins": the list at `:688` builds the pattern at `:736`, and all six refusal rows read false. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "The refusal vocabulary is missing a lead the fixture pins": the list at `:688` builds the pattern at `:736`, and all six refusal rows read false.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The renderer can be steered by prompt text": it declares and implements that it never reads it. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "The renderer can be steered by prompt text": it declares and implements that it never reads it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The Verification Summary overstates what was verified": it states 11 of 12 P0, exactly matching the one open P0 box at `:266`. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "The Verification Summary overstates what was verified": it states 11 of 12 P0, exactly matching the one open P0 box at `:266`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- "REQ-001 to REQ-004 regressed into code": the 69-row probe artifact backs the gain, keep and negative lines, and the gate contradicts none of them (iteration 1)
- "The Verification Summary overstates what was verified": it states 11 of 12 P0, exactly matching the one open P0 box at `tasks.md:266` (iteration 2)
- "T076's whole array-anchor list is stale": ten of its fifteen anchors land on or inside the list they name (iteration 2)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
No dimension remains: traceability (1 to 4), correctness (5), maintainability (6) and security (7) are all covered and the run stopped at the `max-iterations` cap. The next run inherits one open criterion, AC-040, and the five remediation workstreams in `review-report.md` (W1 to W5, all closure-record re-anchoring); nothing in the code needs a change.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

Prior work, read at init:

- `spec.md` states 46 requirements over nine rounds; the sixth round is REQ-023..REQ-034.
- `acceptance-criteria.md` holds AC-001..AC-054. AC-040 (the deep-review rerun) reads `Unmet` and is the row this run decides.
- `tasks.md` holds T001..T101 with `Observed <date>` evidence cells; the Verification Summary counts 12 P0 / 13 P1 / 1 P2 items.
- `implementation-summary.md`, `decision-record.md` (ADR-001..ADR-008) and `.skilled/changelog/skilled/v4.2.0.0.md` carry the closure prose.
- Prior review reports sit in `review/` and `review-archive/`; generations 1 to 5 all returned FAIL, last on coverage and scope.
- The reviewed tree is the advisor gate (`runtime/lib/command-attach.ts`, `runtime/scripts/skill_advisor.py`, scorer lanes, `fusion.ts`, `skill-advisor-cli.ts`, `subprocess.ts`), the deep command documents and the deep-loop reducer.

### Bounded Context Snapshot

- Target pointers: the 51 files in `review-scope-files.txt`.
- Behavior claims to verify: each REQ states an observable result; each `Met` AC row cites a `path:line` or a command result; each `[x]` task cites an `Observed` cell.
- Reuse and conventions: the shared fixture `tests/fixtures/deep-loop-offer-cases.json` is the single case source both gate copies read; the drift guard compares the two vocabularies.
- Review risks and gaps: evidence cells may cite a line that moved; suite and fixture counts changed across rounds; `review/` artifacts are context, not review target.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 4 | REQ-001..REQ-046 map to code and decisions; citation drift tracked as P2 |
| `checklist_evidence` | core | partial | 2 | T065..T101 substance holds; nine cells drifted |
| `skill_agent` | overlay | pending | - | [details] |
| `agent_cross_runtime` | overlay | pending | - | [details] |
| `feature_catalog_code` | overlay | pending | - | [details] |
| `playbook_capability` | overlay | pending | - | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | [D3] | 1 | [0 P0, 0 P1, 6 P2 across cells] | partial |
| .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts | [D3] | 1 | [0 P0, 0 P1, 3 P2] | partial |
| .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py | [D3] | 2 | [0 P0, 0 P1, 3 P2] | partial |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md | [D3] | 2 | [0 P0, 0 P1, 9 P2] | partial |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md | [D3] | 1 | [0 P0, 0 P1, 6 P2] | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7 (stopPolicy `max-iterations`)
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-1-1795544069299-46zw3s, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T18:16:03Z
- Artifact dir: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1`
<!-- MACHINE-OWNED: END -->
