---
title: "489 -- Trigger lookup total candidates"
description: "This scenario validates that trigger-index lookup reports the omitted candidate count when results are limited to two."
version: 1.0.0.0
---

# 489 -- Trigger lookup total candidates

This document captures the realistic conversation contract, current behavior, execution flow, source anchors and metadata for `489`.

---

## 1. OVERVIEW

This scenario validates that trigger-index lookup reports the omitted candidate count when results are limited to two. It focuses on checking the CLI's full candidate count and confirming that the response tells the user how many matches were left out.

### Why This Matters

A result limit can hide relevant documents. Reporting the full candidate count lets the user understand how many matches the displayed results leave out.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `489` and confirm the expected signals without contradictory evidence.

- Objective: Verify the trigger-index lookup reports a total candidate count greater than two, marks the limited result as truncated, and the user-facing answer states how many matches were omitted.
- Real user request: `Search the trigger index for spec folder validation strict but only show me the top 2. How many matches did you leave out?`
- Prompt: `Search the trigger index for spec folder validation strict but only show me the top 2. How many matches did you leave out?`
- Expected execution process: Run the conversation in a scratch project with the repository skills and Devin configuration copied into it. Inspect the lookup JSON and the screen text after the echoed request.
- Expected signals: The lookup JSON has `totalCandidates > 2`, `truncated: true` and two returned results. The response gives the exact `totalCandidates - 2` count in a sentence that calls those matches omitted.
- Desired user-visible outcome: A concise count of the matches omitted by the two-result limit.
- Pass/fail: PASS if the lookup metadata is correct and the response gives the exact `totalCandidates - 2` count in a sentence that calls those matches omitted; FAIL if either check fails or that number is missing or incorrect.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Search the trigger index for spec folder validation strict but only show me the top 2. How many matches did you leave out?`

### Conversation Script

```json conversation
{
  "runtimes": ["devin"],
  "setup": [
    "cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled && if [ -d \"$CONVERSATION_REPO_ROOT/.devin\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.devin\" .devin; fi"
  ],
  "turns": [
    {
      "id": "trigger-lookup-total-candidates",
      "send": "Search the trigger index for spec folder validation strict but only show me the top 2. How many matches did you leave out?",
      "questions": [
        {
          "match": "documentation",
          "answer": { "reply": "D" },
          "optional": true
        }
      ],
      "check": "result=\"$(node \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs\" --json --limit 2 -- \"spec folder validation strict\")\" && counts=\"$(printf '%s' \"$result\" | node -e 'let input=\"\";process.stdin.setEncoding(\"utf8\");process.stdin.on(\"data\",chunk=>input+=chunk);process.stdin.on(\"end\",()=>{const answer=JSON.parse(input);if(!(answer.totalCandidates>2&&answer.truncated===true&&answer.results.length===2))process.exit(1);const omitted=answer.totalCandidates-2;process.stdout.write(`${omitted}|${omitted.toLocaleString(\"en-US\")}`);});')\" && omitted=\"${counts%%|*}\" && formatted=\"${counts#*|}\" && awk -v send='Search the trigger index for spec folder validation strict' 'index($0,send){after=1;next}after{print}' \"$CONVERSATION_TURN_DIR/screen.txt\" | grep -iE \"left out|omitted|not shown|hidden|excluded|more|remaining|skipped\" | grep -E \"(^|[^0-9])(${omitted}|${formatted})([^0-9]|$)\""
    }
  ]
}
```

### Commands

1. Run from the repository root with scratch and evidence directories outside the repository:

   ```bash
   scratch="$(mktemp -d "${TMPDIR:-/tmp}/trigger-lookup-total-candidates-scratch.XXXXXX")"
   evidence="$(mktemp -d "${TMPDIR:-/tmp}/trigger-lookup-total-candidates-evidence.XXXXXX")"
   node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/trigger-lookup-total-candidates.md --runtime devin --scratch "$scratch" --out "$evidence"
   ```

### Expected

The lookup JSON reports more than two candidates, `truncated: true`, and exactly two results. The screen after the echoed request includes the exact `totalCandidates - 2` count in a sentence that calls those matches omitted.

### Evidence

Capture the runtime's `screen.txt` and the check output and exit code. The screen evidence must show the exact omitted count in a sentence that calls those matches omitted, after the echoed request.

### Pass / Fail

- **Pass**: The lookup JSON confirms `totalCandidates > 2`, `truncated: true` and two results, and the response states the exact `totalCandidates - 2` count in a sentence that calls those matches omitted.
- **Fail**: The lookup metadata is missing or incorrect, or the response does not state the exact `totalCandidates - 2` count in a sentence that calls those matches omitted.

### Failure Triage

Confirm the command reads the repository's trigger index and uses the exact query and limit from the scenario. Check that the `screen.txt` search starts after the echoed request and that one reply sentence pairs the exact `totalCandidates - 2` count with wording that calls those matches omitted.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario registration |
| `../../feature-catalog/retrieval/trigger-lookup-total-candidates.md` | Matching current-state feature reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Trigger-index lookup and candidate-count output |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | Lookup ranking, scoring-only filtering and hit/no-hit CLI regression coverage |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Retrieval lane coverage and exclusion policy |

Provenance: manual only - an operator runs the trigger lookup and checks the omitted count in the response

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 489
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `retrieval/trigger-lookup-total-candidates.md`
