---
title: "Automated Writers Never Overwrite Manual Memory"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-06-10"
last_confirmed_source: "implementation-verification"
triggerPhrases:
  - automated writer
  - manual memory overwrite
  - source kind provenance
  - protect manual data
  - constitutional memory overwrite
---

# Automated Writers Never Overwrite Manual Memory

> Always-surface constitutional rule. Validation surfaces this as advisory guidance for memory write paths.

## The Rule

Automated writers may never overwrite manual or constitutional memory fields. If an automated write targets protected manual data, the write path must skip the protected field, preserve safe fields from the same payload, and surface a quiet advisory hint.

## Enforcement

The guard belongs at write ingress before mutation. Post-mutation hooks may append audit rows and refresh caches, but they must not make integrity decisions because the protected data would already be changed.

## Allowed Direction

Human edits may overwrite automated data. Once a human edit lands, the memory row becomes protected from future automated overwrites of manual or constitutional fields.

*Constitutional Memory — Always surfaces at top of search results*
