# Deep Review Report - accuracy-runner Lineage

- Session: `fanout-accuracy-runner-1794550137809-1ecgc7` (generation 1, lineage mode `new`)
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Review focus: command surfacing in the `accuracy-runner` area — routing-accuracy harness, corpora, transcript scoring, offer recovery, cost benches, fidelity tests, and shared docs that describe them
- Iterations: 5 of 5 (`maxIterationsReached`)
- Verdict: **PASS** with advisories (no active P0 or P1; 9 active P2)

---

## 1. Executive Summary

The accuracy-runner area was reviewed across all four dimensions in five iterations. The harness is internally consistent on the two properties the review focus named first: holdout prompt text never reaches a scoring, running or backfill path, and a mutating command is only offered through an arena that the runner refuses to leave once a remote, a dirty tree or a moved HEAD appears. Every numeric floor the packet claims was recomputed from the committed baseline and holds (typed 44/44, plain tune 23/45, false offers 0/35, holdout 1/44).

No P0 was found. Two P1 findings were raised and later re-adjudicated to P2 after new evidence: the project's independent-holdout gate classifies the in-corpus split as a legacy secondary signal, and the runner's network claim is an enumeration the code satisfies. Both P1 records are resolved; their residual defects are carried as active P2 findings so the merge still sees them.

Active findings: 0 P0, 0 P1, 9 P2. `hasAdvisories: true`.

## 2. Planning Trigger

The verdict is `PASS`, so no remediation plan is required to ship this review. The nine P2 advisories are cheap, local fixes and should be batched:

- Two documentation corrections and one inventory refresh (README).
- Two measurement-hygiene notes (secondary holdout publication, `offerReached` semantics).
- Two test/coupling fixes (bench runtime matrix, g2 label grammar).
- Two hardening notes (arena precondition, credential allow-list).

Recommended follow-on: a single `sk-code` fix pass in this area, then `/create:changelog`. Do not route to `/speckit:plan` unless a P2 is promoted after the phase-007 evidence closes.

## 3. Active Finding Registry

| Id | Severity | Title | Evidence |
|---|---|---|---|
| `iter1-P2-offer-reached-unknown` | P2 | `offerReached` counts an unknown brief state as reached | `score-command-transcripts.mjs:1293` vs `README.md:111` |
| `iter1-P2-readme-inventory-drift` | P2 | README structure table and code-file count have drifted | `README.md:29,105-114` |
| `iter2-P2-arena-precondition-unverified` | P2 | Containment inferred from "no git remote" with no arena assertion | `run-command-behaviour.mjs:986-992` |
| `iter3-P2-readme-restore-exit3` | P2 | README promises a restore and omits exit 3 / `head_moved` | `README.md:113` vs `run-command-behaviour.mjs:1017-1037` |
| `iter3-P2-phase007-open-evidence` | P2 | Phase map leaves the per-runtime proof open while later phases are complete | `spec.md:120,133-134`, `007/tasks.md:139-151` |
| `iter4-P2-bench-runtime-matrix-incomplete` | P2 | Seven-runtime matrix defines two runtimes; benches fail when enabled | `bench/hook-brief-signal-noise.bench.ts:26-29,94-96` |
| `iter4-P2-g2-label-grammar-duplication` | P2 | g2 ids are a second source of truth for scorer labels | `score-command-transcripts.mjs:929` vs `run-command-behaviour.mjs:676-727` |
| `iter5-P2-holdout-secondary-split-publication` | P2 | In-corpus secondary holdout split published per row and pinned by recapture | `capture-command-routing-baseline.mjs:537`, `command-routing-slice.vitest.ts:91-107` |
| `iter5-P2-credential-hardening-allowlist` | P2 | Measured turn inherits credentials beyond the GitHub trio | `run-command-behaviour.mjs:768-790` |

Resolved during the loop: `iter1-P1-holdout-baseline-publication` and `iter2-P1-credential-reach-bypassed-permissions` (both re-adjudicated to P2 and replaced by the `iter5-*` records above).

## 4. Remediation Workstreams

