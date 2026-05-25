---
title: "Resource Map: deep-review skill release cleanup"
description: "Full path catalog of every deep-review skill artifact in audit scope plus this spec folder's own outputs. Per-row Note column reserves the audit_status field populated in phase 2. Phase-5 Augmentation section reserved for novel logic gaps surfaced in phase 5."
trigger_phrases:
  - "deep-review release cleanup resource map"
  - "artifact inventory"
  - "audit scope"
  - "files touched"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-resource-map-authored"
    next_safe_action: "run-strict-validate"
    blockers: []
    key_files:
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003008"
      session_id: "131-000-003-spec-author"
      parent_session_id: "131-000-003-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

# Resource Map

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Use this map alongside `spec.md` and `plan.md` when:
- Phase 2 audit dispatch needs an enumerable target list (every row drives a dispatch).
- Phase 4 alignment validation gate needs a complete artifact inventory to score.
- Phase 5 deep-research iterations need a baseline of "already in scope" so novel gaps are recognizable.
- A future reviewer or downstream packet needs a single-glance blast radius without reading `implementation-summary.md` end-to-end.

Pairs with `implementation-summary.md`, the summary narrates *what and why*. This map lists *which files*. Do not duplicate narrative, decisions, or test evidence here, those belong in `implementation-summary.md`, `decision-record.md`, or `checklist.md`.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: ~104 (95 deep-review artifacts + 11 spec-folder artifacts + a handful of external anchors)
- **By category**: READMEs=2, Documents=12, Skills=86, Specs=11, Scripts=3, Config=1, Meta=1
- **Missing on disk**: 0 at phase 1. Updated each phase
- **Scope**: All deep-review skill files under audit in phases 2-4, plus this spec folder's own deliverables, plus a small set of cross-system anchors cited in phase 3 README rewrite
- **Generated**: 2026-05-23T00:00:00Z (phase 1 baseline)

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> **Note column convention**: `audit_status:{PENDING|PASS|PASS_WITH_DEVIATIONS|FAIL}` populated by phase 2. Phase-4 validation match% appended after audit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/README.md` | Updated (phase 3 full rewrite) | OK | audit_status:PASS_WITH_DEVIATIONS, 452 LOC, tone anchor Public/README.md @ ~70% (ADR-005), structural anchor system-spec-kit/README.md |
| `.opencode/skills/deep-review/scripts/README.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 134 LOC, scripts/ subdir README, bug-scan only |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

> External markdown cited as anchors in phase 3 README rewrite or as standards references across phases 2-4. NOT modified.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `Public/README.md` | Cited | OK | Tone anchor (~70% intensity per ADR-005) |
| `.opencode/skills/system-spec-kit/README.md` | Cited | OK | Structural anchor (10-section pattern) |
| `.opencode/skills/sk-doc/references/global/hvr_rules.md` | Cited | OK | HVR rules, pass threshold 85+ |
| `.opencode/skills/sk-doc/references/skill_creation.md` | Cited | OK | Skill creation standards |
| `.opencode/skills/sk-doc/references/readme_creation.md` | Cited | OK | README creation standards |
| `.opencode/skills/sk-doc/references/feature_catalog_creation.md` | Cited | OK | Feature catalog standards |
| `.opencode/skills/sk-doc/references/manual_testing_playbook_creation.md` | Cited | OK | Playbook standards |
| `.opencode/skills/cli-devin/SKILL.md` | Cited | OK | Phase 5 RCAF + medium-density rule (single executor per ADR-001) |
| `.opencode/skills/sk-prompt-small-model/SKILL.md` | Cited | OK | Small-model dispatch sentinel |
| `.opencode/skills/sk-prompt/SKILL.md` | Cited | OK | Prompt-composition skill (RCAF/CLEAR) |
| `.opencode/skills/sk-code-review/SKILL.md` | Cited | OK | deep-review dispatches sk-code-review baseline per iteration |
| `.opencode/specs/.../000-release-cleanup/002-deep-research/spec.md` | Cited | OK | Sibling pattern reference (shipped 2026-05-23) |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> Every artifact under `.opencode/skills/deep-review/` in audit scope. Per-row `audit_status` populated in phase 2.

