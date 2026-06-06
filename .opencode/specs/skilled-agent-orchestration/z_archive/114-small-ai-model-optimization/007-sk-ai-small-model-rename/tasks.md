---
title: "Tasks: Phase 7 — rename sk-small-model → sk-prompt-small-model"
description: "Task breakdown for the rename + propagation + advisor-reindex Phase 7 work."
trigger_phrases:
  - "rename tasks"
  - "sk-prompt-small-model tasks"
  - "skill rename task breakdown"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-prompt-small-model-rename"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks.md"
    next_safe_action: "Execute Phase A baseline + Phase B cli-devin dispatch"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000007"
      session_id: "114-007-tasks-init"
      parent_session_id: "114-007-spec-init"
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 7 — rename sk-small-model → sk-prompt-small-model

---

<!-- ANCHOR:notation -->
## Task Notation

- `T###` — sequential task ID
- `[P]` — parallel-safe task (can run concurrently with other `[P]` tasks in the same phase)
- `[seq]` — must run sequentially after the prior task
- `[D:T###]` — depends on task T###

Estimated wall-clock per task: 1–10 min unless noted.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
### Phase A — pre-flight

- [ ] **T001** [seq] Capture pre-rename rg baseline to `007-…/scratch/rg-baseline-before.txt`. Expected: 95 hits.
- [ ] **T002** [P] Capture per-surface rg classification (live vs historical) to `007-…/scratch/rg-classification.json`.
- [ ] **T003** [P] Verify `git status --short` clean for sk-small-model + cli-devin/graph-metadata.json + cli-opencode/graph-metadata.json paths.
- [ ] **T004** [P] Confirm cli-devin SKILL.md in context (already read).
- [ ] **T005** [P] Confirm `skill_graph_compiler.py` exists.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase B — cli-devin SWE-1.6 context gathering (parallel x3, ~10 min)

- [ ] **T010** [P] Author prompt file for Job-1 (live skill body + sibling graph metadata) at `007-…/scratch/cli-devin/job-1-prompt.md`. Composition: RCAF framework via sk-prompt; medium-density pre-planning (3 ordered steps); bundle-gate "standard"; CLEAR 5-check passing. Return JSON of {file_path, edit_recipe, verification_command} per in-scope file.
- [ ] **T011** [P] Author prompt file for Job-2 (root docs AGENTS.md/CLAUDE.md/README.md + auto-memory MEMORY.md + reference_small_model_dispatch_matrix.md + feedback_skill_graph_compiler_rebuild.md).
- [ ] **T012** [P] Author prompt file for Job-3 (manual playbooks: cli-devin/manual_testing_playbook + cli-opencode/manual_testing_playbook + cli-opencode/references/permissions-matrix.md + cli-opencode/assets/permissions-matrix.example-packet-local.json).
- [ ] **T013** [D:T010,T011,T012] Dispatch all 3 jobs in parallel: `devin --prompt-file <path> --model swe-1.6 --permission-mode auto -p 2>&1 </dev/null > 007-…/scratch/cli-devin/job-N.log &`.
- [ ] **T014** [D:T013] Apply [[feedback_cli_devin_bundle_verification]] gate: grep-verify each returned bundle's symbols, paths, and file existence.
- [ ] **T015** [D:T014] Apply [[feedback_bundle_gate_smoke_run]] gate: smoke-run any validation_commands the bundle proposes.
- [ ] **T016** [D:T015] Aggregate verified bundles into `007-…/scratch/rename-plan.json`.

### Phase C — Skill body rename (~5 min)

- [ ] **T020** [D:T016] `git mv .opencode/skills/sk-small-model .opencode/skills/sk-prompt-small-model`.
- [ ] **T021** [D:T020] Edit `sk-prompt-small-model/SKILL.md`: frontmatter `name`, H1, in-body refs.
- [ ] **T022** [D:T020] [P] Edit `sk-prompt-small-model/README.md`: title + body refs.
- [ ] **T023** [D:T020] [P] Edit `sk-prompt-small-model/description.json`: skill_id + name + path fields.
- [ ] **T024** [D:T020] [P] Edit `sk-prompt-small-model/graph-metadata.json`: `skill_id`, derived.entities[].name, derived.entities[].path, derived.key_files.
- [ ] **T025** [D:T020] [P] Edit `sk-prompt-small-model/references/pattern-index.md`: header + self-refs only.
- [ ] **T026** [D:T020] [P] Create `sk-prompt-small-model/changelog/v0.3.0.0.md` with rename notice.

### Phase D — Sibling propagation (~5 min, parallel-safe)

