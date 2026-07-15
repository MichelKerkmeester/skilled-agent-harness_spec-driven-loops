---
title: "Implementation Plan: Phase 7: routing-benchmark-and-review"
description: "Run a deterministic router-mode Lane-C benchmark for the merged sk-prompt hub, inspect D1-D5 results, and pair the evidence with an independent deep-review pass over the phases 003-006 diff. The implementation is evidence collection and triage only; cutover and optional live cli-opencode dispatch remain outside this phase."
trigger_phrases:
  - "sk-prompt benchmark plan"
  - "router-mode Lane-C"
  - "prompt-models routingClass decision"
  - "deep-review triage"
importance_tier: "important"
contextType: "implementation_plan"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent/007-routing-benchmark-and-review"
    last_updated_at: "2026-07-09T17:45:00Z"
    last_updated_by: "claude"
    recent_action: "Executed as planned; benchmark PASS 100/100"
    next_safe_action: "Proceed to phase 008"
    blockers: []
    key_files:
      - ".opencode/specs/sk-prompt/007-sk-prompt-parent/007-routing-benchmark-and-review/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-routing-benchmark-and-review-draft"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Benchmark execution will decide whether prompt-models needs a lexical routingClass carve-out."
    answered_questions:
      - "This phase does not run the optional live true-verdict dispatch through cli-opencode."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: routing-benchmark-and-review

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs plus Node.js benchmark/review orchestration scripts |
| **Framework** | OpenCode skill parent-hub routing and system-deep-loop Lane-C skill-benchmark workflow |
| **Storage** | File-system benchmark outputs under `.opencode/skills/sk-prompt/benchmark/router-final/` |
| **Testing** | Deterministic router-mode skill-benchmark report, deep-review triage, and strict spec validation |

### Overview
This phase executes evidence collection for the merged `sk-prompt` parent hub after phases 003-006 produce the fold-in diff. The executor runs the router-mode Lane-C benchmark, reads the generated report, runs an independent deep-review pass over the full diff, and records whether `prompt-models` can remain `routingClass: metadata` or needs a lexical carve-out.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 003-006 diff is available for review.
- [ ] `spec.md`, `plan.md`, and `tasks.md` define the benchmark, review, and routingClass decision scope.
- [ ] The benchmark command and output directory are known before execution.

### Definition of Done
- [ ] Router-mode Lane-C benchmark report exists in both markdown and JSON forms.
- [ ] D1-D5 results are read, with D1/D2 used for the `prompt-models` routingClass decision.
- [ ] Deep-review findings are triaged as fixed, deferred-with-reason, or false-positive.
- [ ] Phase docs are updated with execution evidence before handoff to phase 008.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-gated validation phase for a workflow-only parent hub.

### Key Components
- **Router-mode skill-benchmark**: Runs `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs --mode=skill-benchmark --skill=sk-prompt --outputs-dir=.opencode/skills/sk-prompt/benchmark/router-final --trace-mode=router` and writes the benchmark report artifacts.
- **Benchmark report review**: Reads the markdown and JSON reports to assess D1-D5 results for both `prompt-improve` and `prompt-models`.
- **Deep-review pass**: Independently reviews the phases 003-006 diff and emits findings that must be triaged before cutover.
- **RoutingClass decision**: Converts D1/D2 routing evidence into a concrete decision for `prompt-models` metadata versus lexical carve-out.

