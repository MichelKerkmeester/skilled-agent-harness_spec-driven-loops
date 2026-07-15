# Iteration 47 (Round O adversarial): two-primitive content-id module — COUPLING-RISK

## Focus
Verify the Wave-0 "two-primitive content-id module" is the clean-S promotion claimed. Read-only.

## Findings (newInfoRatio 0.7) — TEMPERS iter-018 ("clean S")
**VERDICT: COUPLING-RISK (with a divergence sub-risk), NOT clean-S.** Primitive A's *formula* is promotable; centralizing *identity* is not free.
- Primitive A is already 3 byte-identical copies (`memory-parser.ts:914-916`, `embedding-cache.ts:699-701`, `preflight.ts:406-407`), all bare hex no prefix — promoting the FORMULA is real.
- **Divergence risk:** save-dedup compares against the STORED bare-hex column (`save/dedup.ts:269` ← `memory-save.ts:541`). Any shared primitive that adds a `sha256:` prefix or normalization diverges from every historical row → dedup breaks against legacy data. The identity must stay byte-compatible with stored hashes.
- **Competing producers exist** (must NOT be conflated): `memory-save.ts:1034` (`sha256:`+normalizeForFingerprint), `spec-doc-structure.ts:571` (continuity fingerprint), `statediff.ts:103` (stableJson). A "shared B" must pick one canonicalizer's semantics.
- **Primitive B is receipt-specific:** `hashJson`/`normalizeForHash` strips `CLIENT_TOKEN_KEYS` (`idempotency-receipts.ts:43-52,70-72`) — correct for receipts (hash-equal across idempotency tokens), but C4-B's `derived_id` inheriting that silently alters its identity. So "one module" forces a semantics decision + parameterization. EFFORT S (Primitive A formula) → M (centralized identity w/ divergence guards).

## Most-likely-wrong
If C4-B's `derived_id` field-set never contains a client-token-named key, the stripping is a harmless no-op → Primitive B is shareable as-is, collapsing the risk back toward S.

## Next Focus
Ledger: two-primitive module = Primitive A formula promotable (S), but identity-centralization carries divergence-from-stored-hashes + receipt-semantics risk → parameterize, don't blindly share. Tempers the iter-018 "clean S."
