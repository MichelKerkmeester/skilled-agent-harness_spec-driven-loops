---
title: "Repository settings and setup check"
description: "One doctor command switches sk-git's hook gates, changes the repository's commit, PR and branch rules, and checks which sk-git settings are live without writing anything."
trigger_phrases:
  - "doctor git"
  - "sk-git setup check"
  - "hook gate settings"
  - "change commit rules"
importance_tier: "important"
version: 1.0.1.0
---

# Repository settings and setup check (/doctor:git)

## 1. OVERVIEW

A repository adapts sk-git through git config and a `.sk-git/` folder, never by editing the skill. `/doctor:git` owns those settings. Its `hooks` and `standards` targets change them behind an approval, and its `setup` target checks them in one read-only pass.

---

## 2. HOW IT WORKS

### Three Targets

`hooks` lists every optional pre-commit, prepare-commit-msg and pre-push gate with its saved setting and switches one in local or global git config (`speckit.hooks.<key>`). `standards` copies the shipped templates into `.sk-git/` once and changes a rule in those copies, refusing an edit the validator would reject. Both show the exact change and wait for approval, and `--dry-run` writes nothing.

### The Setup Check

`setup` runs eleven checks: install, hooks, trust, gates, standards, allowlist, worktrees, commit-id, advisory-rules, suppression and ai-tool-hooks. Each prints PASS, FAIL, SKIP, UNKNOWN or DEGRADED with the source it read, and each FAIL, and a gate saved off, names one repair command. The run exits 0 when every check passes or skips, 3 when none fails but a check is UNKNOWN or a gate is saved off, 1 when a check fails and 2 on a usage error or crash, and its last line is `STATUS=OK`, `STATUS=DEGRADED` or `STATUS=FAIL`. `--json` prints one object for scripts.

The check never writes and never runs code from the repository it inspects. It loads every helper from its own install, reads hook links in process instead of calling the installer, and passes `core.fsmonitor=false` and `log.showSignature=false` to every child process through the environment, so the inspected repository's config cannot make a helper start a program.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/doctor/git.md` | Router | Binds the target and loads its workflow |
| `.skilled/commands/doctor/_routes.yaml` | Manifest | The three routes and their mutation classes |
| `.skilled/commands/doctor/assets/doctor-git-presentation.txt` | Presentation | Menu, plans, prompts and result templates |
| `.skilled/commands/doctor/assets/doctor-git-hooks.yaml` | Workflow | The hooks target |
| `.skilled/commands/doctor/assets/doctor-git-standards.yaml` | Workflow | The standards target |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Workflow | The setup target |
| `.skilled/commands/doctor/scripts/git-hook-gates.cjs` | Script | Lists and sets the hook gates |
| `.skilled/commands/doctor/scripts/git-standards.cjs` | Script | Reads and changes the `.sk-git/` rule copies |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Script | The read-only setup battery |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/commands/doctor/scripts/tests/git-hook-gates.test.cjs` | Automated test | Gate listing and switching against throwaway repositories |
| `.skilled/commands/doctor/scripts/tests/git-standards.test.cjs` | Automated test | Rule copies and edits, each checked by the validator |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Automated test | Every check, the no-write proof and the untrusted-repository cases |
| `.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/` | Manual playbook | DOC-369 to DOC-374 and DOC-384 |

---

## 4. SOURCE METADATA

- Group: Workflow Playbooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `workflow-playbooks/doctor-git-settings.md`

Related references:
- [message-contract-enforcement.md](message-contract-enforcement.md): The rules the standards target edits
