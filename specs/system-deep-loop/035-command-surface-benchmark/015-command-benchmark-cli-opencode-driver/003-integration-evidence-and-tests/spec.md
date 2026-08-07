---
title: "Spec: cli-opencode Leg Integration, Evidence & Regression"
description: "End-to-end run of the command benchmark through the new cli-opencode driver leg: evidence emission (result JSON + reconciliation), integration tests, and byte-stability regression proof that the frozen claude-cli / gpt-fast-high / gpt-fast-med legs are unchanged. Flips the new driver cells from skip to live. Runtime-affecting."
trigger_phrases:
  - "cli-opencode leg integration evidence"
  - "command benchmark regression proof legs"
  - "behavior benchmark end-to-end opencode leg"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/003-integration-evidence-and-tests"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 spec"
    next_safe_action: "Capture live run on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/assets/command-benchmark/command-benchmark-matrix.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-003-integration-evidence-and-tests-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: cli-opencode Leg Integration, Evidence & Regression

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned — not yet implemented |
| **Spec Folder** | 003-integration-evidence-and-tests |
| **Parent** | 015-command-benchmark-cli-opencode-driver |
| **Verification** | A cli-opencode leg run emits a `.result.json` (`leg: "cli-opencode"`) and a reconciled reconciliation record for ≥1 scenario; the frozen legs' skip records/`buildSpawnArgs` output are byte-stable; benchmark tests pass |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Children 001 (matrix schema) and 002 (runner dispatch) make the cli-opencode driver leg
*declarable* and *dispatchable*, but nothing yet proves it runs end-to-end, emits the expected
evidence, or leaves the three frozen legs byte-stable. The scheduler
`run-command-behavior-matrix.cjs` verifies fixtures, runs cells, and writes a
`command-behavior-matrix.reconciliation.json`; the runner `behavior-bench-run.cjs` writes a
`<scenarioId>-<leg>.result.json` per cell. We need a bounded live capture through the new leg, the
evidence artifacts, integration tests, and an explicit regression proof.

### Purpose
Flip at least one new cli-opencode driver cell from `skip` to a live `resultPointer`, run it through
the scheduler → runner → `opencode run` path, capture the emitted evidence, and prove — with tests
and a byte-diff — that `claude-cli`, `gpt-fast-high`, and `gpt-fast-med` produce identical structure
to before.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Flip ≥1 new cli-opencode driver cell from `skip` to a live cell with a `resultPointer` matching
  the scheduler's required name `<scenarioId>-<legName>.result.json` (recommended first target: the
  leaf sentinel `DAB-012`).
- Run the scheduler end-to-end for that cell and capture: the runner `.result.json`
  (`scenarioId`/`leg` identity, `classification`, `dimensions`, `terminal`), the
  `command-behavior-matrix.reconciliation.json` (`status`, `resultCount`, `skipCount`), and the
  per-run transcript `.transcript.jsonl`.
- Add integration tests: a stubbed/`BEHAVIOR_BENCH_SPAWN_JSON`-driven run asserting the runner emits
  a well-formed result for the `cli-opencode` leg, and a scheduler test asserting reconciliation
  accounts for the new cell.
- Regression proof: byte-diff the frozen legs' `buildSpawnArgs` output and the existing 52 cells'
  skip records against a pre-change baseline; confirm the fixture hashes are unchanged.

