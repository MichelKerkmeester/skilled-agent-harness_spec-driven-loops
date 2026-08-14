---
title: "Implementation Plan: Phase 029 Local LLM Easy Config"
description: "Completed research plan for the operator-accepted GROK 4.6 synthesis, including the failed GLM 5.2 MAX leg, containment reverts, and the ranked local LLM easy-config recommendation."
trigger_phrases:
  - "local-llm-easy-config"
  - "research plan"
  - "deep-research loop design"
  - "local projection design"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/029-local-llm-easy-config"
    last_updated_at: "2026-08-14T17:10:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Accepted the GROK research synthesis and closed the research phase"
    next_safe_action: "Open a build phase to implement the localProvider loader and wire the two call sites"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-029-local-llm-easy-config-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The GROK 4.6 lineage completed 5/5 iterations and produced the accepted synthesis in research/research.md."
      - "The GLM 5.2 MAX leg failed without output; both lineages were containment-reverted over .pi/settings.json, and the operator declined another cross-check."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 029 Local LLM Easy Config

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research-only; no runtime code in this phase |
| **Framework** | The `/deep:research` loop with a fixed executor split |
| **Grounding** | `.opencode/plugins/mk-communication-projection.js`, `bin/cli-output-wrapper.mjs`, `src/transports/http.ts`, `src/providers/adapters.ts`, `src/fidelity/reject-only-judge.ts` |
| **Storage** | `research/research.md` in this packet, produced by the loop |
| **Testing** | Iteration validators plus strict packet validation |

### Overview

The recorded deep-research plan targeted 10 iterations with a 5/5 executor split. The GROK 4.6 lineage completed 5/5 iterations and produced a full synthesis. The GLM 5.2 MAX leg failed without output. Both lineages were then containment-reverted over `.pi/settings.json`, so the loop did not auto-synthesize the canonical deliverable. The operator reviewed and accepted the GROK synthesis as `research/research.md` without another cross-check. This phase changes no shipped runtime.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The shipped grounding gaps are pinned to exact code surfaces. [evidence: `spec.md` section 2 and `research/research.md` sections 2-10]
- [x] The intended 5/5 method and actual partial outcome are recorded honestly. [evidence: this plan, `tasks.md`, and `implementation-summary.md`]
- [x] The scope boundary is explicit: research-only, no shipped runtime change. [evidence: `spec.md` section 3 Out of Scope]

### Definition of Done

- [x] All ten requirements have observed or operator-accepted evidence. [evidence: `checklist.md`, `research/research.md`, and the operator acceptance recorded in `implementation-summary.md`]
- [x] `research/research.md` contains the accepted ranked design recommendation. [evidence: first choice, eliminated alternatives, and trade-offs in `research/research.md`]
- [x] Strict packet validation passes. [evidence: final `validate.sh --strict` result recorded in `implementation-summary.md`]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A research-first loop planned across two executors. The completed 5-iteration GROK lineage grounded its claims in the shipped projection engine and produced the ranked recommendation that the operator accepted. The failed GLM leg supplied no output.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Deep-research loop | Preserve the completed GROK lineage and the failed GLM leg under this packet |
| Executor outcome | GROK 4.6 via cli-cursor completed 5/5; the GLM 5.2 MAX leg via cli-devin failed without output |
| Grounding surface | The plugin, the wrapper, the HTTP transport, the provider adapters, and the reject-only judge as evidence sources |
| Ranked recommendation | The validated first choice plus ranked alternatives and trade-offs, written to `research/research.md` |

### Data Flow

Shipped engine surfaces -> 5/5 GROK iterations -> operator-accepted synthesis -> `research/research.md` -> later build phase. The failed GLM leg supplied no cross-check.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| OpenCode plugin | Passes `projectMessage` an empty provider config | Design target, never modified in this phase | Recommendation names the exact lines (`mk-communication-projection.js:256-258`) |
| CLI-output wrapper | Accepts caller-supplied projection config | Design target, never modified in this phase | Recommendation maps auto-pickup to the wrapper library |
| HTTP transport | Exposes local, hosted, and default provider transports | Consumed as evidence | Recommendation names `createLocalHttpTransport` |
| Provider adapters | Map OpenAI-compatible and Ollama wire formats | Consumed as evidence | Recommendation names the LM Studio and Ollama cases |
| Reject-only judge | Only adds rejections to candidates | Design target for a local-permissive default | Recommendation reconciles local accepts with the reject-only contract |
| Phase and packet docs | Record and route planned state | Create Phase 029 | Strict validation and graph backfill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Inventory the shipped grounding gaps against the exact code surfaces. [evidence: `spec.md` section 2 and `research/research.md` sections 2-10]
- [x] Record the intended executor split and actual partial outcome. [evidence: this plan, `tasks.md`, and `implementation-summary.md`]
- [x] Confirm the research-only scope boundary and canonical `research/research.md` deliverable. [evidence: `spec.md` section 3 and the accepted deliverable]

