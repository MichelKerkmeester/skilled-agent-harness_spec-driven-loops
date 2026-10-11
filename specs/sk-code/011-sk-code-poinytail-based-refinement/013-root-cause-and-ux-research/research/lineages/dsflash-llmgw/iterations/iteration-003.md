# Iteration 3: The test and canary cluster — stale pins against a growing tree

## Focus

Part 2's first cluster, each item confirmed by reading the code or running the check read-only: the `jev-transport-single` canary that defers, the compiled-route-admission `LIVE_CORPUS_SIZE` pin at 80 against 86 live scenarios, and the manifest tests at 26 pass / 16 fail. The thread connecting them is the question this iteration answers: why do three different suites fail against a tree that its own guards call fresh.

## Actions Taken

1. Located `jev-transport-single` in the cli-external-orchestration canary fixture; replicated the harness evaluation in memory (`compileRegistry` + `evaluateRoute`) and printed the decision for the case.
2. Compared the case against the cli-classifier hub's fixture and the cli-external `mode-registry.json` comment about where the transport axis went.
3. Ran `node --test .skilled/bin/tests/compiled-route-admission.test.cjs` and read the summary; counted the live gold corpus per hub through the admission module's own loader.
4. Read `.skilled/bin/tests/compiled-route-manifest.test.cjs` against `.skilled/bin/compiled-route-sync.cjs` and its `HUBS` list; counted the pinned hub-count assertions and the test total.

## Findings

1. **`jev-transport-single` defers because it is a stale case in the wrong hub, and its successor already lives in the right one.** The case expects `route`/single to `cli-jev` for the prompt "use jev choice to pick a queue", but the cli-external-orchestration hub no longer owns that destination: its `mode-registry.json` states "the transport-axis left with the cli-jev transport, which is now mode cli-jev of the cli-classifier hub". Running the fixture's own evaluation in memory returns `{"action":"defer","selectionReason":"no-match"}` while the case's expectation stays `route`. The cli-classifier fixture already carries the same prompt as `jev-choice-single` expecting route to `cli-jev`, so deleting the stale case loses no coverage. [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json:201] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:8] [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json:6] [SOURCE: git:7148389d98] [SOURCE: git:144b1d339e] — **CONFIRMED** (ran the evaluation; read both fixtures). **P1**: the canary suite reports a permanent failure that the merge record already tolerates as "the existing jev-transport-single failure", so every adopter running the canaries sees red and learns to ignore it. **Smallest fix**: delete the one case (`jev-transport-single`, ~14 lines) from the cli-external fixture — the successor `jev-choice-single` covers the behavior in the hub that owns it.

2. **The compiled-route-admission test fails exactly one test, and the failure is the pinned corpus size.** `LIVE_CORPUS_SIZE = 80` is a deliberate change-detector ("A change here means scenarios were added or removed, so the baseline report needs a rerun"), and the suite asserts the total gold scenario count across `DEFAULT_ON_HUBS` equals it. The live count is now **86** (sk-code 1, system-deep-loop 25, mcp-tooling 16, cli-external-orchestration 10, cli-classifier 4, sk-doc 26, sk-design 4), so the assertion fails `actual: 86, expected: 80`; a full read-only run reports `tests 29`, `pass 28`, `fail 1`, matching the round-four record. [SOURCE: .skilled/bin/tests/compiled-route-admission.test.cjs:32] [SOURCE: .skilled/bin/tests/compiled-route-admission.test.cjs:237] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/goal.md:93] — **CONFIRMED** (read the pin and the test; ran the suite; counted the corpus through its loader). **P1**: a permanently red suite hides new failures behind a known one. **Smallest fix**: set the constant to 86 and rerun the baseline report the comment requires — one constant plus the report it points at.

3. **The manifest tests' 16 failures have an identified, sufficient cause: the suite pins "all 6 hubs resolve" while the tree serves 7 hubs.** `.skilled/bin/tests/compiled-route-manifest.test.cjs` asserts `/all 6 hubs resolve/` at seven sites; `.skilled/bin/compiled-route-sync.cjs` emits `` `all ${HUBS.length} hubs resolve` `` and its `HUBS` list now holds seven entries including `sk-design`. The test file was last changed on 2026-09-20; `sk-design` became the seventh hub on 2026-09-22 (`7148389d98`), so these assertions have failed since then, independent of the epic — exactly what the round-four log records ("the manifest test (26 pass, 16 fail) fail at baseline with a fresh manifest too"). The suite has 42 tests, matching 26 pass + 16 fail. Only the seven `all 6 hubs` sites are enumerated here; the remaining failing tests cannot be enumerated without running the suite, and running it writes `.skilled/bin/tests/.sandboxes` outside this lineage's write boundary. [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:162] [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:461] [SOURCE: .skilled/bin/compiled-route-sync.cjs:51] [SOURCE: .skilled/bin/compiled-route-sync.cjs:1020] [SOURCE: git:7148389d98] — **CONFIRMED** for the pinned text, the 7-entry list and the timeline; **INFERRED** that these sites account for the recorded failures. **P1**. **Smallest fix**: make the test read the count instead of pinning it — replace `all 6 hubs` with `all \\d+ hubs`, the shape the CLI already prints.

