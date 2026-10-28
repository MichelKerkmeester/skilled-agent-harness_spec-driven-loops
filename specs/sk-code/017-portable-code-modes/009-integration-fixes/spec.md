---
title: "Feature Specification: Integration fixes: doctor quality shows applied rules, implement dashboard uses runner verdicts, outside-repository surface rules documented"
description: "/doctor:sk-code quality reports config, trust and tools but never the checklists, overrides or hygiene rules the gate would apply. The /speckit:implement dashboard prints a pass value the runner never reports, and no doc says how a repository outside the hub declares its rules."
trigger_phrases:
  - "integration fixes"
  - "integration fixes doctor quality shows applied rules implement"
  - "doctor quality applied rules"
  - "implement dashboard quality gate verdict"
  - "outside repository surface discovery"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Integration fixes: doctor quality shows applied rules, implement dashboard uses runner verdicts, outside-repository surface rules documented

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
| **Branch** | `worktrees/249-quality-integration-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:sk-code quality` status reports the config, its trust and its tools, and nothing about what the gate would apply in the repository: no checklist, no seat, no `## Rule overrides` row and no list of the hygiene rules in force. A repository that adds an override row cannot see whether the gate read it or refused it. The `/speckit:implement` dashboard prints `Quality gate: [not-run|pass|blocked]`, and `pass` is a value the quality runner never reports. A surface skill in an external repository is never discovered, and no doc says so or says what such a repository does instead.

### Purpose
The doctor shows, from the runner's own resolver, every checklist, override row, refusal and hygiene rule the gate would apply. The dashboard uses the runner's verdict values, and the quality docs state the outside-repository limit and the way around it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured on a scratch fixture whose `.sk-code/quality.json` names two checklists (one with a valid override section, one with a floor row) and disables `task`, with the `HEAD` doctor script copied beside the live one:

```text
$ node sk-code-quality-config.cjs status   (HEAD script)
Config: .sk-code/quality.json (repo, 196 bytes)
Trust: none (no configured check is declared)
Errors: none
Tools: none named
Layers: pre-commit untrusted, ci absent, post-edit absent
Hygiene: disabled hygiene.task
STATUS=OK SOURCE="repo" TRUST=none
exit=0
$ sed -n 76p .skilled/commands/speckit/assets/speckit-implement-presentation.txt   (HEAD)
Quality gate: [not-run|pass|blocked]
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an `applies` block to `/doctor:sk-code quality` status: each checklist the gate would load with its seats, its override rows or refusal reasons, the checklist errors and warnings, and the hygiene rules that apply and the ones disabled, resolved through `quality-gate.cjs --explain`.
- Fail the status with the runner's code when a declared checklist the gate would load is broken.
- Replace the dashboard's `Quality gate` values with the runner's gate vocabulary.
- Document in `sk-code-quality/SKILL.md` and `references/quality-config.md` how an external repository declares its rules, and state the discovery limit.
- Make the runner's run path honor `## Rule overrides`: a refused section ends the run `CONFIG_INVALID`, exit 3, and each accepted row is recorded in the envelope's `p0_p1_p2_decisions` (scope extended in the review round, operator-approved plan decision).
- List and check every repository `checklists[]` row the doctor's sample did not reach.
- Refuse an override row whose id no rule carries, from one registry read from the documents that declare the ids, and record `override-conflict` for two sources at one level that disagree, keeping the default and leaving the rule unverified.
- Report those conflicts per file in `--explain` and in the doctor status, make the registry throw rather than shrink on a malformed row, and name the conflicting rule id in the `UNVERIFIED` wording.

