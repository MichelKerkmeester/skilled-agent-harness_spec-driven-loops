---
title: "Checklist: Populate intent_signals + manual relationships"
description: "QA gates."
trigger_phrases:
  - "intent signals checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/005-intent-signals-and-skill-relationships"
    last_updated_at: "2026-05-14T01:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "checklist.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Populate intent_signals + manual relationships

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [ ] CHK-200 [P0] Strict validate this packet.
- [ ] CHK-201 [P0] Strict validate parent 015.
- [ ] CHK-202 [P0] typecheck PASS.
- [ ] CHK-203 [P0] Vitest skill_advisor only plugin-bridge baseline fails.
- [ ] CHK-204 [P1] Dist rebuilt.
- [ ] CHK-205 [P1] advisor_recommend probe shows non-zero graph_causal raw.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-210 [P0] 17 skills inventoried.
- [ ] CHK-211 [P0] graph-metadata.json schema supports the three target fields.
- [ ] CHK-212 [P1] 015/005 audit-report.md consulted for per-skill grounding.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] Edited files remain valid JSON.
- [ ] CHK-011 [P0] No fields touched outside the three target fields.
- [ ] CHK-012 [P1] Empty arrays allowed only with documented reason.
- [ ] CHK-013 [P1] No aspirational depends_on (only mechanical deps).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] Acceptance criteria met (REQ-001..006).
- [ ] CHK-021 [P0] skill_graph_scan succeeds with 17 skills.
- [ ] CHK-022 [P1] advisor_recommend graph_causal non-zero for at least one probe.
- [ ] CHK-023 [P1] No new regressions.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] Edit ledger lists all 17 skills × 3 fields.
- [ ] CHK-FIX-002 [P0] Skipped/empty cases documented per skill.
- [ ] CHK-FIX-003 [P1] depends_on refs validated against active skill list.
- [ ] CHK-FIX-004 [P1] Evidence pinned to specific skill ids.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-220 [P0] No secrets in any field.
- [ ] CHK-221 [P0] No external network calls.
- [ ] CHK-222 [P1] Edits stay strictly within target fields.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized.
- [ ] CHK-041 [P1] Edit ledger in implementation-summary.md.
- [ ] CHK-042 [P2] Empty-array cases explained.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-230 [P0] Edits restricted to `.opencode/skills/<skill>/graph-metadata.json`.
- [ ] CHK-231 [P0] No SKILL.md modifications.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All P0 items | Pending |
| All P1 items | Pending |
| Strict validation | Pending |
| Vitest clean | Pending |
| graph_causal non-zero probe | Pending |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [ ] CHK-110 [P1] skill_graph_scan under 30s on the 17-skill set.
<!-- /ANCHOR:perf-verify -->
