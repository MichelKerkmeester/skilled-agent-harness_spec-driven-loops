---
title: "Feature Specification: Command Pre-Route Headers (4 deep modes)"
description: "Add pre-resolved Resolved route headers across research, review, context, and ai-council prompt seams so downstream agents receive an explicit route contract before body prose."
trigger_phrases:
  - "resolved route header"
  - "deep pre-route"
  - "deep prompt header"
  - "gpt role negotiation"
importance_tier: "critical"
contextType: "implementation"
predecessor_research: "../001-deep-agent-router-and-orchestration/research/research.md"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/004-command-pre-route-headers"
    last_updated_at: "2026-06-30T18:37:51Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Phase 003 route headers implemented and strict validation passed"
    next_safe_action: "Proceed to phase 005 GPT verification smoke"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-003-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Command Pre-Route Headers (4 deep modes)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-30 |
| **Parent Packet** | `025-deep-loop-gpt-reliability` |
| **Predecessor** | `../003-agent-dispatch-hardening` |
| **Successor** | `../005-gpt-verification-smoke` |
| **Handoff Criteria** | All four deep modes carry pre-resolved route headers; native agent fields preserved; existing prompt bodies intact |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The research evidence identifies role-resolution overhead as the dominant GPT-slow mechanism. Native dispatch already names the desired agent but still uses a general host agent boundary, and CLI OpenCode receives only a positional prompt without an agent flag. The route is resolved by the workflow, but the leaf prompt did not previously start with a compact route contract.

### Purpose

Add an explicit `Resolved route:` header at each mode-local prompt seam so the leaf agent receives the intended mode, target agent, execution shape, and mode-switch guard before interpreting the rest of the prompt.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Research mode: rendered iteration prompt template plus CLI OpenCode positional prompt prepend.
- Review mode: rendered iteration prompt template plus CLI OpenCode positional prompt prepend.
- Context mode: inline per-seat prompt contract plus one-shot CLI prompt contract.
- AI council mode: council round prompt pack plus route propagation through `executor_config` into script-owned seat dispatch context.
- Verification that native `agent:` dispatch fields remain intact.

### Out of Scope

- DEEP router agent definitions and orchestrator `Deep Route:` field. Those are phase 002 scope.
- Route-proof validator fields. Those are phase 001 scope.
- Host-runtime hard identity or process isolation changes. Those remain parked for phase 005 trigger evaluation.
- Adding a YAML-level `if_cli_opencode` branch to ai-council. Council dispatch remains script-owned.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl` | Modify | Add research route header after the existing mode marker |
| `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl` | Modify | Add review route header after the existing mode marker |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | Prepend route header to CLI OpenCode positional prompt |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Modify | Prepend route header to CLI OpenCode positional prompt |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Modify | Add context route header to per-seat and one-shot prompt contracts |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/assets/prompt_pack_round.md` | Modify | Add ai-council route header before `## Role` |
| `.opencode/commands/deep/assets/deep_ai-council_auto.yaml` | Modify | Document `resolved_route_header` and `route_fields` in executor config outputs |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-session.cjs` | Modify | Default and forward ai-council route contract through executor config |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs` | Modify | Pass route contract into seat dispatch context |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/tests/*.vitest.ts` | Modify | Add route-contract propagation tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All four modes carry `Resolved route:` headers | Research, review, context, and ai-council prompt seams include the mode-local route contract before leaf body prose |
| REQ-002 | Native agent fields preserved | Native `agent: deep-research`, `agent: deep-review`, and `agent: deep-context` dispatch fields remain intact |
| REQ-003 | Council route propagation through script-owned dispatch | Council route fields reach seat dispatch context through `executor_config`; no YAML `if_cli_opencode` branch is introduced |
| REQ-004 | No prompt-body regression | Existing prompt-pack bodies and adaptive cues remain intact with only additive route headers |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Verification evidence recorded | Focused tests, syntax checks, static route checks, comment hygiene, alignment, and strict validation evidence are captured in phase docs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each deep mode leaf receives a pre-resolved route identity at the prompt seam.
- **SC-002**: Native dispatch paths remain unchanged except for additive prompt content.
- **SC-003**: Council route contract is available to script-owned seat dispatchers.
- **SC-004**: `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing prompt renderers | Header could be skipped if renderers ignore template starts | Add header to templates and CLI positional prompt prepend seams |
| Dependency | Council script-owned dispatch | Council does not have a YAML-level CLI branch | Carry route fields through `executor_config` and dispatch context |
| Risk | Prompt body regression | Claude-specific adaptive cues could be lost | Keep edits additive and do not remove existing prompt sections |
| Risk | Header/schema wording drift | Route-proof validator fields use existing state-log wording | Keep prompt route headers separate from phase 001 route-proof state fields |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Changes stay mode-local and do not introduce new shared abstractions unless required by script propagation.
- **NFR-M02**: Council route defaults must be readable from the script boundary and override-safe through `executor_config`.

### Reliability

- **NFR-R01**: Missing optional council executor-config route fields still produce the default ai-council route contract.
- **NFR-R02**: CLI OpenCode prompts start with the route contract despite lacking a first-class agent flag.

### Compatibility

- **NFR-C01**: Native `agent:` fields and existing prompt bodies remain intact.
- **NFR-C02**: No YAML-level ai-council `if_cli_opencode` branch is added.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Dispatch Boundaries

- **Native research/review/context**: Template or rendered prompt keeps existing body with additive route contract.
- **CLI OpenCode research/review**: Positional prompt starts with `Resolved route:` by using `printf` before `cat`.
- **Context CLI seats**: One-shot prompt contract explicitly says not to run a full loop.
- **Council script dispatch**: Seat context carries `resolved_route_header` and `route_fields` even when caller omits them.

### Non-goals

- **Council YAML branch**: If `if_cli_opencode` appears in council YAML, that is a regression.
- **Route-proof state fields**: Prompt header wording does not replace the existing phase 001 validator route-proof fields.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Prompt, YAML, script, test, and spec-doc updates across four deep modes |
| Risk | 16/25 | Dispatch prompt routing affects mode correctness, but no data or host-runtime mutation |
| Research | 16/20 | Built directly from completed deep research edit map |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None for phase 003. Phase 004 will measure GPT-backed first dispatch behavior with these headers in place.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`.
- **Task Breakdown**: See `tasks.md`.
- **Verification Checklist**: See `checklist.md`.
- **Research Basis**: See `../001-deep-agent-router-and-orchestration/research/research.md`.
<!-- /ANCHOR:related-docs -->
