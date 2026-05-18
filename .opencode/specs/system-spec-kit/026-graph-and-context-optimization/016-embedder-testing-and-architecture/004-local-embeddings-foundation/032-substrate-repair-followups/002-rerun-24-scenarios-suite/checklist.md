---
title: "Verification Checklist: rerun 24-- scenarios suite"
description: "Verification Date: 2026-05-14"
trigger_phrases:
  - "rerun 24 scenarios checklist"
  - "post 032 scenario suite verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/032-substrate-repair-followups/002-rerun-24-scenarios-suite"
    last_updated_at: "2026-05-14T11:55:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Captured blocked verification evidence"
    next_safe_action: "Repair runtime blockers before claiming suite completion"
    blockers:
      - "Missing zod-to-json-schema prevents Memory MCP startup"
      - "opencode-go/kimi-k2.6 provider call failed"
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000322"
      session_id: "002-rerun-24-scenarios-suite"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Verification Checklist: rerun 24-- scenarios suite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR document out-of-scope evidence |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: packet spec read first.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: sequential runner and preflight gate documented.
- [x] CHK-003 [P1] Dependencies identified. Evidence: OpenCode, Spec Kit Memory MCP, and scenario files listed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] OpenCode installed. Evidence: `opencode --version` returned `1.14.48`.
- [x] CHK-011 [P0] Provider credentials present. Evidence: `opencode providers list` listed OpenAI, DeepSeek, and OpenCode Go.
- [ ] CHK-012 [P0] `memory_health` passed. Evidence: blocked; Memory MCP launcher failed before tool registration.
- [ ] CHK-013 [P0] Preflight `memory_save` round-trip passed. Evidence: blocked because health gate failed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-014 [P0] All 15 scenarios attempted. Evidence: blocked before suite execution.
- [ ] CHK-015 [P0] At least 8 scenarios PASS/PARTIAL. Evidence: not measured.
- [ ] CHK-016 [P0] Save-heavy scenarios round-tripped. Evidence: not measured.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-020 [P0] Runner script created. Evidence: `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.sh`.
- [x] CHK-021 [P0] Evidence report created. Evidence: `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.md`.
- [x] CHK-022 [P0] Blocker evidence captured. Evidence: report records missing `zod-to-json-schema` and provider connection refusal.
- [x] CHK-023 [P1] Cleanup checked. Evidence: `_sandbox/032-002-preflight/` was never created; no per-scenario sandboxes were created by this executor.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added.
- [x] CHK-031 [P0] No scenario files modified.
- [x] CHK-032 [P1] No substrate/env mutations performed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Plan/tasks/checklist/implementation summary added.
- [x] CHK-041 [P1] Implementation summary cross-links to the evidence report.
- [x] CHK-042 [P1] Metadata status updated to `blocked`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scenario source files were not modified.
- [x] CHK-051 [P1] Evidence files are scoped to `_sandbox/24--local-llm-query-intelligence/evidence/`.
- [x] CHK-052 [P1] Preflight sandbox cleanup checked; no preflight sandbox was created.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 9/15 |
| P1 Items | 7 | 7/7 |

**Verification Date**: 2026-05-14

The packet is blocked, not complete. The missing P0 items are the actual acceptance criteria that require a working Memory MCP and OpenCode provider route.
<!-- /ANCHOR:summary -->
