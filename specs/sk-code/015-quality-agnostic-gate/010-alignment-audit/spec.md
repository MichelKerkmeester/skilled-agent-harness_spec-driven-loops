---
title: "Feature Specification: Phase 10: alignment-audit"
description: "Audits every non-spec file that the quality-gate and CI-efficiency packets changed against the ten alignment questions the operator asked, fixes the 47 findings that four read-only lanes raised, and records what stays open and why."
trigger_phrases:
  - "alignment audit"
  - "phase 10 alignment audit"
  - "sk-code-skilled alignment"
  - "readme and changelog currency"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 10: alignment-audit

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10, the alignment audit of the parent packet, run after the review closeout |
| **Predecessor** | 009-review-closeout |
| **Successor** | None |
| **Handoff Criteria** | All eighteen acceptance criteria are `Met`, AC-006 among them once the CI prompts route to `sk-code-ci`, and this folder and the whole packet pass `validate.sh --strict` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Make sk-code-quality a codebase-agnostic, executable author gate specification. After phase 9 the operator asked ten questions in one message: do the code, the skill documents, the playbooks and the READMEs follow their authoring contracts, are the READMEs and the root README current, is skill routing right, is the work integrated in the skill advisor, and are the changelogs, commands and agents aligned. Four read-only audit lanes (CODE, DOCS, READ and ROUT) answered them. Implementers then fixed what they found, and a release stage raised versions and regenerated the mirrors.

**Scope Boundary**: Every non-spec file that this packet and `specs/system-speckit/053-ci-workflow-efficiency` changed, 705 files listed in the audit's scope file, plus the root `README.md` and the skills, commands and agents those files belong to. On the operator's later request ("Also check agents md and repo rules") it also covers `AGENTS.md`, `REPO RULES.md` and the 13 `.skilled/repo-rules/` files, read but with `AGENTS.md` left unedited. It does not change the verdict schema, the exit codes or any behavior of the quality runner.

**Dependencies**:
- Phases 001 to 009 are Complete, so the files this audit reads exist in their final shape.
- The audit reads packet 053's CI workflows and scripts. It edits three workflow files and one reference there for style (`set -euo pipefail`), and nothing else in that packet.
- The skill-package, playbook, README, changelog, routing and mirror gates already in the repository are the standards. This phase adds one check (REQ-008) and no new standard.

**Deliverables**:
- The finding ledger in `tasks.md`: 38 findings from the audit, 9 more from the re-audit and the 5 repo-rules findings that survived their refute pass, each with its outcome and evidence.
- The fixes in code, skill documents, playbooks, READMEs, routing files, the advisor bridge, the command index and the @code agent.
- Fifteen skill version bumps with changelog entries, regenerated Hermes copies and refreshed route manifests.
- The packet changelog, written at landing.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nine phases changed hundreds of files across code, skills, playbooks, READMEs, workflows, commands and agents, and nobody had checked the whole set against the contracts that govern each file type. The audit found drift of every kind: test files beside their source, headers missing, a playbook with no scenario for three shipped features, two skills over their word cap, READMEs that omit the files they describe, a router that sends clear GitHub Actions requests to the wrong mode, and a bare `/doctor:ci` that reached no advisor recommendation.

### Purpose
Every file the two packets touched follows the contract for its type, the READMEs and the root README describe what ships, routing and the advisor reach the CI and quality surfaces, and every finding that stays open says why.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run four read-only audit lanes over the scope file and record each finding with its evidence.
- Fix each finding in the file that owns it, with a verify command per finding.
- Re-audit the fixes and fix the nine new findings that the fixes introduced or exposed.
- Raise the versions and write the changelog entries of the fifteen skill packets the fixes touched, and regenerate the mirrors and route manifests.
- Audit `AGENTS.md`, `REPO RULES.md` and the repo-rule files with two lenses and a refute pass, and fix or amend for each surviving finding.
- Record each outcome in this folder, and mark open anything not fixed with its reason.

### Out of Scope
- The behavior of the quality runner, its verdict schema and exit codes - phases 002, 003 and 009 own them.
- Released changelog entries - they are immutable, so a defect inside one is recorded, not edited.
- The `.hermes` skill copies and the other generated mirrors - generators write them, never a hand edit.
- A framework-level `.skilled/changelog/skilled` entry - the sk-create-changelog contract makes that the operator's call.
- Any `local-*` skill - a private skill is not read or edited here.

### Files to Change