### Phase 2: Implementation

- [x] Complete 5 deep-research iterations under GROK 4.6 via cli-cursor. [evidence: `research/research.md` provenance records the five GROK iterations and max-iterations synthesis]
- [x] Record that the GLM 5.2 MAX leg failed without output and was not pursued after operator acceptance. [evidence: `implementation-summary.md` run outcome]
- [x] Record the GROK stop policy as max-iterations at 5/5. [evidence: `research/research.md` provenance records `stop: max-iterations (5/5)`]

### Phase 3: Verification

- [x] Confirm the actual run outcome without claiming a successful GLM leg. [evidence: 5/5 GROK iterations, failed GLM leg, containment reverts, and operator acceptance in `implementation-summary.md`]
- [x] Validate the ranked design recommendation in `research/research.md` against every REQ. [evidence: `checklist.md`]
- [x] Run strict packet validation and backfill graph metadata. [evidence: final `validate.sh --strict` result in `implementation-summary.md`; refreshed metadata files]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Iteration validity | Every deep-research iteration passes the loop's canonical validators | `/deep:research` loop mechanics |
| Executor-outcome proof | 5/5 GROK iterations, failed GLM leg without output, and operator acceptance | Lineage records and `implementation-summary.md` |
| Grounding audit | Every recommendation claim resolves to a shipped surface | Diff against plugin, wrapper, transport, adapters, and judge paths |
| Packet integrity | Phase 029 metadata, navigation, and links | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| GROK 4.6 via cli-cursor | Executor | Completed 5/5 | Produced the operator-accepted synthesis |
| GLM 5.2 MAX via cli-devin | Executor | Failed without output | No cross-check; operator accepted the GROK result without pursuing another attempt |
| The shipped projection engine | Grounding | Available | The recommendation cannot be grounded in real code surfaces |
| `/deep:research` loop mechanics | Tooling | Available | The loop cannot write its externalized state or `research/research.md` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The loop cannot reach an executor, an iteration fails validation, or the ranked recommendation drifts from the grounding gaps.
- **Procedure**: record the blocked executor or failed iteration honestly, repair the loop state or re-run the affected leg, and keep the scope research-only. No runtime surface is reverted because none is changed; the phase blocks completion until `research/research.md` holds a validated, ranked recommendation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup and method fix -> Deep-research loop (cli-cursor then cli-devin) -> Recommendation synthesis and validation
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Setup and method fix | The four grounding gaps pinned to shipped code | The deep-research loop |
| Deep-research loop | Fixed method and executor availability | Recommendation synthesis |
| Recommendation synthesis and validation | Completed GROK synthesis plus operator acceptance | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and method fix | Low | 0.5 day |
| Deep-research loop (10 iterations, 2 executors) | Medium | 1-2 days |
| Recommendation synthesis and validation | Low | 0.5 day |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the exact plugin, wrapper, transport, adapters, and judge paths. [evidence: `spec.md` section 2 and `research/research.md` references]
- [x] Confirm the research-only scope: no runtime, plugin, wrapper, or adapter change is part of this phase. [evidence: `spec.md` section 3 and `implementation-summary.md` What Was Built]
- [x] Record the intended executor split and the GROK max-iterations policy. [evidence: `tasks.md` Phase 2 and accepted synthesis provenance]

### Procedure

1. Record any blocked executor or failed iteration honestly in the loop state.
2. Repair the loop state or re-run the affected leg under the same executor.
3. Confirm the recommendation in `research/research.md` stays grounded in the shipped code.
4. Refresh graph metadata and rerun strict validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: restore the packet docs only; no runtime or persisted user data is changed.
<!-- /ANCHOR:enhanced-rollback -->
