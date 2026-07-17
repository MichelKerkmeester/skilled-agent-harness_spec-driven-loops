---
title: "152 -- No symlinks in lib/ tree"
description: "This scenario validates the no-symlinks policy by confirming zero symlinks exist under mcp_server/lib/. It enforces the ARCHITECTURE.md 'No Symlinks in lib/ Tree' policy."
version: 3.6.0.16
id: tooling-and-scripts-no-symlinks-in-lib-tree
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 152 -- No symlinks in lib/ tree

## 1. OVERVIEW

This scenario validates the no-symlinks-in-lib policy for `152`. It focuses on confirming that `find mcp_server/lib -type l` returns zero results, enforcing the ARCHITECTURE.md policy.

---

## 2. SCENARIO CONTRACT

- Objective: Verify zero symlinks exist under mcp_server/lib/.
- Real user request: `Please validate No symlinks in lib/ tree against cd .opencode/skills/system-spec-kit and tell me whether the expected signals are present: Zero symlinks found.`
- Prompt: `Validate No symlinks in lib/ tree against cd .opencode/skills/system-spec-kit and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Zero symlinks found
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if find returns no output

---

## 3. TEST EXECUTION

### Prompt

```
Validate No symlinks in lib/ tree against cd .opencode/skills/system-spec-kit and report cited pass/fail evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit`
2. `find mcp_server/lib -type l`
3. Verify output is empty
4. `echo $?` to confirm exit 0

### Expected

Zero symlinks found

### Evidence

Command context: `.opencode/skills/system-spec-kit`

Command: `find mcp_server/lib -type l`

Output:

```text

```

Command: `echo $?`

Output:

```text
0
```

### Pass / Fail

- **PASS**: `find mcp_server/lib -type l` returned no output and `echo $?` returned `0`.

### Failure Triage

Identify symlink -> determine if intentional -> replace with canonical import path -> remove symlink -> update imports -> re-verify

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/module_boundary_map.md](../../feature_catalog/tooling_and_scripts/module_boundary_map.md)
- Policy: [ARCHITECTURE.md](../../ARCHITECTURE.md) -- "No Symlinks in lib/ Tree" subsection

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 152
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/no_symlinks_in_lib_tree.md`
