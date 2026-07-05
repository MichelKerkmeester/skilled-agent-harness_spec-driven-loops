# Iteration 7: Generated, Mirrored, and Historical Cleanup Boundaries

## Focus
This iteration classified cleanup boundaries for generated artifacts, runtime mirrors, active docs, historical/archived material, and false positives around standalone `deep-context` deprecation. The selected interpretation was artifact ownership: source-of-truth files should be edited or deprecated in place, generated files should be regenerated, runtime mirrors should be synchronized from the canonical source, retired packet internals should be archived rather than line-edited, historical specs should remain history, and generic `context` references should be filtered out.

## Findings
1. **Public docs and active command source are deprecate-in-place surfaces, not generated cleanup.** Root `README.md` still has a dedicated Deep Context section, says `/deep:context` runs `@deep-context`, and lists Deep Context in the command catalogue; `AGENTS.md` still uses `/deep:context` as a named-workflow example and quick-reference route. These should receive replacement/deprecation wording directly, because they are active operator-facing docs. [SOURCE: README.md:841] [SOURCE: README.md:843] [SOURCE: README.md:844] [SOURCE: README.md:1035] [SOURCE: README.md:1036] [SOURCE: README.md:1157] [SOURCE: AGENTS.md:28] [SOURCE: AGENTS.md:450]
2. **Compiled command contracts are regenerate-only boundaries.** `.opencode/commands/deep/assets/compiled/deep_context.contract.md` identifies itself as the compiled `/deep:context` contract and embeds source paths for `deep_context_presentation.txt`, `deep_context_auto.yaml`, `deep_context_confirm.yaml`, the nested `deep-context` skill packet, templates, and the OpenCode agent; cleanup should edit the source assets and then regenerate the compiled contract rather than hand-editing compiled output. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:4] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:29] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:44] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:74] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:87]
3. **Runtime agent mirrors are mirror-sync boundaries.** The `deep-context` skill explicitly declares `.opencode/agents/deep-context.md` as canonical and `.claude/agents/deep-context.md` as a mirror, while both OpenCode and Claude `deep-loop` / `orchestrate` agents still list `/deep:context` and `@deep-context`; any deprecation/stub update must be made canonically and mirrored, not edited in only one runtime tree. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:283] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:284] [SOURCE: .opencode/agents/deep-loop.md:40] [SOURCE: .claude/agents/deep-loop.md:27] [SOURCE: .opencode/agents/orchestrate.md:74] [SOURCE: .claude/agents/orchestrate.md:63] [SOURCE: .opencode/agents/deep-context.md:35] [SOURCE: .claude/agents/deep-context.md:17]
4. **Dedicated `deep-context` packet docs, feature catalogs, manual playbooks, and behavior benchmarks are archive-only after a replacement path exists.** The packet README, SKILL, behavior benchmark, and scripts README are internally consistent standalone-loop documentation for `/deep:context`, Context Report synthesis, and host-written context artifacts; once the public route redirects, these internals should move behind archive/deprecation banners instead of being individually rewritten to pretend the retired loop still exists. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:12] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:267] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/README.md:25] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/README.md:27] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/README.md:39] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/README.md:209] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:4] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:5] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:19] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/scripts/README.md:11] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/scripts/README.md:55]
5. **Sibling-loop and hub docs are deprecate-in-place replacement-guidance surfaces.** The hub README still lists `deep-context/` among the five mode packets and says `/deep:*` commands keep their names; `deep-research`, `deep-review`, `deep-ai-council`, and `deep-improvement` READMEs still describe `deep-context` as the inward-code mapping step. These should be edited in place to point at the replacement capability in `deep-research`/`deep-review` rather than archived, because the sibling docs remain live. [SOURCE: .opencode/skills/deep-loop-workflows/README.md:81] [SOURCE: .opencode/skills/deep-loop-workflows/README.md:86] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/README.md:41] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/README.md:108] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/README.md:116] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/README.md:41] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/README.md:112] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/README.md:114] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/README.md:123] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/README.md:134] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/README.md:132] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/README.md:133]
6. **Archived specs, descriptions, and retired skill archives are leave-as-history/archive-only, not cleanup targets.** Prior spec packets record past `/deep:context` path updates and decisions, and the retired Codex skill archive lists `deep-context` as a historical analysis lane; these records should not be swept just to remove mentions, except for explicit archive labels if an archive policy requires them. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-sk-prompt-models-rename/004-commands-scripts-data/description.json:4] [SOURCE: .opencode/specs/skilled-agent-orchestration/121-sk-prompt-models-rename/004-commands-scripts-data/implementation-summary.md:47] [SOURCE: .opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/001-rename-fix-and-shared-decision/spec.md:57] [SOURCE: .opencode/specs/deep-loops/036-command-contract-compiler/001-contract-compiler-design/design-expansion.md:160] [SOURCE: .opencode/skills/z_archive/cli-codex-retired/README.md:128]
7. **Tests and fixtures split into active rewrite versus false-positive buckets.** The active deep-improvement skill-benchmark fixture still asserts `mode: "context"`, `advisorLane: "deep-context"`, and `context/context-report.md`, so it must be rewritten or retired with the route; by contrast, generic `context_loading_contract.md` and `contextManifestDigest` fixture hits are unrelated sk-design context payloads and are false positives for standalone `deep-context` cleanup. No `.codex/**` surfaces were found in this workspace. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/dlw-context-001.private.json:2] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/dlw-context-001.private.json:5] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/dlw-context-001.private.json:6] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/dlw-context-001.private.json:21] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/dlw-context-001.public.json:5] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:52] [INFERENCE: based on `.codex/**` Glob returning no files]

