---
title: "Feature Specification: Phase 1: research-and-context"
description: "Research-gate phase for the cli-external parent-hub program. This phase scopes read-only verification of the current cli-opencode and cli-claude-code state plus a fresh referrer inventory, classified by breakage class, before architecture decisions begin."
trigger_phrases:
  - "cli-external parent research"
  - "research gate"
  - "cli dispatch referrer inventory"
  - "cli-opencode cli-claude-code fold-in"
  - "phase 001 research-and-context"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-cli-external-parent/001-research-and-context"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the read-only research-gate spec, plan, and tasks"
    next_safe_action: "Execute the skill-state and referrer sweep passes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-and-context"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does either mode need a lexical routing carve-out to preserve advisor accuracy? (empirical, owned by phase 007)"
    answered_questions:
      - "Referrers split into four classes: functional (break silently on move), constitutional (path templates), internal-outbound-path (relative cross-skill paths undetectable by an old-path grep), logical-name (survive — use the stable executor-kind string, not a path)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: research-and-context

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | 002-architecture-decision |
| **Handoff Criteria** | A verified skill-state snapshot, a fresh referrer inventory classified by breakage class, and a 124 fold-in prior-art summary are ready for human review before phase 002 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Merge cli-opencode and cli-claude-code into one parent hub cli-external with two workflow modes: cli-opencode and cli-claude-code specification.

**Scope Boundary**: Read-only research and inventory planning for phase 001. This phase may document findings inside this phase folder during execution, but it must not move, edit, or scaffold `.opencode/skills/cli-opencode/`, `.opencode/skills/cli-claude-code/`, advisor code, hooks, CI, or any file outside this phase folder.

**Dependencies**:
- None. This is the first phase and has no predecessor beyond the approved parent packet context.

**Deliverables**:
- Verified skill-state snapshot for both source skills: `SKILL.md`, `README.md`, `graph-metadata.json`, version numbers, tool postures, hard-rules, and script trees (cli-opencode carries `scripts/`; cli-claude-code does not).
- Fresh referrer inventory from a new grep sweep plus a relative-path scan, with every live referrer classified into one of four breakage classes so later phases repoint the right things, catch the grep-undetectable relative paths in the move itself, and leave the stable ones alone.
- Prior-art summary of the sibling `124-sk-prompt-parent/` fold-in, focused on task shape, referrer handling, and the identity-dissolution + validation lessons that transfer to this program.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.

### Referrer Breakage Taxonomy (the core research deliverable)

The single most important research output is a taxonomy that keeps phase 006 from over-repointing AND keeps phases 004/005 from under-catching. Referrers fall into four classes:

**FUNCTIONAL** — break silently on move (the must-catch class): the `.claude/settings.json` PreToolUse(Bash) hook path that runs `dispatch-preflight-lint.mjs` on every Bash call and fails open if the path 404s; that hook's internal `DISPATCH_SKILLS` registry and its `path.join(projectDir, '.opencode/skills', skill, 'SKILL.md')` flat-layout assumption; the advisor `executor-delegation.ts` scorer (+ compiled dist); the Python `skill_advisor.py` hardcoded lexical alias-to-id maps including a literal `.opencode/skills/cli-claude-code` path key; the `executor-delegation-cases.json` parity fixtures (11 cases: 6 `expectedTop: cli-opencode`, 2 `cli-claude-code`, 2 `sk-code`, 1 `none` — note the 2 sk-code + 1 none are NEGATIVE-for-cli assertions); the `check-prompt-quality-card-sync.sh` card-sync script and its `.github/workflows/prompt-card-sync.yml` CI wiring; `system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts`, which hardcodes both skills' flat `SKILL.md` and `assets/prompt_templates.md` paths and goes red on the move; and the reciprocal advisor graph edges into these skills.

**CONSTITUTIONAL** — path templates in policy docs: `CLAUDE.md` and `AGENTS.md` ("Before composing any `cli-X` prompt, MUST Read `.opencode/skills/cli-X/SKILL.md` first") and `system-spec-kit/constitutional/cli-dispatch-skill-preload.md`; each needs the nested `.opencode/skills/cli-external/cli-X/SKILL.md` path form.

**INTERNAL OUTBOUND PATH** — break on move but are UNDETECTABLE by an old-flat-path grep (the sneaky class): every reference that points OUT of a moved tree, both absolute self-references (`.opencode/skills/cli-opencode/...` → `cli-external/cli-opencode/...`) AND relative cross-skill paths (`../sk-prompt/...`, `../../sk-prompt/...`, `../system-spec-kit/...`) inside the trees. Nesting each tree one directory deeper adds a `../` to every relative cross-skill path — ~54 such references live inside cli-opencode (SKILL.md rule-7 canonical-card path, `assets/prompt_quality_card.md`, `references/context-budget.md`, `assets/prompt_templates.md`, playbook anchors) and ~13 inside cli-claude-code. A depth-broken `../../sk-prompt/...` never contains the old flat path string, so phase 006's stale-path grep STRUCTURALLY cannot detect it; this class must be rewritten in the SAME move that nests each tree (phases 004/005) and verified with a link-resolve check, not deferred to the 006 grep sweep.

