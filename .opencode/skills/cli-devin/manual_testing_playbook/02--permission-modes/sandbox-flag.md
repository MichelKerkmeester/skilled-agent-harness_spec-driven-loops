---
title: "DV-007 -- --sandbox flag (OS-level process sandboxing, Research Preview)"
description: "This scenario validates Devin's --sandbox flag (Research Preview): OS-level process sandboxing for the exec tool (macOS seatbelt / Linux bwrap+seccomp) that enforces the active Read/Write permission scopes at the OS level."
---

# DV-007 -- --sandbox flag (OS-level process sandboxing)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-007`.

---

## 1. OVERVIEW

This scenario validates Devin's `--sandbox` flag for `DV-007`. The flag is documented in `devin --help` as Research Preview: it enables OS-level process sandboxing for the exec tool (macOS seatbelt / Linux bwrap+seccomp) that enforces the active Read/Write permission scopes at the OS layer — on top of the application-level `--permission-mode` taxonomy.

### Why This Matters

`--sandbox` is the strongest defense-in-depth surface Devin exposes. `--permission-mode dangerous` auto-approves all tool calls at the application layer; `--sandbox` adds an OS-level boundary that limits what those tool calls can actually do (writable roots come from granted `Write(...)` scopes, readable roots from `Read(...)` scopes). For destructive automation, operators should layer `--sandbox` on top of `--permission-mode dangerous` rather than running unsandboxed. Replaces the v1.0.0.0-era "bypass mode" scenario which referenced a permission-mode value that doesn't exist in the binary.

### v1.0.0.0 Correction Note

This scenario replaces the v1.0.0.0 `DV-007 | bypass mode (DESTRUCTIVE)` scenario. The binary does not have a `bypass` permission mode — its strongest mode is `dangerous`. The original DV-007 contract is preserved at the same ID but rebadged to validate the `--sandbox` flag, which is the real OS-level defense-in-depth surface Devin exposes.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `--sandbox` is accepted by the binary, layered on top of `--permission-mode dangerous`, and that it enforces filesystem write boundaries at the OS level.
- Real user request: `Run a sandboxed Devin task that's allowed to write only to /tmp/cli-devin-playbook-dv007/, never anywhere else — even if the agent loop tries.`
- Prompt: `Capture explicit operator approval to use --permission-mode dangerous + --sandbox, then dispatch a benign write-only task to /tmp/cli-devin-playbook-dv007/. Verify the dispatch includes both flags, the task completes, and no files outside the playground are touched.`
- Expected execution process: Calling AI surfaces the dangerous-+-sandbox elevation request -> operator approves verbatim -> approval recorded with timestamp -> dispatch runs with `--permission-mode dangerous --sandbox` confined to `/tmp/cli-devin-playbook-dv007/` -> output captured -> `git status` confirms no working-tree changes.
- Expected signals: Operator records explicit user approval (in evidence transcript) BEFORE dispatch. Dispatch line contains `--permission-mode dangerous` AND `--sandbox`. `devin` exits 0. Only files inside `/tmp/cli-devin-playbook-dv007/` are touched. `git status` is clean.
- Desired user-visible outcome: A working write inside the sandbox plus OS-level evidence that the sandbox boundary held.
- Pass/fail: PASS if approval recorded BEFORE dispatch AND only sandbox files touched AND `git status` clean AND both flags present in dispatch line. FAIL if dispatch ran without approval OR if files outside sandbox were touched OR if `--sandbox` flag was rejected by the binary.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Calling AI surfaces the dangerous-+-sandbox elevation risks and waits for explicit operator approval.
2. Operator approves verbatim ("approved to use --permission-mode dangerous + --sandbox for DV-007").
3. Record approval transcript with timestamp.
4. Create the isolated sandbox folder and confirm git working tree is clean before dispatch.
5. Dispatch with `--permission-mode dangerous --sandbox` confined to the sandbox.
6. After dispatch, run `git status` and confirm no working-tree changes outside the sandbox.
7. Return a PASS/FAIL verdict naming the approval evidence path and confirming sandbox isolation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-007 | `--sandbox` flag (OS-level process sandboxing) | Verify --sandbox layered on --permission-mode dangerous + OS-level write-boundary enforcement | `Capture explicit operator approval to use --permission-mode dangerous + --sandbox, then dispatch a benign write-only task to /tmp/cli-devin-playbook-dv007/. Verify the dispatch includes both flags, the task completes, and no files outside the playground are touched.` | 1. `bash: printf '%s: operator approved --permission-mode dangerous + --sandbox for DV-007 in sandbox /tmp/cli-devin-playbook-dv007/\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > /tmp/dv-007-approval.txt` -> 2. `bash: cat /tmp/dv-007-approval.txt` -> 3. `bash: mkdir -p /tmp/cli-devin-playbook-dv007/ && rm -f /tmp/cli-devin-playbook-dv007/*` -> 4. `bash: git status --porcelain > /tmp/dv-007-pre-git.txt` -> 5. `devin --prompt-file /tmp/cli-devin-playbook-runs/dv-007-prompt.md --model swe-1.6 --permission-mode dangerous --sandbox -p > /tmp/dv-007-dispatch.log 2>&1 </dev/null; echo "Exit: $?"` -> 6. `bash: ls /tmp/cli-devin-playbook-dv007/` -> 7. `bash: git status --porcelain > /tmp/dv-007-post-git.txt; diff /tmp/dv-007-pre-git.txt /tmp/dv-007-post-git.txt` | Step 2: approval transcript exists with timestamp; Step 5: exit 0; Step 6: input.txt and output.txt present; Step 7: diff is empty (git working tree unchanged) | Approval transcript, pre/post git-status snapshots, dispatch log, sandbox dir listing | PASS if Steps 1-7 all match; FAIL if no approval recorded OR if files outside sandbox were touched OR if `--sandbox` flag rejected | (1) Verify `--sandbox` is in `devin --help` (Research Preview marker — feature may roll out of preview between versions); (2) if Linux, confirm `bwrap` is installed; (3) if files outside sandbox were touched, file an immediate skill RULES violation and halt further dispatches |

### Optional Supplemental Checks

- Try the same task without `--sandbox` (only `--permission-mode dangerous`) — observe that without the OS-level boundary, an agent loop could theoretically reach outside the sandbox even though our prompt didn't ask for it.
- On macOS, inspect `sudo log show --predicate 'process == "devin"' --last 5m` for seatbelt-mode evidence.
- On Linux, inspect `bwrap` invocation in `ps -ef | grep bwrap` during the dispatch.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§4 Flags, --sandbox row) | Documents `--sandbox` flag |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Flag table (--sandbox row) |
| `../../references/devin_tools.md` (§1.3 Permission Modes + OS Sandbox) | Cross-CLI mapping: --sandbox ≈ Codex `--sandbox workspace-write` + OS-level enforcement |

---

## 5. SOURCE METADATA

- Group: Permission Modes
- Playbook ID: DV-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--permission-modes/sandbox-flag.md`
