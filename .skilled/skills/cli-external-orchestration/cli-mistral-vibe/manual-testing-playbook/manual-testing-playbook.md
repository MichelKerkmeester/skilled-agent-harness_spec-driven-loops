---
title: "cli-mistral-vibe: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, evidence rules, orchestration guidance and per-scenario validation files for the cli-mistral-vibe skill."
version: 1.0.4.0
---

# cli-mistral-vibe: Manual Testing Playbook

> **EXECUTION POLICY**: Live Vibe scenarios use the real `vibe` binary and never a mock. The CLI adapter stress matrix runs checked-in Vitest cells against shims and fixtures; those cells do not start `vibe` or contact a provider. A scenario that already holds a saved capture cites and records that basis. The only allowed verdicts are `PASS`, `FAIL` and `SKIP`. A `SKIP` names a specific blocker and a re-run condition.

> **RECURSION BOUNDS**: A Vibe dispatch is refused inside a Vibe child, by the self-invocation refusal in [SKILL.md](../SKILL.md), which reads `VIBE_SESSION=1`, and inside a fan-out lineage. The fan-out scenario needs a runtime that carries the `cli-mistral-vibe` executor kind. The executor kind is experimental, and a lineage runs with `--auto-approve` and without confinement; the runner renders the repository's guard hooks into its home.

