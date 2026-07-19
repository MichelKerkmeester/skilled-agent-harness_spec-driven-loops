---
title: "Governance: Scope, Audit, and Retention"
description: "Scope enforcement, governed-ingest validation, audit logging, and memory retention sweeping."
trigger_phrases:
  - "scope governance"
  - "governed ingest"
---

# Governance: Scope, Audit, and Retention

---

## 1. OVERVIEW

`lib/governance/` owns MCP server governance helpers. It normalizes request scope, validates governed-ingest metadata, records audit entries, and deletes expired governed memory rows.

Current responsibilities:

- Enforce tenant, user, agent, and session boundaries for governed reads and writes.
- Normalize provenance and retention fields before memory rows are persisted.
- Persist governance audit records for allow, deny, delete, and conflict decisions.
- Sweep `memory_index.delete_after` rows when governed retention expires.
- Re-validate each candidate inside the delete transaction so a concurrent writer that raises or clears `delete_after` between selection and deletion cannot have its row swept.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    LIB GOVERNANCE                                │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│ Handler input  │ ───▶ │ scope-governance   │ ───▶ │ memory_index rows  │
└────────────────┘      └─────────┬──────────┘      └────────────────────┘
                                  │
                                  ▼
                         ┌────────────────────┐
                         │ governance audit   │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │ retention sweep    │
                         └────────────────────┘

Dependency direction: handlers ───▶ governance ───▶ search/storage tables
```

---

## 3. DIRECTORY TREE

```text
lib/governance/
+-- scope-governance.ts       # Scope normalization, ingest validation, filters, and audit helpers
+-- memory-retention-sweep.ts # Expired governed-row sweep and deletion ledger integration
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `scope-governance.ts` | Defines scope types, validates governed ingest, applies query filters, and records governance audit entries. |
| `memory-retention-sweep.ts` | Selects expired `memory_index` rows, supports dry runs, re-validates expiry inside the delete transaction, deletes still-expired rows, records history and audit entries, appends a retention ledger entry, and runs post-delete FTS and WAL maintenance. |
| `README.md` | Describes governance ownership and safe edit boundaries. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Scope | Tenant, user, agent, and session scope must be normalized before governed operations use it. |
| Provenance | Governed ingest requires explicit source and actor metadata when scoped ingest validation applies. |
| Retention | `delete_after` controls lifecycle deletion for governed memory rows. Selection and deletion run in separate steps, so deletion re-checks expiry inside the transaction before removing a row. |
| Audit | Governance decisions write audit entries through the governance table helpers. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ MCP handler or lifecycle sweep           │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Normalize scope and governed metadata    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Apply filters or validate ingest fields  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Persist audit or retention ledger data   │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Scoped result or retention sweep result  │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `validateGovernedIngest()` | Function | Normalizes and validates governed-ingest fields before persistence. |
| `recordGovernanceAudit()` | Function | Persists governance audit rows. |
| `runMemoryRetentionSweep()` | Function | Runs dry-run or destructive expiration sweeps over `memory_index`, skipping any candidate that is no longer expired at delete time. |
| `MemoryRetentionSweepResult` | Type | Returned sweep summary, candidates, deleted IDs, and ledger state. |
| `__retentionSweepTestables` | Object | Test-only export exposing the in-transaction `isStillExpired` re-validation guard. |

---

## 7. VALIDATION

Run from `.opencode/skills/system-spec-kit/mcp-server`.

```bash
npx vitest run tests/governance-e2e.vitest.ts tests/memory-governance.vitest.ts tests/scope-governance-normalizer-parity.vitest.ts
```

Expected result: governed scope, ingest, audit, and retention behavior pass.

---

## 8. RELATED

- [`../storage/README.md`](../storage/README.md)
- [`../../handlers/README.md`](../../handlers/README.md)
- [`../../tests/README.md`](../../tests/README.md)