### Out of Scope
- `@orchestrate`, `@review`, `@code` and every speckit YAML - another lane owns them.
- Surface discovery code - the brief documents the limit and changes no discovery code.
- The `/doctor:sk-code quality` init path - it stays unchanged.
- READMEs, the feature catalog and playbooks that describe the doctor - the docs-alignment lane sweeps them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` | Modify | Status resolves and prints the applied rules and the rule conflicts through the runner |
| `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` | Modify | Three new cases and the one-process invariant restated |
| `.skilled/commands/doctor/assets/doctor-sk-code-quality.yaml` | Modify | Status phase keeps and renders the `applies` block |
| `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt` | Modify | Quality status table gains the Hygiene line and an Applied Rules block |
| `.skilled/commands/speckit/assets/speckit-implement-presentation.txt` | Modify | Dashboard quality gate uses the runner's gate values |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | Outside-repository paragraph, version step |
| `.skilled/skills/sk-code/sk-code-quality/references/quality-config.md` | Modify | Outside-repository section, doctor row, two known limits |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Modify | Run path reads each loaded checklist's override section, refuses a bad one and records accepted rows. `--explain` gains per-file `rule_conflicts` |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Modify | Two run-path override cases |
| `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` | Modify | `rule_overrides`, the decisions field, the refusal cause, the explain `rule_conflicts` field and the `unverified` wording |
| `.skilled/skills/sk-code/shared/scripts/lib/rule-registry.cjs` | Create | The rule id registry, read from runner-contract.md section 5, code-quality-standards.md sections 3 to 5 and review-core.md section 8 |
| `.skilled/skills/sk-code/shared/scripts/tests/rule-registry.test.cjs` | Create | Derivation, table agreement and shipped-checklist cases |
| `.skilled/skills/sk-code/SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json`, `changelog/v3.9.13.0.md` | Modify, Create | Hub version 3.9.13.0 for the shared module |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its archived twin | Modify | Regenerated by the guard's own repair after the hub version step |
| `.skilled/commands/doctor/scripts/tests/README.markdown` | Modify | The suite row names what the status covers and the processes it starts |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.7.0.md` | Create | Changelog entry |
| `.skilled/skills/system-spec-kit/SKILL.md`, `changelog/v2.12.15.0.md` | Modify, Create | Version step and changelog entry for the dashboard |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `status --json` carries `applies.checklists`, one row per checklist the gate would load, each with `seats` from the runner's `sources` and `overrides` as the shared linter read them, resolved through `quality-gate.cjs --explain` and no copy of checklist discovery |
| REQ-002 | A refused override section is shown with each reason, and a valid one with each row |
| REQ-003 | `applies.hygiene` lists the core rules that apply and the disabled ones, and a disabled rule never appears as active |
| REQ-004 | Status stays read-only: no configured check runs and no file changes, and the init path is unchanged |
| REQ-005 | The dashboard's `Quality gate` field uses the runner's gate values and never `pass` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | A broken checklist the gate would load fails the status with the runner's error code, and an invalid config resolves nothing |
| REQ-007 | `sk-code-quality/SKILL.md` and `references/quality-config.md` state the outside-repository discovery limit and show `checklists[]` plus a `## Rule overrides` section as the way such a repository declares its rules |
| REQ-008 | The existing doctor tests stay green and the presentation and route contracts still pass |
| REQ-009 | A gate run that loads a checklist with a refused `## Rule overrides` section ends `ERROR` with `CONFIG_INVALID`, exit 3, naming the file and the reasons, and each accepted row is recorded in `rule_overrides` and in the envelope's `p0_p1_p2_decisions` ahead of `PENDING_AGENT_JUDGMENT` |
| REQ-010 | The doctor status fails with `CONFIG_INVALID` on a refused section, as the gate does |
| REQ-011 | Every repository `checklists[]` row the sample did not reach is listed as declared, its file checked and its section linted, with a missing file failing as `CHECKLIST_MISSING` |
| REQ-012 | The no-process test runs on a trusted config and pins the runner path |
| REQ-013 | A run that loads a checklist with a row whose id no declaring document carries refuses that file `CONFIG_INVALID`, exit 3, from one registry derived from runner-contract.md section 5, code-quality-standards.md sections 3 to 5 and review-core.md section 8, while the linter's contract stays unchanged |
| REQ-014 | Two checklists at the same precedence level that disagree on one rule for one file are recorded as `override-conflict <id> <file> <file>`, the rule keeps its default and joins `summary.unverified`, and rows with the same action and text agree |
| REQ-015 | A test fails when a documented id table and the registry diverge, and one fails when any shipped override row names an unknown id |
| REQ-016 | `--explain` reports per-file `rule_conflicts` from the runner's own precedence pass, and the doctor status prints `override-conflict <id> <file> <file>` for a sampled file that reaches both, noting that the gate reads `UNVERIFIED` there, without failing the status |
| REQ-017 | The registry throws, naming file and line, on a table body row whose first cell names no id and on a section 5 `hygiene.` row that does not match the `hygiene.<name>` template |
| REQ-018 | `sk-code-quality/SKILL.md` and the envelope grammar in `runner-contract.md` say that `UNVERIFIED` and `summary.unverified` also cover a conflicting rule id |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` fails its new cases against the `HEAD` script and passes 15 of 15 against the changed one, and the two `run overrides` runner cases fail against the `HEAD` runner and pass against the changed one.
- **SC-002**: `/doctor:sk-code quality` status in this repository prints the 15 checklists every tracked file resolves to, and its `STATUS` line is unchanged.
- **SC-003**: `rg -n 'Quality gate:' speckit-implement-presentation.txt` prints the runner's gate values with no `pass`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `quality-gate.cjs --explain` multi-file output and its `sources` and `overrides` fields | The status cannot resolve without them | The status reads `DEGRADED` with the reason when explain does not answer, and the field shapes are pinned by the runner suite |
| Risk | A sample misses a checklist that selects one file deep in a folder group | Med | In this repository the sample resolved the same 15 checklists as all 120,280 tracked regular files, the status names its sample size, and the limit is documented |
| Risk | Status time on a large repository | Low | Measured 1.3 to 1.8 s on 120,767 listed files, and the sample is capped at 4000 files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Status in this repository finishes in under 3 seconds. Measured 1.30 to 1.77 s, against 0.09 s before.

### Security
- **NFR-S01**: The doctor starts no configured command. Besides git it starts only the runner with `--explain`, as an argv array with no shell, which starts no check and writes no file: one process per batch of 500 sampled files, run one after another, so up to eight at the 4000-file cap.

### Reliability
- **NFR-R01**: A runner that times out or prints no explain document leaves the status `DEGRADED` with the reason, never a silent empty list.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a repository with no regular file prints `Checklists: not resolved, the repository holds no regular file to resolve` and keeps its state.
- Maximum input: the sample stops at 4000 files and says `capped at 4000`, and explain runs in batches of 500 paths to stay below the argument limit.
- Failure path: an invalid config resolves nothing and prints `Hygiene rules: none apply`, and a missing declared checklist ends `STATUS=FAIL ... ERROR=CHECKLIST_MISSING` with exit 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Nine files, about 200 lines of code and tests, two skills and two commands |
| Risk | 7/25 | Read-only status, one new process, no contract field removed |
| Research | 6/20 | Measured the sample against the full-tree union |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Judgment calls are recorded in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---
