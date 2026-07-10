---
title: "Implementation Plan: mk-code-graph remediation"
description: "The fix approach for the 13 mk-code-graph findings, grouped by severity."
trigger_phrases:
  - "mk-code-graph remediation"
  - "mk-code-graph fixes"
  - "mk-code-graph bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/003-mk-code-graph"
    last_updated_at: "2026-07-10T11:42:16.907Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Drafted fix approach for mk-code-graph"
    next_safe_action: "Implement P1 fixes"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-code-graph.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mk-code-graph remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JS plugin + Claude hook |
| **Framework** | OpenCode plugin API + Claude settings.json hooks |
| **Storage** | plugin state files where applicable |
| **Testing** | plugin tests under .opencode/plugins/tests + validate.sh |

### Overview
Apply 13 fixes to `mk-code-graph` and its Claude hook version, ordered P1 -> P2 -> refinement, each verified against its finding. Capture a green test baseline first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Baseline plugin tests captured green
- [ ] Each targeted finding confirmed to reproduce

### Definition of Done
- [ ] All P1 fixes applied and verified
- [ ] Plugin tests green; parity with Claude hook holds
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Severity-ordered fix batches (P1 first), each isolated and independently verifiable.

### Key Components
- **Plugin entrypoint**: `.opencode/plugins/mk-code-graph.js`
- **Affected surfaces**: 4 file(s) across plugin, bridge, and Claude hook

### Data Flow
Unchanged by the fixes; corrections target correctness, fail-safety, and parity, not behavior contracts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` | audited surface | apply fixes | finding no longer reproduces; tests green |
| `.claude/settings.json` | audited surface | apply fixes | finding no longer reproduces; tests green |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | audited surface | apply fixes | finding no longer reproduces; tests green |
| `.opencode/plugins/mk-code-graph.js` | audited surface | apply fixes | finding no longer reproduces; tests green |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture green baseline of the plugin test suite
- [ ] Confirm each finding reproduces before fixing

### Phase 2: Core Implementation
- [ ] Apply 3 P1 fixes (see tasks.md Phase 2)
- [ ] Apply 7 P2 fixes
- [ ] Apply 3 refinements or log as follow-ups

### Phase 3: Verification
- [ ] Re-run plugin tests green
- [ ] Verify OpenCode<->Claude parity for this plugin
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | plugin behavior | .opencode/plugins/tests/*.test.cjs |
| Regression | each fixed finding | targeted repro before/after |
| Structural | packet validity | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Plugin test suite | Internal | Green | No baseline to protect against regressions |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix regresses the plugin or its tests
- **Procedure**: Revert the offending fix commit; fixes are isolated per finding
<!-- /ANCHOR:rollback -->
