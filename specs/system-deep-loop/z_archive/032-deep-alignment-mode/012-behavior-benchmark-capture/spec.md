---
title: "Feature Specification: Phase 12: behavior-benchmark-capture"
description: "First real capture of the deep-alignment DAB behavior benchmark — registered alignment/DAB in the shared framework, built and snake-normalized the shared fixture, captured all 11 DAB cells on claude-opus-4-8, populated the previously all-pending claude-baseline.md, and three GPT skeptic passes adjudicated the labels; the capture's first smoke uncovered a P0 that made the mode unrunnable e2e."
trigger_phrases:
  - "deep-alignment behavior benchmark capture"
  - "DAB baseline capture"
  - "alignment mode resolver P0"
  - "behavior benchmark framework registration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/012-behavior-benchmark-capture"
    last_updated_at: "2026-07-13T07:07:57Z"
    last_updated_by: "claude"
    recent_action: "Captured 11 DAB cells, populated the baseline, fixed and verified the resolver P0"
    next_safe_action: "Operator sign-off on the shared-runtime resolver commit + the flagged follow-ups"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/baselines/claude-baseline.md"
      - ".opencode/skills/system-spec-kit/shared/review-research-paths.cjs"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/specs/system-deep-loop/032-deep-alignment-mode/behavior_benchmark/fixtures/fx_001_alignment_target/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-012-behavior-benchmark-capture"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The claude-cli baseline leg carries no --model flag, so it ran the CLI default claude-opus-4-8, recorded honestly in provenance rather than as the goal's nominal Sonnet."
status: "complete"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: behavior-benchmark-capture

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 — the benchmark-capture workstream, a DAG peer that emerged after the 000-011 build, not a sequential build phase |
| **Predecessor** | 011-skdoc-doc-conformance (folder-order predecessor only) |
| **Successor** | 013-review-remediation (folder-order successor only, not a strict DAG dependency) |
| **Handoff Criteria** | Met for the capture itself: 11/11 DAB cells captured with real checkpoints, `claude-baseline.md` populated and three-pass skeptic-verified, framework registration + runner test green. Gated for release: the shared-runtime resolver fix is applied and GPT-verified GO in the working tree but awaits operator commit sign-off — see Open Questions and `implementation-summary.md`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the `deep-alignment` deep-loop mode specification (`.opencode/specs/system-deep-loop/032-deep-alignment-mode/`).

**Scope Boundary**: phases 000-011 built and documented the mode; none of them had ever run it end-to-end against a real target. This phase registers the mode in the shared behavior-benchmark framework, provisions the shared fixture, and captures the first real Claude-leg baseline for all 11 DAB scenarios. The very first capture attempt is what proved the mode had never actually run: it crashed at workflow step 1.

**Dependencies**:
- `shared/behavior-benchmark/framework.md` and `behavior-bench-run.cjs` — the mode-agnostic runner and rubric the DAB cells are captured against.
- The shared fixture `fx_001_alignment_target` under this packet's `behavior_benchmark/fixtures/` — the frozen corpus every DAB cell binds.
- `system-spec-kit/shared/review-research-paths.cjs` — the shared artifact-root resolver the mode's workflow calls; the P0 gap and its fix both live here.
- The 011 packet's snake_case category-folder convention, which this phase extended to the fixture instance folder.

**Deliverables**:
- `alignment` mode + `DAB` prefix registered in `framework.md`; runner suite green.
- The shared fixture built, snake-normalized, and resolving via `scoping.cjs` + the sk-doc adapter.
- 11 DAB cells captured (single-sample, `claude-cli` leg), classified, and three-pass GPT skeptic-verified.
- `claude-baseline.md` moved from all-pending to fully populated with recomputed budgets and honest confounds.
- The resolver P0 fix applied and independently verified (working tree; commit gated on sign-off).

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-alignment DAB benchmark existed only as scenario contracts and an all-pending `claude-baseline.md` — no leg had ever been captured, so nothing about the mode's real behavior (invocation, presentation, delegation, completion, latency) was measured. Worse, the mode had never been run end-to-end: the shared artifact-root resolver `review-research-paths.cjs` registered only `research` and `review`, so `/deep:alignment` crashed at workflow step 1 (`TypeError: path … received undefined`) for every target.

### Purpose
Register the mode in the shared framework, provision its fixture, and capture a real, honestly-labeled 11-cell baseline — and, because the capture surfaced the resolver P0 as a hard blocker, fix that gap (minimally and additively) so the mode is runnable, verifying the fix does not regress research/review.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Register `deep-alignment`/`alignment` mode and the `DAB` ID prefix in `shared/behavior-benchmark/framework.md`; confirm the runner suite passes.
- Build the shared fixture `fx_001_alignment_target` (docs/docs-clean/src corpus + three lane-config files), rename it to snake_case to match the committed scenario references, and confirm `scoping.cjs` + the sk-doc adapter resolve it.
- Capture all 11 DAB cells single-sample on the `claude-cli` leg; classify each and recompute per-cell budgets from captured `tTerminal`.
- Adjudicate the classifications with three independent GPT skeptic-verify passes and record disputes honestly.
- Populate `claude-baseline.md` (values, provenance, confounds, findings).
- Apply the minimal additive `alignment` registration to `review-research-paths.cjs` and verify research/review are unaffected.

