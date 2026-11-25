# Skilled v4.2.0.0 Release Notes Audit

**Audit of `.skilled/changelog/skilled/v4.2.0.0.md` against the work shipped in `v4.1.0.0..HEAD`**
Lineage `devin`, 10 iterations, stop reason `maxIterationsReached`. HEAD at audit: `c75200c504a`.

---

## 1. Executive Summary

The release notes are substantially accurate. Across ten iterations this audit checked all ten notes sections, the 64 `feat` commits and the user-visible `fix` clusters in a 1084-commit window, the 21 recently touched packets, the 20 numbered breaking-change items, every reproducible count, every cited version and all 63 internal anchor links. It found **16 gaps**: 10 user-visible changes the notes never mention, 5 claims the current code or docs contradict, and 1 code defect.

- **Two are P1**: the Stop-hook auto-record behavior is unmentioned, and the notes' loop-ask gate no longer describes the Python fallback at HEAD.
- **Fourteen are P2**: seven further unmentioned surfaces, four stale or incomplete counts/lists, one unmentioned test-count change, and one low-impact code defect.
- **No P0 was found.** No upgrade path is broken, no removal the notes announce is incomplete, and no internal cross-link in the notes is broken.

The largest single omission is the **review target forms**: six fixes change what `/deep:review <target>` accepts, and the notes never mention review targets, commit ranges or globs.

## 2. Scope and Method

- **Window**: `v4.1.0.0..HEAD`, 1084 non-merge commits, read from `scratch/window-commits.txt`.
- **Definitions**: MISSING = a user-visible change the notes never mention; DRIFT = a notes claim the current code or docs contradict; BUG = a defect in code changed in the window.
- **Method**: every section was mapped to commits; every `feat` commit was checked against a notes line; the `fix` commits were filtered by user-visible verbs and the survivors checked against the folded "Smaller fixes" blocks; every countable claim was checked against HEAD; one suite was run (overlay guard, read-only, temp fixture only).
- **Write boundary**: only the lineage directory was written. Suite runs that would write elsewhere were not performed, so their totals are marked UNKNOWN.

## 3. MISSING: User-Visible Changes With No Note Entry

| # | Severity | Commit(s) | Surface | Evidence | Notes line |
|---|---|---|---|---|---|
| 1 | P1 | `d57563b175a` | The Claude Stop hook records queued question-tool answers into the one bound packet | `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` (+179 lines) | 194 |
| 2 | P1 | `527fc5f9d43` | A skill counts as named only on a word few skills share; advisor 2.0.4.0 | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` | 436 |
| 3 | P2 | `c06a73d348e`, `413d3268b8a`, `3395b32f6b1` | Playbook run recording into `benchmark/reports/` and the `--reports` flag | `.skilled/skills/sk-doc/SKILL.md` | 479 |
| 4 | P2 | `6dc1960f945`, `a5f104ca9ae`, `76f5e2dd36a` | sk-code frontend verification routes browser inspection and page-speed claims through `mcp-browser-use` | `.skilled/skills/sk-code/SKILL.md:154` | 686 |
| 5 | P2 | `957f47570f3` | Worktree provisioning builds the advisor skill-graph database and fails provisioning when the scan writes nothing | `.skilled/skills/sk-git/scripts/worktree-naming.sh` | 742 |
| 6 | P2 | `991fe6d127a` | Seven compiled hub front doors read the task from stdin | `.skilled/skills/sk-code/ROUTER.md` | 424 |
| 7 | P2 | `b0b3c8d9bf1` | `create`, `validate` and `relocate` accept two levels of named sub-tracks | `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | 829 |
| 8 | P2 | `613fe6e5d57`, `80c008bc851`, `e643bdf44e3`, `385f43c6019`, `dfbf0f0745f`, `260f50e9916` | `/deep:review` target forms: root, glob, slashed ref, two-dot path, named scope list, open-ended and closed commit ranges | `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:579-626` | 158 |
| 9 | P2 | `31ef87dfc7b` | Pi default model restored to first in `enabledModels` | `.pi/settings.json` | 332 |
| 10 | P2 | `571575632a4` | A bare security-policy phrase no longer routes to the sk-doc README mode | `.skilled/skills/sk-doc/hub-router.json` | 476 |

## 4. DRIFT: Claims the Code or Docs Contradict

