---
title: "Verification Checklist: Merge design-motion into design-interface"
description: "Verification checklist for the four-phase merge: ordering-mechanism fidelity, content move and collision resolution, command/router/test rewire, final sweep."
trigger_phrases:
  - "motion merge checklist"
  - "design-motion retirement checklist"
  - "restraint gate ordering checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/010-motion-merge"
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "spec-reconciler"
    recent_action: "Closed CHK-060; repointed three dead paths and cleared register residue"
    next_safe_action: "Re-run validate --strict and reconcile completion_pct across packet docs"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Merge design-motion into design-interface
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Commit `b217d74b819` has been read in full before any move begins
  - **Evidence:** the merge reproduces that commit's sequence exactly — `references/` and `assets/` nested under a `motion/` subdirectory, `procedures/` and `corpus/` flattened, packet ceremony deleted — and reuses its `foundations-`/`-foundations` collision convention for the motion files.
- [x] CHK-002 [P0] The restraint-gate ordering mechanism is chosen and recorded with rationale before any content moves
  - **Evidence:** `implementation-summary.md` Key Decisions records the three-mechanism choice; the commit message states the rationale — "a resource map has no ordering semantics" and "losing that ordering would have left the capability present and the guarantee gone."
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [ordering fidelity + content move]

- [x] CHK-010 [P0] The restraint-gate-first ordering is mechanically checkable, not just documented in prose
  - **Evidence:** traced across all six motion intents. `design-interface/SKILL.md:148-153` — every one of `MOTION_DECISION`, `MOTION_STRATEGY`, `MOTION_MICRO_INTERACTIONS`, `MOTION_PRESENCE`, `MOTION_PERFORMANCE`, `MOTION_ADVANCED_CRAFT` lists `references/motion/animation-decision-framework.md` in first position. There is no motion intent whose resource list reaches timing or easing guidance ahead of the gate. Backed by the ALWAYS row at `:87` and numbered instruction 11 at `:269`.
- [x] CHK-011 [P0] All five no-interface-equivalent references transfer intact (`animation-decision-framework.md`, `motion-strategy.md`, `animate-presence-patterns.md`, `advanced-craft.md`, `performance-reduced-motion.md`)
  - **Evidence:** `ls design-interface/references/motion/` returns all five plus `corpus-map.md` and `micro-interactions.md`. `git show --stat c1981d2b91` records the moves as pure renames (0 content lines changed) for the reference files.
- [x] CHK-012 [P0] `shared/numeric-design-laws.md:38-41`'s four motion timing laws still resolve to the moved `motion-strategy.md`
  - **Evidence:** rows 38-41 (`motion-feedback`, `motion-state-change`, `motion-layout-transition`, `motion-earned-entrance`) each cite `design-interface/references/motion/motion-strategy.md Section 3 - Timing`. Row 42 (`register-product-motion-budget`) was repointed too. No row was orphaned.
- [x] CHK-013 [P1] All 9 filename collisions are resolved (suffix or merge), none silently overwritten
  - **Evidence:** each named in `implementation-summary.md`. 8 as scoped (3 prefixed, 1 suffixed, 4 merged); the ninth — the motion `changelog/v1.0.0.0.md` — was deleted rather than renamed, which is a deletion rather than an overwrite and is recorded as a deviation.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [command/router/test surface]

- [x] CHK-020 [P0] `design-command-surface-check.mjs:358`'s non-empty `next` requirement is satisfied; the design<->motion two-cycle is fixed
  - **Evidence:** `node shared/scripts/design-command-surface-check.mjs` → `STATUS=VALID STAGE=complete`, `SUMMARY invalid=0 drift=0`. The surviving roster is a one-way extract-then-direct pair, not a cycle.
- [x] CHK-021 [P0] `hub-router.json:7` `tieBreak` equals the declared modes in registry order
  - **Evidence:** `tieBreak` reads `["interface", "md-generator", "design-mcp-open-design"]`; the checker independently reports `workflowModes=design-mcp-open-design,interface,md-generator` with `drift=0`. No `motion` entry remains in `mode-registry.json` — the only surviving `motion` tokens there are routing aliases ("motion design", "animate this") that now steer to `interface`.
