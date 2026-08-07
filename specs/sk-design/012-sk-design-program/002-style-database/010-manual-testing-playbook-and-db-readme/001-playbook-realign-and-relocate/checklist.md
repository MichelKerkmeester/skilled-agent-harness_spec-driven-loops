---
title: "Verification Checklist: Realign + Relocate the Styles Manual-Testing Playbook"
description: "Level 2 verification checklist for the playbook realign + relocate child phase. Planning — all items pending until execution."
trigger_phrases:
  - "styles playbook relocate checklist"
  - "create-manual-testing-playbook verification checklist"
  - "styles playbook release readiness"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/010-manual-testing-playbook-and-db-readme/001-playbook-realign-and-relocate"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Authored L2 checklist for playbook realign"
    next_safe_action: "Mark items with evidence"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/docs/manual-testing-playbook.md"
      - ".opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-009-001-playbook-realign-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Realign + Relocate the Styles Manual-Testing Playbook

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
  - **Evidence**: Pending — spec.md authored; verify REQ-001..006 at execution
- [ ] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: Pending — plan.md includes architecture, category grouping, phases
- [ ] CHK-003 [P1] Canonical target path and inbound references confirmed
  - **Evidence**: Pending — target `styles/manual-testing-playbook/`; inbound ref `styles/tests/README.md:16`


<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Root playbook passes structural validation
  - **Evidence**: Pending — `validate_document.py --type reference` exits 0
- [ ] CHK-011 [P0] Per-feature files use required 5-section structure + dividers
  - **Evidence**: Pending — manual spot-check per SKILL.md §6
- [ ] CHK-012 [P1] Verdict vocabulary limited to PASS/FAIL/SKIP
  - **Evidence**: Pending — no `PARTIAL`/`UNAUTOMATABLE`; each former PARTIAL mapped
- [ ] CHK-013 [P1] Follows create-manual-testing-playbook package invariants
  - **Evidence**: Pending — no `snippets/` subtree, no packet-local `graph-metadata.json`


<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
  - **Evidence**: Pending — REQ-001..003, REQ-005..006 verified
- [ ] CHK-021 [P0] Feature-ID count matches (root index == per-feature files == 11)
  - **Evidence**: Pending — grep count of feature IDs vs per-feature files
- [ ] CHK-022 [P1] Every scenario names a real on-disk artifact
  - **Evidence**: Pending — cross-check `styles/lib/**`, `commands/interface/**`
- [ ] CHK-023 [P1] Prompt fields synchronized across contract/table/summary
  - **Evidence**: Pending — prompt synchronization gate


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

- [ ] CHK-030 [P0] No secrets or credentials in playbook prompts
  - **Evidence**: Pending — scenarios run against local on-disk artifacts only
- [ ] CHK-031 [P1] Destructive scenarios marked and isolated with safe recovery
  - **Evidence**: Pending — operator rollback/repair scenarios (DB-07) flagged
- [ ] CHK-032 [P1] Documentation-only diff (no runtime/schema/data change)
  - **Evidence**: Pending — `git diff` scoped to markdown


<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized with final package
  - **Evidence**: Pending — reconcile at execution
- [ ] CHK-041 [P1] Inbound references updated; markdown link guard clean
  - **Evidence**: Pending — `styles/tests/README.md` link updated; guard green
- [ ] CHK-042 [P2] `styles/docs/` disposition resolved and documented
  - **Evidence**: Pending — remove `docs/` if empty, or record why it stays


<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Old `docs/manual-testing-playbook.md` removed
  - **Evidence**: Pending — file deleted after successful relocate
- [ ] CHK-051 [P1] No temp/scratch files left in the package
  - **Evidence**: Pending — package tree contains only canonical artifacts


<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 14 | 0/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending (planning stub)
**Verified By**: Pending

<!-- /ANCHOR:summary -->
