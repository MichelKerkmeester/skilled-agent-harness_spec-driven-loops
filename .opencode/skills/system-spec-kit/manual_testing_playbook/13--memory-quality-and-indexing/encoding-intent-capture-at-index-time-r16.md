---
title: "047 -- Encoding-intent capture at index time (R16)"
description: "This scenario validates Encoding-intent capture at index time (R16) for `047`. It focuses on Confirm persisted intent labels."
audited_post_018: true
version: 3.6.0.17
---

# 047 -- Encoding-intent capture at index time (R16)

## 1. OVERVIEW

This scenario validates Encoding-intent capture at index time (R16) for `047`. It focuses on Confirm persisted intent labels.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm persisted intent labels.
- Real user request: `Please validate Encoding-intent capture at index time (R16) against the documented validation surface and tell me whether the expected signals are present: Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels.`
- Prompt: `Validate encoding-intent capture at index time.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Correct intent label assigned per content type; labels immutable after save; FAIL: Wrong label or label modified post-save

---

## 3. TEST EXECUTION

### Prompt

```
Validate encoding-intent capture at index time.
```

### Commands

1. Save doc/code/structured examples
2. inspect metadata
3. verify read-only intent field

### Expected

Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels

### Evidence

Command: `npx vitest run tests/encoding-intent.vitest.ts` from `.opencode/skills/system-spec-kit/mcp_server`

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:28393) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  12:55:51
   Duration  770ms (transform 395ms, setup 23ms, import 22ms, tests 622ms, environment 0ms)
```

Command: inline Node metadata probe from `.opencode/skills/system-spec-kit/mcp_server` using `dist/lib/search/encoding-intent.js` and `dist/lib/search/vector-index.js`; the probe saved document/code/structured examples with `indexMemoryDeferred`, inspected `memory_index.encoding_intent`, then re-saved the same code file path with `encodingIntent: "document"`.

```json
{
  "tempDbPath": "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r16-playbook-ItwAi9/context-index.sqlite",
  "saved": [
    {
      "kind": "document",
      "id": 1,
      "filePath": "document.md",
      "classifiedIntent": "document"
    },
    {
      "kind": "code",
      "id": 2,
      "filePath": "code.md",
      "classifiedIntent": "code"
    },
    {
      "kind": "structured_data",
      "id": 3,
      "filePath": "structured.md",
      "classifiedIntent": "structured_data"
    }
  ],
  "initialRows": [
    {
      "id": 1,
      "title": "document",
      "encoding_intent": "document",
      "embedding_status": "pending",
      "content_text": "# Decision note\n\nThe team chose a simple indexing approach after evaluating alternatives. The rationale is documented in prose."
    },
    {
      "id": 2,
      "title": "code",
      "encoding_intent": "code",
      "embedding_status": "pending",
      "content_text": "import { readFileSync } from \"node:fs\";\n\nexport function loadConfig(filePath) {\n  return readFileSync(filePath, \"utf8\");\n}\n\nconst config = loadConfig(\"config.json\");\nconsole.log(config);"
    },
    {
      "id": 3,
      "title": "structured_data",
      "encoding_intent": "structured_data",
      "embedding_status": "pending",
      "content_text": "| key | value |\n| --- | ----- |\n| status | active |\n| priority | high |\n| owner | memory |"
    }
  ],
  "readOnlyProbe": {
    "method": "indexMemoryDeferred same spec_folder + file_path with encodingIntent=document",
    "codeBefore": {
      "id": 2,
      "encoding_intent": "code"
    },
    "updateId": 2,
    "codeAfter": {
      "id": 2,
      "title": "code-update-attempt",
      "encoding_intent": "document",
      "content_text": "This prose update attempts to change a previously saved code row to document."
    }
  },
  "schemaEncodingColumn": "encoding_intent TEXT DEFAULT 'document'"
}
```

### Pass / Fail

- **FAIL**: Correct intent labels were assigned and persisted for document/code/structured examples, but the read-only expectation failed because the normal `indexMemoryDeferred` same-path update changed row `id: 2` from `encoding_intent: "code"` to `encoding_intent: "document"`.

### Failure Triage

Verify intent classification rules → Check metadata persistence → Inspect read-only enforcement

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/encoding-intent-capture-at-index-time.md](../../feature_catalog/13--memory-quality-and-indexing/encoding-intent-capture-at-index-time.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 047
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/encoding-intent-capture-at-index-time-r16.md`
