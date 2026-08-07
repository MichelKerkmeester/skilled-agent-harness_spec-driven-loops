# Iteration 006 — KQ6: Embedding-drift monitoring with alerting + automatic example/test generation from specs

## Focus

(a) Embedding-drift monitoring with alerting: detect when the embedding space shifts (model change, normalizer change, partial re-index) and alert before silent recall rot. (b) Automatic example + test generation from specs: an LLM derives acceptance examples or executable tests from a spec's requirements.

## What the live code actually does

- Embedding-drift: grep `embedding.?drift | detectDrift | driftMonitor` is EMPTY. No drift monitor exists. The adjacent shipped facts: `content_hash` is stored as a cache/idempotency key and never re-checked (`vector-index-schema.ts:771-785`); the reuse-first program proposed a read-time content_hash integrity check and an `embedding_context_version` coverage guard for the header-prefix re-index. So drift DETECTION substrate is partly designed but unbuilt, and ALERTING is fully net-new.
- Example/test generation: grep `generateTest | exampleGen` is EMPTY. No spec-to-test generator exists. The spec templates carry acceptance criteria (the AC_COVERAGE pattern, EARS in the reuse-first A7) but nothing generates examples or tests from them.

## The novel analysis

1. **Embedding-drift monitoring is a real correctness capability with a precise definition on this corpus.** Drift here is not abstract model drift; it is the concrete, already-named failure mode of MIXED-VERSION vectors under the floor. The parent's Stage 5 caution says partial coverage mixes prefixed and unprefixed vectors under the 3-result floor and confounds every delta. A drift monitor is exactly the instrument that makes that caution enforceable: track `embedding_context_version` coverage and the model/normalizer fingerprint per chunk, alert when a single corpus holds two embedding regimes. So drift monitoring is novel as a CAPABILITY but it is the natural guard the reuse-first re-index path needs and never specified as a standing monitor. Value: it protects every retrieval measurement from the mixed-vector confound. It bypasses the floor (it is a meta-check on the index, not a vector row).
2. **Embedding-drift ALERTING** is the thin novel layer: thresholds + a channel on top of the coverage/fingerprint read. Honest scope: alerting is wiring, the value is in the coverage+fingerprint signal underneath it.
3. **Automatic example/test generation from specs is genuinely novel and genuinely orthogonal to retrieval.** It serves the ADHERENCE reader: a spec with concrete generated examples and a test stub steers an implementing agent far better than prose requirements alone. It is floor-bypassing (it writes authored-adjacent artifacts, never a vector row for ranking). The risk is the same proxy/authorship caution as auto-rewrite, but WEAKER, because generated examples are NEW additive artifacts (a separate examples block or test file), not a mutation of the requirement prose. They are suggest-and-human-approve, never silently authoritative.

## Value per reader

- Embedding-drift monitoring + alerting: R retrieval HIGH as a measurement-integrity guard (it is what keeps a prod-mode completeRecall@3 read honest), governance high, A/L none directly.
- Example/test generation from specs: A adherence HIGH (concrete examples are the strongest adherence lever in the whole topic), L logic real (a test encodes the requirement as checkable logic), R none.

## Floor survival

Both bypass the floor. Drift monitoring is a meta-check on the index; example/test generation writes additive adherence artifacts. Neither pays the truncation tax.

## Go / No-Go

- Embedding-drift monitoring with alerting: GO-on-cost, novel as a standing monitor. Build it as the guard the reuse-first re-index path (Stage 5) already needs: per-chunk `embedding_context_version` + model/normalizer fingerprint, coverage readout, alert on mixed-regime. It is the instrument that protects C2's prod-mode read from the mixed-vector confound.
- Automatic example/test generation from specs: GO-on-cost, novel, distinct, the strongest adherence capability surfaced. Build suggest-only, additive (a generated-examples block + an optional test stub), human-approved, never a silent rewrite of requirement prose. Pairs naturally with the reuse-first EARS/AC_COVERAGE work as its downstream consumer.

## Dead Ends

- Drift monitoring as model-version abstraction: the concrete, measurable drift here is mixed-version vectors under the floor; track that, not a generic embedding-space metric.
- Auto-generated tests written as authoritative: must be suggest-and-approve, additive artifacts, never silent — same authorship rail as auto-rewrite, applied to a weaker (additive) surface.

## Sources

- grep `embedding.?drift|detectDrift|generateTest|exampleGen` = EMPTY (net-new)
- `vector-index-schema.ts:771-785` (content_hash stored, never re-checked)
- Parent Stage 5 (partial coverage mixes prefixed/unprefixed vectors under the floor — the drift failure mode)
- Reuse-first A7 EARS/AC_COVERAGE (the host surface that example/test generation feeds)

## Assessment

newInfoRatio 0.62 — two clean novel GO-on-cost capabilities, both floor-bypassing. Drift monitoring is reframed precisely as the mixed-vector guard the re-index path needs; example/test generation is the strongest adherence lever in the topic and dodges the auto-rewrite rail by being additive and human-approved.