4. **The three failures share one producing mechanism: literals that pin a count or membership of a growing set, owned by another file, with no reader that keeps them in step.** The hub set grew 6→7 (manifest test), the scenario corpus grew 80→86 (admission test), and the destination set moved between hubs (canary fixture) — in each case the producer updated and the consumer did not, and nothing links them. The repo already prefers derived values elsewhere (the sync message derives from `HUBS.length`; the compiled-route guard derives freshness from the manifest library), so this is drift, not an absent capability. [SOURCE: .skilled/bin/compiled-route-sync.cjs:1020] [SOURCE: .skilled/bin/compiled-route-guard.cjs:1] — **CONFIRMED** (read). **P1 by external-user impact**: three red suites with three different causes and no shared explanation is the first thing an adopter sees. **Smallest fix**: none beyond findings 1-3 — do not add a meta-checker; fix the three consumers to derive from their owners.

5. **The accepted-failure practice let the stale canary survive.** The merge commit lists the canary failure as "the existing jev-transport-single failure" beside otherwise-green verification, and no record names an owner or an expiry for it. The compiled-route guard has an exemption mechanism for hubs mid-restructure with a printed expiry ("an excused hub is still not serving compiled routing — the exemption records that the team accepted that, not that the problem stopped existing"), but canary cases have no such discipline. [SOURCE: git:144b1d339e] [SOURCE: .skilled/bin/compiled-route-guard.cjs:21] — **CONFIRMED** (read). **P2**. **Smallest fix**: when a known failure is named in a commit or log, name its owner and the fix in the same line — a commit-message rule, no tooling.

## Ruled Out

- **A cross-suite registry that binds pinned counts to their owning lists.** Rejected under `.skilled/repo-rules/prevent-overengineering.md`: three literals across three test files are cheaper to fix directly, and the registry would be a new layer with no caller once they are fixed. If a fourth instance appears, the calculus changes; two occurrences already exist in favor of a lint, but the smallest complete fix today is the three edits.
- **Running the manifest suite with a redirected sandbox to enumerate all 16 failures.** The sandbox root is hardcoded to `.skilled/bin/tests/.sandboxes`; redirecting it requires editing a copy of the suite, and the suite spawns CLIs that can touch live serving paths. Under this lineage's write boundary the correct action is to stop at the recorded count and the identified sufficient cause, and to name the run as the confirming step in the phase.

## Dead Ends

- Searching for a runner that reports "hub canaries" as a named suite found only the per-hub harnesses and the calibration corpus; the failure is real in the fixture evaluation (reproduced in memory) even though no single command prints the suite name the merge used.

## Edge Cases

- Ambiguous input: "manifest tests report 26 pass and 16 fail" could mean the leaf-manifest suite; the round-four log names the compiled-route manifest test by adjacency to the admission test, and the counts match that file's 42 tests. Selected interpretation recorded; the leaf-manifest suite currently passes `checked=14 fresh=14 failed=0`.
- Contradictory evidence: none. The suites genuinely fail; the routing guards genuinely pass.
- Missing dependencies: the manifest suite cannot be run within the write boundary; recorded as the confirming step rather than skipped silently.
- Partial success: all three named items are confirmed; the 16-failure enumeration is partial. `Status: complete`.

## Questions Answered

- Q5 (first half): What are the root causes of the open test and canary issues: the jev-transport-single canary deferral, the compiled-route-admission LIVE_CORPUS_SIZE 80 pin against 86 scenarios, and the manifest test failures? — answered for all three.

## Questions Remaining

- Q5 (second half: none — the advisor battery is Q6; note the question text already covers all three named items), Q6 to Q10.

## Sources Consulted

- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json:201
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json:6
- .skilled/skills/cli-external-orchestration/mode-registry.json:8
- .skilled/bin/tests/compiled-route-admission.test.cjs:32,237
- .skilled/bin/tests/compiled-route-manifest.test.cjs:162,461,474,505,651,881,899
- .skilled/bin/compiled-route-sync.cjs:51,1020
- .skilled/bin/compiled-route-guard.cjs:21
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/goal.md:93
- git:7148389d98, git:144b1d339e
- Command run: `node --test .skilled/bin/tests/compiled-route-admission.test.cjs` -> tests 29, pass 28, fail 1
- Command run: in-memory `compileRegistry` + `evaluateRoute` on the cli-external fixture -> `jev-transport-single` action defer, expected route

## Assessment

- New information ratio: 0.90
- Questions addressed: Q5
- Questions answered: Q5

## Reflection

- What worked and why: replicating the canary harness evaluation in memory and running the admission suite read-only turned three "reported" issues into reproduced mechanisms with exact expected/actual values.
- What did not work and why: the manifest suite cannot be executed inside the write boundary, so its 16 failures are identified by a confirmed sufficient cause rather than a full enumeration; the boundary is the right constraint, and the confirming command is named for the phase.
- What I would do differently: check the fixture/test ownership first for canary issues, since the same "consumer not updated with producer" pattern has now produced three failures in one cluster.

## Recommended Next Focus

Iteration 4: the advisor cluster — the probe battery at 13 of 17 with path-in-prompt false positives, and the never-passed `--surface-hint` that lets keyword ties fall back to a fixed surface order. Read the advisor's scoring path and the battery fixture, reproduce at least one false positive read-only, and find where the hint would be passed but is not.
