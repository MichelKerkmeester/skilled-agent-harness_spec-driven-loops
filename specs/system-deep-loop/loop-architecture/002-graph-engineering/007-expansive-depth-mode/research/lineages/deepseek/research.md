# Deep Research: trustworthy and identical fan-out orchestration (lineage deepseek)

Run: `fanout-deepseek-1795179440509-6d2wms`, generation 4, spec folder
`specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode`.
Code read at HEAD `b8003a7df42`. This lineage held frontier nodes F-1-002 (cross-CLI
execution contract), F-1-004 (frontier economics) and F-1-006 (bookkeeping that fires
on a healthy run), and worked six iterations to answer them.

Report only: no code or doc outside this lineage directory was changed.

## 1. Executive Summary

The fan-out orchestration at HEAD is structurally sound: the lineage's own six iterations
produced 30 cited findings, the gate receipts and reducer exited 0, the stop decision
returned `converged` on `all_questions_answered` with `STOP_ALLOWED`, and both mirror
gates (agent sync and command-tree parity) pass. The remaining trust gap is not
orchestration logic but **declaration drift**: the eight executor adapters decide the same
things differently and publish none of those decisions, the frontier spends its growth
budget first-come, and several bookkeeping checks cannot tell a legitimate many-to-one
refinement from a lost finding.

Fifteen changes are ranked below by value over effort. The first is a seven-field adapter
capability record with a four-assertion conformance test; it is S effort and makes the
other adapter changes safe. The next four are single-file fixes (sandbox round-trip,
refinement count, commit exclude, validator parser) that each retire a reproducible
false alarm or silent substitution.

## 2. Scope and Method

- Frontier share: F-1-002, F-1-004, F-1-006. Q1 (lineage honesty), Q3 (orchestration
  robustness) and Q5 (prior art) were dealt to other lineages and are not answered here.
- Inputs: the two conductor logs under `scratch/`, the archived generation-3 research and
  its `improvement-backlog.md`, and the code at HEAD.
- Delivered backlog rows 1-11, 14, 16b, 18a and 19-26 are treated as shipped. Every
  recommendation below is new, or is a refinement whose delta against the shipped row is
  named.
- Every finding cites `file:line`; the two checks that were run (mirror sync, matrix
  bijection) cite their command output in the iteration files.

## 3. Findings: Cross-CLI Execution Contract (F-1-002)

1. **`--sandbox-mode` round-trips for only three of eight kinds.** `runClaude` and
   `runResearchOpencode` honor `context.sandboxMode`; `runCodex`, `runLineageBuiltin`
   (cursor, devin, pi) and `runDeepseekHarness` hardcode `workspace-write`. A requested
   read-only dispatch becomes write-capable on five kinds and the audit row records the
   substitute. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:421]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:483]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:538]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:902]
2. **The iteration prompt travels over three undeclared channels.** argv for claude,
   cursor, opencode and pi; stdin for codex and dsh; a prompt file for vibe. No field
   publishes the channel and no size guard applies to the argv channel, although the
   dogfood prompts were 46k characters. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2721]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2792]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3368]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3587]
3. **Cost observability is one adapter's log shape.** `sumProviderCostFromLog` understands
   only opencode's `step_finish.part.cost`; claude and cursor request text, codex, pi and
   devin pass no format, and vibe writes an export. `provider_cost_usd` is honestly null,
   but `by_lineage` does not say which kinds cannot report cost. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:76]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4969]
4. **`needs_input` only fires on a text transcript.** `detectPendingQuestion` reads the last
   twelve non-empty lines and a trailing question mark, so JSON-log kinds cannot be
   classified `needs_input` while a prose-ending text run can false-positive. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs:186]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4779]
5. **"Session resume" is artifact resume only.** No builder forwards a resume flag;
   `EXECUTOR_SESSION_ENV_BY_KIND` is read solely by the recursion guard, and the rerun
   identity is the stored SPECKIT session. The four unlisted kinds have no session env,
   and dsh discards its per-attempt home. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:85]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1011]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3881]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4669]
