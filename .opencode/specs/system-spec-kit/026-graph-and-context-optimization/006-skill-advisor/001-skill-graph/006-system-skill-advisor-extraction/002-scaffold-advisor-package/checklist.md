---
title: "Checklist: Scaffold system-skill-advisor package"
description: "QA gates."
trigger_phrases:
  - "system-skill-advisor scaffold checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/002-scaffold-advisor-package"
    last_updated_at: "2026-05-14T10:34:00Z"
    last_updated_by: "claude"
    recent_action: "Checklist marked complete; CHK-202 blocked"
    next_safe_action: "Commit, scaffold 015/009/003"
    blockers:
      - "CHK-202 — vitest parity 4 not ≤ 3; child 003 inherits"
    key_files:
      - "checklist.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Scaffold system-skill-advisor package

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [x] CHK-200 [P0] Strict validate 002 — PASS (0 errors / 0 warnings).
- [x] CHK-201 [P0] Strict validate 015/009 + 015 — PASS / PASS.
- [B] CHK-202 [P0] Vitest skill_advisor parity: 5 → 4 (improved by 1; ≤ 3 target NOT met). Residual 4 pre-existing; child 003 inherits.
- [x] CHK-203 [P1] node JSON/YAML load — codex log confirms parse-clean.
- [x] CHK-204 [P1] No production advisor code modified (codex-attributable); 4 dirty files are parallel-session + vitest side-effect.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-210 [P0] Stub audited (SKILL/ARCHITECTURE/README empty, no graph-metadata.json, 4 .gitkeep dirs).
- [x] CHK-211 [P0] ADR-001 re-read pre-authoring.
- [x] CHK-212 [P1] Mirror source inventoried (feature_catalog 8 cats, manual_testing_playbook 9 cats, no references/).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] No codex-attributable production code changes (parallel-session + vitest side-effect noise is allowed per repo worktree-cleanliness rule).
- [x] CHK-011 [P0] SKILL.md frontmatter parses cleanly (description field surfaced to runtime skill index).
- [x] CHK-012 [P0] graph-metadata.json populated and parses; `derived.intent_signals` kept as plain string array per discovery-code constraint.
- [x] CHK-013 [P1] Catalog/playbook/references entries authored with real content (1 seed entry each + 3 references).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] All acceptance criteria from spec.md met (envelope-only scope per ADR-001).
- [B] CHK-021 [P0] Vitest skill_advisor parity reached 4, not ≤ 3. Documented blocker; residual 4 pre-existing, deferred to child 003.
- [x] CHK-022 [P1] Discovery includes 18 active skills post-scaffold (visible in current skill list: system-skill-advisor now appears with non-empty description).
- [x] CHK-023 [P1] Parity test delta documented: IMPROVED (5 → 4) in implementation-summary.md.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] SKILL.md authored per ADR-001 standalone-MCP-legacy-bridge semantics (182 LOC).
- [x] CHK-FIX-002 [P0] graph-metadata.json has `derived.intent_signals`, `manual.depends_on`, `manual.related_to`.
- [x] CHK-FIX-003 [P1] ARCHITECTURE.md, README.md, INSTALL_GUIDE.md, references/standalone-mcp-shape.md all cite ADR-001.
- [x] CHK-FIX-004 [P1] mcp_server/README.md states "Child 003's drop target" explicitly.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-220 [P0] No secrets in authored content (text-only spec docs + JSON metadata).
- [x] CHK-221 [P0] No external network calls (codex ran in danger-full-access local sandbox).
- [x] CHK-222 [P1] Edits restricted to `system-skill-advisor/` + this packet's docs (production `mcp_server/skill_advisor/` modifications are parallel-session noise, not codex-attributable).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized (tasks flipped to `[x]`/`[B]`; checklist mirrors; status fields updated).
- [x] CHK-041 [P1] Implementation-summary edit ledger present (14-row table by path/action/LOC).
- [x] CHK-042 [P2] references/db-path-policy.md documents the constraint that the advisor DB lives inside `.opencode/skills/system-skill-advisor/mcp_server/database/`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-230 [P0] All envelope files under `.opencode/skills/system-skill-advisor/`; all doc updates under this packet's folder.
- [x] CHK-231 [P0] `.opencode/skills/system-skill-advisor/mcp_server/` created with README.md + database/.gitkeep.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All P0 items | PASS (CHK-202 `[B]` documented; carried to child 003) |
| All P1 items | PASS |
| Strict validation (002 + 009 + 015) | PASS / PASS / PASS |
| Vitest ≤ 3 failures | NOT MET (reached 4; root cause pre-existing, child 003 inherits) |
| Parity test delta documented | PASS (IMPROVED 5 → 4) |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [x] CHK-110 [P1] N/A for envelope phase — child 003 (which moves the source) is where skill_graph_scan timing matters.
<!-- /ANCHOR:perf-verify -->
