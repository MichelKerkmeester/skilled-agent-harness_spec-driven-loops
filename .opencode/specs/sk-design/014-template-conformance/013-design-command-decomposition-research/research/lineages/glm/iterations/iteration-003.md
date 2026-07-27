# Iteration 003 — Decomposition Cost Quantification

**Focus:** Quantify what splitting `/interface:design` actually costs, grounded in the real artifact inventory.

## Evidence base

- `.opencode/commands/interface/assets/` — 6 files for 2 commands
- `.opencode/skills/sk-design/command-metadata.json` — 574 lines for 2 command records
- `.opencode/skills/sk-design/mode-registry.json` — 99 lines for 3 modes
- `.opencode/skills/sk-design/hub-router.json` — 322 lines
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` — 2864 lines
- `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` — 139 lines
- `.claude/commands/interface/` — runtime mirror (design.md + design-reference.md + assets/)
- `.cursor/`, `.devin/`, `.codex/` — no interface command dirs exist

## Per-command artifact inventory (CONFIRMED by file listing)

Each public command currently requires:

| Artifact | File | Size | Source |
|----------|------|------|--------|
| Command doc | `commands/interface/{name}.md` | ~5-6 KB | design.md = 6245 bytes, design-reference.md = 4859 bytes |
| Auto workflow YAML | `commands/interface/assets/{name}-auto.yaml` | ~16 KB | interface-design-auto.yaml = 16318 bytes |
| Confirm workflow YAML | `commands/interface/assets/{name}-confirm.yaml` | ~17 KB | interface-design-confirm.yaml = 17115 bytes |
| Presentation asset | `commands/interface/assets/{name}-presentation.txt` | ~3-4 KB | interface-design-presentation.txt = 3906 bytes |
| Metadata record | `command-metadata.json` entry | ~250 lines | `/interface:design` entry = lines 2-373 (~371 lines) |
| Mode-registry entry | `mode-registry.json` mode object | ~20 lines | interface mode = lines 37-56 |
| Hub-router signal | `hub-router.json` routerSignals + vocabularyClasses | ~80 lines | interface signal + 4 vocab classes |
| Runtime mirror | `.claude/commands/interface/{name}.md` | ~5-6 KB | mirrors the command doc |
| Test EXPECTED entry | `interface-command-contract.test.mjs` | 1 line + surface load | EXPECTED array line 10-13 |
| Test surface assertions | `interface-command-contract.test.mjs` | ~10 assertions per surface | lines 33-61 |

**Total per new command: ~9 files, ~50 KB of content, ~360 lines of JSON metadata, ~80 lines of router config, plus test updates.**

## Machine constraint costs (CONFIRMED — design-command-surface-check.mjs)

Adding a new command triggers hard-binding constraints that must be satisfied simultaneously:

1. **`next` must be non-empty** [surface-check.mjs:358]: Every command must declare at least one `next` command. A new command must wire itself into the existing command graph.
2. **`preferSiblingWhen` must cover exactly the derived sibling set** [surface-check.mjs:916]: The discriminator's `preferSiblingWhen` must list every sibling command — no more, no less. Adding a command means updating EVERY existing command's `preferSiblingWhen` to include the new one.
3. **`typicallyBefore` must subset `next`** [surface-check.mjs:983]: If the new command declares `typicallyBefore`, those commands must also be in its `next` array.
4. **`handoff.nextOptions` must match `next` exactly** [surface-check.mjs:1247-1249]: The handoff options must be the same set as `next`. Adding a command means every command that lists it in `next` must also add a `handoff.nextOptions` entry with a `when` clause.

**Constraint propagation:** Adding ONE new command requires updating `next`, `preferSiblingWhen`, `typicallyBefore`, and `handoff.nextOptions` on EVERY existing command that could sequence to/from it. With 2 existing commands, that is 2 updates. But the constraint is quadratic: N new commands × M existing commands = N×M metadata updates, each touching 4 fields.

## What the consolidation just removed

The 010-motion-merge packet [spec.md:157] is still "In progress." Its plan.md:82 lists the deletion cost: `design-motion/SKILL.md`, `README.md`, `changelog/`, `motion-character-handoff.md`, `/interface:motion` command + runtime mirrors. Its tasks.md:93 has an incomplete task: "T029 Delete `/interface:motion` + runtime mirrors (.claude/, .codex/, .cursor/, .devin/) [15m]."

The consolidation spent effort REMOVING exactly the per-command overhead listed above. Re-adding a command reverses that spend.

## Cost summary

| Split scenario | New commands | New files | New metadata lines | Constraint updates | Test updates |
|----------------|-------------|-----------|-------------------|-------------------|-------------|
| Split motion out | 1 | ~9 | ~440 | 2 commands × 4 fields = 8 | 1 EXPECTED entry + surface load |
| Split preflight out | 1 | ~9 | ~440 | 8 | same |
| Split into 3 (direction, motion, preflight) | 2 | ~18 | ~880 | 3 commands × 4 fields × 2 = 24 | 2 EXPECTED entries + surface loads |
| Split into 5 (one per argument lane) | 4 | ~36 | ~1760 | 5 commands × 4 fields × 4 = 80 | 4 EXPECTED entries + surface loads |

## What was tried and failed

- Checked whether runtime mirrors are needed in all 4 runtime dirs. Only `.claude/commands/interface/` exists today; `.cursor/`, `.devin/`, `.codex/` do not have interface command dirs. So the mirror cost is currently 1 dir, not 4. But the 010-motion-merge tasks.md:93 assumes 4 runtime dirs need mirror deletion, suggesting the full mirror set is expected when a command is live. The cost may be lower today than the consolidation originally paid.

## Novelty justification

First quantified cost model grounded in actual file sizes and the hard machine constraints. The quadratic constraint propagation (preferSiblingWhen on every existing command) is a new finding. newInfoRatio: 1.0 (fully new).

[SOURCE: .opencode/commands/interface/assets/ file listing]
[SOURCE: .opencode/skills/sk-design/command-metadata.json:2-373]
[SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:358,916,983,1247-1249]
[SOURCE: .opencode/specs/sk-design/014-template-conformance/010-motion-merge/spec.md:157]
[SOURCE: .opencode/specs/sk-design/014-template-conformance/010-motion-merge/tasks.md:93]
[SOURCE: .opencode/specs/sk-design/014-template-conformance/010-motion-merge/plan.md:82]
