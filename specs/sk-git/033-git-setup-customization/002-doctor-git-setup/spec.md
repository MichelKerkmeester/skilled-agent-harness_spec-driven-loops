---
title: "Feature Specification: Phase 2: doctor-git-setup"
description: "A repository can look set up for sk-git while a rule is quietly not enforced. A read-only /doctor:git setup check reports each customizable surface and names one repair per failure."
trigger_phrases:
  - "doctor git setup"
  - "phase 2 doctor git setup"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: doctor-git-setup

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-15 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-deep-research |
| **Successor** | None |
| **Handoff Criteria** | `/doctor:git setup` runs on a clean clone, the test suite and route validation pass, and every acceptance criterion carries evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the sk-git setup customization packet. Phase 1 researched the design, and this phase builds it.

**Scope Boundary**: the read-only `setup` target on `/doctor:git`, its checker script, tests and the docs that list the command's targets. No change to how any hook, gate or contract behaves.

**Dependencies**:
- The synthesis in `../001-deep-research/research/research.md`, sections 3 to 7.
- The `/doctor:sk-code setup` precedent: `.skilled/commands/doctor/sk-code.md`, `assets/doctor-sk-code-setup.yaml` and `scripts/sk-code-setup-check.cjs`.

**Deliverables**:
- `git-setup-check.cjs` with its test file.
- The `setup` route, workflow and presentation entries.
- Router, catalog, playbook and README updates that name the new target.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-git has twelve surfaces a repository can change, and several of them fail open. `validate-message.mjs --explain` exits 0 with no contract, a `hard-rules.json` rule naming an unknown check is skipped and an unregistered advisory hook gives no error. A user who adapts sk-git has no single check that shows which rules are live, which are absent and which are broken.

### Purpose
A user runs `/doctor:git setup` and gets one row per surface with its source, a PASS, FAIL, SKIP or UNKNOWN result and the exact repair for each failure, with nothing written.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A read-only battery script with the eleven checks from research section 5.
- The `/doctor:git setup` route, its workflow YAML and presentation entries.
- Tests that cover each failure case and prove the battery writes nothing.
- Every list of `/doctor:git` targets, the sk-git playbook and an sk-git section in the root README adaptation guide.

### Out of Scope
- Changing how any hook, gate, contract or allocator behaves. The check reports state and never repairs it.
- A per-repository overlay for `hard-rules.json`. The research names it as a separate design question.
- Advisory registration probes for AI tools other than the one running the check. The operator chose active-tool-only for the first version.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Create | The read-only battery |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Create | Fixture tests and the no-write proof |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Create | One-step read-only workflow |
| `.skilled/commands/doctor/_routes.yaml` | Modify | The `setup` route row and the header list |
| `.skilled/commands/doctor/git.md` | Modify | Argument hint, target tables and workflow summary |
| `.skilled/commands/doctor/assets/doctor-git-presentation.txt` | Modify | Menu, help, valid targets and setup result templates |
| `.skilled/commands/doctor/scripts/README.md`, `scripts/tests/README.md` | Modify | Script and test rows |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | `/doctor:git setup` alias |
| `.skilled/commands/README.txt`, spec-kit `feature-catalog/doctor-commands/category-overview.md` | Modify | Command table rows |
| `.skilled/skills/sk-git/manual-testing-playbook/` with `leaf-manifest.json` and `leaf-aliases.json` | Modify | One new setup scenario and its index rows |
| `.skilled/skills/sk-git/README.md` | Modify | Name the setup target beside `hooks` and `standards` |
| `README.md` | Modify | An sk-git section in the adaptation guide |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `/doctor:git setup` is a route with `mutating: read-only`, and `route-validate.sh` passes with it. |
| REQ-002 | The battery runs the eleven checks and reports PASS, FAIL, SKIP or UNKNOWN per check, one repair line per failure, exit 0, 1 or 2 and a final `STATUS=` line. |
| REQ-003 | The battery writes nothing. It never calls an allocator, an `--apply` mode or a `git config` write, and a test compares the file tree and git config before and after. |
| REQ-004 | The battery never runs code from the repository it inspects. It loads its helpers from its own install root, so an untrusted clone cannot plant code it runs. |
| REQ-005 | The standards check reports each kind's contract as absent, enforced or malformed, and does not treat a zero exit from `validate-message.mjs --explain` as a pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The advisory check covers the active AI tool only and reports SKIP with the other adapters' file paths. |
| REQ-007 | `--json` prints one JSON object with every check's id, result, source, details and repair. |
| REQ-008 | The advisory-rules check validates every `hard-rules.json` check name against `GIT_CHECKS`. |
| REQ-009 | Every list of `/doctor:git` targets names `setup`, and the playbook gains one setup scenario. |
| REQ-010 | The root README gains an sk-git adaptation section that points to `/doctor:git setup` as the proof step. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On this repository's own checkout, `/doctor:git setup` prints `STATUS=OK` or names each real gap with its repair.
- **SC-002**: The new test file passes in `run-all.sh`, and its no-write test fails if any check writes a file or a config key.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing read-only entry points (`install-git-hooks.sh --status`, `git-hook-gates.cjs list`, `git-standards.cjs status`, `message-contract.mjs`) | A change in their output breaks a check | Parse their documented output and cover each in a test |
| Risk | A reused helper writes state, such as `worktree-naming.sh allocate` or the Commit-Id allocator | High | Call only `next`, `list`, `status` and policy readers, and let the no-write test catch a regression |
| Risk | The battery sources a helper from the inspected repository | High | Resolve every helper from the script's own root, and test with a planted helper in the fixture repository |
| Risk | Target lists drift because they are hand-maintained in several files | Medium | Update every list named in the scope and rely on `route-validate.sh` target parity |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The battery finishes within 10 seconds on this repository.
- **NFR-P02**: It runs each external helper once, with no network call.

### Security
- **NFR-S01**: No helper runs from the inspected repository's tree, and every child process runs with an argv array and no shell.
- **NFR-S02**: Trust is shown, never granted. The battery never sets `skilled.trustRepoHooks`.

### Reliability
- **NFR-R01**: A missing helper or binary yields FAIL or UNKNOWN for that check, never a crash.
- **NFR-R02**: Exit 2 means the battery itself could not run, kept apart from exit 1 for a failing check.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No contract folder: the standards check reports absent rules as "not enforced", not PASS.
- An empty allowlist: PASS with the built-in `main` and `skilled/v*` exceptions shown.
- A malformed `hard-rules.json`: FAIL, since the advisory would otherwise read it as an empty rule set.

### Error Scenarios
- Run outside a git repository: exit 2 with a usage message.
- A helper binary is missing: that check reports UNKNOWN with the missing path.
- The active AI tool cannot be detected: the advisory check reports SKIP with all adapter paths.

### State Transitions
- An untrusted clone: the trust check reports SKIP with the reason, and the other checks still run from the battery's own root.
- `skilled.commitId false` in a repository whose recent commits carry ids: report the opt-out as the effective policy, not a failure.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 15 files, roughly 900 lines, one subsystem |
| Risk | 12/25 | Read-only by design, but it inspects untrusted repositories |
| Research | 5/20 | Phase 1 settled the design |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The advisory scope was settled as active-tool-only on 2026-10-15.
<!-- /ANCHOR:questions -->

---
