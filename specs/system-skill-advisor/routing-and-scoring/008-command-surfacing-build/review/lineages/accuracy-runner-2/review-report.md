# Review Report: Command Surfacing Build — accuracy-runner-2 (pass two)

<!-- MACHINE-OWNED: lineage=accuracy-runner-2; sessionId=fanout-accuracy-runner-2-1794570021136-noekp0; generation=1; lineageMode=new; stopReason=maxIterationsReached -->

## 1. Executive Summary

- **Overall verdict:** PASS
- **hasAdvisories:** true
- **Active findings:** P0 = 0, P1 = 0, P2 = 12
- **Review scope:** the pass-two `accuracy-runner` area of `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`: the routing-accuracy harness, prompt corpora and committed baselines, transcript and offer tests, cost measurements, legacy fidelity tests and the manual-testing playbook. 31 area files plus the shared docs that describe them; 13 area files changed since pass one and 18 unchanged.
- **Operator review focus:** Code review of command surfacing, PASS TWO. First read the full instructions in the pass-two instructions file and follow them: for each pass-one finding in the accuracy-runner area, re-read the code and say whether the fix holds; review every file marked yes (changed since pass one) line by line for a defect the fix introduced; then look for new defects. Scope file lists area, path and changed-since-pass-one. Check behaviour on claude, codex, opencode, pi, devin and dsh; safety of offering a mutating command; holdout hygiene, so no tune, fix or report path reads or leaks holdout rows; docs that disagree with code. Never read or print holdout prompt text (split holdout in command-prompts.jsonl, or holdout-prompts.jsonl): counts only. Change no code, write only inside the lineage folder.
- **Headline:** eight of the nine pass-one findings this lineage raised hold; the ninth (the parent phase map) is only half fixed and is reported again. The changed code introduced no new P0 or P1. The pass-two findings are ten P2s about measurement attribution, process isolation, a run-log trust boundary, a restore edge, and four docs that disagree with the tree or the code.
- **Loop state:** `maxIterations=7` reached; the coverage graph was unavailable, so a legal graph-backed STOP was not claimable. Release readiness is `in-progress`, not `converged`.

---

## 2. Planning Trigger

`/speckit:plan` is **not required** for this lineage: there is no active P0, no active P1 and no failed binary gate. The twelve P2s are advisories for the remediation owner.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": 12,
  "remediationWorkstreams": 4,
  "specSeed": ["Close or annotate phase 007 in the parent phase map", "Correct the manual-testing-playbook inventory note, persistence path and tests-README description"],
  "planSeed": ["Fix the four harness advisories in one small group", "Add the missing tests named in the registry"],
  "findingClasses": ["measurement-correctness", "process-isolation", "security", "traceability", "maintainability", "correctness"],
  "affectedSurfacesSeed": ["runtime/scripts/routing-accuracy", "runtime/scripts/measure-brief-cost.mjs", "manual-testing-playbook", "runtime/tests/README.md", "spec.md"],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | Finding class | Scope proof | Affected surfaces |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `iter3-P2-phase007-open-evidence` | P2 | The pass-one phase-map finding is only half fixed: the reason lives in the phase child, not in the map the finding named | traceability | `spec.md:122` | Row 7 `In Progress` beside completed 008 and 010-013; reason only at `007/tasks.md:141` | A parent-map reader cannot tell an intentional deferral from a skipped phase | Add one sentence to row 7 or a note under the map naming the final behaviour arm | Active | traceability | Packet spec is the review target; the item was raised by this lineage | `spec.md`; `007/tasks.md:141` |
