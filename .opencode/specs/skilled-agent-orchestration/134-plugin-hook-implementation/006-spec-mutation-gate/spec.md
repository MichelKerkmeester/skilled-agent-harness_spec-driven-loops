---
title: "Feature Specification: Spec Mutation Gate [template:level_3/spec.md]"
description: "Turn the framework's Gate-3 'spec folder before any file mutation' rule from a prompt-time instruction into a runtime guard: a classify surface runs the existing classifyPrompt per turn and surfaces the A/B/C/D/E question, an enforce surface denies a Write/Edit only when the session gate is open and unanswered."
trigger_phrases:
  - "spec mutation gate"
  - "gate 3 enforcement"
  - "write edit guard"
  - "mk-spec-gate"
  - "spec folder gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/006-spec-mutation-gate"
    last_updated_at: "2026-07-11T06:21:17.844Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 planning spec for the spec-mutation-gate phase from the research brief"
    next_safe_action: "Review the plan and decision-record, then build the shared ESM core first behind classify-only"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-spec-mutation-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Spec Mutation Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

The constitution's most-cited rule, Gate 3, asks the model to establish a spec folder before it mutates any file. Today that rule lives only as prompt text, so an agent can silently edit repo files without ever asking. This phase makes the rule runtime-enforced: a classify surface runs the already-built `classifyPrompt` per user turn to open the gate and surface the A/B/C/D/E question, and an enforce surface denies a Write or Edit only when the session gate is open and no valid answer exists.

**Key Decisions**: One runtime-neutral ESM policy core plus two thin runtime adapters (OpenCode plugin, Claude hooks). Advisory by default, deny opt-in behind `MK_SPEC_GATE_ENFORCE=1`, fail-open on every error path.

**Critical Dependencies**: The shared gate-3-classifier ESM module (`classifyPrompt`, `validateSpecFolderBinding`, `satisfiedBy: 'prior_answer'`), which is compiled ESM (`shared/package.json:5 "type":"module"`). This is its first enforcement consumer; it is currently a scorer input only.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `scaffold/006-spec-mutation-gate` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-mcp-route-guard |
| **Successor** | 007-speckit-completion-exposer |
| **Handoff Criteria** | Classify-only surfaces ship in both runtimes, the `answerParse()` false-positive rate is measured against a corpus, and enforce stays behind `MK_SPEC_GATE_ENFORCE` until that rate is accepted |

> **Changelog**: When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Gate 3 ("spec folder before any file mutation") is enforced only as prose in `CLAUDE.md` and `AGENTS.md`, so nothing stops an agent from editing repo files without first asking the mandated A/B/C/D/E spec-folder question. The classifier that already detects this intent (`classifyPrompt` in `shared/gate-3-classifier.ts:838`) is wired to scorer lanes only, never to enforcement. The result is a repeatable failure mode: silent, unscoped file mutation that the constitution forbids.

### Purpose
Make the runtime ask the Gate-3 question when a turn triggers file mutation and, opt-in, deny a Write or Edit that proceeds while the session gate is open and unanswered, without ever blocking correctly-scoped work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A runtime-neutral ESM policy core exposing `classifyIntent()` (classify + answer-parse + persist) and `evaluateMutation()` (allow/advise/deny) that statically imports `classifyPrompt` and `validateSpecFolderBinding`.
- An OpenCode adapter plugin wiring classify to `experimental.chat.system.transform`, enforce to `tool.execute.before`, and state sweep/evict to `event`.
- A Claude adapter: a `UserPromptSubmit` classify hook and a `PreToolUse` "Write|Edit" enforce hook (plus a "Bash" advise-only entry), backed by ESM hook files and two new `.claude/settings.json` entries.
- Session-scoped state under `.opencode/skills/.spec-gate-state/` reusing the loop-guard-state atomic-write, sweep/archive/prune, and shared warning-log, caching the validated resolved spec-folder path.
- A golden-loop vitest plus an `answerParse()` corpus that measures its false-positive and false-negative rate.

