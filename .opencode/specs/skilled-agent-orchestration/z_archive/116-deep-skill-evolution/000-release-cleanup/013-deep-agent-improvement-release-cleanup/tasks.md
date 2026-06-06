---
title: "Tasks: deep-agent-improvement skill release cleanup"
description: "Granular task ledger across the five sequential phases. Task IDs T001-T0NN per phase; [P] marks parallelizable inside a phase; [B] marks blocked tasks."
trigger_phrases:
  - "deep-agent-improvement release cleanup tasks"
  - "task ledger"
  - "phase 1 tasks"
  - "phase 5 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-tasks-authored"
    next_safe_action: "author-checklist-decision-record-summary"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000005004"
      session_id: "131-000-005-spec-author"
      parent_session_id: "131-000-005-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Tasks: deep-agent-improvement skill release cleanup

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

- [x] T001 Read sk-doc + system-spec-kit standards and the sibling `002-deep-research` pattern (spec/plan/tasks/checklist/decision-record/implementation-summary/resource-map + 4 schemas)
- [x] T002 Author `spec.md` (Level 3)
- [x] T003 [P] Author `plan.md`
- [ ] T004 [P] Author `tasks.md` (this file)
- [ ] T005 [P] Author `checklist.md` (Level 3 with arch-verify, perf-verify, deploy-ready, compliance-verify, docs-verify, sign-off)
- [ ] T006 [P] Author `decision-record.md` with 4 ADRs (+ reserved ADR-005/006)
- [ ] T007 [P] Author `implementation-summary.md` skeleton (placeholders only; filled post-implementation)
- [ ] T008 Author `resource-map.yaml` with full artifact inventory (~110 rows)
- [ ] T009 [P] Author `schemas/audit-finding.schema.json`
- [ ] T010 [P] Author `schemas/changelog-entry.schema.json`
- [ ] T011 [P] Author `schemas/validation-report.schema.json`
- [ ] T012 [P] Author `schemas/iteration-output.schema.json`
- [ ] T013 Run `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` for this spec folder; reapply manual `depends_on` + `related_to`; verify parent `children_ids` + `last_active_child_id`
- [ ] T014 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` (exit 0 expected)
- [ ] T015 Run `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py --export-json --pretty` if graph-metadata edited
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Workflow Phase 2: Skill Audit

- [ ] T020 Reload `resource-map.yaml` and read all sk-doc templates referenced
- [ ] T021 [P] Audit `SKILL.md` (~545 LOC) against `skill_md_template.md` — Smart Router section explicitly preserved unless cascade; record the ~545-LOC over-cap as a finding
- [ ] T022 [P] Audit each of 15 `references/*.md` against `skill_reference_template.md`
- [ ] T023 [P] Audit each of 9 `assets/*` against `skill_asset_template.md` (JSON/JSONC validity for non-md)
- [ ] T024 [P] Audit 14 `feature_catalog/**/*.md` against `feature_catalog_template.md` + `feature_catalog_creation.md`
- [ ] T025 [P] Audit 39 `manual_testing_playbook/**` against `manual_testing_playbook_template.md` + `manual_testing_playbook_creation.md`
- [ ] T026 [P] Audit 10 `changelog/v*.md` format only (no new entry yet)
- [ ] T027 [P] Bug-scan 14 `scripts/*.cjs` + `scripts/lib/*` + `scripts/tests/*` for path refs + `node --check` syntax (no template enforcement)
- [ ] T028 Emit findings to `audit-findings.jsonl` (schema-validated)
- [ ] T029 Apply surgical fix for every P0/P1 finding
- [ ] T030 Update `resource-map.yaml` with `audit_status` per row
- [ ] T031 `rg -F` every cited path reference inside `.opencode/skills/deep-agent-improvement/`
- [ ] T032 `rg "mcp__"` sweep to verify MCP tool names resolve
- [ ] T033 Strict validate exits 0

---

### Workflow Phase 3: README Rewrite + Changelog v1.7.0.0

- [ ] T040 Re-read `Public/README.md` + `system-spec-kit/README.md` (do not quote, internalize voice + structure)
- [ ] T041 Re-read `hvr_rules.md` + `readme_creation.md` + `skill_readme_template.md` for current standards
- [ ] T042 Extract feature inventory from `feature_catalog/feature_catalog.md` + 3 sub-categories
- [ ] T043 Rewrite `.opencode/skills/deep-agent-improvement/README.md` in place per `skill_readme_template.md` (correct §5 STRUCTURE + §6 SCRIPTS to 15 references + 14 scripts; fix §3 FEATURES numbering gap)
- [ ] T044 Self-score against HVR rubric (must reach >=85)
- [ ] T045 Iterate on prose until threshold reached
- [ ] T046 Author `.opencode/skills/deep-agent-improvement/changelog/v1.7.0.0.md` (schema-validated)
- [ ] T047 Bump `version:` in SKILL.md frontmatter `1.6.0.0` → `1.7.0.0`
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

### Step 5a: 10 iterations

- [ ] T080 Verify `cli-devin` (`devin` binary) reachable and SWE-1.6 preset selectable
- [ ] T081 Read `.opencode/skills/cli-devin/SKILL.md` (CLI dispatch rule)
- [ ] T082 Read `.opencode/skills/sk-prompt-small-model/SKILL.md` (small-model dispatch rule)
- [ ] T083 Read `deep-agent-improvement/references/mixed_executor_methodology.md` (breadth/adjudication/synthesis split)
- [ ] T084 Compose RCAF dispatch prompt (research target = deep-agent-improvement logic gaps; inputs = spec.md + audit-findings.jsonl)
- [ ] T085 Iter 1: `cli-devin --model swe-1.6` (breadth) — output to `research/iterations/iter-01-cli-devin.json`
- [ ] T086 Between-iter cleanup: SIGKILL (codex/opencode) + /tmp sweep (devin preserved)
- [ ] T087 Iter 2: `cli-devin --model swe-1.6` (breadth)
- [ ] T088 Between-iter cleanup
- [ ] T089 Iter 3: `cli-devin --model swe-1.6` (breadth)
- [ ] T090 Between-iter cleanup
- [ ] T091 Iter 4: `cli-devin --model swe-1.6` (breadth)
- [ ] T092 Between-iter cleanup
- [ ] T093 Iter 5: `cli-devin --model swe-1.6` (breadth)
- [ ] T094 Between-iter cleanup
- [ ] T095 Iter 6: `cli-devin --model swe-1.6` (breadth)
- [ ] T096 Between-iter cleanup
- [ ] T097 Iter 7: `cli-devin --model swe-1.6` (adjudication / false-positive filter)
- [ ] T098 Between-iter cleanup
- [ ] T099 Iter 8: `cli-devin --model swe-1.6` (synthesis on confirmed findings)
- [ ] T100 Between-iter cleanup
- [ ] T101 Iter 9: `cli-devin --model swe-1.6` (synthesis)
- [ ] T102 Between-iter cleanup
- [ ] T103 Iter 10: `cli-devin --model swe-1.6` (final synthesis/validation)
- [ ] T104 Final cleanup
- [ ] T105 Author `research/convergence-summary.md` (stop reason + counts)

### Step 5b: Merge

- [ ] T110 Collect `logic_gaps` from all 10 iteration JSON files
- [ ] T111 Dedupe by `gap_id` + semantic similarity
- [ ] T112 Filter out gaps already in `spec.md` or `audit-findings.jsonl`
- [ ] T113 Append novel gaps to `resource-map.yaml` `phase5_augmentation` (with iteration source links)
- [ ] T114 If any new P0/P1 gap: open sub-task under T115-T119 and address
- [ ] T115 Fill `implementation-summary.md` (no template placeholders)
- [ ] T116 Final strict validate exits 0
- [ ] T117 `/memory:save` writes continuity update
- [ ] T118 `skill_graph_compiler.py --export-json --pretty` re-run
- [ ] T119 Verify `skill_advisor.py "improve an agent" --threshold 0.8` surfaces deep-agent-improvement

### Step 5c: Phase-5 follow-on escalations (out-of-scope code/config gaps)

> The deep-research loop surfaced 2 gaps that need `.cjs`/config changes, which spec §3 keeps out of this doc-cleanup packet. Escalated for a follow-on remediation packet. Full detail: `resource-map.yaml` `phase5_augmentation` + `research/convergence-summary.md`. The 3 in-scope doc gaps (LG-0001/0002/0005) were fixed in this packet.

- [ ] T120 [FOLLOW-ON] LG-0004: reconcile the benchmark aggregate-score threshold (generate-profile.cjs=75, benchmark-profiles/default.json=80, improvement_config.json + docs=85) to one authoritative value.
- [ ] T121 [FOLLOW-ON] LG-0006: fix `run-benchmark.cjs` default `profilesDir` (`assets/target-profiles` -> `assets/benchmark-profiles`) so the shipped default profile is discoverable.
- [ ] T122 [FOLLOW-ON] cli-devin recipe drift: the shipped agent-config recipes carry fields the current `devin 2026.5.6-12` strict parser rejects (`verification_enabled`, `bayesian_scoring_enabled`, `fallback_chain`, etc.) — fix in the cli-devin skill.
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
