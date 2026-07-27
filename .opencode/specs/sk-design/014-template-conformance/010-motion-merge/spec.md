---
title: "Feature Specification: Merge design-motion into design-interface"
description: "Retire design-motion (39 files, 4,175 lines) as a standalone mode and /interface:motion as a command, folding its content into design-interface while preserving the restraint-gate-runs-first ordering guarantee that made motion procedural rather than declarative."
trigger_phrases:
  - "motion merge"
  - "design-motion retirement"
  - "restraint gate ordering"
  - "interface motion command retirement"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/010-motion-merge"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec for design-motion merge into design-interface"
    next_safe_action: "Re-read commit b217d74b819's foundations-merge sequence before starting"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/"
      - ".opencode/skills/sk-design/design-interface/"
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/design-mcp-open-design/grounding-receipt.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Merge design-motion into design-interface
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned — no work started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `009-aesthetics-retirement` |
| **Successor** | `011-retirement-residue` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`design-motion` (39 files, 4,175 lines) is a standalone mode with its own `SKILL.md`, `README.md`, and `/interface:motion` command. Foundations folded cleanly into `design-interface` earlier in this program because it was **declarative** — tokens and scales slot straight into resource lists. Motion is **procedural**: `design-motion/SKILL.md` enforces that the restraint gate (`references/animation-decision-framework.md`) runs FIRST, before any timing or easing choice is made (`SKILL.md:264`: "Run the restraint gate first ... stopping at the first no"). Folding motion's content into `RESOURCE_MAP` entries alone, the way foundations was folded, would silently drop that ordering guarantee — the same failure mode as this session's earlier AI-tell fixtures work, where capability survived on paper but the mechanism that made it provable did not.

### Purpose

