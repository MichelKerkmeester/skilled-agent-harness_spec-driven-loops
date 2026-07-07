---
title: "Feature Specification: Shell/Python/Daemon Waves (Playbook Run Phase 004)"
description: "Execute the compat, operator-H5, auto-update-daemon, auto-indexing, lifecycle-routing, scorer-fusion and python-compat scenarios; delegate self-contained waves to cli-devin (SWE-1.6) and cli-opencode (DeepSeek), run operator-H5 locally, and verify all CLI evidence."
trigger_phrases:
  - "playbook shell python daemon waves"
  - "CP OP AU AI LC SC PC scenarios"
  - "028 phase 004"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/006-playbook-run-and-remediation/004-shell-python-daemon"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "Executed phase-004 wave scenarios"
    next_safe_action: "Roll up release readiness across all phases"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Shell/Python/Daemon Waves (Playbook Run Phase 004)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The remaining 32 scenarios span seven categories: compat/disable (CP), operator-H5 daemon states (OP), auto-update daemon (AU), auto-indexing (AI), lifecycle routing (LC), scorer fusion (SC) and python compat (PC). Per operator direction (maximize CLI delegation), the self-contained waves are dispatched to two CLI executors while operator-H5 stays local; many daemon/indexing scenarios require a disposable-workspace + active-daemon harness.

### Purpose
Run every remaining scenario, delegating where safe, and verify all CLI-produced evidence independently. Surface defects (FAIL) and infrastructure-gated scenarios (SKIP) honestly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- cli-devin (SWE-1.6, dangerous mode in isolated worktree): PC-001..005, CP-001..004, AU-001..005.
- cli-opencode (DeepSeek, full MCP runtime): SC-001..005, AI-001..005, LC-001..005.
- Local (operator): OP-001..003.
- Independent verification of CLI evidence; re-run of PC-004/PC-005 in the main environment.

### Out of Scope
- Standing up a disposable-workspace + active-daemon-watcher harness for the SKIP scenarios.
- Remediating any FAIL or PARTIAL finding.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `/tmp/skill-advisor-playbook/cli-devin/**`, `cli-opencode/**`, `pc-00*-main.*` | Evidence | CLI + local re-run transcripts (untracked) |
| `/tmp/devin-wt` | Worktree | Isolated git worktree for Devin dangerous-mode dispatch (removed after run) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each scenario executed or SKIP-with-blocker | 32 verdicts recorded |
| REQ-002 | Live checkout protected | No tracked-file mutation from CLI dispatch (worktree git status clean) |
| REQ-003 | CLI evidence verified | FAIL findings reproduced in main env (PC-004/005) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Dangerous-mode escalation recorded | Devin dispatch log notes operator approval + isolation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 32 scenarios carry a recorded verdict.
- **SC-002**: PC-004/PC-005 FAIL findings confirmed in the main environment, not just the worktree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Devin dangerous mode auto-approves all tools | Could mutate repo | Isolated git worktree + /tmp-only prompt guard; worktree git status verified clean |
| Risk | CLI evidence inaccurate | Wrong verdicts | Independently re-ran PC-004/005 in main env; cross-checked SC-005 vs NC-003 |
| Dependency | Disposable-workspace+daemon harness | Needed for 13 SKIPs | Not available this session; SKIPs documented |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: PC-005 bench warm/cold p95 gates are part of the scenario assertions (both failed — recorded).

### Security
- **NFR-S01**: No prompt leakage in any python/shim output; CLI dispatch confined to /tmp writes + isolated worktree.

### Reliability
- **NFR-R01**: Python shim fails closed (empty array) when disabled; force-native fails correctly when native unavailable.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: PC-001 empty stdin returns `[]`.
- Maximum length: PC-005 bench dataset (regression cases).
- Invalid format: CP-002 invalid flag combination rejected with exit 2.

### Error Scenarios
- External service failure: Devin auto mode blocked all execution non-interactively (required dangerous mode).
- Network timeout: CLI dispatch; local re-runs unaffected.
- Concurrent access: devin + opencode dispatched concurrently (one per quota pool, operator-authorized).

### State Transitions
- Partial completion: AU/AI/LC daemon-state scenarios SKIP without a disposable+daemon harness.
- Session expiry: worktree removed after run; advisor MCP server disconnected post-rebuild (benign).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 32 scenarios, 2 CLI executors, worktree isolation |
| Risk | 16/25 | Dangerous-mode dispatch; mitigated by isolation |
| Research | 12/20 | Wave assignment + evidence verification |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The PC-004 regression suite fails at 50% P0 in the main environment (P0-MEM-001, P0-UNC-001/002, P0-CMD-001/002/003). Is this the same root cause as the NC-003 corpus accuracy regression? Recorded for triage.
<!-- /ANCHOR:questions -->
