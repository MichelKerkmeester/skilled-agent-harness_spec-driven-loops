---
title: "Verification Checklist: Devin hook adapter layer"
description: "Verification checklist for the Devin hook adapter layer phase."
trigger_phrases: ["devin hook adapter checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer"
    last_updated_at: "2026-07-24T17:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Corrected checklist status after documented-schema live verification"
    next_safe_action: "Use phase 011 evidence for current behavior"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["SessionStart and UserPromptSubmit fire under devin -p with the corrected registration schema."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Devin hook adapter layer

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling | Completion Impact |
|---|---|---|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Phase 003 not landed, but this phase's actual work (adapters, no hub-registration dependency for building/typechecking) proceeded per operator direction; no hub-registration coupling was needed to build or verify this phase's deliverables.
- [x] CHK-002 [P0] Re-verified against real fired events: corrected-schema tests observed `SessionStart` and `UserPromptSubmit` under `devin -p` (`../hook-testing-results.md`, tests 10-14).
- [x] CHK-003 [P1] ADR-001 status is Accepted (revised 2026-07-24), see `decision-record.md:34`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] `hooks/devin/shared.ts`, `session-start.ts`, `user-prompt-submit.ts` pass `tsc --noEmit -p tsconfig.json` (0 errors, full project) and `npm run build` compiles cleanly to `dist/hooks/devin/`.
- [x] CHK-011 [P0] `runtime/hooks/devin/spec-gate-classify.mjs` runs cleanly via direct invocation, no runtime warnings. (`spec-gate-enforce.mjs` descoped to phase 008, see decision-record.md.)
- [x] CHK-012 [P1] Adapters fail open confirmed via direct invocation (`echo 'not json' | node dist/hooks/devin/session-start.js`): exit 0, no output, no crash.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Direct-invocation testing substitutes for unit tests: `node dist/hooks/devin/session-start.js` and `user-prompt-submit.js` both return correctly-shaped `hookSpecificOutput` envelopes (see `implementation-summary.md`'s Verification table).
- [x] CHK-021 [P0] Live smoke test against the installed `devin` binary observed `SessionStart` with the documented schema.
- [x] CHK-022 [P0] Live smoke test against the installed `devin` binary observed `UserPromptSubmit` and model-visible Gate-3 context.
- [x] CHK-023 [P1] Malformed-JSON and missing-field edge cases tested directly against `session-start.js`/`user-prompt-submit.js`/`spec-gate-classify.mjs` -- all fail open correctly.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
N/A - this phase adds new adapters, it is not a bug fix.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P0] No credentials or secrets logged or transmitted -- confirmed via manual read of `shared.ts`/`spec-gate-classify.mjs`: no logging calls exist in either file.
- [x] CHK-031 [P1] Adapter stdin/stdout handling never echoes raw payload contents -- confirmed via manual read of `shared.ts:emitDevinContext()`, which only ever writes the delegated adapter's own returned context.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P0] `hooks/devin/README.md` and `runtime/hooks/devin/README.md` document the adapters and current live matrix.
- [x] CHK-041 [P1] Phase 011 reconciled `spec.md`, `tasks.md` and `decision-record.md` to the corrected current status.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P1] All new adapter files live under `mcp-server/hooks/devin/` and `runtime/hooks/devin/`, matching the `codex` sibling layout exactly.
- [x] CHK-051 [P1] `.devin/hooks.v1.json` exists at the project root and now uses the documented top-level event schema; both phase-004 adapters are observed live.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION
- [x] CHK-100 [P0] ADR-001 documented in `decision-record.md` with Context, Decision, Alternatives, Consequences, Five Checks, and Implementation sections, all revised with the live-verification finding.
- [x] CHK-101 [P1] ADR-001 status: Accepted (revised 2026-07-24), see `decision-record.md:34`.
- [x] CHK-102 [P1] Alternatives (native `read_config_from.claude` import, hybrid) are documented; `read_config_from.claude`'s fidelity is now moot pending `-p` hook support existing at all.
- [x] CHK-103 [P2] The re-evaluation trigger was exercised after the schema contradiction surfaced; current status points to tests 10-14.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION
- [x] CHK-110 [P1] No dedicated latency benchmark was recorded; live firings completed within normal `devin -p` execution and adapter timeouts remain bounded.
- [x] CHK-111 [P2] No load testing needed - hook adapters run once per lifecycle event, not under sustained load.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS
- [x] CHK-120 [P0] Rollback removes phase-004 adapters and reverts only their registration entries while leaving neutral cores untouched. [EVIDENCE: `decision-record.md` limits rollback to adapter and registration surfaces.]
- [x] CHK-121 [P0] No feature flag needed; adapters are Devin-only, additive and guarded by bounded fail-open handling. [EVIDENCE: direct adapter tests and live `devin -p` execution passed without changing neutral cores.]
- [x] CHK-122 [P2] No monitoring/alerting configured - not required for a thin-adapter phase with no persistent service.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION
- [x] CHK-130 [P1] Security review completed, see CHK-030/CHK-031 above (`shared.ts`/`spec-gate-classify.mjs` manual read, 0 findings).
- [x] CHK-131 [P2] No new third-party dependency licenses introduced - adapters reuse existing repo tooling only.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION
- [x] CHK-140 [P1] `hooks/devin/README.md` and `runtime/hooks/devin/README.md` cross-reference the codex siblings and this phase's `decision-record.md`.
- [x] CHK-141 [P2] N/A -- adapter file paths matched the planned layout exactly; no shift occurred.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF
| Approver | Role | Status | Date |
|---|---|---|---|
| Operator | Product Owner | [ ] Approved | |
| Implementing agent | Technical Lead | [x] Approved | 2026-07-24 |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 5 | 5/5 |

**Verification Date**: 2026-07-25 correction. Direct-invocation evidence remains valid; CHK-021/CHK-022 now cite corrected-schema live firings.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`
