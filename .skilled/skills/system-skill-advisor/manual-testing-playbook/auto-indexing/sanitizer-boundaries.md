---
title: "AI-002 A7 Sanitizer at Every Write Boundary"
description: "Manual validation that the A7 sanitizer in lib/derived/sanitizer.ts runs at every write boundary (SQLite, graph-metadata derived, envelope, diagnostics) and rejects unsafe labels."
trigger_phrases:
  - "ai-002"
  - "a7 sanitizer"
  - "sanitizeSkillLabel"
  - "write boundary sanitization"
version: 0.8.1.0
id: AI-002
category: auto_indexing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# AI-002 A7 Sanitizer at Every Write Boundary

Prompt: Manual validation that the A7 sanitizer in lib/derived/sanitizer.ts runs at every write boundary (SQLite, graph-metadata derived, envelope, diagnostics) and rejects unsafe labels.


---

## 1. OVERVIEW

Validate that `lib/derived/sanitizer.ts` is invoked at every public write boundary: SQLite persistence, `graph-metadata.json.derived` writes, response envelopes emitted by `handlers/advisor-recommend.ts` and diagnostic records written by adapters.

---

## 2. SCENARIO CONTRACT

- Repo root working directory.
- Advisor runtime built.
- Disposable copy if introducing a synthetic malformed skill label is needed.
- Privacy-review mindset. Prompt text must never appear in envelope or diagnostic fields.

---

## 3. TEST EXECUTION

### Commands

1. Call `advisor_recommend` with a benign prompt that should match an active skill:

```text
node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options '{"topK":2,"includeAttribution":true}' --format json
```

2. Inspect `laneBreakdown`, `trustState`, `cache` and `warnings` for any non-slug skill labels.
3. In a disposable copy, inject a fixture skill whose name contains control characters or unsafe path segments, touch to reindex, then repeat step 1.
4. Call `advisor_status` and verify `skillCount` is either unchanged (rejected) or the label appears sanitized.
5. Read the `graph-metadata.json.derived` block for the injected fixture and confirm all string fields are sanitized.

### Expected

- Every skill label surfaced through public boundaries conforms to the slug shape `[a-z0-9][a-z0-9-]*`.
- Control characters, path separators and prompt fragments never appear in envelope or diagnostic output.
- Malformed labels are either rejected (skill excluded) or normalized.
- Derived entries written to `graph-metadata.json` use the sanitized label only.

### Evidence

- Capture each command's output and exit status.
- Record labels and prompt fragments across public envelopes and diagnostics, malformed-label rejection or normalization, and sanitized strings in the derived block.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Control chars in envelope | `laneBreakdown` or `warnings` contains non-printable bytes | Block release. Treat as a privacy failure. |
| Unsanitized label in DB | SQLite row contains raw input | Audit `sanitizer.ts` invocation at persistence layer. |
| Sanitizer silently skips | Label passes through unchanged despite control chars | Add regression case and inspect sanitizer input path. |

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [AI-001](../../manual-testing-playbook/auto-indexing/derived-extraction.md), derived extraction correctness.
- Scenario [AI-005](../../manual-testing-playbook/auto-indexing/anti-stuffing.md), repetition-density and adversarial rejection.
- Feature [`auto-indexing/sanitizer.md`](../../feature-catalog/auto-indexing/sanitizer.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/lib/derived/sanitizer.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-002
- Canonical root source: manual-testing-playbook.md
- Feature file path: auto-indexing/sanitizer-boundaries.md