### Out of Scope
- The matrix schema change (001) and the runner dispatch wiring (002).
- Broad model-comparison analysis or scoring interpretation (this proves plumbing, not model quality).
- Wiring alignment fan-out — the alignment-leaf cells stay skipped (`alignment_fanout_not_wired`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/assets/command-benchmark/command-benchmark-matrix.json` | Modify | Flip the chosen cell(s) from `skip` to `resultPointer`; keep count coherent |
| (new) integration test file under the benchmark test tree | Create | Runner + scheduler integration assertions (exact path is an open question) |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A cli-opencode leg run emits evidence | A `<scenarioId>-cli-opencode.result.json` exists with `leg: "cli-opencode"` and matching `scenarioId` |
| REQ-002 | Reconciliation accounts for the live cell | `command-behavior-matrix.reconciliation.json` lists the cell as `result` (or `retryable` on quota) and `accountedCellCount` is coherent |
| REQ-003 | Frozen legs are byte-stable | `buildSpawnArgs` output for the three frozen legs and their 48 skip records are byte-identical to baseline |
| REQ-004 | Fixtures are byte-stable | All `fixtures[*].hashes` are unchanged; `restoreFixture` returns each fixture to a clean state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Integration tests pass | Runner + scheduler integration tests are green |
| REQ-006 | Quota/auth is handled gracefully | A provider rejection surfaces as `retryable` (exit 75), not a false `failed`; the run can resume |
| REQ-007 | The run is bounded and isolated | Executed on an isolated worktree; watchdog/budget enforced; no writes escape fixture/out dirs |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: End-to-end run of the cli-opencode leg for ≥1 scenario produces a scored `.result.json` plus a reconciliation record.
- **SC-002**: The three frozen legs produce identical structure to before (byte-diff clean).
- **SC-003**: Benchmark integration tests pass; the matrix schema stays valid (`validateManifest`).
- **SC-004**: The rendered `opencode run …` command matches the cli-opencode SKILL.md contract (observable in the transcript).


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Live model dispatch is nondeterministic | Result classification may vary run to run | Prove plumbing/evidence shape, not a fixed verdict; use `contestedSamples` only if needed |
| Risk | Provider quota/auth mid-run | A cell may not run | `EXIT_ENV` (75) → `retryable`; run auth pre-flight first; ASK on missing default provider |
| Risk | Fixture mutation by a live run | Fixture drift breaks frozen hashes | Scheduler `restoreFixture` (git) restores between cells; assert clean state post-run |
| Risk | Blast radius on shipped runtime | Live edits to a skill asset + shared runner | Isolated worktree; flip the minimum cells; revert on any frozen-leg drift |
| Dependency | Child 001 + Child 002 | Leg must be declarable + dispatchable | Sequence 001 → 002 → 003; do not start live capture before both land |
| Risk | opencode binary availability/version | Dispatch fails or drifts | Verify `opencode --version` against the v1.3.17 baseline; surface drift before capture |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: A retryable (exit 75) cell does not corrupt the reconciliation; re-running resumes cleanly.
- **NFR-R02**: The watchdog (default 120s) / budget (default 900s) bounds every live cell.

### Isolation
- **NFR-I01**: `isolation.violations` in the result is empty — no write escapes the fixture/out dirs.
- **NFR-I02**: Post-run `git status` for fixture paths is clean after `restoreFixture`.

### Reproducibility
- **NFR-X01**: Evidence artifacts (result JSON, transcript, reconciliation) are captured under the out-dir and referenced from this summary.


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Result identity
- **Leg name mismatch**: the scheduler rejects a result whose `result.leg !== cell.legName` (`result_identity_mismatch`) — the runner must write `leg: "cli-opencode"` exactly.
- **resultPointer naming**: the scheduler requires the pointer basename to equal `<scenarioId>-<legName>.result.json`, else it throws — name the pointer precisely.

### Run outcomes
- **Refusal / crash / stuck**: a scored record of a failure is a runner SUCCESS (exit 0 with a classification) — the test asserts a well-formed result, not a `pass` verdict.
- **Quota rejection**: `env_error` nulls all dimensions and returns `EXIT_ENV` (75) → scheduler `retryable`; the test tolerates this outcome as non-fatal.

### Regression surface
- **Skip records**: the 48 existing driver skip cells and 4 alignment-leaf skip cells must remain byte-identical; flipping only the new cli-opencode cell(s).
- **Count coherence**: after the flip, `records.length` still equals `requiredCellCount`; a live cell counts toward `resultCount`, a skip toward `skipCount`.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **First live scenario**: leaf sentinel `DAB-012`, or a design/command scenario? **UNKNOWN** —
  operator decision (mirrors the parent OPEN QUESTION).
- **Integration test location**: where does the benchmark test tree live? **UNKNOWN** — locate the
  existing benchmark tests before adding new ones; do not fabricate a path.
- **Samples**: single sample (`defaultSamples: 1`) or `contestedSamples: 3` for the first live cell?
  **UNKNOWN**.
- **Live vs stubbed CI**: does CI run the real `opencode` binary, or a `BEHAVIOR_BENCH_SPAWN_JSON`
  stub? **UNKNOWN** — a stub keeps CI deterministic and offline.


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Upstream schema**: See `../001-driver-leg-and-matrix-schema/`
- **Upstream dispatch**: See `../002-scheduler-opencode-dispatch/`
- **Parent Spec**: See `../spec.md`

<!-- /ANCHOR:related-docs -->
