---
title: Deep Loop Authority Runtime State
description: Durable machine-local authority records governing canonical write admission for deep-loop modes.
trigger_phrases:
  - "deep loop authority state"
  - "authority flip state"
  - "canonical write admission"
version: 1.0.0.1
---

# Deep Loop Authority Runtime State

> Durable runtime storage for mode-keyed authority records that govern canonical write admission.

---

## 1. OVERVIEW

This directory holds the durable, machine-local authority records used by the deep-loop runtime to determine whether canonical write admission for a given mode is directed to legacy writers or to the append-only ledger.

Authority is a single durable fact per deployment. The authority root is mode-global and must never be scoped per-run: a per-run root would fork authority across concurrent or sequential runs, allowing two runs to disagree on which writer is canonical.

The runtime state in this folder is machine-local and git-ignored. Only this `README.md` is committed, ensuring the directory structure exists while keeping mutable authority transitions on the local machine rather than checked into version control.

---

## 2. STRUCTURE

```text
.state/authority/
+-- README.md
+-- authority-<mode>.json
```

| Path | Shape | Purpose |
|---|---|---|
| `README.md` | Tracked markdown | Documents the authority state directory and its lifecycle. |
| `authority-<mode>.json` | JSON authority record | Durable authority record for a specific mode (e.g., `authority-deep-research.json`), containing current state, epoch, selected writer, and cryptographic record digest. |

---

## 3. LIFECYCLE AND SAFETY

A mode whose authority record has never been written defaults to `legacy_authoritative` with admission open. In this state, writes continue to use the legacy writer path without alteration.

When an explicit, authorized cutover flip occurs:
1. Preflight verifies the cutover certificate and rollback readiness.
2. The authority record is atomically updated using compare-and-swap semantics.
3. Subsequent append operations evaluate the updated record and direct writes to the authorized writer.

If an on-disk authority record is malformed or tampered with, the admission gate fails closed, denying writes to prevent corrupted or unauthorized state transitions.
