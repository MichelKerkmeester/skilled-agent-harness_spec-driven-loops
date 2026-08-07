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
    last_updated_at: "2026-07-27T18:03:42Z"
    last_updated_by: "conformance-executor"
    recent_action: "All checklist items verified and checked off"
    next_safe_action: "Packet complete, no further action required"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
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

- [x] CHK-001 [P0] Citing sites for the four exemplar `DESIGN.md` files are checked before deciding relocate vs. exempt
  - **Evidence:** `rg -n "examples/(vercel|linear|supabase|stripe)/DESIGN.md" design-md-generator/` -> path-only citations in `SKILL.md`, feature-catalog, and 3 manual-testing-playbook scenario files; zero `#fragment` anchors. Decision: documented exemption, recorded in `references/examples/README.md`.
- [x] CHK-002 [P0] Each of the 5 `design-mcp-open-design` files' current H2 list is recorded before renumbering
  - **Evidence:** pre-edit `grep -nE "^## "` captured for all 9 `design-mcp-open-design/references/*.md` files before any edit (5 unnumbered: `cli-child-pairing.md`, `freshness-invalidation.md`, `guarded-proxy.md`, `inner-generator-binding.md`, `smart-router-pseudocode.md`; a 6th, `design-parity-transport.md`, was found missing only `## 1. OVERVIEW` — its existing 1-5 numbering was recorded and shifted to 2-6).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [enum + placement]

- [x] CHK-010 [P0] `extraction-workflow.md:10`'s `importance_tier` is in-enum
  - **Evidence:** `rg -n "importance_tier" design-md-generator/references/extraction-workflow.md` -> `importance_tier: "important"`. A second, previously unrecorded instance in `assets/cardinal-rules-card.md:9` was found by the same grep pattern hub-wide and fixed identically.
- [x] CHK-011 [P0] The four exemplar `DESIGN.md` files' conformance is resolved (relocated or exempted), content byte-identical
  - **Evidence:** `contextType: reference` -> `general` on line 9 of each of the 4 `DESIGN.md` files (plus their 4 paired `writing-notes.md` files, same rationale); no other line changed. Exemption rationale recorded in `references/examples/README.md`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [heading numbering]

- [x] CHK-020 [P0] `cli-child-pairing.md` H2s numbered + uppercased, no heading lost
  - **Evidence:** pre 9 unnumbered H2s (`Result Schema`, `Parent Re-Validation`, `Deny Rules`, `Named Residual`, `Agent I/O Is Not The Gate`, `Acceptance`, `Cross-Delegation Token Laundering Guard`, `Open Design Transport Assertion Pairing`, `Register Acceptance Gate`) -> post 10 H2s (`## 1. OVERVIEW` inserted + all 9 numbered/uppercased through `## 10. REGISTER ACCEPTANCE GATE`); all 3 pre-existing `### ...Extension`/H3s untouched.
- [x] CHK-021 [P0] `freshness-invalidation.md` H2s numbered + uppercased, no heading lost
  - **Evidence:** pre 4 unnumbered H2s (`Freshness Axes`, `Boundary Contract`, `Acceptance`, `Implementation Notes`) -> post 5 (`## 1. OVERVIEW` inserted, then `## 2.`-`## 5.`, all present).
- [x] CHK-022 [P0] `guarded-proxy.md` H2s numbered + uppercased, no heading lost (worst case, 234 lines)
  - **Evidence:** pre 9 unnumbered H2s (`Boundary`, `Canonical Request`, `Surface Mapping`, `Classification`, `` `openDesignDesignPrecondition` ``, `Exemption Model`, `Policy`, `Named Residual`, `Acceptance`, `Automation Freeze` — 10 actually) -> post 11 (`## 1. OVERVIEW` inserted, then `## 2.`-`## 11.`); the function-name heading kept its literal backtick identifier inline (`## 6. PRECONDITION FUNCTION (\`openDesignDesignPrecondition\`)`).
- [x] CHK-023 [P0] `inner-generator-binding.md` H2s numbered + uppercased, no heading lost
  - **Evidence:** pre 5 unnumbered H2s -> post 7 (`## 1. OVERVIEW` inserted with a new Dependencies subsection carrying the moved dependency table, then `## 2.`-`## 7.`).
- [x] CHK-024 [P0] `smart-router-pseudocode.md` H2s numbered + uppercased, no heading lost
  - **Evidence:** pre 1 unnumbered H2 (`References`) with no OVERVIEW and the entire body as one code fence -> post 3 (`## 1. OVERVIEW`, `## 2. IMPLEMENTATION` wrapping the unchanged code, `## 3. REFERENCES`).
- [x] CHK-025 [P1] The already-conformant `design-mcp-open-design` files show no diff
  - **Evidence:** `git diff --stat` for `mcp-wiring.md`, `od-cli-reference.md`, `tool-surface.md` -> no changes. `design-parity-transport.md` was found during the exhaustive sweep to be missing `## 1. OVERVIEW` (numbered 1-5 but no OVERVIEW section) and was fixed in-scope (see spec.md addendum); it is therefore NOT in this untouched set.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [scope boundary]

- [x] CHK-030 [P1] `003-design-motion`'s supersession by `010-motion-merge` is stated explicitly, not silently dropped
  - **Evidence:** `spec.md` § Out of Scope: "`003-design-motion`'s conformance work — fully superseded by `010-motion-merge`; not touched, not re-scoped here."
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [n/a]

- [x] CHK-040 [P2] No secrets or credentials touched by this packet
  - **Evidence:** all changes are markdown content/frontmatter edits plus one new README.md and a regenerated `leaf-manifest.json`; `git diff --stat` scoped to `.opencode/skills/sk-design/design-md-generator/` and `.opencode/skills/sk-design/design-mcp-open-design/` shows no non-doc files touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` describe the same scope
  - **Evidence:** all five updated together in this session to describe the original 3-item scope plus the exhaustive-sweep addendum (13 additional files); cross-read confirms consistent file lists and decisions across all five documents.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [x] CHK-060 [P0] All 9 `design-mcp-open-design/references/*.md` files use numbered, upper-cased H2 headings
  - **Evidence:** `for f in design-mcp-open-design/references/*.md; do grep -nE "^## [^0-9]" "$f"; done` returns nothing (all real H2s numbered; the one literal `## Motion` example inside a code fence in the unrelated md-generator packet is not part of this file set).
- [x] CHK-061 [P1] `design-md-generator` carries no off-enum `importance_tier` anywhere
  - **Evidence:** `rg -rn 'importance_tier:' design-md-generator | grep -viE 'importance_tier:\s*"?(normal|important|critical|constitutional|temporary|deprecated)"?\s*$'` returns nothing. Same sweep confirms `contextType:` has no off-enum values remaining.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 4 | 4/4 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-27 — all items verified; gate results in `implementation-summary.md`
<!-- /ANCHOR:summary -->
