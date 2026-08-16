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
    last_updated_at: "2026-08-16T09:20:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Scaffolded phased packet, downloaded context sources, authored parent and child docs"
    next_safe_action: "Plan and execute phase 001-fork-and-package"
    blockers: []
    key_files:
      - "context/pi-openai-fast-mode/"
      - "context/pi-gpt-fast-mode/"
      - "context/pi-fast-mode/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Publish the fork to the npm registry, or install from a local/git source only?"
      - "Keep pi-gpt-fast-mode installed alongside during migration, or remove it in phase 003?"
    answered_questions: []
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
| **Status** | Draft |
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

The two leading pi fast-mode extensions cover complementary halves of the requirement, but neither covers both:

- `pi-openai-fast-mode` (v0.3.0) has the stronger engine: native GPT-5.6 targets (5.6 / 5.6-sol / 5.6-terra / 5.6-luna for both `openai` and `openai-codex`), per-target `service_tier`, a self-upgrading target list (`syncSupportedTargets`), durable config saves, error notifications, and a widget-based indicator that survives custom footers. It has **no subagent handoff**: child pi processes start with fast mode off regardless of the parent's preference.
- `pi-gpt-fast-mode` (v0.1.2) is the only one with subagent handoff — the desired preference is exported into the process environment (`PI_GPT_FAST_MODE=1|0`) so spawned child pi processes inherit and confirm it on `session_start` — but its defaults cover GPT-5.4/5.5 only (5.6 requires a manual config override), its indicator is hidden by custom footers, and its config does not self-upgrade.

This packet builds a single extension, `pi-fast-mode-w-subagent-support`, that combines the two: the openai-fast-mode engine with the gpt-fast-mode handoff mechanism.

### Purpose

Produce a forked, renamed, tested extension package that behaves exactly like `pi-openai-fast-mode` and additionally hands the fast-mode preference down to subagents, then install it in place of the current `pi-gpt-fast-mode` (which collides on the `/fast` command).

### Phase Decomposition Qualification

Phase complexity score: **40/50** (architectural decisions 10 + file count > 15 10 + LOC > 800 10 + risk ≥ moderate 10 + extreme scale 0). Documentation level: **3** (fork + cross-package integration + test suite). Both thresholds met → phased packet with **3 phases** (score range 35–44).

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fork of `pi-openai-fast-mode` v0.3.0 (source snapshot in `context/pi-openai-fast-mode/`) renamed to `pi-fast-mode-w-subagent-support`, preserving the config format, `/fast` command, `--fast` flag, and widget indicator.
- Subagent handoff modeled on `pi-gpt-fast-mode` (reference in `context/pi-gpt-fast-mode/src/handoff.ts`): preference exported via `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1|0`, inherited by child processes, confirmed on `session_start`, applied only when the child's model matches a configured target.
- Ported and extended vitest suite (upstream tests + handoff propagation tests).
- Installation in this environment: settings entry, removal of `pi-gpt-fast-mode` (command collision), PLUGINS.md update, sync + commit per the repo's pi sync manifest.

### Out of Scope

- npm registry publication (open question — local install until decided).
- New tier-selection UX (tier stays per-target from config, as upstream).
- Non-OpenAI providers; the fork keeps upstream's `openai` / `openai-codex` target model.
- The `pi-fast-mode` (TheBinaryGuy) footer-composition approach — retained in `context/` as a considered-and-rejected reference for indicator UX.

### Files to Change

Aggregate scope; per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `src/` (index, config, payload, commands, status, types) | Copy + rename | 1 | Forked engine with new package identity |
| `src/handoff.ts` (new) | Create | 2 | Env-based preference export/read |
| `src/index.ts` | Modify | 2 | session_start handoff confirmation, flag + handoff precedence |
| `tests/` | Copy + extend | 3 | Upstream suite + handoff tests |
| `package.json`, `README.md`, `tsconfig.json` | Modify | 1 | New package identity and docs |
| `.pi/settings.json`, `.pi/PLUGINS.md` | Modify | 3 | Install + document the fork, drop pi-gpt-fast-mode |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-fork-and-package/ | Fork pi-openai-fast-mode source, rename package identity, keep behavior byte-identical | Pending |
| 2 | 002-subagent-handoff/ | Add env-based handoff (write on toggle/flag, read + apply on child session_start) | Pending |
| 3 | 003-integration-and-tests/ | Extend test suite, install in settings replacing pi-gpt-fast-mode, verify in-session, update PLUGINS.md + sync/commit | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume hooks/011-pi-fast-mode-w-subagent-support/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-fork-and-package | 002-subagent-handoff | Renamed package typechecks; upstream vitest suite passes unmodified; behavior unchanged (no handoff yet) | `npm run typecheck` + `npm test` exit 0; `git diff` vs upstream limited to identity renames |
| 002-subagent-handoff | 003-integration-and-tests | Handoff unit tests pass; parent → child process preference propagation verified manually | `npm test` exit 0; two-process handoff check in plan.md |
<!-- /ANCHOR:phase-map -->