| # | Severity | Claim | What HEAD shows | Evidence | Notes line |
|---|---|---|---|---|---|
| 1 | P1 | "The advisor attaches a deep command only to a loop ask" with a long list of qualifying forms | The Python fallback keeps a `/deep:research`, `/deep:review` or `/doctor:deep-loop` row only when the prompt types that command. `73d98332fff` landed after the notes' last edit | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4602-4624` | 494 |
| 2 | P2 | Python scorer tests "130 passed" and "138 passed" | The two rows conflict, and neither describes HEAD: `73d98332fff` removed 273 lines and four test functions (26 to 22) after the notes' last edit. Exact HEAD count UNKNOWN | `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | 807, 811 |
| 3 | P2 | "Spec folders (10)" | 21 packets were touched in the window; only 9 of the 10 listed are among them, and four unlisted packets shipped user-visible work | `scratch/recent-packets.txt` | 924 |
| 4 | P2 | "Overlay guard suite 20 of 20" | `node --test` at HEAD reports 21 tests, 21 pass; the 21st landed 2026-11-21, before the notes' last edit | `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs:412` | 817 |
| 5 | P2 | "These components have their own entries" (14 named) | `sk-code` added three changelog entries and `sk-doc` one; neither is named | `.skilled/skills/sk-code/changelog/v3.12.5.0.md` | 823 |

## 5. BUG: Defect in Window Code

