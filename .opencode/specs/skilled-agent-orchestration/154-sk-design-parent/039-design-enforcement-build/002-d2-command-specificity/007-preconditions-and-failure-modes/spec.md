---
title: "Feature Specification: D2-R7 — Preconditions & named failure modes for /design:*"
description: "The /design:* command layer declared no required input, readiness condition, or named failure route, so a missing target collapsed to a status-only failure; this phase adds a reconciled, body-enforced preconditions contract and a named Return-Status grammar."
trigger_phrases:
  - "d2-r7 preconditions failure modes"
  - "design command preconditions spec"
  - "named failure grammar command layer spec"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/007-preconditions-and-failure-modes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgrade spec to Level 2; record named-failure grammar and preconditions/accepts reconciliation"
    next_safe_action: "Run D2-R8 register-pinning phase for the /design surface"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r7-preconditions-and-failure-modes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D2-R7 — Preconditions & named failure modes for /design:*

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each `/design:*` wrapper declared no required input kind, no tool-readiness condition, and no named failure route (evidence: `commands/design/md-generator.md:26`). When a required URL, target, or component was missing, the command collapsed to a byte-generic `STATUS=FAIL ERROR="<message>"` tail: a status-only failure that named neither a cause nor a route. The packet body that owns the readiness and failure detail (`design-md-generator/SKILL.md:354`) was never projected to the command layer, so a missing input failed silently and unstructured.

### Purpose
Name, per `/design:*` command, the input the command requires and what it does when that input is missing or it cannot run. The authoritative content lives in the `command-metadata.json` SSOT as a new `preconditions{requiredInputKind, missingInputQuestion, cannotRunWhen, escalateIf, routeInstead}` object, projected into each wrapper as a `## 3. PRECONDITIONS` section and an upgraded named Return-Status grammar, and enforced by `design-command-surface-check.mjs`. A missing input asks (`STATUS=ASK MISSING=<input>`), an unmet precondition fails closed with a named cause (`STATUS=FAIL ERROR=<named-cause>`), and a wrong-command case routes (`STATUS=DEFER ROUTE=<target>`), replacing the silent status-only placeholder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `preconditions{requiredInputKind, missingInputQuestion, cannotRunWhen, escalateIf, routeInstead}` to all five `command-metadata.json` records, each sub-field a non-empty string
- Project a `## 3. PRECONDITIONS` body section (Requires / Ask-first / Cannot-run / Escalate / Route instead) into each of the five wrappers, and upgrade the Return-Status step to the named grammar
- Extend `design-command-surface-check.mjs` additively: Stage 1 `preconditions` presence + sub-field non-emptiness, Stage 2 body markers + status-only-failure ban + named-route token requirement

### Out of Scope
- Wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) — owned by prior D2 work and held byte-stable
- The prior D2 surfaces (`discriminator`, `outputContract`, `examples`) — preserved verbatim, layered under
- Runtime enforcement of the named statuses at invocation time — the gate verifies declaration, not execution
- Any taste or design-quality judgment — this is a deterministic command-surface gate only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Add `preconditions` block to all five records |
| `.opencode/commands/design/audit.md` | Modify | Add `## 3. PRECONDITIONS` section + named Return-Status grammar |
| `.opencode/commands/design/foundations.md` | Modify | Same projected section + named grammar for `foundations` |
| `.opencode/commands/design/interface.md` | Modify | Same projected section + named grammar for `interface` |
| `.opencode/commands/design/md-generator.md` | Modify | Same projected section + named grammar for `md-generator` |
| `.opencode/commands/design/motion.md` | Modify | Same projected section + named grammar for `motion` |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Additive Stage 1 shape + Stage 2 body / status-only-failure ban |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preconditions present per command | All five records carry a well-formed `preconditions` with five non-empty string sub-fields; checker requires it |
| REQ-002 | Named failure grammar replaces status-only failure | No wrapper retains `ERROR="<message>"`; every failure path uses `STATUS=ASK MISSING=` / `STATUS=FAIL ERROR=<named-cause>` / `STATUS=DEFER ROUTE=` |
| REQ-003 | Wrapper body mirrors metadata | Each wrapper carries the `## 3. PRECONDITIONS` section with the four markers Requires / Ask-first / Cannot-run / Escalate |
| REQ-004 | Surface check passes | `design-command-surface-check.mjs` returns STATUS=PASS, invalid=0, drift=0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Preconditions reconciled with accepts/argumentHint/deferToHubWhen | Each `requiredInputKind` / `missingInputQuestion` / `routeInstead` stays consistent with the same record's existing `accepts` / `argumentHint` / `deferToHubWhen` |
| REQ-006 | No frontmatter regression | Prior D2 frontmatter parity (`description`, `argument-hint`, `allowed-tools`) preserved; frontmatter drift channel stays 0 |
| REQ-007 | Gate bites on a broken precondition | An empty `preconditions` sub-field flips the checker to STATUS=INVALID with a named message |
| REQ-008 | Evergreen artifacts | No spec/packet/phase ID or spec path introduced into any of the seven output files; `mode-registry.json` byte-unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every `/design:*` command states its required input and its named failure behavior; a missing input asks, an unmet precondition fails closed with a named cause, and a wrong-command case routes — the silent `ERROR="<message>"` placeholder is gone from all five wrappers
- **SC-002**: `design-command-surface-check.mjs` reports STATUS=PASS, invalid=0, drift=0 with the prior D2 parity (discriminator, outputContract, examples, frontmatter) intact; an empty sub-field flips it to STATUS=INVALID; `node --check` exits 0; `mode-registry.json` is byte-unchanged
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | D2-R3 (command-metadata SSOT + checker) | Landed | `command-metadata.json` and the checker are the surfaces this phase extends |
| Dependency | D2-R5 / D2-R6 (outputContract, examples, discriminator) | Landed | Preserved verbatim; `preconditions` layers on without touching them |
| Dependency | `mode-registry.json` (workflowModes) | Read-only | Identity source; verified byte-stable after the build |
| Risk | Precondition strings drift from the argument grammar | Low | Authoring rule reconciles each sub-field with `accepts` / `argumentHint` / `deferToHubWhen`; checklist verifies it (REQ-005) |
| Risk | Body-presence check too brittle | Low | The check matches the four markers + named tokens only, not prose; wording stays advisory |
| Risk | Named grammar mistaken for runtime enforcement | Low | The gate verifies declaration at the command surface; runtime honoring of the statuses is flagged as the caller's job |

