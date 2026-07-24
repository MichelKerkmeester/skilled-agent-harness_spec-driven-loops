---
title: "Verification Checklist: Cursor hook adapter layer"
description: "Verification Date: Planned - not yet executed"
trigger_phrases: ["cursor hook adapter checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md for phase 004"
    next_safe_action: "Author decision-record.md"
    blockers: ["depends on 003 landing first"]
    key_files: ["spec.md", "plan.md", "tasks.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Cursor hook adapter layer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

All items below are unchecked — this phase is Planned, not yet implemented or verified.

---

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
- [ ] CHK-001 [P0] Requirements documented in `spec.md`
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`
- [ ] CHK-003 [P1] Which Cursor events the CLI actually delivers probed live before any registration
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] Adapters exist for `sessionStart`, `beforeSubmitPrompt`, and `stop`
- [ ] CHK-011 [P0] `.cursor/hooks.json` uses Cursor's `{version, hooks:{<event>:[{command,...}]}}` schema and the adapters honor the `{permission: allow|deny|ask}` + exit-2-blocks contract
- [ ] CHK-012 [P1] Adapters fail open (`{permission: allow}`) on malformed/empty stdin, protecting editor users of the shared config
- [ ] CHK-013 [P1] Neutral cores unmodified (`git diff` empty for `hooks/claude/**`, `runtime/lib/spec-gate/**`, `lib/hooks/completion-evidence-sentinel.cjs`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] Live smoke test: each wired event fires under the installed `cursor-agent` CLI, with captured stdin/stdout evidence
- [ ] CHK-021 [P0] Any registered event that does NOT fire under the CLI is documented as an open gap, not assumed active
- [ ] CHK-022 [P1] The spec-gate classify/enforce round trip maps Cursor's tool vocabulary onto the core's bash/write/edit vocabulary correctly
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] N/A - new adapter construction, no fix findings to classify
- [ ] CHK-FIX-002 [P0] Consumer inventory: confirm the codex/claude adapters and neutral cores are untouched
- [ ] CHK-FIX-003 [P0] N/A - no path/parser/redaction core logic changed (adapters translate only)
- [ ] CHK-FIX-004 [P1] Evidence pinned to the phase's commit SHA once landed
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-030 [P0] No credentials/secrets logged through hook stdin/stdout; no Cursor auth token embedded in any adapter or `.cursor/hooks.json`
- [ ] CHK-031 [P1] Adapters read only event fields needed for translation; raw payload contents not logged
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`decision-record.md` cross-references synchronized
- [ ] CHK-041 [P1] The editor-shared-config blast radius is documented in the adapters' README and `decision-record.md` (REQ-007)
- [ ] CHK-042 [P2] Cursor's AGENTS.md/CLAUDE.md rules import documented as rules-only, not a hook-enforcement substitute
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-050 [P1] Temp files in `scratch/` only; cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: Planned — not yet executed.
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION
- [ ] CHK-100 [P0] Architecture decisions documented in `decision-record.md` (ADR-001 registration scope, ADR-002 event mapping + partial-delivery)
- [ ] CHK-101 [P1] Both ADRs have a status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale for each ADR
- [ ] CHK-103 [P2] N/A - no migration path applicable
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION
- [ ] CHK-110 [P1] Hook adapters add no perceptible latency (thin delegation only)
- [ ] CHK-111 [P1] N/A - no throughput target applicable
- [ ] CHK-112 [P2] N/A - no load testing applicable
- [ ] CHK-113 [P2] N/A - no performance benchmarks applicable
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS
- [ ] CHK-120 [P0] Rollback procedure documented in `plan.md` §7 (delete `hooks/cursor/` dirs + `.cursor/hooks.json`; cores untouched)
- [ ] CHK-121 [P0] N/A - no feature flag applicable
- [ ] CHK-122 [P1] N/A - no runtime monitoring surface for static adapters
- [ ] CHK-123 [P1] N/A - no separate runbook needed beyond `tasks.md` Phase 3
- [ ] CHK-124 [P2] N/A - no deployment runbook beyond the live smoke test
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION
- [ ] CHK-130 [P1] Security review completed (no secrets, no credentials — see CHK-030/031)
- [ ] CHK-131 [P1] N/A - no new third-party dependency or license introduced
- [ ] CHK-132 [P2] N/A - OWASP Top 10 not applicable to hook-adapter authoring
- [ ] CHK-133 [P2] N/A - no data handling surface introduced
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION
- [ ] CHK-140 [P1] All 5 spec documents synchronized
- [ ] CHK-141 [P1] N/A - no external API documentation applicable
- [ ] CHK-142 [P2] `mcp-server/hooks/cursor/README.md` reviewed as the adapter-layer documentation
- [ ] CHK-143 [P2] Knowledge transfer documented via the 2 ADRs in `decision-record.md`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|---|---|---|---|
| Operator | Packet Owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
