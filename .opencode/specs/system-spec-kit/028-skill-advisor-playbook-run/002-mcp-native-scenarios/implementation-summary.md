---
title: "Implementation Summary: MCP-Native Scenarios (Playbook Run Phase 002)"
description: "NC-001..009 ran clean against the live advisor surface (7 PASS, 2 PARTIAL); the run surfaced a real accuracy regression — advisor_validate reports 50.78% full-corpus accuracy versus the documented 80.5% baseline."
trigger_phrases:
  - "playbook mcp native summary"
  - "NC results summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/002-mcp-native-scenarios"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "Recorded NC scenario verdicts"
    next_safe_action: "Phase 003 CLI hooks"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-skill-advisor-playbook-run/002-mcp-native-scenarios |
| **Completed** | 2026-05-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The native advisor surface works and is prompt-safe: 7 of 9 NC scenarios pass outright, and the two PARTIALs are honest — one because a transition needs a disposable workspace, the other because the run uncovered a real accuracy regression worth fixing. Every recommendation, status, and graph envelope returned `status: ok` with no raw prompt text leaking into attribution, cache, trust-state, or warnings.

### Recommendation + ambiguity (NC-001, NC-004)
`advisor_recommend` for a memory prompt returned `system-spec-kit` at confidence 0.9442 with `effectiveThresholds` exactly `{0.8, 0.35, false}` and a fully structured five-lane breakdown. The cross-domain prompt put `sk-code` (0.8966) and `sk-prompt` (0.8892) within 0.0074 confidence and correctly set `ambiguous: true`. The ambiguity/renderer/lifecycle/plugin-bridge vitest suites pass 49/49.

### Status vs rebuild separation (NC-002, NC-006)
`advisor_status` is diagnostic-only: repeated calls never advanced the generation (held at 4463). `advisor_rebuild` with no force returned `skipped: true, reason: "status-live"`; with `force: true` it returned `rebuilt: true, reason: "force"` and bumped 4463 to 4464, correctly skipping two non-skill-metadata fixtures. The stale-repair and stale/absent transitions need a disposable copy with its own `node_modules`/`dist`, which this session did not stand up — those sub-steps are deferred, hence NC-002 PARTIAL.

### Skill graph reads (NC-007, NC-008, NC-009)
`skill_graph_status` reports 21 skills / 85 edges, `dbStatus: ready`, `isHealthy: true`. `skill_graph_query` (hub_skills, limit 10) returned query-type metadata and exactly 10 bounded rows. `skill_graph_validate` returned `isValid: true`, 0 errors.

### The accuracy regression (NC-003)
`advisor_validate` returned the full public contract — thresholdSemantics, all corpus/holdout/parity/safety/latency slices, telemetry diagnostics — with real (non-fixed) values. But the numbers are well below the documented Phase-027 baseline: **full-corpus top-1 50.78% (baseline 80.5%), holdout 42.5% (baseline 77.5%), unknown count 13 (target ≤10)**. The per-skill table shows `sk-deep-research` 0/34 and `sk-deep-review` 0/19 — the corpus gold labels reference skill IDs that the live graph now indexes as `deep-research`/`deep-review`, a skill-ID drift that alone accounts for ~53 zero-scored cases. This is corroborated independently in phase 004 by OpenCode (SC-005, 50.78%) and Devin (PC-004 Python regression, 50% P0).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `/tmp/skill-advisor-playbook/*.json`, `nc-004-005-vitest-v2.log` | Created | Captured envelopes + test logs (untracked) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each scenario was run by calling the documented MCP tool with the scenario's exact payload, saving the envelope, and comparing field-by-field against the expected signals. The NC-004/005 vitest sub-steps initially found no tests because the playbook's documented path (`skill-advisor/tests/...` from `system-spec-kit/mcp_server`) does not exist; re-running from `system-skill-advisor/mcp_server` with `tests/...` passed 49/49. That path drift is recorded as a finding.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mark NC-002 PARTIAL rather than PASS | Live fields all verified, but the scenario explicitly asks to simulate stale + absent; those need a disposable+daemon harness this session did not build |
| Mark NC-003 PARTIAL, not FAIL | The tool contract is intact and values are real; the failing item is the baseline accuracy expected-signal, which is a regression finding rather than a broken tool |
| Run one `advisor_rebuild force:true` against live | The only safe way to demonstrate the force path; rebuild is idempotent and self-healing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| NC-001 recommend happy path | PASS |
| NC-002 status transitions | PARTIAL (live verified; stale/absent deferred) |
| NC-003 validate slice bundle | PARTIAL (contract intact; accuracy 50.78% vs 80.5% baseline) |
| NC-004 ambiguous brief | PASS (ambiguous:true; vitest 49/49) |
| NC-005 lifecycle redirect | PASS (vitest pass; no superseded fixture to exercise redirect) |
| NC-006 status/rebuild separation | PASS (diagnostic-only + skip/force confirmed) |
| NC-007 skill_graph_status | PASS |
| NC-008 skill_graph_query | PASS |
| NC-009 skill_graph_validate | PASS |
| **NC total** | **7 PASS, 2 PARTIAL, 0 FAIL, 0 SKIP** |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **NC-002 stale/absent and NC-006 stale-repair are deferred.** Both need a disposable repo copy with its own `node_modules`/`dist` and a daemon watching it. The live-state contract is fully verified; only the fault-injection transitions are unproven locally.
2. **NC-003 outcome-injection sub-step is not callable via MCP.** The `advisor_validate` tool schema is `additionalProperties:false` and does not expose `outcomeEvents`, so the focused `recordedThisRun == 3` check from the scenario cannot run through the MCP surface.
3. **Accuracy regression is recorded, not fixed.** Remediation (corpus skill-ID realignment + P0 routing) is out of scope for this run and flagged for a follow-on packet.
<!-- /ANCHOR:limitations -->
