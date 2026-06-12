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

## Code queue (open)
| Finding | One-line | Class |
|---|---|---|
| tri-015 | MCP-routed canonical saves leave description.json/graph-metadata stale (advisory follow-up only) | code-small |
| tri-020 | direct session_resume lands on phase parent, not active child | code-careful |
| tri-130 | promoter durability at scale — test-only suite | code-small |
| tri-132 | scope-then-limit stress near SQLite param limits — test-only suite | code-small |
| tri-140 | first-call priming dominates low-budget envelopes (sequence after the budget source-of-truth fix, now landed) | code-careful |
| tri-163 | key_files vs COVERED_BY coverage crosswalk | code-careful (feature gap) |
| tri-189/tri-191 | index-policy pair: review-report allowlisting + iteration-metadata classification — one coherent policy edit | code-careful |
