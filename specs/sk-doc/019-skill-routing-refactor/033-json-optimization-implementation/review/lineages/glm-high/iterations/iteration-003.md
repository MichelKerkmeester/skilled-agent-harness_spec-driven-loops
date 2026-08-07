# Iteration 3: D4 Maintainability + Adversarial P0/P1 Replay + Breadth Sweep (final iteration)

## Focus
- Dimensions: D4 Maintainability (primary); adversarial replay of all P1 findings from iterations 1-2; breadth sweep of un-touched child specs (005, 006, 007, 009, 011).
- Files reviewed: all 12 `implementation-summary.md` frontmatters (F005 replay); `005-ci-golden-prompts/spec.md`, `006-ci-compiler-accuracy-gates/spec.md`, `007-dead-field-deletes/spec.md`, `009-signal-quality/spec.md`, `011-command-metadata-ingestion/spec.md` (breadth); re-read parent `spec.md:80,86,127-151` (F001/F003/F006 replay); re-read `002-baseline-capture/baseline/routing-baseline.json` (F002 replay).
- Scope: confirm no P0 hides in the routing-changing phases (008, 011); attempt to refute each P1; finalize the verdict trajectory for synthesis.

## Scorecard
- Dimensions covered: maintainability (primary); adversarial replay across correctness/security/traceability
- Files reviewed: 17 (12 impl-summaries + 5 child specs + replay re-reads)
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- Severity transitions: F005 P1→P2 (1 downgrade)
- New findings ratio: 0.0 (replay + breadth confirmation; no novel findings)

## Findings

### P0, Blocker
(none — adversarial P0 replay across 008 manual-to-edges migration and 011 command-bridge cutover found no P0. 008 checklist evidences byte-identical corpus both regimes (CHK-012); 011 ships shadow-mode-first with 3x corpus-gated cutover and a pinned three-way drift-guard.)

### P1, Required
(none new this iteration)

### P2, Suggestion
(none new this iteration)

### Severity Transitions
- **F005**: P1 → P2 (downgrade). Adversarial replay confirmed all 12 `implementation-summary.md` files (the primary resume surface per the deep-review SKILL.md MEMORY SAVE RULE: "The resume ladder only reads continuity from `implementation-summary.md`") report `completion_pct: 100` with current `recent_action` strings ("Built regenerator + freshness gate...", "Shadow landed; cutover corpus-gated 3x...", "Daemon reindex + zero-delta close...", etc.). The stale `completion_pct: 0` is confined to the secondary `spec.md` frontmatter `_memory.continuity` block, which is not the resume ladder's input. Functional resume-surface impact is nil; the defect is metadata hygiene only. Per the pre-registered downgrade trigger ("If the program formally documents that spec.md _memory.continuity is not a resume surface... downgrade to P2"), F005 downgrades to P2. [SOURCE: 001..012/implementation-summary.md frontmatters, deep-review SKILL.md MEMORY SAVE RULE]

## Adversarial P1 Replay Results

