# Iteration 14: Command-Entry Register Pinning

## Focus

[D2-10 / D2] Register, meaning Brand vs Product, is not pinnable at `/design:*` command entry even though it gates density, motion, color, copy, anti-slop strictness, and audit severity. The corpus for this pass was `impeccable-main`.

This pass does not re-cover D2-7 task-verb granularity, D2-8 interface-lane visibility, or D2-9 pipeline handoff. It narrows to one missing command-surface input: a user or wrapper cannot currently pin or prove the operating register before a mode runs.

## Actions Taken

1. Re-read the current strategy and recent D2 iterations so this pass stayed on register pinning instead of task-command inventory or pipeline handoff. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:33] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-011.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-012.md:1] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-013.md:1]
2. Read the `impeccable-main` setup contract plus its Brand, Product, `bolder`, and `quieter` references to verify that register is a command-entry prerequisite, not a late stylistic preference. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:21] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/brand.md:3] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/product.md:3] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/bolder.md:5] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/quieter.md:5]
3. Read the live `/design:*` wrappers and `sk-design/mode-registry.json` to verify what can currently be pinned at command entry. [SOURCE: .opencode/commands/design/interface.md:3] [SOURCE: .opencode/commands/design/interface.md:13] [SOURCE: .opencode/commands/design/foundations.md:3] [SOURCE: .opencode/commands/design/motion.md:3] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14]
4. Read the shared `sk-design` register, mode packets, and context-loading contract to verify that `sk-design` already knows register matters but exposes the guarantee below the command layer. [SOURCE: .opencode/skills/sk-design/shared/register.md:16] [SOURCE: .opencode/skills/sk-design/shared/register.md:49] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:74] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:87] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:92] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:95] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:20]

## Findings

### F1 - `impeccable-main` makes register a setup invariant before every command, while `/design:*` only pins modes

Evidence:

- The corpus setup says the matching register reference is non-optional and selected before design work by task cue, surface in focus, or declared register. It maps marketing, landing pages, campaigns, long-form content, and portfolios to Brand, and app UI, admin, dashboards, and tools to Product. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:21]
- The same corpus uses `setup.register` to tailor no-argument starting-point recommendations, so register also affects command recommendation, not only mode-internal styling. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:160]
- Brand and Product are explicitly different operating registers: Brand surfaces are where design is the product and impression is the deliverable; Product surfaces are app UIs, dashboards, tools, and task surfaces. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/brand.md:3] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/product.md:3]
- Current `/design:interface`, `/design:foundations`, and `/design:motion` wrappers all expose `argument-hint: "<design request>"`, then load exactly one pinned mode and apply it to `$ARGUMENTS`. There is no command-level `--register`, no accepted register field, and no `STATUS=ASK` or `STATUS=DEFER` case for unresolved register. [SOURCE: .opencode/commands/design/interface.md:3] [SOURCE: .opencode/commands/design/interface.md:19] [SOURCE: .opencode/commands/design/interface.md:24] [SOURCE: .opencode/commands/design/foundations.md:3] [SOURCE: .opencode/commands/design/foundations.md:24] [SOURCE: .opencode/commands/design/motion.md:3] [SOURCE: .opencode/commands/design/motion.md:24]
- `mode-registry.json` contains mode keys, packets, aliases, and advisor routing metadata for the five modes, but no command-surface register grammar or register resolution policy. [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:33] [SOURCE: .opencode/skills/sk-design/mode-registry.json:45] [SOURCE: .opencode/skills/sk-design/mode-registry.json:57] [SOURCE: .opencode/skills/sk-design/mode-registry.json:69]

Buildable recommendation:

Add register fields to the future command-surface metadata, not as a new mode. Minimum shape:

```json
{
  "registerPolicy": {
    "accepted": ["auto", "brand", "product"],
    "default": "auto",
    "resolutionOrder": ["taskCue", "surfaceInFocus", "declaredRegister"],
    "askWhen": ["mixedSurfaceNoTarget", "registerContradiction", "commandRequiresDifferentSurface"],
    "proofFields": ["REGISTER", "WHY", "DIALS", "DOWNSTREAM EFFECT"]
  }
}
```

Generate or drift-check each wrapper so the argument hint can accept `--register brand|product|auto`, and so wrapper status can return `STATUS=ASK MISSING_REGISTER="<surface-or-decision>"` when the register cannot be resolved from the prompt or target.

Enforceability:

- ENFORCEABLE: static checks can require every `/design:*` wrapper and command metadata row to declare register policy, accepted values, resolution order, and proof fields.
- ENFORCEABLE: wrapper drift tests can fail any command whose argument hint still exposes only `<design request>` after command-surface metadata is added.
- ADVISORY: the final register choice for genuinely mixed or ambiguous surfaces remains runtime judgment unless the user pins it.

### F2 - Register gates the downstream decisions that command tasks are supposed to make

Evidence:

