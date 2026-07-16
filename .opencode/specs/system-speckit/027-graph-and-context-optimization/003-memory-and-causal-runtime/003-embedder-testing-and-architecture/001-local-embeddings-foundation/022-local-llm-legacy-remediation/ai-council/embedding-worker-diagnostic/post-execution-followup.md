# Post-execution follow-up — actual root cause was H4, not H1/H2

After executing the 6-step repair plan from `convergence.md` and verifying the substrate via memory_search + memory_save round-trips, **the real root cause of the 0/15 PASS rate on the 24-- scenario runs turned out to be a different bug** than what the council diagnosed.

## What the council got right

- **H1 (multi-daemon contention)**: real, but secondary. Killing 14 stale Memory MCP processes + the 24h-stuck CocoIndex daemon DID help: 190 of 214 historical failed embeddings recovered after the throughput patch took effect.
- **H2 (retry-throughput ceiling)**: real and high-confidence. The hardcoded `5 items per 5 min` in `retry-manager.ts:343-352` was a meaningful throughput cap. Making it env-overrideable via `SPECKIT_RETRY_INTERVAL_MS` + `SPECKIT_RETRY_BATCH_SIZE` was the right fix.
- **H3 (llama-cpp inference broken)**: correctly identified as worth falsifying. Smoke test produced 768-dim vector in ~6s; H3 falsified.

## What the council missed — H4: governed-ingest silent rejection

The actual cause of the universal E081 across every `memory_save` attempt in this session and across all 15 of the 24-- playbook scenarios:

**`retentionPolicy: "ephemeral"` triggers `requiresGovernedIngest()` at `lib/governance/scope-governance.ts:235`**, which then requires ALL of these fields:

- `tenantId`
- `sessionId`
- `userId` OR `agentId`
- `provenanceSource`
- `provenanceActor`
- A valid future `deleteAfter` timestamp

When the caller passes `retentionPolicy: "ephemeral"` without the other governance fields (which all 15 scenarios did, plus my smoke tests, plus the codex council runs), `validateGovernedIngest` returns `allowed: false`, the handler throws `new Error('Governed ingest rejected: tenantId is required for governed ingest; ...')`, and `response-builder.ts:511` wraps the thrown error as the generic `E081 "An unexpected error occurred. Please check logs for details."` — completely hiding the real reason.

## Evidence

- `lib/governance/scope-governance.ts:235`: `input.retentionPolicy === 'ephemeral'` is one of the triggers for `requiresGovernedIngest()`.
- `lib/governance/scope-governance.ts:276-289`: when `requiresGovernedIngest` returns true, fails with up to 6 issues if the other fields are missing.
- `handlers/memory-save.ts:2807`: `throw new Error('Governed ingest rejected: ' + issues.join('; '))`.
- `handlers/save/response-builder.ts:511`: catch-all wraps as `code: 'E081'` with summary `"An unexpected error occurred"`.

## Verification

After dropping `retentionPolicy: "ephemeral"` from the `memory_save` call:
- E081 disappears
- Save reaches the quality-gate stage (`INSUFFICIENT_CONTEXT_ABORT`), which is a structured rejection with detailed `evidenceCounts`, `qualityScore`, `qualityFlags` — exactly what we'd want from a properly-instrumented error envelope.

## Lessons

1. **The deferred council Step 5 (replace E081 catch-all with specific error codes in `response-builder.ts:511`) was the actually-critical fix.** Without it, "Governed ingest rejected" was indistinguishable from "provider failure" was indistinguishable from any other thrown error.

2. **`retentionPolicy: "ephemeral"` should either:**
   - Document that it implies full governed-ingest fields, OR
   - Fail with a SPECIFIC error like `E_GOV_EPHEMERAL_REQUIRES_FIELDS` that lists exactly what's missing.

3. **All 15 scenarios in `manual_testing_playbook/local-llm-query-intelligence/` reference `retentionPolicy: "ephemeral"`** because I (Claude) wrote them that way during the earlier scenario rewrite. They need to be updated to either:
   - Drop `retentionPolicy: "ephemeral"`, OR
   - Pass the full governance field set.

## Follow-up packets to file

- **Replace E081 catch-all with specific error codes** in `handlers/save/response-builder.ts:511`. Emit `EMBEDDING_PROVIDER_ERROR`, `GOVERNANCE_REJECTED`, `SQLITE_BUSY`, `SQLITE_LOCKED`, etc. with their actual issue lists preserved.
- **Fix or document `retentionPolicy: "ephemeral"` governance trigger.** Either remove `retentionPolicy === 'ephemeral'` from `requiresGovernedIngest()`, or update the tool description to make the implicit governance requirement explicit.
- **Update local-llm-query-intelligence scenarios 401, 411-415** to drop `retentionPolicy: "ephemeral"` (or supply governance fields). After fixing, re-run the suite via cli-codex or cli-opencode.

## Status

- Substrate: ✓ recovered (vector channel alive, hybrid search works, 190 historical failures cleared)
- retry-manager.ts patch: ✓ shipped (commit `b3363483c`)
- This follow-up: documents what the original convergence missed