### Data Flow
The phases 003-006 diff and merged `sk-prompt` hub layout feed the router-mode benchmark and deep-review pass. The benchmark writes `skill-benchmark-report.md` and `skill-benchmark-report.json`; the executor reads those outputs, records the routingClass decision, triages review findings, and hands clean evidence to phase 008.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-prompt/` | Target parent hub with `prompt-improve` and `prompt-models` workflow packets. | Benchmark and review as the single merged skill; do not add new axes or modes in this phase. | Generated D1-D5 benchmark report and deep-review findings triage. |
| `.opencode/skills/sk-prompt/benchmark/router-final/` | Phase-local benchmark output location. | Create report artifacts through the benchmark command. | Confirm `skill-benchmark-report.md` and `skill-benchmark-report.json` exist and are legible. |
| `prompt-models` routing metadata | Determines advisor behavior for small-model-dispatch prompt-craft queries after fold-in. | Decide metadata versus lexical carve-out based on D1/D2 results. | Cite benchmark D1/D2 evidence in the phase completion record. |
| Phases 003-006 diff | Source diff requiring independent review before cutover. | Run deep-review and triage findings. | Findings table records fixed, deferred-with-reason, or false-positive status. |

Required inventories:
- Same-class producers: `rg -n 'workflowMode|packetKind|routerPolicy|defaultMode|routingClass|prompt-models|prompt-improve' .opencode/skills/sk-prompt .opencode/skills/system-skill-advisor .opencode/commands .github`.
- Consumers of changed paths: `rg -n 'sk-prompt-models|prompt-models|model_profiles.json|skill-benchmark-report|router-final' .opencode .github README.md AGENTS.md`.
- Matrix axes: workflow mode (`prompt-improve`, `prompt-models`), benchmark dimension (D1-D5), routingClass outcome (`metadata`, lexical carve-out), and review severity (P0/P1/P2).
- Algorithm invariant: router-mode benchmark evidence must evaluate both workflow modes from the new `sk-prompt` hub path and write reports only under `.opencode/skills/sk-prompt/benchmark/router-final/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the phases 003-006 diff is the review target and identify any uncommitted changes outside that diff that should not be attributed to this phase.
- [ ] Confirm `.opencode/skills/sk-prompt/` exists in the new parent-hub layout before benchmarking.
- [ ] Confirm or create the benchmark output directory `.opencode/skills/sk-prompt/benchmark/router-final/` as part of benchmark execution, not as a separate design change.

### Phase 2: Core Implementation
- [ ] Run `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs --mode=skill-benchmark --skill=sk-prompt --outputs-dir=.opencode/skills/sk-prompt/benchmark/router-final --trace-mode=router` from the workspace root.
- [ ] Read `skill-benchmark-report.md` and `skill-benchmark-report.json` to extract D1-D5 results for `prompt-improve` and `prompt-models`.
- [ ] Decide whether `prompt-models` keeps `routingClass: metadata` or needs a lexical carve-out based on D1/D2 results.
- [ ] Run the independent deep-review pass over the full phases 003-006 diff.
- [ ] Triage findings as fixed, deferred-with-reason, or false-positive, prioritizing P0 before P1/P2.

### Phase 3: Verification
- [ ] Verify both benchmark report files exist under `.opencode/skills/sk-prompt/benchmark/router-final/`.
- [ ] Verify the routingClass decision is recorded with cited D1/D2 benchmark evidence.
- [ ] Verify all deep-review findings are triaged and any deferred item has a named follow-up.
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-prompt/007-sk-prompt-parent/007-routing-benchmark-and-review --strict` after phase docs are updated.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Benchmark | `sk-prompt` parent hub routing, discovery, and efficiency across both workflow modes | `loop-host.cjs --mode=skill-benchmark --trace-mode=router` |
| Review | Full phases 003-006 diff before cutover | Deep-review workflow over the complete diff |
| Document validation | Phase 007 spec, plan, tasks, and completion evidence | `validate.sh --strict` for the phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 003-006 fold-in diff | Internal | Required before execution | Deep-review cannot produce a meaningful sign-off without the full target diff. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs` | Internal | Required before execution | Benchmark report cannot be generated; cutover should wait rather than rely on assumption. |
| `.opencode/skills/sk-prompt/benchmark/router-final/` | Internal | Created by or for benchmark execution | Evidence may be missing or written to a dead path if the output target is wrong. |
| Deep-review workflow | Internal | Required before cutover | Findings would remain untriaged, blocking evidence-based handoff to phase 008. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Benchmark results show unacceptable D1/D2 routing regression, deep-review finds untriaged P0 issues, or report artifacts are missing or written to the wrong path.
- **Procedure**: Do not proceed to phase 008 cutover; leave the benchmark/review evidence in place, record the blocker in this phase's completion evidence, and route the failing issue to a named follow-up or back to the relevant prior phase.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