- The live `sk-design` shared register says the first design decision, before color, type, layout, or motion, is whether the surface is Brand or Product. It says skipping this call is the common reason output drifts to a generic default. [SOURCE: .opencode/skills/sk-design/shared/register.md:16]
- Its six dials are exactly the dimensions command tasks would otherwise guess: Density, Motion budget, Color dosage, Copy register, Anti-slop strictness, and Audit severity. [SOURCE: .opencode/skills/sk-design/shared/register.md:49] [SOURCE: .opencode/skills/sk-design/shared/register.md:55] [SOURCE: .opencode/skills/sk-design/shared/register.md:56] [SOURCE: .opencode/skills/sk-design/shared/register.md:57] [SOURCE: .opencode/skills/sk-design/shared/register.md:58] [SOURCE: .opencode/skills/sk-design/shared/register.md:59] [SOURCE: .opencode/skills/sk-design/shared/register.md:60]
- The shared register also says each mode reads the same posture: interface uses density, motion, and color strategy; foundations uses color strategy and token density; motion uses the motion-budget dial; audit uses register for severity weighting. [SOURCE: .opencode/skills/sk-design/shared/register.md:73] [SOURCE: .opencode/skills/sk-design/shared/register.md:75] [SOURCE: .opencode/skills/sk-design/shared/register.md:76] [SOURCE: .opencode/skills/sk-design/shared/register.md:77] [SOURCE: .opencode/skills/sk-design/shared/register.md:78]
- The mode packets repeat that contract: interface requires register and brief-to-dials before decisions; foundations reads register first; motion points to the register motion-budget dial; audit sets audit severity from register. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:74] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:250] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:87] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:92] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:95]
- The corpus proves this matters for task commands: `bolder` says Brand can mean extreme scale, unexpected color, and typographic risk, while Product bolder means clearer hierarchy, one sharper accent, and density; `quieter` similarly diverges between Brand restraint and Product noise reduction. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/bolder.md:5] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/bolder.md:7] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/bolder.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/quieter.md:5] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/quieter.md:7] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/reference/quieter.md:9]

Buildable recommendation:

Treat register as a required field in command-level proof, not just as a file the child packet says to read. Add command-surface fixtures that replay the same user verb across both postures:

- `/design:bolder landing page --register brand` must allow higher variance, larger color dosage, and a larger motion budget.
- `/design:bolder admin dashboard --register product` must bias toward hierarchy, density, restrained color, and state clarity.
- `/design:quieter campaign page --register brand` must preserve voice while reducing intensity.
- `/design:quieter settings panel --register product` must reduce noise, decorative color, and motion.

Each fixture should assert the emitted proof fields include `REGISTER`, `WHY`, `DIALS`, and `DOWNSTREAM EFFECT`.

Enforceability:

- ENFORCEABLE: fixture replay can compare register-specific output fields for the same verb and fail if Brand/Product produce identical dial choices.
- ENFORCEABLE: proof-card checks can require the register fields before any palette, layout, motion, copy, audit, score, ready, or handoff claim.
- ADVISORY: the taste-quality of the resulting Brand or Product interpretation remains review judgment.

### F3 - The enforcement substrate already exists; the missing layer is command-entry binding

Evidence:

- `context_loading_contract.md` already defines a register-first gate: `register.md` is the first read for any design or UI work, and Brand/Product must be set before palette, layout, motion, copy, severity, or handoff decisions. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:20] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:22]
- The same contract defines a manifest field for register source and blocks any design decision before required files are named as loaded. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:44] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:53] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65]
- It also names exact proof fields for `REGISTER`, `WHY`, `DIALS`, and `DOWNSTREAM EFFECT`. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:69] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:75] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:76] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:77] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:78] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:79]
- The `Context Loaded Card` and `Proof Of Application Card` already include register/dial rows that can be checked at pre-work and end-of-work boundaries. [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:35] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:39] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:41] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:35] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:39]
- Hard gates already block palette, layout, motion, copy, accessibility, score, release, and readiness claims without register/dials or the files behind the claim. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:138] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:142] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:143] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:150]

Buildable recommendation:

Do not invent a parallel enforcement system. Extend the existing proof vocabulary upward into command metadata:

- `commandSurface.registerPolicy` defines how a wrapper resolves or asks for register.
- `commandSurface.statusFields` includes `REGISTER`, `WHY`, `DIALS`, `DOWNSTREAM_EFFECT`, and `REGISTER_SOURCE`.
- `commandSurface.fixtures` includes Brand/Product pairs for mode commands and task projections.
- `scripts/design-command-surface-check` verifies static metadata and wrapper drift.
- `scripts/proof_check.py` or a sibling checker verifies the command-output proof fields.

The result is a command-entry binding over the existing context-loaded and proof-of-application cards.

Enforceability:

- ENFORCEABLE: metadata coverage, wrapper parity, and presence of proof fields are deterministic.
- ENFORCEABLE: gold-corpus fixture replay can prove a register is resolved before recommendations and that downstream dials are not identical across Brand/Product cases.
- ADVISORY: whether a mixed surface should be split into two commands or handled by one mixed-bundle response is context judgment.

## Questions Answered

- Q1: `/design:*` command metadata should expose register as a first-class command-entry field because it affects the density, motion, color, copy, and audit output of every mode.
- Q2/Q5: The enforceable layer is static command metadata plus wrapper drift checks plus proof-field fixture replay. The advisory layer is the final Brand/Product decision when the prompt names a genuinely mixed surface without a target.
- Q5: The buildable path is to reuse `shared/register.md`, `context_loading_contract.md`, `context_loaded_card.md`, and `proof_of_application_card.md`; no sixth mode or duplicate proof-card system is needed.

## Questions Remaining

- Should `registerPolicy` live inside `mode-registry.json.commandSurface`, or in a sibling `command-metadata.json` that points back to mode keys and task projections?
- Should ambiguous register resolution fail closed with `STATUS=ASK MISSING_REGISTER`, or should it default to Product when the command is pinned and no surface cue exists?
- How should fixture replay represent mixed apps where `/marketing` is Brand and `/app/settings` is Product inside the same repo?

## Next Focus

Continue D2 with the command metadata home and schema: combine task projections, lifecycle handoff, and register policy into the smallest command-surface metadata model that can generate wrappers and replay fixtures without flattening per-mode design logic into the hub.
