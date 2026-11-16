# Iteration 2: Q1 Residual Scope — the v4.0.1.0 and v4.0.2.0 Releases, Early-Range Scale and the Real Closure Lists

## Focus

Close Q1 by reading the two release notes that iteration 1 did not reach, measuring the `v4.0.0.0..v4.0.1.0` range without a full `--stat`, and establishing which spec packets each range actually closed. Weight stays on what a root README must state, not on a per-file audit.

Interpretation chosen: "what each range changed" means the user-visible change set narrated by that release's own notes, plus a scale figure that is honest about what the number measures. Per-file inventory is Q2's job and stays deferred.

## Actions Taken

1. `wc -l` plus `ls` on `.skilled/changelog/skilled/` — sized the two unread release notes (196 and 253 lines) and confirmed the full changelog set (`v4.0.0.0` through `v4.0.2.1`, 22 files, no gap at `v4.0.1.0`).
2. Read `.skilled/changelog/skilled/v4.0.1.0.md` in full (196 lines).
3. Read `.skilled/changelog/skilled/v4.0.2.0.md` in full (253 lines).
4. `git diff --shortstat v4.0.0.0..v4.0.1.0` — abandoned after 150 s with no output; the same command with `--no-renames` returned in seconds. Rename detection over the range was the cost, not the diff itself.
5. `git diff --dirstat=files,0 --no-renames v4.0.0.0..v4.0.1.0` — produced 21,718 per-directory lines, almost all `0.0%`; unreadable as a summary, so it was replaced by aggregation (action 6).
6. `git diff --numstat --no-renames v4.0.0.0..v4.0.1.0 | awk` — aggregated files, insertions and deletions per two-segment top-level path, then the top 15 by file count.
7. `git log --diff-filter=A --no-renames <range> -- '*implementation-summary.md'` for all four ranges — raw and non-archive unique path counts.
8. `grep` for `Spec folders|specs/` in `.skilled/changelog/skilled/v4.0.2.1.md` — recovered the v4.0.2.1 closure list (line 26) and the sub-track restructure statement (line 417) that iteration 1 had not read.

## Findings

1. **The v4.0.1.0 release notes are a 196-line document titled "v4.0.1.0, Every Skill Routes From Its Own File", and its `> Spec folders:` line is the authoritative closure list for that release.** Nine named packets plus "smaller packets for the fixes": `sk-doc/051-hub-routing-quality/002-skill-routing-and-clarity`, `commands/004-doctor-sk-skill-command`, `commands/005-doctor-symlink-install`, `agents-md/016-doctor-agents-md`, `system-speckit/043-decision-capture`, `sk-code/018-frontend-upstream-proposals`, `sk-design/021-deprecate-fundamentals`, `sk-doc/065-conversation-playbook-scenarios`, `sk-doc/066-skill-readability-refinement`. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:2] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:27]

2. **v4.0.1.0's headline change is the router split: the intent tables, resource maps and pseudocode scripts read moved out of each `SKILL.md` into a sibling `ROUTER.md`, cutting the loaded corpus across 54 skills and modes from 328,333 to 238,406 tokens.** The change is breaking for a skill written outside the repo — one that keeps its router inside `SKILL.md`, or ships no `ROUTER.md`, now fails `package_skill.py --strict`. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:23] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:56] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60]

3. **v4.0.1.0 introduced the doctor command family, decision capture, multi-turn playbooks and the web frontend surface.** `/doctor:sk-skill`, `/doctor:install`, `/doctor:symlink`, `/doctor:agents-md` and `/doctor:helper` all land here; decision capture covers five runtimes; `run-conversation-scenario.cjs` scripts several turns; `sk-code-frontend` ships the web practice plus a starter `tokens.css`. A README that presents the doctor commands as a v4.0.2.0 feature is dating them one release late. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:44] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:114] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:126] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:72]

4. **v4.0.1.0 retires four surfaces, all breaking: the `mcp-magicpath` mode, the `sk-vision` skill with its `/vision` command, `sk-design-fundamentals`, and the LLM Gateway routes for GPT-6 Luna and Sol.** `sk-design` is left with exactly three modes — Style Reference extraction, charts and diagrams — and asks which one when a request names none. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:134] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:138] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:142]

