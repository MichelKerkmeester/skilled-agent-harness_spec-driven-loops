# Review Iteration 005

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner`)
- Session: `fanout-accuracy-runner-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Dimension: cross-cutting stabilization (D1-D4)
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: adjudicate (10 review actions)
- Operator review focus bound as `review_focus`: docs that disagree with code, cross-runtime behaviour, safety of offering a mutating command, holdout hygiene.
- How this iteration addressed the focus: it swept the three scope files not yet read, rechecked every active finding, closed the two re-adjudicated P1 records and re-raised their residual defects at P2 with the narrowed claims, so the merge receives no overstated P1.
- `steer.md`: still absent; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs:1-60,120-250`
- `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl` (37 rows, read as counts)
- `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl` (42 rows, read as counts)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts:72-105,240-405`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:187-790,871`
- Recheck of active finding sites: `capture-command-routing-baseline.mjs:537`, `run-command-behaviour.mjs:782`, `score-command-transcripts.mjs:1293`, `README.md:29,113`, `bench/hook-brief-signal-noise.bench.ts:26`, `score-command-transcripts.mjs:929`

## Findings - New

### P0 Findings

None.

### P1 Findings

None. Active P1 count at the end of this iteration is 0.

### P2 Findings

1. **The in-corpus secondary holdout split is published per row and pinned by a recapture instruction** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:537` -- Narrowed restatement of `iter1-P1-holdout-baseline-publication`. The 44 `split === "holdout"` rows of `command-prompts.jsonl` are written into the committed baseline's `rows` map with `expected_command`, `top`, `top1`, `top3` and `offered`, and `tests/command-routing-slice.vitest.ts:91-107` compares them one by one and tells the developer to recapture with `--write` when a change is intended. The project's independent-holdout gate classifies this every-Nth-row split as "a legacy secondary signal", not the set that measures generalisation (`tests/parity/holdout-independent.vitest.ts:5-18`), and the truly independent set (`holdout-prompts.jsonl`, 66 provenance-tagged rows with disjoint ids) is gated separately. The residual defect is therefore measurement hygiene, not a broken holdout: the packet still cites this secondary split as acceptance evidence (`spec.md:144`), so a floor drawn from rows whose per-row outcomes are visible and recaptured by the fix loop is not independent of that loop.
Finding class: measurement-hygiene
Scope proof: `capture-command-routing-baseline.mjs`, `command-routing-baseline.json` and `command-routing-slice.vitest.ts` are declared scope; the independent-holdout gate is cited only as doctrine and is read-only context.
Affected surface hints: `command-routing-baseline.json` `rows` (44 holdout keys), `command-routing-slice.vitest.ts`, `spec.md:144` holdout floor, any future tune loop that reads the baseline.
Case: a routing change flips three in-corpus holdout rows; the developer follows the test's own instruction and recaptures, so the holdout floor passes by construction and the packet's acceptance number no longer evidences generalisation.
Refinement of: `iter1-P1-holdout-baseline-publication` (closed as re-adjudicated to this P2).

2. **A measured turn inherits every credential the runner's environment carries except the GitHub trio** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:782` -- Narrowed restatement of `iter2-P1-credential-reach-bypassed-permissions`. The header's network claim is enumerable and the implementation matches it: three GitHub token names are deleted, the gh config points at an empty folder, the credential helper is blanked and the terminal prompt is disabled (`:768-790`), with the remote guard covering the documented push/publish threat (`:986-992`). What remains is hardening: `SSH_AUTH_SOCK`, cloud credentials, package-registry tokens and provider keys are inherited by a child started with `bypassPermissions`, `--auto` or `dangerous` (`:125-127`, `:176-178`, `:216-225`), so a turn that went off-script could authenticate beyond GitHub. No caller in the stated contract sends such a turn, which is why this is P2 rather than blocking.
Finding class: credential-hardening
Scope proof: the runner and the three runtime entries are declared scope; the claim is limited to the environment builder, not to any operator's actual secret store.
Affected surface hints: `childEnv`, `GITHUB_TOKEN_VARS`, `RUNTIMES`, the arena precondition, operator hosts reachable over SSH.
Case: a g2 turn writes a helper that reads `process.env` and opens an SSH connection; the GitHub scrub does not apply and the restore covers only worktree paths.
Refinement of: `iter2-P1-credential-reach-bypassed-permissions` (closed as re-adjudicated to this P2).

