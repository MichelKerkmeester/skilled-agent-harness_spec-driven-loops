# Iteration 15: Command Metadata Drift

## Focus

[D2-11 / D2] command metadata drift in the current `/design:*` surface: descriptions, argument hints, and aliases are split across command frontmatter, the `sk-design` hub, and `mode-registry.json`. The goal was to verify the real drift shape, compare it to the `impeccable-main` corpus pattern, and produce a buildable single-source recommendation.

Correction to the prompt premise: the current drift is fragmentation, not exact triplication. `/design:*` command frontmatter has descriptions and `argument-hint`, but not aliases. `mode-registry.json` has aliases, but not command descriptions or argument hints. The hub has mode-use prose plus a broad keyword list. [SOURCE: .opencode/commands/design/interface.md:2] [SOURCE: .opencode/commands/design/interface.md:3] [SOURCE: .opencode/skills/sk-design/SKILL.md:11] [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21]

## Actions Taken

1. Read the deep-research workflow contract and output references to keep this as a leaf research iteration with narrative, JSONL delta, and canonical state append only. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:1] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/references/state/state_outputs.md:33]
2. Reviewed the active strategy and the last D2 iterations so this pass answered the remaining metadata-home question rather than re-covering command granularity, lifecycle chaining, or register pinning. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:100] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:121] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-014.md:115]
3. Read every checked-in `/design:*` command wrapper, the `sk-design` hub, and `mode-registry.json` to compare current metadata homes. [SOURCE: .opencode/commands/design/audit.md:2] [SOURCE: .opencode/commands/design/foundations.md:2] [SOURCE: .opencode/commands/design/interface.md:2] [SOURCE: .opencode/commands/design/md-generator.md:2] [SOURCE: .opencode/commands/design/motion.md:2] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4]
4. Checked `impeccable-main` for the corpus pattern: it has one invocable design skill with subcommands, a source command metadata file, generated provider outputs, and build validation around generated surfaces. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:5] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:10] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:121] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:283]

## Findings

### F1 - The five `/design:*` wrappers repeat command frontmatter by hand

Evidence:

- Every checked-in design command has its own `description`, the same generic `argument-hint: "<design request>"`, and the same allowed-tool list. [SOURCE: .opencode/commands/design/audit.md:2] [SOURCE: .opencode/commands/design/audit.md:3] [SOURCE: .opencode/commands/design/foundations.md:2] [SOURCE: .opencode/commands/design/foundations.md:3] [SOURCE: .opencode/commands/design/interface.md:2] [SOURCE: .opencode/commands/design/interface.md:3] [SOURCE: .opencode/commands/design/md-generator.md:2] [SOURCE: .opencode/commands/design/md-generator.md:3] [SOURCE: .opencode/commands/design/motion.md:2] [SOURCE: .opencode/commands/design/motion.md:3]
- The wrapper body is also templated by mode: each opens as a thin bridge, reads the hub and mode packet, applies the mode to `$ARGUMENTS`, and returns only `STATUS=OK` or `STATUS=FAIL`. [SOURCE: .opencode/commands/design/interface.md:9] [SOURCE: .opencode/commands/design/interface.md:19] [SOURCE: .opencode/commands/design/interface.md:24] [SOURCE: .opencode/commands/design/interface.md:27] [SOURCE: .opencode/commands/design/motion.md:9] [SOURCE: .opencode/commands/design/motion.md:19] [SOURCE: .opencode/commands/design/motion.md:24] [SOURCE: .opencode/commands/design/motion.md:27]
- The hub already states that routing is registry-driven and that the registry is the single source of truth for the discriminator. That source of truth currently covers modes, not command frontmatter. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:47] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4]

Buildable recommendation:

- Add `.opencode/skills/sk-design/command-metadata.json` as the single authoring surface for command-facing metadata, with one record per command:
  - `command`, `ownerMode`, `description`, `argumentHint`, `aliases`, `accepts`, `returns`, `next`, `proofFields`, and `deferToHubWhen`.
  - For task projections from prior iterations, add `taskKey`, `resourceLanes`, and `registerPolicy` when relevant.
- Generate or validate `.opencode/commands/design/*.md` frontmatter and the templated purpose/status blocks from this file. Hand-edited wrappers should fail validation when their frontmatter differs from metadata.
- Keep `mode-registry.json` as the routing/advisor source of truth. The new command metadata should point to `workflowMode` keys, not redefine mode ownership.

Enforceability:

- ENFORCEABLE: a static checker can compare every `/design/*.md` frontmatter `description` and `argument-hint` against `command-metadata.json`.
- ENFORCEABLE: the checker can fail missing command records, extra wrapper files, stale `ownerMode` references, duplicate aliases, and command aliases that do not map to a valid owner mode.
- ADVISORY: the exact marketing quality of a command description remains editorial judgment, even if the presence, freshness, and routing target are deterministic.

### F2 - Put command metadata beside the registry, not inside the hub prose

Evidence:

