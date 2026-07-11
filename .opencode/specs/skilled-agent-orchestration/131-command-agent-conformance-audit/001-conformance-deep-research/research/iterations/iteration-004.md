# Iteration 4: Non-Doctor Command Contract Parity

## Focus

Determine whether command workflow YAMLs and presentation contracts outside `/doctor` match their command Markdown and compiled contracts field by field.

## Actions Taken

1. Inventoried the non-doctor command Markdown, workflow YAML, presentation text, and deep compiled-contract surfaces.
2. Searched those surfaces for mode, flag, executor, runtime-path, MCP-namespace, and retired-topology drift.
3. Compared all three checked-in deep compiled contracts byte-for-byte with fresh read-only compiler output.
4. Read the highest-signal command, presentation, YAML, compiler, and generated-contract sections directly before classifying findings.

## Findings

### Commands

#### P1: Deep executor selectors contain a duplicated `cli-opencode` branch and erased executor text

The research and review presentations each declare the executor enum as `native | cli-opencode | cli-claude-code | cli-opencode`, then offer both B and D as `cli-opencode`; B contains the malformed command text `` ` exec` ``. Their executor-hint suppression text also contains an empty literal between `cli-opencode` and `gpt-5.4`. AI Council repeats the same duplicated executor in its flag enum and Q4, where B is `cli-opencode - one external  round` and D is the actual OpenCode route. The compiler copies these defects into all three checked-in contracts, so interactive selection can map a user answer to an indistinguishable or malformed executor route. [SOURCE: .opencode/commands/deep/assets/deep_research_presentation.txt:91] [SOURCE: .opencode/commands/deep/assets/deep_research_presentation.txt:133] [SOURCE: .opencode/commands/deep/assets/deep_research_presentation.txt:151-155] [SOURCE: .opencode/commands/deep/assets/deep_review_presentation.txt:116] [SOURCE: .opencode/commands/deep/assets/deep_review_presentation.txt:160] [SOURCE: .opencode/commands/deep/assets/deep_review_presentation.txt:190-194] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_presentation.txt:105] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_presentation.txt:143-147] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:248] [SOURCE: .opencode/commands/deep/assets/compiled/deep_review.contract.md:267] [SOURCE: .opencode/commands/deep/assets/compiled/deep_ai-council.contract.md:368]

Concrete fix: remove the erased/duplicate executor branch, normalize research/review to exactly `native | cli-opencode | cli-claude-code`, normalize Council to `active-runtime | cli-opencode | cli-claude-code`, repair Q-Exec labels and examples, then regenerate all three compiled contracts.

#### P1: Twelve create-workflow YAMLs resolve the OpenCode agent directory to the nonexistent singular `.opencode/agent`

The active runtime directory is `.opencode/agents/`, but 12 auto/confirm assets use `runtime_agent_path_resolution.default: .opencode/agent`. This affects agent, changelog, feature-catalog, manual-testing-playbook, README, and skill workflows and can make their runtime-agent prerequisite checks inspect a path that does not exist. Representative evidence is present in both halves of the agent and README pairs; the same exact value occurs in all 12 files. [SOURCE: .opencode/commands/create/assets/create_agent_auto.yaml:44-45] [SOURCE: .opencode/commands/create/assets/create_agent_confirm.yaml:45-46] [SOURCE: .opencode/commands/create/assets/create_readme_auto.yaml:82-83] [SOURCE: .opencode/commands/create/assets/create_readme_confirm.yaml:77-78] [SOURCE: .opencode/commands/create/assets/create_skill_auto.yaml:47-48] [SOURCE: .opencode/commands/create/assets/create_skill_confirm.yaml:47-48]

Concrete fix: replace every `runtime_agent_path_resolution.default: .opencode/agent` with `.opencode/agents`, then add a validator that requires declared runtime directories to exist.

#### P2: Deep command frontmatter under-declares flags accepted by its presentation contract