### Out of Scope
- Changing the prose Gate-3 rule in `CLAUDE.md` / `AGENTS.md` - the prose stays authoritative and this guard must not diverge from it.
- Enforcing Bash mutation intent - Bash stays advise-only because its mutation intent is heuristic, not deterministic.
- A size-based exemption for tiny edits - undetectable at hook time (no diff), so a path-class exemption substitutes for it.
- Any daemon, MCP, or bridge subprocess on the classify/enforce paths - these stay pure-local.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/spec-gate/spec-gate-core.ts` | Create | Runtime-neutral ESM policy core: `classifyIntent()`, `evaluateMutation()`, `answerParse()`, hex(sessionID) state, validated-path cache. Compiled to `dist/lib/spec-gate/spec-gate-core.js`. |
| `.opencode/plugins/mk-spec-gate.js` | Create | OpenCode adapter (default-export ESM): `experimental.chat.system.transform` classify, `tool.execute.before` enforce, `event` sweep/evict, fail-open wrappers. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/spec-gate-classify.ts` | Create | Claude `UserPromptSubmit` classify hook: reads stdin JSON, calls core, emits `additionalContext` question when open, fail-open approve otherwise. Compiled to `dist/hooks/claude/spec-gate-classify.js`. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/spec-gate-enforce.ts` | Create | Claude `PreToolUse` "Write\|Edit" enforce hook (deny-JSON) plus "Bash" advise-only; `main().catch(approve)`. Compiled to `dist/hooks/claude/spec-gate-enforce.js`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/spec-gate/spec-gate-core.test.ts` | Create | Golden-loop vitest and `answerParse()` corpus test. |
| `.claude/settings.json` | Modify | Add a `UserPromptSubmit` classify entry, a `PreToolUse` "Write\|Edit" enforce entry, and a "Bash" advise-only entry. |
| `.opencode/plugins/README.md` | Modify | Register `mk-spec-gate` (owning skill, default-export-only, no stdout/stderr, fail-open). |
| `.opencode/skills/.spec-gate-state/` | Create (runtime) | Session-scoped state directory written by the core at runtime; not committed content. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The ESM core exposes `classifyIntent()` and `evaluateMutation()`, statically importing `classifyPrompt` and `validateSpecFolderBinding` from the shared gate-3-classifier; the core writes no stdout/stderr and appends no log itself. | Unit test imports both entrypoints; grep confirms zero `console.*` in the core; adapters own all transport (same contract as `dispatch-guard.cjs`). |
| REQ-002 | `evaluateMutation()` fails OPEN on every error path: unreadable or corrupt state, `classifyPrompt` throw, unresolvable workspace root, or any unexpected argument shape returns allow with no side effects. | Fail-open vitest cases force each error and assert `decision:'allow'` with no state write. |
| REQ-003 | Deny is deterministic and opt-in: `evaluateMutation()` returns `deny` only when `MK_SPEC_GATE_ENFORCE=1`, `tool` is Write or Edit, the session gate is open, no valid bound folder exists, and the target is a real in-repo source file; otherwise it returns `advise` or `allow`. | Matrix test toggles the env, tool, gate status, and target class; deny appears only for the single all-true row. |
| REQ-004 | `evaluateMutation()` never walks the specs tree; it reads only the validated resolved path cached in session state at classify time. | Test spies on `collectSpecFolderCandidates` / filesystem walk and asserts zero calls from the enforce path; enforce does at most one cached `fs.stat`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `classifyIntent()` runs `answerParse()` first when status is open, validates a candidate spec folder via `validateSpecFolderBinding` (`source:'prior_answer'`), and persists `satisfied` on success or `skipped` on D/skip; otherwise, when `classifyPrompt(prompt).triggersGate3` and status is not satisfied, it persists `open` and returns the bounded question. | Golden-loop steps 1 and 3 assert the open-then-satisfied transition; `answerParse()` runs only when status is open. |
| REQ-006 | The OpenCode plugin `mk-spec-gate.js` wires classify in `experimental.chat.system.transform`, enforce in `tool.execute.before` (Bash advise-only), and sweep/evict in `event`; every hook is wrapped fail-open and only re-throws errors prefixed `mk-spec-gate:`. | Plugin smoke test triggers each hook; a forced core throw does not reject the tool; a deny throws exactly `mk-spec-gate: <detail>`. |
| REQ-007 | The Claude adapter adds a `UserPromptSubmit` classify entry and a `PreToolUse` "Write\|Edit" enforce entry (plus a "Bash" advise-only entry) to `.claude/settings.json`, backed by ESM hooks; deny uses the `permissionDecision:'deny'` JSON shape and every hook fails open via `main().catch(approve)`. | `settings.json` parses; hook smoke test asserts deny-JSON on block and approve on every error. |
| REQ-008 | A golden-loop vitest covers open, deny, answer, and allow, plus fail-open, read-only-guard, and exempt-path cases; an `answerParse()` corpus measures its false-positive and false-negative rate before enforce is enabled. | Vitest suite passes; corpus report records the measured rate and the accepted threshold. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Classify-only rollout runs in both runtimes and surfaces the Gate-3 question over a session sample with zero deny events (observe-only, deny env unset).
- **SC-002**: With `MK_SPEC_GATE_ENFORCE=1`, a Write or Edit to a real in-repo source file while the session gate is open and unanswered is denied with the A/B/C/D/E question, and the same Write after a valid answer is allowed.
- **SC-003**: The `answerParse()` false-positive rate (normal prompts misread as answers) measured against the corpus is at or below the accepted threshold before enforce is flipped on.
- **SC-004**: Every error path fails open, so no correctly-scoped write is ever blocked by a gate bug, proven by the fail-open vitest assertions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared gate-3-classifier ESM module (`classifyPrompt`, `validateSpecFolderBinding`) | Guard cannot classify or validate answers if the module or its dist artifact is missing | Static import from `shared/dist/gate-3-classifier.js`; fail-open on classifier throw so a missing artifact never blocks writes |
| Dependency | `.claude/settings.json` multi-hook support (Claude runs multiple `UserPromptSubmit` entries) | Classify hook cannot co-exist with the skill-advisor shim if only one entry is allowed | Verified: settings.json already runs multiple entries per event (`user-prompt-submit.js` shim at line 42); add alongside, do not replace |
| Risk | ESM/CJS asymmetry - the classifier is ESM, the deep-loop `.cjs require()` pattern does not transfer | Copying `task-dispatch-guard.cjs`'s `require()` shape produces a runtime import failure | Author the core and Claude hooks as ESM (TS compiled to `dist/.js`, matching the existing UPS shim); documented in ADR-001 |
| Risk | False `open` persisted to session state stalls the session until the next answer turn | High blast: a correctly-scoped session cannot write until it answers | Fail-open reads, single-answer-per-session cost, and `event` sweep/evict of stale state |
| Risk | `answerParse()` misreads a normal prompt as an answer, closing the gate incorrectly | Gate closes without a real binding, defeating the guard | `answerParse()` runs only when status is open; corpus-measured false-positive rate gates the enforce flip (SC-003) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The enforce path adds at most one cached `fs.stat` per Write/Edit and never walks the specs tree, keeping added latency negligible on the hot path.
- **NFR-P02**: The classify path is pure-local (string match plus at most one folder validation per answer) and starts no daemon, MCP, or bridge subprocess.

