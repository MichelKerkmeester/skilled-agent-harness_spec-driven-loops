---
title: "Verification Checklist: Spec-gate advise & would-deny telemetry [template:level_2/checklist.md]"
description: "Verification checklist for the Spec-gate advise/would-deny telemetry phase (planning state; all items unchecked)."
trigger_phrases:
  - "spec gate telemetry checklist"
  - "would-deny acceptance"
  - "telemetry invariants"
  - "kill-switch no-op"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/006-spec-gate-enforce-readiness/001-advise-telemetry"
    last_updated_at: "2026-07-11T11:05:56.873Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level-2 verification checklist"
    next_safe_action: "Verify items after implementation lands"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/plugins/mk-spec-gate.js"
      - ".opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-advise-telemetry"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Spec-gate advise & would-deny telemetry

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-006)
- [ ] CHK-002 [P0] Technical approach + design decisions defined in plan.md (would-deny signal, shared formatter)
- [ ] CHK-003 [P1] Canonical line format frozen (`timestamp | runtime | sessionID | tool | filePath | decision`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --test spec-gate-core.test.mjs` passes (existing + new)
- [ ] CHK-011 [P0] No `console.*` added; the "core never writes console output" static test stays green; the OpenCode plugin writes no stdout/stderr
- [ ] CHK-012 [P1] Logging is fail-open: `appendWarningLog` swallows all errors, never throws, and never blocks the mutation
- [ ] CHK-013 [P1] Code follows the runtime-neutral core + thin adapter pattern; comment hygiene (no spec paths or artifact ids in code comments)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] REQ-001: a source-file Write with an open gate produces exactly one parseable line carrying session, tool, path, and decision on BOTH runtimes
- [ ] CHK-021 [P0] REQ-002 / kill-switch: `MK_SPEC_GATE_DISABLED=1` produces zero telemetry lines on both runtimes
- [ ] CHK-022 [P1] REQ-003: the would-deny vs advise discriminator holds (write/edit-open-nonexempt = would-deny; bash = advise)
- [ ] CHK-023 [P1] REQ-004/005/006: format is byte-identical across runtimes; rotation stays bounded; a hostile filePath collapses to one line
- [ ] CHK-024 [P0] Deny predicate unchanged: the deny-matrix test still yields exactly 2 denies; `DENY_CAPABLE_TOOLS` stays `{write, edit}`; enforce stays opt-in + default-off + never widened
- [ ] CHK-025 [P1] No `mcp_server/` dist rebuilt; the shared `gate-3-classifier` is untouched (classifier imports unchanged)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class recorded: `cross-consumer` (two runtime adapters + the shared core writer) plus `algorithmic` (the one-event = one-line invariant).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'appendWarningLog|WARN_LOG_FILENAME' .../spec-gate` confirms `appendWarningLog` is the single log writer.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `evaluateMutation`, `appendWarningLog`, and `formatSpecGateEvent` across `*.js`, `*.mjs`, and `*.md`.
- [ ] CHK-FIX-004 [P0] Sanitizer adversarial table tests: embedded pipe, embedded newline, empty/missing path, over-length path, missing sessionID.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion (runtime × tool × gate × path × disabled).
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed: `MK_SPEC_GATE_DISABLED=1` writes nothing; `MK_SPEC_GATE_ENFORCE` unset still emits would-deny.
- [ ] CHK-FIX-007 [P1] Evidence pinned to the fix SHA or an explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets in the log line; it carries only session, tool, path, and decision plus timestamp and runtime
- [ ] CHK-031 [P0] `filePath` is sanitized so a hostile path cannot inject a second log line or break the parser
- [ ] CHK-032 [P1] The line never echoes the classifier's matched-token arrays or `GATE_3_QUESTION` internals (NFR-S01)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [ ] CHK-041 [P1] Code comments adequate and comment-hygiene clean
- [ ] CHK-042 [P2] implementation-summary.md updated after implementation (planning stub until then)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 14 | 0/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending (planning state; not yet verified)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
