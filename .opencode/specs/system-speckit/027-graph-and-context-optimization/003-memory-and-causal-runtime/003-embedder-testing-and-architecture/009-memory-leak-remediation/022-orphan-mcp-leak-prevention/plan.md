---
title: "Implementation Plan: Orphan MCP Leak Prevention"
description: "Implement a dry-run-first MCP sweeper, repo-local Claude Stop cleanup, and configurable idle self-exit in the three MCP server processes."
trigger_phrases:
  - "orphan mcp leak prevention plan"
  - "mcp sweeper implementation"
  - "launcher idle timeout implementation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention"
    last_updated_at: "2026-05-24T06:58:36Z"
    last_updated_by: "codex"
    recent_action: "plan executed for Layers 1, 2, and 3"
    next_safe_action: "operator reviews dry-run output before LaunchAgent activation"
    blockers: []
    key_files:
      - ".opencode/scripts/orphan-mcp-sweeper.sh"
      - ".opencode/scripts/claude-session-cleanup.sh"
      - ".claude/settings.local.json"
    session_dedup:
      fingerprint: "sha256:0220220220220220220220220220220220220220220220220220220220220220"
      session_id: "2026-05-24-orphan-mcp-leak-prevention-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Orphan MCP Leak Prevention

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, JSON, TypeScript, Node.js |
| **Framework** | MCP SDK server transports |
| **Storage** | Existing launcher lease files and local `/tmp` artifacts |
| **Testing** | `bash -n`, `python3 -m json.tool`, Vitest, TypeScript typecheck, spec validation |

### Overview
This implementation adds tactical cleanup and preventive shutdown. Layer 1 handles stale orphan cleanup via a dry-run-first script, Layer 2 cleans Claude session descendants at Stop time, and Layer 3 adds idle shutdown to the MCP servers that own the IPC socket bridge.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Sweeper dry-run shows candidates and preserve reasons without mutation
- [x] Claude settings JSON validates and settings parity vitest passes
- [x] Idle timeout tests pass for inactive, active, and disabled modes
- [x] Targeted typechecks and spec validation pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered local remediation: external sweep fallback, session-end cleanup, and server-owned idle lifecycle.

### Key Components
- **Sweeper script**: classifies processes, preserves live work, and optionally terminates stale helper processes.
- **Claude cleanup script**: finds descendants of the current Claude session and terminates matching MCP helpers.
- **IPC activity tracker**: updates last-activity timestamps on primary stdio and secondary IPC socket events.
- **Idle timer**: exits MCP server processes when no client activity occurs for the configured interval.

### Data Flow
The sweeper reads process tables and TCP listeners, classifies candidates, logs decisions, and in non-dry-run sends signals. Claude Stop invokes the existing session-stop hook first, then cleanup in the same command. MCP servers update an in-process activity timestamp from stdio and IPC events; a timer closes IPC state and exits when inactivity exceeds the configured limit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/scripts/` | Versioned local ops scripts | Add sweeper, cleanup, and plist template | `bash -n`, dry-run transcript |
| `.claude/settings.local.json` | Runtime Claude hook wiring | Chain cleanup into existing Stop command | JSON parser and settings parity vitest |
| MCP IPC socket servers | Secondary-client bridge | Add optional activity callback | IPC bridge vitest |
| MCP server entrypoints | Own process lifetime | Add idle timeout timers and graceful close | Targeted idle tests and typecheck |

Required inventories:
- Process match patterns come from the handoff: launcher CJS, context/advisor/code-graph servers, code-mode, ClickUp, `ccc`, rerank sidecar, and sequential-thinking.
- Consumer inventory: `rg -n "startIpcSocketServer|resolveIpcSocketPath|getIpcBridgeStats" .opencode/skills`.
- Matrix axes: process class, age, parent/session relationship, TCP listener, operator exclusion, and dry-run flag.
- Algorithm invariant: no kill action may occur unless a process matches an orphan pattern and no preserve rule applies.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Level 3 spec packet created
- [x] Parent phase metadata lists child `022`
- [x] Placeholder spec docs replaced

### Phase 2: Core Implementation
- [x] Add orphan MCP sweeper and LaunchAgent template
- [x] Add Claude session cleanup and chain Stop hook
- [x] Add IPC activity callbacks
- [x] Add idle timeout timers to all three MCP servers
- [x] Add targeted tests

### Phase 3: Verification
- [x] Shell and JSON syntax checks pass
- [x] Sweeper dry-run reviewed
- [x] Vitest, typecheck, alignment, and strict spec validation run
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Shell scripts and Claude JSON | `bash -n`, `python3 -m json.tool` |
| Unit | Process classification helpers and idle parsers where practical | Bash fixtures, Vitest |
| Integration | IPC bridge activity and idle timeout | Vitest with TCP socket fixtures |
| Manual | Live process dry-run | `orphan-mcp-sweeper.sh --dry-run --verbose` |
| Compliance | Spec packet and OpenCode alignment | `validate.sh --strict`, `verify_alignment_drift.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| macOS process tools | External local | Green | Sweeper cannot classify or terminate processes. |
| Claude nested hook schema | Runtime config | Green | Stop hook update would be unsafe. |
| MCP SDK Stdio transport | Internal dependency | Green | IPC activity tests rely on server transport behavior. |
| Existing launcher lease cleanup | Internal code | Green | Idle exit must preserve lease cleanup semantics. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Dry-run output shows unsafe candidates, hook schema tests fail, or idle tests show active clients are interrupted.
- **Procedure**: Revert the scoped script/config/MCP changes, remove child `022` from parent phase metadata if the packet is abandoned, and re-run JSON/spec validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Spec docs -> Scripts/config -> MCP idle timeout -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 30-45 minutes |
| Core Implementation | High | 4-6 hours |
| Verification | High | 2-3 hours |
| **Total** | | **6.5-9.75 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] LaunchAgent activation excluded from this pass
- [x] Sweeper dry-run reviewed before any non-dry-run use
- [x] Stop hook schema validated

### Rollback Procedure
1. Revert `.claude/settings.local.json` to the previous Stop command.
2. Remove or ignore the two new scripts and LaunchAgent template.
3. Revert MCP idle timeout changes and targeted tests.
4. Re-run JSON validation and affected vitest suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Spec packet
  -> Sweeper scripts
  -> Claude config chain
  -> IPC activity callbacks
  -> MCP idle timers
  -> Verification
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Spec packet | Existing phase parent | Scope and acceptance contract | All implementation |
| Sweeper | Process table patterns | Dry-run cleanup candidate report | LaunchAgent template verification |
| Claude cleanup | Existing Stop hook | Session-local cleanup | Hook validation |
| IPC callbacks | Socket server bridge | Activity signals | Idle timers |
| Idle timers | Activity signals | Self-exit behavior | Targeted tests |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Spec and parent metadata** - 45 minutes - CRITICAL
2. **Sweeper and cleanup scripts** - 2 hours - CRITICAL
3. **Idle timeout plumbing** - 3 hours - CRITICAL
4. **Verification** - 2 hours - CRITICAL

**Total Critical Path**: 7.75 hours

**Parallel Opportunities**:
- Sweeper script tests and Claude config validation can run independently from MCP idle tests.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 Docs ready | Child packet and parent metadata validate. |
| M2 Tactical cleanup ready | Sweeper and Claude cleanup scripts pass syntax and dry-run checks. |
| M3 Preventive idle ready | MCP idle tests and typechecks pass. |
| M4 Rollout-ready dry-run | All requested dry-run-first checks complete. |
<!-- /ANCHOR:milestones -->
