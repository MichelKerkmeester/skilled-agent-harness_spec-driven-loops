---
title: "RAG Library: Trust Tree"
description: "Builds answer-level trust summaries from memory, graph, advisor, Code Graph and causal signals."
trigger_phrases:
  - "rag trust tree"
  - "answer trust signals"
---

# RAG Library: Trust Tree

## 1. OVERVIEW

This folder contains answer-level trust composition for retrieval-augmented responses. It converts independent provenance signals into a single decision with citations, reasons and grouped causal edges.

## 2. DIRECTORY TREE

```text
rag/
+-- trust-tree.ts  # Trust-signal composition and exported types
`-- README.md      # Folder orientation
```

## 3. KEY FILES

| File | Role |
|---|---|
| `trust-tree.ts` | Normalizes trust states, groups causal edges and returns `trusted`, `mixed`, `degraded` or `unavailable` decisions. |

## 4. ENTRYPOINTS

- `buildTrustTree(input)` composes response policy, code graph, advisor, Code Graph and causal inputs.
- Exported types include `TrustTree`, `TrustSignal`, `TrustSignalState`, `TrustTreeDecision`, `CausalRelation`, `CausalTrustEdge` and `BuildTrustTreeInput`.

## 5. BOUNDARIES

- This folder composes trust metadata only.
- It does not run retrieval, classify prompts or query external indexes.
- Callers should pass citations and raw signal details when available.

## 6. VALIDATION

Run from the repository root:

```bash
npm test -- --runInBand
```

## 7. RELATED

- `../memory/`
