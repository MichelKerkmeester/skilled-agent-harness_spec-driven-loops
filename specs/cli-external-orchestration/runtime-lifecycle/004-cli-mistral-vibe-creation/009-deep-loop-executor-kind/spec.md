---
title: "Feature Specification: Phase 9: deep-loop-executor-kind"
description: "The deep-loop fan-out cannot run a Vibe lineage, because no executor kind, adapter, env allowlist or recursion guard names Vibe. This phase adds cli-mistral-vibe as an executor kind that runs print mode with a lineage-local VIBE_HOME and scores each lineage from export.json."
trigger_phrases:
  - "deep loop executor kind"
  - "phase 9 deep loop executor kind"
  - "cli-mistral-vibe executor kind"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: deep-loop-executor-kind

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 12 |
| **Predecessor** | 008-vibe-repo-guards |
| **Successor** | 010-hub-registration-and-routing |
| **Handoff Criteria** | One lineage runs a research iteration end to end; exit 3 scores partial; executor unit and stress suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: The `cli-mistral-vibe` executor kind in the deep-loop runtime, its fan-out adapter, its tests and the deep-loop YAML branches. No change to any other kind's behavior, to the dispatch hook library or to `.vibe/`.

**Dependencies**:
- 007-dispatch-recognition-and-hard-rules. The adapter's command must pass the Vibe hard rules 007 enforces. The phase plan lists 007 as this phase's only dependency.
- `MISTRAL_API_KEY` for the end-to-end lineage run. It is unset today (Measured Behavior).

**Deliverables**:
- `cli-mistral-vibe` in `executor-config.ts`, `executor-audit.ts` and `fanout-run.cjs`.
- A stress fixture, `live-contracts.json` and matrix manifest rows, and the deep-loop YAML branches.
- One recorded research lineage that ran end to end.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop fan-out runs a lineage only through an executor kind with its own adapter, env allowlist and recursion guard, and none of the seven runtime, test and command files searched in Measured Behavior mentions Vibe. A research or review run cannot use Vibe as an executor, so Mistral's models are unreachable from deep loops through Vibe.

### Purpose
A deep-loop run can name `cli-mistral-vibe` as an executor kind, and each Vibe lineage runs isolated and is scored from its `export.json`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c 'cli-mistral-vibe|vibe' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/live-contracts.json .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml; echo "exit=$?"
exit=1
$ rg -n 'RECURSION_GUARD_EXIT_CODE =|^  .cli-deepseek-harness.: .dsh.' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
26:export const RECURSION_GUARD_EXIT_CODE = 3;
74:  'cli-deepseek-harness': 'dsh',
$ cd .skilled/skills/system-deep-loop/runtime && npx --no-install vitest run --no-coverage tests/unit/executor-config.vitest.ts tests/unit/executor-audit.vitest.ts tests/unit/fanout-run.vitest.ts 2>&1 | tail -6
 Test Files  3 passed (3)
      Tests  365 passed (365)
   Start at  14:14:04
   Duration  196.44s (transform 376ms, setup 239ms, import 698ms, tests 195.61s, environment 1ms)
