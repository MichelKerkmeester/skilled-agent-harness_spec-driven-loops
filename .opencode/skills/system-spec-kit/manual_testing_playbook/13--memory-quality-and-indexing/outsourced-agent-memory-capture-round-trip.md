---
title: "M-005 -- Outsourced Agent Memory Capture Round-Trip"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-005`."
audited_post_018: true
version: 3.6.0.18
---

# M-005 -- Outsourced Agent Memory Capture Round-Trip

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-005`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-005`.
- Real user request: `Please validate Outsourced Agent Memory Capture Round-Trip against cli-opencode and tell me whether the expected signals are present: Agent output contains structured memory section; saved context is discoverable via search.`
- Prompt: `Validate outsourced agent memory capture round-trip against cli-opencode.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Agent output contains structured memory section; saved context is discoverable via search
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: Saved memory from outsourced agent session is searchable and contains session summary, files modified, decisions.

---

## 3. TEST EXECUTION

### Prompt

`Validate outsourced agent memory capture round-trip against cli-opencode.`
### Commands
- Dispatch task via `cli-opencode` (or any cli-* skill) with memory epilogue in prompt
  - Extract structured memory section from agent stdout
  - Write JSON to `/tmp/save-context-data-<session-id>.json`
  - `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json specs/<target-spec>`
  - `memory_index_scan({ specFolder: "specs/<target-spec>" })`
  - `memory_search({ query: "<key term from agent session>", specFolder: "specs/<target-spec>" })`
### Expected

Agent output contains structured memory section; saved context is discoverable via search.
### Evidence

BLOCKED before dispatch by the required `cli-opencode` self-invocation guard. The scenario requires dispatching through `cli-opencode` (or a `cli-*` skill), but the loaded `cli-opencode` contract refuses self-dispatch from an active OpenCode runtime unless this is an explicitly requested parallel detached session. This scenario prompt did not request a parallel detached session.

Command: `command -v opencode && opencode --version`

```text
/opt/homebrew/bin/opencode
1.17.11
```

Command: `env | grep '^OPENCODE_' || true`

```text
OPENCODE_PID=61522
```

Command: `ps -o command= -p "$PPID"`

```text
opencode run --model openai/gpt-5.5-fast --variant medium --format json --dangerously-skip-permissions --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public Spec folder: .opencode/specs/system-speckit/031-manual-playbook-execution-sweep (pre-approved, skip Gate 3)\012\012You are executing exactly ONE manual testing playbook scenario. This is real production verification work, not a simulation.\012\012## BANNED OPERATIONS\012- Do NOT run git commit, git push, git reset --hard, or any destructive git command.\012- Do NOT modify, create, or delete any file OTHER than the single scenario file named below.\012- Do NOT touch any other manual testing playbook scenario file.\012\012## ALLOWED WRITE PATHS\012- .opencode/skills/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/outsourced-agent-memory-capture-round-trip.md (this file only)\012\012## TASK\012\0121. Read .opencode/skills/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/outsourced-agent-memory-capture-round-trip.md in full.\0122. Follow its own Preconditions and Commands sections EXACTLY as written, using real tool calls (MCP tools, CLI commands, file reads) as the scenario specifies. Do not skip steps. Do not simulate -- actually run the commands and observe real output.\0123. Compare what you actually observed against the scenario's own Expected section.\0124. Edit ONLY .opencode/skills/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/outsourced-agent-memory-capture-round-trip.md: fill in its Evidence section with the real, specific output you observed (not a paraphrase -- actual command output, actual values), and set its Pass/Fail section to PASS, FAIL, or BLOCKED based on whether the Expected outcome held. If a precondition is missing or broken in the current repo state, mark BLOCKED and say exactly what's missing, do not silently mark PASS or skip.\0125. Preserve the file's existing frontmatter and section structure -- only fill in the Evidence and Pass/Fail content, do not restructure the file.\012\012## OUTPUT CONTRACT\012\012End your response with EXACTLY one line in this format (used for automated parsing, must be the literal last line):\012VERDICT: PASS|FAIL|BLOCKED — <one sentence reason>\012
```

Command: `opencode providers list 2>&1`

```text
[0m
┌  Credentials [90m~/.local/share/opencode/auth.json
│
●  DeepSeek [90mapi
│
●  OpenAI [90moauth
│
●  Xiaomi [90mapi
│
●  Kimi For Coding [90mapi
│
●  MiniMax (minimax.io) [90mapi
│
●  Z.AI Coding Plan [90mapi
│
└  6 credentials
```

Command: `ls "$HOME/.opencode/state"/*/lock 2>/dev/null || true`

```text
zsh:1: no matches found: /Users/michelkerkmeester/.opencode/state/*/lock
```

No agent stdout with a memory section was produced, so no `/tmp/save-context-data-<session-id>.json`, `generate-context.js` run, `memory_index_scan`, or `memory_search` could validly follow without skipping the blocked dispatch step.
### Pass/Fail

BLOCKED — `cli-opencode` self-invocation guard detected the current process is already inside OpenCode (`OPENCODE_PID=61522`, parent process `opencode run`), and the scenario did not authorize an explicit parallel detached session.
### Failure Triage

Check memory epilogue in prompt template → Verify generate-context.js JSON mode input → Inspect agent stdout for structured section → Verify index scan ran post-save.

#### M-005a: JSON-mode hard-fail (REQ-001)
1. Create an invalid JSON file: `echo "not json" > /tmp/save-context-data-<session-id>.json`
2. Run: `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json specs/<target-spec>`
3. Verify: Command exits with error containing `EXPLICIT_DATA_FILE_LOAD_FAILED`

#### M-005b: nextSteps persistence (REQ-002)
1. Create valid JSON with nextSteps: `echo '{"nextSteps":["Fix bug X","Deploy Y"]}' > /tmp/save-context-data-<session-id>.json`
2. Run generate-context.js with the JSON file
3. Verify: Output memory contains `Next:` or `NEXT_ACTION` observations derived from the nextSteps array

#### M-005c: Verification freshness (REQ-004/REQ-005)
1. Do not claim outsourced CLI live round-trip passed unless freshly rerun with evidence
2. Check that checklist.md verification claims are backed by current evidence (e.g., CHK-025 should cite a dated round-trip artifact)

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/outsourced-agent-memory-capture.md](../../feature_catalog/13--memory-quality-and-indexing/outsourced-agent-memory-capture.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: M-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/outsourced-agent-memory-capture-round-trip.md`
