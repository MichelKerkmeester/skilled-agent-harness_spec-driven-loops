---
title: "cli-devin: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the cli-devin skill."
---

# cli-devin: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual `devin` invocations, inspect real outputs, capture real exit codes and verify real behavior. The only acceptable classifications are PASS, FAIL or SKIP (with a specific blocker documented). "UNAUTOMATABLE" is not a valid status.

> **SELF-INVOCATION GUARD**: This playbook validates the `cli-devin` skill from a non-Devin runtime (Claude Code, Codex, Gemini, OpenCode or shell). Operators MUST NOT execute these scenarios from inside a local `devin` session. The skill refuses to load when `DEVIN_*` env vars, `devin` process ancestry, or a Devin session lockfile are detected. The single legitimate exception is an explicit cloud-handoff request (see scenarios DV-017, DV-018, DV-020). See SKILL.md §2 Self-Invocation Guard.

This document combines the full manual-validation contract for the `cli-devin` skill into a single reference. The root playbook acts as the operator directory, review protocol and orchestration guide. It explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `cli-devin` skill. The root document acts as the directory, review surface and orchestration guide, while per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--cli-invocation/`
- `02--permission-modes/`
- `03--model-presets/`
- `04--devin-surfaces/`
- `05--session-continuity/`
- `06--cloud-handoff/`
- `07--self-invocation-guard/`
- `08--cross-ai-dispatch/`
- `09--acp-bridge/`

---

## 1. OVERVIEW

This playbook provides 27 deterministic scenarios across 9 categories validating the `cli-devin` skill surface. Each feature keeps its global `DV-NNN` ID and links to a dedicated feature file with the full execution contract. v1.0.2.0: wave-2 run promoted 8 SKIPs to PASS, split DV-018 into shell-runnable (new DV-027 cloud surface) + manual round-trip (DV-018), and reaffirmed 3 calling-AI orchestrator-layer SKIPs (DV-017 / DV-019 / DV-020).

Coverage note (2026-05-15): Covers the canonical default invocation (`swe-1.6` + `--permission-mode auto`), every documented permission mode, every model preset (SWE-1.6 default + DeepSeek v4 primary for complex + GLM 5.1 and Kimi k2.6 as complex-task fallbacks), every Devin-side surface (`devin rules`, `devin skills`, `devin mcp`), session continuity (`--continue`, `--resume <id>`, `devin list`), the Devin-unique local-to-cloud handoff with the 5-check operator-confirmation gate, the layered self-invocation guard, cross-AI dispatch from each of the four sibling cli-* runtimes, and the `devin acp` Agent Client Protocol server.

### Realistic Test Model

1. A realistic user request is given to an orchestrator running on a non-Devin runtime (Claude Code, Codex, Gemini, OpenCode or shell).
2. The orchestrator decides whether to delegate to Devin via the `cli-devin` skill, picks the right model preset and permission mode, and uses the canonical prompt for the scenario: natural-human by default, RCAF only when the actor is an AI orchestrator.
3. The operator captures both the dispatch command and the user-visible outcome.
4. The scenario passes only when the dispatch is sound, the Devin output matches the expected signals and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the delegation
- The orchestrator brief or Devin-facing prompt that should drive the test
- The expected execution process, including model preset, permission mode and any session-management decisions
- The desired user-visible outcome
- The implementation or skill-doc anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is project root and contains `.git/`.
2. Devin CLI is installed and on PATH: `command -v devin` returns a non-empty path. If not installed, run `curl -fsSL https://cli.devin.ai/install.sh | bash` (macOS/Linux) or `irm https://static.devin.ai/cli/setup.ps1 | iex` (Windows).
3. Devin CLI is authenticated: `devin auth status` returns an authenticated state. If not, run `devin auth login` and paste a token from `https://app.devin.ai` (Cognition / Codeium / Windsurf bridge) (or use `devin setup` for the interactive wizard).
4. The active runtime is NOT Devin itself — the self-invocation guard in SKILL.md §2 must not trip. Verify by running `env | grep -i '^DEVIN_'` and confirming no `DEVIN_*` vars are set.
5. The skill's reference and asset files exist at `.opencode/skills/cli-devin/{references,assets}/` so prompt-quality and template scenarios resolve.
6. Documented model presets are `swe-1.6` (default), `deepseek-v4` (primary for complex tasks), `glm-5.1` (complex-task fallback — agentic / tool-use), and `kimi-k2.6` (complex-task fallback — large context). Do not substitute alternative model IDs.
7. `--permission-mode auto` is the documented skill default. Escalation to `dangerous` requires explicit operator approval recorded in the scenario evidence.
8. Destructive scenario `DV-007` (`--permission-mode dangerous` + `--sandbox`) MUST run only against rebuildable, non-production data and requires explicit human approval before execution.
9. Cloud-handoff scenarios `DV-018` and `DV-020` require a Devin account provisioned for cloud sessions. Operators without that entitlement may SKIP these scenarios with a documented blocker.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Full command transcript including the exact `devin` invocation with all flags
- The user request that triggered the delegation
- The orchestrator-side reasoning for model preset and permission-mode selection
- The canonical prompt actually dispatched (not just paraphrased), whether natural-human or RCAF for AI-orchestrator scenarios
- Devin stdout (and stderr captured via `2>&1`)
- Exit code from the `devin` invocation
- The final user-facing outcome and a PASS, PARTIAL or FAIL verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `devin <subcommand> [args]` (e.g. `devin --prompt-file /tmp/p.md --model swe-1.6 --permission-mode auto`)
- Bash commands shown as `bash: <command>` (e.g. `bash: command -v devin`)
- File capture shown as `> /tmp/<file>` (orchestrator captures Devin output to a temp file for inspection)
- `->` separates sequential steps in the command sequence column
- Always append `2>&1 </dev/null` for non-interactive / background dispatches per the family stdin-redirect convention

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence (transcripts, captured stdout files, exit codes)
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied (Devin installed, authenticated, non-Devin runtime).
2. Prompt and command sequence were executed as written, including `--permission-mode <mode>` and `2>&1 </dev/null` where applicable.
3. Expected signals are present in Devin stdout / stderr / exit code.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence (e.g. timing data) is incomplete
- `FAIL`: expected behavior missing, contradictory output, dispatch broken or critical check failed
- `SKIP`: documented blocker (e.g. no cloud entitlement for DV-018) — count toward coverage with explicit rationale

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` (DV-001, DV-005, DV-019) forces feature verdict to `FAIL`. The default invocation, default permission mode and self-invocation guard are the load-bearing baseline. If any of them fail the skill cannot be released.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios (`DV-001`, `DV-005`, `DV-019`) are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES`, currently 25). SKIPs with documented blockers count toward coverage.
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats (e.g. bypass-mode approval evidence for DV-007, cloud entitlement for DV-018) in the matching per-feature files.