$ rg -n "'partial'" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
3571:      status: 'partial',
4321:  jsonOut({ status: exitCode === 0 ? 'ok' : 'partial', run_id: runId, results, summary: finalSummary });
$ [ -z "$MISTRAL_API_KEY" ] && echo "MISTRAL_API_KEY unset"
MISTRAL_API_KEY unset
$ vibe --version
vibe 3.1.2
```
Line 26 matters because Vibe also uses exit 3, for a run stopped without finishing. Line 74 shows the binary table holds one name per kind, and Vibe needs two. The two `'partial'` lines are run-level statuses, so no per-lineage partial outcome exists yet.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `cli-mistral-vibe` to `EXECUTOR_KINDS` and `EXECUTOR_KIND_FLAG_SUPPORT` with `model`, `timeoutSeconds` and `liveTools`, no `reasoningEffort`, and a sandbox request that fails closed. Add `VIBE_SUPPORTED_MODELS` and `isVibeSupportedModel`, holding only aliases whose model row pins `thinking`.
- Add `buildVibeLineageCommand` to `LINEAGE_COMMAND_ADAPTERS` in `fanout-run.cjs`: PATH and version preflight, roster check, a lineage-local `VIBE_HOME`, `--output-dir` in the lineage folder and `--trust`.
- Extend `executor-audit.ts`: the `VIBE_` prefix and `MISTRAL_API_KEY` in the env allowlist, `VIBE_HOME` as lineage state, and recursion detection for both `vibe` and `vibe-rs`.
- Record a per-lineage outcome read from `export.json`: exit 3 records partial and never counts as success. No per-lineage partial exists today, so this phase defines it.
- Add the stress fixture, the `live-contracts.json` and matrix manifest rows, and the deep-research and deep-review YAML branches.

### Out of Scope
- The ACP supervisor - deferred as an optional second dispatch mode, worth building only after print mode is proven. The adapter builds print mode only.
- Sandbox mode - deferred because Vibe has no CLI or config field for it. The kind rejects a sandbox request rather than pretending to confine.
- The session-relaunch loop - deferred because Vibe has no idle or compaction event and only an outer supervisor could drive it. A lineage is one process per iteration.
- Turn-stopping guards such as completion-evidence and ask-surface - deferred because Vibe has no strict `post_agent` event, so they are not portable. Lineage scoring reads `export.json` instead.
- Hub routing and advisor vocabulary - phase 010 owns them.
- Any change to default models - DevPass stays the default and no deep-loop default executor changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Kind, flag support, sandbox, web-search and MCP rows, `VIBE_SUPPORTED_MODELS` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Env allowlist, `VIBE_HOME` state, two-name recursion detection |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `buildVibeLineageCommand`, `export.json` scoring |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts` | Modify | Unit cases for the new kind |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts` | Create | Stress fixture for the adapter |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/live-contracts.json`, `matrix-manifest.ts` | Modify | The new kind in the live contract and matrix |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-review-auto.yaml` | Modify | `if_cli_mistral_vibe` branches |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `cli-mistral-vibe` is an executor kind that accepts `model`, `timeoutSeconds` and `liveTools` and rejects `reasoningEffort` and any sandbox request |
| REQ-002 | `isVibeSupportedModel` accepts only aliases in `VIBE_SUPPORTED_MODELS`, each backed by a model row that pins `thinking` |
| REQ-003 | `buildVibeLineageCommand` refuses a missing binary, a version other than 3.1.2 and an off-roster model, and builds a command with a lineage-local `VIBE_HOME`, `--output-dir` and `--trust` |
| REQ-004 | The env allowlist passes `VIBE_`-prefixed variables and `MISTRAL_API_KEY` to a Vibe lineage, and the lineage's own `VIBE_HOME` replaces an inherited one |
| REQ-005 | The recursion guard detects a Vibe ancestor under either `vibe` or `vibe-rs` |
| REQ-006 | A Vibe exit 3 is recorded as partial on the lineage result and never counted as success, and is told apart from the recursion guard's exit 3 |
| REQ-007 | One keyed Vibe lineage runs a research iteration end to end, in the smallest fan-out the `if_cli_mistral_vibe` branch accepts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | The stress fixture, `live-contracts.json` and matrix manifest name the new kind |
| REQ-009 | The deep-research and deep-review YAMLs carry an `if_cli_mistral_vibe` branch |
| REQ-010 | The executor unit and stress suites pass with no existing case edited |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A keyed fan-out run with one `cli-mistral-vibe` lineage beside a second executor group writes a Vibe research iteration and an `export.json` whose `exit_code` is 0.
- **SC-002**: A shimmed `vibe` that writes an export with `exit_code` 3 and exits 3 leaves its lineage recorded partial and not succeeded. The kind's flag support has no budget field, so the keyed path cannot request a turn cap.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `MISTRAL_API_KEY`, unset today (Measured Behavior) | High: REQ-007 and SC-001 cannot pass without it | Every other requirement is provable offline with shims. REQ-007 stays `Unmet` until the operator exports the key |
| Dependency | Model aliases for `VIBE_SUPPORTED_MODELS` come from the model rows phase 006 writes, and 006 is not in this phase's dependency chain | Med | Setup reads the rows from phase 006's config. If 006 has not landed, the roster task waits and goal.md records it |
| Risk | Vibe's exit 3 and `RECURSION_GUARD_EXIT_CODE` 3 collide, so a guard refusal could score as a partial run | High | A guard refusal never launches Vibe and leaves no `export.json`. Scoring reads `export.json` first, and its absence means failure |
| Risk | The runner records each lineage as fulfilled or rejected, with `'partial'` only at run level (Measured Behavior) | Med | Setup locates the lineage result record, and the phase adds a per-lineage outcome field rather than reusing the run status |
| Risk | The `VIBE_` prefix also passes an inherited `VIBE_HOME` or `VIBE_CWD` | Med | `VIBE_HOME` joins the lineage state table, as `DSH_HOME` does, and the adapter sets it last |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The adapter preflight spawns `vibe --version` once per lineage and makes no network call.
- **NFR-P02**: A lineage that passes `timeoutSeconds` is stopped at that limit, as other kinds are.

### Security
- **NFR-S01**: `MISTRAL_API_KEY` reaches Vibe through the environment only, never through argv.
- **NFR-S02**: No lineage writes to the operator's `~/.vibe`. Every run uses its own `VIBE_HOME` under the lineage folder.

### Reliability
- **NFR-R01**: A lineage with no `export.json` scores failure, never success or partial.
- **NFR-R02**: A lineage is scored from `export.json`, never stdout, because a run with denied tool calls can still exit 0.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a lineage with no `MISTRAL_API_KEY` exits 1 with `Missing MISTRAL_API_KEY`, as research section 2's unauthenticated run did, and scores failure.
- Maximum input: a lineage that Vibe stops on a turn, token, price or time limit exits 3 and is recorded partial.
- Failure path: `vibe` absent from PATH or a version other than 3.1.2 throws an input error before launch, as `buildDshLineageCommand` does for dsh.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | Three runtime files, four test files, two YAMLs and two stress manifests |
| Risk | 15/25 | Shared executor tables, the exit 3 collision and the inherited-env path |
| Research | 9/20 | Process name, catalog membership and alias source wait on phases 004 and 006 |
| **Total** | **41/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a lineage show as `vibe` or `vibe-rs` in the ancestor walk? UNKNOWN until phase 004. The guard matches both.
- Does Mistral's catalog list `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` for Vibe without a hand-written row? UNKNOWN until phase 004. A hand-written row pins them either way.
- Does this phase wait on phase 006 for the model aliases, although the phase plan's graph lists only 007?
- Does `--prompt-file` alone run print mode, or does it need `-p`? The adapter prefers `--prompt-file` so the prompt stays out of the process list.
<!-- /ANCHOR:questions -->

---
