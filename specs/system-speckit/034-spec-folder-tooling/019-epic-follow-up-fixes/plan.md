---
title: "Implementation Plan: Phase 19: epic-follow-up-fixes"
description: "Close the eleven follow-ups the spec-folder tooling epic left, in documentation, the compat workflow contract, Gate 3 parity coverage, CLI test isolation and one generated leaf manifest."
trigger_phrases:
  - "epic follow up fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 19: epic-follow-up-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, Node.js (CommonJS and ESM), TypeScript tests run by vitest |
| **Framework** | None. The doctor command, the compat workflow and the spec-kit CLI are plain files and scripts |
| **Storage** | None. The compat move log lives in the git directory and is not changed by this phase |
| **Testing** | vitest (CLI suite), `node --test` (hook and Gate 3 parity tests), the doctor `run-all.sh` suite, the playbook and feature catalog validators, `validate.sh --strict` |

### Overview

Each follow-up is a small, separate fix to one file or one contract. The env reference loses its conflicting duplicate and the doctor parse rules learn the two row shapes the file really uses. The compat workflow YAML states how a resume treats a step it still owes, how a run closes its move log and what a layout map must print. Three CLI tests move their fixtures out of the real `specs/` root. The Gate 3 parity list covers the copies that 018 aligned. The leaf manifest generator skips dot-named directories so a local tool cache cannot change a manifest.

The work was done in lanes before this closeout. This plan records the shape of the final change, and the closeout re-ran the gates against the working tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md sections 2 and 3)
- [x] Success criteria measurable (acceptance-criteria.md, one row per requirement)
- [x] Dependencies identified (section 6 below)

