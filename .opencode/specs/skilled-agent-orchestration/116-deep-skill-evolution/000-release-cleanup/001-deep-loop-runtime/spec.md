---
title: "Feature Specification: deep-loop-runtime skill release cleanup (000-release-cleanup/001-deep-loop-runtime)"
description: "Audit, align, and re-baseline the deep-loop-runtime skill (v1.0.0) against current sk-doc templates and HVR standards before the 131 evolution arc begins. Five sequential phases produce a release-ready peer-runtime skill folder, a converged resource map, and a human-reviewed validation report."
trigger_phrases:
  - "deep-loop-runtime release cleanup"
  - "001-deep-loop-runtime"
  - "deep-loop runtime audit"
  - "alignment validation gate"
  - "sk-doc conformance"
  - "deep-loop runtime readme rewrite"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime"
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
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001002"
      session_id: "131-000-001-spec-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Documentation level: 3 (multi-phase, architectural, audit-driven)"
      - "Phase 5a toolchain: 10 iterations all on cli-devin SWE-1.6 via /deep:start-research-loop"
      - "assets/ directory: accept absence as documented deviation; do not create skeleton"
      - "Resource-map format: canonical resource-map.md (.md, not .yaml) per house convention"
      - "Edit aggression: surgical, audit-first, fix only deviations; bugs in lib/scripts/tests deferred"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Feature Specification: deep-loop-runtime skill release cleanup

---

## EXECUTIVE SUMMARY

The `deep-loop-runtime` skill (v1.0.0) is the shared peer-runtime layer extracted by arc 118 (FULL_ISOLATE_NO_MCP) from `deep-review` + `deep-research`. It owns 15,645 LOC across 79 files: executor config + audit, prompt-pack rendering, post-dispatch validation, atomic state, JSONL repair, loop locking, permissions gate, Bayesian scoring, fallback routing, coverage-graph (schema + query + signals), council session-state hierarchy, four script entry points, SQLite storage, and 22 vitest files. The documentation surface has never been audited end-to-end against the current sk-doc templates, and the README (174 LOC, TOC + quick-start dominant) is undersized relative to what the skill actually owns. Before the broader `116-deep-skill-evolution` arc begins, this sub-phase brings the documentation surface to 100% sk-doc conformance, rewrites the README in current marketing-leaning HVR voice, and seeds a deep-research loop on top of a validated baseline.

**Key Decisions**: All-cli-devin SWE-1.6 phase-5 toolchain (10 iterations, not split); surgical edits only across phases 2-3; resource-map.md as the only canonical map; Smart Router preservation by default; accept absence of `assets/` directory as documented deviation.

**Critical Dependencies**: Phase 4 is a blocking human-approval gate before any phase-5 dispatch begins. CLAUDE.md CLI dispatch rule mandates reading `.opencode/skills/cli-devin/SKILL.md` before any SWE-1.6 dispatch.

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
| **Sibling Phases** | `002-deep-research` (in progress, separate dispatch); `003-deep-review`, `004-deep-ai-council`, `005-deep-agent-improvement` (empty, separate scope) |
| **Related Packet** | `skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime` (feature work; 9 leaf phases — separate scope) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `deep-loop-runtime` skill carries 266 lines of SKILL.md, 174 lines of README, 4 references (732 lines), 18 feature-catalog files plus 1 index (1019 lines), 17 manual-testing-playbook entries plus 1 index (1830 lines), 8 sub-READMEs (lib + lib/council + lib/coverage-graph + lib/deep-loop + scripts + tests + tests/helpers + storage), and 1 changelog version (v1.0.0.0). None of this content has been audited against the current `sk-doc` templates (`assets/skill/*` + `references/*`), and the README has not been refreshed against the HVR voice standards or the system-spec-kit structural pattern. Latent path-reference rot, broken link targets, HVR-noncompliant prose, and template-shape drift are likely present and ship-blocking for the wider 131 arc. The skill ALSO has no `assets/` directory at all — a unique structural deviation that needs an explicit decision recorded.

### Purpose

