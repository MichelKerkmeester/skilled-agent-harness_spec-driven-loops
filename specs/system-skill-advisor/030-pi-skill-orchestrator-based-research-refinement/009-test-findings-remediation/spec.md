---
title: "Feature Specification: Remediating the Cross-CLI Test Findings"
description: "The phase 8 runs found an OpenCode plugin that never loads, a Pi test left behind by phase 4, a sandbox daemon that marks the live advisor unavailable, a stale cadence harness and several scenarios whose commands cannot show what they expect. This phase fixes each verified finding and reruns the affected scenarios in all five CLIs until they pass."
trigger_phrases:
  - "test findings remediation"
  - "opencode advisor plugin export"
  - "sandbox generation file"
  - "cross cli rerun"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Remediating the Cross-CLI Test Findings

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-cross-cli-manual-testing |
| **Successor** | None |
| **Handoff Criteria** | Every finding below is fixed or recorded as operator-owned, and each affected scenario passes when rerun in cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Pi skill orchestrator research for skill advisor refinement specification. It fixes what phase 8 found and proves each fix inside every CLI runtime.

**Scope Boundary**: The findings F1 to F22 and the CL-005 gap in section 3, each verified by the orchestrator against code or a rerun. A finding the remaining phase 8 runs add is appended here before any work on it starts.

**Dependencies**:
- 008-cross-cli-manual-testing, hard. It produced the findings and the evidence behind each one.

**Deliverables**:
- Code and test fixes for the defects, scenario and doc fixes for the rest
- A rerun of every affected scenario in all five CLIs, with evidence under `evidence/`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 8 ran the advisor scenarios inside five CLIs. OpenCode refuses to load the advisor plugin, so no OpenCode session gets a brief or the status tool. A Pi test still expects a label phase 4 renamed, a sandboxed daemon writes the live generation file, and the directive-lifecycle harness points at a folder that moved. Several scenarios run commands that hide the output they expect, so they fail in every CLI while the code behaves correctly.