**LOGICAL-NAME** — SURVIVE the move, do NOT repoint: everything that dispatches by the stable executor-kind string rather than a filesystem path — the `executor-config.ts` EXECUTOR_KINDS enum, the deep-loop `if_cli_opencode`/`if_cli_claude_code` config branches (they call the `opencode`/`claude` binary by config kind, not advisor path), matrix adapters like `adapter-cli-opencode.ts`, and `model_profiles.json` `"executor"` values. The self-invocation guards are also in this class: they are runtime-signal-based (env var / process ancestry / lockfile), not path-based, so they survive the move unchanged. Documenting this class explicitly is what prevents phase 006 from breaking dispatch by "fixing" a name that was never a path.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 002 architecture decisions depend on current, re-verified facts about two live skills and their referrers. The parent packet records planning-time research, but concurrent repository activity can make those notes stale, especially around the fail-open PreToolUse hook, the runtime scorer path, and the parity fixtures. Worse, a naive sweep that treats every string mentioning `cli-opencode`/`cli-claude-code` as a path to repoint would break dispatch, because many references are stable executor-kind strings, not filesystem paths.

### Purpose
Produce a trustworthy, read-only factual foundation — including a breakage-class taxonomy — for the cli-external parent-hub decision phase before any skill-file moves, scorer rewrite, or hub scaffolding begin.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-verify the current state of `.opencode/skills/cli-opencode/` and `.opencode/skills/cli-claude-code/` against the shared program context: versions, `allowed-tools`, hard-rules, README posture, graph metadata, and file counts.
- Re-run the referrer sweep for `cli-opencode` and `cli-claude-code` outside the skills themselves, PLUS a scan of relative cross-skill paths inside the two trees, and classify every live hit as functional, constitutional, internal-outbound-path, or logical-name.
- Confirm the functional referrers at file:line: the PreToolUse hook path, the hook's internal skill registry, `executor-delegation.ts`, `skill_advisor.py`, the parity fixtures, the CI card-sync gate, and the reciprocal advisor edges.
- Review `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/` as prior art for fold-in task shape, identity-dissolution handling, and validation lessons.

### Out of Scope
- File moves, hub scaffolding, router metadata creation, scorer rewrite, and path repoints — these start in later phases after the research gate is reviewed.
- Edits to `.opencode/skills/cli-opencode/`, `.opencode/skills/cli-claude-code/`, advisor code, `.claude/settings.json`, CI, or documentation outside this phase folder — phase 001 is a read-only research gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-research-and-context/spec.md` | Modify | Define the phase 001 read-only research scope, referrer taxonomy, and acceptance criteria |
| `001-research-and-context/plan.md` | Modify | Plan the skill-state pass, the classified referrer sweep, and the prior-art review |
| `001-research-and-context/tasks.md` | Modify | Track the scoped research-gate tasks pending human review |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Re-verified skill-state snapshot | Snapshot covers both skills' `SKILL.md`, `README.md`, `graph-metadata.json`, version numbers, tool postures, hard-rules, and script-tree presence, explicitly marking any drift from the shared context |
| REQ-002 | Complete referrer inventory classified by breakage class | Inventory is produced from a new grep sweep plus a relative-path scan and tags every live referrer as functional, constitutional, internal-outbound-path, or logical-name, with file:line evidence for each functional referrer (the fail-open hook, the scorer, the Python alias maps, the 11-case parity fixtures, the card-sync script + `.github/workflows/prompt-card-sync.yml`, the handback vitest, the reciprocal edges) and a count of the internal outbound relative paths per tree |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Prior-art summary from the 124 fold-in program | Summary identifies the reusable fold-in task shape, the identity-dissolution handling, and the validation lessons grounded in the 124 spec folder |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Research artifacts are complete, internally consistent, and grounded in fresh reads/grep output rather than planning-time assumptions.
- **SC-002**: Every live referrer is classified so phase 006 repoints functional and constitutional referrers, phases 004/005 rewrite the internal-outbound-path class in the move itself (it is grep-undetectable afterward), and the logical-name executor-kind strings are left untouched.
- **SC-003**: Zero files outside `001-research-and-context/` are touched during this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None | This is the first phase and has no predecessor phase dependency | Proceed after human review of the scoped research plan |
| Risk | Concurrent-session repository activity causes drift from planning-time research | Medium | Re-read live files and re-run the referrer grep sweep instead of trusting prior notes |
| Risk | A functional referrer is missed because it fails silently after a move | High | Require file:line evidence for every functional referrer, especially the fail-open PreToolUse hook and the runtime scorer, before phase 002 |
| Risk | A logical-name executor-kind string is mistaken for a path and slated for repoint | High | Tag the logical-name class explicitly in the inventory so later phases leave stable strings alone |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does either hub mode need a lexical routing carve-out to preserve today's advisor routing accuracy for delegation queries, or does `routingClass: "metadata"` hold? Empirical question, owned by phase 007's benchmark, not pre-decided here.
- Does the shared dispatch hook script lift to hub root or stay packet-local? Recorded as an open question for phase 002's ADR-002 sub-decision.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
