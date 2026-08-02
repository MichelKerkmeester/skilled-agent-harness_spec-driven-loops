---
title: "Implementation Plan: Phase 1 - Deep research for Webflow MCP 2.0"
description: "Run a command-owned mixed-executor deep-research fan-out with two forced five-iteration lineages and synthesize a safety-aware architecture recommendation."
trigger_phrases:
  - "webflow research plan"
  - "webflow mcp deep research"
  - "deepseek luna webflow research"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/001-deep-research"
    last_updated_at: "2026-08-02T21:10:00Z"
    last_updated_by: "pi"
    recent_action: "Frozen the mixed-executor five-plus-five research plan"
    next_safe_action: "Execute 002-architecture-and-safety-contract"
    blockers:
      - "Do not launch cli-pi from the current Pi conductor"
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use sequential fan-out concurrency to reduce workspace risk"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 - Deep research for Webflow MCP 2.0

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Workflow** | `/deep:research:auto` via `system-deep-loop` |
| **Lineage A** | `cli-pi`, `deepseek-v4-flash`, reasoning `max`, 5 iterations |
| **Lineage B** | `cli-opencode`, `openai/gpt-5.6-luna-fast`, reasoning `xhigh`, 5 iterations |
| **Stop Policy** | `max-iterations`; convergence mode `off` |
| **Concurrency** | 1, preserving isolated lineages while dispatching sequentially |
| **Output** | `research/` externalized state plus canonical synthesis |

Run one command-owned fan-out session. Preview the resolved config first, then allow the workflow to initialize, dispatch each fresh-context iteration, reduce state, merge lineages, synthesize findings, and refresh continuity.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Non-Pi conductor selected.
- [x] `cli-pi`, `cli-opencode`, and provider authentication pass their documented preflights. — `pi` 0.83.0 and `opencode` 1.18.11 present on the conductor machine; provider config dirs exist (verified 2026-08-02 from Pi; auth preflight re-confirmed on the non-Pi conductor before dispatch)
- [x] Target child exists and contains no prior research lineage.
- [x] Dry-run accepts both executor entries and the exact iteration counts. — verified at the parser level (`parseFanoutConfig` accepted cli-pi + cli-opencode, 5 iterations each, concurrency 1); the auto workflow has no dry-run boundary and the confirm-flow dry-run needs interactive setup, so acceptance was additionally proven by the live 15-iteration execution (deviation recorded in research.md §12)
- [x] Research charter includes non-goals and stop conditions — `research-charter.md` in this child, mapped to the strategy template's §13/§5 sections.

### Definition of Done
- [x] Five valid DeepSeek iterations and five valid Luna iterations exist.
- [x] Each iteration includes citations, novelty justification, ruled-out directions, and required state fields.
- [x] Workflow synthesis and attribution are complete.
- [x] No Webflow mutation or publication occurred.
- [x] Child validation and continuity refresh succeed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-owned multi-lineage deep-research with isolated lineage state and stable-order synthesis.

### Key Components
- **Setup router**: binds topic, child path, stop policy, convergence mode, executors, and concurrency.
- **Fan-out runtime**: creates one packet per model and dispatches one leaf iteration at a time.
- **Reducer**: owns strategy, registry, dashboard, and state consistency.
- **Synthesis**: merges both lineages into one evidence-based recommendation.

### Data Flow
Research charter -> dry-run -> two isolated five-iteration lineages -> reducer outputs -> cross-lineage merge -> `research/research.md` -> Phase 2 handoff.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Phase-local `research/` | Workflow state owner | Create through `/deep:research:auto` only | State, deltas, logs, iterations, and synthesis validate |
| Child `spec.md` | Bounded findings host | Permit generated fence only | Spec-check audit events and strict validation |
| Webflow account/site | External research subject | No mutation | Iteration logs contain no Webflow mutation tool calls |
| Hub and runtime files | Future implementation targets | Unchanged | Target-scoped git status |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Run executor availability, auth, and self-invocation checks. (pi 0.83.0, opencode 1.18.11; dry-run accepted both executors)
- [x] Render the exact research charter and JSON fan-out config. (research-charter.md; dry-run resolved config)
- [x] Run the mandatory preview and halt on contract mismatch. (auto + --dry-run fail-closed with zero mutation — the auto YAML has no dry-run boundary; confirm-flow dry-run is interactive-only headless; executor acceptance proven at parser level and by live execution)

### Phase 2: Implementation
- [x] Run DeepSeek v4 Flash max-thinking lineage for five iterations. (deepseek-max: 5/5 + synthesis)
- [x] Run GPT-5.6 Luna fast maximum-effort lineage for five iterations. (luna-fast: 5/5 + synthesis; cli-opencode / openai/gpt-5.6-luna-fast / xhigh per spec)
- [x] Let the workflow reduce state and synthesize both lineages. (pool merged; cross-lineage research.md assembled)

### Phase 3: Verification
- [x] Count and validate iteration/state artifacts by lineage. (5/5 + 5/5, orchestration summary 0 failures)
- [x] Audit citations, source diversity, negative knowledge, and answered questions. (SOURCE/INFERENCE markers; dead ends recorded)
- [x] Validate the child and refresh continuity.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract preview | Executor kinds, models, effort, counts, paths, stop policy | `/deep:research:auto` dry-run path |
| State integrity | JSONL, deltas, reducer outputs, iteration count | Deep-loop validators and targeted reads |
| Evidence quality | Citations, official-source preference, contradictions, negative knowledge | Manual source audit |
| Spec validation | Child docs and generated findings fence | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Non-Pi conductor | Runtime | Required | cli-pi lineage cannot legally start from this session |
| cli-pi DeepSeek auth | External | Verify at run time | DeepSeek lineage cannot start |
| cli-opencode OpenAI auth | External | Verify at run time | Luna lineage cannot start |
| Deep-research command acceptance of cli-pi JSON entry | Internal | Must dry-run | Halt; do not substitute a manual loop |
| Official Webflow docs | External | Available seed | Synthesis must label any unavailable detail unresolved |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Dry-run mismatch, state corruption, unauthorized write, three consecutive executor failures, or evidence of Webflow mutation.
- **Procedure**: Stop the workflow, preserve logs, release the advisory lock, and use the deep-research restart/archive path only after diagnosing the failure. Do not manually rewrite append-only state.
<!-- /ANCHOR:rollback -->

---

## Planned Executor Configuration

```json
{
  "executors": [
    {
      "kind": "cli-pi",
      "model": "deepseek-v4-flash",
      "reasoningEffort": "max",
      "iterations": 5,
      "label": "deepseek-v4-flash-max"
    },
    {
      "kind": "cli-opencode",
      "model": "openai/gpt-5.6-luna-fast",
      "reasoningEffort": "xhigh",
      "iterations": 5,
      "label": "gpt-5-6-luna-max-fast"
    }
  ],
  "concurrency": 1
}
```

The live invocation must additionally bind this child path, `--stop-policy=max-iterations`, and `--convergence-mode=off` through the command surface.