| `iter2-P2-g2-row-id-arm-mislabel` | P2 | A started-command row selected by `--row-id` is logged under the `pre` arm | correctness | `run-command-behaviour.mjs:974` | `armFor` keys only on `options.set`; `assertRunnable` accepts g2 ids | A 15-minute g2 turn joins the pre arm and skews the comparison | Derive the arm from the row id when the set is absent, or refuse `--row-id` g2 ids without `--arm` | Active | measurement-correctness | Runner and scorer in scope | run line; scorer bucketing |
| `iter2-P2-backfill-fixture-mismatch` | P2 | `--backfill` replays a g2 row with the default fixture even when the run used a custom one | correctness | `run-command-behaviour.mjs:1214` | Run uses `options.fixture`; backfill re-derives `g2-fixture` from its own log path | The replayed offer describes a prompt the turn never ran | Record the fixture path on the run line or add `--fixture` to the backfill | Active | measurement-correctness | Runner and backfill in scope | run log; `command-offer.mjs` backfill |
| `iter2-P2-capture-env-not-restored` | P2 | The capture leaves its environment projection installed after it returns | correctness | `capture-command-routing-baseline.mjs:361` | Five env vars written and four deleted; `finally` restores only `Date` and removes the temp dir | A second in-process score inherits a deleted DB dir and the fixture regime | Snapshot and restore `process.env` in the `finally` | Active | process-isolation | Capture module and its in-process caller | capture; slice test |
| `iter2-P2-cost-script-child-brief` | P2 | `measure-brief-cost.mjs` measures the child-session brief from a dispatched worker | correctness | `measure-brief-cost.mjs:167` | Hook env spreads `process.env`; renderer reads `AI_SESSION_CHILD` | The reported cost is the child brief, not the user brief | Strip `AI_SESSION_CHILD` (and state it) before spawning the hook | Active | measurement-correctness | Cost script and renderer branch | cost figures |
| `iter3-P2-backfill-log-code-execution` | P2 | `--backfill` executes the hook and advisor CLI from the directory a log line names | security | `command-offer.mjs:333` | `checkoutDir` comes from `locator.projectDir`; `warmCheckout` and `replayOffer` spawn from it | A crafted log selects the JavaScript the backfill runs | Require the log's directory to equal the audited checkout, or refuse a path outside the repo | Active | security | Backfill and its caller | backfill path |
| `iter4-P2-playbook-inventory-note` | P2 | The playbook's coverage note names a file convention and count the tree does not have | traceability | `manual-testing-playbook.md:40` | "41 `NNN-*.md`" vs 50 differently named files; same doc says 50 | Readers cannot reconcile the note with the tree | Replace the note with the live 50-file inventory or delete it | Active | traceability | Root playbook in area | playbook §1; inventory test |
| `iter4-P2-playbook-persistence-path` | P2 | The playbook's persistence contract names a folder the skill does not have | traceability | `manual-testing-playbook.md:30` | No `benchmark/` under the skill root; template names the skill's own folder | A scenario cannot be marked complete as written | Point at a real path or create the folder through the renderer | Active | traceability | Root playbook and skill tree | playbook §2; operator evidence |
| `iter4-P2-tests-readme-description` | P2 | `runtime/tests/README.md` calls the playbook inventory test a routing-fixture test | maintainability | `runtime/tests/README.md:154` | Test checks playbook rows and file inventory only | A maintainer adds the wrong artifact | Describe the test's actual checks | Active | maintainability | Table and test in area | tests README |
| `iter4-P2-row-id-session-mode` | P2 | The scorer README says `--row-id` narrows either mode, but session mode ignores it | traceability | `README.md:112` | Flag parsed then unused; `scoreSession` reads only locator/runtime/json | A silent flag and a wrong usage claim | Say "summary mode" or refuse the flag in session mode | Active | documentation-drift | README and CLI in area | README; scorer CLI |
| `iter5-P2-quoted-path-restore` | P2 | A file name git quotes cannot be restored, so one space stops the arm and leaves the file | correctness | `worktree-restore.mjs:54` | `git status --porcelain` prints `?? "a b.txt"`; no quote decoding; `rmSync` targets the quoted string | The leftover blocks the next arm until a human deletes it | Parse porcelain quoting (or use `-z`) before restoring | Active | correctness | Restore helper and caller | restore; next arm's dirty guard |
| `iter5-P2-scorer-header-ordered-report` | P2 | The scorer header promises an ordered read/write report the CLI does not print | maintainability | `score-command-transcripts.mjs:5` | Both modes print counts; the ordered stream is internal only | A maintainer searches for an output that does not exist | Narrow the header to the counts the CLI prints | Active | maintainability | Scorer in area | module header |

