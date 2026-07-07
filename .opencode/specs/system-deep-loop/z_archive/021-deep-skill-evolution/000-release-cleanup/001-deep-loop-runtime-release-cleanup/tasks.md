---
title: "Tasks: deep-loop-runtime skill release cleanup"
description: "Granular task ledger across the five sequential phases. Task IDs T001-T0NN per phase; [P] marks parallelizable inside a phase; [B] marks blocked tasks."
trigger_phrases:
  - "deep-loop-runtime release cleanup tasks"
  - "task ledger"
  - "phase 1 tasks"
  - "phase 5 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime-release-cleanup"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-tasks-authored"
    next_safe_action: "author-checklist-decision-record-summary"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001004"
      session_id: "131-000-001-spec-author"
      parent_session_id: "131-000-001-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Tasks: deep-loop-runtime skill release cleanup

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

- [x] T001 Read sibling 002-deep-research spec docs as structural template (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, resource-map.md)
- [x] T002 Author `spec.md` (Level 3)
- [x] T003 [P] Author `plan.md`
- [x] T004 [P] Author `tasks.md` (this file)
- [x] T005 [P] Author `checklist.md` (Level 3 with arch-verify, perf-verify, deploy-ready, compliance-verify, docs-verify, sign-off)
- [x] T006 [P] Author `decision-record.md` with 5 ADRs + reserved ADR-006/007
- [x] T007 [P] Author `implementation-summary.md` skeleton (placeholders only; filled post-implementation)
- [x] T008 Author `resource-map.md` with full artifact inventory (~88 rows; includes LOG_ONLY code rows per ADR-004 + ABSENT_BY_DESIGN row per ADR-003)
- [x] T009 [P] Copy `schemas/audit-finding.schema.json` from sibling 002
- [x] T010 [P] Copy `schemas/changelog-entry.schema.json` from sibling 002
- [x] T011 [P] Copy `schemas/validation-report.schema.json` from sibling 002
- [x] T012 [P] Copy `schemas/iteration-output.schema.json` from sibling 002
- [x] T013 Author `description.json` + `graph-metadata.json` (manual fields; full canonical save deferred to phase-5 `/memory:save`)
- [ ] T014 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` (exit 0 expected)
- [ ] T015 Run `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py --export-json --pretty` if graph-metadata edited
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Workflow Phase 2: Skill Audit

- [ ] T020 Reload `resource-map.md` and read all sk-doc templates referenced
- [ ] T021 [P] Audit `SKILL.md` (266 LOC) against `skill_md_template.md` — Smart Router section explicitly preserved unless cascade
- [ ] T022 [P] Audit each of 4 `references/*.md` (732 LOC total) against `skill_reference_template.md`
- [ ] T023 [P] Audit 18 `feature_catalog/**/*.md` + index against `feature_catalog_creation.md` standards
- [ ] T024 [P] Audit 17 `manual_testing_playbook/**/*.md` + index against `manual_testing_playbook_creation.md` standards
- [ ] T025 [P] Audit 8 sub-READMEs (lib/, lib/council/, lib/coverage-graph/, lib/deep-loop/, scripts/, tests/, tests/helpers/, storage/) — note `no-template` deviation per row
- [ ] T026 [P] Audit `changelog/v1.0.0.0.md` format only (no new entry yet)
- [ ] T027 [P] LOG_ONLY pass: read `lib/`, `scripts/`, `tests/`, `storage/` for bug evidence per ADR-004; never edit
- [ ] T028 Emit findings to `findings/audit-findings.jsonl` (schema-validated via `node` parse + structural check)
- [ ] T029 Apply surgical fix for every P0/P1 doc-class finding (code-class always LOG_ONLY)
- [ ] T030 Update `resource-map.md` with `audit_status` column per row
- [ ] T031 `rg -F` every cited path reference inside audited deep-loop-runtime docs
- [ ] T032 `rg "mcp__"` sweep to verify MCP tool names resolve (if any present)
- [ ] T033 Author `findings/audit-summary.md` rollup (severity counts + deviation table)
- [ ] T034 Verify zero code edits: `git diff --stat -- '.opencode/skills/deep-loop-runtime/lib/**' '.opencode/skills/deep-loop-runtime/scripts/**' '.opencode/skills/deep-loop-runtime/tests/**' '.opencode/skills/deep-loop-runtime/storage/**'` empty
- [ ] T035 Strict validate exits 0

---

### Workflow Phase 3: README Rewrite + Changelog v1.1.0.0

- [ ] T040 Re-read `Public/README.md` + `.opencode/skills/system-spec-kit/README.md` (do not quote; internalize voice + structure)
- [ ] T041 Re-read `hvr_rules.md` + `readme_creation.md` for current standards
- [ ] T042 Extract feature inventory from `.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md` + 7 sub-domains
- [ ] T043 Rewrite `.opencode/skills/deep-loop-runtime/README.md` in place per `skill_readme_template.md`
- [ ] T044 Self-score against HVR rubric (must reach ≥85)
- [ ] T045 Iterate on prose until threshold reached
- [ ] T046 Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme <path>` (exit 0)
- [ ] T047 Author `.opencode/skills/deep-loop-runtime/changelog/v1.1.0.0.md` (schema-validated)
- [ ] T048 Bump `version:` in SKILL.md frontmatter `1.0.0` → `1.1.0`
- [ ] T049 Strict validate exits 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Workflow Phase 4: Alignment Validation Gate (BLOCKING)

