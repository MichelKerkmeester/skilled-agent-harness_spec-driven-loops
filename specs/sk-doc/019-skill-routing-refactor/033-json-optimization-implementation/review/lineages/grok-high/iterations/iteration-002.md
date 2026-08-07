# Iteration 2: D2 Security + D3 Traceability — Phase Map, continuity, checklist integrity, O-map

## Focus
- Dimensions: D2 Security (primary pass), D3 Traceability (primary), maintainability touch via continuity hygiene.
- Files reviewed: parent `spec.md` Phase Documentation Map; continuity frontmatter across parent + 12 children; `003/.../checklist.md` + `implementation-summary.md` + `tasks.md`; `012/.../checklist.md`; `004/.../spec.md` (O2+O9); `011/.../spec.md` (O7+O10); `007/.../spec.md` (O5/O11 deferrals); `010/.../scratch/*`; `002/.../scripts/capture-top3.mjs`.
- Scope: security of phase-local scripts/scratch; parent↔child status traceability; checklist_evidence integrity; REQ-005 O1-O11 ownership; refine F002 propagation.

## Scorecard
- Dimensions covered: security, traceability (primary); correctness (F002 refine); maintainability (continuity)
- Files reviewed: 14+
- New findings: P0=0 P1=3 P2=1
- Refined findings: P0=0 P1=1 P2=0 (F002)
- New findings ratio: 0.58 (4 new-ish units / ~7 total finding events; F002 refine counts as refined)

## Findings

### P0, Blocker
(none)

### P1, Required

- **F005**: Systemic stale continuity frontmatter. Parent `spec.md:24` and 10 of 12 children (`003`–`012`) still carry `completion_pct: 0` (and often planned-phase `recent_action` / open blockers) while every corresponding `**Status** | Complete` cell reports Complete. Only `001` and `002` show `completion_pct: 100`. Resume ladders that trust continuity over Status will mis-route. Generalizes F004 beyond the 010 decision-record. [SOURCE: spec.md:24,46; 003-derived-regenerator-migration/spec.md:25; 004-scaffold-journey/spec.md:24; 005-ci-golden-prompts/spec.md:25; 006-ci-compiler-accuracy-gates/spec.md:27; 007-dead-field-deletes/spec.md:25; 008-manual-to-edges-migration/spec.md:26; 009-signal-quality/spec.md:26; 010-parent-intent-projection-spike/spec.md:27; 011-command-metadata-ingestion/spec.md:25; 012-integration-verification-rollout/spec.md:30; 001-derived-authority-decision/spec.md:25; 002-baseline-capture/spec.md:25]

- **F006**: Parent Phase Documentation Map is entirely stale. `spec.md:127-140` lists all 12 phases as **Planned**, while every child `spec.md` reports **Status: Complete** (verified for 001–012). The Phase Transition Rules (`spec.md:151`) call this map "the coordination truth" — so the coordination truth contradicts the children's own completion claims. [SOURCE: spec.md:127-140,151]

- **F008**: 012 checklist evidence is a rubber-stamped identical blob. CHK-001 through CHK-017 in `012-integration-verification-rollout/checklist.md` each carry the same multi-claim evidence paragraph (daemon reindex + "TS-source 176/195+53/72" + pi-hook deferral), rather than claim-specific evidence. That blob also embeds the F002 mislabel (53/72 as top-3). checklist_evidence protocol requires checked items to have evidence that supports *that* claim; copy-paste does not. [SOURCE: 012-integration-verification-rollout/checklist.md:50-90]

- **F002 (REFINED)**: The top-1→top-3 mislabel propagates into phase closure artifacts beyond 010/012 narrative: `003-.../checklist.md` CHK-031 evidence cites "53/72"; `003-.../tasks.md` T-09 cites "53/72"; `003-.../implementation-summary.md:82,91` reports 53/72 while acknowledging the pin is 55/72; `012-.../checklist.md` evidence repeats "176/195+53/72". Systemic documentation debt, not a single-table typo. [SOURCE: 003-derived-regenerator-migration/checklist.md:84; 003-derived-regenerator-migration/tasks.md:60; 003-derived-regenerator-migration/implementation-summary.md:82,91; 012-integration-verification-rollout/checklist.md:50]

### P2, Suggestion

- **F007**: Committed scratch patched derived block is a confusion / accidental-apply hazard. `010-parent-intent-projection-spike/scratch/sk-doc-derived-patched.json` is a full live-shaped `graph-metadata` document (schema_version 2, skill_id sk-doc, edges, domains, intent_signals, derived.trigger_phrases…). No secrets found. Spike docs say it was trap-restored after measurement, but the committed artifact remains adjacent to production-shaped paths and could be mistaken for an authoritative fleet file. [SOURCE: 010-parent-intent-projection-spike/scratch/sk-doc-derived-patched.json:1-80; 010-parent-intent-projection-spike/decision-record.md:117]

## Security Pass Notes
- `002-baseline-capture/scripts/capture-top3.mjs`: measurement-only; uses tmpdir for `MK_SKILL_ADVISOR_DB_DIR`; no writeFile/exec of shell; imports scorer from dist (read). No P0/P1 security defect. Dist-dependency amplifies F003's environmental blocker story but is not itself a vulnerability.
- `010/scratch/*`: no credential/secret patterns; vocab files match false-positive "token" lexicon hits only.
- No path-traversal or unsafe deserialization findings in reviewed phase-local scripts this pass.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | F001,F002,F006 | parent claims vs children/artifacts |
| checklist_evidence | partial | hard | 003/004/008 pass with per-item evidence; 012 rubber-stamp F008 | pass→partial due to F008 |
| feature_catalog_code | pass | advisory | 004 owns O2+O9; 011 owns O7+O10; 007 defers O9/O10; 003 owns regenerator slice of O1; 001 owns authority slice of O1; 005=O3; 006=O4; 008=manual→edges; 009=O6; 010=O8; 012=close gate | REQ-005 ownership satisfied; dual-own folds recorded in phase scopes |
| playbook_capability | notApplicable | advisory | - | - |

