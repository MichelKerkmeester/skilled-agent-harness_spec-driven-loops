---
title: "AI-003 Provenance Fingerprints and Trust Lanes"
description: "Manual validation that derived entries carry provenance fingerprints and are tagged with the correct trust lane (author, frontmatter, body, examples, local_docs, derived_local)."
trigger_phrases:
  - "ai-003"
  - "provenance fingerprint"
  - "trust lanes"
  - "derived provenance"
version: 0.8.1.0
id: AI-003
category: auto_indexing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# AI-003 Provenance Fingerprints and Trust Lanes

Prompt: Manual validation that derived entries carry provenance fingerprints and are tagged with the correct trust lane (author, frontmatter, body, examples, local_docs, derived_local).


---

## 1. OVERVIEW

Validate that `lib/derived/provenance.ts` writes provenance fingerprints for each derived entry and that `lib/derived/trust-lanes.ts` assigns the correct lane among `author`, `frontmatter`, `body`, `examples`, `local_docs` and `derived_local`.

---

## 2. SCENARIO CONTRACT

- Disposable workspace copy or read-only inspection against the live repo.
- Advisor runtime built. Daemon reachable.
- A target skill with content spanning multiple lane sources (frontmatter, body, a fenced example and a local references/ or assets/ doc).

---

## 3. TEST EXECUTION

### Commands

1. Read the target skill's `graph-metadata.json.derived` block for the current state.
2. Identify the derived lane sources present in the target (frontmatter terms, fenced examples, local docs, body n-grams).
3. Confirm the derived block carries the block-level `provenance_fingerprint` and `trust_lane` fields (provenance is tracked per derived block, not per entry).
4. Touch the target skill to force a reindex:

```bash
touch .skilled/skills/sk-doc/SKILL.md
```

5. Re-read `graph-metadata.json.derived` and verify fingerprints are stable for unchanged sources and changed for mutated sources.

### Expected

- The derived block carries block-level `provenance_fingerprint` and `trust_lane` fields. The shipped schema does not define per-entry provenance or lane fields.
- The trust lane matches the block's source tier. Author-tier frontmatter signals resolve to the author lane. Harvested content resolves to the derived lane.
- Fingerprints are stable across reindex for unchanged content and change only when the underlying source bytes change.
- Author-tier tokens (intent_signals in frontmatter) resolve to the `author` lane.

### Evidence

- Capture each command's output and exit status.
- Record the block-level `provenance_fingerprint` and `trust_lane`, source-tier lane assignments, fingerprints for unchanged and changed source bytes, and the lane for author-tier `intent_signals`.

For the derived-field values, capture this inspection output and exit status:

```bash
jq '.derived | {provenance_fingerprint, trust_lane, intent_signals, source_docs}' '.skilled/skills/sk-doc/graph-metadata.json'
```

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Missing provenance | Derived entry lacks fingerprint | Inspect `lib/derived/provenance.ts` write path. |
| Wrong lane tag | Body token shows `author` or vice versa | Audit `trust-lanes.ts` classification rules. |
| Unstable fingerprints | Fingerprint changes without source change | Verify sort order and fingerprint input normalization. |

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [AI-001](../../manual-testing-playbook/auto-indexing/derived-extraction.md), deterministic extraction.
- Scenario [SC-004](../../manual-testing-playbook/scorer-fusion/lane-attribution.md), lane attribution on the read side.
- Feature [`auto-indexing/provenance-and-trust-lanes.md`](../../feature-catalog/auto-indexing/provenance-and-trust-lanes.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/lib/derived/provenance.ts` and `lib/derived/trust-lanes.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-003
- Canonical root source: manual-testing-playbook.md
- Feature file path: auto-indexing/provenance-and-trust-lanes.md
