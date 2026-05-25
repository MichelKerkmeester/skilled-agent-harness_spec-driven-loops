---
title: "Tasks: deep-ai-council skill release cleanup"
description: "Granular task ledger across the five sequential phases. Task IDs T001-T0NN per phase; [P] marks parallelizable inside a phase; [B] marks blocked tasks."
trigger_phrases:
  - "deep-ai-council release cleanup tasks"
  - "task ledger"
  - "phase 1 tasks"
  - "phase 5 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-tasks-authored"
    next_safe_action: "author-checklist-decision-record-summary"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004004"
      session_id: "131-000-004-spec-author"
      parent_session_id: "131-000-004-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Tasks: deep-ai-council skill release cleanup

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

> **Phase taxonomy mapping** — this packet runs 5 workflow phases. They map onto the sk-doc 3-phase template skeleton (Setup → Implementation → Verification) as follows:
> - `Phase 1: Setup` covers spec-folder creation (workflow phase 1).
> - `Phase 2: Implementation` covers skill audit + README rewrite + changelog (workflow phases 2 and 3).
> - `Phase 3: Verification` covers alignment validation gate + deep-research loop + resource-map merge (workflow phases 4 and 5).
>
> Sub-sections preserve the 5-phase boundaries for execution clarity.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Workflow Phase 1: Initial Spec Creation

