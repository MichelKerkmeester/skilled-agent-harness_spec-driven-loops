---
title: "Feature Specification: deep-agent-improvement skill release cleanup (000-release-cleanup/005-deep-agent-improvement)"
description: "Audit, align, and re-baseline the deep-agent-improvement skill (v1.6.0.0) against current sk-doc templates and HVR standards before the 131 evolution arc consumes it. Five sequential phases produce a release-ready skill folder, a converged machine-readable resource map, and a human-reviewed validation report."
trigger_phrases:
  - "deep-agent-improvement release cleanup"
  - "005-deep-agent-improvement"
  - "skill audit"
  - "alignment validation gate"
  - "deep-agent-improvement deep-research loop"
  - "sk-doc conformance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/013-deep-agent-improvement-release-cleanup"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-5-complete-converged-merged"
    next_safe_action: "optional commit + follow-on remediation packet for LG-0004/LG-0006 + cli-devin recipe drift"
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
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000005002"
      session_id: "131-000-005-spec-author"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 5 toolchain: cli-devin SWE-1.6 primary (breadth 1-6 + adjudication iter-7), synthesis 8-10 per skill mixed-executor methodology — confirmed at phase-4 gate"
      - "Resource-map format: resource-map.yaml (machine-readable, single source of truth) per explicit operator instruction — DIVERGES from sibling 002 resource-map.md"
      - "Edit aggression: surgical, audit-first, fix only deviations"
      - "Documentation level: 3 (multi-phase, architectural, >=500 LOC across artifacts)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Feature Specification: deep-agent-improvement skill release cleanup

---

## EXECUTIVE SUMMARY

The `deep-agent-improvement` skill (v1.6.0.0) is mature but pre-dates the most recent sk-doc template revisions and has never been audited end-to-end against the current creation standards. Before the broader `116-deep-skill-evolution` arc consumes it, this sub-phase brings the skill's documentation surface to 100% sk-doc conformance, fixes latent bugs, rewrites the README in current marketing-leaning HVR voice, and seeds a deep-research loop on top of a validated baseline.

