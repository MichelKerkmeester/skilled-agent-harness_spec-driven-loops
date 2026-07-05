---
title: "Implementation Plan: GPT First-Dispatch Verification Smoke"
description: "Plan and execution record for GPT first-dispatch verification smoke."
trigger_phrases:
  - "plan"
  - "gpt-verification-smoke"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/004-benchmarks-and-verification/001-gpt-verification-smoke"
    last_updated_at: "2026-06-30T21:05:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "User-approved nested command-owned GPT smokes attempted; gate failed before leaf dispatch"
    next_safe_action: "Keep phase 005 parked unless external full smoke later produces route-mismatched artifacts"
    blockers:
      - "Nested command-owned cli-opencode dispatch is blocked by command/executor self-invocation guards"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-004-plan"
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
# Implementation Plan: GPT First-Dispatch Verification Smoke

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode deep command verification |
| **Model** | `openai/gpt-5.5` for bounded probes |
| **Mode Coverage** | research, review, context, ai-council |
| **Primary Blocker** | Nested command-owned dispatch trips OpenCode self-invocation guards before leaf dispatch |

### Overview

The phase documents the full smoke procedure, executes bounded GPT route probes under the user's exception, attempts command-owned nested smokes after explicit approval, and records why the acceptance gate still does not pass. The final FIX-5 decision for current evidence is to keep phase 005 parked.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phases 001-003 completed and phase 003 strict validation passed.
- [x] GPT provider available through OpenAI.
- [x] User granted a one-off `cli-opencode` exception for bounded probes.

### Definition of Done

- [x] Smoke procedure documented.
- [x] Bounded GPT route probes recorded.
- [x] Full command-owned first-dispatch smoke attempted and failure evidence recorded.
- [x] Final FIX-5 decision recorded for current evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-first verification with fail-closed interpretation. Route echo probes are supporting evidence, not final route-proof evidence.

### Key Components

- **Full procedure**: Uses command-owned workflow artifacts and route-proof records.
- **Bounded probes**: Use no-tools GPT route echo to check whether GPT preserves headers.
- **Decision record**: Keeps phase 005 parked unless the full smoke trigger fires.

### Data Flow

1. Read completed phase 001-003 evidence and research verification criteria.
2. Run GPT route probes only within the user's exception and without writes.
3. Record route preservation and `agent_definition_loaded` status.
4. Attempt command-owned registered command smokes only after explicit user approval.
5. Keep phase 005 parked unless schema-valid route-mismatched artifacts appear.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Procedure

- [x] Write `verification-smoke.md` with full command-owned steps.

### Phase 2: Bounded Probe Run

- [x] Run GPT route echo probes for four modes.
- [x] Record session IDs and route preservation results.

### Phase 3: Full Smoke

- [x] Run command-owned GPT first-dispatch attempts per mode.
- [B] Record native/Claude baseline.

### Phase 4: Decision

- [x] Record interim FIX-5 decision.
- [x] Record final FIX-5 decision for current evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Provider preflight | Confirm OpenAI and `gpt-5.5` availability | `opencode providers list`, `opencode models openai` |
| Bounded route probe | GPT route header preservation without tools or writes | `opencode run --model openai/gpt-5.5` |
| Full smoke | Command-owned route-proof artifacts | Registered `opencode run --command deep/*` attempts from this session after user approval; failed/blocked before leaf dispatch |
| Spec validation | Phase docs and generated metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenAI provider | External | Available | GPT-backed probes cannot run |
| Non-OpenCode execution surface | Runtime | Still needed for clean PASS evidence | Current nested attempts fail before command-owned leaf dispatch |
| Phase 001 route-proof validator | Phase dependency | Complete | Full smoke cannot catch F27 false-negative without it |
| Phase 003 route headers | Phase dependency | Complete | GPT route preservation would test old prompt shape without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase 004 docs incorrectly imply a passing full smoke or a phase 005 trigger.
- **Procedure**: Revert phase 004 docs to the prior scaffold or correct the recorded status to blocked/partial.
- **Data Reversal**: Remove only phase-local generated `context/**` and `ai-council/**` smoke artifacts if the smoke evidence must be rerun from a clean phase folder.
<!-- /ANCHOR:rollback -->
