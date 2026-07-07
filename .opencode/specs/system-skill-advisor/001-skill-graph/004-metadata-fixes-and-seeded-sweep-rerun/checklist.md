---
title: "Checklist: Apply 015/005 metadata fixes and re-run the seeded sweep"
description: "QA gates for the post-audit metadata edits + re-sweep + recommendation."
trigger_phrases:
  - "metadata fixes checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/004-metadata-fixes-and-seeded-sweep-rerun"
    last_updated_at: "2026-05-14T01:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "checklist.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Apply 015/005 metadata fixes and re-run the seeded sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [ ] CHK-200 [P0] Strict spec validate this packet.
- [ ] CHK-201 [P0] Strict spec validate parent 015.
- [ ] CHK-202 [P0] `npm run typecheck` from `mcp_server/`.
- [ ] CHK-203 [P0] `npm exec -- vitest run skill_advisor` baseline holds (only plugin-bridge fails).
- [ ] CHK-204 [P0] Embedding cache invalidated for affected skills before sweep.
- [ ] CHK-205 [P1] Sweep markdown artifact present at `research/sweep-results-after-fixes.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-210 [P0] 015/005 audit-report.md read; top-8 list extracted.
- [ ] CHK-211 [P0] 015/004 baseline numbers cited (V0: 0.6667 / 1.0000 / 0.3333 / 0).
- [ ] CHK-212 [P1] Cache layout confirmed (`.embeddings-cache/`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] No code changes outside skill metadata files + this packet's docs.
- [ ] CHK-011 [P0] Edited graph-metadata.json files remain valid JSON.
- [ ] CHK-012 [P1] SKILL.md frontmatter remains valid YAML.
- [ ] CHK-013 [P1] No body content of any SKILL.md altered.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] All acceptance criteria from spec.md met (REQ-001 through REQ-006).
- [ ] CHK-021 [P0] Sweep delta table emitted with comparison to 015/004 baseline.
- [ ] CHK-022 [P1] All 17 skills still discoverable post-edits.
- [ ] CHK-023 [P1] No new regressions in skill_advisor suite.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] Edit ledger lists every affected skill + the audit recommendation it implements.
- [ ] CHK-FIX-002 [P0] Cache invalidation evidence captured (cache_misses count for affected skills).
- [ ] CHK-FIX-003 [P1] Recommendation explicitly addresses whether 0.05 should change.
- [ ] CHK-FIX-004 [P1] Evidence pinned to specific accuracy numbers.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-220 [P0] No secrets introduced in any skill description.
- [ ] CHK-221 [P0] No external network calls beyond the configured embedding provider.
- [ ] CHK-222 [P1] Edits stay within `derived.trigger_phrases` / `derived.key_topics` (and optionally `intent_signals` / `manual.depends_on` / `manual.related_to`) on graph-metadata.json; no other fields touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized.
- [ ] CHK-041 [P1] Edit ledger present in implementation-summary.md.
- [ ] CHK-042 [P2] Recommendation cites specific deltas.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-230 [P0] Edited files limited to top-8 skill directories.
- [ ] CHK-231 [P0] New report at `006-apply-metadata-fixes-and-resweep/research/sweep-results-after-fixes.md`.
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
| Sweep delta documented | Pending |
| Recommendation cited with numbers | Pending |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [ ] CHK-110 [P1] Sweep re-run with cold cache under 90s.
<!-- /ANCHOR:perf-verify -->
