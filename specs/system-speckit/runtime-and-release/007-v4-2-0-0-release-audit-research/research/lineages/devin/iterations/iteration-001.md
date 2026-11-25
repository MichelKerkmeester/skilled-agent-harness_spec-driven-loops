# Iteration 1: Section-to-Commit Inventory for Deep Loop, Fan-Out Runs, Dispatch and Safety

## Focus

Build the release-notes-section-to-commit inventory for the first three sections (Deep Loop, Fan-Out Runs, Dispatch and Safety) and flag window commits that change user-visible behavior with no matching note line. Selected interpretation: "user-visible" means a new or removed command, flag, skill, mode, hook, script, default or behavior a user or integrator can observe, per the dispatch definition of MISSING. Deferred alternatives: the remaining seven notes sections are queued for iteration 2.

## Actions Taken

1. Read all 926 lines of `.skilled/changelog/skilled/v4.2.0.0.md` and indexed its 11 top-level sections.
2. Classified the 1084 window commits by type and scope; extracted all 64 `feat` commits and the 165 `fix(system-deep-loop)` subjects.
3. Mapped each `feat` commit to a notes line, then checked the Deep Loop, Fan-Out and Dispatch claims against HEAD code (`convergence.cjs`, `fanout-run.cjs`, `dispatch-iteration.cjs`, `executor-audit.ts`, both command docs).
4. Verified the notes' concrete counts that are cheaply checkable at HEAD: skills (14), doctor commands (17), `/doctor:setup` target rows (26), `/doctor:skill-advisor` targets (6), lockfile package counts (111 and 313), review/research blocked thresholds (2 and 3), the 20 MB cap, the 2.5 s stop grace, and the removal of `--allow-single-lineage`, `opencode2`, `cli-orca` and `dualPlugin`.
5. Checked which commits landed after the release notes' last edit.

## Findings

1. **MISSING (P1) — the Stop-hook auto-record behavior is unmentioned.** `d57563b175a` (2026-11-24, `feat(system-spec-kit): record queued answers at Stop for one bound packet`) adds 179 lines to `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` and updates `.skilled/hooks/decision-capture/README.md`, so a Stop hook now records queued operator answers for one bound packet. The notes never mention decision capture or a Stop-hook write: `capture` appears 0 times and `decision` only at notes line 194 (the blockedStop decision). [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:194]

2. **DRIFT (P1) — the notes' loop-ask gate no longer matches the Python fallback at HEAD.** Notes lines 494-513 claim the advisor attaches a deep command to an iteration count of two or more, a named loop, a want before a loop name, a continuation, and so on. `73d98332fff` (2026-11-25, `refactor(system-skill-advisor): keep a fallback deep-loop row only when its command is typed`) deleted about 1,300 lines of the Python fallback's own offer gate, and at HEAD `_apply_deep_loop_offer_gate` keeps a `/deep:research`, `/deep:review` or `/doctor:deep-loop` row only when the prompt types that command. That commit is one of six that landed after the notes' last edit (`98b712cd248`), so the claim is stale for the fallback path the notes do not distinguish. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4602] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:494]

3. **MISSING (P1) — lexical anchor narrowing is unmentioned.** `527fc5f9d43` (2026-11-24, `fix(system-skill-advisor): a skill counts as named only on a word few skills share`) changes advisor scoring so a skill is named only when the prompt holds a word at most a quarter of skills list, the strong-score lift needs a named anchor, and the id noun's second word must appear. It touches `runtime/lib/scorer/lanes/lexical.ts` and `fusion.ts` and ships as advisor 2.0.4.0. The notes' Skill Advisor section never mentions lexical anchors or a distinctive-word rule; `anchor` and `distinctive` appear 0 times, and the one `lexical` mention is only the lane name. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:436]

4. **MISSING (P2) — playbook run recording and its `--reports` flag are unmentioned.** `c06a73d348e` and `413d3268b8a` (2026-11-22, `feat(sk-doc): save playbook runs into the benchmark folder` and `... into the owning hub`) add a run recorder that writes `README.md`, `results.csv` and `source.md` under a `benchmark/reports/` folder, and `3395b32f6b1` adds a `--reports` flag accepted only for the skill or its hub. The notes mention the playbook only as the moved doctor scenarios (line 479) and the removed top-level folder (line 480); `benchmark` appears 0 times and `--reports` 0 times. [SOURCE: .skilled/skills/sk-doc/SKILL.md] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:479]