- [ ] T060 For each artifact in scope: reload sk-doc template, diff structural sections, score template-match %
- [ ] T061 Run `validate_document.py --type <type> --json <file>` per artifact (stage-1 blocking)
- [ ] T062 Run `extract_structure.py --json <file>` per artifact (stage-2 structure)
- [ ] T063 Emit per-artifact entry to `validation/validation-report.jsonl` (schema-validated)
- [ ] T064 Add ABSENT_BY_DESIGN row for `assets/` per ADR-003
- [ ] T065 Compile `validation/validation-report.md` human-readable summary
- [ ] T066 Verify SC-007 invariant: `git diff --stat` filter on lib/scripts/tests/storage returns empty
- [ ] T067 **STOP. Surface report to human.**
- [ ] T068 Wait for explicit human approval
- [ ] T069 Record approval in `decision-record.md` as ADR-006 (date, approver, scope, validation-report SHA, iteration budget granted)
- [ ] T070 Confirm ADR-006 present before any phase-5 dispatch begins

---

### Workflow Phase 5: Deep Research and Resource-Map Merge

### Step 5a: 10 iterations (cli-devin SWE-1.6 per ADR-002)

- [ ] T080 Verify `devin` binary present + license valid; smoke-test passes
- [ ] T081 Sweep `/tmp/devin-*` + `/tmp/deep-research-*` orphans pre-dispatch
- [ ] T082 Read `.opencode/skills/cli-devin/SKILL.md` (CLI dispatch rule per ADR-002 + CLAUDE.md mandate)
- [ ] T083 Read `.opencode/skills/sk-prompt-models/SKILL.md` (small-model dispatch rule per CLAUDE.md mandate)
- [ ] T084 Read `.opencode/skills/deep-research/SKILL.md` for `/deep:start-research-loop` command contract
- [ ] T085 Compose iteration prompt-pack from spec.md + findings/audit-findings (summary) + validation/validation-report (summary) + research question
- [ ] T086 Iter 1: `/deep:start-research-loop :auto` with cli-devin SWE-1.6 — output to `research/iterations/iter-01-cli-devin.json`
- [ ] T087 Bundle gate iter 1: grep internal_imports + smoke-run validation_commands
- [ ] T088 Between-iter cleanup: SIGKILL + /tmp sweep
- [ ] T089 Iter 2 (repeat T086-T088 cycle)
- [ ] T090 Iter 3
- [ ] T091 Iter 4
- [ ] T092 Iter 5
- [ ] T093 Convergence check after iter 5: if 2 consecutive zero-novel-P0/P1 + Bayesian confidence ≥0.9 → early stop; else continue
- [ ] T094 Iter 6 (if not converged)
- [ ] T095 Iter 7 (if not converged)
- [ ] T096 Iter 8 (if not converged)
- [ ] T097 Iter 9 (if not converged)
- [ ] T098 Iter 10 (if not converged; hard cap)
- [ ] T099 Final cleanup: SIGKILL + /tmp sweep
- [ ] T100 Author `research/convergence-summary.md` (stop reason + per-iter novelty rate + Bayesian-scorer confidence trace)
- [ ] T101 Author `research/deep-research-synthesis.md` (workflow-owned per CLAUDE.md §5 exemption)

### Step 5b: Merge

- [ ] T110 Collect `logic_gaps` from all archived iteration JSON files
- [ ] T111 Dedupe by `gap_id` + semantic similarity
- [ ] T112 Filter out gaps already in `spec.md` or `findings/audit-findings.jsonl`
- [ ] T113 Append novel gaps to `resource-map.md` Phase-5 Augmentation section (with iteration source links)
- [ ] T114 If empty result: explicit single row recording convergence reason + iter count
- [ ] T115 If any new P0/P1 gap: open sub-task `T-Aux-NN` in this file and address per ADR-004 boundary (still no code edits)
- [ ] T116 Fill `implementation-summary.md` (no template placeholders)
- [ ] T117 Reconcile completion metadata across spec.md / plan.md / checklist.md per CLAUDE.md COMPLETION VERIFICATION rule
- [ ] T118 Final strict validate exits 0
- [ ] T119 `/memory:save` writes continuity update (POST-SAVE QUALITY REVIEW: HIGH issues patched)
- [ ] T120 `skill_graph_compiler.py --export-json --pretty` re-run if metadata touched
- [ ] T121 Verify SC-007: `git diff --stat -- '.opencode/skills/deep-loop-runtime/lib/**' '.opencode/skills/deep-loop-runtime/scripts/**' '.opencode/skills/deep-loop-runtime/tests/**' '.opencode/skills/deep-loop-runtime/storage/**'` empty
- [ ] T122 Verify `skill_advisor.py "deep-loop-runtime" --threshold 0.8` surfaces deep-loop-runtime
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Strict validate exits 0 at every phase boundary
- [ ] Phase 4 ADR-006 recorded before any phase 5 task starts
- [ ] `implementation-summary.md` filled with real evidence (no placeholders)
- [ ] SC-007 invariant verified (zero code edits to deep-loop-runtime lib/scripts/tests/storage)
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
- **Sibling Tasks**: See `../002-deep-research/tasks.md` (structural template; differs on toolchain split)
<!-- /ANCHOR:cross-refs -->
