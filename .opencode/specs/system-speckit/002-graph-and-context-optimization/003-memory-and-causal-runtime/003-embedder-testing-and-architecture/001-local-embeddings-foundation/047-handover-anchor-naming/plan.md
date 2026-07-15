---
title: "Implementation Plan: Handover Anchor Naming Alignment"
description: "Router-update packet for aligning handover_state saves to the canonical session-notes anchor and verifying the planner path."
trigger_phrases:
  - "handover anchor plan"
  - "session-notes router plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/047-handover-anchor-naming"
    last_updated_at: "2026-05-14T16:53:14Z"
    last_updated_by: "codex"
    recent_action: "Planned router-update path"
    next_safe_action: "Run strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "047-handover-anchor-naming-plan"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Handover Anchor Naming Alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown |
| **Framework** | Vitest, Spec Kit Memory MCP |
| **Storage** | No schema migration |
| **Testing** | Vitest, TypeScript typecheck, build, live memory-save diagnostic |

### Overview

The divergence map showed one canonical answer: the template and live handover docs use `session-notes`, so the router-side `session-log` expectation was wrong. The implementation updates the router target, matching tests and reference docs, then fixes two adjacent planner blockers exposed by the live diagnostic: section appends into `session-notes` and false template-contract blockers from V-rule early returns.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified: handover template, existing handovers, router, merge validator, memory-save planner.

### Definition of Done
- [x] Router target updated.
- [x] Focused tests pass.
- [x] Runtime `dist/` rebuilt.
- [x] Live diagnostic returns planned route with no blockers.
- [x] Packet docs updated.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surgical contract alignment.

### Key Components
- **Content router**: Owns category-to-document anchor defaults.
- **Spec-doc structure validator**: Checks whether the proposed merge mode is legal for the target anchor.
- **Memory-save planner**: Converts routed save decisions into non-mutating planner responses and blockers.

### Data Flow

`memory_save(routeAs: "handover_state")` builds an effective routing decision, resolves the target to `handover.md::session-notes`, validates the target anchor and merge mode, then returns a planner response. The planner now reaches `status: "planned"` with advisories instead of failing on `session-log`, table-shape misclassification, or an empty template-contract blocker.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Handover template | Defines canonical handover anchors | Unchanged; already uses `session-notes` | `grep -n "ANCHOR" .../archive/handover.md.tmpl` |
| Existing handover docs | Live docs consumed by memory-save | Unchanged; sampled docs use `session-notes` | `find .opencode/specs -name handover.md ... grep "ANCHOR:session"` |
| Content router | Owns default route target | Updated `DEFAULT_HANDOVER_ANCHOR` | `content-router.vitest.ts` |
| Spec-doc validator | Validates merge legality and route contamination | Updated for handover section shape and accepted override warnings | `spec-doc-structure.vitest.ts` |
| Memory-save planner | Reports blockers/advisories | Updated V-rule early return templateContract classification | Live routeAs diagnostic |
| Save workflow docs | Human-facing route table | Updated to `handover.md::session-notes` | `rg "session-log|session-notes" ...` |

Required inventories:
- Same-class producer inventory: `rg -n "session-log|session_log|session-notes|session_notes" .opencode/skills/system-spec-kit .../014-local-embeddings-migration/handover.md`.
- Consumers of changed constants: `rg -n "DEFAULT_HANDOVER_ANCHOR|handover_state|session-notes" .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: anchor name (`session-log`, `session-notes`), merge shape (plain section, section with tables), route override (none, accepted).
- Algorithm invariant: `handover_state` must target the existing handover anchor and must not turn explicit route overrides into silent writes; warnings remain visible.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Divergence Map
- [x] Inspect handover template anchors.
- [x] Sample existing handover anchors.
- [x] Locate router references to `session-log`.
- [x] Locate route-manifest/reference docs.

### Phase 2: Core Implementation
- [x] Update router default to `session-notes`.
- [x] Update router tests and save workflow reference docs.
- [x] Keep `session-notes` append-section compatible for existing notes containing tables.
- [x] Downgrade accepted override/drop conflicts to warnings.
- [x] Stop V-rule early return from creating empty template-contract blockers.

### Phase 3: Verification
- [x] Run focused Vitest and typecheck.
- [x] Rebuild runtime `dist/`.
- [x] Run live memory-save diagnostics against 014 handover.
- [x] Update packet documentation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Router target, route override, merge legality | `npx vitest run tests/content-router.vitest.ts tests/intent-routing.vitest.ts tests/spec-doc-structure.vitest.ts` |
| Static | TypeScript | `npm run typecheck` |
| Build | Runtime dist refresh | `npm run build` |
| Live diagnostic | Built memory-save route planner | `node --input-type=module -e "... handleTool('memory_save', ...)"` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec Kit MCP server build | Internal | Green | Live handler could run stale `dist/` without rebuild. |
| 014 handover content | Existing packet doc | Advisory | V8 still warns on cross-spec-heavy content, but route planner is blocker-free. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `handover_state` saves regress or target the wrong anchor again.
- **Procedure**: Revert the small source/doc/test changes in this packet and rebuild `mcp_server/dist`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Divergence Map -> Router + Validator + Planner Patch -> Tests + Live Diagnostic -> Packet Validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Divergence Map | None | Patch |
| Patch | Divergence Map | Verification |
| Verification | Patch | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Divergence Map | Low | Completed |
| Core Implementation | Medium | Completed |
| Verification | Medium | Completed |
| **Total** | | **Single dispatch** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Runtime artifacts rebuilt.
- [x] Live planner diagnostic run.

### Rollback Procedure
1. Revert touched router, validator, planner, tests, docs, and generated dist artifacts.
2. Run focused Vitest and `npm run build`.
3. Confirm `memory_save(routeAs: "handover_state")` behavior matches the rolled-back contract.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
