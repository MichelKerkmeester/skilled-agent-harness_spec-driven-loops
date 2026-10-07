---
title: "Feature Specification: Fix the review findings on the series parent rule"
description: "The phase 7 review found the series parent recipe unrunnable, stale copies of the rule in four docs, an unsanitized listing and unfinished phase 6 records. This phase fixes all twelve findings and two close-out gaps."
trigger_phrases:
  - "series parent review fixes"
  - "phase 8 series parent review fixes"
  - "runnable series parent recipe"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fix the review findings on the series parent rule

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-07 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 12 |
| **Predecessor** | 007-series-parent-review-and-hardening-research |
| **Successor** | 009-gate-3-menu-series-parent |
| **Handoff Criteria** | Every review finding in `../007-series-parent-review-and-hardening-research/review/review-report.md` section 3 is fixed or waived with a reason |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the spec folder tooling parent. Phase 7 reviewed Phase 6 and returned CONDITIONAL with 4 P1 and 8 P2 findings. This phase fixes them, plus two gaps found while closing Phase 7.

**Scope Boundary**: the files in the table below. The Gate 3 menu wording is Phase 9, the CI index rebuild is Phase 10 and the template phrase cleanup is Phase 11.

**Dependencies**:
- Phase 7 commit `4b33313bd4c` (the review report).

**Deliverables**:
- A recipe that runs as written, every stale rule copy fixed, a hardened listing, closed Phase 6 records and the effort setting passed to cli-pi.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Anyone following the series parent recipe gets three placeholder children that the next steps collide with. Older copies of the rule outside the docs Phase 6 edited still state the old wording. The listing passes control bytes to the terminal, and the four template phrases live in three literals that can drift apart silently.

### Purpose
The rule reads the same everywhere, its recipe runs as written, and the listing and seeding cannot fail silently.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The series parent recipe in `phase-definitions.md` §2.
- A repo-wide sweep for the stale "Option E" label and for threshold restatements without the series parent exception.
- The two doc gaps in `quick-reference.md` §9 and `retrieval-conventions.md`.
- Control-byte stripping in the `create.sh` listing, a sub-folder silence test and one source for the template phrases.
- The Phase 6 packet records.
- Passing `reasoningEffort` to the cli-pi executor in both deep-loop auto workflows, and rebuilding the trigger index.

### Out of Scope
- The runtime Gate 3 menu text - Phase 9.
- Ranking the listing by topic and the `/speckit:plan` intake listing - not chosen for this round.
- Adding `acceptance criteria` to the template-default class - Phase 11.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md` | Modify | Runnable series parent recipe |
| `.skilled/skills/system-spec-kit/README.md` | Modify | Option E label becomes Option D |
| `.skilled/skills/system-spec-kit/references/templates/level-selection-guide.md` | Modify | Series parent exception |
| `.skilled/skills/system-spec-kit/references/templates/level-specifications.md` | Modify | Series parent exception |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md` | Modify | Series parent exception |
| `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md` | Modify | Option C names the series parent |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | Lists the `template-default` class |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Strip control bytes, one phrase source |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs` | Modify | Reads the shared phrase source |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts` | Modify | ESC and sub-folder tests |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modify | Pass `reasoningEffort` to cli-pi |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modify | Pass `reasoningEffort` to cli-pi |
| `specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/` | Modify | Tasks summary, AC continuity, scope table |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerate | Rebuilt from committed content |

Any other doc the repo-wide sweep finds with the same defect is in scope for the same one-line fix.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The series parent recipe runs as written from a clean track and leaves no placeholder child |
| REQ-002 | No doc outside changelogs, `z_archive/` and `specs/` labels skip-documentation as Option E, and every doc that restates the phase thresholds names the series parent exception |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `quick-reference.md` §9 option C names the series parent, and `retrieval-conventions.md` lists `template-default` |
| REQ-004 | The `create.sh` listing strips control bytes from names and descriptions, and a sub-folder run lists nothing, each proven by a test |
| REQ-005 | The four template phrases have one source, or the seeder fails loudly when the template drifts from it |
| REQ-006 | Phase 6's tasks summary, AC continuity block and scope table match what it shipped |
| REQ-007 | A cli-pi deep-loop run passes the configured `reasoningEffort` to the executor |
| REQ-008 | The committed trigger index matches the corpus |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every review finding id from Phase 7 maps to a met AC row.
- **SC-002**: The six baseline spec test files and the new tests pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The phrase single-source change breaks seeding | Med | The existing seeding tests run before and after |
| Risk | The sweep edits a doc another session is changing | Low | Rebase before commit and re-run the sweep |
| Dependency | Pi providers for the build lanes | A failed lane writes nothing | Check each diff, not the exit code |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The listing adds no measurable time to `create.sh`.

### Security
- **NFR-S01**: No byte below 0x20 or in 0x7f-0x9f reaches the terminal from repository metadata.

### Reliability
- **NFR-R01**: The listing still returns 0 on every failure and never stops a scaffold.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A description made only of control bytes prints as empty.
- A folder name with an ESC byte prints without it.

### Error Scenarios
- A template whose phrase block drifted: the seeder reports it by name and exits nonzero.

### State Transitions
- A sub-folder or phase child run: no listing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 14 files, mostly one-line doc edits |
| Risk | 8/25 | Seeder change is the only behavior change |
| Research | 3/20 | Findings and fixes are already written |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The fixes come from the Phase 7 review report.
<!-- /ANCHOR:questions -->

---
