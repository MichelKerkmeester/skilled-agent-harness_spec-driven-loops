# Review Iteration 006

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner-2`, pass two)
- Session: `fanout-accuracy-runner-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Dimension: cross-cutting stabilization (all four dimensions revisited)
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: adjudicate (10 review actions)
- Operator review focus bound as `review_focus`: pass-two review of command surfacing in the `accuracy-runner` area; confirm the pass-one fixes still hold, that every changed file has been read, and that the findings still active are accurately stated before the loop's last iteration.
- How this iteration addressed the focus: it re-read every active finding's cited line, re-ran the two guard test files and the restore suite, completed the remaining area files (`measure-embedder-cost.mjs`, the legacy tests and the fixtures), and recorded the security-sensitive fix-completeness replay rows. No new defect appeared, so the iteration is a clean stabilization pass.
- `steer.md`: absent before this iteration; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:29,40,71,112,114`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:974-977,1213-1220`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:361-377,662-668`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:156-181`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:46-84`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1-9,1433-1455`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:122`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:30,40`
- `.skilled/skills/system-skill-advisor/runtime/tests/README.md:154`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs:1-80`
- `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-graph-health.vitest.ts:1-65`
- `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-observability.vitest.ts:150-180`
- `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts:1-69`
- `.skilled/skills/system-skill-advisor/runtime/tests/legacy/runtime-label-removal.vitest.ts:1-60`
- `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl`, `skill-advisor-regression-cases.jsonl` (counts and ids only)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Active-Finding Replay

Each finding active at the end of iteration 5 was re-read at its cited line. All twelve still describe the code or doc on disk; none is a stale claim.

| Finding | Line re-read | Still active | Note |
|---|---|---|---|
| `iter3-P2-phase007-open-evidence` | `spec.md:122` | Yes | Row 7 still `In Progress`; the reason is still only in `007/tasks.md:141`. |
| `iter2-P2-g2-row-id-arm-mislabel` | `run-command-behaviour.mjs:974-977` | Yes | `armFor` still keys only on `options.set`. |
| `iter2-P2-backfill-fixture-mismatch` | `run-command-behaviour.mjs:1213-1220` | Yes | The backfill still derives `g2-fixture` from its own log path. |
| `iter2-P2-capture-env-not-restored` | `capture-command-routing-baseline.mjs:361-377,662-668` | Yes | The `finally` still restores no environment variable. |
| `iter2-P2-cost-script-child-brief` | `measure-brief-cost.mjs:167` | Yes | The hook env still spreads `process.env`. |
| `iter3-P2-backfill-log-code-execution` | `command-offer.mjs:333,406-428` | Yes | `checkoutDir` still comes from the log's locator. |
| `iter4-P2-playbook-inventory-note` | `manual-testing-playbook.md:40` | Yes | The "41 `NNN-*.md`" sentence is unchanged. |
| `iter4-P2-playbook-persistence-path` | `manual-testing-playbook.md:30` | Yes | The skill still has no `benchmark/` folder. |
| `iter4-P2-tests-readme-description` | `runtime/tests/README.md:154` | Yes | The table still calls the inventory test a routing-fixture test. |
| `iter4-P2-row-id-session-mode` | `README.md:112`; `score-command-transcripts.mjs:1455` | Yes | The session mode still never reads `options.rowId`. |
| `iter5-P2-quoted-path-restore` | `worktree-restore.mjs:54,79` | Yes | No quote decoding was added; the restore test still has no quoted-name case. |
| `iter5-P2-scorer-header-ordered-report` | `score-command-transcripts.mjs:5-9` | Yes | Both output modes still print counts only. |

## Fix-Completeness Replay (security-sensitive rerun)

The loop is a rerun after pass-one fixes that touched credential reach, path handling and holdout publication, so the closed-gate replay rows are recorded here with evidence. Each row was re-read and, where a test exists, observed.

| Prior finding | Fix | Replay verdict | Evidence |
|---|---|---|---|
| `iter2-P1-credential-reach-bypassed-permissions` (adjudicated to P2) | Allowlisted child environment | PASS | `run-command-behaviour.mjs:828-889`; `command-behaviour-guards.vitest.ts:19-40` passed |
| `iter5-P2-credential-hardening-allowlist` | Same allowlist | PASS | Same lines and test; `SSH_AUTH_SOCK`, `AWS_*`, `NPM_*` and `GH_*` cannot match a kept name or prefix |
| `iter2-P2-arena-precondition-unverified` | Arena marker plus guard | PASS | `prepare-behaviour-arena.mjs:314`; `run-command-behaviour.mjs:590-609`; guard test passed |
| `iter1-P1-holdout-baseline-publication` (adjudicated to P2) | `publishRow` gate plus slice test | PASS | `capture-command-routing-baseline.mjs:501,527,543,554`; 0 of 44 holdout ids in the baseline; slice test holds |
| `iter5-P2-holdout-secondary-split-publication` | Same gate | PASS | Same lines; `command-routing-baseline.json` publishes 132 non-holdout rows |

Required rows: 5. Passing rows: 5. No row is marked pass on prose alone: each names the line and, where one exists, the test observed in this lineage.

## Coverage Confirmation

- **Changed-since-pass-one files**: all 13 area files marked `yes` were read at least once across iterations 1-5 and re-checked here at their changed region. `command-routing-baseline.json` was read as metrics and ids only.
- **Unchanged area files**: all 18 remaining area files were read at least once; the last five (`measure-embedder-cost.mjs`, the four legacy test files beyond the parity test) were completed this iteration.
- **Shared docs**: `system-skill-advisor/README.md`, `ARCHITECTURE.md`, `runtime/tests/README.md` and the manual-testing-playbook root and NC-011 chapter were read; the contradictions found are iterations 4's four P2s.
- **Holdout**: ids and counts only in every iteration; no prompt text was printed.
- **Cross-runtime**: the six argv tables and the per-runtime runner paths were read; live execution is blocked by the dirty worktree and stays phase 007's evidence, not this review's.

## Traceability Checks

- `spec_code`: pass. No new number claim; iteration 4's five floors and the pinned clock hold.
- `checklist_evidence`: partial. No parent checklist; phase 007's open rows remain, and the map note is iteration 1's finding.
- `skill_agent`: notApplicable.
- `agent_cross_runtime`: partial. Read evidence only; live per-runtime proof stays phase 007's.
- `feature_catalog_code`: pass.
- `playbook_capability`: partial. NC-011 holds; the root playbook statements carry iteration 4's findings.

## Integration Evidence

- `tests/command-behaviour-guards.vitest.ts` ↔ `run-command-behaviour.mjs` and `score-command-transcripts.mjs`: the guard suite passed (10 tests with the restore suite this iteration; 28 with the offer suite in iteration 1), so the arm, allowlist and label contracts are observed, not only read.
- `tests/worktree-restore.vitest.ts` ↔ `worktree-restore.mjs`: the suite passes because it never creates a name with a space; the quoted-path gap in `iter5-P2-quoted-path-restore` is therefore consistent with a green suite rather than contradicted by it.
- `tests/legacy/advisor-graph-health.vitest.ts` ↔ `command-attach.ts`'s generated rows: the expected `graphless_inline` trio still matches the three graphless inline ids.
- `fixtures/gate2-golden-prompts.jsonl` ↔ its consumers: the `_schema` metadata line is skipped by the runner, and 36 cases carry ids; the regression-cases file has 42 unique ids.

## Edge Cases

- **A clean stabilization pass is not a convergence claim.** The coverage graph is unavailable for this lineage, so the workflow's graph prerequisite cannot return `STOP_ALLOWED`; the loop is expected to reach `maxIterations=7` and stop with `maxIterationsReached`, as every pass-one lineage did.
- **No live arm was run.** The worktree holds four other lineages' files; a live first turn would refuse `worktree_dirty`.
- **The local quoting probe remains inside the lineage** at `logs/quotepath-probe`; this review deletes nothing.
- **A finding can be P2 and still be worth the merge's attention.** The four doc findings are cheap to fix but each misleads a different reader (operator, maintainer, scenario author).

## Confirmed-Clean Surfaces

- Every pass-one fix in the area holds except the phase-map item.
- The five pinned routing numbers and the shared pinned clock.
- The credential, arena, restore and holdout invariants in their fixed form.
- The corpus and fixture inventories: 195/66/24/78 corpus rows and 36/42 fixture cases, all ids unique.
- The legacy graph-health, prompt-policy and runtime-label suites describe the current code.

## Ruled Out

- **A regression introduced by the pass-one fixes that the active findings missed.** Ruled out for the changed regions: every fix was re-read and the two guard suites pass.
- **A corpus or fixture drift.** Ruled out by row and id counts.
- **A holdout leak through the fixtures.** Ruled out: the fixtures are golden and regression cases, not the holdout split; no holdout id appears in either.
- **A stale legacy-test expectation after the health-record change.** Ruled out: `advisor-observability` and `advisor-privacy` build health from explicit records, and the runtime-label test drops retired labels as before.

## Next Focus

- Dimension: adjudication (all dimensions)
- Focus area: the twelve active P2s' severity and wording, the final-line verdict mapping, and the synthesis inputs
- Reason: iteration 7 is the loop's last iteration; it confirms no P0/P1 exists and prepares the terminal record
- Rotation status: all dimensions complete plus stabilization
- Blocked/productive carry-forward: productive (replay and coverage); blocked (no live arm, no coverage graph)
- Required evidence: active counts P0=0/P1=0, every P2 with file:line and a case, and no finding outside the declared area

Review verdict: PASS