### Destructive Scenarios

- `DV-007` (`--permission-mode dangerous`): MUST run with explicit user approval and against a sandbox folder, not the live workspace. Capture the approval acknowledgement as evidence.
- `DV-018` (cloud handoff round-trip): transmits local repo state to Cognition's cloud sandbox. MUST complete the 5-check gate from `references/cloud_handoff.md` §3 before dispatch.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start (Devin CLI rate-limit headroom, OS write capability, network reach to Cognition's cloud).
2. Reserve one coordinator on the calling AI side. Do not nest Devin coordinators.
3. Saturate remaining worker slots with parallel `devin --prompt-file` dispatches (read-intent scenarios with `--permission-mode auto` are safe to fan out; `dangerous` mode must serialize on overlapping files).
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run destructive scenario `DV-007` and cloud-handoff `DV-018` in dedicated, isolated waves with no parallel siblings.
6. After each wave, save context and evidence, then begin the next wave.
7. Record a utilization table, per-feature file references and evidence paths in the final report.

### Recommended Wave Layout

- Wave 1 (parallel-safe, read-intent): `DV-001`, `DV-002`, `DV-003`, `DV-004`, `DV-005`, `DV-008`, `DV-009`, `DV-010`, `DV-011`, `DV-012`, `DV-013`, `DV-016`, `DV-026`
- Wave 2 (workspace-write, serial on overlapping paths): `DV-006`, `DV-014`, `DV-015`, `DV-021`, `DV-022`, `DV-023`, `DV-024`
- Wave 3 (guard validation, no overlap): `DV-019`, `DV-020`
- Wave 4 (cloud handoff and ACP, requires entitlement / port): `DV-017`, `DV-018`, `DV-025`
- Wave 5 (DESTRUCTIVE, isolated, requires approval): `DV-007`

### What Belongs In Per-Feature Files

- Real user request
- Prompt field with the canonical text for this scenario
- Expected delegation or alternate-CLI routing (model preset, permission mode, prompt-file location)
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints (e.g. bypass-mode approval evidence, cloud entitlement preflight)

---

## 7. CLI INVOCATION (`DV-001..DV-004`)

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### DV-001 | Default dispatch (swe-1.6 normal)

#### Description

Verify the canonical zero-input default dispatch (`--model swe-1.6 --permission-mode auto`) returns a usable code-generation answer with exit code 0.

#### Scenario Contract

Prompt: `Generate a TypeScript fizzbuzz function with the documented cli-devin default and report model, permission mode, exit code, and PASS/FAIL.`

Expected signals: `devin` exits 0. Stdout contains a TypeScript function named `fizzbuzz`. Output references `n`, `Fizz`, `Buzz`, `FizzBuzz` semantics. The dispatched command line includes `--model swe-1.6` and `--permission-mode auto`.

Desired user-visible outcome: A working `fizzbuzz` function generated by Devin via the documented skill default, with operator-readable evidence that the default invocation pattern was used verbatim.

#### Test Execution

> **Feature File:** [DV-001](01--cli-invocation/001-default-dispatch.md)

### DV-002 | prompt-file vs positional prompt

#### Description

Verify `--prompt-file <path>` accepts a multi-paragraph prompt from disk and produces equivalent output to a positional prompt for small prompts, demonstrating the documented preference for `--prompt-file` on prompts >2KB.

#### Scenario Contract

Prompt: `Dispatch the same short prompt twice — once positional, once via --prompt-file — and confirm equivalent output and exit codes.`

