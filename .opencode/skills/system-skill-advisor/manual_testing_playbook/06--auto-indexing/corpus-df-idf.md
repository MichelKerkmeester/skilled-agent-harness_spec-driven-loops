---
title: "AI-004 DF/IDF Corpus Stats Active-Only"
description: "Manual validation that DF/IDF corpus statistics in lib/corpus/df-idf.ts are computed only over the active corpus, are debounced and exclude archived or future skills."
trigger_phrases:
  - "ai-004"
  - "df-idf corpus"
  - "active corpus stats"
  - "idf debounce"
version: 0.8.0.14
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

### Evidence

Scenario file was read in full before execution.

Read-only advisor status check:

```json
{
  "status": "ok",
  "data": {
    "freshness": "unavailable",
    "generation": 9476,
    "trustState": {
      "state": "stale",
      "reason": "SIGTERM",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:14:57.239Z",
      "lastLiveAt": null
    },
    "lastGenerationBump": "2026-07-02T05:27:14.803Z",
    "lastScanAt": "2026-07-02T05:27:14.803Z",
    "skillCount": 26,
    "laneWeights": {
      "explicit_author": 0.42,
      "lexical": 0.28,
      "graph_causal": 0.13,
      "derived_generated": 0.12,
      "semantic_shadow": 0.05
    }
  }
}
```

Active `SKILL.md` path check:

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-git/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-opencode/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-click-up/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-research/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-code-mode/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-figma/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-design/design-md-generator/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-open-design/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code/code-review/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-design/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-design/design-foundations/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-improvement/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/deep-review/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-design/design-audit/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-design/design-motion/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-design/design-interface/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-deep-loop/runtime/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt-models/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-claude-code/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-prompt/SKILL.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-chrome-devtools/SKILL.md
```

Archive/future precondition checks:

```text
z_archive glob output included:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/z_archive/cli-codex-retired/SKILL.retired.md

z_future glob output:
No files found
```

The required scenario commands were not executed:

```bash
touch .opencode/skills/sk-git/SKILL.md
touch .opencode/skills/sk-doc/SKILL.md
touch .opencode/skills/system-spec-kit/SKILL.md
```

Reason: the session-level allowed write path is only `.opencode/skills/system-skill-advisor/manual_testing_playbook/06--auto-indexing/corpus-df-idf.md`; the scenario commands would modify `.opencode/skills/sk-git/SKILL.md`, `.opencode/skills/sk-doc/SKILL.md`, and `.opencode/skills/system-spec-kit/SKILL.md` mtimes outside the allowed write path. The archived-skill touch step would also require modifying a file under `.opencode/skills/z_archive/`, which is outside the allowed write path.

### Pass/Fail

BLOCKED - The scenario cannot be executed under the provided write restrictions because its required `touch` commands modify files outside the single allowed write path. Additionally, `advisor_status` reported `freshness: "unavailable"` and `trustState.state: "stale"` with `reason: "SIGTERM"`, so the daemon-backed active IDF state was not available for the expected recomputation checks.

---

## 4. SOURCE FILES

- Scenario [LC-003](../07--lifecycle-routing/archive-handling.md), archive indexing but not routing.
- Scenario [SC-002](../08--scorer-fusion/projection.md), projection input for scorer.
- Feature [`02--auto-indexing/df-idf-corpus.md`](../../feature_catalog/02--auto-indexing/df-idf-corpus.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/corpus/df-idf.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-004
- Canonical root source: manual_testing_playbook.md
- Feature file path: 06--auto-indexing/corpus-df-idf.md
