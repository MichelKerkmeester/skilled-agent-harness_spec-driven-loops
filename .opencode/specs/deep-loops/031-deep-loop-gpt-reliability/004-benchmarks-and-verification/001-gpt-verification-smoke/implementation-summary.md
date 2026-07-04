---
title: "Implementation Summary: GPT First-Dispatch Verification Smoke"
description: "Bounded GPT route probes passed route preservation; command-owned smokes failed before leaf dispatch."
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
      - "Nested command-owned cli-opencode dispatch is blocked by command/executor self-invocation guards"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-004-summary"
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
# Implementation Summary: GPT First-Dispatch Verification Smoke

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-gpt-verification-smoke |
| **Completed** | Failed/blocked, not accepted |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Created `verification-smoke.md`, ran bounded GPT route probes for research, review, context, and ai-council using `openai/gpt-5.5`, then attempted user-approved command-owned nested smokes for all four modes.

The full command-owned acceptance gate is not satisfied. Research halted before YAML with `GENERAL AGENT REQUIRED failure`; review refused nested `cli-opencode` self-invocation; context wrote blocked host artifacts while the GPT seat failed before launch; ai-council wrote failed artifacts and no `round_completed` route-proof record.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `verification-smoke.md` | Created/modified | Procedure, bounded probe evidence, command-owned attempt evidence, and final FIX-5 decision |
| `spec.md` | Modified | Scope and blocked status |
| `plan.md` | Modified | Plan and verification approach |
| `tasks.md` | Modified | Task evidence and blocker state |
| `implementation-summary.md` | Modified | Summary of probes and limitations |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

The phase first used the user's one-off `cli-opencode` exception for bounded no-tools route probes. After the user selected option 3, it attempted nested command-owned smokes with registered `/deep:*` command surfaces. The attempts did not force direct `--agent deep-*` and did not silently substitute another executor when self-invocation guards blocked `cli-opencode`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Attempt nested command-owned smokes after explicit approval | User selected option 3 after the safety fork was presented |
| Treat `agent_definition_loaded:false` as not accepted | The field proves direct probes did not load real deep leaf definitions |
| Keep phase 005 parked | No schema-valid route-mismatched artifact was produced |
| External shell remains the only path to a clean PASS | Nested OpenCode runs continue to trip command/executor self-invocation guards |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

| Check | Result |
|-------|--------|
| OpenCode version | `1.17.11` |
| Provider preflight | OpenAI configured; `openai/gpt-5.5` available |
| Research route probe | PASS for route preservation; `agent_definition_loaded:false` |
| Review route probe | PASS for route preservation; `agent_definition_loaded:false` |
| Context route probe | PASS for route preservation; `agent_definition_loaded:false` |
| AI council route probe | PASS for route preservation; `agent_definition_loaded:false` |
| Research command-owned smoke | FAIL: `GENERAL AGENT REQUIRED failure`; no research artifacts |
| Review command-owned smoke | FAIL: `cli-opencode self-invocation refused from inside OpenCode run`; no review artifacts |
| Context command-owned smoke | FAIL/BLOCKED: route-proof record present in `context/deep-context-state.jsonl`, but seat blocked by `OPENCODE_PID` |
| AI council command-owned smoke | FAIL/BLOCKED: no `round_completed` route-proof record; failure at `phase_loop.step_orchestrate_session.pre_dispatch` |
| Phase 004 strict validation | Pending after doc update |
| FIX-5 decision | Final for current evidence: do not unpark 005 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

1. **Full route-proof acceptance did not pass**: No mode produced a passing command-owned GPT first-dispatch record.
2. **No native/Claude baseline yet**: Baseline comparison remains blocked because the GPT command-owned run did not reach a comparable pass.
3. **External clean-pass evidence is still absent**: A non-OpenCode shell can still rerun the smoke if a clean PASS is required.
<!-- /ANCHOR:limitations -->
