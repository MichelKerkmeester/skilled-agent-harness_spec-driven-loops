---
title: "Implementation Summary + Verdict: context-loading contract — review + benchmark"
description: "Combined verdict from a 10-iteration gpt-5.5 deep review (CONDITIONAL: 0 P0, 5 P1, 1 P2) and a 4-run A/B benchmark (Kimi K2.7 + MiniMax M3, baseline vs contract). The contract measurably works: handing it to a delegated small model lifts the proof-field rubric from 0/6 to 5-6/6 (+5/+6), consistent across both models, and MiniMax-B caught a real contrast failure baseline shipped. Enforcement is advisory; the weakest link is weak-model contrast arithmetic. Observation only; no production edits."
trigger_phrases:
  - "context contract verdict"
  - "does the design context contract work"
  - "contract benchmark review summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/035-design-context-benchmark"
    last_updated_at: "2026-06-27T16:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized review + benchmark into a combined verdict"
    next_safe_action: "Optional: deterministic contrast script + orchestrator gate + P1 fixes"
    blockers: []
    key_files:
      - "benchmark-matrix.md"
      - "review/review-report.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "eval-154-035-design-context-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Contract works for delegated dispatch: +5/+6 rubric lift across two models; the advisory contract carried by the dispatch template is empirically sufficient to flip behavior"
      - "Soft spots: weak-model contrast arithmetic (deterministic script) + the orchestrator's own path (executable/self-check gate, review F-004)"
---
# Implementation Summary + Combined Verdict

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete (evaluation) |
| **Date** | 2026-06-27 |
| **Level** | 1 |
| **Type** | Deep review + empirical benchmark (no production edits) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two independent evidence streams on the 029/030 context-loading contract, plus a combined verdict.

### Headline verdict — the contract measurably works
Handing a delegated small model the contract (condition B) flips the proof-field rubric from **0/6 to 5–6/6** — a **+5 to +6 lift, consistent across two different models and prompt frameworks**. In baseline, both models skipped the register, ran no contrast inventory, and emitted no pre-flight/audit/cards; MiniMax baseline additionally **shipped a real WCAG-AA defect** (asserted `#787878` ≈ 4.6:1; actual 4.42:1, fails body). With the contract, both set the register first and produced the full proof stack; MiniMax-B **caught and fixed that exact contrast failure** (moved body text to `#043367`, 12.54:1, independently verified).

### Deliverables
- `review/review-report.md` + `review/iterations/iteration-001..010.md` — 10-iteration GPT-5.5 deep review.
- `benchmark-matrix.md` — scored 2-model × 2-condition × 6-criterion rubric + lift.
- `runs/{minimax,kimi}-{A,B}/` — the four A/B build outputs (card.html + notes.md + run.json).
- `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` — wrapper + this verdict.
- No 029/030 or live `.opencode/skills/**` file changed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two parallel background tracks. Track 1: a cli-codex `gpt-5.5` @ high agent ran the deep-review methodology for 10 iterations over the explicit 029/030 diff (converged, 0 P0 / 5 P1 / 1 P2). Track 2: four `opencode run` dispatches — MiniMax M3 (`minimax/MiniMax-M3`, TIDD-EC) and Kimi K2.7 (`kimi-for-coding/k2p7`, COSTAR), each ×{baseline, contract} — built the same Anobel card; outputs were scored on a fixed rubric with the decisive contrast ratios recomputed independently (not taken from model claims). Both transports were available; no model substitution was needed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Observation-only** — neither track edited 029/030 or the live skills; the review reports, it does not fix.
- **Independent contrast verification** — recomputed `#787878`/white = 4.42 (fails), `#043367`/white = 12.54, rather than trusting model output, to ground the benchmark scoring.
- **Rubric scoring** — fixed 6 criteria scored per run; ◐ where a mechanism fired but the model's output was flawed (kimi-B contrast mislabeling).
- **Reconciliation** — review F-001/F-002 (sk-doc failures, scope mismatch) trace to pre-existing dirty design-family files, not this work; the 18 contract files validate clean.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Review**: CONDITIONAL — 0 P0, 5 P1, 1 P2; converged at 10 iterations; all four misses rated "Partial" (sound mechanism, advisory enforcement). Cited file:line throughout.
- **Benchmark**: 4/4 runs exited 0 and produced artifacts; scored matrix shows minimax 0→6, kimi 0→5. Decisive contrast values independently recomputed.
- **Scope**: benchmark models wrote only to their run dirs (git status verified); one mtime-flagged design-motion file confirmed pre-existing (legitimate content, no benchmark data) and left untouched.
- **Packet**: `validate.sh --strict` on `031` (see final state).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Advisory, not executable (review F-004)** — the contract changes behavior when *handed* to a delegate (benchmark proves this) but is not a hard gate for the orchestrator's own path. Recommend an executable/router self-check for the orchestrator path.
- **Weak-model arithmetic** — kimi-B ran the contrast inventory but mislabeled two failing pairs as pass. Recommend the deferred **deterministic contrast script** (research §17) so models call a calculator, not eyeball ratios.
- **Small-fix backlog from the review** — F-003 (bare filenames → relative paths in the contract), **F-005 (P1, safety: remove `--dangerously-skip-permissions` + unverified `--variant` from the CO-037 manual scenario)**, F-006 (Template 16 placement + stale "13-template" inventory).
- **n=1 per benchmark cell** — direction is unambiguous (0→5-6/6) but not a multi-sample statistic; a `/deep:model-benchmark` run (≥3 fixtures × ≥2 samples) would canonicalize it.
- **Pre-existing dirty worktree** — unrelated uncommitted design-family files (some failing sk-doc) predate this work and warrant a separate cleanup/commit.
<!-- /ANCHOR:limitations -->
