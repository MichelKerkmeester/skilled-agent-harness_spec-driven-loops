---
title: "Tasks: deep-review skill release cleanup"
description: "Granular task ledger across the five sequential phases. Task IDs T001-T0NN per phase; [P] marks parallelizable inside a phase; [B] marks blocked tasks."
trigger_phrases:
  - "deep-review release cleanup tasks"
  - "task ledger"
  - "phase 1 tasks"
  - "phase 5 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/003-deep-review"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-tasks-authored"
    next_safe_action: "author-checklist-decision-record-summary"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003004"
      session_id: "131-000-003-spec-author"
      parent_session_id: "131-000-003-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Tasks: deep-review skill release cleanup

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

> **Phase taxonomy mapping** — this packet runs 5 workflow phases. They map onto the sk-doc 3-phase template skeleton (Setup -> Implementation -> Verification) as follows:
> - `Phase 1: Setup` covers spec-folder creation (workflow phase 1).
> - `Phase 2: Implementation` covers skill audit + README rewrite + changelog (workflow phases 2 and 3).
> - `Phase 3: Verification` covers alignment validation gate + deep-research loop + resource-map merge (workflow phases 4 and 5).
>
> Sub-sections preserve the 5-phase boundaries for execution clarity.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Workflow Phase 1: Initial Spec Creation