### Purpose
Every advisor surface works in all five CLIs, and every related scenario passes there without a caveat.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Code and test defects:
- **F10** `.skilled/plugins/system-skill-advisor.js` exports three constants and four helpers beside its default factory. OpenCode 1.18.32 logs `failed to load plugin ... Plugin export is not a function` and loads nothing from it. The module must export only its default factory, with the helpers moved to a module the tests import.
- **F11** Commit e18d6073b8 renamed the Pi debug label `fallback(unavailable)` to `fallback(headless)` and added outage, no-match and skipped classes. `.skilled/hooks/dispatch/pi/directive-dedup.test.ts:163-167` still expects the old label and fails.
- **F11 note** The new outage, no-match and skipped classes already have a table test at `runtime/tests/hooks/prompt-advisor.vitest.ts:62-85`, so the fix updates the stale assertion and adds no duplicate cases.
- **F12** Scenario 457 step 4 runs the Pi dispatch suite with a bare `npx vitest run`, which never loads `.skilled/hooks/vitest.config.ts`. `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:7` imports `../../.skilled/hooks/shared/hook-flags.mjs`, which resolves only from the `.pi/extensions/` symlink. That import is correct: Pi loads the file through the symlink, and a source-relative import would fail under Pi. The scenario command is the defect, so step 4 gains `--config .skilled/hooks/vitest.config.ts --dir .skilled/hooks/dispatch/pi`.
- **F13** Scenario 457's harness `run-registered-adapter-cadence.mjs` spawns `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/<runtime>/user-prompt-submit.js`, a tree that moved to `.skilled/skills/system-spec-kit/runtime/dist/`. It crashes before writing `summary.json`. Its sibling `deterministic-advisor-target.mjs` carries the same stale path.
- **F3** A daemon started with `SYSTEM_SKILL_ADVISOR_DB_DIR` and `SPECKIT_IPC_SOCKET_DIR` still writes the workspace file `.skilled/skills/.state/advisor/skill-graph-generation.json`. Its shutdown wrote `state: unavailable, reason: SIGTERM` twice during phase 8, so the live `advisor_status` reported `freshness: unavailable` while the live daemon was healthy.
- **F3, launcher state** `.skilled/bin/system-skill-advisor-launcher.cjs` `writeState()` wrote a sandbox payload into the live `runtime/database/.system-skill-advisor-launcher.json` although the sandbox set `SYSTEM_SKILL_ADVISOR_DB_DIR`. The file read after phase 8 names a database inside an OpenCode sandbox.
- **F3, shared model server** A sandboxed launcher shares the model-server directory `/tmp/system-hf-embed` with the live daemon, and its shutdown may stop the server the live daemon uses. Confirm from the code before fixing.
- **F3, quarantine database** A sandboxed daemon's watcher opens the workspace quarantine database rather than one under its `SYSTEM_SKILL_ADVISOR_DB_DIR` override.
- **F14** Once the Pi suite runs under its config, `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` lines 162-167 fail: they expect a missing stdin redirect on a cli-devin dispatch to advise, but commit 687de40016 made `stdin-redirect-required` a blocking hard rule in every cli skill. The test is wrong, and the advisory path needs a rule that is still advisory.
- **F15** The plugin resolves its CLI through `.opencode/bin`, which `.opencode/SYNC.md:31` documents as a symlink to `../.skilled/bin` and commit 91ccdd7ac47 deleted. The symlink comes back.
- **F16** Phase 7 changed `.skilled/skills/system-deep-loop/deep-review/SKILL.md` without regenerating `.skilled/commands/deep/assets/compiled/deep-review.contract.md`, so the renderer refused it as `STALE_SOURCE_DIGEST`. The orchestrator regenerated it with `compile-command-contracts.cjs --command deep/review --write`, and `render-command-contract.vitest.ts` passes 32 of 32.
- **F17** The live daemon child runs with `SPECKIT_IPC_SOCKET_DIR=/tmp/system-skill-advisor/1c78cc277b52` and looks for `hf-embed.sock` there, while the live launcher serves the model server at `/tmp/system-skill-advisor/hf-embed.sock`. The mismatch predates this work. Confirm from the code before fixing.
- **F7** `advisor-recommend.ts:156` names only `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` in its disabled reason, although lines 588 and 589 also accept the legacy `SPECKIT_` name the playbook sets.
- **F21** `classifyOwnerLease` in `.skilled/bin/system-skill-advisor-launcher.cjs` reclaims a live owner lease as `ppid-1-orphan` whenever the owner's parent is pid 1 and differs from the parent it recorded. The CLI starts every launcher detached, so a healthy launcher is reparented to pid 1 as soon as the CLI exits. A second launcher on the same database then reclaims the lease, finds the live launcher record, bridges to it and deletes the owner lease. The healthy owner's next heartbeat finds no lease, and it shuts itself and its daemon down. The rule is not in the documented contract (`references/runtime/daemon-lease-contract.md` section 4 names a dead pid, a stale heartbeat or an unverifiable owner). An isolated reproduction with its own database showed the incumbent dead 25 s after a second launcher call, and scenario 433, which cold-starts a launcher on a sandbox socket against the live database, displaced the live advisor during the reruns at 22:25Z and 22:41Z.
- **F21, scenario half** Scenario 433 sandboxes only the socket directory, so its cold start runs a launcher against the live database. It gains its own database directory, the model server off and a teardown that stops its launcher by recorded pid, as CP-004 does.
- **F5, repository half** Codex runs the advisor hook twice per prompt, from `.codex/hooks.json` and from a duplicate entry in the operator's global `~/.codex/hooks.json`. The two calls race on a cold prompt and both fail open at about 2.2 s. Find whether anything in this repository writes that global entry, and fix the writer if one does.

