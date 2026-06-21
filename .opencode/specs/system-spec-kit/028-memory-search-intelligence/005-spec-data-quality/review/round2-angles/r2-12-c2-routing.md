# r2-12 c2-routing

**Angle summary:** The benchmark doc claims 014, 016, 017 and 018 route their metric through the 015 C2 gate, but the gate exposes no candidate-activation seam and no downstream phase names the gate's consumption artifacts, so the routing is a governance dependency rather than a wired path. The 014 dual-cache-key gotcha is the one part that is correctly identified and grounded.

Slice id: r2-12-c2-routing
Program is RESEARCH-ONLY. No gate code exists. `run-spec-recall-gate.mjs`, `spec-corpus-golden.json` and `spec-recall-baseline.json` are all absent on disk (verified). Findings target spec premises and live-code seams the specs name.

---

## FINDING 1 [P1] No candidate-activation seam: the gate cannot observe a default-off downstream change

**Type:** SPEC-PREMISE

The 015 gate runs PROMOTION and REGRESSION over "the prod profile" of the harness copy DB, but neither 015 nor any consumer specifies how a phase's default-off flag is switched ON for the measured gate run. A PROMOTION run as specified re-measures the same all-flags-off corpus the baseline was frozen from, so it observes no rise by construction. Without a flag-to-gate parameter there is no mechanism by which a candidate's change becomes visible to the prod read, which is the actual missing wiring seam under the whole "routed through the gate" claim.

**Evidence:**
- 015 modes read "the prod column" and "the prod profile" with no candidate parameter: `015-c2-prodmode-recall-gate/spec.md:78`, `015-c2-prodmode-recall-gate/spec.md:108-110`.
- grep of 015 spec, plan and tasks for `flag|SPECKIT_|env|candidate|activate|toggle` returns only template comment lines and one generic fix-addendum sentence, no activation seam.
- Each consumer states a default-off posture but none defines how the flag goes on inside the gate: `016-c3-answerable-questions-tags/spec.md:122`, `017-c4-metadata-fusion/spec.md:122`, `018-c5-llm-judge-scorer/spec.md:125`, `014-c1-chunk-prefix/spec.md:117` (REQ-004).

---

## FINDING 2 [P1] Downstream phases cite the gate by phase-name only, never its consumption artifacts

**Type:** SPEC-PREMISE

A grep across all four phase folders for `run-spec-recall-gate`, `spec-corpus-golden`, `spec-recall-baseline`, `PROMOTION` and `REGRESSION` returns zero hits. The phases instead name `run-eval-v2.mjs` directly as the metric source. Per 015's own problem statement the raw harness "performs no baseline comparison" and ships "single-target goldens that saturate and hide wins", which are exactly the two things the gate adds. The non-saturating gold set that 015 SC-003 calls the artifact making completeRecall@3 a real signal is consumed by no downstream phase. So the benchmark doc's "route their metric through the phase-015 gate" is a dependency assertion, not a wired consumption path.

**Evidence:**
- Zero artifact references in any phase folder (grep across 014, 016, 017, 018 for the five tokens above returned empty).
- 014 names the raw harness as its metric source: `014-c1-chunk-prefix/spec.md:127` (SC-002, "the prod-mode completeRecall@3 number from `run-eval-v2.mjs` dual-mode").
- 017 names the raw harness too: `017-c4-metadata-fusion/spec.md:77`.
- 015 problem statement that the raw harness lacks both gate features: `015-c2-prodmode-recall-gate/spec.md:65`. Gold set is the signal-bearing artifact: `015-c2-prodmode-recall-gate/spec.md:128` (SC-003).
- Routing claim asserted at governance level only: `benchmark-and-test-status.md:11`, `benchmark-and-test-status.md:35-40`.

---

## FINDING 3 [P2] 017 forks the harness that 015 freezes, bypassing the gate wrapper

**Type:** SPEC-PREMISE

017 sets `run-eval-v2.mjs` Change Type to Modify to add an alpha-sweep mode, while 015 sets the same file to Verify (no change) and builds the gate as a separate wrapper precisely to avoid harness edits. 017's prod@3 numbers therefore come from its own harness mode read directly, so the gate's PROMOTION and REGRESSION verdict plus baseline diff (015 REQ-002 and REQ-003) is never in 017's path. Two phase specs assign one file contradictory change-classes, and 017's metric seam runs parallel to the gate rather than through it.

**Evidence:**
- 017 modifies the harness: `017-c4-metadata-fusion/spec.md:92` (Change Type Modify, "Add an alpha-sweep mode").
- 015 freezes the same harness: `015-c2-prodmode-recall-gate/spec.md:96` (Change Type "Verify (no change)"), reinforced at `015-c2-prodmode-recall-gate/plan.md:106-107`.

---

## FINDING 4 [P2] 014 dual-cache-key gotcha is correctly identified and grounded (clean slice, with one nuance)

**Type:** LIVE-CODE

The chunk-prefix re-embed plus dual-cache-key gotcha is the well-wired part. All three seams the spec names verify accurate against the live tree, the no-op risk is flagged High with a re-embed-miss test required, and the coverage-guard "net-new" claim is true. Nuance: the persistent PK is keyed on `content_hash`, so if the prefix is prepended before the hash is computed that layer misses naturally and the explicit version fold at line 157 is belt-and-suspenders. The genuine silent-no-op exposure is the in-process LRU. The spec's both-keys fix is safe either way, so this is an observation not a defect.

**Evidence:**
- Strip points accurate inside `normalizeContentForEmbedding`: `content-normalizer.ts:218` (function start, spec says 216-231), `content-normalizer.ts:222` (stripYamlFrontmatter), `content-normalizer.ts:223` (stripAnchors), `content-normalizer.ts:228` (normalizeHeadings).
- Persistent cache primary key accurate: `embedding-cache.ts:157` (`PRIMARY KEY (content_hash, profile_key, input_kind, model_id, dimensions)`).
- In-process LRU key accurate: `shared/embeddings.ts:309-311` (`getCacheKey` hashes `${providerName}:${text}`).
- Both-keys requirement and High risk: `014-c1-chunk-prefix/spec.md:110` (REQ-002), `014-c1-chunk-prefix/spec.md:139` (Risk "Dual-cache-key no-op", High).
- Coverage-guard net-new verified: grep for `embedding_context_version|embeddingCoverage|coverageThreshold` across the skill tree (excluding specs) is empty, matching `014-c1-chunk-prefix/spec.md:138`.
