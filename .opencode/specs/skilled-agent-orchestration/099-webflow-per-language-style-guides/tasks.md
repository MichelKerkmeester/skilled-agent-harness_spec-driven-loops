---
title: "Task Breakdown: 099 Webflow per-language style guides"
description: "Granular task list aligned to plan.md phases — read+map, author 10 files, route+cross-refs, delete, verify."
trigger_phrases:
  - "099 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/099-webflow-per-language-style-guides"
    last_updated_at: "2026-05-09T17:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Restructured tasks.md to template-compliant anchor layout"
    next_safe_action: "Validate strict pass"
    blockers: []
    key_files: ["spec.md", "plan.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "099-tasks-restructure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 099 Webflow per-language style guides

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

Each task uses the format: `T-NNN: Description (file path or scope)`

- `T-NNN` — sequential task ID (zero-padded to 3 digits)
- Description — verb-led action, terse
- Parenthetical — file path, scope, or dispatch target
- Status markers: `[ ]` open, `[x]` done

Phase headers group tasks by execution order. Within a phase, tasks may be parallel-safe; cross-phase dependencies are explicit in `plan.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Read source files in full to build the migration map. Sequential and BLOCKING — no Phase 2 work until Phase 1 complete.

- [x] T-001: Read `code_style_guide.md` in full (765 lines)
- [x] T-002: Read `code_style_enforcement.md` in full (663 lines)
- [x] T-003: Read `code_quality_standards.md` in full (1072 lines)
- [x] T-004: Read `quick_reference.md` in full (710 lines)
- [x] T-005: Read `shared_patterns.md` in full (621 lines)
- [x] T-006: Reconcile any section that does not fit the plan.md migration map; update plan.md if needed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Author the 10 new per-language files. Each authoring task dispatched to opencode-go/deepseek-v4-pro --variant high. Within batches, parallel-safe.

- [x] T-010: Create `references/webflow/shared/cross_language_rules.md` (177 lines)
- [x] T-011: Create `references/webflow/shared/dev_workflow.md` (921 lines)
- [x] T-012: Create `references/webflow/shared/enforcement.md` (322 lines)
- [x] T-013: Create `references/webflow/javascript/style_guide.md` (434 lines)
- [x] T-014: Create `references/webflow/javascript/quality_standards.md` (1168 lines)
- [x] T-015: Create `references/webflow/javascript/quick_reference.md` (252 lines)
- [x] T-016: Create `references/webflow/css/style_guide.md` (152 lines)
- [x] T-017: Create `references/webflow/css/quality_standards.md` (308 lines)
- [x] T-018: Create `references/webflow/css/quick_reference.md` (163 lines)
- [x] T-019: Create `references/webflow/html/style_guide.md` (179 lines)

After authoring, sk-doc reference template alignment pass:

- [x] T-019a: Add `## 1. OVERVIEW` (Purpose / When to Use / Core Principle) to all 10 new files; renumber subsequent sections
- [x] T-019b: Fix 85 broken markdown links left over from earlier sed/python pass damage to untracked new files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Routing + cross-references, source deletion, validate, probe.

- [x] T-020: Update `.opencode/skills/sk-code/SKILL.md` §2 SMART ROUTING WEBFLOW resource list — *no change needed; SKILL.md uses generic patterns*
- [x] T-021: Update `.opencode/skills/sk-code/references/router/resource_loading.md` WEBFLOW resource map — *no change needed; uses generic patterns*
- [x] T-022: Update `.opencode/skills/sk-code/references/universal/code_style_guide.md` cross-ref
- [x] T-023: Update `.opencode/skills/sk-code/manual_testing_playbook/07--cross-stack-routing/005-snippet-reuse-cross-stack.md` cross-ref
- [x] T-024: Update `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` cross-ref
- [x] T-024a: Bulk sed-replace 25 files with stale `webflow/standards/code_*` references (1 typo straggler fixed by hand)
- [x] T-025: Repo-wide grep `webflow/standards/code_style` returns ZERO active routing hits (provenance comments retained as historical metadata)
- [x] T-030: `rm` the five `.opencode/skills/sk-code/references/webflow/standards/*.md` files
- [x] T-031: `rmdir` the now-empty `webflow/standards/` directory
- [x] T-040: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` — *failed initially on TEMPLATE_HEADERS / ANCHORS_VALID; resolved via packet 099b restructure of plan.md / tasks.md / implementation-summary.md*
- [x] T-041: Repo-wide grep confirms no stale path references in active routing
- [x] T-042: `find .../webflow/standards -type f` returns zero
- [x] T-043: 099 SC-001 probe (CSS-only Webflow task) — PASS, loads only css/* + shared/cross_language_rules.md
- [x] T-043a: 099c SC-002 probe (JS-only Webflow task) — PASS, loads only javascript/* + shared/*
- [x] T-043b: 099d SC-004 codegen probe — PASS 12/12 JS + 6/6 CSS, banner/snake_case/IIFE/init/BEM/GPU/reduced-motion all compliant
- [x] T-044: Mark all `checklist.md` items `[x]` with evidence
- [x] T-045: Author `implementation-summary.md` from completion evidence
- [x] T-046: Run `generate-context.js` to refresh `description.json` + `graph-metadata.json` and index continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Packet is complete when:

1. All Phase 1, 2, 3 tasks are `[x]` with evidence in `implementation-summary.md`
2. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0
3. Three probe verdicts (SC-001 CSS-only, SC-002 JS-only, SC-004 codegen) all PASS
4. Repo-wide grep `webflow/standards/code_*` returns zero hits in active routing (provenance comments are exempt — they are historical metadata)
5. `find webflow/standards -type f` returns nothing — source files physically deleted per ADR-002
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: [`spec.md`](./spec.md)
- Plan: [`plan.md`](./plan.md) — section-by-section migration map in §IMPLEMENTATION PHASES
- Decision Records: [`decision-record.md`](./decision-record.md) — 4 ADRs (opencode mirror, DELETE policy, phase ordering, HTML stub)
- Checklist: [`checklist.md`](./checklist.md)
- Implementation Summary: [`implementation-summary.md`](./implementation-summary.md)
<!-- /ANCHOR:cross-refs -->
