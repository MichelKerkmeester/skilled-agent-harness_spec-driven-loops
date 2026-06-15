---
title: "Feature Specification: Fail-loud executor provenance: requested-versus-actual model comparison in the executor audit, emitting error on mismatch"
description: "The deep-loop executor records the actual model it ran but never compares it to the requested model, so a silent substitution or crash can ship an artifact whose provenance lies. This phase adds a requested-vs-actual diff that emits a loud dispatch failure on mismatch."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/008-fail-loud-provenance"
    last_updated_at: "2026-06-15T14:06:40Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-fail-loud-provenance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fail-loud executor provenance: requested-versus-actual model comparison in the executor audit, emitting error on mismatch

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop runtime already records the actual model an executor ran in its provenance audit (`buildExecutorAuditRecord` in `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`, around line 485), but it never compares that actual model against the model the caller requested. When a dispatch crashes (the round-1 codex SIGKILL case) or a router silently swaps the model (the silent-gpt-5 case), the loop keeps running and an artifact ships carrying a provenance record that does not match what was approved. That violates the core fable rule that artifact claims must not lie, and `fallback-router.ts` reinforces the gap by only reasoning about quota-pool exhaustion, not unapproved model substitution.

### Purpose
A requested-vs-actual model mismatch, or a crash that loses provenance, produces a loud dispatch failure (`error` / `blocked_stop`) instead of a silent substitution, so every shipped artifact's recorded model matches the model the caller approved.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A requested-vs-actual model diff at the point `executor-audit.ts` records the actual model, emitting a loud dispatch failure (`model_mismatch` reason routed through the existing `emitDispatchFailure` path) when the two disagree.
- Crash escalation that stays visible: a SIGTERM/SIGKILL or non-zero exit already emits a `crash` dispatch failure; this phase confirms that path is preserved and that a lost-provenance crash never resolves to a silent success.
- A guard in `fallback-router.ts` so the router never returns a route that substitutes a model the caller did not approve; legitimate cross-quota-pool fallback to a configured target stays intact.
- A vitest that proves both directions: a mismatch fails loud, and a matching requested/actual pair passes through untouched.

