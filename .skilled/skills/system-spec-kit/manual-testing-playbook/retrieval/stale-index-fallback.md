---
title: "490 -- Stale trigger index fallback"
description: "This scenario validates stale trigger index fallback for `490`. It focuses on finding a packet before the trigger index is rebuilt."
version: 1.0.0.0
---

# 490 -- Stale trigger index fallback

This document captures the realistic conversation contract, current behavior, execution flow, source anchors and metadata for `490`.

---

## 1. OVERVIEW

This scenario validates stale trigger index fallback for `490`. It focuses on locating a newly written packet before the committed trigger index is rebuilt.

### Why This Matters

A packet written after the last index build can be hard to find through trigger lookup. This scenario confirms that the lookup can find it through declared trigger phrases before the index is rebuilt.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `490` and confirm the expected signals without contradictory evidence.

- Objective: Verify trigger lookup finds a new spec packet through the stale-index fallback and that disabling fallback returns no scored candidate.
- Real user request: `I just wrote a new spec folder and the index hasn't been rebuilt. Can you find the packet about quartz lantern ledger for me?`
- Prompt: `I just wrote a new spec folder and the index hasn't been rebuilt. Can you find the packet about quartz lantern ledger for me?`
- Expected execution process: Run the conversation in a scratch git work tree with the repository skills and Devin configuration copied into it, plus one seeded packet, `specs/demo/001-zr7-ledger/spec.md`, that declares `quartz lantern ledger` and that the copied index does not list. Inspect the lookup JSON, the index-only negative control and the reply after the echoed request.
- Expected signals: The lookup JSON reports `staleFallback.matches >= 1` and returns `specs/demo/001-zr7-ledger/spec.md`. The same query with `--no-stale-fallback` exits 1. The response names the target packet after the echoed request.
- Desired user-visible outcome: The assistant finds and names the seeded packet before any index rebuild.
- Pass/fail: PASS if all three expected signals are present; FAIL if the lookup JSON, index-only exit status or user-facing packet name is missing or incorrect.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I just wrote a new spec folder and the index hasn't been rebuilt. Can you find the packet about quartz lantern ledger for me?`

### Conversation Script

```json conversation
{
  "runtimes": [
    "devin"
  ],
  "setup": [
    "cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled && if [ -d \"$CONVERSATION_REPO_ROOT/.devin\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.devin\" .devin; fi",
    "git init -q && mkdir -p specs/demo/001-zr7-ledger && printf '%s\\n' '---' 'title: \"Quartz lantern ledger\"' 'trigger_phrases:' '  - \"quartz lantern ledger\"' '---' '' '# Quartz lantern ledger' > specs/demo/001-zr7-ledger/spec.md"
  ],
  "turns": [
    {
      "id": "stale-index-fallback",
      "send": "I just wrote a new spec folder and the index hasn't been rebuilt. Can you find the packet about quartz lantern ledger for me?",
      "questions": [
        {
          "match": "documentation",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "result=\"$(node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- \"quartz lantern ledger\")\" && printf '%s' \"$result\" | node -e 'let input = \"\"; process.stdin.setEncoding(\"utf8\"); process.stdin.on(\"data\", chunk => input += chunk); process.stdin.on(\"end\", () => { const answer = JSON.parse(input); if (!(answer.staleFallback?.matches >= 1 && answer.results.some(({ path }) => path === \"specs/demo/001-zr7-ledger/spec.md\"))) process.exit(1); });' && if node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --no-stale-fallback -- \"quartz lantern ledger\" >/dev/null 2>&1; then exit 1; else status=$?; test \"$status\" -eq 1; fi && awk -v send='I just wrote a new spec folder and the index' 'index($0,send){after=1;next}after{print}' \"$CONVERSATION_TURN_DIR/history.txt\" | grep -F '001-zr7-ledger'"
    }
  ]
}
```

- The first `send` must match the contract prompt exactly.
- Use one block per scenario file.
- Replace every `{...}` placeholder and keep the schema from [conversation-scenarios.md](../../../sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md).

### Commands

1. Run from the repository root with scratch and evidence directories outside the repository:

   ```bash
   scratch="$(mktemp -d /tmp/stale-index-fallback-scratch.XXXXXX)"
   evidence="$(mktemp -d /tmp/stale-index-fallback-evidence.XXXXXX)"
   node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/stale-index-fallback.md --runtime devin --scratch "$scratch" --out "$evidence"
   ```

### Expected

The lookup JSON, run in the scratch work tree, reports at least one fallback match and returns `specs/demo/001-zr7-ledger/spec.md`. The index-only lookup exits 1. The reply after the echoed request names `001-zr7-ledger`.

### Evidence

Capture the Devin `screen.txt`, `history.txt` and the check output and exit code. The `history.txt` scrollback must show the packet name after the echoed request, because a long reply scrolls the request off the 50-row screen, and the check must confirm the fallback metadata and index-only exit status.

### Pass / Fail

- **Pass**: The lookup JSON reports at least one fallback match with the target packet path, the index-only lookup exits 1, and the reply names the target packet after the request.
- **Fail**: The lookup metadata or path is missing, the index-only command returns a status other than 1, or the reply does not name the target packet after the request.

### Failure Triage

Confirm setup ran `git init` and wrote the seeded packet, since the fallback reports itself unavailable outside a git work tree, and that the check uses the exact query from the scenario. Check that the JSON assertion reads `staleFallback.matches` and `results`, the index-only command captures exit 1 and the `history.txt` search starts after the echoed request.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario registration |
| `../../feature-catalog/retrieval/stale-index-fallback.md` | Matching current-state feature reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Trigger-index lookup and fallback reporting |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/unindexed-docs.mjs` | Unindexed packet scan and declared-trigger scoring |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/stale-fallback.vitest.ts` | Fallback matching and CLI behavior coverage |

Provenance: manual only - an operator runs trigger lookup and confirms the new packet appears in the reply

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 490
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `retrieval/stale-index-fallback.md`
