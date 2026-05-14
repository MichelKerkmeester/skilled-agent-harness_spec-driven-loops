---
title: "Checklist: Scaffold system-skill-advisor package"
description: "QA gates."
trigger_phrases:
  - "system-skill-advisor scaffold checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/002-scaffold-system-skill-advisor-package"
    last_updated_at: "2026-05-14T03:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "checklist.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Scaffold system-skill-advisor package

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [ ] CHK-200 [P0] Strict validate this packet.
- [ ] CHK-201 [P0] Strict validate parent 015/009 + parent 015.
- [ ] CHK-202 [P0] Vitest skill_advisor stays at ≤ 3 failures.
- [ ] CHK-203 [P1] node JSON/YAML load on every new file.
- [ ] CHK-204 [P1] No production advisor code modified.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-210 [P0] system-skill-advisor stub audited.
- [ ] CHK-211 [P0] ADR-001 re-read.
- [ ] CHK-212 [P1] Mirror source inventoried.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] No production code changes (scaffold-only invariant).
- [ ] CHK-011 [P0] SKILL.md frontmatter parses cleanly.
- [ ] CHK-012 [P0] graph-metadata.json validates against the per-skill schema.
- [ ] CHK-013 [P1] Catalog/playbook/references entries are real content, not empty.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] All acceptance criteria from spec.md met.
- [ ] CHK-021 [P0] Vitest skill_advisor failure count ≤ 3.
- [ ] CHK-022 [P1] Discovery includes 18 active skills post-scaffold.
- [ ] CHK-023 [P1] Parity test delta documented (improved / unchanged / worse).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] SKILL.md authored per ADR-001 semantics.
- [ ] CHK-FIX-002 [P0] graph-metadata.json populated with all three core fields.
- [ ] CHK-FIX-003 [P1] Doc files cite ADR-001 and parent 015/009 spec.
- [ ] CHK-FIX-004 [P1] mcp_server/ stub present and clearly marked as child 003's target.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-220 [P0] No secrets in any authored content.
- [ ] CHK-221 [P0] No external network calls during authoring.
- [ ] CHK-222 [P1] Edits restricted to `system-skill-advisor/` + this packet's docs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized.
- [ ] CHK-041 [P1] Implementation-summary edit ledger present.
- [ ] CHK-042 [P2] DB-path policy doc explicitly references constraint A.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-230 [P0] Files land under `.opencode/skills/system-skill-advisor/` only (or this packet's docs).
- [ ] CHK-231 [P0] mcp_server/ stub directory created at the new skill root.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All P0 items | Pending |
| All P1 items | Pending |
| Strict validation | Pending |
| Vitest ≤ 3 failures | Pending |
| Parity test delta documented | Pending |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [ ] CHK-110 [P1] skill_graph_scan equivalent completes under 30s on the 18-skill set.
<!-- /ANCHOR:perf-verify -->
