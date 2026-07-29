---
title: "cli-pi: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, evidence rules, orchestration guidance, and per-scenario validation files for the cli-pi skill."
version: 1.0.0.1
---

# cli-pi: Manual Testing Playbook

> **EXECUTION POLICY**: Every executable scenario MUST be executed for real - not mocked, not stubbed, and not classified as an unsupported automation case. AI agents executing these scenarios must run the actual Pi commands, including `pi --offline --approve -p "..."` for dispatches and `pi install npm:<pkg> -l --approve` only when an install scenario explicitly covers an already-approved package, inspect real output, capture stderr and exit codes, and verify behavior from output content. The only acceptable classifications are PASS, FAIL, or SKIP with a specific blocker. This playbook uses strict three-state verdict discipline throughout, including review and release readiness.

> **SELF-INVOCATION GUARD**: This playbook validates the `cli-pi` skill from a non-Pi runtime. Before composing a dispatch, read `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md` §2, **Self-Invocation Guard**. The guard checks whether the parent process command contains `/pi` or ends with ` pi`, and whether the current project contains `.pi`; the project-directory result is a non-conclusive heuristic. The guard does not treat a missing environment variable as proof of safety. If it detects a signal, refuse the dispatch and record that signal.

This document is the operator directory and package-level validation contract for the `cli-pi` skill. It defines realistic requests, deterministic command notation, evidence expectations, review rules, wave planning, category summaries, automated-test anchors, and links to the 21 canonical scenario files.

---

This playbook package follows the Feature Catalog split-document pattern. The root document owns shared policy and the directory index; each category file owns one scenario's full execution truth.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `cli-invocation/`
- `skill-discovery/`
- `command-dispatch/`
- `agent-bridge/`
- `mcp-host-integration/`
- `hook-extension-layer/`
- `model-dispatch/`
- `prompt-quality/`
- `goal-hook/`

---

## 1. OVERVIEW

This playbook provides 21 deterministic scenarios across 9 categories validating the `cli-pi` skill surface. Each scenario keeps its `PI-NNN` identifier and links to one dedicated file with the complete execution contract.

Coverage note (2026-07-27): the package covers Pi version/help and settings state, unreliable headless failure exit codes, a negative-control syntax hallucination probe, recursive skill discovery, prompt-template flattening and substitution, the community `pi-subagents` bridge, MCP stdio and streamable HTTP shapes, project/global precedence, native extension loading and lifecycle registration, guard error discipline, the enforced model roster, provider/settings interaction, and CLEAR prompt-quality checks. Successful provider-backed model turns remain an explicit execution boundary when credentials are absent; `PI-020` (2026-07-28) live-traces the session-lifecycle extension bridges on a machine with authenticated providers. `PI-021` (2026-07-29) live-validates the cross-runtime goal hook's input-transform injection and turn-end verify against the free offline model, needing no provider credential, and honestly records where a single-shot capture did not confirm the documented `session_start` restore.

### Realistic Test Model

1. A realistic user request is given to an orchestrator running outside Pi.
2. The orchestrator reads the `cli-pi` routing and guard contract, selects print, JSON, or RPC deliberately, and constructs a bounded prompt.
3. The operator captures the exact command, stdout, stderr, exit code, changed-file state, and any provider or trust blocker.
4. The scenario passes only when its stated observable signals are present and the user-visible outcome is useful. A named blocker produces SKIP, not an assumed success.

### What Each Scenario File Explains

- The realistic user request that should trigger the Pi route
- The exact Pi-facing prompt
- The expected mode, trust, tool, and workspace choices
- The observable signals and evidence to capture
- The desired user-visible outcome
- The source files that justify the contract

---

## 2. GLOBAL PRECONDITIONS

