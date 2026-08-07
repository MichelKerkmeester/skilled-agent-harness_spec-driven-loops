---
title: "Tasks — Phase 12 — Skill support extension"
description: "Task list for deep research on health-md and extending the mcp-obsidian mode with the resulting file-layer support."
trigger_phrases:
  - "phase 12 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/012-skill-support-extension"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 12 tasks"
    next_safe_action: "Execute tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/012-skill-support-extension"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks — Phase 12 — Skill support extension

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; every completed item carries its evidence inline.
- Task IDs: T001–T012; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author `references/plugins/health-md/` (index, data-model, workflows, troubleshooting) [Evidence: 4 files present, v1.2.0.0, facts from the pinned repo README]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Extend `references/plugins/plugin-operation-logic.md` data map to 4 plugins [Evidence: 4-row data map with health-md row]
- [x] T003 Update `SKILL.md` (triggers, resource list, routing, version 1.2.0.0) [Evidence: version bumped; health-md set in load-on-demand]
- [x] T004 Add `feature-catalog/plugins/health-md.md` [Evidence: 1 card; FEATURE-CATALOG index updated (3 → 4)]
- [x] T005 Add `manual-testing-playbook/plugin-tie-ins/health-md-data.md` + index update [Evidence: OBS-014 authored; playbook index updated (19 → 20)]
- [x] T006 Add `assets/plugins/health-md/` example + `changelog/v1.2.0.0.md` [Evidence: fixture JSON parses + changelog]
- [x] T007 Validate mode docs and write the implementation summary [Evidence: mode-registry aliases + hub-router class extended; validate.sh ran on the folder]
- [ ] T008 [P] Deep research on health-md via `/deep:research` — executor cli-codex `--model gpt-5.6-sol --reasoning-effort high --service-tier fast` (web search on); state packet under `research/` ✅ COMPLETED 2026-08-03 — 6 iterations, all questions answered, `research/lineages/codex/research.md` synthesized [Evidence: state JSONL 6 complete records; convergence report STOP_ALLOWED]
- ~~T009 Reconcile findings vs references~~ **SUPERSEDED by phases 014-017** — implementation of the research findings is owned by `014-health-md-reference-remediation` → `017-health-md-live-validation-closeout` (reference rewrite, fixtures/blocks, catalog+playbook rework, live validation + closeout)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- ~~T010 Execute OBS-014 live against a vault and record the verdict + evidence in the scenario file~~ **SUPERSEDED by phase 017** — live run executed against throwaway vault `/tmp/_pbtest-obs014` (GUARD fired; fixture shape/block/round-trip/cleanup verified; real vault untouched); verdict + evidence recorded in OBS-014 scenario `health-md-data.md` §4 Live Run Record
- ~~T011 Re-run `validate.sh` on the phase + mode docs; refresh metadata fingerprints~~ **SUPERSEDED by phase 017** — `validate.sh` on phases 014-017: Errors: 0 (1 advisory COMPLEXITY_MATCH warning each); fingerprint refresh deferred (spec-memory daemon down)
- ~~T012 Update the implementation summary with research + live-run results~~ **SUPERSEDED by phases 014-017** — implementation summaries authored in `014-health-md-reference-remediation` → `017-health-md-live-validation-closeout`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All REQ-001..REQ-007 acceptance criteria met: research record with convergence report, references deepened + traceable, router/registry updated, catalog + playbook entries exist, example + changelog shipped, live OBS-014 verdict recorded, no regression.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-007, SC-001..SC-004)
- Predecessor: `../011-plugin-installation/`
- Package: `.opencode/skills/mcp-tooling/mcp-obsidian/`
- Research contract: `.opencode/skills/system-deep-loop/deep-research/SKILL.md` + `.opencode/commands/deep/research.md`
- Executor contract: `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md`
<!-- /ANCHOR:cross-refs -->
