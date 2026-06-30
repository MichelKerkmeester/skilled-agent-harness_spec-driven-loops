---
title: "Feature Specification: Phase 3: verify-and-ship"
description: "Run validate.sh --strict, dispatch @review (Opus + sk-code-review) for fresh-context verification, refresh graph-metadata, ship clean diff to main."
trigger_phrases:
  - "068/003"
  - "verify-and-ship"
  - "opus verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "068-sk-doc-organization/003-verify-and-ship"
    last_updated_at: "2026-05-05T08:55:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored phase 3 spec.md after Phase 2 commit"
    next_safe_action: "Author plan.md/tasks.md, then run validate.sh --strict and dispatch @review opus"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase3-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: verify-and-ship

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Pending |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-update-and-mirror |
| **Successor** | None (terminal phase) |
| **Handoff Criteria** | `validate.sh --strict` passes on parent 068; @review (Opus + sk-code-review) returns PASS in fresh context; graph-metadata.json refreshed; clean commit on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sk-doc asset reorganization — terminal phase. Phases 1 and 2 already moved 4 asset items to assets/ root and updated all dependent references across 4 runtimes. Phase 3 is the verification + ship gate: validate, get a fresh-context Opus verifier to confirm correctness, refresh graph metadata, and close the packet.

**Scope Boundary**: Verification + closeout only. NO code changes (other than implementation-summary.md authoring + graph-metadata refresh). NO new substring substitutions. NO mirror replication.

**Dependencies**:
- Phase 1 (commit ccd73ef55) complete
- Phase 2 (Phase 2 commit) complete
- @review agent + sk-code-review skill available
- `validate.sh --strict` passes on 001 and 002 children

**Deliverables**:
- `validate.sh --strict` exit 0 on parent `068-sk-doc-organization/`
- @review verifier returns PASS (or successfully iterates through ≤2 remediation cycles)
- `graph-metadata.json` refreshed for parent + 3 children with `derived.last_known_status` reflecting completion
- `description.json` refreshed
- `implementation-summary.md` for 003 authored with verification outcomes
- One terminal commit on main: `feat(sk-doc): verify and ship sk-doc reorg (068/003)`

**Changelog**:
- Phase 3 closeout writes `.opencode/skills/sk-doc/changelog/v<next>.md` documenting the reorg.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 1 and 2 left the repo in a state where the reorg APPEARS complete but no fresh-context verification has confirmed it. cli-codex and Claude both touched the work, so any blind spots either of them have are correlated. The user explicitly asked for an Opus sub-agent verifier in fresh context to break that correlation.

