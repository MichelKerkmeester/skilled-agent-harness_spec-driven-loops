---
title: "Verification Checklist: skill_graph_propagate_enhances MVP [template:level_2/checklist.md]"
description: "Verification Date: 2026-05-15"
trigger_phrases:
  - "026 checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/007-cross-skill-enhancement-edge-propagation"
    last_updated_at: "2026-05-15T15:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author checklist"
    next_safe_action: "Dispatch SWE-1.6"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-cross-skill-init"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions: []
---
# Verification Checklist: skill_graph_propagate_enhances MVP

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Evidence format: `[EVIDENCE: <file>:<lines> — <one-line note>]`. P0 items MUST have evidence before claiming completion.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Spec.md requirements documented (REQ-001..REQ-016)
- [ ] CHK-002 [P0] Plan.md architecture defined with detailed function signatures + data flow
- [ ] CHK-003 [P1] Codex research evidence cited as the design baseline
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] TypeScript typechecks cleanly: `npm run typecheck` exit 0
- [ ] CHK-011 [P0] No `any` types in public interfaces (types.ts) — use explicit interfaces
- [ ] CHK-012 [P1] Module separation honored: `lib/cross-skill-edges/` does NOT import from `lib/skill-graph/` per codex recommendation (separation between source-metadata operations and runtime SQLite indexing)
- [ ] CHK-013 [P1] Functions match the plan's TypeScript sketches in shape — same signatures, same names
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 3 vitest fixtures PASS (Fixture A: cli-family arrival → 2 candidates; Fixture B: non-family arrival → 0; Fixture C: idempotent re-run → 0)
- [ ] CHK-021 [P0] Full test suite has no regressions: `npm test` exit 0 with same pass count + new 3 tests
- [ ] CHK-022 [P0] Manual smoke 1 verified: invoking tool against current HEAD returns `candidates: []` (REQ-001)
- [ ] CHK-023 [P1] Manual smoke 2 verified: synthetic-removal round-trip detects + applies + idempotent re-run
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each detector emits ONLY `enhances` edge_type (hardcoded; tested by Fixture C asserting no other edge types in output)
- [ ] CHK-FIX-002 [P0] Idempotence guard tested — apply same candidate twice → 1 edge, not 2
- [ ] CHK-FIX-003 [P0] Auto-marker fields (`auto_added_at`, `auto_added_reason`) present on every applied edge
- [ ] CHK-FIX-004 [P0] Weight clipped to [0.3, 0.7] — tested with synthetic weight 0.9 input → output 0.7
- [ ] CHK-FIX-005 [P1] Adversarial test: source skill with same family as target (cli enhancing cli) → 0 candidates from family-inference (no self-enhance)
- [ ] CHK-FIX-006 [P1] Adversarial test: source skill with malformed graph-metadata.json → error captured, other skills still processed
- [ ] CHK-FIX-007 [P1] Evidence pinned to file paths within this commit — implementation-summary.md table cites concrete LOC counts
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in any new file
- [ ] CHK-031 [P0] Apply mode writes confined to `.opencode/skills/*/graph-metadata.json` — path traversal guarded
- [ ] CHK-032 [P1] No LLM calls at runtime in detector or apply — deterministic templating only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] implementation-summary.md filled with concrete file paths + LOC + verification table
- [ ] CHK-041 [P1] Function-level JSDoc on public entry points (propagateInboundEnhances, detectInboundEnhances, applyEnhanceEdge)
- [ ] CHK-042 [P2] sk-doc validate passes on the phase folder docs
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] All new TS files under `lib/cross-skill-edges/` (separate from `lib/skill-graph/`)
- [ ] CHK-051 [P1] Test fixtures live under `tests/fixtures/cross-skill-edges/` (do not pollute existing fixture dirs)
- [ ] CHK-052 [P1] scratch/ in phase folder cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: TBD (filled post-implementation)
<!-- /ANCHOR:summary -->
