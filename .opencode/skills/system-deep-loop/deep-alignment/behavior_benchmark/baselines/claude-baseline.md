---
title: "deep-alignment Behavior Benchmark — Claude Baseline"
description: "Per-scenario Claude-leg baseline for the DAB set: 11/11 captured 2026-07-12 on claude-opus-4-8 via claude-cli, single-sample, skeptic-verified by three independent GPT passes (9 confirm / 2 dispute)."
trigger_phrases:
  - "deep alignment claude baseline"
  - "DAB baseline checkpoints"
  - "alignment behavior benchmark baseline"
importance_tier: "high"
contextType: "implementation"
---

# deep-alignment Behavior Benchmark — Claude Baseline

## 1. OVERVIEW

The reference Claude-leg baseline for the deep-alignment DAB scenario set: the
per-cell checkpoints, verified classifications, recomputed budgets, and capture
confounds that every other executor leg is measured against. All 11 cells were
captured 2026-07-12 on `claude-opus-4-8` via the `claude-cli` leg (single-sample)
and adjudicated by three independent GPT skeptic-verify passes. Read the Skeptic
Verification and Capture Provenance sections before quoting any latency ratio or
pass rate from this file — two cells were reclassified from the runner's raw
label, and the three `timeout_latency` cells carry a host + concurrent-session
latency confound.

## 2. BASELINE TABLE

Captured 2026-07-12, all 11 DAB cells, single-sample, host `claude-opus-4-8` via
the `claude-cli` leg. Checkpoints are wall-clock offsets from process spawn
(`tFirstOutput` / `tSetup` / `tFirstDispatch` / `tTerminal`); `—` means the
detector never fired (a halt cell dispatches nothing, and a cell that goes
straight to output has no separate setup phase). The **Classification** column
carries the skeptic-verified label; where it differs from the runner's raw
mechanical label, the raw label and the reason are footnoted.

| Scenario | Interaction | tFirstOutput | tSetup | tFirstDispatch | tTerminal | Classification |
|---|---|---|---|---|---|---|
| DAB-001 | autonomous | 1s | 33s | 266s | 862s | pass |
| DAB-002 | question_halt | 1s | 84s | — | 174s | pass |
| DAB-003 | question_halt | 1s | — | — | 16s | pass |
| DAB-004 | question_halt | 1s | — | — | 247s | setup_misbind [^raw4] |
| DAB-005 | autonomous | 1s | 30s | 284s | 799s | pass |
| DAB-006 | autonomous | 1s | 33s | 273s | 901s | timeout_latency [^to] |
| DAB-007 | autonomous | 1s | 26s | 336s | 901s | timeout_latency [^to] |
| DAB-008 | autonomous | 1s | 26s | 303s | 900s | timeout_latency [^to] |
| DAB-009 | question_halt | 1s | 133s | — | 153s | setup_misbind [^raw9] |
| DAB-010 | question_halt | 1s | 39s | — | 201s | partial |
| DAB-011 | autonomous | 1s | 31s | 352s | 814s | pass |

Verified distribution: **pass 5** (001, 002, 003, 005, 011) · **setup_misbind 2**
(004, 009) · **partial 1** (010) · **timeout_latency 3** (006, 007, 008). The
runner's raw auto-classification scored 6 pass / 2 partial / 3 timeout; skeptic
verification moved DAB-004 (partial→setup_misbind) and DAB-009 (pass→setup_misbind).

[^raw4]: Runner labelled `partial`. Skeptic-verify (GPT pass 1) reclassified to
    `setup_misbind`: the cell ran the full sk-doc audit inline
    (`validate_document.py` + `extract_structure.py` across all five `docs/`
    files, findings delivered) instead of surfacing the `:auto`/`:confirm`
    mode choice and halting. The runner's `setup_misbind` detector keys on a
    Task/Agent dispatch event; this run misbound via direct tool calls with zero
    dispatch, so the mechanical classifier fell through to `partial`.
[^raw9]: Runner labelled `pass` (a false pass). Skeptic-verify (GPT pass 3)
    reclassified to `setup_misbind`: the cell read both `src/` files, ran
    `verify_alignment_drift.py` plus syntax/load checks, and issued a verdict
    instead of redirecting to `deep-review` or halting. Same classifier blind
    spot as DAB-004 — inline audit, no dispatch.
[^to]: Killed at the 900s hard cap while still making progress (continuous
    output, `maxGap` well under the 480s watchdog), not stuck. All three had
    already dispatched (273s/336s/303s) and their transcripts show the audit
    work completing (`config.status=complete`, corpus checked, report written);
    the process simply did not terminate inside 900s on the Opus host. This is a
    latency ceiling, not a convergence failure — see Notes.

## 3. SKEPTIC VERIFICATION

