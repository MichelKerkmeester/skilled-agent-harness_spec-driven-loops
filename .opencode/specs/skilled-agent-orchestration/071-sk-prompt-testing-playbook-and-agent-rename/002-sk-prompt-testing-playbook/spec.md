---
title: "Feature Specification: Phase 002 — Manual Testing Playbook for sk-prompt Skill"
description: "Author a 28-scenario manual testing playbook at .opencode/skills/sk-prompt/manual_testing_playbook/ using sk-doc templates and the /create:testing-playbook command. 7 categories cover mode-detection, smart-routing, depth-clear-loop, clear-scoring, framework-selection, escalation-tiers, format-modes."
trigger_phrases:
  - "085 phase 002"
  - "sk-prompt testing playbook"
  - "manual testing playbook sk-prompt"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/071-sk-prompt-testing-playbook-and-agent-rename/002-sk-prompt-testing-playbook"
    last_updated_at: "2026-05-06T16:58:29Z"
    last_updated_by: "codex"
    recent_action: "Phase 002 complete: 28 scenarios shipped"
    next_safe_action: "Final memory save"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-085-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 002 — Manual Testing Playbook for sk-prompt Skill

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `085-sk-prompt-testing-playbook-and-agent-rename` |
| **Phase** | 002 of 002 |
| **Handoff Criteria** | 28 scenario files exist + linked from root; `validate_document.py` exit 0; forbidden-sidecar grep returns 0; sk-prompt SKILL.md has §RELATED PLAYBOOK link |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-prompt` skill (renamed in 082) ships 12 distinct testable surfaces but has **no manual_testing_playbook/** directory. Sibling skills with similar surface area ship one (cli-codex 27 scenarios, sk-code 24, deep-research 41). Operators can't run a deterministic pre-release validation battery.

### Purpose
Author a 28-scenario manual testing playbook conforming to sk-doc's contract. Use the canonical `/create:testing-playbook sk-prompt create :confirm` command (NOT direct cli-codex dispatch — Plan agent recommendation).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md` (root index)
- Author 28 per-feature scenario files (SP-001..SP-028) across 7 numbered category folders
- Add ONE `## RELATED PLAYBOOK` link to `sk-prompt/SKILL.md` Section 10 (no inline backrefs)
- Run validation gates: `validate_document.py` + spec strict + feature-ID count match + forbidden-sidecar grep

### Out of Scope
- Author a `feature_catalog/` for sk-prompt (separate packet)
- Modify sk-prompt source files beyond the single SKILL.md backref
- Rotate any other skill's manual_testing_playbook
- Add 28 inline backrefs to SKILL.md (would breach 500-LOC cap)

### Category Structure (28 scenarios)

