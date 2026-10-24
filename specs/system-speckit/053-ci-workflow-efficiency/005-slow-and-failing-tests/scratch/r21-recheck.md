# R21 re-check

## Summary

| workflow | runs | failures | newest green streak |
|---|---|---|---|
| deep-loop-runtime | 40 | 14 | 0 |
| diagram-corpus | 40 | 12 | 3 |
| skill-advisor-stress | 40 | 10 | 7 |

note: deep-loop-runtime's newest-window failure 40080059696 ran on the Dependabot bump branch `dependabot/npm_and_yarn/dot-opencode/npm_and_yarn-08ff4441ac` (`e4af508`), not `main` — main's newest deep-loop-runtime runs are green; the zod 4.6.6 bump that trips `tests/unit/dependency-seams.vitest.ts` is the bump PR's problem, outside this packet.

note: the tables below predate seven workflow_dispatch runs of diagram-corpus at b2a1663ee9, listed at the end of the diagram-corpus table.

## deep-loop-runtime runs

| run id | createdAt | headSha | conclusion |
|---|---|---|---|
| 40080059696 | 2026-10-24T08:57:38Z | e4af508 | failure |
| 40027063796 | 2026-10-23T21:28:49Z | a0675c1 | success |
| 40026353683 | 2026-10-23T21:23:01Z | 3ab67b7 | success |
| 39909844320 | 2026-10-23T06:09:52Z | 8d13b35 | success |
| 39877603319 | 2026-10-23T00:21:11Z | 4505c33 | success |
| 39858029393 | 2026-10-22T21:32:03Z | 5b5f567 | success |
| 39843480132 | 2026-10-22T19:49:45Z | b1f6c78 | failure |
| 39782205245 | 2026-10-22T12:54:11Z | 6f0737b | success |
| 39663888236 | 2026-10-21T19:41:53Z | af1a187 | success |
| 39578213165 | 2026-10-21T09:36:00Z | 1bc000f | success |
| 39577580054 | 2026-10-21T09:31:07Z | db82fdf | success |
| 39462324917 | 2026-10-20T17:00:06Z | 7584ad7 | success |
| 39424040557 | 2026-10-20T12:40:05Z | 13209a6 | success |
| 39413468734 | 2026-10-20T11:13:54Z | 99f1c3c | success |
| 39406017254 | 2026-10-20T10:10:17Z | aa152a4 | success |
| 39390303098 | 2026-10-20T08:00:19Z | 356f614 | success |
| 39294766221 | 2026-10-19T17:30:55Z | fe1f8a9 | success |
| 39257991770 | 2026-10-19T13:11:06Z | 47371b4 | success |
| 39165172147 | 2026-10-18T20:50:50Z | be234e6 | success |
| 39028271054 | 2026-10-17T11:19:43Z | e2b2e39 | success |
| 39025144155 | 2026-10-17T10:30:21Z | 6528756 | failure |
| 39005080479 | 2026-10-17T05:07:05Z | 407de0d | failure |
| 38785788967 | 2026-10-15T18:27:35Z | 91c7486 | failure |
| 38740748176 | 2026-10-15T13:12:31Z | fd0be90 | failure |
| 38683830612 | 2026-10-15T04:53:20Z | 77e2e83 | failure |
| 38637564676 | 2026-10-14T21:06:00Z | 368ba62 | failure |
| 38604326479 | 2026-10-14T17:10:04Z | 3c66787 | failure |
| 38367288353 | 2026-10-13T08:08:51Z | d99ddaf | failure |
| 38363498956 | 2026-10-13T07:34:21Z | 0efd5a1 | failure |
| 38285694800 | 2026-10-12T17:39:46Z | db7ddae | failure |
| 38239841925 | 2026-10-12T11:00:11Z | 66e432f | failure |
| 38227230862 | 2026-10-12T09:01:37Z | b4d4e90 | failure |
| 38206184530 | 2026-10-12T05:01:38Z | f3b4e90 | success |
| 38177150804 | 2026-10-11T21:37:42Z | e59bfda | success |
| 38141281915 | 2026-10-11T12:57:51Z | 4edbf2c | success |
| 38131650255 | 2026-10-11T10:21:18Z | f03e48d | success |
| 38125911228 | 2026-10-11T08:45:07Z | 34fe5a5 | success |
| 38117503985 | 2026-10-11T06:16:04Z | d04df31 | success |
| 38074353356 | 2026-10-10T18:05:08Z | 5d9c970 | success |
| 38062364606 | 2026-10-10T15:07:54Z | bb20061 | success |

