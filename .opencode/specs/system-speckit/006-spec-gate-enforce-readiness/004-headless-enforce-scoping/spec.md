---
title: "Feature Specification: Headless / subagent enforce scoping [template:level_2/spec.md]"
description: "MK_SPEC_GATE_ENFORCE=1 in the operator shell leaks into every dispatched opencode run child, whose Gate-3 has no user turn to answer, so enforce-on systematically denies autonomous work and pushes agents toward never-denied Bash heredocs. This phase scopes deny to interactive sessions only."
trigger_phrases:
  - "headless enforce scoping"
  - "spec gate child session"
  - "AI_SESSION_CHILD advise"
  - "dispatched subagent deny"
  - "who can deny spec gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/006-spec-gate-enforce-readiness/004-headless-enforce-scoping"
    last_updated_at: "2026-07-11T11:05:57.825Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 spec for headless/subagent enforce scoping (WS4)"
    next_safe_action: "Author plan.md design choice: child detection in core evaluateMutation via AI_SESSION_CHILD"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/plugins/mk-spec-gate.js"
      - ".claude/settings.json"
      - ".opencode/bin/worktree-session.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-headless-enforce-scoping"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 4 — Headless / subagent enforce scoping

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
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
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `scaffold/004-headless-enforce-scoping` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-scaffolded-folder-acceptance |
| **Successor** | 005-answer-grammar-hardening |
| **Handoff Criteria** | Child/dispatched sessions never deny (advise only) under enforce; interactive Claude still denies when enforce on; core + adapter tests green; who-can-deny scoping documented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Spec-gate enforce-readiness remediation specification. It resolves Fable defect 3 — the highest-value correctness gap that makes ENFORCE mode viable.

**Scope Boundary**: Change the deny predicate so a dispatched/child/subagent session is never denied, scope the operator's first enforce flip to the Claude Code interactive process env, and make the cli-external dispatch surfaces neutralize a leaked enforce env. No change to classify behavior, answer parsing, or the shared Gate-3 classifier.

**Dependencies**:
- WS1 (001-advise-telemetry) supplies the would-be-deny measurement used to decide when to flip enforce on; this phase is what makes the eventual flip safe for autonomous work.
- The established `AI_SESSION_CHILD=1` dispatch convention (`.opencode/bin/worktree-session.sh:71`, cli-external SKILL dispatch rules) is reused as the child signal.

**Deliverables**:
- A child-session suppression clause inside the core deny predicate so both runtimes inherit it from one place.
- Enforce-flip env scoped to the Claude Code interactive process (`.claude/settings.json`), not a shell export.
- cli-external dispatch surfaces that export `MK_SPEC_GATE_ENFORCE=0` for headless children.
- Documented "who can deny" scoping.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`export MK_SPEC_GATE_ENFORCE=1` in the operator shell propagates into every dispatched `opencode run` (and `claude -p`) child. A child/subagent session has no interactive user turn to answer Gate-3, so its session gate opens and stays open forever; with enforce on, `evaluateMutation` returns `deny` for every Write/Edit (`spec-gate-core.mjs:582-583`). Live state already shows a ~30s fanout cluster of ten unanswerable open gates. Worst case, denied agents route writes through Bash heredocs, which `evaluateMutation` never denies (Bash is advise-only, `spec-gate-core.mjs:576`), so the guard becomes counterproductive with LESS visibility than advise mode.

### Purpose
Deny fires only for a human-driven interactive session; every dispatched/child/subagent session is advise-only even when the enforce env is set, so enforce-on can never block autonomous work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a child-session signal to the core deny predicate (`AI_SESSION_CHILD=1` forces `advise`) inside `evaluateMutation()`.
- Extend `spec-gate-core.test.mjs` with the child-session matrix (child + enforce → advise; interactive + enforce → deny; child + disabled → allow).
- Scope the operator's first enforce flip to the Claude Code interactive process via the `.claude/settings.json` `env` block, not a shell-wide `export`.
- Export `MK_SPEC_GATE_ENFORCE=0` from the cli-external dispatch surfaces and the worktree child branch so a leaked enforce env never reaches a headless child.
- Document the "who can deny" scoping in the plugin and worktree READMEs.

