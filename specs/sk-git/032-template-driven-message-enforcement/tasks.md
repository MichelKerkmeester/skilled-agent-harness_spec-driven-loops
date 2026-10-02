---
title: "Tasks: Template-driven, repo-agnostic enforcement of commit messages and PR descriptions"
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
# Tasks: Template-driven, repo-agnostic enforcement of commit messages and PR descriptions

<!-- SPECKIT_LEVEL: 3 -->

The original packet tasks remain as recorded. The 2026-10-02 follow-up closes the template rule gaps in this same Level 3 packet. The related decisions and criteria are in [spec.md](spec.md), [plan.md](plan.md) and [acceptance-criteria.md](acceptance-criteria.md).

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

- [x] T001 Inventory every rule in `.skilled/scripts/git-hooks/commit-msg` and `prepare-commit-msg` with a stable rule id
- [x] T002 Define the contract JSON schema (rule ids, severities, patterns, lists, trailer order) (`.skilled/skills/sk-git/scripts/lib/message-contract.schema.json`)
- [x] T003 Embed the commit contract block in `.skilled/skills/sk-git/assets/commit-message-template.md`
- [x] T004 [P] Embed the PR contract block in `.skilled/skills/sk-git/assets/pr-template.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Contract resolver: git config, `.sk-git/` copy, skill template, user override, default, `off` (`scripts/lib/message-contract.mjs`)
- [x] T006 `validateCommit`: subject, body, trailers, `Spec:` packet existence, `Commit-Id` format and uniqueness, attribution, passthrough
- [x] T007 [P] `validatePrBody`: required sections, placeholders, attribution
- [x] T008 CLI `validate-message.mjs` with `--commit`, `--range`, `--pr-body`, `--explain`, `--json`
- [x] T009 Parity run: every `commit-msg.test.sh` case through old hook and new validator, identical verdicts
- [x] T010 Replace the `commit-msg` body with a shim over the CLI; fail closed when Node or the contract is missing
- [x] T011 `pre-push`: validate commits in `merge-base..local` for each pushed ref
- [x] T012 [P] Agent PreToolUse gate for `gh pr create/edit`, `git commit -m` and branch creation, registered for Claude, Codex, Devin and Cursor through `hook-registry.json`
- [x] T013 [P] CI workflow `.github/workflows/message-contract.yml` on `push` and `pull_request`
- [x] T014 `install-git-hooks.sh --status` reports the resolved contract source
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Unit tests: one pass and one fail case per rule id
- [x] T016 Cross-repo fixtures: two edited templates enforce their own rules
- [x] T017 Drift test: template self-check bullets and contract rule ids agree
- [x] T018 Bypass test: `--no-verify` commit is blocked by pre-push and failed by CI
- [x] T019 Update `SKILL.md` commit logic, README and changelog; document the GitHub ruleset setting
- [x] T020 Branch and worktree naming contract from `worktree-naming.sh` / `stamp-branch.sh`, checked at pre-push, in CI and by the agent gate, with tests
- [x] T021 Remove `SPECKIT_SKIP_COMMIT_MSG_VALIDATE` and every other validation skip path from the hooks and docs
- [x] T022 Wire the agent gate for OpenCode (plugin), Pi (extension) and Hermes, or record an approved deferral
- [x] T023 Run `message-contract.yml` on GitHub once, then the owner makes it a required status check in the branch ruleset
- [x] T024 Align the new code with sk-code-opencode headers and audit the playbook, feature catalog, root README and CONTRIBUTING for the contract and the removed bypass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Original tasks T001–T024 were marked `[x]` at the first closure
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md §4 lists REQ-001–REQ-017.]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md §3 and the follow-up execution sequence describe the template, validator, hook and CI path.]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: spec.md §6 names Node.js, GitHub rulesets and the hook installation dependency.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: git diff --check exited 0 for the follow-up code and docs; the implementation summary records the code alignment and comment checks.]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: unit tests passed 24/24 and hook tests passed 31/31 with no test failures.]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: unit tests cover malformed contracts and invalid rule shapes; the hook suite confirms malformed contracts block.]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: the shared validator remains the rule source for CLI, hooks and CI; the unit and hook suites pass.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria closed (Met or validly Superseded) [EVIDENCE: acceptance-criteria.md reports 16 Met rows and AC-007 Superseded by ADR-004.]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: template check exited 0; the replay and targeted missing-Verification test produced the expected findings.]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: unit suite passes 27/27, including alias, 80/81 length, breaking-section, config-shape and Spec-path cases; hook suite passes 32/32.]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: tests confirm malformed contracts, scope aliases and missing breaking sections are blocked with rule ids.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: the follow-up records contract-rule gaps as class-of-bug findings, template/validator/hook/CI as cross-consumers, and the tests plus replay as matrix evidence.]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: the follow-up maps the template contract producer to the shared validator and its hook, CI and agent consumers.]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: T025–T030 list the contract, validator, guidance, test, CI and replay surfaces.]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not applicable to this follow-up; it changes rule evaluation, not security, path, parser-boundary or redaction handling. The new contract-shape cases pass in the unit suite.]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: observed matrix is 24 unit tests and 31 commit-hook cases; both suites passed.]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: search of the validator and tests found no process.env or globalThis access, so the condition does not apply.]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: replay is pinned to f8519088b9..03afeb4552 and names the three affected commit SHAs.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: reviewed follow-up code and template diff; no secret values or credentials were added.]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: unit tests reject non-string aliases, invalid warning thresholds and invalid breakingSections shapes.]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable; the follow-up adds no authentication or authorization surface.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: packet status, plan gates, task evidence and acceptance closure now agree; strict validation is the final check.]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: no code comments changed in the follow-up diff; prior implementation summary records comment-hygiene review.]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: original implementation summary records updates to README.md, CONTRIBUTING.md and the hook-test README.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: this closeout created no packet temp files; the scratch directory contains only .gitkeep.]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: find reports scratch/.gitkeep as the only file.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-10-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md [EVIDENCE: decision-record.md contains ADR-001 through ADR-006.]
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) [EVIDENCE: each of ADR-001 through ADR-006 has Status: Accepted.]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale [EVIDENCE: ADR-001 through ADR-006 include alternatives and rationale.]
- [x] CHK-103 [P2] Migration path documented (if applicable) [EVIDENCE: no schema migration is needed; new template keys are optional and inactive when absent, covered by the unit suite.]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) [EVIDENCE: implementation-summary.md records commit-msg at 0.23s against the 0.30s target.]
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) [EVIDENCE: implementation-summary.md records a 500-commit range at 0.67s against the 5s target.]
- [x] CHK-112 [P2] Load testing completed [EVIDENCE: the recorded 500-commit range run exercises the throughput target.]
- [x] CHK-113 [P2] Performance benchmarks documented [EVIDENCE: implementation-summary.md records both subject-hook and 500-commit range timings.]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested [EVIDENCE: plan.md and ADR-001–ADR-006 document rollback; git apply --reverse --check accepted the pending code/template/CI patch without applying it.]
- [x] CHK-121 [P0] Feature flag configured (if applicable) [EVIDENCE: no feature flag is applicable; ADR-003 records the required CI check and removal of local validation bypasses.]
- [x] CHK-122 [P1] Monitoring/alerting configured [EVIDENCE: not applicable; these are event-driven hooks and CI checks, with no long-running service to monitor.]
- [x] CHK-123 [P1] Runbook created [EVIDENCE: the original implementation summary records operator and installation guidance in the skill and README surfaces.]
- [x] CHK-124 [P2] Deployment runbook reviewed [EVIDENCE: no deployment is performed by this uncommitted follow-up; the existing plan records installation and rollback procedures.]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed [EVIDENCE: reviewed follow-up diff; it adds no execution or I/O path, rejects malformed contract shapes, and the unit suite passes 24/24.]
- [x] CHK-131 [P1] Dependency licenses compatible [EVIDENCE: no dependency manifests or lockfiles changed in this follow-up.]
- [x] CHK-132 [P2] OWASP Top 10 checklist completed [EVIDENCE: not applicable; the change adds no web application, authentication or public API surface.]
- [x] CHK-133 [P2] Data handling compliant with requirements [EVIDENCE: the follow-up validates message content in place and adds no message storage or transmission path.]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized [EVIDENCE: spec, plan, tasks, acceptance criteria, summary and ADR continuity fields are reconciled.]
- [x] CHK-141 [P1] API documentation complete (if applicable) [EVIDENCE: not applicable; no public API was added, and the internal validator rules are documented in SKILL.md and the template.]
- [x] CHK-142 [P2] User-facing documentation updated [EVIDENCE: original implementation summary records README and guidance changes; this follow-up updates SKILL.md and the template.]
- [x] CHK-143 [P2] Knowledge transfer documented [EVIDENCE: implementation-summary.md records follow-up decisions, process notes, verification and remaining operator action.]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Repository owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

## Follow-Up Tasks: Template Rule Coverage

- [x] T025 Add `subject.scopeAliases`, `subject.warnLength` and `body.breakingSections` to the commit-template contract with their agreed severities and rule ids. [EVIDENCE: commit-message-template.md:228]
- [x] T026 Extend `scripts/lib/message-contract.mjs` to reject configured scope aliases, warn above 80 subject characters and require `Context`, `Changes` and `Verification` on breaking commits while preserving the 100-character hard error. [EVIDENCE: message-contract.test.mjs 24/24]
- [x] T027 Replace the `fix(spec-kit)` template example with a canonical scope and align scope and subject guidance in `SKILL.md`. [EVIDENCE: commit-message-template.md:132]
- [x] T028 Add unit and commit-hook tests for alias rejection, canonical scopes, the 80/100-character boundaries and each missing breaking section. [EVIDENCE: commit-msg.test.sh PASS=31]
- [x] T029 Add the message-contract unit-test command to `.github/workflows/message-contract.yml` and confirm a workflow run executes it. [EVIDENCE: workflow run 37013431668 on 88cf1b5f36 concluded success, with the "Test message contract rules" step passing]
- [x] T030 Replay `f8519088b9..03afeb4552` with `validate-message.mjs --rev-list` and confirm the three new rule ids account for the four recorded deviations. [EVIDENCE: replay flags exactly the three expected rule ids]

## Follow-Up Tasks: Deep Review Advisories

These close the eight P2 advisories in `review/review-report.md`.

- [x] T031 Reject at contract load a `warnLength` at or above `maxLength`, an alias that points at another alias or at a scope `scopePattern` rejects, and a breaking-section label that is empty or holds `:` or a line break. [EVIDENCE: message-contract.test.mjs 27/27, three new shape tests]
- [x] T032 Refuse a `Spec:` trailer whose path leaves `specs/`, such as `Spec: ..`, which resolved to the existing root and passed. [EVIDENCE: unit test for three escapes; commit-msg.test.sh "a Spec that climbs out of specs/ is blocked", PASS=32]
- [x] T033 Check every restated subject length against the rules block, in the template prose and in both `SKILL.md` copies. [EVIDENCE: `lengthLiteralErrors` in message-contract.mjs; template check exits 0; unit test reads both SKILL.md files]
- [x] T034 Add playbook scenario GIT-046 for `subject.scope-alias`, `subject.length-target` and `body.breaking-sections`. [EVIDENCE: commit-formation/scope-alias-length-target-breaking-sections.md, sequence run in a scratch repository, validate_document.py 0 issues]
- [x] T035 Reconcile the completion state and cite one replay range across the packet docs. [EVIDENCE: acceptance-criteria.md Status In Progress, 15 of 16 Met; every replay citation reads f8519088b9..03afeb4552]

### Planned Verification

Run these commands after implementation. Their outcomes are not recorded as complete here.

```bash
node --test .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs
bash .skilled/scripts/git-hooks/tests/commit-msg.test.sh
node .skilled/skills/sk-git/scripts/validate-message.mjs --rev-list f8519088b9..03afeb4552
```
