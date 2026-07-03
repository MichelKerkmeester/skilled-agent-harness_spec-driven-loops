---
title: "Verification Checklist: Phase 12: Envelope Presentation & Command-Doc Alignment"
description: "Level 2 verification gates for envelope single-casing + budget-after-attach, progressive-disclosure cursor scope integrity, rendering truth, CLI text renderer, the command-doc drift battery, dual-tree parity, and hook-lane hygiene. Verification date pending."
trigger_phrases:
  - "envelope double emission"
  - "token budget breach"
  - "command doc drift"
  - "progressive disclosure cursor"
  - "verification checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/012-envelope-presentation-and-command-doc-alignment"
    last_updated_at: "2026-07-03T09:58:00Z"
    last_updated_by: "planning-author"
    recent_action: "Authored Level 2 planning docs (spec/plan/tasks/checklist)"
    next_safe_action: "Run T001 live envelope baseline capture before any code change"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts"
      - ".opencode/commands/memory/search.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 12: Envelope Presentation & Command-Doc Alignment

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-012 + acceptance scenarios 1-6)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (FIX ADDENDUM surfaces table, inventories, cursor invariant)
- [ ] CHK-003 [P1] Dependencies identified and available (phase 011 surface trust noted; no schema deps)
- [ ] CHK-004 [P0] Baseline captured BEFORE first code change: live envelope byte/token breakdown (per-block incl. duplicated casings, `meta.tokenCount` vs actual) + vitest baseline (T001-T002, REQ-001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks (mcp_server eslint)
- [ ] CHK-011 [P0] No console errors or warnings in daemon/CLI runs of the touched paths
- [ ] CHK-012 [P1] Error handling implemented (invalid cursor, no-input envelope, shim invalid-JSON)
- [ ] CHK-013 [P1] Code follows project patterns (standard error envelope, flag conventions, formatter contracts)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (spec.md scenarios 1-6 walked with evidence)
- [ ] CHK-021 [P0] Manual testing complete (live post-fix envelope capture, `--format text` run, fallback-chain trace)
- [ ] CHK-022 [P1] Edge cases tested (0-result search, includeContent oversized row, exhausted cursor, budget exactly at limit)
- [ ] CHK-023 [P1] Error scenarios validated (forged/cross-scope/malformed cursor, empty input, invalid shim JSON)
- [ ] CHK-024 [P0] 5-result default envelope < 6KB with single casing and `meta.tokenCount` within ±10% of actual — before/after delta vs T001 baseline recorded (SC-001, SC-004)
- [ ] CHK-025 [P0] Adversarial cursor suite green: cross-scope, forged, expired-vs-malformed, dead-cursor, no-op resolve (REQ-004, SC-005)
- [ ] CHK-026 [P1] `--format text` renders one row per result + explicit omission notice; no silent drops (REQ-007, SC-003)
- [ ] CHK-027 [P0] Command-doc re-audit battery returns zero drifted claims across BOTH trees (REQ-008, SC-002)
- [ ] CHK-028 [P1] Parity script: negative test detects injected byte diff; green run on aligned trees; wiring merged (REQ-009)
- [ ] CHK-029 [P1] Routed-in findings verified: `memory_context` surfaces the delegated search envelope as structured top-level `data` — fidelity fields (`requestQuality`/`citationPolicy`/`envelopeRender`) reachable, no JSON-in-string double-encode (REQ-011) — AND resume-ladder `fingerprintStatus` is truthful when `fingerprintExpected` is null (REQ-012)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (all double-emission sites found, not just the four named blocks; all drifted claims pinned, not just the enumerated ones).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (both casings, formatter fields, cursor consumers — plan.md rg commands executed and results recorded).
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (cursor scope matrix from plan.md; shim invalid-JSON table).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (cursor {scope × cursor-state × page}; envelope {results × includeContent × budget}).
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (flag defaults, cached cursorStore across sessions).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented (cursor payloads validated server-side; empty input rejected via standard envelope)
- [ ] CHK-032 [P1] Scope/tenant filters preserved through disclosure resolves and cached responses (no scope widening via cache)
- [ ] CHK-033 [P0] Cursor tenant isolation verified: server-side scopeKey comparison on every resolve; forged and cross-scope cursors denied (#18)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized (statuses, task states, decision outcomes recorded)
- [ ] CHK-041 [P1] Code comments adequate — durable WHY only; NO report/ledger/finding IDs or packet numbers in code comments (comment-hygiene HARD BLOCK; refs live in tasks.md)
- [ ] CHK-042 [P2] README updated (if applicable beyond the battery scope)
- [ ] CHK-043 [P1] Every battery fix applied to BOTH command trees in the same commit; implementation-summary.md records casing choice + substitute-vs-drop rationale + baseline/post-fix deltas
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only (baseline capture artifacts included)
- [ ] CHK-051 [P1] scratch/ cleaned before completion (evidence moved into implementation-summary.md)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 0/17 |
| P1 Items | 17 | 0/17 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending — set when Phase 3 verification runs
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
