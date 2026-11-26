---
title: "Feature Specification: Phase 2: devin-lane"
description: "The alignment lane runner cannot dispatch a lane on cli-devin, so an operator who wants Devin lanes for /local-skilled-alignment or /local-doc-alignment has no preset to name. This phase adds a cli-devin kind that builds its command with the deep-loop runtime's shared Devin builder, and a devin preset on DeepSeek V4.1 Flash max."
trigger_phrases:
  - "devin lane"
  - "phase 2 devin lane"
  - "cli-devin alignment lane"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: devin-lane

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-alignment-lane-result-parser |
| **Successor** | None |
| **Handoff Criteria** | The lane runner's tests pass and a `--lanes=devin` run of each alignment command writes its report |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the alignment lane runner series. The operator asked to run both alignment commands with cli-devin on DeepSeek Flash at max, and the runner had no way to do it.

**Scope Boundary**: The runner, its tests, the executor presets and the lines in the two commands' workflows and docs that name which kinds and presets the runner accepts. The deep-loop runtime is called, never changed.

**Dependencies**:
- `buildLineageCommand` and `DEVIN_ALLOWED_MODELS` exported by `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`.
- A signed-in `devin` CLI on the PATH.

**Deliverables**:
- A `cli-devin` lane kind in `run-lanes.cjs` and a `devin` preset in `executors.json`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`run-lanes.cjs` accepts four executor kinds, and cli-devin is not one of them, so a preset that names it stops the run with exit 2. The cli-devin skill also forbids a second Devin command builder, which rules out pasting a Devin argv into the runner.

### Purpose
An operator can pass `--lanes=devin` to either alignment command and get read-only review lanes on Devin, built by the same code the deep-loop runtime uses.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/assets/local-skilled-alignment/run-lanes.cjs --run-dir <run> --config <config with presets.devin kind cli-devin> --preset devin
STATUS=ERROR run-lanes: <config>: presets.devin.kind must be one of cli-pi, cli-opencode, cli-codex, cli-vibe
exit:2
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `cli-devin` kind to `run-lanes.cjs`. It checks the model against the runtime's Devin allowlist when the config loads, and it builds each lane's argv by calling the runtime's `buildLineageCommand` with a read-only sandbox.
- Add a `devin` preset to `executors.json` on `deepseek-v4-1-flash-max`.
- Name `cli-devin` in the four workflow YAMLs where they list the kinds that go through the runner, and name the `devin` preset in both command docs.
- Add tests for the Devin argv and for a model outside the allowlist.

### Out of Scope
- The critic. It stays the native review agent that `executors.json` names, because a different model checking the lanes is the point of the critic.
- The runtime's Devin allowlist. Devin's live list also shows `deepseek-v4-1-flash-1017-max`, which the allowlist lacks. That belongs to the deep-loop runtime.
- A stall watchdog for Devin. Like OpenCode and Codex, a Devin lane gets only the hard timeout, because Devin writes no session file the watchdog reads.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/assets/local-skilled-alignment/run-lanes.cjs` | Modify | The `cli-devin` kind |
| `.skilled/commands/assets/local-skilled-alignment/tests/run-lanes.test.cjs` | Modify | Devin argv and allowlist tests |
| `.skilled/commands/assets/local-skilled-alignment/executors.json` | Modify | The `devin` preset |
| `.skilled/commands/assets/local-skilled-alignment/local-skilled-alignment-{auto,confirm}.yaml` | Modify | Name `cli-devin` among the runner's kinds |
| `.skilled/commands/assets/local-doc-alignment/local-doc-alignment-{auto,confirm}.yaml` | Modify | Name `cli-devin` among the runner's kinds |
| `.skilled/commands/local-skilled-alignment.md`, `.skilled/commands/local-doc-alignment.md` | Modify | Name the `devin` preset |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A `cli-devin` preset runs a lane with the argv the runtime's builder returns for a read-only sandbox | The new test asserts the argv `-p <prompt> --model <model> --permission-mode auto --respect-workspace-trust false` and a lane status of `ok` |
| REQ-002 | A `cli-devin` model outside the runtime's allowlist stops the run before any lane starts | The new test sees exit 2 and an error naming the allowlist |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every existing runner test still passes | `node --test .skilled/commands/assets/local-skilled-alignment/tests/` reports 0 failures, against a baseline of 92 passing |
| REQ-004 | Both alignment commands complete a `--lanes=devin` run | Each run writes `report.md`, and its lane status files read `ok` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `run-lanes.cjs --preset devin` dispatches Devin lanes that return findings, where it exited 2 before.
- **SC-002**: `/local-doc-alignment mcp-browser-use --lanes=devin` and `/local-skilled-alignment <011 commit> --lanes=devin` each write a report.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `fanout-run.cjs` exports `buildLineageCommand` and `DEVIN_ALLOWED_MODELS` | A renamed export breaks Devin lanes only | The runner loads the runtime only for a Devin lane, and the tests exercise the real export |
| Risk | Devin's `auto` mode refuses shell calls, so a lane cannot run `rg` | Med | A probe under `auto` found the right lines with Devin's own search tools. The lane prompt asks for evidence by path and line, which those tools give |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
