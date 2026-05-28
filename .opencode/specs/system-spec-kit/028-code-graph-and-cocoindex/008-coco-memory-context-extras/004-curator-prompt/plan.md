---
title: "Implementation Plan: 004 Curator Prompt"
description: "Plan for memory context curator prompt, parser, schema validation, and cache extension."
trigger_phrases:
  - "027 011 004 plan"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-coco-memory-context-extras/004-curator-prompt"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored child plan"
    next_safe_action: "Implement context curator prompt and parser"
    blockers: []
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-004-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 004 Curator Prompt

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit MCP server search libraries |
| **Storage** | Existing LLM cache or curator cache extension |
| **Testing** | vitest |

### Overview
Create the curator core that converts deterministic candidate sets into validated packaging plans. This child stops at prompt/parser/cache behavior; search integration lands in child 005.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Existing LLM cache and reformulation patterns are read.
- [ ] Candidate result ID shape is confirmed.
- [ ] Package schema is fixed.

### Definition of Done
- [ ] Parser rejects invalid JSON and invented IDs.
- [ ] Cache key shape test passes.
- [ ] Prompt snapshot includes candidate-bound constraints.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail-open LLM helper with strict schema validation.

### Key Components
- **Prompt builder**: Serializes candidates and instructions.
- **Parser**: Parses and validates JSON package plan.
- **Cache key builder**: Hashes ordered candidate IDs and policy fields.

### Data Flow
Candidate summaries enter the prompt builder. The LLM response is parsed, checked against candidate IDs, optionally cached, and returned as a package plan or fallback signal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `llm-cache.ts` | Caches LLM reformulation | Add context curation mode | cache key test |
| Curator parser | New validation boundary | Reject invented IDs | schema tests |
| Prompt template | New LLM instruction surface | Bind output to candidates | snapshot test |

Required inventories:
- Same-class producers: `rg -n "llm-cache|reformulation|schema" .opencode/skills/system-spec-kit/mcp_server/lib/search`.
- Consumers of changed symbols: `rg -n "context_curation|curatedContext|context_curator" .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: valid plan, invalid JSON, invented ID, duplicate ID, empty candidate set, cache hit.
- Algorithm invariant: curator plan IDs must all exist in the deterministic candidate set.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read LLM cache and reformulation precedent.
- [ ] Define curator package schema.
- [ ] Define candidate summary input shape.

### Phase 2: Core Implementation
- [ ] Implement prompt builder.
- [ ] Implement parser and schema validation.
- [ ] Implement cache key extension.

### Phase 3: Verification
- [ ] Add parser validation tests.
- [ ] Add cache key tests.
- [ ] Add prompt snapshot tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Parser, validator, cache key | vitest |
| Integration | Cache hit with revalidation | vitest |
| Manual | Prompt review against schema | Markdown/code review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing LLM cache | Internal | Available | Cache extension may need alternate location |
| Candidate result IDs | Internal | Confirm during implementation | Parser cannot validate output |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Parser or cache extension breaks existing LLM reformulation behavior.
- **Procedure**: Revert curator module and remove `context_curation` cache mode.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Prompt/schema ──> Parser ──> Cache key ──> Child 005 integration
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verification, child 005 |
| Verification | Core | Child 005 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Medium | 4 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **7-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Existing LLM cache tests still pass.
- [ ] Curator is not wired to search yet.
- [ ] Parser fallback behavior is tested.

### Rollback Procedure
1. Revert `context_curator.ts`.
2. Revert cache mode extension.
3. Re-run search library tests.
4. Leave child 005 blocked until this child is restored.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove any in-memory or local cache entries with the curator mode if created during tests.
<!-- /ANCHOR:enhanced-rollback -->
