---
title: "Feature Specification: deep-ai-council skill release cleanup (000-release-cleanup/004-deep-ai-council)"
description: "Audit, align, and re-baseline the deep-ai-council skill (v2.0.0.0) against current sk-doc templates and HVR standards before downstream evolution work. Five sequential phases produce a release-ready skill folder, a converged resource map, and a human-reviewed validation report."
trigger_phrases:
  - "deep-ai-council release cleanup"
  - "004-deep-ai-council"
  - "ai council skill audit"
  - "alignment validation gate"
  - "deep-ai-council deep-research loop"
  - "sk-doc conformance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/004-deep-ai-council"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-spec-authored"
    next_safe_action: "author-remaining-phase-1-artifacts"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - "resource-map.yaml"
      - "schemas/audit-finding.schema.json"
      - "schemas/changelog-entry.schema.json"
      - "schemas/validation-report.schema.json"
      - "schemas/iteration-output.schema.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004002"
      session_id: "131-000-004-spec-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase 5 toolchain: all 10 iterations cli-devin SWE-1.6 (per skill workflows), orchestrated by the native deep-research loop"
      - "Resource-map format: machine-readable resource-map.yaml (operator-directed; diverges from sibling 002 resource-map.md)"
      - "Edit aggression: surgical, audit-first, fix only deviations"
      - "Documentation level: 3 (multi-phase, architectural, ~100 artifacts in audit scope)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Feature Specification: deep-ai-council skill release cleanup

---

## EXECUTIVE SUMMARY

The `deep-ai-council` skill (v2.0.0.0) is a mature planning-only council capability — multi-seat deliberation, two-of-three convergence, packet-local `ai-council/**` artifact persistence, and a derived council-graph projection. It pre-dates the most recent sk-doc template revisions and has never been audited end-to-end against the current creation standards. Before downstream evolution work in the `131-deep-skill-evolution` arc continues, this sub-phase brings the skill's documentation surface to 100% sk-doc conformance, fixes latent bugs, rewrites the README in current marketing-leaning HVR voice, and seeds a deep-research loop on top of a validated baseline.