Scenario and doc defects:
- **F1** CL-001 and CP-003 step 4 expect the advisor diagnostic on the stderr of the spec-kit shim, which has never forwarded its child's stderr. The diagnostic is written to the inner hook's stderr and, with `SKILL_ADVISOR_DEBUG=1`, to the diagnostics JSONL.
- **F2** CL-006 step 3 sends the untrusted rebuild's output to `/dev/null`, yet expects its trust-grant message.
- **F4** CP-004 carries no sandbox of its own. The daemon-absent state then needs the live daemon stopped, and the cold start leaves a sandbox daemon running after the sandbox is deleted.
- **F9** NC-004 describes ambiguity as a confidence gap within 0.05. The scorer uses a score gap or a confidence gap within 0.05 (`runtime/lib/scorer/ambiguity.ts`). The catalog leaf `scorer-fusion/ambiguity.md` already states the either-margin rule and stays unchanged.
- **F6** cli-cursor `SKILL.md` and `references/integration-patterns.md` name Gemini 3.7 Flash High, while the allowlist id is `gemini-3.8-flash-high`.
- **F8** Inside Cursor's `--sandbox enabled` the advisor CLI cannot reach the live daemon and returns a degraded `local-scorer` answer. cli-cursor documents nothing about it.
- **CL-005 gap** CL-005 passes on the plugin's unit tests without ever loading the plugin in OpenCode, which is how F10 went unseen. It gains a live-load check.
- **F19** CL-005's recorded evidence pins the plugin suite at 40 tests. The suite now has 65, all passing, and a strict tester read the grown count as a mismatch and failed an otherwise clean run. The scenario's pass signal becomes a green suite, not a fixed count.
- **F22** CL-005 expects the native brief to carry `route: "cli"` or `cli-local-scorer`. That label lives only in the plugin's internal result metadata (`.opencode/plugins/system-skill-advisor.js:618`); neither the rendered `Advisor:` line nor the status tool shows it, and no test asserts it. A Codex tester failed an otherwise clean run on it. The observable form is the brief's freshness: `Advisor: live;` from the daemon, `Advisor: stale;` from the local scorer.
- **F20** The local-native divergence ratchet in the advisor suite fails on one new case, `rr-iter3-093`: the Python scorer now ranks sk-prompt on the literal token "prompt" plus its sibling boost from sk-code, while the native scorer keeps the gold sk-code. Neither scorer changed. The shift comes from the live skill graph the Python side reads, and the test asks for a ledger entry with an honest reason when native stays right.
- **F18** Scenario 457 step 6 names a retired wrapper, and the docs that describe the advisor state files, the Codex hook parity playbook and a link into the deleted `.opencode/changelog` tree no longer match the code. Each is checked before it is changed.

