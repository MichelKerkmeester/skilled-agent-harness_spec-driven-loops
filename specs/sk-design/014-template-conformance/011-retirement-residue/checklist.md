---
title: "Verification Checklist: Close retirement residue + finish interrupted design-interface leaf docs"
description: "Verification checklist for the two tracks: vocabulary-residue fixes and evidence-backed leaf documentation reconciliation."
trigger_phrases:
  - "retirement residue checklist"
  - "audit foundations vocabulary cleanup checklist"
  - "design-interface leaf docs finish checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/011-retirement-residue"
    last_updated_at: "2026-07-27T20:00:00Z"
    last_updated_by: "worker-session"
    recent_action: "Verified all items with evidence; T001/CHK-010 left unfixed (sibling scope)"
    next_safe_action: "Hand T001 (design-md-generator/SKILL.md:246) to whichever session owns design-md-generator/"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/014-template-conformance/002-design-interface/006-scripts/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worker-session"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Close retirement residue + finish interrupted design-interface leaf docs
<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] All five Track A sites re-confirmed present with a fresh `rg` before editing
  - **Evidence:** all 5/5 sites individually re-read/grepped before any edit; 4/5 matched as described, 1/5 (canary fixture) had 2 additional stale cases
- [x] CHK-002 [P0] Each of `006-009`'s `spec.md` requirements read in full before its on-disk state is inspected
  - **Evidence:** all 4 `spec.md` files read in full; per-leaf read confirmation recorded in each `implementation-summary.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [Track A residue]

- [ ] CHK-010 [P0] `design-md-generator/SKILL.md:246` no longer lists `foundations`/`audit`
  - **Evidence:** re-confirmed still present (`foundations`/`motion`/`audit` at lines 60, 246, 315) — **NOT fixed**, `design-md-generator/` is explicitly a sibling worker's territory this session; left unchecked, not rubber-stamped
- [x] CHK-011 [P0] `canary-cases.v1.json`'s `foundations`/`audit` test cases retired or updated
  - **Evidence:** deleted 5 cases whose whole premise was a retired mode (`rg -n "\"foundations\"|\"audit\"|\"motion\"" .../canary-cases.v1.json` now returns nothing for mode-name assertions); re-verified via direct `loadSnapshot()`/`typedGold()` probe and the bin vitest suite (34→31 tests, same 3 pre-existing unrelated failures before/after)
- [x] CHK-012 [P1] `install-guides/README.md`'s sk-design row reflects current modes/commands
  - **Evidence:** row now reads "design-interface, design-md-generator, design-mcp-open-design (nested transport)"
- [x] CHK-013 [P1] `command-contract.json:81`'s `invocation_aliases` drops retired aliases
  - **Evidence:** `grep -n "interface:foundations\|interface:audit" command-contract.json` returns nothing
- [x] CHK-014 [P1] `shared-base-not-workflow.md:34`'s mode-count claim updated
  - **Evidence:** line now reads "two workflow modes: `interface` and `md-generator` (plus the `design-mcp-open-design` transport)"
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [Track B leaf verification]

- [x] CHK-020 [P0] `006-scripts`'s on-disk `design-interface/scripts/` state verified against its `spec.md` requirements, with a genuine pass/fail note
  - **Evidence:** `002-design-interface/006-scripts/implementation-summary.md` — audit complete, plus a real bug found+fixed (sys.path off-by-one) with re-run pass/fail evidence for all 3 checkers
- [x] CHK-021 [P0] `007-feature-catalog`'s on-disk state verified against its `spec.md` requirements
  - **Evidence:** `002-design-interface/007-feature-catalog/implementation-summary.md` — original 10-file fix confirmed already landed; 4 new occurrences (post-motion-merge) found and fixed
- [x] CHK-022 [P0] `008-manual-testing-playbook`'s on-disk state verified against its `spec.md` requirements
  - **Evidence:** `002-design-interface/008-manual-testing-playbook/implementation-summary.md` — root cause confirmed, residue hypothesis disproven, 2 real small defects fixed, 1 real unresolved gap recorded
- [x] CHK-023 [P0] `009-changelog`'s on-disk state verified against its `spec.md` requirements
  - **Evidence:** `002-design-interface/009-changelog/implementation-summary.md` — disposition applied and justified, 3rd file (sibling-added) accounted for
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [doc reconciliation, no rubber-stamping]

- [x] CHK-030 [P0] Every `checklist.md` mark for `006-009` cites real evidence, not a copy of the `005-corpus` pattern
  - **Evidence:** each leaf's checklist items cite a specific command, file:line, or grep result — none copied from another leaf
- [x] CHK-031 [P1] `design-motion/`-internal residue (`README.md`, `corpus-map.md`) is explicitly named as deferred to `010-motion-merge`, not fixed here
  - **Evidence:** moot — `010-motion-merge` has since landed; `find .opencode/skills/sk-design -maxdepth 1 -type d` confirms `design-motion/` no longer exists at all
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [n/a]

- [x] CHK-040 [P2] No secrets or credentials touched by this packet
  - **Evidence:** all edits are markdown/JSON/Python-comment content; the 2 Python fixes touched only an import path string
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` describe the same two-track scope
  - **Evidence:** `tasks.md` and `checklist.md` both updated this session to reflect T001's sibling-scope deferral and the `commands/README.txt` addition; `implementation-summary.md` updated to match
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [ ] CHK-060 [P0] `rg -n "foundations|audit"` across all five Track A sites returns nothing
  - **Evidence:** 4/5 sites clean; `design-md-generator/SKILL.md` intentionally still has 3 matches (T001, sibling scope) — left unchecked rather than falsely claimed clean
- [x] CHK-061 [P1] `006-009`'s checklist and implementation-summary agree with each other and with the real on-disk state
  - **Evidence:** cross-read each pair after writing; no contradictions found
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 6/8 (CHK-010, CHK-060 intentionally open — sibling-scope boundary, not a failure) |
| P1 Items | 5 | 5/5 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-27
<!-- /ANCHOR:summary -->
