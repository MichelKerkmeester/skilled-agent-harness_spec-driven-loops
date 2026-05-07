---
title: "AI-003 Provenance Fingerprints and Trust Lanes"
description: "Manual validation that derived entries carry provenance fingerprints and are tagged with the correct trust lane (author, frontmatter, body, examples, local_docs, derived_local)."
trigger_phrases:
  - "ai-003"
  - "provenance fingerprint"
  - "trust lanes"
  - "derived provenance"
---
# AI-003 Provenance Fingerprints and Trust Lanes

---

## 1. OVERVIEW

Validate that `lib/derived/provenance.ts` writes provenance fingerprints for each derived entry and that `lib/derived/trust-lanes.ts` assigns the correct lane among `author`, `frontmatter`, `body`, `examples`, `local_docs`, and `derived_local`.

---

## 2. SCENARIO CONTRACT

- Disposable workspace copy or read-only inspection against the live repo.
- MCP server built; daemon reachable.
- A target skill with content spanning multiple lane sources (frontmatter, body, a fenced example, and a local references/ or assets/ doc).

---

## 3. TEST EXECUTION

1. Read the target skill's `graph-metadata.json.derived` block for the current state.
2. Identify at least one derived entry per lane source present in the target.
3. For each entry, confirm the presence of a provenance fingerprint (hash or stable ID) and a `lane` field.
4. Touch the target skill to force a reindex:

```bash
touch .opencode/skills/sk-doc/SKILL.md
```

5. Re-read `graph-metadata.json.derived` and verify fingerprints are stable for unchanged sources and changed for mutated sources.

### Expected Signals

- Every derived entry has both `provenance` and `lane` fields.
- Lane assignment matches the source of the extracted token (frontmatter terms → `frontmatter`, fenced code → `examples`, references/assets docs → `local_docs`, n-grams from SKILL.md body → `body` or `derived_local`).
- Fingerprints are stable across reindex for unchanged content and change only when the underlying source bytes change.
- Author-tier tokens (intent_signals in frontmatter) resolve to the `author` lane.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Missing provenance | Derived entry lacks fingerprint | Inspect `lib/derived/provenance.ts` write path. |
| Wrong lane tag | Body token shows `author` or vice versa | Audit `trust-lanes.ts` classification rules. |
| Unstable fingerprints | Fingerprint changes without source change | Verify sort order and fingerprint input normalization. |

---

## 4. SOURCE FILES

- Scenario [AI-001](./001-derived-extraction.md) — deterministic extraction.
- Scenario [SC-004](../08--scorer-fusion/004-lane-attribution.md) — lane attribution on the read side.
- Feature [`02--auto-indexing/03-provenance-and-trust-lanes.md`](../../feature_catalog/02--auto-indexing/03-provenance-and-trust-lanes.md).
- Source: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/derived/provenance.ts` and `lib/derived/trust-lanes.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-003
- Canonical root source: manual_testing_playbook.md
- Feature file path: 06--auto-indexing/003-provenance-and-trust-lanes.md