Three independent GPT passes (`openai/gpt-5.6-sol-fast --variant high`, read-only)
each re-judged a disjoint subset of cells against the runner classification, the
scenario pass-shape contract, and the raw transcript. Result: **9 CONFIRM, 2
DISPUTE** (DAB-004, DAB-009). Both disputes are the same failure mode and yield
two findings:

1. **Mode over-eagerness on specific natural-language asks.** The mode halts
   correctly on the *bare* (DAB-002) and *vague* (DAB-003) surfaces, but on the
   *concise/specific* natural asks (DAB-004, DAB-009) it proceeds to run the
   authority's real validators inline and deliver a verdict instead of halting
   for scope/mode confirmation. The more specific the ask, the more the mode
   assumes it may proceed without the consolidated setup question.
2. **Classifier blind spot.** The runner detects `setup_misbind` via a
   Task/Agent dispatch event. An inline audit (validators invoked as direct tool
   calls, no LEAF dispatch) evades that check, so a genuine misbind reads as
   `partial` (DAB-004) or a false `pass` (DAB-009). The runner's halt-cell
   classifier should additionally treat an authority-validator invocation inside
   a `question_halt` cell as a `setup_misbind` signal.

## 4. CAPTURE PROVENANCE

- **Date**: 2026-07-12.
- **Host model**: `claude-opus-4-8`. The `claude-cli` leg carries no `--model`
  flag (it matches the sibling packages' baseline leg), so it ran the CLI
  default, which on this machine is Opus 4.8 — not a pinned Sonnet. Any future
  re-baseline on a different default host is not comparable cell-for-cell.
- **Leg**: `claude-cli` — `claude -p --output-format stream-json --verbose --dangerously-skip-permissions`.
- **Sampling**: single-sample per cell. Contested cells were adjudicated by the
  three-pass GPT skeptic verification above rather than by reruns.
- **Host confound (framework-stated)**: the baseline runs a different host binary
  than the opencode legs, so host overhead (session bootstrap, hook wiring) folds
  into every latency ratio derived from these values. Restate this inline wherever
  a D5 ratio is reported.
- **Concurrent-session confound (this capture)**: a second live session was
  actively writing the repo (spec-kit validator source, sk-doc canon, the
  `deep-loop-graph.sqlite` graph DB) throughout the run. Its writes inflated the
  runner's isolation-violation counts (they are not this benchmark's mutations)
  and its sqlite contention plausibly added to the autonomous-cell latencies.
  Treat the three `timeout_latency` results as an upper bound on host+contention
  latency, not a clean mode-only latency.

## 5. NOTES

- **Recomputed budgets (`budget_ms = max(3 * tTerminal, 180000)`, cap 900000).**
  DAB-001 900000 · DAB-002 522129 · DAB-003 180000 (floor) · DAB-004 739986 ·
  DAB-005 900000 · DAB-009 459000 · DAB-010 603000 · DAB-011 900000. The three
  `timeout_latency` cells (006/007/008) hit the then-in-force `900000` cap, so
  `3 * tTerminal` was itself ≥ that cap at capture time — this finding is why the
  `alignment` mode's cap has since been raised to **`1500000`** ms in
  `../../../shared/behavior-benchmark/framework.md` BUDGET POLICY; under the
  current `1500000` cap, all three autonomous multi-iteration alignment cells
  fit. The `900000`-cap values recorded above are this baseline's frozen
  2026-07-12 capture and are not re-derived here.
- **Autonomous cells cluster at the latency ceiling.** Six autonomous cells:
  three finished just under the cap (001 max-iter=1 at 862s; 005 at 799s; 011 at
  814s) and three hit it (006/007/008). The mode's per-iteration LEAF dispatch +
  slice-by-slice corpus check is genuinely minutes-long on Opus; the 480s
  watchdog was never tripped (all timeouts were progressing).
- **DAB-006 suppression — open behavioral question.** DAB-006's transcript notes
  the leaf reported "Known-deviation suppressions applied: None" while the fixture
  design expects `docs/README.md`'s `dqi-below-threshold` P2 to be suppressed by
  the `compact-pointer-card-dqi` deviation. The cell timed out before this
  resolved cleanly, so whether suppression genuinely failed or merely was not yet
  emitted is unconfirmed — flag for a targeted rerun.
- **Fixture-polish follow-ups (non-blocking).** The DAB-004 independent validator
  run flagged a likely non-intentional defect in `docs/guides/getting-started.md`
  and a stale count in `FIXTURE.md`'s own answer-key, and measured `docs/README.md`
  at a low DQI. The seeded P0/P1/P2 gaps all reproduce correctly, so the fixture
  is functional; these are refinement items for a fixture v2.
- **Watchdog unchanged.** The six autonomous cells keep `watchdog_ms: 480000`;
  no capture tripped it, confirming the window is calibrated correctly for the
  legitimate quiet-during-corpus-check periods.
