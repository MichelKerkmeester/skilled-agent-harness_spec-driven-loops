---
title: "Feature Specification: Executor Wiring & Fan-out Parity"
description: "Group the deep-loop CLI fan-out executor work: wiring individual executor kinds and proving every cli/provider/model combination is reachable end-to-end."
trigger_phrases:
  - "executor wiring and fan-out parity"
  - "deep-loop cli executor parity group"
  - "cli-devin cli-codex cli-pi fanout wiring"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/047-executor-wiring-and-parity"
    last_updated_at: "2026-08-08T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Grouped the executor-wiring and fan-out-parity children under one phase parent"
    next_safe_action: "Resume the specific child phase that needs work via its own continuity ladder"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Executor Wiring & Fan-out Parity

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/047-executor-wiring-and-parity |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-08-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/036-deep-loop-innovation |
| **Predecessor** | `035-cli-adapter-stress-and-playbooks` |
| **Successor** | `048-write-containment-hardening` |
| **Handoff Criteria** | Every executor kind the deep-loop fan-out advertises dispatches through the real fan-out for the providers and models it claims, or is explicitly and enforceably scoped out; each child phase strict-validates independently. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-loop fan-out declares several CLI executor kinds (`cli-codex`, `cli-devin`, `cli-cursor`, `cli-pi`, and the native/opencode/claude-code branches), but wiring each kind to a reliable headless dispatch — and proving every provider and model it claims is actually reachable — is a distinct piece of work per kind. Left ungrouped, these executor packets are hard to track as one workstream even though they share the same runtime surface (`executor-config.ts`, the `fanout-run.cjs` lineage builders, and the per-mode executor availability tables).

This phase parent groups that executor-focused work under one root: making a `cli-codex` audit leaf structurally write-safe, wiring `cli-devin` as a first-class executor kind, proving the full cli/provider/model matrix is reachable end-to-end, and keeping the enforced `cli-devin` model allowlist in parity with the curated catalog. Each child owns its own plan, tasks, checklist, and continuity; this parent tracks only the shared purpose and the phase manifest below.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-cli-codex-read-only-audit-leaf/` | Run the `cli-codex` deep-alignment leaf under `--sandbox read-only` and move iteration-artifact writing to the dispatch wrapper, so the leaf can never reach for `apply_patch`. | In Progress |
| 002 | `002-cli-devin-executor-wiring/` | Add `cli-devin` as a wired deep-loop executor kind with an enforced model allowlist and a live-verified flag mapping. | Planned |
| 003 | `003-cli-executor-fanout-parity/` | The six-phase parity program (own phase parent): audit the full executor/provider/model matrix, wire the gaps, and prove every combination dispatches through the fan-out. | Complete |
| 004 | `004-devin-fanout-allowlist-parity/` | Bring the runtime `cli-devin` allowlist and default model into parity with the curated catalog. | Planned |
| 005 | `005-devin-allowlist-prune-and-deepseek/` | Prune curated-out `cli-devin` aliases, add the missing DeepSeek ids, and add a CJS-mirror parity guard. | Complete |
<!-- /ANCHOR:phase-map -->
