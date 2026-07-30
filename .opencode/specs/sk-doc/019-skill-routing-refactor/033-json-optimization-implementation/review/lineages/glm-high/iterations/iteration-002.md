# Iteration 2: D2 Security + D3 Traceability — stale phase map, systemic continuity rot, pin propagation, O1-O11 coverage

## Focus
- Dimensions: D3 Traceability (primary), D2 Security (secondary). D1 correctness findings re-verified where they cross into traceability.
- Files reviewed: parent `spec.md` (Phase Documentation Map lines 127-151); all 12 child `spec.md` frontmatter `_memory.continuity` blocks; `003-derived-regenerator-migration/checklist.md` (CHK-031); `008-manual-to-edges-migration/checklist.md` (full evidence spot-check); `002-baseline-capture/baseline/routing-baseline.json` (top3_new block — F002 pin lock); `002-baseline-capture/scripts/capture-top3.mjs` (security); `010-parent-intent-projection-spike/scratch/*` (security — committed scratch); `004-scaffold-journey/spec.md` (O9), `011-command-metadata-ingestion/spec.md` (O7+O10).
- Scope: spec-vs-actual status alignment, checklist evidence integrity, O1-O11 opportunity coverage, security posture of captured scripts and scratch artifacts.

## Scorecard
- Dimensions covered: traceability (primary), security (primary); correctness (refined F002)
- Files reviewed: 18+ (12 child spec frontmatters, 2 checklists, 4 baseline/scratch artifacts, 2 child specs for O-mapping)
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=1 (F002 strengthened) P2=0
- New findings ratio: 0.55

## Findings

### P0, Blocker
(none)

### P1, Required

