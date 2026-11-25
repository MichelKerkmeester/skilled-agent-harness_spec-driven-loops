# Iteration 9: Consolidated Audit

## Focus

Consolidate every finding from iterations 1 to 8 into the final MISSING, DRIFT and BUG tables, check that no later iteration superseded an earlier finding, and mark the three remaining key questions answered with their caveats. Selected interpretation: a finding is superseded only when a later iteration proved its claim false; a finding whose evidence was strengthened stays, with the stronger evidence named.

## Actions Taken

1. Re-read all sixteen findings recorded through the gateway and checked each against the later iterations' evidence.
2. Grouped them by classification and severity, with the commit, the `file:line` and the notes line for each.
3. Checked that the four key questions each have the evidence needed to close, and recorded the caveat that limits each answer.

## Findings

No new findings. The consolidated tables below restate the sixteen findings already recorded; none was superseded, and three were strengthened by later evidence.

### Final MISSING table (10)

| # | Severity | Commit | Surface | File:line | Notes line |
|---|---|---|---|---|---|
| 1 | P1 | `d57563b175a` | Stop-hook auto-record of queued answers | `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` | 194 |
| 2 | P1 | `527fc5f9d43` | Lexical anchor narrowing in advisor scoring | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` | 436 |
| 3 | P2 | `c06a73d348e`, `413d3268b8a`, `3395b32f6b1` | Playbook run recording and `--reports` | `.skilled/skills/sk-doc/SKILL.md` | 479 |
| 4 | P2 | `6dc1960f945`, `a5f104ca9ae`, `76f5e2dd36a` | sk-code browser evidence through the hub | `.skilled/skills/sk-code/SKILL.md:154` | 686 |
| 5 | P2 | `957f47570f3` | Advisor skill graph built at worktree provision | `.skilled/skills/sk-git/scripts/worktree-naming.sh` | 742 |
| 6 | P2 | `991fe6d127a` | Compiled hub front doors read the task on stdin | `.skilled/skills/sk-code/ROUTER.md` | 424 |
| 7 | P2 | `b0b3c8d9bf1` | Two levels of named sub-tracks | `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | 829 |
| 8 | P2 | `613fe6e5d57`, `80c008bc851`, `e643bdf44e3`, `385f43c6019`, `dfbf0f0745f`, `260f50e9916` | `/deep:review` target forms | `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:579-626` | 158 |
| 9 | P2 | `31ef87dfc7b` | Pi default-model ordering | `.pi/settings.json` | 332 |
| 10 | P2 | `571575632a4` | sk-doc security-phrase routing | `.skilled/skills/sk-doc/hub-router.json` | 476 |

### Final DRIFT table (5)

| # | Severity | Claim | Commit that moved it | File:line | Notes line |
|---|---|---|---|---|---|
| 1 | P1 | The loop-ask gate no longer holds for the Python fallback | `73d98332fff` | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4602-4624` | 494 |
| 2 | P2 | Python scorer test rows conflict (130 vs 138) and neither describes HEAD | `73d98332fff` | `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | 807, 811 |
| 3 | P2 | "Spec folders (10)" omits four packets that shipped work | `d57563b175a`, `957f47570f3`, `527fc5f9d43`, `c06a73d348e` | `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt` | 924 |
| 4 | P2 | "Overlay guard suite 20 of 20" is 21 of 21 at HEAD | `3bfd5e111fc` | `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs:412` | 817 |
| 5 | P2 | The component list omits `sk-code` and `sk-doc` | `6dc1960f945`, `76f5e2dd36a`, `ab45d376ce1` | `.skilled/skills/sk-code/changelog/v3.12.5.0.md` | 823 |

### Final BUG table (1)

| # | Severity | Defect | Commit | File:line | Notes line |
|---|---|---|---|---|---|
| 1 | P2 | The `typed` mark is dropped when a run row normalizes onto an existing owner row, contradicting the comment at 4562 | `73d98332fff` | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:3338-3362` | 494 |

### Supersession check

- No finding was superseded. Finding 2 of iteration 1 (the Python fallback DRIFT) was confirmed in iteration 4 by reading the gate and the normalization path; finding 1 of iteration 2 (the Python test rows) was strengthened by the 26-to-22 test-function count; finding 1 of iteration 5 (the overlay guard) was strengthened from a file count to a run result.

## Verified Claims (not findings)

The verification ledger now covers: all ten notes sections; the 64 feat commits and the user-visible fix clusters; the 20 breaking-change items; the 21 recent packets; the advisor lane weights and refusal flags; the doctor counts (17 commands, 26 setup rows, 6 advisor targets, 5 install steps, 66 scenarios); the overlay layout, relayout and adopt contracts; the OpenCode 2.3.2 pin, two-mode helper and 18-subcommand shim; the browser pins (Bladebro 4.8.2, bdg 0.6.10) and the eight-hub router; the lockfile package counts (111 and 313); the removal of `--allow-single-lineage`, `opencode2`, `cli-orca`, `dualPlugin` and `nativeDual`; the frontier admission order, budget formula and band carry; the pass-evidence rules; the blocked-stop streak; the gateway identity fields; the 47-row residue allowlist; and all 63 internal anchor links.

## Ruled Out

The audit ruled out drift in the Deep Loop, Fan-Out, Dispatch, Overlay, OpenCode and Browser sections' sampled claims, in every counted total that could be reproduced, in the cited versions, and in every one of the twenty breaking-change items. It also ruled out a second BUG across the fan-out stop path, the frontier arithmetic, the pass-evidence judge and the overlay adopt path.

## Dead Ends

- Large suite totals (advisor 2,450/3,557, deep-loop 4,039, doctor 1,673+19) and the live cost figures remain UNKNOWN because reproducing them needs a suite run outside the lineage write boundary.
- The "2 of 26 plain loop asks" analysis figure has no committed corpus and stays UNKNOWN.

## Edge Cases

- Ambiguous input: none new.
- Contradictory evidence: the Python scorer rows contradict each other; both values are reported and HEAD is marked UNKNOWN.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- All sixteen findings in `research/deep-research-state.jsonl` and `research/deltas/iter-001..008.jsonl`
- `.skilled/changelog/skilled/v4.2.0.0.md` (all sections)
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt`, `recent-packets.txt`

## Assessment

- New information ratio: 0.10
- Questions addressed: Q1, Q3, Q4 (closed with caveats)
- Questions answered: Q1, Q3, Q4

## Reflection

- What worked and why: grouping the findings by classification and checking each against the later evidence produced a table a release manager can act on without re-reading the iterations. The supersession check showed every earlier finding survived, which is the expected shape when each was verified at the time it was written.
- What did not work and why: nothing failed; the iteration is a synthesis pass, so its ratio is the simplicity bonus rather than new evidence.
- What I would do differently: run the consolidation one iteration earlier when the last two iterations produce no new findings, so the run does not spend a cap iteration on a restatement.

## Recommended Next Focus

No open question remains. The next iteration should record the audit as complete, confirm the artifact set, and hand the tables to synthesis.
