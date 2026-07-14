---
title: "Checklist: sk-doc Packet Smart Routing Conformance"
description: "QA verification checklist for the 7-packet Smart Routing normalization, with evidence."
trigger_phrases:
  - "015 checklist smart routing conformance"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-router-alignment/009-packet-smart-routing-conformance"
    last_updated_at: "2026-07-14T08:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "Commit"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Checklist: sk-doc Packet Smart Routing Conformance

---

<!-- ANCHOR:protocol -->
## Verification Protocol
Every item carries evidence: a command + its result. Deterministic checkers only (no live dispatch).
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Baseline captured: `package_skill.py --check` on 10 packets → 8 FAIL, 2 PASS
- [x] Root cause confirmed against `package_skill.py` validate_sections (substring match on H2 text after stripping `N.`)
- [x] Decision recorded: fix files, not the checker
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Edits are structural-only (header split, REFERENCES H2, renumber); no substantive content rewritten or deleted
- [x] RULES retains ALWAYS / NEVER / ESCALATE in every edited packet
- [x] Intra-file section cross-references reconciled after renumber
- [x] Comment hygiene: no spec-folder paths / packet ids embedded in SKILL.md prose
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] `package_skill.py --check` PASS for all 7 normalized packets (independent re-verify) — 9/10 overall PASS (create-benchmark owned by 016)
- [x] `validate_document.py` 0 issues on each edited SKILL.md
- [x] `parent-skill-check.cjs` on sk-doc hub → OK, 0 warnings
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] All 7 in-scope packets normalized (create-benchmark deferred to 016 by design, tracked in tasks T009)
- [x] Each packet version bumped and a packet changelog entry added
- [x] REFERENCES satisfied per packet (promote H3 / rename / author / already-present), documented in tasks
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] No executable/tooling changes; documentation-only. No new capabilities or tool grants introduced.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] Packet changelogs written in each packet's existing changelog style
- [x] spec / plan / tasks / implementation-summary consistent with the shipped result
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] Edits scoped strictly to each packet's SKILL.md + changelog/
- [x] No advisor registry/router/description.json changes
- [x] No packet-local graph-metadata.json added
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Packets normalized | 7 | 7/7 |
| `package_skill.py --check` PASS | 10 | 9/10 (create-benchmark by 016) |
| `validate_document.py` 0 issues | 7 | 7/7 |
| `parent-skill-check.cjs` hub canon | 1 | OK (0 warnings) |

**Verification Date**: 2026-07-12
<!-- /ANCHOR:summary -->
