# Iteration 006 — Evidence of Harm: What Failure Modes Does the Current Shape Produce?

**Focus:** Find real, demonstrated failure modes in the current single-command shape. A decomposition with no observed problem behind it is speculative.

## Harm candidate 1: Stale `/interface:motion` references (CONFIRMED — demonstrated harm)

`design.md:27` says:
> **Prefer `/interface:motion` when** the request is animation choreography, transitions, micro-interactions, or reduced-motion behavior.

`design-reference.md:27` says:
> **Prefer `/interface:motion` when** the request is temporal design.

But `/interface:motion` is a **retired command**. `SKILL.md:276` states: "`/interface:foundations`, `/interface:audit`, and `/interface:motion` are retired with no alias or transition period." `README.md:67` confirms the same.

This is a **live routing bug**: a user following the discriminator in `design.md:27` would try to invoke a command that does not exist. The 011-retirement-residue packet already identified this as T005a and fixed some stale references, but `design.md:27` and `design-reference.md:27` are still unfixed.

**Is this caused by the single-command shape?** No — this is a residue from the consolidation, not a structural flaw of having one command. It would exist regardless of whether motion is a lane or a separate command. It is a documentation drift bug, not a decomposition argument.

**Cost to fix:** ~15 minutes, 2 files (remove the stale `Prefer /interface:motion` rows). This is the smallest change that fixes a demonstrated problem.

## Harm candidate 2: 5000-word cap pressure (CONFIRMED — but not a decomposition argument)

SKILL.md was trimmed 5234 → 4991 words to stay under a 5000-word hard cap. The file is at 99.8% capacity with 9 words of headroom.

**Is this caused by the single-command shape?** Partially. The consolidation moved motion content (6 intents, 6 RESOURCE_MAP entries, the Motion Design Workflow section) into this SKILL.md. If motion had its own SKILL.md, the interface SKILL.md would be ~1000+ words lighter.

**But:** The word cap is a **SKILL.md constraint**, not a command constraint. A command split does not require a SKILL.md split — a single command can own multiple mode packets. Conversely, a SKILL.md split does not require a command split — motion content could move to a separate `design-motion/SKILL.md` referenced by the same `interface` mode, without adding a public command.

**Cost to fix via SKILL.md split (no command split):** Move the Motion Design Workflow section [SKILL.md:218-222] and the 6 MOTION_* RESOURCE_MAP entries to a `references/motion/SKILL.md` sub-document. The interface SKILL.md drops ~200-400 words. No command surface change. This is smaller than a command split.

**Cost to fix via command split:** ~9 new files, ~440 metadata lines, 8 constraint updates (iteration 003). Much larger.

**Verdict:** The word-cap pressure is real but does not justify a command split. It justifies a SKILL.md content reorganization, which is a smaller change.

## Harm candidate 3: `handoff` vs `--mode build` naming drift (CONFIRMED — metadata inconsistency)

`command-metadata.json:164-168`:
```json
{
  "lane": "REAL_UI_LOOP",
  "label": "handoff",
  "class": "argument",
  "surface": "--mode build: real UI loop and sk-code handoff manifest"
}
```

The lane label is `handoff` but the `--mode` value in the surface is `build`. The `argumentGrammar.render` [metadata:73] says `--mode direction|directions|redesign|preflight|handoff` — it lists `handoff`, not `build`. The surface description says `--mode build`.

This is a **naming inconsistency**: the metadata says the mode value is `handoff` in one place and `build` in another. A user typing `--mode build` would get an unrecognized mode value (assuming the grammar is enforced).

**Is this caused by the single-command shape?** No — this is a metadata authoring bug. It would exist whether handoff is a lane of one command or a separate command. It is fixed by a 1-line metadata edit.

**Cost to fix:** ~5 minutes, 1 line in `command-metadata.json:167`.

## Harm candidate 4: Intent-scoring collisions (INVESTIGATED — no confirmed collision found)

The hypothesis: a prompt scores multiple unrelated intents equally, causing the wrong resources to load.

**Test:** Checked for keyword overlap between non-co-occurring intent clusters (iteration 001 finding).