Expected signals: Both invocations exit 0. Stdouts contain the same coherent response (small differences in wording acceptable). The `--prompt-file` invocation reads from a path on disk. Dispatched command lines reflect both shapes.

Desired user-visible outcome: Confirmation that the documented `--prompt-file` flow works end-to-end so longer prompts and programmatic dispatch are supported.

#### Test Execution

> **Feature File:** [DV-002](01--cli-invocation/002-prompt-file-vs-positional.md)

### DV-003 | stdin redirect `</dev/null`

#### Description

Verify that non-interactive / background `devin` dispatches require `</dev/null` to close stdin and that omitting it (in a `while read` loop) causes silent stdin theft per the family-wide stdin-redirect convention.

#### Scenario Contract

Prompt: `Dispatch devin in the background twice — once with </dev/null and once without — inside a while-read loop reading 3 prompts, and confirm the with-redirect run consumes all 3 prompts while the without-redirect run aborts early.`

Expected signals: With-redirect run dispatches 3 invocations and the loop processes all 3 lines. Without-redirect run dispatches the first invocation and the loop exits after 1-2 lines (silent stdin theft). Both dispatched command lines visible in evidence.

Desired user-visible outcome: A demonstrated failure mode that confirms the family convention — operators learn to always append `2>&1 </dev/null` for non-interactive dispatch.

#### Test Execution

> **Feature File:** [DV-003](01--cli-invocation/003-stdin-redirect-dev-null.md)

### DV-004 | Auth pre-flight (`devin auth status`)

#### Description

Verify `devin auth status` returns an authenticated state when the operator has logged in, surfaces a clear unauthenticated message when no token is present, and that cli-devin's Provider Auth Pre-Flight rule never silently substitutes auth state.

#### Scenario Contract

Prompt: `Run devin auth status. If authenticated, dispatch a trivial default invocation. If not, surface devin auth login to the operator and refuse to dispatch — do NOT auto-login.`

Expected signals: `devin auth status` exits 0 when authenticated (output names the handle/profile). When unauthenticated, exit non-zero and stderr names `devin auth login` and the token source `https://app.devin.ai` (Cognition / Codeium / Windsurf bridge). The skill body never auto-substitutes auth state.

Desired user-visible outcome: Operator-visible proof the auth pre-flight is wired correctly and that the skill respects the documented "never substitute" contract.

#### Test Execution

> **Feature File:** [DV-004](01--cli-invocation/004-auth-preflight.md)

---

## 8. PERMISSION MODES (`DV-005..DV-007`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### DV-005 | auto mode (default — auto-approves read-only, prompts on write/exec)

#### Description

Verify `--permission-mode auto` is the binary's default (per `devin --help`) and that read-only tools auto-approve while write/exec actions prompt for confirmation in interactive mode (or surface a refusal/defer in non-interactive `-p` mode).

#### Scenario Contract

Prompt: `Dispatch a read-intent prompt with --permission-mode auto and confirm exit 0 with no confirmation prompts. Then dispatch a destructive-intent prompt and confirm Devin pauses for confirmation rather than auto-executing.`

Expected signals: Read-intent dispatch exits 0 with no prompts. Destructive-intent dispatch either pauses for confirmation (interactive) or returns an output that explicitly defers destructive action (non-interactive — the calling AI surfaces the request to the operator).

Desired user-visible outcome: Confirmation that the documented default is safe by construction — destructive ops never run silently in `auto` mode.

#### Test Execution

> **Feature File:** [DV-005](02--permission-modes/005-auto-mode.md)

### DV-006 | dangerous mode (operator-approved)

#### Description

Verify `--permission-mode dangerous` reduces confirmation prompts and that the cli-devin RULES enforce an explicit operator-approval gate before escalating from `auto`.

#### Scenario Contract

Prompt: `First record an explicit operator approval transcript to use --permission-mode dangerous for a benign code-generation task to /tmp/cli-devin-playbook-dv006/. Then dispatch the task with the elevated mode and confirm Devin completes without operator prompts.`

Expected signals: Approval evidence captured BEFORE dispatch. `devin --permission-mode dangerous` exits 0. Output written to `/tmp/cli-devin-playbook-dv006/`. No confirmation prompts during the run. Dispatch line includes `--permission-mode dangerous`.

Desired user-visible outcome: A working output the operator can inspect, plus evidence that the elevated permission mode is gated by approval per the skill contract.

#### Test Execution

> **Feature File:** [DV-006](02--permission-modes/006-dangerous-mode.md)

### DV-007 | `--sandbox` flag (OS-level process sandboxing, Research Preview)

#### Description

Verify Devin's `--sandbox` flag (Research Preview): OS-level process sandboxing for the exec tool (macOS seatbelt / Linux bwrap+seccomp) layered on top of `--permission-mode dangerous`. v1.0.1.0 correction: replaces the v1.0.0.0 "bypass mode" scenario (binary has no `bypass` permission mode — its strongest mode is `dangerous`).

#### Scenario Contract

Prompt: `Capture explicit operator approval to use --permission-mode dangerous + --sandbox, then dispatch a benign write-only task to /tmp/cli-devin-playbook-dv007/. Verify the dispatch includes both flags, the task completes, and no files outside the playground are touched.`

