---
title: "CU-012 -- mcp.json precedence + --approve-mcps"
description: "This scenario validates .cursor/mcp.json project/user precedence and the --approve-mcps flag for `CU-012`. It focuses on confirming the documented project-then-global-then-nested precedence and that --approve-mcps is accepted on a dispatch."
version: 1.0.0.0
---

# CU-012 -- mcp.json precedence + --approve-mcps

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-012`.

---

## 1. OVERVIEW

This scenario validates `.cursor/mcp.json` (project) / `~/.cursor/mcp.json` (user) precedence and the `--approve-mcps` flag for `CU-012`. It focuses on confirming the documented "project → global → nested" precedence and that `--approve-mcps` is accepted on a dispatch without a CLI-level rejection, whether or not any server happens to be configured.

### Why This Matters

`references/shared-editor-config.md` §2/§6 documents that Cursor CLI reads the exact same `mcp.json` files the Cursor editor reads - a dispatched task using `--approve-mcps` approves whatever is configured in that shared file, not something dispatch-scoped. Getting the precedence and flag-acceptance right matters because an orchestrator that assumes dispatch-local MCP config (the way sibling CLIs work) will misdiagnose an "unexpected server available" surprise.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-012` and confirm the expected signals without contradictory evidence.

- Objective: Verify the project/user `mcp.json` precedence rule and that `--approve-mcps` is accepted on a dispatch.
- Real user request: `Does this repo have its own MCP config for Cursor, or does it fall back to my user-level one? And does the auto-approve flag work?`
- Prompt: `Check for .cursor/mcp.json and ~/.cursor/mcp.json, document their precedence, then confirm --approve-mcps is accepted on a trivial dispatch.`
- Expected execution process: Operator checks for project-scoped `.cursor/mcp.json` -> checks for user-scoped `~/.cursor/mcp.json` -> documents which exists and cites the "project → global → nested" precedence from `references/shared-editor-config.md` §2 -> dispatches a trivial prompt with `--approve-mcps` and confirms no CLI-level flag rejection.
- Expected signals: Existence of project/user `mcp.json` is checked and reported honestly (present or absent for each). `cursor-agent -p "say hi" --model composer-2.5 --output-format text --approve-mcps </dev/null` exits 0 with no flag-rejection error.
- Desired user-visible outcome: Confirmation of the precedence rule as documented, and that `--approve-mcps` never blocks a dispatch as an unrecognized flag, whether or not any server is configured.
- Pass/fail: PASS if both config-file checks are reported honestly AND the `--approve-mcps` dispatch exits 0 without a flag-rejection error. FAIL if `--approve-mcps` is rejected as an unrecognized flag, or if the dispatch hangs on an unanswered MCP-approval prompt despite the flag being passed.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Check for `.cursor/mcp.json` at the repo root.
2. Check for `~/.cursor/mcp.json` at the user's home directory.
3. Document which exists and cite the precedence rule.
4. Dispatch a trivial prompt with `--approve-mcps` and confirm clean, unattended completion.
5. Return a PASS/FAIL verdict naming which config files were found and the dispatch outcome.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-012 | mcp.json precedence + --approve-mcps | Verify project/user mcp.json precedence and --approve-mcps acceptance | `Check for .cursor/mcp.json and ~/.cursor/mcp.json, document their precedence, then confirm --approve-mcps is accepted on a trivial dispatch.` | 1. `bash: test -f .cursor/mcp.json && echo "project: present" \|\| echo "project: absent"` -> 2. `bash: test -f ~/.cursor/mcp.json && echo "user: present" \|\| echo "user: absent"` -> 3. `bash: timeout 60 cursor-agent -p "say hi" --model composer-2.5 --output-format text --approve-mcps </dev/null > /tmp/cli-cursor-cu012-stdout.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu012-stdout.txt` -> 4. `bash: cat /tmp/cli-cursor-cu012-stdout.txt` | Step 1-2: presence/absence reported honestly for both scopes; Step 3: exit `0`, no `timeout`-triggered `124`; Step 4: no CLI-level "unrecognized flag" error for `--approve-mcps` | Presence/absence check outputs for both config scopes, dispatched stdout with recorded exit code | PASS if both config-file checks are reported AND the dispatch exits `0` with `--approve-mcps` accepted; FAIL if `--approve-mcps` is rejected as unrecognized, or the dispatch hangs (`124`) | (1) Re-run `cursor-agent --help \| grep -- "--approve-mcps"` to confirm the flag is still documented; (2) re-check both file paths for typos; (3) if the dispatch hangs, check whether an MCP server IS configured and is prompting despite the flag |

### Optional Supplemental Checks

- If both `.cursor/mcp.json` and `~/.cursor/mcp.json` exist, inspect their contents (structure only, never secret values) to confirm the project-scoped file's servers take precedence in `mcp list`'s output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/shared-editor-config.md` (§2 Directory Layout, §2 Precedence) | Documents the project/user `mcp.json` scopes and precedence rule |
| `../../references/cursor-tools.md` (§5 MCP Client Support) | Documents `--approve-mcps` behavior |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/shared-editor-config.md` | §2 Precedence - "project → global → nested" |
| `../../references/cli-reference.md` | §9 MCP Integration - `--approve-mcps` flag reference |

---

## 5. SOURCE METADATA

- Group: MCP Integration
- Playbook ID: CU-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-integration/mcp-json-precedence-approve-mcps.md`