### Security
- **NFR-S01**: The injected Gate-3 question is a small fixed string; the guard never echoes the classifier's matched-token arrays into the TUI or injected context.

### Reliability
- **NFR-R01**: Every failure mode (unreadable/corrupt state, classifier throw, unresolvable root, unexpected arg shape) fails open, so guard reliability never gates on the guard itself.

---

## 8. EDGE CASES

### Data Boundaries
- Empty or whitespace-only prompt: `classifyPrompt` returns no Gate-3 trigger, the gate stays closed, and no state is written.
- Exempt target path: a Write to `.opencode/specs/<folder>/spec.md` while status is open is allowed, because writing the spec folder is the Gate-3 workflow itself.

### Error Scenarios
- Corrupt or unwritable `.spec-gate-state`: the read fails open (allow), and the atomic writer never partially clobbers a prior file.
- Classifier throw: `evaluateMutation()` and `classifyIntent()` both swallow it and return allow / no-op.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 5 new + 2 edits, LOC: moderate, Systems: 2 runtimes plus shared core |
| Risk | 22/25 | Auth: N, API: N, Breaking: enforce sits on the Write/Edit hot path (highest blast in the packet) |
| Research | 6/20 | Exemplars and classifier already exist; the one novel piece is `answerParse()` |
| Multi-Agent | 4/15 | Single workstream: core then two adapters |
| Coordination | 10/15 | Two runtime wiring points each for classify and enforce, staged rollout |
| **Total** | **56/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A false deny stalls every task because enforce sits on the Write/Edit hot path | H | L | Deny opt-in behind `MK_SPEC_GATE_ENFORCE`, narrow deny predicate, fail-open everywhere |
| R-002 | `answerParse()` false positives close the gate without a real binding | M | M | `answerParse()` only when status is open; corpus-measured rate gates the enforce flip |
| R-003 | ESM/CJS asymmetry breaks the import if the `.cjs` deep-loop pattern is copied | M | M | ESM core and hooks (TS to `dist/.js`); ADR-001 records the boundary |
| R-004 | Session state persistence failure blocks writes if it fails closed | H | L | Fail-OPEN persistence (like loop-guard-state), never fail-closed like mk-goal |
| R-005 | The guard diverges from the prose Gate-3 rule in `CLAUDE.md` / `AGENTS.md` | M | L | Prose stays authoritative; the guard reuses the same `classifyPrompt` classifier, not a fork |
<!-- Given/When/Then user stories follow; ANCHOR:questions wraps sections 7-12 to mirror the level-3 template. -->

