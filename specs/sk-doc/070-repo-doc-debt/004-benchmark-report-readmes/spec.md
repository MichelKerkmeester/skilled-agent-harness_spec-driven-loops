---
title: "Feature Specification: Benchmark report READMEs: restructure 235 legacy reports to the numbered template and resolve their broken references"
description: "235 benchmark report READMEs under 13 skills and 2 Pi extensions were written in an older report layout, so each failed the README validator with one blocking error while regenerating them from their JSON records would have lost facts. This packet restructures them in place into the numbered layout without changing a fact, then resolves the broken references among them."
trigger_phrases:
  - "benchmark report readmes"
  - "benchmark report readmes restructure 235 legacy reports"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Benchmark report READMEs: restructure 235 legacy reports to the numbered template and resolve their broken references

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/231-repo-doc-debt` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every one of the 235 reports validates with no blocking error, and the line checker proves no non-heading text moved |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
235 benchmark report READMEs, under 13 skills and 2 Pi extensions, were written in an older layout: a title, sometimes a derived-record line, a `>` line, a verdict line, then `## Run`, `## Files` and `## Reading This Folder`. The README validator requires an overview section, so each of the 235 failed with exactly one blocking error, "Missing required section: overview". Regenerating them from their JSON records was rejected, because the current renderer loses facts on records the retired benchmark writer left behind.

### Purpose
Every one of the 235 reports validates clean and reads in the numbered layout the template asks for, carrying the same facts it carried before.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --json-out audit.json
  "template_invalid": 237,
  "broken_references": 102,
  "missing_key_artifacts": 14,
$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .pi/extensions/pi-cache-optimizer/benchmark/reports/2026-08-17--manual-testing-playbook--cache-behavior/README.md --type readme --json
  "valid": false, "blocking_errors": [{"type": "missing_required_section", "message": "Missing required section: overview"}]
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite each of the 235 report READMEs into the numbered layout: `---` separators inserted, the Reading This Folder paragraph moved up as `## 1. OVERVIEW`, `## Run` renamed to `## 2. RUN` and `## Files` to `## 3. FILES`
- Prove no fact moved, by comparing each file's non-heading, non-separator, non-blank lines with its HEAD revision as a multiset
- Resolve the broken references that sit inside benchmark report READMEs
- Record the round in one patch entry per touched skill, with that skill's version carriers set

### Out of Scope
- READMEs outside a benchmark report folder - another lane owns them, and this packet does not touch them
- Teaching the audit that a gitignored path is not a broken reference - another lane owns that change, so the five `relaunch-run*.log` references stay as they are
- The report renderer itself - regenerating the 235 from their records is exactly what it cannot do without losing facts

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `*/benchmark/reports/*/README.md` | Modify | 235 files under 13 skills and 2 Pi extensions: numbered layout, facts unchanged |
| `.skilled/skills/sk-code/benchmark/reports/2026-06-02--d4r-live--live/README.md` | Modify | Names the removed benchmark runner in words instead of pointing at it |
| `*/changelog/v<next>.md` | Create | One patch entry for each of the 13 touched skills |
| `SKILL.md`, plus `description.json`, `mode-registry.json` and `hub-router.json` on the three hubs, plus the 13 `.hermes` copies | Modify | Version carriers |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modify | Records the 235 as valid, so the parity test reads the fix rather than drift |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the 235 restructured READMEs passes `validate_document.py --type readme --json` with `valid: true` and no blocking error |
| REQ-002 | A restructured README's non-heading, non-separator, non-blank lines are the same multiset as its HEAD revision |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every broken reference inside a benchmark report README is resolved, or left in place with the reason it stays written down |
| REQ-004 | Each of the 13 touched skills has one patch entry, and every version carrier for that skill names the same version |
| REQ-005 | The verdict parity test compares against a baseline that records the 235 as valid, so its diff is empty |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme --json` on all 235 reports returns `valid: true` with 0 blocking errors and 0 warnings
- **SC-002**: The audit's `template_invalid` count falls from 237 to the 2 READMEs another lane owns, and `test_readme_verdict_parity.py` prints `PARITY PASS: verdict diff is empty`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `validate_document.py` README checks | They define the layout the 235 must satisfy, and a change to them would move the target | Target layout read from reports the current renderer already wrote, not from the checks alone |
| Risk | A restructure drops or invents a line | High | The transform refuses any file outside the census, and the line checker proves the non-heading multiset unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

N/A: documentation-only change; no service runs.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a report folder with no README is outside the census, so the transform never sees it
- Maximum input: the largest report README goes through in one pass, because the transform keys on the heading sequence and carries no size limit
- Failure path: a README whose heading sequence differs from the census is refused and left as it was, and a second pass over a transformed file is refused by the idempotence guard
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 235 generated READMEs, 13 changelog entries and their carriers |
| Risk | 8/25 | Generated report text; a lost fact is the real cost, and the line checker is what covers it |
| Research | 8/20 | A census of one layout, plus the numbering the renderer already uses |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The two READMEs still template-invalid (`.skilled/commands/create/readme.md` and a `sk-create-repo-rule` fixture) and the audit's handling of gitignored paths belong to other lanes.
<!-- /ANCHOR:questions -->

---