| File Path | Change Type | Requirement | Description |
|-----------|-------------|-------------|-------------|
| `.skilled/hooks/post-edit-quality/tests/`, `.skilled/skills/sk-code/sk-code-quality/scripts/tests/`, `.skilled/skills/sk-code/sk-code-review/scripts/tests/` | Move | REQ-001 | Six test files moved under a `tests/` tree and their callers repointed |
| `.github/scripts/check-gate-inputs.sh`, five other scripts and `router-replay-lib.cjs` | Edit | REQ-001 | The standard COMPONENT or MODULE header |
| `.github/workflows/opencode-plugin-tests.yml`, `gate-inputs.yml`, `naming-standard-guard.yml`, `spec-kit-check.yml` | Edit | REQ-001 | `set -euo pipefail` on three run blocks and the reason for `-uo` on one |
| `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md`, `.skilled/skills/system-spec-kit/runtime/cli/tests/test-dist-freshness.sh` | Edit | REQ-001 | The corrected `set -e` row and one quoted glob |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, `.skilled/skills/sk-git/SKILL.md` and one new reference each | Edit, create | REQ-002 | Both skills under the 5000-word cap |
| `.skilled/skills/sk-code/ROUTER.md`, `SKILL.md`, `README.md`, `sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Edit | REQ-002, REQ-006 | Sections renumbered 1 to 10 and every citation moved with them |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/` (three scenarios) and `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands/` (two scenarios, README) | Create, edit | REQ-003 | Trust, scoped faults, parallel pool, `/doctor:ci` scaffold and toggle |
| Eight scenario files, four root playbooks (cli-external-orchestration, sk-code-ci, sk-code-skilled and cli-cursor), 14 fanout-stress files, plus `playbook-corpus-manifest.json` | Edit | REQ-003 | Five-section scenario shape, root sections, 14 fanout-stress files out of the routing-gold list |
| Thirteen READMEs under `.skilled/commands/doctor/scripts/`, `sk-code-quality/scripts/`, `sk-code-review/scripts/`, `sk-code-skilled/`, `.devin/hooks/`, `.opencode/plugins/tests/` and the sk-code playbook | Edit | REQ-004, REQ-005 | File inventories, trust and pool wording, broken link removed |
| `README.md` and `.skilled/commands/README.txt` | Edit | REQ-005, REQ-009 | The quality runner, the trust grant and `/doctor:sk-code [setup\|quality]` |
| `.skilled/skills/sk-code/hub-router.json`, `ROUTER.md`, `mode-registry.json` | Edit | REQ-006 | CI and quality-config vocabulary |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs`, `.skilled/commands/doctor/_routes.yaml`, `route-validate.py`, the bridge README | Edit | REQ-007 | Bare `/doctor:ci` reaches its report bridge |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Edit | REQ-008 | A warning for internal ids and test counts in a changelog entry |
| `.skilled/agents/code.md` and its mirrors | Edit, regenerate | REQ-010 | The Iron Law citation |
| Fifteen `SKILL.md` files, their `changelog/v*.md` entries, JSON metadata and the Hermes copies | Edit, create, regenerate | REQ-011 | Patch-level version bumps |
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Edit | REQ-006 | `LIVE_CORPUS_SIZE` from 93 to 95 for the two new `/doctor:ci` scenarios |
| `REPO RULES.md`, `.github/workflows/repo-rules-corpus.yml` | Edit | REQ-012 | The `AGENTS.md` section 4 citation and the tracked-symlink comment |
| `.skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md`, `assets/repo-rule-template.md`, `references/agents-md-integration.md` | Edit | REQ-012 | Link forms per rule location, a pointer to `check-repo-rules.cjs` in place of corpus counts, and the amended pointer contract |
| `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-010-alignment-audit.md` | Create | REQ-011 | Packet changelog, written at landing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files. REQ-001 to REQ-010 are the operator's ten questions in the order asked, REQ-011 is the release work the answers needed, and REQ-012 is the operator's later request to check `AGENTS.md` and the repo rules.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Code aligns with sk-code-skilled. `quality-gate.cjs --lines file --format json` over every code file in scope exits 0 with `NO_BLOCKER_FOUND` and 0 findings, `actionlint` over `.github/workflows/*.yml` exits 0, `shellcheck -S warning` over the in-scope shell scripts is clean, the four drift guards pass, and the in-scope test files sit under a `tests/` tree. |
| REQ-002 | Skill documents align with sk-create-skill. `validate_skill_package.py --strict` passes for each of the 23 in-scope skill and mode packets, `parent-skill-check.cjs` passes for the four hubs, and `ROUTER.md` numbers its sections in sequence with every citation resolving. |
| REQ-003 | Playbooks align with sk-create-manual-testing-playbook. `validate-playbook-package.cjs` passes with 0 violations for each in-scope package, the topology validator passes for sk-code, every scenario file validates, and each feature these packets shipped (trust, scoped faults, the parallel pool, `/doctor:ci` scaffold and toggle) has a scenario. |
| REQ-011 | Every skill packet the fixes touched carries a version bump and a changelog entry, the generated copies match their sources, and the route manifests are fresh: `compiled-route-guard.cjs` and `sync-skills-hermes.cjs --check` exit 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | READMEs align with sk-create-readme. Each README next to a changed file passes `validate_document.py`, none lists a file set that differs from its folder, and none tells migration history. |
| REQ-005 | READMEs, the root README included, are current. They name the quality runner, the trust grant, `/doctor:ci` and the pool, and a markdown link in them resolves. |
| REQ-006 | Skill routing reaches the right mode. A GitHub Actions request routes to `sk-code-ci`, a quality-config or trust request routes to `sk-code-quality`, and `compiled-route-admission.cjs --all` passes. |
| REQ-007 | The work is integrated in the skill advisor. A bare `/doctor:ci` returns the `command-doctor-ci-report` bridge and the bridge README describes how. |
| REQ-008 | Changelogs are updated or created. Each in-scope skill whose behavior changed has a newest entry at its `SKILL.md` version, and the validator warns on the internal-id and test-count class. |
| REQ-009 | Commands align with sk-create-command. The command index and the `/doctor:setup` playbook describe the 19-row target table and the `quality` target, and the route and bridge gates pass. |
| REQ-010 | Agents align. `@code` cites its Iron Law at the file that holds it, in the source and every mirror, and the mirror checks pass. |
| REQ-012 | `AGENTS.md`, `REPO RULES.md` and the `.skilled/repo-rules/` files align with the sk-create-repo-rule contract and with each other. Every finding that survives a refute pass is fixed or resolved by a contract amendment, and `check-repo-rules.cjs` prints `RESULT: PASSED`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --lines file --format json --files <final code set>` prints gate `NO_BLOCKER_FOUND` with 0 findings over 421 files.
- **SC-002**: `node .skilled/bin/compiled-route-guard.cjs` and `compiled-route-admission.cjs --all` exit 0 with every hub fresh and passing.
- **SC-003**: The three fix classes that a generator owns (Hermes copies, route manifests, runtime mirrors) pass their `--check` runs.
- **SC-004**: All three CI prompts the router finding names route to `sk-code-ci`. Met 2026-10-26, AC-006 carries it.
- **SC-005**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate --recursive --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The 705-file scope list is a snapshot | A file added later is not audited | The list is rebuilt from the two packets' commits, and the packet records its source |
| Dependency | Generators own the Hermes copies, manifests and mirrors | A hand edit would drift on the next sync | Every generated file is regenerated, then checked with its `--check` mode |
| Risk | A batch's own fix raised new findings | Nine new findings came from the first round | The re-audit ran after every fix and its findings got a second round |
| Risk | Test moves break callers | A workflow or a README points at a deleted path | Each moved test was grepped for its old path, and the Hermes copy carried the last one |
| Risk | A broad router keyword steals a neighbor's prompt | The round-2 keyword `github actions` pushed the review workflow out of the CI surface bundle | Narrowed to `github actions permissions`, and the compiled-route suites check the bundle cases |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. The audit reads files and runs existing checks, and it adds no runtime path.

### Security
- **NFR-S01**: No `local-*` skill is read or edited, and no private skill name is written into a tracked file.

### Reliability
- **NFR-R01**: Every fix has a verify command that was run after the fix, and a row reads done only with that output recorded.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a lane with no finding reports none. The ROUT lane reported six, so no lane was empty.
- Maximum length: 705 files in scope, 421 of them code and config in the final gate run.
- Invalid format: a symlink in the scope list resolves to its target before it is audited.

### Error Scenarios
- A fix breaks a gate: CODE-R01 and the route-manifest staleness came this way, and the re-audit caught both.
- A finding the contract does not forbid: folder READMEs and Python scripts named `.sh` were not reported as findings.

### State Transitions
- Partial completion: the round-2 router fix landed for one of three prompts, and a later keyword fix routed the other two before the phase closed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 705 files audited, about 170 working-tree entries changed, fifteen skill packets released |
| Risk | 12/25 | Mostly documentation and mirrors, one router vocabulary change and a bridge deriver change |
| Research | 8/20 | Four audit lanes read the contracts and ran the existing gates |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `AGENTS.md` gain the three missing governed-section pointers? The amended `agents-md-integration.md` makes the pointer the default, not a requirement, so this is an option for the operator and not an open defect. `AGENTS.md` mirrors the operator's global `CLAUDE.md`, which is why this phase did not edit it.
- Should the bare `/doctor:ci` keyword stop matching when a different target is typed? Today `/doctor:git hooks` returns the setup bridge second. That is a scorer design call for the advisor owner.
- Should the two released `sk-code-quality` changelog entries get an erratum? They carry an internal id and test counts, and the released-changelog guard protects them from edits, so only a new entry can correct them.
- Is a folder without a README a rule? The verifier flags 15 in-scope code folders, but no contract line states it as a rule.
- Should a framework-level `.skilled/changelog/skilled` entry record the CI efficiency work and `/doctor:ci`? The contract leaves that to the operator.
<!-- /ANCHOR:questions -->

---