6. **The adapter stress matrix has no row for these four differences.** Its fourteen rows
   cover auth, model/balance, rate-limit, timeout, stdin, child gate, sandbox, transport,
   budget, partial death, orphan, worktree, node_modules and self-invocation. The per-kind
   assertions are a `switch` in `adapter-suite.ts`, a second copy of each builder.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:18]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts:92]
7. **The mirror half does not reproduce.** `check-agent-mirror-sync.cjs --all` exits 0 with
   "11 agent(s) checked — all comparable mirrors in sync", and
   `validate-command-tree-parity.sh --quiet` exits 0. The absent command trees in
   `.codex`, `.pi`, `.dsh` and `.vibe` are the crosswalk's sanctioned shape. [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:31]

## 4. Findings: Frontier Economics (F-1-004)

1. **A depth band's spend is summed across its nodes.** `applyBandBudget` closes every open
   node in a band once the band's total visits reach its share, so one node's revisits can
   close a barely examined sibling. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:360]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:386]
2. **Growth slots are one run-wide cap filled in delta order.** `growthSlots = nodeCap -
   seeded`, and `admitProposals` walks rows in order. This run shows it live: F-1-002's two
   proposals filled the cap at iteration 1, after which this lineage's remaining nodes got
   "no child slots left". [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:515]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:828]
3. **Cross-lineage duplicate questions are invisible.** Each lineage's admission compares
   only its own store and known texts, while the partition deals only its share; the merge
   guard checks node ids. A re-worded sibling question passes both. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:423]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:755]
4. **Depth bands are reducer-only.** The node cap is band-blind, so all growth can land at
   depth 2 and spend the depth-2 share while depth-1 nodes are still open. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:438]
   [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2556]
5. **The held rows have a dependency order: 30+12, then 13, then 29.** Row 12 needs row 30's
   renderer; row 13 is safe only with the adapter contract; row 29 deletes aliases whose last
   reader is a branch row 13 removes. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/improvement-backlog.md:43]
   [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/improvement-backlog.md:60]

## 5. Findings: Bookkeeping on a Healthy Run (F-1-006)

1. **The refinement alarm is a count mismatch, not a loss.** The reducer folds a `refines`
   row into its target and records a transition; the closeout counts distinct iteration ids
   against distinct registry ids and alarms when the registry is smaller. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1004]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:373]
2. **The commit step excludes an already-ignored path.** `.legacy-projection-watermarks/`
   is in `.gitignore`, and `git add` refuses an exclude pathspec that names it, so a healthy
   run logs a warning and exits non-zero. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2158]
   [SOURCE: .gitignore:449]
3. **The closeout scopes the synthesis row to `parentSessionId`.** Every iteration record
   names the run's `sessionId` as `lineageId`, so the terminal row and the records it
   summarizes are scoped differently. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:280]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:294]
4. **Every contract-shaped record warns "Trusted evidence yield was absent".** The ledger
   schema requires the ratio, and the prompt pack does not list it, so the compatibility
   layer substitutes zero and warns on every iteration. This run's gateway receipts carried
   the warning on all six records. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:714]
5. **An iteration with findings but no answered question writes zero graph evidence.** The
   research evidence derivation requires a non-empty `answeredQuestions`; iteration 1 of this
   run inserted 0 nodes with 7 cited findings, and the evidence guards reported
   `notEvaluated` (a pass). Iteration 2 answered a question and the same command inserted 9
   nodes and 21 edges. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:357]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:481]
6. **The live run was healthy.** `orchestration-status.log` holds only `started`, `spawned`
   and per-minute progress rows with `failed: 0`; the reducer and both gateways exited 0.

## 6. Findings: Adapter Test Gating (F-2-007)