**Key Decisions**: All 10 phase-5 iterations run on cli-devin SWE-1.6 (per skill workflows, orchestrated by the native deep-research loop); surgical edits only across phases 2-3; `resource-map.yaml` as the canonical machine-readable artifact→template map (operator-directed; diverges from sibling 002's `resource-map.md`); Smart Router (SKILL.md §3) preserved by default.

**Critical Dependencies**: Phase 4 is a blocking human-approval gate before any phase-5 dispatch begins.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Last Updated** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup` (lean grouping node — only `graph-metadata.json`, no parent `spec.md`) |
| **Arc Spec** | `../../spec.md` (`131-deep-skill-evolution` root) |
| **Sibling Phases** | `001-deep-loop-runtime`, `002-deep-research`, `003-deep-review`, `005-deep-agent-improvement`, `006-gate-model-reconciliation`, `007-deep-review-phase5-backlog` (separate scope) |
| **Target Skill** | `.opencode/skills/deep-ai-council/` (v2.0.0.0) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `deep-ai-council` skill carries 477 lines of SKILL.md, 270 lines of README, 11 references (~2,470 lines), 32 feature-catalog entries, 33 manual-testing-playbook files (1 orchestrator + 32 scenarios across 9 categories), 5 changelog versions, and a substantial `scripts/` tree (5 top-level `.cjs` + 6 `lib/` files + 5 `tests/` files + 3 sub-READMEs). None of this content has been audited against the current `sk-doc` templates (`assets/skill/*` + `references/*`), and the README has not been refreshed against the HVR voice standards or the system-spec-kit structural pattern.

Phase-1 reconnaissance already spotted candidate drift (to be **verified** in phase 2, not assumed — per the false-positive-P0 discipline):

- **SKILL.md §7** "Quality Targets" claims the playbook has "18 scenarios across 7 categories", while §3 and the README claim 32 scenarios across 9 categories and the directory actually contains 32 scenario files across 9 categories.
- **README §4 STRUCTURE** tree and §10 changelog list show only `v1.0.0.0` / `v1.1.0.0`, but the changelog head is `v2.0.0.0` (5 versions on disk).
- **feature_catalog/** has 32 category entries but no root `feature_catalog.md` inventory (sibling skills carry one).

Latent path-reference rot, broken MCP tool names, and HVR-noncompliant prose are likely present and ship-blocking for the wider arc.

### Purpose

Deliver a release-ready `deep-ai-council` skill folder: every documentation artifact aligned 1:1 to a current sk-doc template, README rewritten to a marketing-leaning HVR voice anchored at ~70% of the root `Public/README.md` intensity, and a deep-research loop run on top of the validated baseline so any logic gaps not captured during planning are surfaced and merged into `resource-map.yaml` before downstream evolution work begins.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit every artifact under `.opencode/skills/deep-ai-council/` against the sk-doc template that owns its document class (`SKILL.md`, `README.md`, references, feature catalog, manual testing playbook, changelog, scripts + scripts READMEs).
- Surgical fixes for P0/P1 audit findings; P2 deferred with explicit rationale recorded in `audit-findings.jsonl`.
- Full rewrite of `README.md` to the system-spec-kit structural pattern with HVR score ≥85 and tone anchored at ~70% of `Public/README.md` intensity.
- One new changelog entry (`changelog/v2.1.0.0.md`) summarizing all phase-1-through-3 changes; SKILL.md version frontmatter bumped `2.0.0.0` → `2.1.0.0`.
- Per-artifact alignment validation report (`validation-report.md` + `validation-report.jsonl`) gated by human approval before phase 5.
- 10 deep-research iterations, all on cli-devin SWE-1.6 (per skill workflows), orchestrated by the native `/deep:start-research-loop`; converged logic gaps merged into the `resource-map.yaml` `phase_5_augmentation` block.

### Out of Scope

- Sibling phases under `000-release-cleanup/` (`001-deep-loop-runtime`, `002-deep-research`, `003-deep-review`, `005-deep-agent-improvement`, `006-gate-model-reconciliation`, `007-deep-review-phase5-backlog`) — independent cleanup packets owned by separate dispatches.
- The shared `000-release-cleanup` parent `graph-metadata.json` — already lists this child; not modified here (its missing `007` entry is a pre-existing staleness outside this packet's scope).
- Cross-skill refactoring (`deep-research`, `deep-review`, `deep-loop-runtime`) — touched only through cross-system reference naming in the README rewrite, never modified.
- Behavioral/algorithmic changes to scripts under `.opencode/skills/deep-ai-council/scripts/` — bug-scan + path/syntax verification only, no feature changes and no template enforcement on code.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../004-deep-ai-council/spec.md` | Create | This file |
| `.../004-deep-ai-council/plan.md` | Create | Phase-by-phase strategy |
| `.../004-deep-ai-council/tasks.md` | Create | Granular task ledger |
| `.../004-deep-ai-council/checklist.md` | Create | Level-3 verification checklist |
| `.../004-deep-ai-council/decision-record.md` | Create | ADRs anchoring locked decisions |
| `.../004-deep-ai-council/implementation-summary.md` | Create | Skeleton; filled post-implementation |
| `.../004-deep-ai-council/resource-map.yaml` | Create | Machine-readable artifact inventory + phase-5 merge slot |
| `.../004-deep-ai-council/schemas/*.json` | Create | 4 JSON schemas (audit-finding, changelog-entry, validation-report, iteration-output) |
| `.../004-deep-ai-council/description.json` | Create | Spec-folder metadata (hand-authored) |
| `.../004-deep-ai-council/graph-metadata.json` | Create | Graph entry (hand-authored; parent already wired) |
| `.opencode/skills/deep-ai-council/**` | Modify | Surgical phase-2 fixes per audit findings |
| `.opencode/skills/deep-ai-council/README.md` | Rewrite | Full rewrite per phase 3 |
| `.opencode/skills/deep-ai-council/SKILL.md` | Modify | Version bump `2.0.0.0` → `2.1.0.0` (+ any surgical phase-2 fix) |
| `.opencode/skills/deep-ai-council/changelog/v2.1.0.0.md` | Create | Summary of phase-1-through-3 changes |
| `.../004-deep-ai-council/audit-findings.jsonl` | Create (phase 2) | One finding per line, schema-validated |
| `.../004-deep-ai-council/validation-report.{md,jsonl}` | Create (phase 4) | Per-artifact alignment report |
| `.../004-deep-ai-council/research/iterations/iter-*-cli-devin.json` | Create (phase 5) | 10 iteration outputs |
| `.../004-deep-ai-council/research/convergence-summary.md` | Create (phase 5) | Reason for stop |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Spec folder passes `validate.sh --strict` | Exit code 0 after every phase |
| REQ-002 | Every audit finding logged to `audit-findings.jsonl` validates against `schemas/audit-finding.schema.json` | `ajv validate -s schemas/audit-finding.schema.json -d audit-findings.jsonl` exits 0 (or manual equivalence if ajv absent) |
| REQ-003 | Phase-4 validation gate produces `validation-report.md` and waits for human approval before phase 5 | ADR-006 added to `decision-record.md` recording approval before any phase-5 dispatch |
| REQ-004 | Phase-5 deep-research iterations run one at a time with a between-iter sweep that PRESERVES `devin` | No two concurrent deep-research runner processes; sweep kills `codex\|opencode\|deep-research-{runner,monitor}` orphans but never `devin --print` or `/tmp/devin-*` |
| REQ-005 | Smart Router section (`SKILL.md §3`) preserved unless other changes cascade | If touched, ADR-005 added with explicit rationale |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | README HVR score ≥85 | Self-scored against `.opencode/skills/sk-doc/references/global/hvr_rules.md` rubric |
| REQ-011 | README covers every unique feature each with what + why + how-it-connects | Feature list mapped to `feature_catalog/**` inventory (32 entries across 9 categories) |
| REQ-012 | Every cross-system connection named with explicit target path | Connections listed in `plan.md` §Phase-3 cross-system table |
| REQ-013 | All P0/P1 audit findings either resolved with commit ref or deferred with rationale | Status column populated in `audit-findings.jsonl` |
| REQ-014 | Phase-5 convergence reached within 10 iterations | Reason logged in `research/convergence-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict validator exits 0 on the spec folder after every phase.
- **SC-002**: 100% of audited artifacts either pass template conformance or have a deviation entry with severity and rationale.
- **SC-003**: README rewrite reaches HVR score ≥85 with every unique feature covered (what + why + how-it-connects).
- **SC-004**: Phase-4 validation report is reviewed and approved by a human before phase 5 begins.
- **SC-005**: 10 deep-research iterations archived; converged logic gaps merged into `resource-map.yaml` `phase_5_augmentation`.
- **SC-006**: `skill_advisor.py` continues to surface the `deep-ai-council` skill at threshold 0.8 after skill-graph recompile.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Smart Router (SKILL.md §3) edited unintentionally | High — breaks resource discovery for the skill | Phase-2 explicit guard; ADR-005 required if touched |
| Risk | Hand-authored `graph-metadata.json` drifts from validator-expected shape | Medium — strict validate fails | Mirror sibling 002 shape exactly; validate after write |
| Risk | Phase-5 dispatch contends with parallel devin tracks on this Mac | Medium — swap thrash, wall-clock degrades | One iteration at a time; sweep non-devin orphans only; PRESERVE devin |
| Risk | False-positive P0s from candidate drift list | Medium — wasted edits | Verify every candidate against actual template + file before editing |
| Dependency | `devin` binary reachable + authenticated | Phase 5 blocked if absent | Verify at phase-5 prologue; smoke-test `devin --print` |
| Dependency | Strict validator (`scripts/spec/validate.sh`) | Every phase exit blocked if missing | Verified present at plan time |
| Dependency | `sk-doc` templates + `hvr_rules.md` | Phases 1-4 blocked if missing | Verified present at plan time |
| Dependency | `skill_graph_compiler.py` | Graph drift if not run after metadata edits | Run after any `graph-metadata.json` change |
| Risk | CLI dispatch under heavy parallelism degrades reliability | Medium — fresh dispatches silently fail | Ceiling 1 concurrent during phase 5 |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Strict validator completes in <10s per spec-folder invocation.
- **NFR-P02**: Per-iteration phase-5 dispatch budget ≤15 min wall-clock (cli-devin SWE-1.6 under RCAF).

### Security
- **NFR-S01**: No secrets committed; no credentials embedded in any phase-5 dispatch prompt.
- **NFR-S02**: Surgical edits respect SCOPE LOCK — no out-of-scope writes during phase 2.

### Reliability
- **NFR-R01**: Phase-4 validation gate is binary (pass with explicit human approval, or stop).
- **NFR-R02**: Every state file (`audit-findings.jsonl`, `validation-report.jsonl`, `research/iterations/*.json`) is append-only and schema-validated before being read by a downstream phase.

---

## 8. EDGE CASES

### Data Boundaries
- **Empty audit findings**: If phase 2 finds zero deviations, `audit-findings.jsonl` is empty and `resource-map.yaml` gets `audit_status: PASS` for every row.
- **Phase-5 zero novel gaps**: If all 10 iterations converge with no new gaps, the `phase_5_augmentation` block is empty and documents that fact explicitly with the convergence reason.
- **Smart Router unchanged**: If phase 2 leaves SKILL.md §3 untouched (expected default), ADR-005 is not authored.

### Error Scenarios
- **Validator exits 1 (warnings)**: Reviewed and either fixed or accepted with rationale recorded in the relevant phase's exit notes.
- **Validator exits 2 (errors)**: HARD BLOCKER. Fix before claiming phase complete.
- **devin unreachable at phase 5**: STOP, ask user. Do not silently substitute a different executor.
- **Candidate finding fails verification in phase 2**: Drop it from `audit-findings.jsonl`; do not edit on an unverified premise.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | ~100 artifacts in audit scope; 7 new spec docs + 4 schemas; 10 iteration outputs |
| Risk | 13/25 | Phase-4 gate, Smart Router protection, dispatch discipline, hand-authored metadata |
| Research | 12/20 | 10-iteration deep-research loop with convergence criteria |
| Multi-Agent | 6/15 | Phase 5 single-executor (cli-devin SWE-1.6) orchestrated by native loop |
| Coordination | 8/15 | Sequential phase gating with one human-approval point |
| **Total** | **57/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Smart Router rewrite cascades into runtime regressions | H | L | ADR-005 gate + post-edit advisor probe |
| R-002 | Phase-5 dispatch contends with parallel devin tracks | M | M | One-at-a-time discipline + devin-preserving sweep |
| R-003 | devin binary unreachable / unauthenticated at phase 5 | H | L | Smoke-test at phase prologue; STOP if down |
| R-004 | Candidate drift list yields false-positive P0s | M | M | Verify each against template + file before editing |
| R-005 | Audit findings exceed surgical-edit scope | M | M | Defer P2 with rationale; escalate P0/P1 if cascade unavoidable |
| R-006 | README HVR score <85 after rewrite | M | M | Iterate until threshold reached; do not commit below 85 |
| R-007 | Hand-authored metadata fails strict validate | M | L | Mirror sibling 002 shape; validate immediately |

---

## 11. USER STORIES

### US-001: Skilled maintainer ships a release-ready skill folder (P0)

**As a** senior skill maintainer, **I want** the `deep-ai-council` skill folder to conform 1:1 to current sk-doc templates and HVR standards, **so that** downstream evolution work in the 131 arc builds on a clean substrate.

**Acceptance Criteria**:
1. Given the audit completes, when I run `validate.sh --strict` on the spec folder, then exit code is 0.
2. Given the README rewrite ships, when I score it against `hvr_rules.md`, then the score is ≥85.
3. Given the validation gate runs, when phase 4 emits the report, then phase 5 cannot start without an ADR-006 approval entry.

### US-002: Deep-research loop surfaces logic gaps not seen at planning (P1)

**As a** senior skill maintainer, **I want** to run a 10-iteration deep-research loop on the cleaned skill baseline, **so that** any logic gaps not visible during phase-1 planning are merged into `resource-map.yaml` before further evolution.

**Acceptance Criteria**:
1. Given the 10 iterations complete, when I read `research/convergence-summary.md`, then the stop reason is documented (converged or hard cap).
2. Given novel gaps surface, when I merge into `resource-map.yaml`, then each gap row links to its source iteration file.
3. Given no novel gaps surface, when I update `resource-map.yaml`, then the `phase_5_augmentation` block explicitly records the empty result.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None at phase-1 planning time. Phase-5 may surface follow-on questions that feed `tasks.md` sub-tasks rather than reopening this spec.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
- **Resource Map**: `resource-map.yaml`
- **Schemas**: `schemas/audit-finding.schema.json`, `schemas/changelog-entry.schema.json`, `schemas/validation-report.schema.json`, `schemas/iteration-output.schema.json`
- **Implementation Summary**: `implementation-summary.md` (post-implementation)
- **Arc Spec**: `../../spec.md` (`131-deep-skill-evolution` root)
- **Parent grouping node**: `../graph-metadata.json` (`000-release-cleanup`; no parent `spec.md`)
- **Target Skill**: `.opencode/skills/deep-ai-council/`
- **sk-doc templates**: `.opencode/skills/sk-doc/assets/skill/`
- **HVR rules**: `.opencode/skills/sk-doc/references/global/hvr_rules.md`
- **Structural anchor (README)**: `.opencode/skills/system-spec-kit/README.md`
- **Tone anchor (README)**: `Public/README.md`
