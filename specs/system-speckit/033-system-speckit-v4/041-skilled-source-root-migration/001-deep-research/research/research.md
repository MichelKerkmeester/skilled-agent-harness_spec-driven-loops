---
title: "Deep Research: Skilled Source-Root Migration [system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/001-deep-research/research]"
description: "Merged, orchestrator-verified findings from two model families on what moving the source root from .opencode to .skilled would change and break: corroborated blockers, the silent-failure class, a corrections ledger, and a contract-versus-validator contradiction."
trigger_phrases:
  - "skilled migration findings"
  - "opencode source root blockers"
  - "silent gate disengagement"
  - "skilled cutover constraints"
importance_tier: "important"
contextType: "research"
---
# Skilled Source-Root Migration: Merged Findings

## 1. Executive Summary

The move is mechanically possible, and the repository already documents how to run a rename of this size. It is not a rename, though. `.opencode` is four things at once, and only one of them is a location: it is the repository's root-discovery sentinel, the opencode runtime's project namespace, a path hardcoded into launchers and gates, and a published contract that consumer projects symlink to by name. [SOURCE: .opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-45] [SOURCE: .opencode/bin/mcp-code-mode-launcher.cjs:19-28] [SOURCE: PUBLIC-RELEASE.md:10-36]

The finding that most changes the design is not a blocker. It is that the repository's own gates **self-disengage** when their scripts move. Every mirror-parity check skips when its script path is absent, the agent mirror-sync gate skips with a warning, comment hygiene skips when `sk-code` is gone, and 12 of 19 CI workflows skip on a missing guard. A migration commit would therefore pass pre-commit and go green in CI precisely because the checks meant to catch its mistakes can no longer find themselves. A green run on the migration commit is not evidence the migration is correct. [SOURCE: .opencode/scripts/git-hooks/pre-commit:98-99] [SOURCE: .opencode/scripts/git-hooks/pre-commit:172-176] [SOURCE: .opencode/scripts/git-hooks/pre-commit:49] [SOURCE: .github/workflows/markdown-link-integrity.yml:26-31]

Four references live outside Git and will not move with any commit, the most disruptive being seven global git hooks that are absolute symlinks into the main checkout. [SOURCE: ~/.config/git/hooks/] Whether `.opencode/` can become a pure consumer of `.skilled/` depends on three runtime behaviors this repository cannot prove from its own files; each needs a probe.

## 2. Research Question, Scope And Method

The question was what would have to change, and what would break, if `.skilled/` held the real skill, command, agent, hook, plugin and script files and every runtime directory, `.opencode/` included, linked into it. Whether to migrate was out of scope, as was the cutover sequence, which belongs to phase 003. `barter/` was excluded because its links resolve into a different checkout. [SOURCE: ../scratch/topic.txt]

Two lanes from different model families ran the same frozen brief, so agreement between them counts as corroboration rather than one opinion twice:

- `luna`: cli-codex, `gpt-5.6-luna`, xhigh reasoning, fast tier, 10 iterations. [SOURCE: lineages/luna/invocation-metadata.json]
- `deepseek`: cli-devin, `deepseek-v4-1-flash-max`, 5 iterations. [SOURCE: lineages/deepseek/invocation-metadata.json]

The orchestrator then opened the load-bearing citations from both lanes against the live tree and re-measured every number that decided a classification. That record is §9. Findings marked **verified** were confirmed that way; findings attributed to a lane were not independently re-checked.

## 3. Lane Status

**luna** completed 10 of 10 iterations in 25m50s and wrote its synthesis. The runner accepted it. The newInfoRatio fell from 1.00 to 0.65 across the run, and early convergence was telemetry only. [SOURCE: lineages/luna/convergence-report.md] [SOURCE: lineages/luna/research.md]

**deepseek** completed 5 of 5 iterations in 44m57s, wrote roughly 80KB of iteration findings and a synthesis, and recorded `iteration_cap_reached` with `stopReason: maxIterationsReached`. The runner **rejected** the lane anyway, for two bookkeeping reasons: its iteration records name the iteration under `run` rather than `iteration`, and it wrote no synthesis event. [SOURCE: lineages/deepseek/deep-research-state.jsonl] [SOURCE: lineages/deepseek/research.md]

The rejection says nothing about the research. The lane's content was verified claim by claim (§9) and is used here. The cause of the rejection is a contradiction in the deep-loop contract itself, recorded in §10.

