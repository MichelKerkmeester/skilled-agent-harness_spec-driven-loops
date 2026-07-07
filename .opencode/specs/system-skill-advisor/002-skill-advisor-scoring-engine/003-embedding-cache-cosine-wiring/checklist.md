---
title: "Checklist: Skill embedding cache and cosine-similarity lane wiring"
description: "QA gates for the embedding-cache + cosine-lane shadow implementation."
trigger_phrases:
  - "skill embedding checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/002-skill-advisor-scoring-engine/003-embedding-cache-cosine-wiring"
    last_updated_at: "2026-05-13T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded checklist.md"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high"
    blockers: []
    key_files:
      - "checklist.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Skill embedding cache and cosine-similarity lane wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [ ] CHK-200 [P0] Strict spec validation executed on this packet.
- [ ] CHK-201 [P0] Strict spec validation executed on parent 015 packet.
- [ ] CHK-202 [P0] `npm run typecheck` executed from `mcp_server/`.
- [ ] CHK-203 [P0] `npm exec -- vitest run skill_advisor` executed.
- [ ] CHK-204 [P1] Dist rebuilt via `npx tsc --build`.
- [ ] CHK-205 [P1] Live probe via cli-opencode confirms lane match payload in recommend response.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-210 [P0] Existing skill-graph schema reviewed.
- [ ] CHK-211 [P0] `factory.ts:resolveProvider()` return shape confirmed.
- [ ] CHK-212 [P0] `lane-registry.ts` shadow-only pattern understood.
- [ ] CHK-213 [P1] Existing skill_advisor Vitest fixtures inventoried so snapshot tests stay valid.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] Code passes lint/format checks.
  - **Evidence**: typecheck + Vitest output.
- [ ] CHK-011 [P0] No console errors or warnings.
  - **Evidence**: Vitest run output.
- [ ] CHK-012 [P1] Error handling implemented.
  - **Evidence**: embed call wrapped in try/catch with deferred-vector fallback.
- [ ] CHK-013 [P1] Code follows project patterns.
  - **Evidence**: lane file uses existing `LaneMatch` shape; migration uses existing pattern.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] All acceptance criteria met.
  - **Evidence**: SC-001 through SC-006 in spec.md verified.
- [ ] CHK-021 [P0] Vitest suite under skill_advisor passes.
  - **Evidence**: `npm exec -- vitest run skill_advisor` clean run.
- [ ] CHK-022 [P1] Cosine math correctness covered.
  - **Evidence**: fixture-vector test.
- [ ] CHK-023 [P1] Shadow-only invariant verified.
  - **Evidence**: snapshot test confirms recommend output unchanged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] Same-class producer identified.
  - **Evidence**: embedding-cache pattern (skill side) introduces no parallel embedding pipeline.
- [ ] CHK-FIX-002 [P0] Consumer inventory completed.
  - **Evidence**: advisor recommend handler, fusion scorer, lane registry.
- [ ] CHK-FIX-003 [P1] Matrix axes listed before completion.
  - **Evidence**: shadow vs live (live: false this packet) and embedded vs token-overlap (cosine this packet).
- [ ] CHK-FIX-004 [P1] Evidence pinned to explicit paths.
  - **Evidence**: paths in plan.md ARCHITECTURE table.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-220 [P0] No new credentials introduced; embed call uses existing factory.ts cascade.
- [ ] CHK-221 [P0] Vectors stored in `skill-graph.sqlite`, no cross-DB leakage.
- [ ] CHK-222 [P1] Prompt embedding passes only the prompt text; no secrets or env leakage.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized.
  - **Evidence**: all four reference the same scope.
- [ ] CHK-041 [P1] Code comments adequate.
  - **Evidence**: lane file documents the shadow-only invariant and the cosine formula.
- [ ] CHK-042 [P2] README updated if applicable.
  - **Evidence**: not required; not user-facing.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-230 [P0] New lane file at `scorer/lanes/semantic-cosine.ts` (or replaces `semantic-shadow.ts`).
- [ ] CHK-231 [P0] Schema migration colocated with existing `skill-graph-db.ts` pattern.
- [ ] CHK-232 [P1] Vitest tests under `skill_advisor/lib/scorer/` mirror lane structure.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All CHK-* P0 items checked | Pending |
| All CHK-* P1 items checked | Pending |
| Strict spec validation passes | Pending |
| Vitest skill_advisor suite passes | Pending |
| Live probe confirms shadow-only lane | Pending |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [ ] CHK-110 [P1] Recommend latency does not regress.
  - **Evidence**: latency log shows embed_ms under 50ms on a warm provider.
- [ ] CHK-111 [P1] Scan latency does not regress materially.
  - **Evidence**: re-embed only fires on content-hash mismatch.
<!-- /ANCHOR:perf-verify -->
