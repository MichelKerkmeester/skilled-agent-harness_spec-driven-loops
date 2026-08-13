---
title: "DV-014 -- Native skill discovery"
description: "Verify that Devin discovers repository skills natively from .opencode/skills."
version: 1.0.0.1
---

# DV-014 -- Native skill discovery

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-014`.

## 1. OVERVIEW

Inspect Devin's native repository-skill discovery with `devin skills list` and verify that repo-local entries resolve to real packets under `.opencode/skills`.

### Why This Matters

Devin discovers repository skills directly. It has no command-file system, so a valid scenario must test the native skill surface rather than invented command mirrors or a nonexistent mirror directory.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm that `devin skills list` reports repository skills discovered natively from `.opencode/skills`.
- Real user request: `Show which repository skills Devin discovers natively and where they come from.`
- Prompt: `List the repository skills Devin discovers natively, include each reported repository path, and do not infer any command-file mirrors.`
- Expected execution process: Run `devin skills list`, retain its raw output, isolate entries whose reported path is under `./.opencode/skills`, and verify that every reported repository path exists.
- Expected signals: Repo-local skill entries point into `./.opencode/skills`; no mirror directory or separate command-file abstraction is required or asserted.
- Desired user-visible outcome: A reproducible native skill-discovery report grounded in the CLI output and real repository paths.
- Pass/fail: PASS when reported repo-local skill paths exist under `.opencode/skills`; FAIL when Devin reports a missing repo-local path or omits native discovery entirely; SKIP when Devin authentication or CLI availability makes the native list unavailable.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `List the repository skills Devin discovers natively, include each reported repository path, and do not infer any command-file mirrors.`

### Commands

1. `devin skills list > /tmp/cli-devin-dv014-skills.txt 2>&1`
2. `rg -n '\./\.opencode/skills(?:/|\))' /tmp/cli-devin-dv014-skills.txt`
3. For each repo-local path printed by Devin, run `test -e <reported-path>` from the repository root.

### Expected

The raw list contains native repo-local skill entries with paths under `./.opencode/skills`. External or setup-provided entries may also appear and are not treated as repository mirrors.

### Evidence

Capture the Devin exit status, `/tmp/cli-devin-dv014-skills.txt`, the filtered repo-local entries, and the path-existence checks.

### Pass / Fail

- **PASS**: Devin lists native repo-local skills and each reported `.opencode/skills` path exists.
- **FAIL**: Native discovery is absent despite an available CLI, or a reported repo-local path does not exist.
- **SKIP**: Blocker: Devin authentication or CLI availability is missing, so `devin skills list` is unavailable.

### Failure Triage

Inspect stderr and authentication state first. If a reported path is stale, compare the CLI output with the actual `.opencode/skills` packet path; do not create a command mirror as a repair.

| Feature ID | Feature Name | Scenario Name/Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-014 | Native skill discovery | Verify native `.opencode/skills` discovery | `List the repository skills Devin discovers natively, include each reported repository path, and do not infer any command-file mirrors.` | Run `devin skills list`; filter repo-local paths; verify each reported path exists. | Native entries resolve under `./.opencode/skills`; no command-file mirror is asserted. | Raw output, exit status, filtered entries, and path checks. | PASS on valid native paths; FAIL on absent discovery or stale repo-local paths; SKIP only for a specific unavailable auth or CLI runtime. | Diagnose the CLI or reported path; never synthesize a command mirror. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Native skills-discovery scope |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Native `.opencode/skills` discovery and command-file non-concept |
| `../../../../` | Repository skill packets discovered by Devin |

---

## 5. SOURCE METADATA

- Group: Commands and Skills
- Playbook ID: DV-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `commands-and-skills/skills-roster.md`
