---
title: "Deep-Research Authority: Canonical Write Admission"
description: "Resolves which writer may admit a canonical deep-research write by reading the durable per-mode authority record."
trigger_phrases:
  - "deep research authority"
  - "canonical write admission"
---

# Deep-Research Authority: Canonical Write Admission

---

## 1. OVERVIEW

`deep-research-authority/` is the production composition seam that binds the per-mode authority substrate to the deep-research serving path. It exposes only the read path today: given the durable, mode-global authority record, it returns the route the canonical write boundary must honor.

Current state:

- Read-only. It constructs an authority registry over the durable root, reads the record and applies the shared selector. It performs no authority mutation.
- A mode whose authority record was never written reads back `legacy_authoritative`, so admission stays on the legacy writer and the serving path is byte-identical until an explicit cutover flips the durable record.
- The serving path must treat a `denied` result as fail-closed and admit neither the legacy nor the ledger writer.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `index.ts` | Public API barrel. Re-exports `admitCanonicalWrite` and the `DeepResearchAuthorityOptions` type. |
| `composition.ts` | Composition root. Holds `admitCanonicalWrite`, `DeepResearchAuthorityOptions` and the read path over `AuthorityRegistry` and `selectAuthorityRoute`. |

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Reads `AuthorityRegistry` and `selectAuthorityRoute` from `../per-mode-authority-flip/index.js`. |
| Exports | `admitCanonicalWrite` and the `DeepResearchAuthorityOptions` type through `index.ts`. |
| Ownership | Owns the composition of the authority substrate into the serving path. The durable record and selector logic belong to the per-mode authority flip. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ serving path (canonical write boundary)   │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ admitCanonicalWrite(mode, options)        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ AuthorityRegistry.read(mode)              │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ selectAuthorityRoute(record, { mode })    │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ admission route (AuthoritySelectorResult) │
╰──────────────────────────────────────────╯
```

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `admitCanonicalWrite` | Function | Resolve the admission route for a canonical deep-research write from the durable per-mode authority record. |
| `DeepResearchAuthorityOptions` | Type | Carries the durable `authorityRoot` and an optional `now` clock. |

---

## 5. RELATED

- [`Runtime Lib`](../README.md)
