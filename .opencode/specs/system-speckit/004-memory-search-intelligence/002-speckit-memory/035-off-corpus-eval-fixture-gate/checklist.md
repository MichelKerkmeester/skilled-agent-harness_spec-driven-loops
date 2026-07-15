---
title: "Verification Checklist: Off-Corpus Eval Fixture and False-Confirm Gate [template:level_2/checklist.md]"
description: "Verification Date: Pending (scaffold, not yet verified)"
trigger_phrases:
  - "off corpus eval fixture"
  - "false confirm gate"
  - "kubernetes regression anchor"
  - "false good on hard negatives"
  - "off corpus hard negative class"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/035-off-corpus-eval-fixture-gate"
    last_updated_at: "2026-07-04T17:50:58.258Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified the off-corpus fixture, the false-confirm driver and the gate, all checks pass"
    next_safe_action: "Hand the fixture to the downstream lexical-grounding floor phase that this guard validates"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/false-confirm-eval.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-025-off-corpus-eval-fixture-gate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Off-Corpus Eval Fixture and False-Confirm Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Confirmed `computeCitabilityConfusionMetrics` export at `eval-metrics.ts:885-902`, the six in-corpus decoys (ids 92-97) carry relevance-3 targets, and the active embedder reads from `vec_metadata`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The driver imports `computeCitabilityConfusionMetrics` from the existing module and re-implements no part of it, asserting the export exists at import and failing with a contract error otherwise
- [x] CHK-011 [P0] The live run emits the report cleanly, the only stderr line is the harness token-budget info log shared with the sibling drivers
- [x] CHK-012 [P1] Handled: `resolveOffCorpusClass` throws on a drifted target, `parseMaxRate` rejects non-numeric and out-of-range, an empty class throws, the import contract check fails loudly on a renamed metric
- [x] CHK-013 [P1] Follows the `run-eval-v2.mjs` copy-DB discipline, the same embedder read, the same invoked-directly guard, and exports pure helpers for the vitest
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001 through REQ-006 met, evidenced in implementation-summary.md
- [x] CHK-021 [P0] The vitest asserts zero relevance rows per `off_corpus` query, no fabricated targets, disjointness from the in-corpus decoys, the kubernetes anchor present, and `resolveOffCorpusClass` throwing on a drifted target
- [x] CHK-022 [P1] Verified live: env unset exits 0, grandfather at a 0.0 bar exits 0, env 0.0 below the 0.833 rate exits 1, env 0.9 above the rate exits 0, a non-numeric env exits 1 at parse
- [x] CHK-023 [P1] The report carries the embedder block (`nomic-embed-text-v1.5`) and the scored off-corpus terms, the fixture asserts good-is-wrong qualitatively with no baked cosine number
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The one integration finding (the per-query target gate rejecting the new zero-target class) is class `cross-consumer`, the validator and the legacy test both consume the query-category contract
- [x] CHK-FIX-002 [P0] Producer inventory by grep: `off_corpus` and `falseGoodOnHardNegatives` have a single producer each (the fixture and the dormant metric), no sibling producers to update
- [x] CHK-FIX-003 [P0] Consumer inventory of the changed `QueryCategory` and the target gates ran the 10 eval/scoring test files that import these modules, all 212 passed
- [x] CHK-FIX-004 [P0] The env parser carries an adversarial table in the vitest: unset, empty, whitespace, numeric in-range, non-numeric, negative, above-one
- [x] CHK-FIX-005 [P1] Matrix axes listed: env unset, above the rate, below the rate, grandfather, non-numeric, empty class, drifted target, all exercised by the vitest or the live run
- [x] CHK-FIX-006 [P1] Hostile env variant executed: a non-numeric `SPECKIT_FALSE_CONFIRM_MAX_RATE` exits 1 at parse live, and `parseGrandfather` is tested over env and argv
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working-tree diff named in implementation-summary.md, the change is uncommitted by instruction
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The driver reads a read-only tempdir backup of the live DB and the fixture, it never mutates the live DB and reads no new untrusted input
- [x] CHK-032 [P1] `parseMaxRate` rejects a non-numeric or out-of-range env at parse rather than silently disabling the gate, proven live and in the vitest
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] tasks.md, checklist.md and implementation-summary.md synchronized to the shipped state
- [x] CHK-041 [P1] The driver and the fixture carry durable WHY comments, no artifact ids or spec paths embedded
- [x] CHK-042 [P2] N/A, eval-driver envs are not registered in ENV_REFERENCE.md, the sibling `SPECKIT_EVAL_V2_*` driver envs are absent there too, the env is documented in the driver header instead
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The driver writes its report to `/tmp` only, no scratch artifacts land in the repo
- [x] CHK-051 [P1] No scratch directory created, nothing to clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 (N/A) |

**Verification Date**: 2026-06-22
<!-- /ANCHOR:summary -->

---
