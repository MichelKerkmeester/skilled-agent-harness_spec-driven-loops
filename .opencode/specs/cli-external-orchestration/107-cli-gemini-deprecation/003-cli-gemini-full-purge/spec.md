---
title: "Feature Specification: Purge the cli-gemini executor everywhere outside specs"
description: "Remove every cli-gemini executor reference from active skill source, tests, manifests, feature catalogs, testing playbooks, and changelogs while preserving specs/** as historical context and leaving Gemini-as-runtime and Gemini-as-model surfaces intact."
trigger_phrases:
  - "cli-gemini executor purge"
  - "cli-gemini executor removal"
  - "gemini deprecation phase 3"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/003-cli-gemini-full-purge"
    last_updated_at: "2026-06-08T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 3 spec for cli-gemini executor purge"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/**"
      - ".opencode/skills/deep-improvement/**"
      - ".opencode/skills/system-spec-kit/mcp_server/matrix_runners/**"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:5466a93dad2757456888056a92d56cd402809b14e251f2fb95175c757b4aa14e"
      session_id: "gemini-deprecation-phase3-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Purge every cli-gemini executor reference outside specs/**."
      - "Edit release-history changelogs as part of the purge."
      - "Leave Gemini-as-runtime and Gemini-as-model surfaces for a separate decision."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Purge the cli-gemini executor everywhere outside specs

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 001 deleted the `cli-gemini` SKILL and the project `.gemini` runtime surface; phase 002 cleaned the command-layer YAML and docs. But `cli-gemini` remained wired as a first-class **executor** across many skills' source, tests, manifests, feature catalogs, testing playbooks, and changelogs. This phase removes every `cli-gemini` executor reference outside `specs/**`, including release-history changelogs.

**Key Decisions**: swap-not-delete for mixed cross-CLI scenarios and the council fixture (preserve other-CLI coverage by substituting `cli-codex`/`cli-opencode`); delete only purely-`cli-gemini` artifacts; edit release-history changelogs because the operator directed "purge everything" with only `specs/**` exempt; scope this phase to the executor/skill surface and leave Gemini-as-runtime and Gemini-as-model surfaces intact.

**Critical Dependencies**: deep-loop-runtime, deep-improvement, and system-spec-kit matrix tooling must compile and pass their targeted suites after `cli-gemini` is removed from executor unions, whitelists, and adapter sets.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | main |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation` |
| **Predecessor** | `002-command-yaml-gemini-cleanup` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After phases 001 and 002, `cli-gemini` still existed as a first-class executor across active source: deep-loop executor unions and audit maps, deep-improvement model-benchmark dispatch, the system-spec-kit matrix runner adapter set, the multi-AI council fixture, plus a wide spread of feature catalogs, manual testing playbooks, references, a constitutional file, and release-history changelogs. Any of these would keep teaching tooling and contributors that `cli-gemini` is a dispatchable executor even though its skill and runtime surface are already deleted.

### Purpose

Remove every active `cli-gemini` executor reference outside `specs/**` so no source, test, manifest, doc, playbook, or changelog still advertises `cli-gemini` as a usable executor, while keeping other-CLI coverage intact and leaving the separate Gemini-runtime and Gemini-model surfaces untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `cli-gemini` from deep-loop-runtime executor kinds, flag-support maps, the `ExecutorNotWiredError` Extract, the Gemini sandbox-mode/whitelist code, executor-audit map entries, the fan-out runner, and the affected unit tests and feature catalog.
- Remove `cli-gemini` from deep-improvement model-benchmark dispatch (`KNOWN_EXECUTORS`, case block), profile validator, remediation test, SKILL.md, feature catalogs, and README.
- Delete the purely-`cli-gemini` system-spec-kit matrix adapter and its test (source plus compiled `dist`), and remove `cli-gemini` from the run-matrix union/array/switch, the matrix manifest cells, and matrix docs and templates.
- Swap `cli-gemini` to `cli-opencode` in the multi-AI council fixture and its persistence assertion (logic-verified by direct node run).
- Update system-spec-kit feature catalogs, manual testing playbooks, the template guide, and the constitutional `cli-dispatch-skill-preload.md` to drop `cli-gemini`.
- Update deep-research and deep-review docs (loop protocols, SKILL.md, executor-selection contract, feature catalog) to drop `cli-gemini`.
- Rename the sk-code-review and sk-git cross-CLI handback playbooks that paired `cli-gemini`, swapping it to `cli-codex` to preserve cross-CLI coverage while keeping their CR-018 / GIT-022 IDs and counts.
- Edit release-history changelogs that name `cli-gemini` as an executor (operator-approved).
- Preserve all `specs/**` historical records during the purge.

### Out of Scope
- Gemini-as-a-RUNTIME (hooks, runtime-detection, runtime mirrors) — a separate ~198-file surface left intact and flagged for a separate decision.
- Gemini-as-a-MODEL (`gemini-flash`, `gemini-3.1-pro`, and similar model IDs) — left intact and flagged for a separate decision.
- Any edits under `specs/**` or `.opencode/specs/**` except this active packet.
- Re-running the central validation and metadata generation (handled by the orchestrator after authoring).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modify | Remove `cli-gemini` from kinds/flags/Extract; delete Gemini sandbox-mode and whitelist code. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Modify | Remove the five `cli-gemini` map entries. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Remove the map entry, the if-block, and the Gemini sandbox ternary branch. |
| `.opencode/skills/deep-loop-runtime/tests/unit/*.vitest.ts` | Modify | Delete `cli-gemini` cases or swap foils to other CLIs. |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/**` | Modify | Remove `cli-gemini` from dispatch, validator, and remediation test. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-gemini.ts` | Delete | Remove the Gemini-only matrix adapter and its compiled dist. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-gemini.vitest.ts` | Delete | Remove the Gemini-only adapter test. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts` | Modify | Remove `cli-gemini` from import/union/array/switch. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json` | Modify | Remove all `cli-gemini` cells and F11 applicability. |
| `.opencode/skills/*/feature_catalog/**`, `.opencode/skills/*/manual_testing_playbook/**` | Modify | Drop `cli-gemini` from inventory docs and playbooks; rename mixed handback scenarios. |
| `.opencode/changelog/**` | Modify | Edit release-history changelogs naming `cli-gemini` as an executor. |
| `.opencode/specs/skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/003-cli-gemini-full-purge/**` | Create | Author this packet's Level 3 SpecKit docs. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove `cli-gemini` from all active executor source. | Executor unions, whitelists, audit maps, dispatch case blocks, and the fan-out runner contain no `cli-gemini` after edits. |
| REQ-002 | Delete the purely-`cli-gemini` matrix adapter and its test. | `adapter-cli-gemini.ts`, `matrix-adapter-gemini.vitest.ts`, and the four compiled `dist/matrix_runners/adapter-cli-gemini.*` are absent. |
| REQ-003 | Targeted suites stay GREEN after the purge. | deep-loop-runtime 213/214 (1 pre-existing flake), matrix-adapter 13/13, remediation 25/25. |
| REQ-004 | No `cli-gemini` references remain outside `specs/**`. | `rg "cli-gemini|cli_gemini"` excluding `specs/**` returns zero matches. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Preserve cross-CLI coverage in mixed scenarios. | Council fixture, CR-018, and GIT-022 keep coverage of the other CLIs via `cli-codex`/`cli-opencode` substitution; playbook counts (18, 22) unchanged. |
| REQ-006 | Keep the matrix internally consistent after recount. | Matrix is 3 executors × 13 features = 39 cells (no F8); `matrix-manifest.json` is valid JSON. |
| REQ-007 | Edit release-history changelogs per operator direction. | Changelogs naming `cli-gemini` as an executor are updated; only `specs/**` is exempt. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Global `rg "cli-gemini|cli_gemini"` excluding `specs/**` returns zero matches.
- **SC-002**: deep-loop-runtime (213/214, 1 pre-existing flake), matrix-adapter (13/13), and remediation (25/25) suites are GREEN.
- **SC-003**: The matrix is 13 features × 3 executors = 39 cells with no F8, and `matrix-manifest.json` parses as valid JSON.
- **SC-004**: Renamed handback playbooks keep their CR-018 / GIT-022 IDs and their counts of 18 and 22.
- **SC-005**: Gemini-as-runtime and Gemini-as-model surfaces remain untouched and flagged for a separate decision.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing `cli-gemini` from executor unions breaks type narrowing | High | Narrow `ExecutorNotWiredError` Extract to `cli-claude-code` and update affected tests. |
| Risk | Deleting matrix cells leaves the manifest inconsistent | Medium | Recount to 39 cells (no F8) and validate JSON. |
| Risk | Deleting mixed-CLI scenarios drops coverage of other CLIs | Medium | Swap to `cli-codex`/`cli-opencode` instead of deleting. |
| Risk | A pre-existing flake masks a real failure | Low | Confirm the loop-lock failure passes 7/7 in isolation; it is cross-process, not Gemini-related. |
| Dependency | Compiled `dist` mirrors source for matrix adapters | Medium | Delete the four compiled `dist/matrix_runners/adapter-cli-gemini.*` alongside source. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance change is expected; this is executor-surface and documentation cleanup.

### Security
- **NFR-S01**: No secrets are introduced or exposed while editing source, tests, manifests, and changelogs.

### Reliability
- **NFR-R01**: Executor dispatch must reject `cli-gemini` as unwired rather than silently falling through after the union is narrowed.

---

## 8. EDGE CASES

### Data Boundaries
- Gemini-as-model IDs (`gemini-flash`, `gemini-3.1-pro`) are not executor references and are intentionally retained.
- Gemini-as-runtime references (hooks, runtime-detection) are a separate surface and intentionally retained.

### Error Scenarios
- A mixed cross-CLI playbook that loses its only `cli-gemini` pairing must be swapped, not deleted, so the other CLI keeps coverage.
- A vitest harness that SIGSEGVs under Node v25 in this environment is verified via a direct node run instead.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Source, tests, manifests, catalogs, playbooks, and changelogs across many skills. |
| Risk | 17/25 | Executor-union narrowing and matrix recount can break type checks and JSON validity. |
| Research | 13/20 | Requires global exact search plus per-skill review of executor wiring. |
| Multi-Agent | 0/15 | Authored as a single executor pass. |
| Coordination | 12/15 | Cross-skill source/test/doc/changelog edits must stay synchronized. |
| **Total** | **63/100** | **Level 3 selected to match the parent packet's decision-record discipline.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Type narrowing breaks after removing `cli-gemini` from unions. | H | M | Update Extract and affected tests before verification. |
| R-002 | Matrix manifest becomes inconsistent after cell removal. | M | M | Recount to 39 cells and validate JSON. |
| R-003 | Coverage loss when deleting mixed cross-CLI scenarios. | M | M | Swap to another CLI instead of deleting. |
| R-004 | Compiled dist remains stale after source delete. | M | M | Delete the compiled adapter dist alongside source. |

---

## 11. USER STORIES

### US-001: Executor source no longer wires cli-gemini (Priority: P0)

**As a** maintainer, **I want** `cli-gemini` removed from all active executor source, **so that** no dispatch path treats it as a usable executor.

**Acceptance Criteria**:
1. Given active executor source, When `cli-gemini` is searched, Then no union, whitelist, audit map, or case block references it.

---

### US-002: Repo is clean of cli-gemini outside specs (Priority: P0)

**As a** maintainer, **I want** zero `cli-gemini` references outside `specs/**`, **so that** docs and tooling stop advertising a deleted executor.

**Acceptance Criteria**:
1. Given the repo, When `rg "cli-gemini|cli_gemini"` runs excluding `specs/**`, Then it returns zero matches.

---

### US-003: Cross-CLI coverage preserved (Priority: P1)

**As a** maintainer, **I want** mixed cross-CLI scenarios swapped rather than deleted, **so that** coverage of the other CLIs is not lost.

**Acceptance Criteria**:
1. Given CR-018, GIT-022, and the council fixture, When `cli-gemini` is replaced by `cli-codex`/`cli-opencode`, Then IDs and playbook counts stay the same and other-CLI coverage remains.

---

## 12. OPEN QUESTIONS

- None. The operator approved purging everything outside `specs/**`, including changelogs, and deferred the Gemini-runtime and Gemini-model surfaces.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Resource Map**: See `resource-map.md`
