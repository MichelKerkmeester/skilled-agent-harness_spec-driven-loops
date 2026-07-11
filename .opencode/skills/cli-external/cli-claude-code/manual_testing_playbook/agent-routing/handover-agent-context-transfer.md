---
title: "CC-021 -- Memory Epilogue context transfer"
description: "This scenario validates cross-session context transfer for `CC-021`. It focuses on confirming the default agent, with the Memory Epilogue template appended, produces a structured MEMORY_HANDBACK block suitable for cross-session resume via generate-context.js."
version: 1.1.0.8
---

# CC-021 -- Memory Epilogue context transfer

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-021`.

---

## 1. OVERVIEW

This scenario validates cross-session context transfer for `CC-021`. There is no `handover` agent in the current roster. The canonical bridge for cross-session work transfer is the Memory Epilogue pattern (`assets/prompt_templates.md` §13 MEMORY EPILOGUE): append the epilogue template to any delegated prompt, and the dispatched session emits a delimited `MEMORY_HANDBACK_START`/`END` block containing structured JSON that the calling AI extracts and feeds to `generate-context.js`. This scenario confirms that end-to-end path — active work, modified files, recent decisions and next steps — so a follow-up session can resume without re-discovery.

### Why This Matters

When an external orchestrator hands off a long-running task to Claude Code, the Memory Epilogue's structured JSON payload is what lets the next runtime pick up where the prior turn stopped, and what `generate-context.js` requires to save continuity. If the handback output is freeform or omits canonical fields, the cross-session resume contract collapses and operators must re-derive context from scratch.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-021` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a default-agent dispatch with the Memory Epilogue template appended produces a properly-delimited `MEMORY_HANDBACK_START`/`END` block whose JSON payload covers active work, modified files, recent decisions and next steps, in a single read-only dispatch.
- Real user request: `Use Claude Code to capture a structured handback for the work I just finished on the auth refactor so the next session can pick it up tomorrow.`
- RCAF Prompt: `As an external-AI conductor closing out a multi-step task and preparing handoff for a follow-up session, dispatch claude -p --permission-mode plan (no --agent — there is no handover agent) against the cli-claude-code skill scope, with the Memory Epilogue template appended, and capture the structured MEMORY_HANDBACK block. Verify the JSON payload identifies active work, modified files, key decisions, blockers, and next steps. Return a concise pass/fail verdict naming the captured fields and confirming no file writes.`
- Expected execution process: External-AI orchestrator selects a real recent change set in the repo as the synthetic task scope, snapshots mtimes of all candidate files, dispatches with `--permission-mode plan` and the Memory Epilogue appended, then verifies the extracted JSON payload covers the canonical fields and that no mtimes advanced.
- Expected signals: Response contains exactly one `MEMORY_HANDBACK_START`/`END` delimiter pair. The JSON between them parses. It names the active task, lists at least 2 modified or referenced files, surfaces at least 1 decision or rationale, and names at least 1 concrete next step. No file mtimes change.
- Desired user-visible outcome: A structured JSON handback the operator can feed directly to `generate-context.js` for tomorrow's session.
- Pass/fail: PASS if the delimiter pair is present, the JSON parses, covers the canonical fields, AND no mtimes changed. FAIL if any canonical field is missing, the JSON fails to parse, or any mtime advances.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Snapshot mtimes for the recent change-set scope in the repo.
3. Dispatch with `--permission-mode plan` (no `--agent`) and a prompt naming the synthetic task scope, with the Memory Epilogue template appended.
4. Re-snapshot mtimes and diff.
5. Extract the `MEMORY_HANDBACK` block and validate the JSON parses with the canonical fields.
6. Return a verdict naming the captured fields and confirming the mtime status.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-021 | Memory Epilogue context transfer | Confirm a default-agent dispatch with the Memory Epilogue appended produces a structured MEMORY_HANDBACK covering the canonical fields | `As an external-AI conductor closing out a multi-step task and preparing handoff for a follow-up session, dispatch claude -p --permission-mode plan (no --agent) against the cli-claude-code skill scope, with the Memory Epilogue template appended, and capture the structured MEMORY_HANDBACK block. Verify the JSON payload identifies active work, modified files, key decisions, blockers, and next steps. Return a concise pass/fail verdict naming the captured fields and confirming no file writes.` | 1. `bash: find .opencode/skills/cli-external/cli-claude-code -type f -name '*.md' -exec stat -f '%m %N' {} \; \| sort > /tmp/cc-021-mtimes-before.txt` -> 2. `bash: claude -p "Summarize active work on the cli-claude-code skill at @./.opencode/skills/cli-external/cli-claude-code/ in two sentences. Then append a Memory Epilogue using the canonical structured JSON shape: include MEMORY_HANDBACK_START and MEMORY_HANDBACK_END as HTML comment delimiters. The JSON between them MUST include specFolder, sessionSummary, user_prompts (array with 1 entry), observations (array, at least 1), recent_context (array, at least 1), FILES (array, at least 2 entries with path/DESCRIPTION/ACTION/MODIFICATION_MAGNITUDE), and nextSteps (array with at least 1 entry)." --permission-mode plan --output-format text 2>&1 \| tee /tmp/cc-021-output.txt` -> 3. `bash: find .opencode/skills/cli-external/cli-claude-code -type f -name '*.md' -exec stat -f '%m %N' {} \; \| sort > /tmp/cc-021-mtimes-after.txt` -> 4. `bash: diff /tmp/cc-021-mtimes-before.txt /tmp/cc-021-mtimes-after.txt && echo OK_UNCHANGED` -> 5. `bash: grep -c 'MEMORY_HANDBACK_START' /tmp/cc-021-output.txt && grep -c 'MEMORY_HANDBACK_END' /tmp/cc-021-output.txt` -> 6. `bash: python3 -c "import re,json; t=open('/tmp/cc-021-output.txt').read(); m=re.search(r'<!--\s*MEMORY_HANDBACK_START\s*-->([\s\S]*?)<!--\s*MEMORY_HANDBACK_END\s*-->', t); body=m.group(1).strip() if m else ''; obj=json.loads(re.search(r'\{[\s\S]*\}', body).group(0)) if body else {}; print('FIELDS:', sorted(obj.keys()))"` | Step 1: mtime baseline captured; Step 2: response captured; Step 3: mtime after captured; Step 4: `OK_UNCHANGED` printed; Step 5: each delimiter count = 1; Step 6: parsed FIELDS includes specFolder, sessionSummary, user_prompts, observations, recent_context, FILES, nextSteps | `/tmp/cc-021-output.txt`, `/tmp/cc-021-mtimes-before.txt`, `/tmp/cc-021-mtimes-after.txt` | PASS if exactly one delimiter pair AND JSON parses with the canonical fields AND no mtime advances; FAIL if a delimiter or canonical field is missing, JSON fails to parse, or any mtime advances | 1. If delimiters are missing, the prompt may not have been explicit enough — re-prompt verbatim with the full `assets/prompt_templates.md` §13 epilogue text; 2. If mtimes advance, the read-only safety contract was violated, file a regression bug; 3. If a canonical field is missing, list which one and refine the prompt |

### Optional Supplemental Checks

After extracting the JSON payload, feed it to `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` against a sandbox spec folder (never a live operator packet) and confirm the save completes, proving the handback fully integrates with the canonical continuity save path.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../assets/prompt_templates.md` (§13 MEMORY EPILOGUE) | Canonical Memory Epilogue body |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Memory Handback Protocol (7-step procedure) |
| `../../references/agent_delegation.md` | Current agent roster (confirms no `handover` agent exists) |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CC-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `agent-routing/handover-agent-context-transfer.md`
