---
title: "BDG-015 -- Dual-instance parallel"
description: "This scenario validates driving both isolated instances, `chrome_devtools_1` and `chrome_devtools_2`, from one `call_tool_chain` for `BDG-015`. It confirms each instance navigates and writes its own valid PNG."
version: 1.0.2.0
---

# BDG-015 -- Dual-instance parallel

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-015`.

---

## 1. OVERVIEW

This scenario validates one Code Mode run that drives two isolated MCP browser instances, `chrome_devtools_1` and `chrome_devtools_2`, for `BDG-015`. Each instance navigates to its own URL and writes its own screenshot file. A separate filesystem check confirms both files are valid PNGs. The calls run one after another. Code Mode wraps the code in a plain function, so a top-level `await` fails with `await is only valid in async functions`. Each tool call blocks until it returns, so `Promise.all` adds no concurrency and this scenario does not measure any. This scenario depends on CM-014..CM-016 (Chrome via Code Mode).

### Why This Matters

The second instance earns its cost by giving you a second, isolated browser in the same run. You can compare production and staging, or a signed-out and a signed-in state, without one session touching the other. If either instance fails to navigate or to write its file, that comparison is not possible.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-015` and confirm the expected signals without contradictory evidence.

- Objective: Verify one `call_tool_chain` navigates `chrome_devtools_1` and `chrome_devtools_2` to different URLs and that each writes a valid PNG to its own `filePath`.
- Real user request: `"Open example.com on one browser and example.org on another and screenshot both."`
- Prompt: `As a manual-testing orchestrator, navigate chrome_devtools_1 to https://example.com and chrome_devtools_2 to https://example.org in one Code Mode call, using plain synchronous calls against both MCP instances. Screenshot each to its own file and verify both files are valid PNGs. Return a concise user-facing pass/fail verdict with the main reason.` (RCAF format)
- Expected execution process: build a Code Mode script of plain synchronous calls with no `await`. It navigates and screenshots instance 1, then instance 2, each with an explicit `filePath`. Verify both files with a separate shell step, since the Code Mode sandbox has no filesystem access.
- Expected signals: both navigate calls name their own URL. The logs carry no `[ERROR] Code execution failed` line. Both screenshot files exist, are non-empty and start with the PNG magic bytes.
- Desired user-visible outcome: A short report quoting both URLs and both screenshot file paths with a PASS verdict.
- Pass/fail: PASS if all signals hold. FAIL if either instance errors, the logs show a failed execution or either screenshot file is missing or empty.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, navigate chrome_devtools_1 to https://example.com and chrome_devtools_2 to https://example.org in one Code Mode call, using plain synchronous calls against both MCP instances. Screenshot each to its own file and verify both files are valid PNGs. Return a concise user-facing pass/fail verdict with the main reason.` (RCAF format)

### Commands

1. Precondition: both `chrome_devtools_1` and `chrome_devtools_2` are registered; verify with `bash: jq -r '.manual_call_templates[].name' .utcp_config.json | grep chrome_devtools_`
2. Code Mode script, built and dispatched via `call_tool_chain`. Plain synchronous calls, no `await`:
   ```js
   const nav1 = chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' });
   const shot1 = chrome_devtools_1.chrome_devtools_1_take_screenshot({ filePath: '/tmp/bdg-015-func-1.png' });
   const nav2 = chrome_devtools_2.chrome_devtools_2_navigate_page({ url: 'https://example.org' });
   const shot2 = chrome_devtools_2.chrome_devtools_2_take_screenshot({ filePath: '/tmp/bdg-015-func-2.png' });
   return { nav1, shot1, nav2, shot2 };
   ```
3. `bash: ls -la /tmp/bdg-015-func-1.png /tmp/bdg-015-func-2.png && xxd /tmp/bdg-015-func-1.png | head -1 && xxd /tmp/bdg-015-func-2.png | head -1`. Confirm both files exist, are non-empty and start with the PNG magic bytes `89 50 4e 47`.

### Expected

- Step 1: both manuals registered
- Step 2: returns `{ nav1, shot1, nav2, shot2 }`. `nav1` names `https://example.com` and `nav2` names `https://example.org`. The logs carry no `[ERROR] Code execution failed` line.
- Step 3: both files exist, size > 0, first bytes are the PNG magic number `89 50 4e 47`

### Evidence

Capture the Code Mode script, the returned object with its logs, and the `ls -la` and `xxd` output for both screenshot files.

### Pass / Fail

- **Pass**: both navigate results name their own URL AND both screenshot files exist with PNG magic bytes.
- **Fail**: either instance throws (cross-reference CM-005 namespace contract), the logs show `[ERROR] Code execution failed` or either file is missing or empty (cross-reference CM-015).

### Failure Triage

1. If the logs show `await is only valid in async functions`: the script still uses `await`. Drop it, since Code Mode tool calls are synchronous. A failed run still returns `success: true` with `result: null`, so read the logs, not the success flag.
2. If one call throws "manual not found" for `chrome_devtools_2`: the second MCP is not registered. Cross-reference CM-005 (manual-namespace contract) and confirm `.utcp_config.json` includes `chrome_devtools_2` with `--isolated=true`.
3. If both files exist but show the same page: the instances are not isolated. Confirm each manual launches its own browser process.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `.skilled/skills/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md` | CM playbook (CM-014..CM-016 Chrome via CM) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md` | chrome_devtools_1/chrome_devtools_2 MCP reference |
| `.skilled/skills/mcp-code-mode/SKILL.md` | Code Mode call contract |

---

## 5. SOURCE METADATA

- Group: MCP PARALLEL INSTANCES
- Playbook ID: BDG-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-parallel-instances/dual-instance-parallel.md`
