# Iteration 19: External Mining — aionforge security-model + namespace-authorization + red-team → Memory

## Focus
Round B mining (final external doc): security depth beyond C8. **Applicability lens: local single-tenant dev tool** — most multi-principal security is N/A. Read-only.

## Findings — NET-NEW candidates (4; newInfoRatio 0.40)
| Candidate | Seam | Lev/Eff | Class | Applies? |
|---|---|---|---|---|
| write-time-injection-marker-filter (strip imperative-override markers + flag at CAPTURE; ResidueRejected refusal) | redaction-gate.ts:26-27 (secrets-only, no injection markers) | H/M | BUILD | **YES** — a poisoned doc captured now injects the model on later recall; orthogonal to C8's recall-side escaping |
| memory-redteam-probe-release-gate (poisoned-RAG + query-only-injection + wrapper-breakout probes; zero-success ceiling) | tests/bm25-security.vitest.ts (no poison/injection/exfil probe) | H/M | BUILD | **YES** — this is the test gate that keeps C8 honest under both render modes |
| system-kind-exclusion-from-default-recall (exclude `system`-kind rows from default recall; admin path to surface) | write-provenance.ts:7 (SourceKind has 'system'); search-results.ts (no exclusion) | M/S | FIX | partial — cheap defense-in-depth / noise reduction |
| crafted-query-exfil-audit-without-query-text (audit a namespace denial without storing the probe text) | spec-folder-mutex.ts (TOCTOU lock, not Authorizer) | L/M | BUILD | no/partial — needs a multi-principal boundary this tool lacks |

**Already covered:** C8 (untrusted-XML wrapper); provenance surfacing (trust-badges); source-kind tagging (write-provenance.ts); secret redaction (redaction-gate.ts).

**NOT-APPLICABLE (flagged):** signed writes (Ed25519) + clock-skew + forgery probes; namespace Authorizer/Principal/visible-set; quorum promotion + subliminal-trait guard; OAuth/HTTP transport auth — all assume remote writers / multi-tenancy this stdio single-host tool lacks.

## Synthesis note
The two HIGH candidates (**write-time-injection-marker-filter** + **memory-redteam-probe-release-gate**) are the genuine net-new: they extend C8 from recall-side escaping to **capture-side blocking + a security test gate**, and both apply fully to a single-tenant tool (a poisoned doc is a real vector). The rest is correctly N/A for this deployment.

## Next Focus
Injection defense should pair with C8 (capture-block + recall-escape + test gate). Open: does `memory_ingest` bulk-import bypass the capture-time gate (highest poisoning surface)? → Round D/E.
