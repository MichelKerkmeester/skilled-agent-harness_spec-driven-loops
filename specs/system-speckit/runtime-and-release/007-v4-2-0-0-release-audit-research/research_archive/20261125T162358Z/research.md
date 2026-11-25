# Research Synthesis: Skilled v4.2.0.0 Release Notes Audit

Audit of `.skilled/changelog/skilled/v4.2.0.0.md` (926 lines, untagged) against `v4.1.0.0..HEAD` (1,084 non-merge commits) and the 21 most recently touched packets. Two lineages ran ten iterations each: `codex` (cli-codex, `gpt-6-luna`, xhigh, fast tier) and `devin` (cli-devin, `deepseek-v4-1-flash-max`). HEAD at audit: `c75200c504a`. The notes were last edited at `98b712cd248`, 2026-11-25 00:31 +0100.

## 1. Executive Summary

The notes are accurate in what they claim. Across the two lineages, almost every count, flag, path and removal they checked held at HEAD. What the notes lack is coverage of work that landed late or outside the components they list, plus three items that need fixing before the tag.

The lineages proposed 26 distinct findings. Each was re-checked in the repository by the orchestrator. **16 are confirmed** (9 MISSING, 5 DRIFT, 2 BUG) and **10 are rejected** (section 7).

Three confirmed findings are P1:

- **M1**: the Claude Stop hook now writes queued question-tool answers into the bound packet's `decision-record.md`. Neither the notes nor any component changelog mention it. It fired live on this packet during the audit.
- **D1**: the Upgrade Notes install Bladebro with `npm install -g bladebro@4.8.2`, while the hardened install guide requires `--ignore-scripts` and a digest check first.
- **B1**: `worktree-naming.sh` lost its executable bit in the window, so the direct form the docs and the Upgrade Notes use fails with permission denied.

Codex graded D1 and B1 at P2. The orchestrator raised both to P1 because each breaks an instruction the notes' own Upgrade Notes give operators (lines 906 and 915). D2 went the other way, see section 4.

No P0 was found. The audit is not exhaustive: both lineages stopped on the iteration cap, not on convergence, and only 5 of the 26 candidates were found by both (section 9).

## 2. Scope and Method

- **Inputs**: the notes, `scratch/window-commits.txt` (1,084 lines) and `scratch/recent-packets.txt` (21 packets), frozen before the run.
- **Definitions**: MISSING is a user-visible change in the window that the notes never mention. DRIFT is a note claim the current code or docs contradict. BUG is a defect in code changed in the window.
- **Lineage method**: each lineage walked the notes sections in turn, mapped commits to note lines and checked countable claims at HEAD. Devin filtered `fix` commits against the folded "Smaller fixes" blocks. Codex did not.
- **Orchestrator verification**: every candidate was checked by one of four means, named per finding: a grep of the notes with two or more synonyms, a read of the cited lines, a read-only command, or a check of whether the touched file existed at `v4.1.0.0`. A fix to code that is itself new in the window is not counted as a separate MISSING item when the notes cover the feature. Component changelogs added in the window were grepped too, because the notes delegate to them at line 823.

## 3. MISSING: user-visible changes with no note entry

**M1 | P1 | Claude Stop records queued answers into the bound packet.** Commit `d57563b175a` (2026-11-24). `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:195-217` reads the transcript tail and, when exactly one packet with a `spec.md` is named, writes each queued answer into `decision-record.md` and marks its key consumed. It is on by default. The only off switch is the decision-capture kill switch, `SYSTEM_DECISION_CAPTURE_DISABLED=1` (`.skilled/hooks/hook-flags.env:27`, checked at `session-stop.ts:173`). Verified: the notes grep (`at Stop|Stop hook|queued|decision-record|decision capture`) finds nothing, and the window's component changelogs carry no such entry. Observed live: this packet's `decision-record.md` was written at 2026-11-25T08:05:05Z with the operator's loop-choice answer as Q001, without any request. Notes line to extend: the `system-spec-kit` mention at 823, or a new item under Skills and Worktrees. The source packet `decision-capture/001` is still In Progress, but the code is on `main`.

