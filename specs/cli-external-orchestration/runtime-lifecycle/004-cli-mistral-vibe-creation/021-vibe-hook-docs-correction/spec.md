---
title: "Feature Specification: Phase 21: vibe-hook-docs-correction"
description: "The Vibe guard reference marks five OpenCode plugins not portable and describes post_agent, pre_agent and the question tool in ways the source and the 014 to 019 runs overturn, and two index lines still call the wire format UNKNOWN. This phase corrects every such line, citing a recorded run for each, and closes the parent with a recursive strict validate."
trigger_phrases:
  - "vibe hook docs correction"
  - "phase 21 vibe hook docs correction"
  - "guards and hooks not portable correction"
  - "vibe parity gaps closeout"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 21: vibe-hook-docs-correction

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/383-mistral-vibe-runtime` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 21 |
| **Predecessor** | 020-vibe-dispatch-hardening |
| **Successor** | None |
| **Handoff Criteria** | Every corrected line cites a recorded run, `rg -c 'not portable'` on the guard reference prints only the rows still unported, and the parent's recursive strict validate prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: Documentation and one code comment. Each line changed states what phases 014 to 019 built and ran; no line changes on a source reading alone.

**Dependencies**:
- Phases 014 to 019 complete, each with its recorded run in its own `scratch/` or test output.
- Phase 020 complete, so the closeout validate covers every child.

**Deliverables**:
- A corrected `guards-and-hooks.md` (hook-type table, plugin classification, what-is-not-portable prose).
- A corrected `spec-gate-classify.mjs` comment and the two index lines.
- Playbook scenarios and feature-catalog lines for the new hooks, and a passing recursive validate of the parent.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`references/guards-and-hooks.md` marks five OpenCode plugins `not portable` (Measured Behavior): ask-surface-guard, completion-sentinel, session-relaunch, session-history-lookup and decision-capture, on the grounds that `post_agent` cannot hold a turn and Vibe has no question tool. Vibe's own hook reference gives a `post_agent` deny as a retry message capped at three per turn, and `vibe/core/tools/builtins/ask_user_question.py` is a question tool, so those rows, the `post_agent` row at line 65 and the prose at lines 160 and 163 are wrong. The `spec-gate-classify.mjs:54-55` comment says a deny does not exist on `pre_agent`, which Vibe's reference contradicts, and `SKILL.md:145` and `README.md:110` still describe "the UNKNOWN wire format" that section 5 settled.

### Purpose
The Vibe guard reference and its index describe the seams phases 014 to 019 built, each line backed by a recorded run.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c "not portable" .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md
5
$ rg -c "UNKNOWN wire format" .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md .skilled/skills/cli-external-orchestration/cli-mistral-vibe/README.md
.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:1
.skilled/skills/cli-external-orchestration/cli-mistral-vibe/README.md:1
$ sed -n 54,55p .vibe/plugins/repo-guards/spec-gate-classify.mjs
// Appending context is the only channel a pre_agent hook has; a deny does not
// exist on this event, so nothing here can stop the turn.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the `post_agent` row (line 65) and the `strict` prose of section 2 to say a deny sends a retry message, capped at three per turn, citing phase 014's fixture run.
- Rewrite the section 4 rows for the seven plugins phases 015 to 019 ported (skill advisor, dist freshness, ask-surface, completion sentinel, session relaunch, session-history lookup, decision capture) with the built hook, its event and the run that proved it; a row whose phase closed a part as interactive-only says so.
- Rewrite the section 4 "What Is Not Portable" prose (lines 160 and 163 and their neighbours) to list only what stays unported, with the reason.
- Correct the `spec-gate-classify.mjs:54-55` comment to say the hook appends context by choice and that a `pre_agent` deny would block the message.
- Replace "the UNKNOWN wire format" at `SKILL.md:145` and `README.md:110`, and add feature-catalog lines for the new hooks. The per-hook playbook scenarios move to phase 022, which writes and runs them live.
- Add a Vibe column to the `.skilled/hooks/README.md` coverage matrix and `Vibe` to the runtime list `runtime-refusal.test.mjs` pins, which phase 017 handed here.

### Out of Scope
- Any hook or guard behavior - phases 013 to 020 own the code. This phase changes one comment in `spec-gate-classify.mjs`, the hooks README coverage matrix and the runtime list in `runtime-refusal.test.mjs`, and no guard logic.
- The parent spec's phase map and deferred-work sentence - the parent orchestrator updates them at closeout; this phase only validates them.
- The `--resume` dispatch recipe beyond the line phase 019's probe supports - a result marked UNVERIFIED there stays UNVERIFIED here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` | Modify | Section 2 table and `strict` prose, section 4 rows and prose |
| `.vibe/plugins/repo-guards/spec-gate-classify.mjs` | Modify | The comment at lines 54-55 |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md`, `README.md` | Modify | The two index lines |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/` | None here | Phase 022 writes the per-hook scenarios |
| `.skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/` | Modify | Lines for the new hooks |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify (only if 014 to 019 added an env var) | The new variables |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every corrected line cites a run, not a source reading | Each changed row or sentence in `guards-and-hooks.md` names a phase 014 to 019 test file or `scratch/` record, and `scratch/citation-map.md` maps every changed line to it |
| REQ-002 | The classification lists only what stays unported | `rg -c 'not portable' references/guards-and-hooks.md` prints the count of rows `scratch/citation-map.md` lists as still unported, which is below 5 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The comment matches Vibe's `pre_agent` behavior | `rg -n 'a deny does not' .vibe/plugins/repo-guards/spec-gate-classify.mjs` exits 1, matched by text because phase 013 moves the file's lines, and the rewritten comment says a `pre_agent` deny would block the message |
| REQ-004 | The index lines no longer call the wire format UNKNOWN | `rg -c 'UNKNOWN wire format'` on `SKILL.md` and `README.md` exits 1 |
| REQ-005 | The new hooks have catalog lines, and their playbook scenarios are handed to phase 022 | The catalog check reports 0 issues, and phase 022's `tasks.md` lists a `VIB-HK` scenario per new hook |
| REQ-006 | The parent closes clean | `validate.sh <parent> --recursive --strict` prints `RESULT: PASSED` for the parent and all 21 children |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/citation-map.md` maps every changed line in `guards-and-hooks.md` to a recorded run, with no row citing a source line alone.
- **SC-002**: The parent's recursive strict validate prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 014 to 019 closing with recorded runs | High: a row with no run stays as it is | A row whose phase did not run its proof keeps its current verdict and gains an UNVERIFIED note naming the missing run |
| Risk | Rewriting the doc from the earlier source readings repeats the error this phase corrects | High | REQ-001 and the citation map refuse a line that cites only a source file |
| Risk | Line numbers drift as earlier phases edit the same files | Low | T001 re-anchors each target by text, not by number |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocks planning. Which rows stay `not portable` is decided by what phases 014 to 019 record, not here.
<!-- /ANCHOR:questions -->

---
