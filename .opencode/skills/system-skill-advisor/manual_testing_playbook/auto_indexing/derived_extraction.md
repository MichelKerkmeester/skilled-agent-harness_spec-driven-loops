---
title: "AI-001 Deterministic Derived Extraction"
description: "Manual validation that derived/extract.ts produces deterministic n-gram and pattern extractions from SKILL.md frontmatter, body, examples, references, assets, intent_signals, source_docs and key_files."
trigger_phrases:
  - "ai-001"
  - "derived extraction"
  - "deterministic n-gram"
  - "graph-metadata derived"
version: 0.8.0.14
id: AI-001
category: auto_indexing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# AI-001 Deterministic Derived Extraction

Prompt: Manual validation that derived/extract.ts produces deterministic n-gram and pattern extractions from SKILL.md frontmatter, body, examples, references, assets, intent_signals, source_docs and key_files.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that derived extraction in `lib/derived/extract.ts` produces deterministic, stable output from SKILL.md frontmatter, body, fenced examples, `references/**`, `assets/**`, `intent_signals`, `source_docs` and declared `key_files` and that `lib/derived/sync.ts` writes the result only to `graph-metadata.json.derived` without mutating SKILL.md.

---

## 2. SCENARIO CONTRACT

- Disposable workspace copy.
- MCP server built.
- A target skill with a SKILL.md plus `references/` and `assets/` content (for example `sk-doc`).
- `diff` available.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Capture pre-state of the target skill:

```bash
cp .opencode/skills/sk-doc/graph-metadata.json /tmp/pre-derived.json
cp .opencode/skills/sk-doc/SKILL.md /tmp/pre-skill.md
```

2. Touch the target skill to force reindex:

```bash
touch .opencode/skills/sk-doc/SKILL.md
```

3. Wait for debounce + reindex.
4. Recompute with a repeat touch and capture again:

```bash
touch .opencode/skills/sk-doc/SKILL.md
cp .opencode/skills/sk-doc/graph-metadata.json /tmp/post-derived.json
```

5. Diff `graph-metadata.json` pre vs post and compare `SKILL.md` pre vs post.

### Expected Signals

- `graph-metadata.json.derived` section is populated with n-grams, patterns and provenance fingerprints.
- Two consecutive touches produce identical derived output for unchanged source content (deterministic).
- `SKILL.md` is byte-identical pre vs post (never mutated by derived extraction).
- Extracted tokens are scoped to the configured inputs: frontmatter, body, examples, `references/**`, `assets/**`, `intent_signals`, `source_docs` and `derived.key_files`.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Non-deterministic output | Diff shows shuffled arrays or timestamps | Inspect `extract.ts` sort order and provenance fingerprints. |
| SKILL.md mutated | `SKILL.md` byte diff non-empty | Block release. Derived writes must never touch SKILL.md. |
| Unexpected inputs scraped | Tokens include paths outside allowed inputs | Audit `extract.ts` input enumeration. |

---

## 4. SOURCE FILES

- Scenario [AI-002](../auto_indexing/sanitizer_boundaries.md), A7 sanitizer boundary enforcement.
- Scenario [AI-003](../auto_indexing/provenance_and_trust_lanes.md), provenance and trust lane tagging.
- Feature [`auto-indexing/derived-extraction.md`](../../feature_catalog/auto_indexing/derived_extraction.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/derived/extract.ts` and `lib/derived/sync.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: auto-indexing/derived-extraction.md
