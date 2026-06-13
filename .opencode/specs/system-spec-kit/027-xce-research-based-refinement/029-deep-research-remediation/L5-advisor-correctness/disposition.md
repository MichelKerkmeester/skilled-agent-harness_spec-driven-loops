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

## Closed in code wave 9 (commit be4f4b662b, Fable-verified)
tri-033 (a verbatim own-name mention now relieves uncertainty to 0.30 before threshold refresh — the named skill passes and ranks first instead of losing to a sibling crediting that name as a keyword; corpus 50/50, P0 12/12). tri-168 was Fable-CLOSED in wave 6.

## Closed in code wave 10 (gpt-5.5 xhigh read-only verified; Fable infra-down this run)
tri-040 (read-only skill_graph_status no longer triggers destructive recovery — probeStatusIntegrity reports `dbStatus:'corrupt'` + requiredAction instead of quarantining). tri-041 (readAdvisorStatus quick_checks the artifact and downgrades 'live'->'stale' on genuine corruption so advisor_rebuild repairs it; gated behind opt-in `checkArtifactIntegrity` — on for the diagnostic + rebuild pre-read, off for the per-recommendation path). tri-156 (the dispatcher's TOOL_NAMES gate is derived from CODE_GRAPH_TOOL_SCHEMAS, not a hardcoded duplicate; parity test pins it).

## Closed in round-2 (gpt-5.5 xhigh read-only verified; Fable retired)
tri-035/036 (freshness contract): the projection coalesce now leads with the canonical V2 `derived.generated_at` at both projection sites, and the author-time semantics are documented (types/lane comments + freshness_contract.md "two freshness axes") — DECISION: honest author-time contract, NOT scan-time source-file writes (a runtime refresh would churn graph-metadata.json content-hashes and break index idempotency). A freshly rebuilt skill with old derived metadata stays honestly penalized. Regression test added. Commit on branch 028.
tri-083 (local/native parity): a non-writing ratcheting differential vitest now runs the native TS scorer + local Python scorer over the 193-row labeled corpus + HARDER_INTENT_PROMPT_CORPUS and gates every top-1 divergence against an approved-divergence ledger empirically seeded with the 67 real current divergences (the honest baseline, not forced green). New drift, resolved-but-still-listed entries, and changed mismatches all fail the gate. Commit on branch 028.

## Code queue (open)
Code-careful: tri-173 (validate corpus has no real-session source — eval infra), tri-180 (metrics misroute payload schema — eval infra).
tri-138 deferred pending consumer-aware design (memory_health budget enforcement; doctor flows read data.routing).

Verifier follow-ons (recorded, not reopeners): the code-index CLI manifest keeps a separate hardcoded EXPECTED_TOOL_NAMES list — an intentional parity tripwire (it throws on mismatch), candidate to derive from CODE_GRAPH_TOOL_SCHEMAS too. The advisor_status descriptor + CLI manifest still under-advertise the pre-existing optional inputs (maxMetadataFiles, includeSemanticHealth, debug); only the newly-introduced checkArtifactIntegrity was added this wave to keep that change honest.
