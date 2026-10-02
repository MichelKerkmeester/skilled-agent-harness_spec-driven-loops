---
title: "Feature Specification: Template-driven, repo-agnostic enforcement of commit messages and PR descriptions"
description: "sk-git's commit standard is enforced by rules hardcoded in a bash hook, PR descriptions are not enforced at all, and every local hook can be bypassed. This packet makes the template the single machine-readable contract, enforces it at commit, push, agent and CI time, and lets any repo or user swap in their own template."
trigger_phrases:
  - "template-driven commit enforcement"
  - "repo-agnostic commit message hook"
  - "pr description validation"
  - "commit message contract json"
  - "block misaligned commit messages"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Template-driven, repo-agnostic enforcement of commit messages and PR descriptions

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

sk-git's commit standard covers far more than formatting: a fixed subject grammar, a mandatory "why" body, search-optimized trailers (`Spec:` and `Commit-Id:`) and a ban on assistant attribution. Today those rules are hardcoded as regexes in a bash `commit-msg` hook that is installed globally, so the same format is forced on every repository on the machine. PR descriptions are not checked at all, and every layer can be skipped with `--no-verify` or an environment flag. This packet moves the rules into one machine-readable contract that lives with the template, runs a single validator against it at four points (commit, push, agent tool call and CI), and resolves the contract per repository so a user who edits their template gets their own format enforced.

**Key Decisions**: the template carries the contract, not the hook (ADR-001); one Node validator serves every enforcement point (ADR-002); only the CI check can make enforcement unbypassable, so "100%" is defined as a required server-side check (ADR-003).