## 4. Corroborated Findings

Both lanes reached each of these independently.

- **174 symlinks from runtime directories resolve into `.opencode/`**, with an identical per-runtime split: `.claude` 56, `.cursor` 53, `.devin` 22, `.codex` 19, `.pi` 19, `.hermes` 2, plus 3 under `specs/`. All observed targets are relative. **Verified.** [SOURCE: lineages/luna/iterations/iteration-001.md:11] [SOURCE: lineages/deepseek/deep-research-state.jsonl:3]
- **A literal `.opencode` grep undercounts the link surface.** Internal links inside `.opencode/` use relative targets that never spell the name, so a rewrite driven by grep would miss them silently. **Verified**: 207 internal links excluding `node_modules`, 257 including it. [SOURCE: lineages/luna/iterations/iteration-001.md:11]
- **The seven runtimes do not share one consumer shape.** Some take whole-directory links (`.claude/skills`, `.pi/skills`, `.hermes/agents`), some get generated trees (Codex and Pi prompts and agents, Hermes's markdown-only skill copies), and some are real forks (`.claude/agents`, which Cursor and Devin read). A link retarget fixes only the first class. [SOURCE: lineages/luna/research.md] [SOURCE: .claude/SYNC.md:24-34] [SOURCE: .hermes/SYNC.md:12-31]
- **`.opencode/` must stay resolvable.** Root discovery keys on it, the MCP launcher hardcodes it, and opencode resolves its project namespace from it. **Verified.** [SOURCE: .opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-45] [SOURCE: .opencode/bin/mcp-code-mode-launcher.cjs:19-28] [SOURCE: opencode.json:10-19]
- **Gates scope on literal `.opencode` paths.** The pre-push hook decides whether skills changed by diffing `.opencode/skills`, and `spec-kit-check.yml` filters on `.opencode/**`. A change that lands under `.skilled/` is invisible to both. **Verified.** [SOURCE: .opencode/scripts/git-hooks/pre-push:121-123] [SOURCE: .github/workflows/spec-kit-check.yml:5-20]
- **Derived state must be regenerated, not text-edited.** This covers the trigger index, compiled routing, compiled command contracts, runtime mirrors, four `dist/` trees and spec metadata, each with a named owning command. [SOURCE: lineages/luna/research.md] [SOURCE: lineages/deepseek/research.md]
- **Upstream runtime configurability is UNKNOWN.** Neither lane could establish from repository files whether any of the seven CLIs can be pointed at a root other than its own directory name.

## 5. Blocker Inventory

These cannot be done as the proposal is written. Each was reconciled against the live tree.

**B1. `.opencode` is a published contract, not an internal layout.** `PUBLIC-RELEASE.md` documents consumer projects symlinking `.opencode -> Public/.opencode`, and `SPEC_KIT_DB_DIR` exists specifically because `__dirname` resolves through that link. Renaming the source root changes a promise made to other repositories. **Verified.** [SOURCE: PUBLIC-RELEASE.md:10-36]

**B2. The installed git hooks dangle machine-wide the moment the main checkout moves.** `core.hooksPath` is `~/.config/git/hooks`, and all seven hooks there (`commit-msg`, `post-commit`, `post-merge`, `post-rewrite`, `pre-commit`, `pre-push`, `prepare-commit-msg`) are **absolute** symlinks into the main checkout's `.opencode/scripts/git-hooks/`. They serve every repository on the machine that uses that path, not just this one, and the reinstall tooling lives inside the tree being moved. **Verified.** [SOURCE: ~/.config/git/hooks/] [SOURCE: lineages/deepseek/iterations/iteration-004.md]

**B3. Four live external references cannot be updated by any commit.** **Verified** each:
- the seven global hook symlinks above;
- `~/.codex/hooks.json`, which carries 18 `.opencode` command strings;
- `~/.hermes/config.yaml:17`, which launches `.opencode/bin/mcp-code-mode-launcher.cjs`;
- `~/.codex/config.toml:21`, a project trust entry keyed to `…/Public/.opencode`.

No in-repository validator covers this class. [SOURCE: lineages/deepseek/research.md]

**B4. `.opencode/` as a pure consumer depends on three unproven behaviors:** opencode's flat plugin glob through a symlinked `.opencode/plugins/`, Devin's native `.opencode/skills` scan through a symlink, and the root-finder probes that test for `.opencode/skills`. Each is load-bearing and each is UNKNOWN without a probe. [SOURCE: lineages/deepseek/research.md] [SOURCE: .opencode/plugins/README.md:14-20]

**B5. A one-commit landing contradicts the repository's own doctrine.** The large-reorg runbook requires pure renames in a separate commit from content edits, so rename detection stays reliable. This migration pairs roughly 17,767 renamed files with hundreds of files of content edits. **Verified.** [SOURCE: .opencode/skills/sk-git/feature-catalog/workflow-playbooks/large-reorg-playbook.md:30-36]

**B6. `git mv .opencode .skilled` nests rather than renames.** `.skilled/` already exists, holding one placeholder directory, and `git mv` into an existing directory moves the source inside it. **Verified** that `.skilled/` exists; the nesting follows from `git mv` semantics. [SOURCE: lineages/deepseek/iterations/iteration-005.md]

## 6. The Silent-Failure Class

These never block and never warn loudly, which makes them more dangerous than the blockers. A design has to treat each one as first-class.

- **Mirror-parity checks skip.** All six check scripts are addressed as `$REPO_ROOT/.opencode/...` and guarded by `[[ -f "$MIRROR_SCRIPT" ]] || continue`. **Verified.** [SOURCE: .opencode/scripts/git-hooks/pre-commit:163-176]
- **Agent mirror-sync skips** with a warning when its checker path is missing. **Verified.** [SOURCE: .opencode/scripts/git-hooks/pre-commit:98-99]
- **Comment hygiene skips.** It blocks only while `.opencode/skills/sk-code` exists. **Verified.** [SOURCE: .opencode/scripts/git-hooks/pre-commit:49]
- **12 of 19 CI workflows skip on a missing guard,** each through an `if [ ! -f … ]` conditional that emits a warning and exits green. **Verified.** [SOURCE: .github/workflows/markdown-link-integrity.yml:26-31]
- **The pre-push skill detector matches nothing** once `.opencode/skills` is not where changes land. **Verified.** [SOURCE: .opencode/scripts/git-hooks/pre-push:121-123]
- **`prepare-commit-msg` leaves commits unstamped** when the allocator path moves. [SOURCE: lineages/luna/research.md]
- **The absolute-path data class never dangles.** Roughly 517 files store absolute paths that keep resolving to the old location after a move, so nothing fails and nothing warns. [SOURCE: lineages/deepseek/research.md]

One consequence follows from the verified code and has not been tested: whether these gates run or skip depends on the shape `.opencode/` takes after the move. If `.opencode/` resolves through a link to `.skilled/`, the `$REPO_ROOT/.opencode/...` script paths keep working and the gates run. Their staged-path filters, though, match on names such as `^\.(opencode|claude)/agents/`, and `git diff --cached` reports real changes under `.skilled/`. So the scripts would execute while the filters that decide what to check see nothing. This is orchestrator analysis of verified code, and a probe should confirm it before phase 003 relies on it. [SOURCE: .opencode/scripts/git-hooks/pre-commit:94]

## 7. Surface Classification Summary

| Surface | Dominant class | Notes |
|---|---|---|
| Symlinks from runtime dirs (174) | `mechanical` | Relative targets; recompute or retarget |
| Internal `.opencode` links (207) | `mechanical` | Travel intact with a move; invisible to grep |
| Generated runtime trees | `regenerate` | Codex, Pi, Hermes owners; retargeting is insufficient |
| Real forks (`.claude/agents`) | `manual` | No link at that position to retarget |
| Root sentinel and launchers | `blocker` / `manual` | `.opencode` must stay resolvable |
| Derived state | `regenerate` | Owning command per artifact; absolute class is silent |
| Gates and CI | `manual` | Self-disengaging; teaching order matters |
| External references | `blocker` | Outside Git; no validator |
| Documentation | `mechanical` / freeze | Runnable fenced paths rewrite; historical run records freeze |

## 8. Corrections Ledger

The brief contained errors. Both lanes caught some; the orchestrator's verification caught the rest.

- **"200 symlinks" was wrong; the figure for this repository is 174.** The 200 counted link-target strings containing `.opencode/`, which also caught `barter/` links into a different checkout — the directory the same brief excluded. Both lanes independently reached 174.
- **luna's "427" is right, measured differently.** It counted links with `node_modules` included. Re-measured in the same worktree that way, the total is 431; the four-link gap is artifacts created after its pass, including two `dist/` builds the orchestrator ran.
- **"20 CI workflows" should be 19.** The twentieth match was `.github/workflows/README.md`, which is not a workflow.
- **"`~/.codex/config.toml` is one external reference" understated the class.** There are four live external references (B3).
- **deepseek's blocker B1, "the migration commit cannot pass its own pre-commit gates", was overstated.** The gates it named skip rather than block (§6). The underlying risk is real but inverted: the commit passes when it should not.
- **The tracked-file count has drifted, not erred.** deepseek measured 17,766 files under `.opencode/`; the current count is 17,767.

## 9. Orchestrator Verification Record

Each claim was opened against the live tree. Every one resolved as cited unless noted otherwise.

- `repo-root.mjs:26-45`: `REPO_ROOT_SENTINEL` is `.opencode/skills/system-spec-kit/SKILL.md`, and `hoistAboveOpencodeTree()` matches a literal `.opencode` segment. Resolved.
- `mcp-code-mode-launcher.cjs:19-28`: builds the server path from literal `.opencode` segments. Resolved.
- `PUBLIC-RELEASE.md:10-36`: documents the consumer `.opencode -> Public/.opencode` symlink. Resolved.
- `pre-push:121-123`: diffs `.opencode/skills`. Resolved.
- `spec-kit-check.yml:5-20`: filters on `.opencode/**`. Resolved.
- `pre-commit:49`: comment hygiene blocks only while `.opencode/skills/sk-code` exists. Resolved.
- `pre-commit:92-104`: agent mirror-sync filter and its skip path. Resolved, and it **contradicted** deepseek's claim that the gate blocks.
- `pre-commit:114-182`: the six mirror-parity checks each skip on a missing script. Resolved, and it **contradicted** deepseek's claim that they run against moved sources.
- `markdown-link-integrity.yml:26-31`: skips on a missing guard. Resolved. The 12-of-19 count was **reproduced** by counting missing-guard conditionals across all workflows; a narrower first search found 5.
- `large-reorg-playbook.md:30-36`: renames go in separate commits from content edits, and strict-validate results from inside a worktree are treated as meaningless. Resolved.
- `~/.config/git/hooks/`: seven absolute symlinks into the main checkout; `core.hooksPath` points there. Resolved.
- `~/.codex/hooks.json`: 18 `.opencode` command strings. Resolved.
- `~/.hermes/config.yaml:17` launcher reference and `~/.codex/config.toml:21` trust entry. Resolved.
- `~/.opencode`: does not exist, confirming deepseek's ruled-out finding. Resolved.
- The symlink census: 174 external; 207 internal excluding `node_modules`, 257 including it. Re-measured.
- `state-jsonl.md:109-110` against `fanout-run.cjs:734`. Resolved as a contradiction (§10).

**A caveat on the validation of this packet itself.** The runbook above says strict-validate results from inside a worktree are meaningless. This packet was scaffolded and validated in a worktree after its own `dist/` trees were built locally, so its validation should be re-confirmed on `main` before any completion claim relies on it.

## Divergence Map

- **Symlink totals: 427 (luna) against 174 plus 208 (deepseek).** Not a disagreement. The lanes measured different populations, and both reconcile to the live tree (§8).
- **Severity of the pre-commit gates: blocker (deepseek) against silent skip (verified).** Resolved against deepseek by reading the gate code (§6).
- **CI workflow count: 20 (luna, echoing the brief) against 19 (deepseek).** deepseek is right.
- **One-commit landing: UNKNOWN pending a rehearsal (luna) against contrary to doctrine (deepseek).** Compatible rather than contradictory. deepseek grounded the answer in the runbook; luna correctly noted it has never been rehearsed. Both hold.

## 10. LOGIC-SYNC: State-Record Contract Contradiction

**LOGIC-SYNC REQUIRED:** `state-jsonl.md:109-110` names `run` as the required 1-indexed iteration number, and none of its examples carries an `iteration` key. `fanout-run.cjs:734` accepts an iteration record only when `Number.isInteger(record.iteration)`, and never reads `run`. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:109-110] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:727-741]