**Key Decisions**: cli-devin SWE-1.6 primary phase-5 toolchain (breadth iters 1-6 + adjudication iter-7 + synthesis iters 8-10 per the skill's own mixed-executor methodology); surgical edits only across phases 2-3; `resource-map.yaml` as the single machine-readable map (diverges from sibling 002's `resource-map.md` per explicit operator instruction); Smart Router preservation by default.

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
| **Last Updated** | 2026-05-24 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup` |
| **Sibling Phases** | `001-deep-loop-runtime`, `002-deep-research`, `003-deep-review`, `004-deep-ai-council`, `006-gate-model-reconciliation` (separate scope) |
| **Pattern Source** | `002-deep-research` (sibling packet running the identical release-cleanup workflow) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `deep-agent-improvement` skill carries ~545 lines of SKILL.md, ~410 lines of README, 15 references, 9 assets (incl. benchmark fixtures + profile), 14 feature-catalog files, 39 manual-testing-playbook files (37 scenarios + root + sandbox script), 14 helper scripts plus a `lib/` and a vitest test suite, and 10 changelog versions. None of this content has been audited against the current `sk-doc` templates (`assets/skill/*` + `references/*`), and the README has not been refreshed against the HVR voice standards or the system-spec-kit structural pattern.

Concrete drift already observed at planning time (pre-audit baseline):
- **README §5 STRUCTURE / §6 SCRIPTS are stale**: they enumerate 10 references and 8 scripts, but the skill actually ships 15 references (`candidate_proposal_format.md`, `mixed_executor_methodology.md`, `profiling_audit_log.md`, `promotion_gate_contract.md`, `score_dimensions.md` are undocumented) and 14 scripts (`benchmark-stability.cjs`, `candidate-lineage.cjs`, `improvement-journal.cjs`, `materialize-benchmark-fixtures.cjs`, `mutation-coverage.cjs`, `trade-off-detector.cjs` are undocumented in the README tables although SKILL.md §8 lists them).
- **README §3 FEATURES numbering gap**: jumps 3.6 → 3.8 (no 3.7).
- **SKILL.md length**: ~545 LOC exceeds the 500-LOC skill cap (the 600-LOC allowance is a `system-spec-kit`-only exception). Candidate finding for phase 2; resolution may defer to a dedicated trim packet rather than risk churning a load-bearing router.

Latent path-reference rot, broken MCP tool names, and HVR-noncompliant prose are likely present and ship-blocking for the wider 131 arc.

### Purpose

Deliver a release-ready `deep-agent-improvement` skill folder: every documentation artifact aligned 1:1 to a current sk-doc template, README rewritten to a marketing-leaning HVR voice anchored at ~70% of the root `Public/README.md` intensity, and a deep-research loop run on top of the validated baseline so any logic gaps not captured during planning are surfaced and merged into `resource-map.yaml` before downstream evolution work begins.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit every artifact under `.opencode/skills/deep-agent-improvement/` against the sk-doc template that owns its document class (`SKILL.md`, `README.md`, references, assets, feature catalog, manual testing playbook, changelog, scripts/README.md, scripts/lib/README.md, scripts/tests/README.md).
- Surgical fixes for P0/P1 audit findings; P2 deferred with explicit rationale recorded in `audit-findings.jsonl`.
- Full rewrite of `README.md` to the system-spec-kit structural pattern with HVR score >=85 and tone anchored at ~70% of `Public/README.md` intensity.
- One new changelog entry (`changelog/v1.7.0.0.md`) summarizing all phase-1-through-3 changes; SKILL.md version frontmatter bumped `1.6.0.0` -> `1.7.0.0`.
- Per-artifact alignment validation report (`validation-report.md` + `validation-report.jsonl`) gated by human approval before phase 5.
- 10 deep-research iterations on cli-devin SWE-1.6 (breadth 1-6, adjudication 7, synthesis 8-10) per the skill's own mixed-executor methodology; converged logic gaps merged into `resource-map.yaml` `phase5_augmentation` section.

### Out of Scope

- Sibling phases under `000-release-cleanup/` — independent cleanup packets owned by separate dispatches.
- Scoring/promotion/rollback runtime behavior changes to the `.cjs` scripts — bug-scan only (path refs + `node --check` syntax), no logic refactor and no template enforcement on code files.
- The `@deep-agent-improvement` agent file and `/deep:start-agent-improvement-loop` command definitions — referenced as cross-system integration points in the README rewrite, never modified here (agent/command improvement is the skill's own job, not a doc-cleanup task).
- Cross-skill refactoring (`deep-loop-runtime`, `deep-research`, `deep-review`) — touched only through cross-system reference naming in the README rewrite, never modified.
- The vitest test suite under `scripts/tests/` — inventoried and bug-scanned only; no test authoring.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/.../005-deep-agent-improvement/spec.md` | Create | This file |
| `.../005-deep-agent-improvement/plan.md` | Create | Phase-by-phase strategy |
| `.../005-deep-agent-improvement/tasks.md` | Create | Granular task ledger |
| `.../005-deep-agent-improvement/checklist.md` | Create | Level-3 verification checklist |
| `.../005-deep-agent-improvement/decision-record.md` | Create | ADRs anchoring locked decisions |
| `.../005-deep-agent-improvement/implementation-summary.md` | Create | Skeleton; filled post-implementation |
| `.../005-deep-agent-improvement/resource-map.yaml` | Create | Machine-readable artifact inventory + phase-5 merge slot |
| `.../005-deep-agent-improvement/schemas/*.json` | Create | 4 JSON schemas (audit-finding, changelog-entry, validation-report, iteration-output) |
| `.../005-deep-agent-improvement/description.json` | Create | Auto-generated metadata |
| `.../005-deep-agent-improvement/graph-metadata.json` | Create | Auto-generated graph entry |
| `.opencode/skills/deep-agent-improvement/**` | Modify | Surgical phase-2 fixes per audit findings |
| `.opencode/skills/deep-agent-improvement/README.md` | Rewrite | Full rewrite per phase 3 |
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Modify | Version bump (`1.6.0.0` -> `1.7.0.0`) + surgical audit fixes |
| `.opencode/skills/deep-agent-improvement/changelog/v1.7.0.0.md` | Create | Summary of phase-1-through-3 changes |
| `.../005-deep-agent-improvement/audit-findings.jsonl` | Create (phase 2) | One finding per line, schema-validated |
| `.../005-deep-agent-improvement/validation-report.{md,jsonl}` | Create (phase 4) | Per-artifact alignment report |
| `.../005-deep-agent-improvement/research/iterations/iter-*-{executor}.json` | Create (phase 5) | 10 iteration outputs |
| `.../005-deep-agent-improvement/research/convergence-summary.md` | Create (phase 5) | Reason for stop |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Spec folder passes `validate.sh --strict` | Exit code 0 after every phase |
| REQ-002 | Every audit finding logged to `audit-findings.jsonl` validates against `schemas/audit-finding.schema.json` | `ajv validate -s schemas/audit-finding.schema.json -d audit-findings.jsonl` exits 0 (or manual schema check if ajv absent) |
| REQ-003 | Phase-4 validation gate produces `validation-report.md` and waits for human approval before phase 5 | ADR-006 added to `decision-record.md` recording approval before any phase-5 dispatch |
| REQ-004 | Phase-5 deep-research iterations run one at a time with SIGKILL between dispatches | No two concurrent `devin\|codex\|opencode` processes observed during phase 5 |
| REQ-005 | Smart Router section (`SKILL.md §2`) preserved unless other changes cascade | If touched, ADR-005 added with explicit rationale |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | README HVR score >=85 | Self-scored against `.opencode/skills/sk-doc/references/global/hvr_rules.md` rubric |
| REQ-011 | README covers >=15 unique features each with what + why + how-it-connects | Feature list mapped to `feature_catalog/feature_catalog.md` inventory |
| REQ-012 | Every cross-system connection named with explicit target path | Connections listed in `plan.md` §Phase-3 cross-system table |
| REQ-013 | All P0/P1 audit findings either resolved with commit ref or deferred with rationale | Status column populated in `audit-findings.jsonl` |
| REQ-014 | Phase-5 convergence reached within 10 iterations | Reason logged in `research/convergence-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict validator exits 0 on the spec folder after every phase.
- **SC-002**: 100% of audited artifacts either pass template conformance or have a deviation entry with severity and rationale.
- **SC-003**: README rewrite reaches HVR score >=85 with >=15 unique features covered.
- **SC-004**: Phase-4 validation report is reviewed and approved by a human before phase 5 begins.
- **SC-005**: 10 deep-research iterations archived; converged logic gaps merged into `resource-map.yaml` `phase5_augmentation`.
- **SC-006**: `skill_advisor.py` continues to surface the deep-agent-improvement skill at threshold 0.8 after skill-graph recompile.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Smart Router (SKILL.md §2) gets edited unintentionally | High — breaks resource discovery for the skill | Phase-2 explicit guard; ADR-005 required if touched |
| Risk | SKILL.md ~545 LOC trim cascades into router regression | Med — load-bearing pseudocode lives in §2 | Treat length as P2; defer aggressive trim to a dedicated packet unless a clean surgical cut exists |
| Risk | `generate-context.js` regeneration wipes manual `depends_on` / `related_to` and parent `last_active_child_id` | Medium — graph traversal degrades | Re-apply manual fields + verify parent `children_ids`/`last_active_child_id` after every save |
| Risk | Phase-5 batch dispatch on this Mac swaps to disk thrash | High — wall-clock degrades, may abort mid-iter | One iteration at a time, SIGKILL between, sweep `/tmp` orphans (devin preserved per operator rule) |
| Dependency | `cli-devin` (`devin` binary) + SWE-1.6 preset | Phase 5 blocked if unavailable | Verify at phase-5 prologue; read `cli-devin/SKILL.md` + `sk-prompt-models` before dispatch |
| Dependency | Strict validator (`scripts/spec/validate.sh`) | Every phase exit blocked if missing | Verified present at plan time |
| Dependency | `skill_graph_compiler.py` | Graph drift if not run after metadata edits | Run after every `graph-metadata.json` change |
| Risk | CLI dispatch under heavy parallelism degrades reliability | Medium — fresh dispatches silently fail | Ceiling 1 concurrent during phase 5 |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Strict validator completes in <10s per spec-folder invocation.
- **NFR-P02**: Per-iteration phase-5 dispatch budget <=15 min wall-clock (cli-devin SWE-1.6).

### Security
- **NFR-S01**: No secrets committed; any provider keys stay in `.env` (gitignored).
- **NFR-S02**: Surgical edits respect SCOPE LOCK — no out-of-scope writes during phase 2.

### Reliability
- **NFR-R01**: Phase-4 validation gate is binary (pass with explicit human approval, or stop).
- **NFR-R02**: Every state file (`audit-findings.jsonl`, `validation-report.jsonl`, `research/iterations/*.json`) is append-only and schema-validated before being read by a downstream phase.

---

## 8. EDGE CASES

### Data Boundaries
- **Empty audit findings**: If phase 2 finds zero deviations, `audit-findings.jsonl` is empty and resource-map gets `audit_status: PASS` for every row.
- **Phase-5 zero novel gaps**: If all 10 iterations converge with no new gaps, `phase5_augmentation` is empty and documents that fact explicitly.
- **Smart Router unchanged**: If phase 2 leaves SKILL.md §2 untouched (expected default), ADR-005 is not authored.

### Error Scenarios
- **Validator exits 1 (warnings)**: Reviewed and either fixed or accepted with rationale recorded in the relevant phase's exit notes.
- **Validator exits 2 (errors)**: HARD BLOCKER. Fix before claiming phase complete.
- **cli-devin unavailable at phase 5**: STOP, ask user. Do not silently substitute a different executor (per `feedback_cli_executor_only_when_requested`).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | ~110 artifacts in audit scope; 7 new spec docs + 4 schemas; 10 iteration outputs |
| Risk | 14/25 | Phase-4 gate, Smart Router protection, dispatch discipline, SKILL.md length |
| Research | 12/20 | 10-iteration deep-research loop with convergence criteria |
| Multi-Agent | 7/15 | Phase 5 cli-devin SWE-1.6 mixed-executor (breadth + adjudication + synthesis) |
| Coordination | 8/15 | Sequential phase gating with one human-approval point |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Smart Router rewrite cascades into runtime regressions | H | L | ADR-005 gate + post-edit advisor probe |
| R-002 | Phase-5 dispatch batch crashes Mac | H | M | One-at-a-time discipline + SIGKILL hygiene |
| R-003 | SKILL.md length fix churns load-bearing §2 | M | M | Defer trim as P2 unless clean surgical cut |
| R-004 | cli-devin SWE-1.6 hang/timeout during iters | M | M | Per-iter timeout budget + retry once + log to convergence-summary |
| R-005 | Audit findings exceed surgical-edit scope | M | M | Defer P2 with rationale; escalate P0/P1 if cascade unavoidable |
| R-006 | README HVR score <85 after rewrite | M | M | Iterate until threshold reached; do not commit below 85 |

---

## 11. USER STORIES

### US-001: Skilled maintainer ships a release-ready skill folder (P0)

**As a** senior skill maintainer, **I want** the `deep-agent-improvement` skill folder to conform 1:1 to current sk-doc templates and HVR standards, **so that** downstream evolution work in the 131 arc builds on a clean substrate.

**Acceptance Criteria**:
1. Given the audit completes, when I run `validate.sh --strict` on the spec folder, then exit code is 0.
2. Given the README rewrite ships, when I score it against `hvr_rules.md`, then the score is >=85.
3. Given the validation gate runs, when phase 4 emits the report, then phase 5 cannot start without an ADR-006 approval entry.

### US-002: Deep-research loop surfaces logic gaps not seen at planning (P1)

**As a** senior skill maintainer, **I want** to run a 10-iteration deep-research loop on the cleaned skill baseline, **so that** any logic gaps not visible during phase-1 planning are merged into `resource-map.yaml` before further evolution.

**Acceptance Criteria**:
1. Given the 10 iterations complete, when I read `research/convergence-summary.md`, then the stop reason is documented (converged or hard cap).
2. Given novel gaps surface, when I merge into `resource-map.yaml`, then each row links to its source iteration file.
3. Given no novel gaps surface, when I update `resource-map.yaml`, then `phase5_augmentation` explicitly records the empty result.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None at phase-1 planning time. The phase-5 synthesis-iter executor (cli-devin SWE-1.6 vs an optional cli-codex synthesis pass) is the only open lever, and it is resolved at the phase-4 human-approval gate rather than reopening this spec.
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
- **Parent Packet**: `../../spec.md` (000-release-cleanup root)
- **Pattern Source**: `../002-deep-research/` (sibling running the identical workflow)
- **Target Skill**: `.opencode/skills/deep-agent-improvement/`
- **sk-doc templates**: `.opencode/skills/sk-doc/assets/skill/`
- **HVR rules**: `.opencode/skills/sk-doc/references/global/hvr_rules.md`
- **Structural anchor (README)**: `.opencode/skills/system-spec-kit/README.md`
- **Tone anchor (README)**: `Public/README.md`
