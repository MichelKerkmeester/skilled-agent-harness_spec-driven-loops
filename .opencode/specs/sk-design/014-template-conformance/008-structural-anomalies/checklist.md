---
title: "Verification Checklist: sk-design structural anomalies"
description: "Verification checklist for the four independent structural items: stub removal, missing benchmark index, .mjs relocation record, and two legitimate-absence records."
trigger_phrases:
  - "sk-design structural anomalies checklist"
  - "design-mcp-open-design loose executables checklist"
  - "compiled-routing missing index checklist"
  - "vestigial node_modules stub checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/008-structural-anomalies"
    last_updated_at: "2026-07-27T14:53:08.592Z"
    last_updated_by: "spec-author"
    recent_action: "Authored verification checklist, no item checked yet"
    next_safe_action: "Verify CHK-001 once the stub is confirmed empty"
    blockers:
      - "Loose .mjs executables decision requires operator input before any move"
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/node_modules/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: sk-design structural anomalies
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

- [ ] CHK-001 [P0] `design-md-generator/node_modules/` contents confirmed to be only `.vite/vitest/<empty-sha>/results.json`
  - **Evidence (planned):** `find .opencode/skills/sk-design/design-md-generator/node_modules -type f`
- [ ] CHK-002 [P1] `benchmark/baseline/README.md` (sibling format model) read before authoring the new index
  - **Evidence (planned):** `.opencode/skills/sk-design/benchmark/reports/baseline/README.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [stub removal]

- [ ] CHK-010 [P0] `design-md-generator/node_modules/` no longer exists
  - **Evidence (planned):** `find .opencode/skills/sk-design/design-md-generator/node_modules` (expect "No such file or directory")
- [ ] CHK-011 [P0] `design-md-generator/backend/node_modules/` (the real install) is unaffected
  - **Evidence (planned):** `ls .opencode/skills/sk-design/design-md-generator/backend/node_modules | head`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [missing benchmark index]

- [ ] CHK-020 [P1] `benchmark/compiled-routing/README.md` exists
  - **Evidence (planned):** `ls .opencode/skills/sk-design/benchmark/reports/compiled-routing/README.md`
- [ ] CHK-021 [P1] The new README indexes the current run subdirectories and follows the sibling `README.md` shape
  - **Evidence (planned):** side-by-side read of `benchmark/compiled-routing/README.md` vs. `benchmark/baseline/README.md`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [record-only items]

- [ ] CHK-030 [P1] The `.mjs` relocation tradeoff is recorded in `spec.md` Open Questions, naming `return-reconciliation.mjs:9`, the transport tests, and `design-command-surface-check.mjs`, with NO move executed
  - **Evidence (planned):** `.opencode/specs/sk-design/014-template-conformance/008-structural-anomalies/spec.md` (Open Questions section) + `git status` shows no change under `design-mcp-open-design/*.mjs`
- [ ] CHK-031 [P1] `design-mcp-open-design/procedures/` absence and `design-motion/scripts/` absence are both recorded as legitimate, with no corresponding "add the folder" task anywhere in this packet
  - **Evidence (planned):** `spec.md` scope/problem sections + `tasks.md` (confirm no such task exists)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [blast-radius containment]

- [ ] CHK-040 [P0] No file under `design-mcp-open-design/` was moved or edited by this packet
  - **Evidence (planned):** `git status .opencode/skills/sk-design/design-mcp-open-design/` (expect clean)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` describe the same four-item scope consistently
  - **Evidence (planned):** cross-read of all five packet files
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [ ] CHK-060 [P1] `validate.sh .opencode/specs/sk-design/014-template-conformance/008-structural-anomalies --strict` passes
  - **Evidence (planned):** command output attached to `implementation-summary.md`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 4 | 0/4 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: TBD (packet authored 2026-07-27; no work started, nothing verified yet)
<!-- /ANCHOR:summary -->