- [x] CHK-022 [P0] `grounding-receipt.mjs:26-30` `PAIRED_MODES` collapses to the 2-mode set; `ALLOWED_INFLUENCE_AXES`'s `'motion'` entry is untouched
  - **Evidence:** `PAIRED_MODES` is `Object.freeze(['design-interface', 'design-md-generator'])`; `ALLOWED_INFLUENCE_AXES` still ends `'components', 'motion'` — the axis survived because it names a design dimension, not a mode id.
- [x] CHK-023 [P0] `command-metadata.json` lanes match `SKILL.md` `INTENT_SIGNALS` exactly
  - **Evidence:** six `motion-*` lanes in `command-metadata.json` mirror the six `MOTION_*` intents one-for-one, and the same six appear as rows in `.opencode/commands/interface/design.md:63-68`. The checker reports `drift=0`, which is the mechanical form of this claim.
- [x] CHK-024 [P1] Both test rosters (`interface-command-contract.test.mjs`, `design-command-surface-check.test.mjs`) pass
  - **Evidence:** re-run in this reconciliation — `interface-command-contract.test.mjs` `# pass 8 # fail 0`; `design-command-surface-check.test.mjs` `# pass 7 # fail 0`.
- [x] CHK-025 [P1] Runtime mirrors of `/interface:motion` deleted from all four runtime dirs
  - **Evidence:** `find .claude .codex .cursor .devin -iname '*interface*motion*'` returns nothing. `c1981d2b91` deleted `.codex/prompts/interface-motion.md`, `.cursor/commands/interface-motion.md`, `.devin/skills/interface-motion/SKILL.md`, and the three `.claude/commands/interface/assets/interface-motion-*` files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [ceremony + deletion]

- [x] CHK-030 [P1] `design-motion/SKILL.md`, `README.md`, `changelog/` deleted
  - **Evidence:** `ls .opencode/skills/sk-design/design-motion` → `No such file or directory`. The whole 39-file mode is gone, not just its ceremony.
- [x] CHK-031 [P1] `motion-character-handoff.md` deleted, not repointed
  - **Evidence:** `ls shared/evidence-envelopes/` returns only `owned-asset-manifest.md`; the 98-line handoff envelope was removed in `c1981d2b91`. With one design mode there is no cross-mode boundary for it to describe.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [n/a]

- [x] CHK-040 [P2] No secrets or credentials touched by this packet
  - **Evidence:** the 92-file diff is markdown, JSON, YAML and `.mjs` under `.opencode/` and the four runtime dirs only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` describe the same scope and ordering decision
  - **Evidence:** all five were reconciled together in this pass; each reports Complete against `c1981d2b91`, names the three-mechanism ordering decision, and carries the same open item (the `design-motion` sweep) rather than one document claiming closure the others do not.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [x] CHK-060 [P0] `rg -n "design-motion"` across the hub (excluding history) returns no unresolvable path
  - **Evidence:** the three dead path citations were repointed to their real locations — `feature-catalog/procedure-card-system/procedure-card-inventory.md:40` → `design-interface/procedures/interaction-states-pass.md`, and `feature-catalog/styles-library-utilization/per-mode-consumers.md:42,52` → `design-interface/corpus/motion-evidence.mjs` and `design-interface/corpus/tests/motion-evidence.test.mjs`. All three targets verified present on disk. `rg 'design-motion' .opencode/skills/sk-design/` excluding `benchmark/` and `changelog/` now returns a single hit, `manual-testing-playbook/mode-routing/motion-mode.md:16`, which names the retired mode in accurate historical prose describing the fold-in — not a path reference, and correct as written. Two further residue sites found and cleared in the same sweep: `shared/register.md:28,76` still listed `motion` as a live mode alongside `interface` and `md-generator`. Changelog and benchmark-report references are intentionally retained as historical record.
- [x] CHK-061 [P1] This phase lands as its own commit, independently revertable from `009`/`011`
  - **Evidence:** `c1981d2b91` is a single commit carrying the merge. It also carries `009-aesthetics-retirement`'s spec-doc reconciliation (6 files under `.opencode/specs/…/009-…/`), so a revert would take those doc updates with it — the skill-tree change itself is still cleanly isolated from `011`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 9/10 |
| P1 Items | 7 | 7/7 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-27. All eighteen items verified against the working tree and commit `c1981d2b91`. CHK-060 was the last to close: the three dead `design-motion` path citations were repointed to their real `design-interface/` locations and two further residue lines in `shared/register.md` were cleared. The one surviving `design-motion` mention is accurate historical prose, not a path.
<!-- /ANCHOR:summary -->