## diagram-corpus runs

| run id | createdAt | headSha | conclusion |
|---|---|---|---|
| 40027063626 | 2026-10-23T21:28:49Z | a0675c1 | success |
| 40026353737 | 2026-10-23T21:23:01Z | 3ab67b7 | success |
| 39611546340 | 2026-10-21T13:50:37Z | bfa19a5 | success |
| 39578213134 | 2026-10-21T09:36:00Z | 1bc000f | failure |
| 39462324448 | 2026-10-20T17:00:06Z | 7584ad7 | failure |
| 39424040505 | 2026-10-20T12:40:05Z | 13209a6 | failure |
| 39406017176 | 2026-10-20T10:10:17Z | aa152a4 | failure |
| 39390303117 | 2026-10-20T08:00:19Z | 356f614 | failure |
| 39165172090 | 2026-10-18T20:50:50Z | be234e6 | failure |
| 38785788224 | 2026-10-15T18:27:35Z | 91c7486 | failure |
| 38604325924 | 2026-10-14T17:10:03Z | 3c66787 | failure |
| 38363499141 | 2026-10-13T07:34:21Z | 0efd5a1 | failure |
| 38239841851 | 2026-10-12T11:00:11Z | 66e432f | failure |
| 38227230697 | 2026-10-12T09:01:37Z | b4d4e90 | failure |
| 38206184717 | 2026-10-12T05:01:38Z | f3b4e90 | failure |
| 38117504003 | 2026-10-11T06:16:04Z | d04df31 | success |
| 37517566786 | 2026-10-06T19:15:17Z | c5a1f14 | success |
| 37198017795 | 2026-10-04T11:13:45Z | 93a83a4 | success |
| 37197250934 | 2026-10-04T11:00:39Z | eb71050 | success |
| 37146535750 | 2026-10-03T19:03:45Z | a543bfd | success |
| 37045551855 | 2026-10-02T18:09:35Z | 6f2139b | success |
| 36966427948 | 2026-10-02T04:52:14Z | 8684f06 | success |
| 36911218296 | 2026-10-01T19:01:27Z | 8a4f2ef | success |
| 36329234073 | 2026-09-27T15:21:14Z | d6e0388 | success |
| 36229595941 | 2026-09-26T08:22:43Z | 7f7e8f1 | success |
| 35277476946 | 2026-09-17T21:34:56Z | fd8c3ae | success |
| 35277453824 | 2026-09-17T21:34:40Z | fd8c3ae | success |
| 35203313521 | 2026-09-17T09:06:34Z | c22d1b6 | success |
| 35203256554 | 2026-09-17T09:05:58Z | c22d1b6 | success |
| 34643502335 | 2026-09-11T20:18:20Z | 6d29407 | success |
| 34643500197 | 2026-09-11T20:18:19Z | 6d29407 | success |
| 34636282501 | 2026-09-11T18:58:34Z | 46b0aaa | success |
| 34636275712 | 2026-09-11T18:58:29Z | 46b0aaa | success |
| 34624212891 | 2026-09-11T16:49:38Z | 7bb115b | success |
| 34581927315 | 2026-09-11T08:59:49Z | abce494 | success |
| 34581925140 | 2026-09-11T08:59:47Z | abce494 | success |
| 34579572360 | 2026-09-11T08:31:02Z | ed5f102 | success |
| 34579568762 | 2026-09-11T08:30:59Z | ed5f102 | success |
| 34579416459 | 2026-09-11T08:29:13Z | f269b0a | success |
| 34579413377 | 2026-09-11T08:29:11Z | f269b0a | success |
| 40094359622 | 2026-10-24T12:32:36Z | b2a1663 | success |
| 40094481195 | 2026-10-24T12:34:21Z | b2a1663 | success |
| 40094626777 | 2026-10-24T12:36:27Z | b2a1663 | success |
| 40094771974 | 2026-10-24T12:38:35Z | b2a1663 | success |
| 40094888712 | 2026-10-24T12:40:14Z | b2a1663 | success |
| 40095003840 | 2026-10-24T12:41:54Z | b2a1663 | success |
| 40095154965 | 2026-10-24T12:44:05Z | b2a1663 | success |

