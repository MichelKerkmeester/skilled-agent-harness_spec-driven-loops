---
title: "Memory retention sweep"
description: "memory_retention_sweep previews and deletes governance rows past their delete_after timestamp, with dry-run safety, deletion audit evidence, and a scheduled interval driver."
trigger_phrases:
  - "memory retention sweep"
  - "memory_retention_sweep"
  - "sweep expired memory rows"
  - "delete_after governance cleanup"
  - "how do I preview which memories will be deleted"
---

# Memory retention sweep

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`memory_retention_sweep` deletes governance-tagged memory rows once their `delete_after` timestamp has expired. The handler supports a `dryRun` mode that previews candidates without deletion, a destructive mode that emits deleted IDs and an audit reason of `retention_expired`, and a scheduled interval that lets the runtime self-clean when `SPECKIT_RETENTION_SWEEP=true` is set.

The sweep targets only rows that explicitly opted into a retention policy. Rows without `delete_after`, rows with future timestamps, and rows outside the requested scope are left untouched.

---

## 2. HOW IT WORKS

The handler in `mcp_server/handlers/memory-retention-sweep.ts` validates input, delegates to the governance library, and returns a structured report. The library writes audit evidence to the governance log, preserves the original `delete_after` in the audit record, and returns the list of deleted IDs.

- `dryRun: true`: returns `swept: 0` and a candidate list; does not delete
- `dryRun: false`: returns `swept >= 0` and `deletedIds` for the deleted rows
- Scheduled interval: driven by `SPECKIT_RETENTION_SWEEP_INTERVAL_MS` in the session manager when `SPECKIT_RETENTION_SWEEP=true`

The audit record records `reason: "retention_expired"` and preserves the original timestamp so operators can reconstruct what was deleted and why.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-retention-sweep.ts` | Handler | Input validation, dry-run gating, response shape |
| `mcp_server/lib/governance/memory-retention-sweep.ts` | Library | Candidate query, deletion, audit-evidence emission |
| `mcp_server/lib/session/session-manager.ts` | Library | Scheduled interval driver and feature-flag wiring |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/memory-retention-sweep.vitest.ts` | Automated test | Dry-run safety, deletion correctness, audit evidence, interval driver |

---

## 4. SOURCE METADATA
- Group: Maintenance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--maintenance/037-memory-retention-sweep.md`
Related references:
- [036-doctor-router-and-manifest-dispatch.md](036-doctor-router-and-manifest-dispatch.md) — Doctor router and manifest-driven dispatch