---

## 4. Remediation Workstreams

There are no P0 or P1 workstreams. The P2 advisories group by file for a single small change:

1. **Behaviour harness correctness** (4 items): `run-command-behaviour.mjs` arm derivation and fixture recording; `command-offer.mjs` log-path trust; `worktree-restore.mjs` porcelain quoting. One worktree, one test each.
2. **Measurement isolation** (2 items): `capture-command-routing-baseline.mjs` env restore; `measure-brief-cost.mjs` child-session env. Both are small `try/finally` or env-allowlist edits.
3. **Packet and playbook docs** (3 items): `spec.md` row 7; `manual-testing-playbook.md:30,40`; `runtime/tests/README.md:154`. Documentation-only.
4. **Scorer docs** (1 item): `README.md:112` and the scorer header. Documentation-only.

---

## 5. Spec Seed

- Add a sentence to the parent phase map row 7 naming the final behaviour arm and the operator instruction that defers T020/T046 and AC-004/005/007.
- Decide the advisor skill's result-persistence path: create `benchmark/reports/` under the skill or point the playbook at an existing location.
- Replace the playbook's "41 `NNN-*.md`" coverage note with the live 50-file inventory (or delete the historical note).
- Correct the tests README's description of `manual-testing-playbook.vitest.ts`.
- Correct the scorer README's `--row-id` sentence to name summary mode, and narrow the module header.

## 6. Plan Seed

- [ ] T1: `run-command-behaviour.mjs` derives the arm from a g2 row id when `--set` is absent; test with `--row-id g2-deep-review-typed`.
- [ ] T2: record the resolved fixture path on each g2 run line and use it in `--backfill`.
- [ ] T3: snapshot and restore `process.env` in `capture-command-routing-baseline.mjs`; test an in-process second scoring call.
- [ ] T4: strip `AI_SESSION_CHILD` in `measure-brief-cost.mjs` and say so in its README line.
- [ ] T5: require the backfill's log directory to equal the audited checkout (or refuse a path outside it).
- [ ] T6: parse porcelain quoting in `statusSnapshot` (or use `git status -z`); add a quoted-name restore test.
- [ ] T7: the three doc edits and the scorer header, with the inventory test extended to check the coverage note.

---

## 7. Traceability Status

### Core Protocols

- `spec_code`: **pass**. Five pinned routing numbers re-derive from the committed baseline: typed recall 24/44, typed combined reach 44/44, plain tune combined 23/45, false offers 0/35, holdout plain recall 1/44. The command baseline's pinned `capturedAt` (2026-10-11) equals the scorer-eval baseline's, and `capturedAtSha` is an ancestor of HEAD.
- `checklist_evidence`: **partial**. The parent packet has no checklist; phase 007's T020/T046 and AC-004/005/007 remain open per `007-per-runtime-behaviour-proof/tasks.md:141`, and the parent map does not say why (finding 1).

### Overlay Protocols

- `skill_agent`: **notApplicable**. No agent definition owns the accuracy-runner area.
- `agent_cross_runtime`: **partial**. The six runtime argv tables, the seven-runtime bench matrix and the per-runtime runner branches were read; live per-runtime proof remains phase 007's evidence and is not claimed here.
- `feature_catalog_code`: **pass**. `feature-catalog/cli-surface/advisor-recommend.md` links NC-001/004/005 and its command semantics match the area.
- `playbook_capability`: **partial**. NC-011's expected signals and triage symbols hold after the pass-one attach fix; the root playbook's inventory and persistence statements do not.