1. The cli-adapter stress suite is in the default `npm test` serial project and the
   deep-loop CI workflow runs it on the relevant paths, so the adapter contracts are gated.
2. `CLI_ADAPTER_CURRENT_MATRIX` overlays the phase-two and fanout rows; the live matrix has
   zero pending cells and the audit asserts it.
3. The matrix bijection validator fails at HEAD with **126 of 126 tests missing**: `vitest
   list` now prefixes lines with `[serial] `, and the parser keeps only lines starting with
   `tests/stress/...`, so it discovers nothing. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/validate-playbook-package.cjs:100]
4. No workflow runs that validator; the suite checks the audit object, not the test-name
   bijection, so the bijection half is ungated.

## 7. Findings: Rerun Identity (F-2-008)

1. `EXECUTOR_SESSION_ENV_BY_KIND` is detection-only: its sole reader is the recursion guard.
2. The only rerun identity is the stored SPECKIT session; no builder emits a resume flag, so
   `--only-lineage` re-reads artifacts and starts a fresh provider conversation.
3. The guard's env layer covers four of eight kinds, with the rest covered by stack,
   ancestry or lockfile layers; no table states that per kind.
4. The honest change is to name it artifact resume, and to capture a reported provider id
   only if model-session resume is actually wanted.

## 8. Recommendations, Ranked by Value over Effort

Ranks 1-9 are S effort and can land independently. Ranks 10-12 are S-M. Ranks 13-15 are M.
No recommendation re-reports a delivered row; where one refines a delivered row, the delta
is stated.

| Rank | Change | Evidence | Value | Effort | Risk |
|---|---|---|---|---|---|
| 1 | Add `ADAPTER_CAPABILITY_MANIFEST` (binary, promptChannel, outputFormat, costSource, effortSurface, sandboxSurface, resume) beside `EXECUTOR_KIND_FLAG_SUPPORT`, and a table-driven test over `EXECUTOR_KINDS` with four assertions: one prompt channel, sandbox round-trip or refusal, cost fixture, pending-question fixture | Findings §3.1-3.6 | H | S | L |
| 2 | Pass `context.sandboxMode` to `buildLineageCommand` in `runCodex`, `runLineageBuiltin` and `runDeepseekHarness`, or refuse the flag when the kind cannot honor it | §3.1 | H | S | L |
| 3 | Record `refinedFrom` ids on the registry target and count them in `registryEvidence`, so a refinement no longer trips `structured_state_findings_partially_reflected_in_registry` | §5.1 | H | S | L |
| 4 | Drop the `.legacy-projection-watermarks` exclude from `step_stage_artifact_dir`; `.gitignore` already excludes it | §5.2 | M | S | L |
| 5 | Make the bijection validator strip an optional `[project] ` prefix from `vitest list` output, and run it as a step in `deep-loop-runtime.yml` | §6.3-6.4 | M | S | L |
| 6 | Write a root-level question-digest file at deal time and add it to each lineage's `known-texts`, so a proposal that duplicates a sibling's question is pruned as `dedupe` | §4.3 | M | S | L |
| 7 | Publish `costSource` per kind in `effective_config` and label an unknown cost `unknown (kind cannot report)` instead of a bare null | §3.3 | M | S | L |
| 8 | Add `trustedEvidenceYield` to the prompt-pack record contract (distinct cited sources per finding, capped at 1) or derive it silently in compatibility | §5.4 | M | S | L |
| 9 | Read one config-owned `lineageId` in `runScope` instead of inferring it from `parentSessionId`, and use the same value in the leaf record | §5.3 | H | S | M |
| 10 | Derive FINDING and CITES evidence even when `answeredQuestions` is empty, attaching it to the active frontier node; report evidence guards as `insufficient`, not `passed`, when the graph has no evidence | §5.5 | H | S-M | M |
| 11 | Sort proposals before admission by parent depth, then fewest live children, so one node cannot spend the run-wide growth cap first-come | §4.2 | M | S | L |
| 12 | Add a per-node floor to a band close (`max(1, floor(bandShare / liveNodes))` visits) so a sibling's revisits cannot close an unexamined node | §4.1 | M-H | S-M | M |
| 13 | Rename the rerun contract to artifact resume; if model-session resume is wanted, extract the reported id from the JSON log shape, persist `providerSession`, and pass the adapter's resume flag | §7 | M | S (naming) / M (capture) | M |
| 14 | Reserve growth slots per depth band at admission, not only in the reducer projection | §4.4 | M | M | M |
| 15 | Make the convergence step verify one ANSWER edge per answered question before computing a stop, so a skipped per-iteration graph upsert names the missing step instead of blocking silently | §5.5 and this run's first stop attempt | M | S | L |