Expected signals: Operator records explicit user approval BEFORE dispatch. Dispatch line contains `--permission-mode dangerous` AND `--sandbox`. `devin` exits 0. Only files inside `/tmp/cli-devin-playbook-dv007/` are touched. `git status` is clean.

Desired user-visible outcome: A working sandboxed write plus OS-level evidence that the sandbox boundary held.

#### Test Execution

> **Feature File:** [DV-007](02--permission-modes/007-sandbox-flag.md)

---

## 9. MODEL PRESETS (`DV-008..DV-010`, `DV-026`, `DV-028..DV-029`)

This category covers 6 scenario summaries while the linked feature files remain the canonical execution contract. The four single-skill scenarios validate the cli-devin model preset: SWE-1.6 default (DV-008) + DeepSeek v4 primary for complex tasks (DV-009) + GLM 5.1 complex-task fallback for agentic / tool-use (DV-010) + Kimi k2.6 complex-task fallback for large context (DV-026). DV-026 uses an out-of-category ID to avoid renumbering DV-011..DV-025 already in use. The two integration scenarios (DV-028, DV-029) validate the full triple-skill flow with **sk-prompt-small-model** + **sk-prompt** + **cli-devin** acting together on a real dispatch.

### DV-008 | SWE-1.6 (default — context gathering / tool use / simple-medium tasks)

#### Description

Verify `--model swe-1.6` is accepted as the documented skill default and produces a working result on a clearly-scoped single-file task (the use case SWE-1.6 is sized for: context gathering, tool use, and simple-to-medium well-defined work).

#### Scenario Contract

Prompt: `Dispatch a single-file, clearly-scoped utility-generation task with --model swe-1.6 --permission-mode auto and confirm Devin produces a working implementation in one pass.`

Expected signals: `devin` exits 0. Stdout contains a function matching the requested signature. Dispatched command line includes `--model swe-1.6`.

Desired user-visible outcome: A working utility function that the operator can drop in without further reasoning iteration.

#### Test Execution

> **Feature File:** [DV-008](03--model-presets/008-swe-1-6-default.md)

### DV-009 | DeepSeek v4 (primary for complex tasks)

#### Description

Verify `--model deepseek-v4` is accepted as the documented primary pick for complex tasks (ambiguous, multi-step, reasoning-bound) and produces deeper analysis than SWE-1.6 on a complex prompt.

#### Scenario Contract

Prompt: `Dispatch a complex architectural review with --model deepseek-v4 --permission-mode auto and compare output depth to the same prompt under --model swe-1.6.`

Expected signals: Both invocations exit 0. The DeepSeek v4 output cites more design principles, names more trade-offs, and surfaces more ambiguities. Dispatched command lines reflect both model IDs.

Desired user-visible outcome: Two side-by-side review outputs that visibly differ in depth, justifying the cli-devin routing matrix recommendation to use DeepSeek v4 on complex tasks.

#### Test Execution

> **Feature File:** [DV-009](03--model-presets/002-deepseek-v4-complex.md)

### DV-010 | GLM 5.1 (complex-task fallback — agentic / tool-use)

#### Description

