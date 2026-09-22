---
title: "HERMES-028 -- Prompt-time advisor brief and mutation-time gate delivery"
description: "Confirm a Hermes session's user turn carries the skill-advisor brief and never the spec-folder question, and that the question is delivered once, on the first write's own tool result, for `HERMES-028`."
version: 1.0.1.0
---

# HERMES-028 -- Prompt-time advisor brief and mutation-time gate delivery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HERMES-028`.

---

## 1. OVERVIEW

Hermes has no user-prompt-submit hook, but its `pre_llm_call` plugin hook returns context that the loop appends to the user message before the model call. The `repo-guards` plugin uses it to run the skill advisor on every turn and to classify the prompt for the spec-folder gate, skipping the classification for an orchestrated leaf (`SYSTEM_SPEC_GATE_DISABLED=1` with `AI_SESSION_CHILD=1`).

The gate's question no longer rides that channel. It is delivered once, on the first write's own tool result, by the shared enforce adapter the CLI runtimes run: the adapter's advisory carries the question, and the adapter records the delivery itself, so the next write in the session stays silent. Under `SYSTEM_SPEC_GATE_ENFORCE=1` the same adapter runs in `pre_tool_call` instead and blocks the write, with the question inside its denial reason.

### Why This Matters

The question is a decision the operator has to make, and every runtime now puts it where a write is actually attempted: a turn-time menu stalls an instruction-literal model over a turn that may only read, and a session that never receives it at all would mutate the workspace unasked. The proof is the guard's own text arriving in the session at the moment the write happens, and only once.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-028` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a write-intent turn arrives carrying the advisor brief and no spec-folder question, and that the question then rides the first write's tool result and only that one.
- Real user request: `Does Hermes still get the skill advisor, and where does the spec-folder question arrive now?`
- Prompt: `Do exactly this, nothing else. Step 1: create the file docs/hermes-notes.md containing the single line probe-a. Step 2: create the file docs/hermes-notes-2.md containing the single line probe-b. Step 3: end your turn by printing exactly two lines. Line 1 = GATE if the result of your FIRST write carried an appended spec-folder question listing options A) to D), else NO_GATE. Line 2 = GATE if the result of your SECOND write carried one, else NO_GATE.`
- Expected execution process: run the two dispatches in §3 from the repository root with a 300-second alarm on each, capture each stdout, stderr, exit code and elapsed seconds separately, confirm the first session's gate state file exists, remove both probe files, and judge the result against the pass/fail criteria below.
- Expected signals: Both dispatches exit `0`; the turn dispatch prints `ADVISOR` then `NO_GATE`; the write dispatch prints `GATE` then `NO_GATE`; each session's state file under `.skilled/skills/.state/spec-gate/` (named by the hex-encoded session id) exists after its dispatch; `git status --short docs` is empty after cleanup. The turn dispatch carries no question by design, so `NO_GATE` there is the expected reading of the new contract rather than a failure.
- Evidence: The two stdout transcripts, both exit codes, elapsed seconds, both stderr session ids, the two state files, and `git status --short docs` after cleanup.
- Desired user-visible outcome: a concise verdict naming where the question arrived and the evidence behind it.
- Pass/fail: PASS when the turn dispatch prints `ADVISOR` and `NO_GATE` and the write dispatch prints `GATE` then `NO_GATE`; FAIL when the turn dispatch prints `GATE` (the question still rides the turn) or when the write dispatch prints `NO_GATE` twice while its session's state file shows the gate open (the notice was not delivered); SKIP only on a named blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes` and the plugin allowlist entry.
3. Run the two dispatches below exactly as written, from the repository root.
4. Capture each stdout, stderr, exit code and elapsed seconds separately, and confirm each session's gate state file.
5. Remove the probe files, judge the result against the pass/fail criteria, and record the verdict with its evidence.

### Commands