1. **Documentation truth (2 items)** — correct the README's restore/exit-3 contract and refresh the structure table and code-file count. One commit, docs only.
2. **Measurement integrity (2 items)** — either stop publishing per-row outcomes for the in-corpus holdout split or document it explicitly as a published benchmark; rename or re-document `offerReached` so `unknown` is not counted as arrival.
3. **Test and label coupling (2 items)** — fill the bench matrix for all seven runtimes (or narrow its type) and derive g2 labels from `G2_ROWS` instead of re-parsing ids.
4. **Hardening (2 items)** — assert the arena precondition with a marker instead of inferring it from an empty remote list; pass an allow-listed environment to measured turns.
5. **Packet evidence (1 item)** — close phase 007's tasks and summary, or reclassify the phase so the parent map and the transition rule agree.

## 5. Spec Seed

- Add to the holdout section: the in-corpus `split: "holdout"` rows are a published secondary signal, not the independent holdout; the independent set is `holdout-prompts.jsonl` and is gated by `tests/parity/holdout-independent.vitest.ts`.
- Add to the behaviour-runner section: a live arm requires an arena checkout; the runner's guard is a proxy, and the arena precondition should be verifiable.
- Add to the packet: phase 007 owns the cross-runtime proof and must close before the build is described as complete.

## 6. Plan Seed

- T1 (docs): fix `README.md:113` (restore + exit 3) and the structure table/count at `:29,105-114`.
- T2 (metric): decide `offerReached` semantics and align `score-command-transcripts.mjs:1293` with the README, or change the README.
- T3 (bench): complete `SEVEN_AXIS_MATRIX` for pi/codex/cursor/devin/dsh, or type it against a subset; add a default-CI smoke assertion that the matrix keys match the tuple.
- T4 (labels): build g2 labels from a shared table exported by `run-command-behaviour.mjs` instead of `STARTED_ROW`.
- T5 (hardening): write/read an arena marker in `prepare-behaviour-arena.mjs` and require it in `runTurn`; pass an allow-listed env.
- T6 (hygiene): split the baseline's `rows` output so holdout keys are aggregate-only, or record the decision to publish them.
- T7 (packet): close `007-per-runtime-behaviour-proof` tasks T020/T046 and its summary, or mark it explicitly deferred with a reason.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | pass | Four packet floors recomputed from `command-routing-baseline.json`; all met. |
| `checklist_evidence` | core | partial | Parent has no checklist; phase 007 closing tasks open (`007/tasks.md:139-151`). |
| `skill_agent` | overlay | notApplicable | No agent owns the accuracy-runner area. |
| `agent_cross_runtime` | overlay | partial | Six runtime argv tables verified; end-to-end proof open; bench covers two of seven. |
| `feature_catalog_code` | overlay | pass | `command-meaning-matching.md:44` matches the capture script's `--write` refusal. |
| `playbook_capability` | overlay | pass | NC-011 executable; triage symbols resolve. |

Unresolved gap: the cross-runtime behaviour claim has no closed packet evidence (active P2) and could not be re-proven by execution under lineage containment.

## 8. Deferred Items

- Live execution of any arm or bench: forbidden by the lineage write surface, so all behaviour conclusions are source-verified, not observed.
- `holdout-prompts.jsonl` prompt text: never read, by instruction; the file was inspected through id sets and counts only.
- Coverage-graph seed: skipped because the seed writer would write outside the lineage; graph coverage mode is `graphless_fallback`.
- P2 advisories above: none blocks the verdict; batch them in one follow-on fix pass.

## 9. Audit Appendix

- Iteration artifacts: `iterations/iteration-001.md` … `iteration-005.md`; one delta per iteration in `deltas/`.
- State: every iteration record was handed to the append gateway (`append-mode-event.cjs --mode review`) and accepted with a receipt; the projection was never written directly.
- Reducer runs: one per iteration (`--create-missing-anchors`), producing the registry, dashboard and strategy.
- Severity transitions: two P1 → P2 re-adjudications recorded in iteration 4's severity section, resolved and replaced in iteration 5 with explicit evidence.
- Convergence: no legal convergence; the loop stopped at `maxIterations=5` with `stopReason: maxIterationsReached`. Rolling ratios: 1.00, 1.00, 1.00, 1.00, 0.11; the two-iteration average never fell to the 0.08 stop threshold.
- Dimension coverage: correctness (1), security (2), traceability (3), maintainability (4), stabilization (5).
- `steer.md` was absent for the whole run, recorded in every iteration.
- No file outside the lineage directory was created, modified or deleted; review targets stayed read-only.