Deliver a release-ready `deep-loop-runtime` skill folder: every documentation artifact aligned 1:1 to a current sk-doc template (or carrying a recorded deviation), README rewritten to a marketing-leaning HVR voice anchored at ~70% of the root `Public/README.md` intensity and structurally anchored on `.opencode/skills/system-spec-kit/README.md`, and a deep-research loop run on top of the validated baseline so any logic gaps not captured during planning are surfaced and merged into `resource-map.md` before downstream evolution work begins.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit every documentation artifact under `.opencode/skills/deep-loop-runtime/` against the sk-doc template that owns its document class (`SKILL.md`, `README.md`, references, feature catalog, manual testing playbook, sub-READMEs, changelog, scripts/README.md).
- Surgical fixes for P0/P1 audit findings; P2 deferred with explicit rationale recorded in `audit-findings.jsonl`.
- Full rewrite of `README.md` to the system-spec-kit structural pattern with HVR score ≥85 and tone anchored at ~70% of `Public/README.md` intensity.
- One new changelog entry (`changelog/v1.1.0.0.md`) summarizing all phase-1-through-3 documentation changes; SKILL.md version frontmatter bumped to match.
- Per-artifact alignment validation report (`validation-report.md` + `validation-report.jsonl`) gated by human approval before phase 5.
- 10 deep-research iterations on cli-devin SWE-1.6 via `/deep:start-research-loop :auto`; converged logic gaps merged into `resource-map.md` Phase-5 Augmentation section.

### Out of Scope

