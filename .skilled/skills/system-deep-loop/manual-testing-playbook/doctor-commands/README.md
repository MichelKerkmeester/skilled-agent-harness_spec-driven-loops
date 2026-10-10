---
id: doctor-commands-readme
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 1.1.0.0
---

# Doctor Commands

## 1. OVERVIEW

Manual testing scenarios for `/doctor:deep-loop`, the doctor command that checks this skill.

---

## 2. SCOPE

4 scenarios (DOC-331 to DOC-333 and DOC-368): lazy-init availability for an empty graph with iteration folders, an empty graph with no source, the convergence signal of a packet with three or more iterations, and `--scope` selection with refusal of an unknown value.

DOC- numbers are shared with the doctor scenarios in the system-spec-kit, system-skill-advisor, system-deep-loop, sk-git and mcp-code-mode playbooks, so a new doctor scenario takes the next free number in the whole series. The system-spec-kit `doctor-commands/README.md` lists the retired ranges.

---

## 3. SCENARIO CONTRACT

Each scenario has a Markdown file named for its topic (`doctor-<short-name>.md`, with no numeric filename prefix). It has five numbered sections: overview, scenario contract, test execution, source files and source metadata. Test execution holds the Prompt, Commands, Expected, Evidence and Pass / Fail subsections, then Failure Triage.

---

## 4. TEST ENVIRONMENTS

Run DOC-368 in the shared current-code test environment at `.worktrees/.doctor-test-environment` and restore it afterwards. DOC-331 to DOC-333 need their own empty or seeded graph state, so run them in a disposable copy of the repository. The [environment guide](../../../system-spec-kit/manual-testing-playbook/doctor-commands/README.md) describes the environment and its reset steps.

---

## 5. TEST EXECUTION

Run the real command, inspect real files and record a `PASS`, `FAIL` or `SKIP` verdict. See [`../manual-testing-playbook.md`](../manual-testing-playbook.md) for the evidence and result-recording policy.

---

## 6. SOURCE METADATA

### See Also

- Router source: `.skilled/commands/doctor/deep-loop.md`
- Route manifest: `.skilled/commands/doctor/_routes.yaml`
- Root playbook index: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)

Provenance: manual only - index. Each scenario listed here carries its own line.
