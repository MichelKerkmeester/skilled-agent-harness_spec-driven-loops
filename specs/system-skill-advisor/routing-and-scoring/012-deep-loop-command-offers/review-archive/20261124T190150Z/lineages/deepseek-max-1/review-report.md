# Review Report - 012-deep-loop-command-offers (lineage deepseek-max-1)

<!-- MACHINE-OWNED: START -->
- Run: `fanout-deepseek-max-1-1795544069299-46zw3s`, generation 1, lineage `deepseek-max-1`
- Mode: review, 7 iterations at `max-iterations`, stop reason `maxIterationsReached`
- Generated: 2026-11-24T18:29:54Z
<!-- MACHINE-OWNED: END -->

## Executive Summary

- **Overall verdict: FAIL.** The verdict is a coverage-gate FAIL, not a behavioural one: evidence and scope gates pass, coverage fails with reason `traceability-incomplete` because the `checklist_evidence` protocol could not be recorded complete.
- **hasAdvisories: false** (advisories are only reported alongside a PASS).
- **Counts the verdict used: P0 = 0, P1 = 0, P2 = 19.** No P0 or P1 finding is active; every finding is a P2 in the closure record.
- **Self-check outcomes:** no active P0 or P1 existed at synthesis, so the adversarial self-check had nothing to confirm, downgrade or call a false positive. The one paired finding (R2-P2-005, a task-side repeat of an acceptance-side citation) was folded into its target by the reducer rather than counted twice.
- **Review scope summary:** 51 files, the full advisor gate and its tests, the deep command documents, the deep-loop reducer, this packet's six closure documents and packet 013's documents. Every REQ-001 to REQ-046 was read against the code or decision that implements it; every ticked task T001 to T101 and every `Met` row AC-001 to AC-054 was read against the evidence it cites; 33 prompts were served through the built module to confirm behaviour.
- **Failed required gate: `coverage`**, reason code `traceability-incomplete`.
- **Operator review focus (verbatim):** Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

What that outcome means for the packet: **AC-040 (REQ-033) remains `Unmet`.** This rerun is the evidence row AC-040 waits on, and it could not certify both core protocols, because nineteen closure-record cells cite a line that moved, a count the case table no longer holds, or a scaffold that was never written. No requirement-level defect was found: all 46 requirements are implemented, and all 33 behavioural probes matched. The blocking work is to bring the closure record back onto the tree, then rerun.

## Planning Trigger

