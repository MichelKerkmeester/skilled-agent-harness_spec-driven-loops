---
title: "Feature Specification: 009 RM-8 deep-review iteration prompt hardening"
description: "Mitigate destructive scope violations under /deep:start-review-loop:auto by hardening the iteration dispatch prompt with an explicit allowed-write list and explicit ban on destructive shell verbs outside iteration paths."
trigger_phrases:
  - "rm-8"
  - "deep-review scope violation"
  - "prompt hardening"
  - "destructive scope violation"
  - "deepseek deleted files"
  - "deep-review safety"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/002-spec-kit-internals/002-template-levels/009-harden-deep-review-iteration-prompts"
    last_updated_at: "2026-05-11T05:50:00Z"
    last_updated_by: "main-claude-opus-4.7"
    recent_action: "Authored spec from RM-8 cross-phase-review-synthesis evidence"
    next_safe_action: "Author plan.md and tasks.md, then edit prompt_pack_iteration.md.tmpl"
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl"
    session_dedup:
      fingerprint: "sha256:rm8-009-spec-author-2026-05-11"
      session_id: "main-rm8-009-2026-05-11"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 009 RM-8 deep-review iteration prompt hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-archive-fleet-marker-validation-scaffold |
| **Successor** | None |
| **Handoff Criteria** | Prompt template tightened; iteration dispatch surfaces explicit allowed-write list and destructive-verb ban; smoke-tested on at least one cli-opencode + deepseek-v4-pro dispatch with no out-of-scope writes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the 008-template-levels parent, addressing the operational risk recorded as **RM-8** in `../cross-phase-review-synthesis.md`. The destructive event documented at §5 (≈11:00–11:55 UTC, 2026-05-04) occurred when `opencode + deepseek-v4-pro` under `/deep:start-review-loop:auto` deleted 44 files across phases 007 and 008. Spec docs (spec.md/plan.md/tasks.md/checklist.md/decision-record.md/implementation-summary.md/description.json/graph-metadata.json) AND review/ subtrees were removed despite the dispatch prompt stating the target is read-only.

**Scope Boundary**: prompt template content only. Runtime scope guards (pre-dispatch snapshot + post-dispatch diff-restore) are out of scope and remain open as a separate follow-on packet.

**Dependencies**: none.

**Deliverables**: surgical edit to `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` adding an explicit allowed-write list and a destructive-verb ban; matching note in dispatch prompt under §CONSTRAINTS.

**Changelog**: When this phase closes, refresh the matching file in `../changelog/` using parent packet `010` plus this phase folder name `009-harden-deep-review-iteration-prompts`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-review iteration dispatch hands the executor unrestricted filesystem write access (`opencode run --dangerously-skip-permissions --dir {repo_root}`) but the only safeguard against the model is the single prose line *"Review target is READ-ONLY. Do not modify reviewed files."* in `prompt_pack_iteration.md.tmpl`. There is no runtime enforcement. On 2026-05-04 a `deepseek-v4-pro`-backed dispatch hallucinated cleanup actions and physically deleted 44 files across two phase folders. Recovery was only possible because the working tree had been committed prior to dispatch (`git restore` from `7beb80769`).

### Purpose
Reduce the probability of destructive scope violations under model-driven dispatches by tightening the instruction-side surface: list the exact allowed write paths and explicitly forbid the shell verbs that have historically caused destructive events.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Surgical edit to `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` §CONSTRAINTS
- Explicit allowed-write list (iteration narrative path, state log, delta file, strategy, findings registry)
- Explicit destructive-verb ban (`rm`, `git rm`, `mv`, `sed -i`, `rmdir`, shell truncate `>`, find -delete)
- Explicit instruction to emit a `scope_violation` finding instead of executing any out-of-scope mutation

### Out of Scope
- Runtime scope guard (pre-dispatch snapshot + post-dispatch diff-restore) — separate follow-on packet
- Per-executor sandbox flag changes (e.g. dropping `--dangerously-skip-permissions`) — would block legitimate writes to iteration paths
- Edits to `review_mode_contract.yaml` doctrine — already covers verdicts and severity, not relevant
- Edits to the deep-research iteration prompt pack — RM-8 forensics are scoped to deep-review only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` | Modify | Insert allowed-write list + destructive-verb ban in §CONSTRAINTS |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Prompt template lists exact allowed write paths | Edit must enumerate `{state_paths_iteration_pattern}`, `{state_paths_state_log}`, `{state_paths_delta_pattern}`, `{state_paths_strategy}`, `{state_paths_findings_registry}` as the only permitted write targets |
| REQ-002 | Prompt template enumerates banned shell verbs | Edit must explicitly name `rm`, `git rm`, `mv`, `sed -i`, `rmdir`, output-redirect truncate (`>` on existing files outside allowed-write list), `find ... -delete` |
| REQ-003 | Out-of-scope mutation must trigger `scope_violation` finding instead | Prompt must instruct the agent to STOP and emit a `scope_violation` finding when it would otherwise modify any non-allowed path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Smoke-test under cli-opencode + deepseek-v4-pro | First post-edit dispatch (the 013 phase-parent run that motivated this packet) must complete without out-of-scope writes |
| REQ-005 | Edit must remain template-stable | After edit, `renderPromptPack` token substitution must still resolve all `{state_paths_*}` placeholders without errors |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Post-edit dispatch on `010-doctor-update-orchestrator` phase parent under `cli-opencode + deepseek/deepseek-v4-pro` produces no writes outside `010-doctor-update-orchestrator/review/` (verified by `git status -- 010-doctor-update-orchestrator/` having no surprises during/after the 10-iteration run).
- **SC-002**: The dispatch prompt rendered to the executor contains a literal allowed-write list and the literal substrings `rm`, `git rm`, `mv`, `sed -i` under §CONSTRAINTS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Prompt-only mitigation is instruction-bound; a sufficiently confused model can still violate it | Medium | Belt-and-suspenders: dispatch into a git worktree so the main repo is physically isolated. Separate follow-on packet for runtime scope guard. |
| Risk | The allowed-write list might omit a state path that some future YAML branch needs to write | Low | Only enumerate paths that are already substituted into `prompt_pack_iteration.md.tmpl` via tokens; any new write target would need both a tokenizer addition AND an allowed-write list update by symmetry. |
| Dependency | None |  |  |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — scope is intentionally narrow. Runtime scope guard left explicitly out of scope.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
