---
title: "Verification Checklist: Devin hook adapter layer"
description: "Verification checklist for the Devin hook adapter layer phase."
trigger_phrases: ["devin hook adapter checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored verification checklist; all items unchecked, phase Planned"
    next_safe_action: "Work through items in order once implementation starts"
    blockers: ["depends on 003-cli-devin-skill-packet landing first"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
- [ ] CHK-001 [P0] Phase 003 (cli-devin skill packet + hub registration) confirmed landed before adapter work begins.
- [ ] CHK-002 [P0] Devin's live hook JSON schema for `SessionStart`/`UserPromptSubmit` re-verified against `docs.devin.ai/cli/extensibility/hooks/{overview,lifecycle-hooks}.md` and a real fired event, not assumed from this spec alone.
- [ ] CHK-003 [P1] ADR-001 (`decision-record.md`) accepted before adapter code is written.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] `hooks/devin/shared.ts`, `session-start.ts`, `user-prompt-submit.ts` pass the repo's TypeScript lint/format checks.
- [ ] CHK-011 [P0] `runtime/hooks/devin/spec-gate-classify.mjs`/`spec-gate-enforce.mjs` pass Node syntax checks with no runtime warnings on a dry run.
- [ ] CHK-012 [P1] Adapters fail open (approve/no-op) on malformed or missing stdin payloads, matching the codex sibling's discipline.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] Unit tests cover adapter payload validation, matcher parsing, and envelope translation for both wired events.
- [ ] CHK-021 [P0] Live smoke test against the installed `devin` binary captures stdin/stdout evidence for `SessionStart`.
- [ ] CHK-022 [P0] Live smoke test against the installed `devin` binary captures stdin/stdout evidence for `UserPromptSubmit`.
- [ ] CHK-023 [P1] Malformed-JSON and missing-field edge cases tested against the adapters, not just the happy path.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
N/A - this phase adds new adapters, it is not a bug fix.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-030 [P0] No credentials or secrets are logged or transmitted by any adapter.
- [ ] CHK-031 [P1] Adapter stdin/stdout handling does not echo raw payload contents that could contain user secrets.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P0] `hooks/devin/README.md` and `runtime/hooks/devin/README.md` document the adapters mirroring the Codex siblings' shape.
- [ ] CHK-041 [P1] `spec.md`/`plan.md`/`tasks.md`/`decision-record.md` stay synchronized with the actual implementation once it lands.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-050 [P1] All new adapter files live under `mcp-server/hooks/devin/` and `runtime/hooks/devin/`, matching the `codex` sibling layout exactly.
- [ ] CHK-051 [P1] `.devin/hooks.v1.json` lives at the project root, matching Devin's documented discovery order.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION
- [ ] CHK-100 [P0] ADR-001 (hook adapter strategy) documented in `decision-record.md` with Context, Decision, Alternatives, Consequences, Five Checks, and Implementation sections.
- [ ] CHK-101 [P1] ADR-001 has a recorded status (Proposed/Accepted).
- [ ] CHK-102 [P1] Alternatives (native `read_config_from.claude` import, hybrid) are documented with rejection/deferral rationale.
- [ ] CHK-103 [P2] The re-evaluation trigger for `read_config_from.claude` is documented as a migration path, not silently dropped.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION
- [ ] CHK-110 [P1] Hook adapters add no perceptible latency to Devin's turn loop (NFR-P01), confirmed by timing the live smoke test.
- [ ] CHK-111 [P2] No load testing needed - hook adapters run once per lifecycle event, not under sustained load.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS
- [ ] CHK-120 [P0] Rollback procedure (`plan.md` ANCHOR:rollback) tested: deleting `hooks/devin/`, `runtime/hooks/devin/`, and `.devin/hooks.v1.json` leaves neutral cores untouched.
- [ ] CHK-121 [P0] No feature flag needed - confirmed hook registration is additive and Devin-only, cannot affect other executors.
- [ ] CHK-122 [P2] No monitoring/alerting configured - not required for a thin-adapter phase with no persistent service.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION
- [ ] CHK-130 [P1] Security review (CHK-030/CHK-031 above) completed before marking this phase done.
- [ ] CHK-131 [P2] No new third-party dependency licenses introduced - adapters reuse existing repo tooling only.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION
- [ ] CHK-140 [P1] `hooks/devin/README.md` and `runtime/hooks/devin/README.md` cross-reference the codex siblings and this phase's `spec.md`.
- [ ] CHK-141 [P2] Knowledge transfer note added to `../005-devin-model-registry-and-quota/spec.md`'s Related Documents if adapter file paths shift during implementation.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF
| Approver | Role | Status | Date |
|---|---|---|---|
| Operator | Product Owner | [ ] Approved | |
| Implementing agent | Technical Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 10 | [ ]/10 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 5 | [ ]/5 |

**Verification Date**: Not yet started - phase is Planned.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`