`/deep:research` omits `--spec-folder`, `--no-resource-map`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, and per-lineage `--iters` from its argument hint even though the presentation parses them. `/deep:review` similarly omits `--no-resource-map`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, and `--iters`. `/deep:ai-council` advertises no executor flags despite parsing `--executor-mode`, `--executor`, `--model`, `--reasoning-effort`, `--service-tier`, and `--executor-timeout`. This makes command discovery disagree with the rendered operational contract even though runtime parsing may still accept the flags. [SOURCE: .opencode/commands/deep/research.md:3] [SOURCE: .opencode/commands/deep/assets/deep_research_presentation.txt:87-101] [SOURCE: .opencode/commands/deep/review.md:3] [SOURCE: .opencode/commands/deep/assets/deep_review_presentation.txt:109-127] [SOURCE: .opencode/commands/deep/ai-council.md:4] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_presentation.txt:98-109]

Concrete fix: generate or validate each command's `argument-hint` from the same typed flag inventory used by its presentation/compiler definition, including supported per-executor subflags.

#### P2: README workflow assets retain a dead router filename and a copy-pasted verification field

Both README YAMLs say setup is determined by `folder_readme.md`, but the live router is `create/readme.md`; no `folder_readme.md` command asset exists. The README presentation also stores `create_agent_verified = true`, which belongs to the agent command rather than README verification. These do not change the selected YAML by themselves, but they make the field-level handoff contract internally false and encourage future executors or validators to bind the wrong state name. [SOURCE: .opencode/commands/create/readme.md:7] [SOURCE: .opencode/commands/create/assets/create_readme_auto.yaml:37] [SOURCE: .opencode/commands/create/assets/create_readme_confirm.yaml:9] [SOURCE: .opencode/commands/create/assets/create_readme_confirm.yaml:40] [SOURCE: .opencode/commands/create/assets/create_readme_presentation.txt:18-20]

Concrete fix: replace `folder_readme.md` with `.opencode/commands/create/readme.md` (or the presentation contract where setup is actually owned) and rename the verification field to `create_readme_verified` consistently.

### Doctor

Not investigated in this iteration by focus lock; iteration 2 owns the doctor audit.

### Agents

Not investigated in this iteration by focus lock; iteration 3 owns the agent mirror audit.

### Cross-Surface

The deep compiler is deterministic against current sources, but deterministic generation currently propagates presentation defects rather than detecting semantic duplication. Fresh read-only compiler output matched `deep_research.contract.md`, `deep_review.contract.md`, and `deep_ai-council.contract.md` byte-for-byte. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:654-659] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:695-710]

Concrete fix: add semantic validation before rendering, including unique executor enums, non-empty executor command labels, and command-frontmatter flag coverage.

## Questions Answered

- No, non-doctor command YAMLs and presentations are not fully aligned with command Markdown and compiled contracts field by field.
- The three deep compiled contracts are current relative to their compiler inputs; their defects originate in current presentation/source definitions rather than stale generated files.
- Auto/confirm asset existence is complete for the inspected create, design, speckit, and deep routed command families; the high-signal defects are semantic parity failures, not missing paired assets.

## Questions Remaining

- Which remaining router-level allowed tools are unused overgrants after route-specific reconciliation?
- Do any additional presentation fields use copy-pasted state names that disagree with their command family?
- Which command-to-skill and command-to-agent references remain dead after excluding the already confirmed design transport routes?

## Sources Consulted

- `.opencode/commands/**/*.md`
- `.opencode/commands/**/*.yaml`
- `.opencode/commands/**/*.txt`
- `.opencode/commands/deep/assets/compiled/*.contract.md`
- `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

## Assessment

- `newInfoRatio`: 0.76
- Novelty justification: the iteration confirmed the seeded compiled-contract linkage class and added three adjacent, mechanically repeated parity defects across deep and create command families.
- Confidence: high for cited occurrences and compiler parity; medium for runtime impact where YAML fields are interpreted by an LLM rather than a typed loader.

## Reflection

- Worked: inventory-wide exact-token searches followed by direct reads exposed repeated copy/paste classes efficiently.
- Failed: the first read-only compiler comparison used zsh's reserved `status` variable; rerunning with `rc` resolved it without repository writes.
- Ruled out: checked-in deep contracts are not stale relative to current compiler inputs; confirm-only comments in confirm YAMLs do not contradict the existence of separate auto YAMLs.

## Next Focus

Audit remaining cross-surface command-to-skill, command-to-agent, and allowed-tool references, emphasizing dead references and unused router overgrants not covered by iterations 1-4.
