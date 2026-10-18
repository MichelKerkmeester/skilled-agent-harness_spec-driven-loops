---
title: "Feature Specification: Phase 5: version-aware-guards"
description: "The dispatch guards cannot see opencode2, so they pass a v2 run without checking it and they block a v2 slash-command run that no change can satisfy. This phase makes them version-aware."
trigger_phrases:
  - "version aware guards"
  - "phase 5 version aware guards"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: version-aware-guards

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-10-18 |
| **Branch** | `scaffold/005-version-aware-guards` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 11 |
| **Predecessor** | 004-agents-commands-config |
| **Successor** | 006-cli-opencode-dual-dispatch |
| **Handoff Criteria** | Hands to 006 when AC-001, AC-002 and AC-003 in acceptance-criteria.md are Met, and the baseline counts recorded at T002 are in the implementation summary. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the OpenCode v1 and v2 dual compatibility build specification.

**Scope Boundary**: The dispatch classifier, the hard-rule sidecar, the rule engine and one version resolver for the guards. The cli-opencode and deep-loop dispatch code belongs to 006. The plugins belong to 002 and 003.

**Dependencies**:
- 004-agents-commands-config (predecessor). It lands before this phase starts.
- The guard suite counts in `001-unknowns-and-baseline/baseline.json`. If 001 has not written that file, T002 records the counts before any edit.
- `research/research.md` section 5, and `research/iterations/iteration-010.md`, which hold the per-rule validity table and the matcher design.

**Deliverables**:
- The classifier admits `opencode\d*` and its evidence regexes match `opencode2 run`.
- Every rule in `hard-rules.json` carries an `appliesTo` list.
- One memoised version resolver that returns `v1`, `v2` or `unknown`.
- A v2 route for `command-flag-for-slash-prompt` that warns and does not block.
- Red-first tests for each change, and a green run of every guard suite.

**Executor**: Code goes to GPT-6 Luna max fast through cli-codex. Review goes to DeepSeek V4.1 Flash max through cli-devin. The orchestrator runs every test, because the codex write sandbox blocks local sockets, and it reruns each check before a completion claim.

**Frozen decisions that bind this phase**:
- D3: the version comes from parsed `--version` output, never from the binary name.
- D4: no test or probe in this phase starts, stops or restarts the v2 background service.
- D6: the executor split stated above.
- D7: new and changed code follows the sk-code OPENCODE surface, `sk-code/sk-code-opencode`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The dispatch classifier admits only the exact binary name `opencode`, and every evidence regex matches `opencode run` with a word boundary. The word boundary fails on `opencode2 run`, because the digit counts as a word character. So an `opencode2 run` command classifies as no dispatch, no hard rule runs, and the guard passes it. This fail-open hole exists today. Separately, `command-flag-for-slash-prompt` is an error-severity rule that requires `--command`. OpenCode 2.0.32 `run` has no `--command` flag, so the rule blocks a v2 slash-command run, and no change to the command can satisfy it.

### Purpose
The guards classify an `opencode2` run, evaluate only the rules that apply to the version the probe reports, and stop blocking a v2 run that no rule can satisfy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Widen binary admission and the evidence regexes to `opencode\d*`.
- Add an `appliesTo` list to each rule in `hard-rules.json`.
- Add one memoised `--version` resolver that returns `v1`, `v2` or `unknown`.
- On `unknown`, evaluate only the rules that apply to both versions.
- Give `command-flag-for-slash-prompt` a v2 route that warns and does not block.
- Red-first tests for each change, and a regression run of every guard suite.

