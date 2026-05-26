# ADR-002 — Decouple `retentionPolicy: "ephemeral"` from governed-ingest enforcement

Status: **proposed** (behavior change; awaiting user decision)
Date: 2026-05-14
Parent: `post-execution-followup.md`
Source anchor: `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:225-237`

## Context

Today's substrate-repair session traced a 0/15 PASS rate across the 24-- playbook scenarios to a single hidden coupling in `requiresGovernedIngest()`:

```ts
function requiresGovernedIngest(input: GovernedIngestInput): boolean {
  const scope = normalizeScopeContext(input);
  return Object.values(scope).some((value) => typeof value === 'string')
    || typeof input.provenanceSource === 'string'
    || typeof input.provenanceActor === 'string'
    || typeof input.governedAt === 'string'
    || input.retentionPolicy === 'ephemeral'   // ← THIS LINE is the surprise
    || typeof input.deleteAfter === 'string';
}
```

The function returns `true` (governance required) if ANY of these is set. When `requiresGovernedIngest` returns true, the subsequent validation block at lines 276-289 demands the FULL audit chain: `tenantId`, `sessionId`, `userId` OR `agentId`, `provenanceSource`, `provenanceActor`, and a valid future `deleteAfter`.

In practice, this means any caller that passes JUST `retentionPolicy: "ephemeral"` (with no audit fields) gets rejected with up to 6 stacked "required for governed ingest" issues. The handler at `memory-save.ts:2807` throws those as a single semicolon-joined `Error("Governed ingest rejected: A; B; C")`, which `response-builder.ts:511` (pre-Fix-1) wrapped as the generic `E081 "An unexpected error occurred"`.

Net effect: callers see only the catch-all error and have no way to know that `retentionPolicy: "ephemeral"` is what tripped it. The behavior is correct per the code, but the coupling is **surprising** — `retentionPolicy` is a retention concern (when to delete), not an audit concern (who owns / where it came from).

## Considered Options

### Option A — Remove the `retentionPolicy === 'ephemeral'` trigger entirely (recommended)

Change `requiresGovernedIngest` to:

```ts
function requiresGovernedIngest(input: GovernedIngestInput): boolean {
  const scope = normalizeScopeContext(input);
  return Object.values(scope).some((value) => typeof value === 'string')
    || typeof input.provenanceSource === 'string'
    || typeof input.provenanceActor === 'string'
    || typeof input.governedAt === 'string'
    || typeof input.deleteAfter === 'string';
}
```

**Behavior change**: calling `memory_save({filePath, retentionPolicy: "ephemeral"})` succeeds (subject to other quality gates) and stores the row with `retention_policy = 'ephemeral'` but `delete_after = null`.

**Downstream effect**: the retention sweep currently uses `delete_after` to decide eligibility for deletion. Rows with `retention_policy = 'ephemeral'` AND `delete_after = NULL` would NOT be swept — they'd live forever unless deleted by name. That defeats the intent of "ephemeral".

**Mitigation**: either
- (a) Have the sweep also pick up `retention_policy = 'ephemeral' AND delete_after IS NULL AND created_at < (now - default_ttl)` with a sensible default TTL (e.g., 7 days), OR
- (b) On insert, default `delete_after = now + DEFAULT_EPHEMERAL_TTL` (e.g., 24h) when retentionPolicy is ephemeral but the caller didn't supply one.

I lean toward (b) — caller intent stays explicit ("this is ephemeral"), system supplies a safe default TTL so the sweep can do its job.

### Option B — Keep the trigger but split the validation paths

Make `requiresGovernedIngest` return a structured result like `{required: boolean, ephemeralOnly: boolean}`. When `ephemeralOnly: true`, the validation block requires ONLY `deleteAfter`, not the full audit chain.

Pros: preserves the H21 fix intent (ephemeral rows need a TTL for auditability).
Cons: more complex; adds another code path; doesn't fully fix the surprise — callers passing `retentionPolicy: "ephemeral"` still need to know about `deleteAfter`.

