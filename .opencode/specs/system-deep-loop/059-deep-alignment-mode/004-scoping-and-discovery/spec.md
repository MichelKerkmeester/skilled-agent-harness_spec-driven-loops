---
title: "Feature Specification: Phase 4: scoping-and-discovery"
description: "Structured decision tree (ARTIFACT-CLASS x AUTHORITY x SCOPE), N-lane resolution, the non-interactive --lane-config arg form, and the per-adapter discover(scope)->artifacts contract -- specified AND built: references/scoping_protocol.md, references/discover_contract.md, references/lane_config_schema.md, and scripts/scoping.cjs all exist, cross-referenced, and manually verified (interactive/config-file lane-tuple parity confirmed byte-identical)."
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
    last_updated_at: "2026-07-11T14:19:08Z"
    last_updated_by: "claude"
    recent_action: "Independently re-verified the build; found phase 005 undisclosed here"
    next_safe_action: "Verify phase 005's complete claim, then begin phase 006"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-scoping-and-discovery"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Lane-config JSON shape: bare top-level array of {authority, artifactClass, scope}, no envelope/version wrapper"
      - "Authority-to-artifact-class v1 registry is 1:1, built as an extensible map in scoping.cjs"
      - "Interactive-path input is a selections array; resolveLanesFromSelections output matches resolveLanesFromConfig byte for byte"
status: "in_progress"
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
| **Status** | In Progress |
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

**Scope Boundary**: this phase specifies AND builds the SCOPE-state engine of the mode's state machine (INIT -> SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT -> optional REMEDIATE): the three-axis decision tree, lane resolution, the `--lane-config` non-interactive form, and the `discover(scope)->artifacts` contract those lanes feed into. Gate-flipped to execute-now by the orchestrator (2026-07-11): all four named deliverables — `references/scoping_protocol.md`, `references/discover_contract.md`, `references/lane_config_schema.md`, `scripts/scoping.cjs` — now exist on disk, cross-reference each other, and were manually verified (see `implementation-summary.md` Verification). It still does not implement any adapter's `discover()` **body** — phases 005-007 own each adapter's real logic behind this contract; this phase only builds the contract and the lane-resolution engine that calls into it.

**Dependencies**:
- Phase 003's scaffold plan (mode-registry entry, directory skeleton) exists — confirmed on disk (`deep-alignment/SKILL.md`, `assets/`, `references/`, `changelog/`, `behavior_benchmark/`) — so this phase's engine had somewhere real to live.
- The pluggable adapter contract `{ discover(scope)->artifacts, standardSource(authority)->templates+rules, check(artifact,rules)->findings }` is the locked design decision (ADR-003, Accepted) this phase's `discover()` half conforms to exactly — see `references/discover_contract.md`.
- Deep-review's own scope-discovery precedent (`.opencode/skills/system-deep-loop/deep-review/SKILL.md`, "Scope Boundary" framing used throughout its packet) informed the interactive-question UX shape, even though deep-review's scope is free-text where deep-alignment's is a structured decision tree.

