---
id: doctor-commands-readme
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 1.1.0.0
---

# Doctor Commands

## 1. OVERVIEW

Manual testing scenarios for `/doctor:git`, the doctor command that checks this skill.

## Scope

6 scenarios (DOC-369 to DOC-374): listing the hook gates, switching one gate behind an approval, copying the templates into `.sk-git/` once, changing or removing one rule, refusing a rule the hooks would reject, and the menu shown when no target is given.

DOC- numbers are shared with the doctor scenarios in the system-spec-kit, system-skill-advisor, system-deep-loop, sk-git and mcp-code-mode playbooks, so a new doctor scenario takes the next free number in the whole series. The system-spec-kit `doctor-commands/README.md` lists the retired ranges.

## How to Run

Each scenario has a Markdown file named for its topic (`doctor-<short-name>.md`, with no numeric filename prefix) with its own numbered sections: overview, scenario contract, prompt, commands, expected results, evidence and pass/fail. Run the real command, inspect real files and record a `PASS`, `FAIL` or `SKIP` verdict. Run DOC-371 to DOC-373 in the shared current-code test environment at `.worktrees/.doctor-test-environment` and restore it afterwards. Run DOC-370 in a disposable clone, because a linked worktree shares the main checkout's `.git/config` and `git config --local` would change the real repository. DOC-369 and DOC-374 change nothing and run in any working copy. The [environment guide](../../../system-spec-kit/manual-testing-playbook/doctor-commands/README.md) describes the environment and its reset steps. See [`../manual-testing-playbook.md`](../manual-testing-playbook.md) for the evidence and result-recording policy.

## See Also

- Router source: `.skilled/commands/doctor/git.md`
- Route manifest: `.skilled/commands/doctor/_routes.yaml`
- Root playbook index: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)

Provenance: manual only - index. Each scenario listed here carries its own line.
