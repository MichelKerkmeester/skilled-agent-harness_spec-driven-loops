---
title: "Feature Specification: Phase 3: deep-loop executor support for cli-hermes"
description: "Add cli-hermes as the eighth executor kind in the deep-loop runtime with a fail-closed dispatch builder, a two-id roster, audit and dispatch-audit coverage, and unit tests, so /deep:research and /deep:review lineages can run on Hermes."
trigger_phrases:
  - "cli-hermes executor kind"
  - "buildHermesLineageCommand"
  - "hermes fan-out lineage"
  - "hermes supported models"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: deep-loop executor support for cli-hermes

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The deep-loop runtime gains `cli-hermes` as an executor kind whose builder emits Hermes's quiet oneshot chat with the prompt on stdin, refuses an absent binary or an off-roster model before any spawn, and keeps every guard the six existing kinds have. Code and tests landed on 2026-09-14; the one live lineage waits on the provider the operator configures in phase 002.

**Key Decisions**: prompt on stdin through `--query-file -`; no `configDir` support until a seeded-credential profile contract exists; the run budget sits one margin under the lineage timeout.

**Critical Dependencies**: phase 002's live contract for the argv claims; a configured `llmgateway` provider for the live lineage.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete — code, tests and one live lineage 2026-09-14 |
| **Created** | 2026-09-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 9 |
| **Predecessor** | 002-hermes-contract-pin |
| **Successor** | 004-cli-hermes-skill-packet |
| **Handoff Criteria** | `EXECUTOR_KINDS` includes `cli-hermes`, the builder is unit-tested, typecheck and existing suites stay green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the cli-hermes creation packet; its durable directive and closure criteria are in `goal.md`, derived from the phase 001 synthesis and confirmed by the operator on 2026-09-14.

**Scope Boundary**: Add `cli-hermes` as the seventh CLI executor kind with a fail-closed builder, roster, env and audit maps, dispatch-audit row and tests; no skill packet or dotfolder work.

**Dependencies**:
- Phase 002's live contract for every argv claim; the executor tables and the hub registry are coupled by a manifest-integrity test, so phase 004's registration landed in the same change set

**Deliverables**:
- `executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`, `dispatch-audit.mjs`, `dispatch-rule-checks.mjs` and their tests extended; one live single-iteration lineage on a scratch folder (pending)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/deep:research` and `/deep:review` could dispatch to six CLI kinds but not to Hermes, and nothing in the runtime knew Hermes's dispatch shape, its self-invocation markers or its roster. A lineage asked for `--executor=cli-hermes` failed at schema validation.

### Purpose
A Hermes lineage builds, runs under the same containment and recursion guards as the others, and is refused before any spawn when the binary is missing or the model is off the roster.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The seventh CLI executor kind in the runtime tables: flag support, preventive-sandbox map, web-search matrix, roster and allowlist predicate.
- `buildHermesLineageCommand` and its byte-mirrored allowlist in the runner; binary probe; adapter map; exports.
- Audit maps: binary, session env, state env, default home, env prefixes; not self-presence exempt.
- Dispatch audit and rule checks: `hermes chat` recognized as a dispatch; one implemented check per hard rule the packet declares.
- Tests: kinds, fields, matrices, roster, mirror parity, adapter shape, dispatch-audit shapes, rule checks; a Hermes subject in the frozen stress matrix.
- The executor enumerations in the research and review command contracts, recompiled.

### Out of Scope
- The skill packet and hub registration - phase 004 (landed together because a test couples them)
- The repo-root `.hermes/` folder, the plugin, the playbook - later phases
- A Hermes shim and adapter suite for the stress matrix - the playbook phase
- The AI-council seat allowlist and the model-benchmark grader executor list - separate features with their own allowlists

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Kind, flag support, sandbox map, web-search matrix, roster, predicate |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Binary, session env, state env, home dir, env prefixes |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | State-env map, allowlist mirror, builder, adapter map, binary probe, exports |
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs`, `dispatch-rule-checks.mjs` | Modify | Hermes dispatch shape; seven Hermes checks |
| `runtime/tests/unit/*.vitest.ts`, `runtime/tests/stress/cli-adapter/matrix-manifest.ts`, `cli-codex.vitest.ts`, `.opencode/hooks/dispatch/lib/*.test.mjs` | Modify | Tests |
| `.opencode/commands/deep/assets/deep-research-presentation.txt`, `deep-review-presentation.txt`, `assets/compiled/*.contract.md`, `system-deep-loop/deep-review/SKILL.md` | Modify | Executor enumerations; contracts recompiled |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Typecheck and the deep-loop unit suites pass with the seventh kind |
| REQ-002 | An off-roster model and a missing `hermes` binary are refused before any spawn |
| REQ-003 | The builder's argv matches the confirmed dispatch shape for both roster ids |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | One live `cli-hermes` research iteration on a scratch folder lands its iteration file, delta and state record |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm run typecheck` exits 0 and the five affected test files pass with no regression against the 277-test baseline.
- **SC-002**: The Hermes adapter tests prove refusal on a missing binary, an off-roster id, `auto` and a provider-prefixed id, and assert the exact argv.
- **SC-003**: A live lineage completes (met 2026-09-14: `hermes-proof`, exit 0, full artifact set).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Configured `llmgateway` provider | The live lineage cannot run | Phase 002 operator step; every argv claim is test-asserted meanwhile |
| Risk | Run-budget expiry exits 0 with a partial answer | A truncated iteration reads as success | Budget one margin under the timeout; the runner validates artifacts, not exit codes alone |
| Risk | `HERMES_HOME` relocation drops credentials | A per-lineage home would log out | `configDir` unsupported; shared home plus `--ignore-rules` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The builder adds no spawn beyond the `command -v` probe the sibling kinds already pay.

### Security
- **NFR-S01**: Only `HERMES_` and `LLMGATEWAY_` prefixed variables pass to a lineage beyond the common allowlist; no secret appears in argv.

### Reliability
- **NFR-R01**: A missing binary or off-roster model fails closed at construction, never at dispatch.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an omitted model resolves to the roster default; an omitted timeout resolves to 900 seconds.
- Maximum length: the prompt travels on stdin, so the argv limit does not apply.

### Error Scenarios
- External service failure: the runner treats exit 1 as failure and re-dispatches once.
- Network timeout: the run budget expires inside Hermes before the runner's kill.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 14, LOC: about 400, Systems: runtime, hooks, command contracts |
| Risk | 10/25 | Shared executor tables every fan-out reads |
| Research | 5/20 | Contract settled in phase 001 |
| Multi-Agent | 3/15 | None |
| Coordination | 8/15 | Coupled to phase 004 by a test |
| **Total** | **38/100** | **Level 3** (parent-inherited) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A source-read flag behaves differently live | M | M | Phase 002 smoke; tests pin the argv so a correction is one edit |

---

## 11. USER STORIES

### US-001: Fan-out on Hermes (Priority: P0)

**As a** deep-loop operator, **I want** `--executor=cli-hermes` accepted and built correctly, **so that** research and review lineages can run on Hermes-hosted models.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Fail closed (Priority: P0)

**As a** deep-loop operator, **I want** a missing binary or off-roster model refused before any spawn, **so that** a misconfigured lineage never runs unconfined.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Does `chat -Q` emit any parseable stderr marker on run-budget expiry? Phase 002 records it.
- Should a seeded `cli-hermes-fanout` profile enable `configDir` later? Deferred hardening.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`

---
