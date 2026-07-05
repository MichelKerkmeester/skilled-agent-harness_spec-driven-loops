---
title: "Implementation Plan: Agent Dispatch Hardening"
description: "Land the DEEP primary router, mirror it to Claude, and add a first-class Deep Route field to orchestrator task packages. Verify registry-aligned routing, mirror parity, and Claude-flex preservation before moving to prompt headers."
trigger_phrases:
  - "implementation"
  - "plan"
  - "agent dispatch hardening"
  - "deep primary agent"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/003-agent-dispatch-hardening"
    last_updated_at: "2026-06-30T20:05:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Implemented DEEP router and orchestrate route field"
    next_safe_action: "Proceed to phase 003-command-pre-route-headers"
    blockers: []
    key_files:
      - ".opencode/agents/deep.md"
      - ".claude/agents/deep.md"
      - ".opencode/agents/orchestrate.md"
      - ".claude/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-002-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Agent Dispatch Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definitions, OpenCode/Claude runtime mirrors |
| **Framework** | OpenCode agent loader and Claude agent mirror files |
| **Storage** | Filesystem agent definitions |
| **Testing** | Node route-table check, alignment drift, comment hygiene, strict spec validation |

### Overview
This phase adds a primary `deep` router agent that resolves four runtime deep modes through `mode-registry.json` and dispatches exactly one loaded target agent. It also adds a `Deep Route:` field to orchestrator task packages so deep route identity is explicit before `Subagent Type`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001 strict validation passed.
- [x] Iteration-004 `deep.md` draft reviewed.
- [x] Current registry and agent definitions read.

### Definition of Done
- [x] `.opencode/agents/deep.md` created.
- [x] `.claude/agents/deep.md` mirror created.
- [x] OpenCode and Claude orchestrators include `Deep Route:` field.
- [x] Route table check passes against `mode-registry.json`.
- [x] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Primary router agent with registry-backed route resolution and single-hop delegation.

### Key Components
- **`deep.md`**: Primary router for `/deep:*` requests.
- **`mode-registry.json`**: Source of truth for workflow mode, command, packet, target agent, and artifact root.
- **`orchestrate.md` task format**: Adds `Deep Route:` as an explicit dispatch field for deep routes.

### Data Flow
A deep request enters the `deep` router or orchestrator. The mode is resolved from explicit command/mode through `mode-registry.json`, the selected agent definition is loaded, the `Deep Route:` header is emitted, and exactly one depth-1 agent is dispatched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/agents/deep.md` | New OpenCode primary router | Created from iteration-004 design | Route-table check PASS |
| `.claude/agents/deep.md` | Claude mirror | Created with Claude path/tool conventions | Route-table check PASS |
| `.opencode/agents/orchestrate.md` | OpenCode orchestrator task format | Added `Deep Route:` field | Comment hygiene PASS |
| `.claude/agents/orchestrate.md` | Claude orchestrator task format | Mirrored `Deep Route:` field | Comment hygiene PASS |

Required inventories:
- Same-class producers: `mode-registry.json` entries for `context`, `research`, `review`, and `ai-council`.
- Consumers: `deep.md` and orchestrator task packages.
- Matrix axes: four modes, two runtime mirrors, direct council invocation vs routed council invocation.
- Algorithm invariant: deep dispatch cannot proceed when mode, registry entry, agent, definition path, and artifact root disagree.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read phase-002 spec and iteration-004 draft.
- [x] Read `mode-registry.json` and existing agent definitions.

### Phase 2: Core Implementation
- [x] Create `.opencode/agents/deep.md`.
- [x] Create `.claude/agents/deep.md`.
- [x] Add `Deep Route:` field to OpenCode and Claude orchestrator task formats.

### Phase 3: Verification
- [x] Run registry route-table check.
- [x] Run alignment drift checks for agent directories.
- [x] Run comment hygiene on changed orchestrators.
- [x] Run strict phase validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Route table | Four runtime deep modes against registry | Node script |
| Static | Agent directory alignment | `verify_alignment_drift.py` |
| Hygiene | Modified orchestrator files | `check-comment-hygiene.sh` |
| Spec | Phase documentation and metadata integrity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 route-proof validation | Phase dependency | Green | Downstream pass claims would be weak |
| Iteration-004 draft | Research artifact | Green | `deep.md` source would be underspecified |
| Iteration-006 flex table | Research artifact | Green | Claude-flex preservation would be unverified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new primary router breaks agent loading or deep route resolution.
- **Procedure**: Remove `.opencode/agents/deep.md` and `.claude/agents/deep.md`, revert the `Deep Route:` field in both orchestrators, rerun route-table/static checks, and keep phase 001 as the last completed gate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 001 route proof -> Phase 002 agent dispatch -> Phase 003 pre-route headers
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 003 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Complete |
| Core Implementation | Medium | Complete |
| Verification | Medium | In progress |
| **Total** | | **Phase-local** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No persisted data migration.
- [x] Route registry checked before writing router files.
- [x] Claude mirror created in the expected runtime directory.

### Rollback Procedure
1. Delete the two new `deep.md` mirror files.
2. Revert `Deep Route:` lines in both orchestrators.
3. Rerun route-table and strict spec validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: File revert only.
<!-- /ANCHOR:enhanced-rollback -->

---
