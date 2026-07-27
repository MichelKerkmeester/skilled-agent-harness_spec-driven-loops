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
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "spec-reconciler"
    recent_action: "Marked all four plan phases delivered by commit c1981d2b91"
    next_safe_action: "Clear the 4 remaining design-motion path references in 3 hub files"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/references/motion/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
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
**Delivered** — all four phases landed in commit `c1981d2b91` (92 files, `+759/-2390`), with one verification item left open (see Phase 4). Four gated phases. Phase 1 decides and records the restraint-gate ordering mechanism BEFORE any content moves — this is load-bearing, mirroring `001-apache-devendoring`'s de-vendor-before-delete discipline. Phase 2 moves content using the proven `b217d74b819` foundations-merge sequence, resolving the 9 filename collisions explicitly. Phase 3 rewires the command/router/test surface (the machine-constraint set the spec names). Phase 4 deletes `design-motion` and verifies. If Phase 1 cannot produce a mechanically checkable ordering guarantee, halt before Phase 2.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Commit `b217d74b819` (foundations-merge sequence) has been read in full.
- [x] All 9 filename collisions are enumerated with their resolution (suffix vs. merge) decided.
- [x] The restraint-gate ordering mechanism (`DEFAULT_RESOURCE` vs. preflight §10 row) is chosen and its rationale recorded — three mechanisms shipped rather than one.

### Definition of Done
- [x] `design-motion/` no longer exists; all content lives under `design-interface/`.
- [x] The restraint-gate-first guarantee is mechanically checkable, not just documented.
- [x] `design-command-surface-check.mjs`, `hub-router.json`, `grounding-receipt.mjs`, and both test rosters reflect the 2-command topology.
- [x] Runtime mirrors of `/interface:motion` are deleted from all four runtime dirs.
- [x] `command-metadata.json` lanes match `SKILL.md` `INTENT_SIGNALS` exactly.
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

**Delivered** — the mechanism question was answered with three mechanisms, not one.

- [x] Read `b217d74b819`'s diff in full.
- [x] Compare `DEFAULT_RESOURCE` (conditioned on temporal intent) against a preflight §10 binary row for mechanical enforceability.
- [x] Record the chosen mechanism and rationale (in `implementation-summary.md`'s Key Decisions).
- [x] HARD STOP CHECK: if neither mechanism is genuinely enforceable, halt and escalate to the operator before Phase 2. *(Not triggered.)*

### Phase 2: Move content (blocked on Phase 1 passing)

**Delivered** in `c1981d2b91`.

- [x] Nest `design-motion/references/*` -> `design-interface/references/motion/`.
- [x] Nest `design-motion/assets/*` -> `design-interface/assets/motion/`.
- [x] Flatten `design-motion/procedures/*` into `design-interface/procedures/`.
- [x] Flatten `design-motion/corpus/*` into `design-interface/corpus/`.
- [x] Resolve all 9 filename collisions (`-motion` suffix or merge), one by one. *(8 as scoped; the motion changelog was deleted rather than renamed.)*
- [x] Delete `design-motion/SKILL.md`, `README.md`, `changelog/`.

### Phase 3: Rewire command/router/test surface

**Delivered** in `c1981d2b91`.

- [x] Add 5-6 motion intents to `design-interface/SKILL.md` mirroring the `VISUAL_SYSTEM` pattern. *(Six shipped.)*
- [x] Wire the chosen ordering mechanism into `SKILL.md` and/or `interface-preflight-card.md` §10. *(Both, plus per-intent resource ordering.)*
- [x] Add matching motion task lane to `command-metadata.json` AND `commands/interface/design.md` in the same commit. *(Six lanes in each.)*
- [x] Repoint `/interface:design`'s `next` from motion to `design-reference` (`design-command-surface-check.mjs:358`).
- [x] Update `preferSiblingWhen` (`:916`), `typicallyBefore`/`handoff.nextOptions` (`:983`/`:1249`).
- [x] Collapse `hub-router.json:7` `tieBreak` to the declared 2-mode registry order.
- [x] Collapse `grounding-receipt.mjs:26-30` `PAIRED_MODES`; keep `'motion'` in `ALLOWED_INFLUENCE_AXES`.
- [x] Delete `shared/evidence-envelopes/motion-character-handoff.md`.
- [x] Delete `/interface:motion` and its `.claude/`/`.codex/`/`.cursor/`/`.devin/` mirrors.
- [x] Update `interface-command-contract.test.mjs:12,36,91`.
- [x] Update `design-command-surface-check.test.mjs:63-71,94,106,157` and `design-command-surface-check.mjs:37-41`.

### Phase 4: Verification

Three of four closed; the sweep is the open item.

- [ ] `rg -n "design-motion"` across the hub (excluding historical changelog/commit references) returns nothing. **Not met** — 4 occurrences remain in 3 files: `feature-catalog/procedure-card-system/procedure-card-inventory.md:40`, `feature-catalog/styles-library-utilization/per-mode-consumers.md:42,52` (all three cite pre-merge `design-motion/` paths that no longer resolve), and `manual-testing-playbook/mode-routing/motion-mode.md:16` (correct prose about the retired mode, arguably fine to keep).
- [x] Run `design-command-surface-check.mjs`; confirm no two-cycle, `tieBreak` correct. — `STATUS=VALID`, `invalid=0 drift=0`.
- [x] Both test rosters pass. — 8/8 and 7/7.
- [x] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/010-motion-merge --strict` exits 0.
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
| Commit `b217d74b819` sequence | Internal | Reused | Reinventing the sequence risks missing a step this packet doesn't re-derive |
| Phase 1 ordering-mechanism decision | Internal | Satisfied | Blocked all of Phase 2 — load-bearing gate, and it passed |
| `009-aesthetics-retirement` landing first | Internal | Landed first; `c1981d2b91` also carries `009`'s spec-doc reconciliation | Not a hard dependency — both touch `design-interface/SKILL.md` and `command-metadata.json`, so sequencing avoids merge friction |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Status**: Not exercised. The merge shipped in `c1981d2b91` and remains revertible from there; it is a separate commit from `009` and `011` as planned.
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
- [x] Ordering mechanism recorded with rationale, not just chosen silently — the commit message states why a resource fold alone would have dropped the guarantee
- [x] All 9 filename collisions resolved and named before any move

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
