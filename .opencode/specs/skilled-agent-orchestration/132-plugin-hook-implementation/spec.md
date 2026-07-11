---
title: "Feature Specification: Plugin and hook pairs built from existing skills"
description: "Phase parent tracking implementation of six plugin/hook pairs that promote existing repo skills to always-on OpenCode plugin surfaces and Claude hooks."
trigger_phrases:
  - "132-plugin-hook-implementation"
  - "plugin hook implementation"
  - "plugins from skills implementation"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation"
    last_updated_at: "2026-07-11T13:12:24Z"
    last_updated_by: "spec-author"
    recent_action: "Authored phase-parent root purpose, phase-documentation map, and handoff criteria"
    next_safe_action: "Begin phase 001 (CLI Dispatch Audit Trail), the foundation after-hook pattern"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Plugin and hook pairs built from existing skills

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `skilled-agent-orchestration/132-plugin-hook-implementation` |
| **Predecessor** | None (the research foundation is now phase 000) |
| **Successor** | None |
| **Handoff Criteria** | Each child ships its shared core + both runtime adapters + first test green + `validate.sh --strict` clean before the next phase begins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo already ships seven OpenCode plugins with paired Claude hooks, but a large body of proven policy and validation logic stays locked inside skills that run only in CI or on manual invocation, and two OpenCode plugin surfaces (`tool.execute.after`, `tool.register`) are entirely unused. The two-model research foundation (child 000) confirmed that promoting these checkers to write-time and lifecycle-boundary hooks gives feedback when a violation is cheapest to fix.

### Purpose
Implement six recommended plugin/hook pairs (the Git Safety Guard recommendation is explicitly excluded), each as a runtime-neutral policy/logic core with two thin adapters — an OpenCode plugin and a Claude hook — advisory-first, blocking only deterministic high-confidence violations behind opt-in env flags.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Six plugin/hook pairs, one per child phase, each with a shared core + OpenCode adapter + Claude adapter + tests.
- Activation of the two unused OpenCode surfaces (`tool.execute.after` in phase 001, `tool.register` in phase 007).
- Advisory-first posture with fail-open error handling and env kill-switches; the one enforcement-capable pair (Spec Mutation Gate) ships deny behind an opt-in flag, default off.

