---
title: "Implementation Plan: Per-Iteration Memory Upsert Hook"
description: "Documents the completed per-iteration memory_save upsert hook and context refresh work."
trigger_phrases:
  - "per iteration memory upsert"
  - "memory upsert hook"
  - "step memory upsert iteration"
  - "incremental memory save"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/006-ux-observability-automation/005-per-iteration-memory-upsert"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Per-Iteration Memory Upsert Hook

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research YAML command steps calling Spec Kit Memory MCP tools |
| **Framework** | Deep-loop iteration validation, reduction, graph upsert, and memory refresh flow |
| **Storage** | Canonical iteration evidence files indexed through `memory_save` |
| **Testing** | YAML step-order fixture, MCP-error fixture, strict spec validation |

### Overview
This completed work added an incremental memory upsert after each validated/reduced deep-research iteration. The YAML step calls `memory_save({filePath})` for the canonical iteration evidence file, refreshes context before the next prompt render, and treats MCP failures as non-fatal advisory events.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: findings were only saved at final run completion.
- [x] Success criteria measurable: each iteration performs an upsert before the next prompt render.
- [x] Dependencies identified: reducer output must provide the canonical evidence file path.

### Definition of Done
- [x] `step_memory_upsert_iteration` runs after validate, reduce, and graph upsert.
- [x] The step calls `memory_save({filePath})` for the canonical iteration evidence file.
- [x] `memory_context` refresh runs before the next prompt render.
- [x] MCP failures are logged as advisory and do not stop the loop.
- [x] Re-running the step on the same iteration file is idempotent.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Post-reduction upsert hook: after each iteration has validated and reduced evidence, the coordinator saves the canonical evidence file to Spec Kit Memory and refreshes retrieval context before rendering the next prompt.

### Key Components
- **`step_memory_upsert_iteration`**: YAML step inserted after validate/reduce/graph-upsert.
- **`memory_save({filePath})`**: Indexes the canonical iteration evidence file.
- **`memory_context` refresh**: Pulls newly indexed context before the next prompt.
- **Advisory error handling**: Logs MCP errors without aborting the loop.

### Data Flow
The iteration completes validation, reduction, and graph upsert, producing a canonical evidence file path. The memory-upsert step calls `memory_save` on that path, records advisory output on failure, and then refreshes context so the next iteration can use the latest validated findings.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep_research_auto.yaml` | Coordinates iteration steps | Insert memory upsert after validate/reduce/graph-upsert | Step order shows upsert before next prompt |
| Canonical evidence file | Stores validated iteration findings | Pass as `filePath` to `memory_save` | Memory save receives expected path |
| Spec Kit Memory MCP | Indexes findings | Treat errors as non-fatal | Mock failure logs advisory and loop continues |
| Prompt context | Feeds next iteration | Refresh with `memory_context` | Next prompt render sees refreshed context |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and confirm coordinator/single-executor scope.
- [x] Confirm reducer output provides a canonical iteration evidence file path.
- [x] Keep MCP server internals and fan-out worker upsert out of scope.

### Phase 2: Core Implementation
- [x] Insert `step_memory_upsert_iteration` after validate/reduce/graph-upsert.
- [x] Call `memory_save({filePath})` on the canonical evidence file.
- [x] Add `memory_context` refresh before next prompt render.
- [x] Log MCP failures as advisory and continue the loop.
- [x] Preserve idempotent behavior for repeated upserts of the same file.

### Phase 3: Verification
- [x] Verify step ordering places memory upsert before the next prompt render.
- [x] Verify a mocked `memory_save` failure does not stop the loop.
- [x] Verify a two-iteration run produces two incremental upsert attempts.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Step order | Upsert after validate/reduce/graph-upsert and before prompt render | YAML fixture inspection |
| Error handling | Non-fatal `memory_save` failure | Mocked MCP failure fixture |
| Incremental behavior | One upsert per completed iteration | Two-iteration run fixture |
| Spec validation | Leaf packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Stable reducer output file path | Internal predecessor | Complete | `memory_save` needs a canonical file to index |
| Spec Kit Memory MCP availability | Runtime | Non-fatal | Failure logs advisory and loop continues |
| Reducer digest optimization | Out of scope | Not required | This leaf upserts every completed iteration unconditionally |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Upsert blocks the loop, saves the wrong file path, or context refresh corrupts the next prompt render.
- **Procedure**: Remove `step_memory_upsert_iteration` and the context refresh call from `deep_research_auto.yaml`, restoring final-save-only memory behavior.
<!-- /ANCHOR:rollback -->