**Deliverables**:
- A specified AND built structured decision tree over three axes: ARTIFACT-CLASS, AUTHORITY, SCOPE (`references/scoping_protocol.md`).
- A specified AND built lane-resolution algorithm producing N alignment lanes per run (`scripts/scoping.cjs`).
- A specified AND built non-interactive arg grammar for headless/cron invocation (`references/lane_config_schema.md`, `scripts/scoping.cjs`).
- A specified AND built `discover(scope) -> artifacts` contract every future adapter (005-007) must implement identically (`references/discover_contract.md`).

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-alignment` needs to resolve "what to check, against which standard, and where" before it can discover any artifact. Before this phase, nothing specified how that question gets asked interactively, how it degrades to a non-interactive form for unattended runs, or what contract the answer must satisfy so every per-authority adapter (sk-doc, sk-git, sk-design, sk-code) can discover artifacts the same way.

### Purpose
Specify AND build a structured, non-ambiguous scoping question and discovery contract so future adapter phases (005-007) can implement each authority's `discover()` body against a fixed shape with no open design questions left over.
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
- Build the four deliverables above as real files under `.opencode/skills/system-deep-loop/deep-alignment/` — in scope per the orchestrator's gate-flip (2026-07-11), clearing the "future implementation pass" framing this section originally described: `references/scoping_protocol.md`, `references/discover_contract.md`, `references/lane_config_schema.md`, `scripts/scoping.cjs`, all created, cross-referenced, and manually verified. See `tasks.md` Phase 2, now executed.

### Out of Scope
- Implementing any adapter's real `discover()` logic — phase 005 (sk-doc), 006 (sk-git/sk-design), and 007 (sk-code) own each concrete implementation.
- The `standardSource(authority)` and `check(artifact,rules)` halves of the adapter contract for any specific authority — each adapter phase owns its own.
- Iteration, convergence, corpus partitioning, or report generation — phase 008 owns those.
- Command/agent/advisor cutover — phase 009 owns that.
- Any adapter's real `discover()` implementation, or the loop/report wiring — those remain owned by phases 005-008 as stated above.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md` | Create | The structured decision-tree spec — created: three axes, lane-resolution algorithm, internal lane-tuple shape, interactive/non-interactive fallback rule, edge cases, NFRs |
| `.opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md` | Create | The `discover(scope)->artifacts` contract every adapter implements — created: signature, input/output shape, real `upsert.cjs`/`coverage-graph-db.ts` FILE-node citations, extensibility guarantee |
| `.opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md` | Create | The `--lane-config <file.json>` JSON schema (ADR-011 LOCKED: config-file-only) — created: bare-array top-level shape, per-lane fields, authority x artifact-class validity table, informative JSON Schema, worked example, error contract |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs` | Create | Lane resolution + `--lane-config` parsing (lives mode-local for now; phase 008's ADR-010 shared-runtime relocation may move it later, behavior-preserving) — created and manually verified: `resolveLanesFromConfig`, `resolveLanesFromSelections`, `parseLaneConfigFile`, `validateLane`, `validateScope`, CLI entrypoint |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The scoping decision tree plan enumerates every value in all three axes and their allowed combinations. | `plan.md` §3 and `references/scoping_protocol.md` §2 both list ARTIFACT-CLASS (docs/code/designs/git-history), AUTHORITY (sk-doc/sk-git/sk-design/sk-code, marked extensible), and SCOPE (paths/globs/branch-range), with the per-authority artifact-class validity rule implemented as `AUTHORITY_ARTIFACT_CLASSES` in `scripts/scoping.cjs` and restated in `references/lane_config_schema.md` §4. |
| REQ-002 | The lane-resolution plan supports multiple authorities per single run. | `references/scoping_protocol.md` §3 states the resolution algorithm produces a list of N `(authority, artifact-class, scope)` tuples from one interactive session, and `scripts/scoping.cjs`'s `resolveLanesFromSelections()` implements it — verified by a real run resolving 3 independent lanes (`sk-code`/`code`, `sk-git`/`git-history`, `sk-design`/`designs`) from one call, matching the "sk-code and sk-git and/or sk-design" multi-authority precedent from the design brief. |
| REQ-003 | The `discover(scope)->artifacts` contract plan is authority-agnostic: no authority name is hard-coded into the contract signature or the engine that calls it. | `references/discover_contract.md` §2 states the signature `discover(scope) -> artifacts` carries exactly one parameter and cites the "do NOT hard-wire only 4 [authorities]" design constraint in §6. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The non-interactive `--lane-config` plan states its fallback relationship to the interactive question. | `references/scoping_protocol.md` §6 states that when `--lane-config <file.json>` is supplied, the interactive question is skipped, and when absent, the interactive question is the only path — never both, never neither, per ADR-011's LOCKED config-file-only decision. `scripts/scoping.cjs`'s CLI entrypoint enforces this: it exits non-zero naming `--lane-config` as required when the flag is absent, with no code fallback that guesses lanes. |
| REQ-005 | The DISCOVER-state corpus seeding plan references the real coverage-graph seeding pattern. | `references/discover_contract.md` §4.2 cites `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:204-238` and `.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:19-93` for the exact `FILE`-kind `CoverageNode` shape and the `--seed-source`/`--seed-confidence` seeding call the discovered-artifact nodes feed into. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Met.** A future implementation pass can build the interactive question, the non-interactive arg parser, and one authority's `discover()` stub against this contract without further design decisions about lane shape — phase 005 can `require('../../deep-alignment/scripts/scoping.cjs')` directly and read `references/discover_contract.md` for the exact `discover()` stub shape.
- **SC-002**: **Met, verified.** The plan supports resolving 1..N lanes from a single scoping session, with N unbounded by any hard-coded authority count — confirmed by a real 3-lane, 3-authority resolution in one call (see `implementation-summary.md` Verification), and `scripts/scoping.cjs` enforces no lane-count ceiling.
- **SC-003**: **Superseded 2026-07-11.** The original criterion read "No live file under `.opencode/skills/system-deep-loop/deep-alignment/` exists at the close of this phase" — written when this phase was planning-only. The orchestrator gate-flipped this phase to execute-now (2026-07-11); the four named deliverables now existing on disk is the success condition, not a violation of it. Corrected criterion: the four files named in §3 Files to Change exist, are internally cross-referenced, and were manually verified — **Met**, see `implementation-summary.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Adapter contract not yet frozen by 002-architecture-decision | This phase's `discover()` half could drift from the final contract | **Resolved.** 002-architecture-decision is Accepted (operator-approved 2026-07-11, all 12 ADRs Accepted); `references/discover_contract.md` restates ADR-003's exact signature. |
| Risk | Lane explosion (too many authority x artifact-class x scope combinations per run) makes ITERATE-state partitioning unpredictable | Downstream phase 008 corpus partitioning becomes harder to plan | `scripts/scoping.cjs` deliberately enforces no lane-count ceiling, consistent with this mitigation's own "tunable, not hard architectural limit" framing — a cap, if ever adopted, is phase 008's own corpus-partitioning concern. |
| Risk | Interactive question and `--lane-config` form diverge in semantics | Headless/cron runs could resolve different lanes than an equivalent interactive session | **Verified, not just planned.** `scripts/scoping.cjs`'s `resolveLanesFromSelections()` and `resolveLanesFromConfig()` both funnel through the same `validateLane()`/`validateScope()`; a real parity test (equivalent 3-lane input via both paths) produced byte-identical `JSON.stringify` output. |
| Dependency | `upsert.cjs` coverage-graph seeding pattern | If its FILE-node shape changes, discovered-artifact seeding plan needs revision | **Cited precisely.** `references/discover_contract.md` §4.2 cites `runtime/scripts/upsert.cjs:204-238` and `runtime/lib/coverage-graph/coverage-graph-db.ts:19-93` for the real, current FILE-node shape and seeding call, not an assumed shape. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Lane resolution (interactive or non-interactive) must complete before any DISCOVER-state work starts; it is a pure planning step with no artifact scanning of its own. **Met**: `scripts/scoping.cjs` performs no filesystem scanning beyond reading the `--lane-config` file itself.

