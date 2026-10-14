---
id: doctor-commands-readme
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 1.1.0.0
---

# Doctor Commands

## 1. OVERVIEW

Manual testing scenarios for `/doctor:sk-code`, the doctor command that checks this skill.

---

## 2. SCOPE

2 scenarios (DOC-382 and DOC-383): the read-only setup battery, covering a clean run, the prompt flag, a bad argument, a failing parent-skill leg and the compiled-routing kill-switch, plus the pre-v4 checkout where the battery runs no leg and fails provisioning with the v4-layout repair.

DOC- numbers are shared with the doctor scenarios in the system-spec-kit, system-skill-advisor, system-deep-loop, sk-git, mcp-code-mode and sk-code playbooks, so a new doctor scenario takes the next free number in the whole series. The system-spec-kit `doctor-commands/README.md` lists the retired ranges.

---

## 3. SCENARIO CONTRACT

Each scenario has a Markdown file named for its topic (`doctor-<short-name>.md`, with no numeric filename prefix). It has five numbered sections: overview, scenario contract, test execution, source files and source metadata. Test execution holds the Prompt, Commands, Expected, Evidence and Pass / Fail subsections, then Failure Triage.

---

## 4. TEST ENVIRONMENTS

Run DOC-382 in the shared current-code test environment at `.worktrees/.doctor-test-environment` and restore it afterwards. The scenario writes nothing, so it leaves the environment as it found it. Run DOC-383 instead in a throwaway shallow clone of release `v3.6.0.0` under a `mktemp -d` directory, which it deletes afterwards. The [environment guide](../../../system-spec-kit/manual-testing-playbook/doctor-commands/README.md) describes the environment and its reset steps.

---

## 5. TEST EXECUTION

Run the real command, inspect real files and record a `PASS`, `FAIL` or `SKIP` verdict. See [`../manual-testing-playbook.md`](../manual-testing-playbook.md) for the evidence and result-recording policy.

---

## 6. SOURCE METADATA

### See Also

- Router source: `.skilled/commands/doctor/sk-code.md`
- Route manifest: `.skilled/commands/doctor/_routes.yaml`
- Root playbook index: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)

Provenance: manual only - index. Each scenario listed here carries its own line.
