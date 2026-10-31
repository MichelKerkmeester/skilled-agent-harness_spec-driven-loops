---
title: "Feature Specification: Phase 4: command-contract-and-readme"
description: "The sk-create-command contract named neither /doctor:symlink nor /doctor:install, and the root README had no setup section of its own. This phase gives the doctor family both commands in the contract and puts the setup path in a top-level README section built on the two commands."
trigger_phrases:
  - "command contract and readme"
  - "phase 4 command contract and readme"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: command-contract-and-readme

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-31 |
| **Branch** | `worktrees/304-doctor-symlink-install` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-integration-and-docs |
| **Successor** | 005-central-doctor-playbook |
| **Handoff Criteria** | Both commands are described by the sk-create-command contract and the root README, and `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Doctor symlink and install commands: link Skilled into user project repos and guide setup specification.

**Scope Boundary**: The published command contract and the root README only. The engine, both routers' bodies, the workflow YAMLs and the presentation texts are frozen by the two earlier phase contracts, so this phase moves two `argument-hint` lines and no other line of either router.

**Dependencies**:
- `001-symlink-engine-and-command/scratch/engine-contract.md`
- `002-install-guide-router/scratch/install-contract.md`
- `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`, the consumer shape this phase edits

**Deliverables**:
- Both commands in the doctor family's router path, argument hint and selector text
- Four execution targets, eight owned assets, four loader requirements, two destructive operations and two invocation aliases
- A coverage sentence that reads "37 of the 41 shipped commands"
- An `argument-hint` of 128 characters for `/doctor:symlink`, with `<list>` in place of `<csv>`
- A top-level README setup section, sections renumbered 6-17, and the DOCTOR section's count, rows and entries
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`command-contract.json` is the shape `sk-create-command` publishes for a command family, and its doctor entry named neither new command: no `/doctor:symlink` target workflow, no install workflow, no loader requirement and no destructive operation for either. A consumer that walks the file therefore sees a doctor family of fourteen and has no field that dispatches the two commands this packet ships. The root README had the same gap from the reader's side. `/doctor:install` and `/doctor:symlink` first appeared in the DOCTOR command table, so a reader who wanted to link Skilled into their own project had one paragraph in Quick Start and a table row to work from.

### Purpose

Describe both commands in the contract a consumer reads, and give the root README a top-level setup section built on them, so a walk of the contract reaches every doctor target and a reader reaches the setup path from the table of contents.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check
routers=41 clean=41 path-drift=0 shape-drift=0

$ node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs
STATUS=OK
```

The `41` in this block is the shipped router count behind the contract's coverage sentence, `37 of the 41 shipped commands`, and that sentence names the four that carry no family entry. The `STATUS=OK` line is the index check that reads the same router files, so a router the contract describes and an index that lists it cannot drift apart without one of the two checks failing.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Name both commands in the doctor family's `router_path`, `argument_hint` and selector text in the sk-create-command contract
- Add the four execution targets, the eight owned assets, the four loader requirements, the two destructive operations and the two invocation aliases
- Move the contract's coverage sentence to "37 of the 41 shipped commands"
- Shorten the `argument-hint` of `symlink.md` to 128 characters and spell the runtime list `<list>`
- Add the root README's top-level "Use It In Your Own Project" section, renumber the sections after it, update their anchors, and update the DOCTOR section's count, rows and entries