### Out of Scope
- cli-opencode and deep-loop dispatch code, including `fanout-run.cjs`. That belongs to 006.
- Plugin code. That belongs to 002 and 003.
- Prose in the cli-opencode docs. 010 owns the doc sweep.
- The Claude, Codex, Devin and Pi preflight files. They consume the rule engine. Their source stays unchanged, and their tests must still pass.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | Modify | Add `appliesTo` to the five rules. Add the v2 slash-prompt rule, which applies to v2 only and warns. |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | Widen the three `opencode run` regexes (lines 36, 128 and 137) to `opencode\d*`. Filter rules by `appliesTo` in `evaluate` (line 276). Add the v2 slash-prompt check. |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Replace the exact-name test (lines 51, 210 and 244) with an `opencode\d*` predicate. Widen the evidence regexes at lines 28 and 248. |
| `.skilled/hooks/dispatch/lib/opencode-version.mjs` | Create | The memoised `--version` resolver. The file location is open question Q3. |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modify | Add red-first cases for `opencode2 run` classification. This file runs under vitest. |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | Add red-first cases for applicability, the unknown intersection, the v2 slash route and the resolver. This file runs under `node --test`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The classifier admits an `opencode2 run` command as a cli-opencode dispatch, so rule evaluation runs on it. |
| REQ-002 | Every rule in `hard-rules.json` declares `appliesTo` with `v1`, `v2` or both. A rule without the field reads as both versions. |
| REQ-003 | One memoised resolver returns `v1`, `v2` or `unknown` from parsed `--version` output only. It never reads the binary name. |
| REQ-004 | On `unknown`, only the rules whose `appliesTo` includes both versions run. |
| REQ-005 | No rule blocks a correct v2 slash-command run. The v2 slash route warns instead. |
| REQ-006 | Every existing guard test passes at or above its baseline count, with zero failures. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | When the version resolves to v1, the verdicts of the three preflight callers match the verdicts before this phase. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `opencode2 run` cases in the dispatch audit suite fail on the pre-change code and pass after the change.
- **SC-002**: No rule blocks the v2 slash-command fixture.
- **SC-003**: Every guard suite named in CHK-002 exits 0, and its pass count is at or above the baseline recorded at T002.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Guard suite baseline counts from 001 | With no before number, "no regressions" cannot be shown. | T002 records the counts before the first edit. |
| Dependency | Whether v2 `run` expands a slash message (Q1) | Decides what "correct" means for a v2 slash run. | AC-002 uses a fixture that asserts no block, which holds under either answer. |
| Risk | The resolver runs a binary named in command text | A path-qualified binary would run before the command is checked. | Q4 default: path-qualified binaries resolve to `unknown` without a probe. |
| Risk | On `unknown`, v1-only rules drop out | A v1 slash-prompt violation goes unreported on a host whose probe fails. | Accepted per the brief. The trade-off is recorded in goal.md and open question Q5. |
| Risk | Evaluate's signature changes under three preflight callers | A caller that passes no version could lose v1 coverage. | `evaluate` resolves the version itself when the caller passes none, so the callers stay unchanged. REQ-007 tests their verdicts. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One `--version` probe per binary per process. A test counts the probe calls for two evaluations of the same binary and expects one call.
- **NFR-P02**: The probe runs under a fixed timeout, set as a named constant. A test with a hanging probe returns `unknown` within that timeout.

### Security
- **NFR-S01**: The resolver probes only bare command names that resolve through PATH or `$OPENCODE_BIN`, pending Q4. A path-qualified binary resolves to `unknown` with no probe.
- **NFR-S02**: The guard writes no files. The resolver keeps its cache in memory for one process.

### Reliability
- **NFR-R01**: A probe error, a timeout or unparsable output returns `unknown`. It never throws into the hook.
- **NFR-R02**: A change in the binary's size or mtime triggers a fresh probe.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a command with no executor token returns `none` and runs no probe.
- Maximum length: a command with many segments probes each distinct binary once.
- Invalid format: output that matches neither version shape returns `unknown`.

### Error Scenarios
- External service failure: not applicable. The probe reads a local binary only.
- Network timeout: not applicable. The resolver makes no network call.
- Concurrent access: not applicable. Each guard call runs in its own process.

### State Transitions
- Partial completion: if the `appliesTo` change lands before the resolver, a rule with no resolved version evaluates as both versions. That matches the old v1 behaviour.
- Session expiry: not applicable. The memo lives for one process.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two library files, one new module, one sidecar and two test files |
| Risk | 15/25 | A fail-open guard and a process probe on a hot path |
| Research | 8/20 | The evidence is in place. The v2 slash route is not proven. |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q1.** Does `opencode2 run` expand a `/family:name args` message? The 001 brief does not list this probe. AC-002 holds under either answer, but the definition of a "correct" v2 slash run depends on it. Resolved by the orchestrator: treat v2 `run` as not expanding a slash message. The v2 rule warns and names the `session.command` operation.
- **Q2.** The cache key. Research section 6 and the 006 brief use realpath, size and mtime. The 005 brief says realpath and mtime. Default: realpath, size and mtime. The orchestrator confirms. Resolved: realpath, size and mtime.
- **Q3.** The resolver's file location. The brief names no file. Default: `.skilled/hooks/dispatch/lib/opencode-version.mjs`. Resolved: the default location.
- **Q4.** Whether path-qualified binaries in command text get a probe. Default: no probe, so they resolve to `unknown`. Resolved: the default, no probe.
- **Q5.** Coverage on `unknown`. Iteration-010 says the widening "can only add lint coverage". The `unknown` intersection drops v1-only rules when a probe fails, which narrows coverage. Default: follow the brief, drop them, and report the trade-off. Resolved by the orchestrator: on `unknown`, both-version rules run at their own severity and version-specific rules run at `warn`, so a failed probe narrows nothing to silence and blocks nothing it cannot prove.
<!-- /ANCHOR:questions -->