### Why this order

Ranks 1-3 are the cheapest trust wins: one table, one resolver, one registry field. Rank 4
and rank 5 retire warnings that fire on every healthy run, so they remove the noise that
hides the next real fault. Ranks 6-9 are still one-file changes but touch shared contracts
(the frontier admission, the effective config, the ledger record, the lineage identity),
so they need a review. Ranks 10-12 change how evidence and growth are counted and deserve
a test each. Ranks 13-15 are larger or depend on the earlier ones: provider resume needs
per-kind capture, band reservation needs the node floor to be meaningful, and the upsert
self-check needs the evidence derivation from rank 10.

## 9. Build Order for the Held Rows

The four held backlog rows are not in this lineage's top ranks because they are refactors,
not trust fixes. Their order is nevertheless decided by the findings above:

1. **Row 30 + row 12 as one change.** The shared `projectFrontier` parser and the per-node
   research dashboard are one projection and one renderer; splitting them leaves the
   dashboard blind to the band closes rank 12 fixes.
2. **Row 13 after rank 1.** Collapsing the six single-executor branches (and deleting
   `runClaude`/`runCodex`) is safe only once the capability table and its four assertions
   exist; otherwise the collapse can silently re-introduce rank 2's substitution.
3. **Row 29 last.** Deleting aliases, legacy migration and binary probes is safe only after
   rows 12 and 13 decide which keys and probes still have a reader.

## 10. What This Run Did Not Cover

- Q1 (lineage honesty signals), Q3 (process tree, quota reruns, root dashboard) and Q5
  (prior art) were dealt to the sibling lineage. This report does not answer them.
- No live CLI probe was run. The adapter findings are code-and-fixture claims; the two
  checks that were executed (mirror sync, matrix bijection) are named with their exit codes.
- The provider-cost claim is about extraction coverage, not about any provider's price.

## 11. Divergence Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none. The run used no divergent mode.
- Remaining frontier: none. All five nodes in this lineage's share are answered.

## 12. Open Questions

- Whether a per-node band floor should be one visit or a fraction of the band share.
- Whether the root question digest belongs to `fanout-run.cjs` at deal time or to
  `frontier-admit.cjs` at admission.
- Whether model-session resume is worth building for the kinds whose logs report an id.

## 13. Eliminated Alternatives

- **Raise the run-wide node cap.** It spends more iterations on the first-worked branch; the
  pruned questions were not low value.
- **Rank proposals by a model-written score.** The runner cannot audit a self-asserted
  score, which is the honesty problem this packet studies. Depth and live-child count are
  deterministic.
- **Add another mirror-drift gate.** Both mirror gates pass; the drift is in executor
  behaviour, not file mirrors.
- **Delete the synthesis_incomplete invariant.** The count mismatch is real for a lost
  finding; the fix is to teach it about refinements, not to remove it.
- **Treat the seed matrix's `pending` cells as live.** The overlay and the audit are the
  live state.

## 14. Sources

Code (all under `.skilled/skills/system-deep-loop/` unless noted):

