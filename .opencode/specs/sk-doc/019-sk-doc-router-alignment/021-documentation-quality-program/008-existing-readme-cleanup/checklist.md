---
title: "Verification Checklist: Existing-README Cleanup"
description: "Verification evidence that the genuine READMEs were surgically repaired, the audit counts dropped, and false positives were left alone."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
completion_pct: 100
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/008-existing-readme-cleanup"
    last_updated_at: "2026-07-22T15:16:58Z"
    last_updated_by: "claude"
    recent_action: "Verified the cleanup via re-audit and independent validation."
    next_safe_action: "Proceed to phase 009."
    blockers: []
    key_files: []
---

# Verification Checklist: Existing-README Cleanup

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

- [x] CHK-001 [P1] The audit's false-positive classes were identified before dispatch
  - **Evidence**: the triage classified gitignored `dist`, NodeNext `.js` specifiers, self-refs and placeholders, cutting 171 raw broken refs to a verified real-work list
- [x] CHK-002 [P1] Spec-folder, archive and fixture files excluded from the target set
  - **Evidence**: `cleanup-genuine.json` holds 100 genuine targets, 47 excluded (`_specs`, `z-future`, `backup`, `fixtures`, `examples`, `corpus`)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] Every repaired reference resolves to a real current path on disk
  - **Evidence**: each agent located the moved target with `rg`/`find` before linking; the re-audit dropped broken refs from 177 to 119
- [x] CHK-011 [P1] Genuinely-dead references were reworded, not fabricated
  - **Evidence**: the `z-future` benchmark folder and `mcp-coco-index` sibling were reworded honestly after confirming no current equivalent exists
- [x] CHK-012 [P1] False positives were left untouched
  - **Evidence**: agents reported leaving gitignored `dist`, NodeNext `.js` specifiers and self-ref diagram labels unchanged after on-disk verification

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] Audit template-invalid and broken-ref counts dropped
  - **Evidence**: `audit_readmes.py` moved from 70 invalid / 177 broken to 43 invalid / 119 broken, with ~28 OVERVIEW findings cleared
- [x] CHK-021 [P1] Every touched README is floor-VALID
  - **Evidence**: the independent pass over the genuine targets found the only two apparent INVALIDs to be a case-fold phantom (`commands/create`) and a validator-exempt template dir

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] The operator-flagged `create-command/references` stale path was fixed
  - **Evidence**: `create-command/references/README.md` now links the flat `../assets/command-template.md` layout
- [x] CHK-031 [P1] The operator-approved `__tests__` duplicate was deleted
  - **Evidence**: `git rm` removed `design-mcp-open-design/__tests__/transport-grounding.test.mjs`, restorable from the identical `tests/` sibling

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] No code changed beyond the approved duplicate deletion
  - **Evidence**: the commit staged 64 `README.md` edits and 1 deletion, no source files

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Em dashes in touched files are pre-existing, not agent-added
  - **Evidence**: `git diff` on a sampled file showed 0 em dashes in added lines and 3 in the pre-cleanup version
- [x] CHK-051 [P2] Out-of-scope stale refs were flagged for follow-up
  - **Evidence**: agents flagged `core/README.md` and two `stress-test` RELATED links they did not own, recorded for a later pass

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] No stray files added outside the touched READMEs
  - **Evidence**: only the 64 `README.md` edits, the one deletion and this phase's spec docs changed; batch lists live in the scratchpad

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
