---
title: "HERMES-028 -- Prompt-time advisor brief and spec-folder question"
description: "Confirm the skill-advisor brief and the spec-folder gate question reach a Hermes session's user message on a write-intent first turn through the plugin's pre_llm_call bridge, for `HERMES-028`."
version: 1.0.0.0
---

# HERMES-028 -- Prompt-time advisor brief and spec-folder question

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HERMES-028`.

---

## 1. OVERVIEW

Hermes has no user-prompt-submit hook, but its `pre_llm_call` plugin hook returns context that the loop appends to the user message before the model call. The `repo-guards` plugin uses it to run the skill advisor on every turn and the spec-gate classifier on the first turn, and skips both for an orchestrated leaf (`SYSTEM_SPEC_GATE_DISABLED=1` with `AI_SESSION_CHILD=1`).

### Why This Matters

The other six runtimes run this guard through their hook adapters; a Hermes session that skipped it would be the one place the rule does not hold. The proof is the guard's own text arriving in the session.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-028` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a first-turn write-intent prompt arrives with both the advisor brief and the Gate 3 question appended.
- Real user request: `Does Hermes get the skill advisor and the spec-folder question like Claude Code does?`
- Prompt: `Create a new markdown file docs/hermes-notes.md and edit README.md to link it. This turn is only the planning step: reply with exactly two lines and end the turn. Line 1 = ADVISOR if this user message carries an appended skill-advisor brief naming a recommended skill with a confidence, else NO_ADVISOR. Line 2 = GATE if it carries an appended spec-folder question listing options A) to E), else NO_GATE. The file work happens in a later turn.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on the dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; stdout is `ADVISOR` then `GATE`; no file changed; `session_id:` on stderr. A prompt whose wording negates writing (for example "do not create or edit any file") classifies as read-only and yields `NO_GATE` by design.
- Evidence: stdout, exit code, elapsed seconds, the stderr session id, a clean `git status` for the named files
- Desired user-visible outcome: a concise verdict naming the observed guard text and the evidence behind it.
- Pass/fail: PASS on both lines; FAIL on `NO_ADVISOR` or `NO_GATE` for a write-intent prompt, or on any file change; SKIP only on a named blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes` and the plugin allowlist entry.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 1 --run-budget 120 \
  -q "Create a new markdown file docs/hermes-notes.md and edit README.md to link it. This turn is only the planning step: reply with exactly two lines and end the turn. Line 1 = ADVISOR if this user message carries an appended skill-advisor brief naming a recommended skill with a confidence, else NO_ADVISOR. Line 2 = GATE if it carries an appended spec-folder question listing options A) to E), else NO_GATE. The file work happens in a later turn." </dev/null >out.txt 2>err.txt
echo $?
cat out.txt
git status --short docs README.md
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-028 | Prompt-time advisor brief and spec-folder question | Confirm a first-turn write-intent prompt arrives with both the advisor brief and the Gate 3 question appended. | `Create a new markdown file docs/hermes-notes.md and edit README.md to link it. This turn is only the planning step: reply with exactly two lines and end the turn. Line 1 = ADVISOR if this user message carries an appended skill-advisor brief naming a recommended skill with a confidence, else NO_ADVISOR. Line 2 = GATE if it carries an appended spec-folder question listing options A) to E), else NO_GATE. The file work happens in a later turn.` | the `hermes chat` dispatch in §3 | Exit code `0`; stdout is `ADVISOR` then `GATE`; no file changed; `session_id:` on stderr. A prompt whose wording negates writing (for example "do not create or edit any file") classifies as read-only and yields `NO_GATE` by design. | stdout, exit code, elapsed seconds, the stderr session id, a clean `git status` for the named files | PASS on both lines; FAIL on `NO_ADVISOR` or `NO_GATE` for a write-intent prompt, or on any file change; SKIP only on a named blocker. | Harness: plugin not loaded. Dependency: provider missing; advisor daemon unreachable (the CLI falls back to a local scorer). Adapter: the gate silent on a write prompt, which points at the session id not reaching the classifier |

### Recorded Result

**Executed 2026-09-15**: exit 0 after 20 s, stdout `ADVISOR` then `GATE`, no file changed, session `20260915_082955_5bc29b`. An earlier probe whose prompt ended with "do not create or edit any file" reported `NO_GATE`; the classifier run directly on that wording is silent, so the probe, not the bridge, was read-only.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `goal-hook/prompt-time-advisor-brief-and-gate-question.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SYNC.md](../../../../../../.hermes/SYNC.md) | What the plugin bridges and how |
| [hook-contract.md](../../references/hook-contract.md) | The plugin hook map |
| `.opencode/hooks/spec-gate/devin/spec-gate-classify.mjs` | The gate core the bridge runs |
| `.opencode/bin/skill-advisor.cjs` | The advisor CLI the bridge runs |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: HERMES-028
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `goal-hook/prompt-time-advisor-brief-and-gate-question.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
