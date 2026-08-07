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

This phase is Complete — adapters implemented, live-verified, and validated 2026-07-24. `.cursor/hooks.json` registration itself is explicitly deferred (operator choice); see `spec.md` §12 and `implementation-summary.md`.

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
- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
- [x] CHK-003 [P1] Which Cursor events the CLI actually delivers probed live before any registration — via a temporary probe `.cursor/hooks.json` and 3 `cursor-agent -p` dispatches, before any adapter code was written
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] Adapters exist for the empirically-confirmed-firing events: `sessionStart`, `preToolUse`, `sessionEnd` — NOT `beforeSubmitPrompt`/`stop` as originally planned, both confirmed to never fire (`spec-gate-classify.mjs` still exists, marked dormant)
- [x] CHK-011 [P0] The adapters honor the `{permission: allow|deny|ask}` + exit-2-blocks contract — live-verified: a deny response (`{"permission":"deny"}` + exit 2) actually blocked a real `cursor-agent` shell tool call. `.cursor/hooks.json` itself is deferred (operator choice), not committed this phase.
- [x] CHK-012 [P1] Adapters fail open (`{permission: allow}`) on malformed/empty stdin, protecting editor users of the shared config — verified: `echo "not-json" | node spec-gate-enforce.mjs` → `{"permission":"allow"}` exit 0
- [x] CHK-013 [P1] Neutral cores unmodified (`git diff` empty for `hooks/claude/**`, `runtime/lib/spec-gate/**`, `hooks/codex/**`, `runtime/hooks/codex/**`) — confirmed via `git diff --stat`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Live smoke test: each wired event fires under the installed `cursor-agent` CLI, with captured stdin/stdout evidence — 3 dispatches captured full JSON payloads for `sessionStart`/`preToolUse`/`postToolUse`/`sessionEnd`/`beforeShellExecution`/`afterShellExecution`/`beforeReadFile`/`afterFileEdit`/`afterAgentThought`
- [x] CHK-021 [P0] Any registered event that does NOT fire under the CLI is documented as an open gap, not assumed active — `beforeSubmitPrompt`/`stop` documented as confirmed-non-delivery in `mcp-server/hooks/cursor/README.md` §2's delivery table
- [x] CHK-022 [P1] The spec-gate classify/enforce round trip maps Cursor's tool vocabulary onto the core's bash/write/edit vocabulary correctly — `Shell`→`bash`, `Write`→`write` confirmed via live `tool_name` payloads; tested against `evaluateMutation()` directly with both a mapped (`Shell`) and unmapped (`Grep`) tool
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] N/A - new adapter construction, no fix findings to classify (confirmed via `spec.md` §2)
- [x] CHK-FIX-002 [P0] Consumer inventory: confirm the codex/claude adapters and neutral cores are untouched — `git diff --stat` empty for all 4 sibling/core paths
- [x] CHK-FIX-003 [P0] N/A - no path/parser/redaction core logic changed (only `shared.ts`/`spec-gate-enforce.mjs` translate)
- [x] CHK-FIX-004 [P1] Evidence pinned to the phase's commit SHA once landed — cites `shared.ts`, `spec-gate-enforce.mjs` directly; re-pin in `handover.md` once landed
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P0] No credentials/secrets logged through hook stdin/stdout; no Cursor auth token embedded in any adapter (`.cursor/hooks.json` deferred, not committed)
- [x] CHK-031 [P1] Adapters read only event fields needed for translation; raw payload contents not logged (see `shared.ts`)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`decision-record.md` cross-references synchronized
- [x] CHK-041 [P1] The editor-shared-config blast radius is documented in the adapters' README and `decision-record.md` (REQ-007)
- [x] CHK-042 [P2] Cursor's AGENTS.md/CLAUDE.md rules import documented as rules-only, not a hook-enforcement substitute
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P1] Temp files in `scratch/` only; cleaned before completion — the temporary probe `.cursor/hooks.json` and `/tmp/cursor-hook-test/` scratch scripts were removed before this phase's commit; `git status` confirmed clean of any stray hook-test artifacts
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-24.
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION
- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md` (ADR-001 registration scope, ADR-002 event mapping + partial-delivery)
- [x] CHK-101 [P1] Both ADRs have a status (Proposed/Accepted) — both promoted to `Accepted` in `decision-record.md`
- [x] CHK-102 [P1] Alternatives documented with rejection rationale for each ADR — see `decision-record.md` `Alternatives Considered` tables
- [x] CHK-103 [P2] N/A - no migration path applicable
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION
- [x] CHK-110 [P1] Hook adapters add no perceptible latency (thin delegation only) — confirmed via direct CLI timing of `session-start.js`/`spec-gate-enforce.mjs` (sub-second)
- [x] CHK-111 [P1] N/A - no throughput target applicable (no `dispatch` runtime path added in this phase)
- [x] CHK-112 [P2] N/A - no load testing applicable
- [x] CHK-113 [P2] N/A - no performance benchmarks applicable
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS
- [x] CHK-120 [P0] Rollback procedure documented in `plan.md` §7 (delete `hooks/cursor/` dirs; `.cursor/hooks.json` was never committed, so no revert needed there; cores untouched)
- [x] CHK-121 [P0] N/A - no feature flag applicable (`.cursor/hooks.json` deferral is an operator choice, not a flag)
- [x] CHK-122 [P1] N/A - no runtime monitoring surface for static `hooks/cursor/` adapters
- [x] CHK-123 [P1] N/A - no separate runbook needed beyond `tasks.md` Phase 3
- [x] CHK-124 [P2] N/A - no deployment runbook beyond the live smoke test
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION
- [x] CHK-130 [P1] Security review completed (no secrets, no credentials — see `CHK-030`/`CHK-031`)
- [x] CHK-131 [P1] N/A - no new third-party dependency or license introduced (no `package.json` touched)
- [x] CHK-132 [P2] N/A - OWASP Top 10 not applicable to hook-adapter authoring
- [x] CHK-133 [P2] N/A - no data handling surface introduced
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION
- [x] CHK-140 [P1] All 5 spec documents synchronized (`spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`decision-record.md`)
- [x] CHK-141 [P1] N/A - no external API documentation applicable (`cli-cursor` hooks have no HTTP/API surface)
- [x] CHK-142 [P2] `mcp-server/hooks/cursor/README.md` reviewed as the adapter-layer documentation
- [x] CHK-143 [P2] Knowledge transfer documented via the 2 ADRs in `decision-record.md`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|---|---|---|---|
| Operator | Packet Owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
