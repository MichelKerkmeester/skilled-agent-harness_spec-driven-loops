---
title: "Feature Specification: Daemon-reliability follow-ups"
description: "Four follow-ups from the anti-disconnection investigation: ship the missing orphan-sweep LaunchAgent template, add a safe live re-election integration test, re-run the affected playbook scenario for real, and document cli sub-session MCP sessionId scoping."
trigger_phrases:
  - "daemon reliability follow-ups"
  - "orphan-sweep launchagent template"
  - "re-election integration test"
  - "cli sessionId scoping"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Daemon-reliability follow-ups

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The anti-disconnection investigation left four follow-ups. The orphan-sweep LaunchAgent template that scenario 419 lints was never committed, so 419 always failed. The re-election release path had only unit coverage, with no safe live test (a raw spawn was unsafe because the launcher lease and DB dir are hardcoded relative to the script, so it would touch the shared production state). The affected scenario needed a real re-run once the plist existed. And a cli sub-session calling memory tools with a parent sessionId hits `E_SESSION_SCOPE`, which is intended behavior but undocumented.

### Purpose
Close all four: ship the template, add a hermetic live re-election test, prove scenario 419 passes for real, and document the sessionId scoping rule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The missing orphan-sweep LaunchAgent template plist at the path scenario 419 lints.
- A safe, hermetic integration test for the re-election release-vs-kill behavior.
- A real re-run of scenario 419 to confirm it now passes end to end.
- A cli MCP sessionId scoping caveat in the shared cli memory-handback reference.

### Out of Scope
- A full-live spawn of the real launcher in the test - unsafe, because the lease and DB dir are hardcoded relative to the launcher script with no env override, so it would bridge to or clobber the live owner.
- Writable re-runs of the other three sampled scenarios - their features are covered by their own vitest suites and the earlier read-only run.
- Flipping re-election on by default - that stays the machine-local opt-in under test.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` | Create | Dry-run-default LaunchAgent template, plutil-lint clean |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts` | Create | Hermetic release-vs-kill integration test |
| `.opencode/skills/system-spec-kit/references/cli/memory_handback.md` | Modify | MCP session scoping caveat for dispatched sub-sessions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Orphan-sweep plist exists and lints | `plutil -lint` reports OK at the path scenario 419 lints |
| REQ-002 | Re-election release-vs-kill is live-tested safely | The integration test passes flag-on-survives and flag-off-dies, and never touches the shared DB, socket, or lease |
| REQ-003 | Scenario 419 passes for real | All 419 commands pass, including the previously failing plist lint |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | sessionId scoping documented | The cli memory-handback reference explains omitting sessionId to avoid `E_SESSION_SCOPE` |
| REQ-005 | Live daemon untouched by the test | The production context-server pid is unchanged after the test run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Scenario 419 passes end to end and the plist lints clean.
- **SC-002**: The re-election integration test proves release-on-ON and kill-on-OFF using the real production primitives, hermetically.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A live launcher spawn touches shared state | Corrupts the production DB or lease | Use a hermetic harness with the real exported functions and a sleeper stand-in in os.tmpdir |
| Risk | macOS socket path length and /tmp realpath | Test flakiness or boundary rejection | The lighter test opens no socket or DB; temp dirs live under os.tmpdir |
| Dependency | The orphan-mcp-sweeper script interface | Wrong ProgramArguments | Flags verified against the script source |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The integration test runs in a few seconds under the stress config.
- **NFR-P02**: The plist template adds no runtime cost until an operator installs it.

### Security
- **NFR-S01**: The template ships dry-run by default, so loading it is non-destructive.
- **NFR-S02**: The test signals only processes it spawned, tracked by pid.

### Reliability
- **NFR-R01**: The test asserts real OS semantics: detached spawn, unref, SIGTERM, reparent.
- **NFR-R02**: Cleanup force-reaps tracked pids and removes temp dirs even on failure.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable; the test spawns fixed harness processes.
- Maximum length: temp dirs under os.tmpdir keep socket-free paths short.
- Invalid format: the plist is validated by plutil.

### Error Scenarios
- External service failure: not applicable; the test is local.
- Network timeout: not applicable.
- Concurrent access: the test uses its own temp processes and pids only.

### State Transitions
- Partial completion: afterEach force-reaps tracked pids so a failed case cannot leak a process.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One plist, one test, one doc caveat |
| Risk | 12/25 | Real process spawning, but hermetic and pid-scoped |
| Research | 10/20 | Opus council resolved the safe-isolation design |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None outstanding; the full-live-spawn rejection and the deferred scenario re-runs are recorded decisions.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
