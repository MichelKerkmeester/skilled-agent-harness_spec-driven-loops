---
title: "Verification Checklist: A6 HVR Style Auto-Fix Linter [template:level_2/checklist.md]"
description: "Verification Date: Pending (scaffold, not yet verified)"
trigger_phrases:
  - "hvr style"
  - "em-dash linter"
  - "prose semicolon"
  - "oxford comma"
  - "style auto-fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/006-hvr-style-autofix"
    last_updated_at: "2026-07-04T17:11:59.545Z"
    last_updated_by: "markdown-agent"
    recent_action: "Added benchmark and default-off QA rows for A6"
    next_safe_action: "Hold for implementation, no item has been verified yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: A6 HVR Style Auto-Fix Linter

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Shared-safe-fix-engine dependency and the frozen `fixClass` allow-list identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The detector parses prose ranges that exclude fenced code blocks inline code spans and YAML frontmatter
- [ ] CHK-011 [P0] No console errors or warnings from the detector on a valid spec-doc
- [ ] CHK-012 [P1] Report mode and apply mode branches preserved, `detect` never writes and `fix` writes only under `'safe'`
- [ ] CHK-013 [P1] Change follows the shipped wikilink validator fence-aware pattern and the registry entry shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006)
- [ ] CHK-021 [P0] A mixed fixture auto-fixes to zero issues with code inline-code and frontmatter regions byte-identical
- [ ] CHK-022 [P1] A re-run over already-clean prose applies zero changes under the `content_hash` guard
- [ ] CHK-023 [P1] An ambiguous em-dash or semicolon swap asserts its exact documented output
- [ ] CHK-024 [P0] Benchmark: swap precision 1.0 and planted catch-rate 1.0 on fixtures, post-apply conformance to zero and a byte-identical non-prose round-trip
- [ ] CHK-025 [P1] First-run real-defect floor: a report-mode scan over the live `.opencode/specs` corpus flags at least one genuine HVR-style violation
- [ ] CHK-026 [P1] Default-off proof: `SPECKIT_HVR_STYLE_AUTOFIX` defaults OFF via `flag-ceiling.vitest.ts` and a flags-off round-trip is byte-identical
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] The detector opens no network or DB connection and stays inside the existing local trust boundary
- [ ] CHK-032 [P1] The fix writes only the target spec-doc through the engine atomic write path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Each deterministic swap default documented inline in the detector
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 15 | 0/15 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending (scaffold, not yet verified)
<!-- /ANCHOR:summary -->

---