**Critical Dependencies**: GitHub branch protection or rulesets on the target repository, which only the repository owner can enable.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-01 |
| **Branch** | `worktrees/073-message-contract-enforcement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-git commit contract is written three times: as prose in `SKILL.md` and `assets/commit-message-template.md`, and as hardcoded regexes in `.skilled/scripts/git-hooks/commit-msg`. Editing the template does not change what the hook enforces, so the two drift. The hook is installed through a global `core.hooksPath`, so it imposes this repository's types, scopes and trailers on every other repository the user commits to. `assets/pr-template.md` defines a PR description standard that nothing checks. Every enforcement point is local and can be skipped (`git commit --no-verify`, `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1`, or a push from a machine without the hooks), so a misaligned message can still reach `origin`.

### Purpose
Every commit message and PR description that reaches the remote matches the standard defined by that repository's own template, and the template is the only place a user edits to change that standard.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A machine-readable message contract that covers the whole current commit standard, not only the forbidden attribution lines:
  - **Subject grammar.** Allowed types in priority order, the scope pattern, the summary rules (lowercase imperative start, no trailing punctuation, no vague summaries), the 80-character target and 100-character hard limit, and the breaking `!` paired with a `BREAKING CHANGE:` footer.
  - **Body.** A prose body is required on every authored commit, with the optional `Context` / `Changes` / `Verification` sections and the 100-character line warning.
  - **Search-optimized trailers.** One final contiguous trailer paragraph in a fixed order. `Spec: <track>/<packet>[/<phase>...]` has no `specs/` prefix and must resolve to an existing packet folder. `Commit-Id: NNNNNNN` is seven digits and unique. `Refs:` holds external links only. The packet-keyword subject rule comes from 028/008.
  - **Attribution and process language.** `Co-Authored-By`, `Claude-Session` and vendor trailers are forbidden. Internal process labels (phase, wave, tranche, task counts) produce a warning in the subject.
  - **Passthrough.** Git-generated `Merge`, `Revert`, `fixup!`, `squash!` and `amend!` subjects pass unchanged.
- A PR description contract derived from `assets/pr-template.md`: required sections, forbidden placeholders, and the same attribution policy.
- A branch and worktree naming contract taken from the rules `worktree-naming.sh` and `stamp-branch.sh` apply today, checked when a branch is pushed, in CI, and by the agent gate before `git branch`, `git checkout -b`, `git switch -c` or `git worktree add` runs.
- The contract lives in the template files themselves, so editing the template is editing the enforcement.
- Per-repository contract resolution: the directory in git config `skgit.contractDir`, then a repo-root `.sk-git/` template, then the repository's own sk-git skill templates. A repository with none of these gets no enforcement at all: there is no machine-wide default.
- No bypass. The `SPECKIT_SKIP_COMMIT_MSG_VALIDATE` variable is removed and no gate that validates a message, PR body or branch name has a skip switch. The stamper's `SPECKIT_SKIP_PREPARE_COMMIT_MSG` stays, because skipping the stamper skips no validation. Git itself always honors `--no-verify` and no hook can stop that, so the push check and the CI check are what catch a skipped commit check.
- One Node validator module with a CLI, shared by every enforcement point.
- Enforcement points:
  - The `commit-msg` hook blocks a misaligned commit.
  - The `pre-push` hook re-validates every outgoing commit, which catches commits made with `--no-verify`.
  - An agent PreToolUse hook blocks `gh pr create` / `gh pr edit` with a misaligned body, plus `git commit -m` before it runs.
  - A GitHub Actions workflow validates every pushed commit and every PR body as a required status check.
- A drift test proving the template prose, its self-check list and the machine contract agree.
- Fixtures that prove another repository's edited template changes what is enforced.

### Out of Scope
- Rewriting existing history to the contract. Packet 028/005 and 028/008 own history rewrites.
- Enabling branch protection on GitHub. The owner does that, and this packet documents the exact setting.
- Semantic checks a regex cannot make, such as whether the type truly matches the diff. These stay advisory in the agent workflow.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/assets/commit-message-template.md` | Modify | Embed the commit contract block; prose and self-check stay in sync with it |
| `.skilled/skills/sk-git/assets/pr-template.md` | Modify | Embed the PR description contract block |
| `.skilled/skills/sk-git/scripts/lib/message-contract.mjs` | Create | Contract loader, resolver and validator (commit and PR) |
| `.skilled/skills/sk-git/scripts/validate-message.mjs` | Create | CLI: `--commit`, `--rev-list`, `--pr-body`, `--branch`, `--explain`, `--check-template` |
| `.skilled/scripts/git-hooks/commit-msg` | Modify | Thin shim calling the validator; hardcoded regexes removed |
| `.skilled/scripts/git-hooks/pre-push` | Modify | Validate every outgoing commit in the pushed range |
| `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | Create | Blocking agent PreToolUse hook for `gh pr create/edit` and `git commit -m` |
| `.github/workflows/message-contract.yml` | Create | CI check over pushed commits and PR bodies |
| `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` | Create | Unit tests, drift test, cross-repo fixtures, agent gate |
| `.skilled/skills/sk-git/assets/worktree-checklist.md` | Modify | Embed the branch naming contract block |
| `.skilled/scripts/git-hooks/lib/message-contract-gate.sh` | Create | Validator lookup and no-node fallback shared by `commit-msg` and `pre-push` |
| `.skilled/scripts/git-hooks/tests/commit-msg.test.sh` | Modify | Wire the fixture contract, retire the bypass case, add 7 cases |
| `.skilled/scripts/git-hooks/tests/pre-push-message-contract.test.sh` | Create | Real-remote tests for the push gate |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | Register the agent gate for four runtimes; the runtime configs are rendered from it |
| `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` | Modify (rendered) | Agent gate binding |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modify | Doctor checks the gate file exists |
| sk-git `README.md`, `references/commit-workflows.md`, feature catalog, script READMEs, hook READMEs, `.env.example`, changelog `v1.8.0.0.md` | Modify / Create | Document the contract and drop the bypass |
| `.skilled/skills/sk-git/SKILL.md` | Modify | Point the commit logic at the contract; document resolution and bypass policy |
| `.skilled/scripts/install-git-hooks.sh` | Modify | `--status` reports the resolved contract; the bypass line is gone |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The commit contract is declared once, inside the template, and covers every rule the current `commit-msg` hook enforces plus the `Spec:` packet-existence check |
| REQ-002 | One validator reads the resolved contract; no enforcement point carries its own copy of a rule |
| REQ-003 | Contract resolution is per repository: git config path, then repo `.sk-git/` template, then the repo's sk-git templates; a repository with none gets no enforcement |
| REQ-004 | Editing a repository's template changes what that repository's hooks and CI enforce, with no hook edit |
| REQ-005 | `commit-msg` blocks a misaligned commit and prints each violated rule with its contract id |
| REQ-006 | A CI required check validates every pushed commit and every PR body and fails on any violation |
| REQ-007 | The new validator is at parity with today's hook: every case in `tests/commit-msg.test.sh` gives the same verdict |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `pre-push` re-validates the outgoing range and blocks commits that skipped `commit-msg` |
| REQ-009 | The agent PreToolUse hook blocks a `gh pr create` / `gh pr edit` whose body breaks the PR contract, across the runtimes the advisory hook already serves |
| REQ-010 | A drift test fails when the template's self-check list and its contract block disagree |
| REQ-011 | No bypass switch exists: `SPECKIT_SKIP_COMMIT_MSG_VALIDATE` is removed and no validating gate has a skip variable, and a commit made with `--no-verify` is caught by pre-push and CI |
| REQ-012 | Branch and worktree names are validated against the repository's naming contract at push, in CI, and by the agent gate before the branch is created |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With branch protection enabled, no commit or PR body that violates the resolved contract can land on a protected branch of `origin`.
- **SC-002**: A fixture repository with an edited template, such as different types, no `Spec:` trailer and a different subject limit, is enforced by its own rules and not by sk-git's.
- **SC-003**: The new validator gives the same verdict as the current hook on 100% of the existing hook test cases.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | GitHub branch protection / rulesets | Without it the CI check reports but does not block | Document the exact ruleset; the pre-push layer still blocks locally |
| Dependency | Node on every machine that commits | The hook shim cannot run the validator | Shim fails closed with an install hint; Node is already required by the spec-kit hooks |
| Risk | A malformed edited template blocks every commit | High | Validate the contract on load; on a broken contract, block with the parse error and the file path, never silently pass |
| Risk | Global `core.hooksPath` changes behavior in unrelated repos | Low | A repository without its own template gets no enforcement |
| Risk | With no bypass, a validator bug blocks all commits | High | Parity tests before the swap; a fix is a normal commit after reverting the hook file, or removing the repo's contract |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `commit-msg` validation completes in under 300 ms. The `Spec:` existence check is a single `stat`.
- **NFR-P02**: `pre-push` validates a 500-commit range in under 5 s.

### Security
- **NFR-S01**: The validator never executes content from the message or the template. The contract is parsed as data, and input is capped at 200,000 characters before any contract pattern runs, because JavaScript regexes have no timeout.

### Reliability
- **NFR-R01**: Fail closed. An unreadable contract or a validator crash blocks with an actionable error and never passes silently.

---

## 8. EDGE CASES

### Data Boundaries
- Empty message: blocked, as today.
- Git-generated subjects (`Merge`, `Revert "…"`, `fixup!`, `squash!`, `amend!`): pass through, as declared in the contract.
- Pushing a branch whose older commits predate the contract: the pre-push and CI ranges start at the merge base with the protected branch, never at the root.
- `Spec:` pointing at an archived packet (`z_archive/`): resolved by the same lookup the spec-kit uses.

### Error Scenarios
- Template has no contract block: fall back to the next resolution level, and `--explain` reports which file supplied the contract.
- Contract block fails schema validation: block and print the schema error.
- `gh` invoked with `--body-file`: the agent hook reads the file. With `--fill`, it validates the generated body after the fact in CI.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~11, LOC: ~700, Systems: hooks, agent runtimes, CI |
| Risk | 15/25 | Auth: N, API: Y (hook contract), Breaking: Y for other repos on the global hooks path |
| Research | 8/20 | Contract schema shape, per-runtime PreToolUse blocking |
| Multi-Agent | 5/15 | Workstreams: 2 |
| Coordination | 8/15 | Dependencies: branch protection, 028/008 in progress |
| **Total** | **54/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Parity gap: the Node validator accepts something the bash hook rejected | H | M | Run the existing hook test suite against both before the swap |
| R-002 | Contract and prose drift again | M | M | Drift test in the hook test suite and CI |
| R-003 | Local hooks skipped and the remote is unprotected | H | M | CI check plus the documented ruleset; pre-push marker reporting |
| R-004 | 028/008 changes the grammar mid-build | M | M | Build after 008 freezes, or encode its rules as contract entries |

---

## 11. USER STORIES

### US-001: Enforce my repo's own standard (Priority: P0)

**As a** developer using sk-git in my own repository, **I want** the hooks to enforce the commit format in my edited template, **so that** I am not forced into this repository's types, scopes and trailers.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Nothing misaligned reaches the remote (Priority: P0)

**As a** repository owner, **I want** every commit and PR description on `origin` to match the standard, **so that** the history stays searchable by `Spec:` and `Commit-Id:` and free of attribution lines.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Agents are stopped before they act (Priority: P1)

**As an** operator running AI agents, **I want** a misaligned `gh pr create` or `git commit -m` blocked before it runs, **so that** the agent fixes the message instead of discovering the failure afterwards.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- None.

Answered 2026-10-01 by the operator:
- The rules sit in a fenced `json` block under an "Enforced rules" heading inside the template body, not in the frontmatter header, which other tools already read for titles and search.
- Creation standards cover PR descriptions and branch and worktree naming.
- Local bypasses are removed.
- A repository with no template gets no enforcement.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`
- **Prior work**: `specs/sk-git/028-crawlable-commit-history` (grammar, trailers, search surface), `specs/sk-git/030-commit-body-always-required`

