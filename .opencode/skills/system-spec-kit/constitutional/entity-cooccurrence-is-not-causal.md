---
title: "Entity Co-occurrence Is Not Causal Truth"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-06-10"
last_confirmed_source: "implementation-verification"
triggerPhrases:
  - entity co-occurrence
  - entity recall evidence
  - causal truth boundary
  - co-occurrence not causal
  - recall evidence only
---

# Entity Co-occurrence Is Not Causal Truth

> Always-surface constitutional rule. Validation surfaces this as advisory guidance for memory write paths.

## The Rule

Entity, similarity, and co-occurrence signals are recall evidence only. They may improve search and ranking, but they must never be promoted as causal truth or overwrite a causal edge authored from explicit lineage or manual evidence.

## Enforcement

Entity and co-occurrence processors must write recall metadata only. Causal-edge writers may consume explicit causal declarations, lineage, or governed structural signals, but they must not infer causality from entity overlap alone.

## Allowed Direction

Entity and co-occurrence evidence may suggest records to inspect. A human or explicit structural rule may then create a causal edge through the normal causal writer with provenance preserved.

*Constitutional Memory — Always surfaces at top of search results*
