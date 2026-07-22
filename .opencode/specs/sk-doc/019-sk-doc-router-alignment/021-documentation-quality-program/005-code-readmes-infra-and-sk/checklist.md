---
title: "Verification Checklist: Code READMEs (Infra and SK Batch)"
description: "Verification evidence that all thirty-three code READMEs are valid, accurate against their folders, and HVR-clean."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
completion_pct: 100
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/005-code-readmes-infra-and-sk"
    last_updated_at: "2026-07-22T13:27:47Z"
    last_updated_by: "claude"
    recent_action: "Verified all thirty-three READMEs."
    next_safe_action: "Proceed to phase 006."
    blockers: []
    key_files: []
---

# Verification Checklist: Code READMEs (Infra and SK Batch)

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

- [x] CHK-001 [P1] The thirty-three folders enumerated from the repo-wide scan
  - **Evidence**: `phase-005-folders.txt` lists 8 sk-doc, 6 sk-code, 6 system-code-graph, 5 system-skill-advisor, 4 mcp-code-mode, 3 mcp-tooling and 1 cli-external-orchestration
- [x] CHK-002 [P1] The code-README template and lean exemplar confirmed
  - **Evidence**: the brief cites `readme-code-template.md` and `runtime/lib/council/README.md`, and `validate_document.py --type readme` was confirmed to accept an existing code README

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] Every folder carries a `README.md` with a numbered ALL-CAPS OVERVIEW
  - **Evidence**: the reconcile loop found no `MISSING` folder across the thirty-three
- [x] CHK-011 [P1] Every CONTENTS-table entry names a real direct file
  - **Evidence**: the scoped CONTENTS cross-check reported `0` mismatches (`contents-real-mismatch.txt` empty)
- [x] CHK-012 [P2] Test, fixtures and helper folders documented as such
  - **Evidence**: `system-skill-advisor/mcp-server/tests/__fixtures__`, `tests/utils` and `lib/test-helpers` READMEs state their test-only role and stay to OVERVIEW plus CONTENTS

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] All thirty-three READMEs clear the floor validator
  - **Evidence**: the reconcile loop reported `ALL VALID` running `validate_document.py --type readme` on each, independently of the author self-reports
- [x] CHK-021 [P1] Em-dash and semicolon sweep returns zero across all thirty-three
  - **Evidence**: the reconcile loop reported `HVR-dirty: 0`

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] `create-readme/scripts/audit_readmes.py` documented accurately
  - **Evidence**: `create-readme/scripts/README.md` describes it as the fleet-wide README template-alignment and freshness auditor that drives `validate_document.py`, ready for the phase 008 sweep
- [x] CHK-031 [P2] Cross-references to sibling and consumer files are accurate
  - **Evidence**: files cited outside a folder (for example `mk-mcp-route-guard.js`, `handlers/query.ts`) resolve to their real sibling or consumer paths, confirmed during the CONTENTS cross-check

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] No code changed, documentation only
  - **Evidence**: only new `README.md` files were added under the thirty-three folders; no source file was edited

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Platform-mirror hook folders name their target runtime
  - **Evidence**: each `runtime/hooks/claude` and `runtime/hooks/codex` README states whether it targets Claude Code or Codex CLI
- [x] CHK-051 [P2] Layered library folders carry a light architecture note
  - **Evidence**: `system-code-graph/runtime/lib/code-graph/README.md` (72 lines) adds an architecture section while the flat script folders stay lean

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] No stray files added outside the target folders
  - **Evidence**: only the thirty-three `README.md` files and this phase's spec docs changed; the brief and scan lists live in the scratchpad

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 0 | 0/0 |
| P1 Items | 9 | 9/9 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-07-22
**Verified By**: AI Assistant (Claude)

<!-- /ANCHOR:summary -->