`AC_COVERAGE`: **exempt**. The packet has no `checklist.md`, `acceptance-criteria.md` or `implementation-summary.md` at the parent level, so the lifecycle predicate is inactive.

---

## 8. Deferred Items

- **`run` commands that write.** `/doctor:deep-loop` and `/doctor:speckit` are `run` + `add-only`; whether that is intended belongs to a decision, not this area.
- **dsh install path.** `/doctor:install` cannot link a dsh runtime; adding a row is a feature decision.
- **Live per-runtime proof.** Phase 007's final behaviour arm after the merge remains the evidence path; this review could not run a live arm because the worktree is dirty from four concurrent lineages.
- **Coverage graph.** Unavailable for this lineage; a graph-backed STOP is future work.
- **`iter3-P2-backfill-log-code-execution` severity.** It is P2 because it needs an untrusted log; if the harness starts accepting logs from other machines by default, it should be revisited as P1.

---

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none. Remaining frontier: none.
- Selected review directions per iteration: fix replay, changed-code correctness, security boundaries, traceability and pinned numbers, maintainability of the restore and scorer contracts, stabilization, adjudication.
- This map records breadth only and changes no verdict.

---

## 9. Search Ledger

- `searchCoverage` (latest iteration): required `severity_inflation`, `duplicate_finding`, `stale_finding`; covered all three; graph mode `graphless_fallback`.
- `candidateCoverage`: 28 bug classes covered across the seven iterations; `searchDebt` empty; `ruledOutCandidates` 20; `cleanSearchProof` 20.
- No search debt. Graphless fallback was used throughout: direct reads, exact searches, producer/consumer traces, negative-test inspection and corpus count tallies.

---

## 10. Audit Appendix

### Convergence

- Total iterations: 7; `maxIterations=7` reached; `stopReason: maxIterationsReached`.
- `newFindingsRatio` by iteration: 1.00, 1.00, 1.00, 1.00, 1.00, 0.00, 0.00.
- The graph prerequisite was unavailable, so no legal graph-backed STOP was claimed. Release readiness: `in-progress`.
- Dimension coverage: correctness (1-2), security (3), traceability (4), maintainability (5), stabilization (6), adjudication (7).

### Coverage

- 31 area files read at least once; 13 changed-since-pass-one files read at their changed regions.
- Tests observed: `command-behaviour-guards` + `command-offer` (28 passed), `command-transcript-score` (60 passed), `command-behaviour-guards` + `worktree-restore` (10 passed).
- Holdout: 44 in-corpus holdout ids and 66 sealed holdout rows; no prompt text printed; 0 holdout ids in any published baseline map.

### Ruled-out Claims

- `offerReached` code wrong (the packet pins the rule; the README was fixed).
- README code-file count drift (14 code files; 21 entries listed).
- Bench matrix incomplete (seven runtimes).
- g2 label grammar drift (`startedLabel` reads `G2_ROWS`).
- Parse-offer trailing word reach, restore staged-file gap, rename one-sided restore, legacy parity comment contradiction, corpus/fixture drift, holdout leak through fixtures.

### Cross-Reference Appendix

**Core Protocols**
- `spec_code`: pass (five floors + pinned clock).
- `checklist_evidence`: partial (phase 007 open rows; no parent checklist).

**Overlay Protocols**
- `skill_agent`: notApplicable.
- `agent_cross_runtime`: partial (read evidence; live proof phase 007).
- `feature_catalog_code`: pass.
- `playbook_capability`: partial (NC-011 holds; root playbook advisories).

### Sources Reviewed

- The 31 `accuracy-runner` files of `review/review-scope-2.txt`, the CLI and test files they import, the shared `system-skill-advisor/README.md` and `ARCHITECTURE.md`, the manual-testing-playbook root and NC-011 chapter, and `spec.md`/`007/tasks.md` as traceability context.

### Lineage Note

The reducer-owned registry carries the twelve findings but leaves `findingClass` empty (the same shape as pass one). The class column above comes from the iteration records, which carry `findingClass` per finding.
