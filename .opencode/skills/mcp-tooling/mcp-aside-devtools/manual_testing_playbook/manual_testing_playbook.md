---
title: "MCP Aside Devtools: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, review/orchestration guidance, execution expectations, and per-feature validation files for the mcp-aside-devtools skill."
version: 1.0.0.0
---

# MCP Aside Devtools: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

This document combines the full manual-validation contract for the `mcp-aside-devtools` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide while per-feature files carry the scenario-specific execution truth. Aside is the AI-browser surface for OpenCode; the CLI (`aside`) is the primary interface with two lanes (agent tasks and the deterministic REPL), while the Aside MCP server (`aside mcp`, stdio) is the Code Mode composition fallback — its `aside` UTCP manual is registered in `.utcp_config.json`, and the Code Mode discovery scenario needs a session with the code_mode MCP loaded.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `cli_lifecycle/`
- `agent_task/`
- `repl_evidence/`
- `mcp_transport/`
- `probes_and_gaps/`
- `recovery_and_failure/`
- `intra_routing_recall/`

---

## 1. OVERVIEW

This playbook provides 15 deterministic scenarios across 6 categories (plus the routing-recall contracts) validating the `mcp-aside-devtools` skill surface. Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals, and feature-file reference.

### Realistic Test Model

1. A realistic operator request is given to an orchestrator (e.g., "open example.com in Aside and prove what it renders").
2. The orchestrator decides the lane: agent-task CLI (outcome), `aside repl` (deterministic proof), or the Aside MCP `repl` tool via Code Mode (composition — discovery-confirm the callable first).
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned artifact (screenshot file, fixture, discovered inventory) is independently verified.

### Epistemic Ground Rules

- The MCP tool inventory is version-pinned evidence (one `repl` tool on `1.26.626.1517`) — scenarios assert *discovery ran*, not that the inventory matches forever.
- Console capture (ASD-012) and network capture (ASD-013) have **no verified contract**: those scenarios are guarded probes whose PASS includes a clean "unsupported — fail closed" outcome.
- Never run the installer or `aside --update` inside a scenario; ASD-014 simulates absence with PATH manipulation only.

---

## 2. GLOBAL PRECONDITIONS

- Working directory is project root.
- Host is macOS (Darwin) arm64/x64 — the only supported Aside platform.
- `aside` CLI is installed and resolvable: `command -v aside` returns a path (except ASD-014, which simulates absence).
- An Aside account is signed in for browser-touching scenarios (`aside account status` succeeds), or the sign-out state is the scenario's subject.
- ASD-011 (Code Mode discovery) requires a session with the code_mode MCP loaded; the `aside` manual is registered in `.utcp_config.json`. SKIP is valid only with the documented blocker "no Code Mode session available".
- Destructive scenario ASD-015 (dead MCP process) MUST run only against a probe-spawned `aside mcp` process, never against a process another workflow owns.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Full command transcript for CLI scenarios (including exit codes, stderr via `2>&1`).
- JSON-RPC request/response transcript for MCP scenarios.
- Captured artifacts: screenshot file paths with PNG-magic confirmation, help/version fixtures, tools/list fixtures.
- The user request that triggered the orchestration flow and the orchestrator prompt (verbatim).
- Final user-facing outcome and PASS / FAIL / SKIP verdict (SKIP requires a specific, documented blocker).
- For ASD-015, evidence of process cleanup (no leaked `aside mcp` processes via `pgrep -fl "aside mcp"` or equivalent).
- Redaction: no cookies, credentials, private DOM, or request headers/bodies in saved evidence.

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands are shown as `aside <subcommand/args>` (e.g., `aside repl "openTab('https://example.com')"`).
- MCP requests are shown as JSON-RPC method names (`initialize`, `tools/list`, `tools/call(repl)`).
- Code Mode calls are shown as `aside.aside_repl({ ... })` (the TS call surface, confirmed by live discovery 2026-07-16; the registry/discovery name is `aside.aside.repl` — see `references/discovery_fixture_2026-07-16.json`).
- Bash steps are shown as `bash: <command>`.
- `->` separates sequential steps.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

