---
title: "491 -- Ripgrep one row per file"
description: "This scenario validates ripgrep per-file result shaping for `491`. It focuses on keeping the best row from each file visible and reporting repeated matches."
version: 1.0.1.0
---

# 491 -- Ripgrep one row per file

This document captures the realistic conversation contract, current behavior, execution flow, source anchors and metadata for `491`.

---

## 1. OVERVIEW

This scenario validates ripgrep per-file result shaping for `491`. It focuses on keeping the best row from each file visible and reporting repeated matches.

### Why This Matters

A broad search can produce many matches in one file and bury other matching files. This scenario confirms that structured search returns one row per file, counts the additional matches and gives the assistant enough evidence to name multiple files.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `491` and confirm the expected signals without contradictory evidence.

- Objective: Verify structured ripgrep search keeps one highest-ranked row per matching file, reports additional matches and lets the assistant name separate files.
- Real user request: `Search the notes/lantern folder for lantern and tell me which files mention it. Don't just show me one file over and over.`
- Prompt: `Search the notes/lantern folder for lantern and tell me which files mention it. Don't just show me one file over and over.`
- Expected execution process: Run the conversation in a scratch git work tree with the repository skills and Devin configuration copied into it. Seed notes/lantern/vk2-ledger.md with 25 `lantern` matches and notes/lantern/qm7-a.md, qm7-b.md and qm7-c.md with one match each. Inspect the structured JSON and the reply after the echoed request.
- Expected signals: The JSON record has `schemaVersion: 3`, four results, `matchCount: 28` and `moreInFile: 24` on the `vk2-ledger.md` row. The reply after the echoed request names `vk2-ledger.md` and at least two of `qm7-a.md`, `qm7-b.md` and `qm7-c.md`.
- Desired user-visible outcome: The assistant identifies the repeated-match file once and names multiple other matching files.
- Pass/fail: PASS if the JSON values and the post-request file names are present; FAIL if the structured result or reply hides the repeated-match count or keeps showing only one file.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Search the notes/lantern folder for lantern and tell me which files mention it. Don't just show me one file over and over.`

### Conversation Script

```json conversation
{
  "runtimes": ["devin"],
  "setup": [
    "cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled && if [ -d \"$CONVERSATION_REPO_ROOT/.devin\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.devin\" .devin; fi",
    "git init -q && mkdir -p notes/lantern && for i in $(seq 1 25); do echo \"lantern entry $i\" >> notes/lantern/vk2-ledger.md; done && echo \"lantern once\" > notes/lantern/qm7-a.md && echo \"lantern once\" > notes/lantern/qm7-b.md && echo \"lantern once\" > notes/lantern/qm7-c.md"
  ],
  "turns": [
    {
      "id": "rg-flood-control",
      "send": "Search the notes/lantern folder for lantern and tell me which files mention it. Don't just show me one file over and over.",
      "questions": [
        {
          "match": "documentation",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "result=\"$(node .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs structured lantern --search-root notes/lantern --json)\" && printf '%s' \"$result\" | node -e 'let input = \"\"; process.stdin.setEncoding(\"utf8\"); process.stdin.on(\"data\", chunk => input += chunk); process.stdin.on(\"end\", () => { const record = JSON.parse(input); const ledger = record.results.find(({ path }) => path.endsWith(\"vk2-ledger.md\")); if (!(record.schemaVersion === 3 && record.results.length === 4 && ledger?.moreInFile === 24 && record.matchCount === 28)) process.exit(1); });' && reply=\"$(awk -v send='Search the notes/lantern folder for lantern' 'index($0,send){after=1;next}after{print}' \"$CONVERSATION_TURN_DIR/history.txt\" | grep -v -e '✓' -e '✗')\" && printf '%s\\n' \"$reply\" | grep -F 'vk2-ledger.md' && printf '%s\\n' \"$reply\" | node -e 'let input = \"\"; process.stdin.setEncoding(\"utf8\"); process.stdin.on(\"data\", chunk => input += chunk); process.stdin.on(\"end\", () => { const files = [\"qm7-a.md\", \"qm7-b.md\", \"qm7-c.md\"]; if (files.filter(file => input.includes(file)).length < 2) process.exit(1); });'"
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
   scratch="$(mktemp -d /tmp/rg-flood-control-scratch.XXXXXX)"
   evidence="$(mktemp -d /tmp/rg-flood-control-evidence.XXXXXX)"
   node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/rg-flood-control.md --runtime devin --scratch "$scratch" --out "$evidence"
   ```

### Expected

The structured result has four rows, reports 28 matches and shows 24 additional matches for `vk2-ledger.md`. The reply after the echoed request names that file and at least two of the three `qm7-*.md` files.

### Evidence

Capture Devin's `screen.txt`, `history.txt`, the structured check output and its exit code. The scrollback check must start after the echoed request and find the repeated-match file plus at least two separate `qm7-*.md` names.

### Pass / Fail

- **Pass**: The JSON assertion confirms schema version 3, four results, 28 total matches and 24 additional matches for `vk2-ledger.md`; the post-request reply names that file and at least two `qm7-*.md` files.
- **Fail**: Any JSON assertion fails, or the reply after the echoed request omits `vk2-ledger.md` or names fewer than two `qm7-*.md` files.

### Failure Triage

Confirm setup copied `.skilled` and `.devin`, seeded 25 matching lines in `vk2-ledger.md` and one in each `qm7-*.md` file, and that the wrapper searches `notes/lantern`. Check that the JSON assertion reads `schemaVersion`, `results`, `moreInFile` and `matchCount`, and that the `history.txt` search begins after the echoed request.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario registration |
| `../../feature-catalog/retrieval/rg-flood-control.md` | Matching current-state feature reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` | Structured search, limit handling and JSON and human summaries |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs` | Match ranking and per-file result shaping |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts` | Per-file shaping, result limits, JSON totals and human formatting coverage |

Provenance: manual only - an operator runs the structured search and confirms the file list in the reply

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 491
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `retrieval/rg-flood-control.md`
