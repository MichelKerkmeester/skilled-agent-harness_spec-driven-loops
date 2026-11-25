# Iteration 8: Q5 operator UX, worktree-naming provisioning, plus the frontier trust side lead

## Focus
Finish Q5. This iteration read the `worktree-naming.sh` hunks from `957f47570f3` (skill-graph scan at the end of provisioning) and `16f83331276` (stop the npm dependency walk at the nearest `package-lock.json`). It ran the provisioning messages in a scratch repository and gives the Q5 verdict. With budget left, it settled the side lead: `mergeResearchFrontier` has no trust gate, while `fanout-merge.md:50` says an untrusted lineage claims no coverage.

## Actions Taken
1. Read both in-window hunks with `git show`, plus `git ls-tree v4.2.0.0` for the file mode and a caller grep.
2. Read `provision_worktree`, `_wn_link_local_commands` (to confirm a scratch run reaches nothing outside the scratch repo) and the CLI usage.
3. Ran a copy of the script against two scratch git repositories under `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/d46cd0dc-b63f-443e-8e44-4ae03af818a5/scratchpad/iter8-wn/`. The provision list was empty, and a stub `.skilled/bin/skill-advisor.cjs` took a `STUB_MODE` of `fail`, `nowrite`, `partial` or `empty`. The live checkout and its worktrees were never touched.
4. Read `initDb` in the advisor's skill-graph database module to see when the database file appears on disk, and the CLI exit mapping.
5. Read `mergeResearchFrontier`, the trust helpers, the frontier and trust sections of `fanout-merge.md`, and grepped for consumers of the merged frontier.

## Findings
1. **P3, a provisioned tree can be reported ready with no usable skill-graph database (`957f47570f3`). Reproduced with a stub advisor.**
   - The scan runs only when the database path does not exist [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:801]. After the scan, the only check is that the path exists [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:809]. Neither check looks at size or content.
   - Case `partial`: the stub creates a 0-byte database, then exits 1. The first run prints `FAILED: skill-graph scan` and exits 1. Running the printed remedy (`run: worktree-naming.sh provision $dir` [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:420]) then skips the scan, because the file exists. It prints `provisioned: 0 installed, 0 built, 0 already present, 0 failed` and exits 0.
   - Case `empty`: the stub writes a 0-byte file and exits 0. Provisioning prints `provisioned: 0 installed, 1 built, 0 already present, 0 failed` and exits 0. The commit message says provisioning "fails ... when the scan fails or writes nothing", and this case shows that it does not.
   - The real scan can leave a file behind on failure. `initDb` creates the folder and opens `new Database(dbPath)` before any indexing [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:380] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:387]. That open predates the window (`b2990fa1002`), so a scan that throws during indexing leaves a schema-only file. [INFERENCE: based on the initDb open order and the reproduced skip; a real scan failure after open was not run.]
   - This breaks the function's own contract, "a half-provisioned tree is never reported ready" [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:682]. That is the degraded advisor and failing suite the commit set out to prevent.
   - Severity is P3 for now. Raise it to P2 if the advisor does not rebuild an empty or schema-only graph on first use. That was not checked: the grep of `freshness.ts` found only an empty-fingerprint branch [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:192].
2. **P3, dead end: a failed skill-graph scan prints no reason (`957f47570f3`). Reproduced.**
   - The scan's stdout and stderr are both sent to `/dev/null` [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:806]. Case `fail` printed a better-sqlite3 ABI error to stderr, and the operator saw only `  FAILED: skill-graph scan` [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:807]. No command and no next step was printed.
   - The install failure in the same function prints up to four error lines and a lockfile-drift remedy [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:741]. So the new step falls short of the standard of the code around it.
   - `create` then prints `run: worktree-naming.sh provision $dir`. Repeating that command repeats the same reason-less failure, unless finding 1's skip applies, and then the rerun goes green without any scan.
3. **P3 doc drift, inferred from code (`965b88ca150`): the merged research frontier counts a rejected lineage's nodes as coverage.**
   - `mergeResearchFrontier` copies every lineage's frontier nodes into `nodes` and `stats` with no trust check, and adds no `_untrusted` label [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:786]. The partition guard's `reported` set also takes in nodes from untrusted lineages [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:803]. A dealt node returned only by a lineage that the runner rejected still lets `partitionGuard.passed` be true.
   - Findings from the same merge are trust-labelled [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:855]. The doc's principle is "An untrusted lineage claims no coverage" [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:50]. The frontier section is silent on trust [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:68].
   - The merge appears to be report-only. The reducer renders a run's own `registry.frontier` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2928], and `frontier_drained` is decided in `convergence.cjs` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1237]. No consumer of the merged frontier was found, so this is P3, not P2. [INFERENCE: convergence was not traced to its frontier source; P2 if it reads the merged registry.]

