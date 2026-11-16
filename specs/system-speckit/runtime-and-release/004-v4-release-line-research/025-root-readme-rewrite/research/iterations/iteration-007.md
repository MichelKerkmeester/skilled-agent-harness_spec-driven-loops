# Iteration 7: Q3 — Per-Runtime Hook, Plugin and Extension Map

## Focus

Q3: every dedicated hook, plugin and extension per runtime — name, runtime(s), one-to-two-sentence purpose, source path — verified against disk, one README subsection each.

The dispatch prompt named Q4 as next focus, but the reducer-owned strategy already ticks Q4 in §3 and lists it under §6 ANSWERED QUESTIONS after iteration 6, and iteration 6's own recommendation names Q3 as the only open question. Q3 is the only unchecked `- [ ]` item in strategy §3. The dispatch text was rendered from the pre-reducer strategy snapshot. This iteration therefore took the first unchecked key question, which is also the prior iteration's recommendation.

## Actions Taken

1. Read the run config, the state projection and the strategy to fix the iteration number, the focus and the exhausted-approach list.
2. Listed every runtime hook, plugin and extension directory: `.claude/hooks`, `.codex/hooks`, `.cursor/hooks`, `.devin/hooks`, `.opencode/plugins`, `.pi/extensions`, `.dsh/plugins`, `.vibe`, and the shared `.skilled/hooks` tree.
3. Counted symlinks versus real files per mirror and resolved every link target, grouped by owning tree (`.skilled/hooks`, `.skilled/skills`, `.skilled/bin`/`.skilled/scripts`).
4. Read each runtime's own inventory README to compare its stated count and grouping against the directory listing.
5. Counted loadable plugin sources (`.opencode/plugins/*.js`, `.pi/extensions/*.ts`, `.dsh/plugins/repo-guards/adapters/*.mjs`), the DSH registration list, and the `[[hooks]]` entries in `.vibe/hooks.toml`.
6. Extracted the one-line `description:` from all 27 `.skilled/hooks/*/README.md` files to confirm each core already carries a runtime-aware purpose sentence.

## Findings

### P1 — the shape a README must describe

1. **The hook layer is one policy tree plus three adapter forms, not eight parallel hook libraries.** `.skilled/hooks/` holds 27 directories: 26 concern cores plus `shared`. Four runtimes consume it through symlink discovery mirrors — Claude (32 links), Codex (27), Cursor (25), Devin (29) — whose real wiring lives in `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json` and points at real `.skilled` paths. Three consume it through native modules: OpenCode's 20 dual-export `.js` plugins, Pi's 22 one-line `.ts` re-export entries, and DSH's single `repo-guards` bundle registering 22 adapters. Vibe loads no JavaScript plugin at all: 18 `[[hooks]]` entries in `.vibe/hooks.toml` map the same cores onto its event model. A README subsection per runtime should say which form that runtime uses, because the maintenance story differs completely between a symlink and an adapter. [SOURCE: .skilled/hooks/README.md] [SOURCE: .claude/hooks/README.md:11] [SOURCE: .codex/hooks/README.md:11] [SOURCE: .cursor/hooks/README.md:11] [SOURCE: .devin/hooks/README.md:11] [SOURCE: .opencode/plugins/README.md:18] [SOURCE: .pi/extensions/README.md:16] [SOURCE: .dsh/plugins/repo-guards/README.md:45] [SOURCE: .vibe/plugins/README.md:18]

2. **The Codex mirror inventory is off by one against its own directory.** `.codex/hooks/README.md:11` says the folder "contains 26 symlinks" and lists 11 targets under `.skilled/hooks/`; disk holds 27 links and 12 hook-core targets. The unnamed link is `handover-compact-pointer.mjs` → `.skilled/hooks/session-handover/codex/handover-compact-pointer.mjs`. The arithmetic confirms the reading: 12 hook-core + 10 skill + 5 `.skilled/bin`/`.skilled/scripts` = 27. Every other mirror's stated count reconciles exactly (Claude 32 = 16 + 10 + 6, Cursor 25 = 7 + 12 + 6, Devin 29 = 12 + 11 + 6). A README that quotes per-runtime hook counts must use the disk number for Codex. [SOURCE: .codex/hooks/README.md:11] [SOURCE: .claude/hooks/README.md:11] [SOURCE: .cursor/hooks/README.md:11] [SOURCE: .devin/hooks/README.md:11]

