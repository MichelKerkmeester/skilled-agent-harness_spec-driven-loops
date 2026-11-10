---
title: "Tasks: Phase 3: templates-and-fleet"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "templates and fleet tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: templates-and-fleet

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`A` is `.skilled/skills/sk-doc/sk-create-skill/assets/`. `PK` is `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`. `G` is `.skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py`. `L` is `.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the phase start sha and the staged findings per skill from `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/<skill> --check --strict` in `goal.md` section 4. Verify: the log lists one count per skill and the sha. Evidence: start sha 273224bbed in `scratch/start-sha.txt`; 347 findings in 44 units in `scratch/staged-findings.txt` and `scratch/findings/`, logged in `goal.md`.
- [x] T002 List the 80 references without `### Purpose` and mark each fixable or frozen by an inbound reference (REQ-008). Verify: the list is saved under `scratch/` with one verdict per doc. Evidence: `scratch/no-purpose-verdicts.md` lists 83 docs, all fixable by inserting Purpose, none frozen.
- [x] T003 [P] List pinned docs that carry a finding. Verify: the list is logged, and each one is raised with the operator before the fleet pass reaches its skill. Evidence: only `code-quality-standards.md:17` carries a finding; operator approved an intro-only edit on 2026-11-05, logged in `goal.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Restructure the OVERVIEW in `A/skill/skill-reference-template.md` to Purpose then When to Use and in `A/skill/skill-asset-template.md` to Purpose then Usage (item 1, REQ-001). Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` on each prints 0 findings. Evidence: `validate_document.py` prints `Total issues: 0` on both templates.
- [x] T005 Fix the intro wording in both templates: description and intro differ, no "summary", a list of bad pointer phrases (item 8, REQ-004). Verify: `rg -n "same as intro" A/skill/skill-reference-template.md A/skill/skill-asset-template.md` prints nothing. Evidence: `rg -n "same as intro"` on both templates exits 1 with no output.
- [x] T006 Make `A/skill/skill-readme-template.md` and `A/parent-skill/parent-skill-readme-template.md` open with OVERVIEW, with AT A GLANCE content kept (item 9, REQ-002). Verify: `rg -n "^## 1\. AT A GLANCE" A` prints nothing. Evidence: `rg -n "^## 1\. AT A GLANCE"` on the templates prints nothing; both README templates validate at 0.
- [x] T007 Turn on `renderChecks` for readme in `.skilled/skills/sk-doc/shared/assets/template-rules.json`, add `README.md` to `RENDER_SCAN_SCOPES` in `PK` (its scope is already staged), and extend `_code_folder_has_flat_inventory` to WHAT IS IN THE PACKAGE and structure trees (item 9, REQ-005). Verify: README fixtures fire and clear under `run-script-tests.sh`, and the 13-skill strict loop still exits 0 with README findings shown as `render advisory:`. Evidence: inventory check extended with 3 pass and 3 negative fixtures, mutation-checked. Deviation logged in `goal.md`: the readme `renderChecks` switch and the `README.md` scan scope land after the last fleet fold, so leaf gates stay green between skill commits. Switch landed in 45af20eb71 after the last fold: readme `renderChecks` on, `README.md` in `RENDER_SCAN_SCOPES`, the README verdict baseline rewritten for 977 READMEs; `run-script-tests.sh` prints `all sk-doc script tests passed` and the 13-skill loop exits 0. With the staged sets empty, README findings are enforced, so none shows as `render advisory:`.
- [x] T008 Keep one REFERENCES section, last, with one name in `A/skill/skill-md-template.md`, `A/skill/skill-scaffold-template.md` and the rules (item 10, REQ-006). Verify: `grep -cE '^\\?## [0-9]+\. REFERENCES' A/skill/skill-md-template.md` prints `2`, the skeleton's one section plus the file's own closing section, down from `3`. Evidence: `grep -cE` prints `2`; the scaffold ends with `## 7. REFERENCES AND RELATED RESOURCES`; `skill-contract.json` canonicalOrder names it.
- [x] T009 Keep one SKILL.md size table in `A/skill/skill-md-template.md` that matches the `PK` constants, and point `creation-workflow.md:436` and the other statements at it, with a test that fails on drift (item 12, REQ-007). Verify: `rg -n "800 words" .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` prints nothing and the drift test passes. Evidence: `rg -n "800 words"` exits 1; `test_skill_size_table.py` 3 passed and fails on a changed row.
- [x] T010 Commit the template and rule changes after the guard and the opus-medium review. Verify: every hard finding `python3 G --base <phase start sha>` reports on the changed templates maps to a named template task (T004 to T009) in `scratch/guard-t010-map.md`, per the operator decision of 2026-11-05, since the template tasks edit fenced scaffolds on purpose. Evidence: hard findings mapped in `scratch/guard-t010-map.md`; opus-medium FIX, every finding fixed or recorded in `goal.md`.
- [x] T011 Fleet pass for `cli-classifier`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/cli-classifier --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit f81581e246 + fea8ebf39f; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 0 hard, 0 advisory.
- [x] T012 Fleet pass for `cli-external-orchestration`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/cli-external-orchestration --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit d0e5da9399; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 0 hard, 17 advisory read.
- [x] T013 Fleet pass for `cli-orca`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/cli-orca --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit 4a0ea8c233; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 0 hard, 0 advisory.
- [x] T014 Fleet pass for `mcp-code-mode`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/mcp-code-mode --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit af10403311 + cc093ea9a2 remint; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 0 hard, 2 advisory read.
- [x] T015 Fleet pass for `mcp-tooling`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/mcp-tooling --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit da40e0c410; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 0 hard, 12 advisory read.
- [x] T016 Fleet pass for `sk-code`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/sk-code --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit 23cf9e350b; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 1 hard: the pinned `code-quality-standards.md` intro, approved by the operator 2026-11-05 and checked by `check-rule-copies.js` exit 0; 57 advisory read.
- [x] T017 Fleet pass for `sk-design`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/sk-design --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit 27590faa2e; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 2 hard, both basename false positives: the benchmark report cites `benchmark/README.md` section 1, not the mode READMEs; 18 advisory read.
- [x] T018 Fleet pass for `sk-doc`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/sk-doc --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit 5c5bd22228 + 2b2a796f38; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 2 hard, both basename false positives: `sk-code/README.md:151` cites `ROUTER.md` section 8 and `stack-detection.md` section 2, not the sk-doc README; 14 advisory read.
- [x] T019 Fleet pass for `sk-git`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/sk-git --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit 2ff7c32e9c; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 0 hard, 10 advisory read.
- [x] T020 Fleet pass for `sk-prompt`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/sk-prompt --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit 74d77ccbe8; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 0 hard, 0 advisory.
- [x] T021 Fleet pass for `system-deep-loop`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/system-deep-loop --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit 12c592ec17; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 0 hard, 25 advisory read.
- [x] T022 Fleet pass for `system-skill-advisor`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/system-skill-advisor --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit 647d7e871f; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 0 hard, 15 advisory read.
- [x] T023 Fleet pass for `system-spec-kit`: list its staged findings with `RENDER_STAGED_OFF=1`, fix each in form only, run the guard, commit per the 066 parent goal D5 (REQ-003). Verify: `RENDER_STAGED_OFF=1 python3 PK .skilled/skills/system-spec-kit --check --strict` exits 0 and `python3 G --base <phase start sha>` on its changed docs reports no hard finding. Evidence: commit d3e9fbdefc; strict exit 0 with 0 advisories in `scratch/strict-loop-13.txt`; guard per commit in `scratch/guard-fleet.txt`: 1 hard, a basename false positive: `runtime-config-contract.md:72` cites `config/README.md` section 1, not the skill README; 29 advisory read.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T024 Empty `RENDER_STAGED_CODES` and `RENDER_STAGED_SCOPES` in `PK` and update the ratchet fixture to match, a removal the ratchet allows (REQ-003). Verify: `python3 -c "import sys;sys.path.insert(0,'.skilled/skills/sk-doc/sk-create-skill/scripts');import package_skill as p;print(p.RENDER_STAGED_CODES,p.RENDER_STAGED_SCOPES)"` prints `() ()`, `python3 -c "import json;print(json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json'))['debt'])"` prints `{}`, and the 13-skill strict loop prints `exit=0` for all 13 skills with no `render advisory:` line. Evidence: 45af20eb71; the probe prints `() ()`, `debt` prints `{}`, the frozen fixture records both sets as `[]`, and `scratch/strict-loop-13.txt` shows 13 of 13 `exit=0` with 0 advisories.
- [x] T025 Run the full sk-doc suites, the 13-skill strict loop and the compiled-route suite from the final state. Verify: `all sk-doc script tests passed`, 13 of 13 exit 0, and both node suites report `fail 0`. Evidence from the final state at 45af20eb71: `all sk-doc script tests passed`; pytest `402 passed`; sk-create-skill node `pass 108, fail 0`; compiled-route `pass 101, fail 0`; 13 of 13 strict exit 0; the 55-unit sweep 55 PASS; 55 leaves `render_warnings=0 invalid=0`.
- [x] T026 Orchestrator reads the whole phase diff, then an independent opus-medium review runs before the last commit. Verify: the review verdict and the diff range are logged in `goal.md` section 4. Evidence: I read the diff per commit. The opus-medium review over 273224bbed..45af20eb71 gave PASS with 0 P0/P1 and 3 P2, all fixed in 8a3d2e24e3 and logged in `goal.md` section 4.
- [x] T027 Validate the packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/014-sk-create-skill-refinements --recursive --strict` prints `RESULT: PASSED` for the parent and all three children. Evidence: `validate.sh ... --recursive --strict` printed `RESULT: PASSED` for the parent and all three children, Errors 0 and Warnings 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every row in `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review report**: See `../scratch/review-report.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked P0 task stops the phase. A blocked P1 task needs a recorded reason in `goal.md` section 4 and operator approval.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md, each tied to a review item Evidence: spec.md REQ-001 to REQ-008 each cite a review item.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md phases and ADRs.
- [x] CHK-003 [P1] Baselines from T001 logged in `goal.md` section 4 Evidence: goal.md T001 row.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `python3 -m py_compile .skilled/skills/sk-doc/shared/scripts/validate_document.py` exits 0 Evidence: py_compile exit 0.
- [x] CHK-011 [P0] `python3 -c "import json;json.load(open('.skilled/skills/sk-doc/shared/assets/template-rules.json'))"` exits 0 Evidence: json.load exit 0.
- [x] CHK-012 [P1] Every skill commit passed the guard with no hard finding Evidence: every hard finding mapped per ADR-003 in `scratch/guard-fleet.txt`.
- [x] CHK-013 [P1] No ephemeral ids in code comments: `rg -n "REQ-|ADR-|T0[0-9]{2}" .skilled/skills/sk-doc/shared/scripts/validate_document.py` prints nothing new Evidence: rg printed nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion in `acceptance-criteria.md` is Met Evidence: every row Met or Superseded with ADR-003.
- [x] CHK-021 [P0] Each changed template validates with 0 findings Evidence: AC-001.
- [x] CHK-022 [P1] README fixtures cover OVERVIEW first and the WHAT IS IN THE PACKAGE inventory Evidence: `test_code_folder_readme.py` negatives=13 failures=0.
- [x] CHK-023 [P1] The ratchet passes after every skill commit Evidence: ratchet 5 of 5 at every gate run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: instance-only for the fleet fixes, class-of-bug for the inventory scope fix.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: the leaf gates and strict loop scan every skill.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: init_skill consumers: `MACHINE_ROUTER_HEADING_RE` still matches `## 4. MACHINE ROUTER`, a fresh hub scaffold renders clean.
- [x] CHK-FIX-004 [P0] Parser fixes include table tests for fenced, frontmatter, no-op and fallback cases. Evidence: inventory fixtures: tree, package list, prose-only, tree outside, prose outside.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: 13 skills x strict, 55 leaves, 977 READMEs parity.
- [x] CHK-FIX-006 [P1] N/A unless a test reads process-wide state, in which case a hostile env variant runs. Evidence: N/A.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: range 273224bbed..8a3d2e24e3.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the changed files Evidence: form-only doc edits, no secrets.
- [x] CHK-031 [P0] No pinned doc changed without operator approval Evidence: the one pinned edit was operator-approved 2026-11-05.
- [x] CHK-032 [P1] N/A: no auth surface Evidence: N/A.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md name the same checks and files Evidence: checks and files match.
- [x] CHK-041 [P1] No claim dropped: the guard lost-lines output was read for every skill Evidence: advisory lost-line output read per commit.
- [x] CHK-042 [P2] Each skill changelog names the form-only change Evidence: each skill changelog names the form-only change.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: scratch/ only.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: scratch/ holds evidence only, no temp output.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-11-05
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section Evidence: plan.md ADR-001, ADR-002; decision-record.md ADR-003.
- [x] CHK-101 [P1] ADR-001 and ADR-002 carry a status Evidence: all Accepted.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale Evidence: alternatives tables.
- [x] CHK-103 [P2] N/A: no migration path Evidence: N/A.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] The staged finding count falls after each skill commit and `debt` stays `{}` (NFR-R01) Evidence: debt `{}` throughout, staged findings reach 0.
- [x] CHK-111 [P1] The 13-skill strict loop exits 0 at the end Evidence: `scratch/strict-loop-13.txt`.
- [x] CHK-112 [P2] N/A: no load testing Evidence: N/A.
- [x] CHK-113 [P2] Per-skill finding counts before and after logged in `goal.md` section 4 Evidence: goal.md T001 baseline and `scratch/strict-loop-13.txt` after.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback is one `git revert` per skill commit Evidence: one commit per skill.
- [x] CHK-121 [P1] Hermes mirrors synced for each changed skill, per the 066 parent goal D5 Evidence: commit-skill.sh ran the Hermes sync for each.
- [x] CHK-123 [P1] N/A: no runbook, the gate command is the runbook Evidence: N/A.
- [x] CHK-124 [P2] N/A: no deployment Evidence: N/A.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Independent opus-medium review completed before commit Evidence: T026.
- [x] CHK-131 [P1] No new dependency added Evidence: no dependency added.
- [x] CHK-132 [P2] N/A: no web surface Evidence: N/A.
- [x] CHK-133 [P2] N/A: no user data Evidence: N/A.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized Evidence: spec, plan, tasks, AC and summary agree.
- [x] CHK-141 [P1] Every moved section kept its inbound citations Evidence: reviewer found 0 broken anchors into changed docs.
- [x] CHK-142 [P2] N/A: no user-facing doc beyond the sk-create-skill docs Evidence: N/A.
- [x] CHK-143 [P2] The 80-reference verdict list saved under `scratch/` Evidence: `scratch/no-purpose-verdicts.md`.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Operator, decides pinned docs and approves the last commit | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
