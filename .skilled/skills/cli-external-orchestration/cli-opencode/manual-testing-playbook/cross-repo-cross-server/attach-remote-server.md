---
title: "CO-030 -- Cross-server dispatch via --server"
description: "This scenario validates cross-server dispatch for `CO-030`. It focuses on confirming the documented `--server <url>` flag is documented and reachable; live remote server execution is out-of-scope (operator-environment-dependent)."
version: 1.4.2.0
---

# CO-030 -- Cross-server dispatch via --server

**Version note.** The commands in this scenario target OpenCode 2 (2.3.2). `run` reaches a running server through `--server <url>`, and the spawn directory carries the working directory. OpenCode 2.3.2 has no `opencode attach` subcommand: `opencode attach --help` prints the top-level help.

**Status: [unverified] on OpenCode 2.** No v2 run of this procedure has been recorded, so the expected signals and the pass condition below are the intended contract, not observed results. The current `SKILL.md` has no `cross-server` line, so step 5 now greps for `cross-repo`, and the current `references/opencode-tools.md` has no `remote opencode server` line, so step 6 would not match as written. Record the first v2 run, and fix those anchors, before treating a PASS as evidence.

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-030`.

---

## 1. OVERVIEW

This scenario validates cross-server dispatch via `--server` for `CO-030`. It focuses on confirming the documented `--server <url>` flag is part of the cli-opencode skill surface and that the documentation contract for cross-server dispatch is intact. Live cross-server execution requires a running remote OpenCode server with credentials and is intentionally out-of-scope for this scenario. Operators in the right environment can extend the test, but the playbook validates the documentation and dry-run path only.

### Why This Matters

Cross-server dispatch is the documented capability that lets an operator target a remote OpenCode server's runtime via `--server <url>` (per `references/opencode-tools.md` §6 + `references/cli-reference.md` §3 subcommand map). It is the path for "OpenCode A wants to dispatch into OpenCode B running on a remote machine". If the documentation contract is broken or the flag does not appear in `opencode run -m llmgateway/deepseek-v4.1-flash-1017 --help </dev/null`, the entire cross-server workflow loses its anchor. This test validates the documentation and CLI surface. The actual remote dispatch is exercised only by operators with a real server.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-030` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the `--server <url>` flag is documented in the cli-opencode references AND appears in the `opencode run -m llmgateway/deepseek-v4.1-flash-1017 --help </dev/null` output, AND that the §3 subcommand map documents `opencode serve`, the server a `--server <url>` run connects to.
- Real user request: `Verify the cross-server dispatch documentation: --server <url> should be in the CLI flag table, and `opencode serve` should be in the subcommand map. Confirm both surfaces exist before we attempt a real remote dispatch.`
- Prompt: `Verify --server is documented in cli-reference.md, opencode serve appears in the subcommand map, and run help exposes the flag.`
- Expected execution process: The external-AI orchestrator greps `references/cli-reference.md` for the `--server` flag in §4, greps the §3 subcommand map for `opencode serve`, runs `opencode run --help -m llmgateway/deepseek-v4.1-flash-1017 </dev/null` and confirms `--server` appears in the help output while `--attach` does not.
- Expected signals: cli-reference.md §4 includes a row for `--server <url>`. Cli_reference.md §3 documents `opencode serve` as a supported subcommand. `opencode run -m llmgateway/deepseek-v4.1-flash-1017 --help </dev/null` output mentions `--server` and lists no `--attach`. SKILL.md §1 activation triggers mention "Cross-repo dispatch".
- Desired user-visible outcome: Verdict naming each documented surface (flag table, subcommand map, help output, SKILL.md trigger).
- Pass/fail: [unverified] on OpenCode 2, because no v2 run has been recorded. PASS if all four surfaces document `--server`/`serve` and `--attach` is absent from `run --help`. FAIL if any surface is missing the documentation.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Grep cli-reference.md flag table for `--server`.
3. Grep cli-reference.md subcommand map for `opencode serve`.
4. Run `opencode run --help -m llmgateway/deepseek-v4.1-flash-1017 </dev/null` and grep for `--server`, then confirm `--attach` is absent.
5. Grep SKILL.md activation triggers for cross-server.
6. Return a verdict naming each found surface.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-030 | Cross-server dispatch via --server | Confirm that `--server <url>` is documented in references and surfaces in the live `opencode run -m llmgateway/deepseek-v4.1-flash-1017 --help </dev/null` output, and that `--attach` is not a `run` flag | `Verify --server is documented in cli-reference.md, opencode serve appears in the subcommand map, and run help exposes the flag.` | 1. `bash: grep -nE '\| .--server.' .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` -> 2. `bash: grep -nE 'opencode serve' .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` -> 3. `bash: opencode run --help -m llmgateway/deepseek-v4.1-flash-1017 </dev/null 2>&1 \| grep -iE -- '--server' \| head -3` -> 4. `bash: opencode run --help -m llmgateway/deepseek-v4.1-flash-1017 </dev/null 2>&1 \| grep -icE -- '--attach'` -> 5. `bash: grep -inE 'cross-repo\|Cross-repo' .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md \| head -3` -> 6. `bash: grep -inE 'remote opencode server' .skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md \| head -3` | Step 1: cli_reference.md flag table includes `--server` row (count >= 1). Step 2: subcommand map mentions `opencode serve` (count >= 1). Step 3: live binary help output includes `--server` (count >= 1). Step 4: prints `0`, so `--attach` is not a `run` flag. Step 5: SKILL.md activation triggers mention cross-repo dispatch (count >= 1). Step 6: opencode_tools.md references "remote opencode server" or equivalent (count >= 1) | Terminal grep output for each check | PASS if all 6 surfaces show the documented `--server` / `serve` / cross-server contract and `--attach` is absent. FAIL if any surface is missing | 1. If `--server` is missing from the live binary's help, the version may have renamed or removed the flag (see `references/cli-reference.md` §9 version drift). 2. If documentation is missing, the cli-opencode skill has regressed, so file a P0 documentation bug naming the missing surface. 3. NEVER attempt a real `--server <url>` dispatch in this test, because that requires a running remote server and credentials, both out-of-scope for the playbook. 4. If the operator wants to extend with a real remote dispatch, document the URL and the spawn directory separately and treat it as an environment-specific add-on. |

### Optional Supplemental Checks

For operators in environments with a running remote OpenCode server, optionally extend with a real `opencode run --server <url> -m <provider>/<model>#<effort> --format json "<prompt>" </dev/null` dispatch and validate the JSON event stream. Document the remote URL and the dispatched response. This is an environment-specific extension, not a baseline playbook requirement.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/opencode-tools.md` (§6 CROSS-REPO DISPATCH, extended cross-server note) | Cross-server documentation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 activation triggers (cross-server dispatch), §3 unique OpenCode capabilities table (cross-server row) |
| `../../references/cli-reference.md` (§3 subcommand map + §4 `--server` row) | Subcommand and flag documentation |

---

## 5. SOURCE METADATA

- Group: Cross-Repo and Cross-Server
- Playbook ID: CO-030
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cross-repo-cross-server/attach-remote-server.md`
