---
title: "Feature Specification: Deep research of the Skilled v4 release line v4.0.0.0 to v4.0.2.0: drift, bugs, alignment, over-engineering and extension opportunities"
description: "Fifty-plus iterations of DeepSeek-driven deep research over the v4.0.0.0 to v4.0.2.0 release line, split into five scope clusters, ending in one ranked synthesis."
trigger_phrases:
  - "v4 release line research phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research"
    last_updated_at: "2026-11-08T00:00:00Z"
    last_updated_by: "claude-opus-lead"
    recent_action: "Scaffolded five research children; orchestrators briefed"
    next_safe_action: "Run each child research loop to its iteration ceiling, then synthesize"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
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

# Feature Specification: Deep research of the Skilled v4 release line v4.0.0.0 to v4.0.2.0: drift, bugs, alignment, over-engineering and extension opportunities

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/047-v4-release-line-research |
| **Predecessor** | None |
| **Successor** | Remediation packets proposed by the synthesis |
| **Handoff Criteria** | Every child clears the depth bar and `research/research.md` holds verified, ranked findings |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nineteen releases shipped between v4.0.0.0 (2026-09-21) and v4.0.2.0 (2026-11-08): 3,687 commits across spec kit, the authoring hubs, the CLI executors, the deep loops, the skill advisor, hooks, doctor commands and git tooling. Release notes, code and docs moved at that pace without one pass that checks them against each other, so drift, latent bugs, standard misalignment and over-built surfaces are likely and unmeasured.

### Purpose
Run forced-depth deep research (no early convergence) per scope cluster, each finding backed by `file:line` evidence and the release that introduced it, then synthesize one ranked report with an over-engineering cut list, extension ideas and proposed remediation phases. This packet only researches; it changes nothing outside itself.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every surface a v4 release touched, read against its release note in `.skilled/changelog/skilled/v4.0.*.md` and the tag diffs
- Seven finding types: drift, standard misalignment (sk-code, sk-doc, Skilled canon), bugs, improvement, UX, over-engineering, logic extension
- One synthesis at `research/research.md` in this parent

### Out of Scope
- Any fix, edit or commit outside this packet
- Releases before v4.0.0.0 and commits after the v4.0.2.0 tag, except as context

