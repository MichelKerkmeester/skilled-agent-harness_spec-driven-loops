---
title: "Deep Review Report: deep-loop command offers"
description: "Three-lineage fan-out review (Opus 5.5 at medium, 5 iterations each) of the deep-loop offer gate, its Python fallback and the 013 typed-command hint. Verdict FAIL on the coverage gate, with 0 P0, 2 P1 (one duplicated issue) and 18 P2."
---

# Deep Review Report: deep-loop command offers

## 1. Executive Summary

- **Overall verdict:** FAIL
- **hasAdvisories:** false
- **Counts the verdict used:** P0 0, P1 2, P2 18, search debt 0, failed required gates `["coverage"]` (from `fanout-merge.cjs` and `review-verdict.cjs`).
- **Why FAIL:** no P0 was found. The verdict is FAIL because the required `coverage` gate failed in all three lineages with reason `traceability-incomplete`: the core `checklist_evidence` protocol never finished in any lineage, and lineage 2 also left `spec_code` unfinished. All four dimensions were covered in every lineage. This is a gap in what the review finished, not a defect found in the code.
- **Self-check outcomes (fan-out root, recorded for reference, not appended):** `O3-R3-P1-006` and `R1-P1-001--7fc71951ce1c` are the same issue raised by lineages 3 and 2 at `advisor-recommend.ts:434`. The Referee confirmed it at P1. Lineage 1 raised the same claim and its own self-check downgraded it to P2 (`R1-P1-001--bc6c20dfcd5f`).
- **Review scope:** spec folder `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`, 32 files: both packets' docs, `command-attach.ts`, `skill_advisor.py`, `explicit.ts`, the 013 hint path (`render.ts`, `advisor-recommend.ts`, `subprocess.ts`, `advisor-tool-schemas.ts`, `skill-advisor-cli-fallback.ts`), the `/deep:*` command docs and their tests.
- **Operator review focus:** The deep-loop offer gate in command-attach.ts and the Python fallback in skill_advisor.py, plus the typed-command hint from packet 013
- **Run shape:** 3 `cli-claude-code` lineages, `claude-opus-5-5` at reasoning effort `medium`, `--sandbox-mode=danger-full-access`, `--concurrency=3`, `--stop-policy=max-iterations`, 5 iterations each (15 in total). Provider cost reported by the runner: $20.30 (lineage 1 $7.04, lineage 2 $7.70, lineage 3 $5.57).

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is FAIL. The only code-independent blocker is the unfinished traceability coverage. The P1 is a closure-record fix, and the P2s are optional hardening.