## Claim Adjudication Packets

```json
{
  "findingId": "F005",
  "claim": "Ten of twelve child specs plus the parent still have completion_pct: 0 in continuity frontmatter while Status cells say Complete.",
  "evidenceRefs": ["spec.md:24", "spec.md:46", "003-derived-regenerator-migration/spec.md:25", "012-integration-verification-rollout/spec.md:30", "001-derived-authority-decision/spec.md:25", "002-baseline-capture/spec.md:25"],
  "counterevidenceSought": "Scanned all 12 child spec.md files for completion_pct; only 001 and 002 are 100. Checked whether implementation-summary continuity differs — review scope used spec.md frontmatter as the resume-ladder source per ADR-004 convention.",
  "alternativeExplanation": "Continuity intentionally left at 0 until generate-context.js post-save — rejected because Status Complete without refreshed continuity is exactly the drift the ladder is meant to prevent.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Refresh continuity completion_pct/recent_action/blockers across parent+003-012 to match Status Complete, or demote Status until continuity is saved.",
  "transitions": [{"iteration":2,"from":null,"to":"P1","reason":"Generalizes F004 across fleet"}]
}
```

```json
{
  "findingId": "F006",
  "claim": "Parent Phase Documentation Map still lists all 12 phases as Planned while every child reports Complete.",
  "evidenceRefs": ["spec.md:127-140", "spec.md:151"],
  "counterevidenceSought": "Re-verified all 12 child Status Complete lines. Checked graph-metadata.json for a derived last_active status that might override the map — map prose still claims coordination-truth authority.",
  "alternativeExplanation": "Map is intentional backlog of 'planned structure' not live status — rejected because column header is Status and Transition Rules call the map coordination truth.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Update all 12 Phase Documentation Map Status cells to Complete (or accurate non-Complete states) to match children.",
  "transitions": [{"iteration":2,"from":null,"to":"P1","reason":"Initial discovery"}]
}
```

```json
{
  "findingId": "F008",
  "claim": "012 checklist marks CHK-001..CHK-017 complete using one identical multi-claim evidence blob that does not uniquely support each checklist item and embeds the 53/72 top-3 mislabel.",
  "evidenceRefs": ["012-integration-verification-rollout/checklist.md:50-90"],
  "counterevidenceSought": "Diffed evidence strings across CHK-001, CHK-006, CHK-012, CHK-017 — byte-identical aside from list position. Compared to 003/004/008 checklists where evidence is claim-specific.",
  "alternativeExplanation": "Closing-phase convenience summary is acceptable if each claim was truly verified — still fails checklist_evidence integrity because a reader cannot audit which evidence supports which CHK.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Replace rubber-stamp blobs with per-CHK evidence pointers (or split a shared appendix with explicit CHK→bullet mapping) and correct the 53/72 top-3 citation.",
  "transitions": [{"iteration":2,"from":null,"to":"P1","reason":"Initial discovery"}]
}
```

```json
{
  "findingId": "F002",
  "claim": "REFINED: 53/72-as-top-3 mislabel is systemic across 003 checklist/tasks/implementation-summary and 012 checklist, not only 010/012 narrative tables.",
  "evidenceRefs": [
    "003-derived-regenerator-migration/checklist.md:84",
    "003-derived-regenerator-migration/tasks.md:60",
    "003-derived-regenerator-migration/implementation-summary.md:82,91",
    "012-integration-verification-rollout/checklist.md:50"
  ],
  "counterevidenceSought": "Confirmed 003 implementation-summary:91 explicitly knows pin is 55/72 yet still reports measured 53/72 under top-3 label in closure evidence elsewhere.",
  "alternativeExplanation": "Authors knowingly tracked a live 53/72 regime separate from the pin — still a labeling defect wherever 'top-3' and 'pinned baseline' are asserted against 53/72.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Same as iteration-1 F002 downgrade, plus scrub 003/012 checklist and tasks citations.",
  "transitions": [{"iteration":1,"from":null,"to":"P1","reason":"Initial"},{"iteration":2,"from":"P1","to":"P1","reason":"Propagation confirmed systemic"}]
}
```

## Assessment
- New findings ratio: 0.58
- Dimensions addressed: security (clean of P0/P1), traceability (F005/F006/F008), correctness refine (F002)
- Novelty: F008 rubber-stamp checklist is a grok-high-distinct angle; F002 root-cause (top-1/top-3 mixup) propagation mapped through 003 closure docs.

## Ruled Out
- Secrets in 010 scratch: ruled out (vocab false positives only).
- Unsafe writes in capture-top3.mjs: ruled out (tmpdir + read-only measurement).
- REQ-005 O1-O11 orphan opportunities: ruled out; ownership folds (O9→004, O10→011) are explicit in phase descriptions.

## Dead Ends
- None.

## Recommended Next Focus
Iteration 3 (final under max-iterations): D4 Maintainability + adversarial P0 replay of F001/F002/F003/F005/F006/F008. Breadth sweep 005/006/007/009/011 for consistency. Confirm no P0 in 008/011 cutover docs. Stabilize verdict trajectory for synthesis.

Review verdict: CONDITIONAL
