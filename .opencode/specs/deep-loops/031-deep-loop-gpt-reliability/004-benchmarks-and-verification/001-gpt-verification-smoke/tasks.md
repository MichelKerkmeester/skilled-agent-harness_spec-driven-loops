---
title: "Tasks: GPT First-Dispatch Verification Smoke"
description: "Task list and evidence for phase 004 GPT first-dispatch verification."
trigger_phrases:
  - "tasks"
  - "gpt-verification-smoke"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/004-benchmarks-and-verification/001-gpt-verification-smoke"
    last_updated_at: "2026-06-30T21:05:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "User-approved nested command-owned GPT smokes attempted; gate failed before leaf dispatch"
    next_safe_action: "Keep phase 005 parked unless external full smoke later produces route-mismatched artifacts"
    blockers:
      - "Command-owned cli-opencode branches still refused nested OpenCode self-invocation"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-004-tasks"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Should phase 004 close as blocked/fail-closed, or should an external shell rerun the full smoke for a clean PASS?"
    answered_questions:
      - question: "May cli-opencode be used from this OpenCode session?"
        answer: "User granted a one-off exception for bounded probes."
      - question: "May nested/self-invocation be attempted from this session?"
        answer: "User selected option 3; command-owned nested smokes were attempted."
---
# Tasks: GPT First-Dispatch Verification Smoke

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

**Task Format**: `T### [priority] Description - Evidence or blocker`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 [P0] Confirm phase 003 is complete - Evidence: phase 003 strict validation passed.
- [x] T002 [P0] Verify GPT provider availability - Evidence: `opencode providers list` showed OpenAI configured and `opencode models openai` listed `openai/gpt-5.5`.
- [x] T003 [P0] Load `cli-opencode` contract - Evidence: self-invocation and parallel-detached exception rules reviewed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 [P0] Write `verification-smoke.md` - Evidence: procedure and bounded probe results recorded.
- [x] T005 [P0] Run bounded GPT route probe for research - Evidence: session `ses_0e613db01ffeA7yKqJ54kEO1TV`, route preserved, `agent_definition_loaded:false`.
- [x] T006 [P0] Run bounded GPT route probe for review - Evidence: session `ses_0e613463affeXpSnqAb228mZcy`, route preserved, `agent_definition_loaded:false`.
- [x] T007 [P0] Run bounded GPT route probe for context - Evidence: session `ses_0e612c684ffe0E2M5dPoGDUxl4`, route preserved, `agent_definition_loaded:false`.
- [x] T008 [P0] Run bounded GPT route probe for ai-council - Evidence: session `ses_0e6123004ffeBgjlfoHK9eiXHy`, route preserved, `agent_definition_loaded:false`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T009 [P0] Run full command-owned GPT first dispatch per mode - Evidence: attempted after explicit user approval. Research halted with `GENERAL AGENT REQUIRED failure`; review refused `cli-opencode` self-invocation; context wrote blocked artifacts; ai-council wrote failed artifacts.
- [B] T010 [P0] Record native/Claude baseline per mode - Blocked because GPT command-owned smoke did not reach a comparable passing first dispatch.
- [x] T011 [P0] Record interim FIX-5 decision - Evidence: do not unpark 005 based only on bounded probes.
- [x] T012 [P0] Record final FIX-5 decision after full command-owned smoke - Evidence: do not unpark phase 005; no schema-valid route-mismatched artifact was produced.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] Procedure documented.
- [x] Bounded GPT route probes recorded.
- [x] Full smoke blocker recorded.
- [x] Full command-owned smoke passed or failed with route-proof evidence.
- [x] Final phase 005 decision recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Implementation Summary**: See `implementation-summary.md`.
- **Smoke Procedure**: See `verification-smoke.md`.
<!-- /ANCHOR:cross-refs -->
