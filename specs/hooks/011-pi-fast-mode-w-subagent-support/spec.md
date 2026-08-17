---
title: "Feature Specification: pi-fast-mode-w-subagent-support"
description: "Phase parent: fork pi-openai-fast-mode into pi-fast-mode-w-subagent-support, adding pi-gpt-fast-mode-style subagent handoff via environment inheritance."
trigger_phrases:
  - "pi-fast-mode-w-subagent-support"
  - "fast mode subagent handoff"
  - "openai fast mode fork"
  - "011-pi-fast-mode-w-subagent-support"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support"
    last_updated_at: "2026-08-17T03:34:48Z"
    last_updated_by: "claude-code"
    recent_action: "All 3 workstreams complete: fork, handoff, integration+live all green"
    next_safe_action: "Merge worktrees/013-pi-fast-mode to skilled/v4.0.0.0"
    blockers: []
    key_files:
      - "context/pi-openai-fast-mode/"
      - "context/pi-gpt-fast-mode/"
      - "context/pi-fast-mode/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Install from the local package path; npm publication stays deferred."
      - "pi-gpt-fast-mode was removed during the 002 install transition; the fork replaced it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: pi-fast-mode-w-subagent-support

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | hooks/011-pi-fast-mode-w-subagent-support |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child phase passes `validate.sh --strict`; parent map reflects phase status |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The fast-mode engine, child-process handoff, and installed-environment proof span separate ownership boundaries. A single packet must coordinate them without letting package, lifecycle, install, or live-runtime concerns drift together.

The research-selected engine keeps the OpenAI/OpenAI-Codex target and `{ enabled, targets }` configuration contract. The handoff contract uses `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1|0`, strict parsing, and process inheritance. The runtime proof must also cover namespaced `setStatus`, command ownership, package loading, and custom-footer/RPC behavior.

This packet coordinates a single `pi-fast-mode-w-subagent-support` extension across three top-level workstreams. Each workstream is itself a phase parent with three executable child phases.

### Purpose

Produce a tested raw-TypeScript Pi extension that preserves the researched engine/config behavior, adds strict child handoff, and is installed only after package, command ownership, live UI, and rollback gates pass.

### Phase Decomposition Qualification

Phase complexity score: **40/50** (architectural decisions 10 + file count > 15 10 + LOC > 800 10 + risk ≥ moderate 10 + extreme scale 0). Documentation level: **3** (fork + cross-package integration + test suite). Both thresholds met → phased packet with **3 phases** (score range 35–44).

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A raw-TypeScript fork package with the researched `{ enabled, targets }` engine, config compatibility, atomic persistence, request/model guards, and package provenance.
- Strict `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1|0` handoff, presence-aware flag precedence, child-process isolation, and target-gated application.
- Layered Vitest/typecheck coverage, install transition and `get_commands` ownership proof, live namespaced `setStatus`/optional widget checks, and child-session evidence.
- Canonical settings/PLUGINS.md updates, sync validation, and a documented rollback boundary.

### Out of Scope

- npm registry publication (open question — local install until decided).
- New tier-selection UX; service tiers stay per-target and guarded by configuration.
- Non-OpenAI providers; the fork keeps upstream's `openai` / `openai-codex` target model.
- The `pi-fast-mode` footer-composition approach as the default indicator; research retains it only as a rejected reference. The default contract is namespaced `setStatus`, with an optional widget path.

### Files to Change

Aggregate scope; per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| Fork `src/`, config, payload, and package metadata | Create/Modify | 1 | Establish source, compatibility, request safety, and package gates |
| Fork `src/handoff.ts`, `src/types.ts`, `src/index.ts` | Create/Modify | 2 | Define and wire strict child handoff |
| Fork `tests/` and live verification fixtures | Modify/Create | 3 | Deterministic suite plus runtime-only proof |
| `.pi/settings.json`, package scopes, `.pi/PLUGINS.md` | Modify/Verify | 3 | Replace the colliding extension and synchronize docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-fork-and-package/` | Nested parent: source baseline, identity/config compatibility, package baseline gates | complete |
| 2 | `002-subagent-handoff/` | Nested parent: strict contract, session precedence, process propagation | complete |
| 3 | `003-integration-and-tests/` | Nested parent: integration suite, install transition, live verification and sync | complete |

### Phase Transition Rules

- Each top-level phase parent and each nested child MUST pass `validate.sh --strict` before its next handoff.
- Each nested parent owns its own Phase Documentation Map; the root map tracks only the three workstreams.
- Use `/speckit:resume hooks/011-pi-fast-mode-w-subagent-support/[NNN-phase]/[NNN-child]/` to resume a leaf.
- Run recursive validation from the root after metadata refresh to validate the integrated tree.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-fork-and-package/` | `002-subagent-handoff/` | Nested package children pass; config compatibility, atomic writes, request guards, raw packaging, provenance, and baseline gates are recorded | Recursive child validation; `tsc --noEmit`; Vitest; `npm pack --dry-run` |
| `002-subagent-handoff/` | `003-integration-and-tests/` | Strict contract, explicit-flag precedence, child isolation, and deterministic propagation proof pass | Handoff matrix; child-process test; target-gating regression suite |
| `003-integration-and-tests/` | Packet closeout | Install ownership, live UI/handoff, PLUGINS.md, sync, and rollback evidence are complete | `get_commands`; live receipts; `sync-pi-configs.sh --check`; final diff |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which package location and install source should the implementation pin first: local path or git?
- Which one-time config compatibility policy should preserve existing state without unconditional scope merging?
- Which live TUI/RPC evidence is available for namespaced `setStatus`, optional widgets, custom footers, and child sessions?
<!-- /ANCHOR:questions -->

## RESEARCH CONTEXT

Deep-research is active for this topic. `research/research.md` remains the canonical research source.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Research findings

- Ten approved research lanes completed. The fork should preserve the `pi-openai-fast-mode` config/target engine and add strict `1`/`0` environment handoff on `session_start` for child Pi processes.
- Use replace-style `before_provider_request` payload handling, explicit `service_tier` and `payload.model` guards, atomic config/state writes, and a namespaced `setStatus` indicator rather than exclusive `setFooter` rendering.
- Preserve legacy config migration, verify `/fast` ownership with `get_commands`, ship raw TypeScript through `pi.extensions`, and add child-process handoff tests plus the phase-defined licensing/provenance checks.
- Full evidence and residual implementation probes: `research/research.md`; per-iteration audit trail: `research/iterations/` and `research/deltas/`.
<!-- END GENERATED: deep-research/spec-findings -->

## RELATED DOCUMENTS

- **Top-level phase parents**: See `001-fork-and-package/`, `002-subagent-handoff/`, and `003-integration-and-tests/`; each contains three leaf phase specifications.
- **Context snapshots**: See `context/README.md` for pinned source provenance.
- **Research packet**: See `research/` for the workflow-owned state and synthesis artifacts.