1. The working directory is the repository root and contains `.git/`.
2. Pi is installed and available: `command -v pi` returns a path and `pi --version` returns `0.82.1` in the current worktree.
3. The operator has a safe Pi config directory. Do not write the real `~/.pi/agent/` directory; use the documented `PI_CODING_AGENT_DIR` override pointing at an isolated temporary directory when a live command needs config state.
4. Successful provider-backed turns require provider credentials. If the output says `No API key found for the selected model`, any sub-check requiring a model turn is SKIP with that exact blocker; startup, static, and local package checks may still pass.
5. The active runtime is not Pi itself. Run the self-invocation guard from a shell or another AI runtime and record any ancestry or `.pi` heuristic signal.
6. The `cli-pi` skill references and assets exist under `.opencode/skills/cli-external-orchestration/cli-pi/{references,assets}/`.
7. The current project-local fixtures exist before execution: `.pi/settings.json`, `.pi/prompts/`, `.pi/agents/`, `.pi/extensions/`, and `.pi/mcp.json`.
8. Do not install a new package during routine playbook execution. Package scenarios validate the already-installed `pi-subagents` and `pi-mcp-extension` fixtures or cite their existing captured evidence.
9. Do not write into the operator's real global Pi config or agent directory. Project/global precedence scenarios are documentation-grounded and SKIP any live collision test that would cross that boundary.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The realistic user request and the exact Pi prompt
- The complete command sequence, including `PI_CODING_AGENT_DIR` isolation when used
- Pi stdout and stderr, captured together when the command is short and separately when event parsing requires it
- Exit code recorded alongside output content; exit code alone is never proof of model execution
- Relevant file snapshots, counts, diffs, and package or extension names
- Provider, trust, or global-config blockers named exactly where they occur
- The final user-visible outcome and a PASS, FAIL, or SKIP verdict
- For JSON or RPC scenarios, the parsed event or protocol evidence rather than a guessed final response
- For cite-only scenarios, the exact existing implementation evidence and the reason no second live run was needed

---

## 4. DETERMINISTIC COMMAND NOTATION

- Pi dispatches are written as `pi --offline --approve -p "<prompt>" </dev/null` unless the scenario explicitly selects JSON or RPC.
- Availability checks are written as `bash: command -v pi`.
- Config isolation is written as `PI_CODING_AGENT_DIR=<temporary-dir> pi ...`; the temporary directory must not be the operator's real home.
- File capture is written as `> /private/tmp/<file>` or a named isolated fixture directory.
- `->` separates sequential steps in a command-sequence cell.
- `find ... | wc -l` counts are captured as output, not inferred from directory listings.
- JSONL scenarios must parse one event per line and retain stderr separately.
- A command that reaches a provider error is not a successful model dispatch; classify the relevant model-turn check as SKIP when the missing credential is the named blocker.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. All 21 linked scenario files under the nine category folders
3. Real command transcripts or cited captured evidence for every executable scenario
4. The scenario-to-feature coverage map in §17
5. Triage notes for every FAIL or SKIP result

### Scenario Acceptance Rules

For each scenario, check:

1. Preconditions and isolation boundaries were satisfied.
2. The exact prompt and command sequence were used.
3. Expected output, file, event, or configuration signals are present.
4. Exit code is recorded as supporting evidence, never as the sole success signal.
5. The verdict rationale is explicit and reproducible.

Scenario verdict:
- `PASS`: every acceptance check in the scenario's declared scope is true.
- `FAIL`: an expected behavior is contradicted, a required command fails for a reason within the scenario's scope, or the evidence is incomplete without a valid blocker.
- `SKIP`: a specific named blocker prevents the declared check, such as missing provider credentials or the real-global-config safety boundary.

### Feature Verdict Rules

- `PASS`: all mapped scenarios are PASS, or a documented SKIP is outside the feature's executable core.
- `FAIL`: any mapped scenario has an unexplained FAIL.

### Release Readiness Rule

Release is `READY` only when:

1. No scenario has an unresolved FAIL.
2. The critical baseline scenarios `PI-001`, `PI-002`, `PI-007`, `PI-011`, `PI-014`, and `PI-017` have evidence or a still-valid named blocker.
3. Coverage is 100%: all 21 root-index IDs map to exactly one scenario file.
4. Every SKIP carries a specific blocker and a safe re-run condition.
5. The root document and all scenario files pass the required document and link checks.

