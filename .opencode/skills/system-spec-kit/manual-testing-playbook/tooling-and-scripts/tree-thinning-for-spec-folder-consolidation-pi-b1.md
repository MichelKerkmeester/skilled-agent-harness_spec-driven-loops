---
title: "061 -- Tree thinning for spec folder consolidation (PI-B1)"
description: "This scenario validates Tree thinning for spec folder consolidation (PI-B1) for `061`. It focuses on Confirm small-file merge thinning."
version: 3.6.0.15
id: tooling-and-scripts-tree-thinning-for-spec-folder-consolidation-pi-b1
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 061 -- Tree thinning for spec folder consolidation (PI-B1)

## 1. OVERVIEW

This scenario validates Tree thinning for spec folder consolidation (PI-B1) for `061`. It focuses on Confirm small-file merge thinning.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm small-file merge thinning.
- Real user request: `Please validate Tree thinning for spec folder consolidation (PI-B1) against the documented validation surface and tell me whether the expected signals are present: Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity.`
- Prompt: `Validate Tree thinning for spec folder consolidation (PI-B1) against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the 150-token and 3-child safeguards hold, token savings are positive, and content integrity is preserved

---

## 3. TEST EXECUTION

### Prompt

```
Validate Tree thinning for spec folder consolidation (PI-B1) against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. prepare mixed-size tree around the 150-token boundary
2. run thinning path
3. verify merged output, 3-child cap, kept overflow files, and tokens saved

### Expected

Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity

### Evidence

Command run from `.opencode/skills/system-spec-kit/scripts`:

```bash
npm exec --no -- tsx --eval '
import { applyTreeThinning, estimateTokenCount } from "./core/tree-thinning.ts";

function makeContent(tokens, marker) {
  const fillerLength = Math.max(0, tokens * 4 - marker.length);
  return marker + "x".repeat(fillerLength);
}

const files = [
  { path: "specs/061-feature/memory/small-a.md", content: makeContent(120, "UNIQUE_SMALL_A") },
  { path: "specs/061-feature/memory/small-b.md", content: makeContent(130, "UNIQUE_SMALL_B") },
  { path: "specs/061-feature/memory/small-c.md", content: makeContent(149, "UNIQUE_SMALL_C") },
  { path: "specs/061-feature/memory/small-d-overflow.md", content: makeContent(148, "UNIQUE_SMALL_D_OVERFLOW") },
  { path: "specs/061-feature/memory/boundary-150.md", content: makeContent(150, "UNIQUE_BOUNDARY_150") },
  { path: "specs/061-feature/memory/large.md", content: makeContent(600, "UNIQUE_LARGE") },
];

const beforeTokens = files.reduce((sum, file) => sum + estimateTokenCount(file.content), 0);
const result = applyTreeThinning(files);
const afterTokens = beforeTokens - result.stats.tokensSaved;
const mergedIntegrity = ["UNIQUE_SMALL_A", "UNIQUE_SMALL_B", "UNIQUE_SMALL_C"].every((marker) => result.merged[0]?.mergedSummary.includes(marker));
const overflowKept = result.thinned.find((entry) => entry.path.endsWith("small-d-overflow.md"));
const boundaryKept = result.thinned.find((entry) => entry.path.endsWith("boundary-150.md"));
const largeKept = result.thinned.find((entry) => entry.path.endsWith("large.md"));

console.log(JSON.stringify({
  prepared: files.map((file) => ({ path: file.path, tokens: estimateTokenCount(file.content) })),
  stats: result.stats,
  beforeTokens,
  afterTokens,
  tokenReduction: beforeTokens - afterTokens,
  merged: result.merged.map((entry) => ({
    parentPath: entry.parentPath,
    childCount: entry.childPaths.length,
    childPaths: entry.childPaths,
    containsMergedMarkers: ["UNIQUE_SMALL_A", "UNIQUE_SMALL_B", "UNIQUE_SMALL_C"].map((marker) => ({ marker, present: entry.mergedSummary.includes(marker) })),
    containsOverflowMarker: entry.mergedSummary.includes("UNIQUE_SMALL_D_OVERFLOW"),
  })),
  actions: result.thinned.map((entry) => ({ path: entry.path, tokens: entry.tokenCount, action: entry.action })),
  checks: {
    below150Merged: ["small-a.md", "small-b.md", "small-c.md"].every((name) => result.thinned.find((entry) => entry.path.endsWith(name))?.action === "merged-into-parent"),
    noParentOverThreeChildren: result.merged.every((entry) => entry.childPaths.length <= 3),
    overflowKept: overflowKept?.action === "keep",
    tokensSavedPositive: result.stats.tokensSaved > 0,
    largeKept: largeKept?.action === "keep" && largeKept.content === files.find((file) => file.path.endsWith("large.md"))?.content,
    boundary150Kept: boundaryKept?.action === "keep",
    mergedContentIntegrity: mergedIntegrity,
    overflowNotInMergedSummary: result.merged.every((entry) => !entry.mergedSummary.includes("UNIQUE_SMALL_D_OVERFLOW")),
  },
}, null, 2));
'
```

