---
title: "039 -- Verify-fix-verify memory quality loop (PI-A5)"
description: "This scenario validates Verify-fix-verify memory quality loop (PI-A5) for `039`. It focuses on Confirm retry then reject path."
audited_post_018: true
version: 3.6.0.17
id: memory-quality-and-indexing-verify-fix-verify-memory-quality-loop-pi-a5
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 039 -- Verify-fix-verify memory quality loop (PI-A5)

## 1. OVERVIEW

This scenario validates Verify-fix-verify memory quality loop (PI-A5) for `039`. It focuses on Confirm retry then reject path.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm retry then reject path.
- Real user request: `Please validate Verify-fix-verify memory quality loop (PI-A5) against the documented validation surface and tell me whether the expected signals are present: Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged.`
- Prompt: `Validate the verify-fix-verify memory quality loop.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Quality loop retries up to max attempts then rejects with reason; FAIL: No retry attempted or infinite retry loop

---

## 3. TEST EXECUTION

### Prompt

```
Validate the verify-fix-verify memory quality loop.
```

### Commands

1. Submit low-quality memory
2. Observe retries
3. Confirm final reject

### Expected

Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged

### Evidence

Command run:

```bash
node --input-type=module -e 'import fs from "node:fs"; import { stripTypeScriptTypes } from "node:module"; const sourcePath=".opencode/skills/system-spec-kit/mcp-server/handlers/quality-loop.ts"; let source=fs.readFileSync(sourcePath,"utf8"); source=source.replace(/import \{ initEvalDb \} from '\''\.\.\/lib\/eval\/eval-db\.js'\'';\n/, "function initEvalDb() { throw new Error(\"eval db unavailable in manual in-memory run\"); }\n"); source=source.replace(/import \{ isQualityAutoFixEnabled, isQualityLoopEnabled \} from '\''\.\.\/lib\/search\/search-flags\.js'\'';\n/, "function isQualityAutoFixEnabled() { return true; }\nfunction isQualityLoopEnabled() { return true; }\n"); source += `\nconst input = { content: "no headings no anchors no structure", metadata: { triggerPhrases: [] }, options: { threshold: 0.6, maxRetries: 2, mode: "full-auto", emitEvalMetrics: false } };\nconst result = runQualityLoop(input.content, input.metadata, input.options);\nconsole.log(JSON.stringify({ input, result }, null, 2));\n`; const js=stripTypeScriptTypes(source,{mode:"strip"}); const url="data:text/javascript;base64,"+Buffer.from(js).toString("base64"); await import(url);'
```

Observed output:

```text
{
  "input": {
    "content": "no headings no anchors no structure",
    "metadata": {
      "triggerPhrases": []
    },
    "options": {
      "threshold": 0.6,
      "maxRetries": 2,
      "mode": "full-auto",
      "emitEvalMetrics": false
    }
  },
  "result": {
    "passed": false,
    "score": {
      "total": 0.413,
      "breakdown": {
        "triggers": 0,
        "anchors": 0.5,
        "budget": 1,
        "coherence": 0.25
      },
      "issues": [
        "No trigger phrases found",
        "Content is very short (<50 chars)",
        "No section headings found",
        "Content lacks substance (<200 chars)"
      ]
    },
    "attempts": 2,
    "fixes": [],
    "rejected": true,
    "rejectionReason": "Quality score 0.413 below threshold 0.6 after 1 auto-fix attempt(s). Issues: No trigger phrases found; Content is very short (<50 chars); No section headings found; Content lacks substance (<200 chars)"
  }
}
(node:79107) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

Additional production MCP dry-run observations before the direct in-memory quality-loop run:

```text
Error: Governed ingest rejected: tenantId is required for governed ingest; sessionId is required for governed ingest; userId or agentId is required for governed ingest; provenanceSource is required for governed ingest; provenanceActor is required for governed ingest
```

```text
qualityLoop: {
  passed: true,
  rejected: false,
  fixes: []
}
```

### Pass / Fail

- **FAIL**: Low-quality content retried once and rejected with a reason, but the observed rejection reason said `after 1 auto-fix attempt(s)` while the submitted options used `maxRetries: 2`, so the scenario's expected `final reject after max retries` signal did not hold.

### Failure Triage

Verify quality check criteria → Check max retry configuration → Inspect rejection reason generation

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [memory-quality-and-indexing/verify-fix-verify-memory-quality-loop.md](../../feature-catalog/memory-quality-and-indexing/verify-fix-verify-memory-quality-loop.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 039
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory-quality-and-indexing/verify-fix-verify-memory-quality-loop-pi-a5.md`