### Root-vs-Scenario Rule

Keep global verdict logic, isolation policy, and wave planning here. Keep exact prompts, command transcripts, feature-specific caveats, and scenario verdicts in the matching scenario files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records safe execution waves for the manual-testing package. It does not grant Pi permission to become the outer conductor or to bypass the current runtime's evidence rules.

### Operational Rules

1. Reserve one coordinator on the calling AI side; do not nest Pi coordinators.
2. Run read-only inventory and static checks in parallel when they do not share mutable config.
3. Serialize commands that load project extensions or MCP packages because startup state and external subprocesses overlap.
4. Pre-assign `PI-NNN` IDs and their exact scenario files before a wave starts.
5. Use an isolated temporary config directory for every live probe that might create Pi locks or trust state.
6. After each wave, retain the transcript, output files, exit code, and blocker classification before starting the next wave.
7. Never use a provider-backed result from one scenario as evidence for a different scenario's prompt or model contract.

### Recommended Wave Layout

- Wave 1, parallel-safe static and filesystem checks: `PI-001`, `PI-003`, `PI-004`, `PI-005`, `PI-006`, `PI-008`, `PI-010`, `PI-013`, `PI-017`, `PI-018`, `PI-019`
- Wave 2, isolated Pi startup and extension/package loading: `PI-007`, `PI-009`, `PI-014`, `PI-015`, `PI-021`
- Wave 3, cite-only MCP evidence: `PI-011`, `PI-012`
- Wave 4, guarded negative and precedence checks: `PI-002`, `PI-016`
- Wave 5, authenticated live traces (requires a provider credential and a probe fixture): `PI-020`

### What Belongs In Scenario Files

- One realistic user request and one canonical prompt
- One exact command sequence
- Expected signals and captured evidence
- PASS, FAIL, or SKIP criteria
- Scenario-specific rollback, credential, or global-config boundaries

---

## 7. CLI INVOCATION (`PI-001..PI-003`)

This category covers version/help, project settings state, unreliable failure exit-code semantics, and a negative control against invented Pi syntax.

- `PI-001`: [Version/help + settings merge](cli-invocation/default-invocation-and-settings-merge.md)
- `PI-002`: [Headless exit-code and event semantics](cli-invocation/headless-exit-code-and-event-semantics.md)
- `PI-003`: [Hallucination fixture for undocumented Pi syntax](cli-invocation/hallucination-fixture-undocumented-pi-syntax.md)

---

## 8. SKILL DISCOVERY (`PI-004..PI-006`)

This category checks the configured `.opencode/skills/` pointer, recursive discovery claims, nested-mode flattening risk, and project-skill trust behavior without claiming a live hub count when the provider gate prevents introspection.

- `PI-004`: [Recursive skill discovery and hub surface](skill-discovery/recursive-skill-discovery-hub-surface.md)
- `PI-005`: [Nested skill flattening risk](skill-discovery/nested-skill-flattening-risk.md)
- `PI-006`: [Project-skill trust prompt persistence](skill-discovery/project-skill-trust-prompt-persistence.md)

---

## 9. COMMAND DISPATCH (`PI-007..PI-008`)

This category validates the flat `.pi/prompts/` mirror and the documented `$ARGUMENTS` substitution token.

- `PI-007`: [Flat prompt discovery](command-dispatch/flat-prompt-discovery.md)
- `PI-008`: [Argument substitution](command-dispatch/argument-substitution.md)

---

## 10. AGENT BRIDGE (`PI-009..PI-010`)

This category covers the installed community subagent bridge, project agent mirrors, schema synchronization, and the documented project-over-global collision rule.

- `PI-009`: [Pi-subagents agent parsing and tool surface](agent-bridge/pi-subagents-agent-parse.md)
- `PI-010`: [Project agent override](agent-bridge/project-agent-override.md)