### Security
- **NFR-S01**: SCOPE values (paths/globs/branch-range) must be validated against the repo root before being handed to any adapter's `discover()`, so a malformed scope cannot escape the workspace. **Met, verified**: `validateScope()` calls `runtime/scripts/lib/cli-guards.cjs`'s `validateNamespaceValue()` on every `paths`/`globs` entry; a manual path-traversal test (`../../etc/passwd`) was rejected with exit code 3.

### Reliability
- **NFR-R01**: Non-interactive lane args must be fully deterministic — the same argument string always resolves to the same lane set, with no dependency on session state, so cron runs are reproducible. **Met**: `resolveLanesFromConfig()` is a pure function with no clock, session, or filesystem dependency beyond the one file it is given.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty scope (no paths/globs match): the lane still resolves, but `discover()` returns an empty artifact corpus and the lane is marked zero-coverage rather than erroring.
- Overlapping scopes across two lanes of different authorities: both lanes discover independently; the mode does not dedupe across authorities, since the same file can be conformance-checked against more than one standard.
- Empty `--lane-config` array (`[]`): resolves to zero lanes, not an error — verified manually, `scripts/scoping.cjs` returns `{"status":"ok","lanes":[]}`.

### Error Scenarios
- Invalid AUTHORITY value in non-interactive args: fail fast before DISCOVER starts, with an error naming the unknown authority and the currently registered set. **Verified**: `scripts/scoping.cjs` exits 3 with `lanes[0].authority "sk-nope" is not a registered authority. Registered authorities: sk-doc, sk-git, sk-design, sk-code`.
- SCOPE glob matches zero files: treated as the empty-scope case above, not an error.
- AUTHORITY paired with an artifact-class it does not support (e.g. `sk-git` + `docs`): fails fast, naming both values and the authority's actual supported class(es). **Verified**: exit 3 with `authority "sk-git" does not support artifactClass "docs". Supported: git-history`.

### State Transitions
- Interactive session abandoned mid-question: no lanes are persisted; SCOPE state has no partial-lane carryover.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Three reference docs plus a scripted lane resolver; no other live code touched in this phase |
| Risk | 8/25 | No production surface outside `deep-alignment/` changed; contract-design risk only |
| Research | 14/20 | Required the adapter contract, deep-review's scope-discovery precedent, and the coverage-graph seeding pattern |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None remaining for this phase's own scope. ADR-011 in 002-architecture-decision is LOCKED: config-file-only (`--lane-config <file.json>`, not repeated flags, not an inline JSON-array flag). This phase's own remaining design work — the concrete JSON schema's field-level detail — is now written in `references/lane_config_schema.md`: a bare top-level JSON array of `{authority, artifactClass, scope}` lane objects, no envelope/version wrapper, designed alongside the interactive tree so both paths resolve to the same lane representation with zero information loss (verified — see §5 SC-002 and `implementation-summary.md`).

One item is intentionally deferred, not open: `scripts/scoping.cjs` has no committed Vitest suite yet (see `implementation-summary.md` Known Limitations) — confirmed still true by an independent re-check (no `.test.cjs`/`.spec.*` file exists anywhere under `deep-alignment/`), even though this exact package already ships a working Vitest setup (`runtime/package.json`'s `test` script) and a sibling-file test convention is already established elsewhere in this skill (`deep-research/scripts/reduce-state-sparkline.test.cjs` and others) — the tooling to close this gap already exists in-repo, it simply was not used in this pass. This did not block phase 005 in practice: phase 005 (sk-doc adapter) was built concurrently during this phase's own session and now self-reports complete, independently confirmed live against the real `discover_contract.md` shape in this review pass (see `implementation-summary.md` Verification). Separately: phase 005's own three declared files live inside this phase's scope-locked directories, undisclosed in this phase's own docs until this review pass — see `implementation-summary.md` Known Limitations item 5.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