## skill-advisor-stress runs

| run id | createdAt | headSha | conclusion |
|---|---|---|---|
| 40089725675 | 2026-10-24T11:23:41Z | 1218b94 | success |
| 40080059819 | 2026-10-24T08:57:38Z | e4af508 | success |
| 40027063464 | 2026-10-23T21:28:49Z | a0675c1 | success |
| 40026353656 | 2026-10-23T21:23:01Z | 3ab67b7 | success |
| 39636944064 | 2026-10-21T16:40:55Z | f7cee04 | success |
| 39578213355 | 2026-10-21T09:36:01Z | 1bc000f | success |
| 39564216421 | 2026-10-21T07:45:20Z | 53fd0cb | success |
| 39554313820 | 2026-10-21T06:15:33Z | 05eeddb | failure |
| 39524217211 | 2026-10-21T00:55:17Z | f6f3e25 | failure |
| 39462324507 | 2026-10-20T17:00:06Z | 7584ad7 | failure |
| 39424040508 | 2026-10-20T12:40:05Z | 13209a6 | failure |
| 39406017248 | 2026-10-20T10:10:17Z | aa152a4 | failure |
| 39390303067 | 2026-10-20T08:00:19Z | 356f614 | failure |
| 39294766282 | 2026-10-19T17:30:55Z | fe1f8a9 | failure |
| 39165172075 | 2026-10-18T20:50:50Z | be234e6 | success |
| 39036260635 | 2026-10-17T13:22:03Z | 4a91de1 | success |
| 39025144156 | 2026-10-17T10:30:21Z | 6528756 | success |
| 39005465126 | 2026-10-17T05:13:24Z | 35c4c6d | success |
| 39005080414 | 2026-10-17T05:07:05Z | 407de0d | success |
| 38933048031 | 2026-10-16T16:34:42Z | 22a33af | success |
| 38845425641 | 2026-10-16T03:25:17Z | c6d6049 | success |
| 38844268727 | 2026-10-16T03:11:28Z | 64f3cbe | success |
| 38796714835 | 2026-10-15T19:47:18Z | 16bec24 | success |
| 38785788645 | 2026-10-15T18:27:35Z | 91c7486 | success |
| 38785057554 | 2026-10-15T18:22:19Z | 73e4bb6 | failure |
| 38604326126 | 2026-10-14T17:10:03Z | 3c66787 | success |
| 38363499177 | 2026-10-13T07:34:21Z | 0efd5a1 | failure |
| 38206184694 | 2026-10-12T05:01:38Z | f3b4e90 | success |
| 38157699699 | 2026-10-11T16:58:46Z | 994e487 | success |
| 38141281885 | 2026-10-11T12:57:51Z | 4edbf2c | success |
| 38128034992 | 2026-10-11T09:20:43Z | e5dba9d | success |
| 38125911233 | 2026-10-11T08:45:07Z | 34fe5a5 | success |
| 38117503910 | 2026-10-11T06:16:04Z | d04df31 | success |
| 37702181697 | 2026-10-07T23:25:24Z | ed922ea | success |
| 37641198370 | 2026-10-07T14:58:42Z | 5a7da04 | success |
| 37633711076 | 2026-10-07T14:04:50Z | 85fd28c | success |
| 37517567257 | 2026-10-06T19:15:17Z | c5a1f14 | success |
| 37338699648 | 2026-10-05T16:10:03Z | e0cebf4 | success |
| 37337835084 | 2026-10-05T16:03:36Z | 3d4458c | success |
| 37336152223 | 2026-10-05T15:51:09Z | 7c65ed8 | failure |

## Root causes

