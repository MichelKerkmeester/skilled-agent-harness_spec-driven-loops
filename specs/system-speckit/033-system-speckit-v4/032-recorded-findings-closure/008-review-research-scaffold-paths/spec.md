---
title: "Feature Specification: Phase 8: review-research-scaffold-paths"
description: "The manifest declares review and research as scaffoldable levels, create.sh rejects both at the --level flag, no review-report template exists, and the renderer that would write research/research.md writes flat instead."
trigger_phrases:
  - "review research scaffold paths"
  - "create sh level review research"
  - "review report template"
  - "path typed document placement"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: review-research-scaffold-paths

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/008-review-research-scaffold-paths` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 16 |
| **Predecessor** | 007-links-scan-registry-rule |
| **Successor** | 009-references-corpus-routing |
| **Handoff Criteria** | `create.sh --level review` and `--level research` each produce a folder that validates strict untouched, the scaffold goldens cover both, and the deep-loop SKILL.md documents state why they keep writing the files themselves |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Recorded findings closure specification.

**Scope Boundary**: `create.sh`'s `--level` argument parser, the missing `review-report.md.tmpl` template and its two resolver entries, the flat-output caller gap for path-typed core documents, the scaffold goldens, and one documentation note in each of `deep-review/SKILL.md` and `deep-research/SKILL.md`.

**Dependencies**:
- `030-spec-kit-simplification-research/004-template-system-and-acceptance-criteria/research/lineages/deepseek-v4-flash-templates-r3/findings-registry.json` (`f-iter001-001` through `f-iter001-005`), the findings this phase closes
- `030-spec-kit-simplification-research/018-scaffold-placeholder-and-upgrade-truth`, which fixed the resolvers' review/research lookup mismatch (`f-iter001-003`) and the flat-output renderer's own contract comment (`f-iter001-004`), but deliberately left `create.sh`'s `--level` flag rejecting both levels, recorded as: "the deep loops write those packets and the manifest rows are validator contracts. The scaffolder's level error now says so"

**Deliverables**:
- `create.sh --level review` and `--level research` produce a scaffold instead of an error
- `templates/packet-types/review-report.md.tmpl` exists and resolves through both the JS and bash resolvers
- `research/research.md` and `review/review-report.md` land at their manifest-declared packet-relative path, not flat at the folder root
- Scaffold goldens covering both levels
- A documentation note in each deep-loop SKILL.md stating why the loop keeps writing its own files

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`templates/spec-kit-docs.json` declares both `review` and `research` as full level entries with `requiredCoreDocs` of `['spec.md', 'review/review-report.md']` and `['spec.md', 'research/research.md']` (verified by loading the manifest 2026-09-07). `create.sh`'s `--level` argument parser accepts only `1|2|3|3+|phase-parent` and rejects `review`/`research` with "review and research packets are written by the deep loops, not scaffolded" (`spec/create.sh:93-95`). No `review-report.md.tmpl` exists anywhere under `templates/` (confirmed by `find`). `templates/packet-types/review.spec.md.tmpl` exists for the level's `spec.md`, but its `review-report.md` sibling does not, so even if `--level review` were accepted, `copy_templates_batch` would hard-fail on the missing template (`f-iter001-002`). `035-.../018-.../` already fixed the resolvers' review-case lookup (`lib/template-utils.sh:209-210` now mirrors `utils/template-structure.js:406-407`) and stated the renderer's flat-output contract in its own comment ("a caller that wants a document at a packet path such as research/research.md moves it after rendering", `templates/inline-gate-renderer.ts:290-291`), but no caller performs that move for a path-typed document today: `copy_templates_batch` in `lib/template-utils.sh:120-155` has an explicit `mv` only for the `phase` level's `spec.md` special case, and because `--level research` was never reachable through the CLI, this gap was never exercised end to end. The deep loops write `review-report.md` and `research/research.md` themselves through their own YAML workflows (`system-deep-loop/deep-review/SKILL.md:296`, `deep-research/SKILL.md:303,309`), independent of `create.sh`, and their SKILL.md documents say nothing about the scaffolder either way.

### Purpose
An agent or operator can scaffold a review or research packet the same way they scaffold any other level, and the deep-loop documentation states plainly why the loops keep writing their own files instead of using it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accepting `--level review` and `--level research` in `create.sh`'s argument parser
- Adding `templates/packet-types/review-report.md.tmpl` and wiring it into both resolvers (`DOC_TEMPLATE_NAMES` in `utils/template-structure.js`, `_manifest_template_path` in `lib/template-utils.sh`)
- Closing the flat-output-to-packet-path gap in `copy_templates_batch` for path-typed core documents (`review/review-report.md`, `research/research.md`), generalizing the existing `phase`-only `mv` special case
- Extending `tests/scaffold-golden-snapshots.vitest.ts` with a review and a research fixture
- Adding one documentation note to `system-deep-loop/deep-review/SKILL.md` and one to `deep-research/SKILL.md` stating why the loop's own YAML workflow keeps writing `review-report.md`/`research/research.md` directly

### Out of Scope
- Changing what the deep loops actually write, their state-file set, or their locking and convergence logic - `create.sh` producing a scaffold shell does not replace the loop's own INIT/LOOP/SYNTHESIS/save lifecycle
- Fixing `spec/check-placeholders.sh`'s unrelated `[A-Z]`-anchored bracket pattern, discovered while researching phase 5's sibling finding but not part of this phase's scope
- Any content change to `review.spec.md.tmpl` or `research.md.tmpl` (the addon research template) beyond what wiring the new review-report template requires

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | `--level` regex accepts `review`/`research`. The removed error branch's reasoning moves to a code comment |
| `.opencode/skills/system-spec-kit/templates/packet-types/review-report.md.tmpl` | Create | New template for the review level's required core document |
| `.opencode/skills/system-spec-kit/runtime/cli/utils/template-structure.js` | Modify | `DOC_TEMPLATE_NAMES` gains a `review-report.md` entry |
| `.opencode/skills/system-spec-kit/runtime/cli/lib/template-utils.sh` | Modify | `_manifest_template_path` resolves `review-report.md` the same way it resolves `spec.md` for the review level |
| `.opencode/skills/system-spec-kit/runtime/cli/lib/template-utils.sh` | Modify | `copy_templates_batch` moves a rendered path-typed document (`review/review-report.md`, `research/research.md`) from the renderer's flat output to its packet-relative path, generalizing the phase-only `mv` |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` | Modify | New review and research fixtures |
| `.opencode/skills/system-deep-loop/deep-review/SKILL.md` | Modify | One note on why the loop writes `review-report.md` directly |
| `.opencode/skills/system-deep-loop/deep-research/SKILL.md` | Modify | One note on why the loop writes `research/research.md` directly |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `create.sh --level review` and `create.sh --level research` scaffold a folder instead of exiting with the current rejection error |
| REQ-002 | `templates/packet-types/review-report.md.tmpl` exists and both the JS and bash resolvers resolve `review-report.md` to it at the review level |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `research/research.md` and `review/review-report.md` land at their manifest-declared packet-relative path after scaffolding, not flat at the folder root |
| REQ-004 | `tests/scaffold-golden-snapshots.vitest.ts` covers a `--level review` and a `--level research` scaffold, each validating strict untouched |
| REQ-005 | `deep-review/SKILL.md` and `deep-research/SKILL.md` each state why the loop keeps writing its own file rather than scaffolding through `create.sh` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash create.sh --json --skip-branch --level review --path <tmp> --number 999 'Review fixture'` exits 0 and the folder validates strict
- **SC-002**: `bash create.sh --json --skip-branch --level research --path <tmp> --number 998 'Research fixture'` exits 0, `research/research.md` exists at that path (not `research.md` at the root), and the folder validates strict
- **SC-003**: `grep -n "review-report\|research.md" deep-review/SKILL.md deep-research/SKILL.md` shows the new note in each
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Generalizing the `phase`-only `mv` special case in `copy_templates_batch` to every path-typed document breaks the phase-parent scaffold, which is the one path this logic already serves in production | A regression in the most-used scaffold shape | The phase-parent golden snapshot and `test-upgrade-level.sh` are re-run after the change, not just the two new fixtures |
| Risk | The deep loops start scaffolding through `create.sh --level review/research` as a side effect of this phase, even though that was explicitly out of scope | A larger, riskier change to a live, actively used autonomous loop lands as scope creep | This phase only makes the scaffold possible and documents why the loops do not (yet) use it. Changing the loops' own write path is a separate decision |
| Dependency | `035-.../018-.../` resolver fix (`f-iter001-003`) already landed | Without it, the review level's `spec.md` would not resolve either | Confirmed shipped by reading `template-utils.sh:209-210` and `template-structure.js:406-407` directly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. Scaffolding one more level adds no measurable overhead to `create.sh`
- **NFR-P02**: Not applicable

### Security
- **NFR-S01**: The path-typed document move validates its destination stays within the target folder, reusing `_ensure_dest_within_dir`'s existing containment check rather than a new unguarded `mv`
- **NFR-S02**: Not applicable

### Reliability
- **NFR-R01**: A scaffold that would land a path-typed document outside its packet folder fails loudly rather than writing outside the containment boundary
- **NFR-R02**: The phase-parent scaffold, the one production path already exercising a similar move, is not regressed
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable. The level argument is a fixed enum
- Maximum length: not applicable
- Invalid format: `--level revieww` (a typo) still hits the existing rejection error, now naming the corrected accepted set

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: not applicable. `create.sh` writes to a fresh folder

### State Transitions
- Partial completion: the `--level` acceptance, the template, both resolver entries and the path-move fix land together, since accepting the level without the template or the move would scaffold a broken folder
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One CLI flag, one new template, two resolver edits, one generalized move step, one golden test, two SKILL.md notes |
| Risk | 10/25 | Generalizing a move step used today only by the phase-parent path touches a production scaffold shape |
| Research | 5/20 | Findings arrived censused. The resolver fix status and the flat-output gap were confirmed by direct code read |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Whether the loops should switch to scaffolding through `create.sh` is explicitly deferred to a documentation note, not a behavior change, per the Out of Scope section above.
<!-- /ANCHOR:questions -->

---
