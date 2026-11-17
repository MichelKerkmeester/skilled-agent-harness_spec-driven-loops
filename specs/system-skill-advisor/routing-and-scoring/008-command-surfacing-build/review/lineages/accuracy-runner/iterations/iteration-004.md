# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner`)
- Session: `fanout-accuracy-runner-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Dimension: D4 Maintainability
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: verify (12 review actions)
- Operator review focus bound as `review_focus`: docs that disagree with code, cross-runtime behaviour, safety of offering a mutating command, holdout hygiene.
- How this iteration addressed the focus: it audited the opt-in bench and the started-command set for change-safety, and it re-adjudicated the two open P1 findings against evidence found this iteration (the project's own holdout doctrine and the exact scope of the runner's network claim).
- `steer.md`: still absent; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts:1-127`
- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts:1-25`
- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:9,28-35`
- `.skilled/skills/system-skill-advisor/runtime/tsconfig.json` (include/exclude), `tsconfig.build.json`
- `.skilled/skills/system-skill-advisor/runtime/package.json` (scripts)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:640-746`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:925-972,1151-1165`
- `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:1-120,349-470` (context evidence for re-adjudication)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:286-307` (context for re-adjudication)
- `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts:101-110`, `advisor-graph-health.vitest.ts:22-40`, `advisor-observability.vitest.ts:35-160`, `advisor-prompt-policy.vitest.ts:11-60`, `runtime-label-removal.vitest.ts:36-130`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Two carried-forward P1 findings are re-adjudicated to P2 in this iteration; see **Severity Changes**.

### P2 Findings

1. **The hook-brief bench declares a seven-runtime matrix but defines two runtimes, and fails the moment benches are enabled** -- `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts:26` -- `SEVEN_AXIS_MATRIX` is typed as `Record<ADVISOR_RUNTIME_VALUES[number], ...>`, and `ADVISOR_RUNTIME_VALUES` holds seven runtimes (`advisor-runtime-values.ts:10-18`), but the object literal defines only `claude` and `opencode`. The type error is hidden because `tsconfig.json` excludes `bench`, and the runtime failure is hidden because `vitest.config.ts:9,28-35` includes `bench/**/*.bench.ts` only when `SPECKIT_RUN_BENCHES=true`. With benches enabled, the first test loops every runtime and calls `Object.keys(SEVEN_AXIS_MATRIX[runtime])` (`:94-96`), which throws for `pi`, `codex`, `cursor`, `devin` and `dsh`.
Finding class: latent-test-defect
Scope proof: the bench and the runtime tuple are both declared scope files (tuple as the definition the bench imports); the finding concerns only the bench's matrix, not the runtime values themselves.
Affected surface hints: `bench/hook-brief-signal-noise.bench.ts`, `lib/advisor-runtime-values.ts`, `vitest.config.ts` bench inclusion, `tsconfig.json` exclusion that hides the type error.
Case: an operator runs `SPECKIT_RUN_BENCHES=true npx vitest run` to measure the brief; the first bench test throws `Cannot convert undefined or null to object` when the loop reaches `pi`, so no runtime after `opencode` is measured.

2. **The started-command set's row ids are a second source of truth for labels the scorer reconstructs from a regex** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:929` -- The six g2 rows are defined as prompt text plus ids in the runner (`run-command-behaviour.mjs:676-703`), and `assertRunnable` accepts any id in that map without a corpus lookup (`:724-727`). The scorer does not read that map; it parses the id with `STARTED_ROW = /^g2-([a-z]+)-([a-z]+(?:-[a-z]+)*)-(typed|ask)$/` and builds the expected command and policy from the segments (`:954-968`). Adding a row whose id does not match that grammar (for example a `-2` suffix or a third namespace segment) runs fine and then scores as `unknown_row`, so the row vanishes from every rate without an error.
Finding class: duplicated-source-of-truth
Scope proof: both files are declared scope; the finding is about the coupling between them, not about any row's current behavior.
Affected surface hints: `run-command-behaviour.mjs` `G2_ROWS`/`G2_PROMPTS`, `score-command-transcripts.mjs` `STARTED_ROW`/`startedLabel`/`labelFor`, any future started-command row.
Case: a seventh g2 row is added as `g2-deep-ai-council-typed`; the runner runs it, the scorer's regex matches and expects `/deep:ai-council`, which is correct by luck, but the same row added as `g2-deep-ai-council-typed-2` matches no pattern and is silently unscored.

## Severity Changes

