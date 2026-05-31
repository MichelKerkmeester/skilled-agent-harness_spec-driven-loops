---
title: "AI-004 DF/IDF Corpus Stats Active-Only"
description: "Manual validation that DF/IDF corpus statistics in lib/corpus/df-idf.ts are computed only over the active corpus, are debounced and exclude archived or future skills."
trigger_phrases:
  - "ai-004"
  - "df-idf corpus"
  - "active corpus stats"
  - "idf debounce"
---

# AI-004 DF/IDF Corpus Stats Active-Only

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/corpus/df-idf.ts` computes document-frequency and inverse-document-frequency statistics only over the active corpus and that updates are debounced so repeated writes do not trigger redundant recomputes.

---

## 2. SCENARIO CONTRACT

- Disposable copy or read-only inspection.
- MCP server built. Daemon reachable.
- Workspace contains at least one `z_archive/` or `z_future/` skill in addition to active skills.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Capture current corpus statistics via the advisor internals exposed through `advisor_status` or, if unavailable, read the persisted IDF table from SQLite.
2. Touch three active skills in quick succession (within the debounce window):

```bash
touch .opencode/skills/sk-git/SKILL.md
touch .opencode/skills/sk-doc/SKILL.md
touch .opencode/skills/system-spec-kit/SKILL.md
```

3. Wait for debounce to elapse and capture statistics again.
4. Touch an archived skill (if present under `z_archive/`) and repeat.

### Expected Signals

- Step 3 captures a single recomputation after the debounce window, not one per touch.
- IDF document count equals the active skill count (excludes `z_archive/` and `z_future/`).
- Archived or future skill touches do not alter active IDF.
- Recomputed IDF differs only where active content changed.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Redundant recomputes | Multiple IDF updates within debounce | Inspect debounce timer in `lib/corpus/df-idf.ts`. |
| Archived skills in IDF | Document count exceeds active skill count | Audit corpus filter against `z_archive/` and `z_future/`. |
| Stale IDF after active change | Statistics unchanged after active touch | Confirm write path and debounce flush. |

---

## 4. SOURCE FILES

- Scenario [LC-003](../07--lifecycle-routing/003-archive-handling.md), archive indexing but not routing.
- Scenario [SC-002](../08--scorer-fusion/002-projection.md), projection input for scorer.
- Feature [`02--auto-indexing/013-df-idf-corpus.md`](../../feature_catalog/02--auto-indexing/013-df-idf-corpus.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/corpus/df-idf.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-004
- Canonical root source: manual_testing_playbook.md
- Feature file path: 06--auto-indexing/004-corpus-df-idf.md
