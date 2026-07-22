---
title: "Verification Checklist: JSON Cleanup and Advisor-Metadata Conventions"
description: "Verification evidence for the residue removal and the placement-rule hardening."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
completion_pct: 100
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/001-json-cleanup-and-conventions"
    last_updated_at: "2026-07-22T12:29:01Z"
    last_updated_by: "claude"
    recent_action: "All items verified with evidence."
    next_safe_action: "Proceed to phase 002."
    blockers: []
    key_files: []
---

# Verification Checklist: JSON Cleanup and Advisor-Metadata Conventions

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

- [x] CHK-001 [P1] Residue confirmed dead before removal
  - **Evidence**: the JSON audit grep-proved `sk-prompt/prompt-models/description.json` has no runtime consumer (advisor extraction reads `SKILL.md` + `graph-metadata.json` only)
- [x] CHK-002 [P1] Pattern to mirror identified
  - **Evidence**: rule 2a `findGraphMetadata` in `parent-skill-check.cjs` is the recursive sibling rule 2b copies

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] Recursive rule 2b added to the checker
  - **Evidence**: `findDescriptionJson` + rule 2b in `.opencode/commands/doctor/scripts/parent-skill-check.cjs`, structurally identical to rule 2a
- [x] CHK-011 [P1] Modified checker parses
  - **Evidence**: `node --check .opencode/commands/doctor/scripts/parent-skill-check.cjs` exits 0

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] Rule 2b FAILs before removal
  - **Evidence**: `parent-skill-check.cjs .opencode/skills/sk-prompt` printed `FAIL: 2b: nested description.json found ... prompt-models/description.json`
- [x] CHK-021 [P1] Rule 2b PASSes after removal
  - **Evidence**: same command printed `PASS: 2b: no nested description.json inside any packet or shared/`
- [x] CHK-022 [P1] No nested `description.json` remains in a checked hub
  - **Evidence**: `find .opencode/skills -mindepth 3 -name description.json` returns only `system-spec-kit` spec-folder test fixtures (not a checked hub)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-016 [P1] All four changes landed together (harden then remove)
  - **Evidence**: doctrine sentence, checker rule 2b, AGENTS.md convention, and the `git rm` are in this phase's commit
- [x] CHK-017 [P2] Pre-existing issues surfaced, not silently absorbed
  - **Evidence**: the `10a-manifest-source` path bug and the fixture false-positive class are recorded in `../context-index.md`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No runtime routing, serving, or advisor behavior changed
  - **Evidence**: the changes are a Markdown doctrine edit, an `AGENTS.md` edit, a diagnostic-only rule in `parent-skill-check.cjs`, and a delete of a file with no consumer; nothing under `.opencode/bin/lib/compiled-routing/` or any resolver was touched

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Doctrine states the placement rule for `description.json`
  - **Evidence**: `parent-skills-nested-packets.md` now names both `graph-metadata.json` and `description.json` as hub-only
- [x] CHK-041 [P1] AGENTS.md carries the two-schema disambiguation + placement rule
  - **Evidence**: `AGENTS.md` §8 adds the "Advisor metadata placement" note with the `parent-skill-check.cjs` audit pointer

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files
  - **Evidence**: only the four in-scope files changed plus this phase's spec docs; no `scratch/` created

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 0 | 0/0 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-22
**Verified By**: AI Assistant (Claude)

<!-- /ANCHOR:summary -->
