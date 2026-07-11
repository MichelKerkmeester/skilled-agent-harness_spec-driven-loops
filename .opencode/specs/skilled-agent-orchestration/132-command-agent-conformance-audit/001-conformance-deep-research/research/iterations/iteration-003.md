# Iteration 3: Claude/OpenCode Agent Mirror Alignment

## Focus

Audit all 12 `.claude/agents/*.md` and `.opencode/agents/*.md` mirror pairs for body synchronization, runtime localization, coherent tool/frontmatter contracts, live agent-directory references, and current skill/model references. README files remain out of scope.

## Actions Taken

1. Enumerated both runtime directories and confirmed that each contains the same 12 named agent Markdown files.
2. Diffed both directories, then mechanically normalized frontmatter and `.claude/agents` versus `.opencode/agents` path tokens to isolate substantive body drift.
3. Searched all 24 definitions for runtime-directory references, current/retired skill paths, model/executor names, and permission declarations.
4. Checked every literal backticked `.opencode/skills/**` path in the agent bodies for filesystem existence, excluding line-suffix notation and dynamic placeholders.
5. Compared the deep-research leaf write boundary with the workflow-owned three-artifact iteration contract.

## Findings

### P1 - [cross-surface] Deep-research leaf forbids a workflow-required delta artifact

The OpenCode leaf allows only the iteration narrative, state-log append, optional progressive synthesis, and idea files; `research/deltas/iter-NNN.jsonl` is absent from the allowlist. The Claude mirror has the same omission. The workflow prompt contract independently requires the delta file as artifact 3 and declares the iteration invalid when it is absent. [SOURCE: .opencode/agents/deep-research.md:69-73] [SOURCE: .claude/agents/deep-research.md:52-56] [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt_pack_iteration.md.tmpl:43-71]

Impact: a conforming leaf must either violate its own hard scope lock or fail every current three-artifact dispatch. This iteration itself is possible only because the command-owned dispatch explicitly requires the delta write.

Concrete fix: add the packet-local `research/deltas/iter-NNN.jsonl` write-once target to both deep-research agent allowlists and to their pre-write path checks; keep registry, strategy, and dashboard reducer-owned.

### P1 - [agents/cross-surface] Claude frontmatter policy is split and the authoring skill does not distinguish runtime schemas

Eleven Claude definitions use standalone `tools:` frontmatter, while `.claude/agents/deep-improvement.md` alone is byte-aligned with the OpenCode `mode`/`temperature`/`permission` block. Meanwhile `create-agent` maps both OpenCode and Claude directories but declares unified `permission:` canonical and standalone `tools:` deprecated without a runtime-specific branch. [SOURCE: .claude/agents/deep-improvement.md:1-20] [SOURCE: .claude/agents/deep-research.md:1-5] [SOURCE: .claude/agents/orchestrate.md:1-5] [SOURCE: .opencode/skills/sk-doc/create-agent/SKILL.md:55-61] [SOURCE: .opencode/skills/sk-doc/create-agent/SKILL.md:71-106]

Impact: permission behavior depends on which of two incompatible conventions the Claude runtime actually consumes; generated or synchronized agents can silently lose grants or carry unenforced policy.

Concrete fix: make `create-agent` select and validate an explicit frontmatter schema per runtime, then normalize all 12 Claude definitions to the verified Claude schema. Do not preserve the current one-versus-eleven split.

### P1 - [agents/cross-surface] Six live agent bodies advertise an absent Codex agent mirror

The `.codex/agents` directory has no files, but each runtime's `orchestrate`, `deep-review`, and `prompt-improver` definition treats it as a live profile or packaging surface. This is adjacent to the known README defect and affects executable agent guidance, not README prose. [SOURCE: .claude/agents/orchestrate.md:21] [SOURCE: .claude/agents/deep-review.md:277] [SOURCE: .claude/agents/prompt-improver.md:52] [SOURCE: .opencode/agents/orchestrate.md:32] [SOURCE: .opencode/agents/deep-review.md:294] [SOURCE: .opencode/agents/prompt-improver.md:67]

