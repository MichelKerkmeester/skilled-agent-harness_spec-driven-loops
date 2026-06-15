---
title: Deep Research Reducer And Registry Reference
description: Reducer ownership, findings registry schema, validation, fault tolerance, and reconstruction rules.
trigger_phrases:
  - "research reducer registry"
  - "research findings registry"
  - "reducer ownership contract"
  - "research registry fingerprint"
  - "reducer fault tolerance"
  - "research dashboard derivation"
importance_tier: normal
contextType: implementation
---

# Deep Research Reducer And Registry Reference

The reducer turns append-only iteration state into synchronized strategy, registry, dashboard, and synthesis metadata. It is the source of truth for derived packet state.

---

## 1. OVERVIEW

### Purpose

Define reducer ownership, findings registry shape, validation behavior, fault tolerance, file protection, dashboard derivation, and legacy aliases.

### When to Use

Load this reference when rebuilding derived state, validating registry/dashboard outputs, or deciding whether a file is agent-owned or reducer-owned.

### Core Principle

The reducer owns derived state. Manual edits to reducer-managed outputs are temporary and may be overwritten.

---

## 2. REDUCER CONTRACT

The workflow reducer:

- reads `deep-research-state.jsonl`, per-iteration deltas, strategy, and iteration markdown;
- validates required iteration artifacts;
- updates machine-owned strategy sections;
- regenerates the findings registry;
- regenerates the dashboard;
- records convergence and blocked-stop summaries.

It must fail closed before writing derived files when JSONL corruption is detected in strict mode.

---

## 3. FINDINGS REGISTRY

The canonical registry stores open/resolved questions, findings, ruled-out directions, convergence state, and blocked-stop history.

```json
{
  "openQuestions": [],
  "resolvedQuestions": [],
  "keyFindings": [],
  "ruledOutDirections": [],
  "coverageBySources": {},
  "convergenceScore": 0.42,
  "blockedStopHistory": [],
  "graphConvergenceScore": null,
  "graphDecision": null,
  "graphBlockers": [],
  "lastUpdated": "2026-05-24T00:00:00Z"
}
```

The currently documented live registry name is `deep-research-findings-registry.json` in command state paths, with `findings-registry.json` still appearing in older docs and packet examples. New docs should prefer the command state path and mention the older name only when explaining compatibility.

---

## 4. VALIDATION RULES

Blocking validation:

- config, state log, and strategy exist before a resume;
- every dispatched iteration produces a non-empty iteration markdown file;
- every dispatched iteration appends a JSONL delta record with required fields;
- JSONL records parse in strict mode;
- reducer-owned outputs refresh after iteration evaluation;
- convergence STOP candidates record gate evidence.

Post-dispatch failure codes include:

| Code | Meaning |
|------|---------|
| `iteration_file_missing` | Expected iteration markdown file was not created |
| `iteration_file_empty` | Iteration markdown exists but is empty |
| `jsonl_not_appended` | JSONL state did not receive the iteration record |
| `jsonl_missing_fields` | Required JSONL fields are absent |
| `jsonl_parse_error` | JSONL line is malformed |

Three consecutive failures route to stuck recovery or escalation.

---

## 5. FAULT TOLERANCE

Fault-tolerant reads may skip malformed JSONL lines only in lenient recovery mode. Strict mode stops before derived writes.

Safe recovery order:

1. Preserve the corrupted state file.
2. Read valid JSONL records.
3. Reconstruct missing iteration summaries from `iterations/iteration-NNN.md`.
4. Append explicit reconstructed records.
5. Regenerate registry and dashboard.
6. Record the recovery in JSONL.

Example reconstructed record:

```json
{"type":"iteration","run":3,"status":"reconstructed","focus":"extracted focus","findingsCount":0,"newInfoRatio":0.0}
```

---

## 6. FILE PROTECTION MAP

The config may include:

```json
{
  "fileProtection": {
    "deep-research-config.json": "immutable",
    "deep-research-state.jsonl": "append-only",
    "deep-research-strategy.md": "mutable",
    "deep-research-dashboard.md": "auto-generated",
    "deep-research-findings-registry.json": "auto-generated",
    "iteration-*.md": "write-once",
    "research/research.md": "mutable"
  }
}
```

Protection is a workflow contract. It documents ownership and supports validation; it is not a substitute for command-level checks.

---

## 7. DASHBOARD DERIVATION

Dashboard values are derived from raw state:

| Dashboard Field | Source |
|-----------------|--------|
| iteration count | JSONL iteration records |
| current status | latest lifecycle or synthesis event |
| convergence trend | `convergenceSignals` |
| blocked stops | registry `blockedStopHistory` |
| graph convergence | registry graph fields |
| next focus | strategy |

`synthesis_complete` events are authoritative for terminal status when present.

---

## 8. LEGACY ALIASES

The workflow may dual-read older names during migration windows, but new writes use canonical `deep-research-*` artifacts. Migration reads should append a migration event that records `legacyPath`, `canonicalPath`, and timestamp.
