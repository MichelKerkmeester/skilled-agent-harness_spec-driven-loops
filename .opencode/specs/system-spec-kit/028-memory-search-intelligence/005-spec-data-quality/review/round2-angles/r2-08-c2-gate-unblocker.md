# r2-08 c2-gate-unblocker (angle: architecture)

**Angle summary:** Treating 015-c2 as the single promotion path for C1, C3, C4, C5 and 027 is structurally reasonable as a regression tripwire, but the design concentrates four-plus phases onto one frozen hand-labeled gold set with one of its three classes measured by a metric that cannot see what that class exists to test, no held-out split, and no interaction guard, so the keystone is weaker than the verdict claims.

**Scope checked (clean where noted):**
- The gate gates on the prod-column absolute completeRecall@3 (spec.md REQ-001), NOT on the eval-vs-prod fidelity delta. The fidelity delta is the diagnostic that motivated the gate (the 5.9x gap), the prod column is the verdict input. Gating on what users actually get rather than on the gap is the RIGHT call and is clean.
- Load-bearing problem-statement claims verified against live code: `DEFAULT_MIN_RESULTS = 3` at `confidence-truncation.ts:35` (exact), the line-361 export `{ buildSearchLenses, meanCompleteRecallProfile, diffProfiles, MEASURABILITY_CLASSES, COMPLETE_RECALL_KS }` exists exactly (`run-eval-v2.mjs:361`), and the `process.exitCode = 1` crash handler is at `run-eval-v2.mjs:357` (exact).

---

## FINDING 1 — P1 — hard_negative is a gated class but completeRecall@3 is structurally blind to the negative

**Evidence:**
- LIVE: `run-eval-v2.mjs:51-55` freezes `MEASURABILITY_CLASSES = ['thematic_multi_target', 'causal_chain', 'hard_negative']` and the harness scores a per-class `prodMode` completeRecall@3 row for each (`run-eval-v2.mjs:304-319`).
- LIVE: `eval-metrics.ts:380-382` builds `relevantIds` from `groundTruth.filter(e => e.relevance > 0)` and returns `hits / relevantIds.size` (`eval-metrics.ts:395`). The metric only sees positive targets.
- SPEC: spec.md REQ-004 requires every query across the enumerated classes (hard_negative included) to carry a relevance set of length 2 or more, and REQ-006 records completeRecall@3 per class.

**Issue:** A hard-negative query exists to prove a plausible-but-wrong doc is NOT surfaced. completeRecall@3 measures only whether positive targets are recalled and is mathematically incapable of penalizing a distractor that appears in the top 3. Gating the hard_negative class on completeRecall@3 produces a number that does not reflect the property the class is named for, so any downstream phase "passing" or being unable to move that class is reading a meaningless signal.

**Classification:** SPEC-PREMISE (the gate design pairs a precision-class with a recall-only metric), grounded in live code.

---

## FINDING 2 — P1 — one frozen hand-labeled gold set, no held-out split, four-plus phases optimizing the same fixed target (Goodhart)

**Evidence:**
- SPEC: the gate promotes only on a prod completeRecall@3 RISE over a stored baseline (spec.md REQ-003) read from a single `spec-corpus-golden.json` (spec.md §3 Files to Change).
- SPEC: every downstream item names this one gate as its shared unblock condition: `014-c1-chunk-prefix/spec.md:20,57`, `016-c3-answerable-questions-tags/spec.md:132`, `017-c4-metadata-fusion/spec.md:133`, `018-c5-llm-judge-scorer/spec.md:135`, `027-retrieval-floor-experiment/spec.md:138`.
- CHECKED ABSENT: no held-out, cross-validation, second-corpus or train-test mention anywhere in `015-c2-prodmode-recall-gate/` (grep returned nothing).

