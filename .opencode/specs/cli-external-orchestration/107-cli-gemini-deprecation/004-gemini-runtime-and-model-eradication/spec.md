---
title: "Feature Specification: Eradicate Gemini as a host runtime and as a model everywhere outside specs"
description: "Remove every Gemini host-runtime surface (hook subsystems, runtime-detection enums, GEMINI.md doc convention) and every Gemini model reference from active source, tests, manifests, catalogs, playbooks, docs, and changelogs, while preserving specs/** and the external Gemini-CLI binary state in the user home."
trigger_phrases:
  - "gemini runtime eradication"
  - "gemini model removal"
  - "gemini deprecation phase 4"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication"
    last_updated_at: "2026-06-08T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 3 spec for Gemini runtime+model eradication"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/**"
      - ".opencode/skills/system-skill-advisor/**"
      - ".opencode/skills/system-code-graph/mcp_server/lib/runtime-detection.ts"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:14a9ebfc6518badab94cf18b772d74779602aa4f6e08bff976e996b38ff6cce0"
      session_id: "gemini-deprecation-phase4-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Eradicate Gemini as a host runtime entirely (enums, hook subsystems, GEMINI.md)."
      - "Eradicate Gemini as a model everywhere outside specs/**."
      - "Edit release-history changelogs as part of the eradication."
      - "Preserve user-home ~/.gemini and .geminiignore external binary state."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Eradicate Gemini as a host runtime and as a model everywhere outside specs

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phases 001-003 deleted the `cli-gemini` executor/skill surface but deliberately deferred the two architecturally distinct surfaces: Gemini as a host **runtime** (hook subsystems, runtime-detection enums, the `GEMINI.md` root-doc convention) and Gemini as a **model** (`gemini-flash` and related IDs). The operator then directed "no Gemini anywhere" outside `specs/**`. This phase eradicates both surfaces across architectural source, runtime-value tuples, scripts, documentation, and release-history changelogs, in four verified waves.

**Key Decisions**: eradicate Gemini as a host runtime entirely (runtime-detection enums, the hook subsystems in two skills, and the `GEMINI.md` root-doc convention); swap or rewrite comparison/example content rather than gut it to preserve doc value; coordinate-not-thrash with a concurrent session that was independently removing `devin` from `system-skill-advisor`, deferring two files to that session; edit release-history changelogs per operator approval; treat the `gate-3-classifier.ts` Gemini token as a provably behavior-neutral docs-comment removal; preserve the external Gemini-CLI binary state in the user home (`~/.gemini`, `.geminiignore`).

**Critical Dependencies**: the system-spec-kit, system-code-graph, and system-skill-advisor MCP servers, the deep-loop-runtime fallback router, and the spec-kit script/extractor surfaces must compile and pass their targeted suites after Gemini is removed from the runtime enums, hook indexes, runtime-value tuples, and adapter sets.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation` |
| **Predecessor** | `003-cli-gemini-full-purge` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After the executor purge in phases 001-003, "Gemini" still existed in the repo in two separate roles that phase 003 explicitly deferred: as a host **runtime** (the `hooks/gemini/**` subsystems in system-spec-kit and system-skill-advisor, the `gemini-cli` member of every `RuntimeId` union and its detection logic, runtime fixtures, cross-runtime fallback, hook re-export parity, and the `GEMINI.md` root-doc convention) and as a **model** (`gemini-flash` in the deep-loop fallback router, the sk-prompt small-model budgets and profiles, and the cli-devin quota-fallback docs). These surfaces still taught runtime-detection, hook tooling, fallback routing, and contributors that Gemini was a supported host and model.

### Purpose

Remove every Gemini host-runtime and Gemini-model reference outside `specs/**` so no enum, hook subsystem, runtime fixture, runtime-value tuple, script, doc, playbook, or changelog still advertises Gemini as a supported runtime or model, while keeping comparison/example doc value intact and preserving the external Gemini-CLI binary state in the user home.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the `hooks/gemini/` subsystem in system-spec-kit `mcp_server` and remove `gemini-cli` from the `RuntimeId` union and detection in `lib/runtime-detection.ts`; update `hooks/index.ts`, `hooks/README.md`, the runtime fixtures, and the runtime/hook test suites.
- Remove `gemini-cli` from system-code-graph `mcp_server/lib/runtime-detection.ts` and its test.
- Delete the `hooks/gemini/` subsystem in system-skill-advisor with its test and two Gemini docs; de-index the feature catalog (37 to 36) and manual testing playbook (46 to 45) including the enforcing vitest.
- Remove `gemini-flash` from the deep-loop-runtime fallback router and test, the sk-prompt-models model-profiles/per-model-budgets/refs, and the cli-devin quota-fallback doc.
- Remove Gemini from the system-skill-advisor runtime-VALUE surface: the canonical tuple in `advisor-runtime-values.ts`, `metrics.ts`, the tool schemas, the plugin bridge, the Python advisor script, the parity/observability/plugin-bridge tests, and the bench.
- Remove the Gemini docs-comment token from `shared/gate-3-classifier.ts` (provably behavior-neutral) and Gemini references from the spec-kit script and extractor surfaces with their tests.
- Update deep-loop-runtime, deep-improvement, sk-doc, the session-cleanup plugin, and cli-devin code/docs that named Gemini as a runtime or fan-out executor.
- Delete four whole Gemini-runtime documentation files in system-spec-kit, correct the catalog and playbook count self-checks, and update the broad top-level/refs/guides, cli-* skill docs, misc docs, and three shell scripts.
- Edit release-history changelogs that name Gemini and reconcile runtime/mirror counts.
- Preserve all `specs/**` historical records during the eradication.

### Out of Scope
- The external Gemini-CLI binary state in the user home (`~/.gemini`) and the `.geminiignore` ignore file - intentionally left intact as third-party binary state.
- Any edits under `specs/**` or `.opencode/specs/**` except this active packet.
- Two system-skill-advisor files deferred to a concurrent `devin`-removal session: `mcp_server/tests/hooks/settings-driven-invocation-parity.vitest.ts` (its Gemini mentions are pro-eradication negative assertions) and `references/decisions/deferred_decisions.md` (historical migration records).
- Re-running the central validation and metadata generation (handled by the orchestrator after authoring).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/` | Delete | Remove the Gemini hook subsystem directory. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/runtime-detection.ts` | Modify | Remove `gemini-cli` from the `RuntimeId` union and detection. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/index.ts` | Modify | Drop the Gemini hook export. |
| `.opencode/skills/system-skill-advisor/hooks/gemini/` | Delete | Remove the Gemini hook subsystem directory + its test + 2 docs. |
| `.opencode/skills/system-code-graph/mcp_server/lib/runtime-detection.ts` | Modify | Remove `gemini-cli` from the runtime enum + test. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/advisor-runtime-values.ts` | Modify | Remove Gemini from the canonical runtime-value tuple. |
| `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` | Modify | Remove the `GEMINI.md` docs-comment token (behavior-neutral). |
| `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/gemini-cli-hooks.md` | Delete | Remove the Gemini-runtime catalog doc; correct count. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/**` | Modify / Delete | Delete 3 Gemini-runtime playbook docs; correct count self-checks. |
| `.opencode/changelog/**` | Modify | Edit release-history changelogs naming Gemini; reconcile counts. |
| `.opencode/specs/skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication/**` | Create | Author this packet's Level 3 SpecKit docs. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove `gemini-cli` from every runtime-detection enum and delete the Gemini hook subsystems. | `RuntimeId` unions in system-spec-kit and system-code-graph contain no `gemini-cli`; `hooks/gemini/` is absent in both system-spec-kit and system-skill-advisor. |
| REQ-002 | Remove Gemini from the system-skill-advisor runtime-VALUE surface. | The canonical tuple, metrics, schemas, plugin bridge, and Python script contain no Gemini; parity/observability/plugin-bridge tests are GREEN. |
| REQ-003 | Remove every `gemini-flash` model reference from active source/docs. | deep-loop fallback router, sk-prompt budgets/profiles, and cli-devin quota-fallback contain no `gemini-flash`. |
| REQ-004 | Targeted suites stay GREEN after the eradication. | system-spec-kit hooks 59 passed (1 pre-existing copilot skip), code-graph runtime 14/14, fallback-router 8/8, remediation 25/25, spec-kit scripts 8/8 + 267/267 extractors, promote 3/3; playbook count self-check 387==387. |
| REQ-005 | No Gemini references remain outside `specs/**` except the two documented deferred files. | `rg "gemini"` excluding `specs/**` returns only the 2 deferred system-skill-advisor files. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve doc value in comparison/example content. | `cli-claude-code/references/claude_tools.md` is rewritten from a 3-way comparison to a 2-way Claude-vs-Codex comparison rather than deleted; dashboard sample swapped Gemini to Codex. |
| REQ-007 | Edit release-history changelogs and reconcile counts per operator direction. | 43 changelog files plus top-level `PUBLIC_RELEASE.md` updated; runtime/mirror counts reconciled (e.g. 5 to 4, 4 to 3); only `specs/**` exempt. |
| REQ-008 | Three touched shell scripts remain valid. | `bash -n` passes for all 3 shell scripts, including the load-bearing `orphan-mcp-sweeper.sh` edit. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Global `rg "gemini"` excluding `specs/**` returns only the two documented DEFERRED system-skill-advisor files.
- **SC-002**: All touched suites are GREEN: system-spec-kit hooks 59 (1 pre-existing copilot skip), code-graph runtime 14/14, fallback-router 8/8, remediation 25/25, spec-kit scripts 8/8 + 267/267 extractors, promote 3/3.
- **SC-003**: The system-skill-advisor feature catalog is 36 (was 37) and the manual testing playbook is 45 (was 46); the system-spec-kit count self-checks read playbook 387 and catalog 324; the playbook hard-coded file-count self-check passes 387==387.
- **SC-004**: Three touched shell scripts pass `bash -n`; the matrix/JSON manifests parse.
- **SC-005**: The user-home `~/.gemini` and `.geminiignore` external binary state remain untouched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing `gemini-cli` from the `RuntimeId` union breaks type narrowing across hooks | High | Update hook index, re-export parity, fixtures, and tests together; run the hooks suite. |
| Risk | A concurrent session editing the same skill (`devin` removal) causes thrash | High | Coordinate-not-thrash: defer 2 system-skill-advisor files to that session; merge the tuple cleanly. |
| Risk | Deleting comparison docs loses doc value | Medium | Rewrite the 3-way `claude_tools.md` comparison to a 2-way comparison instead of deleting. |
| Risk | Count self-checks drift after de-indexing catalog/playbook entries | Medium | Correct catalog 37 to 36, playbook 46 to 45 and the hard-coded 387==387 self-check. |
| Risk | A load-bearing Gemini token in a shell script is removed unsafely | Medium | The `orphan-mcp-sweeper.sh` session-tree pgrep pattern and operator-preserve case were removed safely; `bash -n` OK. |
| Dependency | External Gemini-CLI binary state in the user home | Low | Leave `~/.gemini` and `.geminiignore` intact by design. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance change is expected; this is runtime-surface, model-reference, and documentation cleanup.

### Security
- **NFR-S01**: No secrets are introduced or exposed while editing source, tests, manifests, scripts, and changelogs.

### Reliability
- **NFR-R01**: Runtime detection must no longer resolve to `gemini-cli`; cross-runtime fallback must route only among the surviving runtimes after the enum is narrowed.

---

## 8. EDGE CASES

### Data Boundaries
- The external Gemini-CLI binary state (`~/.gemini`, `.geminiignore`) is not a project runtime reference and is intentionally retained.
- The two deferred system-skill-advisor files (negative-assertion parity test, historical decisions doc) are intentionally retained and handed to the concurrent `devin`-removal session.

### Error Scenarios
- A comparison/example doc that loses its only Gemini column must be rewritten to preserve the surviving comparison, not deleted.
- A shell script with a load-bearing Gemini pgrep pattern must be edited so the session-tree sweep stays correct; `bash -n` confirms validity.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 24/25 | Architectural source, runtime-value tuples, scripts, ~87 docs, and 43+ changelogs across many skills. |
| Risk | 19/25 | Runtime-enum narrowing, hook-subsystem deletion, and a concurrent same-skill session. |
| Research | 15/20 | Requires global exact search plus per-skill review of runtime, hook, value-tuple, and model wiring. |
| Multi-Agent | 6/15 | Coordinated with a concurrent independent `devin`-removal session in one skill. |
| Coordination | 13/15 | Cross-skill source/test/doc/changelog edits and count self-checks must stay synchronized. |
| **Total** | **77/100** | **Level 3 selected to match the parent packet's decision-record discipline.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Type narrowing breaks after removing `gemini-cli` from runtime unions. | H | M | Update index/parity/fixtures/tests before verification. |
| R-002 | Concurrent same-skill session thrash on the runtime-value tuple. | H | M | Defer 2 files; merge the tuple so Gemini is fully gone. |
| R-003 | Doc value lost when deleting comparison content. | M | M | Rewrite 3-way to 2-way; swap dashboard sample to Codex. |
| R-004 | Count self-checks drift after de-indexing. | M | M | Correct catalog/playbook counts and the 387==387 self-check. |
| R-005 | Load-bearing shell-script Gemini token removed unsafely. | M | L | Edit the sweeper safely; `bash -n` OK. |

---

## 11. USER STORIES

### US-001: Runtime detection no longer knows Gemini (Priority: P0)

**As a** maintainer, **I want** `gemini-cli` removed from every runtime-detection enum and the Gemini hook subsystems deleted, **so that** no runtime path treats Gemini as a supported host.

**Acceptance Criteria**:
1. Given the runtime-detection modules, When `gemini-cli` is searched, Then no `RuntimeId` union, detection branch, or hook subsystem references it, and the hooks suite is GREEN.

---

### US-002: Repo is clean of Gemini outside specs (Priority: P0)

**As a** maintainer, **I want** zero Gemini references outside `specs/**` except the two documented deferred files, **so that** no source, doc, or history advertises a removed runtime or model.

**Acceptance Criteria**:
1. Given the repo, When `rg "gemini"` runs excluding `specs/**`, Then it returns only the two deferred system-skill-advisor files.

---

### US-003: Comparison doc value preserved (Priority: P1)

**As a** maintainer, **I want** comparison/example content rewritten rather than deleted, **so that** the surviving comparisons keep their instructional value.

**Acceptance Criteria**:
1. Given `claude_tools.md`, When Gemini is removed, Then the doc becomes a coherent 2-way Claude-vs-Codex comparison rather than a gutted page.

---

## 12. OPEN QUESTIONS

- None. The operator directed "no Gemini anywhere" outside `specs/**`, approved changelog edits, and the external `~/.gemini` / `.geminiignore` binary state is left intact by design.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Resource Map**: See `resource-map.md`
