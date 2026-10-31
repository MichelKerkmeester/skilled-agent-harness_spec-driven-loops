---
id: doctor-commands-readme
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 1.1.3.0
---

# Doctor Commands

## 1. OVERVIEW

Manual testing scenarios for `/doctor:sk-code`, the doctor command that checks this skill.

---

## 2. SCOPE

6 scenarios (DOC-382, DOC-383, DOC-392..DOC-395): the read-only setup battery, covering a clean run, the prompt flag, a bad argument, a failing parent-skill leg and the compiled-routing kill-switch, plus the pre-v4 checkout where the battery runs no leg and fails provisioning with the v4-layout repair. DOC-392 covers the read-only `/doctor:ci report` route, checking its workflow count, its empty error list, its offline switch reads, a pinned `--sha`, a `--profile` override, the `list` startup menu and its bad-argument exit code. DOC-393 covers the `/doctor:ci` scaffold route (a dry run, a decline, and the existing, protected and malformed name refusals, all of which write nothing). DOC-394 covers the toggle route (an offline decline and a bad `--variable` refusal, plus a `gh`-authenticated off and on round trip, or `SKIP` where `gh` is not authenticated). DOC-395 covers the `/doctor:sk-code quality` target: its read-only status and check, its `CONFIG_EXISTS` refusal of an existing config, and the one-time write an approved apply makes in a scratch repository.

DOC- numbers are shared with the doctor scenarios in the system-spec-kit, system-skill-advisor, system-deep-loop, sk-git, mcp-code-mode and sk-code playbooks, so a new doctor scenario takes the next free number in the whole series. The system-spec-kit `doctor-commands/README.md` lists the retired ranges.

---

## 3. SCENARIO CONTRACT

Each scenario has a Markdown file named for its topic (`doctor-<short-name>.md`, with no numeric filename prefix). It has five numbered sections: overview, scenario contract, test execution, source files and source metadata. Test execution holds the Prompt, Commands, Expected, Evidence and Pass / Fail subsections, then Failure Triage.

---

## 4. TEST ENVIRONMENTS

Run DOC-382 in the shared current-code test environment at `.worktrees/.doctor-test-environment` and restore it afterwards. The scenario removes the one file it adds, so it leaves the environment as it found it. Run DOC-392 and DOC-395 in that same shared environment, since their read-only routes are read-only there; DOC-395's one write happens only in the scratch repository it creates, which it then deletes. Run DOC-393 and DOC-394 there as well, with the toggle's live leg only where `gh` is authenticated and `SKILLED_CI_REPORTS` starts unset. Run DOC-383 instead in a throwaway shallow clone of release `v3.6.0.0` under a `mktemp -d` directory, which it deletes afterwards. The [environment guide](../../../system-spec-kit/manual-testing-playbook/doctor-commands/README.md) describes the environment and its reset steps.

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