## Ruled Out
- A whole-repo `deep-context` sweep was not retried because strategy marks broad whole-repo sweeps as blocked; this pass used the dispatcher-provided surface classes and targeted searches. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:90]
- Hand-editing compiled command contracts was ruled out because the compiled contract lists source assets and packet inputs; source changes should regenerate compiled output. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24]
- Sweeping historical spec packets was ruled out because they are records of prior decisions and implementation history rather than live command/docs surfaces. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-sk-prompt-models-rename/004-commands-scripts-data/implementation-summary.md:47]

## Dead Ends
- Treating every `context` substring as standalone `deep-context` cleanup is a dead end; active sk-design fixture references to `context_loading_contract.md` and `contextManifestDigest` are unrelated false positives. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:52]
- Treating runtime mirrors as independent cleanup targets is a dead end; the skill declares OpenCode canonical plus Claude mirror and requires sync. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:283] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:284]

## Edge Cases
- Ambiguous input: “cleanup boundaries” could mean exact per-file deletion list or artifact-ownership policy. This iteration chose the narrower evidence-backed ownership policy and defers exact file-by-file edits.
- Contradictory evidence: none found; evidence consistently shows active public docs/fixtures alongside historical archives.
- Missing dependencies: no `.codex/**` surfaces were present; this is recorded as absence, not proof that no external Codex mirror exists outside this workspace. [INFERENCE: based on `.codex/**` Glob returning no files]
- Partial success: broad Grep output for command, skill, and spec trees truncated after many matches, so this iteration classifies categories and representative anchors rather than producing an exhaustive edit checklist.

## Sources Consulted
- README.md:841
- README.md:843
- README.md:844
- README.md:1035
- README.md:1036
- README.md:1157
- AGENTS.md:28
- AGENTS.md:450
- .opencode/commands/deep/assets/compiled/deep_context.contract.md:4
- .opencode/commands/deep/assets/compiled/deep_context.contract.md:14
- .opencode/commands/deep/assets/compiled/deep_context.contract.md:24
- .opencode/commands/deep/assets/compiled/deep_context.contract.md:29
- .opencode/commands/deep/assets/compiled/deep_context.contract.md:44
- .opencode/commands/deep/assets/compiled/deep_context.contract.md:74
- .opencode/commands/deep/assets/compiled/deep_context.contract.md:87
- .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279
- .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:283
- .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:284
- .opencode/agents/deep-loop.md:40
- .claude/agents/deep-loop.md:27
- .opencode/agents/orchestrate.md:74
- .claude/agents/orchestrate.md:63
- .opencode/agents/deep-context.md:35
- .claude/agents/deep-context.md:17
- .opencode/skills/deep-loop-workflows/deep-context/README.md:25
- .opencode/skills/deep-loop-workflows/deep-context/README.md:209
- .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:4
- .opencode/skills/deep-loop-workflows/README.md:81
- .opencode/skills/deep-loop-workflows/deep-research/README.md:41
- .opencode/skills/deep-loop-workflows/deep-review/README.md:112
- .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/dlw-context-001.private.json:5
- .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18
- .opencode/specs/skilled-agent-orchestration/121-sk-prompt-models-rename/004-commands-scripts-data/description.json:4
- .opencode/skills/z_archive/cli-codex-retired/README.md:128
- `.codex/**` Glob result: no files found

## Assessment
- New information ratio: 0.89
- Questions addressed:
  - Which references are active runtime behavior versus generated metadata, tests/fixtures, mirrors, historical archives, or false positives?
  - Which cleanup steps are safe now, which should be staged as redirect/archive, and which internal runtime cleanup should be deferred behind tests?
- Questions answered:
  - Generated command contracts should be regenerated, not edited directly.
  - Runtime mirrors require mirror-sync from canonical OpenCode agent changes.
  - Historical specs and archives should largely remain history, while active docs/fixtures need deprecation or replacement edits.

## Reflection
- What worked and why: Targeted Grep over the dispatcher-named surfaces worked because the cleanup distinction is encoded in paths and document ownership markers: compiled assets, mirrors, live READMEs, packet internals, fixtures, and archives all reveal different maintenance contracts.
- What did not work and why: Treating grep output as an exhaustive edit list did not work because command/skill/spec trees contain more matches than a single iteration can inspect without repeating the blocked whole-repo sweep pattern.
- What I would do differently: Run a fixture/test-focused pass next, using exact test and generated-contract paths rather than all documentation trees, to turn the active rewrite bucket into a concrete validation checklist.

## Recommended Next Focus
Classify tests, fixtures, and validation gates that must change when `/deep:context` becomes a redirect/stub: command-contract compiler tests, skill-benchmark fixtures, deep-loop-runtime context branches, behavior-benchmark retirement, and any CI/index refresh steps that prove generated artifacts and mirrors are synchronized.