### Out of Scope
- The governor capsule, subagent prompt injection, and behavioral measurement recs (B2/B3/C1) - separate phases under the 149 packet; this phase is the structural provenance guard only.
- Changing the quota-pool fallback policy itself - the existing separate-pool fallback in `resolveFallback` is preserved, not redesigned.
- The P1 machine-checkable evidence contract (`claim_class` / `would_confirm` schema) - tracked as its own dedicated packet, not folded in here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Modify | Add a requested-vs-actual model comparison at the point provenance is recorded (around `buildExecutorAuditRecord`, ~line 485); emit a loud `model_mismatch` dispatch failure on disagreement instead of recording a substituted model silently. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Modify | Ensure `resolveFallback` never returns a route to a model the caller did not approve; keep the configured separate-quota-pool fallback behavior. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts` | Create | A vitest asserting a requested-vs-actual mismatch fails loud and a matching pair passes; exercises the audit comparison and the fallback-router guard. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A requested-vs-actual model mismatch must produce a loud dispatch failure, never a silent substitution. | Vitest feeds a requested model that differs from the recorded actual model and asserts a `dispatch_failure` event with a `model_mismatch` reason is emitted; no success record is written for that iteration. |
| REQ-002 | A matching requested/actual pair must pass through untouched, preserving existing audit behavior. | Vitest feeds equal requested and actual models and asserts the provenance record is written normally with no dispatch failure. |
| REQ-003 | `fallback-router.ts` must not return a route that substitutes an unapproved model; configured separate-pool fallback is preserved. | Vitest plus `rg` over `resolveFallback` confirm the only non-`fail-fast` route targets a model the caller approved via configured `fallback_target`; existing `fallback-router.vitest.ts` stays green. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A crash that loses provenance must escalate visibly, not resolve to silent success. | Existing SIGTERM/SIGKILL and non-zero-exit paths emit a `crash` dispatch failure; vitest or `rg` confirms the lost-provenance branch routes through `emitDispatchFailure`, not a silent return. |
| REQ-005 | The new comparison reuses the existing `DispatchFailureReason` / `emitDispatchFailure` seam rather than inventing a parallel error channel. | `rg` shows the mismatch path adds a `model_mismatch` reason to the existing union and calls `emitDispatchFailure`; no new logging mechanism is introduced. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A requested-vs-actual model mismatch emits a loud `dispatch_failure` (`model_mismatch`) and writes no success record for that iteration; proven by the new vitest.
- **SC-002**: A matching requested/actual pair writes the provenance record unchanged with zero dispatch failures; existing `executor-audit.vitest.ts` and `fallback-router.vitest.ts` stay green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 behavioral measurement (`fable_metrics.py`) | None structurally; 008 ships independently. 003 later confirms the provenance guard did not regress tool/text behavior. | Ship 008 standalone; pair with 003 for re-measurement, no blocking link. |
| Risk | Over-strict comparison flags a legitimate configured fallback as a mismatch (false positive) | Medium - could turn a valid cross-pool fallback into a spurious loud failure | Compare against the caller-approved model (including the configured `fallback_target`), not the originally requested one, so approved fallback is not flagged. |
| Risk | Reason-string drift between the new `model_mismatch` value and downstream consumers reading `dispatch_failure` events | Low - a misspelled or undocumented reason would be silently ignored by readers | Add `model_mismatch` to the existing `DispatchFailureReason` union so the type forces consistency; assert the exact reason string in the vitest. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The model comparison is a single string equality check on values already in scope; it adds no measurable overhead to the per-iteration dispatch path.
- **NFR-P02**: The guard runs once per executor dispatch (not per token or per JSONL line), so it does not change loop throughput.

### Security
- **NFR-S01**: The comparison reads only the already-recorded executor config and the caller-approved model; it introduces no new secrets, env reads, or external calls.
- **NFR-S02**: Provenance integrity is the security property: a shipped artifact's recorded model must equal the approved model, so a substitution cannot pass undetected.

### Reliability
- **NFR-R01**: Fail-loud is the reliability target - the loop must halt or escalate visibly on mismatch rather than continue with a lying provenance record.
- **NFR-R02**: Zero false-loud on a legitimate configured fallback; the comparison treats an approved `fallback_target` as a match.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing actual model: if the recorded actual model is absent or undefined, treat it as a provenance failure and emit a loud dispatch failure rather than assuming a match.
- Native executor kind: `getExecutorKind(executor) === 'native'` already skips audit writes; the comparison must respect the same skip so native runs are not falsely flagged.
- Case or whitespace differences in model IDs: compare normalized model IDs so a trivial formatting difference does not produce a spurious mismatch.

### Error Scenarios
- Dispatch crash (SIGTERM to SIGKILL escalation): the existing `crash` dispatch failure path is preserved; a crash that loses provenance never resolves to a silent success.
- Unapproved silent substitution: the router returns `fail-fast` instead of a route to a model the caller never approved.
- Configured separate-pool fallback: a valid `fallback_target` is treated as approved, so the comparison passes and the loop continues.

### State Transitions
- Mismatch mid-loop: the iteration transitions to a visible failure state (dispatch failure event) and does not advance to a success record.
- Approved-fallback continuation: when fallback is legitimate, the loop continues with provenance that matches the approved target.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two source edits in one runtime module plus one new vitest; the audit change is "one comparison away" from existing code. |
| Risk | 14/25 | Touches the dispatch failure path that gates whether artifacts ship; a false-loud would block valid runs, so the approved-fallback case must be exact. No auth or external API. |
| Research | 6/20 | Grounded; the recommendations and research §8.7 already located the exact seam (`executor-audit.ts` ~485) and the quota-pool-only gap in `fallback-router.ts`. |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should a model mismatch hard-stop the whole deep-loop run, or emit a per-iteration `dispatch_failure` and let the host loop decide whether to halt? Current plan: emit the per-iteration failure through the existing seam and let the host loop's failure handling escalate, matching how `crash` is already treated.
- Is `model_mismatch` the right reason string, or should it reuse `invalid_output`/`other`? Current plan: add a dedicated `model_mismatch` member to `DispatchFailureReason` so downstream readers and the vitest can assert on it precisely.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
