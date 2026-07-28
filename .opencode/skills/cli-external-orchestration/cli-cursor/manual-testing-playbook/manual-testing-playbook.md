---
title: "cli-cursor: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-scenario validation files for the cli-cursor skill."
version: 1.0.0.0
---

# cli-cursor: Manual Testing Playbook

> **EXECUTION POLICY**: Every executable scenario MUST be executed for real - not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual `cursor-agent -p` invocations, inspect real outputs, capture real exit codes and verify real behavior. CU-020 is documentation-only by design; it uses source and documentation inspection instead of a live dispatch and defaults to `SKIP` with its named blocker. The only acceptable classifications are PASS, FAIL or SKIP (with a specific blocker documented). "UNAUTOMATABLE" is not a valid status, and neither is "PARTIAL" - this playbook uses strict 3-state PASS/FAIL/SKIP discipline throughout, including the Review Protocol.

> **SELF-INVOCATION GUARD**: This playbook validates the `cli-cursor` skill from a non-Cursor runtime (Claude Code, Codex, OpenCode or shell). Operators MUST NOT execute these scenarios from inside Cursor CLI itself. The skill refuses to load when Cursor env vars (`CURSOR_AGENT`/`CURSOR_CONVERSATION_ID`) or process ancestry are detected. See SKILL.md §2 Self-Invocation Guard.

This document combines the full manual-validation contract for the `cli-cursor` skill into a single reference. The root playbook acts as the operator directory, review protocol and orchestration guide. It explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded and where each per-scenario validation file lives. The per-scenario files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `cli-cursor` skill. The root document acts as the directory, review surface and orchestration guide, while per-scenario execution detail lives in the category folders at the playbook root.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `cli-invocation/`
- `execution-modes/`
- `approvals-and-sandbox/`
- `worktree-isolation/`
- `mcp-integration/`
- `hooks/`
- `session-continuity/`
- `cloud-worker/`
- `prompt-templates/`
- `agents-skills-rules/`

---

## 1. OVERVIEW

This playbook provides 25 deterministic scenarios across 10 categories validating the `cli-cursor` skill surface. Each feature keeps its global `CU-NNN` ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-07-27): Covers the canonical default invocation (`composer-2.5` model + `--output-format text`), the Cursor-specific auth-fail-but-exit-0 safety gotcha, a flag/model-id hallucination-fixture probe (fabricated `--reasoning-effort` and bracket-effort model ids), all three documented execution modes (`--mode plan`, `--mode ask`, default agent), Cursor's real approval/sandbox flags (`--auto-review` Smart Auto, `--force`/`--yolo`, `--sandbox enabled|disabled`), the two Cursor-unique surfaces with no sibling analog (native git worktree isolation via `-w`, and the infra-grade cloud `worker`), MCP client integration (`cursor-agent mcp list`/`list-tools`, `.cursor/mcp.json` precedence, `--approve-mcps`), the editor-shared hooks system (confirmed-fires, confirmed-non-delivery, the unreviewed prebind design, and phase 011's live-fire-confirmed `Task`-matcher dispatch guard), session continuity (`--continue`/`--resume`), prompt-template quality discipline (CLEAR scoring via the canonical card, plus a Composer-specific RCAF dispatch), and the 13-agent/36-command/mirror-integrity roster surfaces added in CU-022..CU-025. Self-invocation refusal is enforced upstream by the skill's detection guard and is not retested here.

### Realistic Test Model

