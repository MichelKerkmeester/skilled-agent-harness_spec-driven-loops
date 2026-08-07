---
title: "Implementation Plan: Phase 016 - Hub Routing Optimization"
description: "Plan for adding the command field, hub-identity vocabulary wiring, and command-metadata.json resync to sk-design's parent hub, matching sk-code/sk-doc conventions."
trigger_phrases:
  - "phase 016 plan"
  - "hub routing optimization plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/016-hub-routing-optimization"
    last_updated_at: "2026-07-06T21:05:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hub-routing-optimization-016"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 016 - Hub Routing Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Declarative JSON registries consumed by the sk-design hub router |
| **Framework** | Same discriminator/routerSignals/vocabularyClasses shape already used by `sk-code`/`sk-doc` |
| **Storage** | `.opencode/skills/sk-design/{mode-registry.json, hub-router.json, command-metadata.json}` |
| **Testing** | JSON parse check, diff review against pre-edit content, spec strict validation |

### Overview

Compare `sk-design`'s `mode-registry.json`/`hub-router.json` against `sk-code`'s and `sk-doc`'s (the latter being the newest pattern) and close two structural gaps: a missing per-mode `command` field, and an unwired `hub-identity` vocabulary class. Separately, resync `command-metadata.json` (a richer, sk-design-only command metadata file with no sk-code/sk-doc equivalent) to the real `argument-hint` values Phase 015 already put in the live command files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `mode-registry.json`/`hub-router.json` read in full for sk-design, sk-code, and sk-doc
- [x] `command-metadata.json` read in full
- [x] Phase 015's live command frontmatter (`argument-hint` per mode) confirmed via direct read
- [x] `defaultMode: "interface"` confirmed intentional per sk-design's own `SKILL.md` §2 (not a gap to fix)

### Definition of Done
- [x] `command` field added to all 5 modes in `mode-registry.json`, `advisorRoutingContract` documents it
- [x] `hub-identity` added to all 5 modes' `classes` in `hub-router.json`
- [x] `command-metadata.json` argument grammar synced for all 5 commands
- [ ] `validate.sh --strict` passes for this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Purely additive edits to existing declarative registries — no new files, no schema redesign. Each registry keeps its existing shape; new fields are inserted at the same relative position sk-doc already uses (`command` sits between `grandfatheredFolderMismatch` and `aliases`), and new `classes` entries are appended to existing arrays.

### Key Components

- **`mode-registry.json`**: per-mode `"command": "/design:<mode>"` field (5 modes); `advisorRoutingContract.command` doc string; version `1.2.0.0` -> `1.3.0.0`.
- **`hub-router.json`**: `"hub-identity"` appended to each mode's `routerSignals[mode].classes` array (5 modes); version `1.1.0.0` -> `1.2.0.0`. The `hub-identity` vocabulary class itself already exists and needs no edit.
- **`command-metadata.json`**: per-command `argumentHint` and `argumentGrammar.render` extended with ` [--register brand|product] [:auto|:confirm]` (or the mode-specific ordering already present in the live command frontmatter); `argumentGrammar.flags` gains two new entries per command (`--register`, `:auto|:confirm`).

### Content Mapping (Source -> Registry Field)

| Source of Truth | Destination |
|---|---|
| `.opencode/commands/design/<mode>.md` frontmatter `argument-hint` | `command-metadata.json[mode].argumentHint` + `.argumentGrammar.render` |
| sk-doc `mode-registry.json` per-mode `command` field shape | `sk-design mode-registry.json` per-mode `command` field |
| sk-code/sk-doc `hub-router.json` per-mode `classes` including `hub-identity` | `sk-design hub-router.json` per-mode `classes` |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-design/mode-registry.json` | Mode discriminator registry | Add `command` field + doc | JSON parse + diff review |
| `.opencode/skills/sk-design/hub-router.json` | Router signals + vocabulary | Add `hub-identity` to classes | JSON parse + diff review |
| `.opencode/skills/sk-design/command-metadata.json` | Rich per-command metadata | Sync argument grammar | JSON parse + diff review against live command frontmatter |
| `.opencode/commands/design/*.md` | Live commands (Phase 015) | Read-only source of truth | Unchanged, `git status` confirms no edit |

Required inventories:
- Same-class producers: the 3 edited registry files, all under `.opencode/skills/sk-design/`.
- Consumers of changed symbols: the sk-design hub router (reads `hub-router.json`/`mode-registry.json` at routing time); any future advisor/discovery tooling that reads `command-metadata.json`'s `argumentHint`/`argumentGrammar`.
- Matrix axes: mode x {registry field, old value, new value}.
- Algorithm invariant: every edit is additive (new field or new array entry); no existing field value, weight, alias, or keyword is removed or reordered.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Compare sk-design/sk-code/sk-doc `mode-registry.json` and `hub-router.json`
- [x] Read `command-metadata.json` in full
- [x] Read live command frontmatter for the new `argument-hint` values
- [x] Confirm `defaultMode` divergence is intentional (out of scope)

### Phase 2: Implementation
- [x] `mode-registry.json`: version bump, `advisorRoutingContract.command` doc, 5x `command` field
- [x] `hub-router.json`: version bump, 5x `hub-identity` added to `classes`
- [x] `command-metadata.json`: 5x `argumentHint`/`argumentGrammar.flags`/`argumentGrammar.render` sync

### Phase 3: Verification
- [x] JSON parse check on all 3 files
- [ ] Diff review confirming only additive changes
- [ ] `validate.sh --strict` on this phase folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| JSON syntax | All 3 edited files | `python3 -c "import json; json.load(open(f))"` |
| Diff review | Confirm additive-only changes | `git diff -- .opencode/skills/sk-design/{mode-registry.json,hub-router.json,command-metadata.json}` |
| Spec validation | This phase's own Level 2 docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 015's live command files as source of truth | Design source | Complete, read in full | Blocks accurate argument-grammar sync |
| sk-code/sk-doc `mode-registry.json`/`hub-router.json` as reference pattern | Reference | Read in full | Blocks correct field shape/placement |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Diff review finds a non-additive change (a removed/reordered existing field, weight, alias, or keyword).
- **Procedure**: `git diff`/`git restore` the affected registry file back to the pre-phase state, re-apply only the intended additive edit, re-diff.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | sk-code/sk-doc reference read, live command frontmatter read | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Already complete (comparative research done pre-implementation) |
| Implementation | Low | 3 files, additive edits only |
| Verification | Low | JSON parse + diff + strict validate |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm all 3 files still parse as valid JSON
- [ ] Confirm no existing field, weight, alias, or keyword was removed or reordered

### Rollback Procedure
1. Identify the file with a non-additive change.
2. Restore that file from the pre-phase committed state.
3. Re-apply the intended additive edit only.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Revert the 3 registry files only.
<!-- /ANCHOR:enhanced-rollback -->
