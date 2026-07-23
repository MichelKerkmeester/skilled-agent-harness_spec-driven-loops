---
title: "Feature Specification: Realign + Relocate the Styles Manual-Testing Playbook to create-manual-testing-playbook Canon"
description: "Rewrite the styles manual-testing playbook to the sk-doc create-manual-testing-playbook package standard and move it out of styles/docs/ to its canonical manual-testing-playbook/ location, updating inbound references. Documentation-only; no runtime, schema, or data change."
trigger_phrases:
  - "styles manual testing playbook realign"
  - "create-manual-testing-playbook conformance styles"
  - "relocate styles playbook out of docs"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/010-manual-testing-playbook-and-db-readme/001-playbook-realign-and-relocate"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Authored L2 spec for playbook realign"
    next_safe_action: "Plan then execute realign"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/docs/manual-testing-playbook.md"
      - ".opencode/skills/sk-design/styles/tests/README.md"
      - ".opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-009-001-playbook-realign-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Preserve existing 2-digit IDs (DB-01..08, CMD-01..03) or migrate to 3-digit {PREFIX}-{NNN}?"
      - "styles/docs/ also holds README.md; delete it with the move so docs/ empties, or keep docs/?"
    answered_questions:
      - "Canonical target path resolves to styles/manual-testing-playbook/manual-testing-playbook.md (sibling pattern confirmed)."
---
# Feature Specification: Realign + Relocate the Styles Manual-Testing Playbook to create-manual-testing-playbook Canon

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Spec Folder** | 001-playbook-realign-and-relocate |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The styles manual-testing playbook lives at `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md` (~49 lines, version `1.0.0.0`). It is a single lean file under a generic `docs/` folder and does not follow the sk-doc **create-manual-testing-playbook** package standard: it has no `manual-testing-playbook/` package directory, no category folders, no per-feature files, no per-feature scenario contracts, and it uses a `PASS/PARTIAL/FAIL/SKIP` verdict vocabulary that includes `PARTIAL`, which the standard does not allow.

### Purpose
Rewrite the playbook to the create-manual-testing-playbook package shape and move it to the standard's canonical location (`styles/manual-testing-playbook/`), preserving the real, executable scenarios already present, and update every inbound reference so no link breaks. This is a documentation-only change.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convert the single-file playbook into the canonical package shape: a root `manual-testing-playbook/manual-testing-playbook.md` plus kebab-case category folders holding one per-feature file per scenario.
- Move the package out of `styles/docs/` to the standard's canonical location `styles/manual-testing-playbook/`.
- Preserve the 11 existing scenarios (DB-01..08, CMD-01..03) as real per-feature files, each with the required 5-section structure and 9-field scenario contract.
- Reconcile the verdict vocabulary to the standard's `PASS` / `FAIL` / `SKIP` (drop `PARTIAL`).
- Update inbound references to the old `docs/manual-testing-playbook.md` path.
- Remove the now-empty `styles/docs/` folder only if it ends up empty after the move (see Open Questions on `docs/README.md`).

