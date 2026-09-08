---
title: "Feature Specification: Phase 3: playbook-provenance-lines"
description: "68 of the 85 files in the manual-testing-playbook carry no provenance line naming the suite or hand procedure that proves the scenario, and this phase gives every file one without fabricating a suite that does not exist."
trigger_phrases:
  - "playbook provenance line"
  - "manual testing playbook suite citation"
  - "provenance path existence check"
  - "playbook operator contract gate"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: playbook-provenance-lines

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/003-playbook-provenance-lines` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 16 |
| **Predecessor** | 002-multiplexed-rule-split |
| **Successor** | 004-fingerprint-stamp-regeneration |
| **Handoff Criteria** | All 85 playbook files carry a real provenance line, a new existence check passes over every cited path and the playbook-operator-contract CI gate stays green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Recorded findings closure specification.

**Scope Boundary**: The 85 markdown files under `.opencode/skills/system-spec-kit/manual-testing-playbook/` (the root index plus 84 per-feature scenario files across 10 category directories), and a new path-existence check under `.opencode/skills/system-spec-kit/runtime/cli`. The shared cross-skill template and its structural validator (`sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md`, `.../scripts/validate-playbook-package.cjs`) are read for their existing contract but not edited by this phase.

**Dependencies**:
- `.github/workflows/playbook-operator-contract.yml`, the CI gate that already enforces this playbook root's five-section shape via `validate-playbook-package.cjs`. This phase's new content must fit the existing `## 4. SOURCE FILES` section it already checks for.
- `runtime/cli/tests/manual-playbook-runner.ts`, the scenario runner `manual-testing-playbook.md` Section 8 already points to.

**Deliverables**:
- A provenance line in every one of the 85 files' Section 4 (or equivalent), naming a real suite path or stating "manual only" with the exact command.
- A new test or script under `runtime/cli` that walks all 85 files and fails if a cited suite path does not exist.
- A short convention note in the root `manual-testing-playbook.md` naming the two allowed provenance forms.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The manual-testing-playbook under `.opencode/skills/system-spec-kit/manual-testing-playbook/` holds 85 markdown files (1 root index plus 84 per-feature scenario files, confirmed by direct count: `find .../manual-testing-playbook -name "*.md" | wc -l` returns 85). Lane 005 round one's F31 measured that only a minority state which automated suite or hand procedure proves their scenario, and round two's F2-13 corrected the in-boundary figure to 17 of 85 after round one's number was found to include files from another skill's tree (`specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/005-overengineering-simplification/research/confirmed-findings.md` F31, F2-13). That leaves 68 files with no stated provenance: a reader cannot tell, from the file itself, whether the scenario is backed by a real regression test or is untested prose. Both research rounds explicitly recorded a decision NOT to add a line that names a suite the scenario does not actually have, since that would fabricate provenance rather than document it.

### Purpose
Give every one of the 85 playbook files a real provenance line - either the path of an automated suite that actually exercises the scenario, or the literal words "manual only" plus the exact command a human runs - and back that claim with a script that fails if a cited path does not exist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Auditing all 85 files to classify each scenario as suite-backed (name the real test file) or manual-only (name the real command).
- Adding or normalizing one provenance statement per file inside its existing `## 4. SOURCE FILES` section (the section every file already has, per `sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md:117-118`), so no new section is introduced.
- Writing a new script or Vitest suite under `runtime/cli` that walks the 85 files, extracts every cited suite path and fails if that path does not resolve on disk.
- Updating `manual-testing-playbook.md`'s Section 8 (AUTOMATED TEST CROSS-REFERENCE) to name the provenance convention.

