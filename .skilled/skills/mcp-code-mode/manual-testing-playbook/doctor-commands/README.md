---
id: doctor-commands-readme
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 1.2.0.0
---

# Doctor Commands

## 1. OVERVIEW

Manual testing scenarios for `/doctor:mcp`, the doctor command that checks this skill.

---

## 2. SCOPE

5 scenarios (DOC-375 to DOC-378 and DOC-380): installing Code Mode with an approval for each write, a read-only debug run, a debug run with `--fix`, the menu shown when no sub-action is given together with the refusal of a flag owned by the other sub-action, and the refusal of a flag neither sub-action accepts.

DOC- numbers are shared with the doctor scenarios in the system-spec-kit, system-skill-advisor, system-deep-loop, sk-git and mcp-code-mode playbooks, so a new doctor scenario takes the next free number in the whole series. The system-spec-kit `doctor-commands/README.md` lists the retired ranges.

---

## 3. SCENARIO CONTRACT

Each scenario has a Markdown file named for its topic (`doctor-<short-name>.md`, with no numeric filename prefix). It has five numbered sections: overview, scenario contract, test execution, source files and source metadata. Test execution holds the Prompt, Commands, Expected, Evidence and Pass / Fail subsections, then Failure Triage.

---

## 4. TEST ENVIRONMENTS

Run DOC-375 to DOC-377 in the shared current-code test environment at `.worktrees/.doctor-test-environment` and restore it afterwards. DOC-378 and DOC-380 stop before any workflow loads and run in any working copy. The [environment guide](../../../system-spec-kit/manual-testing-playbook/doctor-commands/README.md) describes the environment and its reset steps.

---

## 5. TEST EXECUTION

Run the real command, inspect real files and record a `PASS`, `FAIL` or `SKIP` verdict. See [`../manual-testing-playbook.md`](../manual-testing-playbook.md) for the evidence and result-recording policy.

---

## 6. SOURCE METADATA

### See Also

- Router source: `.skilled/commands/doctor/mcp.md`
- Route manifest: `.skilled/commands/doctor/_routes.yaml`
- Root playbook index: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)

Provenance: manual only - index. Each scenario listed here carries its own line.