### Out of Scope
- Committing or pushing the shared-runtime resolver fix — gated on operator sign-off; the working-tree change is verified but uncommitted.
- The `dispatch-guard.cjs` SOFT gap (alignment excluded from `LOOP_EXECUTOR_AGENTS`) — a separate scoped hardening change touching the guard and the YAML dispatch-prompt shape.
- The doc-file snake-vs-hyphen naming contradiction introduced by a concurrent migration session — a cross-agent decision, deferred.
- Any fixture v2 polish (the getting-started defect, the stale FIXTURE.md count, README DQI) — non-blocking refinement.
- Multi-sample capture and a non-Opus host re-baseline.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md` | Modify | Registered `deep-alignment` in the modes list, `alignment` in the mode enum, and `DAB` in the ID-prefix table |
| `.opencode/specs/system-deep-loop/032-deep-alignment-mode/behavior_benchmark/fixtures/fx_001_alignment_target/` | Add + Rename | Built the fixture corpus + lane-configs; renamed the instance folder kebab→snake and rewrote its self-references |
| `.opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/baselines/claude-baseline.md` | Modify | Populated from all-pending to 11 real captured cells + verification + provenance + notes |
| `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` | Modify | Added `alignment` to `MODE_CONFIG_FILE`/`MODE_STATE_FILE` + JSDoc union (the P0 fix) |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs` | Modify | Restored the shared/scripts path fix so `check()` spawns the real validators (bug #1) |
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` | Modify | Restored the artifactsChecked array/number union-dedup (bug #2) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The mode is registered in the shared behavior-benchmark framework and the runner suite passes. | `framework.md` lists `deep-alignment`, the `alignment` mode enum value, and the `DAB` prefix; the runner's own test suite runs green. |
| REQ-002 | All 11 DAB cells have at least one real captured leg with measured checkpoints. | 11 `result.json` files exist with non-null `tTerminal`; `claude-baseline.md` carries no `pending`/`not_captured` cell. |
| REQ-003 | The resolver P0 that made the mode unrunnable is fixed and does not regress research/review. | `resolveArtifactRoot(target,'alignment')` resolves without error; `'review'` and `'research'` return byte-identical roots to pre-fix; GPT fix-verify returns COMMIT GO. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The captured classifications are independently adjudicated. | Three GPT skeptic-verify passes cover all 11 cells; disputes (DAB-004, DAB-009) are recorded with the verified label and the runner's raw label footnoted. |
| REQ-005 | Per-cell budgets are recomputed from captured latency. | `budget_ms = max(3·tTerminal, 180000)` cap 900000 recorded per cell; the three cap-hitting timeout cells are flagged as host-unbounded. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `framework.md` registers `alignment`/`DAB` and the runner suite is green.
- **SC-002**: 11/11 DAB cells captured with real checkpoints; `claude-baseline.md` is no longer all-pending.
- **SC-003**: The resolver fix makes `mode='alignment'` resolve while `research`/`review` stay byte-identical, GPT-verified GO.
- **SC-004**: Classifications are three-pass skeptic-verified (9 confirm / 2 dispute), disputes recorded honestly.
- **SC-005**: `validate.sh --strict` passes on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The resolver fix lives in shared `system-spec-kit` runtime | A wrong change would break research/review too | Additive-only (new key), verified byte-identical for research/review, GPT fix-verify GO; commit gated on operator sign-off |
| Dependency | A concurrent migration session was writing the repo throughout the capture | Inflated isolation-violation counts and plausibly the autonomous-cell latencies | Recorded as an explicit confound in the baseline; timeouts treated as an upper bound, not clean mode latency |
| Risk | The baseline host is Opus 4.8, not the goal's nominal Sonnet | Latency values are host-specific and not comparable to a future Sonnet re-baseline | Host recorded honestly in provenance; the leg intentionally matches the sibling default-model convention |
| Risk | 059's parent status read as built/complete while the mode was never runnable e2e | Overstated completion | Flagged for a status-honesty note; the P0 fix + this capture are the first true e2e evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Commit the shared-runtime resolver fix (`review-research-paths.cjs`)? GPT-verified GO; awaiting operator sign-off (shared runtime).
- Add a status-honesty note to the 059 parent recording that the mode was unrunnable e2e until this phase?
- The `dispatch-guard.cjs` SOFT gap (alignment excluded from `LOOP_EXECUTOR_AGENTS`) — schedule the guard + YAML hardening as its own phase?
- DAB-006's "suppressions applied: None" vs the fixture's expected README suppression — targeted rerun to confirm whether suppression genuinely failed or merely was not yet emitted before the 900s cutoff.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
