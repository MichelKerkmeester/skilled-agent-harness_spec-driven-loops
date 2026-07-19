---
title: "BDG-014 -- chrome_devtools_1 navigate via Code Mode"
description: "This scenario validates Code Mode invocation of `chrome_devtools_1` for `BDG-014`. It focuses on confirming a navigate + screenshot round-trip via the manual-namespace contract returns valid bytes."
version: 1.0.0.6
---

# BDG-014 -- chrome_devtools_1 navigate via Code Mode

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-014`.

---

## 1. OVERVIEW

This scenario validates Code Mode invocation of the `chrome_devtools_1` MCP instance for `BDG-014`. It focuses on confirming a `navigate_page` call to `https://example.com` succeeds and that a follow-up `take_screenshot` call, given an explicit `filePath`, writes a non-empty PNG to disk (the tool's documented contract attaches the image to the response or saves it to `filePath`; it does not document a base64 field to read directly). This is the entry-point smoke test for the MCP parallel-instances category and depends on the manual-namespace contract validated in CM-005..CM-007 plus the via-Code-Mode patterns in CM-014..CM-016.

### Why This Matters

`chrome_devtools_1` is the parallel-instance fallback to the bdg CLI: it's how operators run multiple isolated browsers concurrently. If the navigate call fails or screenshot returns wrong-shape bytes, every parallel browser workflow (BDG-015..BDG-018) fails for the same root cause. Establishing a single-instance round-trip first isolates "Code Mode + manual namespace" issues from "parallelism" issues.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-014` and confirm the expected signals without contradictory evidence.

- Objective: Verify `chrome_devtools_1.chrome_devtools_1_navigate_page({url: 'https://example.com'})` succeeds via Code Mode and that a subsequent `take_screenshot` call with an explicit `filePath` writes a valid PNG to disk.
- Real user request: `"Open example.com in chrome_devtools_1 and take a screenshot."`
- RCAF Prompt: `As a manual-testing orchestrator, navigate chrome_devtools_1 to https://example.com through Code Mode against the configured chrome_devtools_1 MCP server. Verify the call succeeds and the screenshot file is a valid PNG. Cross-reference: this scenario depends on CM-005 (correct manual.tool form) and CM-015 (Chrome navigate + screenshot). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: build a Code Mode script that calls navigate then screenshot (with an explicit `filePath`) via `call_tool_chain`; execute; then verify the written file with a separate shell step (Code Mode's V8 sandbox has no filesystem access, so file checks run outside the script).
- Expected signals: navigate call returns success (no thrown error); the screenshot call returns without throwing; the file at `filePath` exists, is non-empty, and starts with the PNG magic bytes `89 50 4e 47`.
- Desired user-visible outcome: A short report quoting the navigated URL, the screenshot file path and size, and "VALID PNG" with a PASS verdict.
- Pass/fail: PASS if both signals hold; FAIL if navigate errors, the screenshot call throws, the file is missing or empty, or the manual-namespace lookup fails.

---

## 3. TEST EXECUTION

### Prompt

- RCAF Prompt: `As a manual-testing orchestrator, navigate chrome_devtools_1 to https://example.com through Code Mode against the configured chrome_devtools_1 MCP server. Verify the call succeeds and the screenshot file is a valid PNG. Cross-reference: this scenario depends on CM-005 (correct manual.tool form) and CM-015 (Chrome navigate + screenshot). Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: `chrome_devtools_1` is registered in `.utcp_config.json`; verify with `bash: jq '.manuals | keys' .utcp_config.json | grep chrome_devtools_1`
2. Code Mode script — build and dispatch via `call_tool_chain`:
   ```ts
   const nav = await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' });
   const shot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({ filePath: '/tmp/bdg-014-screenshot.png' });
   return { nav, shot };
   ```
3. `bash: ls -la /tmp/bdg-014-screenshot.png && xxd /tmp/bdg-014-screenshot.png | head -1` — confirm the file exists, is non-empty, and starts with the PNG magic bytes `89 50 4e 47`

### Expected

- Step 1: `.utcp_config.json` lists `chrome_devtools_1` under `manuals`
- Step 2: navigate returns success; the screenshot call returns without throwing
- Step 3: file exists, size > 0, first bytes are the PNG magic number `89 50 4e 47`

### Evidence

Capture the Code Mode script, the returned object (or summarized fields), and the `ls -la` / `xxd` output for the screenshot file.

### Pass / Fail

- **Pass**: navigate succeeds AND the screenshot call succeeds AND the file at `filePath` exists, is non-empty, and has PNG magic bytes.
- **Fail**: manual not registered (cross-reference CM-005 manual-namespace contract); navigate throws; the screenshot call throws; the file is missing, empty, or lacks PNG magic bytes.

### Failure Triage

1. If the call errors with "manual not found" or "tool not found": confirm the namespace pattern matches CM-005 — the call must be `chrome_devtools_1.chrome_devtools_1_<tool>`, not `chrome_devtools_1_<tool>` directly; cross-reference CM-014 for the canonical Chrome via Code Mode pattern.
2. If the file is missing or zero bytes: inspect the raw return object for an error envelope instead of a normal response; cross-reference CM-015 for the `take_screenshot` `filePath` contract and confirm the underlying browser launched (`chrome-devtools-mcp` starts its own Chrome instance per manual; this is independent of the `bdg` CLI).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md` | CM playbook (CM-005..CM-007 manual-namespace, CM-014..CM-016 Chrome via CM) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` | chrome_devtools_1 MCP reference |
| `.opencode/skills/mcp-code-mode/SKILL.md` | Code Mode + manual-namespace contract |

---

## 5. SOURCE METADATA

- Group: MCP PARALLEL INSTANCES
- Playbook ID: BDG-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-parallel-instances/chrome-devtools-1-navigate.md`
