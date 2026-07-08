---
title: "Implementation Plan: Multi-AI Council write authority [system-deep-loop/z_archive/043-multi-ai-council-write-protocol/004-multi-ai-council-write-authority/plan]"
description: "Level 3 implementation plan for scoped council write authority, audit events, rollback semantics, mirror parity, tests, and validation."
trigger_phrases:
  - "council write authority plan"
  - "098 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/043-multi-ai-council-write-protocol/004-multi-ai-council-write-authority"
    last_updated_at: "2026-05-08T23:10:00Z"
    last_updated_by: "codex"
    recent_action: "Implementation in progress"
    next_safe_action: "Resolve blocked Codex TOML mirror write, then rerun parity/vitest/strict validation"
    blockers:
      - ".codex/agents/multi-ai-council.toml is not writable in current sandbox (EPERM)"
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "research.md"
      - ".opencode/agents/multi-ai-council.md"
      - ".opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/persist-artifacts.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "council-write-authority-2026-05-08-codex"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Multi-AI Council write authority

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definitions, Codex TOML, Node.js CommonJS helper/lib modules, TypeScript/Vitest tests. |
| **Framework** | system-spec-kit multi-ai-council artifact persistence. |
| **Storage** | Packet-local filesystem under `ai-council/**`; append-only JSONL state log. |
| **Testing** | Direct TypeScript compile plus four targeted Vitest files. |

### Overview
This packet flips the council from helper-owned persistence to scoped council-owned artifact writes. The implementation refactors the helper into named writer exports, adds v1.2 audit events and rollback helpers, updates runtime mirrors and references, then verifies path-scope, parity, audit, and rollback behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `spec.md` documents 15 requirements across P0/P1/P2 tiers.
- [x] `decision-record.md` documents ADR-001 through ADR-003.
- [x] `research.md` records precedent-agent analysis and scoped-write rationale.

### Definition of Done
- [ ] All four runtime mirrors carry scoped write/edit authority while bash and patch stay denied.
- [ ] Writer library and helper fallback preserve CLI compatibility.
- [ ] Audit trail and rollback tests pass.
- [ ] TypeScript compile, targeted Vitest run, and strict spec validation pass.
- [ ] P2 items are closed or explicitly documented as deferred.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scoped-write permission model plus writer-library migration. The council writes only `ai-council/**`; bash and patch remain denied.

### Key Components
- **Runtime mirrors**: permission/frontmatter and agent-body authority text.
- **Writer library**: `lib/persist-artifacts.js` exports named artifact writers and parsing/rendering helpers.
- **Audit trail**: `lib/audit-trail.js` emits v1.2 `artifact_written` events and checksums.
- **Rollback**: `lib/rollback.js` moves failed round artifacts and appends supersede markers.
- **Fallback CLI**: `persist-artifacts.cjs` remains the backward-compatible entrypoint.

### Data Flow
Council output is parsed/rendered into artifacts, each artifact writer resolves a relative path under `ai-council/`, writes content, reads it back for checksum/bytes, and appends an audit event to `ai-council-state.jsonl`. Rollback moves failed round artifacts to `failed/` and appends rollback/supersede events.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Runtime mirror permissions | Defines council authority | Flip write/edit scope to `ai-council/**`; keep bash/patch denied | Runtime parity test |
| Persistence helper | Dispatcher-owned artifact write path | Refactor into library plus thin CLI fallback | Audit/rollback/CLI tests |
| State schema references | v1.1 JSONL metadata | Add v1.2 audit and rollback events | Audit-trail test and docs review |
| Packet docs | Level 3 governance | Re-author from templates with anchors | Strict spec validation |

Required inventories:
- Same-class producers: runtime mirrors and helper references searched for planning-only/write-deny language.
- Consumers of changed symbols: new tests import `persist-artifacts.js`, `audit-trail.js`, and `rollback.js`.
- Matrix axes: runtime mirror, write target path, event type, rollback round.
- Algorithm invariant: all writer targets must resolve inside `<packet>/ai-council/`; otherwise throw `OUT_OF_SCOPE_WRITE`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read authored spec, ADRs, research, placeholders, templates, and council infrastructure.
- [x] Identify code/doc surfaces and verification commands.
- [x] Confirm blocker: `.codex/agents/multi-ai-council.toml` is not writable in this sandbox.