- A scenario is PASS only when preconditions, prompt, commands, expected signals, and evidence all line up.
- A feature is PASS only when every mapped scenario is PASS (or SKIP with a valid blocker).
- Release is READY only when all critical scenarios pass, coverage is complete, and no blocking triage item remains.
- Critical-path scenarios: ASD-001 (install + version), ASD-006 (REPL open tab), ASD-008 (MCP handshake). A FAIL on any of these blocks release.
- Keep feature-specific caveats in linked feature files instead of duplicating them in the root.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- **Wave 1 (read-only CLI)**: ASD-001 install/version, ASD-002 help fixture, ASD-003 account status.
- **Wave 2 (browser lanes)**: ASD-004 direct task, ASD-005 session continuation, ASD-006 REPL open tab, ASD-007 screenshot artifact (single writer — run sequentially on one profile).
- **Wave 3 (MCP transport)**: ASD-008 handshake, ASD-009 tools/list discovery, ASD-010 unbound-profile error, ASD-011 Code Mode discovery (needs a code_mode session; SKIP-valid without one).
- **Wave 4 (guarded probes)**: ASD-012 console probe, ASD-013 network probe — fail-closed outcomes are valid PASSes.
- **Wave 5 (failure injection)**: ASD-014 missing binary, ASD-015 dead MCP process. Run last; verify no leaked processes after.
- After each wave, save evidence and rotate orchestrator context before the next wave.

---

## 7. CLI LIFECYCLE

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### ASD-001 | Install + version check

#### Description
Verify `aside` is installed and `aside --version` returns a non-empty version string.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, confirm aside is installed and reports its version through the aside CLI against the local install. Verify command -v aside returns a path and aside --version returns a non-empty string. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `command -v aside` returns a non-empty path; Step 2: `aside --version 2>&1` returns a version string.

#### Test Execution
> **Feature File:** [ASD-001](cli_lifecycle/install_version.md)

### ASD-002 | Help fixture capture

#### Description
Verify `aside --help` (plus subcommand `--help`) is captured as a version-pinned fixture listing exactly the `account`, `exec`, `repl`, `mcp` subcommands.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, capture the installed aside command surface as a fixture through the aside CLI against the local install. Verify the help output lists the account, exec, repl, and mcp subcommands and record the top-level options verbatim. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `aside --help 2>&1` is non-empty and saved to a fixture file; Step 2: output names `account`, `exec`, `repl`, `mcp`; Step 3: fixture records the option spellings actually present (model-flag spelling is version-dependent).

#### Test Execution
> **Feature File:** [ASD-002](cli_lifecycle/help_fixture.md)

### ASD-003 | Account status

#### Description
Verify `aside account list` and `aside account status` report account state read-only.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, inspect the signed-in account state through the aside CLI against the local account store. Verify account list and status return without mutating anything. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `aside account list 2>&1` exits 0 with at least one account (or a clear signed-out message); Step 2: `aside account status 2>&1` reports the active account's state.

#### Test Execution
> **Feature File:** [ASD-003](cli_lifecycle/account_status.md)

---

## 8. AGENT TASK

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### ASD-004 | Direct natural-language task

#### Description
Verify `aside "<task>"` runs a browser-agent task end-to-end and the user-visible outcome matches the goal.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, run a simple read-only agent task (summarize example.com) through the aside CLI against the signed-in profile. Verify the run returns and the outcome answers the goal; report any pause on approval as a human-gate observation, not a failure. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `aside "Open https://example.com and summarize the page" 2>&1` returns; Step 2: output contains a plausible summary of the page; Step 3: any approval/MFA pause is documented as a human boundary.

#### Test Execution
> **Feature File:** [ASD-004](agent_task/direct_task.md)

### ASD-005 | Session continuation

#### Description
Verify `aside --session <id> "<task>"` continues a prior task's account-scoped state.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, continue a prior agent task by its session id through the aside CLI against the same account. Verify the continuation references prior-task context rather than starting cold. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: a prior task's session id is captured from its run output/UI; Step 2: `aside --session <id> "<follow-up>" 2>&1` returns; Step 3: the response demonstrably uses prior context. Where the session id is not surfaced by the installed version, record that as the finding (storage backend is an open question) and SKIP with that blocker.

#### Test Execution
> **Feature File:** [ASD-005](agent_task/session_continuation.md)

---

## 9. REPL EVIDENCE

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### ASD-006 | REPL open tab