| # | Folder | Surface | Scenarios | IDs |
|---|---|---|---|---|
| 1 | `01--mode-detection/` | $command prefix routing for 7 modes; DEPTH-rounds-by-mode | 4 | SP-001..004 |
| 2 | `02--smart-routing/` | INTENT_MODEL keyword scoring, ON_DEMAND, AMBIGUITY_DELTA, UNKNOWN_FALLBACK | 4 | SP-005..008 |
| 3 | `03--depth-clear-loop/` | DEPTH 5 phases + exit gates + perspectives + 3-iter cap + DEPTH→CLEAR re-score | 6 | SP-009..014 |
| 4 | `04--clear-scoring/` | 5 dims, per-dim floors (C7/L7/E10/A7/R3), 40+/50, dimension drilldown | 4 | SP-015..018 |
| 5 | `05--framework-selection/` | 7 frameworks, complexity-matching matrix, framework switch | 4 | SP-019..022 |
| 6 | `06--escalation-tiers/` | cli_prompt_quality_card 5-Q fast-path, escalation, @prompt-improver agent contract | 4 | SP-023..026 |
| 7 | `07--format-modes/` | $json / $yaml / markdown delivery, on-demand format_guide_*.md loading | 2 | SP-027..028 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Phase scope is sk-doc-compliant playbook authoring. Acceptance criteria captured in HANDOFF CRITERIA + checklist.md.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- 28 scenario files exist under 7 numbered category folders
- Each scenario has the 5 mandatory sections: OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, SOURCE FILES, SOURCE METADATA
- `python3 .opencode/skills/sk-doc/scripts/validate_document.py manual_testing_playbook.md` → exit 0
- Forbidden sidecar grep returns 0 hits (no `review_protocol.md`, `subagent_utilization_ledger.md`, `snippets/`)
- Feature-ID count matches: `find . -name "SP-*.md" | wc -l` == root index `^| SP-` row count == 28
- Strict validate on phase folder PASSES (0 errors, 0 warnings)
- Each scenario has a realistic user request (NOT a SKILL.md paraphrase)
- sk-prompt SKILL.md has ONE `## RELATED PLAYBOOK` link (no 28 inline backrefs)
- All scenarios reference `@prompt-improver` (the renamed agent), NOT `@improve-prompt`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Hard dependency on Phase 001** — playbook scenarios reference the agent name. If Phase 001 hasn't completed, scenarios reference `@improve-prompt` (wrong) or require re-rotation later (double-touch)
- **`/create:testing-playbook` requires `@create` agent** — Phase 0 hard-blocks unless invoked via Task tool with `subagent_type: create`
- **Source Strategy B required** — sk-prompt has NO `feature_catalog/`; must provide the 28-row validation matrix manually during command's setup prompt
- **Realistic-orchestrator-led prompt requirement** — sk-doc §9, §16 reject SKILL.md paraphrases; budget extra authoring time per scenario
- **Validator scope limit** — `validate_document.py` H4 only checks root doc; per-feature files need manual review
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at start. Design questions surface inside the `:confirm` checkpoint after category split is presented.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

- **Validator compliance**: `validate_document.py` must exit 0 on root playbook
- **Cross-reference integrity**: every feature ID listed in root index must have a matching per-feature file
- **Forbidden surfaces**: no `review_protocol.md`, `subagent_utilization_ledger.md`, or `snippets/` subtree
- **Naming convention**: SP-NNN prefix for all feature IDs, sequential within each category folder
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- **Source Strategy B fallback**: sk-prompt has no `feature_catalog/` — must provide validation matrix manually during command setup
- **`@create` agent verification**: command Phase 0 hard-blocks unless invoked via Task tool with subagent_type=create
- **Realistic-orchestrator-led prompt**: scenario authors must avoid SKILL.md paraphrases (sk-doc §9, §16 reject these)
- **Per-feature manual review**: validator only checks root; per-feature files require manual spot-check
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Domain count | 1 | Single skill (sk-prompt) |
| File count | 30 | 1 root + 28 scenarios + 1 SKILL.md backref |
| LOC estimate | ~600-800 | Per-feature avg ~30 LOC |
| Parallel opportunity | Low | Sequential authoring per scenario |
| Task type | Moderate | Template-driven authoring with sk-doc validation |
| **Total** | **Level 2 fit** | Substantive deliverable, no architecture decisions |
<!-- /ANCHOR:complexity -->

---

## IMPLEMENTATION APPROACH

Dispatch via Task tool with `subagent_type: create` invoking `/create:testing-playbook sk-prompt create :confirm`. Provide setup answers: skill=sk-prompt, operation=create, source_strategy=B (operator-provided matrix), validation matrix from spec.md §SCOPE category table, mode=:confirm for one human checkpoint after category split, spec folder = this packet path. The command's :confirm gate fires after category split is computed and before 28 file generations begin — opportunity to tweak before commitment.

## HANDOFF CRITERIA

Phase 002 → packet completion:
- All 5 success criteria met
- Strict validate parent + 2 children PASSES
- Memory save completes; `mcp__spec_kit_memory__memory_search` returns 085 packet
- Single rollup commit on main: `spec(085/002): manual testing playbook for sk-prompt — 28 scenarios across 7 categories`

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Sibling phase (predecessor): `../001-prompt-improver-rename/spec.md`
- sk-doc templates: `.opencode/skills/sk-doc/assets/testing_playbook/{manual_testing_playbook_template.md, manual_testing_playbook_snippet_template.md}`
- Precedent playbook: `.opencode/skills/cli-codex/manual_testing_playbook/` (most recent canonical)
- Plan: `/Users/michelkerkmeester/.claude/plans/create-new-085-spec-magical-stardust.md`