- `runtime/scripts/fanout-run.cjs:423`, `:765`, `:2684`, `:2721`, `:2792`, `:3368`, `:3587`,
  `:3881`, `:3967`, `:4669`, `:4969`
- `runtime/scripts/dispatch-iteration.cjs:421`, `:483`, `:538`, `:902`, `:961`
- `runtime/scripts/frontier-admit.cjs:360`, `:386`, `:438`, `:515`, `:755`, `:771`, `:778`, `:828`
- `runtime/scripts/lib/cli-guards.cjs:186`
- `runtime/scripts/fanout-salvage.cjs:76`
- `runtime/scripts/upsert.cjs:357`, `:481`
- `runtime/scripts/convergence.cjs:1200`
- `runtime/scripts/synthesis-closeout.cjs:280`, `:294`, `:373`
- `runtime/scripts/reduce-state.cjs:1004`, `:1022`
- `runtime/lib/deep-loop/executor-config.ts:112`, `:159`
- `runtime/lib/deep-loop/executor-audit.ts:82`, `:85`, `:90`, `:163`, `:903`, `:1011`
- `runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:698`, `:714`
- `runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:325`
- `runtime/tests/stress/cli-adapter/matrix-manifest.ts:18`, `:131`, `:147`
- `runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts:92`
- `runtime/tests/stress/cli-adapter/validate-playbook-package.cjs:100`, `:116`
- `runtime/tests/stress/cli-adapter/fanout.vitest.ts:359`
- `runtime/vitest.config.ts:16`
- `runtime/package.json:1`
- `.skilled/commands/deep/assets/deep-research.yaml:2158`
- `.github/workflows/deep-loop-runtime.yml:90`
- `.github/workflows/playbook-operator-contract.yml:67`
- `.gitignore:449`
- `.skilled/bin/agent-mirror-crosswalk.md:31`

Packet:

- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/improvement-backlog.md:43`, `:60`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/scratch/dogfood-review-gen2.md`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/scratch/dogfood-research-gen3.md`

Lineage:

- `iterations/iteration-001.md` through `iterations/iteration-006.md`
- `deltas/iter-001.jsonl` through `deltas/iter-006.jsonl`

## 15. Convergence Report

- Stop reason: `converged`
- Reason detail: `all_questions_answered`
- Total iterations: 6
- Questions answered: 5 / 5
- Remaining questions: 0
- newInfoRatio trend: 0.79, 0.70, 0.75, 0.60, 0.75, 0.75
- Weighted stop score: 0.35
- Graph decision: `STOP_ALLOWED`
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots; the run used no divergent mode.

## 16. Resource Map Note

`resource-map.md` at the packet root is a fan-out root artifact and outside this lineage's
write surface. This lineage's own deltas carry the `sources` rows the merger reads, so the
report does not emit a root map and does not claim one.

Phase save (`generate-context.js --full-auto`) was not run: the dispatcher forbids it and it
writes continuity into packet docs outside this lineage. Continuity for this lineage is the
state log, the deltas and this report.

## 17. Method Note

The first stop attempt returned `BLOCKED` on `source_diversity_guard` (1.40) and
`uncovered_questions` (2) because this executor had skipped the per-iteration graph upsert
for iterations 4 and 5 while writing those iterations. Re-running the idempotent upsert for
both iterations added the missing ANSWER edges and the next stop returned `STOP_ALLOWED`.
That is a process lesson as much as a product one: the coverage graph is only as current as
the last upsert, and a conductor that omits the step sees a false block rather than a named
missing step. Rank 15 addresses the product side.

One init correction is recorded here rather than hidden: the config's `createdAt` was first
written from local wall-clock time (`13:57:00Z`), about 58 minutes ahead of the run's real
start. It was corrected to the gateway run-open receipt time, `2026-11-20T12:59:15.913Z`.
No stop decision depended on it (the run completed in 13 minutes against a 120-minute
budget), and no other field changed.
