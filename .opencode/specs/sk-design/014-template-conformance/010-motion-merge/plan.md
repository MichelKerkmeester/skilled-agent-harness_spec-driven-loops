---
title: "Implementation Plan: Merge design-motion into design-interface"
description: "Ordered plan reusing commit b217d74b819's foundations-merge sequence: decide the restraint-gate ordering mechanism first, then move content, resolve collisions, rewire the command/router/test surface, and delete the retired mode."
trigger_phrases:
  - "motion merge plan"
  - "design-motion retirement plan"
  - "restraint gate ordering plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/010-motion-merge"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored four-phase merge plan"
    next_safe_action: "Execute Phase 1: decide the ordering mechanism"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/"
      - ".opencode/skills/sk-design/design-interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Merge design-motion into design-interface
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill content, JSON command metadata, `.mjs` scripts/tests |
| **Framework** | sk-design hub: `design-interface` (surviving mode), `design-motion` (retired mode), shared command-surface tooling |
| **Storage** | Git-tracked files only |
| **Testing** | `design-command-surface-check.mjs`, `interface-command-contract.test.mjs`, `design-command-surface-check.test.mjs`, manual grep sweep |

### Overview
Four gated phases. Phase 1 decides and records the restraint-gate ordering mechanism BEFORE any content moves — this is load-bearing, mirroring `001-apache-devendoring`'s de-vendor-before-delete discipline. Phase 2 moves content using the proven `b217d74b819` foundations-merge sequence, resolving the 9 filename collisions explicitly. Phase 3 rewires the command/router/test surface (the machine-constraint set the spec names). Phase 4 deletes `design-motion` and verifies. If Phase 1 cannot produce a mechanically checkable ordering guarantee, halt before Phase 2.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Commit `b217d74b819` (foundations-merge sequence) has been read in full.
- [ ] All 9 filename collisions are enumerated with their resolution (suffix vs. merge) decided.
- [ ] The restraint-gate ordering mechanism (`DEFAULT_RESOURCE` vs. preflight §10 row) is chosen and its rationale recorded.

### Definition of Done
- [ ] `design-motion/` no longer exists; all content lives under `design-interface/`.
- [ ] The restraint-gate-first guarantee is mechanically checkable, not just documented.
- [ ] `design-command-surface-check.mjs`, `hub-router.json`, `grounding-receipt.mjs`, and both test rosters reflect the 2-command topology.
- [ ] Runtime mirrors of `/interface:motion` are deleted from all four runtime dirs.
- [ ] `command-metadata.json` lanes match `SKILL.md` `INTENT_SIGNALS` exactly.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reuse the proven foundations-merge sequence (nest `references/`+`assets/`, flatten `procedures/`+`corpus/`, delete packet ceremony), but ADD an explicit ordering-preservation step foundations never needed, because foundations was declarative and motion is procedural.

### Key Components
- **Ordering-preservation mechanism**: `DEFAULT_RESOURCE` conditioned on temporal intent, or a binary preflight §10 row.
- **Content move**: `references/` -> `references/motion/`, `assets/` -> `assets/motion/`, `procedures/`+`corpus/` flattened, 9 collisions resolved.
- **Command/router rewire**: new motion intents + task lane, `next`/`preferSiblingWhen`/`typicallyBefore`/`handoff.nextOptions` repointed, `hub-router.json` `tieBreak` collapsed, `grounding-receipt.mjs` `PAIRED_MODES` collapsed.
- **Deletion**: `design-motion/SKILL.md`, `README.md`, `changelog/`, `motion-character-handoff.md`, `/interface:motion` command + runtime mirrors.
- **Test/verification update**: both test rosters, `design-command-surface-check.mjs` self-tests.

