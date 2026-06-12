---
title: "L5 Advisor Correctness — Disposition"
description: "Verified 35/35 still-real; 16 closed (12 docs + corpus-scorer root fix, tool-named trust rejections, CLI/daemon trust-predicate alignment, server-side requiredAction). The code queue carries the routing/freshness/eval-integrity items, headed by the explicit-name misroute and substring-alias matchers."
trigger_phrases:
  - "L5 advisor disposition"
  - "advisor routing code queue"
importance_tier: "normal"
contextType: "implementation"
---
# L5 Advisor Correctness — Disposition

Batch verification 35/35 STILL-REAL (`../verify/l5-still-real-partA.md`, `partB.md`); 16 findings CLOSED (verdict `../verify/l5-batch-verdict.md`).

## Closed in code wave 4 (commit b8c6371669, Fable-verified)
tri-034 (boundary-aware alias/phrase/variant matching in the python fallback; proof prompt no longer misroutes, positive controls + 50-case regression corpus green at P0 12/12). tri-174 (dual-margin OR-composition mirroring `ambiguity.ts`; the host caught and corrected two seat deviations — AND-composition and score-keyed winner selection — that the regression corpus exposed). tri-035 (projection reads `last_updated_at ?? generated_at ?? created_at` at both sites; V2 skills now age by real content age). tri-038 (lane-weights env allowlisted through the launcher + three doc claims aligned). tri-088 (Claude hook timeout knob threaded to the native subprocess, codex parity).

## Closed in code wave 5 (Fable-verified 5/5)
tri-037 + tri-089 (both render surfaces now consume the scorer's dual-margin ambiguity signal via a shared `hasAdvisorAmbiguitySignal()` → `isAmbiguousTopTwo()`; the OpenCode bridge renders the documented ambiguous brief from both its native and CLI paths instead of silently dropping — verifier traced both call sites and confirmed score-only ties render ambiguous from dist). tri-086 (init helper rebuilds the runtime SQLite first — warm-daemon `skill_graph_scan --trusted` or direct `indexSkillMetadata()` from dist — and labels the JSON export diagnostic-only; cold path proven in isolation at 21 nodes / 77 edges). tri-098 (CLI manifest honestly documented as hand-maintained, now pinned byte-identical to TOOL_DEFINITIONS by a parity suite that deep-compares schemas). tri-172 (skill_graph_validate gained DERIVED-FRESHNESS warnings: invalid/missing derived, no parseable sync timestamp, sanitizer_version drift; doctored-DB probe fires both kinds, clean graph zero, v1 exempt).

## Code queue (open)
Closed in code wave 9: tri-033 (a verbatim own-name mention now relieves uncertainty to 0.30 before threshold refresh — the named skill passes and ranks first instead of losing to a sibling crediting that name as a keyword; corpus 50/50, P0 12/12, Fable CLOSED). tri-168 also Fable-CLOSED in wave 6.
Code-careful: tri-036 (no runtime freshness refresh), tri-040/tri-041 (corrupt-DB status/rebuild honesty — interlocked), tri-083 (local/native parity gate; land after tri-033/034), tri-156 (code-graph tool exposure seam), tri-173 (validate corpus has no real-session source), tri-180 (metrics schema).
tri-138 deferred pending consumer-aware design (memory_health budget enforcement; doctor flows read data.routing).
