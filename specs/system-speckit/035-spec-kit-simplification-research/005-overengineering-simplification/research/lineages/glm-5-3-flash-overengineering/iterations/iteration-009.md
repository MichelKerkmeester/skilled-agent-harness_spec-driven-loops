# Iteration 009 — Census: the carried mysteries, resolved or sharpened (cross-cutting)

Session: fanout-glm-5-3-flash-overengineering-1788746122749-wk19z4 | run 9 | focus: the fingerprint twins, the baselines→replay trace, the playbook-vs-vitest relationship
Evidence reads: twin-summary diff (84 lines), baseline-producer grep (3 bench files), playbook-citation grep (1 scenario, 0 hits), continuity-freshness.ts:60-62 + LOC. Reads cost: 3 shell calls.

## What the census found

- **The 56e8ccee twins**: `028-cli-hub-rename/002-advisor-realign/implementation-summary.md` vs `…/004-verify-closeout/implementation-summary.md` — 84 differing lines (titles/descriptions differ at :2-3), SAME stored fingerprint. The freshness checker (`runtime/cli/validation/continuity-freshness.ts`, 608 LOC) pins the covenant to "the only document the continuity writer ever stamps with a real fingerprint" (:60-62) — it names the *stamped document's* uniqueness, not the *hashed input's* scope; the governance clause says "the stored `session_dedup.fingerprint` matches recomputed content" without defining the content either. Three layers, none states what is hashed.
- **The baselines**: produced by the perf benches — `runtime/tests/local-llm-features/performance/{cold-start,throughput,embedding-latency}.bench.ts` — NOT by the optimizer's replay machinery. Run 7's F23 uncertainty (baselines as the replay's plausible consumer) dissolves: the optimizer's promotion tail now has 0 recorded promotions (run 7: empty `promotion-reports/`) AND no in-boundary consumer for its replay+promote scripts (the advisor — their production consumer — sits outside this lineage's evidenceBoundary and is recorded UNKNOWN, not 0).
- **The playbook**: `exhausted-approach-respect.md` = 138 lines, **0 references** to any vitest/test file. Sampled n=1 of 85.

## Findings

**F30 [P2 — candidate] The freshness covenant's discriminating power, measured: 2 of 6 sampled real fingerprints are identical across packets differing by 84 lines — and the hashed input is defined nowhere the covenant is stated.**
- Where: `continuity-freshness.ts:60-62` (stamped-DOC uniqueness, hashed-CONTENT unstated); governance clause (root doc, Completion Verification Rule item 4: "matches recomputed content"); the twins: `028-cli-hub-rename/002-advisor-realign` vs `004-verify-closeout` (84-line diff, one `sha256:56e8ccee`).
- Cost: answering "what does the covenant's primitive actually attest" = 3 greps + 1 unresolved diff; 1,084 fingerprint-eligible packets (F27's 38%) inherit whatever the unstated scope turns out to be. Either the continuity block was copied between the two packets (2 packets, 1 identity — an adherence artifact) or the hash covers a narrow slice (2 documents, 1 hash — a discrimination artifact); both readings survive the evidence.
- Protects: completion-claim freshness — the covenant works, its *vocabulary* is the gap (the F14 pattern, now at the covenant's primitive).
- Recommendation: **merge** — one clause in `continuity-freshness.ts:60-62` naming the hashed input ("the fingerprint covers X"); 1 sentence, closes the 3-layer vocabulary gap.

**F31 [P2 — candidate] The manual-testing playbook is a parallel proof convention whose 85 scenarios cite, in the sample of 1, zero of the vitest suites they shadow — 11,839 lines of unverifiable-by-reader provenance.**
- Where: `exhausted-approach-respect.md` (138 lines, 0 vitest/test references — the only sampled scenario); the playbook tree: 85 md / 11,839 lines (run 4); the apparatus it parallels: `runtime/tests/` (vitest) — which the governance completion rule DOES covenant (validate/test gates), unlike the playbook.
- Cost: a reader cannot tell whether a scenario duplicates, shadows, or contradicts the suites; the 4-apparatus question (run 7 prose: tests/ vs benchmark/ 151 files vs playbook 85 vs optimizer-replay) stays unresolvable at the corpus level without reading both sides. What it protects: harness-free behavioral verification — a genuine capability (the "manual" in the name).
- Recommendation: **keep** the playbook; **merge** provenance — one "shadows: `<file>.vitest.ts#<test>`" line per scenario, which converts 11.8k lines of orphan proofs into a traceable second opinion. (n=1 sample; the other 84 scenarios are recorded UNKNOWN, not assumed.)

## Corrections (close carried uncertainties)

- **F23 strengthened**: the performance baselines trace to the `.bench.ts` benches, not the optimizer replay; the promotion tail's in-boundary consumer count is 0 (advisor consumption recorded UNKNOWN — outside evidenceBoundary).
- **F25 reframed**: the `shared/` embeddings+RRF machinery (1,853+ LOC) is the shared package's fleet payload — consumption outside this skill's boundary is the design (the 003-shared-package-utilization packet exists to audit exactly that); "in-boundary consumers = tests/benches only" is the design working, not orphaned machinery. Severity stands P2, the framing corrected.

## Not pursued here

- The remaining 84 playbook scenarios' citation coverage (UNKNOWN); the hashed input inside `generate-context.ts` (1 further grep — the 1-clause fix at the checker does not require it); the advisor's out-of-boundary consumption (per the evidenceBoundary, recorded UNKNOWN, not 0).
