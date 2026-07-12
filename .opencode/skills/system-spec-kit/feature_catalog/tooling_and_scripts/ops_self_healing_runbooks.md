---
title: "Ops Self-Healing Runbooks"
description: "Deterministic shell runbooks for listing, inspecting, and drilling four operational failure classes with bounded retries, structured escalation payloads, and shared logging utilities, while two advertised remediation paths are currently deprecated."
trigger_phrases:
  - ops self-healing runbooks
  - runbook.sh
  - operational failure remediation
  - index-drift ledger-mismatch healing
  - escalation payload
version: 3.6.0.8
---

# Ops Self-Healing Runbooks

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Ops Self-Healing Runbooks provide a small shell-based operational control surface for rehearsing and executing deterministic remediation flows. The package exposes a single `runbook.sh` entrypoint that can list supported failure classes, show ownership and escalation details, or drill one remediation workflow or all workflows together.

The supporting remediation scripts share a common retry-and-escalation engine. Each healing script models a failure class as a sequence of bounded steps, emits structured logs for each attempt, and returns either a recovery payload or an escalation payload when retries are exhausted.

## 2. HOW IT WORKS

### Entry Point & Routing

The public interface currently advertises four failure classes: `index-drift`, `session-ambiguity`, `ledger-mismatch`, and `telemetry-drift`. `runbook.sh list` returns those names, `runbook.sh show <class>` prints the trigger, owner, escalation path, and drill command for each one, and `runbook.sh drill <class|all>` dispatches to the corresponding healing script.

### Async & Safety

The shared implementation in `ops-common.sh` supplies the real mechanics behind every drill. It validates unsigned-integer retry options, prints UTC timestamped log lines, escapes JSON safely, emits `RECOVERY_COMPLETE` payloads on success, and emits `ESCALATION` payloads with failure class, step, attempts, owner, reason, next action, command, and timestamp when bounded retries are exhausted. `ops_run_step()` is deterministic: it simulates retryable failures for a configured number of attempts and only succeeds after the requested failure budget has been exceeded.

### Core Behavior

`heal-index-drift.sh` is the most complete shipped remediation. It validates inputs, supports `success` and `escalate` scenarios, and runs three bounded steps:

1. `detect-divergence`
2. `rebuild-index`
3. `verify-parity`

Those steps currently wrap `node dist/memory/reindex-embeddings.js` commands for health-check, rebuild, and verification flows, then emit a success payload stating that index parity was restored and verified.

`heal-ledger-mismatch.sh` follows the same deterministic pattern for mutation-ledger recovery. It runs `detect-ledger-divergence` and `replay-ledger` steps around `node dist/memory/cleanup-orphaned-vectors.js` commands and emits a recovery payload when ledger replay consistency is restored.

### Edge Cases & Caveats

The other two advertised classes are only partially live today. `heal-session-ambiguity.sh` now exits immediately with a deprecation notice saying session ambiguity moved into the spec-doc record-save pipeline via `generate-context.js`. Its older deterministic implementation is still retained below the early exit for reference, but it is not reachable in normal execution. `heal-telemetry-drift.sh` still parses options and applies the shared retry contract, but the current main flow exits with an error saying the telemetry drift runner was removed and a supported schema-doc parity workflow must be wired back in before use.

That means the current runbook surface is intentionally uneven: the dispatcher and metadata still describe four failure classes, but only index drift and ledger mismatch provide end-to-end recovery paths. Session ambiguity is documented as deprecated, and telemetry drift is effectively a placeholder that fails fast after validation.

### Post-Action Behavior

When `runbook.sh drill all` is used, the dispatcher executes all four classes in sequence and returns non-zero if any one drill fails. In practice, that means aggregate drills currently surface the degraded state of the deprecated or placeholder remediators rather than pretending the whole self-healing surface is healthy.

For canonical post-implementation verification of MCP daemon changes, see the four reference docs under packet `008-mcp-daemon-rebuild-protocol/references/`: `mcp-rebuild-restart-protocol.md` (rebuild + restart sequence), `live-probe-template.md` (live-probe envelope), `dist-marker-grep-cheatsheet.md` (dist-marker grep patterns), and `implementation-verification-checklist.md` (post-rebuild verification checklist).

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/scripts/ops/runbook.sh` | Entrypoint | Lists failure classes, shows ownership and escalation metadata, and dispatches individual or aggregate remediation drills |
| `.opencode/skills/system-spec-kit/scripts/ops/heal-index-drift.sh` | Remediator | Deterministic index-drift recovery flow with detect, rebuild, and verify steps |
| `.opencode/skills/system-spec-kit/scripts/ops/heal-session-ambiguity.sh` | Remediator | Deprecated session-ambiguity runner that now exits immediately with a migration notice to the spec-doc record-save pipeline |
| `.opencode/skills/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh` | Remediator | Deterministic ledger-mismatch recovery flow with detect and replay steps |
| `.opencode/skills/system-spec-kit/scripts/ops/heal-telemetry-drift.sh` | Remediator | Telemetry-drift stub that validates arguments, then fails fast until a supported schema-doc parity workflow is restored |
| `.opencode/skills/system-spec-kit/scripts/ops/ops-common.sh` | Shared library | Provides validation helpers, UTC logging, deterministic retry loops, escalation JSON emission, and recovery payload generation |

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `tooling_and_scripts/ops_self_healing_runbooks.md`
Related references:
- [completion-verification-workflow.md](completion_verification_workflow.md) — Completion Verification Workflow
- [eval-runner-cli.md](eval_runner_cli.md) — Eval Runner CLI
