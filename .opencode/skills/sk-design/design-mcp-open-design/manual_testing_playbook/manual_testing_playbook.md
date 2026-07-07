---
title: "design-mcp-open-design: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review and orchestration guidance, execution expectations, and per-feature validation files for the design-mcp-open-design skill. Covers wiring, read-only content access, gated mutating runs, and the daemon failure path."
version: 1.4.0.7
---

# design-mcp-open-design: Manual Testing Playbook

End-to-end manual testing reference for the design-mcp-open-design skill. Every scenario validates a capability from the feature catalog against its defined behavior. Each scenario keeps its own ID and links to a dedicated per-feature file with the full execution contract. The skill drives the installed Open Design desktop app from the terminal, so most scenarios depend on the desktop app being open and on verifying the live tool set rather than trusting documentation.

---

**EXECUTION POLICY:** Every scenario in this playbook MUST be executed for real, not mocked and not stubbed. Run actual commands, inspect real outputs, and call the real daemon. Valid statuses are PASS, FAIL, or SKIP with a documented blocker. A gated mutating verb is exercised only with an explicit throwaway target and confirmation, and the negative control proves an unconfirmed call is refused.

---

## 1. OVERVIEW

### Coverage

| Category | Features | Scenarios |
|---|---|---|
| Wiring | od mcp install | 1 |
| Reading | read-only content access, grounding and reuse | 1 |
| Gated Runs | headless runs and mutating verbs | 1 |
| Design Gate | grounding and reuse (mandatory precondition) | 1 |
| Failure Paths | daemon model and tool-surface verification | 1 |
| **TOTAL** | **5 features** | **5 scenarios** |

This package ships 5 per-feature scenario files, one per row in the cross-reference index in Section 10. The grounding and reuse feature is validated two ways: the design-system read scenario exercises reading a system as the grounding input, and the design-gate scenario validates the mandatory `sk-design` precondition that must hold before any read or run feeds a design decision.

### Realistic Test Model

1. A realistic user request is given to an orchestrator, for example "connect Open Design to this agent and show me what design systems are available."
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI or runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

A scenario PASSES only when both the execution process (correct commands, correct gating) and the user-visible outcome (config written, content read, or call refused) are verified.

---

## 2. GLOBAL PRECONDITIONS

All scenarios share these preconditions. Verify before starting any wave.

1. Working directory is the project root (`pwd` shows the repo root).
2. The Open Design desktop app (v0.9.0+) is installed at `/Applications/Open Design.app`.
3. For every scenario except the failure path, the desktop app is open so the daemon socket exists.
4. The CLI is located by its bundle path: `OD_BIN="$APP/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"`, never a global `od`. To drive `od run` / `od project` standalone (outside a daemon-spawned agent), export the daemon socket first: `export OD_SIDECAR_IPC_PATH=/tmp/open-design/ipc/release-stable/daemon.sock`. Without it the CLI falls back to the unused TCP port `127.0.0.1:7456` and the call is refused. The `od tools` read wrappers additionally need `OD_TOOL_TOKEN`, which the daemon injects only for agents it spawns, so run those through the wired MCP rather than standalone.
5. For the wiring scenario, the target agent CLI (`opencode` or `claude`) is on PATH and its config is backed up first.
6. Mutating scenario RUN-001 MUST use a throwaway target project and confirm recovery is possible before running.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript with exit codes
- User request used
- Orchestrator or agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- Output snippets, including the dry-run config preview where relevant
- The live `tools/list` output where a scenario relies on it
- Final user-facing response or outcome summary
- Artifact path or output reference
- Scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION

| Type | Notation | Example |
|---|---|---|
| od CLI | `node "$OD_BIN" <verb> [args]` | `node "$OD_BIN" mcp install opencode --print --json` |
| MCP tool | `open-design.<tool>({...})` | `open-design.list_projects({})` |
| Bash | `bash: <command>` | `bash: jq '.tools | length' <<< "$RESULT"` |
| Agent prompt | `agent: <instruction>` | `agent: confirm before any mutating verb` |
| Sequential | `->` separator | `mcp install --print --json -> review -> mcp install` |
| Expected output | `# -> expected` | `node "$OD_BIN" --help  # -> usage text` |

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance

