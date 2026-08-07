---
title: "Implementation Plan: CLI Hooks and Plugin (Playbook Run Phase 003)"
description: "Pipe documented JSON payloads through each compiled dist hook (claude/gemini/codex/devin) and the opencode plugin bridge, capture stdout/stderr/exit, and assign verdicts."
trigger_phrases:
  - "playbook cli hooks plan"
  - "028 phase 003 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/003-cli-hooks-and-plugin"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "Documented CL execution plan"
    next_safe_action: "Phase 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: CLI Hooks and Plugin (Playbook Run Phase 003)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node (compiled dist hooks), bash |
| **Framework** | system-skill-advisor + system-spec-kit hook adapters |
| **Storage** | none (stdin/stdout) |
| **Testing** | hook smoke via printf-pipe-node |

### Overview
Pipe each runtime's documented payload into its compiled hook, capture stdout/stderr/exit, and assert prompt-safe output + correct runtime tag. Run the bridge directly for CL-005.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (hook smokes exit 0)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipe-and-assert per runtime adapter.

### Key Components
- **claude/gemini/codex/devin hooks**: UserPromptSubmit (and Codex SessionStart + wrapper)
- **mk-skill-advisor-bridge.mjs**: opencode plugin native+python bridge

### Data Flow
JSON payload on stdin → hook produces `{}` or `hookSpecificOutput.additionalContext` on stdout; diagnostics on stderr.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Test-execution phase. Bridge route finding recorded, not remediated.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mk-skill-advisor-bridge.mjs` | opencode native+python bridge | observed only | CL-005: route python, SYSTEM_SKILL_ADVISOR_UNAVAILABLE despite compat present |
| dist hooks (4 runtimes) | prompt-time adapters | observed only | exit 0 + prompt-safe stderr |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm compiled dist hooks exist for all four runtimes
- [x] Confirm bridge + plugin host files exist

### Phase 2: Core Implementation
- [x] CL-001 Claude hook smoke
- [x] CL-003 Gemini hook smoke (BeforeAgent)
- [x] CL-004 Codex SessionStart + UserPromptSubmit + wrapper
- [x] CL-005 OpenCode bridge direct invocation
- [x] CL-006 Devin hook (substantive/short/malformed) + registration check

### Phase 3: Verification
- [x] Assert exit 0 + JSON validity per smoke
- [x] Assert runtime tags + no prompt leak
- [x] Record bridge fail-open finding
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | hook stdout/stderr/exit | printf | node |
| Assertion | prompt-safety + runtime tag | grep |
| Manual | live TUI (deferred optional) | n/a |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Compiled dist hooks | Internal | Green | Smokes can't run |
| .devin/hooks.v1.json | Internal | Green | CL-006 registration check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A (read-only smokes).
- **Procedure**: No state to roll back; evidence is under /tmp.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core (5 smokes) ──► Verify (assert + record)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 build | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 004 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 2 min |
| Core | Low | 8 min |
| Verification | Low | 5 min |
| **Total** | | **~15 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No source changes
- [x] No state mutation
- [x] Evidence under /tmp only

### Rollback Procedure
1. None required (read-only)
2. Re-run smokes if dist is rebuilt
3. No stakeholder notification

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