### Out of Scope
- Writing new automated tests to convert a manual-only scenario into a suite-backed one. That is a testing-capability project, not a documentation-honesty one. A scenario that is genuinely manual stays "manual only" with its command.
- Editing `sk-doc/sk-create-manual-testing-playbook`'s shared template or its `validate-playbook-package.cjs` fleet validator - those are a different skill's owned files. This phase's content fits inside the section shape they already enforce.
- The four deep-loop playbook commands F3-19 already fixed. Those live under `.opencode/skills/system-deep-loop/`, not `system-spec-kit/manual-testing-playbook/`, and were already repaired by child `020-rule-headers-registry-coverage-and-playbook-paths` in a different packet. F3-19 is cited here only as precedent for the general rule that a broken verification command is itself a finding.
- Renumbering or restructuring the 85 files' IDs, categories or directory layout.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modify | Add the provenance-convention note to Section 8 |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/context-preservation/*.md` (1 file) | Modify | Add/normalize provenance line |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/doctor-commands/*.md` (13 files) | Modify | Add/normalize provenance line |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/feature-flag-reference/*.md` (4 files) | Modify | Add/normalize provenance line |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/governance/*.md` (1 file) | Modify | Add/normalize provenance line |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/lifecycle/*.md` (1 file) | Modify | Add/normalize provenance line |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/memory-quality-and-indexing/*.md` (5 files) | Modify | Add/normalize provenance line |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/*.md` (5 files) | Modify | Add/normalize provenance line |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/retrieval/*.md` (1 file) | Modify | Add/normalize provenance line |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/*.md` (47 files) | Modify | Add/normalize provenance line |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/*.md` (6 files) | Modify | Add/normalize provenance line |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/playbook-provenance-paths.vitest.ts` | Create | Asserts every cited provenance path exists |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the 85 playbook files carries a provenance line in its Section 4 naming either a real automated suite path or "manual only" plus the exact command that proves the scenario. |
| REQ-002 | A new test under `runtime/cli` walks all 85 files, extracts every cited suite path and fails if any path does not resolve on disk. |
| REQ-003 | No provenance line names a suite the scenario does not actually have. Every suite-backed line is verified against a real file before being written, per the recorded no-fabrication decision (F31, F2-13). |
| REQ-004 | `.github/workflows/playbook-operator-contract.yml`'s `validate-playbook-package.cjs` gate stays green, since this phase adds content inside the section shape it already structurally enforces. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `manual-testing-playbook.md`'s Section 8 names the provenance convention so a reader finds it from the root index. |
| REQ-006 | The two allowed provenance forms ("suite path" / "manual only: command") are stated once, consistently, so a file added later by `sk-create-manual-testing-playbook`'s generator has a convention to follow (documented here as a cross-skill dependency, not implemented in that skill's own files). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -rL "manual only\|\.vitest\.ts\|\.test\.mjs\|\.test\.ts\|\.test\.cjs" .opencode/skills/system-spec-kit/manual-testing-playbook --include="*.md"` returns zero files (every file matches one of the two provenance forms).
- **SC-002**: The new `playbook-provenance-paths.vitest.ts` suite exits 0.
- **SC-003**: `.github/workflows/playbook-operator-contract.yml`'s validator step exits 0 against the changed tree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Marking a scenario "manual only" when a suite actually exists (or the reverse - citing a suite that only partially covers the scenario) misrepresents provenance in the opposite direction from fabrication | Medium: an inaccurate line is still dishonest, just conservatively so | Cross-check every suite-backed claim against a real `rg` hit for the scenario's own command/tool name inside the candidate suite file, not just the suite's existence |
| Risk | 47 of the 85 files live under `tooling-and-scripts/`, the largest single directory - a naive per-file pass at that volume risks inconsistent phrasing | Low: a phrasing inconsistency does not break the existence check, only readability | Use one fixed sentence template for both provenance forms across all 85 files |
| Dependency | `.github/workflows/playbook-operator-contract.yml` runs `sk-doc`'s `validate-playbook-package.cjs`, a shared cross-skill validator this phase does not own | If that validator's Section 4 heading regex (`/^4\.\s+(?:REFERENCES\|SOURCE FILES)$/i`) changed incompatibly, this phase's lines could still pass structurally while the gate fails for unrelated reasons | Confirmed the regex accepts the existing `## 4. SOURCE FILES` heading every file already uses. This phase adds content under that heading, not a new one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The new provenance-path existence check must complete in well under a minute against 85 files (comparable to `manual-playbook-runner.ts`'s existing walk of the same tree).

### Security
- **NFR-S01**: No new executable command is introduced by a provenance line itself. "manual only" commands are documentation, not something the new check runs.

### Reliability
- **NFR-R01**: The existence check must fail loudly (non-zero exit, named path) rather than silently skipping a file it cannot parse, matching the fail-closed posture `playbook-operator-contract.yml`'s own gate-input check already models.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A file whose scenario is proven by more than one suite: the provenance line names the primary one. Additional suites already listed elsewhere in Section 4 (e.g. `completion-evidence-sentinel.md`'s existing "Core vitest suite" and "Claude Stop hook vitest suite" rows) are left as-is rather than collapsed to one.
- A file with zero automated coverage and no realistic manual command (should not occur, since every scenario has at least the prompt/command sequence in Section 2): treated as a data error the audit must catch, not silently pass through as "manual only" with an empty command.

### Error Scenarios
- A cited suite path that existed when the line was written but is later deleted: the new existence check catches this on the next CI run, which is exactly its purpose.
- A relative path written inconsistently (e.g. missing the `.opencode/skills/system-spec-kit/runtime/` prefix): the check normalizes against the repo root before testing existence, so a technically-correct but differently-rooted path does not false-fail.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 85 markdown files touched plus 1 new test file. High file count, low per-file complexity |
| Risk | 6/25 | Documentation-only change plus one additive test. No runtime behavior changes |
| Research | 8/20 | The exact count (85), the corrected in-boundary citation figure (17) and the no-fabrication decision are already fully characterized by lane 005 |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None. The classification method (suite-backed vs. manual-only) and the no-fabrication constraint are both settled by the cited research.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