| # | Severity | Defect | Commit | Evidence | Notes line |
|---|---|---|---|---|---|
| 1 | P2 | The `typed` mark is dropped when a run row is normalized onto an existing owner row. `_apply_deep_loop_offer_gate` sets `rec["typed"] = True` (4624) and the comment at 4562 says the rename carries it, but `normalize_command_bridge_recommendations` copies only confidence, uncertainty, passes_threshold, `_kind_priority` and `_explicit_skill_match` from the top row (3338-3362). No in-repo consumer reads the field, so the impact is output fidelity and a false comment | `73d98332fff` | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:3338-3362,4562,4624` | 494 |

## 6. What the Notes Get Right

Every claim below was checked at HEAD and held.

- **Deep Loop**: `--depth-mode=expansive` and both frontier cap flags are documented and parsed; defaults are depth 3 and six children; the budget splits 50/35/15 and rolls down only; blocked stops are 2 for review and 3 for research; `blockedStop` and the `blocked_stop` row exist; `--extend` keeps session and generation and refuses fan-out and unfinished runs; pass evidence flags `future_stamp`, `no_reads_no_findings` and `batched_commit`.
- **Fan-Out**: `--preview`, `--status`, `--stop` and `--only-lineage` exist; a one-lineage matrix and a native lineage are refused; the stop waits 2.5 s and records `survivors`; `provider_cost_usd` is summed from lineage logs; the 20 MB cap yields `ENOBUFS` and no retry.
- **Dispatch and Safety**: `stream-json` with `iterations/iteration-NNN.out` and `.cost.json`; `SPECKIT_ALLOW_HOST_SESSION_EXECUTOR` relaxes only ancestry and env; setup errors exit 64; `APPEND_FAILED`, the sandbox `/tmp` guard, SIGHUP forwarding and the script interface contract all exist.
- **Skill Advisor**: four lanes at 0.42/0.28/0.13/0.12; both removed status flags exit 64; `confidenceFloored`, `untrustedLineages`/`_untrusted`, uuid and request-id masking all exist; depth words open no loop.
- **Installs and Overlays**: layout under `framework/` and `root/`; the 20-line `LAYOUT` cap; the `root/skilled` refusal; duplicate and escaping layout links exit 2; `docs=` audit; cache rules; `Next:` lines; `record-base --pin` refuses a commit with no top-level `.skilled`; adopt refuses `.env`, token-named and escaping sources; relayout restores everything on failure.
- **OpenCode**: pinned at 2.3.2 in the setup helper and the v2 battery; only `v2` and `check`; exactly 18 passthrough subcommands; `opencode` or `OPENCODE_BIN` only, any major but 2 resolves as `unknown`; `definePlugin` and `selfRegistered` have no aliases.
- **Browser Use**: Bladebro v4.8.2 and bdg 0.6.10; three modes; eight hub routers.
- **Skills and Worktrees**: 14 tracked skills; `cli-orca` gone from every mirror; the nested-lockfile install fix.
- **How It Was Checked**: 187 advisor test files at the pinned commit; 368 shared cases; 20 plugin files; 47 residue allowlist rows.
- **Upgrade Notes**: all twenty breaking-change items hold.

## 7. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat the notes' 10-folder block as the coverage list | It is metadata, not a coverage claim | `recent-packets.txt` vs notes line 924 | 1, 3 |
| Count `def test_` functions to reconcile 130 vs 138 | The Python file is a case-table harness, not one test per function | `test_skill_advisor.py` | 1, 2 |
| Read the two advisor suite totals (2,450 / 3,557) as a contradiction | The rows are labelled differently (with and without the loop offers) | notes lines 806-807 | 2 |
| Run the advisor, deep-loop or doctor suites to get HEAD totals | Each writes artifacts outside the lineage write boundary | dispatch write limit | 2, 5 |
| Treat every `fix` subject as a MISSING candidate | Most restate behavior the folded "Smaller fixes" blocks already describe | notes folded blocks | 6 |
| Read all 165 `fix(system-deep-loop)` commits in full | The subject filter plus the folded blocks reduced the set to a handful of clusters | `window-commits.txt` | 6 |
| Reproduce "2 of 26 plain loop asks" | No committed corpus carries that slice | `routing-accuracy/` | 7 |
| Use packet commit counts without filtering commit types | Research, plan and review commits share the packet path and would have produced false MISSING findings | packet logs | 3 |
| Treat the 595-file quality-gate figure as a tree count | It describes a gate scope, not the whole tree | `.skilled/skills/system-deep-loop` file count | 5 |
| Run an adopt or relayout against a real tree | Both write outside the lineage | dispatch write limit | 8 |
| Treat the Pi fix as DRIFT | It restores a default the notes never state, so it is MISSING | `.pi/settings.json` | 6 |
| Treat the sk-doc hub-vocabulary failure as a separate BUG | The commit is itself the fix and HEAD is consistent | `571575632a4` | 6 |

## 8. Divergence Map

- Saturated directions: none recorded; no divergent pivot ran.
- Pivots taken: 0. Pivot failures: 0. Audited overrides: 0.
- Remaining frontier: none (depth mode `default`).

## 9. Evidence Ledger

- **Commits cited**: `d57563b175a`, `527fc5f9d43`, `c06a73d348e`, `413d3268b8a`, `3395b32f6b1`, `6dc1960f945`, `a5f104ca9ae`, `76f5e2dd36a`, `957f47570f3`, `991fe6d127a`, `b0b3c8d9bf1`, `613fe6e5d57`, `80c008bc851`, `e643bdf44e3`, `385f43c6019`, `dfbf0f0745f`, `260f50e9916`, `31ef87dfc7b`, `571575632a4`, `73d98332fff`, `3bfd5e111fc`, `98b712cd248`, `46465394d97`, `ab45d376ce1`.
- **Commands run**: `git log`/`git show` over the window; `jq` counts on lockfiles, fixtures and the registry; `find` counts on the skill, doctor and plugin trees; `node --test` on the overlay guard suite; `node` convergence and reducer runs each iteration.
- **Not run (out of boundary)**: the advisor, deep-loop and doctor suites; `generate-context.js`; `validate.sh`.

## 10. Recommendations

1. **Before tagging v4.2.0.0**, add the four P1-adjacent items: the Stop-hook auto-record behavior, the lexical anchor narrowing, the Python fallback's narrowed offer gate, and the review target forms. The first two and the fourth are user-visible; the third makes an existing section inaccurate.
2. **Re-run the numbers the notes cite** at the release commit, or pin every row to its commit the way the advisor row already is. The Python scorer rows and the overlay guard row are demonstrably stale.
3. **Complete the two lists**: add `sk-code` and `sk-doc` to the component list, and either extend the packet list or label it as a subset.
4. **Fix the `typed` mark** by copying it in `normalize_command_bridge_recommendations`, or delete the comment at 4562 and the field if nothing should read it.
5. **Consider a note line for the worktree graph build and the Pi default**, since both change what a user sees after provisioning or on a Pi session.

## 11. Confidence and Limits

- Confirmed by command: the overlay guard count (21 tests, 21 pass), the file and package counts, the anchor links, the removals, and the cited versions.
- Confirmed by code reading: the behavior claims (fallback gate, review targets, `typed` mark, adopt refusals, restore contracts).
- UNKNOWN: the large suite totals (advisor 2,450/3,557, deep-loop 4,039, doctor 1,673+19), the live cost and duration figures, and the "2 of 26" routing-analysis number. Each would need a run or a corpus outside this lineage's write boundary.

## 12. Open Questions

None. All four key questions are closed; the UNKNOWNs above are evidence limits, not open questions.

## References

- `.skilled/changelog/skilled/v4.2.0.0.md` (926 lines)
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt` (1084 commits)
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt` (21 packets)
- `research/lineages/devin/iterations/iteration-001.md` .. `iteration-010.md`
- `research/lineages/devin/resource-map.md`
