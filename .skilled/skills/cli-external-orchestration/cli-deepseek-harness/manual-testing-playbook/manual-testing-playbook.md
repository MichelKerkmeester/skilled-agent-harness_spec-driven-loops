---
title: "cli-deepseek-harness: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, evidence rules, orchestration guidance and per-scenario validation files for the cli-deepseek-harness skill."
version: 1.0.4.0
---

# cli-deepseek-harness: Manual Testing Playbook

> **EXECUTION POLICY**: Live dsh scenarios use the real binary and never a mock. The CLI adapter stress matrix runs checked-in Vitest tests against shims and fixtures; those cells do not start dsh or contact a provider. A scenario that already holds a saved capture cites and records that basis. The only allowed verdicts are `PASS`, `FAIL` and `SKIP`. The OpenCode Go follow-up records `SKIP` while `OPENCODE_API_KEY` is unset.

> **RECURSION BOUNDS**: A dsh dispatch is refused inside a dsh child and inside a fan-out lineage. The fan-out scenario also needs a runtime that carries the `cli-deepseek-harness` executor kind. The LLM Gateway lineage is verified. The executor kind remains experimental while dsh is a release candidate.

This document is the operator directory and package-level validation contract for the `cli-deepseek-harness` skill. It defines the realistic requests, deterministic command notation, evidence expectations, review rules, wave planning, category summaries, automated-test anchors and links to the 25 canonical scenario files.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL` or `SKIP`
> outcome and reason are recorded into
> `cli-deepseek-harness/benchmark/reports/<dated-run-label>/`.

---

This playbook package follows the Feature Catalog split-document pattern. The root document owns shared policy and the directory index. Each category file owns one scenario's full execution truth.

Canonical package artifacts:

- `manual-testing-playbook.md`
- `cli-invocation/`
- `patches/`
- `mirrors/`
- `guards/`
- `fanout/`
- `model-dispatch/`
- `stress/`

---

## 1. OVERVIEW

### Purpose

This playbook provides 25 deterministic scenarios across seven categories validating the `cli-deepseek-harness` skill surface. Each scenario keeps its category identifier and links to one dedicated file with the complete execution contract.

### When to Use

- You are about to rely on a dsh dispatch and need the current behavior confirmed rather than assumed.
- A patch, mirror or guard changed and you need to know which checks still hold.
- A release decision needs evidence for the keyless contract, the patch composition or the guard suites.

### Realistic Test Model

1. A realistic user request reaches an orchestrator that has decided to use DeepSeek Harness for one bounded task.
2. The orchestrator reads the dispatch shape, picks one roster route patch, composes the prompt and keeps the run outside the checkout.
3. The operator captures the exact command, the scratch folder, the disposable home, stdout, stderr and the exit code separately.
4. The scenario passes only when its stated signals appear and the user-visible outcome is useful. A named blocker produces `SKIP`, never an assumed success.

### What Each Scenario File Explains

- The realistic user request that should trigger the dsh route.
- The exact dsh-facing prompt.
- The expected route, patch, home and workspace choices.
- The observable signals and the evidence to capture.
- The desired user-visible outcome.
- The source files that justify the contract.

Coverage note: this package covers the keyless boot contract on both roster routes, the repo-root refusal, the route and lineage composition, the guards and MCP patch additions, the three generated mirrors, the two guard suites, the research lineage, the two keyed roster routes and fourteen hermetic CLI adapter stress cells. The only remaining key-gated live scenario is OpenCode Go, which records `SKIP` while `OPENCODE_API_KEY` is unset. All fourteen stress cells are hermetic and need no live provider step.

---

## 2. GLOBAL PRECONDITIONS

1. The working directory is the repository root and contains `.git/`.
2. For any live dsh step, `command -v dsh` returns a path and `dsh --version </dev/null` reports `0.2.2-rc.3`.
3. Every dsh command runs from a scratch folder created by `mktemp -d`, never from the repository root.
4. Every dsh command sets `DSH_HOME` to a disposable folder inside that scratch folder.
5. Patches are named by absolute path as `"$REPO/.dsh/patches/<file>"`, where `$REPO` is the checkout root and `<file>` is the literal patch file name.
6. The five patch files exist: `route-llmgateway-deepseek.patch.yml`, `route-opencode-go-deepseek.patch.yml`, `lineage.patch.yml`, `guards.patch.yml` and `mcp-code-mode.patch.yml`.
7. A keyless probe runs with neither `LLMGATEWAY_API_KEY` nor `OPENCODE_API_KEY` set. A keyed scenario needs the key variable for its own route.
8. No key value appears in a prompt, a patch or a command line.
9. The operator does not start dsh from inside a dsh child or a fan-out lineage.
10. No scenario is destructive. Every dsh command runs in a scratch folder, and the only writes it may make stay inside that folder.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The realistic user request and the exact dsh prompt.
- The complete command sequence, including the scratch folder and `DSH_HOME` path.
- dsh stdout JSONL, stderr and exit code, kept in separate files.
- The last `final` event with its `reason.kind`, and the `error.code` when the run failed.
- For `--dump-config`, the exit code, the stderr capture, the `agent-default-model` row and the MCP row counts.
- For generator and test runs, the printed counts and the exit code.
- The cited evidence path when a scenario reads a saved capture instead of launching dsh.
- The final user-visible outcome and a `PASS`, `FAIL` or `SKIP` verdict with a reason.

---

## 4. DETERMINISTIC COMMAND NOTATION

- A dsh dispatch is written as `dsh --profile headless ... -`, with the prompt on stdin.
- Config isolation is written as `DSH_HOME="$RUN_DIR/.dsh-home" dsh ...`.
- Patches are written as `--patch "$REPO/.dsh/patches/<file>"`.
- Shell checks are written as `bash: <command>`.
- Runtime requests are written as `agent: <instruction>`.
- `->` separates sequential steps in a command-sequence cell.
- A JSONL stream is parsed one line at a time. The last line is the completion signal.
- An exit code is supporting evidence. It never replaces the `final` event.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. All 25 linked scenario files under the seven category folders
3. Real command transcripts or cited captured evidence for every executable scenario
4. The scenario coverage map in section 15
5. Triage notes for every `FAIL` or `SKIP` result

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
2. The keyless baseline `CLI-001`, the refusal check `CLI-002` and the three patch scenarios `PAT-001` to `PAT-003` have evidence.
3. The mirror and guard suites `MIR-001`, `GRD-001` and `GRD-002` pass on the current tree.
4. The remaining key-gated scenario, `MDL-002`, carries a specific `SKIP` blocker and a re-run condition.
5. All 25 root-index IDs map to exactly one scenario file.
6. The root document and every scenario file pass the required document checks.

### Root-vs-Scenario Rule

Keep global verdict logic, isolation policy and wave planning here. Keep exact prompts, command transcripts, feature-specific caveats and scenario verdicts in the matching scenario files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records safe execution waves for the manual-testing package. It does not grant dsh permission to become the outer conductor and it does not relax the dispatch rules.

### Operational Rules

1. Reserve one coordinator on the calling side and do not nest dsh coordinators.
2. Run static, mirror and guard-suite checks in parallel when they share no mutable state.
3. Serialize live dsh commands, because profile and session state overlap inside a shared home.
4. Pre-assign scenario IDs and their exact files before a wave starts.
5. Use a fresh scratch folder and a fresh `DSH_HOME` for every dsh command.
6. Retain the transcript, JSONL, stderr, exit code and blocker classification after every wave.
7. Never use a keyless result as evidence for a keyed scenario, or a result from one route as evidence for the other.

### Recommended Wave Layout

- Wave 1, static and mirror checks: `MIR-001`, `GRD-001` and `GRD-002`. The `GRD-002` run also supplies `CLI-002`.
- Wave 2, cite-only patch evidence: `CLI-001`, `PAT-001`, `PAT-002`, `PAT-003`.
- Wave 3, key-gated routes and lineage: `MDL-001`, `MDL-002`, `FAN-001`.

### What Belongs In Scenario Files

- One realistic user request and one canonical prompt.
- One exact command sequence.
- Expected signals and captured evidence.
- `PASS`, `FAIL` or `SKIP` criteria.
- Scenario-specific credential, home or workspace boundaries.

---

## 7. CLI INVOCATION (`CLI-001..CLI-002`)

This category covers the keyless boot contract on each roster route and the dispatch hook refusal that keeps a run out of the repository root.

- `CLI-001`: [Keyless boot per route](cli-invocation/keyless-boot-per-route.md)
- `CLI-002`: [Repository-root dispatch refusal](cli-invocation/repo-root-dispatch-refusal.md)

---

## 8. PATCH COMPOSITION (`PAT-001..PAT-003`)

This category checks what each patch changes in the composed config. The route and lineage pair must compose without a loader warning. The guards patch must load the bundle. The MCP patch must add exactly one `code_mode` client row and nothing more.

- `PAT-001`: [Route and lineage composition](patches/route-and-lineage-composition.md)
- `PAT-002`: [Guards patch boot](patches/guards-patch-boot.md)
- `PAT-003`: [MCP Code Mode row](patches/mcp-code-mode-row.md)

---

## 9. GENERATED MIRRORS (`MIR-001`)

This category covers the three generated `.dsh/` trees and their `--check` mode. A drift check fails without writing, so it is safe to run on every review.

- `MIR-001`: [Sync generator checks](mirrors/sync-generator-checks.md)

---

## 10. GUARD SUITES (`GRD-001..GRD-002`)

This category covers the two test suites that protect the dsh dispatch path. One suite exercises the repo-guards plugin adapters. The other exercises the dispatch hook rules, including the repo-root refusal.

- `GRD-001`: [Repo-guards plugin suite](guards/repo-guards-plugin-suite.md)
- `GRD-002`: [Dispatch rule-check suite](guards/dispatch-rule-check-suite.md)

---

## 11. FAN-OUT EXECUTOR (`FAN-001`)

This category covers the research lineage on the `cli-deepseek-harness` executor kind. The kind is registered, experimental and kept out of every default allowlist, so the scenario needs an explicit kind and a provider key.

- `FAN-001`: [Deep-research lineage](fanout/deep-research-lineage.md)

---

## 12. MODEL DISPATCH (`MDL-001..MDL-002`)

This category covers one keyed request per roster route. Each run must exit 0 and end on a `final` event with `reason.kind` `completed`. The harness owns model selection, so the route patch is the model choice.

- `MDL-001`: [LLM Gateway route](model-dispatch/llmgateway-route.md)
- `MDL-002`: [OpenCode Go route](model-dispatch/opencode-go-route.md)

---

## 13. CURRENT EXECUTION BOUNDARIES

The keyless contract is observed. Both roster routes exit 1 with `MISSING_CREDENTIAL` and name their own key variable. The LLM Gateway `deepseek-v4.1-flash-1017` keyed run completed on 2026-11-06 with exit 0, a `completed` final reason and empty stderr.

OpenCode Go `deepseek-v4.1-flash` was proven on 2026-11-07 with an API key against `https://opencode.ai/zen/go/v1` and stays out of every default allowlist. `MDL-002` remains recorded as `SKIP` from a keyless environment and is worth re-running now that the route is proven. The patch scenario verdicts may be judged from saved captures. Their command blocks reproduce the runs.