### Files to Change
Every write stays inside this packet.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/system-speckit/runtime-and-release/004-v4-release-line-research/**` | Create | all | Research state, iterations and synthesis; nothing else is written |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-spec-kit-core/ | system-spec-kit: gates, validate, trigger index, continuity, goal, upgrade | Complete |
| 2 | 002-authoring-hubs/ | sk-doc, sk-code, sk-design, sk-prompt | Complete |
| 3 | 003-cli-and-deep-loop/ | cli-external-orchestration, cli-classifier, DeepSeek harness, system-deep-loop runtime | Complete |
| 4 | 004-advisor-hooks-relaunch/ | system-skill-advisor, compiled routing, hooks and plugins, session relaunch, compaction history | Complete |
| 5 | 005-doctor-git-ci-runtime/ | doctor commands, Skilled-in-your-project, overlays, sk-git, CI, agents, commands, runtime mirrors, repo-rules | Complete |
| 6 | 006-deep-loop-single-executor-dispatch/ | Remediation: deep loop single executor dispatch (scope in `research/research.md`) | Complete |
| 7 | 007-deep-loop-state-and-stop-policy/ | Remediation: deep loop state and stop policy (scope in `research/research.md`) | Complete |
| 8 | 008-write-containment-scoping/ | Remediation: write containment scoping (scope in `research/research.md`) | Complete |
| 9 | 009-gate3-and-continuity-root/ | Remediation: gate3 and continuity root (scope in `research/research.md`) | Complete |
| 10 | 010-validate-and-retrieval-exit-honesty/ | Remediation: validate and retrieval exit honesty (scope in `research/research.md`) | Complete |
| 11 | 011-spec-kit-doc-drift/ | Remediation: spec kit doc drift (scope in `research/research.md`) | Complete |
| 12 | 012-hook-guards-and-audit-log/ | Remediation: hook guards and audit log (scope in `research/research.md`) | Complete |
| 13 | 013-agents-md-delivery-budget/ | Remediation: agents md delivery budget (scope in `research/research.md`) | Complete |
| 14 | 014-doctor-and-ci-gate-honesty/ | Remediation: doctor and ci gate honesty (scope in `research/research.md`) | Complete |
| 15 | 015-cli-hub-routing-and-classifier/ | Remediation: cli hub routing and classifier (scope in `research/research.md`) | Complete |
| 16 | 016-authoring-hub-manifests-and-drift/ | Remediation: authoring hub manifests and drift (scope in `research/research.md`) | Complete |
| 17 | 017-over-engineering-cuts/ | Remediation: over engineering cuts (scope in `research/research.md`) | Complete |
| 18 | 018-host-trigger-index-and-repin-generated/ | Barter upstream: host trigger index default and generated retrieval files in a re-pin | Complete |
| 19 | 019-template-marker-upgrade-and-staleness-scope/ | Barter upstream: old-marker upgrade path and staleness checker discovery scope | Complete |
| 20 | 020-operator-approved-closeout/ | Operator-approved closeout: AGENTS.md headroom and manifest write, sk-design routing regeneration, trigger index rebuild | Complete |
| 21 | 021-host-root-marker-refresh/ | Barter follow-up: marker refresh uses the host repository, Barter marker census, two READMEs | Complete |
| 22 | 022-linked-project-host-index/ | Barter follow-up: Gate 1 from a linked project checkout reads the owning host index | Complete |
| 23 | 023-configurable-host-index-folder/ | Barter follow-up: a host names its trigger index folder in `.skilled-host.json` | Complete |
| 24 | 024-root-release-docs-alignment/ | Root docs: `PUBLIC-RELEASE.md`, `CONTRIBUTING.md` and `SECURITY.md` match the current repository | Complete |

### Phase Transition Rules

- Research phases 001-005 ran in parallel and each passed `validate.sh` before synthesis; remediation phases 006-017 ran in two orchestrator lanes in one worktree, each closing with its own commit
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-spec-kit-core | 002-authoring-hubs | None: phases run in parallel | Each child validates on its own |
| 002-authoring-hubs | 003-cli-and-deep-loop | None: phases run in parallel | Each child validates on its own |
| 003-cli-and-deep-loop | 004-advisor-hooks-relaunch | None: phases run in parallel | Each child validates on its own |
| 004-advisor-hooks-relaunch | 005-doctor-git-ci-runtime | None: phases run in parallel | Each child validates on its own |
| 005-doctor-git-ci-runtime | 006-deep-loop-single-executor-dispatch | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 006-deep-loop-single-executor-dispatch | 007-deep-loop-state-and-stop-policy | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 007-deep-loop-state-and-stop-policy | 008-write-containment-scoping | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 008-write-containment-scoping | 009-gate3-and-continuity-root | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 009-gate3-and-continuity-root | 010-validate-and-retrieval-exit-honesty | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 010-validate-and-retrieval-exit-honesty | 011-spec-kit-doc-drift | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 011-spec-kit-doc-drift | 012-hook-guards-and-audit-log | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 012-hook-guards-and-audit-log | 013-agents-md-delivery-budget | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 013-agents-md-delivery-budget | 014-doctor-and-ci-gate-honesty | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 014-doctor-and-ci-gate-honesty | 015-cli-hub-routing-and-classifier | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 015-cli-hub-routing-and-classifier | 016-authoring-hub-manifests-and-drift | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 016-authoring-hub-manifests-and-drift | 017-over-engineering-cuts | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 017-over-engineering-cuts | 018-host-trigger-index-and-repin-generated | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 018-host-trigger-index-and-repin-generated | 019-template-marker-upgrade-and-staleness-scope | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 019-template-marker-upgrade-and-staleness-scope | 020-operator-approved-closeout | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 020-operator-approved-closeout | 021-host-root-marker-refresh | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 021-host-root-marker-refresh | 022-linked-project-host-index | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 022-linked-project-host-index | 023-configurable-host-index-folder | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
| 023-configurable-host-index-folder | 024-root-release-docs-alignment | Prior phase closed Complete or Blocked with its own commit | `validate.sh --strict` on the phase prints `RESULT: PASSED` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Run decision: `/deep:research` fan-out lineages share one topic, so per-cluster focus uses five child phases, each its own single-executor `/deep:research:auto` run (goal fallback clause).
- Run decision: decisions are recorded in each child's `decision-record.md`; the phase-parent template forbids one at parent level.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