This document is the operator directory and package-level validation contract for the `cli-mistral-vibe` skill. It defines the realistic requests, deterministic command notation, evidence expectations, review rules, wave planning, category summaries, automated-test anchors and links to the thirty-seven operator scenarios and the fourteen adapter stress cells.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL` or `SKIP`
> outcome, its reason and its evidence path are recorded in the scenario file's
> `Recorded Result` block.

---

This playbook package follows the Feature Catalog split-document pattern. The root document owns shared policy and the directory index. Each category file owns one scenario's full execution truth.

Canonical package artifacts:

- `manual-testing-playbook.md`
- `cli-invocation/`
- `model-dispatch/`
- `hard-rules/`
- `guards/`
- `mirrors/`
- `goal-hook/`
- `fanout/`
- `hub-routing/`
- `hook-scenarios/`
- `stress/`

---

## 1. OVERVIEW

### Purpose

This playbook provides thirty-seven operator scenarios across nine category folders, plus fourteen adapter stress cells, validating the `cli-mistral-vibe` skill surface. Each scenario keeps its category identifier and links to one dedicated file with the complete execution contract.

### When to Use

- You are about to rely on a Vibe dispatch and need the current behavior confirmed rather than assumed.
- A rule, mirror, guard or hook changed and you need to know which checks still hold.
- A release decision needs evidence for the print-mode contract, the closed roster, the guard suites or the routing row.

### Realistic Test Model

1. A realistic user request reaches an orchestrator that has decided to use Mistral Vibe for one bounded task.
2. The orchestrator reads the dispatch shape, picks one roster alias, composes the prompt with the persona inlined and keeps the run outside the checkout.
3. The operator captures the exact command, the scratch folder, the disposable home, stdout, stderr and the exit code separately.
4. The scenario passes only when its stated signals appear and the user-visible outcome is useful. A named blocker produces `SKIP`, never an assumed success.

### What Each Scenario File Explains

- The realistic user request that should trigger the Vibe route.
- The exact Vibe-facing prompt.
- The expected route, alias, home and workspace choices.
- The observable signals and the evidence to capture.
- The desired user-visible outcome.
- The source files that justify the contract.

Coverage note: this package covers print-mode invocation, the keyed roster alias, the seven hard rules and their sidecar, the spec-gate suite, the three generated mirrors, the goal hook suite and its first-turn injection, the adapter stress cells, and the routing front door and decision. The keyed scenarios cite saved captures from earlier runs; this review did not start `vibe`. The fourteen stress cells are hermetic and need no live provider step.

---

## 2. GLOBAL PRECONDITIONS

1. The working directory is the repository root and contains `.git/`.
2. For any live Vibe step, `command -v vibe` returns a path and `vibe --version </dev/null` reports `vibe 3.1.2`.
3. Every live Vibe command runs from a scratch folder created by `mktemp -d`, never from the repository root.
4. Every live Vibe command sets `VIBE_HOME` to a disposable folder inside that scratch folder, on the same command line as the run.
5. The dispatch copies `$REPO/.vibe/config.toml` into that home before the run, so the two roster rows and `allowed_models` are present.
6. `MISTRAL_API_KEY` is exported in the child's environment for a keyed step. No key value appears in a prompt, a command line or a file in the checkout.
7. The operator does not start Vibe from inside a Vibe child or a fan-out lineage.
8. A cite-only scenario names a recorded evidence path that exists on disk, and the operator reads the field from that file before citing it.
9. No scenario is destructive. Every live command runs in a scratch folder, and the only writes it may make stay inside that folder.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The realistic user request and the exact Vibe prompt.
- The complete command sequence, including the scratch folder and the `VIBE_HOME` path.
- Vibe stdout, stderr and the exit code, kept in separate files.
- The `out/export.json` pair `exit_code` and `outcome`, with `stop_reason` and `error` when the run did not finish.
- `config.active_model` and the row it points at, so the alias is read from the record rather than inferred.
- For generator and test runs, the printed counts and the exit code.
- The cited evidence path when a scenario reads a saved capture instead of launching Vibe.
- The final user-visible outcome and a `PASS`, `FAIL` or `SKIP` verdict with a reason.

---

## 4. DETERMINISTIC COMMAND NOTATION

- A Vibe dispatch is written as `vibe -p TEXT ... </dev/null`, with the prompt in the argument.
- Config isolation is written as `VIBE_HOME="$RUN_DIR/.vibe-home" vibe ...`.
- Shell checks are written as `bash: <command>`.
- Runtime requests are written as `agent: <instruction>`.
- `->` separates sequential steps in a command-sequence cell.
- `export.json` is read as one object. The verdict is the pair `exit_code` plus `outcome`.
- An exit code is supporting evidence. It never replaces the `export.json` pair.
- A recorded capture is read with a `node -e` reader that prints the fields the scenario asserts.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. All thirty-seven linked operator scenario files under the nine category folders
3. The fourteen linked stress files under `stress/`
4. Real command transcripts or cited captured evidence for every executable scenario
5. The scenario coverage map in section 19
6. Triage notes for every `FAIL` or `SKIP` result

### Scenario Acceptance Rules

For each scenario, check:

1. Preconditions and isolation boundaries were satisfied.
2. The exact prompt and command sequence were used.
3. Expected output, file, config or test signals are present.
4. The exit code is recorded as supporting evidence, never as the sole success signal.
5. The verdict rationale is explicit and reproducible.

Scenario verdict:

- `PASS`: every acceptance check in the scenario's declared scope is true.
- `FAIL`: an expected behavior is contradicted, a required command fails for a reason inside the scenario's scope, or the evidence is incomplete without a valid blocker.
- `SKIP`: a specific named blocker prevents the declared check, such as a missing provider credential.

### Feature Verdict Rules

- `PASS`: all mapped scenarios are `PASS`, or a documented `SKIP` sits outside the feature's executable core.
- `FAIL`: any mapped scenario has an unexplained `FAIL`.
- `SKIP`: every mapped scenario is blocked by a named blocker.

### Release Readiness Rule

A release passes only when:

1. No scenario has an unresolved `FAIL`.
2. The print-mode scenario `VIB-CLI-001`, the keyed alias scenario `VIB-MOD-001`, the hard-rule suite `VIB-HR-001` and the spec-gate suite `VIB-GRD-001` have evidence.
3. The mirror suite `VIB-MIR-001`, the goal suite `VIB-GOAL-001`, the adapter stress file `VIB-FAN-001` and both routing scenarios `VIB-ROUTE-001` and `VIB-ROUTE-002` pass on the current tree.
4. All thirty-seven operator IDs and all fourteen stress IDs map to exactly one scenario file.
5. The root document and every scenario file pass the required document checks.

### Root-vs-Scenario Rule

Keep global verdict logic, isolation policy and wave planning here. Keep exact prompts, command transcripts, feature-specific caveats and scenario verdicts in the matching scenario files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records safe execution waves for the manual-testing package. It does not grant Vibe permission to become the outer conductor and it does not relax the dispatch rules.

### Operational Rules

1. Reserve one coordinator on the calling side and do not nest Vibe coordinators.
2. Run static, mirror and guard-suite checks in parallel when they share no mutable state.
3. Serialize live Vibe commands, because home and session state overlap inside a shared home.
4. Pre-assign scenario IDs and their exact files before a wave starts.
5. Use a fresh scratch folder and a fresh `VIBE_HOME` for every live Vibe command.
6. Retain the transcript, `export.json`, stderr and exit code after every wave.
7. Never use a cited capture as evidence for a behavior it did not exercise, and never use a lineage result as evidence for the hard-rule-checked dispatch shape. A result recorded before the home hooks were rendered is not evidence that a guard or the goal slice ran.

### Recommended Wave Layout

- Wave 1, static suites: `VIB-HR-001`, `VIB-HR-002`, `VIB-GRD-001`, `VIB-MIR-001`, `VIB-GOAL-001`, `VIB-FAN-001`.
- Wave 2, cite-only keyed evidence: `VIB-CLI-001`, `VIB-MOD-001`, `VIB-GOAL-002`.
- Wave 3, routing: `VIB-ROUTE-001`, `VIB-ROUTE-002`.
- Wave 4, live hook conversations: `VIB-HK-001` to `VIB-HK-026`, one runner process at a time, because the runner's repository snapshot treats a sibling run's evidence write as a repository change.

### What Belongs In Scenario Files

- One realistic user request and one canonical prompt.
- One exact command sequence.
- Expected signals and captured evidence.
- `PASS`, `FAIL` or `SKIP` criteria.
- Scenario-specific credential, home or workspace boundaries.

---

## 7. CLI INVOCATION (`VIB-CLI-001`)

This category covers the print-mode invocation surface and the one record a caller may trust. The recorded run proves print mode and the outcome record; the isolation rules are checked statically in the hard-rule category.

- `VIB-CLI-001`: [First-turn print-mode run](cli-invocation/first-turn-print-mode.md)

---

## 8. MODEL DISPATCH (`VIB-MOD-001`)

This category covers one keyed request on a roster alias. The run must exit `0` and end with the `0`/`finished` pair, and the alias must resolve to a `mistral`-provider row with `thinking = "max"`.

- `VIB-MOD-001`: [Keyed roster alias dispatch](model-dispatch/keyed-roster-alias-dispatch.md)

---

## 9. HARD RULES (`VIB-HR-001..VIB-HR-002`)

This category covers the seven fail-closed rules and the sidecar the preflight reads. One suite exercises every rule through the shared evaluator; one reader checks the sidecar's count, ids and severities.

- `VIB-HR-001`: [Dispatch rule-check suite](hard-rules/dispatch-rule-check-suite.md)
- `VIB-HR-002`: [Hard-rule sidecar integrity](hard-rules/hard-rule-sidecar-integrity.md)

---

## 10. GUARD SUITES (`VIB-GRD-001`)

This category covers the spec-gate suite in the Vibe repo-guards bundle. The gate must deny an unanswered interactive write and must never deny a child dispatch.

- `VIB-GRD-001`: [Repo-guards spec-gate suite](guards/spec-gate-suite.md)

---

## 11. GENERATED MIRRORS (`VIB-MIR-001`)

This category covers the three generated `.vibe/` trees and their `--check` mode. A drift check fails without writing, so it is safe to run on every review.

- `VIB-MIR-001`: [Sync generator checks](mirrors/sync-generator-checks.md)

---

## 12. GOAL AND CONTEXT HOOK (`VIB-GOAL-001..VIB-GOAL-002`)

This category covers the goal slice renderer and the one `session_start` entry that injects it. The suite proves the three input cases; the recorded first turn proves the slice reached the session.

- `VIB-GOAL-001`: [Goal hook suite](goal-hook/goal-hook-suite.md)
- `VIB-GOAL-002`: [First-turn goal injection](goal-hook/first-turn-goal-injection.md)

---

## 13. FAN-OUT EXECUTOR (`VIB-FAN-001`)

This category covers the shared runtime's `cli-mistral-vibe` adapter through its checked-in stress file. The hermetic cells build the argv, close stdin, apply the budgets and read the outcome; the live probe is the one cell behind a switch.

- `VIB-FAN-001`: [CLI adapter stress cells](fanout/adapter-stress-cells.md)

---

## 14. HUB ROUTING (`VIB-ROUTE-001..VIB-ROUTE-002`)

This category covers the routing front door and the decision behind it. The front door must answer deterministically and fail safe; the compiled decision and the legacy router must both name the mode.

- `VIB-ROUTE-001`: [Front-door compiled decision](hub-routing/front-door-compiled-decision.md)
- `VIB-ROUTE-002`: [Compiled decision and router row](hub-routing/compiled-decision-and-router-row.md)

---

## 15. HOOK AND PLUGIN UTILIZATION (`VIB-HK-001..VIB-HK-026`)

This category covers every Vibe hook, hook part, generated mirror and the hooks renderer through scripted conversations played by the shared conversation runner's `vibe` adapter. Each turn's check reads a journal record or a file the hook wrote, never the reply text alone, because a Vibe deny leaves the session at exit 0.

- `VIB-HK-001`: [Spec gate classify opens the gate for an unbound write request](hook-scenarios/spec-gate-classify-conversation.md)
- `VIB-HK-002`: [Strict spec gate refuses the first write while the gate is open](hook-scenarios/spec-gate-deny-conversation.md)
- `VIB-HK-003`: [Turn-start advisor adds the skill advisor brief once](hook-scenarios/turn-start-advisor-conversation.md)
- `VIB-HK-004`: [Turn-start delivers the turn-end completion advisory once](hook-scenarios/turn-start-completion-advisory-conversation.md)
- `VIB-HK-005`: [Turn start raises the save nudge for a captured answer](hook-scenarios/turn-start-save-nudge-conversation.md)
- `VIB-HK-006`: [Turn start re-injects the goal slice after a compaction](hook-scenarios/turn-start-compaction-reinjection-conversation.md)
- `VIB-HK-007`: [A mid-turn compaction re-injects at the next tool call](hook-scenarios/compaction-post-tool-conversation.md)
- `VIB-HK-008`: [Turn end sends a prose option menu back once](hook-scenarios/turn-end-ask-surface-conversation.md)
- `VIB-HK-009`: [Turn-end leaves a completion advisory and never blocks](hook-scenarios/turn-end-completion-conversation.md)
- `VIB-HK-010`: [Env secret guard refuses a dotenv read](hook-scenarios/env-secret-guard-conversation.md)
- `VIB-HK-011`: [Dispatch preflight refuses a dispatch that breaks a hard rule](hook-scenarios/dispatch-preflight-conversation.md)
- `VIB-HK-012`: [Overlay guard refuses a write an overlay owns](hook-scenarios/overlay-guard-conversation.md)
- `VIB-HK-013`: [MCP route guard refuses a native call with a Code Mode manual](hook-scenarios/mcp-route-guard-conversation.md)
- `VIB-HK-014`: [Git message gate refuses a bad commit message](hook-scenarios/git-message-gate-conversation.md)
- `VIB-HK-015`: [Deep-loop guard refuses a dispatch whose mode disagrees with the registry](hook-scenarios/deep-loop-guard-conversation.md)
- `VIB-HK-016`: [Post-edit quality returns a comment-hygiene finding in the tool result](hook-scenarios/post-edit-quality-conversation.md)
- `VIB-HK-017`: [Dist freshness warns when an edit leaves a watched package's build behind](hook-scenarios/dist-freshness-edit-conversation.md)
- `VIB-HK-018`: [Dist freshness warns when a spec validation command trusts a stale build](hook-scenarios/dist-freshness-shell-conversation.md)
- `VIB-HK-019`: [Injection screen appends its advisory to a fetched page that reads as instructions](hook-scenarios/classifier-injection-screen-conversation.md)
- `VIB-HK-020`: [An answered question becomes one decision record](hook-scenarios/decision-capture-ask-conversation.md)
- `VIB-HK-021`: [Session cleanup writes its log line when the session closes](hook-scenarios/session-cleanup-end-conversation.md)
- `VIB-HK-022`: [Rendered home hooks bind every repository hook](hook-scenarios/render-home-hooks-conversation.md)
- `VIB-HK-023`: [A request that needs a repository skill loads it from the .vibe/skills mirror](hook-scenarios/skills-mirror-conversation.md)
- `VIB-HK-024`: [A request that needs a repository agent spawns it from the .vibe/agents mirror](hook-scenarios/agents-mirror-conversation.md)
- `VIB-HK-025`: [A mirrored prompt from .vibe/prompts runs by name](hook-scenarios/prompts-mirror-conversation.md)
- `VIB-HK-026`: [The manual relaunch tier hands off and a fresh session claims it](hook-scenarios/relaunch-manual-tier-conversation.md)

---

## 16. CLI ADAPTER STRESS MATRIX (`EC-001..EC-014`)

The stress folder is maintained beside this index and covers the adapter's failure and boundary cells. Its cells are hermetic and run from the shared runtime's Vitest file.

- `EC-001`: [Authentication failure](stress/auth-failure.md)
- `EC-002`: [Model or balance failure](stress/model-or-balance.md)
- `EC-003`: [Rate limit](stress/rate-limit.md)
- `EC-004`: [Timeout](stress/timeout.md)
- `EC-005`: [Stdin hang](stress/stdin-hang.md)
- `EC-006`: [Child spec gate](stress/child-spec-gate.md)
- `EC-007`: [Sandbox permission](stress/sandbox-permission.md)
- `EC-008`: [Missing transport](stress/transport-missing.md)
- `EC-009`: [Budget rejection](stress/budget-rejection.md)
- `EC-010`: [Partial lineage death](stress/partial-lineage-death.md)
- `EC-011`: [Orphan cleanup](stress/orphan-cleanup.md)
- `EC-012`: [Worktree collision](stress/worktree-collision.md)
- `EC-013`: [Node modules integrity](stress/node-modules-integrity.md)
- `EC-014`: [Self invocation](stress/self-invocation.md)

---

## 17. CURRENT EXECUTION BOUNDARIES

The print-mode contract is observed. The recorded first turn finished on `deepseek-flash` with `exit_code` `0` and `outcome` `finished`, and the same record carries the alias row with `thinking` `max`. That run passed `--prompt-file`, trusted the checkout root and ran from the root on purpose so the project hook would load, so it does not prove the scratch-cwd isolation; the hard-rule suite checks that shape statically.

The keyed lineage also finished on `deepseek-flash` with `exit_code` `0`, `outcome` `finished` and `steps` `50`. A lineage runs with `--auto-approve`, without confinement and without the repository's guard hooks, so its result applies to the lineage route and not to the hard-rule-checked dispatch shape. That run predates the rendered home hooks, so its journal holds no repository hook record. A later keyed scratch-cwd run with the rendered home file loaded the guards and the goal slice, and a child write went through.

The three generated mirrors are in sync at 11 agent profiles, 56 skill links and 45 prompt stubs. The dispatch rule-check suite passes 64 tests, the spec-gate suite passes 3, the goal-hook suite passes 3, and the adapter stress file passes 22 with the live probe skipped. The goal hook is registered once, and the recorded journal carries the packet's slice in a block tagged `vibe.hookContext: true`.

The routing front door serves the compiled decision for the `cli-external-orchestration` hub: `delegate to vibe` routes to `cli-mistral-vibe`, the activation manifest and the snapshot share policy hash `177d0511...` at generation `5`, and the legacy hub router carries both the mode row and the keyword as the fallback.

---

## 18. AUTOMATED TEST CROSS-REFERENCE

The `cli-mistral-vibe` packet owns the dispatch contract around the `vibe` binary and the `.vibe/` composition layers. The manual playbook remains the operator-visible validation surface for dispatch behavior.

| Test Surface | Coverage | Playbook Overlap |
|---|---|---|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | The seven Vibe hard rules, the documented dispatch line and the enforcement guards | `VIB-HR-001` |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json` | The seven rule ids, messages and severities | `VIB-HR-002` |
| `.vibe/plugins/repo-guards/tests/spec-gate.test.mjs` | The interactive deny and the two child exemptions | `VIB-GRD-001` |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs` | Generated agent profiles, `--check` drift mode | `VIB-MIR-001` |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs` | Generated skill links, `--check` drift mode | `VIB-MIR-001` |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs` | Generated prompt stubs, `--check` drift mode | `VIB-MIR-001` |
| `.skilled/hooks/goal/vibe/goal-vibe.test.mjs` | The bound, no-packet and malformed-input cases | `VIB-GOAL-001` |
| `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | The one `session_start` entry and its composed context | `VIB-GOAL-002` |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts` | Fourteen manifest-indexed adapter cells plus the command and export contracts | `VIB-FAN-001`, `EC-001` to `EC-014` |
| `.skilled/bin/compiled-route.cjs` and `.skilled/bin/lib/compiled-routing/` | The front door, the serving gate and the compiled decision | `VIB-ROUTE-001`, `VIB-ROUTE-002` |
| `.skilled/skills/cli-external-orchestration/hub-router.json` and `mode-registry.json` | The legacy mode row, the keyword class and the mode registration | `VIB-ROUTE-002` |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md` | Dispatch shape, hard rules and success criteria | All scenarios |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The `vibe` conversation adapter: launch, resume, compact, exit and the question box | `VIB-HK-001` to `VIB-HK-026` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-agents-vibe.test.mjs` | Generated agent profiles, including the subagent type Vibe needs to spawn one | `VIB-HK-024` |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Five-section scenario contract, verdicts, index bijection | This root playbook |

No automated test covers a live keyed model turn or a live research lineage. Those stay manual or cited, and the recorded captures carry that part of the verdict.

The operator validator checks structure, verdict vocabulary, prompt synchronization and local links. It does not execute a scenario or judge whether an answer is useful, so the recorded result and its cited evidence carry that part of the verdict.

---

## 19. FEATURE CATALOG CROSS-REFERENCE INDEX

The catalog entry for this mode lives under the `cli-external-orchestration` feature catalog. Each row below links to its scenario file; the catalog column is intentionally absent because the catalog owns its own feature ids.

### CLI INVOCATION

- VIB-CLI-001: [First-turn print-mode run](cli-invocation/first-turn-print-mode.md)

### MODEL DISPATCH

- VIB-MOD-001: [Keyed roster alias dispatch](model-dispatch/keyed-roster-alias-dispatch.md)

### HARD RULES

- VIB-HR-001: [Dispatch rule-check suite](hard-rules/dispatch-rule-check-suite.md)
- VIB-HR-002: [Hard-rule sidecar integrity](hard-rules/hard-rule-sidecar-integrity.md)

### GUARD SUITES

- VIB-GRD-001: [Repo-guards spec-gate suite](guards/spec-gate-suite.md)

### GENERATED MIRRORS

- VIB-MIR-001: [Sync generator checks](mirrors/sync-generator-checks.md)

### GOAL AND CONTEXT HOOK

- VIB-GOAL-001: [Goal hook suite](goal-hook/goal-hook-suite.md)
- VIB-GOAL-002: [First-turn goal injection](goal-hook/first-turn-goal-injection.md)

### FAN-OUT EXECUTOR

- VIB-FAN-001: [CLI adapter stress cells](fanout/adapter-stress-cells.md)

### HUB ROUTING

- VIB-ROUTE-001: [Front-door compiled decision](hub-routing/front-door-compiled-decision.md)
- VIB-ROUTE-002: [Compiled decision and router row](hub-routing/compiled-decision-and-router-row.md)

### HOOK AND PLUGIN UTILIZATION

- VIB-HK-001: [Spec gate classify opens the gate for an unbound write request](hook-scenarios/spec-gate-classify-conversation.md)
- VIB-HK-002: [Strict spec gate refuses the first write while the gate is open](hook-scenarios/spec-gate-deny-conversation.md)
- VIB-HK-003: [Turn-start advisor adds the skill advisor brief once](hook-scenarios/turn-start-advisor-conversation.md)
- VIB-HK-004: [Turn-start delivers the turn-end completion advisory once](hook-scenarios/turn-start-completion-advisory-conversation.md)
- VIB-HK-005: [Turn start raises the save nudge for a captured answer](hook-scenarios/turn-start-save-nudge-conversation.md)
- VIB-HK-006: [Turn start re-injects the goal slice after a compaction](hook-scenarios/turn-start-compaction-reinjection-conversation.md)
- VIB-HK-007: [A mid-turn compaction re-injects at the next tool call](hook-scenarios/compaction-post-tool-conversation.md)
- VIB-HK-008: [Turn end sends a prose option menu back once](hook-scenarios/turn-end-ask-surface-conversation.md)
- VIB-HK-009: [Turn-end leaves a completion advisory and never blocks](hook-scenarios/turn-end-completion-conversation.md)
- VIB-HK-010: [Env secret guard refuses a dotenv read](hook-scenarios/env-secret-guard-conversation.md)
- VIB-HK-011: [Dispatch preflight refuses a dispatch that breaks a hard rule](hook-scenarios/dispatch-preflight-conversation.md)
- VIB-HK-012: [Overlay guard refuses a write an overlay owns](hook-scenarios/overlay-guard-conversation.md)
- VIB-HK-013: [MCP route guard refuses a native call with a Code Mode manual](hook-scenarios/mcp-route-guard-conversation.md)
- VIB-HK-014: [Git message gate refuses a bad commit message](hook-scenarios/git-message-gate-conversation.md)
- VIB-HK-015: [Deep-loop guard refuses a dispatch whose mode disagrees with the registry](hook-scenarios/deep-loop-guard-conversation.md)
- VIB-HK-016: [Post-edit quality returns a comment-hygiene finding in the tool result](hook-scenarios/post-edit-quality-conversation.md)
- VIB-HK-017: [Dist freshness warns when an edit leaves a watched package's build behind](hook-scenarios/dist-freshness-edit-conversation.md)
- VIB-HK-018: [Dist freshness warns when a spec validation command trusts a stale build](hook-scenarios/dist-freshness-shell-conversation.md)
- VIB-HK-019: [Injection screen appends its advisory to a fetched page that reads as instructions](hook-scenarios/classifier-injection-screen-conversation.md)
- VIB-HK-020: [An answered question becomes one decision record](hook-scenarios/decision-capture-ask-conversation.md)
- VIB-HK-021: [Session cleanup writes its log line when the session closes](hook-scenarios/session-cleanup-end-conversation.md)
- VIB-HK-022: [Rendered home hooks bind every repository hook](hook-scenarios/render-home-hooks-conversation.md)
- VIB-HK-023: [A request that needs a repository skill loads it from the .vibe/skills mirror](hook-scenarios/skills-mirror-conversation.md)
- VIB-HK-024: [A request that needs a repository agent spawns it from the .vibe/agents mirror](hook-scenarios/agents-mirror-conversation.md)
- VIB-HK-025: [A mirrored prompt from .vibe/prompts runs by name](hook-scenarios/prompts-mirror-conversation.md)
- VIB-HK-026: [The manual relaunch tier hands off and a fresh session claims it](hook-scenarios/relaunch-manual-tier-conversation.md)

### CLI ADAPTER STRESS MATRIX

- EC-001: [Authentication failure](stress/auth-failure.md)
- EC-002: [Model or balance failure](stress/model-or-balance.md)
- EC-003: [Rate limit](stress/rate-limit.md)
- EC-004: [Timeout](stress/timeout.md)
- EC-005: [Stdin hang](stress/stdin-hang.md)
- EC-006: [Child spec gate](stress/child-spec-gate.md)
- EC-007: [Sandbox permission](stress/sandbox-permission.md)
- EC-008: [Missing transport](stress/transport-missing.md)
- EC-009: [Budget rejection](stress/budget-rejection.md)
- EC-010: [Partial lineage death](stress/partial-lineage-death.md)
- EC-011: [Orphan cleanup](stress/orphan-cleanup.md)
- EC-012: [Worktree collision](stress/worktree-collision.md)
- EC-013: [Node modules integrity](stress/node-modules-integrity.md)
- EC-014: [Self invocation](stress/self-invocation.md)
