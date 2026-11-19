---
title: "Feature Specification: Phase 1: v1-runtime-code-and-tests"
description: "Removes the OpenCode 1.x branches from the runtime code, setup helper, doctor battery, plugins and session readers, with their tests, so the runtime resolves OpenCode 2 only."
trigger_phrases:
  - "v1 runtime code and tests"
  - "phase 1 v1 runtime code and tests"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: v1-runtime-code-and-tests

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-19 |
| **Branch** | `worktrees/477-opencode-v1-removal` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-v1-ci-and-package-pins |
| **Handoff Criteria** | Strict validation passes, and the suites named in REQ-004, REQ-005, REQ-006 and REQ-008 pass on OpenCode 2.3.2. The branch is not pushed until phase 002 lands. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Remove OpenCode v1 support from the repository specification.

**Scope Boundary**: The runtime code, the setup helper, the doctor battery, the plugins, the session readers and the tests that exercise them. The CI workflow, the package pins and the docs belong to phases 002 and 003.

**Dependencies**:
- A live OpenCode 2.3.2 binary for the event capture in REQ-007.
- None for the `--pure` text: this phase replaces the v1 command in the two `loop-protocol.md` files and the two presentation `.txt` files with the v2 form, so the widened scan in REQ-009 passes here. The orchestrator moved that fix forward from phase 003.

**Deliverables**:
- Runtime and setup code with no v1 branch, plus the `--remove-v1` cleanup mode.
- A native fan-out lineage refused with a clear error before any lineage spawns. `native` stays the single-executor kind.
- Deleted `opencode-setup-both.test.cjs` and `hermetic-opencode-path.ts`.
- Updated tests, and the widened `executor-branch-contract.vitest.ts`, green.
- The four `--pure` docs, the native fan-out text in the deep presentations and workflow YAMLs, and the regenerated compiled deep contracts.
- The live event capture in `scratch/event-capture.txt`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The runtime still resolves OpenCode 1.x as a supported family. `SUPPORTED_FAMILIES` in `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` lists both `v1` and `v2`. The same v1 branch sits in the deep-loop runtime (the native-lineage path in `fanout-run.cjs` runs `opencode run --command deep/<loop>`), the skilled-loop wrapper, the setup helper, the doctor battery, the plugin event handlers and the session readers. On OpenCode 2.3.2 these branches never run, so they add review cost and mislead readers. The `*.disposed` branches wait for events that the plugin inventory records as never arriving on v2, and the readers query legacy `session` and `message` tables that v2 does not write.

