---
title: "Feature Specification: Derive SOURCE quality_class at the graph upsert choke point"
description: "The coverage-graph sourceDiversity signal counts distinct quality_class values on SOURCE nodes, but no runtime producer sets that value and upsert.cjs copies any leaf-supplied string verbatim. This phase derives quality_class at upsert from source attributes, from a closed vocabulary kept beside SAFE_METADATA_KEYS, and strips leaf-supplied values."
trigger_phrases:
  - "source diversity quality class"
  - "quality_class upsert derivation"
  - "sourcediversity cannot pass"
  - "slice g quality class"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Derive SOURCE quality_class at the graph upsert choke point

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../006-state-log-leaf-fields/spec.md` |
| **Successor** | `../008-review-dimension-coverage/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`computeResearchSourceDiversityFromData` counts distinct `metadata.quality_class` values on SOURCE nodes cited by each question's answering findings (`runtime/lib/coverage-graph/coverage-graph-signals.ts:653-690`). No runtime producer sets `quality_class`; only test fixtures do. So on a contract-compliant research run the signal reads 0 and can never pass its 1.5 threshold, while `upsert.cjs:211-245` copies leaf `metadata` verbatim, so any invented string counts (defect D1, confirmed live in generation 1: 0.00 before, 2.0 after hand-set values).

### Purpose
`quality_class` on every research SOURCE node comes from the upsert step itself, from a closed vocabulary, so citing more distinct real sources is the only way to raise source diversity.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n "quality_class" .skilled/skills/system-deep-loop/runtime --glob "!**/tests/**" --glob "!**/node_modules/**" --glob "*.{ts,cjs}"
.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:131:  'quality_class',
.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:680:        const qualityClass = sourceMetadataById.get(sourceId)?.quality_class;
```
Two non-test hits: an allow-list entry in `SAFE_METADATA_KEYS` and the one reader. Neither writes the value. The only writers are the fixtures in `runtime/tests/unit/coverage-graph-signals.vitest.ts:67-68` and `runtime/tests/integration/convergence-script.vitest.ts:49-50, 70-71, 112, 653-654`, which pass `primary`, `secondary` and `tertiary` through the `upsert` script.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a frozen, exported constant of the allowed `quality_class` values beside `SAFE_METADATA_KEYS` in `coverage-graph-query.ts`: `repo-code`, `repo-test`, `repo-spec`, `skill-doc`, `ledger-state`, `external-doc`, `external-other`, `unclassified` (parent §18, "D1 honest fix").
- Derive `quality_class` in `upsert.cjs` for research SOURCE nodes from the node's `name` (the leaf's `label`), falling back to its `id`: a URL maps by host, a repo-relative path maps by path segment and file type, anything else maps to `unclassified`.
- Strip any leaf-supplied `quality_class` from SOURCE node metadata before the derived value is set.
- Move the upsert-seeded fixtures to source names that derive the classes the tests need, and add derivation cases.

### Out of Scope
- Deriving the value at query time in `computeResearchSourceDiversityFromData` and dropping the stored field - the parent's named alternative (§18); this phase takes the upsert option.
- Changing the 1.5 threshold or the averaging rule in `coverage-graph-signals.ts` - the signal's math stays as is.
- Review-loop nodes - review has no SOURCE kind in this signal.
- Telling leaves to put a path or URL in SOURCE labels - prompt-pack wording belongs to `../005-prompt-pack-contract-alignment/` or `../010-research-frontier-mode/`; see Open Questions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts` | Modify | Export the frozen `quality_class` vocabulary beside `SAFE_METADATA_KEYS` (:123-136) |
| `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Modify | In the node loop (:211-245), for research SOURCE nodes, strip the leaf value and set the derived class |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts` | Modify | Derivation and strip cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-graph-upsert.vitest.ts` | Modify | A leaf-supplied value does not survive the research upsert path |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts` | Modify | Fixtures at :49-50, :70-71, :112, :653-654 use source names that derive distinct classes |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/coverage-graph-signals.vitest.ts` | Modify | Fixture at :67-68 (seeded through `upsert`) uses source names that derive distinct classes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A leaf-supplied `quality_class` never reaches the stored node | An `upsert-script` case upserts a research SOURCE node named `.skilled/agents/deep-research.md` with `metadata.quality_class: "primary"`; the stored metadata holds a vocabulary value, not `primary` |
| REQ-002 | Every stored research SOURCE `quality_class` is in the closed vocabulary | An `upsert-script` case upserts SOURCE nodes named by a repo code path, a test path, a spec path, a skill doc, a state ledger file, an external doc URL, another URL and free text, and gets `repo-code`, `repo-test`, `repo-spec`, `skill-doc`, `ledger-state`, `external-doc`, `external-other` and `unclassified` |
| REQ-003 | The vocabulary is one frozen constant beside `SAFE_METADATA_KEYS` | `rg -n "Object.freeze" .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts` prints the constant within 20 lines of `SAFE_METADATA_KEYS`, and `upsert.cjs` reads it instead of repeating the values |
| REQ-004 | Source diversity rises only with distinct real sources | A `convergence-script` case with two findings citing two sources of different derived classes reports `sourceDiversity` 2.0; the same case with both sources in one class reports 1.0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Non-SOURCE nodes and review nodes keep their metadata unchanged | An `upsert-script` case upserts a FINDING with `metadata.confidence` and a review node, and both store their metadata as given |
| REQ-006 | The four named suites pass after the fixture move | `npx vitest run coverage-graph-signals convergence-script upsert-script deep-research-graph-upsert` from `.skilled/skills/system-deep-loop/runtime` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No research SOURCE node in a fresh coverage graph holds a `quality_class` outside the vocabulary, whatever the leaf sent.
- **SC-002**: `npx vitest run coverage-graph-signals convergence-script upsert-script deep-research-graph-upsert` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Default-path behavior changes: the graph `sourceDiversity` signal now carries values on normal research runs, where it read 0 before, so graph-based stop decisions can change (parent §20, "LOW-MEDIUM, signal tightens") | Low-Medium | REQ-004 pins the arithmetic; state the change in the phase changelog note |
| Risk | Leaf SOURCE labels are "a free-text display name" in the prompt pack today, so many derive `unclassified` and diversity stays low until leaves name the path or URL | Medium | Fall back from `name` to `id`; record the label wording as an open question for 005 or 010 |
| Dependency | None. This phase has no prerequisite slice (parent §20 order) | None | Not applicable |
| Dependency | This phase is a prerequisite of `../010-research-frontier-mode/` (parent §15: the sub-mode must not rely on graph `sourceDiversity` until this lands) | The frontier stop would rely on a gameable signal | Land this phase before 010 starts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `unclassified` count as a distinct class in `computeResearchSourceDiversityFromData`? Counted, a question with one classified and one unclassified source scores 2. Not counted needs a one-line change in `coverage-graph-signals.ts`, outside this phase's file list.
- Which phase adds the prompt-pack line telling leaves to name a SOURCE node by its repo path or URL? The derivation works without it, but most labels then fall to `unclassified`.
- Exact path rules per class (for example, whether `.skilled/skills/**/SKILL.md` is `skill-doc` and `.skilled/skills/**/*.cjs` is `repo-code`) are fixed in the REQ-002 case; the implementer writes the table there and keeps it the only copy.
<!-- /ANCHOR:questions -->

---