3. **The verified per-runtime adapter counts are the numbers a README table needs.** Claude 32 symlinks, Codex 27, Cursor 25, Devin 29, OpenCode 20 plugin files, Pi 22 extension entries, DSH 22 registered adapters, Vibe 18 hook entries. Each count is a directory listing, not a README claim, except where noted in finding 2. [SOURCE: .claude/hooks/] [SOURCE: .codex/hooks/] [SOURCE: .cursor/hooks/] [SOURCE: .devin/hooks/] [SOURCE: .opencode/plugins/] [SOURCE: .pi/extensions/] [SOURCE: .dsh/plugins/repo-guards/adapters/] [SOURCE: .vibe/hooks.toml]

### P2 — what a rewrite would get wrong if it generalised

4. **The four mirrors are not the same set, so "the same hooks on every runtime" is false.** Each carries runtime-only entries. Claude has `fable-subagent-guard.mjs` (its Fable-model subagent policy), `session-prime.js` and `install-codex-hooks.mjs`. Codex has `handover-prompt-seed.mjs` and `session-start.js`, neither of which Claude links. Devin has `permission-request-policy.mjs` and `post-compaction.cjs`; the permission policy core is described as Devin-only. Cursor has `spec-gate-prebind.mjs` and `precompact.js`. The correct README statement is "the same policy cores, with runtime-specific adapters", never a claim of identical inventories. [SOURCE: .skilled/hooks/permission-policy/README.md] [SOURCE: .claude/hooks/] [SOURCE: .codex/hooks/] [SOURCE: .cursor/hooks/] [SOURCE: .devin/hooks/]

5. **Cursor is the one runtime without an ask-surface adapter.** The core's own description says "Seven runtimes register it and Cursor does not", and `.cursor/hooks/` holds no `ask-surface-*` link. A per-runtime table should carry this as a stated gap rather than a blank cell. [SOURCE: .skilled/hooks/ask-surface-guard/README.md] [SOURCE: .cursor/hooks/]

6. **Vibe's plugin README counts 21 OpenCode plugins where disk holds 20.** `.vibe/plugins/README.md:18` says "Each of the 21 plugins in `.opencode/plugins/`"; `ls .opencode/plugins/*.js` returns 20. The OpenCode README explains the drift: a 2026-10-19 battery verified 17 plugins then present, "one of those plugins has since been removed", and later additions did not rerun the battery. The Vibe count was not updated with the removal. [SOURCE: .vibe/plugins/README.md:18] [SOURCE: .opencode/plugins/README.md:18]

7. **DSH registers 22 adapters from a 24-file `adapters/` directory.** The bundle's `index.mjs` imports 22 `register*` functions; the two remaining `.mjs` files, `dsh-llm.mjs` and `session-role.mjs`, are helpers with no event registration. The adapters are relative links into `.skilled/hooks/<concern>/dsh/` or an owning skill's `hooks/dsh/`, and `sync-runtime-mirrors.cjs --check` enforces one link per real adapter. A fan-out lineage leaf runs the same bundle with four state-writing adapters switched off, so "DSH runs 22 hooks" needs that qualifier. [SOURCE: .dsh/plugins/repo-guards/index.mjs:5] [SOURCE: .dsh/plugins/repo-guards/README.md:9] [SOURCE: .dsh/plugins/repo-guards/README.md:45]

8. **OpenCode is the only runtime where the goal state machine lives in the plugin, not a shared core.** `opencode-goal.js` implements the goal state machine, supervisor, continuation and tool surface itself and shares only selected helpers; Pi, DSH, Vibe, Cursor and Devin inject from `.skilled/hooks/goal/`. Presenting the goal surface as uniform across runtimes would misdescribe where its logic is maintained. [SOURCE: .skilled/hooks/goal/README.md] [SOURCE: .opencode/plugins/README.md:18]

9. **Each core already carries the runtime-aware purpose sentence a README subsection needs.** All 27 `.skilled/hooks/*/README.md` files open with a `description:` that names both the job and its runtime coverage — for example "Seven runtimes register it and Cursor does not", "Eight runtimes run it and four folders here link to it", "wired on every runtime". The rewrite can source the per-runtime prose from these files instead of re-deriving it, and the counts above keep those sentences honest. [SOURCE: .skilled/hooks/ask-surface-guard/README.md] [SOURCE: .skilled/hooks/git-worktree-guard/README.md] [SOURCE: .skilled/hooks/env-secret-guard/README.md]

10. **The eight-runtime claim is corroborated from the hook layer independently of the release notes.** Every one of the eight runtime directories carries a live adapter surface, and the core READMEs describe coverage in terms of those eight. This is a second, independent confirmation of the Q4 finding that the six-name sentence at `README.md:16` is the stale one. [SOURCE: .skilled/hooks/README.md] [SOURCE: .vibe/hooks.toml]

### Claims verified as accurate