| workflow | failing test | error class | first failing SHA | action |
|---|---|---|---|---|
| deep-loop-runtime | tests/unit/check-contract-drift.vitest.ts | STALE_SOURCE_DIGEST | b4d4e90 | none needed now: the drift verdict is `fresh` on this tree, so nothing is regenerated; the fast-fail step added to the workflow fails the same fact in seconds |
| deep-loop-runtime | tests/unit/dependency-seams.vitest.ts | AssertionError: expected '4.6.6' to be '4.4.3' (zod pin drift) | e4af508 | filed: Dependabot bump branch, not main: run 40080059696 ran on e4af508271 (`dependabot/npm_and_yarn` PR #72, open); the zod 4.6.6 bump trips the pinned-version test, so the fix belongs to the bump PR and not to this phase; main's newest deep-loop-runtime runs are green |
| diagram-corpus | scripts/README.md | version outside the anchor era | f3b4e90 | none needed: closed on the newest green run 40027063626, and no file changed |
| skill-advisor-stress | stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts | TypeError: default is not a function | 7c65ed8 | none needed: closed on the newest green run 40089725675, and no file changed; the last failure is run 39554313820 (2026-10-21) and the next run is green |

## Contract drift

command: node .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs
drift-verdict: fresh
regeneration: not required
negative-proof: exit 2 then exit 0
diagram-corpus: closed on the newest green run 40027063626
skill-advisor-stress: closed on the newest green run 40089725675

## Stale failures

| workflow | failure date | failure SHA | failure run | later green run | verdict |
|---|---|---|---|---|---|
| repo-rules-corpus | 2026-09-18 | 6cbaf58 | 35341537918 | 38363499132 | closed |
| chart-corpus | 2026-10-12 | f3b4e90 | 38206184718 | 40027063521 | closed |
| opencode-dual-version | 2026-10-20 | 7584ad7 | 39462324333 | 40089318835 | closed |
| routing-registry-drift | 2026-10-24 | e3beac6, db30b0f | 40089268105, 40089318887 | 40089725657 (fix `1218b94938`; all 15 runs on that commit are `success`) | closed |

routing-registry-drift note: the planned failure was the 2026-10-17 `407de0d` run 39005080484. The newest failures are newer, 2026-10-24: `e3beac6` (the sk-code hub commit) and `db30b0f` (an OpenCode pin commit stacked on it), both `STALE COMPILED: skill-graph.json generated_at 2026-10-17 is older than the newest source stamp 2026-10-24 (sk-code)`. `1218b94938` regenerated the compiled graph. The operator ruled on 2026-10-24 to close the workflow on this evidence; the older 2026-10-17 failure is stale as well.
| strict-pass-freshness-report | 2026-09-07 | bbf1ffa | 34083691316 | 39200485518 | closed |

## No-retry proof

Scoped to the workflow files, because a search over the whole tree also matches this packet's own documents.

`rg -n 'retry|rerun|continue-on-error' .github/workflows/deep-loop-runtime.yml .github/workflows/diagram-corpus.yml .github/workflows/skill-advisor-stress.yml | wc -l`: 0.
`git diff -U0 -- .github/workflows | grep -cE '^\+.*(retry|rerun|continue-on-error)'`: 0.

retry-proof: clean

## Green streaks

Pulled 2026-10-24. diagram-corpus had 3 consecutive greens, so seven serial `workflow_dispatch` runs of it on main were dispatched and each waited on (40094359622, 40094481195, 40094626777, 40094771974, 40094888712, 40095003840, 40095154965), each `success`; these seven are dispatched reruns of the workflow, not natural runs. deep-loop-runtime and skill-advisor-stress have no `workflow_dispatch`, so they wait for natural runs. No failed run was rerun.

deep-loop-runtime: all_green=false count=10
diagram-corpus: all_green=true count=10
skill-advisor-stress: all_green=false count=10

deep-loop-runtime is red: its window holds run 40080059696 (the open Dependabot pull request, filed above) and run 39843480132 (push on main at b1f6c78, the stale-contract class that the fast-fail step now catches in seconds); the other eight runs are `success`.

skill-advisor-stress is not red. It has seven consecutive `success` runs, newest 40089725675, and its three older failures in the window (39554313820, 39524217211, 39462324507) are the fixed class. Its line turns true after three more natural post-fix runs push those failures out of the window, so the 10-run criterion is unmet for it until then and no `filed` row applies.

## Filed root causes

One Root causes row carries a `filed:` action, for deep-loop-runtime (the open Dependabot pull request). skill-advisor-stress has none, because it is not red.
