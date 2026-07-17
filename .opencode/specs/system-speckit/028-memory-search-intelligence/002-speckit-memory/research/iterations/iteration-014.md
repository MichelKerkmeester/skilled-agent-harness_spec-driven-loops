# Iteration 14: External Mining — aionforge identifiers.md + provenance-signing.md → Memory

## Focus
Round B mining: identifiers + provenance-signing for NET-NEW Memory candidates beyond C4-B/C5. Read-only. **Applicability lens: this is a local single-trusted-host MCP** — full writer-signing is likely out-of-scope; the transport-agnostic hardening it implies is the real value.

## Findings — NET-NEW candidates (7; newInfoRatio 0.75)
| Candidate | Seam | Lev/Eff | Class | Conf | Applies? |
|---|---|---|---|---|---|
| dual-class identity (time-ordered v7 capture ids + content-addressed v8 derived ids; non-sortability as honest signal; time never inferred from id) | memory-index.ts:281; idempotency-receipts.ts:81-97; causal-edges.ts:140 (numeric autoincr) | M/S | PROMOTE | yes |
| clock-skew replay window (refuse writes deviating > tol; wall-clock accept/reject only, never stored; bounds replay/storm) | idempotency-receipts.ts:180,143-205 (no recency bound) | M/S | BUILD | yes |
| id-collision guard separate from content-hash dedup (content-hash keys on CONTENT; id-uniqueness needs its own guard) | idempotency-receipts.ts:87-97,180 (keys on content) | M/S | FIX | yes |
| oracle-resistant rejection errors (coarse caller error; availability-fault ≠ security audit) | idempotency-receipts.ts:233-240 (emits specific cause) | M/S | BUILD | yes |
| writer provenance signing (host signs, substrate verifies w/ public key; fail-closed enrollment) | GAP (ln lineage unsigned) | L/L | BUILD | scope-flag (single-tenant: likely no) |
| signature binds who/which/when not what (domain-separated, length-prefixed, version-byte canonical) | idempotency-receipts.ts:81-97 (canonicalization) | L/M | BUILD | scope-flag |
| audit-channel self-attestation + "derived memory stays unsigned" boundary | causal-edges.ts:434,1025 (derived lineage unsigned) | M/L | BUILD | partial |

**Already covered:** C4-B (content-addressed derived ids), C5-A/B (determinism serialization).

## Synthesis note
The **transport-agnostic hardening** (clock-skew window, id-collision guard, oracle-resistant errors, dual-class identity) applies cleanly and is S-effort; the **writer-signing trio** (B/C/G) is scope-flagged for a single-trusted-host tool — record but do not promote ahead of the hardening set.

## Next Focus
The 4 S-effort hardening candidates (dual-class id PROMOTE + clock-skew + id-collision + oracle-errors) are a clean determinism/idempotency sub-cluster pairing with C4-A. Signing trio deferred on applicability.