- `DESIGN_PRINCIPLES` keywords include "design", "layout", "typography", "palette", "type" [SKILL.md:115]
- `VISUAL_SYSTEM` keywords include "design foundations", "color system", "type scale", "typographic scale", "design tokens" [SKILL.md:126]

A prompt like "design the color system for my layout" would score both DESIGN_PRINCIPLES (hits "design", "layout") and VISUAL_SYSTEM (hits "color system", "design tokens" — wait, "design tokens" is not in the prompt). Actually: "color system" hits VISUAL_SYSTEM, "design" and "layout" hit DESIGN_PRINCIPLES. Both score weight 4. With ambiguity delta 1.0 [SKILL.md:106-107], both would be selected. But this is **correct behavior** — a color system design task does need both the design principles and the visual system references. This is not a collision; it is appropriate co-loading.

- `MOTION_DECISION` keywords include "restraint", "animate at all", "motion budget" [SKILL.md:127]
- `DESIGN_PRINCIPLES` keywords include "design", "redesign" [SKILL.md:115]

A prompt like "redesign the animation" scores both. But this is also correct — redesigning animation needs both the redesign intake and the motion decision gate.

**Verdict:** No confirmed intent-scoring collision found. The substring scoring with ambiguity delta 1.0 is coarse, but the overlaps I tested all produce appropriate co-loading, not wrong routing. This harm candidate is **not demonstrated**.

## Harm candidate 5: Wrong-command routing from lane ambiguity (INVESTIGATED — not found)

The hypothesis: a user types `/interface:design my-surface --mode preflight` but actually wants a new direction, and the command runs preflight on a surface that has no direction yet.

**Evidence:** SKILL.md:82 says preflight is "the final mechanical pass before shipping." If the user runs `--mode preflight` on a surface with no prior direction, the preflight card would check a surface that was never designed. But this is a **user error**, not a structural failure of the single-command shape. A separate `/interface:preflight` command would have the same user-error risk.

**Verdict:** Not a structural harm. Not demonstrated.

## Summary of demonstrated harm

| Harm | Confirmed? | Caused by single-command shape? | Smallest fix | Fix cost |
|------|-----------|-------------------------------|-------------|----------|
| Stale `/interface:motion` refs | Yes | No (consolidation residue) | Remove 2 rows from design.md + design-reference.md | ~15 min |
| 5000-word cap pressure | Yes | Partially (motion content added) | Move motion content to sub-SKILL.md (no command split) | ~2 hours |
| `handoff` vs `build` drift | Yes | No (metadata bug) | Fix 1 line in command-metadata.json | ~5 min |
| Intent-scoring collisions | No | N/A | N/A | N/A |
| Wrong-command routing | No | N/A | N/A | N/A |

**Only 3 demonstrated harms exist, and none of them is caused by the single-command shape.** Two are consolidation residue (stale refs, naming drift) fixable with trivial edits. One (word cap) is addressable by a SKILL.md content reorganization that does not require a command split.

## What was tried and failed

- Searched for a user-facing routing failure where `/interface:design` sends the user to the wrong mode. The only sibling routing is to `/interface:design-reference` [metadata:107-109], which is correct. No wrong-routing evidence found.

## Novelty justification

First systematic harm audit. The key finding is that no demonstrated harm is caused by the single-command shape — all three confirmed harms are fixable with edits smaller than a command split. This directly answers Q5 and is load-bearing for the final recommendation. newInfoRatio: 0.95 (substantially new — the harm audit with causal attribution is new).

[SOURCE: .opencode/commands/interface/design.md:27]
[SOURCE: .opencode/commands/interface/design-reference.md:27]
[SOURCE: .opencode/skills/sk-design/SKILL.md:276]
[SOURCE: .opencode/skills/sk-design/README.md:67]
[SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:82,115,127,218-222]
[SOURCE: .opencode/skills/sk-design/command-metadata.json:164-168,73]
[SOURCE: .opencode/specs/sk-design/014-template-conformance/011-retirement-residue/tasks.md:58]
