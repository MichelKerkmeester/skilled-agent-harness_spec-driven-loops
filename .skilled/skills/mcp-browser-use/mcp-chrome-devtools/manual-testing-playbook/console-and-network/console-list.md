---
title: "BDG-011 -- Console list"
description: "This scenario validates console message retrieval for `BDG-011`. It focuses on confirming `bdg console --list --json` returns JSON containing a message logged from the active page."
version: 1.0.2.0
---

# BDG-011 -- Console list

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-011`.

---

## 1. OVERVIEW

This scenario validates console message retrieval for `BDG-011`. It focuses on confirming that after a page logs a known message via `console.log`, `bdg console --list --json` returns a JSON-parseable structure containing that exact message. Without `--json`, `bdg` 0.6.10 prints a human-readable message list that `jq` cannot parse.

### Why This Matters

Console capture is the primary debugging surface for browser-side JavaScript: errors, warnings, and explicit logs are the operator's only window into runtime behavior. If `console --list` silently drops messages or returns malformed JSON, every browser-debugging workflow degrades to guesswork. The round-trip (log a sentinel, then retrieve it) proves both the eval transport and the console buffer are intact.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-011` and confirm the expected signals without contradictory evidence.

- Objective: Verify a message logged via `bdg dom eval "console.log('BDG-011 test')"` appears in `bdg console --list --json | jq '.'` output.
- Real user request: `"Show me the console messages from this page."`
- Prompt: `Show console messages from the active page as JSON and confirm the logged message is in it.`
- Expected execution process: assumes active session; emit a sentinel `console.log` via eval; retrieve console list; assert sentinel is present.
- Expected signals: eval exit 0; `console --list --json` exits 0 with valid JSON; the sentinel string `BDG-011 test` appears in the output.
- Desired user-visible outcome: A short report quoting the captured console message with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if eval errors, console output is not valid JSON, or the sentinel is absent.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show console messages from the active page as JSON and confirm the logged message is in it.`

### Commands

1. Precondition: active bdg session (BDG-002); verify with `bash: bdg status 2>&1`
2. `bash: bdg dom eval "console.log('BDG-011 test')" 2>&1`
3. `bash: bdg console --list --json | jq 'type'`
4. `bash: bdg console --list --json | jq '.' | grep "BDG-011 test"`

### Expected

- Step 2: exits 0
- Step 3: `jq` parses the output successfully (no parse error) and prints `"array"` or `"object"`
- Step 4: matches at least one line containing `BDG-011 test`; exit code 0

### Evidence

Capture all command outputs, the parsed JSON structure, and the grep match.

### Pass / Fail

- **Pass**: eval exit 0 AND `console --list --json` is valid JSON AND grep matches `BDG-011 test`.
- **Fail**: eval errors (cross-reference BDG-009); jq parse error (output is not JSON); sentinel absent (console buffer not capturing or evals not draining to console).

### Failure Triage

1. If `jq` reports a parse error: confirm `--json` is on the command (`bdg console --help` lists `-j, --json`). If it is, dump the raw output with `bdg console --list --json 2>&1` and inspect, since the surface may return plain text in error scenarios; cross-reference BDG-002 to confirm the session is alive.
2. If the sentinel is absent despite valid JSON: re-run step 2 and step 3 in immediate succession (some buffers flush asynchronously); if still absent, run a diagnostic eval `bdg dom eval "console.log('diag-' + Date.now())"` and check whether timestamped diagnostic messages land — confirms whether the buffer is empty or filtered.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md` | bdg console --list reference |
| `bdg console --help` | Confirms the `-j, --json` output flag |

---

## 5. SOURCE METADATA

- Group: CONSOLE AND NETWORK
- Playbook ID: BDG-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `console-and-network/console-list.md`