A scenario is PASS when all preconditions were verified, every command in the sequence ran and produced the expected output, all expected signals were observed, the user-visible outcome matches the defined outcome, and no contradictory evidence exists.

A scenario is FAIL when any of the above conditions is not met.

### Critical-Path Scenarios (BLOCK RELEASE if FAIL)

| ID | Scenario | Why Critical |
|---|---|---|
| WIRE-001 | od mcp install plus live tools/list | Nothing else works until the MCP server is wired and verified |
| RUN-001 | Gated verb confirmation and negative control | Safety gate: an unconfirmed mutating verb must be refused |
| GATE-001 | Mandatory sk-design precondition | Safety gate: a design run or design-feeding read without `sk-design` must be blocked, not run |
| FAIL-001 | Daemon not running | The app-closed path must fail gracefully, not silently |

### Feature Verdict

A feature PASSES when all scenarios mapped to it are PASS. A release is READY when no feature verdict is FAIL, all critical-path scenarios are PASS, coverage matches the cross-reference index, and no unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in this root playbook. Put feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Execution Waves

| Wave | Scenarios | Parallelizable | Constraint |
|---|---|---|---|
| Wave 1 (Wire) | WIRE-001 | No | Must complete before all other waves |
| Wave 2 (Read) | READ-001, GATE-001 | Yes (no writes) | Requires Wave 1 PASS and the desktop app open; GATE-001 blocks the design step before any write |
| Wave 3 (Gated run) | RUN-001 | Sequential | Throwaway target only, requires Wave 2 PASS |
| Wave 4 (Failure path) | FAIL-001 | Sequential, last | Requires closing the desktop app, so run after read and run waves |

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Run the gated mutating scenario in a dedicated sandbox-only wave against a throwaway project.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. After each wave, save context and evidence, then begin the next wave.
6. Record the utilization table, per-feature file references, and evidence paths in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field following the Role then Context then Action then Format contract
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

---

## 7. WIRING (`WIRE-001`)

### WIRE-001 | Install And Verify The Live Tools

Verify `node "$OD_BIN" mcp install opencode` writes the `open-design` MCP entry after a reviewed dry-run, and the live `tools/list` reflects the wired tools. **In this repo, do not run the actual (non-`--print`) install against the real global config** -- canonical wiring here is Code Mode (`.utcp_config.json`), see the feature file for the safe grading approach.

Prompt: `"Connect Open Design to this agent and confirm its tools are available."`
Expected: dry-run prints the exact entry and writes nothing, the install deep-merges `opencode.json` under `mcp.open-design`, and the live `tools/list` shows the Open Design tools while the desktop app is open.

> **Feature File:** [01--wiring/install-and-verify.md](01--wiring/install-and-verify.md)
> **Catalog:** [01--wiring/od-mcp-install.md](../feature_catalog/01--wiring/od-mcp-install.md)

---

## 8. READING (`READ-001`)

### READ-001 | Read A Design System

Verify a registered design system's `DESIGN.md` and `tokens.css` can be read read-only, with nothing written.

Prompt: `"Read the DESIGN.md and tokens for one of Open Design's design systems."`
Expected: `node "$OD_BIN" tools design-systems read --path <manifest-path>` returns the 9-section `DESIGN.md` and a `:root` `tokens.css`, no files are written to the repo, and the read is usable as grounding input for `sk-design`.

> **Feature File:** [02--reading/read-design-system.md](02--reading/read-design-system.md)
> **Catalog:** [02--reading/read-only-content.md](../feature_catalog/02--reading/read-only-content.md)

---

## 9. GATED RUNS, DESIGN GATE, AND FAILURE PATHS (`RUN-001`, `GATE-001`, `FAIL-001`)

