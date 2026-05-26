---
title: "Checklist: Harder intent-described corpus + sweep"
description: "QA gates."
trigger_phrases:
  - "harder corpus checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-hard-intent-corpus-resweep"
    last_updated_at: "2026-05-14T01:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "checklist.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Harder intent-described corpus + sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [x] CHK-200 [P0] Strict validate this packet. Evidence: RESULT PASSED.
- [x] CHK-201 [P0] Strict validate parent 015. Evidence: RESULT PASSED.
- [x] CHK-202 [P0] typecheck PASS. Evidence: `npm run typecheck` from `mcp_server/`.
- [x] CHK-203 [P0] Vitest skill_advisor only the known plugin-bridge baseline fails. Evidence: 42 files, 303 tests, 1 known failure.
- [x] CHK-204 [P1] Dist rebuilt. Evidence: `npx tsc --build` from `system-spec-kit/`.
- [x] CHK-205 [P1] Markdown report present. Evidence: `research/sweep-results-harder.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-210 [P0] Existing corpus shape understood.
- [x] CHK-211 [P0] Sweep test extension points identified.
- [x] CHK-212 [P1] Skill set inventoried for distribution coverage.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] Lint/format clean. Evidence: packet-local `npx eslint skill_advisor/tests/scorer/lane-weight-sweep.vitest.ts skill_advisor/tests/scorer/fixtures/harder-intent-prompt-corpus.ts --ext .ts` passed. Repository-wide `npm run lint` still has unrelated baseline failures.
- [x] CHK-011 [P0] No console errors.
- [x] CHK-012 [P1] Fixture entries have inline comments. Evidence: each entry carries a `reason` field explaining the mis-route hypothesis.
- [x] CHK-013 [P1] Sweep extension reuses helpers; no copy-paste.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Acceptance criteria met (REQ-001..006).
- [x] CHK-021 [P0] Harder-set accuracy table emitted.
- [x] CHK-022 [P1] 8-12 distinct skills covered. Evidence: 11 distinct skills.
- [x] CHK-023 [P1] No new regressions. Evidence: skill_advisor suite remains at exactly 1 known failure.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] Fixture pattern matches existing `intent-prompt-corpus.ts` shape (additive).
- [x] CHK-FIX-002 [P0] Test extension is additive for the harder corpus; original seeded sweep remains present.
- [x] CHK-FIX-003 [P1] Matrix axes (vectors x harder set) listed.
- [x] CHK-FIX-004 [P1] Numbers cited specifically in recommendation.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-220 [P0] No secrets in prompts.
- [x] CHK-221 [P0] No external network beyond configured embedding provider.
- [x] CHK-222 [P1] Edits stay in approved packet scope. Evidence: code edits in fixture/test; docs in report, summary, status/checklist.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] Spec/plan/tasks/checklist synced.
- [x] CHK-041 [P1] Recommendation tied to specific delta numbers.
- [x] CHK-042 [P2] Inline comments per fixture entry explain mis-route hypothesis. Evidence: `reason` field per entry.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-230 [P0] Fixture at `mcp_server/skill_advisor/tests/scorer/fixtures/harder-intent-prompt-corpus.ts`.
- [x] CHK-231 [P0] Report at `007-hard-intent-corpus-resweep/research/sweep-results-harder.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All P0 items | Pass |
| All P1 items | Pass |
| Strict validation | Pass |
| Vitest clean | Pass with known plugin-bridge baseline |
| Recommendation cited | Pass |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [x] CHK-110 [P1] Combined sweep under 90s cold cache. Evidence: exact `hf-local` sweep file completed in 2.86s after cached model/embeddings.
<!-- /ANCHOR:perf-verify -->
