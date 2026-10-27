---
title: "Feature Specification: Phase 2: quality-hygiene-policy"
description: "The 21 core comment-hygiene rules block at P0 in every repository and none can be switched off. This phase adds commentHygiene.disableRules and a checker flag, and makes the runner, the pre-commit hook and the CI job read the same key."
trigger_phrases:
  - "quality hygiene policy"
  - "commenthygiene disablerules"
  - "disable rule comment hygiene"
  - "phase 2 quality hygiene policy"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: quality-hygiene-policy

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
| **Branch** | `worktrees/239-portable-rule-contract` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 12 |
| **Predecessor** | `001-shared-rule-contract` |
| **Successor** | `003-quality-floor-and-style-split` (planned) |
| **Handoff Criteria** | `disableRules` and `--disable-rule` work, the verdict and the doctor report them, pre-commit and CI honor them, every new test fails before and passes after, and this folder validates with `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Make sk-code quality, review and CI portable to any repository specification.

**Scope Boundary**: The comment-hygiene checker, the quality config module and its template, the config-to-checker plumbing and the `config.hygiene` field in `quality-gate.cjs`, a flag helper for the other blocking layers, the pre-commit hook and its legacy helper, the CI hygiene job, the `/doctor:sk-code quality` script, quality's config and runner references, its scripts README and SKILL.md, their tests and the sk-code-quality changelog. The `--explain` path in `quality-gate.cjs` belongs to phase 004 and is untouched.

**Dependencies**:
- Phase 001's `rule-overrides.json`, read for the fixed ids.

**Deliverables**:
- `commentHygiene.disableRules` in `.sk-code/quality.json`, validated with the existing strict key check.
- `--disable-rule ID` on `scripts/check-comment-hygiene.sh`.
- `config.hygiene.disabled` in the verdict.
- `scripts/hygiene-config-flags.cjs`, which the pre-commit hook and the CI job call.
- The doctor's `init` suggestion and `status` line.

**Changelog**:
- `.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.4.0.md` records this phase.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The checker holds 21 core rules (`scripts/check-comment-hygiene.sh:121-143`), and every one blocks at P0 in every repository. A repository whose comments carry its own tracker ids (`Fixes #12`, an ADR number) or a model name that reads as a task id cannot turn a rule off, and the config validator refuses any key that would. The pre-commit hook and the CI job never read the quality config at all, so even a runner-level switch would still block the commit.

### Purpose

A repository switches named core rules off in one key, and every blocking hygiene layer honors it, while the rules the shared contract fixes stay on.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Before this phase, on a file holding a foreign repository's comments:

