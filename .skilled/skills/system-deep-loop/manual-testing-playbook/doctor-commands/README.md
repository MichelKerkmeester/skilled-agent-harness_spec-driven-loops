---
id: doctor-commands-readme
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 1.0.0.0
---

# Doctor Commands

## 1. OVERVIEW

Manual testing scenarios for `/doctor:deep-loop`, the doctor command that checks this skill.

## Scope

4 scenarios (DOC-331 to DOC-333 and DOC-368): lazy-init availability for an empty graph with iteration folders, an empty graph with no source, the convergence signal of a packet with three or more iterations, and `--scope` selection with refusal of an unknown value.

DOC- numbers are shared with the doctor scenarios in the system-spec-kit, system-skill-advisor, system-deep-loop, sk-git and mcp-code-mode playbooks, so a new doctor scenario takes the next free number in the whole series. The system-spec-kit `doctor-commands/README.md` lists the retired ranges.

## How to Run

Each scenario has a Markdown file named for its topic (`doctor-<short-name>.md`, with no numeric filename prefix) with its own numbered sections: overview, scenario contract, prompt, commands, expected results, evidence and pass/fail. Run each one in a disposable copy of the repository, run the real command, inspect real files and record a `PASS`, `FAIL` or `SKIP` verdict. See [`../manual-testing-playbook.md`](../manual-testing-playbook.md) for the evidence and result-recording policy.

## See Also

- Router source: `.skilled/commands/doctor/deep-loop.md`
- Route manifest: `.skilled/commands/doctor/_routes.yaml`
- Root playbook index: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)

Provenance: manual only - index. Each scenario listed here carries its own line.
