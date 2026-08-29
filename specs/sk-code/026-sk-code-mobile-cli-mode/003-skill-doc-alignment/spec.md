---
title: "Phase 3 - sk-code-mobile-cli skill doc alignment (plan only)"
description: "Plan-only Level-2 packet to bring seven straggler docs in the sk-code-mobile-cli skill up to the sk-create-skill v4 templates, delete the obsolete design-reference folder and repair its live danglers, and reconcile the skill README and manual-testing playbook to post-migration reality. Docs-only alignment: no app-mobile source or runtime behavior changes. The skill lives in the Public monorepo and its edits land later via an isolated-worktree cross-repo flow, so status is planned / not started."
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/026-sk-code-mobile-cli-mode/003-skill-doc-alignment"
    last_updated_at: "2026-08-27T12:00:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented A-D in isolated Public worktree 037; opened PR #38. Gates green: scan-skill-references broken:0, negative-controls absent, ci-skill-root-metadata passed, validate_document.py rc=0. dqi-baseline refreshed to measured current-state (48 docs)."
    next_safe_action: "Merge PR #38 to Public main, then reconcile packet to complete (implementation-summary.md, checklist)."
    blockers: []
    completion_pct: 90
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-code-mobile-cli skill doc alignment

> **Phase links**: Parent [`../spec.md`](../spec.md), siblings `001-mode-design-plan` and `002-scripts-ownership`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Parent** | `sk-code/026-sk-code-mobile-cli-mode` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned (not started) |
| **Created** | 2026-08-27 |
| **Kind** | Docs-only alignment (no app source or runtime change) |
| **Completion** | 0% |
| **Skill under change** | `.opencode/skills/sk-code/sk-code-mobile-cli` in the Public monorepo (abbrev `SKILL_DIR`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Seven docs in the `sk-code-mobile-cli` skill lag the `sk-create-skill` v4 asset, reference, and readme
templates. The four asset checklists lack the `## 1. OVERVIEW` block and a final RELATED RESOURCES section,
carry over-long multi-subsection intros, miss the `Title - Subtitle` H1 form, and close on a bespoke
unnumbered `## THE GATE`. Three reference docs lack OVERVIEW and REFERENCES sections, and one of them uses
unnumbered sentence-case H2s. An obsolete `references/design-reference/` folder still exists and leaves two
live dangling links in `SKILL.md`. The `README.md` and the manual-testing playbook still describe the
pre-migration Vite/React `apps/pi-remote-web` topology that the SvelteKit migration replaced.

### Purpose

Every straggler doc conforms to its `sk-create-skill` v4 template, the obsolete folder and its live danglers
are gone with link integrity proven, and the README and playbook describe current reality without
reintroducing any drift-guard negative-control string.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Workstream A: template alignment of four asset checklists under `SKILL_DIR/assets/`.
- Workstream B: template alignment of three reference docs under `SKILL_DIR/references/`.
- Workstream C: deletion of `SKILL_DIR/references/design-reference/` and repair of its two live `SKILL.md` danglers.
- Workstream D: rewrite of `SKILL_DIR/README.md` and one line of the manual-testing playbook to post-migration reality, and README template conformance.

### Out of Scope

- Any change to `app-mobile/` source, `app-relay/` source, or runtime behavior - this packet ships no code and frames acceptance around template conformance and link integrity, not runtime tests.
- The two historical changelog mentions of `design-reference/` (`changelog/v0.1.1.0.md:19`, `changelog/v0.1.0.0.md:31`) - they are historical record, not live danglers, and stay untouched.
- The drift-guard negative controls in `references/skill-reference-integrity.md` - they intentionally keep `apps/pi-remote-web`, `style.css`, and `App.tsx` as counter-examples that must not resolve, so no in-scope edit may touch or satisfy them.
- Executing the edits in this repo. The skill lives in the Public monorepo and lands later via an isolated-worktree cross-repo flow; this packet only plans that work.

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `SKILL_DIR/assets/runes-effect-audit-checklist.md` | Modify | Add OVERVIEW, trim intro, add H1 subtitle, number the GATE, add RELATED RESOURCES |
| `SKILL_DIR/assets/story-coverage-checklist.md` | Modify | Same asset-template alignment |
| `SKILL_DIR/assets/a11y-parity-checklist.md` | Modify | Same, plus ALL-CAPS the two lowercase H2 parentheticals |
| `SKILL_DIR/assets/bem-rename-checklist.md` | Modify | Same asset-template alignment (H2s already numbered) |
| `SKILL_DIR/references/standards/code-standards.md` | Modify | Add OVERVIEW, renumber, add REFERENCES AND RELATED RESOURCES |
| `SKILL_DIR/references/quality/dqi-baseline.md` | Modify | Same, plus resolve the migration-era snapshot decision |
| `SKILL_DIR/references/quality/pi-remote-full-access-runtime-baseline.md` | Modify | Number and ALL-CAPS the H2s, add OVERVIEW, plain intro, add REFERENCES |
| `SKILL_DIR/references/design-reference/` | Delete | Remove the mobile-chat-apps teardown, current-UI map, competitor research, and screens (~9 files) |
| `SKILL_DIR/SKILL.md` | Modify | Remove the design-reference bullet (line 80), change folder count six to five (line 74) |
| `SKILL_DIR/README.md` | Modify | Rewrite to post-migration reality and README-template conformance |
| `SKILL_DIR/manual-testing-playbook/manual-testing-playbook.md` | Modify | Fix the one `apps/pi-remote-web/` path (line 23) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | The four asset checklists conform to `sk-create-skill/assets/skill/skill-asset-template.md` (exemplar: `SKILL_DIR/assets/token-retint-checklist.md`) | Each of `runes-effect-audit-checklist.md`, `story-coverage-checklist.md`, `a11y-parity-checklist.md`, `bem-rename-checklist.md` has a `## 1. OVERVIEW` with `### Purpose` and `### Usage`, a 1-2 sentence intro with no subsections, an H1 in `Title - Subtitle` form, numbered ALL-CAPS H2s with the GATE folded into that numbered pattern and its content preserved, and a final `## N. RELATED RESOURCES` |
| REQ-002 | The three reference docs conform to `sk-create-skill/assets/skill/skill-reference-template.md` | `code-standards.md` gains an OVERVIEW (Purpose, When-to-Use, Core-Principle, Key-Sources), renumbered sections, and a final `## N. REFERENCES AND RELATED RESOURCES`; `dqi-baseline.md` gains the same OVERVIEW and REFERENCES; `pi-remote-full-access-runtime-baseline.md` has numbered ALL-CAPS H2s, a `## 1. OVERVIEW`, a 1-2 sentence plain intro replacing its blockquote, and a REFERENCES section |
| REQ-003 | `design-reference/` is deleted and its two live `SKILL.md` danglers are repaired in the same change | `SKILL_DIR/references/design-reference/` (mobile-chat-apps teardown plus screens, ~9 files) no longer exists; `SKILL.md` line 80 design-reference bullet is removed and line 74 folder count reads "five"; the two historical changelog mentions are unchanged |
| REQ-004 | `README.md` and the manual-testing playbook reflect post-migration reality, and `README.md` conforms to `sk-create-skill/assets/skill/skill-readme-template.md` | README paths and stack read `app-mobile/`, `app-relay/`, `packages/pi-rpc-protocol/`, SvelteKit, `app-mobile/src/app.css`, and the `feature-catalog/design-system/` and `app-mobile/catalog.html` targets; README carries a one-line blockquote pitch after the H1 and a 4-row AT A GLANCE; `manual-testing-playbook.md` line 23 no longer cites `apps/pi-remote-web/` |
| REQ-005 | The rewritten README and playbook contain no pre-migration path or stack string and none of the three drift-guard negative controls | A literal search of `README.md` and `manual-testing-playbook.md` returns zero matches for `apps/pi-remote-web`, `apps/pi-remote-relay`, `style.css`, `App.tsx`, `catalog.html` under an `apps/` path, and Vite/React framing |
| REQ-006 | Link integrity holds after the deletion and edits | `scan-skill-references.mjs` run against `SKILL.md` reports `broken : 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-007 | The `dqi-baseline.md` migration-era snapshot question is decided by the operator and the choice is applied | An explicit decision (refresh the stale scores to post-migration numbers, or keep the disclaimer with a dated note) is recorded in `tasks.md` and reflected in `dqi-baseline.md`; the stale pre-migration `docs/...` paths in that file are handled per the decision |
| REQ-008 | Each edited doc passes the skill's own `validate_document.py` when that validator is present | `validate_document.py` exits 0 for each of the seven edited docs and the README, or the validator's absence in `SKILL_DIR` is recorded as the reason the check is skipped |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the seven target docs carries `## 1. OVERVIEW`, a final RELATED-RESOURCES or REFERENCES section, and ALL-CAPS numbered H2s (maps to the proof plan item 1).
- **SC-002**: `design-reference/` is gone and `scan-skill-references.mjs` reports `broken : 0` (proof plan item 2).
- **SC-003**: The README and playbook contain none of the pre-migration path or stack strings and none of the three negative-control strings (proof plan item 3).
- **SC-004**: The README matches the readme template, with a blockquote pitch after the H1 and a 4-row AT A GLANCE (proof plan item 4).
- **SC-005**: Each edited doc passes the skill's own `validate_document.py` when that validator is present (proof plan item 5).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | The README rewrite reintroduces a drift-guard negative control (`apps/pi-remote-web`, `style.css`, `App.tsx`) | The skill's integrity guard flags a false live reference, or the counter-example silently starts resolving | Rewrite in current-reality vocabulary only; grep the two files for each negative-control string before claiming done (REQ-005) |
| Risk | Deleting `design-reference/` leaves a missed live dangler | `scan-skill-references.mjs` reports a broken link and the skill doc is inconsistent | Fix both `SKILL.md` danglers in the same change and re-run the scan to `broken : 0` (REQ-006) |
| Risk | Over-editing a file that already partially conforms (for example `bem-rename-checklist.md` already numbers its GATE) | Needless churn or a wrongly renumbered correct section | Apply only the missing template pieces per file; do not renumber a section that is already correct |
| Dependency | The `sk-create-skill` v4 templates and the exemplar `token-retint-checklist.md` | Alignment target is undefined without them | Read the asset, reference, and readme templates and the exemplar before editing |
| Dependency | The isolated-worktree cross-repo landing flow into the Public monorepo | The edits cannot land from this repo | Execute A-D in an isolated Public worktree at approval time; this packet plans only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Scope containment. Only the ten named files (plus the deleted folder) change; no other file in `SKILL_DIR` or either app tree is touched.

### Security

- **NFR-S01**: No new secrets, credentials, or external network references are introduced by any edit, and the only deletion is `references/design-reference/`.

### Reliability

- **NFR-R01**: After the change, `scan-skill-references.mjs` reports `broken : 0`, and the drift-guard negative controls in `skill-reference-integrity.md` remain present and unresolved.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Partially conformant files: `bem-rename-checklist.md` already carries numbered ALL-CAPS H2s and a numbered `## 7. THE GATE`. Apply only the missing pieces (OVERVIEW, H1 subtitle, RELATED RESOURCES); do not renumber the already-correct gate.
- `dqi-baseline.md` self-labels a migration-era snapshot and cites pre-migration `docs/...` paths. Do not blindly rewrite those paths; they are the subject of the REQ-007 operator decision.

### Error Scenarios

- Negative-control collision: describing the old state naturally invites `apps/pi-remote-web`, `style.css`, and `App.tsx`. The rewrite must express current reality without those literals, even where they are the obvious words.
- Historical vs live references: the two changelog mentions of `design-reference/` are historical and must remain; only the two live `SKILL.md` danglers are repaired.

### State Transitions

- Ordering drift: A and B are pure structure moves and are safe first; C is a deletion coupled to a `SKILL.md` edit; D is the largest prose rewrite and runs last so it reflects A through C. There are no hard dependencies, but the order is kept.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 12/25 | Ten files across a cross-repo skill: seven doc conformance edits, one folder deletion (~9 files), one README rewrite, one playbook line |
| Risk | 10/25 | Deletion plus coupled `SKILL.md` danglers and drift-guard negative-control regression risk; no auth, API, or runtime surface |
| Research | 4/20 | Inputs fully specified; templates and exemplar identified |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-1** (blocks REQ-007): For `dqi-baseline.md`, does the operator want the stale migration-era scores refreshed to post-migration numbers, or kept behind a dated disclaimer? The pre-migration `docs/...` paths in that file are handled per this answer.
- **OQ-2** (affects REQ-008): Is `validate_document.py` present in `SKILL_DIR`, and should a passing run be a hard completion gate for each edited doc, or a best-effort check when present?
<!-- /ANCHOR:questions -->
