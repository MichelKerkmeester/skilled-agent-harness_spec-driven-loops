# METADATA

- Iteration: 1 of 5
- Focus dimension: Dimension 1 - Cross-file consistency
- Executor: cli-codex / gpt-5.5 / high reasoning / fast tier
- Spec folder: `specs/skilled-agent-orchestration/070-sk-deep-rename`
- Review target write boundary: source/read-only; wrote only this iteration artifact and `review/deltas/iter-001.jsonl`

# SUMMARY

Found 1 new finding: 0 P0, 1 P1, 0 P2. The active command, skill, agent, runtime mirror, root-doc, config, and sampled active-spec references use `deep-review` / `deep-research`; the only illegitimate old-name residue found in this pass is two active `.opencode/changelog/` symlinks that still use and target `sk-deep-*`.

# P0 FINDINGS

None.

# P1 FINDINGS

## P1-001 - Active changelog symlinks still use old skill names and point at missing old skill folders

- Evidence:
  - `.opencode/changelog/sk-deep-review:1` -> `../skill/sk-deep-review/changelog`
  - `.opencode/changelog/sk-deep-research:1` -> `../skill/sk-deep-research/changelog`
- Why this is a cross-file consistency issue: these are active filesystem entries outside the allowed historical/snapshot/changelog `v*.md` list. The symlink names still expose `sk-deep-review` and `sk-deep-research`, and their targets resolve to old skill folders that no longer exist.
- Impact: changelog discovery through `.opencode/changelog/<skill>` will fail for both renamed skills, while the actual changelog directories now exist at `.opencode/skills/deep-review/changelog` and `.opencode/skills/deep-research/changelog`.
- Concrete fix: replace the two old symlinks with `.opencode/changelog/deep-review -> ../skill/deep-review/changelog` and `.opencode/changelog/deep-research -> ../skill/deep-research/changelog`.

# P2 FINDINGS

None.

# POSITIVE OBSERVATIONS

- Command entrypoints and YAML workflows use the new names: `.opencode/commands/spec_kit/deep-review.md:35`, `.opencode/commands/spec_kit/deep-research.md:33`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:56`, and `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:67`.
- Canonical OpenCode agents and runtime mirrors use the new names: `.opencode/agents/deep-review.md:2`, `.opencode/agents/deep-research.md:2`, `.claude/agents/deep-review.md:2`, `.claude/agents/deep-research.md:2`, `.codex/agents/deep-review.toml:9`, `.codex/agents/deep-research.toml:9`, `.gemini/agents/deep-review.md:2`, and `.gemini/agents/deep-research.md:2`.
- Canonical skills use the new names and paths: `.opencode/skills/deep-review/SKILL.md:2`, `.opencode/skills/deep-research/SKILL.md:2`, `.opencode/skills/deep-review/references/quick_reference.md:14`, and `.opencode/skills/deep-research/references/quick_reference.md:14`.
- Active `.opencode/specs/` outside Packet 070 and outside `z_archive/` had zero `sk-deep-review` / `sk-deep-research` hits in this pass.

# DIMENSION COVERAGE

Reviewed 40 sampled files plus broad old-name greps and filename scans.

Sampled files with old/new counts:

| Area | Files sampled | Result |
| --- | ---: | --- |
| `.opencode/skills/` | 10 | 0 old-name hits; sampled deep-loop and related skills use new names where referenced |
| `.opencode/agents/` | 4 | 0 old-name hits; `deep-review` / `deep-research` canonical agents use new names |
| `.opencode/commands/spec_kit/` | 6 | 0 old-name hits; command docs and auto/confirm YAML use new names |
| `.opencode/specs/` active packets | 7 | 0 old-name hits in sampled non-070 active specs |
| `.claude/agents/` | 3 | 0 old-name hits |
| `.codex/agents/` | 3 | 0 old-name hits |
| `.gemini/agents/` | 3 | 0 old-name hits |
| Root/config | 4 | 0 old-name hits in `README.md`, `AGENTS.md`, `CLAUDE.md`, `opencode.json` |

Broad checks executed:

- Text grep over `.opencode/skill`, `.opencode/agent`, `.opencode/commands/spec_kit`, `.claude/agents`, `.codex/agents`, `.gemini/agents`, `README.md`, `AGENTS.md`, `CLAUDE.md`, and `opencode.json`: no old-name hits.
- Active `.opencode/specs` grep excluding `z_archive/`, `runs/`, and `070-sk-deep-rename/`: no old-name hits.
- Filename scan over `.opencode/skill`, `.opencode/agent`, `.opencode/commands/spec_kit`, `.claude/agents`, `.codex/agents`, and `.gemini/agents`: no old-name filenames.
- Broader filename scan over `.opencode`, `.claude`, `.codex`, and `.gemini` excluding archive/run/pre-promote paths surfaced only the two active `.opencode/changelog/sk-deep-*` symlinks plus allowed archived/Packet 070 paths.

Legitimate preserved old-name references observed:

- Packet 070 parent/source-side rename narrative and metadata, including `spec.md`, `description.json`, `graph-metadata.json`, and `resource-map.md`.
- Packet 070 Phase 001 inventory artifacts, including `inventory.md`, `inventory.tsv`, and `edge-cases.md`.
- Packet 070 Phase 006 advisor/validation docs, which intentionally restore source-side old-name narrative.
- Archived specs and run outputs under `z_archive/` and `runs/`, which are outside active source scope.

# NEXT ITERATION RECOMMENDATIONS

- Iteration 2 should prioritize advisor + skill graph integrity, but include a small follow-up check for changelog discovery surfaces because P1-001 is outside the skill graph itself yet still affects renamed-skill discoverability.
- Probe whether any tooling expects `.opencode/changelog/<skill-name>` symlinks to exist for every skill; if yes, P1-001 should be fixed before final sign-off.