- [ ] **T030** [P] [D:T020] Edit `cli-devin/graph-metadata.json` edges.enhances + manual.related_to.
- [ ] **T031** [P] [D:T020] Edit `cli-opencode/graph-metadata.json` same.
- [ ] **T032** [P] [D:T020] `git mv` + edit `cli-devin/manual_testing_playbook/03--model-presets/005-…-sk-small-model-…` → new filename + body refs.
- [ ] **T033** [P] [D:T020] `git mv` + edit `cli-devin/manual_testing_playbook/03--model-presets/006-…-sk-small-model-…` → new filename + body refs.
- [ ] **T034** [D:T032,T033] Edit `cli-devin/manual_testing_playbook/manual_testing_playbook.md` index.
- [ ] **T035** [P] [D:T020] `git mv` + edit `cli-opencode/manual_testing_playbook/07--prompt-templates/004-…-sk-small-model.md` → new filename + body refs.
- [ ] **T036** [P] [D:T020] `git mv` + edit `cli-opencode/manual_testing_playbook/07--prompt-templates/005-…-sk-small-model.md` → new filename + body refs.
- [ ] **T037** [D:T035,T036] Edit `cli-opencode/manual_testing_playbook/manual_testing_playbook.md` index.
- [ ] **T038** [P] [D:T020] Edit `cli-opencode/references/permissions-matrix.md` inline refs.
- [ ] **T039** [P] [D:T020] Edit `cli-opencode/assets/permissions-matrix.example-packet-local.json` inline refs.

### Phase E — Root docs + auto-memory (~5 min, parallel-safe)

- [ ] **T040** [P] [D:T020] Edit `AGENTS.md` line 40 Small-model dispatch rule.
- [ ] **T041** [P] [D:T020] Edit `CLAUDE.md` line 40 (mirrors AGENTS.md).
- [ ] **T042** [P] [D:T020] Edit `README.md` line 912 skill catalog entry.
- [ ] **T043** [P] [D:T020] Edit `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/MEMORY.md` dispatch-matrix entry description.
- [ ] **T044** [P] [D:T020] Edit `~/.claude/projects/…/memory/reference_small_model_dispatch_matrix.md` body refs (NOT filename slug).
- [ ] **T045** [P] [D:T020] Edit `~/.claude/projects/…/memory/feedback_skill_graph_compiler_rebuild.md`: tag refs with "(renamed sk-prompt-small-model 2026-05-21)".
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase F — advisor reindex (~3 min, sequential)

- [ ] **T050** [D:T021..T045] Run `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py --export-json --pretty` → `007-…/scratch/compiler.log`.
- [ ] **T051** [D:T050] `jq '.generated_at, (.skills | has("sk-prompt-small-model")), (.skills | has("sk-small-model"))' …/skill-graph.json` — expect fresh, true, false.
- [ ] **T052** [D:T051] Run `advisor_rebuild` MCP call.
- [ ] **T053** [D:T052] Run `advisor_validate` MCP call → `007-…/scratch/advisor-validate.json`; expect no orphans.
- [ ] **T054** [D:T053] Run `advisor_recommend({input: "dispatch swe-1.6 via cli-devin"})` → `007-…/scratch/advisor-recommend.json`; expect sk-prompt-small-model top-3 ≥ 0.7.

### Phase G — Validate + parent reconcile (~3 min)

- [ ] **T060** [D:T054] Post-rename rg on live-surface allow-list → expect zero `sk-small-model` hits.
- [ ] **T061** [D:T060] Post-rename rg on historical-surface allow-list → expect SAME count as baseline-before.
- [ ] **T062** [D:T060,T061] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <007> --strict` → exit 0.
- [ ] **T063** [D:T062] Edit `114/spec.md` PHASE DOCUMENTATION MAP: append Phase 7 row only.
- [ ] **T064** [D:T062] Step 13 work — Refresh `114/graph-metadata.json` via `generate-context.js` (children_ids += 007; derived.last_active_child_id).
- [ ] **T065** [D:T064] `memory_index_scan({ specFolder: "skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-prompt-small-model-rename" })`.

### Step 11.5 + 12 — Postflight + summary + nested changelog

- [ ] **T070** [D:T065] Mark every checklist.md CHK item `[x]` with `[EVIDENCE: file:lines]` or `[EVIDENCE: commit-sha]`.
- [ ] **T071** [D:T070] Author `implementation-summary.md`: files modified/renamed/created, verification steps, deviations, learning delta.
- [ ] **T072** [D:T071] `node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js <007> --write`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 + P1 checklist items marked `[x]` with evidence
- [ ] `validate.sh --strict` exits 0
- [ ] `advisor_recommend` smoke returns renamed skill on canonical small-model prompts
- [ ] Parent `114/graph-metadata.json` reflects 007 + `last_active_child_id`
- [ ] Nested packet-local changelog generated
- [ ] `generate-context.js` canonical save successful (Step 13)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent: `../spec.md`, `../graph-metadata.json`
- Predecessor: `../006-cross-skill-propagation/implementation-summary.md`
- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Memory rules: [[feedback_skill_graph_compiler_rebuild]], [[feedback_cli_devin_bundle_verification]], [[feedback_bundle_gate_smoke_run]], [[feedback_cli_dispatch_unreliability]], [[feedback_stay_on_main_no_feature_branches]], [[feedback_delete_not_archive_or_comment]], [[feedback_worktree_cleanliness_not_a_blocker]]
<!-- /ANCHOR:cross-refs -->