- The hub says it holds no per-mode design logic and that each mode keeps its own contract in its packet. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:62]
- The registry's own description says it is the source of truth for `workflowMode/backendKind` plus the advisor routing projection; it also notes the advisor does not read the file at runtime. [SOURCE: .opencode/skills/sk-design/mode-registry.json:4]
- The registry already holds aliases for routing fixtures, while the hub has broad keyword frontmatter and a mode table. Adding full command docs into both would extend the existing drift rather than remove it. [SOURCE: .opencode/skills/sk-design/SKILL.md:11] [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:33] [SOURCE: .opencode/skills/sk-design/mode-registry.json:45] [SOURCE: .opencode/skills/sk-design/mode-registry.json:57] [SOURCE: .opencode/skills/sk-design/mode-registry.json:69]

Buildable recommendation:

- Prefer a sibling `command-metadata.json` over `mode-registry.json.commandSurface` for command descriptions and docs. This keeps the registry as the discriminator contract while giving the command surface its own schema and tests.
- Allow the command metadata to derive from registry mode keys only for identity fields: `ownerMode`, `packet`, and `backendKind`. Do not derive command prose from the hub's mode table because that table is explanatory prose, not a command contract.
- Add one generated docs section, probably in a future command README, from the same command metadata. The command wrappers and docs should not be separate authoring surfaces.

Enforceability:

- ENFORCEABLE: JSON-schema validation can require `ownerMode` to match an existing `mode-registry.json.modes[].workflowMode`.
- ENFORCEABLE: projection tests can assert every pinned command either has a matching metadata record or is marked `generated: false` with a reason.
- ADVISORY: whether command metadata belongs in a sibling file or embedded under `mode-registry.json.commandSurface` is a maintainability choice, but the evidence favors a sibling file because it preserves the registry's routing-only shape.

### F3 - `impeccable-main` gives the usable pattern: source command metadata plus build validation

Evidence:

- `impeccable-main` documents one user-invocable skill with 23 commands underneath it, which is the same command-visible-under-one-family shape this research is pushing toward for `sk-design`. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:5]
- The corpus explicitly names `skill/scripts/command-metadata.json` as the single source of truth for each command's description and argument hint, read by both the build and pin script. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:10]
- The actual corpus metadata file stores `description` and `argumentHint` per command, for example `craft`, `audit`, and `polish`. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:2] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:3] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:4] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:30] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:31] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:32] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:78] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:79] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:80]
- The corpus also documents generated provider output as generated artifacts and requires `bun run build` after skill, transformer, site count, or provider behavior changes. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:117] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable-main/CLAUDE.md:121]

Buildable recommendation:

- Add `scripts/design-command-surface-check.mjs` or fold the check into the existing skill-benchmark harness. Minimum checks:
  - parse `.opencode/skills/sk-design/command-metadata.json`;
  - parse `.opencode/commands/design/*.md` frontmatter;
  - parse `.opencode/skills/sk-design/mode-registry.json`;
  - assert wrapper frontmatter, owner modes, aliases, and output/status fields are synchronized;
  - run fixture prompts against command aliases and require deterministic command/mode selection.
- Add fixtures for stale description, stale argument hint, missing command record, missing wrapper, duplicate alias, bad owner mode, and a command that should defer to hub routing.

Enforceability:

- ENFORCEABLE: the source metadata and wrapper projection are file-level facts, so drift can block in CI.
- ENFORCEABLE: a fixture corpus can deterministically replay command alias routing and fail when an alias maps to the wrong owner mode or bypasses the hub's smallest-useful-mode rule.
- ADVISORY: deciding the best user-facing aliases remains product language work unless backed by real command usage data.

## Questions Answered

- Q1: `/design:*` metadata should derive from a single command-surface source rather than from hand-edited wrapper frontmatter. The best fit is a sibling `command-metadata.json` that points to `mode-registry.json` mode keys.
- Q1/Q5: `mode-registry.json` should stay routing/advisor metadata. Command metadata should own command descriptions, argument hints, aliases, accepted inputs, return shape, next-command hints, and proof/status fields.
- Q5: The enforceable layer is schema validation, wrapper-frontmatter parity, mode-key parity, alias uniqueness, and fixture replay. The advisory layer is the editorial wording and whether an alias deserves promotion before usage data exists.

## Questions Remaining

- Should hub frontmatter keywords be generated from `mode-registry.json` plus `command-metadata.json`, or should they remain a broad advisor-only compatibility surface checked only for required inclusions?
- Should command metadata include generated wrapper body templates, or only frontmatter plus machine-readable fields while the markdown body stays a stable generic bridge?
- Which exact fixture runner should own command alias replay: a new `design-command-surface-check.mjs`, or an extension of the deep-improvement skill-benchmark scripts?

## Next Focus

Continue D2 by defining the smallest command-surface schema that covers mode commands, task projections, register policy, lifecycle handoff, and proof/status fields without flattening packet-owned design logic into command wrappers.

Assessment: newInfoRatio 0.62. This iteration answered the command metadata home and validation path with direct evidence from the live wrappers and the `impeccable-main` source-first pattern. It builds on iterations 12-14 rather than replacing them.