1. A realistic user request is given to an orchestrator running on a non-Cursor runtime (Claude Code, Codex, OpenCode or shell).
2. The orchestrator decides whether to delegate to Cursor CLI via the `cli-cursor` skill, picks the right execution mode, model and approval/sandbox flags, and uses the canonical prompt for the scenario: natural-human by default, RCAF only when the actor is an AI orchestrator constructing a non-trivial dispatch.
3. The operator captures both the dispatch command and the user-visible outcome.
4. The scenario passes only when the dispatch is sound, the Cursor output matches the expected signals and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the delegation
- The orchestrator brief or Cursor-facing prompt that should drive the test
- The expected execution process, including model choice, execution mode, and approval/sandbox flags
- The desired user-visible outcome
- The implementation or skill-doc anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is project root and contains `.git/`.
2. Cursor CLI is installed and on PATH: `command -v cursor-agent` returns a non-empty path. If not installed, run `curl https://cursor.com/install -fsS | bash` first.
3. Cursor CLI is authenticated via Cursor account OAuth: `cursor-agent login` has succeeded. This machine's account is confirmed authenticated at Pro tier (`cursor-agent about` → `mkerkmeester@proton.me`, live-verified in phase 005 of this creation packet) - do not re-run `login` unless the operator reports a session change.
4. **Standing precondition-check warning (Cursor-specific gotcha).** `cursor-agent -p` without valid auth exits `0` even on an authentication failure - the exit code is NEVER a reliable availability or auth signal for this CLI. Every precondition check and every scenario in this playbook MUST inspect `cursor-agent about` output text (looking for `User Email: Not logged in` vs a real email) or a dispatch's own output text, never the exit code alone.
5. The active runtime is NOT Cursor CLI itself - the self-invocation guard in SKILL.md §2 must not trip. Verify by running `env | grep -i cursor_` and confirming no `CURSOR_AGENT`/`CURSOR_CONVERSATION_ID` vars are set.
6. The skill's reference and asset files exist at `.opencode/skills/cli-external-orchestration/cli-cursor/{references,assets}/` so prompt-quality, hook-contract, and template scenarios resolve.
7. **Enforced model allowlist.** `composer-2.5` (Cursor's own native model, confirmed live at Pro tier) is the documented default; dispatch is otherwise scoped to exactly 10 ids — `composer-2.5`/`composer-2.5-fast`, `cursor-grok-4.5-{low,medium,high}[-fast]` (6 ids), and `glm-5.2-{high,max}` — enforced by `CURSOR_SUPPORTED_MODELS` in `executor-config.ts` and checked in both `fanout-run.cjs` and `dispatch-model.cjs`. `auto` and every hosted GPT/Claude/Gemini/Kimi id are OUT OF SCOPE for this skill, not merely undocumented. Effort tiers are reached by exact enumerated id, never a `[effort=...]` bracket (confirmed rejected: `Error: Cannot use this model`). Use the model a scenario names; do not substitute IDs outside this allowlist.
8. **Shared `.cursor/` config caveat.** Unlike every sibling CLI, `cursor-agent` reads the exact same `.cursor/`/`~/.cursor/` config the Cursor **editor** reads (`hooks.json`, `mcp.json`, `rules/`, `cli-config.json`). Every dispatched scenario in this playbook silently inherits the operator's live editor-level configuration on this machine unless a scenario explicitly notes an isolation flag (`--workspace`/`--add-dir`/`--plugin-dir`). See `references/shared-editor-config.md`.
9. Destructive/opt-in scenarios (`CU-010` real worktree creation, any live `CU-017` cloud-worker variant) MUST run only against rebuildable, non-production state and require explicit human approval before execution beyond the documented `--help`/inspection default.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Full command transcript including the exact `cursor-agent -p` invocation with all flags
- The user request that triggered the delegation
- The orchestrator-side reasoning for model, execution mode and approval/sandbox selection
- The canonical prompt actually dispatched (not just paraphrased), whether natural-human or RCAF for AI-orchestrator scenarios
- Cursor stdout (and stderr captured via `2>&1`)
- Exit code from `cursor-agent`, noted alongside output-text auth/availability evidence (never exit code alone)
- The final user-facing outcome and a PASS, FAIL, or SKIP verdict with rationale
- For CU-020, isolated Node process output replaces Cursor dispatch stdout; record the 9/9 TAP result plus config and symlink checks

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `cursor-agent <flags> -p "<prompt>"` (e.g., `cursor-agent -p "..." --model composer-2.5 --output-format text`)
- Bash commands shown as `bash: <command>` (e.g., `bash: command -v cursor-agent`)
- File capture shown as `> /tmp/<file>` (orchestrator captures Cursor output to a temp file for inspection)
- `->` separates sequential steps in the command sequence column
- Always redirect stdin from `/dev/null` (`</dev/null`) on any non-interactive dispatch, per SKILL.md §4 ALWAYS rule 6
- Always specify `--model` and an explicit approval/sandbox flag combination; never rely on caller environment defaults

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. Referenced per-scenario files under `manual-testing-playbook/<category>/`
3. Scenario execution evidence (transcripts, captured stdout files, exit codes)
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied (Cursor installed, authenticated, non-Cursor runtime, output-text auth check performed).
2. Prompt and command sequence were executed as written, including required model/mode/approval/sandbox flags.
3. Expected signals are present in Cursor stdout / stderr / exit code / output text.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `FAIL`: expected behavior missing, contradictory output, dispatch broken, or a critical check failed
- `SKIP`: a specific, named blocker prevents execution (e.g. cloud-worker registration deliberately not exercised, destructive worktree creation not operator-approved this run) - SKIP always carries a documented reason, never a silent omission

There is no `PARTIAL` verdict in this playbook (NFR-R01).

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the category are `PASS` (or a documented `SKIP`)
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` (`CU-001`, `CU-002`, `CU-004`, `CU-006`) forces the feature verdict to `FAIL`. The default invocation, the auth-fail-exit-0 safety guard, read-only plan mode, and the default write-capable agent mode are the load-bearing baseline. `CU-002` is additionally safety-critical on its own: a `FAIL` here means an operator could ship a guard that reports success on a dispatch that never reached a model, so `CU-002` also directly gates release readiness below.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios (`CU-001`, `CU-002`, `CU-004`, `CU-006`) are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-scenario files (`COVERED_FEATURES == TOTAL_FEATURES`, currently 21).
4. No unresolved blocking triage item remains, and every `SKIP` verdict carries a documented, still-valid blocker.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put category-specific acceptance caveats (e.g. destructive-worktree approval evidence for `CU-010`, cloud-worker document-and-SKIP rationale for `CU-017`, hook non-delivery documentation for `CU-014`) in the matching per-scenario files.

### Destructive / Document-and-SKIP-by-Default Scenarios

- `CU-010` (real worktree creation): opt-in, explicitly marked destructive/mutating extension of `CU-009`'s dry-run default. MUST run only with explicit user approval, captured as evidence, and MUST clean up the created worktree afterward.
- `CU-017` (cloud worker): document-and-SKIP by default. The default execution path inspects `cursor-agent worker --help` only; a live registration variant is opt-in, connects to Cursor's cloud, and is out of scope for routine playbook runs.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start (the `cursor-agent about` auth pre-flight, OS sandbox availability).
2. Reserve one coordinator on the calling AI side. Do not nest Cursor coordinators.
3. Saturate remaining worker slots with parallel `cursor-agent -p` calls (read-only and isolated-`/tmp` scenarios are safe to fan out; scenarios that mutate the operator's live shared `.cursor/` config or the current workspace must serialize).
4. Pre-assign explicit scenario IDs and matching per-scenario files to each wave before execution.
5. Run any explicitly-marked destructive/opt-in scenario (`CU-010`, and any live `CU-017` variant an operator chooses to exercise) in a dedicated, isolated wave with no parallel siblings and explicit approval captured first - mirroring `cli-codex`'s `CX-007` destructive-scenario handling.
6. After each wave, save context and evidence, then begin the next wave.
7. Record a utilization table, per-scenario file references and evidence paths in the final report.

### Recommended Wave Layout

- Wave 1 (parallel-safe, read-only or isolated-`/tmp`): `CU-001`, `CU-002`, `CU-003`, `CU-004`, `CU-005`, `CU-009`, `CU-011`, `CU-012`, `CU-013`, `CU-014`, `CU-017`, `CU-018`, `CU-019`, `CU-020`, `CU-021`
- Wave 2 (write-capable, serial on overlapping paths and shared approval/sandbox state): `CU-006`, `CU-007`, `CU-008`
- Wave 3 (session continuity, requires a prior session id): `CU-015`, `CU-016`
- Wave 4 (DESTRUCTIVE/opt-in, isolated, requires approval): `CU-010`

### What Belongs In Per-Scenario Files

- Real user request
- Prompt field with the canonical text for this scenario
- Expected model / execution-mode / approval-and-sandbox selection
- Desired user-visible outcome
- Scenario-specific acceptance caveats or isolation constraints (e.g. destructive-worktree approval evidence, cloud-worker SKIP rationale, hook non-delivery documentation)

---

## 7. CLI INVOCATION (`CU-001..CU-003`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CU-001 | Default invocation (composer-2.5, text output)

#### Description

Verify the canonical zero-input default dispatch (`--model composer-2.5 --output-format text`, paired with the skill's documented `--auto-review --sandbox enabled` approval default) returns a usable answer with exit code 0.

#### Scenario Contract

Prompt: `Generate a TypeScript function fizzbuzz(n: number): string[] that returns the fizzbuzz sequence from 1 to n. Output only the function body and its signature in your response text, no file writes, no explanation.`

Expected signals: `cursor-agent -p` exits 0. Output text contains a TypeScript function named `fizzbuzz` referencing `Fizz`/`Buzz`/`FizzBuzz` semantics. `git status --porcelain` stays clean (the prompt explicitly asks for an inline answer, not a file write). The dispatched command line includes `--model composer-2.5 --output-format text --auto-review --sandbox enabled`.

Desired user-visible outcome: A working `fizzbuzz` function returned inline, with operator-readable evidence that the documented default invocation shape works end to end.

#### Test Execution

> **Feature File:** [CU-001](../manual-testing-playbook/cli-invocation/default-invocation.md)

### CU-002 | Auth-fail-but-exit-0 safety gotcha

#### Description

Verify the guard checks `cursor-agent about` output text for auth state, never the exit code - since a `-p` dispatch without valid auth exits `0` even on authentication failure.

#### Scenario Contract

Prompt: `Confirm the cli-cursor auth guard keys on cursor-agent about output text, not exit code, citing the historical live-verified auth-fail-exit-0 evidence and the current session's authenticated state.`

Expected signals: Phase 001's `implementation-summary.md` shows the historical live evidence on this same machine (`cursor-agent about` → `User Email: Not logged in`; `cursor-agent -p` → `Error: Authentication required...`; exit code `0`). The current `cursor-agent about` shows a real email (Pro tier), demonstrating the guard's positive branch. SKILL.md's Provider Auth Pre-Flight block great checks output text (`grep -qi "not logged in"`), never exit code.

Desired user-visible outcome: An auditable trail proving the guard is text-based, not exit-code-based, without requiring a destructive `cursor-agent logout` on the operator's authenticated machine.

#### Test Execution

> **Feature File:** [CU-002](../manual-testing-playbook/cli-invocation/auth-fail-exit-zero-safety-gotcha.md)

### CU-003 | Hallucination-fixture: fake flag / bracket model id

#### Description

Verify a constructed Cursor dispatch never fabricates a `--reasoning-effort` flag or a `model[effort=...]` bracket id, citing the live-confirmed CLI rejection (`Error: Cannot use this model`) as the negative-control evidence for what "fake" looks like.

#### Scenario Contract

Prompt: `Construct a cursor-agent dispatch for "analyze this module at high reasoning effort" without inventing a --reasoning-effort flag or a bracket-effort model id, then reproduce the confirmed rejection of both fake patterns as a negative control.`

Expected signals: The constructed dispatch for the reasoning-effort request resolves to an effort-suffixed model id (e.g. `gpt-5.2-high`), never `--reasoning-effort` or a bracket. A live negative-control dispatch using `--model 'gpt-5.2[effort=high]'` reproduces `Error: Cannot use this model`. No fake flag or bracket ever appears in the constructed command line.

Desired user-visible outcome: Proof the dispatch-construction logic never hallucinates a flag Cursor does not have, backed by a reproducible negative control.

#### Test Execution

> **Feature File:** [CU-003](../manual-testing-playbook/cli-invocation/hallucination-fixture-fake-flag.md)

---

## 8. EXECUTION MODES (`CU-004..CU-006`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. Cursor's read-only `plan`/`ask` modes plus its default write-capable agent mode replace the permission-mode categories that `cli-codex`'s 3-tier sandbox and `cli-devin`'s 4-mode permission enum occupy - there is no verbatim sibling analog to port.

### CU-004 | Plan mode (read-only)

#### Description

Verify `--mode plan` (shorthand `--plan`) performs multi-step planning without any file writes, and that approval flags have no effect since nothing is written.

#### Scenario Contract

Prompt: `Plan the migration from REST to GraphQL for this repo's API layer. Do not write any files - this is planning only.`

Expected signals: `cursor-agent --mode plan` exits 0. Output contains a numbered, multi-step migration plan. `git status --porcelain` stays clean before and after. The dispatched command line includes `--mode plan`.

Desired user-visible outcome: A usable migration plan the operator can review before committing to any write-capable dispatch, with proof that plan mode is genuinely read-only regardless of prompt phrasing.

#### Test Execution

> **Feature File:** [CU-004](../manual-testing-playbook/execution-modes/plan-mode-read-only.md)

### CU-005 | Ask mode (read-only)

#### Description

Verify `--mode ask` answers an architecture/explanation question without any file writes.

#### Scenario Contract

Prompt: `Explain how the self-invocation guard works in cli-cursor/SKILL.md §2 - what signals does it check and in what order?`

Expected signals: `cursor-agent --mode ask` exits 0. Output correctly describes the env-var-then-ancestry-then-state-probe layering from SKILL.md §2. `git status --porcelain` stays clean. The dispatched command line includes `--mode ask`.

Desired user-visible outcome: An accurate explanation of real repo content, demonstrating `--mode ask` as a genuine read-only Q&A surface.

#### Test Execution

> **Feature File:** [CU-005](../manual-testing-playbook/execution-modes/ask-mode-read-only.md)

### CU-006 | Default agent mode (write-capable)

#### Description

Verify the default agent mode (no `--mode` flag) actually writes a requested file when paired with an approval flag, in contrast to `CU-004`/`CU-005`'s read-only behavior.

#### Scenario Contract

Prompt: `Generate /tmp/cli-cursor-playbook-cu006/hello.ts: a small TypeScript function that returns "hello world". Write the file.`

Expected signals: `cursor-agent -p` (default agent mode, no `--mode` flag) exits 0. `/tmp/cli-cursor-playbook-cu006/hello.ts` exists on disk and contains a working function. `git status --porcelain` in the repo stays clean (the temp dir is outside git). The dispatched command line includes `--auto-review --sandbox enabled` (no `--mode` flag).

Desired user-visible outcome: A real generated file the operator can inspect and run, proving the default agent mode is genuinely write-capable where `--mode plan`/`--mode ask` are not.

#### Test Execution

> **Feature File:** [CU-006](../manual-testing-playbook/execution-modes/default-agent-write-capable.md)

---

## 9. APPROVALS AND SANDBOX (`CU-007..CU-008`)

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract, using Cursor's real flags (`--auto-review`, `--force`/`--yolo`, `--sandbox enabled|disabled`) rather than a ported sibling permission model.

### CU-007 | --auto-review Smart Auto

#### Description

Verify `--auto-review` ("Smart Auto") auto-runs a safe write-capable generation task unattended, without an interactive approval prompt blocking completion.

#### Scenario Contract

Prompt: `Generate /tmp/cli-cursor-playbook-cu007/util.ts: a small clamp(n, min, max) utility function. Write the file.`

Expected signals: `cursor-agent -p ... --auto-review --sandbox enabled` exits 0 with no interactive approval prompt captured in stdout/stderr. `/tmp/cli-cursor-playbook-cu007/util.ts` exists and contains a working `clamp` function. The dispatched command line includes `--auto-review`.

Desired user-visible outcome: An unattended, successful generation that demonstrates Smart Auto's auto-run-safe-calls behavior for a typical delegation.

#### Test Execution

> **Feature File:** [CU-007](../manual-testing-playbook/approvals-and-sandbox/auto-review-smart-auto.md)

### CU-008 | --force/--yolo + --sandbox toggle

#### Description

Verify `--force`/`-f`/`--yolo` ("Run Everything") auto-approves unattended, and that `--sandbox enabled|disabled` is accepted as a distinct OS-level sandbox toggle independent of the approval decision.

#### Scenario Contract

Prompt: `Generate /tmp/cli-cursor-playbook-cu008/greet.ts: a small greet(name: string): string function. Write the file.`

Expected signals: `cursor-agent -p ... --force --sandbox disabled` exits 0 unattended. A second invocation with `--yolo --sandbox enabled` also exits 0 unattended. Both dispatched command lines are accepted without a CLI-level flag rejection, confirming `--force`/`--yolo` are aliases and `--sandbox` is a separate, independent toggle from the approval flag.

Desired user-visible outcome: Evidence that unattended "Run Everything" dispatch works with either sandbox setting, and that approval and OS-sandbox are two independent dimensions an operator can combine deliberately.

#### Test Execution

> **Feature File:** [CU-008](../manual-testing-playbook/approvals-and-sandbox/force-yolo-sandbox-toggle.md)

---

## 10. WORKTREE ISOLATION (`CU-009..CU-010`)

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract. Native git worktree isolation (`-w`/`--worktree`) has no sibling analog in `cli-codex`/`cli-claude-code`/`cli-opencode`/`cli-devin`.

### CU-009 | Worktree dry-run / inspection

#### Description

Verify the `-w`/`--worktree [name]`, `--worktree-base <branch>`, and `--skip-worktree-setup` flags are documented in `cursor-agent --help`, and inspect `.cursor/worktrees.json` schema if present, without creating a real worktree.

#### Scenario Contract

Prompt: `Confirm the -w/--worktree, --worktree-base, and --skip-worktree-setup flags are documented in cursor-agent --help, and check whether this repo has a .cursor/worktrees.json.`

Expected signals: `bash: cursor-agent --help | grep -- "--worktree"` lists all three flags. `bash: test -f .cursor/worktrees.json` (documents present/absent honestly). No new directory appears under `~/.cursor/worktrees/` as a result of this scenario. The scenario explicitly notes the interaction with this repo's own `sk-git` numbered-worktree discipline (`.worktrees/{NNNN}-{owner}-{slug}`) as a documented caveat, per `references/cursor-tools.md`.

Desired user-visible outcome: Confirmation the flag surface exists and is safe to reason about, without mutating the operator's `~/.cursor/worktrees/` state.

#### Test Execution

> **Feature File:** [CU-009](../manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md)

### CU-010 | Real worktree creation **(DESTRUCTIVE, opt-in)**

#### Description

Opt-in, explicitly marked destructive extension of `CU-009`: actually create a real git worktree via `-w` and verify it materializes at the documented path, then clean it up.

#### Scenario Contract

Prompt: `With explicit operator approval, create a real Cursor-native worktree named cu010-probe using -w, confirm it exists at ~/.cursor/worktrees/<repo>/cu010-probe, then remove it.`

Expected signals: Operator approval captured BEFORE dispatch. `cursor-agent -p ... -w cu010-probe --mode ask --model composer-2.5` exits 0. `~/.cursor/worktrees/<repo>/cu010-probe` exists after dispatch. Cleanup removes the created worktree directory and any git worktree registration, verified via `git worktree list` no longer showing it.

Desired user-visible outcome: Proof the native worktree flag genuinely creates an isolated checkout, with a clean teardown leaving no residual state.

#### Test Execution

> **Feature File:** [CU-010](../manual-testing-playbook/worktree-isolation/worktree-real-creation-destructive.md)

---

## 11. MCP INTEGRATION (`CU-011..CU-012`)

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### CU-011 | mcp list / list-tools

#### Description

Verify `cursor-agent mcp list` enumerates configured MCP servers (possibly an empty list) and `cursor-agent mcp list-tools <id>` surfaces tools for a configured server, if any.

#### Scenario Contract

Prompt: `Confirm cursor-agent mcp list runs cleanly and, if any server is configured, list-tools <id> surfaces its tools.`

Expected signals: `cursor-agent mcp list` exits 0 (an empty result is a valid, documented outcome, not a failure). If at least one server is configured, `cursor-agent mcp list-tools <id>` exits 0 and names at least one tool.

Desired user-visible outcome: Confirmation the MCP client subcommand surface is reachable and behaves correctly whether or not any server happens to be configured on this machine.

#### Test Execution

> **Feature File:** [CU-011](../manual-testing-playbook/mcp-integration/mcp-list-list-tools.md)

### CU-012 | mcp.json precedence + --approve-mcps

#### Description

Verify `.cursor/mcp.json` (project) and `~/.cursor/mcp.json` (user) precedence ("project → global → nested") and that `--approve-mcps` is accepted on a dispatch to auto-approve configured servers.

#### Scenario Contract

Prompt: `Check for .cursor/mcp.json and ~/.cursor/mcp.json, document their precedence, then confirm --approve-mcps is accepted on a trivial dispatch.`

Expected signals: Existence of project/user `mcp.json` is checked and documented honestly (present or absent). `cursor-agent -p "say hi" --model composer-2.5 --output-format text --approve-mcps </dev/null` exits 0 with no CLI-level flag rejection.

Desired user-visible outcome: Confirmation of the precedence rule and that `--approve-mcps` never blocks a dispatch, whether or not any server is configured.

#### Test Execution

> **Feature File:** [CU-012](../manual-testing-playbook/mcp-integration/mcp-json-precedence-approve-mcps.md)

---

## 12. HOOKS (`CU-013..CU-014, CU-020..CU-021`)

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract, including the process-tested session-start prebind and the shared `.cursor/hooks.json` event surface.

### CU-013 | Confirmed-fires smoke test

#### Description

Verify `sessionStart`, `preToolUse`, and `sessionEnd` fire under a real `cursor-agent -p` dispatch, using an isolated temporary workspace so this repo's real, committed `.cursor/hooks.json` (phase 010) and its live gate state are never touched by this scenario's own test run.

#### Scenario Contract

Prompt: `In an isolated temp workspace with its own hooks.json wiring sessionStart/preToolUse/sessionEnd to a logging probe, dispatch a trivial task and confirm all three events fire.`

Expected signals: The probe log shows at least one entry for `sessionStart`, at least one for `preToolUse` (fired before the dispatched tool call), and at least one for `sessionEnd` - matching phase 004's live-confirmed delivery table (`../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer/implementation-summary.md`).

Desired user-visible outcome: A reproduced, first-hand confirmation of the three events this repo's own hook adapters are wired to, independent of trusting the phase 004 summary alone.

#### Test Execution

> **Feature File:** [CU-013](../manual-testing-playbook/hooks/confirmed-fires-smoke-test.md)

### CU-014 | Confirmed-non-delivery documentation

#### Description

Verify `beforeSubmitPrompt` and `stop` do NOT fire under `cursor-agent -p`, and that this repo's dormant `spec-gate-classify.mjs` adapter and the gap are documented, not silently assumed working.

#### Scenario Contract

Prompt: `In the same isolated temp workspace, wire beforeSubmitPrompt and stop to the logging probe alongside a full dispatch round trip, and confirm neither event fires.`

Expected signals: The probe log shows zero entries for `beforeSubmitPrompt` and zero for `stop` across the full session. `runtime/hooks/cursor/spec-gate-classify.mjs` exists and its README documents it as dormant. `runtime/hooks/cursor/README.md` and `mcp-server/hooks/cursor/README.md` both state the non-delivery finding explicitly.

Desired user-visible outcome: A reproduced confirmation of the documented gap, so no future adapter silently assumes advisory Gate-3 classification is reachable via `beforeSubmitPrompt` when it is not.

#### Test Execution

> **Feature File:** [CU-014](../manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md)

### CU-020 | Session-start spec-gate prebind matrix

#### Description

Execute the prebind process suite to prove valid folder satisfaction, explicit top-level enforcement, disabled/child no-ops, malformed input handling, invalid binding behavior, and terminal-state preservation.

#### Scenario Contract

Prompt: `Run the Cursor session-start spec-gate prebind matrix and report every state and exemption result.`

Expected signals: `node --test` reports 9/9 passing; valid binding is consumed as allow, enforce-only startup is consumed as deny, and no-op rows create no state.

Desired user-visible outcome: Evidence that opt-in Cursor enforcement is active without changing disabled or autonomous child behavior.

#### Test Execution

> **Feature File:** [CU-020](../manual-testing-playbook/hooks/spec-gate-prebind-session-start.md)

### CU-021 | Task-matcher preToolUse dispatch guard live-fire

#### Description

Verify a second `preToolUse` array entry scoped with `"matcher": "Task"` (`task-dispatch-guard.mjs`, phase 011) fires alongside the pre-existing unmatched `preToolUse` entry for the SAME `Task` tool call, under an isolated-workspace dispatch that explicitly requests subagent delegation.

#### Scenario Contract

Prompt: `In an isolated temp workspace with its own hooks.json wiring two preToolUse entries (one unmatched, one matcher: "Task") to a logging probe, dispatch a task that explicitly requests subagent delegation and confirm both entries fire for the same Task call.`

Expected signals: The probe log shows at least one entry from the unmatched wiring AND at least one entry from the `matcher: "Task"` wiring for the same dispatched `Task` tool call - matching phase 011's live-fire dispatch 3 evidence (`preToolUse-Task-fired` and `preToolUse-unmatched-fired` for the same call, captured in `../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/011-cursor-hooks-claude-parity/implementation-summary.md`).

Desired user-visible outcome: A reproduced, first-hand confirmation that Cursor's `matcher` schema field routes a second `preToolUse` entry by `tool_name` without shadowing the pre-existing unmatched entry, independent of trusting the phase 011 summary alone.

#### Test Execution

> **Feature File:** [CU-021](../manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md)

---

## 13. SESSION CONTINUITY (`CU-015..CU-016`)

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract. `--resume`/`--continue` are documented global flags; their exact round-trip behavior for `cli-cursor` dispatch had not been separately live-verified beyond flag presence before this playbook's execution.

### CU-015 | --continue same-session follow-up

#### Description

Verify `--continue` picks up the most recent session and produces a coherent follow-up referencing prior turn content.

#### Scenario Contract

Prompt: `Turn 1: sketch a TypeScript User type and write it to /tmp/cli-cursor-playbook-cu015/user.ts. Turn 2 (--continue): implement validate(user) for the type from Turn 1.`

Expected signals: Turn 1 writes `/tmp/cli-cursor-playbook-cu015/user.ts` with a `User` type, exit 0. Turn 2 (`cursor-agent -p ... --continue --model composer-2.5`) exits 0 and its output/file changes reference the Turn 1 `User` type by name or shape.

Desired user-visible outcome: A working multi-turn task, with an honest record of whether `--continue` round-trip behavior held up under this first live check (not asserted in advance as confirmed).

#### Test Execution

> **Feature File:** [CU-015](../manual-testing-playbook/session-continuity/continue-same-session.md)

### CU-016 | --resume explicit chat id

#### Description

Verify `--resume [chatId]` returns to a specific earlier session using the `session_id` captured from `--output-format json`.

#### Scenario Contract

Prompt: `Turn 1 (--output-format json): sketch a TypeScript Order type and write it to /tmp/cli-cursor-playbook-cu016/order.ts, capturing session_id. Turn 2 (--resume <session_id>): implement a total() function for the type from Turn 1.`

Expected signals: Turn 1's JSON output includes a `session_id` field. Turn 2 (`cursor-agent -p ... --resume "$SESSION_ID" --model composer-2.5`) exits 0 and its output/file changes reference the Turn 1 `Order` type.

Desired user-visible outcome: A working resumed task with the actual `session_id` captured as evidence, honestly reporting the observed round-trip behavior rather than assuming it in advance.

#### Test Execution

> **Feature File:** [CU-016](../manual-testing-playbook/session-continuity/resume-explicit-chat-id.md)

---

## 14. CLOUD WORKER (`CU-017`)

This category covers 1 scenario summary while the linked feature file remains the canonical execution contract. `cursor-agent worker` has no sibling analog (it is infra-grade remote execution, a different shape from `cli-devin`'s session-level `/handoff`).

### CU-017 | worker --help inspection (SKIP by default)

#### Description

Document-and-SKIP by default: inspect `cursor-agent worker --help` for the documented health-probe, metrics, and pool flags without registering a real worker (a real registration connects to Cursor's cloud and may have real account effects).

#### Scenario Contract

Prompt: `Confirm cursor-agent worker --help documents the Kubernetes-style health probes, /metrics, and pool/label flags, without starting a real worker.`

Expected signals: `cursor-agent worker --help` exits 0. Help text names `/healthz`/`/readyz`-style probe flags, a Prometheus `/metrics` endpoint, `--pool`/`--pool-name`, label flags, and `--auth-token-file`.

Desired user-visible outcome: Confirmation the cloud-worker subcommand surface matches the documented contract, with the live registration path explicitly SKIPPED by default per this phase's resolved Open Question.

#### Test Execution

> **Feature File:** [CU-017](../manual-testing-playbook/cloud-worker/worker-help-inspection-skip-default.md)

---

## 15. PROMPT TEMPLATES (`CU-018..CU-019`)

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### CU-018 | CLEAR scoring via quality card

#### Description

Verify the CLEAR 5-check is applied before dispatch (via the canonical card at `sk-prompt/prompt-models/assets/cli-prompt-quality-card.md`, reached through the local `assets/prompt-quality-card.md` delegation) and that an under-scored prompt is escalated to a structured framework before dispatch.

#### Scenario Contract

Prompt: `Spec folder: cli-external-orchestration/030-cli-cursor-creation/006-cursor-manual-testing-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator constructing a non-trivial dispatch, FIRST take a deliberately weak prompt ("Fix auth"), score it with the CLEAR 5-check from the canonical card (Correctness, Logic, Expression, Arrangement, Reusability), THEN escalate it via the RCAF framework. Dispatch the improved prompt against /tmp/cli-cursor-playbook-cu018/auth.ts with --model composer-2.5 --auto-review --sandbox enabled. Verify the operator records both CLEAR score sets, names the framework selected, and Cursor produces a meaningfully better implementation from the improved prompt. Return a verdict including both CLEAR score sets and the framework selected.`

Expected signals: Operator records CLEAR scores for the weak prompt (low on Expression and Arrangement) and for the improved (RCAF) prompt (higher across all five axes). The dispatched command uses the improved prompt and exits 0. The modified `auth.ts` reflects the upgrade (explicit null/empty validation).

Desired user-visible outcome: An auditable trail showing the prompt-quality discipline was applied before dispatch, near-verbatim ported from `cli-codex`'s `CX-022` with only CLI-specific mechanics adapted.

#### Test Execution

> **Feature File:** [CU-018](../manual-testing-playbook/prompt-templates/clear-scoring-quality-card.md)

### CU-019 | Composer RCAF template dispatch

#### Description

Verify Composer's RCAF prompt-craft profile (`sk-prompt/prompt-models/references/models/composer-2.5.md`, `status: default-unverified`) produces a working generation when a task is filled into its scaffold and dispatched with `--model composer-2.5`.

#### Scenario Contract

Prompt: `Fill Composer's RCAF scaffold (Role/Context/Action/Format) for a small isolate/tmp TypeScript task and dispatch it with --model composer-2.5 --auto-review --sandbox enabled.`

Expected signals: `cursor-agent -p ... --model composer-2.5` exits 0. The filled RCAF prompt names a clear Role, file-anchored Context, one Action, and an explicit Format contract. The generated file matches the Format contract's output shape.

Desired user-visible outcome: A working generation from Composer's own scaffold, recorded as real first-time empirical dispatch data against a profile the registry still honestly labels `default-unverified` (this scenario does not itself update the profile's benchmark status - that is out of scope for this phase).

#### Test Execution

> **Feature File:** [CU-019](../manual-testing-playbook/prompt-templates/composer-rcaf-template-dispatch.md)

---

## 16. AGENTS, COMMANDS, MIRRORS AND AUTOMATED TEST CROSS-REFERENCE

### Agent and command parity scenarios

- CU-022: [13-agent roster enumeration](agents-skills-rules/agent-roster-enumeration.md)
- CU-023: [Mirrored-agent subagent dispatch](agents-skills-rules/mirrored-agent-dispatch.md)
- CU-024: [36-command roster and invocation](agents-skills-rules/command-roster-invocation.md)
- CU-025: [Agent mirror symlink integrity](agents-skills-rules/agent-mirror-integrity.md)

The `cli-cursor` skill is an orchestrator wrapper around a third-party binary (`cursor-agent`) and does not own a Python or JavaScript test suite of its own. Cross-references in this section point at upstream and adjacent test surfaces:

| Test Surface | Coverage | Playbook Overlap |
|---|---|---|
| Upstream Cursor CLI product (`https://cursor.com/docs/cli/overview`) | `cursor-agent` binary correctness | Out of scope for this playbook. We validate that our skill dispatches the binary correctly, not that the binary itself is correct |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/{session-start,session-end,shared}.ts` (compiled to `dist/hooks/cursor/*.js`) | Hook adapter contract integration | `CU-013` exercises the confirmed-fires adapters |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/{spec-gate-enforce,spec-gate-classify}.mjs` | Runtime hook enforcement/advisory | `CU-013` (enforce, wired to `preToolUse`); `CU-014` (classify, dormant - documented, never wired) |
| `.opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs` | `Task`-matcher `preToolUse` dispatch guard (phase 011) | `CU-021` exercises the confirmed live-fire `matcher: "Task"` entry |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | Markdown structure validation for this playbook | This playbook itself (root and every scenario file MUST validate cleanly) |

There is no automated coverage for default-invocation, execution-mode, approval/sandbox, worktree, MCP, or session-continuity scenarios. Manual playbook execution IS the canonical validation surface for those features. Re-run the wave plan in §6 before each release.

---

## 17. FEATURE CATALOG CROSS-REFERENCE INDEX

### CLI INVOCATION

- CU-001: [Default invocation (composer-2.5, text output)](../manual-testing-playbook/cli-invocation/default-invocation.md)
- CU-002: [Auth-fail-but-exit-0 safety gotcha](../manual-testing-playbook/cli-invocation/auth-fail-exit-zero-safety-gotcha.md)
- CU-003: [Hallucination-fixture: fake flag / bracket model id](../manual-testing-playbook/cli-invocation/hallucination-fixture-fake-flag.md)

### EXECUTION MODES

- CU-004: [Plan mode (read-only)](../manual-testing-playbook/execution-modes/plan-mode-read-only.md)
- CU-005: [Ask mode (read-only)](../manual-testing-playbook/execution-modes/ask-mode-read-only.md)
- CU-006: [Default agent mode (write-capable)](../manual-testing-playbook/execution-modes/default-agent-write-capable.md)

### APPROVALS AND SANDBOX

- CU-007: [--auto-review Smart Auto](../manual-testing-playbook/approvals-and-sandbox/auto-review-smart-auto.md)
- CU-008: [--force/--yolo + --sandbox toggle](../manual-testing-playbook/approvals-and-sandbox/force-yolo-sandbox-toggle.md)

### WORKTREE ISOLATION

- CU-009: [Worktree dry-run / inspection](../manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md)
- CU-010: [Real worktree creation **(DESTRUCTIVE, opt-in)**](../manual-testing-playbook/worktree-isolation/worktree-real-creation-destructive.md)

### MCP INTEGRATION

- CU-011: [mcp list / list-tools](../manual-testing-playbook/mcp-integration/mcp-list-list-tools.md)
- CU-012: [mcp.json precedence + --approve-mcps](../manual-testing-playbook/mcp-integration/mcp-json-precedence-approve-mcps.md)

### HOOKS

- CU-013: [Confirmed-fires smoke test](../manual-testing-playbook/hooks/confirmed-fires-smoke-test.md)
- CU-014: [Confirmed-non-delivery documentation](../manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md)
- CU-020: [Session-start spec-gate prebind matrix](../manual-testing-playbook/hooks/spec-gate-prebind-session-start.md)
- CU-021: [Task-matcher preToolUse dispatch guard live-fire](../manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md)

### SESSION CONTINUITY

- CU-015: [--continue same-session follow-up](../manual-testing-playbook/session-continuity/continue-same-session.md)
- CU-016: [--resume explicit chat id](../manual-testing-playbook/session-continuity/resume-explicit-chat-id.md)

### CLOUD WORKER

- CU-017: [worker --help inspection (SKIP by default)](../manual-testing-playbook/cloud-worker/worker-help-inspection-skip-default.md)

### PROMPT TEMPLATES

- CU-018: [CLEAR scoring via quality card](../manual-testing-playbook/prompt-templates/clear-scoring-quality-card.md)
- CU-019: [Composer RCAF template dispatch](../manual-testing-playbook/prompt-templates/composer-rcaf-template-dispatch.md)