### Out of Scope
- Editing the operator's global `~/.codex/hooks.json`. Removing the duplicate advisor entry there is the operator's call.
- Forwarding the shim's child stderr to the host. The shim has been silent since before July 2026, and the diagnostics JSONL is the observable channel.
- A daemon-side deduplication of identical concurrent requests. Removing the duplicate registration removes the race.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/system-skill-advisor.js`, reached also through the `.skilled/plugins` symlink | Modify | Default export only |
| `.opencode/plugins/lib/skill-advisor-render.js` | Create | The constants and helpers the tests import |
| `.opencode/plugins/tests/system-skill-advisor.test.cjs`, `runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modify | Import from the helper module |
| `.opencode/bin` | Create | Symlink to `../.skilled/bin` again |
| `.skilled/hooks/dispatch/pi/directive-dedup.test.ts` | Modify | The current headless label |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modify | The advisory case uses a rule that is still advisory |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md` | Modify | Step 4 runs the Pi suite under its config |
| `specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/evidence/runtime/run-registered-adapter-cadence.mjs`, `deterministic-advisor-target.mjs` | Modify | Current dist paths |
| `runtime/lib/freshness/generation.ts`, `runtime/tests/state-containment.vitest.ts`, `runtime/tests/handlers/advisor-status.vitest.ts` | Modify | Generation file follows the sandbox override |
| `runtime/lib/daemon/watcher.ts`, `runtime/tests/daemon-freshness-foundation.vitest.ts` | Modify | Quarantine database follows the sandbox override |
| `.skilled/bin/system-skill-advisor-launcher.cjs`, `runtime/tests/launcher-lease.vitest.ts`, `runtime/tests/launcher-model-server-default.vitest.ts` | Modify | Launcher state and model server stay in the sandbox |
| `runtime/handlers/advisor-recommend.ts`, `runtime/tests/handlers/advisor-recommend.vitest.ts` | Modify | Disabled reason names the flag that is set |
| `.skilled/bin/system-skill-advisor-launcher.cjs`, `runtime/tests/launcher-reap-pid-reuse.vitest.ts` | Modify | A live, heartbeating owner is never reclaimed for its parent pid |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md` | Modify | Scenario 433 sandboxes its database and stops its own launcher |
| `.skilled/bin/install-codex-hooks.mjs`, its source-root test and the five docs that state its contract | Unchanged, operator-owned | A removal-only installer reverses a documented contract, so it waits for the operator. `implementation-summary.md` hands over the 18 entries and a removal script |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.md` | Modify | Regenerated from the phase 7 sources |
| Scenario files CL-001, CP-003, CL-006, CP-004, NC-004 and CL-005 | Modify | Commands and expected signals that can be observed. The catalog leaf `scorer-fusion/ambiguity.md` already states the either-margin rule and stays unchanged |
| `.skilled/skills/.state/advisor/README.md` and the advisor docs that state where its state files live | Modify | Current locations, and the sandbox override for each state file |
| `runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modify | One ledger entry for the new divergence, with its reason |
| cli-external-orchestration `manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md` | Modify | Current Codex hook loading, adapter count and packet path |
| cli-cursor `SKILL.md`, `references/integration-patterns.md`, `references/cli-reference.md` | Modify | Gemini id and the sandbox limit |
| `evidence/` | Create | Rerun reports per CLI |

`runtime/` above means `.skilled/skills/system-skill-advisor/runtime/`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | OpenCode loads the advisor plugin | `opencode run --print-logs` shows no `failed to load plugin` line for it, and a session lists `spec_kit_skill_advisor_status` |
| REQ-002 | The Pi dispatch suite and the advisor, spec-kit and plugin suites pass | Each suite exits 0 with no failed or errored file |
| REQ-003 | A sandboxed daemon leaves the live generation file alone | A test shows a daemon with `SYSTEM_SKILL_ADVISOR_DB_DIR` set writes its generation elsewhere, and the live file is unchanged after a sandboxed CP-004 run |
| REQ-004 | Every related scenario passes in all five CLIs | CL-001, CL-005, CL-006, CP-003, CP-004, NC-001, NC-004, 433 and 457 each report PASS from cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex, or a FAIL the orchestrator traces to a named environment limit |
| REQ-008 | A second launcher never displaces a live owner | A launcher test shows a live owner with a fresh heartbeat and parent pid 1 stays `live-owner`, and the isolated two-launcher reproduction keeps the incumbent alive past two heartbeat intervals |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The 457 harness runs to completion | It writes `summary.json` with `passed: true` for each registered runtime |
| REQ-006 | Docs and scenarios match the code | F1, F2, F4, F6, F8, F9 and the CL-005 gap are fixed, and the sk-doc validators report no new issue |
| REQ-007 | The Codex double registration is resolved or handed over | Either the repository writer is fixed or the operator has the exact entry to remove |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An OpenCode session gets an advisor brief the way Claude, Codex, Devin and Pi do.
- **SC-002**: Rerunning phase 8's scenarios yields no FAIL that points at the code or at the scenario.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Moving the plugin's named exports breaks a test or another importer | High | Grep every importer first and run all suites that import the plugin |
| Risk | A sandbox generation path hides a real live-state change | Med | The override applies only when the DB dir override is set, with a test for each case |
| Dependency | Grok 4.7 through cli-cursor and GPT-6 Luna through cli-codex | A lane stalls | The orchestrator reruns or reassigns the brief |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator asked for every surfaced finding fixed and proven in all five CLIs.
<!-- /ANCHOR:questions -->

---
