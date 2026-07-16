---
title: "Implementation Plan: Daemon-reliability follow-ups"
description: "Ship the orphan-sweep LaunchAgent template, add a hermetic re-election release-vs-kill integration test designed by an opus council, re-run scenario 419 for real, and document cli MCP sessionId scoping."
trigger_phrases:
  - "daemon reliability follow-ups plan"
  - "re-election integration test plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/026-daemon-reliability-followups"
    last_updated_at: "2026-06-07T21:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Plist + integration test + sessionId note done; 419 re-run PASS"
    next_safe_action: "Reconcile docs, commit and push"
    blockers: []
    key_files:
      - ".opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-026-daemon-reliability-followups"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Daemon-reliability follow-ups

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | macOS LaunchAgent plist, TypeScript vitest, Markdown reference |
| **Framework** | vitest stress config for the integration test |
| **Storage** | None |
| **Testing** | plutil lint, a hermetic vitest integration test, a real scenario re-run |

### Overview
Four small, mostly independent deliverables. An opus council resolved the only hard one: the re-election test must be hermetic because the launcher's lease and DB dir are hardcoded relative to the script, so a real spawn would touch shared state. The chosen test drives the real exported decision functions plus real OS process semantics with a sleeper stand-in.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Investigation identified the four follow-ups
- [x] Opus council resolved the safe-isolation design
- [x] Sweeper interface and lint target confirmed

### Definition of Done
- [ ] plist lints, integration test passes, 419 passes for real
- [ ] sessionId caveat added
- [ ] Docs updated and packet validated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Hermetic process-level integration test plus a static template and a doc caveat.

### Key Components
- **com.michelkerkmeester.orphan-sweep.plist**: dry-run-default LaunchAgent template.
- **daemon-reelection-release-integration.vitest.ts**: real-primitive release-vs-kill test.

### Data Flow
The test requires the launcher (import-pure), computes spawn-io and the release decision from the real functions, spawns a detached sleeper, SIGTERMs the owner harness, and asserts survive-or-die.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Scenario 419 plist lint | Lints a non-existent template | Create the template | plutil -lint OK |
| Re-election release path | Unit-tested only | Add a hermetic live integration test | flag-on survives, flag-off dies |
| cli sub-session memory calls | Hit E_SESSION_SCOPE on a foreign sessionId | Document omit-sessionId | caveat present in memory_handback.md |

Required inventories:
- Launcher lease/DB dir is hardcoded (`root = path.resolve(__dirname, '..', '..')`), with no DB-dir env override, so isolation by env is impossible. This forces the hermetic design.
- Sweeper flags verified against `orphan-mcp-sweeper.sh` (--dry-run, --verbose, --log-path).
- Invariant: the live context-server pid is unchanged after the test.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Investigation produced the four follow-ups
- [x] Opus council designed the hermetic test
- [x] Sweeper interface and 419 lint target confirmed

### Phase 2: Core Implementation
- [x] Create the orphan-sweep LaunchAgent template
- [x] Add the hermetic re-election integration test
- [x] Add the sessionId scoping caveat

### Phase 3: Verification
- [x] plist lints, integration test passes, 419 passes for real
- [ ] Docs updated and packet validated
- [ ] Commit and push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Lint | LaunchAgent plist structure | plutil -lint |
| Integration | Re-election release-vs-kill | vitest stress config |
| Manual | Scenario 419 end to end | bash, plutil, sweeper dry-run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Re-election exported functions | Internal | Green | No live test possible |
| vitest stress runner | Internal | Green | Run the file directly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A flaky integration test or a lint regression.
- **Procedure**: Revert the packet commit; all additions are isolated and the template is not installed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Council-assisted, done |
| Core Implementation | Medium | Test + plist + caveat |
| Verification | Low | lint, test, scenario, validate |
| **Total** | | One working session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Test is hermetic and pid-scoped
- [x] Live daemon confirmed untouched after the run
- [ ] Verification green before commit

### Rollback Procedure
1. Identify the packet commit hash.
2. `git revert` the commit.
3. Re-run plutil -lint and the integration test to confirm the revert is clean.
4. No stakeholder notice needed; the template is not installed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
