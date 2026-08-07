# Iteration 18 (Round L): Content-addressed-identity shared-infra synthesis (Q2+Q10 thread)

## Focus
Cross-cut: should 027+028 build ONE shared content-addressed-identity module, or separate hashes? Map canonical-field inputs. Read-only.

## Findings (newInfoRatio 0.7)
**SYNTHESIS: HYBRID — one canonicalization PRIMITIVE, two field-domains, NOT one hash.**
- **Primitive A — content-body identity** = PROMOTE 027's `computeContentHash(content)` (`memory-save.ts:541`, content-body text only). Consumers: save dedup (`save/dedup.ts:269`), Q2 ingest-dedup, C5-B recall tie-break (`ORDER BY score DESC, content_hash ASC` — no new hash), embedding-cache key.
- **Primitive B — canonical field-set identity** = PROMOTE `hashJson`+`normalizeForHash` (`idempotency-receipts.ts:59-102`, recursive sorted-keys + drop-undefined + strip client tokens). Consumers: C4-A receipt key `{operation,contentHash,requestFingerprint}` + C4-B derived_id `{source,target,relation,source,rule_version}`. Only C4-B's hash is net-new.
- **CORRECTION TO THE 028 ROADMAP:** `roadmap.md:33` (and the shared-infra row) cite `memory-index.ts:281` as the sha256 base — that is actually `createScanKey`, a 16-char hash of scan *options*, request-cache-local. The true content base is `computeContentHash` (`memory-save.ts:541`); the true canonical-field hasher is `hashJson` (`idempotency-receipts.ts:81`). LEVERAGE M, EFFORT S-M (mostly promotion of two existing helpers).

## Most-likely-wrong
That `memory-index.ts:281-284` is the reusable content base — both the task framing AND the 028 roadmap assume it; it is `createScanKey`. (This IS the correction; flagged so a verifier double-checks `computeContentHash` is the genuine content hasher.)

## Next Focus
Round M: verify the mis-citation definitively (M1) — it's a correction to the 028 roadmap's shared-infra row. The two-primitive shape feeds the ledger's shared-infra plan.
