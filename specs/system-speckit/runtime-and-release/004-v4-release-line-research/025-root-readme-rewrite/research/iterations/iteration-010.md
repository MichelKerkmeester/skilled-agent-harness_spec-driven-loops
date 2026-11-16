# Iteration 10: Runtime matrix completion — command surfaces, spelling and mirror forms

## Focus

The dispatch's next-focus line is `[All tracked questions are resolved]`, so no key question is open. Two non-redundant threads remained:

1. **The one-call check iteration 9 named**: whether the workflow owner extended `research.md` with §5E–§5G after iteration 9 prepared the material.
2. **The lowest-coverage area still feeding the rewrite**: iteration 5 proposed a first-screen runtime matrix of eight runtimes with columns for hooks, command spelling and notes. Iteration 7 supplied the hook column only (adapter forms and counts). The command-spelling column was never measured, and `README.md:208` asserts a spelling rule for three runtimes with no citation.

This iteration measures the matrix's command-surface and spelling columns, reconciles the command counts against git tracking, and performs the synthesis-state check. It does not re-derive Q1–Q5.

## Actions Taken

1. Read `deep-research-config.json`, `deep-research-strategy.md`, `iteration-009.md` and `research.md` (172 lines) to fix the iteration number, the exhausted-approach list and iteration 9's open item.
2. Counted `type:"iteration"` records in the state projection: 9 recorded, 26 total records.
3. Listed the top-level entries of all eight runtime folders to locate each command surface.
4. Counted `commands/`, `prompts/` and `skills/` entries per runtime and resolved each path's link form with `ls -ld`.
5. Diffed the flat prompt-directory name sets against the flattened `.skilled/commands` layout to find missing and extra names per runtime.
6. Reconciled counts against git: tracked command docs, ignore rules, and the entry type (file versus symlink) of the operator-local commands.
7. Grepped the eight runtime READMEs for command-generation and spelling statements.
8. Re-read `research.md` §5 to confirm whether the iteration-9 synthesis write landed.

## Findings

### P1 — corrections the rewrite must carry

1. **`README.md:208` under-counts the hyphen-spelling runtimes: five, not three.** The sentence names "Codex, Cursor and Pi" as hyphen spellers, but `.dsh/prompts/` and `.vibe/prompts/` each hold the same flat set of 46 hyphen-named files, including `speckit-complete.md`. `.codex/README.md:42` documents the transformation explicitly — "A command such as `create/agent` becomes `create-agent`" — and names `sync-prompts.cjs` as the writer. The rewrite must either list all five or say "runtimes with a flat command surface". [SOURCE: README.md:208] [SOURCE: .codex/README.md:42] [SOURCE: .dsh/prompts/speckit-complete.md] [SOURCE: .vibe/prompts/speckit-complete.md] [SOURCE: .pi/prompts/speckit-complete.md] [SOURCE: .cursor/commands/speckit-complete.md]

2. **Claude Code and OpenCode receive the nested layout, so the colon spelling is a consequence of the layout, not a separate convention.** `.claude/commands/` holds the six category directories as real directories whose 44 `.md` entries are per-file symlinks into `.skilled/commands` — `speckit/complete.md` resolves to `../../../.skilled/commands/speckit/complete.md`. `.opencode/commands/` holds the same six directories as directory-level symlinks — `speckit` resolves to `../../.skilled/commands/speckit`. [SOURCE: .claude/commands/speckit/complete.md] [SOURCE: .opencode/commands/speckit/complete.md] [INFERENCE: a nested directory layout maps to colon-namespaced slash commands in Claude Code and OpenCode; the invocation string was read from the layout, not executed]

3. **Devin has no command surface at all; its commands are skills.** `.devin/` holds no `commands/` or `prompts/` directory. `.devin/skills` is a symlink to `../.skilled/skills`, and `.devin/README.md:23` states that each skill appears as a slash command such as `/sk-doc`. `README.md:208`'s Devin clause ("reaches the same workflow through its `/system-spec-kit` skill") is accurate and should be kept. [SOURCE: .devin/README.md:23] [SOURCE: .devin/README.md:41] [SOURCE: .devin/README.md:55]

