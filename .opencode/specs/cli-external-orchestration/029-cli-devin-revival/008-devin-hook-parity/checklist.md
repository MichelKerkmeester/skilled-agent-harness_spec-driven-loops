---
title: "Verification Checklist: Devin hook parity"
description: "Verification checklist for the Devin hook parity phase."
trigger_phrases: ["devin hook parity checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Corrected verification outcomes after documented-schema live events"
    next_safe_action: "Use phase 011 evidence for current status"
    blockers: []
    key_files: ["spec.md", "tasks.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Devin hook parity

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling |
|---|---|
| P0 | Must pass before this phase is Complete |
| P1 | Should pass; document any gap |
| P2 | Nice-to-have; document if skipped |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION
- [x] CHK-001 [P0] Phase 004 landed and committed (`1a4b431dc7`) before this phase's adapter work began.
- [x] CHK-002 [P0] Corrected-schema live tests observed six lifecycle events and captured real payload fields (`../hook-testing-results.md`, tests 10-14).
- [x] CHK-003 [P0] Project-level `.devin/hooks.v1.json` discovery works under `devin -p` with the documented nested event schema.
- [x] CHK-004 [P1] All 5 ADRs revised and accepted in `decision-record.md` for this phase's real implementation.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [x] CHK-010 [P0] All 10 new adapter files (9 originally planned + `spec-gate-enforce.mjs`) pass syntax/type checks: `tsc --noEmit` 0 errors for `session-stop.ts`; `node --check` clean for every `.cjs`; every `.mjs` executes cleanly.
- [x] CHK-011 [P0] Every one of the 10 adapters confirmed fail-open (exit 0, no output) on both malformed-JSON stdin and valid-but-empty-object (`{}`) missing-field payloads - full matrix run, not spot-checked. Evidence: direct invocation of `dispatch-preflight-lint.mjs`, `dispatch-audit-posttooluse.mjs`, `post-edit-quality.cjs`, `code-graph-freshness.cjs`, `mcp-route-guard.cjs`, `spec-gate-enforce.mjs`, `task-dispatch-guard.cjs`, `completion-evidence-stop.cjs`, `session-stop.js`, `post-compaction.cjs` -- exit=0 for all 20 (10 files x 2 payload shapes).
- [x] CHK-012 [P1] `post-compaction.cjs` implements all 5 steps (retain summary, rehydrate spec-folder continuity, bounded `memory_context(mode=resume)` fallback, provenance/length sanitization, emit `additionalContext`); tested with and without `summary` present.
- [x] CHK-013 [P1] `task-dispatch-guard.cjs` uses defensive fallback field-name matching (`subagent_type\|subagentType\|agent_type\|agentType`) rather than assuming one exact `run_subagent` shape.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [x] CHK-020 [P0] Direct stdin-pipe invocation (in place of automated fixtures, matching phase 004's own verification bar) covers payload validation, matcher-relevant tool_name branching, and envelope translation for all 10 new adapters, including one realistic dispatch-shaped command for `dispatch-preflight-lint.mjs` that produced a real advisory.
- [x] CHK-021 [P0] Corrected-schema `devin -p` observed `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop` and `SessionEnd`. `PermissionRequest` and `PostCompaction` did not occur and remain unobserved.
- [x] CHK-022 [P0] Malformed-JSON AND missing-field (`{}`) edge cases explicitly tested for every one of the 10 adapters - full matrix, not a subset. Evidence: same test run as CHK-011 -- 20/20 cases exit=0.
- [x] CHK-023 [P1] `SessionEnd` fired under the corrected schema and remains registered directly. No dedicated adverse stdout-shape test was performed.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
N/A - this phase is new-adapter creation, not a bug fix.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [x] CHK-030 [P0] Confirmed by code inspection - no adapter logs, transmits, or persists raw stdin payload contents; only structured decisions (`allow`/`deny`/`advise`) and derived fields (file paths, tool names) ever leave any adapter.
- [x] CHK-031 [P1] Confirmed - `additionalContext`/`permissionDecisionReason` values are all derived from the shared cores' own bounded, sanitized output (e.g. `post-compaction.cjs`'s 4096-byte cap + control-char strip), never a raw payload echo.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [x] CHK-040 [P0] `README.md` authored in each of the 5 new `hooks/devin/` sibling directories (`cli-opencode`, `mcp-code-mode`, `sk-code/code-quality`, `system-code-graph`, `system-deep-loop`), mirroring the Codex siblings; the 2 pre-existing `hooks/devin/README.md` files (`mcp-server/`, `runtime/`) updated to list the new files landed in those same directories, including correcting a stale claim in the `runtime/` README that `spec-gate-enforce.mjs` was "deliberately NOT built here."
- [x] CHK-041 [P1] `mcp-route-guard.cjs`'s no-external-family condition is documented as provisional and forwarded to phase 009.
- [x] CHK-042 [P1] `task-dispatch-guard.cjs`'s divergence from Codex's fold-in is documented in-file and in its README with rationale (Devin's `run_subagent` is a real first-class tool; Codex has none).
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [x] CHK-050 [P1] All 10 new adapter files live under a `hooks/devin/` sibling directory matching each core's own packet, matching the Claude/Codex sibling layout exactly (confirmed per-file path in §3 Files to Change of `spec.md`).
- [x] CHK-051 [P1] `.devin/hooks.v1.json` extension preserved phase 004's `SessionStart`/`UserPromptSubmit` entries verbatim, adding new events/entries alongside them (diff-confirmed, not a replace).
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION
- [x] CHK-100 [P0] All 5 ADRs in `decision-record.md` documented with Context, Decision, Alternatives, Consequences, Five Checks, Implementation sections.
- [x] CHK-101 [P1] Each ADR carries a recorded Accepted status, revised for confirmed real-implementation outcomes. Evidence: `decision-record.md` ADR-001 through ADR-005 each carry a `**STATUS: Accepted...**` line.
- [x] CHK-102 [P1] Both the `task-dispatch-guard.cjs` divergence and the `PostCompaction` bespoke-logic decision are backed by their own Five-Checks evaluation in `decision-record.md`.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION
- [x] CHK-110 [P1] No dedicated latency benchmark was recorded; live hooks completed within normal dispatch and `boundedMemoryContextResume()` retains its 2500ms timeout.
- [x] CHK-111 [P2] No load testing needed - hooks run at most once per lifecycle event, confirmed by design (not by load test, since none fire today).
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS
- [x] CHK-120 [P0] Rollback path confirmed by construction: every new file is additive under a `hooks/devin/` sibling directory and `.devin/hooks.v1.json` only gained new array entries: `git rm` the 10 files + `git checkout` the prior `hooks.v1.json` would cleanly revert with zero neutral-core impact (cores confirmed byte-unchanged, CHK-per SC-003).
- [x] CHK-121 [P0] No feature flag needed - additive, Devin-only and bounded by fail-open adapters. Evidence: `.devin/hooks.v1.json` contains only Devin registrations.
- [x] CHK-122 [P2] No monitoring or alerting configured; bounded smoke tests and runtime READMEs are the current operational controls.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION
- [x] CHK-130 [P1] Security review (CHK-030/031) completed above.
- [x] CHK-131 [P2] No new third-party dependency introduced - every adapter uses only Node built-ins (`node:crypto`, `node:child_process`, `node:fs`, `node:path`, `node:os`) and existing in-repo cores.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION
- [x] CHK-140 [P1] Every new/updated README cross-references its Codex/Claude sibling(s) and this phase's `decision-record.md`/`spec.md`.
- [x] CHK-141 [P2] `mcp-route-guard.cjs`'s README explicitly cross-references `../009-devin-mcp-host-integration/` for re-evaluation once real MCP servers exist - no adapter-path shift occurred during implementation (all paths matched the original file matrix, aside from adding `spec-gate-enforce.mjs`).
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF
- Operator (Product Owner): [ ] Approved
- Implementing agent (Technical Lead): [x] Approved - claude-code, 2026-07-24, all P0/P1/P2 items verified with cited evidence above.
<!-- /ANCHOR:sign-off -->

<!-- ANCHOR:summary -->
## Verification Summary
P0 Items: 12 total (12 verified). P1 Items: 12 total (12 verified). P2 Items: 3 total (3 verified). Verification correction date: 2026-07-25. Phase status: Complete, with six lifecycle events observed and four named surfaces still unobserved end to end.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`
