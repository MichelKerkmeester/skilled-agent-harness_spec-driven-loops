# Iteration 9: Confirmation pass on open severity questions

## Focus
Confirmation pass, widened past source reads to runtime probes, tests and vendor docs, because the stop was blocked on low source diversity. Five questions: advisor self-heal of an empty or corrupt `skill-graph.sqlite`; whether a failed `skill_graph_scan` exits non-zero; cross-lineage frontier id collisions and who reads the merged frontier; Claude Code visibility of Stop-hook stderr; the win32 signal-stop P2.

## Actions Taken
1. Runtime probe: pointed `SYSTEM_SKILL_ADVISOR_DB_DIR` at scratch directories holding a 0-byte and a 4 KB random-bytes `skill-graph.sqlite`, then ran `advisor_recommend` against each.
2. Runtime probe: ran `skill_graph_scan --trusted --format text` once against an absent database and once against a DB dir that is a regular file, reading each exit status.
3. Source trace: `nextNodeSerial`, `partitionFrontierNodes`, `mergeResearchFrontier`, the merged registry write and the convergence store read.
4. Vendor docs: fetched the Claude Code hooks reference (characters 0 to 100000 only).
5. Source trace plus pinned test for the win32 stop path: `processStartOf`, the spawn row, `classifyLineagesForStop` and the stop summary.

## Findings
1. **Re-grade f-iter008-001: stays P3, confirmed by runtime.** The advisor rebuilds both an empty and a corrupt graph on its own. After one `advisor_recommend`, each scratch database held 15 `skill_nodes` and had grown to 294912 bytes. Only the random-bytes file left a `skill-graph.sqlite.<ms>.corrupt` backup, which matches the quick_check recovery [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:383]. The empty file was filled by the normal open, schema create and index path [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:387]. That mechanism is [INFERENCE: inferred from the missing .corrupt backup and the node count]. The condition that would have raised the provisioning finding to P2 is resolved negative. The tree does report ready on an existence check only [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:809], but the first advisor call heals it.
2. **Q2 answered: a failed scan exits non-zero on both failure paths.**
   - Handler path: the scan catch returns `errorResponse` [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:67], whose envelope is `status: 'error'` [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/response-envelope.ts:47]. The scan job ORs that into `isError` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1465], and the CLI returns `EXIT_RUNTIME` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1702]. This path was traced, not run.
   - Transport path: run with a DB dir that is a file, it exited 75 and printed `ERROR: backend unavailable: daemon launcher exited with code 1`, through `exitCodeForError` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1033].
   - Control: a scan against an absent database exited 0 with `skill_graph_scan: completed`. So the pre-scan `advisor_status` step does not mark a fresh worktree failed.
   - Effect: f-iter008-002 stays P3. The failure is detected, and only its reason is lost to `/dev/null` [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:806].
3. **Frontier node ids can collide across lineages at depth 2 and below; no current consequence shown.**
   - Ids are minted as `F-<depth>-<serial>` from the lineage's own store [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:831], with the serial set to the highest seen plus one [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:280]. Depth-1 nodes are dealt round-robin from one base store [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:483]. Example: a lineage dealt F-1-001 and F-1-003 mints F-2-004 and then F-2-005, while a lineage dealt F-1-002 and F-1-004 mints F-2-005.
   - The merge keeps a `lineage` label on every node, so colliding nodes are listed separately rather than folded together.
   - The partition guard's flat `reported` set [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:803] checks only dealt depth-1 ids, which a child id cannot equal.
   - Masking needs a lineage that mints its own `F-1-*` id. The seed path at [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:926] could do that for a lineage dealt zero nodes, because `writeLineageFrontierStore` writes nothing then [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:633]. That case is [INFERENCE: not shown; it needs a seed step to run inside a lineage].
   - Severity: none raised.
4. **f-iter008-003 stays P3, but "report-only" is NOT confirmed.**
   - `convergence.cjs` reads only the store next to its own state log [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1383]. A partition-guard failure only writes a stderr warning [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1906].
   - However, the merged registry is written as `findings-registry.json` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1732]. That is the same name as the YAML's `state_paths.registry` [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:218], whose `registry.frontier` drives the expansive gates [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1388].
   - It is unverified whether a base-directory loop step, such as `--extend` after a fan-out, reads the merged frontier with untrusted nodes counted. If one does, this becomes a logic defect rather than doc drift.