11. **The `.skilled/hooks` core count of 27 is correct and is 26 concerns plus `shared`.** `find .skilled/hooks -maxdepth 1 -mindepth 1 -type d` returns 27. The tree also holds six non-directory entries (`README.md`, `coverage-rationale.md`, `injection-contract.md`, `hook-flags.env`, `hook-flags.env.example`, `vitest.config.ts`), which a directory count correctly excludes. [SOURCE: .skilled/hooks/]

## Ruled Out

- **Re-auditing Q4 to satisfy the dispatch's stale next-focus line.** Q4 is ticked in strategy §3 and listed under §6; a second pass would produce redundant findings and no new citations.
- **Deriving the runtime mapping from the release notes.** The release narrative explains when DSH and Vibe were added; the adapter directories are the authoritative inventory and were listed directly.

## Dead Ends

- None. Every action produced usable evidence.

## Edge Cases

- Ambiguous input: the dispatch named Q4 while the reducer-owned strategy marks Q4 answered and Q3 unchecked. Selected Q3 as the only open key question and the prior iteration's recommendation; the dispatch text is treated as a stale snapshot.
- Contradictory evidence: one, between `.codex/hooks/README.md:11` (26 links, 11 hook-core targets) and the directory listing (27 links, 12 hook-core targets). Recorded with both readings; the disk listing prevails because the link targets resolve.
- Missing dependencies: none. `resource-map.md` is absent by config, so the coverage gate is skipped rather than failed.
- Partial success: per-core one-line purposes were read from all 27 README descriptions, but not every adapter file's body was read. The purpose statements therefore rest on the owning README plus the file's registration role, not on a line-by-line code read. No claim here depends on adapter internals beyond what the runtime READMEs and `index.mjs` state.
- Scope note: `progressiveSynthesis` is true in config, but this dispatch's allowed-write list names only `iterations/iteration-007.md` and `deltas/iter-007.jsonl`. `research/research.md` was therefore not edited; synthesis stays with its workflow owner.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-config.json`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-state.jsonl`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-006.md`
- `.skilled/hooks/README.md` and the 27 `.skilled/hooks/*/README.md` frontmatter descriptions
- `.claude/hooks/README.md:11`, `.codex/hooks/README.md:11`, `.cursor/hooks/README.md:11`, `.devin/hooks/README.md:11`
- `.opencode/plugins/README.md:18`, `.pi/extensions/README.md:16`, `.pi/extensions/README.md:36`
- `.dsh/plugins/repo-guards/README.md:7`, `:9`, `:45`; `.dsh/plugins/repo-guards/index.mjs:5`
- `.vibe/plugins/README.md:18`, `:24`, `:25`, `:26`; `.vibe/hooks.toml`
- Directory listings and resolved symlink targets for `.claude/hooks`, `.codex/hooks`, `.cursor/hooks`, `.devin/hooks`, `.opencode/plugins`, `.pi/extensions`, `.dsh/plugins/repo-guards/adapters`, `.skilled/hooks`

## Assessment

- New information ratio: 0.88
- Questions addressed: Q3
- Questions answered: Q3

## Reflection

- What worked and why: resolving every symlink to its target turned four opaque "mirror" directories into a readable ownership map. Counting entries alone would have produced four numbers; grouping the targets by owning tree produced the three-form model and, in the same output, exposed the Codex off-by-one. The arithmetic 12 + 10 + 5 = 27 is what made that finding citable rather than a hunch.
- What did not work and why: nothing failed, but reading runtime READMEs before listing directories would have been the wrong order here — the Codex README is the one document that disagrees with disk, so trusting it first would have propagated the stale count.
- What I would do differently: pair every runtime README's stated count with a `find` count in the same call from the start. Three of four mirrors reconciled and the fourth did not, which is exactly the signal a rewrite needs.

## Questions Answered

- **Q3** — Every dedicated hook, plugin and extension per runtime: the three adapter forms, the verified per-runtime counts (Claude 32, Codex 27, Cursor 25, Devin 29, OpenCode 20, Pi 22, DSH 22 registered, Vibe 18), the runtime-specific entries, and the shared 27-directory core tree.

## Questions Remaining

- None. Q1, Q2, Q3, Q4 and Q5 are all answered. The strategy §5 stop condition also requires Q3 to be cross-checked against a directory listing of every runtime folder; that cross-check is the body of this iteration, with no unlisted runtime directory found.

## Recommended Next Focus

Convergence and synthesis, not a new question. All five key questions are answered, so the next pass should assemble the rewrite inputs rather than discover more: the three-form adapter model with its verified counts, the Q4 claim corrections, and the Q5 section order. One residual worth capturing during synthesis is the per-core one-line purpose table, which exists verbatim in the 27 `.skilled/hooks/*/README.md` descriptions and should be quoted from there rather than rewritten.
