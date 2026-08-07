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
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "structural-anomalies-executor"
    recent_action: "Relocated four Open Design transport modules into transport/ and updated all references"
    next_safe_action: "Remove the vestigial design-md-generator/node_modules stub (item 1, still Planned)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/node_modules/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "structural-anomalies-session"
      parent_session_id: null
    completion_pct: 50
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

- [x] CHK-030 [P1] The `.mjs` placement question is ruled on repository evidence, executed, and the reasoning recorded
  - **Evidence:** `spec.md` §7 records the ruling (relocate to `transport/`, not `scripts/`), the governing standard, the sibling precedent, and the complete consumer map. The four modules now live at `design-mcp-open-design/transport/`.
- [x] CHK-031 [P1] `design-mcp-open-design/procedures/` absence and `design-motion/scripts/` absence are both recorded as legitimate, with no corresponding "add the folder" task anywhere in this packet
  - **Evidence:** `spec.md` §3 In/Out of Scope records both absences; `tasks.md` contains no task to add either folder.
- [x] CHK-032 [P0] The relocation changed no module semantics
  - **Evidence:** `diff` of each of the four files against `git show HEAD:<old-path>` shows only import-path lines — 2 lines in `grounding-receipt.mjs`, 1 in `offline-gate.mjs`, 0 in `live-transport.mjs`, 0 in `return-reconciliation.mjs`. `PAIRED_MODES` and `ALLOWED_INFLUENCE_AXES` (incl. the `'motion'` design axis) byte-identical.
- [x] CHK-033 [P0] The transport regression suite is unchanged from baseline
  - **Evidence:** `node --test .../tests/transport-grounding.test.mjs` → 37 pass / 0 fail, both before and after the move.
- [x] CHK-034 [P1] No dangling reference to the old root paths survives on a live surface
  - **Evidence:** repo-wide `rg` for the four old paths, excluding historical `.opencode/specs/`, returns zero hits.
- [x] CHK-035 [P1] The prior spec's claimed consumer `shared/scripts/design-command-surface-check.mjs` was verified rather than trusted
  - **Evidence:** `rg "open-design|mjs"` against that file returns nothing; it imports only `node:fs/promises` and `node:url`. The false claim is corrected in `spec.md` §7.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [blast-radius containment]

- [x] CHK-040 [P0] Every file changed under `design-mcp-open-design/` is one this packet owns, and no concurrent session's work was reverted
  - **Evidence:** `git status .opencode/skills/sk-design/` was clean immediately before the move and, after it, lists exactly the intended set — 4 moved `.mjs`, `fixtures/{README.md,offline-fixtures.mjs}`, `tests/{README.md,transport-grounding.test.mjs}`, the new `transport/`, and the hub `per-mode-consumers.md`. Nothing else was touched.
- [x] CHK-041 [P0] Hub-level structural gates are unchanged from baseline
  - **Evidence:** `parent-skill-check.cjs .opencode/skills/sk-design` → OK, 0 warnings (before and after); check `10b-byte-drift` PASS confirms `leaf-manifest.json` needed no regeneration, since it tracks only markdown leaves. `package_skill.py --check` → PASS with the same 2 pre-existing kebab-case warnings (`INSTALL-GUIDE.md`, `scripts/_common.sh`), neither introduced here.
- [x] CHK-042 [P1] The new `transport/README.md` passes structural validation
  - **Evidence:** `validate_document.py .../transport/README.md --type readme` → 0 issues.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` describe the same four-item scope consistently, with item 3 marked resolved and items 1-2 still Planned
  - **Evidence:** cross-read of all five packet files; all carry `completion_pct: 50` and the same `recent_action`/`next_safe_action`.
- [x] CHK-051 [P1] The relocated code directory carries an index README, as every other code directory in this hub does
  - **Evidence:** `transport/README.md` created, matching the `fixtures/README.md` and `tests/README.md` shape (frontmatter + numbered ALL-CAPS H2s).
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
