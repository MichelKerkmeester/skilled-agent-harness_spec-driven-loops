---
title: "Verification Checklist: Devin MCP-host integration"
description: "Verification checklist for the Devin MCP-host integration phase."
trigger_phrases: ["devin mcp host integration checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/009-devin-mcp-host-integration"
    last_updated_at: "2026-07-24T06:43:46Z"
    last_updated_by: "claude-code"
    recent_action: "Authored verification checklist; all items unchecked, phase Planned"
    next_safe_action: "Work through items in order once implementation starts"
    blockers: ["devin auth login needed for live verification"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Devin MCP-host integration

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
- [ ] CHK-001 [P0] Phase 001 confirmed Complete (already true).
- [ ] CHK-002 [P0] Live `devin mcp` subcommand surface + config schema re-verified, not assumed from docs alone.
- [ ] CHK-003 [P0] Mutation-tool list enumerated from a live `tools/list` call for all 3 servers.
- [ ] CHK-004 [P1] All 4 ADRs accepted before config is written.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [ ] CHK-010 [P0] `.devin/config.json` is valid JSON, passes `jq empty`.
- [ ] CHK-011 [P0] `.devin/config.local.json.example` contains no real secrets, only placeholder values.
- [ ] CHK-012 [P1] Every `mcpServers` entry's launcher path is confirmed to exist on disk.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [ ] CHK-020 [P0] Live discovery: all 3 servers appear in `devin mcp list` and their tools appear in `tools/list`.
- [ ] CHK-021 [P0] Live deny test: every enumerated mutation tool is denied/asked without Tier 2 opt-in.
- [ ] CHK-022 [P0] Live wildcard-survival test: a session-level broad grant does not override the project-level deny.
- [ ] CHK-023 [P0] Live cross-session-mode test: launchers resolve in fresh, resumed, sandboxed, and handed-off sessions.
- [ ] CHK-024 [P1] Live cold-bootstrap test: native modules build/resolve on Devin's Linux sandbox.
- [ ] CHK-025 [P0] Rollback test: disabling/removing all 3 entries touches no repository database or source file.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
N/A - this phase is new host-integration work, not a bug fix.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [ ] CHK-030 [P0] `grep -r "MK_SKILL_ADVISOR_TRUST_DEFAULT" .devin/config.json` returns zero matches.
- [ ] CHK-031 [P0] No `mcp__<server>__*` or `mcp__*` wildcard anywhere in the committed Tier 1 config.
- [ ] CHK-032 [P0] `.devin/config.local.json` (the real file, if created locally) is confirmed gitignored via `git status`.
- [ ] CHK-033 [P1] No provider secret appears in any committed file, only in the local-only template's placeholder values.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [ ] CHK-040 [P0] `cli-devin/references/mcp-host-integration.md` documents the two-tier policy, acceptance matrix, and rollback steps.
- [ ] CHK-041 [P1] `cli-devin/SKILL.md` cross-references the new reference doc.
- [ ] CHK-042 [P1] `008-devin-hook-parity`'s `mcp-route-guard.cjs` dormancy note is updated to reflect the 3 newly-registered servers.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [ ] CHK-050 [P1] `.devin/config.json` and `.devin/config.local.json.example` live at the project root, matching Devin's documented discovery location.
- [ ] CHK-051 [P1] The new reference doc lives under `cli-devin/references/`, matching sibling packet conventions.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION
- [ ] CHK-100 [P0] All 4 ADRs documented with Context, Decision, Alternatives, Consequences, Five Checks, Implementation sections.
- [ ] CHK-101 [P1] Each ADR has a recorded status (Proposed/Accepted).
- [ ] CHK-102 [P1] The two-tier policy's trust-boundary rationale (why Tier 2 is never inherited) is explicitly justified, not asserted without evidence.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION
- [ ] CHK-110 [P1] Cold-bootstrap timing is captured as evidence (not just pass/fail) so future phases know what to expect.
- [ ] CHK-111 [P2] No ongoing performance monitoring needed - this is a one-time registration, not a running service.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS
- [ ] CHK-120 [P0] Rollback tested and confirmed non-destructive (CHK-025).
- [ ] CHK-121 [P0] No feature flag needed - additive, Devin-only.
- [ ] CHK-122 [P2] No monitoring/alerting configured - not required for a one-time host registration.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION
- [ ] CHK-130 [P0] Security review (CHK-030 through CHK-033) completed before marking done.
- [ ] CHK-131 [P2] No new third-party dependency licenses introduced.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION
- [ ] CHK-140 [P1] Reference doc cross-references both this phase and phase 008.
- [ ] CHK-141 [P2] Acceptance-matrix results (from Phase 3 live tests) are recorded as evidence in `implementation-summary.md`, not just asserted.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF
- Operator (Product Owner): [ ] Approved
- Implementing agent (Technical Lead): [ ] Approved
<!-- /ANCHOR:sign-off -->

<!-- ANCHOR:summary -->
## Verification Summary
P0 Items: 14 total (0 verified). P1 Items: 10 total (0 verified). P2 Items: 4 total (0 verified). Verification Date: Not yet started - phase is Planned.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`