**Issue:** Four-plus retrieval-class changes will each be tuned until they raise completeRecall@3 on the same small frozen hand-authored set. With no held-out split the gate stops measuring "retrieval improved" and starts measuring "the change overfit the gold set." This is the core risk of making four phases depend on one gate, and it is the thing most likely to make the gate confidently wrong.

**Classification:** SPEC-PREMISE.

---

## FINDING 3 — P1 — no compositional guard and unspecified baseline re-freeze, three fusion-touching phases against one static baseline

**Evidence:**
- SPEC: REQ-002 and REQ-003 compare against "the stored baseline" with no statement of whether the baseline re-freezes after each promotion or whether the gated phases are forced serial.
- LIVE-EVIDENCED OVERLAP: three of the gated phases all modify the SAME file. `016-c3` (4 mentions of `stage2-fusion.ts`), `017-c4` (4 mentions), `018-c5` (4 mentions), each adding a flag-gated input next to the validation-multiplier seam at roughly `stage2-fusion.ts:260-289`.
- SPEC: the only open question on calibration (spec.md §10) concerns per-class thresholds, not interaction or re-freeze ordering.

**Issue:** If C3, C4 and C5 each measure in isolation against the same frozen baseline, each can show a rise while two of them combined regress, because they edit the same fusion stage. A single promotion path for four phases needs an interaction or re-baseline rule and the spec defines none. This is concrete, not hypothetical, because the overlap is in live file targets.

**Classification:** SPEC-PREMISE, with live-code evidence of the shared mutation surface.

---

## FINDING 4 — P2 — the "two narrow files" verdict understates gate-owned orchestration, and the re-implemented glue is the part most able to make the prod number wrong

**Evidence:**
- SPEC: spec.md §11 verdict frames the build as "two narrow files reusing the export," and REQ-005 limits reuse to `buildSearchLenses`, `meanCompleteRecallProfile` and `MEASURABILITY_CLASSES`.
- LIVE: the gate must re-own everything the line-361 export does NOT cover. `groupGroundTruth` is private (`run-eval-v2.mjs:200-211`, not in the export), the six dynamic imports are in `main()` (`run-eval-v2.mjs:259-266`), db init plus `hybridSearch.init` are at `268-270`, the MEMORY_DB_PATH swap and `SPECKIT_ABLATION='true'` are at `256-257`, and the retrieval loop is at `286-289`.

**Issue:** The "reuse the harness so it cannot drift" safety claim only covers the lens body. The wiring that actually determines the prod completeRecall@3 number is the un-shared re-implemented part. If the gate's copy of that orchestration diverges from the harness (forgets `SPECKIT_ABLATION`, the env swap or a channel option) the gate reads a different prod column than the harness, and every downstream verdict is silently miscalibrated. For the keystone instrument the highest-risk code is the code the reuse boundary excludes.

**Classification:** SPEC-PREMISE, grounded in the exact unexported live seams.

---

## FINDING 5 — P2 — the gold-set labels are the program's highest-leverage correctness surface yet carry no provenance or integrity gate, while sibling phases build exactly that for other artifacts

**Evidence:**
- SPEC: the verdict for C1, C3, C4, C5 and 027 is only as correct as the relevance labels in `spec-corpus-golden.json`, authored as a one-pass task (`spec.md` continuity `last_updated_by: "markdown-agent"`, `recent_action` authored from research.md) with no integrity, provenance or second-review acceptance criterion in REQ-001 through REQ-006.
- SPEC SIBLINGS: the same 005 program builds `008-a8-surface-provenance-fields` and `009-a9-content-hash-integrity` for other surfaces.

**Issue:** A single mislabeled target (an irrelevant memoryId marked relevant, or a missing relevant sibling) silently corrupts every downstream promotion and regression decision across the whole retrieval tier. The keystone gold set exempts itself from the integrity discipline the program is building for less load-bearing artifacts. Advisory because it is a process gap rather than a code defect, but it is the highest-leverage one.

**Classification:** SPEC-PREMISE.

---

**Counts:** P0 = 0, P1 = 3, P2 = 2.