### Out of Scope
- The feature catalogs - they stay in their own skills, and the doctor scenarios move to one central playbook in phase 005
- Any commit, stage or push - the packet records the work and the orchestrator owns the commit
- The engine, both routers' bodies, the workflow YAMLs and the presentation texts - the two phase contracts freeze them, and only the two `argument-hint` lines move here

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | The doctor family entry gains both commands: the router path, argument hint and selector text, four execution targets, eight owned assets, four loader requirements, two destructive operations and two invocation aliases, and the coverage sentence reads "37 of the 41 shipped commands" |
| `.skilled/commands/doctor/symlink.md` | Modify | The `argument-hint` is 128 characters, under the 140-character soft budget, and `<csv>` became `<list>` |
| `README.md` | Modify | The top-level `## 5. 🔗 USE IT IN YOUR OWN PROJECT` section and its five subsections, sections renumbered 6-17 with their anchors, the Keep It Healthy sentence, and the DOCTOR section's count, two rows and two entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The doctor family entry names both commands in its `router_path`, `argument_hint` and selector text, and carries four execution targets, eight owned assets, four loader requirements, two `destructive_policy` operations and two invocation aliases, so the file parses and 16 of its lines name the new commands or their assets. |
| REQ-002 | The contract's coverage sentence reads "37 of the 41 shipped commands". |
| REQ-003 | Every shipped command router stays consistently described, so `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` exits 0 and prints `routers=41 clean=41 path-drift=0 shape-drift=0`. |
| REQ-004 | The `argument-hint` of `symlink.md` is 128 characters, under the 140-character soft budget, and spells the runtime list `<list>`. `install.md` stays at 56 characters, and each router passes `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type command` with `Total issues: 0`. |
| REQ-005 | The root README carries the top-level "Use It In Your Own Project" section, its later sections are renumbered 6-17 with their internal anchors updated, and `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type readme README.md` prints `Total issues: 0`. |
| REQ-006 | The DOCTOR section reads "Sixteen commands", carries a table row after `/doctor:setup` for each of `/doctor:install` and `/doctor:symlink`, and carries one entry per command. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The two doctor contract tests read the new contract fields, so `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 with `7 suite(s) passed, 0 failed`, node:test totals `pass 991` and `fail 0`, `doctor-install-contract.test.cjs` at 16/16 and `doctor-symlink-contract.test.cjs` at 34/34. |
| REQ-008 | Each router's authored name is kebab-case, so `python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py` prints `PASS: authored artifact name is kebab-case` and exits 0 for each, and `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `command-contract.json` parses, and 16 of its lines name the new commands or their assets.
- **SC-002**: `generate-command-routers.cjs --check` exits 0 with `routers=41 clean=41 path-drift=0 shape-drift=0`, which is the census the coverage sentence counts.
- **SC-003**: Both routers and the root README each print `Total issues: 0` from `validate_document.py`, and both router names pass the kebab check.
- **SC-004**: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 with `7 suite(s) passed, 0 failed`, `pass 991` and `fail 0`, and `command-catalog-mirror-check.cjs` prints `STATUS=OK`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The sk-create-command contract | A missing field leaves a doctor target a consumer cannot dispatch | Edit the contract in the same pass as the routers, and let the two contract tests read the fields |
| Dependency | The command router generator | A router the generator cannot describe fails its `--check` | Run `--check` from the final tree and require `routers=41 clean=41` |
| Risk | The README's numbered sections | A stale internal anchor sends a reader to the wrong section | Update the anchors in the same edit and hold the file to the readme validator |
| Risk | A paragraph that overstates a command | A reader expects `/doctor:install` to link, and it only guides | Correct the claim at review, and state the read-only role in the section itself |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The contract stays one JSON asset, so a consumer reads no second file to reach a doctor target.
- **NFR-P02**: The contract edits add no test runtime, and the doctor suite holds the same seven suites it held before this phase.

### Security
- **NFR-S01**: No edited file holds a credential, and the README states that `/doctor:install` prints commands for the operator to run rather than running them.
- **NFR-S02**: No README line tells a reader to commit a link, because the section names the plan, the yes and the undo instead.

### Reliability
- **NFR-R01**: The contract is valid JSON after every edit, so no consumer's parse fails on a trailing comma or a comment.
- **NFR-R02**: The two contract tests fail when a field the routers need is missing, so a field cannot vanish silently.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a family entry with no selector for a target fails a contract test, so a route is never described by a field nobody can dispatch.
- Maximum input: both commands with every target give four execution targets, four loader requirements, two destructive operations and two invocation aliases inside one doctor entry.
- Failure path: invalid JSON fails the parse before any consumer reads the file, and a stale README anchor leaves a numbered section pointing at an id that no longer exists.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Three files, no code, one JSON asset and one README |
| Risk | 4/25 | Contract and document edits, and a missed field fails a test rather than a user path |
| Research | 4/20 | Both contracts are frozen and the README's section order is already fixed |
| **Total** | **14/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The link shapes, the read-only install guide and the section's placement are fixed by the two earlier contracts and the operator's request.
<!-- /ANCHOR:questions -->

---


---