---

## 11. MCP HOST INTEGRATION (`PI-011..PI-013`)

This category uses the existing captured MCP evidence for native stdio connection, lazy connected-only behavior, and the project/global precedence boundary.

- `PI-011`: [Stdio MCP transport discovery](mcp-host-integration/stdio-mcp-transport-discovery.md)
- `PI-012`: [Streamable HTTP positive control](mcp-host-integration/streamable-http-positive-control.md)
- `PI-013`: [Project/global MCP precedence](mcp-host-integration/project-global-mcp-precedence.md)

---

## 12. HOOK EXTENSION LAYER (`PI-014..PI-016`, `PI-020`)

This category validates project-local extension auto-discovery, registration against the real event names used by the bridges, the actual fail-open error discipline implemented by those bridges, and live firing of the session-lifecycle bridges against an authenticated provider.

- `PI-014`: [Extension auto-discovery](hook-extension-layer/extension-auto-discovery.md)
- `PI-015`: [Lifecycle event registration](hook-extension-layer/lifecycle-event-registration.md)
- `PI-016`: [Fail-open guard discipline](hook-extension-layer/fail-open-guard-discipline.md)
- `PI-020`: [Session-lifecycle bridges](hook-extension-layer/session-lifecycle-bridges.md)

---

## 13. MODEL DISPATCH (`PI-017..PI-018`)

This category checks the seven-model allowlist and the settings/provider interaction without inventing an `auto` default or claiming a provider-backed turn without credentials.

- `PI-017`: [Supported-model allowlist smoke](model-dispatch/supported-model-allowlist-smoke.md)
- `PI-018`: [Provider and settings merge](model-dispatch/provider-settings-merge.md)

---

## 14. PROMPT QUALITY (`PI-019`)

This category applies the canonical CLEAR card before a non-trivial Pi dispatch and confirms the Pi-specific card exists as a thin, correctly shaped delegator.

- `PI-019`: [CLEAR prompt-quality card](prompt-quality/clear-prompt-quality-card.md)

---

## 15. GOAL HOOK (`PI-021`)

This category validates the runtime-neutral cross-runtime goal hook (`.opencode/hooks/goal/`) under Pi: the `input`-transform injection onto the operator-visible prompt, `turn_end` heuristic verify and turn recording, the shared `bin/goal.cjs` manage-CLI envelope, prompt-injection hardening, and `MK_GOAL_STATE_DIR` isolation. It needs no provider credential because the offline free model is sufficient, and it honestly records where a single-shot live capture did not confirm the documented `session_start` restore rather than assuming it passed.

- `PI-021`: [Cross-runtime goal hook: input injection, turn-end verify, manage CLI, hardening](goal-hook/goal-hook.md)

---

## 16. CURRENT EXECUTION BOUNDARIES

The current worktree has no provider credential, so a successful model turn cannot be claimed from the captured probes. Pi also attempted to create locks below the real `~/.pi/agent/` path when invoked without isolation; the sandbox denied those writes with `EPERM`. Future operators must use `PI_CODING_AGENT_DIR` pointed at a disposable directory and must not weaken the global-config safety boundary. Static discovery, schema, settings, extension-load, and allowlist checks remain independently executable. `PI-021`'s primary checks (input injection, turn-end verify, manage CLI, hardening, isolation) do not need a provider credential at all, since the goal hook's live probe uses Pi's free offline model; only its `session_start` restore sub-check remains an open boundary, tracked as a SKIP in that scenario file rather than an assumed PASS.

---

## 17. AUTOMATED TEST CROSS-REFERENCE

The `cli-pi` skill is an orchestrator wrapper around the Pi binary and community packages; the manual playbook remains the operator-visible validation surface for dispatch behavior.

