---
title: "Spec: Scheduler/Runner cli-opencode Dispatch Wiring"
description: "Wire the behavior-benchmark runner (and, where needed, the scheduler) to dispatch a scenario through the canonical cli-opencode invocation — opencode run --model … --variant … --format json --dir … — honoring cli-opencode SKILL.md rules: child spec-gate env (MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1), no --agent, closed stdin, and provider auth pre-flight. Runtime-affecting."
trigger_phrases:
  - "scheduler opencode dispatch wiring"
  - "behavior-bench-run LEG_TABLE opencode leg"
  - "cli-opencode dispatch contract benchmark"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/002-scheduler-opencode-dispatch"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 spec"
    next_safe_action: "Wire runner dispatch on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-002-scheduler-opencode-dispatch-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: Scheduler/Runner cli-opencode Dispatch Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned — not yet implemented |
| **Spec Folder** | 002-scheduler-opencode-dispatch |
| **Parent** | 015-command-benchmark-cli-opencode-driver |
| **Verification** | `buildSpawnArgs("cli-opencode", contract)` renders the canonical opencode invocation with no `--agent`; existing legs' `buildSpawnArgs` output is byte-identical; child spec-gate env is injected on the opencode dispatch |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The runner `behavior-bench-run.cjs` builds a leg's spawn command from a fixed `LEG_TABLE`
keyed by `legName`. Its opencode entries today (`deepseek`, `gpt-fast-high`, `gpt-fast-med`,
`glm-max`) do NOT match the cli-opencode canonical contract: the `deepseek` entry omits
`--variant` and `--dir`, none carry the child spec-gate env
(`MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`), and `buildSpawnArgs` reads model/variant only from
the hard-coded table — it never consumes the matrix cell's `executor` block that child 001
introduces. So a cli-opencode **driver** leg cannot dispatch through the canonical invocation.

### Purpose
Wire the runner (and, where the model/variant must travel from the matrix cell, the scheduler) so
the new `cli-opencode` leg dispatches through
`opencode run --model <m> --variant <v> --format json --dir <repo-root>`, honoring every
cli-opencode SKILL.md rule that applies to a non-interactive one-shot dispatch. Keep the three
frozen legs' spawn output byte-identical.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `cli-opencode` `LEG_TABLE` entry whose base renders the canonical invocation:
  `opencode run --model deepseek/deepseek-v4-pro --variant high --dangerously-skip-permissions`
  (the existing legs already pass `--dangerously-skip-permissions`; `--format json` and the prompt
  are appended by `buildSpawnArgs`).
- Make model/variant **selectable**: plumb them from the matrix cell's `executor` block (child 001)
  to the spawn command. Because the runner receives only `--scenario`/`--leg`/`--out-dir`/`--samples`
  from the scheduler today, choose one seam (see ARCHITECTURE): (a) per-model `LEG_TABLE` keys,
  (b) new `--model`/`--variant` runner flags passed by the scheduler `invokeRunner`, or
  (c) the existing `BEHAVIOR_BENCH_SPAWN_JSON` env seam.
- Append `--dir <repo-root>` per the cli-opencode default invocation.
- Inject the child spec-gate env on the opencode child spawn:
  `env: { ...process.env, MK_SPEC_GATE_ENFORCE: "0", AI_SESSION_CHILD: "1" }` (belt-and-suspenders
  for wrapper/worktree isolation, per SKILL.md ALWAYS rule 17).
- NOT pass `--agent` (SKILL.md ALWAYS rule 3 / Default Invocation note); role, if any, goes in the
  prompt body.