### Data Flow
Read `b217d74b819` -> decide ordering mechanism, record rationale -> HARD STOP CHECK -> move `references/`+`assets/` -> flatten `procedures/`+`corpus/`, resolving 9 collisions -> add motion intents + task lane to `design-interface/SKILL.md` + `command-metadata.json` + `design.md` -> repoint `next`/`preferSiblingWhen`/`typicallyBefore`/`handoff.nextOptions` -> collapse `hub-router.json` `tieBreak` -> collapse `grounding-receipt.mjs` `PAIRED_MODES` (keep `'motion'` axis) -> delete `motion-character-handoff.md`, `design-motion/SKILL.md`/`README.md`/`changelog/`, `/interface:motion` + runtime mirrors -> update both test rosters -> sweep-grep + run checkers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Decide the ordering mechanism (load-bearing; must land before Phase 2)
- [ ] Read `b217d74b819`'s diff in full.
- [ ] Compare `DEFAULT_RESOURCE` (conditioned on temporal intent) against a preflight §10 binary row for mechanical enforceability.
- [ ] Record the chosen mechanism and rationale (in `implementation-summary.md`'s Key Decisions).
- [ ] HARD STOP CHECK: if neither mechanism is genuinely enforceable, halt and escalate to the operator before Phase 2.

### Phase 2: Move content (blocked on Phase 1 passing)
- [ ] Nest `design-motion/references/*` -> `design-interface/references/motion/`.
- [ ] Nest `design-motion/assets/*` -> `design-interface/assets/motion/`.
- [ ] Flatten `design-motion/procedures/*` into `design-interface/procedures/`.
- [ ] Flatten `design-motion/corpus/*` into `design-interface/corpus/`.
- [ ] Resolve all 9 filename collisions (`-motion` suffix or merge), one by one.
- [ ] Delete `design-motion/SKILL.md`, `README.md`, `changelog/`.

### Phase 3: Rewire command/router/test surface
- [ ] Add 5-6 motion intents to `design-interface/SKILL.md` mirroring the `VISUAL_SYSTEM` pattern.
- [ ] Wire the chosen ordering mechanism into `SKILL.md` and/or `interface-preflight-card.md` §10.
- [ ] Add matching motion task lane to `command-metadata.json` AND `commands/interface/design.md` in the same commit.
- [ ] Repoint `/interface:design`'s `next` from motion to `design-reference` (`design-command-surface-check.mjs:358`).
- [ ] Update `preferSiblingWhen` (`:916`), `typicallyBefore`/`handoff.nextOptions` (`:983`/`:1249`).
- [ ] Collapse `hub-router.json:7` `tieBreak` to the declared 2-mode registry order.
- [ ] Collapse `grounding-receipt.mjs:26-30` `PAIRED_MODES`; keep `'motion'` in `ALLOWED_INFLUENCE_AXES`.
- [ ] Delete `shared/evidence-envelopes/motion-character-handoff.md`.
- [ ] Delete `/interface:motion` and its `.claude/`/`.codex/`/`.cursor/`/`.devin/` mirrors.
- [ ] Update `interface-command-contract.test.mjs:12,36,91`.
- [ ] Update `design-command-surface-check.test.mjs:63-71,94,106,157` and `design-command-surface-check.mjs:37-41`.

### Phase 4: Verification
- [ ] `rg -n "design-motion"` across the hub (excluding historical changelog/commit references) returns nothing.
- [ ] Run `design-command-surface-check.mjs`; confirm no two-cycle, `tieBreak` correct.
- [ ] Both test rosters pass.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/010-motion-merge --strict` exits 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep sweep | Confirm zero remaining `design-motion` references outside history | `rg -n` |
| Structural | Command surface topology (no two-cycle, correct `tieBreak`, lanes match intents) | `design-command-surface-check.mjs` |
| Unit | Command contract + surface-check test rosters | `interface-command-contract.test.mjs`, `design-command-surface-check.test.mjs` |
| Manual | Restraint-gate ordering mechanism is genuinely enforceable, not just documented | Trace a motion task through the mechanism end to end |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Commit `b217d74b819` sequence | Internal | Existing, proven | Reinventing the sequence risks missing a step this packet doesn't re-derive |
| Phase 1 ordering-mechanism decision | Internal | Not started | Blocks all of Phase 2 — load-bearing gate |
| `009-aesthetics-retirement` landing first | Internal | Sibling packet, independently committed | Not a hard dependency — both touch `design-interface/SKILL.md` and `command-metadata.json`, so sequencing avoids merge friction |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The restraint-gate ordering mechanism is later found unenforceable, or the command-surface checker fails post-merge.
- **Procedure**: Revert the merge commit(s); `design-motion/` and `/interface:motion` return via git history; re-attempt Phase 1 with the corrected mechanism.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Decide ordering) ──(HARD GATE)──> Phase 2 (Move content) ──> Phase 3 (Rewire surface) ──> Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Decide ordering | None | Move content |
| Move content | Decide ordering (must pass hard-stop check) | Rewire surface |
| Rewire surface | Move content | Verify |
| Verify | Rewire surface | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Ordering mechanism recorded with rationale, not just chosen silently
- [ ] All 9 filename collisions resolved and named before any move

### Rollback Procedure
1. **Immediate**: If the checker fails post-merge, do not claim Phase 4 verification passed.
2. **Revert code**: `git revert` the merge commit(s) — this phase lands as its own commit, separate from 009/011, so it is independently revertible.
3. **Verify**: Confirm `design-motion/` and `/interface:motion` are restored, then re-attempt.

### Data Reversal
- **Has data migrations?** No — skill content, command metadata, and test files only.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN
- Four gated phases; ordering-mechanism decision is the load-bearing gate
- Reuses proven b217d74b819 sequence rather than inventing a fresh approach
-->
