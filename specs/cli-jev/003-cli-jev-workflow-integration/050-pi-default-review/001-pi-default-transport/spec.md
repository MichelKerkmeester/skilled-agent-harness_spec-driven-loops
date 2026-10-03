---
title: "Feature Specification: Phase 1: Make Pi the default Jev transport when it is available"
description: "With no transport named, a Jev choice or noul call goes to Pi's classifier runtime when Pi can answer it, and to the jev CLI otherwise. The eight scorers under review call Jev through that transport."
trigger_phrases:
  - "pi default transport"
  - "jev transport auto"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: Make Pi the default Jev transport when it is available

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/001-pi-default-transport` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-feature-review-and-remeasure |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Make Pi the default Jev transport when available, then have a fresh Opus reviewer test, re-measure and fix nine features specification.

**Scope Boundary**: The items listed in scope below.

**Dependencies**:
- The Pi transport from 038 and its provider map from 049/009

**Deliverables**:
- `resolveTransport` returns an automatic route when neither the call option nor `JEV_TRANSPORT` names one. The automatic route tries Pi and falls back to the CLI with no skip line when a Pi preflight gate fails
- `JEV_TRANSPORT=jev` stays the kill switch to the CLI. `JEV_TRANSPORT=pi` keeps today's behavior: it asks for Pi and prints the one skip line when Pi cannot answer
- Pi answers `noul` as well as `choice`. The payload keeps the CLI's shape, `answers.answer.noul` as a probability, and an answer that cannot be read falls back to the CLI

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Pi transport answered with 95.1% agreement with the jev CLI in about half the p95 time, yet it runs only when a caller sets `JEV_TRANSPORT=pi`. Only two scorers, the leaf-route replay and the clarify default, call the transport at all, and it answers `choice` questions only. The other scorers spawn the jev CLI themselves, and five of the nine features under review ask `noul` questions.

### Purpose
When Pi is installed at the pinned version and holds a credential for the provider's classifier, Pi answers by default. Otherwise the CLI answers, as it does today. The operator can still force either route.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `resolveTransport` returns an automatic route when neither the call option nor `JEV_TRANSPORT` names one. The automatic route tries Pi and falls back to the CLI with no skip line when a Pi preflight gate fails
- `JEV_TRANSPORT=jev` stays the kill switch to the CLI. `JEV_TRANSPORT=pi` keeps today's behavior: it asks for Pi and prints the one skip line when Pi cannot answer
- Pi answers `noul` as well as `choice`. The payload keeps the CLI's shape, `answers.answer.noul` as a probability, and an answer that cannot be read falls back to the CLI
- Every outcome names the route that answered, `pi` or `jev`, so a scorer's call record can count them
- The eight scorers below call Jev through `spawnClassifierCall`, with their own auth gate and call records unchanged
- Each suite that stubs `jev` pins `JEV_TRANSPORT=jev` or a stub runtime, so no test reaches live Pi
- The transport docs and the cli-jev gate table describe the new default

### Out of Scope
- Turning any Jev feature on by default - each scorer still runs Jev only behind `--jev`, per 047 D6
- Scorers for killed or no-headroom features - they stay on the CLI, because nothing will run them again
- Reading the Typesafe key in code - the module never holds a credential. Pi reads it from its own store or the caller's environment
- The `score` and `run` subcommands - none of the nine features uses them

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Modify | Automatic route, noul mapping, route name on each outcome |
| `.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` | Modify | Cases for the automatic route, noul and the kill switch |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modify | 032 citation drift: Jev calls go through the transport (noul) |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | Modify | 035 injection screen: Jev calls go through the transport (noul) |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` | Modify | 025 verdict fallback: Jev calls go through the transport (choice) |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | Modify | 024 hallucination grader: Jev calls go through the transport (noul) |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | Modify | 017 search narrowing: Jev calls go through the transport (choice) |
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Modify | 026 completion claims: Jev calls go through the transport (noul) |
| `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` | Modify | 029 P0 reread order: Jev calls go through the transport (choice and noul) |
| `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` | Modify | 031 debug next check: Jev calls go through the transport (choice) |
| Each scorer's own test file | Modify | One routing case, and `JEV_TRANSPORT=jev` pinned where it stubs `jev` |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` | None | Checked, no change: it drives its own CLI and Pi arms and never calls the transport, so the default cannot blur it |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` and `score-clarify-default.test.cjs` | Modify | Pin `JEV_TRANSPORT=jev`, because their scorers already call the transport and now default to the automatic route |
| `.skilled/skills/cli-classifier/shared/scripts/README.md` | Modify | The new default |
| `.skilled/skills/cli-classifier/cli-jev/SKILL.md` | Modify | Gate table and transport section |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md` | Modify | The new default |
| `.skilled/skills/cli-classifier/feature-catalog/feature-catalog.md` | Modify | Index line for the entry above |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-integration.md` | Modify | A scenario for the automatic route and the kill switch |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | With no transport named and the Pi preflight passing, a `choice` and a `noul` call are answered by Pi | Stub-runtime tests: each outcome reads `transport: 'pi'` and carries the CLI's payload shape |
| REQ-002 | With no transport named and a Pi gate failing, the CLI answers and nothing extra prints | Tests for the package, version, model and credential gates: CLI outcome, `transport: 'jev'`, no skip line |
| REQ-003 | `JEV_TRANSPORT=jev` always reaches the CLI, and `JEV_TRANSPORT=pi` keeps its one skip line | The existing cases still pass, plus one case per value |
| REQ-004 | No test suite reaches live Pi | Each changed suite passes with `TYPESAFE_API_KEY` exported and with it unset |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-005 | The eight scorers route their Jev calls through the transport | One test per scorer shows a stubbed transport receives its call, and each scorer's existing suite passes at or above its baseline |
| REQ-006 | A live smoke matches the default | With `TYPESAFE_API_KEY` read per process from the Keychain, one `noul` and one `choice` call are answered by Pi. Without it, the same calls are answered by the CLI |
| REQ-007 | The docs describe the default | `validate_document.py` exits 0 on each changed doc |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Jev call with no transport named is answered by Pi when Pi can answer it, and by the CLI otherwise
- **SC-002**: The eight scorers and the transport suite pass at or above their baselines, and none reaches live Pi in a test
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Risk | A suite that inherits the operator's environment reaches live Pi | High | P0 requirement four: run each suite with the key set and unset |
| Risk | Pi's noul answer differs from the CLI's | Med | Phase 002 measures agreement per feature before any verdict changes |
| Dependency | Pi 0.99.2, the pinned version | Pi cannot answer | The CLI answers, as today |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator asked for Pi as the default transport when it is available on 2026-10-03
<!-- /ANCHOR:questions -->

---