Merge `design-motion` into `design-interface`, retiring motion as a mode and `/interface:motion` as a command, while preserving the restraint-gate-first ordering as either a `DEFAULT_RESOURCE` conditioned on temporal intent, or a binary row in `interface-preflight-card.md` §10 (whose motion boxes already assume the gate has run). This is the fourth mode/command reduction in the same session: after `009-aesthetics-retirement`, this phase takes the hub from 4 modes / 3 commands to 3 modes / 2 commands, leaving `/interface:design` and `/interface:design-reference` as the entire public design surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Nesting `design-motion/references/` -> `design-interface/references/motion/` and `design-motion/assets/` -> `design-interface/assets/motion/` (foundations precedent).
- Moving `design-motion/procedures/` and `design-motion/corpus/` flat into `design-interface`'s existing `procedures/` and `corpus/`.
- Deleting `design-motion/SKILL.md`, `design-motion/README.md`, and its packet `changelog/` as packet-mimicking ceremony a merged sub-area does not need.
- Resolving 9 filename collisions with the established `-motion` suffix: `fixtures-motion.mjs`, `motion-card-selection-proof.md`, `motion-no-card-fallback.md`, `motion-direct-fallback-without-subagents.md`, `v1.0.0.0-motion.md`, plus merging `corpus/README.md`, `corpus/tests/README.md`, `feature-catalog.md`, `manual-testing-playbook.md`.
- Preserving the restraint-gate-first ordering guarantee via a `DEFAULT_RESOURCE` conditioned on temporal intent, or a binary row in `interface-preflight-card.md` §10 (Motion Motivation and Reduced Motion) — decision recorded before any content moves.
- Transferring the five no-interface-equivalent references: `animation-decision-framework.md` (restraint gate), `motion-strategy.md` (timing bands sourced by `shared/numeric-design-laws.md:38-41`'s four motion timing laws), `animate-presence-patterns.md` + `advanced-craft.md` (runtime patterns), `performance-reduced-motion.md` (scoped out of `ux-quality-reference.md:119` and deferred to this file).
- Consolidating: the reduced-motion policy floor (already partly in `ux-quality-reference.md` §3 + preflight §10), micro-interaction state work (already the Interaction State Matrix lane interface owns via `context-loading-contract.md:115-142`), and the MOTION dial (already interface-side).
- Deleting (not repointing) `shared/evidence-envelopes/motion-character-handoff.md` — with one mode there is no boundary left to cross.
- Adding 5-6 motion intents mirroring the `VISUAL_SYSTEM` pattern, plus one matching task lane in both `command-metadata.json` and `commands/interface/design.md`.
- Repointing `/interface:design`'s `next` field (currently pointing at motion) to `/interface:design-reference`, fixing the design<->motion two-cycle that `design-command-surface-check.mjs:358` requires be non-empty.
- Updating `preferSiblingWhen` (`:916`), `typicallyBefore`/`handoff.nextOptions` (`:983`/`:1249`), and `hub-router.json`'s `tieBreak` (`:7`, must equal declared modes in registry order — a mismatch here is the exact failure that produced commit `12f04cf0621`).
- Confirming `grounding-receipt.mjs:26-30`'s `PAIRED_MODES` collapses to the resulting two-mode set, while keeping `ALLOWED_INFLUENCE_AXES`'s `'motion'` entry (a design axis, not a mode id — not touched by this merge).
- Deleting runtime mirrors of the `motion` command under `.claude/`, `.codex/`, `.cursor/`, `.devin/` alongside the command itself.
- Updating the test rosters that encode the topology: `interface-command-contract.test.mjs:12,36,91`, `design-command-surface-check.test.mjs:63-71,94,106,157`, `design-command-surface-check.mjs:37-41`.

### Out of Scope

- Any change to design judgment or motion craft content itself — this is a structural merge, not a rewrite of guidance.
- `009-aesthetics-retirement`'s and `011-retirement-residue`'s work — independently committed siblings.
- Re-litigating whether foundations' declarative-merge precedent was correct — it is the baseline this packet extends, not revisits.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-motion/references/*` | Move | -> `design-interface/references/motion/` |
| `design-motion/assets/*` | Move | -> `design-interface/assets/motion/` |
| `design-motion/procedures/*` | Move (flat merge) | -> `design-interface/procedures/` |
| `design-motion/corpus/*` | Move (flat merge) | -> `design-interface/corpus/` |
| `design-motion/SKILL.md`, `README.md`, `changelog/` | Delete | Packet-mimicking ceremony a merged sub-area doesn't need |
| 9 filename-collision files | Rename (`-motion` suffix) or merge | Established convention from the foundations merge |
| `design-interface/SKILL.md` | Modify | Add motion intents, `DEFAULT_RESOURCE`/preflight ordering guarantee, restraint-gate references |
| `design-interface/assets/interface-preflight-card.md` | Modify | §10 binary row for restraint-gate-ran, if that's the chosen mechanism |
| `command-metadata.json` | Modify | Add motion task lane matching new `SKILL.md` intents |
| `commands/interface/design.md` | Modify | Add motion lane row; repoint `next` from motion to `design-reference` |
| `commands/interface/motion.md` (+ `.claude/`/`.codex/`/`.cursor/`/`.devin/` mirrors) | Delete | Command retired |
| `shared/scripts/design-command-surface-check.mjs` | Modify | `:358` next-non-empty fix, `:916` `preferSiblingWhen`, `:983`/`:1249` `typicallyBefore`/`handoff.nextOptions`, `:37-41` |
| `hub-router.json` | Modify | `:7` `tieBreak` collapses to declared 2-mode registry order |
| `design-mcp-open-design/grounding-receipt.mjs` | Modify | `:26-30` `PAIRED_MODES` collapses to 2-mode set; keep `'motion'` in `ALLOWED_INFLUENCE_AXES` |
| `shared/evidence-envelopes/motion-character-handoff.md` | Delete | No boundary left to cross with one mode |
| `shared/scripts/interface-command-contract.test.mjs` | Modify | `:12,36,91` topology update |
| `shared/scripts/design-command-surface-check.test.mjs` | Modify | `:63-71,94,106,157` topology update |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The restraint-gate-runs-first ordering guarantee is preserved as a `DEFAULT_RESOURCE` conditioned on temporal intent, or a binary row in `interface-preflight-card.md` §10 — decided and recorded before content moves | `SKILL.md` or preflight card has an explicit, checkable ordering mechanism; not just a resource-list entry |
| REQ-002 | The five no-interface-equivalent references transfer intact: `animation-decision-framework.md`, `motion-strategy.md`, `animate-presence-patterns.md`, `advanced-craft.md`, `performance-reduced-motion.md` | All five resolve at their new `design-interface/references/motion/` path with content unchanged |
| REQ-003 | `shared/numeric-design-laws.md:38-41`'s four motion timing laws still resolve to `motion-strategy.md` after the move (not orphaned) | `rg -n "motion-strategy" shared/numeric-design-laws.md` points at the new path |
| REQ-004 | `design-command-surface-check.mjs:358`'s non-empty `next` requirement is satisfied — `/interface:design` repoints from motion to `design-reference`, fixing the pre-existing design<->motion two-cycle | Checker passes; no two-cycle remains between the two surviving commands |
| REQ-005 | `hub-router.json:7`'s `tieBreak` equals the declared modes in registry order post-merge | Manual diff confirms order; this exact mismatch previously produced commit `12f04cf0621` |
| REQ-006 | `grounding-receipt.mjs:26-30`'s `PAIRED_MODES` collapses to the resulting two-mode set, while `ALLOWED_INFLUENCE_AXES`'s `'motion'` entry is left untouched | Diff shows `PAIRED_MODES` updated, `ALLOWED_INFLUENCE_AXES` unchanged |
| REQ-007 | Command task lanes in `command-metadata.json` match `design-interface/SKILL.md`'s `INTENT_SIGNALS` exactly after the new motion intents are added | design-command-surface checker passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | All 9 filename collisions are resolved with the established `-motion` suffix or merge | No file silently overwrites another; each collision's resolution is named in `implementation-summary.md` |
| REQ-009 | `motion-character-handoff.md` is deleted, not repointed | File no longer exists; no reference to it remains |
| REQ-010 | Runtime mirrors of the motion command are deleted from `.claude/`, `.codex/`, `.cursor/`, `.devin/` | `find` across all four runtime dirs for a motion command mirror returns nothing |
| REQ-011 | Test rosters (`interface-command-contract.test.mjs`, `design-command-surface-check.test.mjs`) are updated to the new 2-mode topology | Both test files pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `design-motion/` no longer exists as a standalone mode; `/interface:motion` no longer exists as a command, including runtime mirrors.
- **SC-002**: The restraint-gate-first ordering is provably preserved — an executor cannot reach timing/easing guidance in `design-interface` without the gate having run first, per the chosen mechanism.
- **SC-003**: `design-command-surface-check.mjs` and `hub-router.json` both reflect a clean 2-command, 3-mode (post-009) topology with no two-cycle and no `tieBreak` drift.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Ordering guarantee dropped by treating this as a plain resource-list fold (the foundations pattern) | Restraint gate becomes optional-in-practice even though it's documented as mandatory — silent quality regression | Explicit REQ-001 gate; do not proceed past Phase 1 until the mechanism is chosen and recorded |
| Risk | `tieBreak` / registry order mismatch shipped silently | Compiled hub serves legacy routing — this exact failure produced commit `12f04cf0621` | Manual diff of `hub-router.json:7` against the post-merge mode registry before commit |
| Risk | A filename collision silently overwrites instead of merging/suffixing | Content loss with no diff signal | Enumerate all 9 collisions before any file move; resolve each explicitly |
| Dependency | Commit `b217d74b819` (the foundations-merge sequence) | This packet reuses its proven sequence rather than inventing a fresh approach | Re-read that commit's diff before starting Phase 1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The restraint-gate-first ordering guarantee must be mechanically checkable after the merge, not merely documented — this is the packet's core safety property, mirroring `001-apache-devendoring`'s ordering discipline.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios
- **The chosen ordering mechanism (`DEFAULT_RESOURCE` vs. preflight §10 row) turns out not to be mechanically enforceable**: halt before deleting `design-motion/SKILL.md` and escalate to the operator with both options' tradeoffs, rather than shipping a merge that only documents the gate.
- **A test roster still references a deleted `design-motion` path after the merge**: treat as a blocking failure, not a followup — fix before claiming Phase 3 verification passed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **`DEFAULT_RESOURCE` vs. preflight §10 binary row**: which mechanism preserves the restraint-gate-first ordering more durably? Both are named as acceptable in the parent's framing; the executing agent should pick one, record the choice and rationale in `decision-record.md`-equivalent notes inside `implementation-summary.md`, and not silently default to whichever is easiest to wire.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: `.opencode/specs/sk-design/014-template-conformance/spec.md`
- **Predecessor**: `../009-aesthetics-retirement/`
- **Successor**: `../011-retirement-residue/`
- **Precedent commit**: `b217d74b819` (foundations-merge sequence, reused here)