5. **v4.0.1.0 is where OpenCode-only files moved into a singular `.opencode/` folder, and where `.skilled/release/` stopped shipping.** Plugins moved to `.opencode/plugins` and the goal command to `.opencode/commands/goal-opencode.md`; `/doctor:update` records moved into a git-ignored folder. Any README path that still shows OpenCode files under `.skilled/` predates this release. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:150] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:106]

6. **v4.0.1.0 records that `v4.0.0.17` was withdrawn and that v4.0.1.0 replaces it.** A README version history must not list `v4.0.0.17` as a shipped release. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:181]

7. **The v4.0.2.0 release notes (253 lines) title the release "Skilled in Your Own Project" and add the root `INSTALL-SKILLED.md` plus `system-skilled-doctor`, which takes ownership of ten setup commands and adds `/doctor:overlay` (`status`, `apply`, `repin`, `--rollback <run-id>`) for a vendored copy's local edits.** Its closure list names ten packets: `system-skilled-doctor/001-skill-and-overlay-build`, `other/004-context-paging`, `cli-external-orchestration/085-cli-deepseek-harness-creation`, `cli-external-orchestration/086-cli-hermes-deprecation`, `system-speckit/037-symlinked-runtime-root`, `mcp-tooling/026-clickup-doc-divider-spacing`, `hooks-plugins-extensions/027-ask-surface-enforcement`, `sk-doc/055-changelog-system/005-concise-release-format`, `sk-code/019-surface-consistency-research`, `system-speckit/047-v4-release-line-research`. [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:2] [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:22] [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:66] [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:32]

8. **v4.0.2.0 also adds host-index discovery, history lookup after compaction, DeepSeek Harness as an experimental CLI, and removes Hermes Agent.** A project keeps its own trigger index in `.speckit-index/` or a folder named by `indexDir` in `.skilled-host.json`; history lookup returns at most 16 KiB per reply on a 30-minute handle and does not support Cursor; `cli-deepseek-harness` dispatches to `dsh`; Hermes is breaking-gone along with `.hermes/`, `cli-hermes` and the `hermes` shell function. [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:86] [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:102] [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:116] [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:167]

9. **The early range is dominated by spec-archive churn, not framework change.** `v4.0.0.0..v4.0.1.0` is 142,262 files changed with 6,451,293 insertions and 16,124,638 deletions, but the mass sits in deleted historical spec trees: `specs/cli-orca` 28,860 files with 5,757,589 deletions against 49 insertions, `specs/cli-external-orchestration` 20,520 files with 5,122,019 deletions, `specs/sk-communication` 8,612 files with 2,894,517 deletions and zero insertions. The actual framework surface, `.skilled/skills`, is 8,122 files (566,711 insertions, 439,732 deletions). File counts must never be used as a measure of user-visible change in README prose. [INFERENCE: `git diff --shortstat --no-renames v4.0.0.0..v4.0.1.0` plus `git diff --numstat` aggregation, Actions Taken 4-6]

10. **Packet-closure counts derived from added `implementation-summary.md` paths overstate closures, because v4.0.2.1 regrouped the ten largest spec tracks into named sub-tracks.** A packet now lives at `specs/<track>/<sub-track>/<NNN>-<slug>` and is renumbered from 001 inside its sub-track; with rename detection off, every moved packet counts as added, which is why the raw add-counts read 2,254 (early range), 221 (v4.0.1.0..v4.0.2.0), 3,176 (v4.0.2.0..v4.0.2.1) and 17 (post-tag). The trustworthy closure lists are the changelogs' `> Spec folders:` lines: 9 named for v4.0.1.0, 10 for v4.0.2.0, and roughly 25 for v4.0.2.1. [SOURCE: .skilled/changelog/skilled/v4.0.2.1.md:417] [SOURCE: .skilled/changelog/skilled/v4.0.2.1.md:26] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:27] [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:32] [INFERENCE: `git log --diff-filter=A --no-renames` counts, Actions Taken 7]

