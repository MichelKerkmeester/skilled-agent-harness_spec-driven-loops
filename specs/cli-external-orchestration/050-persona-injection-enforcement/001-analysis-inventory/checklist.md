---
title: "Verification Checklist: Persona-Injection Gap Analysis & Dispatch-Point Inventory"
description: "Verification evidence for the read-only inventory phase."
trigger_phrases:
  - "persona injection analysis checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/001-analysis-inventory"
    last_updated_at: "2026-08-19T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded Phase 001 checklist"
    next_safe_action: "Dispatch cli-devin to produce the inventory"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-001-analysis"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Persona-Injection Gap Analysis & Dispatch-Point Inventory

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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
- [ ] CHK-002 [P0] Dispatch approach defined in plan.md
- [ ] CHK-003 [P1] Executor prerequisite confirmed (devin available + authed, or fallback chosen)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Inventory artifact has no placeholder/TODO text
- [ ] CHK-011 [P1] Inventory is structured per-mode (usable by P3 without re-reading source)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every dispatch path (6 modes + hub + sk-prompt) present in the inventory
- [ ] CHK-021 [P0] Every native-vs-inline verdict cites file:line
- [ ] CHK-022 [P0] Orchestrator spot-verified a sample of cited claims against source
- [ ] CHK-023 [P1] Gap explicitly stated with evidence
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each dispatch path is classified: native-load, inline-required, or partial-precedent.
- [ ] CHK-FIX-002 [P0] Per-mode inventory completed for all six modes (no mode omitted), cross-checked against mode-registry.json.
- [ ] CHK-FIX-003 [P0] Consumer inventory: every sk-prompt doc that owns CLI prompt construction is identified as a P4 target.
- [ ] CHK-FIX-004 [P1] Version-specific native-mechanism reality recorded where docs and installed behavior disagree (e.g. cli-devin .claude/agents import).
- [ ] CHK-FIX-005 [P1] Each multi-surface mode has each surface classified separately.
- [ ] CHK-FIX-006 [P1] Existing partial precedents (DESIGN_DISPATCH_MANIFEST, code/design standards loading) catalogued for P2 reuse.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to file:line at a known commit, not a moving reference.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets sent in the dispatch prompt (task + persona + repo paths only)
- [ ] CHK-031 [P1] Read-only phase — output confined to scratch/, no source edits in scope
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Findings summary recorded in implementation-summary.md
- [ ] CHK-041 [P1] Precedents catalogued for P2 reuse
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp/analysis output in scratch/ only
- [ ] CHK-051 [P2] No stray files outside the phase folder (git status sweep)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 9 | 0/9 |
| P2 Items | 2 | 0/2 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
