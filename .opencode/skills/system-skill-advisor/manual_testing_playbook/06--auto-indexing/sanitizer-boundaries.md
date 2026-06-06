---
title: "AI-002 A7 Sanitizer at Every Write Boundary"
description: "Manual validation that the A7 sanitizer in lib/derived/sanitizer.ts runs at every write boundary (SQLite, graph-metadata derived, envelope, diagnostics) and rejects unsafe labels."
trigger_phrases:
  - "ai-002"
  - "a7 sanitizer"
  - "sanitizeSkillLabel"
  - "write boundary sanitization"
---

# AI-002 A7 Sanitizer at Every Write Boundary

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/derived/sanitizer.ts` is invoked at every public write boundary: SQLite persistence, `graph-metadata.json.derived` writes, response envelopes emitted by `handlers/advisor-recommend.ts` and diagnostic records written by adapters.

---

## 2. SCENARIO CONTRACT

- Repo root working directory.
- MCP server built.
- Disposable copy if introducing a synthetic malformed skill label is needed.
- Privacy-review mindset. Prompt text must never appear in envelope or diagnostic fields.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Call `advisor_recommend` with a benign prompt that should match an active skill:

```text
advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":2,"includeAttribution":true}})
```

2. Inspect `laneBreakdown`, `trustState`, `cache` and `warnings` for any non-slug skill labels.
3. In a disposable copy, inject a fixture skill whose name contains control characters or unsafe path segments, touch to reindex, then repeat step 1.
4. Call `advisor_status` and verify `skillCount` is either unchanged (rejected) or the label appears sanitized.
5. Read the `graph-metadata.json.derived` block for the injected fixture and confirm all string fields are sanitized.

### Expected Signals

- Every skill label surfaced through public boundaries conforms to the slug shape `[a-z0-9][a-z0-9-]*`.
- Control characters, path separators and prompt fragments never appear in envelope or diagnostic output.
- Malformed labels are either rejected (skill excluded) or normalized.
- Derived entries written to `graph-metadata.json` use the sanitized label only.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Control chars in envelope | `laneBreakdown` or `warnings` contains non-printable bytes | Block release. Treat as a privacy failure. |
| Unsanitized label in DB | SQLite row contains raw input | Audit `sanitizer.ts` invocation at persistence layer. |
| Sanitizer silently skips | Label passes through unchanged despite control chars | Add regression case and inspect sanitizer input path. |

---

## 4. SOURCE FILES

- Scenario [AI-001](./derived-extraction.md), derived extraction correctness.
- Scenario [AI-005](./anti-stuffing.md), repetition-density and adversarial rejection.
- Feature [`02--auto-indexing/sanitizer.md`](../../feature_catalog/02--auto-indexing/sanitizer.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/derived/sanitizer.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-002
- Canonical root source: manual_testing_playbook.md
- Feature file path: 06--auto-indexing/sanitizer-boundaries.md