### Definition of Done
- [x] All acceptance criteria met. AC-011 is committed in `9bd0eecc44`, and AC-014 is Met on the final strict runs in `scratch/evidence/validate-019-strict-final.txt` and `validate-034-strict-final.txt`
- [x] Tests passing: gate outputs under `scratch/evidence/gate-*`, recorded in implementation-summary.md
- [x] Docs updated (spec, plan, tasks, acceptance criteria and implementation summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix in place. Each follow-up edits the file that owns the behavior and adds or updates a test that pins it. No new module, command or runtime path is introduced.

### Key Components
- **Env reference and doctor env rules**: `runtime/ENV-REFERENCE.md` and `commands/doctor/assets/doctor-env.yaml` define which rows `/doctor:env` accepts.
- **Compat workflow contract**: `commands/doctor/assets/doctor-update-compat-action.yaml` defines the phases, the move log and the owed-step rule. Its tests are `doctor-update-compat.test.cjs` and `doctor-update-compat-integration.test.cjs`, and its manual scenario is DOC-381 in the doctor-commands playbook.
- **Gate 3 parity**: `runtime/tests/hooks/gate-3-menu-parity.test.mjs` compares each option C line with the Gate 3 constant.
- **CLI test isolation**: three vitest files under `runtime/cli/tests/` build their fixtures under an OS temp root.
- **Leaf manifest generator**: `sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` walks a hub and lists its leaves.

### Data Flow
Each doc or contract change is read by a validator or a test in the same packet's gates. The compat YAML is read by the doctor agent at run time, so its rules are pinned by contract assertions. The leaf manifest is checked by `generate-leaf-manifest.cjs --check` and by the hub freshness gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet is a fix packet, so the affected surfaces are listed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/ENV-REFERENCE.md` and `doctor-env.yaml` | The env table and the rules that parse it | Updated: one `SYSTEM_SPEC_GATE_DISABLED` row now agrees with its twin on default and type, and the parse rules accept the legacy label rows | `u01-doctor-env-probe-after.json` and `u01-env-probe-rerun.txt` show status OK, 0 malformed, 0 conflicts |
| `doctor-update-compat-action.yaml` | The compat workflow contract | Updated: owed-step exemption, run-complete on terminal stops, layout map JSON rule | `u05-u07-doctor-tests.txt`, `gate-02-doctor-run-all.txt` |
| DOC-381 playbook scenario and `doctor-update-presentation.txt` | Manual scenario and the operator text | Updated to match the YAML | Read against the YAML diff |
| Gate 3 parity test and the five added files | The list of menu copies to compare | Updated: 17 files | `u08-gate3-parity-final.txt`, planted-drift runs |
| Three CLI tests under `runtime/cli/tests/` | Fixtures that wrote into `specs/` | Updated: OS temp sandboxes with guarded teardown | `u09-cli-sandbox-vitest.txt`, `u09-specs-root-before.txt` and `u09-specs-root-after.txt` |
| `generate-leaf-manifest.cjs` | Leaf walk for hub manifests | Updated: dot-named directories are skipped | `u10-leaf-manifest-scope-test.txt`, `gate-08-leaf-manifests.txt` |
| Doctor, sibling playbook and spec-kit READMEs | Index and category READMEs | Updated to the validator's required sections, and reference fixes | `u04-*` validator outputs and `u04-validate-document-readmes-rerun.txt` |

Required inventories:
- Same-class producers: the duplicate `SYSTEM_SPEC_GATE_DISABLED` was searched across every table in ENV-REFERENCE.md by the probe, which read all 177 data rows.
- Consumers of changed symbols: the compat YAML is consumed by the two compat test files, the DOC-381 scenario and the doctor-update presentation, and each was updated together.
- Matrix axes: see tasks.md, Fix Completeness, for the parity file list (17 files) and the terminal statuses (8).
- Algorithm invariant: the sandbox teardown removes the tool-tree link before the recursive remove, so the real tree is never walked. The containment guard accepts only paths under `<sandbox>/specs/` (see `u09-containment-guard-cases.txt`).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

1. **Setup**: read each follow-up's cited file and line, and confirm the claim against the file before editing (done in the lanes, recorded in `scratch/follow-ups.md`).
2. **Implementation**: one fix per item, U01 to U11, with the contract assertion or test named in tasks.md.
3. **Verification**: the gates in implementation-summary.md, the CLI suite, the validators and `validate.sh --strict` on this folder and on the 034 parent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit and contract | Compat YAML rules, the leaf manifest generator, the parity list | `node --test` (doctor scripts and sk-doc tests), vitest |
| Integration | Hook tests, the three CLI tests, the full CLI suite | `node --test`, vitest with `SPECKIT_TEST_RUN_TIMEOUT_MS=3600000` |
| Validators | Playbook packages, feature catalog, README documents, links, Hermes copies | `validate-playbook-package.cjs`, `validate_catalog_package.py`, `validate_document.py`, `check-markdown-links.cjs`, `sync-skills-hermes.cjs --check` |
| Manual | DOC-381 compat scenario | Run by hand on 2026-10-10 on fresh fixtures. Steps 1 to 7 pass after the playbook's step 1 was amended to build the fixture runtime (`scratch/evidence/doc-381-manual-run-rerun.txt`). The automated contract tests pin the same rule. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 17 (heal CLI and compat YAML simplification) | Internal | Committed on this branch (HEAD `dd6f9316a3` at closeout). Whether it is on `main` was not re-checked here | The compat YAML baseline this phase edits would differ |
| Phase 18 (epic docs alignment) | Internal | Committed on this branch. Its push receipt is committed in `9bd0eecc44` (U11) | None. U11 is closed |
| The orchestrator's commit | Process | Done: the 019 code changes are committed in `242e896c11`, `ce3d7d0b29`, `c5afce1a98`, `7ba9345bd8` and `269f87a3a2`, and the 018 receipt in `9bd0eecc44`. The packet docs are committed in `079e9c34d2`. Later doc edits, and the `scratch/evidence/` files that commit does not hold, are not committed yet | None for the code. AC-011 is Met |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate in implementation-summary.md fails after the commit, or a later packet depends on a rule this phase changed.
- **Procedure**: revert the phase's commit with `git revert`. Each item touches a separate set of files, listed in implementation-summary.md, so a partial revert is possible by file. Do not revert the 018 push receipt, which is a separate commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

The eleven items are independent of each other. Only the compat items (U05 to U07) share one file, so they are applied together and tested together.

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read the cited lines for eleven items |
| Core Implementation | Medium | Eleven small edits, three tests moved to sandboxes |
| Verification | Medium | The full CLI suite is the longest gate by far. The other gates finished in under three minutes together, and the CLI run is recorded in implementation-summary.md |
| **Total** | | Measured in this closeout, not estimated |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: the git history holds the base at `dd6f9316a3`
- [x] Feature flag configured: not applicable, no runtime flag is added
- [x] Monitoring alerts set: not applicable, no service runs

### Rollback Procedure
1. Revert the phase commit with `git revert`.
2. Rerun the doctor `run-all.sh` suite and the hook tests to confirm the reverted state.
3. Rerun `validate.sh --strict` on this folder.
4. Notify the orchestrator, who owns the commit.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
