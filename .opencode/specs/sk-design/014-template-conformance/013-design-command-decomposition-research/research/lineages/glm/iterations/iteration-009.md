# Iteration 009 — Consolidation Reversal Cost: What Did 010-motion-merge Spend?

**Focus:** Quantify what the 010-motion-merge consolidation spent to retire `/interface:motion`, and what reversing it would cost. The hard constraint says reversing a just-completed consolidation requires a much stronger argument than symmetry.

## Evidence

- `010-motion-merge/spec.md:157` — status "In progress"
- `010-motion-merge/plan.md:82-86` — the merge plan steps
- `010-motion-merge/tasks.md:93` — T029 (incomplete): delete `/interface:motion` + runtime mirrors
- `010-motion-merge/checklist.md:86` — CHK-025 (incomplete): runtime mirrors deleted from all four runtime dirs
- `010-motion-merge/implementation-summary.md:52` — "Nothing yet. This packet is Planned"
- `010-motion-merge/graph-metadata.json:200` — "design-motion (39 files, 4,175 lines) is a standalone mode"
- `010-motion-merge/description.json:4` — same 39 files / 4,175 lines figure

## What the consolidation is spending

The 010-motion-merge packet is merging `design-motion` (39 files, 4,175 lines) into `design-interface`. Per plan.md:86, the merge steps are:

1. Read ordering mechanism, record rationale → HARD STOP CHECK
2. Move `references/` + `assets/` (motion content into design-interface)
3. Flatten `procedures/` + `corpus/`, resolving 9 collisions
4. Add motion intents + task lane to `design-interface/SKILL.md` + `command-metadata.json` + `design.md`
5. Repoint `next`/`preferSiblingWhen`/`typicallyBefore`/`handoff.nextOptions` (the 4 machine constraints from iteration 004)
6. Collapse `hub-router.json` `tieBreak`
7. Collapse `grounding-receipt.mjs` `PAIRED_MODES`
8. Delete `/interface:motion` + runtime mirrors (.claude/, .codex/, .cursor/, .devin/)

Steps 4-5 are exactly the constraint-satisfying wiring that a split would need to RE-ADD. Step 8 is the deletion that a split would REVERSE.

## Current status: incomplete

The packet is "In progress" [spec.md:157]. The implementation-summary.md:52 says "Nothing yet. This packet is Planned." But the design-interface SKILL.md already contains the motion intents [SKILL.md:127-132] and motion RESOURCE_MAP entries [SKILL.md:148-153], and the Motion Design Workflow section [SKILL.md:218-222]. This means the content move (steps 2-4) has happened, but the command retirement (step 8) is incomplete — the stale `/interface:motion` references in `design.md:27` and `design-reference.md:27` confirm this.

**The consolidation is half-done:** motion content has moved into design-interface, but the old command references have not been fully cleaned up.

## What reversing would cost

Reversing the merge — re-creating `/interface:motion` as a separate command — would require:

1. **Re-create the command doc** (`commands/interface/motion.md`) — the retired file was deleted
2. **Re-create 2 YAML workflow assets** (auto + confirm) — ~33 KB combined (based on current design YAML sizes)
3. **Re-create the presentation asset** — ~4 KB
4. **Re-add a command-metadata.json record** — ~250 lines (based on the interface design record)
5. **Re-add a mode-registry.json entry** — ~20 lines
6. **Re-add hub-router.json signal + vocabulary classes** — ~80 lines (motion-aliases, motion-temporal, motion-runtime, motion-feel already exist in hub-router.json:202-254 but point to the interface mode)
7. **Re-create runtime mirrors** in .claude/, .codex/, .cursor/, .devin/ — 4 dirs
8. **Update all existing commands' constraints** — `next`, `preferSiblingWhen`, `typicallyBefore`, `handoff.nextOptions` on both `/interface:design` and `/interface:design-reference`
9. **Update test EXPECTED array** — add the new command to `interface-command-contract.test.mjs:10-13`
10. **Move motion content BACK out of design-interface/SKILL.md** — remove the 6 MOTION_* intents, 6 RESOURCE_MAP entries, and Motion Design Workflow section, re-creating a separate design-motion/SKILL.md

**Total reversal cost: ~9 new files, ~50 KB content, ~440 metadata lines, ~80 router lines, 4 runtime mirrors, 8 constraint field updates, test updates, plus content move-back.**

This is strictly more work than the consolidation spent to remove it, because the consolidation only had to delete and rewire, while the reversal has to create, rewire, AND move content back.

## The asymmetry argument

The hard constraint says: "Reversing a consolidation that was just completed requires a much stronger argument than symmetry."

The consolidation is not even completed yet (010-motion-merge is "In progress"). Reversing an incomplete consolidation means:
- The consolidation's remaining work (clean up stale refs, delete runtime mirrors) would be abandoned
- The reversal's full cost would be paid on top of the consolidation's sunk cost
- The net result would be: motion content moved out, then moved back in, then moved out again — three moves instead of one

**No demonstrated harm justifies this triple-move.** The only demonstrated harms (iteration 006) are stale references and naming drift, both fixable with trivial edits that do not require reversing the consolidation.

## What was tried and failed

- Checked whether the consolidation could be "partially reversed" — keep motion content in design-interface but re-add the `/interface:motion` command as an alias. This fails because the command system does not support command aliases to other commands' modes. The `aliases` field in metadata [metadata:16-20] is for keyword aliases, not command aliases. A command must have its own `ownerMode` [surface-check.mjs:342-344], and `ownerMode` must match a `workflowMode` in the registry [surface-check.mjs:342]. Re-adding the command means re-adding the mode, which means moving content back out.

## Novelty justification

First quantified reversal cost. The finding that reversal costs strictly more than the consolidation's sunk cost, and that no demonstrated harm justifies it, is the load-bearing argument against splitting motion out. newInfoRatio: 0.8 (substantially new — the reversal cost quantification and the incomplete-consolidation finding are new).

[SOURCE: .opencode/specs/sk-design/014-template-conformance/010-motion-merge/spec.md:157]
[SOURCE: .opencode/specs/sk-design/014-template-conformance/010-motion-merge/plan.md:82-86]
[SOURCE: .opencode/specs/sk-design/014-template-conformance/010-motion-merge/tasks.md:93]
[SOURCE: .opencode/specs/sk-design/014-template-conformance/010-motion-merge/implementation-summary.md:52]
[SOURCE: .opencode/specs/sk-design/014-template-conformance/010-motion-merge/graph-metadata.json:200]
[SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:342-344]
[SOURCE: .opencode/skills/sk-design/command-metadata.json:16-20]
