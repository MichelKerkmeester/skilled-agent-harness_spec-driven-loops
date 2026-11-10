---
title: "Feature Specification: Playbook root and stale refs"
description: "The playbook validator also checks backticked paths in each root playbook file, the 70 root warnings that check finds are corrected or explained, and six stale references phase 002 left as found are fixed."
trigger_phrases:
  - "playbook root and stale refs"
  - "phase 3 playbook root and stale refs"
  - "root playbook backtick check"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Playbook root and stale refs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-12 |
| **Branch** | `worktrees/121-playbook-root-refs` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-playbook-path-repair |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the doc version and playbook paths packet. Phase 002 brought the validator's backticked path warnings from 258 to 1, but its review found that the check never reads the root `manual-testing-playbook.md` of a package, and its summary listed six stale references outside its scope. This phase closes both.

**Scope Boundary**: the validator's root-file check and its test, backticked paths in the 57 root playbook files, and the six named stale references.

**Dependencies**:
- Phase 002 merged on main. Per-doc versions from phase 001 are live, so the pre-commit hook raises each changed doc's version.

**Deliverables**:
- The validator checks root files, and prints exactly as many root warnings as the Remaining table lists, with the scenario count still 1.
- The six stale references fixed or closed with evidence.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`backtickPathChecks` in `validate-playbook-package.cjs` runs inside the operator scenario loop only, so a root playbook file can cite a path that no longer exists and nothing reports it. Run over the 57 root files on origin/main, the same check prints 70 warnings in 13 files. 44 of them are in mcp-click-up: 7 name test modules of the external cupt project and 37 name feature catalog files without their `feature-catalog/` prefix. Separately, phase 002 left six stale references as found: `.codex/settings.json` in cli-codex `references/codex-tools.md`, the short `pi/sk-vision.ts` form in the sk-vision feature catalog, a "Phase 011's" label in cli-cursor text, a deep-ai-council scorer command whose filter may select no test, a dead path in sk-design-diagram's export reference and a "five" yaml count in a doctor test environment scenario.

### Purpose
Root playbook files are checked like scenarios, every root path resolves or has a written reason, and the six stale references read true.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- RR-1: run `backtickPathChecks` on each package's root file, report-only, with a test that fails before and passes after.
- RR-2: one ledger row per package with root warnings, RR-2.01 to RR-2.13, each fixed with the narrowest change in the order phase 002 used: correct the path, point at the successor, remove the reference when no successor exists, reword text that is not a repo path, or list it in Remaining.
- SR-1 to SR-6: the six stale references.

### Out of Scope
- Making the warning blocking. It stays report-only.
- Hand-editing a `version:` line. The pre-commit hook raises changed docs.
- Root summary text that drifted from its scenario in ways other than a path, unless the path fix cannot be made without it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modify | Check the root file |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` | Modify | A root-file case |
| 13 root `manual-testing-playbook.md` files | Modify | Correct, remove or reword each backticked path |
| `cli-codex/references/codex-tools.md`, 14 sk-vision catalog files, 3 cli-cursor playbook files, one deep-ai-council scenario, sk-design-diagram `references/import-export/export.md`, one system-spec-kit scenario | Modify | SR-1 to SR-6 |
| `.skilled/skills/sk-doc/` SKILL.md, ROUTER.md, description.json, hub-router.json, mode-registry.json, `changelog/v2.3.9.0.md` | Modify, Create | sk-doc bump for the validator change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The validator checks root files, exits 0 under `--strict`, prints 1 scenario warning, and prints as many root warnings as the Remaining table has rows |
| REQ-002 | Every ledger row ends Fixed with a backticked command proof or Closed with a reason that names prevent-overengineering or an operator decision |
| REQ-003 | No skill is released for the link and wording corrections; sk-doc gets one bump and changelog entry for the validator change |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The root-file check has a test that fails without the change and passes with it |
| REQ-005 | Every Remaining row names the path, the file and line that cites it, and why it stays |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Ledger (20 rows)

Root warning counts are from `backtickPathChecks` run over each root file on origin/main `b4d4e90192`.

| ID | Item | Before |
|----|------|--------|
| RR-1 | Validator checks root files | n/a |
| RR-2.01 | `cli-classifier` root | 1 |
| RR-2.02 | `cli-external-orchestration` root | 3 |
| RR-2.03 | `cli-external-orchestration/cli-codex` root | 1 |
| RR-2.04 | `cli-external-orchestration/cli-cursor` root | 3 |
| RR-2.05 | `cli-external-orchestration/cli-opencode` root | 3 |
| RR-2.06 | `mcp-code-mode` root | 1 |
| RR-2.07 | `mcp-tooling/mcp-click-up` root | 44 |
| RR-2.08 | `mcp-tooling/mcp-obsidian` root | 4 |
| RR-2.09 | `sk-code/sk-code-obsidian` root | 3 |
| RR-2.10 | `sk-design/sk-design-chart` root | 1 |
| RR-2.11 | `sk-design/sk-design-diagram` root | 1 |
| RR-2.12 | `sk-doc` root | 2 |
| RR-2.13 | `system-skill-advisor` root | 3 |
| SR-1 | cli-codex `references/codex-tools.md` names `.codex/settings.json` | 4 lines |
| SR-2 | sk-vision catalog names `pi/sk-vision.ts` | 14 rows |
| SR-3 | cli-cursor text carries spec phase labels | 3 lines |
| SR-4 | deep-ai-council DAC-002 scorer command | 2 lines |
| SR-5 | sk-design-diagram export reference cites a dead path | 1 line |
| SR-6 | doctor update test environment says five yaml files | 1 line |

### Ledger format

The builder records every row in `implementation-summary.md`, one line each:

- `| <ID> | Fixed | <the command that proves it, in backticks, and what it printed> |`
- `| <ID> | Closed | <the written reason, naming prevent-overengineering or the operator decision> |`

Each warning left goes in a Remaining table in the same file:

- `| RM-<n> | <path, in backticks, and the file:line that cites it> | <why it stays> |`
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The validator's root warning count equals the Remaining rows and its scenario count is still 1.
- **SC-002**: All 20 ledger rows are Fixed or Closed in `implementation-summary.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A correction points at a file that covers a different subject | Med | Read each target before writing it; record the successor's subject in the ledger |
| Risk | The root check doubles a warning a scenario already prints | Low | Root and scenario files are separate inputs, each with its own dedupe |
| Risk | A root fix leaves the rest of its section contradicting the scenario | Med | When the path cannot be fixed alone, align the section's lines with the scenario and record why |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The validator still exits 0 under `--strict`; the warning stays report-only.
- **NFR-R02**: The same tree always prints the same count.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A test module of an external project, such as cupt's `test_tasks.py`: named so it does not read as a repo path, the way phase 002 named the external Webflow project.
- A file named relative to a sibling folder, such as a catalog file without `feature-catalog/`: given the prefix that resolves.

### Error Scenarios
- A cited file that never existed, or was deleted with no successor: the reference is removed.
- A file whose presence the scenario checks for, such as `.cursor/worktrees.json`: a Remaining row.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One validator line, 13 root files, six stale references |
| Risk | 5/25 | Report-only warning, doc edits |
| Research | 8/20 | Each removed target needs a successor lookup |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