Impact: Codex profile resolution and mirror inspection route to files that do not exist; agents can claim parity or load a mirror that cannot be read.

Concrete fix: either generate and validate the promised `.codex/agents/*.toml` inventory for all supported agents, or remove Codex-agent-directory routing and mirror claims from all six bodies until that surface exists. Preserve legitimate Codex model-benchmark/executor references.

### P2 - [agents] Two Claude mirrors retain the OpenCode path convention

The seeded `.claude/agents/deep-research.md` localization miss is confirmed, and the same defect exists in `.claude/agents/markdown.md`. Both instruct Claude to use `.opencode/agents/*.md`; the other localized Claude mirrors point to `.claude/agents/*.md`. [SOURCE: .claude/agents/deep-research.md:11] [SOURCE: .claude/agents/markdown.md:11] [SOURCE: .claude/agents/context.md:13]

Impact: Claude-side self-reference and agent-definition lookup can cross runtime boundaries despite the stated choose-one-runtime convention.

Concrete fix: change both Claude path-convention lines to `.claude/agents/*.md`; leave shared `.opencode/skills/**` references unchanged because skills remain rooted there.

### Ruled Out

- No broad body-sync defect: after stripping runtime-specific frontmatter and normalizing `.claude/agents`/`.opencode/agents` path tokens, 11 pairs are identical. `orchestrate.md` has one additional Claude-only canonical-source clarification at line 798; it is coherent localization, not accidental drift. [SOURCE: .claude/agents/orchestrate.md:798] [SOURCE: .opencode/agents/orchestrate.md:806]
- No dead literal skill path was confirmed in the 24 agent bodies. The only mechanical warning was `.opencode/skills/sk-code/SKILL.md:62`, where `:62` is a source-line suffix rather than part of the filesystem path. [SOURCE: .claude/agents/code.md:429] [SOURCE: .opencode/agents/code.md:444]
- No stale hard-coded model identifier was found. Codex tokens in `deep-improvement.md`, `prompt-improver.md`, and `orchestrate.md` were not treated as retired `cli-codex` residue.
- No P0 finding was identified in this focus area.

## Questions Answered

- Are all 12 mirror pairs body-synced? Substantially yes after expected runtime localization: 11 normalize exactly, and the only remaining `orchestrate` body delta is intentional. Four contract/localization defects remain around the bodies and frontmatter.
- Are runtime path self-references correct? No. Two Claude definitions point to the OpenCode agent directory, and six definitions point to an absent Codex agent directory.
- Are current skill/model references coherent? Literal current skill paths resolve after excluding line annotations and placeholders; no stale hard-coded model reference was confirmed. The deep-research agent-to-workflow artifact contract is not coherent.
- Are tool grants coherent? Not conclusively: the Claude inventory and `create-agent` authoring contract disagree on the canonical frontmatter model, leaving one outlier against eleven legacy-style definitions.

## Questions Remaining

- Which frontmatter schema does the installed Claude runtime enforce for `.claude/agents/*.md`, and should `create-agent` emit different schemas for Claude and OpenCode?
- Is `.codex/agents` intended to be restored as a generated mirror in a later phase, or should all live agent-directory claims be removed now?
- Do all command workflow YAMLs and presentations outside `/doctor` match command Markdown and compiled contracts field by field?
- Which remaining router-level allowed tools are unused overgrants after route-specific reconciliation?

## Next Focus

Mechanically compare all non-doctor command Markdown files against their workflow/route YAML, presentation text, and compiled contracts for mode, flag, asset-link, allowed-tool, and MCP namespace parity.

## Assessment

- `newInfoRatio`: 0.82
- Status: `complete`
- Novelty justification: the iteration confirmed one seeded localization defect but added an adjacent localization miss, a six-body absent-runtime reference class, a cross-surface Claude frontmatter-policy split, and a workflow-blocking deep-research delta contradiction; normalized-body and skill/model checks also ruled out broader drift.
- Confidence: high for filesystem/path and body-sync claims; medium for the runtime effect of Claude frontmatter until the installed Claude schema is tested directly.
