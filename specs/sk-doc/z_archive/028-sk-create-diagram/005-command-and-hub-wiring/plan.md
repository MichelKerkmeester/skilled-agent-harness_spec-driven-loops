---
title: "Implementation Plan: sk-create-diagram command and hub wiring"
description: "Orchestrator-direct authoring of shared sk-doc hub registration files and the /create:diagram command, given the wider blast radius of editing shared hub state."
trigger_phrases:
  - "diagram hub wiring plan"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/005-command-and-hub-wiring"
    last_updated_at: "2026-08-12T06:52:26.000Z"
    last_updated_by: "claude"
    recent_action: "Authored plan"
    next_safe_action: "Author once phases 002-004 land"
    blockers:
      - "Waiting on phases 002-004"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-create-diagram command and hub wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON hub registry files, YAML command workflows, Markdown router/presentation |
| **Framework** | `sk-create-command` router+presentation+auto/confirm pattern; `sk-create-skill` hub-router schema |
| **Storage** | `.opencode/skills/sk-doc/*.json`, `.opencode/commands/create/` |
| **Testing** | `ci-skill-root-metadata.cjs`, advisor smoke test, manual router trace |

### Overview

No executor dispatch — orchestrator authors this phase directly, editing shared `sk-doc` hub files (mode-registry.json, hub-router.json, command-metadata.json) that every sibling packet's routing depends on. This matches the risk profile `cli-opencode`'s own destructive-scope-violations reference flags for shared-state edits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phases 002-004 produce a complete, internally consistent packet (27 type references, design system, import/export tooling).

### Definition of Done

- [x] `mode-registry.json`, `hub-router.json`, `command-metadata.json` all reference `sk-create-diagram` consistently.
- [x] `/create:diagram` router + presentation + auto/confirm assets exist.
- [x] `README.md` and `changelog/v1.0.0.0.md` have real content.
- [x] `leaf-manifest.json` regenerated.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Direct edit, pattern-matched against the existing 12-mode registry and the `sk-create-diff` command as the closest sibling template — not generated from scratch.

### Key Components

- **Registry entry**: one `modes[]` object, copied in shape from `sk-create-flowchart`'s entry.
- **Router entry**: `routerSignals` + `vocabularyClasses` + `tieBreak`, copied in shape from an existing entry.
- **Command files**: `diagram.md` router copied in shape from `diff.md`, with presentation/auto/confirm assets adapted.

### Data Flow

Existing 12-mode registry + `diff.md` pattern → new `sk-create-diagram` entries appended → `ci-skill-root-metadata.cjs --fix` → advisor rescan → smoke test.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-doc/mode-registry.json` | 12 modes registered | Append 13th mode | Schema diff against sibling entries |
| `sk-doc/hub-router.json` | 12 signals + vocab classes | Append 13th | `tieBreak` completeness check |
| `sk-doc/command-metadata.json` | 12 commands | Append 13th | `ownerMode` + choreography resolution |
| `.opencode/commands/create/` | 12 command files | Add `diagram.md` + 3 assets | Router trace |
| `sk-create-flowchart/SKILL.md` | ASCII-only boundary | Add one cross-reference line | Diff minimality |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm phases 002-004 landed and validate cleanly.
- [x] Read `sk-create-diff`'s full mode-registry/hub-router/command-metadata entries as the copy template.

### Phase 2: Implementation

- [x] Add the `mode-registry.json` entry.
- [x] Add the `hub-router.json` entries.
- [x] Add the `command-metadata.json` entry.
- [x] Create `diagram.md` + the three command assets.
- [x] Author `README.md` and `changelog/v1.0.0.0.md`.
- [x] Add the one-line `sk-create-flowchart` cross-reference.
- [x] Regenerate `leaf-manifest.json`.

### Phase 3: Verification

- [x] `ci-skill-root-metadata.cjs` (class H clean).
- [ ] Advisor rescan + smoke test. [DEFERRED: pre-existing, unrelated build-environment gap — see implementation-summary.md Known Limitations.]
- [x] Manual router trace for `/create:diagram`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema | Registry/router/command-metadata shape | Manual diff against sibling entries, `ci-skill-root-metadata.cjs` |
| Discovery | Advisor surfaces the new packet | `skill_graph_scan --trusted`, `advisor_recommend` |
| Routing | `/create:diagram` resolves | Manual trace |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 002-004 | Internal | Pending at authoring time | Nothing real to register |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Registry/router edit breaks an existing sibling mode's routing.
- **Procedure**: Revert the three JSON files to their pre-edit state (tracked in git) and re-attempt with a tighter diff; the worktree isolates this from `main` regardless.
<!-- /ANCHOR:rollback -->