deepseek followed the documented contract and was rejected. luna wrote both keys and passed. The validator's own comment says a log naming its iterations under another key must not pass vacuously, so the validator is behaving as designed; the fault is that the document and the code name different keys. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:757-762]

**Resolved by the operator (2026-09-16): `iteration` is the canonical field.**

The follow-up was scoped by reading every writer and reader of the field, which corrected the first sketch of it:

- **Writers already use `iteration`.** The deep-research agent, both prompt-pack iteration templates and the deep-review command templates write it. The only writer that recorded `run` alone was the error record in `deep-research-auto.yaml`, and the stale outlier was the deep-research state document itself.
- **Most readers already accept both.** The research reducer's `readIterationNumber()`, the review reducer's `getIterationRun()`, `verify-iteration.cjs`, `fanout-merge.cjs` and `legacy-shadow.ts` take either name. One review-reducer call site read `run` directly, the dashboard progress row, and rendered `undefined` for a record carrying only `iteration`.
- **Not every `run` is an iteration record.** Blocked-stop, pause, recovery, idea and pivot events keep their own `run` field, so the blocked-stop heading the first sketch named is correct as written. The research reducer's candidate `run` value is copied into suppressed candidates that nothing reads, so it was left alone.

The change is made in `specs/system-deep-loop/049-deep-loop-alignment-review/016-iteration-state-record-contract/`, on the main checkout's `skilled/v4.0.0.0` branch.