5. **Re-grade f-iter007-001: stays P3, confirmed with a second, vendor source.** The Claude Code docs state "Claude never sees stderr from a hook that exits 0. To read it yourself ... enable debug logging" [SOURCE: https://code.claude.com/docs/en/hooks]. `session-stop` always exits 0 [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:903], and the auto-record result goes to `hookLog` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:217]. So the outcome reaches only the debug log. The nudge, by contrast, is sent as a stdout `systemMessage` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:772], which the docs call a "Warning message shown to the user". Caveats: the fetched page section said nothing about verbose mode, and the Stop-specific section was past the part read.
6. **Re-grade f-iter004-001: stays P2, evidence strengthened.**
   - Trace: on win32, `processStartOf` returns '' [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1279]. The spawn row then omits `process_start` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5707], so `lineageIdentityRefusal` returns `no_recorded_identity`. That reason is not `identity_unreadable`, so no group search runs, and the lineage is refused [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1408]. Only `live` lineages are signalled [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1037]. The refused lineage is then counted a survivor and gets no `stopped` row [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5264].
   - New point: the win32 branch in `signalStoppingLineage` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1419] cannot be reached for a lineage this runner spawned on win32. That shows win32 stop support is intended and now dead.
   - The same row shape is pinned by test: a spawned row with no `process_start` is expected to be refused as `no_recorded_identity`, with the process left alive [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-stop-identity.vitest.ts:236]. The test was not run this iteration. It pins the behaviour for an older runner, which is also exactly what win32 now writes.
   - The functions are not exported, so the processStartOf stub was not cheap and was skipped.

## Ruled Out
- A unit stub of `processStartOf`: `classifyLineagesForStop`, `lineageIdentityRefusal` and `processStartOf` are not in `module.exports`. The pinned vitest case covers the same row shape.

## Dead Ends
- None new.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: Finding 4. The iteration-8 inference "report-only" conflicts with the shared registry filename, so the question stays open.
- Missing dependencies: no `timeout` binary on macOS, so the probes ran without it. Only the first 100000 characters of the hooks doc were read.
- Partial success: Q5 (win32) is confirmed by trace plus a pinned test, not by a run on Windows.

## Observations
- The probes started advisor daemons bound to the scratch DB directories under the session scratchpad. They touch no repository file.
- The WebFetch hook flagged one fetched section as instruction-like. It was treated as data, and nothing was acted on from it.

## Sources Consulted
- .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:236, :383, :387
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:956, :1442-1467, :1702
- .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:53-72
- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:280, :831, :926
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:786-814, :1732, :1906
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:483, :633, :1026-1039, :1278-1335, :1395-1420, :3095-3119, :5255-5285, :5698-5710
- .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-stop-identity.vitest.ts:215-238
- .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:217, :772, :903
- .skilled/hooks/injection-contract.md:255
- https://code.claude.com/docs/en/hooks
- Runtime probes: four advisor runs and two scan runs under the session scratchpad

## Assessment
- New information ratio: 0.67. This is a confirmation pass: 2 of 6 findings are fully new (the scan exit paths and the frontier id collision), and 4 strengthen or re-grade earlier findings.
- Questions addressed: Q2 (deep-loop runtime), Q3 (skill advisor), Q4 (session hooks), Q5 (operator UX).
- Questions answered: none newly. All five were already ticked. This pass settles their open severity questions.
- Re-grades: f-iter008-001 P3 (held, P2 ruled out); f-iter008-002 P3 (held); f-iter008-003 P3 (held, report-only unconfirmed); f-iter007-001 P3 (held, now two sources); f-iter004-001 P2 (held, strengthened).

## Reflection
- What worked and why: runtime probes through the DB-dir override settled the self-heal question in one run. Source reading could not have done that, because the heal goes through the daemon rather than through `initDb` alone.
- What did not work and why: the planned processStartOf stub, because the stop functions are module-private.
- What I would do differently: grep the merge's output path before calling a structure report-only.

## Questions Answered
- None newly. The open severity questions under Q2-Q5 are settled as above, except for the merged-frontier read in Finding 4.

## Questions Remaining
- Does any base-directory step after a fan-out merge read `registry.frontier` from the merged `findings-registry.json`?
- Can a lineage dealt zero frontier nodes seed its own `F-1-*` ids?

## Recommended Next Focus
Settle Finding 4: trace whether a base-directory loop step after `fanout-merge` reads `{artifact_dir}/findings-registry.json` `frontier` (deep-research.yaml:1388, :1222, and the `--extend` path in workflow-steps.cjs). If it does, re-grade f-iter008-003 to a logic defect. If budget remains, run `tests/unit/fanout-stop-identity.vitest.ts`. Then move to synthesis.
