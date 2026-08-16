---
title: "Feature Specification: fork-and-package workstream"
description: "Nested phase parent for establishing the fast-mode extension baseline, configuration safety, and distributable package contract."
trigger_phrases:
  - "fork-and-package workstream"
  - "fast-mode package baseline"
  - "fast-mode config compatibility"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Identity/config compat (002) complete; tsc + 57 tests green"
    next_safe_action: "Execute 003-package-baseline-gates next"
    blockers: []
    key_files:
      - "../spec.md"
      - "../research/research.md"
      - "../context/pi-openai-fast-mode/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 67
    open_questions:
      - "Which package location gives local and git installs the smallest operational surface?"
      - "Which one-time configuration compatibility policy should the implementation test?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This parent owns only the workstream purpose, scope, child map, and handoff rules.
  Detailed plans, tasks, checklists, decisions, and continuity live in child folders.
-->

# Feature Specification: fork-and-package workstream

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package |
| **Predecessor** | None |
| **Successor** | 002-subagent-handoff |
| **Handoff Criteria** | All three child phases pass strict validation; the package baseline, compatibility policy, and distribution checks are recorded |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The implementation needs a stable fast-mode extension baseline before handoff behavior and environment installation are added. The baseline must preserve the upstream target/config model while making package identity, persistence safety, request guards, and distribution behavior explicit.

### Purpose
Establish a testable, raw-TypeScript package foundation that the handoff workstream can extend without changing ownership boundaries or leaving existing configuration unusable.

> **Phase-parent note:** This spec.md is the only authored document at this parent level. Detailed plans, tasks, checklists, decisions, and continuity live in the child phases below.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Source baseline and package identity for the `pi-fast-mode-w-subagent-support` extension.
- Configuration compatibility, atomic persistence, invalid-state handling, and explicit request/model guards.
- Raw TypeScript package metadata, Pi extension manifest, licensing/provenance, and baseline verification.

### Out of Scope
- Parent-to-child environment handoff; it belongs to `002-subagent-handoff/`.
- Installation, command ownership probes, live TUI/RPC checks, and repository sync; they belong to `003-integration-and-tests/`.
- npm publication as a release decision.

### Files to Change

| File Path | Change Type | Child Phase | Description |
|-----------|-------------|-------------|-------------|
| Fork package source and tests | Create/Modify | 001-source-baseline | Establish the source tree and identity baseline |
| Config and persistence modules | Modify | 002-identity-config-compat | Define compatibility, safe writes, and request guards |
| `package.json`, `README.md`, `tsconfig.json`, `LICENSE` | Modify/Verify | 003-package-baseline-gates | Make the package loadable, discoverable, and attributable |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently executable workstream. Child plans own implementation details; this parent owns sequencing and handoffs.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-source-baseline/` | Establish the source snapshot, package location, and clean baseline boundary | complete |
| 2 | `002-identity-config-compat/` | Apply package/config identity, compatibility policy, atomic writes, and request guards | complete |
| 3 | `003-package-baseline-gates/` | Finalize Pi packaging, provenance, and typecheck/test/pack gates | draft |

### Phase Transition Rules

- Each child passes `validate.sh --strict` before the next child starts.
- The package source baseline is fixed before compatibility changes are implemented.
- The compatibility policy is fixed before package-level verification is accepted.
- The parent map remains `draft` until all three children and their evidence are complete.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-source-baseline` | `002-identity-config-compat` | Source tree and package work location are fixed; upstream reference remains untouched | Source inventory and clean baseline diff |
| `002-identity-config-compat` | `003-package-baseline-gates` | Identity, compatibility, safe persistence, and request guard behavior are specified and unit-tested | Focused tests plus strict validation |
| `003-package-baseline-gates` | `../002-subagent-handoff/` | Raw TypeScript package loads, provenance is preserved, and baseline gates pass | `tsc --noEmit`, Vitest, `npm pack --dry-run` |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which package location best supports local and pinned git installation without adding a build step?
- Does the compatibility implementation use a one-time legacy-path read with new-path write, or retain a bounded read fallback?
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent packet:** See `../spec.md`.
- **Research:** See `../research/research.md`.
- **Child phases:** See `001-source-baseline/`, `002-identity-config-compat/`, and `003-package-baseline-gates/`.
- **Pinned sources:** See `../context/README.md`.
