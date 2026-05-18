---
title: "Checklist: Seed cosine embeddings into the sweep test"
description: "QA gates for the seed helper + re-run sweep + recommendation."
trigger_phrases:
  - "corpus seeded sweep checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-corpus-seeded-sweep"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "checklist.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Seed cosine embeddings into the sweep test

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [ ] CHK-200 [P0] Strict spec validate this packet.
- [ ] CHK-201 [P0] Strict spec validate parent 015.
- [ ] CHK-202 [P0] `npm run typecheck` from `mcp_server/`.
- [ ] CHK-203 [P0] `npm exec -- vitest run skill_advisor`.
- [ ] CHK-204 [P1] Dist rebuilt via `npx tsc --build`.
- [ ] CHK-205 [P1] Sweep markdown artifact present at `research/sweep-results.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-210 [P0] 015/003 sweep test reviewed.
- [ ] CHK-211 [P0] `createEmbeddingsProvider()` API confirmed.
- [ ] CHK-212 [P1] Cache directory pattern decided (sqlite vs JSON manifest).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] Code passes lint/format checks.
- [ ] CHK-011 [P0] No console errors or warnings.
- [ ] CHK-012 [P1] Helper handles provider-unavailable gracefully.
- [ ] CHK-013 [P1] Cache invalidation handles content + model id changes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006).
- [ ] CHK-021 [P0] Sweep produces variance across the 7 vectors (or documents provider-unavailable skip).
- [ ] CHK-022 [P1] Helper unit test for cache hit/miss.
- [ ] CHK-023 [P1] No new regressions in skill_advisor suite.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] Same-class producer: helper reuses live provider (no parallel pipeline).
- [ ] CHK-FIX-002 [P0] Consumer inventory: only the sweep test consumes the seeded vectors.
- [ ] CHK-FIX-003 [P1] Matrix axes listed (7 vectors x 24 prompts).
- [ ] CHK-FIX-004 [P1] Evidence pinned to explicit numbers (not "looks better").
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-220 [P0] Cache file gitignored if on disk.
- [ ] CHK-221 [P0] No external network in helper aside from the configured provider.
- [ ] CHK-222 [P1] No secrets logged during embed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized.
- [ ] CHK-041 [P1] Helper has JSDoc explaining cache key + invalidation.
- [ ] CHK-042 [P2] Recommendation cites specific numbers.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-230 [P0] Helper at `tests/scorer/fixtures/seed-skill-embeddings.ts`.
- [ ] CHK-231 [P0] Cache under `tests/scorer/fixtures/.embeddings-cache/`.
- [ ] CHK-232 [P1] Markdown report at `004-corpus-seeded-sweep/research/sweep-results.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All CHK-* P0 items | Pending |
| All CHK-* P1 items | Pending |
| Strict validation | Pending |
| Vitest clean | Pending |
| Sweep variance achieved | Pending |
| Recommendation cited with numbers | Pending |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [ ] CHK-110 [P1] Cold-cache sweep run under 60s.
- [ ] CHK-111 [P1] Warm-cache sweep run under 5s.
<!-- /ANCHOR:perf-verify -->