---

## FOLLOW-UP: TEMPLATE RULE COVERAGE (2026-10-02)

### Trigger and Root Cause

Four message-contract deviations reached `main` in commits `4ceef9d5e7`, `4754d270ab` and `7488e80836`, although `node .skilled/skills/sk-git/scripts/validate-message.mjs --rev-list f8519088b9..03afeb4552` reported zero errors and zero warnings:

- A breaking commit had no `Context`, `Changes` or `Verification` section.
- An 82-character subject exceeded the 80-character target.
- The scope `spec-kit` was used for system-spec-kit paths.
- The scope `rules` was used where the canonical scope is `repo-rules`.

The read-only investigation found that the validator enforces only rules represented in the template's `Enforced rules` JSON block. None of these four checks was represented there. The template example `fix(spec-kit)` also conflicts with scope rule 1 in `.skilled/skills/sk-git/SKILL.md`.

### Operator Decisions

- Canonical scopes are the full skill names `system-spec-kit`, `system-skill-advisor` and `system-deep-loop`, plus `repo-rules`. Configured aliases such as `spec-kit` and `rules` produce an error.
- A breaking commit requires all three sections: `Context`, `Changes` and `Verification`. Missing any section is an error.
- More than 80 subject characters produces a warning. More than 100 remains a hard error.