### Out of Scope
- The twelve create-readme READMEs (owned by sibling packet `008`).
- `styles/database/README.md` expansion (owned by sibling child `002-database-readme-speckit-alignment`).
- Any database schema, generation code, engine, retrieval, or test logic under `styles/lib/` and `styles/tests/`.
- The corpus/bundle data under `styles/library/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/styles/manual-testing-playbook/manual-testing-playbook.md` | Create | Canonical root playbook index + policy |
| `.opencode/skills/sk-design/styles/manual-testing-playbook/<category>/<feature>.md` | Create | One per-feature file per scenario (DB-01..08, CMD-01..03) |
| `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md` | Delete | Superseded by the relocated package |
| `.opencode/skills/sk-design/styles/tests/README.md` | Modify | Update `../docs/manual-testing-playbook.md` link to the new path |
| `.opencode/skills/sk-design/styles/docs/README.md` | Delete (conditional) | Sole content documents the playbook; remove to empty `docs/` (see Open Questions) |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Playbook conforms to create-manual-testing-playbook | Canonical package shape: root `manual-testing-playbook.md` + kebab-case category folders + per-feature files, each with the 5-section structure and 9-field scenario contract |
| REQ-002 | Playbook lives at the canonical location | Package rooted at `styles/manual-testing-playbook/`, not under `styles/docs/`; all inbound references updated |
| REQ-003 | Real scenarios preserved, no fabrication | The 11 existing scenarios (DB-01..08, CMD-01..03) carry over with real on-disk artifact anchors and executable steps; no invented procedures |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Documentation-only change | `git diff` touches only markdown (playbook move/rewrite + one reference update); no runtime, schema, generation, or data change |
| REQ-006 | Verdict vocabulary reconciled | Scenarios use `PASS` / `FAIL` / `SKIP` only; `PARTIAL` removed; `SKIP` carries a concrete blocker |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The playbook passes the shared `validate_document.py --type reference` check on the root file at its canonical path, and per-feature files pass the manual spot-check (frontmatter, numbered sections, prompt synchronization, feature-ID count).
- **SC-002**: No `styles/docs/manual-testing-playbook.md` remains; the `styles/tests/README.md` link resolves to the new location.
- **SC-003**: The 11 scenarios all resolve to real on-disk artifacts under `styles/lib/` and `commands/interface/`; verdicts are limited to `PASS` / `FAIL` / `SKIP`.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Moving the playbook breaks inbound links | Stale references, broken CI markdown-link guard | Grep for every reference before the move; update in the same change (confirmed: `styles/tests/README.md:16`) |
| Risk | `docs/` not empty after move | `docs/` cannot be cleanly removed | `docs/README.md` solely documents the playbook; resolve its disposition (delete vs keep) before removing `docs/` |
| Risk | Verdict-vocabulary rewrite changes scenario meaning | Silent loss of a `PARTIAL` semantic | Map each former `PARTIAL` case explicitly to `PASS` with caveats, `FAIL`, or `SKIP` with a concrete blocker |
| Dependency | create-manual-testing-playbook templates | Cannot scaffold canonical shape | `assets/manual-testing-playbook-template.md` + `assets/manual-testing-playbook-snippet-template.md` are present in the skill |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Integrity
- **NFR-I01**: All local markdown links inside the package and every inbound reference resolve after the move (link-guard clean).
- **NFR-I02**: Every feature ID maps to exactly one per-feature file; the root index count equals the per-feature file count.

### Fidelity
- **NFR-F01**: Every scenario names a concrete, on-disk artifact (`file:line` where a behavior is asserted); no fabricated paths or procedures.

### Non-Regression
- **NFR-R01**: No packet-local `graph-metadata.json` is added inside the playbook package; the sk-doc advisor identity stays at the hub root.


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Structural Boundaries
- **`docs/` retains `README.md`**: After moving the playbook, `styles/docs/` still contains `README.md`; the folder is NOT empty, so the "remove only if empty" rule does not trigger until `docs/README.md` is resolved.
- **Persistent path off by default**: Scenarios that require a built generation are `SKIP` with "persistent path not enabled" when no `<GENERATION>` is supplied — the package must preserve this SKIP semantics.

### Verdict Mapping
- **Former `PARTIAL` verdicts**: Each must be re-expressed as `PASS` (with a documented caveat), `FAIL`, or `SKIP` (with a concrete blocker); `PARTIAL` is not a legal verdict under the standard.

### Identity
- **Published feature IDs**: DB-01..08 and CMD-01..03 are already published identities; renumbering solely to change digit width is discouraged (see Open Questions).


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should the existing 2-digit IDs (`DB-01..08`, `CMD-01..03`) be preserved as-is, or migrated to the standard's `{PREFIX}-{NNN}` 3-digit convention (`DB-001`…)? The standard forbids renumbering *published* IDs just to remove gaps; the safe default is to preserve identity. **UNRESOLVED — defer to execution.**
- `styles/docs/` contains `README.md` in addition to the playbook, and that README's only content is describing the playbook. To satisfy "remove `docs/` only if empty," `docs/README.md` must also be removed (its purpose disappears with the move). Confirm: delete `docs/README.md` + the now-empty `docs/`, or keep `docs/` for future human docs? **UNRESOLVED — defer to execution.**
- Final category grouping for the 11 scenarios (e.g. `database-adapter`, `database-indexer-retrieval`, `database-operator`, `interface-commands`) — proposed in `plan.md`, to be confirmed at execution.


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: `../spec.md`
- **Sibling Child**: `../002-database-readme-speckit-alignment/spec.md`

<!-- /ANCHOR:related-docs -->