4. **The command count is 44 tracked command docs plus two gitignored operator commands; every runtime mirror carries all 46.** `git ls-files .skilled/commands` filtered to command documents returns 44. `.gitignore:246` ignores `/.skilled/commands/local-*`, and per-runtime patterns such as `.gitignore:256` ignore the mirror copies. The flat mirrors hold 46 files, and Pi and Cursor hold 47 because each adds one runtime-native goal command (`goal-pi`, `goal-cursor`). A matrix that prints 46 as "commands" would fold operator-local files into the product count; the README's 44 is the product number. [SOURCE: .gitignore:246] [SOURCE: .gitignore:256] [SOURCE: .skilled/commands/speckit/complete.md] [SOURCE: .pi/prompts/goal-pi.md] [SOURCE: .cursor/commands/goal-cursor.md]

### P2 — maintenance shape and state

5. **There are four command-mirror forms, not one, and each has a different maintenance story.** Claude Code: real category directories holding per-file symlinks. OpenCode: directory-level symlinks. Cursor: flat files, where the operator-local entries are symlinks into `.skilled/commands` (`local-doc-alignment.md` resolves to `../../.skilled/commands/local-doc-alignment.md`). Codex, DSH, Pi and Vibe: generated flat stubs, each with a named writer in its README (`sync-prompts.cjs`, `sync-prompts-dsh.cjs`, `sync-prompts-pi.cjs`; the grepped Vibe README lines state no generator). A README that says "commands are mirrored to every runtime" hides the distinction between a link and a generated copy. [SOURCE: .cursor/commands/local-doc-alignment.md] [SOURCE: .codex/README.md:64] [SOURCE: .dsh/README.md:81] [SOURCE: .pi/README.md:65]

6. **The workflow-owned synthesis still has not been extended: `research.md` is unchanged at 172 lines.** Iteration 9 measured the same length and prepared §5E–§5G; this iteration confirms the write did not land. §5 still gives Q3 as the bare requirement "every hook, plugin and extension per runtime" and Q4 as "claim audit of the current 1,773-line `README.md`", with no answered status, and the frontmatter still reads `version: 1.0.0.0`. [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:164] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:165] [SOURCE: specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md:8]

7. **The runtime matrix is now complete enough to write from the record.** Assembling this iteration's measurements with iteration 7's adapter counts yields every column the first screen needs, with no cell resting on a README claim alone except the Vibe spelling (naming evidence only) and the two colon invocations (layout inference).

| Runtime | Config folder | Command surface | Form | Files | Spelling | Hook adapters (iter 7) |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Code | `.claude/` | `commands/` (6 category dirs) | per-file symlinks into `.skilled/commands` | 46 | `/speckit:complete` | 32 symlinks |
| Codex | `.codex/` | `prompts/` | generated flat stubs | 46 | `/speckit-complete` | 27 symlinks |
| Cursor | `.cursor/` | `commands/` | flat files; operator-local entries symlinked | 47 (`+goal-cursor`) | `/speckit-complete` | 25 symlinks |
| Devin | `.devin/` | none | skills exposed as slash commands | n/a | `/system-spec-kit` skill | 29 symlinks |
| OpenCode | `.opencode/` | `commands/` (6 dir symlinks) | directory-level symlinks | 46 | `/speckit:complete` | 20 plugins |
| Pi | `.pi/` | `prompts/` | generated flat templates | 47 (`+goal-pi`) | `/speckit-complete` | 22 extensions |
| DSH | `.dsh/` | `prompts/` | generated flat pointer stubs | 46 | `/speckit-complete` | 22 adapters |
| Vibe | `.vibe/` | `prompts/` | flat files | 46 | `/speckit-complete` (naming only) | 18 hook entries |

[SOURCE: .claude/commands/speckit/complete.md] [SOURCE: .codex/prompts/speckit-complete.md] [SOURCE: .cursor/commands/speckit-complete.md] [SOURCE: .devin/README.md:23] [SOURCE: .opencode/commands/speckit/complete.md] [SOURCE: .pi/prompts/speckit-complete.md] [SOURCE: .dsh/prompts/speckit-complete.md] [SOURCE: .vibe/prompts/speckit-complete.md] [INFERENCE: adapter counts carried from iteration 7; command counts and forms measured this iteration]

## Ruled Out

