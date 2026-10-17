---
title: "AI-004 DF/IDF Corpus Stats Active-Only"
description: "Manual validation that DF/IDF corpus statistics in lib/df-idf.ts are computed only over the active corpus, are debounced and exclude archived or future skills."
trigger_phrases:
  - "ai-004"
  - "df-idf corpus"
  - "active corpus stats"
  - "idf debounce"
version: 0.8.2.0
id: AI-004
category: auto_indexing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# AI-004 DF/IDF Corpus Stats Active-Only

Prompt: Manual validation that DF/IDF corpus statistics in lib/df-idf.ts are computed only over the active corpus, are debounced and exclude archived or future skills.


---

## 1. OVERVIEW

Validate that `lib/df-idf.ts` computes document-frequency and inverse-document-frequency statistics only over the active corpus and that updates are debounced so repeated writes do not trigger redundant recomputes.

---

## 2. SCENARIO CONTRACT

- Disposable copy or read-only inspection.
- Advisor runtime built. Daemon reachable.
- Workspace contains at least one `z_archive/` or `z-future/` skill in addition to active skills.

---

## 3. TEST EXECUTION

### Commands

1. Capture current corpus statistics via the advisor internals exposed through `advisor_status` or, if unavailable, read the persisted IDF table from SQLite.
2. Touch three active skills in quick succession (within the debounce window):

```bash
touch .skilled/skills/sk-git/SKILL.md
touch .skilled/skills/sk-doc/SKILL.md
touch .skilled/skills/system-spec-kit/SKILL.md
```

3. Wait for debounce to elapse and capture statistics again.
4. Touch an archived skill (if present under `z_archive/`) and repeat.

### Expected

- Step 3 captures a single recomputation after the debounce window, not one per touch.
- IDF document count equals the active skill count (excludes `z_archive/` and `z-future/`).
- Archived or future skill touches do not alter active IDF.
- Recomputed IDF differs only where active content changed.

### Evidence

- Capture each command's output and exit status.
- Record corpus statistics before and after active-skill touches, recomputation count, active skill count, archived or future touch effects, and changed IDF values.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Redundant recomputes | Multiple IDF updates within debounce | Inspect debounce timer in `lib/df-idf.ts`. |
| Archived skills in IDF | Document count exceeds active skill count | Audit corpus filter against `z_archive/` and `z-future/`. |
| Stale IDF after active change | Statistics unchanged after active touch | Confirm write path and debounce flush. |

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [LC-003](../../manual-testing-playbook/lifecycle-routing/archive-handling.md), archive indexing but not routing.
- Scenario [SC-002](../scorer-fusion/projection.md), projection input for scorer.
- Feature [`feature-catalog/auto-indexing/df-idf-corpus.md`](../../feature-catalog/auto-indexing/df-idf-corpus.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/lib/df-idf.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-004
- Canonical root source: manual-testing-playbook.md
- Feature file path: auto-indexing/corpus-df-idf.md
