# Iteration 3: The Post-Tag Window and the Verified Current Inventory

## Focus

The dispatch focus was a stale copy of iteration 1's carried-forward residual ("read the v4.0.1.0 and v4.0.2.0 release notes, obtain a bounded diff measurement for `v4.0.0.0..v4.0.1.0`, confirm which spec packets closed in each range"). Iteration 2 completed all three parts and recorded Q1 as answered in the state log, so repeating them would spend an iteration on work already on disk.

Interpretation chosen: close Q1's last genuinely unmeasured slice — the commits on `main` after `v4.0.2.1`, which the topic weights most and which no prior iteration measured by file — and then open Q2 with the counts a README actually has to state, verified against the tree rather than against a changelog. Deferred: the full Q2 inventory (MCP, Code Mode, doctor commands, per-runtime CLI executors), which needs its own iteration.

The ambiguity is recorded rather than resolved silently: the strategy's Next Focus section still names Q1 residual because the reducer had not refreshed it, while the strategy's own §3 key-questions list already carries Q1 as `[x]` and §6 ANSWERED QUESTIONS already lists it.

## Actions Taken

1. `git log --oneline v4.0.2.1..HEAD | wc -l` and `git diff --shortstat --no-renames v4.0.2.1..HEAD` — post-tag commit count and change scale.
2. `git diff --numstat --no-renames v4.0.2.1..HEAD | awk` — aggregated files, insertions and deletions per top-level path (and per two-segment path under `specs/` and `.skilled/`), ranked by file count.
3. `git diff --numstat --no-renames v4.0.2.1..HEAD -- specs/hooks-plugins-extensions | sort -k1,1 -rn | head -6` — located the source of the post-tag insertion mass.
4. `git diff --no-renames v4.0.2.1..HEAD -- README.md` — read the README's entire post-tag change (three hunks).
5. `git diff --numstat --no-renames v4.0.2.1..HEAD -- .skilled/scripts` — named the files the hook cleanup deleted.
6. Directory sweep: counted `.skilled/skills/*/` directories and, per skill, the presence of `SKILL.md`, `ROUTER.md` and `mode-registry.json`.
7. `node -e` over every `mode-registry.json` — discovered the registry shape (`modes` is an object keyed by numeric index, not the `workflowModes` field) and counted modes per hub.
8. Counted `.skilled/commands/**/*.md` (depth 3) and `.skilled/agents/*.md` (depth 1).
9. `ls -d` over the eight runtime folders plus `.hermes` — established which runtime roots exist on disk.
10. `ls -d .skilled/hooks/*/` — listed the 27 hook cores to test the README's rewritten core list against the tree.

## Findings

1. **The post-tag window is 38 commits, 2,111 files changed, 576,916 insertions and 81,318 deletions — and roughly 83% of those insertions are two scratch patch dumps, not shipped change.** `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite/scratch/pre-phase4.patch` alone is 202,831 added lines and `.../003-literal-hook-renames/scratch/pre-phase3.patch` is 196,912, together 399,743 of the 576,916. A README that quotes a post-tag diffstat is quoting research scaffolding. [INFERENCE: `git diff --shortstat --no-renames v4.0.2.1..HEAD` plus the per-file `--numstat` ranking, Actions Taken 1-3]

2. **The post-tag change set is dominated by spec packets, not framework code: `specs/hooks-plugins-extensions` is 1,075 files with 480,845 insertions, `specs/cli-external-orchestration` 429 files, and `specs/agents` 15 files.** Only three framework surfaces moved at all: `.skilled/hooks` (378 files, 19,945 insertions, 18,836 deletions), `.skilled/skills` (118 files, 57,589 insertions, 54,865 deletions) and `.skilled/commands` (6 files). Every runtime adapter folder moved 18 files or fewer. [INFERENCE: `--numstat` aggregation per top-level path, Actions Taken 2]

3. **`README.md` changed exactly three lines after the `v4.0.2.1` tag, and all three are the hook-library cleanup propagating into prose.** The changes add Pi and OpenCode to the history-lookup sender list, split the session-handover README link into `state-files.md`, `runtime-behavior.md` and `troubleshooting.md`, and rewrite the hook-core name list. The README has been maintained against the cleanup; it has not been neglected. [SOURCE: README.md:537] [SOURCE: README.md:1080] [SOURCE: README.md:1163] [INFERENCE: `git diff --no-renames v4.0.2.1..HEAD -- README.md`, Actions Taken 4]