### Purpose
After this phase the runtime resolves OpenCode 2 only, reports a v1 binary as unsupported instead of dispatching it, and the setup helper can remove a v1 install for other users.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c "'v1'" .skilled/hooks/cli-dispatch/lib/opencode-version.mjs
5
```
Five lines of the version resolver name the `'v1'` family. REQ-001 removes or rewrites all of them.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Version resolution: `SUPPORTED_FAMILIES` becomes `['v2']`, major 1 becomes "unsupported", and the `opencode2` probe goes.
- Dispatch rules: the two v1-only rules and their checks go, and the dispatch tests follow.
- Deep-loop runtime: the native-lineage v1 path, the v1 argv and the version-picked bypass flag go; the v2 argv stays. A native fan-out lineage is refused, and every test that read the removed native path or a v1 version stub follows.
- The `--pure` text in the four loop-protocol and presentation files, the native fan-out text in the deep presentations and workflow YAMLs, and the compiled deep contracts regenerated from them.
- Wrapper, setup helper and doctor battery: the v1 arms and modes go; `--remove-v1` is added; the battery runs the v2 family only.
- Plugins and session readers: the v1-only branches go, the bridge loses its `server` key, and the tests re-point to `setup`.

### Out of Scope
- The v1 CI matrix leg, the `both` job and the workflow name. They belong to phase 002, because that workflow must first run the four v1-gated suites unconditionally.
- The v2 pin bump in `opencode-setup.sh`. Phase 002 bumps it after this phase has finished editing the same file.
- The other v1 and native fan-out text in docs, playbooks and feature catalogs. Phase 003 removes it; this phase fixes only the four `--pure` files and the deep presentations and YAMLs named above.
- The `@opencode-ai/plugin` pins and the `default-model-id.test.cjs` assertions. Phase 002 decides them.
- The Mac cleanup and any push. The parent packet owns both.

### Files to Change

Line references are inventory estimates from the 2026-11-19 sweep. Re-read each file before editing (T001).

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` | Modify | `SUPPORTED_FAMILIES` becomes `['v2']`; major 1 maps to "unsupported" |
| `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | Modify | Mirror of the resolver; drop the `opencode2` probe |
| `.skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json` | Modify | Each v1 row becomes an "unsupported" expectation |
| `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | Modify | Remove the v1-only rule checks (about lines 783 to 795) and the family filter if it becomes trivial |
| `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | Follow the removed rules |
| `.skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs` | Modify | R1 to R4 follow the removed rules |
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | Modify | Delete `no-bare-agent-general` and `command-flag-for-slash-prompt` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Delete the native-lineage path (about lines 2392 to 2441), the v1 argv (about 2489 to 2501) and the version-picked bypass flag (about 2479) |
| `.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs` | Modify | Switch the argv to v2 |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | v2 default probe in place of 1.19.3; drop the `--variant` cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | Modify | Parity test and v1 fixtures |
| `.skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts` | Modify | Remove the v1 receipt cases (about lines 243 to 246) |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts` | Modify | Widen the scan to the two `loop-protocol.md` files and the two presentation `.txt` files (REQ-009) |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts` | Modify | Remove the v1 fixture (about line 99) |
| `.skilled/skills/system-deep-loop/runtime/tests/_support/hermetic-opencode-path.ts` | Delete | No suite uses it once the v1 stubs are gone |
| `.skilled/bin/skilled-loop` | Modify | Remove the v1 `-m` elif (about line 832) and the help-text version sniff (about lines 1218 to 1225) |
| `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-model-effort.test.cjs` | Modify | Remove the v1 arms (about lines 54, 78 and 89) |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Modify | Remove `V1_PKG`, `LAUNCHER`, `write_launcher`, `link_v2_name`, `retire_opencode2`, `verify_pair`, `mode_both`, `mode_v1` and the v1-on-PATH refusal; add `--remove-v1` |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-both.test.cjs` | Delete | Tests the removed `mode_both` |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-classify.test.cjs` | Modify | Corpus follows the classifier, plus a case for `--remove-v1` |
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Modify | Run the v2 family only; remove `legPluginDiscovered`, `legPluginLoad` and the v1 command listing |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Modify | Follow the battery |
| `.opencode/plugins/system-dist-freshness-guard.js` | Modify | Remove the `*.disposed` branch (about line 221) |
| `.opencode/plugins/system-skill-advisor.js` | Modify | Remove the `*.disposed` branch (about line 1666) and any other branch the live capture shows never arrives |
| `.opencode/plugins/opencode-goal.js` | Modify | Remove the `endsWith('.disposed')` branch (about line 3689) and any branch the live capture shows never arrives |
| `.opencode/plugins/system-spec-gate.js` | Modify (conditional) | `session.resumed` and `session.compact` branches (about lines 192 to 194), only if the capture shows they never arrive |
| `.opencode/plugins/session-handover.js` | Modify (conditional) | `session.updated` branch (about line 403), only if the capture shows it never arrives |
| `.opencode/plugins/lib/v2-bridge.js` | Modify | Drop the `server` key from the `dualPlugin()` return; keep `EVENT_ALIASES` |
| `.opencode/plugins/tests/*.test.cjs` (the files that call `.server(`) | Modify | Re-point `Plugin.server(...)` to `setup` |
| `.skilled/hooks/shared/session-readers/opencode.mjs` | Modify | Remove `LEGACY_MESSAGE_TABLE` and the legacy `session` and `message` branches |
| `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs` | Modify | Remove the legacy-table branches (about lines 48 to 49 and 220 to 221) |
| `.skilled/hooks/shared/tests/session-readers/opencode.test.mjs` | Modify | Move the fixture off `opencode-v1.db` |
| `.skilled/skills/system-deep-loop/runtime/vitest.config.ts` | Modify | Drop the `hermetic-opencode-path.ts` setup file |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/adapter-shim-core.cjs` | Modify | Version stub reports 2.3.2 |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts` | Modify | Version stub reports 2.3.2 |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts` | Modify | Version stub reports 2.3.2 |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` | Modify | Assert the native refusal; version stub reports 2.3.2; v2 opencode argv |
| `.skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts` | Modify | Drop the native command-input cases |
| `.skilled/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts` | Modify | Drop the native prompt expectations |
| `.skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs` | Modify | Expect the v2 argv |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts` | Modify | Drop the native-path asserts; assert the refusal text |
| `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | Modify | v2 `cli-opencode` command in place of the v1 one with `--pure` |
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Modify | v2 `cli-opencode` command in place of the v1 one with `--pure` |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | Modify | v2 `cli-opencode` command; native fan-out lineage refused |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | Modify | v2 `cli-opencode` command; native fan-out lineage refused |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | Fan-out needs a `cli-*` executor; v2 opencode notes |
| `.skilled/commands/deep/assets/deep-research.yaml` | Modify | Fan-out needs a `cli-*` executor; v2 opencode notes |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerate | `compile-command-contracts.cjs --command deep/review --write` |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerate | `compile-command-contracts.cjs --command deep/research --write` |
| The 33 files in `scratch/files-outside-table.txt` | Modify / Delete | Added after scope freeze: the callers and tests the v1 removal broke (session-handover, decision-capture, overlay-guard, advisor and spec-kit suites), the Vibe session-cleanup hook the deep review found, the bridge-export and launcher-probe fixes, and generated type maps. Recorded here so the table matches the commits |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The version resolvers accept OpenCode family `v2` only. `opencode-version.mjs` and `opencode-version.cjs` set the supported family list to v2, map major 1 to "unsupported" and drop the `opencode2` probe. Proof: `rg -n -F "SUPPORTED_FAMILIES = Object.freeze(['v2'])" .skilled/hooks/cli-dispatch/lib/opencode-version.mjs` prints one line. |
| REQ-002 | The two v1-only dispatch rules (`no-bare-agent-general` and `command-flag-for-slash-prompt`) are removed from `hard-rules.json`, and their checks are removed from `dispatch-rule-checks.mjs`. Proof: `rg -l -F -e 'no-bare-agent-general' -e 'command-flag-for-slash-prompt' .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs \| wc -l` prints 0. |
| REQ-003 | The native-lineage path, the v1 argv and the version-picked bypass flag are removed from `fanout-run.cjs`, and `behavior-bench-run.cjs` uses the v2 argv. Proof: `rg -n -F -e 'deep/${' -e '--variant' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs .skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs \| wc -l` prints 0, and `npx vitest run tests/unit/fanout-run.vitest.ts` in the runtime folder reports 0 failed tests. |
| REQ-004 | The skilled-loop wrapper has no v1 `-m`/`--model` arm and no help-text version sniff, and its test passes. Proof: `node --test .skilled/hooks/session-handover/tests/skilled-loop-wrapper-model-effort.test.cjs` prints `# fail 0`. |
| REQ-005 | The setup helper has no v1 install, launcher or pairing path, and gains a `--remove-v1` mode that uninstalls `opencode-ai` and deletes the `opencode1` launcher. `opencode-setup-both.test.cjs` is deleted. Proof: `rg -n -F -e 'mode_both' -e 'mode_v1' -e 'write_launcher' .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh \| wc -l` prints 0, and `ls .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-both.test.cjs` exits 1. |
| REQ-006 | The doctor battery runs the v2 family only: the v1 legs are removed and its test passes. Proof: `node --test .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` prints `# fail 0`. |
| REQ-009 | The `executor-branch-contract.vitest.ts` scan reads the two `loop-protocol.md` files and the two presentation `.txt` files, and none of them carries `--pure`. Before the doc fix the widened test failed and named exactly those four files; after it the test passes. Proof: in the runtime folder, `npx vitest run tests/unit/executor-branch-contract.vitest.ts` reports 0 failed tests. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The `*.disposed` branches are removed from `system-dist-freshness-guard.js`, `system-skill-advisor.js` and `opencode-goal.js`. Each other unverified event branch is removed only where the live 2.3.2 capture records the event as never arriving. The bridge's `server` key is removed, and the plugin tests call `setup` instead of `server`. Proof: `rg -l -F '.disposed' .opencode/plugins/*.js \| wc -l` prints 0, and `rg -l -F '.server(' .opencode/plugins/tests \| wc -l` prints 0. |
| REQ-008 | The session readers drop the legacy `session` and `message` table branches, and the readers' test uses a v2 fixture. Proof: `rg -n -F 'LEGACY_MESSAGE_TABLE' .skilled/hooks/shared/session-readers/opencode.mjs \| wc -l` prints 0, `rg -l -F 'opencode-v1.db' .skilled/hooks \| wc -l` prints 0, and `node --test .skilled/hooks/shared/tests/session-readers/opencode.test.mjs` prints `# fail 0`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n -F "SUPPORTED_FAMILIES = Object.freeze(['v2'])" .skilled/hooks/cli-dispatch/lib/opencode-version.mjs` prints one line, and the parity test in `opencode-dual-dispatch.vitest.ts` reports 0 failed tests.
- **SC-002**: Every node suite named in REQ-004, REQ-005, REQ-006 and REQ-008 prints `# fail 0`.
- **SC-003**: The widened executor-branch scan covers the four loop-protocol and presentation files and passes, because none of them carries `--pure`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live OpenCode 2.3.2 for the event capture (REQ-007) | Without it, the unverified event branches stay | Keep each unverified branch and record it as open; never guess that an event is absent |
| Dependency | Phase 003 removes the `--pure` text | The widened scan stays red until then | Accepted sequencing; phase 003 turns it green (REQ-009 in phase 003) |
| Risk | Removing the bridge `server` key breaks about twenty plugin tests | High | Re-point every test to `setup` in the same change and run the plugin suite |
| Risk | CI v1 matrix entry calls the removed battery legs and setup modes until phase 002 lands | High | No push until phase 002 lands; no CI result is claimed for this phase |
| Risk | `--remove-v1` deletes the wrong binary | High | Resolve the launcher path under `$BIN` and refuse any other path; a case in the classify test covers the refusal |
| Risk | Session readers return fewer sessions after the legacy branches go | Medium | Accepted by the operator. Sessions older than 2026-10-22 become invisible to the readers |

### Non-Functional Requirements
N/A: this phase changes scripts and tests only. It runs no service and sets no latency or throughput target. Its only limits are the verify commands in `tasks.md`.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no OpenCode binary on PATH. The behavior does not change, and the four unknown-version corpus rows keep covering it.
- Maximum input: a v1 binary reported by `--version`. The resolver returns "unsupported", and each v1 corpus row becomes an "unsupported" expectation.
- Failure path: `--remove-v1` refuses a launcher path outside `$BIN`, prints the refusal and exits non-zero.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About thirty files across the runtime, the setup helper, the battery, the plugins and the session readers |
| Risk | 19/25 | Dispatch guard, deletions, a new uninstall mode and the event-dependent plugin branches |
| Research | 8/20 | Inventory line references need a re-read, and the live event capture is still to run |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- UNKNOWN: which of `session.resumed`, `session.compact`, `session.updated`, `session.status`, `permission.*` and `question.*` arrive on OpenCode 2.3.2. The live capture in T004 answers it, and each branch stays until then.
- Open question: may the widened `--pure` scan stay red on the branch until phase 003 lands? The packet assumes yes. The operator confirms.
- Open question: which provider and model the live capture uses. It runs with an explicit `-m` and a closed stdin, as the hard rules require.
- Open question: `default-model-id.test.cjs` parses v1 argv (`--model` with `--variant`) and runs in the CI step that phase 002 moves. Phase 002 decides whether it needs an edit or only a v2 fixture.
<!-- /ANCHOR:questions -->

---