```bash
# Dispatch 1: the turn carries the advisor brief and never the question.
HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 1 --run-budget 120 \
  -q "This turn is only the planning step: reply with exactly two lines and end the turn. Line 1 = ADVISOR if this user message carries an appended skill-advisor brief naming a recommended skill with a confidence, else NO_ADVISOR. Line 2 = GATE if it carries an appended spec-folder question listing options A) to D), else NO_GATE. The file work happens in a later turn; later I will ask you to create docs/hermes-notes.md and edit README.md." </dev/null >turn.out 2>turn.err
echo $?
cat turn.out

# Dispatch 2: the question rides the first write's result and only that one.
HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --run-budget 180 \
  -q "Do exactly this, nothing else. Step 1: create the file docs/hermes-notes.md containing the single line probe-a. Step 2: create the file docs/hermes-notes-2.md containing the single line probe-b. Step 3: end your turn by printing exactly two lines. Line 1 = GATE if the result of your FIRST write carried an appended spec-folder question listing options A) to D), else NO_GATE. Line 2 = GATE if the result of your SECOND write carried one, else NO_GATE." </dev/null >write.out 2>write.err
echo $?
cat write.out

# Confirm each session opened its gate, then clean up: the scenario leaves no change.
for f in turn.err write.err; do
  hex=$(python3 -c "import binascii,sys; print(binascii.hexlify(sys.argv[1].encode()).decode())" "$(grep -o 'session_id: .*' "$f" | tail -1 | awk '{print $2}')")
  test -f ".skilled/skills/.state/spec-gate/$hex.json" && cat ".skilled/skills/.state/spec-gate/$hex.json"
done
rm -f docs/hermes-notes.md docs/hermes-notes-2.md
git status --short docs
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-028 | Prompt-time advisor brief and mutation-time gate delivery | Confirm a write-intent turn carries the advisor brief and no spec-folder question, and that the question rides the first write's tool result and only that one | `Do exactly this, nothing else. Step 1: create the file docs/hermes-notes.md containing the single line probe-a. Step 2: create the file docs/hermes-notes-2.md containing the single line probe-b. Step 3: end your turn by printing exactly two lines. Line 1 = GATE if the result of your FIRST write carried an appended spec-folder question listing options A) to D), else NO_GATE. Line 2 = GATE if the result of your SECOND write carried one, else NO_GATE.` | the two `hermes chat` dispatches, the state-file listing and the cleanup in §3 | Both dispatches exit `0`; stdout is `ADVISOR` then `NO_GATE` for the turn, `GATE` then `NO_GATE` for the writes; both session state files exist; `git status --short docs` empty | both stdout transcripts, exit codes, elapsed seconds, session ids, state files, cleanup status | PASS on `ADVISOR`/`NO_GATE` then `GATE`/`NO_GATE`; FAIL when the turn carries the question or the first write carries none while the gate is open; SKIP only on a named blocker | Harness: plugin not loaded, or the probe wording never opened the gate — a prompt the shared classifier reads as read-only or generation-only leaves state `closed`, so check for the session's state file before blaming the bridge. Dependency: provider missing; advisor daemon unreachable (the CLI falls back to a local scorer). Adapter: the state file shows `open` and no write carried the question, which points at the write tool name or its path argument not reaching the bridge |

### Recorded Result

**Executed 2026-09-22** in `.worktrees/058-gate-3-mutation-time-delivery` on `glm-5.3-flash` through `llmgateway`, after the plugin moved delivery to the first mutation:

- Turn dispatch, session `20260922_095053_5713d3`: exit `0`, stdout `ADVISOR` then `NO_GATE`, and the session's gate state file was written as `{"status": "open"}` — the classification ran and the turn itself stayed clean.
- Write dispatch, session `20260922_095443_31c676`: exit `0`, stdout `GATE` then `NO_GATE` — the first write's result carried the question and the second carried none. Both probe files were removed afterwards and `git status --short docs` was empty.
- Enforced dispatch, session `20260922_103547_92e186`: exit `0`, stdout `BLOCKED DENIED: this Write/Edit needs a bound spec folder first.` — with `SYSTEM_SPEC_GATE_ENFORCE=1` the write was refused before it ran and no file was created.
- Superseded: the previous contract recorded `ADVISOR` then `GATE` on the turn for session `20260915_082955_5bc29b` (2026-09-15), which was the prompt-time shape before the delivery moved.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `goal-hook/advisor-brief-and-gate-delivery.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SYNC.md](../../../../../../.hermes/SYNC.md) | What the plugin bridges and how |
| [hook-contract.md](../../references/hook-contract.md) | The plugin hook map |
| `.skilled/hooks/spec-gate/devin/spec-gate-classify.mjs` | The classifier the bridge runs on every prompt |
| `.skilled/hooks/spec-gate/devin/spec-gate-enforce.mjs` | The adapter the bridge runs for a write: the once-only notice, or the denial under `SYSTEM_SPEC_GATE_ENFORCE=1` |
| `.skilled/bin/skill-advisor.cjs` | The advisor CLI the bridge runs |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: HERMES-028
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `goal-hook/advisor-brief-and-gate-delivery.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