4. **The README's rewritten hook-core list now matches the tree exactly: 27 names for 27 directories.** The listed cores are `goal`, `cli-dispatch`, `decision-capture`, `spec-gate`, `completion-evidence`, `mcp-route-guard`, `overlay-guard`, `env-secret-guard`, `permission-policy`, `post-edit-quality`, `classifier-injection-screen`, `ask-surface-guard`, the six git cores `git-hooks-check`, `git-preflight`, `git-message-gate`, `git-live-follow`, `git-primary-reconcile`, `git-worktree-guard`, and `session-cleanup`, `session-lifecycle`, `session-handover`, `skill-advisor`, `subagent-dispatch-guard`, `directive-lifecycle`, `dist-freshness`, `codex-global-hooks-check`, plus `shared`. The pre-cleanup names (`dispatch`, `completion`, `ask-surface`, `task-dispatch`, `codex-watchdog`, and a `git` core plus `hook-install`) are gone from both the README and the disk. This section is a negative result for Q4: it is current, and a rewrite should not "fix" it. [SOURCE: README.md:1163] [INFERENCE: `ls -d .skilled/hooks/*/` returning 27 entries matching the 27 listed names, Actions Taken 10]

5. **The hook cleanup deleted a test, not only files and folders.** `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` lost 83 lines and was removed outright, while `source-root-selection.test.sh` and two `lib`/`tests` READMEs were rewritten in place. A README that describes the git-hooks test suite should not promise a pre-commit test file. [INFERENCE: `git diff --numstat --no-renames v4.0.2.1..HEAD -- .skilled/scripts`, Actions Taken 5]

6. **There are 15 top-level skills, every one carrying a `SKILL.md`, and 14 of them carrying a `ROUTER.md`.** The single exception is `local-webflow`, which has `SKILL.md`, `README.md`, `references/`, `assets/`, `benchmark/`, `manual-testing-playbook/`, `changelog/` and `graph-metadata.json`, but no `ROUTER.md` and no `mode-registry.json`. It is an OpenCode-authored surface skill (`metadata.author: OpenCode`, version 1.1.3.0) rather than a hub, so the v4.0.1.0 rule that a skill keeps its router in a sibling `ROUTER.md` has one documented exception on disk. [SOURCE: .skilled/skills/local-webflow/SKILL.md:1] [INFERENCE: per-skill directory sweep, Actions Taken 6]

7. **Seven skills are hubs with a `mode-registry.json`, and together they route 42 modes.** `sk-doc` carries 15, `cli-external-orchestration` and `mcp-tooling` 8 each, `sk-code` 5, `sk-design` 3, `system-deep-loop` 2 and `cli-classifier` 1. The registry shape is a `modes` object keyed by numeric index (`"0"`, `"1"`, …), not a `workflowModes` array, so a count taken from a field name alone returns zero. [SOURCE: .skilled/skills/sk-code/mode-registry.json:1] [INFERENCE: `node -e` mode count over each registry, Actions Taken 7]

8. **The command surface is 44 markdown files under `.skilled/commands/`, and that number matches the "44 tracked commands" the v4.0.2.1 advisor policy covers.** The coincidence is worth stating as corroboration rather than proof: the notes count commands the advisor policy tracks, this count is files on disk, and the two agreeing is consistent with a 1:1 command-to-file layout but does not establish it. [SOURCE: .skilled/changelog/skilled/v4.0.2.1.md:104] [INFERENCE: `fd -t f '\.md$' .skilled/commands --max-depth 3 | wc -l`, Actions Taken 8]

9. **The agent surface is 11 markdown files under `.skilled/agents/`, at depth 1.** That is the runtime path the repo's own path convention names as canonical, so a README agent table should be built from `.skilled/agents/` and not from `.claude/agents/`. [INFERENCE: `fd -t f '\.md$' .skilled/agents --max-depth 1 | wc -l`, Actions Taken 8]

10. **Exactly eight runtime folders exist at the repository root — `.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe` — beside the shared `.skilled/`, and `.hermes` is absent.** This confirms v4.0.2.0's Hermes removal against the tree rather than against its release notes, and it makes the eight-runtime list in the `env-secret-guard` notes the correct support matrix for the README. [SOURCE: .skilled/changelog/skilled/v4.0.2.1.md:80] [INFERENCE: `ls -d` over the runtime roots plus `.hermes`, Actions Taken 9]