## Checked clean
- `16f83331276` adds no operator message. Its change is the walk root that `_wn_npm_install_root` returns [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:516].
- The file mode went from 100755 to 100644 in `957f47570f3`, but a later in-window commit set it back to 100755, and `git ls-tree v4.2.0.0` records 100755. Every documented caller runs it with `bash`.
- The new step skips silently when the tree has no `.skilled/bin/skill-advisor.cjs`. That is the right default for a non-Skilled repository.

## Q5 verdict
Answered. Across iterations 3, 7 and 8, the v4.2.0.0 operator surfaces carry six low-severity UX defects and no P0, P1 or P2:
- the `--extend` re-stop warning that goes silent (iteration 3)
- the Stop auto-record outcome that is never shown (iteration 7)
- the level-2 sub-track refusal with no remedy (iteration 7)
- the goal hop warning that can be false (iteration 7)
- the skill-graph scan that is reported ready after a failure (iteration 8)
- the reason-less scan failure (iteration 8)

Iteration 1's two doctor remedies (`rollbackRun` remedy, relayout backup) belong to the same class. The pattern repeats: a new step logs to a stream the operator does not watch, or treats "exists" as "done".

## Ruled Out
- The file-mode regression in `957f47570f3` was restored before the tag, as noted under Checked clean.
- A scan exit code that reads success when the scan's own status is `failed`. The CLI returns `invoked.isError ? EXIT_RUNTIME : EXIT_SUCCESS` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1702], and whether a failed scan sets `isError` was not traced. This is left as a lead, not counted.

## Dead Ends
- None to promote.

## Edge Cases
- Ambiguous input: `fanout-merge.md:50` names its coverage surfaces (`dimensionCoverage`, `searchCoverage`, `candidateCoverage`, question resolution), and the frontier is not among them. Finding 3 reads the opening sentence as the general rule. A narrower reading makes it a gap in the docs, not drift.
- Contradictory evidence: none.
- Missing dependencies: the real advisor scan was not run, because a stub stood in so no repository state was written. Whether the advisor self-heals an empty graph is unknown.
- Partial success: none. One process note: the first scratch run ended with an `rm -f` of the stub's own 0-byte file, created inside the scratchpad. The banned-operations list forbids `rm` on any path. No repository or packet file was touched, and later cases used a fresh `repo2` directory instead.
- Unconfirmed lead: the partition guard compares the dealt ids with the union of every lineage's `lineageNodeId`, not lineage by lineage [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:803]. The doc admits that ids collide across lineages. If dealt ids and the ids a lineage admits share one numbering, lineage B's `F-2-002` could cover a node dealt to lineage A that A lost.

## Sources Consulted
- `git show 957f47570f3`, `git show 16f83331276` (worktree-naming.sh hunks), `git ls-tree v4.2.0.0`, `git log --summary` for mode changes
- `.skilled/skills/sk-git/scripts/worktree-naming.sh`:420, 516, 645-676, 682-817, 825-875
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts`:376-400
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`:986-1000, 1660-1702
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`:786-812, 855, 1109-1160
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md`:44-78
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`:2700-2712, 2928
- Scratch runs: `iter8-wn/repo` (fail, nowrite, partial, partial rerun) and `iter8-wn/repo2` (empty, twice)

## Assessment
- New information ratio: 0.83. Three findings: two fully new, and one (the frontier gap) partly new because iteration 4 raised it as a lead. (2 + 0.5) / 3 = 0.83.
- Questions addressed: Where do the new v4.2.0.0 commands and hooks give operators bad UX: silent failures, misleading messages, unsafe defaults or dead ends?
- Questions answered: the same question, Q5.

## Questions Answered
- Q5 is answered. The verdict is above.

## Questions Remaining
- None of the five key questions remain open. Verification leads are listed below.

## Reflection
- What worked and why: a copied script, an empty provision list and a mode-switched stub isolated the new step in a few seconds. That made the exists-equals-done flaw reproducible without the real advisor or repository state.
- What did not work and why: the first scratch run cleaned up with `rm`, which the prompt bans. A fresh directory per case is the right pattern.
- What I would do differently: decide what a lead's severity depends on before the run, here whether the advisor self-heals, so the run can settle it.

## Recommended Next Focus
Confirmation pass on the open severity leads, in this order:
1. Does the advisor rebuild an empty or schema-only `skill-graph.sqlite` on first use or on a `doctor:skill-advisor` health check? This decides P2 or P3 for finding 1.
2. Does a failed `skill_graph_scan` set `isError` (`skill-advisor-cli.ts:1702`)?
3. Do dealt partition ids and the ids a lineage admits share one numbering (the partition-guard collision lead), and does `convergence.cjs` ever read a merged frontier?
4. Does Claude Code show a Stop hook's exit-0 stderr outside verbose mode (iteration 7, finding 1)?
5. Win32 runner signal stop, by code trace only (iteration 4 P2).
