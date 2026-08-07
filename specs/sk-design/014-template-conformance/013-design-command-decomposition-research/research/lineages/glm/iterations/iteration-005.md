# Iteration 005 — Middle Paths: Separating Concerns Without Multiplying Commands

**Focus:** Compare middle-path options (richer argument lanes, subcommands, mode-internal routing) against splitting, grounded in the actual command/mode structure.

## Option A: Richer argument lanes (expand `--mode`)

**Current state:** `--mode` accepts `direction|directions|redesign|preflight|handoff` [design.md:3, metadata:73]. The 12 internal lanes are already mode-internal routing — they are not surfaced but are selectable by intent scoring inside the mode.

**What expanding would look like:** Add `--mode motion` or `--mode visual-system` to make internal lanes explicitly selectable.

**Cost:** ~0 new files. Edit `argumentGrammar.render` [metadata:73], `argument-hint` [design.md:3], and the `tasks` array surface descriptions. No new command doc, no new YAML, no new metadata record, no constraint propagation, no test EXPECTED update.

**Benefit:** Makes the motion sub-chain explicitly addressable without adding a command. A user could type `/interface:design my-surface --mode motion` to skip the static design process and go straight to the restraint gate.

**Risk:** SKILL.md:48 says "If the static hierarchy is unclear before motion can help, resolve that first." A `--mode motion` lane would need to either (a) enforce the static-first check internally, or (b) trust the user to know the static hierarchy is already clear. Option (b) violates the mode's own contract.

**Verdict:** This is the **smallest change** that addresses the motion-addressability concern. It adds one `--mode` value, not a command. But it does not solve the word-cap pressure (the motion content stays in the same SKILL.md).

## Option B: Subcommands (namespace extension)

**What it would look like:** `/interface:design motion my-surface` or `/interface:motion my-surface` as a subcommand of `/interface:design`.

**Cost:** OpenCode's command system does not have a documented subcommand pattern. The `argumentGrammar` [metadata:45-73] has `positional` and `flags` — no `subcommand` field. A subcommand would need to be either:
- A positional argument with special parsing (fragile, conflicts with the `target` positional [metadata:47-51])
- A separate command doc in the same `interface/` namespace (which IS a new command, paying the full cost from iteration 003)

**Verdict:** Subcommands are **not a real middle path** in this command system. They collapse to either a richer `--mode` lane (Option A) or a full new command (the split case).

## Option C: Mode-internal routing (status quo + intent scoring)

**Current state:** This is what already happens. The 17 INTENT_SIGNALS [SKILL.md:114-133] score the prompt, and the RESOURCE_MAP [SKILL.md:135-154] loads only the relevant references. A motion prompt scores MOTION_* intents and loads only motion references. A design prompt scores DESIGN_PRINCIPLES and loads only design references.

**How well it works:** The intent scoring is substring-based with weight 4 per keyword hit and ambiguity delta 1.0 [SKILL.md:106-107]. A prompt like "animate this hover state" hits MOTION_MICRO_INTERACTIONS keywords ("hover", "micro-interaction") and MOTION_DECISION keywords ("animate at all") but not DESIGN_PRINCIPLES keywords. The routing already separates motion from static design at the resource-loading level.

**Where it breaks:** The intent scoring cannot SKIP the static design process (STEP 0-4). Even if only motion intents score, the mode's Phase Detection [SKILL.md:60-68] still runs STEP 0 (ground the subject) through STEP 4 (self-critique). The mode-internal routing loads the right references but does not skip the process phases. A motion-only prompt still gets the full design process, which is unnecessary overhead.

**Verdict:** Mode-internal routing already separates concerns at the **resource** level but not at the **process** level. The gap is not "motion resources are mixed with design resources" — they are not. The gap is "the process flow does not branch for motion-only prompts."

## Option D: Mode-internal process branching (the actual middle path)

**What it would look like:** Add a process-level branch in the mode: if only MOTION_* intents score above threshold, skip STEP 0-4 and go directly to the motion restraint gate. This is a SKILL.md edit, not a command split.

**Cost:** ~1 file edit (design-interface/SKILL.md), adding a conditional branch in the Phase Detection section. No new command, no new YAML, no metadata, no constraint propagation, no test updates.

**Benefit:** Solves the actual gap (motion-only prompts don't need the static design process) without multiplying the command surface.

**Risk:** Adds complexity to the mode's process flow. But it is strictly less complexity than a new command (which would need its own SKILL.md, its own process flow, and all the constraint wiring).

**Verdict:** This is the **true middle path** — it addresses the one real gap (motion process independence) at the cost of a SKILL.md edit, not a command split.

## Comparison table

| Option | New commands | New files | Metadata edits | Constraint updates | Solves motion gap? | Solves word-cap? |
|--------|-------------|-----------|---------------|-------------------|-------------------|-----------------|
| Split motion out | 1 | ~9 | ~440 lines | 8 field updates | Yes | Yes (motion content moves out) |
| A: Richer `--mode` | 0 | 0 | ~3 lines | 0 | Partially (addressable but process still runs) | No |
| B: Subcommands | 0-1 | 0-9 | 0-440 | 0-8 | Collapses to A or split | No |
| C: Status quo | 0 | 0 | 0 | 0 | No (already works at resource level) | No |
| D: Process branching | 0 | 0 (1 edit) | 0 | 0 | Yes | No |

## What was tried and failed

- Checked whether the `procedures/` cards [SKILL.md:193-206] could serve as a middle path. They are private procedure cards selected by request shape, not public routes. They already provide mode-internal branching for specific request types (discovery questions, aesthetic direction, wireframes, variation sets, prototypes, decks, interaction states). But there is no procedure card for "motion-only task" — the motion workflow is hardcoded in SKILL.md:218-222, not a selectable card. Adding a `procedures/motion-only.md` card could be another middle-path option, but it would still not skip STEP 0-4 unless the process flow branches.

## Novelty justification

First comparison of all middle-path options against the split. Option D (mode-internal process branching) is a new proposal that addresses the real gap at 1/9th the file cost of a split. newInfoRatio: 0.95 (mostly new — the process-branching option was not previously considered).

[SOURCE: .opencode/commands/interface/design.md:3,60-69]
[SOURCE: .opencode/skills/sk-design/command-metadata.json:45-73,127-234]
[SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:48,60-68,106-107,114-154,193-206,218-222]