```text
$ python3 check-comment-hygiene.sh fx/a.js
fx/a.js:1: // Fixes #1234 [issue or ticket reference]
fx/a.js:2: // See ADR-004 [ADR reference]
fx/a.js:3: // model T1000 handles it [task ID reference]
exit 1

$ bash scripts/tests/check-comment-hygiene.test.sh   (new cases, checker at HEAD)
FAIL disable_rule_three: expected exit 0, got 3
7 comment hygiene test case(s) failed
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `--disable-rule ID` to the checker, refusing an unknown id and any id `rule-overrides.json` fixes.
- Add `commentHygiene.disableRules` to the config schema, merge and template, and validate each id against the checker's own rule table and the contract's fixed list.
- Pass the ids from the runner to the checker and add `config.hygiene.disabled` to the verdict.
- Make the pre-commit hook, its legacy helper and the CI hygiene job read `disableRules`, and only that key, through the same loader.
- Show the disabled list in `/doctor:sk-code quality status` and suggest the 15 spec-kit ids in `init` when there is no `specs/` folder.

### Out of Scope

- The write-time post-edit hook. It warns and never blocks, so a rule it still reports cannot stop a commit. Its dispatch resolver is documented as side-effect free, and reading a config there would change that contract.
- The config's additions (`ticketPrefixes`, `extraPatterns`, `extensions`) and `commentHygiene.exclude` in pre-commit and CI. They tighten the author gate only, and this phase keeps that.
- The `--explain` path and its tests, which phase 004 owns.
- Review's ticket-id lens mapping to these ids, which phase 005 owns.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | Modify | `--disable-rule`, fixed-id refusal, `disabled_rules` in JSON |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs` | Modify | Key validation, merge, `hygieneCheckerFlags`, rule list read from the checker |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Modify | Flag plumbing and `config.hygiene` only |
| `.skilled/skills/sk-code/sk-code-quality/scripts/hygiene-config-flags.cjs` | Create | Flag helper for the other blocking layers |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-config.template.json` | Modify | `disableRules: []` |
| `.skilled/scripts/git-hooks/pre-commit`, `.skilled/hooks/git/pre-commit` | Modify | Read the flags before the checker run |
| `.github/workflows/comment-hygiene.yml` | Modify | Read the flags before the checker loop |
| `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` | Modify | `status` line, `init` suggestion |
| `.skilled/skills/sk-code/sk-code-quality/references/quality-config.md`, `runner-contract.md`, `scripts/README.md`, `SKILL.md` | Modify | Document the key, the flag and the field |
| The four test files beside those scripts | Modify | New cases |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.4.0.md`, `.hermes/skills/sk-code-quality/SKILL.md` | Create, Modify | Changelog and Hermes copy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A foreign fixture whose `Fixes #1234`, `ADR-004` and `T1000` comments block today runs `NO_BLOCKER_FOUND` with `disableRules: ["issue","adr","task"]` |
| REQ-002 | An unknown id in `disableRules` is `CONFIG_INVALID`, exit 3, before any check starts. The checker refuses it with a usage error |
| REQ-003 | An id `rule-overrides.json` fixes, such as `secret.private-key` or `conflict.markers`, is refused by both the config and the checker |
| REQ-004 | The pre-commit hook honors `disableRules`, and a config that does not validate leaves every core rule on |
| REQ-005 | With no new key, this repository behaves as before: whole-tree hygiene prints 0 lines, the quality suite passes at least 123 tests and `schemaVersion` stays 1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The verdict carries `config.hygiene.disabled`, empty without the key |
| REQ-007 | `/doctor:sk-code quality init` proposes the 15 spec-kit ids only when the repository has no `specs/` folder, never writes them, and `status` shows the active disabled list |
| REQ-008 | The CI hygiene job honors `disableRules` the same way the pre-commit hook does |
| REQ-009 | The changelog validates with 0 issues, the carrier reads 1.13.4.0 and Hermes is in sync |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every new test fails on the source at HEAD and passes on the final source.
- **SC-002**: `validate.sh` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `rule-overrides.json` from phase 001 | A missing contract would let a fixed id through | Both readers fail closed: the config validator reports the field, and the checker refuses `--disable-rule` with exit 3 |
| Risk | A rule list in JS drifting from the checker's table | A new checker rule could not be disabled, or a removed one would still validate | The config module reads the names from the checker's own `VIOLATION_PATTERNS` block, and a test pins the count at 21 |
| Risk | A broken config making every commit fail | A typo in an unrelated field would block all work | Pre-commit and CI warn and keep every core rule on, which is never weaker than today |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The flag helper adds one node start per commit. Measured at 0.062 s total in this repository.

### Security
- **NFR-S01**: No layer can disable a fixed rule, and the secret and conflict-marker sensors have no switch.

### Reliability
- **NFR-R01**: A config the loader cannot read never disables a rule in any layer.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no `disableRules` key, or an empty list, passes no flag, and the checker's JSON carries no `disabled_rules` field.
- Maximum input: all 21 core rules disabled is valid, and the checker then reports only repository patterns.
- Failure path: an unknown or fixed id exits 3 in the runner and the checker, and a missing `--disable-rule` value is a usage error.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Ten source files across a skill, two hooks, a workflow and a doctor script |
| Risk | 10/25 | A blocking gate gains an off switch, bounded by the fixed list and fail-closed reads |
| Research | 4/20 | The investigation report named the entry points |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The two calls this phase made are recorded in `implementation-summary.md`: pre-commit and CI honor the key, and init suggests the ids without writing them.
<!-- /ANCHOR:questions -->
