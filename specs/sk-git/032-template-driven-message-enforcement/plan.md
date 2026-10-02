---
title: "Implementation Plan: Template-driven, repo-agnostic enforcement of commit messages and PR descriptions"
description: "Embed a machine-readable contract in the commit and PR templates, resolve it per repository, and run one Node validator from commit-msg, pre-push, an agent PreToolUse hook and a required CI check."
trigger_phrases:
  - "message contract implementation plan"
  - "commit-msg validator port"
  - "pr body ci check"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Template-driven, repo-agnostic enforcement of commit messages and PR descriptions

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM validator, bash hook shims, GitHub Actions YAML |
| **Framework** | None |
| **Storage** | None (contract is data inside the template markdown) |
| **Testing** | `node --test`, the existing `tests/commit-msg.test.sh`, fixture repositories |

### Overview
The commit and PR templates each gain one fenced `json` block under a marked heading. The block is the contract, and the prose around it explains it. `message-contract.mjs` finds the contract for the current repository, validates its schema, and checks a commit message or PR body against it. It returns rule ids, severities and fix hints. The `commit-msg` hook becomes a shim over that module. `pre-push`, an agent PreToolUse hook and a CI workflow call the same CLI, so a rule exists in exactly one place.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Remaining open question in `spec.md` §12 answered by the operator [EVIDENCE: spec.md §12 records that no open questions remain and lists the operator's answers.]
- [x] 028/008 grammar changes frozen, or listed as contract entries to add [EVIDENCE: the follow-up plan lists the rule gaps and the replay identifies the four historical deviations.]
- [x] Current enforced rules inventoried from `.skilled/scripts/git-hooks/commit-msg`

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is Met, or is Waived/Superseded with a valid ADR [EVIDENCE: AC-001–AC-017 are closed; AC-007 is Superseded by ADR-004.]
- [x] Parity: all original `commit-msg.test.sh` cases have explicit verdicts; the three deliberate changes are documented in ADR-004 [EVIDENCE: acceptance-criteria.md AC-007 records the 19/22 match and the three intentional changes.]
- [x] Cross-repo fixtures prove an edited template changes enforcement [EVIDENCE: acceptance-criteria.md AC-004 records the fixture result; implementation-summary.md verification records cross-repo coverage.]
- [x] `validate.sh --strict` RESULT: PASSED [EVIDENCE: final strict validation output recorded after packet edits.]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single declarative contract, one validator, many thin enforcement adapters.

### Key Components
- **Contract block**: a fenced `json` block in `commit-message-template.md` and `pr-template.md` holding types, scope pattern, subject limits, vague-summary list, body rules, trailer order and patterns, forbidden attribution keys, passthrough subjects, and warning-level rules. Each rule has a stable id.
- **Resolver**: picks the contract in this order:
  1. The directory in git config `skgit.contractDir`.
  2. `.sk-git/commit-message-template.md` in the repository root, as a user-owned copy.
  3. The repository's own sk-git skill templates.

  A repository with none of these gets no enforcement. There is no machine-wide default and no skip switch.
- **Validator** (`message-contract.mjs`): pure functions `validateCommit(message, contract, ctx)` and `validatePrBody(body, contract)`. `ctx` supplies the repo root for the `Spec:` packet-existence check and the `Commit-Id` uniqueness lookup.
- **CLI** (`validate-message.mjs`): `--commit <file>`, `--range <a..b>`, `--pr-body <file|->`, `--explain` (prints the resolved contract source), `--json`.
- **Adapters**: the `commit-msg` shim, the `pre-push` range check, the agent PreToolUse gate, and the CI workflow.

### Data Flow
Message or PR body → resolver loads the repository's template → contract schema check → rule evaluation → errors block, warnings print → the adapter maps the result to its runtime's block signal (exit 1, a PreToolUse deny, or a failed check).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Today | After |
|---------|-------|-------|
| `commit-msg` hook | 268 lines of hardcoded bash regexes | Shim calling the validator |
| `prepare-commit-msg` | Strips attribution, stamps `Spec:` / `Commit-Id:` | Unchanged; reads trailer names from the contract |
| `pre-push` | No message checks | Validates the outgoing range |
| Agent runtimes | Advisory-only git preflight | Adds a blocking gate for PR bodies and inline commit messages |
| CI | No message check | Required check over pushed commits and PR bodies |
| Other repositories on the global hooks path | Forced into this repository's format | Enforced by their own contract, or opted out |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`:
1. **Contract.** Define the schema and write the contract blocks from today's hook rules and pr-template.
2. **Validator.** Build the module and CLI, then prove parity against the bash hook.
3. **Adapters.** Wire the `commit-msg` shim, `pre-push`, the agent gate and CI.
4. **Verification.** Run cross-repo fixtures, the drift test and docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Parity.** Run every case in `.skilled/scripts/git-hooks/tests/commit-msg.test.sh` through the old hook and the new shim, and require identical verdicts.
- **Unit.** One test per contract rule id, with a pass case and a fail case.
- **Cross-repo.** Use two fixture repositories with edited templates: different types, no `Spec:` trailer, a 72-character subject limit. Prove each enforces its own rules.
- **Drift.** Every self-check bullet in the template maps to a contract rule id, and every rule id appears in the prose.
- **Bypass.** Make a commit with `--no-verify`. The pre-push check must block it, and the CI workflow run on a test branch must fail it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node ≥ 20 on committing machines (already required by the spec-kit hooks).
- GitHub ruleset on `main` requiring the `message-contract` check (owner action).
- `specs/sk-git/028-crawlable-commit-history/008-second-pass-subjects-and-attribution` for the final subject and attribution rules.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The validator blocks valid commits, or a contract parse error blocks all commits.
- **Procedure**: Restore the previous `commit-msg` from git and re-run `install-git-hooks.sh`; disable the CI workflow.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Contract ──► Validator ──► Adapters ──► Verification
                 │
                 └──► Parity test (gates the commit-msg swap)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract | None | Validator |
| Validator | Contract | Adapters |
| Adapters | Validator, parity green | Verification |
| Verification | Adapters | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract + schema | Med | 2-3 hours |
| Validator + parity | Med | 4-6 hours |
| Adapters (hooks, agent gate, CI) | High | 4-6 hours |
| Verification + docs | Med | 2-3 hours |
| **Total** | | **12-18 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Old `commit-msg` kept reachable at its last commit for one-command restore
- [ ] CI check added as non-required first, promoted to required after a clean week
- [ ] Revert path for the hook files documented, since no skip switch exists

### Rollback Procedure
1. Revert the hook files in the affected repository; with no bypass, this is the only unblock.
2. `git revert` the adapter commit and re-run `bash .skilled/scripts/install-git-hooks.sh`.
3. Commit a known-good and a known-bad message to confirm the old hook verdicts.
4. Remove the CI check from the ruleset if it was required.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐
│ Contract     │────►│ Validator +  │────►│ commit-msg · pre-push ·  │
│ blocks+schema│     │ CLI          │     │ agent gate · CI workflow │
└──────────────┘     └──────┬───────┘     └──────────────────────────┘
                            │
                     ┌──────▼───────┐
                     │ Parity test  │
                     └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Contract schema + blocks | None | Rule set with ids | Validator |
| Validator + CLI | Contract | Verdicts | Adapters, parity |
| Parity test | Validator, old hook | Equal-verdict proof | commit-msg swap |
| Adapters | Validator, parity | Enforcement points | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Contract schema and commit block** - 2-3 h - CRITICAL
2. **Validator with parity** - 4-6 h - CRITICAL
3. **commit-msg shim + CI workflow** - 3-4 h - CRITICAL

**Total Critical Path**: 9-13 hours

**Parallel Opportunities**:
- PR contract block and `validatePrBody` alongside the commit validator
- Agent gate and pre-push adapter after the CLI exists
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Contract defined | Both templates carry schema-valid blocks | Contract phase |
| M2 | Validator at parity | Old and new verdicts identical on every hook test case | Validator phase |
| M3 | Enforcement live | All four adapters block a bad message; fixtures prove repo-agnostic | Verification phase |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Decisions are recorded in full in `decision-record.md`: ADR-001 (the template carries the contract), ADR-002 (one Node validator), ADR-003 (what "100% enforced" means).

---

## FOLLOW-UP PLAN: TEMPLATE RULE COVERAGE (2026-10-02)

This follow-up stays in the existing Level 3 packet. The ordered work below does not create phase child folders.

### Execution Sequence

1. **Align the contract and guidance.** Add `subject.scopeAliases`, `subject.warnLength` and `body.breakingSections` to the commit template's enforced-rules block. Replace the `fix(spec-kit)` example with a canonical scope and align `SKILL.md` wording.
2. **Add validator behavior.** In `scripts/lib/message-contract.mjs`, report `subject.scope-alias` as an error for a configured alias, `subject.length-target` as a warning above 80 characters, and `body.breaking-sections` as an error when a breaking commit lacks any required section. Keep the existing hard error above 100 characters.
3. **Cover message and hook behavior.** Add unit and commit-hook cases for each rule, including canonical scopes, alias rejection, the 80-character warning boundary, the 100-character hard limit and a breaking message missing each required section.
4. **Run unit coverage in CI.** Add the unit-test command to `.github/workflows/message-contract.yml` so a workflow run executes the same suite used locally.
5. **Replay the missed range.** Run `node .skilled/skills/sk-git/scripts/validate-message.mjs --rev-list f8519088b9..03afeb4552`. The replay must report exactly the three new rule IDs: `subject.scope-alias`, `subject.length-target` and `body.breaking-sections`, covering the four recorded deviations.

### Design Constraints

- Do not infer scope from changed paths. `commit-msg` cannot see the complete path set during `--amend`.
- Keep the 80-character target at warning severity and the 100-character limit at error severity.
- Keep warning surfacing in the agent gate and judgment checks about obvious reasons or independent owners with review.

### Planned Verification

```bash
node --test .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs
bash .skilled/scripts/git-hooks/tests/commit-msg.test.sh
node .skilled/skills/sk-git/scripts/validate-message.mjs --rev-list f8519088b9..03afeb4552
```

The workflow must run the unit suite and report success for the implementing change. The packet's strict validator remains the documentation gate after the follow-up criteria have evidence and their statuses are updated.

---
