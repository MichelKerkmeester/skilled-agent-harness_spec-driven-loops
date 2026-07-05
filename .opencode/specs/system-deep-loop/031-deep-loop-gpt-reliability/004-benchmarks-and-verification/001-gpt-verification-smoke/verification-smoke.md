---
title: "Verification Smoke: GPT First Dispatch"
description: "Procedure and evidence for phase 004 GPT first-dispatch verification."
trigger_phrases:
  - "gpt verification smoke"
  - "first-dispatch test"
  - "route-proof probe"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/004-benchmarks-and-verification/001-gpt-verification-smoke"
    last_updated_at: "2026-06-30T21:05:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Ran user-approved nested command-owned GPT smokes; acceptance gate failed before leaf dispatch"
    next_safe_action: "Keep phase 005 parked unless external full smoke later produces schema-valid route-mismatched artifacts"
    blockers:
      - "Nested command-owned cli-opencode dispatch is still blocked by self-invocation guards inside the command workflows"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-004-smoke"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Should an external non-OpenCode shell rerun the full smoke to seek a clean PASS, or should this failure evidence close phase 004 as blocked?"
    answered_questions:
      - question: "May cli-opencode be used from this OpenCode session?"
        answer: "User granted a one-off exception for this situation."
      - question: "May nested/self-invocation be attempted from this session?"
        answer: "User selected option 3; nested command-owned smokes were attempted with bounded commands."
---
# Verification Smoke: GPT First Dispatch

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. PURPOSE

Phase 004 is the acceptance gate for phases 001-003. The full gate requires one GPT-backed first dispatch per deep mode using existing workflow provenance and route-proof assertions.

The route-proof success condition is stricter than a schema-valid artifact. The record must prove:

| Field | Expected Meaning |
|-------|------------------|
| `mode` | Requested deep mode |
| `target_agent` | Requested deep leaf agent |
| `agent_definition_loaded` | The real agent definition was loaded, not merely echoed |
| `resolved_route` | Prompt-echoed route matches the requested mode |

---

## 2. FULL COMMAND-OWNED PROCEDURE

The complete acceptance procedure remains:

1. Use an external, non-OpenCode shell or a fresh worktree harness.
2. For each mode, snapshot current mode-local state-log count and artifact paths.
3. Run one GPT-backed first dispatch on a tiny packet.
4. Inspect existing workflow outputs only:
   - One new canonical record of the requested mode.
   - Expected artifact/delta path exists.
   - No `dispatch_failure` record.
   - Executor provenance names GPT/OpenAI.
   - Route-proof fields match the requested mode.
5. Record whether phase 005 must be unparked.

This procedure was attempted from the current session only after explicit user approval. The attempts did not produce a passing first-dispatch result because the command workflows or executor guards stopped before command-owned `cli-opencode` leaf dispatch.

---

## 3. BOUNDED GPT ROUTE PROBES EXECUTED

The user granted a one-off exception to use `cli-opencode` from this OpenCode session. To avoid destructive writes and recursive command-owned dispatch, I ran bounded no-tools GPT route probes with:

```bash
AI_SESSION_CHILD=1 opencode run --model openai/gpt-5.5 --variant high --format json --dir <repo-root> "<Resolved route header + no-tools JSON-only probe>" </dev/null
```

Common constraints for all probes:

- No tool calls.
- No file reads.
- No file writes.
- No `--dangerously-skip-permissions`.
- JSON event stream captured by the parent session.

---

## 4. PROBE RESULTS

| Mode | Session ID | Route Preserved | `agent_definition_loaded` | Verdict |
|------|------------|-----------------|----------------------------|---------|
| research | `ses_0e613db01ffeA7yKqJ54kEO1TV` | Yes | `false` | Route echo PASS; full route-proof FAIL/NOT PROVEN |
| review | `ses_0e613463affeXpSnqAb228mZcy` | Yes | `false` | Route echo PASS; full route-proof FAIL/NOT PROVEN |
| context | `ses_0e612c684ffe0E2M5dPoGDUxl4` | Yes | `false` | Route echo PASS; full route-proof FAIL/NOT PROVEN |
| ai-council | `ses_0e6123004ffeBgjlfoHK9eiXHy` | Yes | `false` | Route echo PASS; full route-proof FAIL/NOT PROVEN |

All four GPT probes preserved the requested `mode`, `target_agent`, execution shape, and mode-switch guard. All four correctly returned `agent_definition_loaded:false` because the bounded probes did not load the real deep leaf agent definitions.

---

## 5. FIX-5 DECISION

Current decision: **do not unpark phase 005 based on the evidence from this session**.

Reason: bounded probes showed GPT follows the explicit route header, and user-approved command-owned smokes did not produce schema-valid route-mismatched artifacts. The full command-owned attempts failed earlier at general-agent verification or `cli-opencode` self-invocation guards. That is a blocked/fail-closed dispatch condition, not the FIX-5 trigger.

Escalation trigger remains unchanged: if a full command-owned GPT first-dispatch produces schema-valid but route-mismatched artifacts after phases 001-003, unpark phase 005.

---

## 6. COMMAND-OWNED ATTEMPTS

After the user selected the nested/self-invocation option, I ran registered command smokes with `openai/gpt-5.5`, one mode at a time, against this phase folder.

| Mode | Parent Session | Workflow Result | Artifact Evidence | Verdict |
|------|----------------|-----------------|-------------------|---------|
| research | `ses_0e5c89696ffe8prf7eYamq3ZDV` | Halted at Phase 0 | No research artifacts | FAIL: `GENERAL AGENT REQUIRED failure`; YAML not reached |
| review | `ses_0e5c3676affeDZ0HHlQ84dDyBl` | Halted before workflow writes | No review artifacts | FAIL: `cli-opencode self-invocation refused from inside OpenCode run`; signal `OPENCODE_PID=63869` |
| context | `ses_0e5c10ba6ffepg12tAGiHxeDqm` | Parent timed out after artifacts were written | `context/deep-context-state.jsonl`, `context/deltas/iter-001.jsonl`, `context/seats/iter-001/gpt-context-smoke.json` | FAIL/BLOCKED: host route-proof record is correct, but the GPT seat was blocked before launch by `OPENCODE_PID` |
| ai-council | `ses_0e5b2718bffeLde2QMzbcibzpx` | Workflow executed and failed cleanly | `ai-council/session-state.jsonl`, `ai-council/session-report.md`, `ai-council/council-session.json` | FAIL/BLOCKED: no `round_completed` route-proof record because dispatch stopped at `phase_loop.step_orchestrate_session.pre_dispatch` |

The full acceptance gate remains unmet. No mode produced a passing command-owned GPT first-dispatch with a real leaf execution record.

---

## 7. NEXT SAFE ACTION

Either run the same command-owned smokes from a non-OpenCode shell to seek a clean PASS, or close phase 004 as blocked/fail-closed with phase 005 parked.