**M2 | P2 | A research fan-out lineage now stops on `frontier_drained`.** Commit `b3fea67595e`. `.skilled/commands/deep/assets/deep-research.yaml:1132` and `.skilled/skills/system-deep-loop/deep-research/SKILL.md:95`. Notes line 179 states the stop for review only. Verified by reading both lines and by the notes grep (`drain` hits only 179 and 761). The runtime and deep-loop component entries record it.

**M3 | P2 | A lexical score lifts the confidence floor only on a distinctive word.** Commit `527fc5f9d43`. `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:108-118` and `scoring-constants.ts:197` (`lexicalAnchorMaxSkillShare: 0.25`). Notes line 436 names the lexical lane only. Verified by reading both files and by the notes grep. The `system-skill-advisor` v2.0.4.0 entry records it. Its packet, `014-lexical-anchor-narrowing`, is Partial: three of five probe lifts remain, so a note line should not claim every false lift is gone.

**M4 | P2 | Worktree provisioning builds the advisor skill-graph database.** Commit `957f47570f3`. `.skilled/skills/sk-git/scripts/worktree-naming.sh:796-818` scans when the gitignored database is missing and fails provisioning when the scan leaves none. Notes lines 742-748 cover only the nearest-lockfile fix. Verified by reading the lines. The `sk-git` v1.11.15.0 entry records it, but `sk-git` is not among the components the notes delegate to (see D5).

**M5 | P2 | Every hub front door takes the task on stdin.** Commit `991fe6d127a`. All eight hubs, the parent-hub scaffold and `init_skill.py` moved from a double-quoted `--prompt "<task>"` to `--prompt-stdin` with a quoted heredoc. The old form let a quote, `$()` or backtick in the task reach the shell. Evidence: the `.skilled/bin/README.md` `compiled-route.cjs` row in that diff. Notes grep (`stdin|front door`) finds nothing in the notes. Three component entries record it. It belongs under Dispatch and Safety.

**M6 | P2 | `create`, `validate` and `relocate` accept two levels of named sub-tracks.** Commit `b0b3c8d9bf1`. `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:11-16`. That file existed at `v4.1.0.0`, so this changes existing behavior. Verified: no hit for `sub-track|subtrack|two levels` in the notes or in any component changelog added in the window.

**M7 | P2 | JSON-entry overlay writes keep the destination's indentation and line endings.** Commit `512be46971a`. `.skilled/commands/doctor/scripts/overlay-engine.cjs:1220-1251` (`documentLayout`) detects the indent unit and the prevailing CRLF or LF ending. `json-entry` existed at `v4.1.0.0` and `documentLayout` did not, so applied files now come out differently. Verified by reading the lines. No hit for `indent|CRLF|json-entry` in the notes or the window's component changelogs.

**M8 | P2 | A goal whose packet lives in a linked worktree is carried across a hop.** Commit `12fe3abc66b`. `.skilled/hooks/session-handover/lib/relaunch-core.cjs:584-591` resolves the goal against the note's declared `goal_root` or `cwd`. The file existed at `v4.1.0.0`. Verified by reading the lines. The notes grep (`linked worktree`) hits only the unrelated pre-commit line 624, and no component entry records it.

**M9 | P2 | sk-code frontend verification routes browser evidence through `mcp-browser-use`.** Commits `6dc1960f945`, `a5f104ca9ae` and `76f5e2dd36a`. `.skilled/skills/sk-code/SKILL.md:154` now requires reading the browser hub for a changed stylesheet, markup or component file. The Browser Use section at 686-700 does not say sk-code sends work there. Verified by reading the line and by the notes grep. `sk-code` has four new component entries but is not delegated to (see D5).

## 4. DRIFT: note claims the code contradicts

**D1 | P1 | The Bladebro install line drops the install hardening.** Notes line 906: `npm install -g bladebro@4.8.2`. `.skilled/skills/mcp-browser-use/mcp-bladebro/mcp-servers/bladebro-cli/README.md:24` and `:50-52` require `npm install -g --ignore-scripts bladebro@4.8.2`, then a SHA-256 check of the native binary and both JS launchers before first run (step 3). The wrapper `scripts/install.sh` does both. The hardening landed in `ec3ed74ad01` on 2026-11-24, before the notes' last edit. The `mcp-bladebro` v1.2.1.0 entry records it. Verified by reading the guide lines and the notes line. The upgrade step tells operators to run install scripts the hub's own guide now refuses. It does not establish that the package is malicious.