### Out of Scope
- The matrix schema/`driverLegs`/`requiredCellCount` change — that is child 001.
- End-to-end capture, evidence assertions, tests, and regression proof — child 003.
- Changing the claude-cli / gpt-fast-* legs' `LEG_TABLE` entries or `buildSpawnArgs` output.
- Wiring alignment fan-out (the driver leg is a direct runner dispatch and does not use fan-out).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs` | Modify | Add `cli-opencode` `LEG_TABLE` entry, plumb model/variant, add `--dir`, inject child spec-gate env |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs` | Modify (conditional) | Only if seam (b) is chosen: pass `--model`/`--variant` from the cell `executor` to the runner |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `cli-opencode` leg dispatches the canonical invocation | Rendered argv is `opencode run --model <m> --variant <v> --dangerously-skip-permissions [--command …] --format json --dir <root> <prompt>` |
| REQ-002 | No `--agent` flag is present | The rendered argv contains no `--agent` token |
| REQ-003 | Child spec-gate env is injected | The opencode child spawn env sets `MK_SPEC_GATE_ENFORCE=0` and `AI_SESSION_CHILD=1` |
| REQ-004 | Existing legs stay byte-stable | `buildSpawnArgs` output for `claude-cli`, `gpt-fast-high`, `gpt-fast-med` is byte-identical to before |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Model/variant is selectable from the matrix cell | The default `deepseek/deepseek-v4-pro` + `high` renders, and an overridden `executor` renders its values |
| REQ-006 | Closed stdin (no hang) is preserved | The child is spawned with `stdio: ['ignore', …]` (structural equivalent of `</dev/null`) |
| REQ-007 | Provider auth failures map to the retryable path | A quota/auth rejection produces `EXIT_ENV` (75) → scheduler records `retryable` |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A unit test asserts the `cli-opencode` leg renders the exact canonical argv with no `--agent`.
- **SC-002**: A unit test asserts `buildSpawnArgs` for the three frozen legs is byte-identical to a pre-change snapshot.
- **SC-003**: The opencode child spawn is observed (test/inspection) to carry `MK_SPEC_GATE_ENFORCE=0` and `AI_SESSION_CHILD=1`.
- **SC-004**: The dispatch matches the cli-opencode SKILL.md contract (default model/variant/format/dir, no `--agent`), verifiable in the rendered command.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shipped runner is shared by other benchmarks | A `buildSpawnArgs` change could ripple | Add a new leg key; do not alter existing entries; snapshot-test the frozen legs |
| Risk | Model/variant plumbing seam choice | Wrong seam couples runner to scheduler awkwardly | Prefer the seam that needs the fewest cross-file changes; document the decision |
| Risk | Global env injection | Setting env for ALL opencode legs could shift behavior | Scope the env to the `cli-opencode` leg (or accept it is inert since other legs are skipped) |
| Dependency | Child 001 (`executor` block on cells) | Model/variant source | Land 001 first, or default in the runner until the cell carries it |
| Dependency | cli-opencode SKILL.md contract | Canonical flags + rules | Read SKILL.md before composing the dispatch (SKILL.md §3, ALWAYS 3/5/6/11/17) |
| Risk | Self-invocation guard (ADR-001) | If the benchmark itself runs inside opencode, children are sub-sessions | `AI_SESSION_CHILD=1` makes the child share the parent worktree; the runner spawns opencode as an external process, not a self-dispatch |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Compatibility
- **NFR-C01**: Runner CLI surface (`--scenario/--leg/--out-dir/--samples/--timeout-ms/--watchdog-ms/--baseline/--repo-root`) stays backward compatible; any new flag is additive and optional.
- **NFR-C02**: Exit-code contract unchanged (`0 OK`, `2 CONTRACT`, `3 INTERNAL`, `75 ENV`).

### Determinism
- **NFR-D01**: The rendered argv is a pure function of `(legName, contract, executor)` — no wall-clock or env-derived nondeterminism in the argv itself.


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Invocation shape
- **Command-kind scenario**: `buildSpawnArgs` pushes `--command <family>/<name>` before `--format json` for opencode legs — the new leg inherits that path; verify a command-kind scenario renders `--command`.
- **Prompt-kind scenario**: no `--command`; prompt appended last.
- **Missing `executor` on a cell**: fall back to the leg default (`deepseek/deepseek-v4-pro` + `high`).

### Dispatch safety
- **Closed stdin**: `stdio: ['ignore', 'pipe', 'pipe']` already gives immediate EOF — the SKILL.md `</dev/null` rule is satisfied structurally because there is no shell; do NOT add a literal `</dev/null` string into argv.
- **Provider missing/unauthed**: the model never runs; `ENV_ERROR_RE` + fast terminal → `EXIT_ENV` (75) → scheduler `retryable`. Do not silently substitute a model (SKILL.md ALWAYS rule 11).
- **`--dir` vs `cwd`**: the child already spawns with `cwd: repoRoot`; `--dir <repo-root>` is redundant-but-canonical and pins against CWD ambiguity.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **Plumbing seam**: per-model `LEG_TABLE` keys vs new `--model/--variant` runner flags vs the
  `BEHAVIOR_BENCH_SPAWN_JSON` env seam? **UNKNOWN** — pick the lowest-coupling option; likely new
  optional runner flags fed by the scheduler `invokeRunner` from the cell `executor`.
- **Env scope**: inject the child spec-gate env for the `cli-opencode` leg only, or for all opencode
  legs? **UNKNOWN** — leg-scoped is safest for byte-stability arguments.
- **Provider auth pre-flight placement**: run `opencode providers` once before the matrix run
  (scheduler-level), or rely on the runner's `EXIT_ENV` retryable path? **UNKNOWN**.


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Upstream schema**: See `../001-driver-leg-and-matrix-schema/spec.md`
- **Successor phase**: See `../003-integration-evidence-and-tests/spec.md`
- **Parent Spec**: See `../spec.md`

<!-- /ANCHOR:related-docs -->
