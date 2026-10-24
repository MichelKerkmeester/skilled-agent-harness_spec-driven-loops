---
title: "Feature Specification: Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm"
description: "Nine phases that repair the spec-kit templates, gate unfilled placeholders on new docs, add per-section fill guidance and an authoring card, then measure whether a DeepSeek V4.1 Flash worker authors better packets."
trigger_phrases:
  - "weak model spec authoring phase parent spec"
  - "deepseek flash spec authoring"
  - "followable spec templates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring"
    last_updated_at: "2026-10-23T12:00:00Z"
    last_updated_by: "planning-session"
    recent_action: "Authored the phase parent spec"
    next_safe_action: "Meet the launch preconditions, then run phase 001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/054-weak-model-spec-authoring |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All nine phases are Complete, `validate.sh --recursive --strict` on this packet prints `RESULT: PASSED`, and phase 009 reports a measured before and after for the five authoring metrics |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A DeepSeek V4.1 Flash worker that authors a spec packet from the system-spec-kit templates leaves scaffold hints in place and still passes `validate.sh --strict`. A fresh Level 2 scaffold holds 97 bracketed hint occurrences and validates clean. The hand-written examples the worker imitates carry leaked description text and stale lines. The authoring guidance is a 1,200-line template guide that a weak model cannot follow in one pass. Together these let a swarm produce packets that look finished and are not.

### Purpose
Make the templates, the examples, the validator and the authoring docs good enough that a DeepSeek V4.1 Flash swarm authors a valid, filled packet without a frontier model correcting it. Phase 001 measures the starting point and the last phase measures the result, so the claim rests on numbers.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repair the known template, example and reference defects, found by a census and fixed by exact text swap.
- Gate unfilled placeholders on new docs only, through a template version marker.
- Add a one-line fill instruction with a good and a weak example to each core template section.
- Add a short authoring card and route the skill router to it.
- Check and update the speckit and doctor commands and the doc-authoring agents such as markdown.
- Align the playbook, catalog and READMEs of system-spec-kit, then run the playbooks in a disposable worktree.
- Measure the authoring baseline before any change and again at the end.
- One write-recipe fix, tracked as a child of the earlier write-recipe series.