---

## 11. USER STORIES

### US-001: Surface the Gate-3 question on mutation intent (Priority: P0)

**As a** framework operator, **I want** the runtime to surface the Gate-3 question whenever a turn triggers file mutation, **so that** agents cannot silently edit repo files without being asked.

**Acceptance Criteria**:
1. **Given** an empty session, **When** `classifyIntent({prompt:'fix the login bug'})` runs, **Then** it persists `status:'open'` and returns the bounded A/B/C/D/E question.
2. **Given** the gate is open, **When** the classify surface injects context, **Then** it appends only the fixed question string, never the classifier's matched-token arrays.

---

### US-002: Deny is opt-in and fail-open (Priority: P0)

**As a** framework operator, **I want** deny gated behind an env kill-switch with fail-open everywhere, **so that** a bug in the gate never blocks correctly-scoped work.

**Acceptance Criteria**:
1. **Given** `MK_SPEC_GATE_ENFORCE=1` and an open unanswered gate, **When** a Write targets a real in-repo source file, **Then** `evaluateMutation()` returns `decision:'deny'` with the question.
2. **Given** the same Write but with the enforce env unset, **When** `evaluateMutation()` runs, **Then** it returns `advise`, not `deny`.

---

### US-003: Answers close the gate (Priority: P1)

**As an** agent mid-session, **I want** my A/B/C/D/E answer parsed and persisted, **so that** the gate closes and subsequent writes proceed without re-prompting.

**Acceptance Criteria**:
1. **Given** an open gate, **When** `classifyIntent({prompt:'B, use .opencode/specs/059-login'})` runs, **Then** it validates the real folder and persists `status:'satisfied'` with the cached resolved path.

---

### US-004: Path-class exemptions never block the workflow (Priority: P1)

**As a** maintainer, **I want** writes to the spec tree, `/tmp` scratchpad, `dist`, `node_modules`, `.git`, and out-of-repo paths exempt, **so that** the Gate-3 workflow itself and non-source edits are never blocked.

**Acceptance Criteria**:
1. **Given** an open gate, **When** a Write targets `.opencode/specs/059-login/spec.md`, **Then** `evaluateMutation()` returns `allow` because the target is exempt.

---

## 12. OPEN QUESTIONS

- Should the core and hooks ship as compiled TypeScript under `mcp_server/dist` (matching the existing UPS shim) or as standalone `.mjs` files? ADR-001 proposes the compiled-TS path; confirm before implementation.
- What false-positive threshold for `answerParse()` is acceptable before flipping `MK_SPEC_GATE_ENFORCE` on in the default profile?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: See `../spec.md`
