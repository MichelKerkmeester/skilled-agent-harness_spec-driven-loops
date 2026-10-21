---
title: "Feature Specification: Phase 47: diagram-corpus-ci"
description: "The Diagram Corpus workflow has failed since run 39165172090 at be234e6f94 on 2026-10-18, and every pull request run since 2026-10-14 too. The diagram script README got its first version, 1.0.0.0, from a bulk pass, and the packet's metadata family requires every in-scope doc to share SKILL.md's 1.2 era, so one frontmatter value keeps the corpus red."
trigger_phrases:
  - "diagram corpus ci"
  - "phase 47 diagram corpus ci"
  - "diagram corpus version era"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 47: diagram-corpus-ci

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/191-diagram-corpus-ci` |
| **Parent Spec** | ../spec.md |
| **Phase** | 47 of 47 |
| **Predecessor** | 046-final-two-version-proof |
| **Successor** | None |
| **Handoff Criteria** | Diagram Corpus passes on CI at the pushed commit, the README carries a 1.2 era version, and the metadata family still rejects an out-of-era doc |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 47** of the OpenCode v1 and v2 dual compatibility packet. It repairs the last red workflow, and it lives here rather than in the sk-design packet because the open-work goal needs every workflow green.

**Scope Boundary**: the diagram script README's frontmatter version and the metadata family's error message. sk-doc's frontmatter-version script and the rest of the sk-design-diagram package are out of bounds.

**Dependencies**:
- Commit `329052db9f` of 2026-10-12, the bulk pass that gave `scripts/README.md` its first version, `1.0.0.0`.
- Commit `be234e6f94`, which bumped it to `1.0.1.0` and was the first push to touch the workflow's paths.
- The metadata family at `scripts/families/metadata.cjs`, which reads `SKILL.md` version `1.2.2.0` and requires every in-scope doc to share its `1.2` era.

**Deliverables**:
- `scripts/README.md` at `1.2.0.1`, keeping the one edition count it had.
- A metadata error message that says to set the major.minor by hand and no longer claims the apply pass re-derives it.
- A before and after corpus log, the mutation suite at 21 of 21, and both applicator steps reproducing `assets/diagrams` byte for byte.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.github/workflows/diagram-corpus.yml` has failed since run `39165172090` at `be234e6f94` on 2026-10-18, last green at `d04df31790` on 2026-10-11, and every pull request run since 2026-10-14 also failed. Commit `329052db9f` on 2026-10-12 gave `.skilled/skills/sk-design/sk-design-diagram/scripts/README.md` its first version, `1.0.0.0`, and `be234e6f94` bumped it to `1.0.1.0`. The packet's metadata family requires each in-scope doc to share `SKILL.md`'s major.minor, which is `1.2` at version `1.2.2.0`. sk-doc's `frontmatter-version.mjs` keeps a child doc's own edition and starts a missing one at `1.0.0.0`, so that tool cannot correct the value.

### Purpose
Diagram Corpus passes again, and the next reader of the error is told the one step that fixes it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `scripts/README.md`: frontmatter version `1.0.1.0` to `1.2.0.1`, following the earlier era moves that kept each doc's edition count.
- `scripts/families/metadata.cjs`: the era error message says the apply pass keeps a child doc's own edition, so the major.minor has to be set by hand.
- Evidence in `scratch/evidence/`: the mutated-back corpus failure, the after corpus pass, the mutation suite before and after.

### Out of Scope
- sk-doc's `frontmatter-version.mjs` default of `1.0.0.0` - it belongs to sk-doc's version standard, and its owner decides the durable fix (recorded under Known Limitations).
- The rest of the sk-design-diagram package - the other 11 families pass and stay untouched.
- Any change to the workflow itself - it caught this correctly, so the workflow is right.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-design/sk-design-diagram/scripts/README.md` | Modify | Frontmatter version `1.0.1.0` to `1.2.0.1` |
| `.skilled/skills/sk-design/sk-design-diagram/scripts/families/metadata.cjs` | Modify | The era error message names the by-hand step instead of the apply pass |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The README version sits in `SKILL.md`'s `1.2` era. | The corpus check reports 38 files, 12 families, 0 errors and `RESULT: PASSED` (`scratch/evidence/corpus-after.log`). |
| REQ-002 | The old value still fails the check. | With `1.0.1.0` restored, the check reports `RESULT: FAILED` and names `scripts/README.md: version 1.0.1.0 is outside the anchor's 1.2 era` (`scratch/evidence/corpus-mutated-back.log`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The error message tells the reader what actually fixes the value. | The string says the apply pass keeps a child doc's own edition and to set the major.minor by hand; it no longer says the pass re-derives it (commit `1241fca3c6`). |
| REQ-004 | No other corpus family moved. | The mutation suite passes 21 of 21 (`scratch/evidence/mutation-after.tap`), and both applicator steps reproduce `assets/diagrams` byte for byte. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Diagram Corpus passes on CI at the pushed commit, after failing every run since 2026-10-18.
- **SC-002**: The local check passes all 12 families with 0 errors, and the mutation suite passes 21 of 21.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The era rule in `scripts/families/metadata.cjs` | High | The README follows the anchor; the family keeps its check and only its message changes |
| Risk | The next new doc in this packet starts at `1.0.0.0` and fails the same check | Med | Recorded as a limitation; the default lives in sk-doc's script, which is out of scope |
| Risk | The message edit reads as a weakened check | Low | Only message text changed, and the case at `scripts/tests/mutation-cases.cjs:71` still rejects an out-of-era version |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. The `1.0.0.0` default for a new doc is recorded under Known Limitations in `implementation-summary.md` as sk-doc's decision.
<!-- /ANCHOR:questions -->

---