## 11. Open Questions

- **Can each runtime be pointed at a root other than its own directory name?** UNKNOWN. Settle with version-specific loader documentation or source for each installed CLI.
- **Does opencode's plugin glob, and Devin's skill scan, follow a symlinked directory?** UNKNOWN. Settle with a probe per runtime in a scratch checkout.
- **Does git skip or fail on a dangling hook under `core.hooksPath`?** UNKNOWN. This decides whether B2 degrades loudly or silently. Settle with a one-line probe in a scratch repository.
- **With `.opencode/` as a link to `.skilled/`, do gate scripts run while their staged-path filters miss `.skilled/` changes?** UNKNOWN (§6). Settle with a probe commit in a disposable checkout.
- **Does a staged landing preserve rename detection at this size?** UNKNOWN. Settle with a disposable-checkout rehearsal with the hooks installed.
- **What is the complete home-level state on every machine?** UNKNOWN beyond this one. Settle with a per-machine scan of the named configs, hooks and wrappers, excluding secrets.

## 12. Handoff To Phase 003

These are constraints the cutover design must satisfy. They are deliberately not a sequence.

- `.opencode/` must remain resolvable for the root sentinel, the MCP launcher, the opencode namespace and the published consumer contract.
- Deal with the `.skilled/` placeholder before any `git mv`, or `git mv .opencode .skilled` nests.
- Keep pure renames in separate commits from content edits.
- Sequence the global hook reinstall with the move of the main checkout, because the hooks break for every repository on the machine at that moment.
- Do not treat a green pre-commit or a green CI run on the migration commit as evidence. The gates self-disengage, so verification has to run an independent check that does not live under the moved path.
- Regenerate derived artifacts with their owning commands; never text-edit them. Account separately for the absolute-path class, which fails silently.
- Run toolchain validation and metadata regeneration on `main`, not in a worktree.
- Treat the external references as a checklist outside Git, since nothing in the repository will catch a missed one.
- Note that `skilled` is already the release-branch namespace (`skilled/vA.B.C.D`). That is a naming decision, not a functional conflict.

## 13. References

- Lane syntheses: `lineages/luna/research.md`, `lineages/deepseek/research.md`
- Lane iterations: `lineages/luna/iterations/iteration-001.md` through `iteration-010.md`; `lineages/deepseek/iterations/iteration-001.md` through `iteration-005.md`
- Frozen brief: `../scratch/topic.txt`
- Launcher: `../scratch/launch-research.sh`
- Runbook: `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/large-reorg-playbook.md`

## 14. Convergence Report

- **luna**: `maxIterationsReached`, 10 of 10; ratio 1.00 → 0.65; accepted by the runner.
- **deepseek**: `maxIterationsReached`, 5 of 5 by its own state log; ratio 1.00 → 0.90; rejected by the runner over the §10 contract contradiction, not over its content.
- **Orchestrator verification**: 16 claims opened. All resolved; two contradicted a lane's severity claim and were reclassified.
- **Early convergence**: disabled in both lanes, as the operator's iteration counts required.