| Test Surface | Coverage | Playbook Overlap |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md` | Routing, self-invocation guard, provider preflight, headless modes, and hard rules | `PI-001`, `PI-002`, `PI-003`, `PI-017`, `PI-018` |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md` | Confirmed flags, config-dir override, JSON/RPC distinctions, and output-first failure handling | `PI-001`, `PI-002`, `PI-017` |
| `.opencode/skills/system-spec-kit/scripts/pi/sync-prompts-pi.cjs` | Flat prompt generation and drift checking | `PI-007`, `PI-008` |
| `.opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs` | Project agent translation and sync checking | `PI-009`, `PI-010` |
| `.pi/extensions/*.ts` and the installed Pi extension declarations | Extension factories, event registration, guard-core and session-lifecycle bridge behavior | `PI-014`, `PI-015`, `PI-016`, `PI-020` |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Pi model allowlist and default | `PI-017` |
| `.opencode/hooks/goal/pi/goal-pi.test.mjs` | Render selection, heuristic verifier, factory registration shape, fail-open contracts for the Pi goal-hook adapter | `PI-021` |
| `.opencode/hooks/goal/lib/goal-core.test.cjs` | Shared cross-runtime goal-core state I/O, rendering, and hardening | `PI-021` |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Root markdown structure validation | This root playbook |

There is no substitute automated test for a provider-backed Pi model turn, recursive skill enumeration, trust persistence, a real global/project collision test, or a live `session_start` restore delivery through Pi's real extension loader. Those gaps are explicit in the relevant scenario files.

---

## 18. FEATURE CATALOG CROSS-REFERENCE INDEX

### CLI INVOCATION

- PI-001: [Version/help + settings merge](cli-invocation/default-invocation-and-settings-merge.md)
- PI-002: [Headless exit-code and event semantics](cli-invocation/headless-exit-code-and-event-semantics.md)
- PI-003: [Hallucination fixture for undocumented Pi syntax](cli-invocation/hallucination-fixture-undocumented-pi-syntax.md)

### SKILL DISCOVERY

- PI-004: [Recursive skill discovery and hub surface](skill-discovery/recursive-skill-discovery-hub-surface.md)
- PI-005: [Nested skill flattening risk](skill-discovery/nested-skill-flattening-risk.md)
- PI-006: [Project-skill trust prompt persistence](skill-discovery/project-skill-trust-prompt-persistence.md)

### COMMAND DISPATCH

- PI-007: [Flat prompt discovery](command-dispatch/flat-prompt-discovery.md)
- PI-008: [Argument substitution](command-dispatch/argument-substitution.md)

### AGENT BRIDGE

- PI-009: [Pi-subagents agent parsing and tool surface](agent-bridge/pi-subagents-agent-parse.md)
- PI-010: [Project agent override](agent-bridge/project-agent-override.md)

### MCP HOST INTEGRATION

- PI-011: [Stdio MCP transport discovery](mcp-host-integration/stdio-mcp-transport-discovery.md)
- PI-012: [Streamable HTTP positive control](mcp-host-integration/streamable-http-positive-control.md)
- PI-013: [Project/global MCP precedence](mcp-host-integration/project-global-mcp-precedence.md)

### HOOK EXTENSION LAYER

- PI-014: [Extension auto-discovery](hook-extension-layer/extension-auto-discovery.md)
- PI-015: [Lifecycle event registration](hook-extension-layer/lifecycle-event-registration.md)
- PI-016: [Fail-open guard discipline](hook-extension-layer/fail-open-guard-discipline.md)
- PI-020: [Session-lifecycle bridges](hook-extension-layer/session-lifecycle-bridges.md)

### MODEL DISPATCH

- PI-017: [Supported-model allowlist smoke](model-dispatch/supported-model-allowlist-smoke.md)
- PI-018: [Provider and settings merge](model-dispatch/provider-settings-merge.md)

### PROMPT QUALITY

- PI-019: [CLEAR prompt-quality card](prompt-quality/clear-prompt-quality-card.md)

### GOAL HOOK

- PI-021: [Cross-runtime goal hook: input injection, turn-end verify, manage CLI, hardening](goal-hook/goal-hook.md)
