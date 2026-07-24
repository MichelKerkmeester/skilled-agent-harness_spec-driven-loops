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
    recent_action: "CHK-051 revised: hooks.v1.json now committed, re-tested still dormant"
    next_safe_action: "Phase 008 can begin; same dormant-hooks caveat applies"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Hooks never fire under devin -p; documented honestly as a confirmed negative, not a failed check."]
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
- [x] CHK-002 [P0] Re-verified against a real fired event, not just docs: **result is negative** -- zero firings across `SessionStart`/`UserPromptSubmit`/`PreToolUse`/`Stop` under `-p` dispatch (decision-record.md ADR-001).
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
- [x] CHK-021 [P0] Live smoke test against the installed `devin` binary for `SessionStart` -- **result: zero firings**, captured as the evidence itself (not a passing/failing positive test).
- [x] CHK-022 [P0] Live smoke test against the installed `devin` binary for `UserPromptSubmit` -- **result: zero firings**, same as CHK-021.
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
- [x] CHK-040 [P0] `hooks/devin/README.md` and `runtime/hooks/devin/README.md` document the adapters, mirroring the Codex siblings' shape plus the full dormancy evidence table.
- [x] CHK-041 [P1] `spec.md`/`tasks.md`/`decision-record.md` all reconciled to the same dormant-status finding; no doc claims conflicting completion states.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P1] All new adapter files live under `mcp-server/hooks/devin/` and `runtime/hooks/devin/`, matching the `codex` sibling layout exactly.
- [x] CHK-051 [P1] **Revised twice**: `.devin/hooks.v1.json` IS created at the project root (per operator direction, mirroring `.codex/hooks.json`'s tracked precedent), registering both adapters; re-tested live after committing and still confirmed dormant under `-p` dispatch, documented as such everywhere it's referenced.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION
- [x] CHK-100 [P0] ADR-001 documented in `decision-record.md` with Context, Decision, Alternatives, Consequences, Five Checks, and Implementation sections, all revised with the live-verification finding.
- [x] CHK-101 [P1] ADR-001 status: Accepted (revised 2026-07-24), see `decision-record.md:34`.
- [x] CHK-102 [P1] Alternatives (native `read_config_from.claude` import, hybrid) are documented; `read_config_from.claude`'s fidelity is now moot pending `-p` hook support existing at all.
- [x] CHK-103 [P2] The re-evaluation trigger covers both `read_config_from.claude` and the confirmed `-p` dormancy, not silently dropped.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION
- [x] CHK-110 [P1] N/A -- no latency to measure since the adapters never fire under `-p`; each direct-invocation run in `implementation-summary.md`'s Verification table completed in well under 1 second.
- [x] CHK-111 [P2] No load testing needed - hook adapters run once per lifecycle event, not under sustained load.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS
- [x] CHK-120 [P0] Rollback: deleting `hooks/devin/` and `runtime/hooks/devin/` leaves neutral cores untouched (`git diff --stat` confirmed empty for `hooks/claude/**`, `runtime/lib/spec-gate/**`). No `.devin/hooks.v1.json` was created, so no config rollback is needed either.
- [x] CHK-121 [P0] No feature flag needed - `git diff --stat` confirms the adapters are purely additive (0 lines changed in any other executor's files) and dormant (cannot fire at all under `-p`).
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

**Verification Date**: 2026-07-24. Every item verified against real evidence, including confirmed-negative live-smoke results (CHK-021/CHK-022) -- not assumed passing.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`