### Out of Scope
- The Git Safety Guard recommendation — explicitly excluded from this program by operator directive.
- The design anti-slop advisor from the research long tail — dropped in research (blind post-write design scoring rejected).
- Any change to the seven existing plugins beyond additive co-resident hook entries.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/plugins/mk-*.js` | Create | Each phase | One default-export-only OpenCode adapter plugin per pair |
| Shared core (`*.cjs` / `*.mjs`) under the owning skill | Create | Each phase | One runtime-neutral policy/logic core per pair |
| Claude hook (`*.cjs` / `*.mjs`) or existing-owner extension | Create/Modify | Each phase | Claude adapter; some phases extend an existing `PostToolUse`/`Stop` owner |
| `.claude/settings.json` | Modify | Integration | New/extended hook entries, wired last to avoid parallel-edit conflicts |
| `.opencode/plugins/README.md` | Modify | Each phase | One plugin-registry row per new plugin |
| Test files (`*.test.cjs` / `*.vitest.ts`) | Create | Each phase | Hermetic first test pinning the core's trichotomy + fail-open |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 0 | 000-plugin-hook-opportunities/ | Research foundation: two-model (GLM-5.2 + GPT-5.6-sol) deep-research inventory that produced the ranked, cross-checked plugin/hook backlog these phases implement. | Complete |
| 1 | 001-cli-dispatch-audit-trail/ | Foundation: OpenCode `tool.execute.after` + Claude `PostToolUse(Bash)` append-only JSONL audit of `opencode run`/`claude -p` dispatches, over a shared dispatch-audit core. First use of the after-hook surface. | Planned |
| 2 | 002-code-graph-freshness-guard/ | `tool.execute.after` + `PostToolUse(Write\|Edit)` warm-only debounced incremental `code_graph_scan`; self-heals the stale/empty code graph, never cold-starts. | Planned |
| 3 | 003-post-edit-quality-router/ | Warn-only post-edit router mapping edited paths to existing checkers; extends Claude `PostToolUse(Write\|Edit)` + new OpenCode before/after plugin, shared scope-resolver core. | Planned |
| 4 | 004-completion-evidence-sentinel/ | Completion-claim evidence backstop; extends Claude `Stop` owner + new OpenCode `session.idle` plugin. Verifies recorded evidence without running tests. | Planned |
| 5 | 005-mcp-route-guard/ | Warn-only nudge to route external MCP calls through Code Mode; OpenCode `tool.execute.before` + Claude `PreToolUse(mcp__claude_ai_.*)`, manifest-derived warn-set. | Planned |
| 6 | 006-spec-mutation-gate/ | Gate-3 spec-folder-before-mutation guard; classify (chat.transform / UserPromptSubmit) + enforce (tool.execute.before / PreToolUse Write\|Edit), deny opt-in behind `MK_SPEC_GATE_ENFORCE`. | Planned |
| 7 | 007-speckit-completion-exposer/ | Read-only spec completion-state tool via the unused OpenCode `tool.register` surface, over a shared completion-state core. | Planned |
| 8 | 008-plugin-state-cleanup/ | State-hygiene remediation: adds auto-cleanup to the two plugin state dirs that lacked it (completion-sentinel dedup sweep/prune, smart-router-telemetry size-cap rotation), matching the bounded pattern the other guards already use. | Planned |

| 9 | 009-plugin-manual-testing-playbooks/ | [Phase 9 scope] | Pending |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 000-plugin-hook-opportunities | 001-cli-dispatch-audit-trail | Ranked, cross-checked plugin/hook backlog delivered with per-candidate rationale and source skill | research synthesis present; the seven implementation phases enumerated from it |
| 001-cli-dispatch-audit-trail | 002-code-graph-freshness-guard | The `tool.execute.after` adapter pattern and the bounded append-only rotated-log helper from 001 are landed and reusable | 001 first test green; plugin loads without TUI error; `validate.sh --strict` clean |
| 002-code-graph-freshness-guard | 003-post-edit-quality-router | The `tool.execute.before`→`after` callID-correlation pattern is available; warm-only never-cold-start invariant proven | 002 debounce/warm-gate/empty-gate tests green; strict validate clean |
| 003-post-edit-quality-router | 004-completion-evidence-sentinel | Post-edit router shipped warn-only; existing `PostToolUse` owner extended without regressing its current checks | 003 scope-resolver + correlation tests green; existing hook still passes |
| 004-completion-evidence-sentinel | 005-mcp-route-guard | Claude `Stop` owner extended advisory-only (no `decision:block`); shared evidence core reused, tests never execute a build | 004 core unit tests green (advise + no-op gate) |
| 005-mcp-route-guard | 006-spec-mutation-gate | Warn-only MCP guard shipped; manifest-strict-vs-broad fork resolved by operator | 005 table-driven normalization tests green |
| 006-spec-mutation-gate | 007-speckit-completion-exposer | Spec Mutation Gate shipped classify+advise with enforce default-off; false-positive corpus recorded before any enforce flip | 006 golden-loop vitest green; fail-open assertions pass |
| 007-speckit-completion-exposer | 008-plugin-state-cleanup | The plugin/hook pairs are shipped; their per-session state dirs are the cleanup target | 008 sentinel-sweep + telemetry-rotation tests green |
| 008-plugin-state-cleanup | 009-plugin-manual-testing-playbooks | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **MCP Route Guard (005):** manifest-strict (actionable-only, recommended) vs broad advisory (nudge manifest registration, env-gated default-off)?
- **Spec Mutation Gate (006):** what `answerParse` false-positive rate on a real prompt corpus gates flipping `MK_SPEC_GATE_ENFORCE` on for Write/Edit?
- **Live wiring:** do we wire the hook entries into `.claude/settings.json` on merge, or land plugins default-off and wire in a follow-up once each pair is soak-tested?
- **Completion Evidence Sentinel (004):** ship the cheap Claude-`Stop` half first and defer the OpenCode `session.idle` half (which must resolve last-message + packet via `ctx.client`)?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research predecessor**: `skilled-agent-orchestration/132-plugin-hook-implementation/000-plugin-hook-opportunities/research/research.md`
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md, checklist.md, decision-record.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