- [x] T001 Read sk-doc templates + sibling 002 structural docs as authoring references
- [x] T002 Author `spec.md` (Level 3)
- [x] T003 [P] Author `plan.md`
- [ ] T004 [P] Author `tasks.md` (this file)
- [ ] T005 [P] Author `checklist.md` (Level 3 with arch-verify, perf-verify, deploy-ready, compliance-verify, docs-verify, sign-off)
- [ ] T006 [P] Author `decision-record.md` with 4 ADRs (+ reserved ADR-005/006)
- [ ] T007 [P] Author `implementation-summary.md` skeleton (placeholders only; filled post-implementation)
- [ ] T008 Author `resource-map.yaml` with full artifact inventory (~100 rows)
- [ ] T009 [P] Author `schemas/audit-finding.schema.json`
- [ ] T010 [P] Author `schemas/changelog-entry.schema.json`
- [ ] T011 [P] Author `schemas/validation-report.schema.json`
- [ ] T012 [P] Author `schemas/iteration-output.schema.json`
- [ ] T013 Hand-author `description.json` + `graph-metadata.json` (mirror sibling 002; do NOT run generate-context.js — protects parent wiring)
- [ ] T014 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` (exit 0 expected)
- [ ] T015 Sanity-check each schema against its embedded `examples` (ajv if present, else manual)
- [ ] T016 `memory_index_scan({ specFolder })` to index the new folder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Workflow Phase 2: Skill Audit

- [ ] T020 Reload `resource-map.yaml` and read all sk-doc templates referenced
- [ ] T021 [P] Audit `SKILL.md` (477 LOC) against `skill_md_template.md` + `skill_smart_router.md` — Smart Router §3 explicitly preserved unless cascade
- [ ] T022 [P] Audit each of 11 `references/*.md` against `skill_reference_template.md`
- [ ] T023 [P] Audit 32 `feature_catalog/**/*.md` against `feature_catalog_creation.md` (verify missing root `feature_catalog.md` candidate)
- [ ] T024 [P] Audit 33 `manual_testing_playbook/**/*.md` against `manual_testing_playbook_creation.md` (verify "18 scenarios/7 categories" vs "32/9" candidate in SKILL §7)
- [ ] T025 [P] Audit 5 `changelog/v*.md` format only (no new entry yet)
- [ ] T026 [P] Bug-scan 16 `scripts/**` files for path refs + syntax (sk-code/opencode standards; no template enforcement)
- [ ] T027 Verify every phase-1 candidate-drift item against actual template + file (drop false positives)
- [ ] T028 Emit findings to `audit-findings.jsonl` (schema-validated)
- [ ] T029 Apply surgical fix for every P0/P1 finding
- [ ] T030 Update `resource-map.yaml` with `audit_status` per row
- [ ] T031 `rg -F` every cited path reference inside `.opencode/skills/deep-ai-council/`
- [ ] T032 `rg "mcp__|council_graph_"` sweep to verify tool names resolve
- [ ] T033 Strict validate exits 0

---

### Workflow Phase 3: README Rewrite + Changelog v2.1.0.0

- [ ] T040 Re-read `Public/README.md` + `system-spec-kit/README.md` (do not quote, internalize voice + structure)
- [ ] T041 Re-read `hvr_rules.md` + `readme_creation.md` for current standards
- [ ] T042 Extract feature inventory from `feature_catalog/**` (32 entries across 9 categories)
- [ ] T043 Rewrite `.opencode/skills/deep-ai-council/README.md` in place per `skill_readme_template.md`
- [ ] T044 Self-score against HVR rubric (must reach ≥85)
- [ ] T045 Iterate on prose until threshold reached
- [ ] T046 Author `.opencode/skills/deep-ai-council/changelog/v2.1.0.0.md` (schema-validated; sk-doc no-frontmatter changelog convention)
- [ ] T047 Bump `version:` in SKILL.md frontmatter `2.0.0.0` → `2.1.0.0`
- [ ] T048 Strict validate exits 0
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

### Step 5a: 10 iterations (all cli-devin SWE-1.6)

- [ ] T080 Verify `devin` reachable + authenticated (`devin --print` smoke-test)
- [ ] T081 Read `.opencode/skills/cli-devin/SKILL.md` (CLI dispatch rule — mandatory before composing prompt)
- [ ] T082 Read `.opencode/skills/sk-prompt-small-model/SKILL.md` (small-model dispatch rule for SWE-1.6)
- [ ] T083 Confirm `schemas/iteration-output.schema.json` + convergence criteria defined BEFORE running (per phase-5 "define before running")
- [ ] T084 Iter 1: `cli-devin --model swe-1.6` — output to `research/iterations/iter-01-cli-devin.json`
- [ ] T085 Between-iter sweep: kill non-devin orphans + `/tmp` sweep; PRESERVE devin
- [ ] T086 Iter 2: `cli-devin --model swe-1.6`
- [ ] T087 Between-iter sweep
- [ ] T088 Iter 3: `cli-devin --model swe-1.6`
- [ ] T089 Between-iter sweep
- [ ] T090 Iter 4: `cli-devin --model swe-1.6`
- [ ] T091 Between-iter sweep
- [ ] T092 Iter 5: `cli-devin --model swe-1.6`
- [ ] T093 Between-iter sweep
- [ ] T094 Iter 6: `cli-devin --model swe-1.6`
- [ ] T095 Between-iter sweep
- [ ] T096 Iter 7: `cli-devin --model swe-1.6`
- [ ] T097 Between-iter sweep
- [ ] T098 Iter 8: `cli-devin --model swe-1.6`
- [ ] T099 Between-iter sweep
- [ ] T100 Iter 9: `cli-devin --model swe-1.6`
- [ ] T101 Between-iter sweep
- [ ] T102 Iter 10: `cli-devin --model swe-1.6`
- [ ] T103 Final sweep
- [ ] T104 Author `research/convergence-summary.md` (stop reason + counts)

### Step 5b: Merge

- [ ] T110 Collect `logic_gaps` from all 10 iteration JSON files
- [ ] T111 Dedupe by `gap_id` + semantic similarity
- [ ] T112 Filter out gaps already in `spec.md` or `audit-findings.jsonl`
- [ ] T113 Append novel gaps to `resource-map.yaml` `phase_5_augmentation` (with iteration source links)
- [ ] T114 If any new P0/P1 gap: open sub-task under T115-T119 and address
- [ ] T115 Fill `implementation-summary.md` (no template placeholders)
- [ ] T116 Final strict validate exits 0
- [ ] T117 `/memory:save` writes continuity update
- [ ] T118 `skill_graph_compiler.py --export-json --pretty` re-run
- [ ] T119 Verify `skill_advisor.py "run a deep ai council" --threshold 0.8` surfaces deep-ai-council
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
- **Resource Map**: See `resource-map.yaml`
- **Schemas**: See `schemas/*.json`
<!-- /ANCHOR:cross-refs -->