### Purpose
Get an independent fresh-context verifier (`@review` with `sk-code-review`) to validate the reorg against deterministic ground truth (rg residual checks, validate.sh --strict, diff -rq, tomllib parse-check) AND apply Hunter/Skeptic/Referee subjective challenges on the full diff. Ship only if verifier returns PASS.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/054-sk-doc-organization --strict` (must exit 0)
- Dispatch `@review` (Opus 4.7, fresh context, read-only) with `sk-code-review` skill loaded
- Verifier reruns `rg` residual + `validate.sh --strict` + `diff -rq` checks IN FRESH SHELL (never trust prior reported output)
- Verifier samples 3 random updated files for content drift check
- Verifier returns PASS / FAIL_REMEDIATE_VIA_CODEX / FAIL_HALT_TO_USER
- On PASS: refresh `graph-metadata.json` + `description.json` via generate-context.js
- Author `003-verify-and-ship/implementation-summary.md` with verification outcomes
- Final commit on main

### Out of Scope
- Phase 1 work (already done)
- Phase 2 work (already done)
- New asset moves or reference substitutions
- `decision-record.md` (pure relocation, no architectural decision)
- `barter/coder/` (locked at parent)
- `z_archive/` and historical iteration logs
- Re-validation of previously-validated phases (children retain their own validate state)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `068-sk-doc-organization/003-verify-and-ship/implementation-summary.md` | Modify | Verification outcomes from @review |
| `068-sk-doc-organization/graph-metadata.json` | Modify | `derived.last_known_status` + `derived.last_save_at` refresh |
| `068-sk-doc-organization/description.json` | Modify | metadata refresh |
| `068-sk-doc-organization/00{1,2,3}-*/graph-metadata.json` | Modify | child metadata refresh |
| `.opencode/skills/sk-doc/changelog/v<next>.md` | Create (optional) | Document the reorg in sk-doc's changelog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `validate.sh --strict` exits 0 on parent `068-sk-doc-organization/` | Exit code 0; no `[ERR]` lines |
| REQ-002 | Final residual `rg` returns ZERO hits in active scope | Same `rg` from Phase 2 D.2 returns empty |
| REQ-003 | @review verifier returns PASS | Verifier output contains "VERDICT: PASS" |
| REQ-004 | Verifier reran validate.sh + rg in FRESH shell (not Claude's existing shell) | Verifier output cites the exit code from its own invocation, not Claude's |
| REQ-005 | `graph-metadata.json` refreshed for parent + 3 children with completion status | `jq '.derived.last_known_status'` returns `complete` for parent and each child |
| REQ-006 | All commits on main; no surviving feature branch | `git branch --show-current = main`; `git branch` shows no `068-*` packet branch |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Verifier samples 3 random updated files; confirms content drift = none | Verifier output cites 3 file paths and confirms NEW path strings present |
| REQ-008 | sk-doc/changelog/v<next>.md authored documenting the reorg | File exists; references the 4 substitutions and the move |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 P0 + 2 P1 REQs verified with evidence
- **SC-002**: Packet 068-sk-doc-organization shipped clean to main; ready for downstream consumers

### Given/When/Then Verification Scenarios

**Given** Phase 1 and Phase 2 commits landed, **When** running `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/054-sk-doc-organization --strict`, **Then** exit code is 0 and no `[ERR]` lines appear.

**Given** the residual sweep filter from Phase 2, **When** running `rg --no-config --no-ignore-vcs --glob '!**/specs/**' --glob '!**/z_archive/**' ... 'assets/(documentation/...|agents/...)' .opencode .claude .codex .gemini`, **Then** rg exits 1 (no matches).

**Given** @review dispatched with sk-code-review skill in fresh context, **When** verifier reruns validate.sh + rg + diff -rq + tomllib parse + 3-file sample read, **Then** all checks pass and verifier returns "VERDICT: PASS".

**Given** verifier returns PASS, **When** running `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`, **Then** parent 068 + 3 children have refreshed graph-metadata.json with `derived.last_known_status = "complete"`.

**Given** all REQs satisfied, **When** committing with `feat(sk-doc): verify and ship sk-doc reorg (068/003)`, **Then** commit lands on main and `git status --porcelain` is clean.

**Given** the terminal commit, **When** running `git log --oneline -5`, **Then** the last 3-4 commits trace the reorg lifecycle (relocate, parent docs, update-and-mirror, verify-and-ship).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | @review agent + sk-code-review skill | High — verification gate cannot run without it | Both confirmed available in this runtime; advisor pointed to sk-code-review at session start |
| Risk | Verifier returns FAIL_REMEDIATE_VIA_CODEX | Medium — adds a remediation cycle | Bounded: max 2 retry cycles, then halt to user with diagnostic |
| Risk | Verifier blind spot correlated with Claude/codex | Medium — blind spots compound | Mitigated by deterministic rg + validate.sh + diff -rq + tomllib parse-check (objective ground truth alongside subjective Hunter/Skeptic/Referee) |
| Risk | validate.sh --strict reports a child-doc placeholder | Low — would block ship | All 3 children authored with placeholders replaced; 6 REQs + 6 Givens per spec.md as required by SCAFFOLD_VALIDATION_COUNTS |
| Risk | graph-metadata.json refresh fails | Low — generate-context.js may need session ID | Fall back to manual jq edit if script errors |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — all scope/sequencing decisions resolved during planning. Reference plan: `/Users/michelkerkmeester/.claude/plans/reorganize-sk-doc-assets-by-promoting-dynamic-pearl.md`.
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
