---
title: "Feature Specification: drift census and plan revalidation for the 036 implementation program"
description: "The 17-phase implementation program in packet 036 was authored against a tree state frozen on 2026-07-16 and has never been executed. 204 commits have landed since, 22 of them inside the system-deep-loop runtime the program intends to modify, and at least one (the squashed kebab-case migration) has already broken a path that phase 003 names as its starting point. This packet censuses that drift and returns a per-phase verdict on whether each planned phase is still valid, needs refinement, or is invalidated."
trigger_phrases:
  - "036 drift census"
  - "deep-loop plan revalidation"
  - "has the deep-loop plan decayed"
  - "commits since 036 was published"
  - "revalidate deep-loop phases against HEAD"
importance_tier: "critical"
contextType: "research"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation"
    last_updated_at: "2026-07-19T18:16:02Z"
    last_updated_by: "claude-opus"
    recent_action: "Ran the census, merged both lineages, applied Tier-1 repairs"
    next_safe_action: "Decide Tier-2/Tier-3 handling"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 0
    open_questions:
      - "Does the packet-033 benchmark dependency survive its renumber, or must the 003 baseline be rebased onto z_archive/027?"
      - "Did the defaultMode routing flip change the registered-mode count that phase 013's eight workstreams assume?"
    answered_questions:
      - "Baseline = 0ce43ff589 (2026-07-16), the merge that landed the normalized packet on v4"
      - "Placement = a new additive phase child 018 under 036; additive numbering cannot re-trigger the renumber-corruption class"
      - "Method = /deep:research, 20 iterations, two independent lineages split 50/50, forced depth"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Drift Census and Plan Revalidation

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `017-integrate-latest-and-closeout`; successor: none (last sibling).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Baseline** | `0ce43ff589` (2026-07-16) — the merge that landed the normalized 036 packet on v4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 036 authored 445 planning documents across 17 phases against a tree state frozen on 2026-07-16, and has
never been executed. Since that baseline, 204 commits have landed on `skilled/v4.0.0.0` — 183 of them
AI-co-authored by concurrent sessions, 22 of them inside the `system-deep-loop` runtime the program intends to
modify. Plan decay is not hypothetical here: the squashed kebab-case migration (`cc77a1e550a`) renamed the two
runtime reference files that phase 003 names as its starting points, two days after 003 was authored and before
a single line of the program ran. The program's own drift-handling mechanism sits in phase **017**, at the very
end, where it can only reopen phases after all the work is done.

### Purpose
Pull phase 017's drift-census charter forward to now, and return a per-phase verdict — **still valid**,
**needs refinement**, or **invalidated** — for each of the 15 implementation phases (003-017), each verdict
carrying the specific commit and `path:line` that justifies it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The full commit range `0ce43ff589..HEAD` (204 commits), not pre-filtered to `system-deep-loop/` paths — the
  one confirmed drift hit to date originated outside the runtime.
- A per-phase verdict for all 15 implementation phases (003-017) with commit-level and `path:line` evidence.
- The runtime contracts 036 pins: mode registries, event/state shapes, the fan-out scripts, the behavior-benchmark
  harness, and every runtime path named in a phase plan.
- Second-order drift: changes that do not break a path but invalidate an assumption (registered-mode counts,
  routing defaults, taxonomy, already-shipped capability that a phase plans to build).

### Out of Scope
- **Repairing the drift.** This packet returns verdicts and evidence; edits to phases 003-017 are follow-on work.
- **The ~350 broken phase-number references** already catalogued by the 2026-07-19 analysis — a known, separately
  tracked defect class, not drift caused by other sessions.
- **Re-running the 001/002 research.** Those remain frozen read-only inputs.
- **Executing any implementation phase.**

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `018-drift-census-and-plan-revalidation/research/**` | Create | Deep-research state packet, iterations, findings registry, synthesis |
| `036/graph-metadata.json` | Modify | Register 018 in `children_ids` |
| `036/spec.md` | Modify | Add the 018 row to the PHASE DOCUMENTATION MAP |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every one of the 15 implementation phases (003-017) receives an explicit verdict | No phase carries "unknown"; each verdict names a commit SHA or states "no drift found" with the surface checked |
| REQ-002 | Every "invalidated" or "needs refinement" verdict cites reproducible evidence | A commit SHA plus a `path:line` or a command with real output; a reader can re-derive it |
| REQ-003 | The census covers the full 204-commit range, not a `system-deep-loop/`-only subset | The synthesis states the range, the commit count, and how non-runtime commits were triaged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Second-order drift is reported separately from path breakage | Findings distinguish "a path moved" from "an assumption is now false" |
| REQ-005 | Both lineages run to their full iteration budget under forced depth | `stop_policy=max-iterations`; convergence is recorded as telemetry, never as a stop |
| REQ-006 | Findings from the two models are reconciled, and disagreements surfaced rather than averaged | Synthesis names where the lineages disagreed and which reading the evidence supports |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A per-phase drift table covering 003-017, each row carrying a verdict and its evidence.
- **SC-002**: The already-confirmed hits are reproduced independently by the loop (phase 003's two dead reference
  paths and the `behavior_benchmark/` glob), demonstrating the census detects known-true drift.
- **SC-003**: Any phase whose *premise* has been overtaken by shipped work is flagged for scope reduction, not
  merely for path repair.
- **SC-004**: `validate.sh --strict` is Errors 0 on this folder, and the 036 parent still validates after 018 is
  registered.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/deep:research` command workflow owns the loop | Loop cannot be hand-rolled | Invoke via the command; never ad-hoc shell fan-out (deep-research NEVER rule 9) |
| Dependency | Z.AI GLM-5.2 availability | A stalled lineage halves the census | Operator directive: on rate-limit, fall back to `openai/gpt-5.6-sol-fast` |
| Risk | GLM `--variant max` forwarding is unverified upstream | Effort may silently be lower than requested | Smoke-tested for dispatch (`GLM_OK`); treat effort as best-effort, not guaranteed |
| Risk | The shared branch keeps moving during the census | Verdicts stale on arrival | Pin and record the exact HEAD at init; report verdicts against that SHA |
| Risk | Two lineages find the same drift and inflate confidence | False sense of coverage | Reconcile by evidence, not by vote count |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Each iteration appends a well-formed JSONL delta with `type`, `iteration`, `newInfoRatio`, `status`, `focus`.
- **NFR-R02**: A failed lineage is retried or substituted per the fallback policy rather than silently dropped.

### Security
- **NFR-S01**: Dispatched sessions receive no credentials in prompt bodies.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A phase with no drift at all: must still emit an explicit "no drift found" verdict naming what was checked.
- A commit that reverts another: net effect is what counts, not the presence of a touching commit.

### Error Scenarios
- GLM rate-limit or stall: fall back to `openai/gpt-5.6-sol-fast` for the remainder of that lineage.
- Three consecutive executor failures: route to stuck recovery per the loop protocol.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 204 commits, 15 phases, read-only census |
| Risk | 8/25 | No runtime mutation; verdicts only |
| Research | 16/20 | Two-model iterative investigation, forced depth |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the `packet-033` benchmark dependency survive its renumber, or must the 003 baseline rebase onto `z_archive/027-deep-loop-behavior-benchmarks`?
- Did the defaultMode routing flip (`908efde8d8f`) or the mode-routing fix (`6cd8ab14e4e`) change the registered-mode count that phase 013's eight workstreams assume?
- Has any shipped work since the baseline already delivered part of a planned phase, making that phase partly redundant?
<!-- /ANCHOR:questions -->
