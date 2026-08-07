---
title: "L6 Save/Continuity Truth — Disposition"
description: "Verified 17/17 still-real; 8 doc fixes closed (incl. the parser-form template fix the verifier caught live) + the advertised-vs-enforced budget alignment. Code queue: metadata refresh on MCP saves, phase-parent resume redirect, priming budget, index-policy pair, two test-only suites."
trigger_phrases:
  - "L6 continuity disposition"
  - "save truth code queue"
importance_tier: "normal"
contextType: "implementation"
---
# L6 Save/Continuity Truth — Disposition

Batch verification 17/17 STILL-REAL (`../verify/l6-still-real-batch.md`); doc batch CLOSED (verdict `../verify/l6-l7-docs-verdict.md`, three INCOMPLETEs remedied in-commit — notably the handover-template label form that parsed to null). tri-139 (advertised 800 vs enforced 1000) fixed by aligning the four schema descriptions with layer-definitions.

## Closed in code wave 6 (commit 4913ddf6f9, Fable-verified 5/5 with tri-168)
tri-015 (memory_save success responses carry a structured `metadataRefresh: refreshed=false` advisory + hint on mutating canonical-doc saves; the CLI front door inherits it through the same daemon handler; never on metadata/constitutional targets or non-mutating statuses). tri-020 (the resume ladder performs the documented phase-parent redirect — both pointer shapes, per-hop child validation, bounded depth, escape-safe; live-proven on the 026 parent, stale/crafted pointers refused). tri-130 + tri-132 (stress floors: promoter idempotency/tombstoning at volume against the real `promoteMetadataEdges`; BM25 scope-then-limit at a 2,250-candidate set forcing chunked metadata resolution through the production SQL, with adversarial oracle ordering).

## Code wave 7 (implemented, in verification)
tri-140 (over-budget envelopes slim `meta.sessionPriming` FIRST — trimmed marker + constitutionalCount + primePackage — then re-measure before any results truncation; the false over-budget warning is gated on a recheck). tri-189 + tri-191 (one coherent index policy: review-report.md is a first-class spec document at `<packet>/review/`, the blanket '/review/' exclusion is gone in favor of the filename allowlist, and iteration packs' backfilled description.json/graph-metadata.json are classifiable and discoverable while iteration working files stay out).

## Code queue (open)
| Finding | One-line | Class |
|---|---|---|
| tri-163 | key_files vs COVERED_BY coverage crosswalk — needs a designed join between skill metadata and the deep-loop coverage graph; do not rush as a patch | code-careful (feature gap) |
