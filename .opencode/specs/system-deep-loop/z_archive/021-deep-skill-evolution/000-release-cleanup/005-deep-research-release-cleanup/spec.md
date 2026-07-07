---
title: "Feature Specification: deep-research skill release cleanup (000-release-cleanup/002-deep-research)"
description: "Audit, align, and re-baseline the deep-research skill (v1.12.0.0) against current sk-doc templates and HVR standards before the 131 evolution arc begins. Five sequential phases produce a release-ready skill folder, a converged resource map, and a human-reviewed validation report."
trigger_phrases:
  - "deep-research release cleanup"
  - "002-deep-research"
  - "skill audit"
  - "alignment validation gate"
  - "deep-research deep-research loop"
  - "sk-doc conformance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/005-deep-research-release-cleanup"
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
      - "resource-map.md"
      - "schemas/audit-finding.schema.json"
      - "schemas/changelog-entry.schema.json"
      - "schemas/validation-report.schema.json"
      - "schemas/iteration-output.schema.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002002"
      session_id: "131-000-002-spec-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase 5 toolchain: split 5 cli-devin SWE-1.6 + 5 cli-opencode deepseek/deepseek-v4-pro (direct API)"
      - "Resource-map format: canonical resource-map.md (no YAML)"
      - "Edit aggression: surgical, audit-first, fix only deviations"
      - "Documentation level: 3 (multi-phase, architectural, ≥500 LOC across artifacts)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Feature Specification: deep-research skill release cleanup

---

## EXECUTIVE SUMMARY

The `deep-research` skill (v1.12.0.0) is mature but pre-dates the most recent sk-doc template revisions and has never been audited end-to-end against the current creation standards. Before the broader `116-deep-skill-evolution` arc begins, this sub-phase brings the skill's documentation surface to 100% sk-doc conformance, fixes latent bugs, rewrites the README in current marketing-leaning HVR voice, and seeds a deep-research loop on top of a validated baseline.

**Key Decisions**: Split phase-5 toolchain (5 iters cli-devin SWE-1.6 + 5 iters cli-opencode deepseek/deepseek-v4-pro direct API); surgical edits only across phases 2-3; resource-map.md as the only canonical map; Smart Router preservation by default.