```json
{
  "Planning Packet": true,
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": {"P0": 0, "P1": 2, "P2": 18},
  "remediationWorkstreams": ["WS1 closure record for the typed-on-stuck exception", "WS2 finish checklist_evidence and spec_code traceability", "WS3 refusal vocabulary", "WS4 Python fallback cost on long prompts", "WS5 typed flag on the degraded brief path", "WS6 vocabulary drift guard"],
  "specSeed": ["Record the operator-confirmed typed-on-stuck exception in REQ-020, SC-005 and AC-027"],
  "planSeed": ["Rerun traceability with checklist_evidence over tasks.md and acceptance-criteria.md"],
  "findingClasses": "UNKNOWN",
  "affectedSurfacesSeed": [".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts", ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py", ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts", ".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts", ".skilled/skills/system-skill-advisor/runtime/lib/render.ts", "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

`findingClass`, `scopeProof` and `affectedSurfaceHints` are empty in the merged registry, so they read UNKNOWN here. Every finding is in scope (scope gate pass) and cites file:line (evidence gate pass).

### P1

- **O3-R3-P1-006 / R1-P1-001--7fc71951ce1c** (correctness, lineages 3 and 2). `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:434`. AC-027 is marked Met with evidence that both gates withhold the run command on the four REQ-020 prompts. But `attachTypedCommand` puts the typed `/deep:review (ask)` back on the top row for "my deep review run is stuck, /deep:review again", while the Python gate drops it. SC-005 says every REQ-015 to REQ-020 prompt gives its stated result through the prompt hook. The behaviour itself is the operator's choice (limit 6, confirmed 2026-11-23). The defect is that REQ-020, SC-005 and AC-027 still state parity and hook results without that exception. Fix: amend those three rows to carve out the typed-on-stuck case, and add a serving-layer case that pins it.

### P2

- **O3-R2-P2-003 / R1-P2-001** `command-attach.ts:440`. Common refusal verbs ("skip", "avoid", "instead of", "refuse", "no need for") do not withhold the deep command, in either copy. This extends known limit 7.
- **O3-R2-P2-004** `command-attach.ts:837`. A stuck-run complaint attaches the run-policy `/doctor:deep-loop` even when the prompt says not to run anything.
- **O3-R1-P2-001** `command-attach.ts:238`. A typed deep command is lost when the prompt also types a longer, different command.
- **R5-P2-002** `command-attach.ts:574`. A bare loop name ("deep loop", "review loop") is not read as an ask. That narrows decision D2 without a recorded decision.
- **R5-P2-001** `command-attach.ts:908`. The named-mode shortcut reads a loop name the gate treated as the subject, so a review request can get `/deep:research`.
- **O3-R5-P2-009** `command-attach.ts:384`. The review mode cue misses the "-ing" form of the defect-check verbs its comment says it covers.
- **R2-P2-001--04bbace09a42** `command-attach.ts:784`. `commandOnlyMentioned` rescans the prefix once per occurrence: quadratic, bounded by the 10K prompt cap.
- **O3-R5-P2-010** `lib/scorer/lanes/explicit.ts:449`. The stage-one loop rule reads raw loop wording without the gate's subject and refusal exceptions.
- **O3-R2-P2-005** `skill_advisor.py:4718`. The Python loop-ask scan is quadratic and can pass the 3 s fallback timeout on long prompts.
- **R2-P2-001--0cd52b194113** `skill_advisor.py:5596`. The Python fallback runs per-match gate scans on an uncapped prompt.
- **O3-R4-P2-008** `skill_advisor.py:4529`. The Python gate hand-inlines vocabulary lists that the TS gate keeps as data, so a list edit must be retyped.
- **R3-P2-001** `lib/subprocess.ts:200`. The Python-subprocess brief path drops `command`, `policy` and `typed`, so a typed deep command renders the A/B/C offer.
- **O3-R1-P2-002** `lib/render.ts:250`. The degraded (Python) path drops the typed flag, so a typed deep command still gets the three offer options. Same root as R3-P2-001.
- **R4-P2-001--5008634720d6** `tests/deep-loop-offer-cases.vitest.ts:72`. The drift guard covers only the three exported phrase lists. Inline regex vocabulary such as `COUNT_WORDS` can drift.
- **R4-P2-001--f90c95d81ceb** `tests/deep-loop-offer-cases.vitest.ts:57`. The typed-command parity column is pinned at different layers, and no deep-loop typed case exists at the serving layer.
- **R1-P1-001--bc6c20dfcd5f** `advisor-recommend.ts:428`. Lineage 1's form of the P1 above, downgraded to P2 by its own self-check.
- **O3-R3-P2-007** `acceptance-criteria.md:65`. AC-008's evidence cell says accepted as Met while its status is Waived.

## 4. Remediation Workstreams

1. **WS1 (P1):** amend REQ-020, SC-005 and AC-027 to record the operator-confirmed typed-on-stuck exception, and add a serving-layer typed case for it.
2. **WS2 (gate):** finish the `checklist_evidence` protocol (and `spec_code` for lineage 2's scope) so the coverage gate can pass on a rerun.
3. **P2 advisories, separate:** WS3 refusal vocabulary (O3-R2-P2-003, R1-P2-001, O3-R2-P2-004). WS4 Python fallback cost on long prompts (O3-R2-P2-005, R2-P2-001--0cd52b194113, R2-P2-001--04bbace09a42). WS5 typed flag on the degraded brief path (R3-P2-001, O3-R1-P2-002). WS6 vocabulary drift guard (R4-P2-001--5008634720d6, O3-R4-P2-008). The rest are single-site fixes.

## 5. Spec Seed

- REQ-020: state that a typed `/deep:review` on a stuck-run complaint keeps the typed command on the served head, by operator decision.
- SC-005: exclude that prompt from "gives its stated result through the prompt hook", or state its hook result.
- AC-027: say the parity holds at the gate layer, and name the served-path exception.
- AC-008: make the evidence cell agree with the Waived status.

## 6. Plan Seed

- T1: amend the four spec and AC rows above.
- T2: add a serving-layer typed case for "my deep review run is stuck, /deep:review again".
- T3: rerun `/deep:review` with traceability as the focus, so `checklist_evidence` finishes.
- T4 (optional): carry `typed`, `command` and `policy` through the subprocess brief path.

## 7. Traceability Status

### Core Protocols

- `spec_code`: finished in lineages 1 and 3, unfinished in lineage 2.
- `checklist_evidence`: unfinished in all three lineages. This is why the coverage gate fails.

### Overlay Protocols

- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: recorded per lineage in each `lineages/*/review-report.md`. None is a gate here.

`AC_COVERAGE`: advisory. The packet is Level 2 with `acceptance-criteria.md` and a complete `implementation-summary.md`. The P1 and O3-R3-P2-007 are the AC rows this review contradicts.

## 8. Deferred Items

- The known limitations 1 to 7 in the 012 implementation-summary were treated as known context. O3-R2-P2-003 and R1-P2-001 widen limit 7.
- The merged registry carries no `frontier` object, so there are no frontier follow-ups.

## Dimension Expansion Map

No pivots ran: convergence mode `default`, stop policy `max-iterations`. No saturated directions, overrides or remaining frontier are recorded.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*. The merged `searchCoverage`, `candidateCoverage`, `searchDebt` and `ruledOutCandidates` are empty at the root. Per-lineage search ledgers are in `lineages/*/deep-review-findings-registry.json`. hasSearchDebt: false.

## 10. Audit Appendix

- **Convergence:** stop reason `maxIterationsReached` in every lineage, 5 of 5 iterations each. All four dimensions covered in each lineage.
- **Terminal gates:** evidence pass, scope pass, coverage fail (`traceability-incomplete`), identical in all three lineages.
- **Orchestration note:** lineages 1 and 2 finished all five iterations and their own synthesis, but did not record the `terminal_gates` row, so the first runner pass reported them failed. The orchestrator ran the same `terminal-gates.cjs` against each lineage's own config, state log and registry, appended the result through the append gateway (ledger sequence 8 in each), and reran the fan-out, which marked all three `skipped_complete` without spawning. The computed gate rows match lineage 3's own recorded row.
- **Run history:** an earlier single-executor run (generation 1) was stopped before its first iteration wrote anything and is archived at `review-archive/20261124T044309Z`. This run is generation 2.
- **Per-lineage verdicts:** lineage 1 PASS, lineage 2 CONDITIONAL, lineage 3 FAIL. The merged verdict uses strongest restriction plus the failed coverage gate.
- **Sources reviewed:** the 32 files in `fanout-review-scope.txt`.