- **A broad Q4 re-audit to cover the spelling sentence.** Q4 is answered and a second full pass would repeat iteration 6. Only the one claim Q4 never reached — `README.md:208` — was measured, and it is recorded above as a single correction.
- **Editing `research.md` to apply §5E–§5G.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-010.md` and `deltas/iter-010.jsonl`. Recorded under SCOPE VIOLATIONS.
- **Treating iteration 7's hook counts as the whole runtime matrix.** They cover one column of seven; the matrix needed the command surface, its form, its count and its spelling.

## Dead Ends

- None. Every action produced usable evidence.

## Edge Cases

- **Ambiguous input**: the focus line is `[All tracked questions are resolved]`. Selected the lowest-coverage area that still feeds the rewrite (the matrix's non-hook columns), plus iteration 9's named check. No key question was re-derived.
- **Contradictory evidence**: `README.md:208` names three hyphen runtimes; the directory listing shows five flat hyphen prompt directories. The disk listing and the Codex generator documentation prevail, and the contradiction is recorded as finding 1 rather than smoothed over.
- **Missing dependencies**: none. `resource-map.md` is absent by config, so the coverage gate is skipped rather than failed.
- **Partial success**: the Vibe spelling rests on filename convention because no Vibe README line states it; the Claude Code and OpenCode colon invocations are inferred from the nested layout. Cursor's tracked command entries were not individually checked for link-versus-file form — only its operator-local entries were. The status is `complete` because the matrix columns are answered with those caveats named in-cell.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-config.json`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-state.jsonl`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/deep-research-strategy.md`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-009.md`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/research.md`
- `README.md:178-222` (the eight-runtime sentence and the spelling sentence)
- `.codex/README.md:42`, `:64`; `.dsh/README.md:44`, `:81`; `.pi/README.md:42`, `:65`; `.devin/README.md:23`, `:41`, `:55`
- `.gitignore:246`, `:256`
- Directory listings and link resolution for `.claude/commands`, `.codex/prompts`, `.cursor/commands`, `.devin`, `.dsh/prompts`, `.opencode/commands`, `.pi/prompts`, `.vibe/prompts`

## Assessment

- New information ratio: 0.79
- Questions addressed: none tracked; the runtime matrix's command column is now measured
- Questions answered: none (Q1–Q5 were answered before this iteration)

## Reflection

- What worked and why: diffing name sets instead of counting files. A count says "46" and stops; the set comparison proved zero missing names in every flat mirror and surfaced `goal-pi` and `goal-cursor` as the only additions, which is what makes the matrix's Files column trustworthy. Resolving link form with `ls -ld` then separated four mirror shapes that a count would have collapsed into one.
- What did not work and why: the first `rg --files` count under-reported Pi (45 against 47 on disk). The cause was not the file count — `rg` skips gitignored and symlinked entries, so the two operator-local commands were invisible. `ls -1` is the authoritative counter here. The earlier malformed `sed` prefix in the same pass compounded it, producing a bogus "89 expected names".
- What I would do differently: measure entry type (`file` versus `symlink`) alongside the count in the first pass, rather than after a count discrepancy forces a second look.

## Questions Answered

None. All five strategy key questions were answered before this iteration.

## Questions Remaining

None tracked. One artifact-level gap remains and is not a research question: `research.md` needs §5E (Q4, iteration 6), §5F (Q3, iteration 7), §5G (numeric claims, iteration 8), a §5H for this iteration's command-spelling correction, and a rewrite of §5's Q3/Q4 entries. All material is cited in the iteration files.

## Next Focus

No research focus remains. The recommended action is the workflow-owner synthesis write:

1. Append §5E from `iteration-006.md`, §5F from `iteration-007.md`, §5G from `iteration-008.md`, and §5H from this iteration (the five-hyphen-runtime correction at `README.md:208`, the 44-versus-46 count rule, and the four mirror forms).
2. Rewrite `research.md` §5 so Q3 and Q4 carry answered status like Q1, Q2 and Q5.

If another iteration is dispatched anyway, the only unmeasured matrix column left is MCP configuration per runtime: `.claude/mcp.json`, `.cursor/mcp.json`, `.devin/mcp_config.json` and `.pi/mcp.json` exist, while Codex and Vibe carry `config.toml` and DSH and OpenCode show no top-level MCP file — whether those four configure MCP elsewhere was not measured.

## SCOPE VIOLATIONS

- **Would-be mutation: append §5E–§5H to `research.md` and rewrite its §5 Q3/Q4 entries.** `progressiveSynthesis` is `true` in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-010.md` and `deltas/iter-010.jsonl`. The edit was not executed. This is the third iteration to hit the same conflict (iterations 8 and 9 recorded it first). The material is prepared above so the workflow owner can apply it without re-research.
