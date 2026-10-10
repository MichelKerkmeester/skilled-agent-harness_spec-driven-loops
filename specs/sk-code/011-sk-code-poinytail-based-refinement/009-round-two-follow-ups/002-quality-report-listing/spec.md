---
title: "Feature Specification: Phase 2: quality-report-listing"
description: "The sk-code-quality mode ships a ceiling-marker report that its SKILL.md never lists, and the skill version never moved, so an agent running the mode has no way to learn the report exists."
trigger_phrases:
  - "quality report listing"
  - "phase 2 quality report listing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: quality-report-listing

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/002-quality-report-listing` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-router-orphan-docs |
| **Successor** | 003-deep-review-case-rule |
| **Handoff Criteria** | SKILL.md lists the ceiling report and its test, the skill version and its newest changelog file both read 1.1.0.0, the report test passes, the compiled sk-code manifest and every leaf manifest are fresh |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Round two follow-ups specification.

**Scope Boundary**: Listing the ceiling report in the sk-code-quality `SKILL.md` and its README, bumping the skill version and adding the changelog file. The report, its test and the scripts README stay as they are.

**Dependencies**:
- `../../008-round-two-recommendations/004-debt-report-and-hermes-gate/`, which added `scripts/ceiling-report.sh` and `scripts/ceiling-report.test.sh` and held `SKILL.md` out of scope
- `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` section 4 for the bump table and `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md` section 3 for skill versioning

**Deliverables**:
- The report and its test listed in `SKILL.md` with one line on when to run the report
- `SKILL.md` version moved from 1.0.1.0 to 1.1.0.0 with a matching `changelog/v1.1.0.0.md`
- The report listed in the quality `README.md` tables that already list its neighbours
- The compiled sk-code manifest and the leaf manifests confirmed fresh

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The earlier debt-report child added `ceiling-report.sh` and `ceiling-report.test.sh` to `.skilled/skills/sk-code/sk-code-quality/scripts/` but left them out of `SKILL.md`, because that child held `SKILL.md` out of scope. The skill version stayed at 1.0.1.0 and no changelog file records the report. A mode that does not list its script is a mode the agent does not run, so the report is unreachable from the skill that owns it. `rg -n 'ceiling-report' .skilled/skills/sk-code/sk-code-quality/SKILL.md` finds nothing today.

### Purpose
An agent reading the quality `SKILL.md` finds the ceiling report, learns when to run it and how, and the skill version and changelog record the addition.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Three listing sites in `.skilled/skills/sk-code/sk-code-quality/SKILL.md`: the Resource Domains bullets, the Resource Loading Levels table and the Scripts reference list
- A minor version bump, 1.0.1.0 to 1.1.0.0, in the `SKILL.md` frontmatter and in the README frontmatter, and the changelog file `changelog/v1.1.0.0.md` that names the report and the listing
- Two README rows (Verification and Related Documents), because that README already lists the two checkers
- Confirming the compiled sk-code manifest and the leaf manifests are fresh, and refreshing the compiled manifest only if its freshness check says stale

### Out of Scope
- `scripts/ceiling-report.sh`, `scripts/ceiling-report.test.sh` and `scripts/README.md` - the scripts README already lists both files and the test, so nothing there changes
- The Smart Routing diagram, the `INTENT_SIGNALS` keywords and the machine-readable router in `SKILL.md` - the report is an on-demand script, not a routed intent, and a keyword change would move advisor and compiled routing
- Running `sync-skills-hermes.cjs` in write mode - the orchestrator runs it once after every child is built
- The `bash` prefix on the two checker commands in the quality `README.md` - those lines are wrong (both scripts are Python), but they are neighbour content outside this fix, so they are reported rather than corrected
- The committed trigger index - its freshness check already fails at baseline on spec documents and it is advisory
- Anything under `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | Version line, three listing sites for the report and its test |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.1.0.0.md` | Create | Compact changelog entry naming the report and the listing |
| `.skilled/skills/sk-code/sk-code-quality/README.md` | Modify | Version line and two table rows for the report |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Modify only if freshness reports stale | Refreshed compiled sk-code manifest |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Modify only with the manifest above | Authored copy kept byte-identical to the manifest |
| `.skilled/skills/sk-code/leaf-manifest.json` | Modify only if the freshness gate fails for sk-code | Regenerated leaf manifest (no change expected) |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/002-quality-report-listing/` | Modify | Task checkboxes, goal log, implementation summary and `scratch/` copies |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SKILL.md` lists `ceiling-report.sh` and `ceiling-report.test.sh` in the form of their neighbours, with one line on when to run the report | `rg -n 'ceiling-report' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints four lines (Resource Domains bullet, loading-table row, Scripts bullet for the report, Scripts bullet for the test) and exits 0 |
| REQ-002 | The `SKILL.md` version moves to 1.1.0.0 and a matching changelog file names the report and the listing | `SKILL.md` line 5 and `changelog/v1.1.0.0.md` both read `version: 1.1.0.0`, and the changelog text names `ceiling-report` and says the mode now lists it |
| REQ-003 | The report and its test are unchanged and the test passes | `bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` prints `All ceiling report test cases passed` and exits 0, and `git status --porcelain` shows nothing under `scripts/` |
| REQ-004 | The compiled sk-code manifest is fresh | `node .skilled/bin/compiled-route-guard.cjs` lists `sk-code` as `fresh` and exits 0 |
| REQ-005 | The leaf manifests are fresh | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` ends with `checked=14 fresh=14 failed=0` and exits 0 |
| REQ-006 | The sk-doc validator passes on the edited `SKILL.md` and the new changelog file | `validate_document.py` prints `VALID` and `Total issues: 0` for each and exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The quality `README.md` lists the report where it lists the two checkers, and its version matches the changelog | Two rows name `ceiling-report.sh`, README line 11 reads `version: 1.1.0.0`, `validate_document.py --type readme` prints `VALID`, and `scripts/README.md` is byte-identical to its saved copy |
| REQ-008 | The Hermes copy is not regenerated by the builder | `git status --porcelain -- .hermes/skills/sk-code-quality` prints nothing, and the `--check` result is recorded as drift naming `sk-code-quality` until the orchestrator runs the write form |
| REQ-009 | Only the files in the table above changed | The saved `git status --porcelain` snapshot compared with the final one differs by exactly the modified `SKILL.md`, the modified `README.md` and the new changelog file, plus the two manifests only if they were refreshed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent that follows the `SKILL.md` listing runs the report the way the listing says. The direct form `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh <file>` prints the marker lines and a `markers=N no-trigger=N no-signal=N` line and exits 0.
- **SC-002**: The skill version, its newest changelog file and the README version all read 1.1.0.0.
- **SC-003**: The compiled routing gate, the leaf manifest gate and the root metadata gate report no failure that this fix caused.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `ceiling-report.sh` is a Python script behind a `.sh` name, so `bash ceiling-report.sh` fails with `import: command not found` | High | Every listing and every check runs it directly (`ceiling-report.sh <file>`), never through `bash`. Only the test file runs through `bash` |
| Risk | The brief asks for a re-mint of the compiled manifest, but the manifest hashes only the hub `SKILL.md`, `hub-router.json` and `mode-registry.json` (`.skilled/bin/lib/compiled-route-manifest.cjs:435-438`), not this child `SKILL.md` | Med | Run the read-only freshness check first and refresh only if it reports stale. A sibling child that edits a hub input can make it stale for a reason this fix did not cause |
| Risk | The Hermes copy `.hermes/skills/sk-code-quality/SKILL.md` mirrors the edited file, so its `--check` fails after the edit | Med | The orchestrator runs the write form once after every child is built. The pre-commit mirror gate blocks the commit until then |
| Risk | Version choice is a judgment between patch (docs) and minor (new bundled resource) | Low | The rule is stated in `plan.md`. A different choice changes three version strings and the changelog file name together |
| Dependency | The earlier child's script and test, already committed | Low | Phase 1 reruns the test and the report before any edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The bump is minor (1.1.0.0) by the rule in `plan.md`. The operator can overrule it before the build, and the three version strings and the changelog file name would change together.
<!-- /ANCHOR:questions -->

---
