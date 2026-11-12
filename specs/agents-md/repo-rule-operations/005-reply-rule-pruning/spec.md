---
title: "Feature Specification: Retire three low-value reply rules and fold their unique clauses into the surviving rules"
description: "Five reply rules loaded around every reply and three of them mostly restated other rules. This packet retires those three and moves their unique clauses into communication.md and uncertainty-and-honesty.md."
trigger_phrases:
  - "reply rule pruning"
  - "retire three low value reply rules and fold"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Retire three low-value reply rules and fold their unique clauses into the surviving rules

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Gate 6 in `AGENTS.md` named five reply rules, and a session that followed it read all five around its replies. Three of them, `answer-the-actual-request.md`, `communication-prose.md` and `communication-decisions.md`, mostly restated `communication.md`, `scope-discipline.md`, `evidence-and-proof.md` and `AGENTS.md`. The operator asked which rules add too little for their load and chose to remove all three.

### Purpose
The reply rule set is two files, and every clause the three retired files alone carried survives in one named home.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ wc -c .skilled/repo-rules/{communication,communication-prose,communication-decisions,communication-handoff,answer-the-actual-request}.md
   10053 .skilled/repo-rules/communication.md
    6326 .skilled/repo-rules/communication-prose.md
    7116 .skilled/repo-rules/communication-decisions.md
   10774 .skilled/repo-rules/communication-handoff.md
    4984 .skilled/repo-rules/answer-the-actual-request.md
$ node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs
[repo-rules-check] 1/11 PASS count parity        - files=13 triggerRows=13 indexRows=13
[repo-rules-check] RESULT: PASSED (11/11 checks)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Retire `answer-the-actual-request.md`, `communication-prose.md` and `communication-decisions.md` in the order the retire workflow sets: pointer, index row, trigger row, file.
- Fold the clauses only those files carried into `communication.md` and `uncertainty-and-honesty.md`.
- Repair the two rule-loading experiment inputs and the playbook scenarios that run them, so every arm builds against the ten-rule corpus.
- Repoint everything that named the retired files: Gate 6, the router rows, the compliance and experiment scripts with their tests, the doctor manifest and the docs that count the rules.

### Out of Scope
- Trimming the eight action-triggered rules - they load only when their action happens, so they are not the reply load.
- The double load of `AGENTS.md` through the `~/.claude/CLAUDE.md` link - it is a separate change to a file outside this repository.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/repo-rules/answer-the-actual-request.md` | Delete | Retired |
| `.skilled/repo-rules/communication-prose.md` | Delete | Retired |
| `.skilled/repo-rules/communication-decisions.md` | Delete | Retired |
| `.skilled/repo-rules/communication.md` | Modify | Takes the sentence, punctuation, decision and long-stretch clauses |
| `.skilled/repo-rules/uncertainty-and-honesty.md` | Modify | Takes the invented-constraint and honest-decline clauses |
| `.skilled/repo-rules/communication-handoff.md` | Modify | Section pointers follow the merged rule |
| `AGENTS.md` | Modify | Gate 6 names two reply rules |
| `REPO RULES.md` | Modify | Three trigger rows and three index rows removed, two rows widened |
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/measure-rule-compliance.py` | Modify | Reply rule and punctuation checks key to `communication.md` |
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/rule-experiment.py` | Modify | Reply rule set is `communication.md` |
| `.skilled/skills/sk-doc/scripts/tests/test_measure_rule_compliance.py` | Modify | Fixture follows the script |
| `.skilled/skills/sk-doc/scripts/tests/test_rule_experiment.py` | Modify | Fixture follows the script |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Modify | Regenerated from the root documents |
| `.skilled/skills/sk-doc/sk-create-repo-rule/references/creation-standards.md` | Modify | Misreading-guard row merged |
| `.skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-loading-experiments/card-generator-sync.md` | Modify | Card count follows the rule count |
| `.skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-loading-experiments/card-arm-run.md` | Modify | Reply-rule miss definition follows the script |
| `.skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-loading-experiments/experiment-environment-build.md` | Modify | Expected output follows a real build |
| `.skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index entries for the two scenarios |
| `specs/agents-md/repo-rule-operations/002-repo-rule-advisor-surfacing/007-table-wording-experiment/experiment/arms.json` | Modify | The current arm rebuilds the long wording, since the short wording is live |
| `specs/agents-md/repo-rule-operations/002-repo-rule-advisor-surfacing/008-gate5-card-pilot/experiment/arms.json` | Modify | Three rows for retired rules removed |
| `README.md` | Modify | Rule counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The corpus stays loadable with ten rules | `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` prints `files=10 triggerRows=10 indexRows=10` and `RESULT: PASSED (11/11 checks)` |
| REQ-002 | Nothing live points at a retired file | `rg` for the three file names over `AGENTS.md`, `REPO RULES.md`, `.skilled/repo-rules/` and the two scripts prints nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every clause only a retired file carried has one home or a recorded reason for going | The ledger in `implementation-summary.md` maps each one |
| REQ-004 | The shipped manifest matches the root documents | `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` prints `PASS` |
| REQ-006 | Every experiment arm builds | `rule-experiment.py build` on both arms files prints four `built <arm>` lines and exits 0 |
| REQ-005 | The script suites still pass | `python3 -m pytest` over the two test files prints `20 passed` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls .skilled/repo-rules | wc -l` prints 10.
- **SC-002**: `wc -c .skilled/repo-rules/communication.md .skilled/repo-rules/communication-handoff.md` totals under 26,000 bytes, against 39,253 for the five files before.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `check-repo-rules.cjs` line ceiling of 250 | The merged `communication.md` fails the corpus gate above it | Trim trigger phrases and wrapped lines until the file is under the ceiling |
| Risk | A clause is lost in the merge | Med | The ledger in `implementation-summary.md` names every moved and dropped clause, and git holds the retired files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