## Severity Changes

- `iter1-P1-holdout-baseline-publication` **resolved** in this iteration and replaced by `iter5-P2-holdout-secondary-split-publication`. Evidence for the downgrade: `tests/parity/holdout-independent.vitest.ts:5-18` names the in-corpus every-Nth-row split a legacy secondary signal and treats the frozen provenance-tagged set as the independent holdout.
- `iter2-P1-credential-reach-bypassed-permissions` **resolved** in this iteration and replaced by `iter5-P2-credential-hardening-allowlist`. Evidence for the downgrade: the header enumerates the reach it removes and the code matches that enumeration; the stated threat is a push through this repo's remote, which the remote guard closes.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | All four packet floors re-derived from the committed baseline (iteration 3); no code change since. |
| `checklist_evidence` | partial | Phase 007 closing tasks remain open (iteration 3 finding, still active). |
| `skill_agent` | notApplicable | No agent owns the accuracy-runner area. |
| `agent_cross_runtime` | partial | Runtime tables read for six runtimes; the opt-in bench covers two of seven, and end-to-end proof is unclosed in phase 007. |
| `feature_catalog_code` | pass | `--real-embedding`/`--write` refusal matches the catalog entry. |
| `playbook_capability` | pass | NC-011 executable as written; triage symbols resolve. |

## Integration Evidence

- Named surfaces: `measure-embedder-cost.mjs` (independent unit, exits 2 with the URL when the server does not answer, writes no artifact), `scripts/fixtures/gate2-golden-prompts.jsonl` (37 rows) and `skill-advisor-regression-cases.jsonl` (42 rows) — both consumed by the golden and regression suites declared in the independent-holdout gate, `command-offer.vitest.ts` (offer parsing and backfill refusal proven), `command-transcript-score.vitest.ts` (capped rows, policy buckets, loop-without-init and `:auto` provenance proven).
- Cross-runtime evidence status is unchanged: argv-level tables and tests verified; end-to-end behaviour proof remains the owning phase's open item.

## Edge Cases

- `steer.md` absent for the whole run; recorded each iteration.
- `measure-embedder-cost.mjs` was reviewed read-only; its server probe cannot run under containment, so its exit-2 path is verified by reading, not by execution.
- Fixture corpora were verified by row counts and by the gate that declares them, never by printing their prompt text.
- The loop reaches `maxIterations=5` without legal convergence: iteration 4 and 5 both produced only P2 refinements, but the two-iteration rolling average stays above the 0.08 stop threshold, so synthesis must record `maxIterationsReached`.

## Confirmed-Clean Surfaces

- `measure-embedder-cost.mjs` starts no server, writes no artifact, keeps the cold sample separate and names the URL it failed to reach.
- `command-offer.vitest.ts` proves the policy directly follows the command and that a holdout row refuses the backfill before any output file exists.
- `command-transcript-score.vitest.ts` proves the `:auto` provenance rule, the must-not-start write rule and the loop-without-init safety floor.
- Both fixture corpora are consumed by declared, gated suites; neither is orphaned.
- The two remaining README drift findings are documentation-only and do not affect the harness's behavior.

## Ruled Out

- `measure-embedder-cost.mjs` "starts nothing" wording: the run spawns the advisor CLI to time end-to-end calls, but the claim is about the model server and the run writes no artifact; not a defect worth a finding.
- Re-raising the two closed P1 findings at their original severity: rejected because the independent-holdout doctrine and the enumerated GitHub claim are new evidence that the blocking reach bar is not met.
- Any remaining unreviewed scope file: the scope list's accuracy-runner files have each been read at least once across iterations 1-5.

## Next Focus

- Dimension: none
- Focus area: none; the loop stops at `maxIterations=5` without legal convergence.
- Reason: `maxIterations` cap reached; synthesis follows.
- Rotation status: D1-D4 complete plus stabilization pass.
- Blocked/productive carry-forward: blocked (no live execution evidence for the cross-runtime proof); productive (holdout doctrine and severity re-adjudication).
- Required evidence: none for iteration dispatch; synthesis reads the registry and iteration files.

Review verdict: PASS