### Out of Scope
- Any change to `sk-prompt`. All logic lives in system-spec-kit.
- Any change that alters the verdict for an existing packet, because external-repo users would break on `/doctor:update`.
- Measuring models other than DeepSeek V4.1 Flash max for the benchmark.
- Committing or pushing. Both stay with the operator.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-spec-kit/templates/examples/**` | Modify | 002, 004 | Example descriptions, stale lines, skeleton alignment |
| `.skilled/skills/system-spec-kit/references/**` | Modify | 002, 005, 006 | Style guide, checklist, template guide, new card |
| `.skilled/skills/system-spec-kit/templates/core/*.tmpl` | Modify | 003, 004, 005 | Token form, v2.3 marker, fill guidance, task `Verify:` slot |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh` and its TypeScript mirror | Modify | 003 | Versioned placeholder gate |
| `.skilled/skills/system-spec-kit/SKILL.md`, `leaf-manifest.json`, `leaf-aliases.json` | Modify | 005 | Router loads the card |
| `.skilled/commands/speckit/`, `.skilled/commands/doctor/` speckit entries, `.skilled/agents/markdown.md` and other doc-authoring agents | Modify | 006 | Commands and agents match the new templates, gate and card |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/` guard scripts | Create | 004, 005 | Example drift guard and card sync guard |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/`, `feature-catalog/`, READMEs | Modify | 007 | Scenarios and docs for the new behavior |
| `.skilled/skills/system-spec-kit/benchmark/reports/` | Create | 008, 009 | Playbook run report and benchmark report |
| `specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/` | Create | 041-006 | Write-recipe move destination fix |

### Launch preconditions

The operator meets all four before the first phase runs. The conductor records each as met in `goal.md` section 4 and stops when one is not.

1. **Workspace.** The operator chooses A) a git worktree or B) the current branch, following `sk-git`. The conductor never chooses. The chosen path becomes `WORKTREE` in `goal.md` section 4.
2. **Provider login.** `codex login status` reports a ChatGPT login and `devin auth status` reports a Devin login. A rate limit or refusal on both stops the run.
3. **Lane authorization.** At most 3 parallel DeepSeek lanes and never two on one file. The operator has already given this.
4. **Conductor placement.** The conductor is a Claude Code session. Writers run on cli-codex `gpt-6-luna` max fast, with cli-devin `swe-2-max` as fallback, and every review runs on cli-devin `swe-2-max`. A child task that names the Task tool runs as this CLI dispatch with the same brief and reply file.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-template-drift-census-and-baseline/ | Census every template, example and reference defect into a verified ledger and measure the authoring baseline | Pending |
| 2 | 002-template-and-example-defect-repair/ | Apply the ledger rows owned by this phase with a tested exact-match applier | Pending |
| 3 | 003-versioned-placeholder-gate/ | Make unfilled `[YOUR_VALUE_HERE: ...]` tokens a Draft warning and a later error, for v2.3 docs only | Pending |
| 4 | 004-template-section-fill-guidance/ | Add a fill instruction and a good and weak example to each core section, and guard example drift | Pending |
| 5 | 005-weak-model-authoring-card/ | Write the authoring card, route the skill to it and guard the sync | Pending |
| 6 | 006-speckit-command-and-agent-alignment/ | Check and update the speckit and doctor commands and the doc-authoring agents such as markdown for the new templates, gate and card | Pending |
| 7 | 007-playbook-catalog-readme-alignment/ | Update the playbook, catalog and READMEs for the new behavior | Pending |
| 8 | 008-playbook-run-in-worktree/ | Run every new or changed playbook scenario in a disposable worktree and report PASS or FAIL | Pending |
| 9 | 009-authoring-benchmark-and-closeout/ | Rerun the baseline, report the delta per metric and close the packet | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-template-drift-census-and-baseline | 002-template-and-example-defect-repair | `ledger.jsonl` exists, every row reproduces and the baseline holds three runs | `jq -c . ledger.jsonl` exits 0 and `baseline.json` holds 3 runs |
| 002-template-and-example-defect-repair | 003-versioned-placeholder-gate | Every owner-002 row no longer reproduces and the suite result matches the phase 001 start | Row evidence commands print nothing and the suite summary lines match `suite-start.txt` |
| 003-versioned-placeholder-gate | 004-template-section-fill-guidance | Core hints are tokens, the marker is v2.3 and recursive strict counts are unchanged | The failing-first test passes and the before and after counts match |
| 004-template-section-fill-guidance | 005-weak-model-authoring-card | Every core section has guidance, goldens pass and the drift guard passes | The golden test and the drift guard script exit 0 |
| 005-weak-model-authoring-card | 006-speckit-command-and-agent-alignment | The card exists, the router loads it and the sync guard passes | The sync guard script exits 0 and the workflow invariance test passes |
| 006-speckit-command-and-agent-alignment | 007-playbook-catalog-readme-alignment | Every speckit and doctor command and every doc-authoring agent names the card, the v2.3 token and the guard scripts where it describes authoring | The phase 006 audit table has no open row |
| 007-playbook-catalog-readme-alignment | 008-playbook-run-in-worktree | Every new scenario file exists and the playbook index lists it | The playbook index lists each scenario id |
| 008-playbook-run-in-worktree | 009-authoring-benchmark-and-closeout | Every scenario has a recorded PASS or an escalated FAIL | The report folder holds a row for each scenario |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Resolved 2026-10-24: LLM Gateway ran out of usage after phase 001, and the operator moved every remaining run to cli-codex `gpt-6-luna` and cli-devin `swe-2-max`. The benchmark subject is now `swe-2-max`, rebaselined at the start commit. Cli-opencode rule 15 no longer applies, because no OpenCode executor runs.
- Whether phase 003 also fixes the post-edit scanner `spec/check-placeholders.sh`, which flags regex classes inside fenced code blocks, is decided in the phase 003 decision record.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