- `iter1-P1-holdout-baseline-publication` re-adjudicated **P1 -> P2**. New evidence: the project's independent-holdout gate states that the every-Nth-row split carved from a training corpus is "retained elsewhere as a legacy secondary signal", while the frozen 66-row `holdout-prompts.jsonl` (provenance-tagged, disjoint ids, separately gated) is the set that measures generalisation (`tests/parity/holdout-independent.vitest.ts:5-18,371-469`). The publication of per-row outcomes for the in-corpus split therefore does not expose the independent holdout; it exposes a secondary signal. The finding survives narrowed: the packet still cites that secondary split as acceptance evidence (`spec.md:144`), so publishing and pinning its per-row outcomes means the floor it reports is not independent of the fix loop that recaptures the baseline. Original P1 claim overstated the scope; the residual defect is measurement hygiene, not a broken holdout.
- `iter2-P1-credential-reach-bypassed-permissions` re-adjudicated **P1 -> P2**. New evidence: the module header's network claim is enumerated, not absolute — it names GitHub tokens, the gh config, the credential helper and the terminal, then states the remote guard exists because "a command wrongly started there could push, tag or publish" (`run-command-behaviour.mjs:33-39`). The implementation matches that enumeration (`:768-790`), and the documented operator path runs in an arena clone with no remote. `SSH_AUTH_SOCK` and other inherited credentials remain a hardening gap, but no caller in the stated contract sends a turn that would use them, so the reach bar for a blocking finding is not met. Residual P2: an allow-list environment would close the gap; the finding id stays active at the lower severity.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | The maintained behavior under review is unchanged from iteration 3's verification; the two new findings concern test and label coupling, not the packet's floors. |
| `checklist_evidence` | partial | Unchanged from iteration 3: phase 007's closing tasks remain open. |
| `agent_cross_runtime` | partial | The bench's own runtime coverage is the gap in finding 1: five of seven runtimes cannot be measured with benches enabled. |

## Integration Evidence

- Named surfaces: `vitest.config.ts` (bench inclusion switch), `tsconfig.json`/`tsconfig.build.json` (why the type error is invisible), `package.json` (no bench script; the opt-in is the environment variable), `tests/parity/holdout-independent.vitest.ts` (doctrine used for the holdout re-adjudication).
- Runtime tuple: `lib/advisor-runtime-values.ts:10-18` lists claude, opencode, pi, codex, cursor, devin, dsh; the bench matrix covers claude and opencode only.

## Edge Cases

- `steer.md` still absent; recorded, no ruling to apply.
- The bench cannot be executed under containment, so finding 1 is proved from the type declaration, the exclusion lists and the loop over `ADVISOR_RUNTIME_VALUES`; the throw is a certain consequence of `Object.keys(undefined)`, not an observed run.
- Downgrading two P1 findings is recorded as a severity transition with its evidence, not as a silent relabel; both findings stay active at P2 so the merge still sees them.
- The five in-scope legacy tests were scanned for skips and stale assertions; none carry `.skip`, `TODO` or `FIXME`, and each has a live assertion subject. No finding.
- Holdout prompt text remained unread; the parity gate was read for doctrine and provenance assertions only.

## Confirmed-Clean Surfaces

- `measure-brief-cost.mjs` refuses a holdout id before any spawn and never prints a prompt (`:105-119,153`), matching its README entry.
- The five in-scope legacy suites are live: corpus parity pins Python-correct top-1 decisions, graph health asserts no orphan skills, observability asserts forbidden prompt-bearing fields are rejected, prompt policy covers the skip/fire boundary, and runtime-label removal drops retired labels.
- `tsconfig.build.json` excludes tests and benches from the shipped build, so neither finding reaches production output.
- The started-command caps follow the row kind (`run-command-behaviour.mjs:748-752`), so a mixed set cannot cut a started workflow short.

## Ruled Out

- Corpus path duplication across four files (`measure-brief-cost.mjs:37`, `run-command-behaviour.mjs:66`, `score-command-transcripts.mjs:915`, `capture-command-routing-baseline.mjs:58`): all four resolve the same file and fail loudly on a move, so no silent failure mode exists. Not actionable enough for a finding.
- Bench "signal" being defined as a non-empty brief: the file is explicitly a signal/noise boundary bench and the definition is documented at `:65-69`; no phantom assertion.
- `console.log` in the bench: it mirrors the documented bench log shape (`:109-110`) and creates no defect.

## Next Focus

- Dimension: cross-cutting stabilization (all four dimensions)
- Focus area: confirm the two re-adjudicated findings still hold at P2, check whether any P2 from iterations 1-4 has a cheaper fix that changes its severity, and sweep the remaining unreviewed scope files (`measure-embedder-cost.mjs`, the two fixture corpora, `command-offer.vitest.ts`, `command-transcript-score.vitest.ts`) for a last pass.
- Reason: this is the fifth and final iteration under `maxIterations=5`; the loop must either converge legally or record `maxIterationsReached` at synthesis.
- Rotation status: D1-D4 complete; stabilization pass next.
- Blocked/productive carry-forward: productive (severity re-adjudication, bench/test coupling); blocked (no live execution, no bench run).
- Required evidence: re-read of the two downgraded finding sites, fixture row counts, and the remaining test files' assertions.

Review verdict: PASS