| Finding | Replay attack | Result | Final severity |
|---------|---------------|--------|----------------|
| F001 | Search Phase Transition Rules for any rule reordering Phase 1 after Phase 2, or redefining "Phase 1" as "first gating phase" | No such rule found; `spec.md:145` confirms "Phase 2 (baseline) precedes every gate"; REQ-001 "before Phase 1 begins" remains unsatisfiable as written | **P1 survives** |
| F002 | Search for any artifact recording 53/72 as the canonical pin (which would make 012's table correct) | No artifact records 53/72 as the pin; `routing-baseline.json` `top3_new.holdout_top3` = 55/72; `capture-top3.json` = 55/72; 53/72 appears only as a downstream citation in 003/010/012 | **P1 survives** |
| F003 | Search REQ-007 for an external-blocker escape clause that would permit Complete despite a broken validate gate | REQ-007 (`spec.md:86`) has no escape clause; it is worded "before the program is marked Complete"; 012 documents the gate unmet | **P1 survives** |
| F005 | Check whether the primary resume surface (implementation-summary.md) is also stale, which would keep F005 at P1 | All 12 implementation-summary.md files current (completion_pct: 100); stale metadata confined to secondary spec.md frontmatter | **P1 → P2 downgrade** |
| F006 | Search for language documenting the Phase Documentation Map as a frozen planning snapshot not tracking execution | None found; `spec.md:151` explicitly calls it "the coordination truth"; no "frozen"/"planning snapshot" language | **P1 survives** |

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | F001, F006 survive replay | Two unresolved normative-claim mismatches |
| checklist_evidence | pass | hard | 003 + 008 spot checks (iter 2); 005/006/007/009/011 breadth (iter 3) | All examined checklists carry per-item [evidence:...] citations; deferrals recorded (003 CHK-051→012, 011 generated-bridges→fast-follow) |
| feature_catalog_code | pass | advisory | iter 2 | O1-O11 all mapped |
| playbook_capability | notApplicable | advisory | - | - |

## Claim Adjudication Packets

```json
{
  "findingId": "F005",
  "claim": "F005 downgrades from P1 to P2 because the primary resume surface (implementation-summary.md) is current across all 12 phases; the stale completion_pct is confined to the secondary spec.md frontmatter which the resume ladder does not read.",
  "evidenceRefs": ["001..012/implementation-summary.md frontmatters", "deep-review SKILL.md MEMORY SAVE RULE"],
  "counterevidenceSought": "Grepped completion_pct across all 12 implementation-summary.md files — all return 100 with current recent_action strings. Cross-referenced the SKILL.md MEMORY SAVE RULE which states the resume ladder reads continuity from implementation-summary.md, not spec.md frontmatter.",
  "alternativeExplanation": "Could argue the spec.md frontmatter _memory.continuity is still a machine-readable field that should be correct. Accepted — that is why this stays P2 (hygiene) rather than being dismissed entirely.",
  "finalSeverity": "P2",
  "confidence": 0.9,
  "downgradeTrigger": "Already downgraded to P2.",
  "transitions": [{"iteration":2,"from":null,"to":"P1","reason":"Initial discovery"},{"iteration":3,"from":"P1","to":"P2","reason":"Adversarial replay: primary resume surface current; stale metadata confined to secondary surface"}]
}
```

## Assessment
- New findings ratio: 0.0 (replay + breadth confirmation; no novel findings — expected on the final iteration of a 3-iteration max-iterations run)
- Dimensions addressed: maintainability (primary); adversarial replay across all dimensions
- Novelty justification: No new findings. The iteration's value is (a) one severity downgrade (F005 P1→P2) backed by primary-surface evidence, (b) confirmation that all 5 P1 findings that survive replay are robust, (c) breadth confirmation that the un-touched child specs (005/006/007/009/011) are well-structured with documented guards and deferrals, and (d) confirmation that no P0 hides in the two routing-changing phases (008, 011).

## Maintainability Dimension Verdict
PASS with advisories. Breadth sweep of 005/006/007/009/011 shows: 006 REQ-003 documents the inert-until-prerequisites turn-on order; 007 (dead-field deletes, routing-neutral per parent REQ-003) needs no corpus guard; 009 carries 3 guard-mentions; 011 carries 8 guard-mentions (shadow-mode, corpus-gated 3x, drift-guard) plus a documented durable finding and fast-follow deferral. Deferral rationales are explicit where present (003 CHK-051→012, 007 REQ-004 branch-on-003, 011 generated-bridges→fast-follow). Advisories: F004, F005 (downgraded), F007 — all P2 metadata/hygiene.

## Ruled Out
- "P0 in 008 manual-to-edges migration": ruled out. 008 checklist CHK-012 evidences byte-identical corpus both regimes (warm 0.5692/0.9843/108-3-1; fallback 0.5333/0.9843/101-3-1); manual gone from all 10 (CHK-008); lint fails on reintroduction (CHK-010); no duplicate pairs introduced (CHK-009).
- "P0 in 011 command-bridge cutover": ruled out. 011 ships shadow-mode-first, corpus-gated 3x, with a pinned three-way drift-guard and per-entry e2e coverage; rollback is one-commit revertible (shadow landing and live cutover are separate commits).
- "REQ-005 O1-O11 coverage gap": ruled out (iter 2, re-confirmed).

## Dead Ends
- 006 spec returned 0 keyword matches for "rollback/revert/shadow/feature flag/guarded", but REQ-003 documents the inert-until-prerequisites turn-on order in different language. Keyword absence ≠ guard absence — not promoted to a finding.

## Recommended Next Focus
Synthesis. Final active finding set: P0=0, P1=4 (F001, F002, F003, F006 — all survived adversarial replay), P2=3 (F004, F005 downgraded, F007). Verdict trajectory: CONDITIONAL. Synthesis should route to remediation planning (CONDITIONAL → planning trigger) with two workstreams: (1) spec-doc reconciliation (F001 REQ-001 wording, F006 parent Phase Map, F005/F004 stale frontmatter), (2) baseline-pin reconciliation (F002 55/72 vs 53/72 across 003/010/012) and completion-gate honesty (F003 REQ-007 unmet vs Status: Complete).

Review verdict: CONDITIONAL