#### Description
Verify `aside repl "await openTab('https://example.com')"` round-trips against a bound browser context.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, open a tab deterministically through the aside REPL against the signed-in browser. Verify the call returns without error; if it reports an unbound browser profile, classify that distinctly and document it. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `aside repl "await openTab('https://example.com')" 2>&1` exits 0; Step 2: no "not bound to a browser profile" error (if present, the verdict is FAIL-with-binding-cause, cross-reference ASD-010's explanation of the same state on MCP).

#### Test Execution
> **Feature File:** [ASD-006](repl_evidence/repl_open_tab.md)

### ASD-007 | Screenshot artifact verification

#### Description
Verify a REPL screenshot writes a real PNG (existence, size > 0, magic bytes `89 50 4e 47`) independent of the tool response.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, capture a screenshot of the opened page through the aside REPL against an open tab from ASD-006. Verify the file exists, is non-empty, and starts with PNG magic bytes. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bash: examples/repl-evidence-capture.sh https://example.com /tmp/aside-evidence` (or the equivalent inline REPL calls) exits 0; Step 2: file exists with size > 0; Step 3: `xxd` head shows `89 50 4e 47`.

#### Test Execution
> **Feature File:** [ASD-007](repl_evidence/repl_screenshot_artifact.md)

---

## 10. MCP TRANSPORT

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### ASD-008 | MCP stdio handshake

#### Description
Verify `aside mcp` responds to JSON-RPC `initialize` over stdio with a protocol version and serverInfo.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, spawn aside mcp and complete the initialize handshake over stdio against the local daemon-backed server. Verify a protocolVersion and serverInfo are returned and the process closes cleanly on stdin EOF or kill. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bash: examples/mcp-handshake-probe.sh` exits 0; Step 2: response contains `protocolVersion` and `serverInfo.name` = `aside`; Step 3: no leaked process after the probe.

#### Test Execution
> **Feature File:** [ASD-008](mcp_transport/mcp_handshake.md)

### ASD-009 | tools/list runtime discovery

#### Description
Verify `tools/list` returns the runtime inventory and the fixture is saved; flag drift from the documented single `repl` tool.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, discover the MCP tool inventory at runtime through the stdio probe against the installed version. Verify a tools array is returned and saved as a fixture; compare against the version-pinned single-repl inventory and report drift as a finding, not a failure. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `tools/list` returns a non-empty `tools` array; Step 2: fixture file saved; Step 3: presence/absence of the `repl` tool (with `title`+`code` required inputs) explicitly reported.

#### Test Execution
> **Feature File:** [ASD-009](mcp_transport/tools_list_discovery.md)

### ASD-010 | Unbound-profile error classification

#### Description
Verify a fresh `aside mcp` process reports the browser-unbound state on `listBrowserTabs()` and the orchestrator classifies it as binding, not auth.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, call listBrowserTabs() via tools/call(repl) on a fresh aside mcp process against no bound profile. Verify the "not bound to a browser profile" message is returned and classified as PROFILE_UNBOUND — explicitly not a missing-credential failure. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `tools/call(repl)` with `listBrowserTabs()` returns the binding error text; Step 2: the report names the state PROFILE_UNBOUND and cites the undocumented binding procedure as an open question. If the installed version returns tabs instead (behavior change), record the new behavior as the finding.

#### Test Execution
> **Feature File:** [ASD-010](mcp_transport/unbound_profile_error.md)

### ASD-011 | Code Mode discovery

#### Description
Verify post-registration Code Mode discovery exposes the Aside callable. First satisfied 2026-07-16 (fixture: `references/discovery_fixture_2026-07-16.json`): registry name `aside.aside.repl`, TS callable `aside.aside_repl(args)`.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, discover Aside callables through Code Mode against the registered `aside` manual. Verify search_tools/tool_info surface the repl callable. Return a concise user-facing pass/fail verdict with the main reason. SKIP only with the documented blocker "no Code Mode session available".

Expected signals: Step 1: `.utcp_config.json` contains the `aside` manual (registered; empty jq output is a FAIL — registration regressed); Step 2: Code Mode `search_tools()` finds Aside tools; Step 3: `tool_info()` confirms the exact callable name (baseline from the 2026-07-16 fixture: registry `aside.aside.repl`, TS callable `aside.aside_repl(args)` — record the actual and diff against the fixture).

#### Test Execution
> **Feature File:** [ASD-011](mcp_transport/code_mode_discovery.md)

---

## 11. PROBES AND GAPS

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract. Both are guarded probes into capability gaps with no verified contract — a clean "unsupported, fail closed" outcome is a PASS.

### ASD-012 | Console capture probe (guarded)

#### Description
Probe whether Playwright `page.on('console', ...)` works on a bound page inside `repl`; report supported/unsupported honestly.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, attempt a sentinel console round trip on a bound page through the aside REPL against an open tab. Verify either the sentinel is captured (supported — record the result-shape fixture) or the probe fails cleanly (unsupported — fail closed, no parity claim). Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: guarded listener registration + `console.log('ASD-012 sentinel')` evaluation; Step 2: either the sentinel appears in captured output (record shape) or the failure is captured verbatim; Step 3: the verdict never claims parity with dedicated console tooling.

#### Test Execution
> **Feature File:** [ASD-012](probes_and_gaps/console_probe.md)

### ASD-013 | Network capture probe (guarded)

#### Description
Probe whether `page.on('request'/'response', ...)` yields structured network events on a bound page; no HAR parity is promised.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, attempt guarded request/response listeners on a bound page through the aside REPL against a page reload. Verify either parseable structured events are captured (record shape, redact headers/bodies) or the probe fails cleanly. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: guarded listener registration + navigation; Step 2: either parseable event records with a known marker or the failure captured verbatim; Step 3: no HAR-export parity claim in the verdict.

#### Test Execution
> **Feature File:** [ASD-013](probes_and_gaps/network_probe.md)

---

## 12. RECOVERY AND FAILURE

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### ASD-014 | Missing binary

#### Description
Verify the workflow reports a clear CLI_MISSING state with the official install pointer when `aside` is absent — without installing anything.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, simulate a missing aside binary with a restricted PATH through the doctor script against the local machine. Verify the diagnosis names the missing binary and reports the official installer as operator-invoked guidance only. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bash: PATH=/usr/bin:/bin bash scripts/doctor.sh` reports "aside not on PATH"; Step 2: output includes the official curl install command as guidance; Step 3: nothing was installed or modified.

#### Test Execution
> **Feature File:** [ASD-014](recovery_and_failure/missing_binary.md)

### ASD-015 | Dead MCP process **(DESTRUCTIVE)**

#### Description
Verify recovery from a killed `aside mcp` child: detect the dead stdio process, distinguish it from daemon unavailability, respawn cleanly.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, spawn a probe-owned aside mcp process, kill it mid-session, observe the failure, and respawn through the stdio probe against a throwaway process. Verify the failure is classified as a dead child (stderr distinguishes daemon outage) and a fresh spawn completes the handshake. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 2: post-kill requests fail with EOF/broken-pipe symptoms; Step 3: stderr evidence distinguishes dead-child vs DAEMON_UNAVAILABLE; Step 4: a fresh probe handshake succeeds; Step 5: no leaked `aside mcp` processes remain.

#### Test Execution
> **Feature File:** [ASD-015](recovery_and_failure/dead_mcp_process.md)

---

## 13. INTRA ROUTING RECALL

Routing-recall contracts validate that the SKILL.md Smart Router's intent model routes realistic prompts to the right references. Routing-stage files may use router vocabulary; holdout files are blind to obvious tool-name keywords; the negative file must route nowhere.

- AD-R01: [Task routing](intra_routing_recall/task.md)
- AD-R02: [REPL routing](intra_routing_recall/repl.md)
- AD-R03: [MCP routing](intra_routing_recall/mcp.md)
- AD-R04: [Install routing](intra_routing_recall/install.md)
- AD-R05: [Troubleshoot routing](intra_routing_recall/troubleshoot.md)
- AD-H01: [Blind holdout: scripted evidence](intra_routing_recall/holdout_repl.md)
- AD-H02: [Blind holdout: stalled automation](intra_routing_recall/holdout_troubleshoot.md)
- AD-N01: [Negative: out of domain](intra_routing_recall/negative.md)

---

## 14. FEATURE CATALOG CROSS-REFERENCE INDEX

### CLI LIFECYCLE

- ASD-001: [Install + version](cli_lifecycle/install_version.md)
- ASD-002: [Help fixture capture](cli_lifecycle/help_fixture.md)
- ASD-003: [Account status](cli_lifecycle/account_status.md)

### AGENT TASK

- ASD-004: [Direct natural-language task](agent_task/direct_task.md)
- ASD-005: [Session continuation](agent_task/session_continuation.md)

### REPL EVIDENCE

- ASD-006: [REPL open tab](repl_evidence/repl_open_tab.md)
- ASD-007: [Screenshot artifact verification](repl_evidence/repl_screenshot_artifact.md)

### MCP TRANSPORT

- ASD-008: [MCP stdio handshake](mcp_transport/mcp_handshake.md)
- ASD-009: [tools/list runtime discovery](mcp_transport/tools_list_discovery.md)
- ASD-010: [Unbound-profile error classification](mcp_transport/unbound_profile_error.md)
- ASD-011: [Code Mode discovery](mcp_transport/code_mode_discovery.md)

### PROBES AND GAPS

- ASD-012: [Console capture probe (guarded)](probes_and_gaps/console_probe.md)
- ASD-013: [Network capture probe (guarded)](probes_and_gaps/network_probe.md)

### RECOVERY AND FAILURE

- ASD-014: [Missing binary](recovery_and_failure/missing_binary.md)
- ASD-015: [Dead MCP process **(DESTRUCTIVE)**](recovery_and_failure/dead_mcp_process.md)
