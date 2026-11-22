---
title: "BDG-003 -- Status JSON"
description: "This scenario validates bdg status JSON output for `BDG-003`. It focuses on confirming `bdg status --json` returns valid JSON that reports an active session and its url."
version: 1.0.2.0
---

# BDG-003 -- Status JSON

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-003`.

---

## 1. OVERVIEW

This scenario validates bdg status JSON output for `BDG-003`. It focuses on confirming `bdg status --json` returns parseable JSON that reports the session as active and carries the page url, so downstream scripts can reliably parse the session state. Without `--json`, `bdg` 0.6.10 prints human-readable text, which `jq` cannot parse.

### Why This Matters

Operator scripts often pipe `bdg status` to `jq` to make decisions (e.g., "if the session is not active then start one"). If the output is non-JSON or missing expected fields, scripted automation breaks silently.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg status --json | jq '.'` succeeds, the parsed object has `active` set to `true`, and a `url` string appears somewhere in it.
- Real user request: `"Get the bdg status as JSON."`
- Prompt: `Get bdg status as JSON and confirm it reports an active session and its url.`
- Expected execution process: assumes BDG-002 ran successfully (active session); run the jq pipelines.
- Expected signals: jq pipeline succeeds (no parse error); `.active` is `true`; a `url` string is present.
- Desired user-visible outcome: A short report quoting the parsed `active` and `url` values with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if output isn't valid JSON, `active` is not `true`, or no `url` is present.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Get bdg status as JSON and confirm it reports an active session and its url.`

### Commands

1. Precondition: BDG-002 has started a session (run `bdg https://example.com` if not)
2. `bash: bdg status --json | jq -c 'keys'`
3. `bash: bdg status --json | jq -e '.active == true'`
4. `bash: bdg status --json | jq -r '[.. | objects | .url | strings] | first'`

### Expected

- Step 2: jq exits 0 and prints the top-level key list, which includes `active`
- Step 3: prints `true`; jq exits 0
- Step 4: prints a URL string (e.g., `https://example.com/`), not `null`

### Evidence

Capture all three jq outputs verbatim.

### Pass / Fail

- **Pass**: jq parses successfully; `.active` is `true`; a `url` string is present.
- **Fail**: jq parse error (output isn't JSON); `.active` missing or `false`; step 4 prints `null` (schema drift).

### Failure Triage

1. If jq parse error: confirm `--json` is on the command (`bdg status --help` lists `-j, --json`); without it `bdg` prints text. If the flag is present, start a session first per BDG-002.
2. If fields are missing: the schema may have evolved; compare the step 2 key list with `bdg status --help` and record the new keys. Step 4 searches the whole object because the nesting of `url` is not documented.
3. If output mixes JSON and plain text: bdg may be writing logs to stdout instead of stderr; redirect with `bdg status --json 2>/dev/null` and re-test.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md` | bdg status reference |
| `bdg status --help` | Confirms the `-j, --json` output flag |

---

## 5. SOURCE METADATA

- Group: CLI BDG LIFECYCLE
- Playbook ID: BDG-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-bdg-lifecycle/status-json.md`
