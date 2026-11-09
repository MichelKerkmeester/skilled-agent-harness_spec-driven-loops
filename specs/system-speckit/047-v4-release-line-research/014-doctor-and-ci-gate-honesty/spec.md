---
title: "Feature Specification: Phase 14: doctor-and-ci-gate-honesty"
description: "Doctor checkers and CI reported green for drift they found or never looked at: a symlink check that always exits 0, sk-git CI running one suite of five, an agent parity gate over three of seven trees, and no workflow running the AGENTS.md manifest check. This phase makes each gate fail or report honestly."
trigger_phrases:
  - "doctor and ci gate honesty"
  - "phase 14 doctor and ci gate honesty"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: doctor-and-ci-gate-honesty

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 17 |
| **Predecessor** | 013-agents-md-delivery-budget |
| **Successor** | 015-cli-hub-routing-and-classifier |
| **Handoff Criteria** | Doctor tests, sk-git suites, mirror parity and route validation hold their baselines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the v4 release line remediation specification.

**Scope Boundary**: Verified findings V49, V51, V53, V54, V56 and the P2 rows V55, V57, V58, V62, V63, V64, V65 from `../research/research.md`.

**Dependencies**:
- Phase 013: the manifest check stays red until the operator's write, so the new CI step is report-only.

**Deliverables**:
- Doctor checkers whose exit codes match what they report, and CI that runs every sk-git suite and the manifest check.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`symlink-engine.cjs check` returns a literal 0 after printing broken links. sk-git CI runs one of its five script suites. The agent body-parity verifier lists three of seven runtime trees, and its required opencode row compares the canonical file with itself through a symlink. `/doctor:runtime-mirrors` never runs that verifier. No workflow runs `agents-md-manifest.cjs --check`, which is how its failure shipped unseen. Several P2 messages mislead: a SHADOWED hook that is this checkout's own file, a refusal with no remedy, a policy line that reads as a FAIL result, and an orphan scan that exits 0 when it could not run.

### Purpose
A doctor or CI result that says green means the thing was checked and is clean.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 1791,1801p .skilled/commands/doctor/scripts/symlink-engine.cjs
    if (options.command === 'check') {
      ...
      emit(report, options.json, renderReport(report));
      return 0;

$ rg -n "run: bash" .github/workflows/sk-git-script-tests.yml
51:        run: bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh

$ sed -n 50,54p .skilled/bin/lib/mirror-sync-verify.cjs
const RUNTIME_MIRRORS = Object.freeze([
  { runtime: 'opencode', template: '.opencode/agents/{name}.md', format: 'markdown', required: true },
  { runtime: 'claude', template: '.claude/agents/{name}.md', format: 'markdown', required: true },
  { runtime: 'codex', template: '.codex/agents/{name}.toml', format: 'toml', required: false },

$ rg -l "agents-md-manifest" .github/workflows
(no output)

$ node --test .skilled/commands/doctor/scripts/tests/*.test.cjs
ℹ tests 1077
ℹ pass 1071
ℹ fail 6
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Exit 1 from `symlink-engine.cjs check` on drift (V51).
- Run all five sk-git suites in CI (V53) and the AGENTS.md manifest check report-only in advisory CI (V49).
- Cover all seven agent trees in the parity verifier and report a symlinked mirror as same-file (V54), and run it from `/doctor:runtime-mirrors` (V56).
- Fix the misleading P2 messages and exits: install-git-hooks SHADOWED (V55), the containment refusal remedy (V57), the `/doctor:git standards` install step (V58), the parent-skill-check policy line (V62), the orphan scan exit and `--check` acceptance (V65).

### Out of Scope
- V63, `release-update check --offline` printing no RESULT line - its documented contract is "exit 0 whatever the release status"; changing it is a contract change for its own phase.
- V64, the 66 existence-only hook rows - drift is covered by the sync checkers this phase wires in; rewriting the battery is an improvement, not a defect.
- Making the manifest CI step blocking - it is red until the operator's write (phase 013).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/symlink-engine.cjs`, `doctor-symlink-check.yaml`, presentation files | Modify | Drift exit and contract text |
| `.github/workflows/sk-git-script-tests.yml`, `advisory-checks.yml`, `README.md` | Modify | Suites and manifest step |
| `.skilled/bin/lib/mirror-sync-verify.cjs`, `check-agent-mirror-sync.cjs` | Modify | Seven trees, same-file status |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`, `_routes.yaml` | Modify | Body-parity step |
| `install-git-hooks.sh`, `parent-skill-check.cjs`, `orphan-process-check.cjs`, two mirror checkers, `INSTALL-SKILLED.md` | Modify | P2 messages and exits |
| Tests beside each | Modify | One case per behaviour |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `symlink-engine.cjs check` exits 1 on a fixture with a broken link and 0 on a clean linked fixture. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | `sk-git-script-tests.yml` runs all five sk-git suites, and each passes locally. |
| REQ-003 | `advisory-checks.yml` runs `agents-md-manifest.cjs --check` as a report-only step. |
| REQ-004 | The parity verifier covers seven trees, reports a symlinked mirror as same-file, and `check-agent-mirror-sync.cjs --all` exits 0 on this repository. |
| REQ-005 | `/doctor:runtime-mirrors` runs the body-parity check and `route-validate.sh` passes. |
| REQ-006 | Doctor tests lose no baseline pass; the only failures are the six manifest-caused ones. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every changed exit has a test that fails on the old code.
- **SC-002**: Doctor, sk-git, mirror and route checks hold or grow their pass counts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A caller relied on `check` exiting 0 | Med | `missing`, `local` and `project-owned` still exit 0; callers grepped |
| Risk | New sk-git CI steps fail on the runner | Low | Each suite sets its own git identity and passes locally |
| Dependency | Operator's manifest write | The advisory step stays red | Report-only until then |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The parity verifier adds four trees of small file reads; no measurable cost.

### Security
- **NFR-S01**: No checker gains a write path.

### Reliability
- **NFR-R01**: A check that could not run never exits 0.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a project with nothing linked reports `missing` and exits 0.
- Maximum input: all seven agent trees present.
- Failure path: `ps` unavailable makes the orphan scan exit 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About twenty files across doctor, bin and CI |
| Risk | 14/25 | Gates other work relies on |
| Research | 4/20 | Evidence from the parent synthesis |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Deferrals are in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