**D2 | P2 | The notes' loop-ask rules do not describe the Python fallback at HEAD.** Commit `73d98332fff` landed at 08:29 on 2026-11-25, after the notes' last edit. `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4602-4625` keeps a `/deep:*` or `/doctor:deep-loop` row only when the prompt types that command. In this path, an untyped loop ask gets no offer, and a typed command beside a refusal stays an ask. Notes lines 494-506 state the native rules with no fallback caveat. `README.md:91` of the advisor says the CLI uses this scorer only when the daemon cannot be reached, and marks the answer degraded. That limits the reach, so this is graded P2. The lineages split P1 against P2, and reachability decided it.

**D3 | P2 | The Python scorer test count is stale.** Notes line 811: "Advisor Python scorer tests | 130 passed". Running `python3 -I .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` at HEAD prints `Summary: pass=134, fail=0`, exit 0. (A `pytest` run of the same file collects 22 functions, which is not the harness the notes count.) Line 807's "138 passed" is pinned to commit `46465394d97` and is a historical result, so it is not refuted.

**D4 | P2 | The overlay guard count is stale.** Notes line 817: "20 of 20". `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` at HEAD prints `tests 21`, `pass 21`, `fail 0`. The newest test commit, `3bfd5e111fc` (2026-11-21), predates the notes' last edit.

**D5 | P2 | The delegation list at line 823 omits twelve components that gained entries in the window.** Line 823 names 14 components that "have their own entries for this release". `git diff --name-only --diff-filter=A v4.1.0.0 HEAD` also adds entries for `sk-code` (v3.12.2.0 to v3.12.5.0), `sk-doc` (v2.10.1.0), `sk-create-skill` (v1.16.1.0), `sk-git` (v1.11.13.0 to v1.11.15.0), `sk-design` (v3.0.3.0), `cli-classifier` (v0.8.10.0), `cli-external-orchestration` (v2.1.1.0), `mcp-code-mode` (v1.0.19.0), `mcp-click-up`, `mcp-figma`, `mcp-mobbin` and `mcp-refero`. Devin found two of these, and the orchestrator's listing found the rest. M4, M5 and M9 sit in components this list skips.

## 5. BUG: defects in window code

**B1 | P1 | `worktree-naming.sh` is no longer executable.** Commit `957f47570f3` changed the git mode from `100755` to `100644`. `git diff --summary v4.1.0.0 HEAD` prints `mode change 100755 => 100644`, and `ls -l` shows `-rw-r--r--`. The direct form is still documented at `.skilled/skills/sk-git/references/worktree-workflows.md:198`, `:209`, `:216` and `:350`. The script's own failure hint at `worktree-naming.sh:420` prints `run: worktree-naming.sh provision $dir`, and Upgrade Notes line 915 uses the same form. Run that way, each fails with permission denied. `bash <script>` and `source` still work. Fix: `git update-index --chmod=+x` on the file. The defect was confirmed from the mode bits, and the scripts were not run.

**B2 | P2 | The reserved `root/skilled` guard compares case-sensitively.** Commit `5913aebc267`. `.skilled/commands/doctor/scripts/overlay-engine.cjs:4160-4164` (`isUnderRootSkilled`) tests `normalized === 'root/skilled' || normalized.startsWith('root/skilled/')`. It is applied at `:4533` to `source`, `fragment` and `base`. On a case-insensitive disk, the macOS default, `root/Skilled/...` passes the guard and lands in the reserved folder, which the comment at `:4157-4159` says must never hold a copy. The same file already has `isCaseInsensitiveDir` (`:4182`) and uses it for other path checks (`:300`, `:4275`, `:4328`), just not here. Confirmed by reading the code. Not executed, because a reproduction would need an overlay apply outside this packet. Notes line 546 claims the block.

## 6. What the Notes Get Right

