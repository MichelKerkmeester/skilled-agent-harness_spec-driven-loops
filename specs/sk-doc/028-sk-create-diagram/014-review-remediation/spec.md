---
title: "Feature Specification: sk-create-diagram review remediation"
description: "Fix the 4 P1 + directly-bundled P2 findings from the 013 deep-review (registry drift, design-contract contradiction, stale cross-references)."
trigger_phrases:
  - "diagram review remediation"
  - "deep review findings fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/014-review-remediation"
    last_updated_at: "2026-08-12T20:16:58.000Z"
    last_updated_by: "claude"
    recent_action: "All 4 P1 findings fixed; validate_skill_package.py PASS"
    next_safe_action: "Re-run packet-wide validate.sh; report to operator"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "F009 (example corpus predates current skin) needs no new action — style-guide.md already documents this as a deferred v5.1 task, matching the review's own 'demote to illustrative-only' framing."
      - "F001's grid-vs-typography contradiction is resolved by exempting font sizes from the 4px rule (governed by style-guide.md's own type scale instead), not by forcing 34 shipped examples to conform — the 1,357 off-grid coordinates the review found are the typography table's own deliberate values (9px sublabel, 14px callout), not accidental drift."
      - "R3 (8 pure-P2 docs/safety polish items) is explicitly out of scope for this phase — deferred as a documented follow-up, not silently expanded into."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-create-diagram review remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 14 of 14 |
| **Predecessor** | `../013-deep-review-grok-deepseek/review/review-report.md` |
| **Successor** | None — clears the review's CONDITIONAL gate |
| **Handoff Criteria** | All 4 P1 findings resolved; `leaf-manifest.json` resolves 100%; `validate_skill_package.py --strict` passes; packet-wide `validate.sh --recursive --strict` clean |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: R1 (registry refresh) + R2 (contract reconciliation) from the 013 review's remediation workstreams. R3 (8 pure-P2 docs/safety items) explicitly deferred.

**Dependencies**: Phase 013's merged `review-report.md` — the source of every finding fixed here.

**Deliverables**: 4/4 P1 findings resolved, plus the 4 directly-bundled P2s in R1/R2, plus 3 same-class stale-citation instances the review's sample didn't catch, plus a self-caught word-limit regression.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 013 deep-review (5 iterations Grok 4.6 + 5 iterations deepseek-v4-flash, merged strongest-restriction) returned CONDITIONAL: 0 P0, 4 P1, 12 P2. Both lineages independently found the same headline defect — `leaf-manifest.json` still lists 75 of 87 paths from before phase 008's reorganization, invisible to every `validate.sh` run this session because that gate checks JSON shape, not path existence.

### Purpose

Clear the CONDITIONAL gate: fix every P1 finding and the P2s bundled into the same remediation workstreams (R1 registry refresh, R2 contract reconciliation), verified independently against real files, not the review's self-report.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **F005/F-T-001** (P1): Regenerate `leaf-manifest.json`'s `sk-create-diagram` leaves against the real shipped tree.
- **F-T-002** (P1): Align `command-metadata.json`'s `/create:diagram` description + argumentHint with the real `diagram.md` (html-svg + ascii-markdown).
- **F-T-003** (P2, bundled in R1): Add `export diagram` to `hub-router.json`'s `create-diagram-aliases`.
- **F006** (P2, bundled in R1): Fix the feature-catalog's alias count (17 → 27).
- **F007** (P2, bundled in R1): Drop the manual-testing-playbook's stale "feature-catalog not yet present" sentence.
- **F001** (P1): Resolve the 4px-grid vs. typography-table contradiction in `SKILL.md`.
- **F003** (P1): Fix every stale `SKILL.md §N` cross-reference across `create-diagram-auto.yaml`, `create-diagram-confirm.yaml`, `import-drawio.md`, `import-mermaid.md`, `notation-and-validator.md`, `README.md`, `type-sequence.md`, `type-high-level.md`.
- **F009** (P2, bundled in R2): Confirmed already correctly handled by existing `style-guide.md` documentation — no new action.

