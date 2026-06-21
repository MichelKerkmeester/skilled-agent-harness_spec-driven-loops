# R2-15 Cross-Phase Citations

**Angle summary**: Audit the cross-phase dependency citations (026 before A1/B1/B2, 015 before Tier-C and 027, the parent build-order) for resolution, children_ids consistency and any dangling or circular reference.

All paths below are relative to the packet root `system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/`. The program is RESEARCH-ONLY (28 planned phases, nothing built), so every finding is a SPEC-PREMISE issue against the docs, not a LIVE-CODE issue.

## Clean baseline (what resolves)

- Every referenced phase id resolves to a real child folder: 026, 001, 011, 012, 015, 014, 016, 017, 018, 027 all exist on disk.
- `graph-metadata.json` `children_ids` (28 entries, 001 through 028) match the parent PHASE DOCUMENTATION MAP one-to-one with no missing or extra child (`graph-metadata.json:6-35` vs `spec.md:157-206`).
- The 026 reuse edge is bidirectionally consistent for A1/B1/B2: claimed at `026-shared-safe-fix-engine/spec.md:82-84,128,215` and reciprocated at `001-a1-extend-quality-loop-authored/spec.md:140`, `011-b1-scheduled-dq-sweep/spec.md:81,134,206`, `012-b2-doctor-dq-route/spec.md:89,145`.
- The 015 gate edge is bidirectionally consistent for C1/C3/C4/C5 and 027: claimed at `015-c2-prodmode-recall-gate/spec.md:139` and reciprocated at `014-c1-chunk-prefix/spec.md:137`, `016-c3-answerable-questions-tags/spec.md:132`, `017-c4-metadata-fusion/spec.md:133`, `018-c5-llm-judge-scorer/spec.md:135`, `027-retrieval-floor-experiment/spec.md:20,86`.
- The resolved edge set (015 to 027, 015 to each Tier-C item, 026 to A1/B1/B2) forms a DAG with no true cycle.

## Findings

### F1 [P1] 027 and 014 disagree on whether 027 gates the Tier-C builds (SPEC-PREMISE)

`027-retrieval-floor-experiment/spec.md:88` asserts a hard upstream edge: "the C1 and downstream Tier-C builds are gated on the verdict this phase produces". `027.../spec.md:67` reinforces it: if the tail is signal "the frozen Tier-C slate must be re-evaluated". But `014-c1-chunk-prefix/spec.md:137` lists ONLY 015 as its HARD BLOCK and frames 027 as a co-gated peer ("Every Tier-C and 027 retrieval item is gated on the prod-mode completeRecall@3 proof"), with no 027 dependency anywhere in 014. The parent build-order at `spec.md:208-211` records 015 to 027 and 015 to Tier-C but omits any 027 to Tier-C edge.

So the 027 to C1 dependency is asserted by the producer (027) and denied by the consumer (014) and absent from the parent map. A planner reading 014 or the parent map would build C1 without waiting for 027's verdict, which directly contradicts 027's own "gated" claim. This is the load-bearing citation inconsistency because it changes build sequencing.

### F2 [P2] Parent build-order makes 015 gate itself, an apparent self-loop (SPEC-PREMISE)

`spec.md:178` heads the table "Tier C retrieval, C2-gated" and lists 015 as a Tier-C row. `spec.md:183` calls 015 "the unblocker for every Tier-C item" and `spec.md:211` says 015 "ships before every Tier-C item". Read literally that includes 015 itself, so the parent topo order contains 015 before 015. The child resolves it precisely: `015-c2-prodmode-recall-gate/spec.md:139` enumerates "C1, C3, C4 and C5", excluding C2 itself. Advisory because the child disambiguates, but the parent build-order phrasing is self-referential as written.

### F3 [P2] 026 claims B3 as a dependent but 013-b3 never cites 026 (SPEC-PREMISE)

`026-shared-safe-fix-engine/spec.md:215` states the engine is "Depended on by A1, B1, B2 (and B3, C-class detectors)", and `026.../spec.md:62` says "every Tier-C retrieval detector must pass one promotion gate" registered here. But `013-b3-retrieval-feedback-edge/spec.md` carries no 026, safe-fix engine, `dq-engine`, or `detector-registry` citation at all (its only cross-phase dependency is `015-c2` at `013.../spec.md:136`, plus `learned-feedback` governance at `:137`). The parent build-order at `spec.md:210` also names only A1, B1 and B2. So the 026 to B3 edge is dangling: the producer claims the dependent, the dependent does not reciprocate, and the parent map does not record it.