### Phase 2: Core Implementation
- [x] Refactor helper logic into `lib/persist-artifacts.js` and thin `persist-artifacts.cjs`.
- [x] Add `lib/audit-trail.js` and `lib/rollback.js`.
- [x] Update writable markdown runtime mirrors and references.
- [x] Add four target Vitest files.
- [ ] Update Codex TOML mirror once filesystem permits.

### Phase 3: Verification
- [x] Direct TypeScript compile passes.
- [ ] Targeted Vitest run passes.
- [ ] Strict spec validation passes.
- [ ] Sandbox smoke confirms council-owned writes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Compile | MCP server TypeScript sources | `node ../node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json` |
| Permission scope | In-scope writer and out-of-scope rejection | Vitest |
| Runtime parity | Markdown mirror byte-equivalence plus Codex TOML contract | Vitest |
| Audit trail | v1.2 event shape, checksum, rotation, v1 reader tolerance | Vitest |
| Rollback | round-NNN move to failed plus supersede markers | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 080 mirror parity pattern | Predecessor | Available | Parity test shape would need redesign |
| Packet 089 schema policy | Predecessor | Available | v1-reader tolerance unclear |
| Runtime path-scope semantics | Infrastructure | Declared by packet | Security boundary cannot be claimed without tests |
| Codex TOML file write access | Filesystem | Blocked | 4-runtime parity cannot pass |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: permission-scope regression, audit corruption, helper CLI incompatibility, or runtime parity failure.
- **Procedure**: revert runtime mirror permission text, keep helper fallback, remove or disable v1.2 audit emission if needed, and rerun targeted tests plus strict spec validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Core) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Authored spec/ADR/research docs | Core |
| Core | Setup and existing helper/agent infrastructure | Verify |
| Verify | Core implementation and docs | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Core Implementation | High | 4-8 hours |
| Verification | Medium | 1-3 hours |
| **Total** | | **6-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Four runtime mirrors confirmed aligned.
- [ ] Helper CLI compatibility confirmed.
- [ ] Audit/rollback tests passing.

### Rollback Procedure
1. Restore write/edit deny in all runtime mirrors.
2. Restore helper-owned persistence wording if direct council writes are disabled.
3. Keep additive v1.2 rows readable; v1 readers ignore unknown event types.
4. Rerun parity and strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: No data migration reversal required; audit events are append-only history.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Spec/ADR/Research -> Writer Lib -> Agent Mirrors -> Tests -> Strict Validation
                  -> Audit Lib  -> References   -> Implementation Summary
                  -> Rollback Lib
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Writer library | Existing helper | Named exports and CLI fallback | Audit and rollback tests |
| Runtime mirrors | ADR-001 | Scoped-write contract | Parity test |
| Audit schema | ADR-002 | v1.2 events | Advisor/test docs |
| Rollback helpers | ADR-003 | failed/ move and supersede markers | Rollback E2E |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Template-compliant packet docs** - Medium - CRITICAL
2. **Writer/audit/rollback library implementation** - High - CRITICAL
3. **Four runtime mirror parity** - High - CRITICAL
4. **Targeted verification and strict validation** - Medium - CRITICAL

**Total Critical Path**: 6-13 hours

**Parallel Opportunities**:
- Reference docs and tests can be authored after the writer interfaces are stable.
- Changelog/resource-map can be authored after file scope is known.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Docs restored | Level 3 anchors present | Phase 1 |
| M2 | Core writer path implemented | Helper and named exports available | Phase 2 |
| M3 | Runtime parity closed | Four mirrors aligned | Phase 2 |
| M4 | Release ready | Compile, tests, strict validation pass | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Path-scoped write-permission model

**Status**: Accepted

**Context**: Council artifacts need direct writes without granting code/spec mutation authority.

**Decision**: Allow write/edit only under `ai-council/**`; keep bash and patch denied.

**Consequences**:
- Council can persist artifacts directly.
- Runtime path-scope and parity tests become security gates.

**Alternatives Rejected**:
- Full write/edit/bash/patch grant: too broad for the artifact-write use case.