### 5.1 SKILL.md (1 file)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/SKILL.md` | Updated (version bump only, surgical audit) | OK | audit_status:PASS_WITH_DEVIATIONS, 540 LOC, v1.8.0.0->v1.9.0.0, Smart Router §2 PRESERVED by ADR-004 |

### 5.2 References (4 files, 2700 LOC total)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/references/convergence.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 727 LOC, convergence algorithm + stop conditions, template=skill_reference_template.md |
| `.opencode/skills/deep-review/references/loop_protocol.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 824 LOC, 4-phase lifecycle + lineage protocol |
| `.opencode/skills/deep-review/references/quick_reference.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 211 LOC, one-page cheat sheet |
| `.opencode/skills/deep-review/references/state_format.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 938 LOC, largest reference, canonical schemas for all state files |

### 5.3 Assets (6 files, 1101 LOC total)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/assets/deep_review_strategy.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 187 LOC, template=skill_asset_template.md |
| `.opencode/skills/deep-review/assets/deep_review_dashboard.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 138 LOC, dashboard template |
| `.opencode/skills/deep-review/assets/deep_review_config.json` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 92 LOC, default config |
| `.opencode/skills/deep-review/assets/runtime_capabilities.json` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 74 LOC, runtime capabilities |
| `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 116 LOC, iteration prompt template |
| `.opencode/skills/deep-review/assets/review_mode_contract.yaml` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 494 LOC, largest asset, mode contract spec |

### 5.4 Feature Catalog (21 files, ~1380 LOC total)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/feature_catalog/feature_catalog.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 351 LOC, root inventory, template=feature_catalog_template.md |
| `.opencode/skills/deep-review/feature_catalog/01--loop-lifecycle/01-initialization.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 50 LOC |
| `.opencode/skills/deep-review/feature_catalog/01--loop-lifecycle/02-iteration-dispatch.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 51 LOC |
| `.opencode/skills/deep-review/feature_catalog/01--loop-lifecycle/03-convergence-check.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 50 LOC |
| `.opencode/skills/deep-review/feature_catalog/01--loop-lifecycle/04-synthesis.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 48 LOC |
| `.opencode/skills/deep-review/feature_catalog/01--loop-lifecycle/05-memory-save.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 46 LOC |
| `.opencode/skills/deep-review/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 50 LOC |
| `.opencode/skills/deep-review/feature_catalog/02--state-management/01-jsonl-state-log.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 49 LOC |
| `.opencode/skills/deep-review/feature_catalog/02--state-management/02-strategy-tracking.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 48 LOC |
| `.opencode/skills/deep-review/feature_catalog/02--state-management/03-config-management.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 48 LOC |
| `.opencode/skills/deep-review/feature_catalog/02--state-management/04-findings-registry.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 48 LOC |
| `.opencode/skills/deep-review/feature_catalog/02--state-management/05-dashboard.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 47 LOC |
| `.opencode/skills/deep-review/feature_catalog/03--review-dimensions/01-correctness.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 48 LOC |
| `.opencode/skills/deep-review/feature_catalog/03--review-dimensions/02-security.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 48 LOC |
| `.opencode/skills/deep-review/feature_catalog/03--review-dimensions/03-traceability.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 48 LOC |
| `.opencode/skills/deep-review/feature_catalog/03--review-dimensions/04-maintainability.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 48 LOC |
| `.opencode/skills/deep-review/feature_catalog/04--severity-system/01-severity-classification.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 47 LOC |
| `.opencode/skills/deep-review/feature_catalog/04--severity-system/02-adversarial-self-check.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 46 LOC |
| `.opencode/skills/deep-review/feature_catalog/04--severity-system/03-claim-adjudication.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 48 LOC |
| `.opencode/skills/deep-review/feature_catalog/04--severity-system/04-verdicts.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 47 LOC |
| `.opencode/skills/deep-review/feature_catalog/04--severity-system/05-quality-gates.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 49 LOC |

### 5.5 Manual Testing Playbook (45 files + 1 shell script, ~4720 LOC total)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 682 LOC, root orchestrator, template=manual_testing_playbook_template.md |
| `.opencode/skills/deep-review/manual_testing_playbook/01--entry-points-and-modes/*.md` | Analyzed (3 files) | OK | audit_status:PASS_WITH_DEVIATIONS, 001-003, 86-87 LOC each |
| `.opencode/skills/deep-review/manual_testing_playbook/02--initialization-and-state-setup/*.md` | Analyzed (4 files) | OK | audit_status:PASS_WITH_DEVIATIONS, 004-007, 85-87 LOC each |
| `.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/*.md` | Analyzed (8 files) | OK | audit_status:PASS_WITH_DEVIATIONS, 008-015, 86-88 LOC each |
| `.opencode/skills/deep-review/manual_testing_playbook/04--convergence-and-recovery/*.md` | Analyzed (9 files) | OK | audit_status:PASS_WITH_DEVIATIONS, 015-023, 87-98 LOC each (note: legacy duplicate "015" filename overlap between dirs 03 and 04, flag for phase 2) |
| `.opencode/skills/deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/*.md` | Analyzed (4 files) | OK | audit_status:PASS_WITH_DEVIATIONS, 021-024, 88-89 LOC each (note: legacy duplicate "021-024" overlap with dir 04, flag for phase 2) |
| `.opencode/skills/deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/*.md` | Analyzed (5 files) | OK | audit_status:PASS_WITH_DEVIATIONS, 025-029, 88-102 LOC each |
| `.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/*.md` | Analyzed (6 files) | OK | audit_status:PASS_WITH_DEVIATIONS, 052-057, 97-117 LOC each |
| `.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 98 LOC, shell script, bug-scan only |
| `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/*.md` | Analyzed (6 files) | OK | audit_status:PASS_WITH_DEVIATIONS, 058-063, 66-71 LOC each |

### 5.6 Changelog (12 files, +1 added in phase 3)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/changelog/v1.0.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 70 LOC, format-only check |
| `.opencode/skills/deep-review/changelog/v1.1.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 63 LOC |
| `.opencode/skills/deep-review/changelog/v1.2.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 105 LOC |
| `.opencode/skills/deep-review/changelog/v1.3.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 92 LOC |
| `.opencode/skills/deep-review/changelog/v1.3.1.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 129 LOC |
| `.opencode/skills/deep-review/changelog/v1.3.2.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 87 LOC |
| `.opencode/skills/deep-review/changelog/v1.3.3.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 58 LOC |
| `.opencode/skills/deep-review/changelog/v1.4.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 35 LOC |
| `.opencode/skills/deep-review/changelog/v1.5.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 111 LOC |
| `.opencode/skills/deep-review/changelog/v1.6.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 127 LOC |
| `.opencode/skills/deep-review/changelog/v1.7.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 95 LOC |
| `.opencode/skills/deep-review/changelog/v1.8.0.0.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 68 LOC, current head |
| `.opencode/skills/deep-review/changelog/v1.9.0.0.md` | Created (phase 3) | PLANNED | audit_status:PASS_WITH_DEVIATIONS, authored at end of phase 3 per changelog-entry.schema.json |

### 5.7 Operator engagement spec

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/ds.yaml` | Cited | OK | 118 LOC, this engagement's source spec, NOT modified |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> This spec folder's own deliverables. Includes phase-2 / phase-4 / phase-5 outputs as PLANNED at phase-1 baseline.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/spec.md` | Created | OK | Level 3 |
| `.../003-deep-review/plan.md` | Created | OK | Level 3 with dependency graph |
| `.../003-deep-review/tasks.md` | Created | OK | T001-T119 across 5 phases |
| `.../003-deep-review/checklist.md` | Created | OK | Level 3 verification + sign-off |
| `.../003-deep-review/decision-record.md` | Created | OK | ADR-001 through ADR-005 + reserved ADR-006/007 |
| `.../003-deep-review/implementation-summary.md` | Created (skeleton) | OK | Filled post-phase-5 |
| `.../003-deep-review/resource-map.md` | Created | OK | This file |
| `.../003-deep-review/description.json` | Created | PLANNED | Auto-generated by generate-context.js |
| `.../003-deep-review/graph-metadata.json` | Created | PLANNED | Auto-generated by generate-context.js |
| `.../003-deep-review/audit-findings.jsonl` | Created (phase 2) | PLANNED | One JSON per line, schema-validated |
| `.../003-deep-review/validation-report.jsonl` | Created (phase 4) | PLANNED | One JSON per line, schema-validated |
| `.../003-deep-review/validation-report.md` | Created (phase 4) | PLANNED | Human-readable summary |
| `.../003-deep-review/research/iterations/iter-*-cli-devin.json` | Created (phase 5) | PLANNED | 10 iteration outputs |
| `.../003-deep-review/research/convergence-summary.md` | Created (phase 5) | PLANNED | Stop reason + signals |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

> Per template precedence: shell + node + cjs scripts under `scripts/` belong here. README inside scripts/ stays under §READMEs.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 1657 LOC, primary reducer, bug-scan only, no behavioral edits (ADR-002) |
| `.opencode/skills/deep-review/scripts/runtime-capabilities.cjs` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 114 LOC, runtime capability detection |
| `.opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh` | (Listed under §5.5 Skills per category precedence, manual_testing_playbook content belongs to the Skill bucket) | OK | Cross-ref only |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

> Reducer test fixtures. Read-only context for phase-2 bug-scan.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 27 LOC, fixture index |
| `.opencode/skills/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json` | Cited | OK | 42 LOC, fixture state |
| `.opencode/skills/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-dashboard.md` | Cited | OK | 100 LOC, fixture state |
| `.opencode/skills/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json` | Cited | OK | 269 LOC, fixture state |
| `.opencode/skills/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-strategy.md` | Cited | OK | 189 LOC, fixture state |
| `.opencode/skills/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/*.md` | Cited (3 files) | OK | 20-23 LOC each, iteration-001/002/003 fixtures |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

> Spec-folder JSON metadata (description.json, graph-metadata.json) lives under §Specs per template precedence. This category covers SKILL-level config not under §5.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/graph-metadata.json` | Analyzed | OK | audit_status:PASS_WITH_DEVIATIONS, 181 LOC, skill advisor input, not edited unless cascade forces it (then skill-graph compile required) |
| `.opencode/skills/deep-review/assets/*.json` | (Listed under §5.3 Skills per category precedence) | OK | Cross-ref only |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `CLAUDE.md` | Cited | OK | Governance, §1 CLI dispatch rule + small-model dispatch rule (load-bearing for phase 5) |
<!-- /ANCHOR:meta -->

---

## Phase-5 Augmentation

> Populated 2026-05-23 after step 5b merge. 33 cumulative logic gaps surfaced across 10 iterations of cli-devin SWE-1.6. **9 closed inline this packet** (4 P2 path-refs + 1 P2 SKILL.md clarification + 2 P0 doc rewrites + 1 P0 inline fix + 1 P1 cross-ref note). **24 deferred to follow-on with rationale below**. Full per-iter detail in `research/iterations/iter-{01..10}-cli-devin.json` + `research/convergence-summary.md`.

### Phase-5 fix log (inline-closed in this packet)

| LG-#### | Source iter | Severity | Surface | Action taken inline |
|---|---|---|---|---|
| LG-0017 | iter-03 | P2 | playbook DRV-017 line 47 | Path-ref fix: deep-research → deep-review |
| LG-0018 | iter-03 | P2 | playbook DRV-018 line 47 | Same |
| LG-0019 | iter-03 | P2 | playbook DRV-019 line 47 | Same |
| LG-0020 | iter-03 | P2 | playbook DRV-020 line 47 | Same |
| LG-0022 | iter-04 | P0 | convergence.md §Security-Sensitive Fix Overrides | Added `STATUS: SPEC ONLY (future implementation)` marker. Operators must enforce manually today. |
| LG-0024 | iter-05 | P2 | SKILL.md §4 ALWAYS rule 7 | Added "Owner: workflow, not reducer" note clarifying generate-context.js routing |
| LG-0025 | iter-06 | P0 | 5 dir-08 playbook files (058/059/061/062/063) | Test-path migration: system-spec-kit/mcp_server/tests/deep-loop/ → deep-loop-runtime/tests/integration/ |
| LG-0031 | iter-09 | P0 | convergence.md §6 LEGAL-STOP GATE BUNDLE | Added within-doc note flagging 7-vs-6 gate naming drift + 3rd column mapping conceptual ↔ event-shape names |
| LG-0032 | iter-09 | P1 | loop_protocol.md §Step-2 Check Convergence | Reconciled gate count (5 → 7) + cross-reference to convergence.md §Section-1 authoritative shape |
| (sweep) | iter-10 synthesis | P2 | DRV-010, DRV-014, DRV-016, DRV-030 (4 more files outside iter 3 sample) | Same path-ref scrub as LG-0017..LG-0020 |

### Phase-5 deferred (24 gaps requiring follow-on packets)

| LG-#### | Source iter | Severity | Surface | Deferred reason |
|---|---|---|---|---|
| LG-0001 | iter-01 | P1 | reduce-state.cjs vs state_format.md §3 (userPaused / stuckRecovery event handling) | ADR-002 reducer is bug-scan only, needs code change |
| LG-0002 | iter-01 | P2 | reduce-state.cjs vs state_format.md §3 (gate-name validation) | ADR-002 |
| LG-0003 | iter-01 | P1 | reduce-state.cjs reads only compositeStop, ignores rollingAvg + madScore | ADR-002 |
| LG-0004 | iter-01 | P1 | reduce-state.cjs zero impl for graphEvents | ADR-002, meta-pattern 2 cluster |
| LG-0005 | iter-01 | P1 | reduce-state.cjs drops scopeProof + affectedSurfaceHints fields | ADR-002 |
| LG-0006 | iter-01 | P1 | reduce-state.cjs zero impl for traceabilityChecks | ADR-002, meta-pattern 2 cluster |
| LG-0007 | iter-01 | P2 | searchCoverage/searchLedger/reviewDepthSchemaVersion undocumented in state_format.md | ADR-002 + needs doc-side spec authoring (scope expansion) |
| LG-0008 | iter-01 | P1 | reduce-state.cjs zero impl for content_hash two-tier deduplication | ADR-002 |
| LG-0009 | iter-02 | P1 | feature_catalog missing Resource Map Coverage Gate entry | Scope expansion (adding new catalog entries beyond surgical-edit) |
| LG-0010 | iter-02 | P1 | feature_catalog missing semanticNovelty + findingStability entries | Same |
| LG-0011 | iter-02 | P1 | feature_catalog missing Security-Sensitive Fix Overrides entry | Same |
| LG-0012 | iter-02 | P2 | feature_catalog missing Executor Selection Contract entry | Same |
| LG-0013 | iter-02 | P1 | feature_catalog/04--severity-system/05-quality-gates.md under-described (4 gate names not enumerated) | Scope expansion, meta-pattern 1 partial closure (cross-ref inline added, full enumeration deferred) |
| LG-0014 | iter-02 | P1 | feature_catalog missing graph_convergence dedicated entry | Scope expansion |
| LG-0015 | iter-02 | P2 | feature_catalog missing pause sentinel dedicated entry | Scope expansion |
| LG-0016 | iter-03 | P1 | playbook DRV-018 claims 3 quality gates vs runtime 7 | Meta-pattern 1: needs DRV-018 rewrite to 7-gate naming, rewriting playbook scenario is mid-scope, defer to follow-on that reconciles all gate-model surfaces together |
| LG-0021 | iter-04 | P2 | 4 thresholds doc in convergence.md live in yaml not config.json | Doc-clarity note only, deferred as design-correct split |
| LG-0023 | iter-05 | P1 | emitResourceMap CLI-flag-gated, not integrated into main reduceReviewState flow | ADR-002 (reducer behavior change) |
| LG-0026 | iter-06 | P1 | review-depth-reducer.vitest.ts in system-spec-kit/ while siblings in deep-loop-runtime/ | Architectural decision outside this packet (test location, not docs) |
| LG-0027 | iter-06 | P2 | v1.3.1.0 changelog typo (deep-review-expected behavior-parity.vitest.ts vs deep-review-contract-parity.vitest.ts) | Historical changelog preserved per AF-0019 |
| LG-0028 | iter-07 | P2 | No CP scenario for legacy state migration (scratch/ → review/) | Scope expansion (adding new CP-NNN test scenario) |
| LG-0029 | iter-07 | P2 | No CP scenario for session classification (resume / restart / completed-session) | Scope expansion |
| LG-0030 | iter-07 | P2 | No CP scenario for stuck detection and recovery flow | Scope expansion |
| LG-0033 | iter-10 | P1 | JSONL schema enforcement gap (reducer parseJsonlDetailed validates syntax only, not required fields) | ADR-002 (reducer behavior change) |

### Phase-5 backlog terminal states (007 remediation)

The `007-deep-review-phase5-backlog` arc drives every deferred gap to a terminal state. Doc-cluster gaps are resolved by `007/001-doc-cluster-remediation`, reducer gaps by `007/002-reducer-cluster-remediation`. LG-0013/LG-0016/LG-0031/LG-0032 were already closed by `006-gate-model-reconciliation`.

| LG-#### | Terminal state | Evidence |
|---|---|---|
| LG-0009 | FIXED (007/001) | `feature_catalog/01--loop-lifecycle/07-resource-map-coverage-gate.md` |
| LG-0010 | FIXED (007/001) | `feature_catalog/04--severity-system/06-convergence-signals.md` |
| LG-0011 | FIXED (007/001) | `feature_catalog/04--severity-system/07-security-sensitive-fix-overrides.md` |
| LG-0012 | FIXED (007/001) | `feature_catalog/01--loop-lifecycle/08-executor-selection-contract.md` |
| LG-0014 | FIXED (007/001) | `feature_catalog/02--state-management/06-graph-convergence-event.md` |
| LG-0015 | FIXED (007/001) | `feature_catalog/02--state-management/07-pause-sentinel.md` |
| LG-0007 | ALREADY CLOSED | `references/state_format.md` lines 469-582 document searchCoverage/searchLedger/reviewDepthSchemaVersion |
| LG-0028 | ALREADY CLOSED | DRV-006 (`step_migrate_legacy_review_state`) covers legacy state migration |
| LG-0029 | ALREADY CLOSED | DRV-005 covers resume/restart/completed session classification |
| LG-0030 | ALREADY CLOSED | DRV-019 covers stuck detection and recovery |
| LG-0021 | WON'T FIX | Design-correct split: convergence thresholds live in YAML by intent, not config.json |
| LG-0026 | WON'T FIX | Test-location is an architectural decision, not a docs gap |
| LG-0027 | WON'T FIX | Historical changelog filename preserved per AF-0019 chronological fidelity |
| LG-0001 | FIXED (007/002) | `deriveDashboardStatus` surfaces userPaused/stuckRecovery (PAUSED/RECOVERING) |
| LG-0002 | BY-DESIGN (007/002) | reducer is intentionally gate-name-agnostic (006); allowlist would reject future gates |
| LG-0003 | BY-DESIGN (007/002) | `computeConvergenceScore` reads compositeStop, the pre-blended composite of rollingAvg + MAD |
| LG-0004 | BY-DESIGN (007/002) | graphEvents are consumed by the MCP coverage-graph handler into deep-loop-graph.sqlite, not the JSONL reducer |
| LG-0005 | FIXED (007/002) | `deltaRecordToFinding` carries scopeProof + affectedSurfaceHints into registry |
| LG-0006 | FIXED (007/002) | `buildTraceabilityRollup` aggregates traceabilityChecks into the registry |
| LG-0008 | FIXED (007/002) | `collapseFindingsByDedupKey` applies content_hash two-tier dedup per SKILL.md 8.1 |
| LG-0023 | BY-DESIGN (007/002) | emitResourceMap `--emit-resource-map` gating is the design; synthesis passes the flag |
| LG-0033 | FIXED (007/002) | `validateReviewRecordFields` adds additive field-level warnings per state_format rules |

### Convergence signal

| Iter | Novel | Dupes | Trend |
|---:|---:|---:|---|
| 1 | 8 | 0 | initial burst |
| 2 | 7 | 0 | sustained |
| 3 | 5 | 0 | mild dropoff |
| 4 | 2 | 0 | dropoff (with first P0) |
| 5 | 2 | 14 | saturation visible (70% dup rate) |
| 6 | 3 | 0 | new dimension (cross-skill) reset signal |
| 7 | 3 | 4 | new dimension reset, then saturation again |
| 8 | **0** | 0 | **first plateau** |
| 9 | 2 | 0 | within-doc dimension reset |
| 10 | 1 | 0 | capstone (meta-patterns) |

Saturation confirmed at iter 8 (zero novel) and re-confirmed by the 1-novel-gap output of iter 10 capstone. ADR-001's no-early-stop discipline held: 10 iters ran regardless. Per-iter wall-clock 88-170 s (mean 128 s). Total phase-5 dispatch wall-clock 22.4 min.

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

**Path conventions:**
- Paths are **relative to the repo root** (e.g., `.opencode/skills/deep-review/SKILL.md`), not absolute.
- One path per row. Glob suffixes (`/**`, `/*`) used in §5.5 where every file under the glob received the same Action (Analyzed).

**Action column:** what this packet did to the file. `Analyzed` = read for audit context (phase 2 default). `Updated` = surgical edit applied. `Created` = new file. `Cited` = external doc referenced as anchor. `Validated` = phase-4 validation pass.

**Status column:** state at the moment this map was written/updated. `OK` = exists on disk now. `PLANNED` = will be created in a downstream phase. `MISSING` = referenced but absent (no such case at phase-1 baseline).

**Category precedence applied here:**
1. `Specs > Config`, spec-folder JSON belongs to §Specs.
2. `Meta > READMEs`, root-level CLAUDE.md sits under §Meta.
3. `Skills > Documents`, every markdown inside `.opencode/skills/deep-review/**` lives in §5.
4. `Tests > Scripts`, §8 Tests covers fixtures under `scripts/tests/`.

**Category deletion:**
- §3 Commands, §4 Agents all empty for this packet and intentionally omitted.
- Original numbering preserved (§5 Skills, §6 Specs, §7 Scripts, §8 Tests, §9 Config, §10 Meta) per template author rule (no renumbering after deletion).

**Phase progression:**
- Phase 1 (baseline): every PENDING row populated. PLANNED rows reserved for downstream creation.
- Phase 2: Note column `audit_status:PASS_WITH_DEVIATIONS` updated to `PASS` / `PASS_WITH_DEVIATIONS` / `FAIL` per artifact.
- Phase 3: README.md row's `audit_status` updated post-rewrite. V1.9.0.0.md row flipped PLANNED -> OK.
- Phase 4: per-row validation match% appended to Note column from `validation-report.jsonl`.
- Phase 5: Phase-5 Augmentation section populated from `research/iterations/*.json` merge.

**Size budget:**
- This file is intentionally larger than the 250-LOC suggested cap because the audit scope (~95 deep-review artifacts) needs row-level visibility for phase 2 dispatch. Glob-grouping is applied where it does not erode that visibility (§5.5 manual testing playbook sub-categories collapsed by directory. §5.6 changelog enumerated since each file gets format-checked separately).

**Reference reading:**
- `.opencode/skills/system-spec-kit/templates/README.md` (template architecture)
- `.opencode/skills/system-spec-kit/references/templates/level_specifications.md` (level-by-level usage)
- `.opencode/skills/system-spec-kit/SKILL.md` §3 Canonical Spec Docs
- `.opencode/skills/sk-doc/references/skill_creation.md` (skill-folder standards)
- `../002-deep-research/resource-map.md` (sibling pattern reference)
<!-- /ANCHOR:author-instructions -->
