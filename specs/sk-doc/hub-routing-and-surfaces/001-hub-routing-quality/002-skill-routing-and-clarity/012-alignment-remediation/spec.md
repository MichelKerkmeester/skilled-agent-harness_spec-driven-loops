---
title: "Feature Specification: Phase 12: alignment-remediation"
description: "Close every finding of the alignment run over the routing program, from the two red CI gates to the documentation debt, and prove it by rerunning the battery rows that failed."
trigger_phrases:
  - "alignment remediation"
  - "phase 12 alignment remediation"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: alignment-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/266-alignment-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-regeneration-and-verification |
| **Successor** | None |
| **Handoff Criteria** | Every requirement in §4 is met or recorded with its evidence, and `validate.sh --recursive --strict` passes on the parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the skill routing and clarity program. The program's work landed in one range, and an alignment run over that range found the drift the eleven phases left behind. This phase closes it.

**Scope Boundary**: the files listed under Files to Change. The alignment command's own coverage gaps are fixed in an operator-local surface and stay outside this packet.

**Dependencies**:
- The alignment run artifacts, which hold each finding beside the command that reproduces it.
- Phase 011's regenerated mirrors and recorded baseline, which this phase starts from.

**Deliverables**:
- The fixes in scope, the rerun of every battery row that failed, and the gate output that proves both.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The routing program landed 18 first-parent commits across 507 files. An alignment run over that range recorded 34 findings: 2 P0, 5 P1 and 27 P2. Two are red CI gates that every change to this repository trips. Five are skill packages and routing signals that fail their own checks. The rest are documentation, changelog and tester gaps. Nine findings sit on files the range never touched, which the report attributes to pre-existing debt, and the operator asked for those to be fixed in the same pass.

### Purpose
Close every finding the run raised, so the nine failing battery rows pass and each document says what the tree actually does.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The run's own battery summary, quoted from the report's Battery section, and the nine rows it records as failing:

```text
Battery over ceb89382e4^..76585ec323 (18 first-parent commits, 507 files, 88 owners):
pass 379, fail 9, cannot run 0, not applicable 0

Failed rows, with the id the report gives each finding:
  BAT-01  S2-skill-package:.skilled/skills/cli-external-orchestration/cli-devin                               exit 1
  BAT-02  S2-validate-document:.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md     exit 1
  BAT-03  S2-validate-document:.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md  exit 1
  BAT-04  S2-validate-document:.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-scaffold-template.md                 exit 1
  BAT-05  S2-validate-document:.skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md                    exit 1
  BAT-06  S5-derived-counts                                                                                   exit 1
  BAT-07  S5-readme-references                                                                                exit 1
  BAT-08  S11-runtime-mirrors                                                                                 exit 1
  BAT-09  S15-ci-command-tree-parity                                                                          exit 1
```

Both P0 rows fail on one line of output from one command: `[runtime-mirror-sync] MISSING .opencode/commands/assets`. The S15 row shells out to the same check, so one fix clears both.
<!-- /ANCHOR:measured-behavior -->


---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the two red CI gates at their producer: the mirror expectation, and the tests that should have caught it.
- Restore the skills' own checks: the child-preamble rule, cli-devin's word cap and cli-orca's advisor signal.
- Document the leaf-scopes capability that shipped without documentation, in the skill, the contract, the playbook and the advisor.
- Sharpen the two README checkers, then carry every README they flag to a fix or a named allowance.
- Align the sk-code code standards across its two modes, its shared scripts and the doctor scripts, make the sk-code-skilled guides agree, and bring the five sk-code playbooks in line. Correct the stale comment, the missing tests, the prompt path, the duplicated workflow filters and the CI timeout in the same pass.

