# Iteration 21 (Round M): Verify the 028-roadmap content-hash mis-citation

## Focus
Verify L8's claim that `roadmap.md:33` mis-cites `memory-index.ts:281` as the C4-B sha256 base. Read-only.

## Findings (newInfoRatio 0.35)
**RESOLUTION: MIS-CITATION CONFIRMED.** `memory-index.ts:281` is the `createHash('sha256')` line *inside* `createScanKey` (`:272`) — it hashes scan OPTIONS (`spec_folder, force, incremental,…`) and truncates to 16 chars (a request-cache key, `:273-284`). NOT a content hash.
- **Primitive A** = `computeContentHash(parsed.content)` (content-body, `memory-save.ts:541`).
- **Primitive B** = `hashJson` = `sha256(JSON.stringify(normalizeForHash(value)))` full-length (`idempotency-receipts.ts:81-85`); `normalizeForHash` recursively sorts keys + strips client tokens (`:59-102`).
- For C4-B's `derived_id = sha256(canonical-triple+source+rule_version)` (a field-set hash), **Primitive B is the structurally correct base.** The 028 roadmap shared-infra row should be corrected.

## Most-likely-wrong
Verified only computeContentHash's call site (`:541` passes `parsed.content`), not its definition in memoryParser — if it folds in metadata, "content-body only" is slightly off.

## Next Focus
Carry the correction to the 028 roadmap edit (M9) + the ledger shared-infra section. Confirms the two-primitive module shape.
