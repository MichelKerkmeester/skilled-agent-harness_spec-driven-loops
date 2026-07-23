---
title: "Verification Checklist: Deferred Code and Checker Fixes"
description: "Verification evidence that 10a passes on all hubs, skill/command headers are enforced, and the not-fixed decisions are recorded with rationale."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
completion_pct: 100
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/010-deferred-code-and-checker-fixes"
    last_updated_at: "2026-07-22T16:53:38Z"
    last_updated_by: "claude"
    recent_action: "Verified the deferred fixes."
    next_safe_action: "Operator ff-merge to v4."
    blockers: []
    key_files: []
---

# Verification Checklist: Deferred Code and Checker Fixes

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

- [x] CHK-001 [P1] The 10a failure reproduced and root-caused
  - **Evidence**: `parent-skill-check.cjs` flagged the generator missing under `create-skill/scripts/` on every non-sk-doc hub, a mode only sk-doc owns
- [x] CHK-002 [P1] The skill/command offenders and the benchmark/HVR items scanned on disk
  - **Evidence**: the refined `is_uppercase_section` found 2 SKILL.md offenders and 0 command; `RIG_ROOT`, `dispatch-swe16` and the em-dash counts were checked directly

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] The 10a generator resolves from the canonical location
  - **Evidence**: `parent-skill-check.cjs` now joins `path.dirname(target)` with `sk-doc/create-skill/scripts/`; `node --check` passes
- [x] CHK-011 [P1] The sk-code registry gap is closed
  - **Evidence**: `sk-code/mode-registry.json` declares `resourceContractVersion: 1`, matching its leaf-manifest
- [x] CHK-012 [P1] The mcp-tooling manifest is regenerated to match the tree
  - **Evidence**: `mcp-tooling/leaf-manifest.json` now references `install-guide.md`, and 10b matches a fresh regeneration byte for byte

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] All seven hubs pass 10a/10b/10d
  - **Evidence**: `parent-skill-check.cjs` reports PASS on 10a, 10b and 10d for sk-doc, sk-code, sk-design, sk-prompt, system-deep-loop, cli-external-orchestration and mcp-tooling
- [x] CHK-021 [P1] All SKILL.md and command files pass the flip
  - **Evidence**: `validate_document.py` reported 0 h2-uppercase failures across the 49 SKILL.md and 51 command files

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] The skill/command header transform is header-only
  - **Evidence**: `git diff` on the 2 changed SKILL.md shows 0 non-`## ` changed lines, and both stay VALID
- [x] CHK-031 [P1] The not-fixed decisions are recorded with rationale
  - **Evidence**: `context-index.md` records the 001 `RIG_ROOT` as an archived run, `dispatch-swe16` as comment-only, and the HVR sweep as a 4,601-file standalone project

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] Only diagnostic, config, data and header changes
  - **Evidence**: the commits touched `parent-skill-check.cjs`, two data files, `template-rules.json` and SKILL.md headers, no serving path

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] The pre-existing sk-design 6a finding is noted as out of scope
  - **Evidence**: `context-index.md` records the `styles/` unregistered-child finding as pre-existing and unrelated to the 10a fix

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] No stray files added
  - **Evidence**: only the checker, two data files, `template-rules.json`, two SKILL.md and this phase's spec docs changed

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 0 | 0/0 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-22
**Verified By**: AI Assistant (Claude)

<!-- /ANCHOR:summary -->