### Option C — Document the implicit requirement, change nothing

Update the tool schema description for `memory_save` to make the implicit governance trigger explicit:

> "retentionPolicy: 'ephemeral' triggers governed-ingest enforcement. Callers MUST also provide tenantId, sessionId, userId-or-agentId, provenanceSource, provenanceActor, and deleteAfter."

Pros: zero code change; the post-Fix-1 error codes (E085 with `issues[]`) now make the requirement discoverable.
Cons: doesn't fix the underlying coupling; callers still have to remember to NOT use ephemeral unless they're doing full governance.

### Option D — Make the trigger explicit via a separate flag

Add an explicit `governanceRequired: true` flag instead of inferring from `retentionPolicy: "ephemeral"`. Move the H21 deleteAfter check to a `retentionPolicy === 'ephemeral'` clause that lives OUTSIDE `requiresGovernedIngest`.

Pros: separates concerns cleanly. Callers opt INTO governance explicitly. Ephemeral retention is independent.
Cons: breaking change for any existing caller that relied on the ephemeral-triggers-governance behavior.

## Decision

**Recommended: Option A + mitigation (b).** Decouple retention from governance, with a sensible default ephemeral TTL when none is supplied. This is the least-surprising contract: `retentionPolicy: "ephemeral"` means "delete this eventually", nothing more.

But this is a behavioral change to the governance layer + adds a default-TTL constant. It deserves a separate planning packet, not an inline patch.

## Consequences

If Option A is adopted:
- Existing callers passing the FULL governance chain along with `retentionPolicy: "ephemeral"` continue to work unchanged (the other triggers in `requiresGovernedIngest` still apply).
- Callers passing JUST `retentionPolicy: "ephemeral"` (like the original 24-- scenarios) now save successfully and get a default TTL.
- The retention sweep needs to be updated to default-TTL the ephemeral rows OR the insert path needs to auto-populate `delete_after`.
- Need a follow-up test that covers: ephemeral with full governance, ephemeral without governance, ephemeral with explicit deleteAfter.

If Option C is adopted (no code change):
- Fix 1 (E085 classifier) already makes the failure mode visible. Callers see "MEMORY_SAVE_GOVERNANCE_REJECTED" with the specific missing fields in `details.issues`.
- Fix 3 (24-- scenario cleanup) already removes the `retentionPolicy: "ephemeral"` from the playbook examples.
- The coupling stays surprising for future callers but is now diagnostic-friendly.

## Status / Next Step

This ADR is **proposed**, not applied. The two follow-up fixes already shipped (E081 classifier in `7fbed77c8`, scenario doc cleanup in `4e5ee2dda`) handle the *symptoms* — observability and the specific 24-- scenarios. The underlying design choice between Option A vs. C is the user's call.

If the user picks Option A, file a small implementation packet that:
1. Changes `requiresGovernedIngest` (1-line removal).
2. Adds `DEFAULT_EPHEMERAL_TTL_MS = 24 * 60 * 60 * 1000` (or similar) to `governance/scope-governance.ts`.
3. Updates the early-return block at lines 256-274 to set `deleteAfter = now + DEFAULT_EPHEMERAL_TTL_MS` when retentionPolicy is ephemeral but `deleteAfter` wasn't supplied.
4. Adds vitest coverage for the three ephemeral cases (with-governance, without-governance, explicit-TTL).

If Option C: this ADR becomes the documentation; close as `accepted-no-change`.

## References

- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:225-237` (the `requiresGovernedIngest` function).
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:276-289` (the validation issues block).
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2784-2807` (the call site + throw).
- `post-execution-followup.md` (this ADR's parent context).
- `convergence.md` (the original 6-step plan; this is the deferred Step 5 spiritual successor).
- Fix 1 commit `7fbed77c8` (E081 classifier — observability layer).
- Fix 3 commit `4e5ee2dda` (24-- scenario examples — caller layer).