The hub routes to this mode only on harness vocabulary. The shared runtime carries its executor kind, and `.dsh/` contains all five patches. One LLM Gateway research lineage also completed with a clean containment scan.

---

## 14. AUTOMATED TEST CROSS-REFERENCE

The `cli-deepseek-harness` packet owns the dispatch contract around the `dsh` binary and the `.dsh/` composition layers. The manual playbook remains the operator-visible validation surface for dispatch behavior.

| Test Surface | Coverage | Playbook Overlap |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs` | Generated skill-link farm, `--check` drift mode | `MIR-001` |
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs` | Generated prompt stubs, `--check` drift mode | `MIR-001` |
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs` | Generated persona patches, `--check` drift mode | `MIR-001` |
| `.skilled/hooks/*/tests/dsh-*.test.mjs`, `.skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs` and `.dsh/plugins/repo-guards/tests/` | Fourteen adapter contracts, error policies and the anchored message loader | `GRD-001` |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Thirteen dsh hard rules, repo-root refusal, roster and home checks | `CLI-002`, `GRD-002` |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-deepseek-harness.vitest.ts` | Fourteen manifest-indexed hermetic adapter stress cells | `EC-001` to `EC-014` |
| `.dsh/patches/route-llmgateway-deepseek.patch.yml` | LLM Gateway provider row and default model row | `PAT-001`, `MDL-001` |
| `.dsh/patches/route-opencode-go-deepseek.patch.yml` | OpenCode Go provider row and default model row | `PAT-001`, `MDL-002` |
| `.dsh/patches/lineage.patch.yml` | Telemetry off, session log off, goal and plan off | `PAT-001`, `PAT-002` |
| `.dsh/patches/guards.patch.yml` | Repo-guards plugin insertion by relative path | `PAT-002` |
| `.dsh/patches/mcp-code-mode.patch.yml` | One `code_mode` stdio client row | `PAT-003` |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` | Dispatch shape, hard rules and success criteria | All scenarios |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Root and scenario markdown structure | This root playbook |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Five-section scenario contract, verdicts, index bijection | This package |

No automated test covers a keyed model turn, a live research lineage or the OpenCode Go route. Those stay manual.

The operator validator checks structure, verdict vocabulary, prompt synchronization and local links. It does not execute a scenario or judge whether an answer is useful, so the recorded result and its cited evidence carry that part of the verdict.

---

## 15. FEATURE CATALOG CROSS-REFERENCE INDEX

No feature catalog exists for this packet, so each row links to its scenario file and the catalog column is intentionally absent.

### CLI INVOCATION

- CLI-001: [Keyless boot per route](cli-invocation/keyless-boot-per-route.md)
- CLI-002: [Repository-root dispatch refusal](cli-invocation/repo-root-dispatch-refusal.md)

### PATCH COMPOSITION

- PAT-001: [Route and lineage composition](patches/route-and-lineage-composition.md)
- PAT-002: [Guards patch boot](patches/guards-patch-boot.md)
- PAT-003: [MCP Code Mode row](patches/mcp-code-mode-row.md)

### GENERATED MIRRORS

- MIR-001: [Sync generator checks](mirrors/sync-generator-checks.md)

### GUARD SUITES

- GRD-001: [Repo-guards plugin suite](guards/repo-guards-plugin-suite.md)
- GRD-002: [Dispatch rule-check suite](guards/dispatch-rule-check-suite.md)

### FAN-OUT EXECUTOR

- FAN-001: [Deep-research lineage](fanout/deep-research-lineage.md)

### MODEL DISPATCH

- MDL-001: [LLM Gateway route](model-dispatch/llmgateway-route.md)
- MDL-002: [OpenCode Go route](model-dispatch/opencode-go-route.md)

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
