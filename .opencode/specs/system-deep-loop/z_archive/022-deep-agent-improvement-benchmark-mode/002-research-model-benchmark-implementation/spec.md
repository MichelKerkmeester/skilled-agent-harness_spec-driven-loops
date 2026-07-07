---
title: "Feature Specification: implement model-benchmark mode for deep-research"
description: "Use MiniMax M2.7 deep-research to produce the build-ready implementation delta for model-benchmark mode."
trigger_phrases:
  - "minimax implementation deep research"
  - "benchmark mode implementation research"
  - "mode selector build research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation"
    last_updated_at: "2026-05-28T15:15:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Deep-research converged; authored research.md + spec findings"
    next_safe_action: "Open build packet to execute the research.md build-delta"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "research-20260528-144622"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "MiniMax M2.7 holds the deep-research artifact contract (5/7 dispatches; misses caught, state uncorrupted)"
      - "Research added implementation depth beyond 001 (loop-host.cjs discovery; seam contracts; build-delta)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: implement model-benchmark mode for deep-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 19 |
| **Predecessor** | `001-design-model-benchmark-mode-selector` |
| **Successor** | 003-build-model-benchmark-mode-runtime |
| **Executor** | cli-opencode → `minimax/MiniMax-M2.7` (no `--variant`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 001 design names the mode-selector approach + three seams at the ADR level, but the build packet needs sharper implementation detail: exact interface contracts for each seam, how to generalize `dispatch-minimax.cjs` into a model-agnostic `dispatch-model.cjs`, how to port the 120/003 eval-rig scorer cleanly, and how to wire `mode` into `loop.cjs` without regressing the agent-improvement path. This also dogfoods MiniMax M2.7 as a deep-research executor.

### Purpose
A converged `research.md` that turns the 001 ADRs into concrete, build-ready guidance (per-seam interface contracts + a wiring + backward-compat plan), produced by a MiniMax M2.7 deep-research loop.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 10-iteration deep-research loop, executor `cli-opencode` / `minimax/MiniMax-M2.7` (no `--variant`), :auto
- Questions: per-seam interface contracts (candidate-source / dispatcher / scorer); `dispatch-minimax.cjs` → `dispatch-model.cjs` generalization; porting the eval-rig scorer + rubric; `mode` wiring in `loop.cjs`; backward-compat test strategy; implementation edge cases/pitfalls
- Synthesis into `research/research.md` + a build-guidance delta list for the follow-on build packet

### Out of Scope
- Building the mode (the build is a later packet; 001 + 002 are design + research)
- Re-deciding the architecture (001's ADRs stand; this deepens implementation, not the decision)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `002-research-model-benchmark-implementation/research/**` | Create | Loop state + `research.md` + `resource-map.md` |
| `002-research-model-benchmark-implementation/spec.md` | Modify | Bounded findings-fence writeback at synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Loop runs on MiniMax M2.7 to convergence or 10 iterations | `deep-research-state.jsonl` has MiniMax iteration records + a stop reason; dispatch is `minimax/MiniMax-M2.7` |
| REQ-002 | Produce build-ready guidance | `research/research.md` answers the in-scope questions with per-seam interface contracts + a build delta list |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Iteration artifact contract holds under MiniMax | A probe iteration writes iteration-001.md + valid `type:iteration` JSONL + deltas/iter-001.jsonl before the full run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research.md` gives the build packet concrete per-seam interface contracts + a wiring/backward-compat plan, not just restated ADRs.
- **SC-002**: The run demonstrates MiniMax M2.7 can drive a deep-research loop (or surfaces clearly where it cannot) — a real dogfood signal.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | MiniMax M2.7 via cli-opencode | High — no run without it | Confirmed live (`opencode models minimax`); `--pure` keeps Write/Bash tools |
| Risk | MiniMax (smaller model) unreliable at the 3-artifact output contract | High | Probe iteration 1 first; loop has 3-failure→stuck-recovery + resumable state; surface (don't silently switch) if it can't hold |
| Risk | 001 design already covers much of this → low novelty | Med | Charter targets implementation depth (interface contracts, edge cases) the ADRs didn't reach |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED: MiniMax M2.7 held the artifact contract on 5/7 dispatches; the 2 misses were caught by `post_dispatch_validate` without corrupting state. Usable but less reliable at structured output than gpt-5.5.
- RESOLVED: The research added real implementation depth beyond 001's ADRs — notably the no-`loop.cjs` / journal-based discovery and the new `loop-host.cjs` entry point, plus concrete seam contracts and a build-delta.
<!-- /ANCHOR:questions -->

---

<!-- BEGIN GENERATED: deep-research/spec-findings -->
## 8. RESEARCH FINDINGS (generated)

> Auto-generated summary of `research/research.md`. Canonical detail lives there. Compiled from 5 evidence iterations (cli-opencode `minimax/MiniMax-M2.7`, no `--variant`); stop reason: converged.

- **Seams are mode-agnostic in shape**: `proposeNextCandidate(opts)`, `dispatch(opts)`, `score(outputText, ctx, mode)` — mode selects the implementation, not the signature.
- **Key discovery**: deep-agent-improvement has **no `loop.cjs`** (journal-based orchestration). The mode switch needs a new `loop-host.cjs` entry point; `reduce-state.cjs` needs no structural change (mode metadata only).
- **Dispatcher**: `dispatch-model.cjs` generalizes `dispatch-minimax.cjs` via an executor-routing map; `modelBenchmarkConfig` lives in `improvement_config.json`; absent/`agent-improvement` mode never loads it (backward-compat).
- **Scorer port hazard**: 3 fixture-coupling points in `score-variant.cjs`; decouple via primitive criteria arrays, `--cwd`-parameterized det-checks, and a `buildGraderFn(mode)` factory.
- **Backward-compat**: BC-INV-1..5 + tests TST-1..6 (TST-1 byte-identity test as the CI gate) + edge cases EC-1..10.
- **Build delta**: CREATE `loop-host.cjs`, `dispatch-model.cjs`, grader factory; MODIFY `score-candidate.cjs`, `run-benchmark.cjs`, `promote-candidate.cjs`, `reduce-state.cjs`.
- **Caveat**: MiniMax's file/LOC/line citations are research-grade reads — the build packet must verify each against actual code.
- **Dogfood signal**: MiniMax M2.7 held the 3-artifact contract on 5/7 dispatches (2 misses caught by `post_dispatch_validate`, state uncorrupted). Usable as a research executor; less reliable at structured output than the gpt-5.5 run in 120/002.
<!-- END GENERATED: deep-research/spec-findings -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
