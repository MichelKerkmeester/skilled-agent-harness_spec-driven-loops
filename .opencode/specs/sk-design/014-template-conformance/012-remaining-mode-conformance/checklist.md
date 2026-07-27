---
title: "Verification Checklist: Template conformance for design-md-generator and design-mcp-open-design"
description: "Verification checklist for the enum fix, exemplar-file relocate-vs-exempt decision, and heading numbering across five design-mcp-open-design reference files."
trigger_phrases:
  - "remaining mode conformance checklist"
  - "design-md-generator conformance checklist"
  - "design-mcp-open-design conformance checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/012-remaining-mode-conformance"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored verification checklist, no item checked yet"
    next_safe_action: "Verify CHK-001 once Phase 1 lands"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Template conformance for design-md-generator and design-mcp-open-design
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

- [ ] CHK-001 [P0] Citing sites for the four exemplar `DESIGN.md` files are checked before deciding relocate vs. exempt
  - **Evidence (planned):** `rg -n "examples/(vercel|linear|supabase|stripe)/DESIGN.md" .opencode/skills/sk-design/design-md-generator/`
- [ ] CHK-002 [P0] Each of the 5 `design-mcp-open-design` files' current H2 list is recorded before renumbering
  - **Evidence (planned):** pre-edit `grep -n "^## "` output per file
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [enum + placement]

- [ ] CHK-010 [P0] `extraction-workflow.md:10`'s `importance_tier` is in-enum
  - **Evidence (planned):** `rg -n "importance_tier" design-md-generator/references/extraction-workflow.md`
- [ ] CHK-011 [P0] The four exemplar `DESIGN.md` files' conformance is resolved (relocated or exempted), content byte-identical
  - **Evidence (planned):** `diff` of each file's content before/after
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [heading numbering]

- [ ] CHK-020 [P0] `cli-child-pairing.md` H2s numbered + uppercased, no heading lost
  - **Evidence (planned):** pre/post `grep -n "^## "` diff
- [ ] CHK-021 [P0] `freshness-invalidation.md` H2s numbered + uppercased, no heading lost
  - **Evidence (planned):** pre/post `grep -n "^## "` diff
- [ ] CHK-022 [P0] `guarded-proxy.md` H2s numbered + uppercased, no heading lost (worst case, 234 lines)
  - **Evidence (planned):** pre/post `grep -n "^## "` diff
- [ ] CHK-023 [P0] `inner-generator-binding.md` H2s numbered + uppercased, no heading lost
  - **Evidence (planned):** pre/post `grep -n "^## "` diff
- [ ] CHK-024 [P0] `smart-router-pseudocode.md` H2s numbered + uppercased, no heading lost
  - **Evidence (planned):** pre/post `grep -n "^## "` diff
- [ ] CHK-025 [P1] The 4 already-conformant `design-mcp-open-design` files show no diff
  - **Evidence (planned):** `git diff --stat` for `design-parity-transport.md`, `mcp-wiring.md`, `od-cli-reference.md`, `tool-surface.md`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [scope boundary]

- [ ] CHK-030 [P1] `003-design-motion`'s supersession by `010-motion-merge` is stated explicitly, not silently dropped
  - **Evidence (planned):** this packet's spec.md Out of Scope section
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [n/a]

- [ ] CHK-040 [P2] No secrets or credentials touched by this packet
  - **Evidence (planned):** diff review confirms markdown/frontmatter content only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` describe the same three-item scope
  - **Evidence (planned):** cross-read of all five packet files
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [ ] CHK-060 [P0] All 9 `design-mcp-open-design/references/*.md` files use numbered, upper-cased H2 headings
  - **Evidence (planned):** `grep -Lc "^## [0-9]" design-mcp-open-design/references/*.md` returns nothing (no file lacks numbered H2s)
- [ ] CHK-061 [P1] `design-md-generator` carries no off-enum `importance_tier` anywhere
  - **Evidence (planned):** `rg -n "importance_tier: \"high\""` design-md-generator returns nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 4 | 0/4 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD (packet authored 2026-07-27; no work started, nothing verified yet)
<!-- /ANCHOR:summary -->
