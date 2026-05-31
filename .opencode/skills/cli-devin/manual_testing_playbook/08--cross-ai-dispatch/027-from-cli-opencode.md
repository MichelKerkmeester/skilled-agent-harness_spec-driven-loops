---
title: "DV-023 -- Dispatch from cli-opencode"
description: "This scenario validates a calling AI inside a cli-opencode session can dispatch a devin task. Note: not self-invocation since cli-opencode is a different runtime."
---

# DV-023 -- Dispatch from cli-opencode

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-023`.

---

## 1. OVERVIEW

This scenario validates cross-AI dispatch from `cli-opencode` to `cli-devin` for `DV-023`. An OpenCode session uses its Bash tool to dispatch `devin` via the cli-devin Default Invocation block. **Note**: this is NOT self-invocation for cli-devin since cli-opencode is a different runtime — but it IS subject to cli-opencode's own self-invocation guard if the calling AI is already inside OpenCode.

### Why This Matters

cli-opencode is the "full plugin/skill/MCP runtime" sibling. Dispatching cli-devin from inside OpenCode is one of the most common cross-AI patterns because OpenCode users often want to delegate autonomous coding work to Devin. The scenario also confirms that cli-opencode's self-invocation guard does NOT trip on cli-devin dispatches (it's a different binary).

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a cli-opencode session can dispatch `devin` via Bash AND that cli-opencode's self-invocation guard does NOT trip on `devin` dispatches.
- Real user request: `From inside an OpenCode session, hand off a small refactor to Devin and bring back the result.`
- Prompt: `From a cli-opencode session, dispatch devin --prompt-file /tmp/devin-from-opencode.md --model swe-1.6 --permission-mode auto and confirm OpenCode's Bash tool captures stdout and integrates the result.`
- Expected execution process: cli-opencode session loads cli-devin SKILL.md -> composes a prompt file -> dispatches `devin` via OpenCode's Bash tool -> OpenCode's self-invocation guard does NOT trip (because `devin` is a different binary) -> output is captured and integrated.
- Expected signals: cli-opencode's Bash invocation runs successfully. `devin` exits 0. cli-opencode does NOT trip its own self-invocation guard. The output integrates cleanly.
- Desired user-visible outcome: A working cross-AI dispatch demonstrating cli-opencode → cli-devin works end-to-end without spurious guard activation.
- Pass/fail: PASS if Bash exit 0 AND `devin` exit 0 AND no opencode-guard refusal. FAIL if cli-opencode's guard tripped OR if dispatch errored.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. From a fresh cli-opencode session, load cli-devin SKILL.md.
2. Use OpenCode's Bash tool to create the prompt file.
3. Use OpenCode's Bash tool to dispatch `devin`.
4. Confirm OpenCode's self-invocation guard did NOT refuse the dispatch (it's a different binary).
5. OpenCode integrates the output.
6. Return a PASS/FAIL verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-023 | Dispatch from cli-opencode | Verify cli-opencode → cli-devin dispatch round trip + no spurious guard activation | `From a cli-opencode session, dispatch devin --prompt-file /tmp/devin-from-opencode.md --model swe-1.6 --permission-mode auto and confirm OpenCode's Bash tool captures stdout and integrates the result.` | 1. Launch a cli-opencode session. -> 2. Bash: `printf 'Generate a TypeScript memoize(fn) function that caches by JSON-stringified arguments.\n' > /tmp/devin-from-opencode.md` -> 3. Bash: `devin --prompt-file /tmp/devin-from-opencode.md --model swe-1.6 --permission-mode auto > /tmp/dv-023-output.ts 2>&1 </dev/null; echo "Devin exit: $?"` -> 4. Confirm no `Self-invocation refused` message from cli-opencode's own guard. -> 5. Bash: `cat /tmp/dv-023-output.ts` -> 6. OpenCode integrates the memoize function. | Step 3: devin exits 0; Step 4: no opencode-guard refusal; Step 5: memoize function visible; Step 6: response references the function | Prompt file, devin stdout, OpenCode session log (no guard refusal), terminal transcript | PASS if all steps succeed AND no opencode-guard activation AND OpenCode integrates the output; FAIL if guard tripped OR if dispatch errored | (1) Verify cli-opencode's self-invocation guard only checks `OPENCODE_*` not `DEVIN_*`; (2) check OPENCODE_* env vars are set (you ARE inside OpenCode); (3) confirm Devin is on PATH |

### Optional Supplemental Checks

- Try with `opencode --pure` mode and confirm the dispatch still works (per memory `feedback_opencode_pure_flag_required_for_deepseek.md`).
- Verify that an explicit cli-opencode "parallel detached session" request still works in parallel to the cli-devin dispatch.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` (§6 Cross-CLI Patterns — from cli-opencode) | Cross-CLI dispatch guidance |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Default Invocation (the copy-paste shape OpenCode uses) |
| `../../references/integration_patterns.md` (§2 Use Case 1) | External runtime → local Devin pattern |

---

## 5. SOURCE METADATA

- Group: Cross-AI Dispatch
- Playbook ID: DV-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--cross-ai-dispatch/027-from-cli-opencode.md`
