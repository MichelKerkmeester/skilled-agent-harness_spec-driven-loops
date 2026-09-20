---
title: "Implementation Plan: Retire the aesthetics reference folder and --mode aesthetic lane"
description: "Single-commit plan: delete the 5 aesthetics files, remove the aesthetic mode lane across all five wiring points in the same commit, regenerate the leaf manifest, and update the two citing reference docs."
trigger_phrases:
  - "aesthetics retirement plan"
  - "mode aesthetic lane removal plan"
  - "design-interface aesthetics folder plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/009-aesthetics-retirement"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored single-phase plan for folder + lane retirement"
    next_safe_action: "Execute Phase 1"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/aesthetics/"
      - ".opencode/skills/sk-design/command-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Retire the aesthetics reference folder and --mode aesthetic lane
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill content + JSON command metadata + YAML command assets |
| **Framework** | sk-design `design-interface` mode; `/interface:design` command surface |
| **Storage** | Git-tracked files only |
| **Testing** | `rg` sweep + design-command-surface-check + leaf-manifest regeneration |

### Overview
One phase, one commit: remove the 5 aesthetics files and every one of the lane's five wiring points (`SKILL.md` intent, `command-metadata.json` lane, `design.md` lane row + argument-hint, 2 YAML asset mirrors, `hub-router.json` vocabulary) together, then regenerate `leaf-manifest.json` and update the two citing reference docs. Landing this as one commit is deliberate — the operator called out that a lane removed from one file but not its pair already broke the checker once this session.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] All 5 aesthetics files and all citing sites (SKILL.md, command-metadata.json, design.md, 2 YAML assets, hub-router.json, leaf-manifest.json, 2 reference docs) are located and line-confirmed.

### Definition of Done
- [ ] `design-interface/references/aesthetics/` no longer exists.
- [ ] `command-metadata.json` lanes match `SKILL.md` `INTENT_SIGNALS` exactly (no orphan either direction).
- [ ] `hub-router.json` and `leaf-manifest.json` carry no aesthetics vocabulary or paths.
- [ ] Both citing reference docs are updated.
- [ ] `rg -n "aesthetic"` across the hub (excluding `changelog/`) returns nothing.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single atomic removal across a fixed wiring set — an argument lane is not a doc, it is a five-point contract (mode intent, task-lane table, command lane row, command asset mirrors, router vocabulary) that must be removed as a unit.

### Key Components
- **Content deletion**: the 5 `references/aesthetics/*` files.
- **Mode-side removal**: `AESTHETICS` intent + `RESOURCE_MAP` entry in `SKILL.md`.
- **Command-side removal**: task lane in `command-metadata.json`, lane row + argument-hint in `design.md`, both YAML asset mirrors.
- **Router-side removal**: `hub-router.json` vocabulary entry.
- **Manifest regeneration**: `leaf-manifest.json` rebuilt to drop the 5 paths.
- **Citation cleanup**: `resource-loading-notes.md`, `real-ui-loop.md`.

### Data Flow
Confirm all citing sites exist at the stated locations -> delete the 5 files -> remove `SKILL.md` intent/resource-map entry -> remove `command-metadata.json` lane -> remove `design.md` lane row + argument-hint -> update 2 YAML assets -> remove `hub-router.json` vocabulary -> regenerate `leaf-manifest.json` -> update the 2 reference docs -> sweep-grep to confirm zero remaining citations -> run the design-command-surface checker.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Retire folder + lane (single commit, ~1.5h)
- [ ] Confirm every citing site named in `spec.md`'s Files to Change table still resolves at its stated location.
- [ ] Delete the 5 `references/aesthetics/*` files.
- [ ] Remove `AESTHETICS` intent + `RESOURCE_MAP` entry from `SKILL.md`.
- [ ] Remove the `aesthetic` task lane from `command-metadata.json`.
- [ ] Remove the `aesthetic` lane row and argument-hint value from `commands/interface/design.md`.
- [ ] Update both YAML asset argument-hint mirrors.
- [ ] Remove `"aesthetic"` from `hub-router.json`'s vocabulary list.
- [ ] Regenerate `leaf-manifest.json`.
- [ ] Update `resource-loading-notes.md` and `real-ui-loop.md` citations.

### Phase 2: Verification
- [ ] `rg -n "aesthetic"` across the hub (excluding `changelog/`) returns nothing.
- [ ] Run the design-command-surface checker; confirm lanes match `INTENT_SIGNALS` exactly.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/009-aesthetics-retirement --strict` exits 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep sweep | Confirm zero remaining `aesthetic` references outside changelog history | `rg -n` |
| Structural | Task lanes still match `INTENT_SIGNALS` exactly | design-command-surface checker |
| Manifest | `leaf-manifest.json` carries no dangling paths | Regeneration script diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `styles/` corpus as replacement evidence | Internal | Existing (1,290 exemplars) | None — corpus already exists and is unaffected by this packet |
| `leaf-manifest.json` regeneration tooling | Internal | Existing | Manual edit would risk drift from the real file list |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The design-command-surface checker fails after this commit, or a missed citing site surfaces.
- **Procedure**: Revert the single commit; all 5 files and all wiring points return via git history; re-attempt with the missed site added to scope.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Retire folder + lane) ──> Phase 2 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Retire | None | Verify |
| Verify | Retire | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All five wiring points identified before any file is touched
- [ ] Single-commit landing confirmed (no partial-state commit)

### Rollback Procedure
1. **Immediate**: If the checker fails, do not proceed to Phase 2 verification claims.
2. **Revert code**: `git revert` the retirement commit.
3. **Verify**: Confirm the folder and all lane wiring are restored, then re-attempt.

### Data Reversal
- **Has data migrations?** No — documentation and command-metadata only.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN
- Single atomic commit across a five-point wiring contract
- Revertable independently of siblings 008/010
-->