5. **MISSING (P2) — sk-code frontend verification now routes browser evidence through the hub, and the notes do not say so.** Three feat commits (`6dc1960f945`, `a5f104ca9ae`, `76f5e2dd36a`, 2026-11-22..23) change sk-code's frontend mode: it names the `mcp-browser-use` hub, routes browser inspection and page-speed claims through it, and proves the evidence with a live scenario. The notes' Browser Use section describes only the hub and Bladebro; sk-code appears at notes lines 476, 629, 778, 804 and 924, none about frontend verification (`frontend verification` and `page-speed` appear 0 times). [SOURCE: .skilled/skills/sk-code/SKILL.md] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:686]

6. **MISSING (P2) — worktree provisioning now builds the advisor skill graph, and the notes cover only the other worktree fix.** `957f47570f3` (2026-11-24, `fix(sk-git): build the advisor skill graph when provisioning a worktree`) makes `provision_worktree` run the advisor's scan once every install and build succeeds, never rescan an existing database, and fail provisioning when the scan fails or writes nothing. The notes' "New Worktrees Build Every Package" section covers only the nested-lockfile install fix and cites sk-git v1.11.13.0; the graph build is a separate user-visible provisioning step. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:742]

7. **MISSING (P2) — compiled hub front doors now read the task from stdin, and the notes do not mention it.** `991fe6d127a` (2026-11-24, `fix(compiled-routing): pass the task to every hub front door on stdin`) changes the front-door contract across seven hubs (`cli-classifier`, `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `system-deep-loop`) plus the two deep-loop compiled contracts. The notes never mention a stdin front door; `stdin` appears 0 times. [SOURCE: .skilled/skills/sk-code/ROUTER.md] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:424]

8. **MISSING (P2) — system-spec-kit now allows two levels of named sub-tracks, and the notes do not mention it.** `b0b3c8d9bf1` (2026-11-21, `feat(system-spec-kit): allow two levels of named sub-tracks and seed the mcp track`) rewrites `track-roots.mjs` (211 lines), `create.sh`, `validate.sh`, `relocate.mjs` and `archive.sh`, and adds a 384-line `nested-subtrack.vitest.ts`, so `create`, `validate` and `relocate` now accept a two-level sub-track. The notes never mention sub-tracks; `sub-track` and `track` appear 0 times. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:829]

## Ruled Out

- **Deep Loop section drift.** Every sampled claim held: `--depth-mode=expansive` and both frontier cap flags are documented in `.skilled/commands/deep/research.md:3,109-111` and `review.md:3,102-104`; the frontier defaults are 3 deep and 6 children; the budget split is 50/35/15; the blocked thresholds are 2 for review and 3 for research (`convergence.cjs:1595`, `deep-review-config.json:23`, `deep-research-config.json:17`); `blockedStop` is emitted (`convergence.cjs:1177`); and the `blocked_stop` row exists (`convergence.cjs:1511`).
- **Fan-Out section drift.** `--status`, `--stop` and `--only-lineage` exist (`fanout-run.cjs:37,1526,2021`); a one-lineage matrix is refused (`fanout-run.cjs:4944`); a native lineage is refused (`fanout-run.cjs:4649`); the stop grace is 2,500 ms (`fanout-run.cjs:1463`); `survivors` is returned (`fanout-run.cjs:1536`); and `provider_cost_usd` is emitted (`fanout-run.cjs:6142`).
- **Dispatch section drift.** The 20 MB cap and `ENOBUFS` verdict exist (`executor-audit.ts:1515`, `fanout-run.cjs:5853`); `iterations/iteration-NNN.cost.json` is written with `providerCostUsd` (`dispatch-iteration.cjs:451,472`); and `SPECKIT_ALLOW_HOST_SESSION_EXECUTOR` relaxes only ancestry and env (`executor-audit.ts:42`).
- **Count drift.** "14 skills" matches the 14 tracked top-level `SKILL.md` files; "seventeen" doctor commands matches the 17 `*.md` files under `.skilled/commands/doctor/`; the `/doctor:setup` target table has exactly 26 rows; `/doctor:skill-advisor` lists 6 targets; the advisor lockfile has 111 packages and the spec-kit lockfile 313, matching the notes' cost block.
- **Removal drift.** `--allow-single-lineage` has no remaining reference; `opencode2` has no reference in the deep-loop runtime; `.skilled/skills/cli-orca` is gone; `dualPlugin` is gone from `v2-bridge.js` (`definePlugin` at line 327); `nativeDual` is gone from `plugin-inventory.json` (`selfRegistered` instead); `.skilled/manual-testing-playbook/` is gone.

## Dead Ends

- **Counting the Python scorer tests from source.** The fallback test file has 22 `def test_` functions but runs case tables, so 130 and 138 cannot be reconciled by counting. Deferred to a later iteration with a direct suite run or a test-record source.
- **Treating the 10-folder "Spec folders" block as the coverage list.** It lists 10 packets while `recent-packets.txt` holds 21, but the block is metadata, not a coverage claim; the packet-coverage question needs the per-packet check scheduled for a later iteration.

## Edge Cases

- Ambiguous input: "user-visible" was read as the dispatch definition (command, flag, skill, mode, hook, script, default or behavior). Internal refactors with no observable surface were excluded, which is why `d239dd6d2ae` (workflow-steps script) and `b8c96116192` (adapter capability record) are not reported as MISSING in this iteration.
- Contradictory evidence: none resolved this iteration; the notes' two advisor test rows (2,450 vs 3,557; Python 130 vs 138) are a candidate contradiction deferred to the DRIFT iteration.
- Missing dependencies: none. All cited files exist at HEAD.
- Partial success: none. Every planned action succeeded.

## Sources Consulted

- `.skilled/changelog/skilled/v4.2.0.0.md` (all 926 lines; sections at 158, 259, 363, 424, 533, 635, 686, 727, 752, 829)
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt` (1084 commits)
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt` (21 packets)
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4602-4624`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts`
- `.skilled/skills/sk-doc/SKILL.md`
- `.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/ROUTER.md`
- `.skilled/skills/sk-git/scripts/worktree-naming.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1177,1511,1595`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:37,1463,1526,1536,2021,4649,4944,6142`
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:451,472`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:42,1515`
- `.skilled/commands/deep/research.md:3,109-111`, `.skilled/commands/deep/review.md:3,102-104`
- `.skilled/commands/doctor/assets/doctor-setup-presentation.txt`
- `.opencode/plugins/lib/v2-bridge.js:327`, `.opencode/plugins/tests/plugin-inventory.json:2`
- `.skilled/skills/system-skill-advisor/runtime/package-lock.json`, `.skilled/skills/system-spec-kit/package-lock.json`
- `git show --stat` for `d57563b175a`, `b0b3c8d9bf1`, `413d3268b8a`, `c06a73d348e`, `6dc1960f945`, `a5f104ca9ae`, `76f5e2dd36a`, `527fc5f9d43`, `957f47570f3`, `991fe6d127a`, `73d98332fff`

## Assessment

- New information ratio: 1.00
- Questions addressed: Q1 (partially: Deep Loop, Fan-Out Runs and Dispatch and Safety sections mapped; seven sections remain), Q2 (partially: 6 of 21 packets checked, the rest deferred)
- Questions answered: none in full

## Reflection

- What worked and why: classifying the window by conventional-commit type and scope first turned 1084 commits into 64 feat commits plus a fix subject list, so each candidate could be checked against a specific notes line instead of read linearly. Reading the notes in full before the commits prevented a "missing" claim from being made about something already covered in a folded "Smaller fixes" block.
- What did not work and why: counting `def test_` functions cannot reconcile the notes' Python test totals, because the file is a case-table harness rather than one test per function. The numeric claims need a different source (a recorded run or a suite execution).
- What I would do differently: check the notes file's own last-edit commit before the section mapping, so post-notes commits are a first-class focus rather than a discovery at the end of the pass.

## Recommended Next Focus

Map the remaining seven notes sections (Skill Advisor, Installs and Overlays, OpenCode, Browser Use, Skills and Worktrees, How It Was Checked, Upgrade Notes) to window commits, and verify the concrete DRIFT candidates already surfaced: the two advisor suite rows (2,450 vs 3,557 passed; Python 130 vs 138) and the OpenCode setup-helper and 18-subcommand claims.
