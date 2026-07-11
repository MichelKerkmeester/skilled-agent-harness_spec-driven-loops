---
title: "Feature Specification: Phase 4: scoping-and-discovery"
description: "Plan the interactive structured scoping question (ARTIFACT-CLASS x AUTHORITY x SCOPE decision tree), N-lane resolution, the non-interactive arg form for headless/cron runs, and the per-adapter discover(scope)->artifacts contract."
trigger_phrases:
  - "deep-alignment scoping question"
  - "alignment lane resolution"
  - "alignment discover contract"
  - "non-interactive alignment lanes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/004-scoping-and-discovery"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored scoping and discovery contract plan"
    next_safe_action: "Await 003 gate before execution"
    blockers:
      - "003-scaffold-mode-packet not yet executed"
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/spec.md"
      - ".opencode/skills/system-deep-loop/deep-review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-scoping-and-discovery"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Non-interactive lane-arg schema: ADR-011 LOCKED to config-file-only (--lane-config <file.json>), this phase designs the JSON schema"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: scoping-and-discovery

<!-- SPECKIT_LEVEL: 2 -->
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
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-11 |
| **Branch** | `deep-alignment/004-scoping-and-discovery` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 9 |
| **Predecessor** | 003-scaffold-mode-packet |
| **Successor** | 005-adapter-sk-doc |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the `deep-alignment` deep-loop mode specification (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/`).

**Scope Boundary**: this phase plans the SCOPE state of the mode's state machine (INIT -> SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT -> optional REMEDIATE): the interactive question that resolves alignment lanes, the headless/cron equivalent, and the per-adapter discovery contract those lanes feed into. It does not implement any adapter's `discover()` body — phases 005-007 own each adapter's real logic behind this contract.

**Dependencies**:
- Phase 003's scaffold plan (mode-registry entry, directory skeleton) must exist before this phase's engine has anywhere to live.
- The pluggable adapter contract `{ discover(scope)->artifacts, standardSource(authority)->templates+rules, check(artifact,rules)->findings }` is a locked design decision this phase's `discover()` half must conform to exactly.
- Deep-review's own scope-discovery precedent (`.opencode/skills/system-deep-loop/deep-review/SKILL.md`, "Scope Boundary" framing used throughout its packet) informs the interactive-question UX shape, even though deep-review's scope is free-text where deep-alignment's is a structured decision tree.

**Deliverables**:
- A specified structured decision tree over three axes: ARTIFACT-CLASS, AUTHORITY, SCOPE.
- A specified lane-resolution algorithm producing N alignment lanes per run.
- A specified non-interactive arg grammar for headless/cron invocation.
- A specified `discover(scope) -> artifacts` contract every future adapter (005-007) must implement identically.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-alignment` needs to resolve "what to check, against which standard, and where" before it can discover any artifact. Today nothing specifies how that question gets asked interactively, how it degrades to a non-interactive form for unattended runs, or what contract the answer must satisfy so every per-authority adapter (sk-doc, sk-git, sk-design, sk-code) can discover artifacts the same way.

### Purpose
Specify a structured, non-ambiguous scoping question and discovery contract so a future implementation pass can build the SCOPE and DISCOVER states of the mode's state machine without inventing lane semantics per adapter.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Plan the interactive scoping question as a structured decision tree over three axes: **ARTIFACT-CLASS** (docs / code / designs / git-history), **AUTHORITY** (sk-doc / sk-git / sk-design / sk-code, extensible), **SCOPE** (paths / globs / branch-range).
- Plan lane resolution: one run yields N "alignment lanes," each lane a `(authority, artifact-class, scope)` tuple; multiple authorities per run must be selectable in one pass (the operator precedent is "sk-code and sk-git and/or sk-design").
- Plan the non-interactive arg form for headless/cron runs: ADR-011 LOCKS this to config-file-only — a single `--lane-config <file.json>` flag carrying the lane array (not repeated flags, not an inline JSON-array flag) — with the interactive question as the fallback when `--lane-config` is not supplied.
- Plan the `discover(scope) -> artifacts` half of the pluggable adapter contract: input shape (a resolved lane's scope), output shape (a corpus of artifact references plus seed FILE nodes for the coverage graph), and the authority-agnostic guarantee that new authorities can implement `discover()` without engine changes.
- Plan how lane output feeds DISCOVER-state corpus seeding, referencing the coverage-graph seeding pattern already proven in deep-review's `upsert.cjs` (`.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs`).

### Out of Scope
- Implementing any adapter's real `discover()` logic — phase 005 (sk-doc), 006 (sk-git/sk-design), and 007 (sk-code) own each concrete implementation.
- The `standardSource(authority)` and `check(artifact,rules)` halves of the adapter contract for any specific authority — each adapter phase owns its own.
- Iteration, convergence, corpus partitioning, or report generation — phase 008 owns those.
- Command/agent/advisor cutover — phase 009 owns that.
- Any live file under `.opencode/skills/system-deep-loop/deep-alignment/` — this phase, like 003, is planning-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md` | Create (future) | The structured decision-tree spec, deferred to the implementation pass |
| `.opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md` | Create (future) | The `discover(scope)->artifacts` contract every adapter implements, deferred to the implementation pass |
| `.opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md` | Create (future) | The `--lane-config <file.json>` JSON schema (ADR-011 LOCKED: config-file-only), deferred to the implementation pass |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs` (or equivalent; final location follows ADR-010's shared-runtime convention) | Create (future) | Lane resolution + `--lane-config` parsing, deferred to the implementation pass and to phase 008's shared-runtime relocation convention (ADR-010, LOCKED) that settles the final `scripts/` directory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The scoping decision tree plan enumerates every value in all three axes and their allowed combinations. | `plan.md` §3 lists ARTIFACT-CLASS (docs/code/designs/git-history), AUTHORITY (sk-doc/sk-git/sk-design/sk-code, marked extensible), and SCOPE (paths/globs/branch-range), with a stated rule for which artifact-classes are valid per authority. |
| REQ-002 | The lane-resolution plan supports multiple authorities per single run. | `plan.md` §3 states the resolution algorithm produces a list of N `(authority, artifact-class, scope)` tuples from one interactive session, matching the "sk-code and sk-git and/or sk-design" multi-authority precedent from the design brief. |
| REQ-003 | The `discover(scope)->artifacts` contract plan is authority-agnostic: no authority name is hard-coded into the contract signature or the engine that calls it. | `plan.md` §3 states the contract input/output shape in authority-neutral terms and cites the "do NOT hard-wire only 4 [authorities]" design constraint. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The non-interactive `--lane-config` plan states its fallback relationship to the interactive question. | `plan.md` §3 states that when `--lane-config <file.json>` is supplied, the interactive question is skipped, and when absent, the interactive question runs — never both, never neither, per ADR-011's LOCKED config-file-only decision. |
| REQ-005 | The DISCOVER-state corpus seeding plan references the real coverage-graph seeding pattern. | `plan.md` §3 cites `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` as the seeding mechanism discovered artifacts feed into. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future implementation pass can build the interactive question, the non-interactive arg parser, and one authority's `discover()` stub against this contract without further design decisions about lane shape.
- **SC-002**: The plan supports resolving 1..N lanes from a single scoping session, with N unbounded by any hard-coded authority count.
- **SC-003**: No live file under `.opencode/skills/system-deep-loop/deep-alignment/` exists at the close of this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Adapter contract not yet frozen by 002-architecture-decision | This phase's `discover()` half could drift from the final contract | Restate the contract exactly as locked in the design brief; ADR-011 is now LOCKED (config-file-only), so only the JSON schema's field-level detail remains this phase's own design work |
| Risk | Lane explosion (too many authority x artifact-class x scope combinations per run) makes ITERATE-state partitioning unpredictable | Downstream phase 008 corpus partitioning becomes harder to plan | Plan a sane per-run lane cap and note it as a tunable, not a hard architectural limit |
| Risk | Interactive question and `--lane-config` form diverge in semantics | Headless/cron runs could resolve different lanes than an equivalent interactive session | Plan both paths to converge on the same internal lane-tuple representation before DISCOVER starts, per ADR-011's zero-information-loss constraint |
| Dependency | `upsert.cjs` coverage-graph seeding pattern | If its FILE-node shape changes, discovered-artifact seeding plan needs revision | Cite the real script and its current seeding contract, not an assumed shape |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Lane resolution (interactive or non-interactive) must complete before any DISCOVER-state work starts; it is a pure planning step with no artifact scanning of its own.

### Security
- **NFR-S01**: SCOPE values (paths/globs/branch-range) must be validated against the repo root before being handed to any adapter's `discover()`, so a malformed scope cannot escape the workspace.

### Reliability
- **NFR-R01**: Non-interactive lane args must be fully deterministic — the same argument string always resolves to the same lane set, with no dependency on session state, so cron runs are reproducible.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty scope (no paths/globs match): the lane still resolves, but `discover()` returns an empty artifact corpus and the lane is marked zero-coverage rather than erroring.
- Overlapping scopes across two lanes of different authorities: both lanes discover independently; the mode does not dedupe across authorities, since the same file can be conformance-checked against more than one standard.

### Error Scenarios
- Invalid AUTHORITY value in non-interactive args: fail fast before DISCOVER starts, with an error naming the unknown authority and the currently registered set.
- SCOPE glob matches zero files: treated as the empty-scope case above, not an error.

### State Transitions
- Interactive session abandoned mid-question: no lanes are persisted; SCOPE state has no partial-lane carryover.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two future files plus a scripted lane resolver; no live code touched in this phase |
| Risk | 8/25 | No production surface changed; contract-design risk only |
| Research | 14/20 | Requires the adapter contract, deep-review's scope-discovery precedent, and the coverage-graph seeding pattern |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None. ADR-011 in 002-architecture-decision is now LOCKED: config-file-only (`--lane-config <file.json>`, not repeated flags, not an inline JSON-array flag). This phase's own remaining design work is the concrete JSON schema's field-level detail (per-lane `{authority, artifactClass, scope}` keys and validation rules), designed alongside the interactive tree so both paths resolve to the same lane representation with zero information loss.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
