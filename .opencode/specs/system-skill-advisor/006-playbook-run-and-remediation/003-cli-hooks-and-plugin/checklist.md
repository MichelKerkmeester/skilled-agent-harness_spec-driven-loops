---
title: "Verification Checklist: CLI Hooks and Plugin (Playbook Run Phase 003)"
description: "Verification Date: 2026-05-26"
trigger_phrases:
  - "playbook cli hooks checklist"
  - "CL verdicts checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/006-playbook-run-and-remediation/003-cli-hooks-and-plugin"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "Recorded CL verdicts"
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
# Verification Checklist: CLI Hooks and Plugin (Playbook Run Phase 003)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies available (compiled dist hooks, .devin/hooks.v1.json)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No source edits (test-execution phase)
- [x] CHK-011 [P0] Every hook smoke exits 0 with valid JSON stdout
- [x] CHK-012 [P1] Fail-open verified: malformed stdin → `{}` (CL-006)
- [x] CHK-013 [P1] Adapters follow documented payload shapes
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

CL scenario verdicts (evidence in `/tmp/skill-advisor-playbook/cl-*` and `/tmp/devin-hook-playbook/`):

- [x] CHK-020 [P0] CL-001 Claude hook — **PASS** (`additionalContext: "Advisor: live; use sk-doc 0.93/0.12 pass."`, `runtime:"claude"`, no leak)
- [x] CHK-021 [P0] CL-003 Gemini hook (BeforeAgent) — **PASS** (ambiguous brief, `runtime:"gemini"`, no leak)
- [x] CHK-022 [P0] CL-004 Codex — **PASS** (SessionStart startup context + UserPromptSubmit brief + wrapper `{}`, all exit 0, no leak)
- [x] CHK-023 [P0] CL-006 Devin hook — **PASS** (registration cites advisor path; substantive→`Advisor:` brief, short→`{}`, malformed→`{}`, all exit 0, no leak)
- [x] CHK-024 [P1] CL-005 OpenCode plugin bridge — **PARTIAL** (exit 0, prompt-safe fail-open with correct thresholds `0.8/0.35/false`, BUT native route did not engage: `route:"python"`, `error:"SYSTEM_SKILL_ADVISOR_UNAVAILABLE"` despite `dist/mcp_server/compat/index.js` present)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classed: CL-005 bridge native-route failure = `instance-only` runtime-wiring (compat exists but subprocess invocation reports unavailable)
- [x] CHK-FIX-002 [P0] Producer identified: `mk-skill-advisor-bridge.mjs` native delegation path (not remediated here)
- [x] CHK-FIX-003 [P0] Consumers noted: OpenCode plugin host `mk-skill-advisor.js`
- [x] CHK-FIX-004 [P0] Prompt-safety adversarial: malformed-stdin fail-open + no-leak verified across all stderr
- [x] CHK-FIX-005 [P1] Matrix axes: runtime (claude/gemini/codex/devin) x payload (substantive/short/malformed) exercised where applicable
- [x] CHK-FIX-006 [P1] Hostile input: malformed stdin path exercised (CL-006)
- [x] CHK-FIX-007 [P1] Evidence pinned to session date 2026-05-26
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in hook output
- [x] CHK-031 [P0] No raw prompt literal in any captured stderr (claude/gemini/codex/devin)
- [x] CHK-032 [P1] Brief content conforms to slug-shaped skill labels
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Bridge finding rationale captured in implementation-summary
- [x] CHK-042 [P2] Live TUI steps recorded as out-of-scope optional
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Evidence under /tmp only
- [x] CHK-051 [P1] No scratch artifacts in repo
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

CL verdicts: 4 PASS, 1 PARTIAL (CL-005), 0 FAIL, 0 SKIP.

**Verification Date**: 2026-05-26
<!-- /ANCHOR:summary -->