11. **`README.md` is still 1,773 lines and its size did not move with the three-line post-tag edit.** The strategy's recorded figure remains accurate, which means the rewrite's problem is structural, not that the file was left behind by a large edit. [SOURCE: README.md:1] [INFERENCE: `wc -l README.md` returning 1773, Actions Taken 4]

## Ruled Out

- **Re-running iteration 2's reads to satisfy the literal dispatch text.** Both release notes are already read in full and their findings recorded in `iteration-002.md`; a second pass would produce a redundant iteration and no new citations.
- **Quoting the post-tag `--shortstat` as a measure of change.** 576,916 insertions collapses to roughly 177,000 once the two scratch patches are excluded, and to a few tens of thousands once spec packets are excluded. The raw figure is a scaffolding count.

## Dead Ends

- Treating `specs/hooks-plugins-extensions` post-tag churn as evidence of a shipped hook rewrite. The 1,075 files are research artifacts for a packet that describes the rewrite; the rewrite itself is the 378 files under `.skilled/hooks`.

## Edge Cases

- Ambiguous input: the dispatch focus duplicated completed work. Selected interpretation — close Q1's unmeasured post-tag slice and open Q2, recording the stale-focus ambiguity here rather than halting. Deferred alternative: literal re-execution of iteration 2.
- Contradictory evidence: none. The strategy's §3 marks Q1 `[x]` while its Next Focus still names Q1 residual; that is reducer lag, not a factual conflict, and the state log's iteration 2 record already carries Q1's exact text in `answeredQuestions`.
- Missing dependencies: none.
- Partial success: Q2 is opened, not closed. The skills, mode-registry, command, agent and runtime-folder counts are verified; MCP, Code Mode, the doctor command family and the per-runtime CLI executors are not yet inventoried. The status is `complete` because the Q1 slice closed with cited evidence, not because Q2 is finished.

## Sources Consulted

- `README.md:1`, `:537`, `:1080`, `:1163`
- `.skilled/changelog/skilled/v4.0.2.1.md:80`, `:104`
- `.skilled/skills/local-webflow/SKILL.md:1`
- `.skilled/skills/sk-code/mode-registry.json:1`
- `git log --oneline v4.0.2.1..HEAD | wc -l`
- `git diff --shortstat --no-renames v4.0.2.1..HEAD`
- `git diff --numstat --no-renames v4.0.2.1..HEAD` (aggregated per top-level path)
- `git diff --numstat --no-renames v4.0.2.1..HEAD -- specs/hooks-plugins-extensions` (ranked)
- `git diff --no-renames v4.0.2.1..HEAD -- README.md`
- `git diff --numstat --no-renames v4.0.2.1..HEAD -- .skilled/scripts`
- Directory sweeps: `.skilled/skills/*/`, `.skilled/commands/`, `.skilled/agents/`, `.skilled/hooks/`, repository root

## Assessment

- New information ratio: 0.92
- Findings: 11 (9 fully new, 2 partially new — the eight-runtime list and the 1,773-line README figure were already established, and this iteration confirms both against the tree)
- Questions addressed: Q1 (post-tag slice), Q2 (opening slice)
- Questions answered: Q1
- Questions remaining: Q2 (MCP, Code Mode, doctor commands, CLI executors), Q3, Q4, Q5

## Reflection

- What worked and why: ranking `--numstat` by file count and then drilling into the single dominant path answered "what changed after the tag" in two calls and disproved the diffstat as a change measure. Chasing the top path was the whole difference — the raw totals suggested a large rewrite and the drill-down showed two scratch patches.
- What did not work and why: probing `mode-registry.json` for a `workflowModes` field returned zero modes for all seven hubs. The registries key `modes` by numeric index, so a shape guess produced seven false negatives in one call. The retry that printed `Object.keys` was what recovered it.
- What I would do differently: read one registry file before scripting a count over seven of them, and test a claimed list against its directory before treating it as stale — the README's hook-core section turned out to be correct, and only the disk comparison showed that.

## Recommended Next Focus

Finish Q2. The verified skeleton is now 15 skills, 7 hubs and 42 modes, 44 commands, 11 agents and 8 runtime folders; what is missing is the part a README's "what it does" section leans on — the MCP and Code Mode surface, the doctor command family, and the per-runtime CLI executor list (Claude Code, Codex, OpenCode, Pi, Devin, DSH, Mistral Vibe, Cursor). Q3's hook table then follows directly from the 27 cores already listed, and Q4 can be scored against both.