### Out of Scope
- The alignment command's own coverage gaps, K-3's surface-map row and K-4. An operator-local surface owns them and they are not tracked here.
- The six findings the critic overturned or folded into another, D-1, D-3, C-6, C-7, C-8 and C-9. D-3 is closed by the same edit as B-4.
- A new routing shape, a new skill or a new check. This phase changes what the existing checks and documents say, not what the routing does.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | Modify | The expected OpenCode command mirror reads the tree's ignore rules, so a gitignored shared folder is not an expected link. REQ-001, A-1, BAT-08, BAT-09 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs` | Modify | Cover the expected-mirror set and the MISSING branch, which is the gap that let the row stay green while the check was red. REQ-001, A-4 |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md` | Modify | The child-preamble rule reads unconditionally, beside the wrapper sentence rather than behind it. REQ-002, B-1 |
| `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` | Modify | The same rule carries the same gate, so it takes the same edit. REQ-002, B-1 |
| `.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modify | Back under 5000 words without dropping a rule the package check needs. REQ-002, B-2, BAT-01 |
| `.skilled/skills/cli-orca/SKILL.md` | Modify | SMART ROUTING states what the advisor signal does, and both operator phrasings select the skill. REQ-003, PRB-01, D-4 |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, `tests/scorer/route-gates.vitest.ts` | Modify | Added during the work: the live scorer capped a `list` prompt at the read-only floor, so a cli skill's tool name now counts as naming the skill. REQ-003, PRB-01 |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | Modify | Name `leaf-scopes.json` and what it narrows. REQ-004, B-3 |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | Modify | Add the `leaf-scopes.json` row to the class H/S matrix and correct the authored-file count. REQ-004, B-4, D-3 |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/classify-standalone-root-metadata.md` | Modify | Teach the narrowed scopes and add the scenario that exercises them. REQ-004, B-7 |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` | Modify | The playbook index carries the same scenario line and the same correction. REQ-004, B-7 |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modify | The leaf-inventory sentence names all five leaf roots. REQ-004, B-8 |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` | Modify | A bracketed filename template is a template, not a broken link. REQ-005, C-4 |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py` | Modify | A count claim needs a count noun, so an adjective or a compound word no longer reads as one. REQ-005, C-5 |
| `README.md` | Modify | 39 command entry points at the top, matching the COMMAND LIBRARY intro. REQ-005, K-1 |
| The eleven READMEs the references row names and the six the counts row names, listed in `plan.md` §5 | Modify | Fix the claim or the link at its source, or record the allowance by name. REQ-005, REQ-015, C-2, C-3, BAT-06, BAT-07 |
| `.opencode/plugins/README.md`, `.opencode/plugins/tests/README.md`, `.opencode/plugins/tests/helpers/README.md` | Modify | The three authored plugin READMEs answer both rows, so the checker misreads stop doing the work. REQ-005, REQ-015, K-3 |
| `.skilled/skills/sk-doc/sk-create-benchmark/SKILL.md` | Modify | Version bump for the `image-audit` rename the range made without one. REQ-006, C-1 |
| `.skilled/skills/sk-doc/sk-create-benchmark/changelog/v1.6.3.0.md` | Create | The entry the bump requires. REQ-006, C-1 |
| `.skilled/skills/system-spec-kit/runtime/lib/utils/index-scope.ts` | Modify | The comment describes the exclusion that is in the array, not the one the range removed. REQ-007, A-2 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Modify | Restore the `..` link case and the dangling or looping link case the guard still needs. REQ-007, A-3 |
| `.skilled/commands/doctor/scripts/tests/test_audit_descriptions.py` | Modify | Add a `walk_commands` case over the second command tree. REQ-007, A-5 |
| `.skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md` | Modify | Add the OVERVIEW section the reference rule requires. REQ-008, B-5, BAT-05 |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-scaffold-template.md` | Modify | Add the OVERVIEW section. REQ-008, B-6, BAT-04 |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md` | Modify | Add the OVERVIEW section. REQ-008, B-6, BAT-02 |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md` | Modify | Add the OVERVIEW section. REQ-008, B-6, BAT-03 |
| `.skilled/agents/prompt-improver.md` | Modify | Cite `.skilled/commands/prompt/improve.md`, the command that exists, and let the three mirrors regenerate from it. REQ-009, D-2 |
| `.github/workflows/opencode-dual-version.yml`, `.github/workflows/skill-advisor-stress.yml`, `.github/workflows/spec-kit-check.yml` | Modify | Each trigger lists `.opencode/plugins` once. REQ-010, K-2 |
| `.github/workflows/changed-packet-validation.yml` | Modify | The job timeout is sized from its own runs, so the full-history checkout finishes inside it. REQ-011 |
| `.skilled/skills/sk-code/sk-code-quality/`, `.skilled/skills/sk-code/sk-code-review/`, `.skilled/skills/sk-code/shared/scripts/` | Modify | The two modes, their shared checks and the standards they cite state one standard. REQ-012 |
| `.skilled/commands/doctor/scripts/ci-report.cjs`, `ci-scaffold.cjs`, `ci-toggle.cjs`, `sk-code-setup-check.cjs`, `sk-code-quality-config.cjs` | Modify | The CI and sk-code doctor scripts report against the same standard. REQ-012 |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` and its `manual-testing-playbook/language-standards/` guides | Modify | The guides agree with each other on the rules they share. REQ-013 |
| `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` | Modify | The hub playbook matches its mode. REQ-014 |
| `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md` | Modify | The CI playbook matches its mode. REQ-014 |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` | Modify | The quality playbook matches its mode. REQ-014 |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md` | Modify | The review playbook matches its mode. REQ-014 |
| `.skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md` | Modify | The skilled playbook matches its mode. REQ-014 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

The P0 table holds the requirement that closes a red CI gate. Every other requirement is in the P1 table because the operator asked for every P1 and P2 finding to be fixed, so none of them may be deferred without a decision.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The expected OpenCode command mirror skips the shared `assets` folder the tree git-ignores, so `sync-runtime-mirrors.cjs --check` and `validate-command-tree-parity.sh` both exit 0, and the test file covers the expected-mirror set and the MISSING branch that let the row stay green. Findings A-1, A-4, BAT-08, BAT-09. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The child-preamble rule reads unconditionally in every cli skill that carries it, and `validate_skill_package.py` passes on cli-devin with its SKILL.md under the 5000-word cap. Findings B-1, B-2, BAT-01. |
| REQ-003 | The two Orca phrasings the probe and the lane used return cli-orca as top-1, and cli-orca's SMART ROUTING says what its advisor signal actually does. Findings PRB-01, D-4. |
| REQ-004 | `leaf-scopes.json` is documented in the skill that owns the generator, in the root metadata contract, in the standalone playbook and in the advisor's leaf inventory, which names all five leaf roots. Findings B-3, B-4, D-3, B-7, B-8. |
| REQ-005 | `check_readme_references.py` stops reading a bracketed filename template as a broken link and `check_derived_readme_counts.py` stops reading an adjective plus a noun as a count claim. The READMEs whose claim or link is wrong are corrected, including the root README's command count and the three plugin READMEs, so both README rows pass. Findings C-2, C-3, C-4, C-5, K-1, K-3, BAT-06, BAT-07. |
| REQ-006 | sk-create-benchmark carries a version bump and its changelog entry for the `image-audit` rename. Finding C-1. |
| REQ-007 | The index-scope comment describes the exclusion that is in the array, and the two missing test cases are restored: quality-gate's `..` link and dangling-link cases, and a `walk_commands` case over the second command tree. Findings A-2, A-3, A-5. |
| REQ-008 | The three skill scaffolds and `auto-mode-contract.md` carry an OVERVIEW section, so `validate_document.py` exits 0 on each. Findings B-5, B-6, BAT-02, BAT-03, BAT-04, BAT-05. |
| REQ-009 | prompt-improver cites the command that exists, and the three generated mirrors carry the corrected path after the next regeneration. Finding D-2. |
| REQ-010 | Each workflow trigger lists `.opencode/plugins` once, with no path filter duplicated. Finding K-2. |
| REQ-011 | The double cancellation in CI run 40744018366 stops, because the changed-packets job carries a timeout sized from its own runs on the repository formula, so the full-history checkout finishes inside it. |
| REQ-012 | sk-code-quality, sk-code-review, the shared sk-code scripts and the CI and sk-code doctor scripts state one code standard, and each rule they share is stated once. |
| REQ-013 | The sk-code-skilled guides agree with each other on the rules they share, so a reader who moves between them is not told two things. |
| REQ-014 | The five sk-code manual-testing playbooks, the hub, ci, quality, review and skilled, each match the mode they belong to. |
| REQ-015 | Every README the battery walks carries a per-file disposition, and no README is edited only to satisfy a checker misreading, so each remaining suppression appears in the checker's allowlist by name. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every one of the nine battery rows that failed passes when its own command is rerun, BAT-01 through BAT-09.
- **SC-002**: Every finding in scope is fixed, and the record names the command and the output line that proves each one.
- **SC-003**: `validate.sh --recursive --strict` on the parent prints `RESULT: PASSED`.
- **SC-004**: No tracked file names an operator-local surface.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The alignment run artifacts | Each finding's reproducing command lives there and nowhere else | Copy every command and its output into `scratch/before.md` before the first edit |
| Dependency | Phase 011's regenerated mirrors | A stale mirror fails both P0 rows for a second reason and hides the real one | Rerun both mirror checks before the first mirror edit |
| Risk | A check is relaxed instead of a defect fixed | The row goes green while the tree stays wrong | Each finding names the command that failed, and the rerun uses that same command |
| Risk | A README is edited to satisfy a checker misreading | The document gets less correct to make the checker happy | Land the checker fix first, as REQ-015 requires |
| Risk | The word cap on cli-devin is met by deleting a rule | The package passes and the dispatch contract loses a rule | Remove repetition, and diff the rules the file lists before and after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: documentation, test and workflow changes with no service to measure.

### Security
- **NFR-S01**: No tracked file names an operator-local surface.
- **NFR-S02**: No change adds a credential, a token or a network call to a check that runs in CI.

### Reliability
- **NFR-R01**: Rerunning each fixed row gives the same verdict twice, because no fix depends on run order.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a finding whose reproducing command no longer fails is recorded as already gone, with the output that shows it.
- Maximum input: the two rows that walk all 55 READMEs are fixed last among the README work, after the checker rules settle.
- Failure path: a row that still fails after its fix blocks completion and is reported with its output, never waived.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Around 40 files across skills, workflows and docs, each change local to one check |
| Risk | 12/25 | Two red CI gates and one routing signal, with no product code and no schema change |
| Research | 4/20 | The run recorded every finding with a reproducing command |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Where a finding admits two fixes, the rule is fixed before the document, so no README is edited to satisfy a checker that misread it.
- The changed-packet-validation timeout needs the job's own run samples before it can be sized, and the formula that sizes it is already written down in the CI reference the repository keeps.
<!-- /ANCHOR:questions -->

---
