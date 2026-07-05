---
title: "Implementation Summary: Behavioral-Benchmark Framework & Shared Harness"
description: "Shipped the shared measurement substrate: framework.md (scenario schema, D1-D5 rubric, 11-bucket taxonomy, budget/rerun policy), behavior-bench-run.cjs (4-leg runner with watchdog, checkpoints, delegation evidence, scoring, schemaVersion-1 results), the frozen fx-001 review fixture, and a green hermetic suite. Exit gate passed: SMOKE-001 on the resolved claude-cli baseline leg classified pass. Writing by GLM-5.2-max under orchestrator-specified COSTAR contracts; verification by the orchestrator."
trigger_phrases:
  - "implementation"
  - "summary"
  - "behavior benchmark framework"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/033-deep-loop-behavior-benchmarks/001-framework-and-harness"
    last_updated_at: "2026-07-02T09:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase complete: exit gate passed on the claude-cli baseline leg"
    next_safe_action: "Proceed to phase 002 (pilot deep-review)"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-001-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Baseline executor: claude CLI leg (no Anthropic provider in opencode; host-binary confound stated on every D5 ratio) -- D-007."
      - "Runner home: deep-loop-workflows/shared/behavior-benchmark/ -- D-008."
---
# Implementation Summary: Behavioral-Benchmark Framework & Shared Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-framework-and-harness |
| **Completed** | 2026-07-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shared measurement substrate at `.opencode/skills/deep-loop-workflows/shared/behavior-benchmark/`:

1. **`framework.md`** (266 lines) — the single-source contract: scenario schema (first fenced JSON block per scenario file; entry surfaces E1-E4, clarity C1-C3, expected interaction/markers/delegation, budget), the D1-D5 scoring rubric (0/1/2 anchors), the 11-bucket classification taxonomy with detection rules, budget policy (max(3x baseline, 180s), 15/25-minute caps, 120s no-progress watchdog), single-sample rerun policy, and package conventions (RVB/RSB/CXB/ACB/IMB prefixes; contracts in skill packages, run evidence in spec phases).
2. **`behavior-bench-run.cjs`** (~680 lines, zero dependencies) — the runner: data-driven 4-leg spawn table (`glm-max`, `gpt-fast-med`, `gpt-fast-high` via `opencode run --format json`; `claude-cli` baseline via `claude -p --output-format stream-json --verbose`), command-vs-natural invocation handling, hard timeout + 120s no-progress watchdog with detached process-group SIGKILL, checkpoint extraction (tFirstOutput/tSetup/tFirstDispatch/tTerminal), delegation-evidence capture (task events, route-proof JSONL scan, guard warnings), report-only git-status isolation, exported pure `classify()`/`score()` functions, schemaVersion-1 result JSON + transcript per run. A test seam (`BEHAVIOR_BENCH_SPAWN_JSON`) injects fake legs hermetically.
3. **`tests/`** — hermetic suite (fake-leg normal + hang modes, watchdog `stuck_no_progress` case, classify/score unit cases) plus fixtures; exit 0.
4. **Frozen fixture** `../fixtures/fx-001-review-target/` — a toy slug-utility packet whose `src/slugify.js` carries exactly three seeded, uncommented review findings (silent Unicode stripping against a silent spec; truncation that can violate the trailing-hyphen rule after the trim step; unguarded null/undefined contradicting a "validation complete" task claim), for review-mode scenarios to target.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Orchestrator/executor split, per operator direction: the orchestrator ran the two de-risking probes first (`opencode models` — no Anthropic provider, resolving the baseline leg to the `claude` CLI with its host-binary confound stated; runner home resolved to the parent skill's `shared/`), then composed three parallel COSTAR dispatch contracts (per the GLM-5.2 prompt-craft profile: explicit file anchors, hard read-caps, enumerated edge cases, exact output contracts) and dispatched **GLM-5.2-max** (`zai-coding-plan/glm-5.2 --variant max`) to write all nine files in three parallel background sessions. All three completed; all nine files landed exactly at the contracted paths with nothing else touched.

Orchestrator verification then ran in layers: hermetic suite (green first try), comment hygiene (clean on all three code files), line-by-line contract spot-checks on the runner (leg table, classify order, seam, detached kill, `--format json` placement), fixture-seed verification (all three seeds present, none commented), alignment drift (one `use strict` warning found and fixed), and finally the exit-gate smoke.

**The exit gate caught a real bug — in the orchestrator's own contract, not GLM's code.** SMOKE-001 (a no-delegation autonomous scenario) classified `partial` because the dispatched D4 rule demanded new fixture files for every autonomous scenario, even ones expecting no delegated work. GLM had implemented the contract faithfully. Fixed `scoreD4()` (artifacts owed only when `min_task_events > 0`) and synced `framework.md`'s D4 table; suite re-ran green; smoke re-ran `pass` (dims 2/2/null/2/null, tTerminal 11.9s, isolation clean).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| D-007: claude CLI baseline leg | Probe showed no Anthropic provider in opencode; the confound (different host binary) is stated wherever D5 ratios are reported rather than hidden |
| D-008: runner home in `deep-loop-workflows/shared/behavior-benchmark/` | Cross-mode workflow-layer concern, matching how the parent skill already owns mode-registry.json |
| Isolation is report-only in the runner | Concurrent autonomous sessions dirty unrelated repo paths constantly; a hard assertion would false-positive — the scorer judges violations against production paths instead |
| Orchestrator applied the d4 calibration fix directly instead of re-dispatching GLM | Five-line reviewer-territory fix discovered during verification; re-dispatch overhead exceeded the change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hermetic suite (`tests/behavior-bench-run.test.cjs`) | PASS, exit 0, re-run green after calibration fix |
| Exit-gate smoke SMOKE-001 on claude-cli baseline leg | PASS — result JSON schemaVersion 1, classification `pass`, dims {2,2,null,2,null}, tTerminal 11.9s |
| `check-comment-hygiene.sh` (3 code files) | PASS, 0 violations |
| `verify_alignment_drift.py --root .../behavior-benchmark` | PASS, 0 findings, 0 warnings |
| Fixture seeds present and uncommented | PASS — all three verified in `src/slugify.js` |
| GLM dispatch scope discipline | PASS — exactly the 9 contracted files created, nothing else modified |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`--variant` forwarding to GLM/GPT reasoning effort is accepted-unverified** per the model profile — the legs pass it, but whether the host forwards it to the provider's reasoning parameter is unconfirmed; phase 002's pilot should watch for it.
2. **Opencode legs run without `--dangerously-skip-permissions`** — a permission prompt in a non-interactive run would stall into a watchdog kill and misclassify as `stuck_no_progress`; phase 002 must calibrate whether the flag belongs in the leg table.
3. **tSetup checkpoint regex is heuristic** (`PRE-BOUND SETUP|execution_mode|consolidated setup|Setup Phase`) — pilot runs may show it needs mode-specific markers.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup -->
## Recommended Follow-Up

Phase 002 (pilot deep-review): author RVB-001..008 via GLM under the shipped framework, capture claude-cli baselines, run both GPT legs, and feed the calibration retro — explicitly revisiting limitations 1-3 above with real run evidence.
<!-- /ANCHOR:followup -->