### Follow-Up Requirements

| ID | Requirement |
|----|-------------|
| REQ-013 | The commit template declares `subject.scopeAliases`; a configured alias produces the `subject.scope-alias` error and the canonical scopes are the full skill names plus `repo-rules`. |
| REQ-014 | The commit template declares `subject.warnLength`; subjects over 80 characters produce the `subject.length-target` warning, while subjects over 100 characters remain blocked. |
| REQ-015 | The commit template declares `body.breakingSections`; a breaking commit missing any of `Context`, `Changes` or `Verification` is blocked with `body.breaking-sections`. |
| REQ-016 | The template example and `SKILL.md` wording use the canonical scopes and agree with the enforced contract. |
| REQ-017 | Unit and hook tests cover the new rules, and the message-contract CI workflow runs the unit test suite. |
| REQ-018 | A commit in a linked worktree of the hook's own repository is validated by that worktree's validator, so a change that adds a template key can be committed; any other repository never runs its own validator. |

### Follow-Up Scope

In scope are the three contract keys and validator checks, the canonical-scope example correction, aligned scope wording in `SKILL.md`, unit and commit-hook tests, a CI step for the unit suite, and a `--rev-list` replay of the missed range. The measured impact over the last 300 commits is 26 scope-alias flags, 24 subject-length warnings and one breaking-sections flag since the gate went live.

Path-based scope inference is rejected because `commit-msg` cannot see the full path set during `--amend`. Warning display in the agent gate is out of scope. Judgment checks, including whether a reason is obvious or owners are independent, stay with review.

| File Path | Planned Change |
|-----------|----------------|
| `.skilled/skills/sk-git/assets/commit-message-template.md` | Add the three contract keys and replace the noncanonical scope example. |
| `.skilled/skills/sk-git/scripts/lib/message-contract.mjs` | Enforce the configured scope aliases, subject target warning and breaking-section requirement. |
| `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` | Add unit coverage for each new rule and its boundary cases. |
| `.skilled/scripts/git-hooks/tests/commit-msg.test.sh` | Add hook-level coverage for the new blocking rules and warning behavior. |
| `.skilled/skills/sk-git/SKILL.md` | Align commit scope and subject wording with the contract. |
| `.github/workflows/message-contract.yml` | Run the message-contract unit suite in CI. |

The follow-up remains in this Level 3 packet. Its planning artifacts are `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `decision-record.md`.

---
<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-git-hook-review-fixes/ | Fix the nineteen git hook review findings (untrusted source root, pre-push range, Commit-Id rules, foreign-repo gates, doc drift) | Complete |
| 2 | 002-git-hook-review-residuals/ | Fix the ten P2 findings a five-iteration deep review left (checker crash, hardcoded routing path, rules probe parity, regex backtracking, attribution key drift, doc drift) | Complete |
| 3 | 003-hook-docs-and-standards-alignment/ | Align the hook docs, code READMEs and env reference with the hooks, and close three standards gaps a read-only audit found (unreadable staged blob, temp cleanup, Spec path containment) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-git-hook-review-fixes | 002-git-hook-review-residuals | Phase 1 fixes verified; a deep review of the live hooks reports what is left | `001-git-hook-review-fixes/review/review-report.md` |
| 002-git-hook-review-residuals | 003-hook-docs-and-standards-alignment | Phase 2 residuals closed; a read-only audit of the hook changes reports what docs and code still disagree | `003-hook-docs-and-standards-alignment/scratch/audit-report.md` |
<!-- /ANCHOR:phase-map -->
