---
title: "Template-driven message contract"
description: "One validator holds every commit message, PR description and new branch name to the rules block a repository's own sk-git templates declare, at four gates with no bypass."
trigger_phrases:
  - "message contract enforcement"
  - "enforced rules block"
  - "validate-message.mjs"
  - "commit message gate"
importance_tier: "important"
version: 1.0.0.0
---

# Template-driven message contract (validate-message.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The rules a commit message, a PR description and a new branch name must meet live in the templates themselves. Each of `commit-message-template.md`, `pr-template.md` and `worktree-checklist.md` carries an "Enforced rules" section: a table of rule ids for the reader and a fenced `json` block the gates read. Edit the block and every gate follows it. Nothing else in the code names a rule.

The contract is repository-agnostic. A repository that carries its own copy of a template gets its own rules, and a repository with no rules block is not checked at all. There is no bypass variable: the way to change what is enforced is to change the template.

---

## 2. HOW IT WORKS

### Contract Resolution

`resolveContractDir` looks for the templates in a fixed order: the directory git config `skgit.contractDir` names, then `<repo>/.sk-git/`, then `<repo>/.skilled/skills/sk-git/assets`, then the same path under `.opencode`. The first directory that exists wins. A template with no "Enforced rules" heading leaves that kind unenforced. A rules block that is not valid JSON, or is missing a field a rule needs, throws `ContractError`, and every gate treats that as a block rather than a pass, so a broken contract cannot silently switch enforcement off.

### One Validator, Four Gates

`validate-message.mjs` is the only place a rule is evaluated. Every gate calls it:

| Gate | When it runs | What it checks |
|---|---|---|
| `commit-msg` hook | Each local commit | The message being written |
| `pre-push` hook, gate 6 | Each push | The commits this push adds (those no remote-tracking ref and, for an update, no old remote tip already holds), plus a new branch's name, so a `--no-verify` commit is still caught |
| Agent gate (`git-message-gate.mjs`, in all seven runtimes) | Before an agent runs `git commit -m/-F`, `gh pr create/edit --body`, or a branch-creating command | The message, PR body or branch name in the command, before it runs |
| `message-contract` CI workflow | Push and pull request | The pushed commits, the PR body and the branch name |

Dependabot gets two narrow allowances, both written down where they apply: its `dependabot/` branches are an allowed pattern in the branch rules block, and CI skips the description check for a PR it opened, because it writes its own release-notes description. Its commits are checked like any other.

Exit 0 means the input passes or the repository declares no rules for that kind. Exit 1 is a violation, and the message names each failed rule id. Exit 2 is a broken contract or a usage error, which the gates block on.

### Range Checks

In range mode the validator reads every message with one `git log` call. A `Spec:` trailer passes when the packet exists in the pushed tip or in the commit's own tree, so a later commit that moves a packet does not fail an earlier one. The `Commit-Id` uniqueness scan ignores `*/HEAD` and the ref being overwritten, so a rebased branch is not compared with its own old copies. An owner with the same author email and author date as the candidate is that commit's rebased or amended copy, not a collision, at commit time and at push time alike.

### Drift Guard

`--check-template --kind <kind>` checks that the template's prose names every rule id in its block and that every id the prose names exists in the block. `message-contract.test.mjs` runs the same drift check on all three shipped templates.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-git/scripts/lib/message-contract.mjs` | Library | Contract resolution, rules-block parsing, commit, PR and branch validators, range context |
| `.skilled/skills/sk-git/scripts/validate-message.mjs` | CLI | The one entry point every gate calls |
| `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | Agent hook | PreToolUse gate for Claude, Codex, Cursor and Devin, and the `evaluateCommand` the other runtimes import |
| `.opencode/plugins/sk-git-message-gate.js` | OpenCode plugin | Throws the gate's refusal from `tool.execute.before` |
| `.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts` | Pi extension | Returns `{ block: true, reason }` from `tool_call` |
| `.hermes/plugins/repo-guards/__init__.py` | Hermes plugin | Blocks from `pre_tool_call` on the core's deny |
| `.skilled/scripts/git-hooks/commit-msg` | Git hook | Shim that runs the validator on the commit message |
| `.skilled/scripts/git-hooks/pre-push` | Git hook | Gate 6 runs the validator over the pushed range and new branch names |
| `.skilled/scripts/git-hooks/lib/message-contract-gate.sh` | Hook library | Validator lookup and the node-free "is a rules block declared" check |
| `.github/workflows/message-contract.yml` | CI | Runs the validator on pushes and pull requests |
| `.skilled/skills/sk-git/assets/commit-message-template.md` | Contract | Commit rules block |
| `.skilled/skills/sk-git/assets/pr-template.md` | Contract | PR description rules block |
| `.skilled/skills/sk-git/assets/worktree-checklist.md` | Contract | Branch naming rules block |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` | Automated test | Resolution, each rule, foreign templates, broken blocks, template drift |
| `.skilled/scripts/git-hooks/tests/commit-msg.test.sh` | Automated test | The commit-msg shim against a throwaway repository |
| `.skilled/scripts/git-hooks/tests/pre-push-message-contract.test.sh` | Automated test | Gate 6 against a real bare remote |
| `.opencode/plugins/tests/sk-git-message-gate.test.cjs` | Node test | The OpenCode plugin refuses, passes and fails closed on a broken block |
| `.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.test.ts` | Vitest | The Pi extension's `.block` verdicts |
| `.hermes/plugins/repo-guards/tests/test_repo_guards.py` | Unit | The Hermes block, including one run of the real core |

---

## 4. SOURCE METADATA

- Group: Workflow Playbooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `workflow-playbooks/message-contract-enforcement.md`

Related references:
- [commit-workflows.md](../../references/commit-workflows.md) — How an AI forms a commit that passes the contract
- [conventional-commit-workflows.md](conventional-commit-workflows.md) — The commit grammar the shipped rules block encodes