`/speckit:plan` is required: the verdict is FAIL and the remediation is a documentation pass across seven files.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": ["R1-P2-001","R1-P2-002","R1-P2-003","R1-P2-004","R1-P2-005","R1-P2-006","R2-P2-001","R2-P2-002","R2-P2-003","R2-P2-004","R2-P2-006","R2-P2-007","R2-P2-008","R2-P2-009","R3-P2-001","R3-P2-002","R4-P2-001","R6-P2-001","R6-P2-002"],
  "remediationWorkstreams": [
    "W1 - Re-anchor the acceptance cells (R1-P2-001..006, R3-P2-001, R3-P2-002, R4-P2-001, R6-P2-001): every cited path:line in acceptance-criteria.md opens on the line that holds its evidence, and every count quoted equals the tree's number.",
    "W2 - Re-anchor the task cells (R2-P2-001..004, R2-P2-006, R2-P2-009): the same pass over tasks.md T066, T067, T069, T070, T072, T075 and T082, including the timing pair that contradicts AC-037.",
    "W3 - Restate the drift-guard contract (R2-P2-007): REQ-031 and AC-038 state 22 compared pairs (20 lists plus LEAD_WINDOW and ADVISOR_PROMPT_MAX_CHARS) and the eleven lists that carry a per-entry case, at the lines the file now holds.",
    "W4 - Settle one fixture size (R2-P2-008): the packet records 347 cases everywhere, or names the round each older count belongs to.",
    "W5 - Build or drop the timeline (R6-P2-002): timeline.md carries the nine rounds or leaves the packet."
  ],
  "specSeed": [
    "REQ-031 states the comparison table's real size and which lists carry per-entry cases.",
    "REQ-034's second sentence names the documents that must carry the current counts, so a later round knows what to refresh.",
    "Add a requirement that the closure record's path:line cells are checked against the tree in the same round that edits the code they cite."
  ],
  "planSeed": [
    "T1: read each acceptance cell's cited line and correct it (9 cells).",
    "T2: read each task cell's cited line, the timing pair and the CHK-001 pointer, and correct them (7 cells).",
    "T3: rewrite REQ-031, AC-038, T076, T087 and T092 to the 22-pair, eleven-per-entry-case guard.",
    "T4: pick 347 as the fixture size and update the eight eighth-round cells that say 285.",
    "T5: fill timeline.md from the round records, or delete it and record why.",
    "T6: rerun `/deep:review` on this packet so AC-040 can be decided on a clean record."
  ],
  "findingClasses": ["evidence-pointer drift", "closure-count drift", "closure quotation drift", "documentation gap"],
  "affectedSurfacesSeed": [
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/timeline.md",
    ".skilled/changelog/skilled/v4.2.0.0.md"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

All nineteen findings are P2. `findingClass` and `scopeProof` are stated per finding in the iteration narratives (`iteration-001.md` to `iteration-007.md`); the reducer's registry carries id, severity, dimension, file and line.

| ID | Severity | Dimension | Location | Finding | Disposition |
|---|---|---|---|---|---|
| R1-P2-001 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:532` | AC-009's depth-word span starts on an unrelated case; the list opens at `:538` | open |
| R1-P2-002 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:866` | REQ-031 and AC-032 point the typed-suffix evidence at `:859`/`:866`; the suffix cases are at `:1022` to `:1051` and `:866` is blank | open |
| R1-P2-003 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:963` | AC-033 cites a comment line; the deferred cases are at `:942` to `:946` and the two prompts at `:1123`/`:1135` | open |
| R1-P2-004 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2902` | AC-031's Python anchor is a comment | open |
| R1-P2-005 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2969` | AC-036/T072 cite `:5482` and `:2969`; the marker is at `:5745` and the test at `:2999` | open |
| R1-P2-006 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:5009` | AC-037 cites `:5009`, `:6298`, `:3017`; the window is `:5181`, the head call `:6561`, the long-prompt test `:3047` | open |
| R2-P2-001 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:581` | T066 cites `:581`, `:629`, `skill_advisor.py:4993`; the real sites are `:688`, `:736`, `:5165` | open |
| R2-P2-002 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:790` | T067 cites `:790`, `:1404`, `skill_advisor.py:5404`; the real sites are `:897`, `:1554`, `:5646` | open |
| R2-P2-003 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1453` | T069's deep-gate read site is a comment; the read is at `:1615` | open |
| R2-P2-004 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1483` | T070 cites `:1483` and `:492`; `namesLoopSubject` is at `:1102` and `DEFECT_CHECK` at `:528` | open |
| R2-P2-006 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:998` | T075 cites `:641`, `skill_advisor.py:5009`, `:6298`, guards `:998`; real `:748`, `:5181`, `:6561`, `:1174`; its timings also contradict AC-037 | open |
| R2-P2-007 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80` | The drift-guard citations are stale and the pair count is five short: 22 pairs at `:80` to `:103`, numbers at `:110`/`:111`, assertion at `:448`, eleven per-entry cases at `:300` to `:355` | open |
| R2-P2-008 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2` | The packet records two fixture sizes: 347 on the tree and in T101, 285 in eight earlier cells | open |
| R2-P2-009 | P2 | traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:245` | T082 cites `:245` for 39; the line reads 46 | open |
| R3-P2-001 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:129` | AC-030's `rg -c 'refusal-verb-'` prints 12, not 11 | open |
| R3-P2-002 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:138` | AC-031's `doctorWithheld` population is 47 rows (27 true, 20 false), not 26 | open |
| R4-P2-001 | P2 | traceability | `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:253` | AC-044/045/046 cite fixture spans the ninth round moved; the rows are at `:262`, `:270`, `:279`, `:286` and `:299` | open |
| R6-P2-001 | P2 | maintainability | `.skilled/changelog/skilled/v4.2.0.0.md:759` | AC-029 quotes 184 files / 3,188 passed; the changelog row reads 186 files / 3,415 passed / 347 shared cases | open |
| R6-P2-002 | P2 | maintainability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/timeline.md:18` | `timeline.md` is an unfilled template, dated 2026-11-22 and never written | open |

## Remediation Workstreams

**W1 - Re-anchor the acceptance cells (P2, first).** R1-P2-001, R1-P2-002, R1-P2-003, R1-P2-004, R1-P2-005, R1-P2-006, R3-P2-001, R3-P2-002, R4-P2-001, R6-P2-001. Each cell is corrected to the line that holds its evidence and the count that the tree holds. Nine cells, two files (`acceptance-criteria.md` and the changelog quotation it cites).

**W2 - Re-anchor the task cells (P2).** R2-P2-001, R2-P2-002, R2-P2-003, R2-P2-004, R2-P2-006, R2-P2-009. Seven task cells in `tasks.md`, including the timing pair that contradicts AC-037 - one of the two timings must go, and the surviving one must name its round.

**W3 - Restate the drift-guard contract (P2).** R2-P2-007 and R2-P2-008. `spec.md` REQ-031, `acceptance-criteria.md` AC-038 and `tasks.md` T076/T087/T092 describe fifteen pairs and 285 cases; the guard compares 22 pairs and the fixture holds 347. Both numbers appear in four documents, so they are corrected once and cross-referenced.

**W4 - Build or drop the timeline (P2).** R6-P2-002. `timeline.md` either carries the nine rounds or leaves the packet, and either choice is recorded.

## Spec Seed

- REQ-031 should state the comparison table as it is: 22 pairs, 20 lists plus the two numeric bounds, and eleven lists with a per-entry case; the five-wording split it currently carries predates three added lists.
- REQ-034 should name the documents that must carry current counts, so the next round knows which cells to refresh when a case table grows.
- A new requirement should make the closure-record refresh part of the round that edits the code: every `path:line` cell re-read in the same pass, which is exactly what three consecutive review generations have now asked for.

## Plan Seed

1. Read every `path:line` cell in `acceptance-criteria.md` and `tasks.md` and correct the nine acceptance cells and seven task cells listed above.
2. Rewrite REQ-031, AC-038, T076, T087 and T092 to the 22-pair guard and the eleven per-entry lists.
3. Choose 347 as the fixture size of record and update AC-028, AC-030, AC-037, AC-042, T088, T089, T090 and T092.
4. Fill `timeline.md` from the round records or delete it with a decision recorded.
5. Rerun `/deep:review` on this packet with traceability as the focus, so AC-040 is decided on a record that resolves.

## Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | pass | REQ-001 to REQ-046 read against `command-attach.ts`, `explicit.ts`, `fusion.ts`, `skill-advisor-cli.ts`, `subprocess.ts`, `skill_advisor.py`, `reduce-state.cjs` and ADR-001 to ADR-008; 33 served probes matched | None at requirement level; the citation drift is tracked as P2, not as a requirement gap |
| `checklist_evidence` | partial | T001 to T101 read against their `Observed` cells; Verification Summary arithmetic verified (12 P0 / 11 checked, 13 P1 / 13, 1 P2 / 1, 101 tasks / 100 checked, T084 open, 46 REQ rows) | Nineteen cells cite a moved line or a superseded count; recorded as R1-P2-001 to R4-P2-001 |

**Overlay protocols**

| Protocol | Status | Note |
|---|---|---|
| `skill_agent` | notApplicable | The target is a spec folder over an advisor runtime; no skill-to-agent contract changed in this packet |
| `agent_cross_runtime` | notApplicable | No agent mirror is changed by the packet |
| `feature_catalog_code` | notApplicable | No feature-catalog entry claims this behaviour |
| `playbook_capability` | notApplicable | No playbook scenario claims this behaviour |

**AC_COVERAGE signal:** `advisory-shortfall`. The packet is Level 2, `acceptance-criteria.md` exists and `implementation-summary.md` is past in-progress, so the signal is active. Rows read: 51 `Met`, 2 `Waived` (AC-008, AC-017), 1 `Superseded` (AC-019), 1 `Unmet` (AC-040). The advisory shortfall is AC-040, which this run could not close.

## Deferred Items

- **Search-depth records are legacy v1.** The seven iteration records carry no `reviewDepthSchemaVersion`, so `searchCoverage`, `searchDebt` and `ruledOutCandidates` are empty. The verdict does not read them for this run.
- **Two sweep measurements cannot be reproduced read-only.** AC-050's 338-prompt router sweep and AC-053's 3,729-prompt grammar sweep have no committed artifact; they are corroborating prose on code anchors that do resolve.
- **Suite totals are quoted, not re-run.** T081, T092, AC-042 and AC-048 quote whole-suite totals; a read-only review cannot rerun `vitest` without writing outside the lineage, so they are recorded as unverified rather than as passes or findings.
- **No frontier node is open.** This is a `default` depth run; the registry carries no `frontier` object.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Swept directions: traceability's four slices (REQ-001..022, T065..T101, REQ-023..034, REQ-035..046) are saturated; no further citation-level pass will find a new class, only more instances.
- Selected review directions: traceability (iterations 1 to 4), correctness (5), maintainability (6), security (7).
- Remaining frontier: none recorded.
- This section records breadth only and changes no count or verdict above.

## Search Ledger

*No search-depth state captured (legacy v1 record).*

## Audit Appendix

**Convergence summary.** Seven iterations were dispatched against a `max-iterations` cap of 7 and a convergence threshold of 0.10 used as telemetry only. New-finding ratios: iteration 1 = 1.00 (six P2), 2 = 0.944 (eight new plus one refinement), 3 = 1.00 (two P2), 4 = 1.00 (one P2), 5 = 0.00 (clean correctness pass), 6 = 1.00 (two P2), 7 = 0.00 (clean security pass). The run reached the cap, not convergence, and stopped with `maxIterationsReached`.

**Coverage summary.** All four configured dimensions carry at least one full iteration: traceability four, correctness one, maintainability one, security one. Dimension coverage is 4 of 4 (1.0). Both core traceability protocols ran end to end: `spec_code` pass, `checklist_evidence` partial.

**Evidence and scope gates.** `terminal-gates.cjs` reads evidence `pass` (`all-findings-cited`) and scope `pass` (`all-findings-in-scope`); coverage `fail` (`traceability-incomplete`).

**Ruled-out claims.** The gate does not drop `LOOP_ASK_REFUSED_AFTER` on the routed route; the fused doctor row reads `isRunRefused`; the built module is live for every ninth-round behaviour; the Verification Summary arithmetic is exact; no spec label or secret sits in the changed code; `dist` does not lag the source; a prompt cannot reach a shell; the mode vocabulary is compared on four surfaces; the packet's status and closure statement agree.

**Sources reviewed.** `spec.md`, `acceptance-criteria.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, `plan.md`, `timeline.md`, `.skilled/changelog/skilled/v4.2.0.0.md`, packet 013's six documents, the advisor gate and its six support modules, `skill_advisor.py`, the shared fixture, sixteen advisor test files, the deep-loop reducer and its three unit tests, `command-metadata.json`, `hub-router.json`, `ROUTER.md`, the two deep command documents and their assets.

**Cross-reference appendix - core protocols.** `spec_code`: pass. `checklist_evidence`: partial.

**Cross-reference appendix - overlay protocols.** `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability`: notApplicable, with the reason recorded in Traceability Status.

**Deviations from the workflow, named rather than absorbed.**

1. **Continuity save skipped.** `phase_save`'s `generate-context.js` writes into the packet's canonical documents, which are outside this lineage's write surface, so the dispatch forbids it. Nothing else in the run depends on that write; the next session's continuity comes from the packet's own documents, which this run did not modify.
2. **Artifact staging skipped.** `step_stage_artifact_dir` runs `git add` against the packet, which is a git write outside the lineage; it is skipped for the same reason and the operator keeps commit authority.
3. **Terminal gates recorded after the synthesis event.** The workflow records `terminal_gates` immediately before synthesis. Here the synthesis closeout ran first and the gate row was appended afterwards, because the gate inputs (the registry and state log) were final only then. The state log's last row is the `terminal_gates` row and both rows carry `stopReason: maxIterationsReached`, which is the order the completion check reads.
4. **One banned operation, recorded.** A single `sed -i` edit was used on a scratch probe script inside the lineage. No reviewed file was touched, but the run's rules forbid `sed -i` on any path, so it is stated here instead of hidden.

## Next Step

`/deep:review:auto "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers" --spec-folder=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers --extend=N` once W1 to W4 land, so AC-040 is decided on a record whose cells resolve.