- [x] T001 Read sk-doc templates (`spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, `checklist.md.tmpl`, `decision-record.md.tmpl`, `implementation-summary.md.tmpl`, `resource-map.md.tmpl`) and sibling 002-deep-research pattern reference
- [x] T002 Author `spec.md` (Level 3)
- [x] T003 [P] Author `plan.md`
- [ ] T004 [P] Author `tasks.md` (this file)
- [ ] T005 [P] Author `checklist.md` (Level 3 with arch-verify, perf-verify, deploy-ready, compliance-verify, docs-verify, sign-off)
- [ ] T006 [P] Author `decision-record.md` with 5 ADRs (ADR-001 single-executor toolchain, ADR-002 surgical-edit, ADR-003 resource-map.md, ADR-004 Smart Router preservation, ADR-005 README tone calibration); ADR-006 reserved for phase-4 approval; ADR-007 reserved for any Smart Router cascade override
- [ ] T007 [P] Author `implementation-summary.md` skeleton (placeholders only; filled post-implementation)
- [ ] T008 Author `resource-map.md` with full artifact inventory (~95 rows)
- [ ] T009 [P] Author `schemas/audit-finding.schema.json`
- [ ] T010 [P] Author `schemas/changelog-entry.schema.json`
- [ ] T011 [P] Author `schemas/validation-report.schema.json`
- [ ] T012 [P] Author `schemas/iteration-output.schema.json`
- [ ] T013 Run `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` for this spec folder; reapply manual `depends_on` + `related_to`
- [ ] T014 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` (exit 0 expected)
- [ ] T015 Run `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py --export-json --pretty` if graph-metadata edited
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Workflow Phase 2: Skill Audit

- [ ] T020 Reload `resource-map.md` and read all sk-doc templates referenced
- [ ] T021 [P] Audit `SKILL.md` (540 LOC) against `skill_md_template.md` — Smart Router section explicitly preserved unless cascade
- [ ] T022 [P] Audit each of 4 `references/*.md` (2700 LOC total) against `skill_reference_template.md`
- [ ] T023 [P] Audit each of 6 `assets/*` against `skill_asset_template.md`
- [ ] T024 [P] Audit 21 `feature_catalog/**/*.md` against `feature_catalog_template.md` + `feature_catalog_creation.md`
- [ ] T025 [P] Audit 45 `manual_testing_playbook/**/*.md` against `manual_testing_playbook_template.md` + `manual_testing_playbook_creation.md`
- [ ] T026 [P] Audit 12 `changelog/v*.md` format only (no new entry yet)
- [ ] T027 [P] Bug-scan 2 active `scripts/*.cjs` (`reduce-state.cjs` 1657 LOC, `runtime-capabilities.cjs` 114 LOC) for path refs + syntax (no template enforcement; no behavioral edits)
- [ ] T028 Emit findings to `audit-findings.jsonl` (schema-validated)
- [ ] T029 Apply surgical fix for every P0/P1 finding (excluding scripts/ which stays bug-scan-only)
- [ ] T030 Update `resource-map.md` with `audit_status` column per row
- [ ] T031 `rg -F` every cited path reference inside `.opencode/skills/deep-review/`
- [ ] T032 `rg "mcp__"` sweep to verify MCP tool names resolve
- [ ] T033 Strict validate exits 0

---

### Workflow Phase 3: README Rewrite + Changelog v1.9.0.0

- [ ] T040 Re-read `Public/README.md` + `system-spec-kit/README.md` (do not quote, internalize voice + structure)
- [ ] T041 Re-read `hvr_rules.md` + `readme_creation.md` for current standards
- [ ] T042 Extract feature inventory from `feature_catalog/feature_catalog.md` + 4 sub-categories (loop-lifecycle 6, state-management 5, review-dimensions 4, severity-system 5 = 20 features + root index = 21 files)
- [ ] T043 Rewrite `.opencode/skills/deep-review/README.md` in place per `skill_readme_template.md`
- [ ] T044 Self-score against HVR rubric (must reach >=85)
- [ ] T045 Iterate on prose until threshold reached
- [ ] T046 Verify README tone matches ~70% intensity of `Public/README.md` per ADR-005 calibration checklist
- [ ] T047 Author `.opencode/skills/deep-review/changelog/v1.9.0.0.md` (schema-validated)
- [ ] T048 Bump `version:` in SKILL.md frontmatter `1.8.0.0` -> `1.9.0.0`
- [ ] T049 Strict validate exits 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Workflow Phase 4: Alignment Validation Gate (BLOCKING)

- [ ] T060 For each artifact in scope: reload sk-doc template, diff structural sections, score template-match %
- [ ] T061 Emit per-artifact entry to `validation-report.jsonl` (schema-validated)
- [ ] T062 Compile `validation-report.md` human-readable summary
- [ ] T063 **STOP. Surface report to human.**
- [ ] T064 Wait for explicit human approval
- [ ] T065 Record approval in `decision-record.md` as ADR-006 (date, approver, scope)
- [ ] T066 Confirm ADR-006 present before any phase-5 dispatch begins

---

### Workflow Phase 5: Deep Research and Resource-Map Merge

### Step 5a: 10 iterations

- [ ] T080 Verify `cli-devin` binary present (`which devin` or `devin --version`)
- [ ] T081 Verify SWE-1.6 model is reachable via cli-devin
- [ ] T082 Read `.opencode/skills/cli-devin/SKILL.md` (CLI dispatch rule)
- [ ] T083 Read `.opencode/skills/sk-prompt-small-model/SKILL.md` (small-model dispatch rule)
- [ ] T084 Read `.opencode/skills/sk-prompt/SKILL.md` (RCAF + CLEAR composition)
- [ ] T085 Iter 1: `cli-devin --model swe-1.6` — output to `research/iterations/iter-01-cli-devin.json`
- [ ] T086 Between-iter cleanup: `pkill -9 -f devin` + sweep `/tmp/devin-*` and `/tmp/deep-research-*`
- [ ] T087 Iter 2: `cli-devin --model swe-1.6`
- [ ] T088 Between-iter cleanup
- [ ] T089 Iter 3: `cli-devin --model swe-1.6`
- [ ] T090 Between-iter cleanup
- [ ] T091 Iter 4: `cli-devin --model swe-1.6`
- [ ] T092 Between-iter cleanup
- [ ] T093 Iter 5: `cli-devin --model swe-1.6`
- [ ] T094 Between-iter cleanup
- [ ] T095 Iter 6: `cli-devin --model swe-1.6`
- [ ] T096 Between-iter cleanup
- [ ] T097 Iter 7: `cli-devin --model swe-1.6`
- [ ] T098 Between-iter cleanup
- [ ] T099 Iter 8: `cli-devin --model swe-1.6`
- [ ] T100 Between-iter cleanup
- [ ] T101 Iter 9: `cli-devin --model swe-1.6`
- [ ] T102 Between-iter cleanup
- [ ] T103 Iter 10: `cli-devin --model swe-1.6`
- [ ] T104 Final cleanup
- [ ] T105 Author `research/convergence-summary.md` (stop reason + counts; record true convergence iter even if all 10 ran per operator directive)

### Step 5b: Merge

- [ ] T110 Collect `logic_gaps` from all 10 iteration JSON files
- [ ] T111 Dedupe by `gap_id` + semantic similarity
- [ ] T112 Filter out gaps already in `spec.md` or `audit-findings.jsonl`
- [ ] T113 Append novel gaps to `resource-map.md` Phase-5 Augmentation section (with iteration source links)
- [ ] T114 If any new P0/P1 gap: open sub-task under T115-T119 and address
- [ ] T115 Fill `implementation-summary.md` (no template placeholders)
- [ ] T116 Final strict validate exits 0
- [ ] T117 `/memory:save` writes continuity update
- [ ] T118 `skill_graph_compiler.py --export-json --pretty` re-run
- [ ] T119 Verify `skill_advisor.py "run a deep review loop" --threshold 0.8` surfaces deep-review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Strict validate exits 0 at every phase boundary
- [ ] Phase 4 ADR-006 recorded before any phase 5 task starts
- [ ] `implementation-summary.md` filled with real evidence (no placeholders)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Resource Map**: See `resource-map.md`
- **Schemas**: See `schemas/*.json`
- **Sibling Pattern**: See `../002-deep-research/tasks.md`
<!-- /ANCHOR:cross-refs -->
