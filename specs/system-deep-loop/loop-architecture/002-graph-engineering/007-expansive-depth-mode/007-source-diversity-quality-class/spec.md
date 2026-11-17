---
title: "Feature Specification: Derive SOURCE quality_class at the graph upsert choke point"
description: "The coverage-graph sourceDiversity signal counts distinct quality_class values on SOURCE nodes, but no runtime producer sets that value and upsert.cjs copies any leaf-supplied string verbatim. This phase derives quality_class at upsert from the node path, name or id, from a closed vocabulary kept beside SAFE_METADATA_KEYS, and strips leaf-supplied values."
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
`quality_class` on every research SOURCE node comes from the upsert step itself, from a closed vocabulary, so citing sources of more distinct derived classes is the only way to raise source diversity. The signal counts distinct classes per question, not distinct sources, so a question answered only from one class of source (for example only `.cjs` files) still scores 1.0 and stays below the 1.5 threshold by design; a code-only question that cites code and its tests scores 2.0 and passes.
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
- Derive `quality_class` in `upsert.cjs` for research SOURCE nodes from the node's `path` first, then its `name` (the leaf's `label`), then its `id`: a URL maps by host, a repo-relative path maps by path segment and file type, anything else maps to `unclassified`. The pack already requires `"path"` on every SOURCE node that names a file (`deep-research/assets/prompt-pack-iteration.md.tmpl:86`), and `iteration-graph-upsert.cjs:143` spreads the event into the upsert input, so `path` reaches the node loop at `upsert.cjs:211-245`, where it is dropped today.
- Strip any leaf-supplied `quality_class` from SOURCE node metadata before the derived value is set.
- Move the upsert-seeded fixtures to source names that derive the classes the tests need, and add derivation cases.