### Out of Scope

- **R3** (F002, F004, F008, F-C-001, F-C-002, F-C-003, F-S-001, F-M-001) — 8 pure-P2 docs/safety-polish items. Deferred as a documented follow-up.

### Aggregate File Scope

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/leaf-manifest.json` | Edit | 87 stale leaves regenerated → 96 real leaves, 0 missing |
| `.opencode/skills/sk-doc/command-metadata.json` | Edit | `/create:diagram` description + argumentHint aligned |
| `.opencode/skills/sk-doc/hub-router.json` | Edit | `export diagram` alias added |
| `.opencode/skills/sk-doc/sk-create-diagram/feature-catalog/feature-catalog.md`, `feature-catalog/command-and-hub-integration/hub-registration.md` | Edit | Alias count corrected 17→27 |
| `.opencode/skills/sk-doc/sk-create-diagram/manual-testing-playbook/manual-testing-playbook.md` | Edit | Stale not-present sentence dropped |
| `.opencode/skills/sk-doc/sk-create-diagram/SKILL.md` | Edit | Grid rule exempts font sizes; word count re-trimmed under the hard 5000 limit |
| `.opencode/commands/create/assets/create-diagram-auto.yaml`, `create-diagram-confirm.yaml` | Edit | 10 stale §7/§8/§9/§0 citations corrected to §3/§4/§6 |
| `.opencode/skills/sk-doc/sk-create-diagram/references/import-export/import-drawio.md`, `import-mermaid.md`, `references/ascii-format/notation-and-validator.md` | Edit | Stale citations corrected |
| `.opencode/skills/sk-doc/sk-create-diagram/README.md` | Edit | Stale citation + stale flowchart-boundary claim fixed |
| `.opencode/skills/sk-doc/sk-create-diagram/references/types/type-sequence.md`, `type-high-level.md` | Edit | Stale citations corrected |
| `014-review-remediation/` | Create | This phase's spec-folder history |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `leaf-manifest.json`'s `sk-create-diagram` entry resolves 100%. | 0/96 missing, independently confirmed. |
| REQ-002 | `validate_skill_package.py --strict` passes. | Exit 0. |
| REQ-003 | No stale `SKILL.md §N` citation remains anywhere in the packet or its command surface. | Repo-wide `grep` for `§[0789]`/`§1[0-9]` under the packet + `.opencode/commands/create/` returns empty. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The grid/typography contradiction is resolved at the documented rule, not by forcing the shipped example corpus to conform. | `SKILL.md`'s grid rule exempts font sizes and cites `style-guide.md` §2 as the type-scale authority. |
| REQ-005 | Every JSON file touched remains valid and every claimed fix is independently re-verified, not trusted from a self-check. | `json.load` succeeds on all 3 touched hub files; leaf-manifest re-walked against the real filesystem. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 4/4 P1 findings resolved, independently verified.
- **SC-002**: `validate_skill_package.py --strict` exit 0.
- **SC-003**: Packet-wide `validate.sh --recursive --strict` clean (parent's one pre-existing, already-documented warning aside).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fixing F001 by editing `SKILL.md` prose could push the file over its hard 5000-word limit. | Medium (realized) | Caught by re-running `validate_skill_package.py` immediately after the edit; trimmed the added prose twice until it passed clean. |
| Risk | The review's sampled findings (F003) might not be the only instances of the same defect class. | Medium (realized) | Ran a repo-wide sweep beyond the review's cited lines; found and fixed 3 more instances (confirm-mode YAML ×4, README.md, 2 type references) it didn't catch. |
| Dependency | Phase 013's `review-report.md` | High | Every finding fix traces to a specific, cited row in that report's Active Finding Registry. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — F001 and F009 (the two findings needing judgment rather than mechanical fixes) are both resolved above with evidence-based reasoning, not deferred to the operator.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Packet root: `../spec.md`
- Source review: `../013-deep-review-grok-deepseek/review/review-report.md`