### RUN-001 | Gated Verb Requires Confirmation (with Negative Control)

Verify a mutating verb runs only after explicit confirmation with a throwaway target, that the multi-turn generation flow builds a design only after the discovery form is answered, and that an unconfirmed mutating call is refused.

Prompt: `"Commission an Open Design run into a throwaway test project."`
Expected: the agent first describes the effect and a rollback note and stops for confirmation, then fires turn 1 (`start_run` / `od run start`) which returns a discovery question-form with zero files, answers the form (`od ui respond` or a follow-up message) to fire the build that writes files and yields a `previewUrl`, and refuses the negative control (a mutating call without confirmation, or a destructive verb without `confirm:true`). Turn 1 alone, or `od artifacts create`, must not be claimed to produce a finished design.

> **Feature File:** [03--gated-runs/gated-verb-confirm.md](03--gated-runs/gated-verb-confirm.md)
> **Catalog:** [04--runs/headless-runs.md](../feature_catalog/04--runs/headless-runs.md)

---

### GATE-001 | Mandatory sk-design Precondition (Negative, Positive, Exemption)

Verify a design generation RUN, and a design-feeding READ, are blocked when `sk-design` is not loaded; that the same design work proceeds once `sk-design` is loaded and its ground -> token-system -> critique has been applied; and that pure transport (`od mcp install` wiring, a bare `list_projects` that feeds no design decision) succeeds without `sk-design`.

Prompt: `"Ground a design in an Open Design system and commission a run for it."`
Expected: with `sk-design` not loaded, the design run is blocked before turn 1 and the design-feeding read is refused as grounding (not merely left unconfirmed); after `sk-design` is loaded and ground -> token-system -> critique is applied, the grounded design work proceeds; and pure transport (`od mcp install --print --json`, a bare `list_projects`) completes with no `sk-design` requirement.

> **Feature File:** [05--design-gate/mandatory-design-gate.md](05--design-gate/mandatory-design-gate.md)
> **Catalog:** [03--grounding/design-system-grounding.md](../feature_catalog/03--grounding/design-system-grounding.md)

---

### FAIL-001 | Daemon Not Running Is Handled Gracefully

Verify that with the desktop app closed, a tool call fails with a clear daemon-unreachable message and a recovery path, not a silent failure.

Prompt: `"List Open Design projects when the app is not running."`
Expected: the socket is gone so the call fails with a meaningful error naming the unreachable daemon, and the agent surfaces the recovery (open the app, or start a standalone `od --no-open` daemon) instead of pretending success.

> **Feature File:** [04--failure-paths/daemon-not-running.md](04--failure-paths/daemon-not-running.md)
> **Catalog:** [05--transport/daemon-and-verification.md](../feature_catalog/05--transport/daemon-and-verification.md)

---

## 10. FEATURE CATALOG CROSS-REFERENCE INDEX

| ID | Scenario | Category | Feature File | Catalog File |
|---|---|---|---|---|
| WIRE-001 | Install and verify the live tools | Wiring | [01--wiring/install-and-verify.md](01--wiring/install-and-verify.md) | `../feature_catalog/01--wiring/od-mcp-install.md` |
| READ-001 | Read a design system | Reading | [02--reading/read-design-system.md](02--reading/read-design-system.md) | `../feature_catalog/02--reading/read-only-content.md` |
| RUN-001 | Gated verb requires confirmation | Gated Runs | [03--gated-runs/gated-verb-confirm.md](03--gated-runs/gated-verb-confirm.md) | `../feature_catalog/04--runs/headless-runs.md` |
| GATE-001 | Mandatory sk-design precondition | Design Gate | [05--design-gate/mandatory-design-gate.md](05--design-gate/mandatory-design-gate.md) | `../feature_catalog/03--grounding/design-system-grounding.md` |
| FAIL-001 | Daemon not running | Failure Paths | [04--failure-paths/daemon-not-running.md](04--failure-paths/daemon-not-running.md) | `../feature_catalog/05--transport/daemon-and-verification.md` |
