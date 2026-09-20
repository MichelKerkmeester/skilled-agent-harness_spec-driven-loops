---
title: "JEV-005 -- An unreadable state file exits 2"
description: "Confirm the `@path` state form fails at exit 2 when the file cannot be read, for `JEV-005`."
version: 1.0.0.1
---

# JEV-005 -- An unreadable state file exits 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-005`.

---

## 1. OVERVIEW

The `@path` form is a CLI convenience: the CLI reads the file before the request is built. Pointing it at a file that does not exist must fail as a usage error, not as a transport error.

### Why This Matters

The same string means different things on the two surfaces — the MCP tools treat `@path` as a literal string. A caller migrating from the CLI who sees the path judged as text has found that difference rather than a defect.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-005` and confirm the expected signals without contradictory evidence.

- Objective: Confirm an unreadable state file exits 2 with a `cannot read state file` error and no request built.
- Real user request: `I pointed jev at a state file and it failed — work out why.`
- Prompt: `Is it?`
- Expected execution process: clear the provider variables, run the command sequence in §3 from the repository root, capture the three channels separately, then judge the result against the pass/fail criteria below.
- Expected signals: stderr names `cannot read state file` with the missing path; exit code `2`; stdout empty.
- Evidence: The command, complete stderr, the exit code, and the statement that the path was never sent to a provider.
- Desired user-visible outcome: the exit code and the error string, with the distinction between a file problem and a request problem made explicit.
- Pass/fail: PASS when stderr names the unreadable file and the exit code is 2; FAIL when the command exits 3 or 4, or when the path string is judged as literal state; SKIP only when `command -v jev` fails — the missing binary is the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook and clear the provider variables.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr and the exit status separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL \
  jev noul -q 'Is it?' -s @scratch/state-that-does-not-exist.txt </dev/null
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-005 | Unreadable state file | Confirm the `@path` state form fails at exit 2 when the file cannot be read | `Is it?` | 1. `env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev noul -q 'Is it?' -s @scratch/state-that-does-not-exist.txt </dev/null` | stderr names `cannot read state file` with the missing path; exit code `2`; stdout empty | The command, complete stderr, the exit code, and the statement that the path was never sent to a provider | PASS when stderr names the unreadable file and the exit code is 2; FAIL when the command exits 3 or 4, or when the path string is judged as literal state; SKIP only when `command -v jev` fails, naming the missing binary as the blocker | Exit 3 means the file was read and the credential check ran, so the path exists after all. A judgment built from the literal `@…` string is the MCP-versus-CLI difference, not a usage error |

### Recorded Result

Observed during the phase-001 pin: stderr carried `cannot read state file` naming the missing path, exit 2, stdout empty. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `exit-codes/unreadable-state-file-exits-2.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The three state forms and their read order |
| [mcp-server.md](../../references/mcp-server.md) | The verbatim-state rule the MCP surface applies instead |

---

## 5. SOURCE METADATA

- Group: Exit Codes
- Playbook ID: JEV-005
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `exit-codes/unreadable-state-file-exits-2.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