11. **Runtime coverage is per feature, not uniform, so a README support matrix must say "up to eight" and qualify each row.** v4.0.1.0 decision capture names five runtimes (Claude Code, Codex, Pi, OpenCode, Devin); v4.0.2.0 history lookup names six (Claude, Codex, Pi, Devin, DSH, OpenCode) and states Cursor is unsupported; only the v4.0.2.1 `env-secret-guard` names all eight (Claude Code, Codex, Cursor, Devin, OpenCode, Pi, DSH, Mistral Vibe). [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:114] [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:28] [SOURCE: .skilled/changelog/skilled/v4.0.2.1.md:80]

## Ruled Out

- **`git diff --stat` on the early range.** Rename detection over 3,365 commits did not finish inside 150 s. `--no-renames` returned in seconds, so the earlier "quadratic diff" note in strategy §8 is better explained by rename detection than by diff size. This does not change the recommendation — aggregate with `--numstat` rather than emit per-file stats.
- **`git diff --dirstat=files,0` as a summary.** It emitted 21,718 per-directory lines, nearly all rounded to `0.0%`, which conveys no ranking. Aggregating `--numstat` per two-segment path is the readable form.
- **`--diff-filter=A --name-only` without `--no-renames` as a closure proxy.** Moves count as additions after the sub-track restructure, so the number measures path churn rather than closed packets.

## Dead Ends

- Counting `implementation-summary.md` paths as a proxy for closed packets. Definitively eliminated: the v4.0.2.1 sub-track restructure makes the measure meaningless at this scale.

## Edge Cases

- Ambiguous input: "which packets closed" has two readings — packets authored to completion, and packets that stopped receiving work. The changelog `> Spec folders:` lines were chosen as the authoritative reading because the release author wrote them; git-derived counts were recorded only as a rejected proxy.
- Contradictory evidence: none. The 5/6/8 runtime counts at v4.0.1.0, v4.0.2.0 and v4.0.2.1 describe different features, not the same fact, so they are a scope nuance rather than a conflict.
- Missing dependencies: `git diff --stat` on the early range could not complete. Fallback: `--no-renames --shortstat` plus `--numstat` aggregation, with the rename distortion documented in finding 10.
- Partial success: none; all planned reads and measurements completed.

## Sources Consulted

- `.skilled/changelog/skilled/v4.0.1.0.md:1-196` (full)
- `.skilled/changelog/skilled/v4.0.2.0.md:1-253` (full)
- `.skilled/changelog/skilled/v4.0.2.1.md:26` and `:417` (closure list and sub-track restructure)
- `.skilled/changelog/skilled/` directory listing (22 release files, `v4.0.0.0`..`v4.0.2.1`)
- `git diff --shortstat --no-renames v4.0.0.0..v4.0.1.0`
- `git diff --numstat --no-renames v4.0.0.0..v4.0.1.0` (aggregated)
- `git log --diff-filter=A --no-renames <range> -- '*implementation-summary.md'` for all four ranges

## Assessment

- New information ratio: 0.95
- Findings: 11 (10 fully new, 1 partially new — the eight-runtime enumeration was already established in iteration 1, and finding 11 adds the per-feature nuance)
- Questions addressed: Q1
- Questions answered: Q1

## Reflection

- What worked and why: reading the two release notes in full was the highest-yield action of the run. Each note carries the release narrative, its breaking changes and its own spec-folder closure list, so a single read replaced several git archaeology passes.
- What did not work and why: `--stat` and `--dirstat` both failed as summarisation tools — one by timeout under rename detection, the other by volume. Neither was a diff-performance problem in the way iteration 1 assumed.
- What I would do differently: for any range over a thousand commits, reach for `--numstat` piped through an aggregator first. It answers "where did the change land" in one call and avoids both the timeout and the 21,718-line dump.

## Recommended Next Focus

Open Q2 — the current inventory verified against files on disk. Q2 is the right next step because both remaining questions depend on it: Q3's hook table needs the runtime folder inventory, and Q4's claim audit needs the verified skill, command and agent counts. It also resolves a specific open number: the v4.0.1.0 notes quote "54 skills and modes", and only a current `mode-registry.json` and `SKILL.md` sweep can say what the count is now.