Observed output:

```json
{
  "prepared": [
    {
      "path": "specs/061-feature/memory/small-a.md",
      "tokens": 120
    },
    {
      "path": "specs/061-feature/memory/small-b.md",
      "tokens": 130
    },
    {
      "path": "specs/061-feature/memory/small-c.md",
      "tokens": 149
    },
    {
      "path": "specs/061-feature/memory/small-d-overflow.md",
      "tokens": 148
    },
    {
      "path": "specs/061-feature/memory/boundary-150.md",
      "tokens": 150
    },
    {
      "path": "specs/061-feature/memory/large.md",
      "tokens": 600
    }
  ],
  "stats": {
    "totalFiles": 6,
    "thinnedCount": 0,
    "mergedCount": 3,
    "tokensSaved": 60
  },
  "beforeTokens": 1297,
  "afterTokens": 1237,
  "tokenReduction": 60,
  "merged": [
    {
      "parentPath": "specs/061-feature/memory",
      "childCount": 3,
      "childPaths": [
        "specs/061-feature/memory/small-a.md",
        "specs/061-feature/memory/small-b.md",
        "specs/061-feature/memory/small-c.md"
      ],
      "containsMergedMarkers": [
        {
          "marker": "UNIQUE_SMALL_A",
          "present": true
        },
        {
          "marker": "UNIQUE_SMALL_B",
          "present": true
        },
        {
          "marker": "UNIQUE_SMALL_C",
          "present": true
        }
      ],
      "containsOverflowMarker": false
    }
  ],
  "actions": [
    {
      "path": "specs/061-feature/memory/small-a.md",
      "tokens": 120,
      "action": "merged-into-parent"
    },
    {
      "path": "specs/061-feature/memory/small-b.md",
      "tokens": 130,
      "action": "merged-into-parent"
    },
    {
      "path": "specs/061-feature/memory/small-c.md",
      "tokens": 149,
      "action": "merged-into-parent"
    },
    {
      "path": "specs/061-feature/memory/small-d-overflow.md",
      "tokens": 148,
      "action": "keep"
    },
    {
      "path": "specs/061-feature/memory/boundary-150.md",
      "tokens": 150,
      "action": "keep"
    },
    {
      "path": "specs/061-feature/memory/large.md",
      "tokens": 600,
      "action": "keep"
    }
  ],
  "checks": {
    "below150Merged": true,
    "noParentOverThreeChildren": true,
    "overflowKept": true,
    "tokensSavedPositive": true,
    "largeKept": true,
    "boundary150Kept": true,
    "mergedContentIntegrity": true,
    "overflowNotInMergedSummary": true
  }
}
```

### Pass / Fail

- **PASS**: the 150-token and 3-child safeguards hold, token savings are positive, and content integrity is preserved.

### Failure Triage

Verify file size thresholds; inspect per-parent merge caps; check overflow promotion to `keep`; inspect token counting accuracy

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/tree-thinning-for-spec-folder-consolidation.md](../../feature-catalog/tooling-and-scripts/tree-thinning-for-spec-folder-consolidation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 061
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/tree-thinning-for-spec-folder-consolidation-pi-b1.md`