### Out of Scope
- Deriving the value at query time in `computeResearchSourceDiversityFromData` and dropping the stored field - the parent's named alternative (§18); this phase takes the upsert option.
- Changing the 1.5 threshold or the averaging rule in `coverage-graph-signals.ts` - the signal's math stays as is.
- Review-loop nodes - review has no SOURCE kind in this signal.
- Changing `SAFE_METADATA_KEYS`: it already lists `quality_class` (`coverage-graph-query.ts:131`), so the derived key survives a read with no change.
- New prompt-pack wording: the pack already requires `path` on file SOURCE nodes (:86).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts` | Modify | Export the frozen `quality_class` vocabulary beside `SAFE_METADATA_KEYS` (:123-136) |
| `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Modify | In the node loop (:211-245), for research SOURCE nodes, strip the leaf value and set the class derived from `path`, then `name`, then `id` |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts` | Modify | Derivation and strip cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-graph-upsert.vitest.ts` | Modify | A leaf-supplied value does not survive the research upsert path |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts` | Modify | Fixtures at :49-50, :70-71, :112, :653-654 use source names that derive distinct classes |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/coverage-graph-signals.vitest.ts` | Modify | Fixture at :67-68 (seeded through `upsert`) uses source names that derive distinct classes |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph/` | Modify | One scenario, written by `/create:manual-testing-playbook system-deep-loop update --path .skilled/skills/system-deep-loop/runtime/manual-testing-playbook` |

No file this phase changes is digested by the compiled command contracts under `.skilled/commands/deep/assets/compiled/` (they digest the command docs, workflow YAMLs, configs, strategy assets, prompt-pack templates, agent definitions and reference docs), so this phase has no contract regeneration task. No agent definition changes, so no runtime mirror sync is needed.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A leaf-supplied `quality_class` never reaches the stored node, and `path` outranks the label | An `upsert-script` case upserts a research SOURCE node with `path: ".skilled/agents/deep-research.md"`, a free-text label and `metadata.quality_class: "primary"`; the stored metadata holds the class derived from the path, not `primary` and not `unclassified` |
| REQ-002 | Every stored research SOURCE `quality_class` is in the closed vocabulary | An `upsert-script` case upserts SOURCE nodes identified by a repo code path, a test path, a spec path, a skill doc, a state ledger file, an external doc URL, another URL and free text, and gets `repo-code`, `repo-test`, `repo-spec`, `skill-doc`, `ledger-state`, `external-doc`, `external-other` and `unclassified` |
| REQ-003 | The vocabulary is one frozen constant beside `SAFE_METADATA_KEYS` | `rg -n "Object.freeze" .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts` prints the constant within 20 lines of `SAFE_METADATA_KEYS`, and `upsert.cjs` reads it instead of repeating the values |
| REQ-004 | Source diversity rises only with distinct derived classes | A `convergence-script` case with two findings citing two sources of different derived classes reports `sourceDiversity` 2.0; the same case with both sources in one class reports 1.0. A code-only fixture whose question is answered from a `.cjs` file and its `.vitest.ts` test reports 2.0 and raises no `source_diversity_guard` blocker (`convergence.cjs:448`) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Non-SOURCE nodes and review nodes keep their metadata unchanged | An `upsert-script` case upserts a FINDING with `metadata.confidence` and a review node, and both store their metadata as given |
| REQ-006 | The four named suites pass after the fixture move | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/coverage-graph-signals.vitest.ts tests/integration/convergence-script.vitest.ts tests/integration/upsert-script.vitest.ts tests/unit/deep-research-graph-upsert.vitest.ts` exits 0 |
| REQ-007 | The signal change has a playbook scenario | `/create:manual-testing-playbook system-deep-loop update --path .skilled/skills/system-deep-loop/runtime/manual-testing-playbook` has written one scenario, and `rg -l "quality_class" .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/coverage-graph` lists it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No research SOURCE node in a fresh coverage graph holds a `quality_class` outside the vocabulary, whatever the leaf sent.
- **SC-002**: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/coverage-graph-signals.vitest.ts tests/integration/convergence-script.vitest.ts tests/integration/upsert-script.vitest.ts tests/unit/deep-research-graph-upsert.vitest.ts` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Default-path behavior changes: the graph `sourceDiversity` signal now carries values on normal research runs, where it read 0 before, so graph-based stop decisions can change (parent §20, "LOW-MEDIUM, signal tightens") | Low-Medium | REQ-004 pins the arithmetic; state the change in the phase changelog note |
| Risk | Leaf SOURCE labels are "a free-text display name" in the prompt pack, so a label alone often derives `unclassified` | Low | Derive from `path` first, which the pack already requires on file SOURCE nodes (:86); URL sources fall back to `name`, then `id` |
| Risk | A question answered from a single derived class, such as only `.cjs` files, scores 1.0 and stays blocked by `source_diversity_guard` (threshold 1.5, `convergence.cjs:437`, blocker at :448). Code-only runs that cite code and tests pass | Medium | Intended: the signal measures class diversity. The REQ-004 code-only fixture pins the passing case; a lower threshold or a source-count rule would amend goal decision D3 |
| Risk | `unclassified` counts as a class, as the reader counts any non-empty string, so a question citing one classified source and one source with neither path nor URL scores 2 | Low-Medium | Path-first derivation leaves `unclassified` only for sources with no path or URL. Excluding it is a one-line change in `coverage-graph-signals.ts` that would amend D3; this phase does not take it |
| Dependency | None. This phase has no prerequisite slice (parent §20 order) | None | Not applicable |
| Dependency | This phase is a prerequisite of `../010-research-frontier-mode/` (parent §15: the sub-mode must not rely on graph `sourceDiversity` until this lands) | The frontier stop would rely on a gameable signal | Land this phase before 010 starts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None open. Settled in planning on 2026-11-17 from the code:

- **Does `unclassified` count as a distinct class?** Yes. The reader counts any non-empty string and goal decision D3 keeps the signal's math, so no change in `coverage-graph-signals.ts`. The residual risk is in the risk table.
- **Which phase tells leaves to name a SOURCE by repo path or URL?** None needs to: the pack already requires `"path"` on file SOURCE nodes (`prompt-pack-iteration.md.tmpl:86`), and the derivation reads it first.
- **Exact path rules per class** (for example, whether `.skilled/skills/**/SKILL.md` is `skill-doc` and `.skilled/skills/**/*.cjs` is `repo-code`) are fixed in the REQ-002 case; the implementer writes the table there and keeps it the only copy.
- **Does a code-only run pass?** When its questions cite at least two derived classes, such as code and tests, yes (REQ-004 fixture). A single-class question blocks by design.
<!-- /ANCHOR:questions -->

---
