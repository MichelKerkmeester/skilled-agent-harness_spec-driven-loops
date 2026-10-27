---
title: "Feature Specification: doc checker accuracy and README debt fixes"
description: "validate_document.py fails benchmark companion files and fixture files on README rules, the README reference and count checkers fail most READMEs on slash commands and prose while real broken paths and stale counts hide among them, and READMEs carry stale paths, rows and counts."
trigger_phrases:
  - "alignment fixes"
  - "doc checker accuracy fixes"
  - "benchmark companion document type"
  - "readme reference checker false positives"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: doc checker accuracy and README debt fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `main` (worktree `237-doc-checker-fixes`) |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-audit-and-validator-accuracy |
| **Successor** | None |
| **Handoff Criteria** | Each checker's repo-wide hits drop only by false positives or corrected README debt, and the sk-doc script suite passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the repo doc debt specification.

**Scope Boundary**: three sk-doc checkers (`validate_document.py`, `check_readme_references.py`, `check_derived_readme_counts.py`), their tests, and the README references and counts the corrected checkers report as really broken.

**Dependencies**:
- `audit_readmes.py` reference helpers, which the README checkers now import.

**Deliverables**:
- A `benchmark_companion` document type and a singular `-fixture` folder skip.
- Audit-aligned path rules in the reference checker.
- Own-folder, plural-only count claims in the count checker.
- README fixes for every broken reference and stale count the corrected checkers find.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`validate_document.py` finds no rule for benchmark report companion files or for files in a `review-output-fixture/` folder, falls back to README rules and fails them for a missing Overview. `check_readme_references.py` reads slash commands, bare names from other folders and slashed prose as paths, and `check_derived_readme_counts.py` reads any number near a word like "file" as an inventory claim, so both fail most READMEs. `.skilled/bin/README.md` cites a spec folder that no longer exists, and the sk-code-quality README labels a sibling packet's checklist folder as its own.

### Purpose
Each checker reports only what it can prove, so a failure points at a real broken document, and the README debt those failures reveal is corrected.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
validate_document.py over 9,381 tracked non-spec .md files: 5,306 exit 0, 4,075 exit 1
  of which benchmark companion files failing on missing_required_section: 1,164
  of which files under a -fixture folder failing: 11
check_readme_references.py over 853 tracked READMEs:
  SUMMARY files=853 pass=394 fail=459, 5,760 unresolved (1,623 command, 4,120 inline, 17 link)
check_derived_readme_counts.py over 853 tracked READMEs:
  SUMMARY files=853 pass=629 fail=224, 801 failing claims
sed -n 194p .skilled/bin/README.md: cites system-speckit/028-.../050-.../001-dist-freshness-enforcement
ls .skilled/skills/sk-code/sk-code-quality/assets: no checklists/ folder
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Type the four benchmark report companion files in a run folder as `benchmark_companion`, and skip a folder whose name ends in `-fixture`.
- Make `check_readme_references.py` use `audit_readmes.py`'s token, path-shape and resolution helpers.
- Keep every link target, inventory table row and file tree line checked, and clear git-ignored runtime paths in batched calls per run, never one call per path.
- Merge both checkers with main's false-positive release (`0830f0bc0d`), keeping its skip classes and `readme-check` markers.
- Make `check_derived_readme_counts.py` count only plural inventories, skipping a number only when its own sentence names another path and not the README folder.
- Replace the stale spec path in `.skilled/bin/README.md` and the checklist label in the sk-code-quality README.
- Correct each README reference and count the restored checks report as really broken, and repoint the flowchart validator test at the script's current home.

### Out of Scope
- Count claims the checker cannot prove from a folder listing, such as test case totals and subset counts, when the claim is true on disk.
- Other benchmark files such as `serving-snapshot.md` and `report.md` - the report contract does not name them as companions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Companion type detection, `-fixture` folder skip, `--type` choice |
| `.skilled/skills/sk-doc/shared/assets/template-rules.json` | Modify | `benchmark_companion` rule set |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` | Modify | Audit path rules |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py` | Modify | Provable count claims only |
| `.skilled/skills/sk-doc/scripts/tests/test_benchmark_companion_typing.py`, `test_readme_reference_checker.py`, `test_derived_readme_counts.py` | Create | Regression tests |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Regenerate | The fixture README leaves the README verdicts |
| `.skilled/skills/sk-doc/scripts/tests/README.md` | Modify | Lists the new tests |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py` | Modify | Git calls run with fsmonitor off |
| `.skilled/skills/sk-doc/scripts/tests/test-flowchart-validator.sh`, `.skilled/skills/sk-doc/scripts/README.md` | Modify | The flowchart validator lives in sk-design-diagram |
| `.skilled/bin/README.md`, `.skilled/skills/sk-code/sk-code-quality/README.md` | Modify | Stale path, checklist label |
| `.skilled/skills/sk-git/README.md` and five READMEs with unprovable counts | Modify | Marker entries the merged checkers need |
| READMEs under system-spec-kit, system-skill-advisor, system-deep-loop, sk-prompt, mcp-tooling, sk-code, sk-design-md-generator, `.skilled/hooks/`, `.skilled/commands/doctor/` and `.claude/hooks/` | Modify | Broken references and stale counts |
| Changelog entries and version carriers for each touched skill, Hermes copies | Create, Modify | Patch releases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each checker change has a test that fails on the HEAD scripts and passes on the new ones, and the sk-doc script suite passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | A repo-wide run of each checker shows a lower hit count, and a sample of the removed hits shows only false positives. |
| REQ-003 | `.skilled/bin/README.md` cites no spec folder, and the sk-code-quality checklist label names the folder its link opens. |
| REQ-004 | Every link target, inventory row and tree line is still checked, and each broken reference and stale count the checkers report is corrected or classified. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py` exit-1 count falls from 4,075 to 2,900 with no file going from exit 0 to exit 1.
- **SC-002**: with this phase's checkers, reference hits fall from 5,760 to 9 and count hits from 801 to 76, and every remaining hit is classified. Repo-wide totals are now measured with the checkers merged with main's false-positive release: over 979 READMEs, 1,069 reference lines in 326 failing READMEs and 83 count lines in 55, with no README failing that main's checker passes and the root README at 0.
- **SC-003**: `run-script-tests.sh` passes every suite file with git's fsmonitor turned off.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `audit_readmes.py` helpers | A change there changes both checkers | Both checkers import the helpers, so the audit and the checkers cannot drift apart |
| Risk | Stricter path rules drop a real broken path | Med | A test keeps `./missing.sh`, a dead link and a missing `.skilled/` command path failing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The reference checker makes no git call per reference. Git-ignored clearing is two batched `git check-ignore` calls per run with fsmonitor off.

### Reliability
- **NFR-R01**: No file that passed `validate_document.py` before fails after.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a README with no references or numbers passes both checkers.
- Maximum input: a run folder nested under a grouping folder (`reports/<group>/<run>/`) still types its companions.
- Failure path: a companion name outside a run folder, and a numbered spec folder ending in `-fixture`, keep their old handling.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Three checkers, one rule file, three test files, about 40 README fixes |
| Risk | 6/25 | Checker output only; no runtime behavior |
| Research | 7/20 | Repo-wide before and after runs with removed-hit classification |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
