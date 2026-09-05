---
title: "Feature Specification: Phase 5: hook-fallback-failure-signal"
description: "Codex and Devin wrap every hook adapter as `node <adapter> || printf fallback`, so an adapter crash still returns a successful hook response; Codex's Stop cleanup chains an unconditional true that makes its own fallback unreachable; the Copilot wrappers always take the fallback because their compiled handlers do not exist."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: hook-fallback-failure-signal

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 7 |
| **Predecessor** | `../004-save-and-resume-freshness/spec.md` |
| **Successor** | `../006-orphaned-types-and-dead-modules/spec.md` |
| **Handoff Criteria** | A drift marker reaches the doctor route for a synthetic adapter failure, the Codex Stop cleanup's diagnostic branch is reachable, the Copilot wrapper decision is recorded and implemented, and a parity test proves every registered adapter path resolves |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the decommission debt fixes specification.

**Scope Boundary**: `.codex/hooks.json`, `.devin/hooks.v1.json`, `.github/hooks/scripts/*.sh`, and whatever doctor route is chosen to surface the new drift marker. No change to the Claude, Cursor, Pi, or OpenCode hook registrations - their fallback shape is not part of this problem statement.

**Dependencies**:
- None on the other six phases.

**Deliverables**:
- A machine-detectable drift marker in the Codex/Devin fallback payload plus a structured stderr line.
- A doctor route that surfaces the marker.
- Codex's Stop-cleanup unreachable-fallback fixed.
- A recorded, implemented decision on the Copilot wrappers (build the missing adapters, or remove the wrappers).
- A parity test asserting every registered adapter path resolves on disk.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.codex/hooks.json` wraps every registered adapter as `node <adapter> || printf %s '{"hookSpecificOutput":{...,"additionalContext":"mk codex hook could not resolve; re-run the codex hooks installer with --check"}}'` (for example lines 8, 13, 18, 27, 33, 40, 48, 56, 64, 72). If `node <adapter>` fails - a bad exit code, a thrown exception, a missing compiled file - the `||` still returns success to the host, because `printf` itself succeeds; the host sees a completed hook either way, and the only signal that something is wrong is a human reading the `additionalContext` text, which nothing currently checks or surfaces proactively. `.devin/hooks.v1.json` does the same for its own adapters. `.codex/hooks.json:140` compounds this on the Stop-event cleanup specifically: `bash .opencode/scripts/session-cleanup.sh >/dev/null 2>&1 || true || printf %s "{...}"` - because `true` always exits 0, the trailing `|| printf` branch can never run under any input, so that diagnostic message is dead code regardless of whether cleanup actually failed. Separately, `.github/hooks/scripts/session-start.sh` and `.github/hooks/scripts/user-prompt-submitted.sh` check for `.opencode/skills/system-spec-kit/runtime/dist/hooks/copilot/{session-prime,user-prompt-submit}.js` before delegating to them; neither compiled file exists, and no `runtime/hooks/copilot/` source directory exists either, so these two wrappers always take their static fallback branch (a fixed "Session context received... Code Graph: unavailable" message, and an empty `{}` JSON object respectively) - correctly non-mutating today, but permanently inert rather than temporarily degraded.

### Purpose
An adapter failure on Codex or Devin produces a machine-detectable drift signal - not just prose a human might miss - the Codex Stop-cleanup diagnostic branch becomes reachable, the Copilot wrappers' fate (build the adapters or remove the wrappers) is decided and implemented rather than left permanently inert, and a parity test proves every currently-registered adapter path resolves on disk.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep the existing host contract that a hook command must always return a well-formed response - do not make a Codex or Devin hook exit non-zero, since neither host's hook contract is being renegotiated here.
- Add a machine-detectable drift marker to the fallback JSON payload (e.g. an additional field the doctor route can grep or parse, distinct from the free-text `additionalContext`) for every `|| printf` fallback in `.codex/hooks.json` and `.devin/hooks.v1.json`.
- Add a structured stderr line from the wrapping `bash -c` command when the primary `node <adapter>` invocation fails, so the failure is visible in any log capture that already collects stderr, independent of whether the JSON payload is parsed.
- Fix `.codex/hooks.json:140`'s Stop-cleanup chain so a `session-cleanup.sh` failure can actually reach the diagnostic fallback, without changing the overall best-effort semantics (cleanup failure still must not fail the Stop hook itself).
- Route the new drift marker into a doctor asset (`.opencode/commands/doctor/assets/doctor-*.yaml` or a new one) so `/doctor` can report "N hook adapters degraded to fallback in the last session" or similar, rather than requiring a human to read hook output by hand.
- Decide the Copilot wrappers' fate: build `runtime/hooks/copilot/{session-prime,user-prompt-submit}.ts` and wire them into the runtime's build output, or remove `.github/hooks/scripts/*.sh` and their registration entirely. Implement whichever is decided.
- Add a parity test (new, since `runtime/tests/hooks-reexport-parity.vitest.ts` checks function re-export identity, not path resolution) asserting every path a registered hook command references - across Claude, Codex, Cursor, Devin, Pi, OpenCode, and Copilot (if kept) - resolves to a file that exists on disk after a build.

### Out of Scope
- Renegotiating any host's hook response contract (exit codes, timeout values, matcher shapes) - only the fallback's payload and observability change.
- Claude's, Cursor's, Pi's, and OpenCode's hook registrations - their session-cleanup pattern (`.claude/settings.json:163`: `... || true` with no `printf` fallback at all) is a different, narrower shape not covered by this problem statement.
- Building a general hook-health dashboard beyond the doctor route this phase adds.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.codex/hooks.json` | Modify | Add the drift marker and structured stderr to every `|| printf` fallback; fix the Stop-cleanup unreachable branch at line 140 |
| `.devin/hooks.v1.json` | Modify | Add the drift marker and structured stderr to every `|| printf` fallback |
| `.github/hooks/scripts/session-start.sh`, `user-prompt-submitted.sh` | Modify or Delete | Per the Copilot decision: wire to real compiled handlers, or remove |
| `.opencode/skills/system-spec-kit/runtime/hooks/copilot/` | Create (if kept) | The missing source adapters, if the decision is to build them |
| `.opencode/commands/doctor/assets/` (existing or new asset) | Modify or Create | Surface the drift marker |
| A hook-adapter parity test (new, under `runtime/tests/` or `scripts/tests/`) | Create | Every registered path resolves on disk |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every `|| printf` fallback in `.codex/hooks.json` and `.devin/hooks.v1.json` carries a machine-detectable drift marker distinct from the free-text `additionalContext`, without changing the host-facing success contract |
| REQ-002 | `.codex/hooks.json`'s Stop-cleanup chain (line 140) is restructured so its diagnostic fallback is reachable on a real `session-cleanup.sh` failure, while a cleanup failure still cannot fail the Stop hook itself |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A doctor route surfaces the drift marker so an operator can see degraded-adapter history without reading raw hook JSON |
| REQ-004 | The Copilot wrappers' fate is decided and implemented - either real compiled adapters exist and are wired in, or the wrappers and their registration are removed |
| REQ-005 | A parity test asserts every path referenced by a registered hook command (across every runtime whose registration this phase does not explicitly exclude) resolves to an existing file after a build |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A synthetic adapter failure (e.g. temporarily renaming a compiled hook file) produces a drift marker in the fallback JSON and a structured line on stderr, both distinguishable from a normal successful run.
- **SC-002**: A synthetic `session-cleanup.sh` failure on Codex reaches the diagnostic fallback branch instead of being swallowed by `|| true`.
- **SC-003**: The doctor route added or extended in this phase reports the synthetic failure from SC-001 in its output.
- **SC-004**: The parity test fails when a registered hook path is deliberately broken (e.g. a renamed file) and passes on the current, correct state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Changing the fallback payload shape could break a host that parses the JSON strictly (e.g. a schema check on `hookSpecificOutput`) | Med | Add the drift marker as an additional field, never remove or rename an existing one; verify against each host's own hook-response schema if documented |
| Risk | Building the Copilot adapters is a larger effort than removing the wrappers, and may not be worth it if Copilot hook usage is low | Low-Med | This phase records the decision with its blast-radius comparison (grep counts for the two options) so the operator can choose with evidence, rather than defaulting silently |
| Dependency | The doctor route's existing asset schema (`.opencode/commands/doctor/assets/*.yaml`) - the drift marker must fit whatever shape that route already expects | Low | Read one existing doctor asset before authoring the new/extended route |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The drift-marker addition adds no more than a few bytes to the fallback JSON and one `printf` invocation to stderr - no measurable latency change to hook execution.
- **NFR-P02**: The parity test runs in well under a second per registered path (a `fs.existsSync` check, not a build).

### Security
- **NFR-S01**: The structured stderr line never includes credentials or full command-line arguments beyond the adapter name.
- **NFR-S02**: No change to any hook's execution privileges or matcher scope.

### Reliability
- **NFR-R01**: The Stop-cleanup fix must not turn a `session-cleanup.sh` failure into a Stop-hook failure - the host must still receive a well-formed response.
- **NFR-R02**: If the Copilot decision is "remove", the removal must not leave a dangling registration in `.github/hooks/` or any doctor asset that still expects it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a hook invoked with no stdin (where the adapter expects JSON) must still produce a well-formed fallback if it fails, drift marker included.
- Maximum length: the drift marker is a small fixed field (e.g. a boolean or short enum), not a growing log - no length concern.
- Invalid format: a compiled adapter that exists but throws mid-execution (not just "file missing") must also trigger the drift marker - the marker keys off `node <adapter>`'s exit code, not file existence alone.

### Error Scenarios
- External service failure: not applicable - hooks run locally.
- Network timeout: not applicable.
- Concurrent access: two hook invocations in the same session (e.g. SessionStart firing twice) each independently report their own drift marker; no shared state to race on.

### State Transitions
- Partial completion: a hook that partially writes output before failing must still produce the fallback's well-formed JSON on its final line - the drift marker addition does not change this ordering.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Two hook-config files, one doctor route, one decision-plus-implementation for Copilot, one new parity test |
| Risk | 8/25 | Host-facing JSON shape changes carry real but bounded risk; the Copilot decision has a real but scoped effort delta between its two options |
| Research | 3/20 | Both hook configs' exact fallback chains and the Copilot wrapper's dead-end were confirmed by direct source reading before this spec was written |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Build the Copilot adapters or remove the wrappers? This spec does not pre-decide it; REQ-004 requires the decision be made and implemented, with the blast-radius comparison from Risks informing the choice.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
