---
title: "Feature Specification: CLI Hooks and Plugin (Playbook Run Phase 003)"
description: "Execute the CLI runtime hook scenarios CL-001/003/004/005/006 and the opencode plugin bridge of the skill-advisor playbook via compiled dist hooks, capturing stdout/stderr/exit and assigning verdicts."
trigger_phrases:
  - "playbook cli hooks scenarios"
  - "CL scenarios skill advisor"
  - "028 phase 003"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/003-cli-hooks-and-plugin"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "Ran CL-001/003/004/005/006 hook smokes; recorded verdicts + bridge fail-open finding"
    next_safe_action: "Phase 004 shell/python/daemon waves"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: CLI Hooks and Plugin (Playbook Run Phase 003)

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
The CLI hook scenarios validate the prompt-time advisor adapters for Claude, Gemini, Codex and Devin runtimes plus the OpenCode plugin bridge. Each must surface a prompt-safe `additionalContext` brief, skip short prompts, fail open on malformed input, and never leak the raw prompt into stderr diagnostics.

### Purpose
Confirm every compiled hook adapter behaves per contract against the current build, and surface any adapter that fails to engage its intended route.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- CL-001 Claude, CL-003 Gemini, CL-004 Codex (SessionStart + UserPromptSubmit + wrapper), CL-006 Devin hook smokes.
- CL-005 OpenCode plugin bridge direct invocation.

### Out of Scope
- Live interactive TUI verification (Devin `/hooks`, `codex features list`, stdin-over-argv precedence) — optional manual steps, not exercised.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `/tmp/skill-advisor-playbook/cl-*.stdout.json`, `/tmp/devin-hook-playbook/*` | Evidence | Captured hook stdout/stderr (untracked) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each hook exits 0 | stdout is valid JSON (`{}` or `hookSpecificOutput.additionalContext`) |
| REQ-002 | No prompt leak | Raw prompt literal absent from every captured stderr |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Runtime tags correct | stderr diagnostics carry the expected `runtime` value |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five CL scenarios carry a recorded verdict.
- **SC-002**: Any non-engaging route (e.g. bridge fail-open) is recorded with evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Compiled dist hooks | Smokes can't run | Built in phase 001 |
| Risk | Live TUI steps unavailable | Partial coverage | Documented as out-of-scope optional steps |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each hook returns within interactive latency.

### Security
- **NFR-S01**: No raw prompt literal in stderr diagnostics for any runtime.

### Reliability
- **NFR-R01**: Hooks fail open (emit `{}`) on malformed stdin rather than crashing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: short prompt ("hi") returns `{}` (CL-006).
- Maximum length: not exercised.
- Invalid format: malformed stdin ("not-json") returns `{}` fail-open (CL-006).

### Error Scenarios
- External service failure: opencode bridge native route unavailable → python fallback → fail-open envelope (CL-005).
- Network timeout: N/A (local node).
- Concurrent access: N/A.

### State Transitions
- Partial completion: CL-005 native route does not engage; bridge still returns prompt-safe fail-open.
- Session expiry: N/A.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 5 scenarios, 4 runtimes + bridge |
| Risk | 5/25 | Local node smokes, no writes |
| Research | 6/20 | Map payload shapes per runtime |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Why does the OpenCode plugin bridge fall to the python route + `SYSTEM_SKILL_ADVISOR_UNAVAILABLE` even though `dist/mcp_server/compat/index.js` exists? Recorded for triage.
<!-- /ANCHOR:questions -->
