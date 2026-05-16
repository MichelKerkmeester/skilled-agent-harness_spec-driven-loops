---
title: "Feature Specification: system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor (phase parent)"
description: "Coordinated docs-quality refactor of .opencode/skills/system-skill-advisor: marketing-style README, 1:1 sk-doc template alignment, audit-confirmed bug fixes, and content gap closure across 5 children."
trigger_phrases:
  - "skill-advisor docs quality refactor"
  - "marketing readme skill-advisor"
  - "sk-doc 1:1 alignment skill-advisor"
  - "skill-advisor audit phased"
  - "system-skill-advisor docs refactor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "top-level/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded phase-parent + 5 children"
    next_safe_action: "Run 20-iter deep-research in 001-audit-and-research"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - ".opencode/skills/system-skill-advisor/ARCHITECTURE.md"
      - ".opencode/skills/system-skill-advisor/INSTALL_GUIDE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-parent"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor (phase parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level packet) |
| **Parent Packet** | None |
| **Predecessor** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/003-doc-and-config-drift-fixes` (single-shot drift fixes; this packet coordinates the broader docs-quality work) |
| **Successor** | None |
| **Handoff Criteria** | Each child passes `validate.sh --strict` independently; research.md ships from 001 before 002-005 author plan/tasks |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/system-skill-advisor/` has accumulated drift across its 6 doc surfaces (SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, references/*, feature_catalog/*, manual_testing_playbook/*). An earlier analysis pass surfaced 3 HIGH-severity bugs (broken ADR-001 path, broken hook reference link, wrong build-command path), 2 unexplained numbering gaps (feature_catalog skips 05--*, playbook skips 09--*), structural template-adherence gaps in the playbook, and content gaps (no lane-weight tuning guide, no skill-graph query cookbook, no hook brief contract, no validation-baseline troubleshooting). The current README also reads as a reference document rather than a marketing-style entrypoint that mirrors the project root README's voice at a lower intensity.

### Purpose
Drive system-skill-advisor to docs-quality parity with the sk-doc baseline: marketing-grade README, full 1:1 template alignment across all doc surfaces, audit-confirmed bug fixes shipped, content gaps closed with new reference docs, and HVR compliance verified across every authored surface.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Exhaustive audit of all 6 doc surfaces via 20-iter deep-research (child 001)
- Audit-confirmed bug fixes (child 002)
- Marketing-style README rewrite, HVR-compliant, ~2000 words, 9 numbered sections, peer-anchored on `system-code-graph/README.md` (child 003)
- Per-file 1:1 sk-doc template alignment across SKILL.md, ARCHITECTURE.md, INSTALL_GUIDE.md, references/*, feature_catalog/*, manual_testing_playbook/* (child 004)
- Content additions: new reference docs (lane-weight tuning, skill-graph query cookbook, validation baselines, daemon lease contract, skill-graph drift) + canonical hook-reference copy + HVR sweep (child 005)

### Out of Scope
- Embeddings dangling-symlink resolution — owned by separate 040 follow-on per v0.2.0 changelog
- `lib/skill-graph/` relocation — owned by packet 011
- Tool surface changes (renaming `advisor_*` or `skill_graph_*` public ids — per ADR-001 invariant)
- New MCP tools beyond the current 9 (8 public + 1 internal)

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modify | 002, 004 | Fix ADR-001 path; align to 1:1 sk-doc |
| `.opencode/skills/system-skill-advisor/README.md` | Modify (rewrite) | 003 | Marketing-style rewrite, ~2000 words |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Modify | 002, 004 | Fix ADR-001 path + build command + freshness contract subsection |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Modify | 002, 004 | Fix hook-reference link + add hook brief contract subsection |
| `.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md` | Modify | 004 | Gap-05 explanatory note, recount |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Modify | 002, 004 | Fix paths, expand SAD-NNN legacy mapping, gap-09 note, reconcile counts |
| `.opencode/skills/system-skill-advisor/references/lane-weight-tuning.md` | Create | 005 | New reference doc |
| `.opencode/skills/system-skill-advisor/references/skill-graph-query-cookbook.md` | Create | 005 | New reference doc |
| `.opencode/skills/system-skill-advisor/references/validation-baselines.md` | Create | 005 | New reference doc |
| `.opencode/skills/system-skill-advisor/references/daemon-lease-contract.md` | Create | 005 | New reference doc |
| `.opencode/skills/system-skill-advisor/references/skill-graph-drift.md` | Create | 005 | New reference doc |
| `.opencode/skills/system-skill-advisor/references/hooks/skill-advisor-hook.md` | Create | 005 | Canonical copy from system-spec-kit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-audit-and-research/` | 20-iter `/spec_kit:deep-research:auto` via cli-devin SWE 1.6. Surfaces all drift, broken refs, content gaps, HVR violations, alignment misses. Produces ranked findings ledger that gates 002-005. | In Progress |
| 002 | `002-bug-fixes/` | Audit-confirmed P0 bug fixes (ADR-001 path, hook reference link, build command path, 9 nested README audit-packet rows). | Pending (gated by 001 synthesis) |
| 003 | `003-readme-marketing-rewrite/` | Full README.md rewrite: marketing-style, HVR-compliant, ~2000 words, 9 numbered sections, peer-anchored on system-code-graph/README.md. | Pending |
| 004 | `004-sk-doc-1to1-alignment/` | Per-file 1:1 sk-doc template alignment across SKILL.md, ARCHITECTURE.md, INSTALL_GUIDE.md, references/*, feature_catalog/*, manual_testing_playbook/*. | Pending |
| 005 | `005-content-additions-and-hvr/` | 5 new reference docs (lane-weight tuning, query cookbook, validation baselines, daemon lease, skill-graph drift) + canonical hook-reference copy + HVR sweep. | Pending |
| 006 | `006-deferred-cleanup/` | Tier A (F30 cross-links + F33 SOURCE FILES) + Tier B (F23/F24/F44 re-verify) + Tier C (bulk Oxford comma sweep 943→0). Closes the deferred backlog that ships without architectural decisions. | Complete |
| 007 | `007-deferred-final/` | Final-pass closure: semicolon HVR sweep (137→30 prose), F34 playbook deviation notes (20 files), 4 new ref docs (query-cookbook, validation-baselines, daemon-lease-contract, skill-graph-drift), deferred-decisions.md for Tier D. cli-opencode dispatch attempted but failed on InstanceRef (v1.15.1 vs v1.3.17 baseline drift); executed in-session instead. | Complete |
| 008 | `008-tier-d-execution/` | Tier D execution: F4 `.devin/hooks.v1.json` migration (UserPromptSubmit→system-skill-advisor, SessionStart→system-code-graph with conceptual-ownership pivot), F6 deprecation banners on 4 OLD hook READMEs with 90-day window, F37 catalog/playbook §17.5 cross-reference table. F35/F36 stay status-quo per deferred-decisions.md recommendations. | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Phases 003 and 004 may execute in parallel after 002 lands; 005 runs last

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | `research/research.md` ships with P0 findings catalog + impact ranking | `ls 001/research/research.md` exists; iter-count=20 in state.jsonl |
| 002 | 003 | All P0 bugs fixed; grep for stale paths returns 0 hits | `rg "006-system-skill-advisor-extraction" .opencode/skills/system-skill-advisor` → 0 |
| 002 | 004 | Same as above | Same |
| 003 | 005 | README passes HVR compliance grep | `rg -i "delve\|leverage\|robust\|seamless\|holistic" README.md` → 0 |
| 004 | 005 | All 6 doc surfaces strict-validate | `validate.sh --strict` per file |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the canonical hook-reference live under `system-skill-advisor/references/hooks/` or stay under `system-spec-kit/references/hooks/` with a working relative link? Decision deferred to 002 or 005.
- Do feature_catalog gap-05 and playbook gap-09 reflect historical absorbed work, or should they be renumbered? Decision deferred to iter 10 + iter 14 of 001 research.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `001-*/` through `005-*/` for per-phase spec.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Resource Map**: See `resource-map.md` for aggregated path catalog across all phases
- **Predecessor packet**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/003-doc-and-config-drift-fixes/`
- **Peer for README voice ceiling**: `.opencode/skills/system-code-graph/README.md`
- **Binding voice rules**: `.opencode/skills/sk-doc/references/global/hvr_rules.md`