- **F005**: Systemic stale continuity frontmatter across 10/12 child specs. `003` through `012` (10 phases) all carry `spec.md` frontmatter `_memory.continuity.completion_pct: 0`, `recent_action: "Authored planned phase spec"`, and unresolved `blockers` lists — while their own spec.md bodies mark `Status: Complete` and their `checklist.md` frontmatters record `completion_pct: 100`. Only `001` and `002` have `completion_pct: 100` in the spec.md frontmatter. The spec.md `_memory.continuity` block is a documented continuity surface (the program's own ADR-004 names `implementation-summary.md` as the primary resume surface, but spec.md frontmatter is a secondary machine-readable continuity input that 10/12 phases leave stale). This generalizes F004 from a single 010 instance to a program-wide metadata defect. [SOURCE: 003-derived-regenerator-migration/spec.md:17-19, 004-scaffold-journey/spec.md frontmatter, 005..012 spec.md frontmatters, 003-derived-regenerator-migration/checklist.md frontmatter completion_pct:100]

- **F006**: Parent Phase Documentation Map is stale for every child. `spec.md:127-140` (the Phase Documentation Map) lists all 12 children with Status "Planned", while every one of the 12 child `spec.md` bodies self-reports `Status: Complete`. The parent explicitly designates this map as "the coordination truth" (`spec.md:151`: "this parent map is the coordination truth, detailed execution stays in the children"). A coordination-truth table that is wrong about all 12 of its 12 rows is a high-priority traceability defect: any operator or downstream phase reading the parent to determine program state is misled. [SOURCE: spec.md:127-140, spec.md:151, 001..012/spec.md Status: Complete]

### P2, Suggestion

- **F007**: Committed scratch patched derived block in 010. `git ls-files` confirms `010-parent-intent-projection-spike/scratch/sk-doc-derived-patched.json` (a full patched `derived` block for sk-doc) is committed to the repo, alongside `candidates.json`, `DESIGN.md`, and `project-router-vocab.cjs`. The decision-record (ADR-001 line 88, ADR-002 line 117) states the patched block is "scratch-only until a separate phase ships it" and "live file trap-restored". A committed full-shape `derived` block under a non-scratchignored path could be mistaken for a live file or accidentally copied over a real `graph-metadata.json`. Recommend adding a `scratch/README.md` or `.gitignore` carve-out note clarifying these are non-live spike artifacts, or moving them under a `scratch/` that is gitignored. No secret exposure; security posture is otherwise clean. [SOURCE: 010-parent-intent-projection-spike/scratch/sk-doc-derived-patched.json, 010-parent-intent-projection-spike/decision-record.md:88,117]

### Refined
- **F002** (refined, P1 unchanged): The 53/72-vs-55/72 pin inconsistency is systemic, not isolated to 012. `003-derived-regenerator-migration/checklist.md` CHK-031 evidence cites "top-3 capture identical 176/195, 53/72 with change applied vs reverted" — so 003 also measured against 53/72. The 53/72 figure now appears in 003 CHK-031, 010 ADR-002 ship bar (line 113), and 012 final capture (line 12), while the actual pinned artifact (`002-baseline-capture/baseline/capture-top3.json` and `routing-baseline.json` `metrics.top3_new.holdout_top3`) records 55/72 (0.7639). Re-verified this iteration: `routing-baseline.json` `top3_new.holdout_top3 = {correct: 55, total: 72, accuracy: 0.7639}`. The pin is definitively 55/72; three downstream phases cite 53/72. [SOURCE: 002-baseline-capture/baseline/routing-baseline.json top3_new, 003-derived-regenerator-migration/checklist.md CHK-031, 010-parent-intent-projection-spike/decision-record.md:113, 012-integration-verification-rollout/results/final-corpus-capture.md:12]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:127-140 (F006), spec.md:80 (F001) | Parent normative claims (Phase Map status, REQ-001 wording) do not resolve to child actuals |
| checklist_evidence | pass | hard | 003/checklist.md, 008/checklist.md | Every [x] carries an [evidence: ...] citation; CHK-051 (003) unchecked with recorded deferral to 012; 008 corpus-gate evidence byte-identical both regimes |
| skill_agent | notApplicable | advisory | - | spec-folder target |
| agent_cross_runtime | notApplicable | advisory | - | spec-folder target |
| feature_catalog_code | pass | advisory | 004/spec.md (O9), 011/spec.md (O7+O10), 001+003 (O1), 010 (O8) | All O1-O11 map to an owning phase's acceptance criteria per REQ-005; O9→004, O10→011 confirmed by spec-body O-number references |
| playbook_capability | notApplicable | advisory | - | no playbook scenarios in scope |

## Claim Adjudication Packets

```json
{
  "findingId": "F005",
  "claim": "10 of 12 child specs carry stale _memory.continuity frontmatter (completion_pct: 0, unresolved blockers, 'Authored planned phase spec') while their spec.md bodies and checklists report Complete/completion_pct 100.",
  "evidenceRefs": ["003-derived-regenerator-migration/spec.md:17-19", "003-derived-regenerator-migration/checklist.md frontmatter", "004-scaffold-journey/spec.md frontmatter", "012-integration-verification-rollout/spec.md frontmatter"],
  "counterevidenceSought": "Grepped completion_pct across all 12 child spec.md frontmatters — 003-012 all return 0; 001 and 002 return 100. Cross-checked 003's checklist.md frontmatter which returns completion_pct: 100 and recent_action 'Verified regenerator + gate + corpus-neutral fleet pass' — so the checklist frontmatter was updated but the spec.md frontmatter was not, within the same phase.",
  "alternativeExplanation": "Could be intentional if the spec.md frontmatter is never treated as a continuity surface and only implementation-summary.md matters. But the field is named _memory.continuity with a completion_pct integer and recent_action string — machine-readable continuity metadata that is wrong. Even if secondary, 10/12 stale is a hygiene defect worth fixing.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If the program formally documents that spec.md _memory.continuity is not a resume surface (only implementation-summary.md is) AND removes or relocates the completion_pct field, downgrade to P2.",
  "transitions": [{"iteration":2,"from":null,"to":"P1","reason":"Initial discovery; generalizes F004"}]
}
```

```json
{
  "findingId": "F006",
  "claim": "The parent Phase Documentation Map lists all 12 children as Planned while all 12 self-report Complete, and the parent designates this map as the coordination truth.",
  "evidenceRefs": ["spec.md:127-140", "spec.md:151", "001-derived-authority-decision/spec.md Status: Complete", "012-integration-verification-rollout/spec.md Status: Complete"],
  "counterevidenceSought": "Re-read the full Phase Documentation Map (spec.md:124-152) and re-checked all 12 child spec.md Status fields via grep — every child reports Complete. No child reports Planned. The map's Status column is uniformly wrong.",
  "alternativeExplanation": "Could be argued the map is a planning-time artifact frozen at authoring and not meant to track execution status. But the column is literally headed 'Status' and the parent's own Phase Transition Rules (line 151) call this map 'the coordination truth' — a coordination-truth table with 12/12 wrong status rows is not a frozen planning artifact, it is stale.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "If the Status column is renamed to 'Planning Status' and a separate 'Execution Status' column is added (or the map is explicitly documented as a frozen planning snapshot not tracking execution), downgrade to P2.",
  "transitions": [{"iteration":2,"from":null,"to":"P1","reason":"Initial discovery"}]
}
```

```json
{
  "findingId": "F007",
  "claim": "010's scratch/sk-doc-derived-patched.json is a committed full-shape patched derived block that could be mistaken for a live graph-metadata derived file.",
  "evidenceRefs": ["010-parent-intent-projection-spike/scratch/sk-doc-derived-patched.json", "010-parent-intent-projection-spike/decision-record.md:88", "010-parent-intent-projection-spike/decision-record.md:117"],
  "counterevidenceSought": "Ran git ls-files on the scratch/ dir — all 4 scratch files (DESIGN.md, candidates.json, project-router-vocab.cjs, sk-doc-derived-patched.json) are tracked. Checked the decision-record which states the patched block is scratch-only and trap-restored. No .gitignore in the scratch dir.",
  "alternativeExplanation": "Committing scratch artifacts is legitimate for reproducibility of a design spike — the NO-SHIP verdict's evidence should be auditable. The concern is purely that a full derived block sitting in a tracked file at a graph-metadata-like shape is a confusion hazard, not a live-data risk.",
  "finalSeverity": "P2",
  "confidence": 0.8,
  "downgradeTrigger": "If a scratch/README.md or .gitignore note clarifies these are non-live spike artifacts, downgrade to advisory (no severity).",
  "transitions": [{"iteration":2,"from":null,"to":"P2","reason":"Initial discovery"}]
}
```

## Assessment
- New findings ratio: 0.55 (3 new + 1 refined; severity-weighted novelty declining as expected on iteration 2)
- Dimensions addressed: traceability (primary), security (primary), correctness (refined)
- Novelty justification: F005 generalizes the iteration-1 F004 single-instance to a 10/12 systemic defect; F006 is a new high-visibility traceability finding (parent coordination-truth stale on all 12 rows); F007 is a new security/maintainability advisory on committed scratch. F002 refined with 003 CHK-031 evidence locking the pin at 55/72 and showing 53/72 propagated to 3 phases.

## Security Dimension Verdict
PASS (with F007 advisory). No credentials/secrets in any artifact. 003 (highest-blast regenerator) carries explicit path-traversal guards (CHK-040: keyFileExists/skillFileExists reject absolute paths + assert resolved path stays under repo/skill root). 010 scratch writer confines writes to scratch/ (project-router-vocab.cjs:228-229). capture-top3.mjs is read-only (mkdtempSync DB, writes only stdout). 008 corpus-gated with byte-identical both-regime evidence.

## Ruled Out
- "O1-O11 coverage gap (REQ-005 violation)": ruled out. feature_catalog_code overlay passes — every O1-O11 maps to an owning phase's acceptance criteria (O9→004, O10→011 confirmed by spec-body O-number references; O1→001+003; O8→010; etc.).
- "Security vulnerability in captured scripts": ruled out. capture-top3.mjs and project-router-vocab.cjs are read-only / scratch-confined respectively; no injection, no credential exposure, no unsafe deserialization.

## Dead Ends
- 008 checklist header prose ("All items stay [ ] until the migration executes (Planned phase...)") is stale relative to its all-[x] items, but this is cosmetic prose not a load-bearing claim — not promoted to a finding.

## Recommended Next Focus
Iteration 3 (final, max-iterations): D4 Maintainability + adversarial P0 replay + breadth sweep. (a) Adversarially re-attack F001/F002/F003/F005/F006 — attempt to refute each P1 by finding an escape clause or counter-artifact; any P1 that survives replay stays P1, any that collapses is downgraded. (b) Breadth sweep across the remaining un-touched child specs (005, 006, 007, 009, 011) for maintainability/consistency issues — spec/plan/tasks/checklist internal alignment, deferral rationales, rollback documentation. (c) Confirm no P0 hides in the 008 manual-to-edges migration (routing-changing) or 011 command-bridge cutover (hottest file). (d) Finalize the verdict trajectory for synthesis.

Review verdict: CONDITIONAL