Both lineages checked these at HEAD and found them holding: the Deep Loop and Fan-Out flags and defaults (`--depth-mode=expansive`, the frontier caps, the 50/35/15 budget, blocked-stop counts, `--extend`, `--preview`, `--status`, `--stop`, `--only-lineage`, the 20 MB `ENOBUFS` cap). They also held for the Dispatch and Safety contracts (`iteration-NNN.out` and `.cost.json` at lines 374 and 376, exit 64, `APPEND_FAILED`, the sandbox `/tmp` guard). The four advisor lanes and weights held, as did the overlay layout rules and refusals, the OpenCode 2.3.2 pin and its 18 passthrough subcommands, and the Bladebro and bdg versions. So did the 14-skill count, the `cli-orca` removal, the lockfile dependency totals and all twenty breaking-change items. Codex's scan of local Markdown links and anchors in the notes found no broken target. The large suite totals (advisor 2,450 and 3,557, deep-loop 4,039, doctor 1,673 plus 19) were not rerun and stay UNKNOWN, because each run writes outside the packet.

## 7. Rejected Candidates

| Candidate | Lineage | Why rejected | Check that decided it |
|---|---|---|---|
| CLI iterations write `iterations/iteration-NNN.out` is missing | codex | The notes state it | `grep` hits notes lines 374 and 376 |
| Unreadable PATH match records an unknown identity | codex | An attribution edge case in fan-out logs, not a user-visible behavior | read of the `15fe7306bca` subject and scope |
| Attach requests lift the browser read-only floor | codex | Refines the `mcp-browser-use` hub, which is new in the window and delegated at line 823 with seven entries | `git cat-file -e v4.1.0.0:` on the hub files fails |
| A "403 Forbidden" prompt can route to DevTools | codex | Same, a routing fix inside the new hub | same check |
| Playbook run recording and `--reports` | both | `sk-create-manual-testing-playbook` is delegated at line 823, and its v1.2.0.0 to v1.3.1.0 entries record the recorder | grep of the window's component entries |
| `/deep:review` target forms | devin | `frontier-admit.cjs` is new in the window, and both steps that call it are `enabled_when: "depth_mode == 'expansive'"` (`deep-review.yaml:372`, `:884`), a feature the notes cover from line 158 | `git cat-file -e` fails at `v4.1.0.0`, plus a read of both step conditions |
| Pi default model first in `enabledModels` | devin | The regression (`803f64f33ef`) and its fix (`31ef87dfc7b`) both landed on 2026-11-21, so there is no net change since v4.1.0.0 | `git log v4.1.0.0..HEAD -- .pi/settings.json` |
| Bare "security policy" phrase stops routing to README | devin | A hub-vocabulary consistency fix after an intent narrowing, with no separate user-visible behavior | `git show 571575632a4` message |
| "Spec folders (10)" is drift | devin | Release metadata, not a coverage claim. Devin's own eliminated-alternatives table says so | devin `research.md` section 7 |
| `typed` mark dropped on normalization | devin | Not reproduced, and its premise is wrong: `render.ts:250` and `skill-advisor-cli-fallback.ts:395` do read `typed` | three `skill_advisor.py --force-local` probes, including ones naming the owner skill, all returned `typed=True` |

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Count `def test_` functions or a `pytest` run for the Python scorer total | The notes count the file's own case harness | `pytest` collects 22, and the direct run prints `pass=134` | devin 1-2, orchestrator |
| Rerun the advisor, deep-loop or doctor suites for HEAD totals | Each writes outside the packet | dispatch write boundary | devin 2, 5; codex 9 |
| Settle the P1-against-P2 split on D2 by tally | Severity follows reach, and the fallback serves only when the daemon is unreachable | advisor `README.md:91` | orchestrator |
| Treat every in-window `fix` as MISSING | A fix to code new in the window refines a feature the notes cover | `git cat-file -e v4.1.0.0:<path>` per finding | devin 6, orchestrator |
| Treat a component-changelog entry as full coverage | Line 823 delegates only to the 14 components it names | D5 listing | orchestrator |
| Treat the notes' review `frontier_drained` line as wrong | It is right for review, and the research stop is what is missing | notes line 179 | codex 1 |

