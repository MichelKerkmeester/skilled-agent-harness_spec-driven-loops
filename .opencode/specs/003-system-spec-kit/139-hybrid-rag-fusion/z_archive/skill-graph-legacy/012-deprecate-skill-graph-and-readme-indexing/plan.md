---
title: "Implementation Plan: 012 - Deprecate Skill Graph and [012-deprecate-skill-graph-and-readme-indexing/plan]"
description: "This plan removes SGQS and non-authoritative indexing sources (README and workflows-code/sk-code reference/assets) from memory MCP, then aligns all command/skill/agent documenta..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "012"
  - "deprecate"
  - "skill"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: 012 - Deprecate Skill Graph and README/Skill-Ref Indexing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, shell validation scripts |
| **Framework** | MCP server handlers + OpenCode command/agent/skill docs |
| **Storage** | SQLite-backed memory index and metadata tables |
| **Testing** | Vitest, npm workspace tests, spec validation scripts |

### Overview

This plan removes SGQS and non-authoritative indexing sources (README and workflows-code/sk-code reference/assets) from memory MCP, then aligns all command/skill/agent documentation with the deprecation. The rollout is sequenced to update runtime contracts first, then docs/prompts, then tests and validation gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Scope is frozen with explicit in-scope path patterns.
- [x] Acceptance criteria define removed tools and removed indexing sources.
- [x] Validation command set is listed and agreed.

### Definition of Done

- [ ] SGQS runtime and schema paths removed.
- [ ] README and skill reference/assets indexing removed.
- [ ] Command/skill/agent/root docs synchronized.
- [ ] Required verification commands pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Contraction and cleanup of retrieval architecture: preserve causal + semantic search primitives, remove SGQS channel and non-authoritative source ingestion.

### Key Components

- **MCP Tool Contract Layer**: `tool-schemas.ts` and handler registry.
- **Memory Indexing Layer**: `memory-index.ts`, `memory-save.ts`, type classification and source filters.
- **Documentation/Prompt Layer**: command, skill, agent, and root README references.

### Data Flow

User query enters `memory_context` and related tools. Retrieval and indexing now operate without SGQS routes and without README/skill-ref source ingestion. Documentation workflows continue to emit anchor-structured READMEs for deterministic section addressing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract and Runtime Removal

- Remove SGQS tools from schema and registry.
- Remove SGQS handler/cache/runtime dependencies.
- Simplify graph routing to causal-only where applicable.

### Phase 2: Source Indexing Policy Narrowing

- Remove README discovery/indexing from memory index and save validation.
- Remove workflows-code/sk-code reference/assets indexing controls and paths.
- Update configuration code for removed indexing surfaces.

### Phase 3: Documentation and Prompt Synchronization

- Update `.opencode/command/**`, `.opencode/agent/**`, `.opencode/agent/chatgpt/**`, `.opencode/skill/**`, and `README.md`.
- Enforce README anchor guidance in generation workflows.

### Phase 4: Verification and Stabilization

- Run targeted test suites for handlers/indexing/deprecation.
- Run typecheck + MCP tests + spec validation.
- Resolve regressions and finalize checklist evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | SGQS removal, indexing filters, schema contract | Vitest |
| Integration | Memory index scan + context behavior without SGQS/README/skill-ref ingestion | Vitest workspace tests |
| Regression | Command/agent/skill docs stale-reference sweeps | `rg`, scripted checks |
| Manual | README generation guidance output inspection | Markdown inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| MCP handler/schema alignment | Internal | Green | Build/runtime mismatch if not updated together |
| Existing test coverage around README and SGQS | Internal | Yellow | Missing tests may hide regressions |
| Documentation consistency across many files | Internal | Yellow | Stale guidance can persist post-merge |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Typecheck or MCP tests fail with unacceptable regressions, or users depend on removed SGQS paths unexpectedly.
- **Procedure**:
  1. Revert deprecation commit set for SGQS and indexing-scope changes.
  2. Re-run `npm run typecheck` and MCP tests.
  3. Re-apply change in smaller slices (schema/runtime first, docs second).
- **Data Reversal**: Existing indexed README rows remain readable; no destructive DB migration is required in this phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## 8. DEPENDENCY GRAPH

```
Contract Removal (P1) -----> Indexing Narrowing (P2) -----> Docs Sync (P3) -----> Verification (P4)
          |                           |                           |                      |
          +---------------------------+---------------------------+----------------------+
                                     shared test and validation gates
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Contract Removal | None | Updated schemas/handlers | Indexing + tests |
| Indexing Narrowing | Contract Removal | Updated scanner/save filters | Docs and regression tests |
| Docs Sync | Contract + Indexing states | Accurate operator guidance | Completion claim |
| Verification | All prior phases | Pass/fail evidence | Release readiness |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## 9. CRITICAL PATH

1. Remove SGQS tools and handler wiring.
2. Remove README and skill reference/assets indexing paths.
3. Update docs/prompts to match removed features.
4. Execute test + typecheck + spec validation.

**Total Critical Path**: 1 implementation cycle with sequential verification.

**Parallel Opportunities**:

- Command/agent/skill doc updates can run in parallel after runtime contract is settled.
- Some test updates can proceed in parallel with documentation sweeps.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 10. MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Runtime deprecation landed | No SGQS tool/runtime path remains | Phase 1 end |
| M2 | Indexing policy narrowed | README + skill refs/assets not indexed | Phase 2 end |
| M3 | Docs and prompts aligned | No stale SGQS/indexing claims in scope | Phase 3 end |
| M4 | Verification complete | Tests, typecheck, and spec validation pass | Phase 4 end |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:verification-commands -->
## 11. VERIFICATION COMMANDS

```bash
npm run typecheck --workspace .opencode/skill/system-spec-kit/mcp_server
npm run test --workspace .opencode/skill/system-spec-kit/mcp_server
rg -n "memory_skill_graph_query|memory_skill_graph_invalidate|includeReadmes|includeSkillRefs" .opencode/skill/system-spec-kit/mcp_server .opencode/command .opencode/agent .opencode/agent/chatgpt .opencode/skill README.md
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/003-system-spec-kit/138-hybrid-rag-fusion/012-deprecate-skill-graph-and-readme-indexing
```
<!-- /ANCHOR:verification-commands -->

---

<!-- ANCHOR:adr-link -->
## 12. ARCHITECTURE DECISION RECORD LINK

Architecture decisions and deprecation tradeoffs are tracked in `decision-record.md`.
<!-- /ANCHOR:adr-link -->

---

<!-- ANCHOR:ai-execution-protocol -->
## 13. AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm task maps to an explicit `T###` item in `tasks.md`.
- Confirm target file path is in frozen in-scope patterns.
- Confirm expected validation/test command for the task is known before edits.

### Execution Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| TASK-SEQ-01 | Execute phases in order (P1 -> P2 -> P3 -> P4) unless task is marked `[P]` | Prevents contract/doc drift |
| TASK-SCOPE-01 | Do not modify files outside frozen in-scope path patterns | Prevents scope creep |
| TASK-VERIFY-01 | Every deprecation edit requires matching test or grep verification | Prevents silent regressions |

### Status Reporting Format

- `STATUS: <phase> | TASK: <T###> | RESULT: <pass/fail/in-progress> | EVIDENCE: <command or file>`

### Blocked Task Protocol

1. Mark task as `[B]` in `tasks.md` with blocker reason.
2. Capture failing command or mismatch evidence in `checklist.md`.
3. Continue with other `[P]` tasks that are not dependency-blocked.
4. Escalate blocker with explicit dependency and required decision.
<!-- /ANCHOR:ai-execution-protocol -->
