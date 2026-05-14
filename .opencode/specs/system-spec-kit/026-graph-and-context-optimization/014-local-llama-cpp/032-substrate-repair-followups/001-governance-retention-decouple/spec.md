---
title: "001 governance-retention-decouple (ADR-002 Option A implementation)"
description: "Decouple `retentionPolicy: 'ephemeral'` from `requiresGovernedIngest()` in `mcp_server/lib/governance/scope-governance.ts`. Add a default ephemeral TTL constant. Auto-populate `deleteAfter` when ephemeral is set without one. Add vitest coverage for 3 cases."
trigger_phrases:
  - "ADR-002 Option A implementation"
  - "retentionPolicy ephemeral decouple"
  - "DEFAULT_EPHEMERAL_TTL_MS"
  - "scope-governance.ts requiresGovernedIngest fix"
importance_tier: "important"
status: "planned"
---

# 001 — Governance-retention decouple

## Goal

Stop `memory_save({filePath, retentionPolicy: "ephemeral"})` from silently demanding the full audit chain (`tenantId`, `sessionId`, `userId`/`agentId`, `provenanceSource`, `provenanceActor`, `deleteAfter`). Make ephemeral retention a pure retention concern with a sensible default TTL.

## Source anchors (read these first)

- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:229-237` — the `requiresGovernedIngest()` function. Remove `input.retentionPolicy === 'ephemeral'` from the trigger conditions.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:248-274` — the early-return block. When `requiresGovernedIngest` returns false but `retentionPolicy === 'ephemeral'` and `deleteAfter` is null, populate `deleteAfter` to `now + DEFAULT_EPHEMERAL_TTL_MS`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:287-289` — the H21 deleteAfter-required check. May need adjusting since ephemeral no longer triggers full governance.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2784-2807` — the call site (verify only; no edits expected).

## Code changes

1. Add a new constant near the top of `scope-governance.ts`:
   ```ts
   /**
    * Default TTL for ephemeral memories when the caller doesn't supply an explicit deleteAfter.
    * 24h is conservative — short enough to clean up actively-running test fixtures, long
    * enough to survive a typical autonomous workflow.
    */
   export const DEFAULT_EPHEMERAL_TTL_MS = 24 * 60 * 60 * 1000;
   ```

2. Remove the ephemeral trigger from `requiresGovernedIngest()`:
   ```ts
   // BEFORE
   return Object.values(scope).some(...)
     || typeof input.provenanceSource === 'string'
     || typeof input.provenanceActor === 'string'
     || typeof input.governedAt === 'string'
     || input.retentionPolicy === 'ephemeral'   // ← remove this line
     || typeof input.deleteAfter === 'string';
   ```

3. Update the early-return block in `validateGovernedIngest()` to supply the default TTL:
   ```ts
   // Inside the `if (!requiresGovernedIngest(input))` branch
   const computedDeleteAfter = deleteAfter ?? (
     retentionPolicy === 'ephemeral'
       ? new Date(Date.now() + DEFAULT_EPHEMERAL_TTL_MS).toISOString()
       : null
   );

   return {
     allowed: true,
     normalized: {
       // ...other fields...
       retentionPolicy,
       deleteAfter: computedDeleteAfter,
     },
     issues: [],
   };
   ```

4. Mirror all source changes to `.opencode/skills/system-spec-kit/mcp_server/dist/lib/governance/scope-governance.js` (build chain is broken; dual-patch until child 003 lands).

## Vitest coverage (REQUIRED)

Add a new vitest file `mcp_server/tests/governance-ephemeral-decouple.vitest.ts` covering:

- **Case A** — ephemeral WITH full governance fields: `validateGovernedIngest({retentionPolicy: 'ephemeral', tenantId, sessionId, userId, provenanceSource, provenanceActor, deleteAfter})` returns `{allowed: true}` with the caller's `deleteAfter` preserved.
- **Case B** — ephemeral ALONE: `validateGovernedIngest({retentionPolicy: 'ephemeral'})` returns `{allowed: true}` with `normalized.deleteAfter` non-null and ~24h in the future.
- **Case C** — ephemeral WITH explicit deleteAfter only: `validateGovernedIngest({retentionPolicy: 'ephemeral', deleteAfter: <some ISO>})` returns `{allowed: true}` with `normalized.deleteAfter` matching the caller's value (not the default).

## Acceptance criteria

1. `npm test -- governance-ephemeral` passes the 3 new tests.
2. `memory_save({filePath: <valid spec doc>, retentionPolicy: "ephemeral"})` (no other governance fields) succeeds (no E085 governance rejection), returns a non-zero id.
3. The stored memory's `delete_after` column is non-null and approximately `now + 24h`.
4. Existing governance tests still pass (no regressions).
5. `implementation-summary.md` filled with: source anchors, what changed, vitest run output, manual round-trip test result.
6. `checklist.md` marked with evidence for each acceptance criterion.

## Out of scope

- Changing the retention sweep logic (separate concern; sweep already handles null/non-null `delete_after`).
- Adding more error codes beyond what E085 already provides.
- Migrating existing rows with retention_policy='ephemeral' + delete_after=NULL to have a TTL.