**Critical Dependencies**: Phase 4 is a blocking human-approval gate before any phase-5 dispatch begins.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-23 |
| **Last Updated** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup` |
| **Sibling Phases** | `001-deep-loop-runtime`, `003-deep-review`, `004-deep-ai-council`, `005-deep-agent-improvement` (all empty, separate scope) |
| **Related Packet** | `skilled-agent-orchestration/116-deep-skill-evolution/004-deep-research` (feature work, separate scope) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `deep-research` skill carries 412 lines of SKILL.md, 248 lines of README, 6 references (3,526 lines), 5 assets, 16 feature-catalog files, 43 manual-testing-playbook entries, and 16 changelog versions. None of this content has been audited against the current `sk-doc` templates (`assets/skill/*` + `references/*`), and the README has not been refreshed against the HVR voice standards or the system-spec-kit structural pattern. Latent path-reference rot, broken MCP tool names, and HVR-noncompliant prose are likely present and ship-blocking for the wider 131 arc.

### Purpose

Deliver a release-ready `deep-research` skill folder: every documentation artifact aligned 1:1 to a current sk-doc template, README rewritten to a marketing-leaning HVR voice anchored at ~70% of the root Public/README.md intensity, and a deep-research loop run on top of the validated baseline so any logic gaps not captured during planning are surfaced and merged into `resource-map.md` before downstream evolution work begins.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit every artifact under `.opencode/skills/deep-research/` against the sk-doc template that owns its document class (`SKILL.md`, `README.md`, references, assets, feature catalog, manual testing playbook, changelog, scripts/README.md).
- Surgical fixes for P0/P1 audit findings; P2 deferred with explicit rationale recorded in `audit-findings.jsonl`.
- Full rewrite of `README.md` to the system-spec-kit structural pattern with HVR score ≥85 and tone anchored at ~70% of `Public/README.md` intensity.
- One new changelog entry (`changelog/v1.13.0.0.md`) summarizing all phase-1-through-3 changes; SKILL.md version frontmatter bumped to match.
- Per-artifact alignment validation report (`validation-report.md` + `validation-report.jsonl`) gated by human approval before phase 5.
- 10 deep-research iterations split 5 cli-devin SWE-1.6 + 5 cli-opencode deepseek/deepseek-v4-pro (direct API); converged logic gaps merged into `resource-map.md` Phase-5 Augmentation section.

### Out of Scope

- Sibling phases `001-deep-loop-runtime`, `003-deep-review`, `004-deep-ai-council`, `005-deep-agent-improvement` under `000-release-cleanup/` — those are independent cleanup packets owned by separate dispatches.
- The actual `116-deep-skill-evolution/004-deep-research` feature work — that packet ships skill capability changes, not cleanup.
- Cross-skill refactoring (e.g. `deep-loop-runtime`, `deep-review`) — touched only through cross-system reference naming in the README rewrite, never modified.
- Code changes to scripts under `.opencode/skills/deep-research/scripts/` — bug-scan only, no template enforcement.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/.../002-deep-research/spec.md` | Create | This file |
| `.opencode/specs/.../002-deep-research/plan.md` | Create | Phase-by-phase strategy |
| `.opencode/specs/.../002-deep-research/tasks.md` | Create | Granular task ledger |
| `.opencode/specs/.../002-deep-research/checklist.md` | Create | Level-3 verification checklist |
| `.opencode/specs/.../002-deep-research/decision-record.md` | Create | 4 ADRs anchoring locked decisions |
| `.opencode/specs/.../002-deep-research/implementation-summary.md` | Create | Skeleton; filled post-implementation |
| `.opencode/specs/.../002-deep-research/resource-map.md` | Create | Full artifact inventory + phase-5 merge slot |
| `.opencode/specs/.../002-deep-research/schemas/*.json` | Create | 4 JSON schemas (audit-finding, changelog-entry, validation-report, iteration-output) |
| `.opencode/specs/.../002-deep-research/description.json` | Create | Auto-generated metadata |
| `.opencode/specs/.../002-deep-research/graph-metadata.json` | Create | Auto-generated graph entry |
| `.opencode/skills/deep-research/**` | Modify | Surgical phase-2 fixes per audit findings |
| `.opencode/skills/deep-research/README.md` | Rewrite | Full rewrite per phase 3 |
| `.opencode/skills/deep-research/SKILL.md` | Modify | Version bump only (`1.12.0.0` → `1.13.0.0`) |
| `.opencode/skills/deep-research/changelog/v1.13.0.0.md` | Create | Summary of phase-1-through-3 changes |
| `.opencode/specs/.../002-deep-research/audit-findings.jsonl` | Create (phase 2) | One finding per line, schema-validated |
| `.opencode/specs/.../002-deep-research/validation-report.{md,jsonl}` | Create (phase 4) | Per-artifact alignment report |
| `.opencode/specs/.../002-deep-research/research/iterations/iter-*-{executor}.json` | Create (phase 5) | 10 iteration outputs |
| `.opencode/specs/.../002-deep-research/research/convergence-summary.md` | Create (phase 5) | Reason for stop |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Spec folder passes `validate.sh --strict` | Exit code 0 after every phase |
| REQ-002 | Every audit finding logged to `audit-findings.jsonl` validates against `schemas/audit-finding.schema.json` | `ajv validate -s schemas/audit-finding.schema.json -d audit-findings.jsonl` exits 0 |
| REQ-003 | Phase-4 validation gate produces `validation-report.md` and waits for human approval before phase 5 | ADR-006 added to `decision-record.md` recording approval before any phase-5 dispatch |
| REQ-004 | Phase-5 deep-research iterations run one at a time with SIGKILL between dispatches | No two concurrent `devin\|codex\|opencode` processes observed during phase 5 |
| REQ-005 | Smart Router section (`SKILL.md §2`) preserved unless other changes cascade | If touched, ADR-005 added with explicit rationale |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | README HVR score ≥85 | Self-scored against `.opencode/skills/sk-doc/references/global/hvr_rules.md` rubric |
| REQ-011 | README covers ≥15 unique features each with what + why + how-it-connects | Feature list mapped to `feature_catalog/feature_catalog.md` inventory |
| REQ-012 | Every cross-system connection named with explicit target path | Connections listed in `plan.md` §Phase-3 cross-system table |
| REQ-013 | All P0/P1 audit findings either resolved with commit ref or deferred with rationale | Status column populated in `audit-findings.jsonl` |
| REQ-014 | Phase-5 convergence reached within 10 iterations | Reason logged in `research/convergence-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict validator exits 0 on the spec folder after every phase.
- **SC-002**: 100% of audited artifacts either pass template conformance or have a deviation entry with severity and rationale.
- **SC-003**: README rewrite reaches HVR score ≥85 with ≥15 unique features covered.
- **SC-004**: Phase-4 validation report is reviewed and approved by a human before phase 5 begins.
- **SC-005**: 10 deep-research iterations archived; converged logic gaps merged into `resource-map.md` Phase-5 Augmentation section.
- **SC-006**: `skill_advisor.py` continues to surface the deep-research skill at threshold 0.8 after skill-graph recompile.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Smart Router (SKILL.md §2) gets edited unintentionally | High — breaks resource discovery for the skill | Phase-2 explicit guard; ADR-005 required if touched |
| Risk | `generate-context.js` regeneration wipes manual `depends_on` / `related_to` | Medium — graph traversal degrades | Re-apply manual fields after every save |
| Risk | Phase-5 batch dispatch on this Mac swaps to disk thrash | High — wall-clock degrades, may abort mid-iter | One iteration at a time, SIGKILL between, sweep /tmp orphans |
| Risk | opencode 1.15.x InstanceRef bug | High — every cli-opencode dispatch crashes at startup | Verify `opencode-ai@1.14.51` pinned before phase 5 |
| Dependency | `DEEPSEEK_API_KEY` env var | Phase 5 iters 6-10 blocked if absent | Verify env at phase-5 prologue; fall back to opencode-go/deepseek-v4-pro with user approval |
| Dependency | Strict validator (`scripts/spec/validate.sh`) | Every phase exit blocked if missing | Verified present at plan time |
| Dependency | `skill_graph_compiler.py` | Graph drift if not run after metadata edits | Run after every `graph-metadata.json` change |
| Risk | CLI dispatch under heavy parallelism degrades reliability | Medium — fresh dispatches silently fail | Ceiling 1 concurrent during phase 5 |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Strict validator completes in <10s per spec-folder invocation.
- **NFR-P02**: Per-iteration phase-5 dispatch budget ≤15 min wall-clock (cli-devin SWE-1.6); ≤25 min (cli-opencode deepseek-v4-pro).

### Security
- **NFR-S01**: No secrets committed; `DEEPSEEK_API_KEY` stays in `.env` (gitignored).
- **NFR-S02**: Surgical edits respect SCOPE LOCK — no out-of-scope writes during phase 2.

### Reliability
- **NFR-R01**: Phase-4 validation gate is binary (pass with explicit human approval, or stop).
- **NFR-R02**: Every state file (`audit-findings.jsonl`, `validation-report.jsonl`, `research/iterations/*.json`) is append-only and schema-validated before being read by a downstream phase.

---

## 8. EDGE CASES

### Data Boundaries
- **Empty audit findings**: If phase 2 finds zero deviations, `audit-findings.jsonl` is empty and resource-map gets `audit_status: PASS` for every row.
- **Phase-5 zero novel gaps**: If all 10 iterations converge with no new gaps, the Phase-5 Augmentation section is empty and documents that fact explicitly.
- **Smart Router unchanged**: If phase 2 leaves SKILL.md §2 untouched (expected default), ADR-005 is not authored.

### Error Scenarios
- **Validator exits 1 (warnings)**: Reviewed and either fixed or accepted with rationale recorded in the relevant phase's exit notes.
- **Validator exits 2 (errors)**: HARD BLOCKER. Fix before claiming phase complete.
- **DEEPSEEK_API_KEY missing at phase 5**: STOP, ask user. Do not silently fall back to opencode-go.
- **opencode-ai version mismatch**: STOP, downgrade to 1.14.51, retry.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | ~95 artifacts in audit scope; 7 new spec docs + 4 schemas; 10 iteration outputs |
| Risk | 14/25 | Phase-4 gate, Smart Router protection, dispatch discipline, version pinning |
| Research | 12/20 | 10-iteration deep-research loop with convergence criteria |
| Multi-Agent | 8/15 | Phase 5 split across cli-devin + cli-opencode |
| Coordination | 8/15 | Sequential phase gating with one human-approval point |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Smart Router rewrite cascades into runtime regressions | H | L | ADR-005 gate + post-edit advisor probe |
| R-002 | Phase-5 dispatch batch crashes Mac | H | M | One-at-a-time discipline + SIGKILL hygiene |
| R-003 | opencode 1.15.x present at phase 5 | H | L | Version-pin check at phase prologue |
| R-004 | DeepSeek API rate limit during iters 6-10 | M | L | Retry budget + opencode-go fallback (requires user approval) |
| R-005 | Audit findings exceed surgical-edit scope | M | M | Defer P2 with rationale; escalate P0/P1 if cascade unavoidable |
| R-006 | README HVR score <85 after rewrite | M | M | Iterate until threshold reached; do not commit below 85 |

---

## 11. USER STORIES

### US-001: Skilled maintainer ships a release-ready skill folder (P0)

**As a** senior skill maintainer, **I want** the `deep-research` skill folder to conform 1:1 to current sk-doc templates and HVR standards, **so that** downstream evolution work in the 131 arc builds on a clean substrate.

**Acceptance Criteria**:
1. Given the audit completes, when I run `validate.sh --strict` on `.opencode/skills/deep-research/`, then exit code is 0.
2. Given the README rewrite ships, when I score it against `hvr_rules.md`, then the score is ≥85.
3. Given the validation gate runs, when phase 4 emits the report, then phase 5 cannot start without an ADR-006 approval entry.

### US-002: Deep-research loop surfaces logic gaps not seen at planning (P1)

**As a** senior skill maintainer, **I want** to run a 10-iteration deep-research loop on the cleaned skill baseline, **so that** any logic gaps not visible during phase-1 planning are merged into `resource-map.md` before further evolution.

**Acceptance Criteria**:
1. Given the 10 iterations complete, when I read `research/convergence-summary.md`, then the stop reason is documented (converged or hard cap).
2. Given novel gaps surface, when I merge into `resource-map.md`, then each row links to its source iteration file.
3. Given no novel gaps surface, when I update `resource-map.md`, then the Phase-5 Augmentation section explicitly records the empty result.

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
- **Resource Map**: `resource-map.md`
- **Schemas**: `schemas/audit-finding.schema.json`, `schemas/changelog-entry.schema.json`, `schemas/validation-report.schema.json`, `schemas/iteration-output.schema.json`
- **Implementation Summary**: `implementation-summary.md` (post-implementation)
- **Parent Packet**: `../../spec.md` (000-release-cleanup root)
- **Grandparent Packet**: `../../../spec.md` (116-deep-skill-evolution root)
- **Target Skill**: `.opencode/skills/deep-research/`
- **sk-doc templates**: `.opencode/skills/sk-doc/assets/skill/`
- **HVR rules**: `.opencode/skills/sk-doc/references/global/hvr_rules.md`
- **Structural anchor (README)**: `.opencode/skills/system-spec-kit/README.md`
- **Tone anchor (README)**: `Public/README.md`