Verify `--model glm-5.1` is accepted as a complex-task fallback and produces a coherent multi-step plan on an agentic / tool-use heavy prompt (the shape where DeepSeek v4 doesn't fit and structured tool chaining matters more than deep single-stream reasoning).

#### Scenario Contract

Prompt: `Dispatch a complex agentic / MCP-heavy task with --model glm-5.1 --permission-mode auto and confirm GLM 5.1 produces a coherent multi-step plan.`

Expected signals: `devin` exits 0. Stdout contains a structured multi-step plan with at least 4 sections. Dispatch line includes `--model glm-5.1`.

Desired user-visible outcome: A working agentic plan that the operator can review and feed into a follow-up dispatch.

#### Test Execution

> **Feature File:** [DV-010](03--model-presets/010-glm-5-1-complex-fallback.md)

### DV-026 | Kimi k2.6 (complex-task fallback — large context)

#### Description

Verify `--model kimi-k2.6` is accepted as a complex-task fallback and produces a coherent multi-file consolidated analysis on a large-context prompt (the shape where DeepSeek v4 doesn't fit because the work needs an unusually large context window).

#### Scenario Contract

Prompt: `Dispatch a complex large-context task with --model kimi-k2.6 --permission-mode auto and confirm Kimi k2.6 produces a coherent consolidated analysis spanning multiple files.`

Expected signals: `devin` exits 0. Stdout contains a consolidated analysis that references at least 5 distinct input files. Dispatch line includes `--model kimi-k2.6`.

Desired user-visible outcome: A working consolidated analysis that demonstrates Kimi k2.6's large-context advantage for the complex task.

#### Test Execution

> **Feature File:** [DV-026](03--model-presets/011-kimi-k2-6-complex-fallback.md)

### DV-028 | SWE-1.6 dispatch via sk-prompt-small-model + sk-prompt (triple-skill flow)

#### Description

Verify that a small-model dispatch prompt surfaces `sk-prompt-small-model` and `sk-prompt` alongside `cli-devin`, that `sk-prompt` produces a CLEAR-passing RCAF prompt with a `<pre-plan>` block per the SWE-1.6 contract, and that `cli-devin` dispatches the resulting prompt with `--model swe-1.6`. This is the load-bearing happy path for SWE-1.6 work — the three skills must compose correctly.

#### Scenario Contract

Prompt: `Run the skill advisor on "dispatch SWE-1.6 to write a debounce utility" and confirm sk-prompt-small-model + cli-devin both surface above the 0.8 threshold. Compose the actual dispatch through sk-prompt with RCAF + a 3-step pre-plan block, then run cli-devin with --model swe-1.6 --permission-mode auto and capture the output.`

Expected signals: Advisor returns `sk-prompt-small-model` (conf ≥ 0.85) AND `cli-devin` (conf ≥ 0.80). The composed prompt file contains an explicit `<pre-plan>` block with ≥ 3 ordered steps + acceptance criteria. `devin --model swe-1.6` exits 0. Stdout contains a working debounce function.

Desired user-visible outcome: A working debounce function plus evidence that the three-skill integration produces a higher-quality dispatch than a bare `devin` invocation would.

#### Test Execution

> **Feature File:** [DV-028](03--model-presets/012-swe16-via-sk-prompt-small-model-and-sk-prompt.md)

### DV-029 | DeepSeek-v4-pro via cli-devin Cognition Pro through sk-prompt-small-model + sk-prompt

#### Description

Verify the dispatch matrix in `sk-prompt-small-model/assets/model-profiles.json` correctly identifies cli-devin as a Cognition-Pro path for DeepSeek-v4-pro (one of three available paths), that `sk-prompt` composes a complex-task framework (RCAF or BUILD with medium pre-plan density) for the DeepSeek dispatch, and that `cli-devin --model deepseek-v4` runs to completion. Validates the same triple-skill flow on a Pro-tier model where executor choice and quota_pool selection matter.

#### Scenario Contract

Prompt: `Consult sk-prompt-small-model for the DeepSeek-v4-pro dispatch matrix and pick the cli-devin Cognition Pro path. Compose the prompt through sk-prompt with the right framework + medium pre-plan + standard bundle-gate per the cli-devin v1.0.6.x contract. Dispatch a complex multi-step task with --model deepseek-v4 --permission-mode auto and capture the output.`

Expected signals: Operator records the executor selection rationale citing `sk-prompt-small-model/assets/model-profiles.json` deepseek-v4-pro entry. The composed prompt uses RCAF or BUILD framework with medium pre-plan density and standard bundle-gate wording (NOT strict). `devin --model deepseek-v4` exits 0. Output addresses all 3 acceptance criteria in the pre-plan.

Desired user-visible outcome: A working implementation that demonstrates the model-profile-driven path selection + sk-prompt composition path. Evidence the executor choice (Cognition Pro vs DeepSeek API direct vs opencode-go) was made consciously.

#### Test Execution

> **Feature File:** [DV-029](03--model-presets/013-deepseek-v4-via-sk-prompt-small-model-and-sk-prompt.md)

---

## 10. DEVIN SURFACES (`DV-011..DV-013`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### DV-011 | `devin rules list`

#### Description

Verify `devin rules list` enumerates the rules installed on the operator's Devin profile and that rules referenced in cli-devin prompts can be checked against this list.

#### Scenario Contract

Prompt: `Run devin rules list and capture the rule names. Confirm the output enumerates profile-scoped rules and that the list is parseable.`

Expected signals: `devin rules list` exits 0. Output enumerates zero or more rules with names. If non-empty, each rule has a name the calling AI can reference in prompts.

Desired user-visible outcome: An operator-visible inventory of installed rules so the calling AI can reference them by name in dispatches.

#### Test Execution

> **Feature File:** [DV-011](04--devin-surfaces/014-devin-rules-list.md)

### DV-012 | `devin skills list` / `devin skills show`

#### Description

Verify `devin skills list` enumerates skill routines on the profile and `devin skills show <name>` displays details for a named skill.

#### Scenario Contract

Prompt: `Run devin skills list, pick the first skill name, then run devin skills show <name> and capture the structured details.`

Expected signals: Both invocations exit 0. `list` output is non-empty (if profile has skills) or empty with a clear message. `show` output contains name, description, and any associated triggers.

Desired user-visible outcome: An operator-visible inventory of installed skills so the calling AI can route into them via prompt body references.

#### Test Execution

> **Feature File:** [DV-012](04--devin-surfaces/015-devin-skills-show.md)

### DV-013 | `devin mcp` lifecycle

#### Description

Verify `devin mcp add <name>`, `devin mcp list`, and `devin mcp login <name>` form a coherent MCP-server lifecycle that the calling AI can drive when integrating external tools.

#### Scenario Contract

Prompt: `Run devin mcp list, add a stub MCP server with devin mcp add <name>, log in with devin mcp login <name>, then re-list to confirm registration.`

Expected signals: All four invocations exit 0. The added server appears in the post-add `mcp list` output. The login flow surfaces an OAuth prompt or token entry. Operator records the full transcript.

Desired user-visible outcome: A working MCP-server registration end-to-end so operators can extend Devin with custom data sources.

#### Test Execution

> **Feature File:** [DV-013](04--devin-surfaces/016-devin-mcp-lifecycle.md)

---

## 11. SESSION CONTINUITY (`DV-014..DV-016`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### DV-014 | `devin --continue` (resume last)

#### Description

Verify `devin --continue` (alias `-c`) resumes the most recent session and that the new turn carries forward context from the previous turn.

#### Scenario Contract

Prompt: `Dispatch a 2-turn task: turn 1 sketches a TypeScript type, turn 2 implements a validator via --continue. Confirm turn 2 references the turn-1 type by name.`

Expected signals: Both invocations exit 0. Turn 2 stdout names the type introduced in turn 1. Dispatch lines reflect the `--continue` flag.

Desired user-visible outcome: A working two-turn task plus evidence that `--continue` preserves state across dispatches.

#### Test Execution

> **Feature File:** [DV-014](05--session-continuity/017-continue-last-session.md)

### DV-015 | `devin --resume <id>` (specific session)

#### Description

Verify `devin --resume <ID>` resumes a specific session by id and that an out-of-order resume is supported (resume an older session while a newer one exists).

#### Scenario Contract

Prompt: `Dispatch three sequential sessions, capture each session id, then resume the FIRST one with --resume <id> and confirm continuity.`

Expected signals: All invocations exit 0. The resumed session refers back to its own original context, not the most recent session's context.

Desired user-visible outcome: Operators can revisit older Devin sessions out of order, useful for branching work or comparing approaches.

#### Test Execution

> **Feature File:** [DV-015](05--session-continuity/018-resume-by-session-id.md)

### DV-016 | `devin list` (session inventory)

#### Description

Verify `devin list` (alias `ls`) enumerates available sessions with timestamps and ids that match the ones used by `--resume`.

#### Scenario Contract

Prompt: `Dispatch two new sessions, then run devin list, and confirm both newly created sessions appear with parseable timestamps and ids.`

Expected signals: `devin list` exits 0. Output enumerates sessions with ids matching the ones captured during dispatch. Timestamps are present and parseable.

Desired user-visible outcome: An operator-visible session inventory the calling AI can use to pick the right `--resume <id>` target.

#### Test Execution

> **Feature File:** [DV-016](05--session-continuity/019-devin-list.md)

---

## 12. CLOUD HANDOFF (`DV-017..DV-018`, `DV-027`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. The cloud-handoff capability is Devin's unique differentiator vs the rest of the cli-* family — see `references/cloud_handoff.md`. v1.0.2.0 split DV-018 into a shell-runnable surface check (new DV-027) and the operator-driven async round trip (DV-018).

### DV-017 | 5-check operator-confirmation gate (NEGATIVE)

#### Description

Verify the cli-devin 5-check operator-confirmation gate refuses to proceed when the operator has not explicitly confirmed cloud handoff in the same turn, even when the prompt body contains cloud-handoff keywords.

#### Scenario Contract

Prompt: `As a cross-AI orchestrator running the operator-confirmation gate, present a prompt that mentions "cloud handoff" but provides NO explicit operator confirmation. Verify the gate refuses to proceed and surfaces the missing checks.`

Expected signals: The calling AI surfaces the 5-check gate from `references/cloud_handoff.md` §3 to the operator. No `devin` invocation is dispatched. Output names which of the 5 checks are missing.

Desired user-visible outcome: Evidence that inferred consent is rejected — cloud handoff requires explicit operator phrasing AND account confirmation AND repo-state review AND acceptance-criteria sufficiency AND permission-mode selection in the same turn.

#### Test Execution

> **Feature File:** [DV-017](06--cloud-handoff/020-five-check-gate-negative.md)

### DV-018 | Cloud handoff round-trip (LIVE, requires entitlement)

#### Description

Verify a successful cloud-handoff round trip: the calling AI completes the 5-check gate, dispatches a local `devin` session interactively, the operator initiates the handoff in the live TUI, and the cloud agent returns a PR URL plus summary.

#### Scenario Contract

Prompt: `Spec folder: /tmp/cli-devin-playbook-dv018 (pre-approved, skip Gate 3). Complete the 5-check gate, dispatch devin interactively with --model swe-1.6 --permission-mode auto seeded by a small refactor prompt, instruct the operator to initiate cloud handoff in the TUI, wait for the PR URL to surface, and verify the cloud agent's summary references the requested change.`

Expected signals: All 5 checks recorded. `devin` launches interactively. Operator-initiated handoff transitions the session to the cloud. A PR URL eventually surfaces (via email, Devin web UI, or returned status). The cloud agent's summary references the requested change.

Desired user-visible outcome: A working PR on a feature branch produced by the cloud agent while the operator's laptop was closed, demonstrating the headline differentiator end-to-end.

#### Test Execution

> **Feature File:** [DV-018](06--cloud-handoff/021-cloud-handoff-roundtrip.md)

---

## 13. SELF-INVOCATION GUARD (`DV-019..DV-020`)

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### DV-019 | Self-invocation refused (DEVIN_* env or ancestry)

#### Description

Verify the self-invocation guard from SKILL.md §2 refuses to load when the calling AI is itself a local `devin` session, detected via `DEVIN_*` env vars OR `devin` in process ancestry.

#### Scenario Contract

Prompt: `Simulate a local devin session by setting DEVIN_SESSION_ID=test in the environment, then attempt to load cli-devin and dispatch. Verify the guard refuses with the documented error message.`

Expected signals: With `DEVIN_*` env set, the guard refuses to dispatch. The refusal message names the detection signal (env var). No `devin` invocation is dispatched.

Desired user-visible outcome: Evidence that the self-invocation guard fails closed and refuses with a clear operator-facing message.

#### Test Execution

> **Feature File:** [DV-019](07--self-invocation-guard/023-self-invocation-refused.md)

### DV-020 | Cloud-handoff exception allowed (explicit keywords)

#### Description

Verify the self-invocation guard's single legitimate exception: explicit cloud-handoff keywords (`cloud handoff`, `hand off to cloud`, `devin cloud`) allow the dispatch to proceed because the cloud session is a separate sandbox, not self-invocation.

#### Scenario Contract

Prompt: `Simulate a local devin session (DEVIN_SESSION_ID=test set), but include "cloud handoff" in the dispatch request AND record an explicit operator confirmation in the same turn. Verify the guard allows the dispatch to proceed past the env-var check.`

Expected signals: With `DEVIN_*` env set AND cloud-handoff keywords AND operator confirmation, the guard allows the dispatch. With env set but missing either keywords or confirmation, the guard refuses.

Desired user-visible outcome: Evidence that the documented exception works — operators can initiate cloud handoff from a local Devin session without tripping the guard, but only with explicit phrasing and confirmation.

#### Test Execution

> **Feature File:** [DV-020](07--self-invocation-guard/024-cloud-handoff-exception.md)

---

## 14. CROSS-AI DISPATCH (`DV-021..DV-024`)

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract. Each scenario exercises the cli-devin skill from one of the four sibling cli-* runtimes.

### DV-021 | Dispatch from cli-codex (gpt-5.5 medium)

#### Description

Verify a calling AI inside a `cli-codex` (gpt-5.5 medium) session can dispatch a `devin` task using the cli-devin Default Invocation block and integrate the output.

#### Scenario Contract

Prompt: `From a cli-codex session, dispatch devin --prompt-file /tmp/devin-from-codex.md --model swe-1.6 --permission-mode auto and confirm Codex captures stdout and integrates the result.`

Expected signals: cli-codex's Bash invocation runs successfully. `devin` exits 0. cli-codex captures the output. The calling AI integrates the result without losing context.

Desired user-visible outcome: A working cross-AI dispatch demonstrating cli-codex → cli-devin works end-to-end.

#### Test Execution

> **Feature File:** [DV-021](08--cross-ai-dispatch/025-from-cli-codex.md)

### DV-022 | Dispatch from cli-claude-code

#### Description

Verify a calling AI inside a `cli-claude-code` session can dispatch a `devin` task and integrate the output.

#### Scenario Contract

Prompt: `From a cli-claude-code session, dispatch devin --prompt-file /tmp/devin-from-claude.md --model swe-1.6 --permission-mode auto and confirm Claude Code captures stdout and integrates the result.`

Expected signals: cli-claude-code's Bash invocation runs successfully. `devin` exits 0. The calling AI parses the output and integrates without losing context.

Desired user-visible outcome: A working cross-AI dispatch demonstrating cli-claude-code → cli-devin works end-to-end.

#### Test Execution

> **Feature File:** [DV-022](08--cross-ai-dispatch/026-from-cli-claude-code.md)

### DV-023 | Dispatch from cli-opencode

#### Description

Verify a calling AI inside a `cli-opencode` session can dispatch a `devin` task. Note: this is NOT self-invocation for cli-devin since cli-opencode is a different runtime.

#### Scenario Contract

Prompt: `From a cli-opencode session, dispatch devin --prompt-file /tmp/devin-from-opencode.md --model swe-1.6 --permission-mode auto and confirm OpenCode's Bash tool captures stdout and integrates the result.`

Expected signals: cli-opencode's Bash invocation runs successfully. `devin` exits 0. cli-opencode does NOT trip its own self-invocation guard (it's calling into a different binary). The output integrates cleanly.

Desired user-visible outcome: A working cross-AI dispatch demonstrating cli-opencode → cli-devin works end-to-end without spurious guard activation.

#### Test Execution

> **Feature File:** [DV-023](08--cross-ai-dispatch/027-from-cli-opencode.md)

---

## 15. ACP BRIDGE (`DV-025`)

This category covers 1 scenario summary while the linked feature file remains the canonical execution contract. The category exercises Devin as an Agent Client Protocol (ACP) server, reachable from ACP-aware clients.

### DV-025 | `devin acp` server lifecycle

#### Description

Verify `devin acp` launches a long-lived Agent Client Protocol server that ACP-aware clients can connect to, and that the server shuts down cleanly when the operator terminates it.

#### Scenario Contract

Prompt: `Launch devin acp in the background, verify the documented ACP endpoint (host/port) is reachable, send a small ACP request, capture the response, then terminate the server cleanly.`

Expected signals: `devin acp` launches and stays up. The endpoint accepts at least one ACP request. The response is parseable. Terminating the process exits cleanly with no zombie state.

Desired user-visible outcome: A working `devin acp` server validated end-to-end so operators can embed Devin in ACP-aware workflows.

#### Test Execution

> **Feature File:** [DV-025](09--acp-bridge/029-devin-acp-server.md)

---

## 16. AUTOMATED TEST CROSS-REFERENCE

The `cli-devin` skill is an orchestrator wrapper around a third-party binary (`devin`) and does not own a Python or JavaScript test suite of its own. Cross-references in this section point at upstream and adjacent test surfaces:

| Test Surface | Coverage | Playbook Overlap |
|---|---|---|
| Upstream Devin CLI docs (`https://cli.devin.ai/docs/reference/commands`) | Devin binary correctness | Out of scope for this playbook. We validate that our skill dispatches the binary correctly, not that the binary itself is correct |
| Cognition blog (`https://cognition.ai/blog/devin-for-terminal`) | Cloud handoff narrative + architecture rationale | Anchors `DV-017`, `DV-018` |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | Markdown structure validation for this playbook | This playbook itself (root MUST validate cleanly) |
| `.opencode/skills/cli-devin/references/cloud_handoff.md` §3 5-check gate | Operator-confirmation gate contract | `DV-017`, `DV-018` |
| `.opencode/skills/cli-devin/SKILL.md` §2 Self-Invocation Guard | Layered guard pseudocode | `DV-019`, `DV-020` |

There is no automated coverage for default-dispatch, permission-mode, model-preset, session-continuity, cross-AI-dispatch or ACP scenarios. Manual playbook execution IS the canonical validation surface for those features. Re-run the wave plan in §6 before each release.

---

## 17. FEATURE CATALOG CROSS-REFERENCE INDEX

### CLI INVOCATION

- DV-001: [Default dispatch (swe-1.6 normal)](01--cli-invocation/001-default-dispatch.md)
- DV-002: [prompt-file vs positional prompt](01--cli-invocation/002-prompt-file-vs-positional.md)
- DV-003: [stdin redirect `</dev/null`](01--cli-invocation/003-stdin-redirect-dev-null.md)
- DV-004: [Auth pre-flight (`devin auth status`)](01--cli-invocation/004-auth-preflight.md)

### PERMISSION MODES

- DV-005: [auto mode (default — auto-approves read-only, prompts on write/exec)](02--permission-modes/005-auto-mode.md)
- DV-006: [dangerous mode (operator-approved)](02--permission-modes/006-dangerous-mode.md)
- DV-007: [`--sandbox` flag (OS-level process sandboxing, Research Preview)](02--permission-modes/007-sandbox-flag.md)

### MODEL PRESETS

- DV-008: [SWE-1.6 (default — context gathering / tool use / simple-medium tasks)](03--model-presets/008-swe-1-6-default.md)
- DV-009: [DeepSeek v4 (primary for complex tasks)](03--model-presets/002-deepseek-v4-complex.md)
- DV-010: [GLM 5.1 (complex-task fallback — agentic / tool-use)](03--model-presets/010-glm-5-1-complex-fallback.md)
- DV-026: [Kimi k2.6 (complex-task fallback — large context)](03--model-presets/011-kimi-k2-6-complex-fallback.md)

### DEVIN SURFACES

- DV-011: [`devin rules list`](04--devin-surfaces/014-devin-rules-list.md)
- DV-012: [`devin skills list` / `devin skills show`](04--devin-surfaces/015-devin-skills-show.md)
- DV-013: [`devin mcp` lifecycle](04--devin-surfaces/016-devin-mcp-lifecycle.md)

### SESSION CONTINUITY

- DV-014: [`devin --continue` (resume last)](05--session-continuity/017-continue-last-session.md)
- DV-015: [`devin --resume <id>` (specific session)](05--session-continuity/018-resume-by-session-id.md)
- DV-016: [`devin list` (session inventory)](05--session-continuity/019-devin-list.md)

### CLOUD HANDOFF

- DV-017: [5-check operator-confirmation gate (NEGATIVE)](06--cloud-handoff/020-five-check-gate-negative.md)
- DV-018: [Cloud handoff round-trip (LIVE — operator-driven manual)](06--cloud-handoff/021-cloud-handoff-roundtrip.md)
- DV-027: [Cloud surface accessibility (shell-runnable surface check)](06--cloud-handoff/022-cloud-surface-accessibility.md)

### SELF-INVOCATION GUARD

- DV-019: [Self-invocation refused (DEVIN_* env or ancestry)](07--self-invocation-guard/023-self-invocation-refused.md)
- DV-020: [Cloud-handoff exception allowed (explicit keywords)](07--self-invocation-guard/024-cloud-handoff-exception.md)

### CROSS-AI DISPATCH

- DV-021: [Dispatch from cli-codex (gpt-5.5 medium)](08--cross-ai-dispatch/025-from-cli-codex.md)
- DV-022: [Dispatch from cli-claude-code](08--cross-ai-dispatch/026-from-cli-claude-code.md)
- DV-023: [Dispatch from cli-opencode](08--cross-ai-dispatch/027-from-cli-opencode.md)

### ACP BRIDGE

- DV-025: [`devin acp` server lifecycle](09--acp-bridge/029-devin-acp-server.md)
