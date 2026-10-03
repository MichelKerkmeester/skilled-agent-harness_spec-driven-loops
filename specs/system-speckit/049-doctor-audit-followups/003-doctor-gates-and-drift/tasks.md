---
title: "Tasks: Phase 3: doctor-gates-and-drift"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: doctor-gates-and-drift

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-check all nine findings against the current tree and record holds or resolved in `scratch/findings-recheck.md` (`.skilled/commands/doctor/`, `.skilled/skills/system-spec-kit/runtime/`) Evidence: `scratch/findings-recheck.md`; all nine hold, finding 4 closes by recording.
- [x] T002 [P] Recover the old guard rows for the three MCP CLI skills from git history into `scratch/old-guard-rows.yaml` (`git show 6cd0da3618d^:.skilled/commands/doctor/assets/doctor-mcp-install.yaml`) Evidence: `scratch/old-guard-rows.yaml`.
- [x] T003 [P] Capture the three failing suites' output into `scratch/parent-skill-failures.log` (`.skilled/commands/doctor/scripts/tests/`) Evidence: `scratch/parent-skill-failures.log` (12-lib module error plus a 13a-version failure).
- [x] T004 [P] Recount the env reference variables by its stated method into `scratch/env-count.md` (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`) Evidence: `scratch/env-count.md` and `scratch/env-count.py`: 154 by the stated method.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Create the guard-owned manifest with Code Mode and the three CLI skills, each with install and doctor classes (`.skilled/commands/doctor/assets/doctor-mcp-mutation-manifest.yaml`) Created as `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml`; the planned `doctor-mcp-mutation-manifest.yaml` name falls inside the `assets/doctor-mcp-*.yaml` glob another packet owns.
- [x] T006 Point the guard at the new manifest and update its header comment (`.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh`) Evidence: `scratch/guard.log`, seven PASS rows, exit 0; a listed script that is missing now fails.
- [x] T007 Give the fixture an explicit `@spec-kit` resolution so the copied contract library loads (`.skilled/commands/doctor/scripts/tests/parent-skill-check-*.test.cjs`) Each helper links `sk-doc/node_modules/@spec-kit/shared` to the real package; the hub fixture SKILL.md also carries `version: 1.0.0.0` for check 13a. No assertion changed.
- [x] T008 Assert workflow activities in the route validator and add the self-test fixture (`.skilled/commands/doctor/scripts/route-validate.py`, `.skilled/commands/doctor/scripts/route-validate.sh`) Assertion L1 plus self-test fixture 7, which must report `FAIL: L1:`.
- [x] T009 Correct the skill-budget texts and read the Claude budget from `SLASH_COMMAND_TOOL_CHAR_BUDGET` (`.skilled/commands/doctor/assets/doctor-rebuild-presentation.txt`, `.skilled/commands/doctor/scripts/audit_descriptions.py`, `.skilled/skills/sk-doc/scripts/quick_validate.py`, `.skilled/skills/sk-doc/shared/scripts/quick_validate.py`) Presentation row corrected. The report title, both `quick_validate.py` docstrings and the 8,000 budget are handled by `specs/sk-doc/064-description-budget` (ADR-004).
- [x] T010 Set the stated variable count to the mechanical recount (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`) Line 34 now states 154 and names the four flag-table-only names (158 with them).
- [x] T011 Correct the fable baseline's dead corpus target and verify the wrapper (`.skilled/skills/system-spec-kit/runtime/cli/metrics/fable-baseline.json`, `.skilled/commands/doctor/scripts/fable-mode-check.cjs`) `target` set to `null` with a `targetStatus` note; `scratch/fable-mode-check.log` exits 0 with metric rows.
- [x] T012 Align the generic `/doctor` forms to the registered command and update the supporting docs (`.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`, `.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/README.txt`) Presentation, `_routes.yaml` header and the rebuild presentation's related-commands table now use `/doctor:speckit`. `.skilled/commands/README.txt` is outside this phase's owned files and was left unchanged.
- [x] T013 Correct the closed-packet statements (`.skilled/commands/doctor/scripts/`, `specs/system-speckit/048-doctor-command-audit/003-update/spec.md`, `specs/system-speckit/048-doctor-command-audit/013-speckit-retrieval/implementation-summary.md`) Both closed-packet documents corrected; `validate.sh specs/system-speckit/048-doctor-command-audit --recursive --strict` printed 15 of 15 `RESULT: PASSED`.
- [x] T014 Record the user-global Codex hook parity result in `scratch/codex-hook-parity.md` (`.skilled/bin/install-codex-hooks.mjs`) Evidence: `scratch/codex-hook-parity.md`, exit 0, OK.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run the guard and confirm it names all four skills and the three doctor scripts (`.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh`) Exit 0, all four installers and three doctor scripts named.
- [x] T016 Run the three parent-skill suites and confirm zero failures (`.skilled/commands/doctor/scripts/tests/parent-skill-check-*.test.cjs`) Each suite reports `fail 0` (`scratch/parent-skill-after.log`).
- [x] T017 Run `route-validate.sh` and its `--self-test` (`.skilled/commands/doctor/scripts/route-validate.sh`) Live run exit 0 with `PASS: L1: all 21 route script invocations...`; `--self-test` exit 0 (`scratch/route-validate*.log`).
- [x] T018 Run the catalog mirror check and the pre-commit hook test (`.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`) `command-catalog-mirror-check.cjs` exit 0; `pre-commit.test.sh` 67 passed, 0 failed.
- [x] T019 Validate both edited closed packets under strict mode (`.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`) 15 of 15 `RESULT: PASSED` over the 048 packet, recursive and strict.
- [x] T020 Validate this phase folder under strict mode and record `RESULT: PASSED` (`.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`) See the implementation summary verification table.
- [x] T021 Write the evidence rows and known limitations (`implementation-summary.md`) `implementation-summary.md` filled.
- [x] T022 Widen the pre-commit mutation-class trigger so staging only the guard's manifest runs the guard, and add a hook test for it (`.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`) Evidence: the trigger regex now ends `commands/doctor/assets/(doctor-mcp-install|mcp-mutation-class-manifest)\.yaml)$`; `printf` of `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml` through the extracted regex matches, an unrelated `assets/other.yaml` does not; `bash -n` exit 0 on hook and test; new case 29b stages only the manifest: `pre-commit gates: 69 passed, 0 failed` exit 0, and the same harness pointed at the HEAD hook reports `FAIL  the mutation-class guard never ran for the staged manifest` (68 passed, 1 failed). The block's "Fix:" line now names `mcp-mutation-class-manifest.yaml`.
- [x] T023 Apply the two continuity `key_files` replacements from `001-trigger-index-freshness/decision-record.md` ADR-002 (`specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/acceptance-criteria.md`) Evidence: both paths now name `.skilled/skills/system-spec-kit/runtime/{cli/retrieval/generate-trigger-index.mjs,data/trigger-index.json}`, both of which exist; `rg -n "opencode/skills/system-spec-kit/(scripts|data)"` over the file exit 1 (no match); `repair-derived.cjs --apply` repaired=1 failed=0; `validate.sh <folder> --strict` `RESULT: PASSED`, Errors 0, Warnings 0.
- [x] T024 Sweep live retired doctor invocations to the canonical `/doctor:speckit <target>`, `/doctor:rebuild`, `/doctor:update`, `/doctor:mcp`, `/doctor:env` forms, with stale facts in the same sentences (32 files under `.skilled/commands`, `.skilled/skills` and `README.md`) Evidence: before the sweep the retired-form search found 93 hits in 40 files plus 3 legacy colon names; written by a GPT-6 Luna dispatch and reviewed line by line. Also fixed in passing: `embeddings` dropped from three target lists (router-reach added), "013 Phase 5" and "013 phases 004 + 005" removed, `_routes.yaml` line-range and invocation count in `integration-points.md`, the deep-loop row's `mutates` class (now `add-only`, read through `--read-only`), and a stale `doctor.md` GATE 3 table claim. The 14 remaining hits are listed with reasons in implementation-summary.md.
- [x] T025 Recompile the deep-loop command contracts (`.skilled/commands/deep/assets/compiled/*.contract.md`) Evidence: `check-contract-drift.cjs` before: exit 2, 31 `STALE_SOURCE_DIGEST` rows across deep/ai-council, deep/review and deep/research; `compile-command-contracts.cjs --command <c> --write` exit 0 for all three; the diff is 31 `sha256` lines replaced and nothing else; `check-contract-drift.cjs` after: `[CONTRACT DRIFT] OK commands=3` exit 0; `check-contract-drift.vitest.ts` and `render-command-contract.vitest.ts` pass.
- [x] T026 Re-mint stale compiled routing manifests and copy each runtime manifest over its authored copy (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/{mcp-tooling,sk-doc}/manifest.json` and the authored copies under `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/`) Evidence: guard before reported `mcp-tooling stale-manifest`; `compiled-route-manifest.cjs refresh --hub mcp-tooling` `fresh:true refreshed:true`; after the sweep edited `sk-create-frontmatter/SKILL.md` the guard reported `sk-doc stale-manifest`, re-minted the same way; each authored copy `cmp`-identical to its runtime manifest; final guard: all seven hubs `fresh`, "All hubs fresh or excused".
- [x] T027 Regenerate the trigger index last and confirm it is fresh (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`) Evidence: `generate-trigger-index.mjs` (no flags publishes) exit 0; the only change is the index `manifestHash` (the corpus and phrase rows were already current); `--check --json` exit 0 with `"fresh": true`, 23056 documents scanned, `missingDocuments` 0, `staleDocuments` []. Rerun after the last spec-doc edit, see the final report.
- [x] T028 Add the `/doctor:env` entry to the root README DOCTOR section and correct its `/doctor:mcp install` line (`README.md`) Evidence: the section names five commands and now documents five; the install line no longer claims a venv or node_modules removal the workflow never performs, and describes the approved build, manual and runtime-registration steps `doctor-mcp-install.yaml` actually runs. The section's "16 underlying YAML workflows" was recounted: 17 YAML files in `assets/`, one of them the guard's manifest.
- [x] T029 Point `/doctor:speckit` menu option 1 at `/doctor:update` (`.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`, `README.md`) Evidence: option 1 offered "Update everything to match latest spec-kit release" and redirected to `/doctor:rebuild --migrate`, which rebuilds databases and never updates a release; it now reads "Update to the latest framework release" and hands off to `/doctor:update`, which starts read-only. `rg -n "rebuild --migrate" .skilled/commands/doctor/assets/doctor-speckit-presentation.txt` exit 1.
- [x] T030 State the doubled-underscore credential-key rule in the MCP doctor's own texts (`.skilled/commands/doctor/assets/doctor-mcp-install.yaml`, `.skilled/commands/doctor/assets/doctor-mcp-presentation.txt`) Evidence: the install step said `<manual_name>_<VAR>` and the presentation's worked example gave `example_service_API_TOKEN`, which the SDK would never read; both now give the doubled form, `example__service_API_TOKEN`, matching `mcp-doctor-lib.sh` and `validate_config.py`. The YAML parses.
- [x] T031 Replace the "Router for /doctor" description on `speckit.md` (`.skilled/commands/doctor/speckit.md`) Evidence: now "Dispatches spec-kit subsystem diagnostics to a named target through _routes.yaml." (81 characters, 12 fewer than before); the four mirror `--check` scripts pass and `command-catalog-mirror-check.cjs` reports `STATUS=OK`.
- [x] T032 Fix the producers of repo-wide strict-validation debt before touching packets (`.skilled/skills/system-spec-kit/templates/addons/*.md.tmpl`, `templates/packet-types/{review,research}.spec.md.tmpl`, `runtime/cli/rules/check-ai-protocols.sh`) Evidence: a full `validate.sh --recursive --strict` run over all 153 packets found 48 failing folders; grouped by rule, seven templates seeding single-word trigger phrases and AI_PROTOCOLS checking phase parents explained the largest share. Templates now seed phrases of two or more words (golden snapshots changed on trigger lines only, 12 of 12 pass); AI_PROTOCOLS skips phase parents like check-complexity and check-files; the ledger stem census test moved to 15 spoken and 54 reserved after the main merge. Committed as `bd7aedcf1a`.
- [x] T033 Repair each remaining failing packet against its own evidence (agents, cli-external-orchestration, cli-orca, hooks, sk-code, sk-communication, sk-design, sk-doc, sk-git, sk-prompt, sk-vision, system-deep-loop, system-skill-advisor and system-speckit tracks) Evidence: single-token and generic trigger phrases replaced in 110 files; the AI execution framework block added to 40 Level 3 plans; missing anchors, decision records rebuilt from the ADR sections their plans already held, `acceptance-criteria.md` and continuity blocks restored; the two `system-speckit` timeline generators fixed to emit the template header, anchors and numbered sections, then rerun; derived metadata refreshed with `repair-derived.cjs`. No packet's requirements or completion state was changed to make it pass.
- [x] T034 Close the three items that needed an operator decision (`specs/sk-doc/019-skill-routing-refactor`, `specs/hooks/011-pi-fast-mode-w-subagent-support`, `specs/sk-code/007-sk-code-obsidian-surface`, `specs/sk-doc/050-sk-doc-playbook-coverage`) Evidence: operator chose a custodian record for the authored compiled-routing source folder, authored child goals, and link-and-close for 050. 019 now has Level 1 docs and passes strict with the route guard and import guard green and no file under `015-router-unification-program/` changed; 25 child goals were written (13 sk-code, 3 hooks workstreams, 9 hooks leaves) with every tick citing a task or recorded result and six unticked where the leaf docs hold no evidence; `check-goal.cjs` passes on all 13 hooks/011 folders; 050 phases 001 to 003 closed on commit `ad9d93df3be` and today's `validate-playbook-package.cjs` runs (9 of 9 PASS).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md spec.md §4.
- [x] CHK-002 [P0] Technical approach defined in plan.md plan.md §3 and the ADRs.
- [x] CHK-003 [P1] Dependencies identified and available Pre-commit hook, route validator and both closed packets were green before and after.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks `bash -n` on the guard and `route-validate.sh`; `python3 -m py_compile route-validate.py`; `node --check` on the three suites.
- [x] CHK-011 [P0] No console errors or warnings Every gate run exits 0 with no stderr warnings.
- [x] CHK-012 [P1] Error handling implemented Empty manifest exits 2; a listed missing script exits 1 with a FAIL line; an unparseable workflow YAML fails L1.
- [x] CHK-013 [P1] Code follows project patterns The guard keeps its existing manifest schema; L1 follows the existing assertion pattern and rule-id naming.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met acceptance-criteria.md: eight Met, one Superseded by ADR-004.
- [x] CHK-021 [P0] Manual testing complete Guard, suites, validator, catalog check, pre-commit test, fable wrapper and hook parity all run by hand.
- [x] CHK-022 [P1] Edge cases tested Empty-manifest and missing-script fixtures for the guard; fixture 7 for L1.
- [x] CHK-023 [P1] Error scenarios validated Same fixtures; each fails with its named rule.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Classes: guard coverage `cross-consumer`; fixtures `test-isolation`; L1 `class-of-bug`; texts, count and baseline `instance-only`; generic `/doctor` form `class-of-bug`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Generic `/doctor` inventory by `rg`: fixed in the presentation, `_routes.yaml`, the rebuild presentation and the retrieval workflow; the rest is listed under Known Limitations.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Consumers of the guard: the pre-commit hook (staging trigger handed off), `pre-commit.test.sh` (67/0), scripts README.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. N/A: no security, path, parser or redaction fix in this phase.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Guard: manifest present/empty x script present/missing x class read-only/mutating, three fixture rows plus the live seven. L1: activity present/absent, live 21 plus fixture 7.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. N/A: no changed code reads process-wide state beyond the repo root argument.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence pinned to the uncommitted working-tree diff over the files listed in implementation-summary.md, base `1f7746def8`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets No secrets in any changed file.
- [x] CHK-031 [P0] Input validation implemented Guard validates the manifest and each class value; L1 validates YAML parse.
- [x] CHK-032 [P1] Auth/authz working correctly N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Tasks, acceptance criteria and summary reconciled.
- [x] CHK-041 [P1] Code comments adequate Header comments updated in the guard and validator; no ephemeral ids.
- [x] CHK-042 [P2] README updated (if applicable) Scripts README lists the new L1 check.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence lives in scratch/.
- [x] CHK-051 [P1] scratch/ cleaned before completion scratch/ holds only evidence files named by the tasks.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-10-03
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md ADR-004 lives in decision-record.md; ADR-001 to ADR-003 stay in plan.md, now Accepted.
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) All four ADRs are Accepted.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale Each ADR lists rejected alternatives.
- [x] CHK-103 [P2] Migration path documented (if applicable) N/A: no migration.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) NFR-P01 held: one manifest read and one scan per script; L1 adds one YAML parse per route.
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) N/A: no NFR-P02 exists in spec.md.
- [x] CHK-112 [P2] Load testing completed N/A: local gate scripts.
- [x] CHK-113 [P2] Performance benchmarks documented N/A: local gate scripts.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested Rollback is reverting the listed files; every gate reruns in seconds.
- [x] CHK-121 [P0] Feature flag configured (if applicable) N/A: no feature flag.
- [x] CHK-122 [P1] Monitoring/alerting configured N/A: pre-commit and CI gates are the monitoring.
- [x] CHK-123 [P1] Runbook created N/A: the scripts README is the runbook.
- [x] CHK-124 [P2] Deployment runbook reviewed N/A: no deployment.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed No new network or credential surface.
- [x] CHK-131 [P1] Dependency licenses compatible No new dependency.
- [x] CHK-132 [P2] OWASP Top 10 checklist completed N/A: no web surface.
- [x] CHK-133 [P2] Data handling compliant with requirements N/A: no user data.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized Synchronized.
- [x] CHK-141 [P1] API documentation complete (if applicable) N/A: no API.
- [x] CHK-142 [P2] User-facing documentation updated Presentation and README text updated.
- [x] CHK-143 [P2] Knowledge transfer documented implementation-summary.md.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Unassigned | Technical Lead | [ ] Approved | |
| Unassigned | Product Owner | [ ] Approved | |
| Unassigned | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

