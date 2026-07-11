---
title: "Tasks: Scaffold system-skill-advisor package"
description: "Audit, author SKILL.md + graph-metadata.json, mirror catalog/playbook, write policy + install stubs, validate."
trigger_phrases:
  - "system-skill-advisor scaffold tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/002-system-skill-advisor-package-scaffold"
    last_updated_at: "2026-05-14T10:34:00Z"
    last_updated_by: "claude"
    recent_action: "Tasks marked complete; T021 blocked"
    next_safe_action: "Commit, scaffold 015/009/003"
    blockers:
      - "T021 / CHK-202 — vitest parity reached 4 not ≤ 3; root cause pre-existing, deferred to child 003"
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Scaffold system-skill-advisor package

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Audit existing `.opencode/skills/system-skill-advisor/` state — confirmed SKILL.md/ARCHITECTURE.md/README.md empty, graph-metadata.json missing, .gitkeep stubs in 4 dirs.
- [x] T002 Inventory `mcp_server/skill_advisor/feature_catalog/` (8 cats + index) + `manual_testing_playbook/` (9 cats + index); no `references/` dir in mirror.
- [x] T003 Reread ADR-001 — standalone-MCP-with-legacy-bridge confirmed; child 003 ownership of source/DB move.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 SKILL.md authored (182 LOC, ADR-001 semantics, frontmatter description surfaced to runtime skill index).
- [x] T011 graph-metadata.json authored (181 LOC, `derived.intent_signals` as plain strings per discovery-code constraint, `manual.depends_on` + `manual.related_to` populated).
- [x] T012 ARCHITECTURE.md (104 LOC) and README.md (111 LOC) reauthored to align with ADR-001 standalone-MCP-with-legacy-bridge shape.
- [x] T013 feature_catalog/feature_catalog.md (56 LOC) + mcp-surface/01-advisor-recommend.md (65 LOC).
- [x] T014 manual_testing_playbook/manual_testing_playbook.md (84 LOC) + native-mcp-tools/native-recommend-happy-path.md (78 LOC).
- [x] T015 references/ authored fresh (3 entries: db-path-policy + legacy-tool-bridge + standalone-mcp-shape).
- [x] T016 references/db-path-policy.md authored (64 LOC, documents DB location under skill folder constraint A).
- [x] T017 INSTALL_GUIDE.md stub authored (60 LOC, cites child 004's future launcher work).
- [x] T018 mcp_server/ directory created with README.md (16 LOC) + database/.gitkeep.
- [x] T019 implementation-summary.md edit ledger + parity-delta + verification table filled by main agent post-codex (codex deferred this when BLOCKED on false-positive gate).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T020 node JSON/YAML load — codex log confirms graph-metadata.json + SKILL.md frontmatter parse cleanly.
- [B] T021 Vitest skill_advisor: parity improved 5 → 4 (not the ≤ 3 target). Residual 4 are pre-existing failures unrelated to empty-stub collateral; child 003 inherits responsibility.
- [x] T022 Strict validate 002 — PASS (0 errors / 0 warnings).
- [x] T023 Strict validate 015/009 — PASS.
- [x] T024 Strict validate 015 — PASS.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All Phase 1-3 tasks `[x]` or `[B]` with documented rationale.
- [B] T021 carries `[B]` — vitest parity reached 4 not ≤ 3; root cause is pre-existing, deferred to child 003.
- [x] No production advisor code modified by codex; the 4 dirty files in `mcp_server/skill_advisor/` are parallel-session + vitest side-effect (mtime evidence).
- [x] Strict validation green at all three levels (002, 009, 015).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent phase: `015/009-system-skill-advisor-extraction`
- ADR source: `015/009/001-extraction-design-and-adr/decision-record.md`
- Survey source: `015/009/001-extraction-design-and-adr/research/extraction-survey.md`
- Mirror source: `mcp_server/skill_advisor/feature_catalog/`, `manual_testing_playbook/`, `references/`
- Next packet: `015/009/003-advisor-source-db-tests-migration`
<!-- /ANCHOR:cross-refs -->