### Named-failure grammar (replaces the bare ERROR placeholder)

The prior `STATUS=FAIL ERROR="<message>"` tail was a status-only failure: it returned a failure with neither a named cause nor a route. This phase replaces it with a four-token grammar — `STATUS=OK`, `STATUS=ASK MISSING=<input>`, `STATUS=FAIL ERROR=<named-cause>`, and `STATUS=DEFER ROUTE=<target>` — and the checker bans the bare placeholder in Stage 2 while requiring the named-route tokens. A wrapper that re-introduces `ERROR="<message>"` or drops a named token is reported as drift.

### Preconditions ↔ accepts reconciliation

The `preconditions` strings are authored, not derived literals, but each must stay consistent with the same record's existing SSOT fields: `requiredInputKind` with `accepts` (the input kind), `missingInputQuestion` with `argumentHint` (the tokens the question asks for), and `routeInstead` with `deferToHubWhen` (the deferral condition). The checker enforces presence and non-emptiness deterministically; the cross-field consistency is an authoring rule verified in the checklist (REQ-005, CHK-003).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: `mode-registry.json` and the wrappers are read-only to the checker (`readFile` only); the registry is verified byte-unchanged, keeping the identity source authoritative and un-mutated

### Maintainability
- **NFR-M01**: The wrapper PRECONDITIONS section is a projection of the SSOT `preconditions`; the body-presence check keeps the projection honest without authoring prose in the wrapper

### Reliability
- **NFR-R01**: The change is additive — every prior frontmatter parity, discriminator, outputContract, and example check still passes (drift=0), so the preconditions contract layers on without regressing the existing gate
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A record missing `preconditions`: checker reports STATUS=INVALID at the metadata stage
- A `preconditions` sub-field set to an empty string (e.g. `cannotRunWhen`): rejected with `preconditions.cannotRunWhen must be a non-empty string`
- A `routeInstead` that contradicts `deferToHubWhen`: caught by the authoring reconciliation rule (REQ-005)

### Error Scenarios
- A wrapper retaining `ERROR="<message>"`: reported as drift on the `preconditions` channel (status-only-failure ban)
- A wrapper missing a Requires / Ask-first / Cannot-run / Escalate marker or a named-route token: `drift>0`

### State Transitions
- Preconditions added to metadata but wrapper section absent: the body channel reports drift until the wrapper mirrors the SSOT (the correct mid-build state, identical to the D2-R3 pattern)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Seven files: metadata SSOT, five wrappers, one checker; no mode logic touched |
| Risk | 6/25 | Additive validation; reversible per file; frontmatter + prior D2 fields held stable |
| Research | 5/20 | Precondition lines derived from the child readiness / failure blocks already in the packets |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Runtime honoring of the named statuses (out of this phase).** This phase makes each command *declare* its preconditions and named failure routes at the command surface and gates that declaration deterministically. It does not execute the commands, so whether a runtime actually emits `STATUS=ASK` on a missing input, fails closed on `STATUS=FAIL ERROR=<cause>`, or routes on `STATUS=DEFER` is the caller's responsibility, verified by the runtime's own tests rather than this surface gate. No blocker for this phase.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification addendum (NFR, edge cases, complexity)
- Per-command preconditions{requiredInputKind,missingInputQuestion,cannotRunWhen,escalateIf,routeInstead} + PRECONDITIONS wrapper section + named Return-Status grammar + additive surface-check gate
- Named grammar replaces the bare ERROR placeholder; preconditions reconciled with accepts/argumentHint/deferToHubWhen; surface-check PASS invalid=0 drift=0
-->