## Divergence Map

- **Saturated directions**: none. Neither lineage ran a divergent pivot (0 pivots, 0 pivot failures, 0 audited overrides).
- **Overlap**: only 5 of 26 candidates came from both lineages (M1, M3, M4, D2 and the rejected playbook item). Devin weighted counts and lists (D3, D4, D5). Codex weighted behavior and bugs (M2, M7, M8, B1, B2, D1). The low overlap means a third pass would likely find more.
- **Coverage**: codex's coverage graph stayed empty and it answered 0 of its 4 key questions. Devin closed its questions on its own reading. Neither claims the 1,084 commits were read line by line. Codex names packets whose features it did not compare: sk-doc readability, hub routing and changelog system, advisor Pi integration, the alignment lane runner, deep-loop README alignment and mcp-code-mode.
- **Remaining frontier**: the unchecked packets above. Also the window's `fix` commits in components the notes do not delegate to (D5), which neither lineage filtered.

## 12. Open Questions

- Should the notes delegate to every component with an entry in the window, or say that line 823 is a subset? This is the release owner's choice, and D5 holds either way.
- Should M1 ship on by default in v4.2.0.0? Its packet is still In Progress, yet the hook writes into operator packets unless `SYSTEM_DECISION_CAPTURE_DISABLED=1` is set. That is a product decision, outside this audit's report-only scope.

## 13. Recommendations

1. Before tagging, fix the three P1 items. Add an M1 entry. Replace line 906 with the `--ignore-scripts` install and digest check from the Bladebro guide. Restore the executable bit on `worktree-naming.sh`, or change line 915 to `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision <path>`.
2. Add one line each for M2 to M9, keeping their conditions: M3's partial result and M5's shell-safety reason.
3. Update lines 811 and 817 to the HEAD numbers, or pin them to a commit as line 807 already is.
4. Add a fallback caveat to the loop-ask section (D2).
5. Extend or relabel the line 823 list (D5).
6. Route B2 to the doctor overlay owner as a case-fold fix in `isUnderRootSkilled`.

## 14. Confidence and Limits

- **Confirmed by command**: D3, D4, D5, B1, the M1 live write, the `typed` rejection and the containment check. `git status` showed no lineage write outside `research/lineages/`.
- **Confirmed by code reading**: M1 to M9, D1, D2 and B2.
- **UNKNOWN**: the large suite totals, live cost and duration figures, and the "2 of 26 plain loop asks" figure.
- **Not exhaustive**: see the Divergence Map.

## 15. References

- `.skilled/changelog/skilled/v4.2.0.0.md`
- `scratch/window-commits.txt`, `scratch/recent-packets.txt`
- `research/lineages/codex/research.md` and `research/lineages/devin/research.md`, with their `iterations/iteration-001.md` to `iteration-010.md`
- `research/findings-registry.json` (merged, 32 key findings), `research/fanout-attribution.md`, `research/resource-map.md`

## 16. Convergence Report

- Stop reason: `maxIterationsReached` in both lineages (codex 10 of 10 in 76 minutes, devin 10 of 10 in 15 minutes).
- Total iterations: 20.
- Questions answered: codex 0 of 4. Devin closed all 4 on its own reading, without a graph answer.
- Convergence threshold: 0.05, never reached.
- Closeout evidence: the `synthesis_complete` row in `research/deep-research-state.jsonl` (`totalIterations: 20`). The closeout and gateway exit statuses were not captured, because zsh ignores `PIPESTATUS`. The gateway reported `projectionRefreshed: true`.
- Run events: one `stall_detected` warning on codex at 08:49Z (5 minutes with no lineage event), after which it finished normally. Per-iteration timeout was raised from 900 s to 1,800 s, and no iteration timed out.
- The topic did not converge, and this report does not claim it did.

## 17. Execution Audit

- Fan-out run `1795593886068-na5znl` exited 0, with both lineages `succeeded` and every failure class at 0.
- Every lineage state row carries `target_agent: "deep-research"`.
- The merge (`fanout-merge.cjs`) exited 0 with 2 lineages merged.
- Orchestrator checks were read-only, apart from this packet's files.