### Out of Scope
- Widening or narrowing which tools can deny (stays Write/Edit only) - the deny tool set is frozen by invariant.
- Any change to `classifyIntent`, `answerParse`, or the shared `gate-3-classifier.ts` contract - that is WS2/WS3/WS5 territory.
- Rebuilding anything under `mcp_server/` - the classifier dist is consumed as-is.
- Deciding when the operator actually flips enforce on - that is the WS1 telemetry-driven operator call, not this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` | Modify | Add `CHILD_SESSION_ENV` constant + `isChildSession(env)` helper; narrow the deny predicate in `evaluateMutation()` to `denyCapable && enforceOn && !isChildSession(environment)`. |
| `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs` | Modify | Add child-session cases: enforce+child → advise, enforce+no-child → deny, child+disabled → allow, `AI_SESSION_CHILD` value variants. |
| `.opencode/plugins/mk-spec-gate.js` | Unchanged (verified) | Already forwards `process.env` to `evaluateMutation` (`mk-spec-gate.js:235`); child suppression flows through with no plugin edit. Listed to prove it is a non-consumer of new logic. |
| `.opencode/plugins/tests/mk-spec-gate.test.cjs` | Modify | Adapter test: `tool.execute.before` with `AI_SESSION_CHILD=1` + enforce + open gate → no throw (advise). |
| `.claude/settings.json` | Modify | Add `MK_SPEC_GATE_ENFORCE` to the `env` block (ship `"0"`; operator flips to `"1"` for the interactive-only first stage). Scopes the flip to the Claude process env, not a shell export. |
| `.opencode/bin/worktree-session.sh` | Modify | In the child branch (`AI_SESSION_CHILD=1` / `exec_in_place`), `export MK_SPEC_GATE_ENFORCE=0` so an inherited enforce env is neutralized for orchestrated children. |
| `.opencode/skills/cli-external/cli-opencode/SKILL.md` | Modify | Update dispatch rule 17 pattern to prepend `MK_SPEC_GATE_ENFORCE=0` alongside `AI_SESSION_CHILD=1`; document who-can-deny scoping. |
| `.opencode/skills/cli-external/cli-claude-code/SKILL.md` | Modify | Update dispatch rule 13 pattern to prepend `MK_SPEC_GATE_ENFORCE=0` alongside `AI_SESSION_CHILD=1`. |
| `.opencode/skills/cli-external/cli-opencode/assets/prompt_templates.md` | Modify | Prepend the env pair to the `opencode run` invocation shapes. |
| `.opencode/skills/cli-external/cli-claude-code/assets/prompt_templates.md` | Modify | Prepend the env pair to the `claude -p` invocation shapes. |
| `.opencode/plugins/README.md` | Modify | Document the who-can-deny scoping and `AI_SESSION_CHILD` child-suppression posture. |
| `.opencode/bin/README.md` | Modify | Note the `MK_SPEC_GATE_ENFORCE=0` child export in "Worktree session isolation". |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Child/dispatched sessions never deny | **Given** `AI_SESSION_CHILD=1` and `MK_SPEC_GATE_ENFORCE=1`, **When** `evaluateMutation` runs for a Write on a real in-repo source file with the gate open, **Then** the decision is `advise`, never `deny`. |
| REQ-002 | Interactive sessions still deny when enforced | **Given** no child signal and `MK_SPEC_GATE_ENFORCE=1`, **When** the same Write is evaluated with the gate open, **Then** the decision is `deny` (behavior unchanged from today). |
| REQ-003 | Kill-switch precedence preserved | **Given** `MK_SPEC_GATE_DISABLED=1`, **When** `evaluateMutation` runs with any child/enforce combination, **Then** the decision is `allow` with no state read - disabled outranks child detection. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | First flip scoped to interactive only | **Given** the enforce flip is applied only in the `.claude/settings.json` `env` block, **When** an `opencode run` child is dispatched, **Then** the child process env carries `MK_SPEC_GATE_ENFORCE=0` (not the interactive `1`) via the dispatch surface. |
| REQ-005 | Dispatch surfaces neutralize a leaked env | **Given** a leaked `export MK_SPEC_GATE_ENFORCE=1` in the operator shell, **When** a child is launched through `worktree-session.sh` or a cli-external dispatch recipe, **Then** the child inherits `MK_SPEC_GATE_ENFORCE=0` and `AI_SESSION_CHILD=1`. |
| REQ-006 | Who-can-deny scoping documented | **Given** the plugin and worktree READMEs, **When** a reader asks "which surface can actually deny", **Then** the docs state exactly one answer: an interactive session with enforce on and no child signal. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A dispatched/child OpenCode session (or any session with `AI_SESSION_CHILD=1`) never denies - advise only - even with the enforce env set.
- **SC-002**: An interactive Claude session still denies a Write/Edit when enforce is on and the gate is open and unanswered.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `AI_SESSION_CHILD=1` set at every dispatch site | If a dispatch recipe omits it, that child could deny | Belt-and-suspenders: `worktree-session.sh` child branch also exports `MK_SPEC_GATE_ENFORCE=0`; enforce flip scoped to interactive env, not a shell export |
| Risk | Splitting the deny predicate across plugin + core | Med - two-place predicate drifts and violates the single-predicate invariant | Put child detection INSIDE `evaluateMutation()`; the plugin stays a pass-through that only forwards env |
| Risk | Claude in-process subagents do not carry `AI_SESSION_CHILD` | Low - a Claude Task subagent under enforce could still see deny | First flip is interactive-only and the classify hook binds the gate on the triggering turn (WS2); tracked in Open Questions |
| Risk | `AI_SESSION_CHILD` matched loosely | Low - a non-`1` value mis-classifies a child as interactive | Match the exact `=== '1'` check used by `worktree-session.sh`; the wrapper's `MK_SPEC_GATE_ENFORCE=0` export still neutralizes it |
| Dependency | Fail-open contract of `evaluateMutation` | If child detection throws, it must not block | Detection is a pure env read inside the existing `try`; any throw resolves to `allow` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Child detection is a single synchronous env-var read; it adds no filesystem or network cost to the `tool.execute.before` / PreToolUse path.
- **NFR-P02**: No new state files, sweeps, or log writes are introduced by this phase; the existing bounded warning-log path is untouched.

### Security
- **NFR-S01**: The deny predicate is never widened - `DENY_CAPABLE_TOOLS` stays `{write, edit}` and child detection only ANDs a narrowing condition. Deny cannot fire for a tool that could not already deny.
- **NFR-S02**: Kill-switch precedence is preserved: `MK_SPEC_GATE_DISABLED=1` returns `allow` before any child/enforce logic runs, and every entrypoint stays fail-open (any throw resolves to `allow`/no-op).

### Reliability
- **NFR-R01**: `MK_SPEC_GATE_DISABLED=1` remains a full no-op for both classify and enforce.
- **NFR-R02**: The OpenCode plugin stays default-export-only and never writes to stdout/stderr; advisories continue to route through the bounded state-dir log only.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: `AI_SESSION_CHILD` unset or empty string → treated as interactive (not a child); deny may fire when enforce on.
- Maximum length: not applicable - the signal is an exact-match env flag, not free text.
- Invalid format: `AI_SESSION_CHILD` values other than exact `'1'` (e.g. `true`, `0`, `yes`) → not a child; matches `worktree-session.sh` semantics; wrapper enforce=0 export still neutralizes the child.

### Error Scenarios
- External service failure: not applicable - detection reads only `process.env`.
- Network timeout: not applicable.
- Concurrent access: unchanged - per-session state files are unaffected; the fanout cluster of open gates now resolves to advise instead of deny.

### State Transitions
- Partial completion: if the code change lands but a dispatch recipe is not yet updated, that child still gets advise via the core detection; the wrapper export is redundant safety.
- Session expiry: unchanged - stale open gates are still swept by the existing retention path and now never cause a deny in a child.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One core predicate line + constant/helper, one settings.json env key, one shell branch, doc/pattern edits across ~7 files |
| Risk | 14/25 | Touches env precedence and a deterministic deny predicate; mitigated by narrowing-only change + fail-open + full test matrix |
| Research | 6/20 | Convention (`AI_SESSION_CHILD`) and code paths already located; minimal investigation left |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the first enforce flip include Claude in-process subagents, or stay strictly on the main interactive turn until subagent sessions also carry a child signal?
- Should `worktree-session.sh` export `MK_SPEC_GATE_ENFORCE=0` in the child branch only, or also assert it in the top-level branch for defense in depth?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