- Code changes to `lib/**`, `scripts/**`, `tests/**`, `storage/**` — bug-scan only, findings logged for follow-on packets.
- Sibling phases `002-deep-research`, `003-deep-review`, `004-deep-ai-council`, `005-deep-agent-improvement` under `000-release-cleanup/` — independent cleanup packets owned by separate dispatches.
- The actual `116-deep-skill-evolution/003-deep-loop-runtime` feature work — that phase parent (9 children) ships runtime capability changes, not cleanup.
- Cross-skill refactoring (e.g. `deep-review`, `deep-research`, `deep-ai-council` consumers) — touched only through cross-system reference naming in the README rewrite, never modified.
- Creation of an `assets/` directory or skeleton content — ADR-003 accepts absence as a documented deviation.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/.../001-deep-loop-runtime/spec.md` | Create | This file |
| `.opencode/specs/.../001-deep-loop-runtime/plan.md` | Create | Phase-by-phase strategy |
| `.opencode/specs/.../001-deep-loop-runtime/tasks.md` | Create | Granular task ledger |
| `.opencode/specs/.../001-deep-loop-runtime/checklist.md` | Create | Level-3 verification checklist |
| `.opencode/specs/.../001-deep-loop-runtime/decision-record.md` | Create | 5 ADRs anchoring locked decisions + reserved ADR-006 |
| `.opencode/specs/.../001-deep-loop-runtime/implementation-summary.md` | Create | Skeleton; filled post-phase-5 |
| `.opencode/specs/.../001-deep-loop-runtime/resource-map.md` | Create | Full artifact inventory + phase-5 merge slot |
| `.opencode/specs/.../001-deep-loop-runtime/schemas/*.json` | Create | 4 JSON schemas (audit-finding, changelog-entry, validation-report, iteration-output) |
| `.opencode/specs/.../001-deep-loop-runtime/description.json` | Create | Auto-generated metadata |
| `.opencode/specs/.../001-deep-loop-runtime/graph-metadata.json` | Create | Auto-generated graph entry |
| `.opencode/skills/deep-loop-runtime/**` | Modify | Surgical phase-2 doc fixes per audit findings (NO code changes) |
| `.opencode/skills/deep-loop-runtime/README.md` | Rewrite | Full rewrite per phase 3 |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Modify | Version bump only (`1.0.0` → `1.1.0`); surgical audit fixes if any |
| `.opencode/skills/deep-loop-runtime/changelog/v1.1.0.0.md` | Create | Summary of phase-1-through-3 changes |
| `.opencode/specs/.../001-deep-loop-runtime/findings/audit-findings.jsonl` | Create (phase 2) | One finding per line, schema-validated |
| `.opencode/specs/.../001-deep-loop-runtime/findings/audit-summary.md` | Create (phase 2) | Human-readable rollup |
| `.opencode/specs/.../001-deep-loop-runtime/validation/validation-report.{md,jsonl}` | Create (phase 4) | Per-artifact alignment report |
| `.opencode/specs/.../001-deep-loop-runtime/research/iterations/iter-NN-cli-devin.json` | Create (phase 5) | 10 iteration outputs |
| `.opencode/specs/.../001-deep-loop-runtime/research/convergence-summary.md` | Create (phase 5) | Reason for stop |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Spec folder passes `validate.sh --strict` | Exit code 0 after every phase |
| REQ-002 | Every audit finding logged to `findings/audit-findings.jsonl` validates against `schemas/audit-finding.schema.json` | `ajv validate -s schemas/audit-finding.schema.json -d findings/audit-findings.jsonl` exits 0 |
| REQ-003 | Phase-4 validation gate produces `validation-report.md` and waits for human approval before phase 5 | ADR-006 added to `decision-record.md` recording approval before any phase-5 dispatch |
| REQ-004 | Phase-5 deep-research iterations run one at a time with SIGKILL between dispatches | No two concurrent `devin\|codex\|opencode` processes observed during phase 5 (per memory `feedback_deep_loop_iter_one_at_a_time`) |
| REQ-005 | Smart Router section (`SKILL.md §2`) preserved unless other changes cascade | If touched, ADR-007 added with explicit rationale |
| REQ-006 | No code changes to `lib/**`, `scripts/**`, `tests/**`, `storage/**` | Phase 2 audit findings on code files marked `defer:follow-on-packet`; no code edits applied |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | README HVR score ≥85 | Self-scored against `.opencode/skills/sk-doc/references/global/hvr_rules.md` rubric (pass threshold per house convention is 85; spec sets ≥85 minimum) |
| REQ-011 | README covers every unique feature each with what + why + how-it-connects | Feature list mapped to `feature_catalog/feature_catalog.md` 7-domain inventory (executor, prompt-rendering, validation, state-safety, scoring, coverage-graph, scripts) plus council + storage |
| REQ-012 | Every cross-system connection named with explicit target path | Connections listed in `plan.md` §Phase-3 cross-system table (`deep-review`, `deep-research`, `deep-ai-council`, plus command YAMLs that consume the four scripts) |
| REQ-013 | All P0/P1 documentation audit findings either resolved with commit ref or deferred with rationale | Status column populated in `findings/audit-findings.jsonl` |
| REQ-014 | Phase-5 convergence reached within 10 iterations | Reason logged in `research/convergence-summary.md` |
| REQ-015 | Pre-dispatch read of `.opencode/skills/cli-devin/SKILL.md` recorded in phase-5 prologue | Mandatory per CLAUDE.md CLI dispatch rule + small-model dispatch rule |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict validator exits 0 on the spec folder after every phase.
- **SC-002**: 100% of audited documentation artifacts either pass template conformance or have a deviation entry with severity and rationale.
- **SC-003**: README rewrite reaches HVR score ≥85 with every unique runtime capability covered (executor + prompt-rendering + validation + state-safety + scoring + coverage-graph + council + scripts + storage).
- **SC-004**: Phase-4 validation report reviewed and approved by a human before phase 5 begins.
- **SC-005**: 10 deep-research iterations archived; converged logic gaps merged into `resource-map.md` Phase-5 Augmentation section.
- **SC-006**: `skill_advisor.py` continues to surface the deep-loop-runtime skill at threshold 0.8 after skill-graph recompile.
- **SC-007**: Zero code changes to `lib/**`, `scripts/**`, `tests/**`, `storage/**` (`git diff --stat` confirms doc-only edits to skill at packet close).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Smart Router (SKILL.md §2) gets edited unintentionally | High — breaks resource discovery for the skill | Phase-2 explicit guard; ADR-007 required if touched |
| Risk | `generate-context.js` regeneration wipes manual `depends_on` / `related_to` in graph-metadata.json | Medium — graph traversal degrades; per memory `feedback_generate_context_regenerates_parent_metadata` | Re-apply manual fields after every save; run last in phase 1 |
| Risk | Phase-5 batch dispatch on this Mac swaps to disk thrash | High — wall-clock degrades, may abort mid-iter | One iteration at a time, SIGKILL between, sweep /tmp orphans (per memory `feedback_deep_loop_iter_one_at_a_time` + `feedback_proactive_orphan_cleanup`) |
| Risk | opencode 1.15.x InstanceRef bug if any auxiliary cli-opencode dispatch needed | Medium — every cli-opencode dispatch crashes at startup | Verify `opencode-ai@1.14.51` pinned before any cli-opencode dispatch (per memory `feedback_opencode_1_15_x_instanceref_bug`) |
| Risk | cli-devin SWE-1.6 bundle hallucination (per memory `feedback_cli_devin_bundle_verification`) | Medium — fake consumer names + non-existent CLI flags in iteration output | Bundle gate: grep-verify internal_imports + smoke-run validation_commands per `feedback_bundle_gate_smoke_run` |
| Risk | Code-fix scope creep (audit surfaces real bugs in lib/) | Medium — pulls packet outside doc-only scope | Hard ADR-004 boundary; bugs in lib/scripts/tests deferred to follow-on packets; logged in audit-findings.jsonl with `defer:follow-on-packet` status |
| Dependency | Strict validator (`scripts/spec/validate.sh`) | Every phase exit blocked if missing | Verified present at plan time |
| Dependency | `skill_graph_compiler.py` | Graph drift if not run after metadata edits (per memory `feedback_skill_graph_compiler_rebuild`) | Run after every `graph-metadata.json` change |
| Dependency | `.opencode/skills/cli-devin/SKILL.md` readable | Phase 5 dispatch invalid without it (CLAUDE.md CLI dispatch rule) | Verified present at plan time |
| Risk | CLI dispatch under heavy parallelism degrades reliability (per memory `feedback_cli_dispatch_unreliability`) | Medium — fresh dispatches silently fail | Ceiling 1 concurrent during phase 5 |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Strict validator completes in <10s per spec-folder invocation.
- **NFR-P02**: Per-iteration phase-5 dispatch budget ≤15 min wall-clock (cli-devin SWE-1.6).
- **NFR-P03**: Phase-2 audit dispatch per artifact class ≤10 min wall-clock when delegated to cli-opencode + deepseek-v4-pro.

### Security
- **NFR-S01**: No secrets committed; if cli-opencode/deepseek is used as auxiliary, `DEEPSEEK_API_KEY` stays in `.env` (gitignored).
- **NFR-S02**: Surgical edits respect SCOPE LOCK — no out-of-scope writes during phase 2; no code edits per REQ-006.

### Reliability
- **NFR-R01**: Phase-4 validation gate is binary (pass with explicit human approval, or stop).
- **NFR-R02**: Every state file (`findings/audit-findings.jsonl`, `validation/validation-report.jsonl`, `research/iterations/*.json`) is append-only and schema-validated before being read by a downstream phase.

---

## 8. EDGE CASES

### Data Boundaries
- **Empty audit findings**: If phase 2 finds zero deviations, `findings/audit-findings.jsonl` is empty and resource-map gets `audit_status: PASS` for every row.
- **Phase-5 zero novel gaps**: If all 10 iterations converge with no new gaps, the Phase-5 Augmentation section is empty and documents that fact explicitly.
- **Smart Router unchanged**: If phase 2 leaves SKILL.md §2 untouched (expected default), ADR-007 is not authored.
- **assets/ absence**: Confirmed at phase 1; ADR-003 already captures the decision; no phase-2 finding required.

### Error Scenarios
- **Validator exits 1 (warnings)**: Reviewed and either fixed or accepted with rationale recorded in the relevant phase's exit notes.
- **Validator exits 2 (errors)**: HARD BLOCKER. Fix before claiming phase complete.
- **cli-devin SWE-1.6 dispatch hang**: SIGKILL after 15 min wall-clock; sweep `/tmp/devin-*`; retry once; escalate to user after second failure.
- **opencode-ai version mismatch** (if auxiliary cli-opencode used): STOP, downgrade to 1.14.51, retry.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | ~65 documentation artifacts in audit scope; 8 new spec docs + 4 schemas; 10 iteration outputs |
| Risk | 14/25 | Phase-4 gate, Smart Router protection, dispatch discipline, no-code-edit boundary, version pinning |
| Research | 12/20 | 10-iteration deep-research loop with convergence criteria |
| Multi-Agent | 6/15 | Phase 5 single-track (cli-devin only); phase 2 may delegate to cli-opencode + deepseek auxiliary |
| Coordination | 8/15 | Sequential phase gating with one human-approval point |
| **Total** | **56/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Smart Router rewrite cascades into runtime regressions | H | L | ADR-007 gate + post-edit advisor probe |
| R-002 | Phase-5 dispatch batch crashes Mac | H | M | One-at-a-time discipline + SIGKILL hygiene |
| R-003 | opencode 1.15.x present at auxiliary phase-2 cli-opencode dispatch | H | L | Version-pin check at phase prologue |
| R-004 | cli-devin SWE-1.6 bundle hallucination during phase 5 | M | M | Bundle-gate grep + smoke-run validation |
| R-005 | Audit findings exceed surgical-edit scope (code-fix temptation) | M | M | ADR-004 boundary; defer code-class findings; escalate doc-class P0/P1 if cascade unavoidable |
| R-006 | README HVR score <85 after rewrite | M | M | Iterate until threshold reached; do not commit below 85 |
| R-007 | Phase-5 converges with zero novel gaps | L | M | Explicit empty-result row in resource-map; not a failure mode |

---

## 11. USER STORIES

### US-001: Senior skill maintainer ships a release-ready peer-runtime skill folder (P0)

**As a** senior skill maintainer, **I want** the `deep-loop-runtime` skill folder to conform 1:1 to current sk-doc templates and HVR standards, **so that** downstream evolution work in the 131 arc builds on a clean substrate.

**Acceptance Criteria**:
1. Given the audit completes, when I run `validate.sh --strict` on the spec folder, then exit code is 0.
2. Given the README rewrite ships, when I score it against `hvr_rules.md`, then the score is ≥85.
3. Given the validation gate runs, when phase 4 emits the report, then phase 5 cannot start without an ADR-006 approval entry.
4. Given the audit surfaces code-class bugs in `lib/**`, when I close the packet, then those findings are deferred to follow-on packets and no code edits exist in the diff.

### US-002: Deep-research loop surfaces logic gaps not seen at planning (P1)

**As a** senior skill maintainer, **I want** to run a 10-iteration cli-devin SWE-1.6 deep-research loop on the cleaned skill baseline, **so that** any logic gaps not visible during phase-1 planning are merged into `resource-map.md` before further evolution.

**Acceptance Criteria**:
1. Given the 10 iterations complete, when I read `research/convergence-summary.md`, then the stop reason is documented (converged or hard cap).
2. Given novel gaps surface, when I merge into `resource-map.md`, then each row links to its source iteration file.
3. Given no novel gaps surface, when I update `resource-map.md`, then the Phase-5 Augmentation section explicitly records the empty result.
4. Given cli-devin SWE-1.6 produces a context bundle, when I validate the bundle, then internal_imports + validation_commands pass grep + smoke-run before being treated as authoritative.

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
- **Sibling Packet**: `../002-deep-research/spec.md` (in progress; structural template for this packet)
- **Parent Packet**: `../../spec.md` (000-release-cleanup root)
- **Grandparent Packet**: `../../../spec.md` (116-deep-skill-evolution root)
- **Target Skill**: `.opencode/skills/deep-loop-runtime/`
- **sk-doc templates**: `.opencode/skills/sk-doc/assets/skill/`
- **HVR rules**: `.opencode/skills/sk-doc/references/global/hvr_rules.md`
- **Structural anchor (README)**: `.opencode/skills/system-spec-kit/README.md`
- **Tone anchor (README)**: `Public/README.md`
- **CLI dispatch contract**: `.opencode/skills/cli-devin/SKILL.md` (mandatory pre-read for phase 5)
