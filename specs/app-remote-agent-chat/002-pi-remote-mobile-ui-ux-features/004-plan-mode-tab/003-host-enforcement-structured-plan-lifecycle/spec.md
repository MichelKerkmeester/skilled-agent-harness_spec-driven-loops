<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 2 — Host enforcement and structured plan lifecycle

## Summary

This phase makes Plan authority real at the host boundary and publishes a structured lifecycle that the relay can trust. It covers default-deny capability enforcement, redacted artifact generation and invalidation, bounded execution-lease hooks, and removal of Plan control commands from the phone prompt/catalog boundary.

## Problem & Goal

The relay contract alone cannot make Plan safe: the host must deny unclassified mutation-capable tools and publish authoritative Plan, ready, executing, superseded, and restored-Plan states. The goal is a host/relay lifecycle that is structured rather than inferred from assistant prose and that fails closed when enforcement or restoration cannot be verified.

## Scope

### In scope

- The `pi-remote-plan` extension and host capability classification.
- Default-deny handling for built-in, shell, extension, and MCP tools, with the existing read-only bash allowlist preserved narrowly.
- Plan artifact generation, redacted projection, opaque token lifecycle, validity, and invalidation.
- Lifecycle publication for Build, Plan, `plan.ready`, `plan.superseded`, `executing-plan`, and restored Plan.
- Bounded execution-lease hooks and restoration on success, cancellation, and failure.
- Relay event ingestion and malformed/unhealthy status handling.
- Rejection of `/plan` control commands from phone prompt submission and removal from the phone command catalog.

### Out of scope

- Persistent composer controls, keyboard handling, and non-execution UI states; those are Phase 3.
- Plan-ready review and the real Execute control; those are Phase 4 and remain unavailable until this host contract is approved.
- Final accessibility, PWA layout, device testing, and release rollback drills; those are Phase 5.
- Any change to the fixed ink-on-parchment design system or read-only-by-default security posture.

## User-facing behavior + states

N/A — host/extension and relay lifecycle work. The fixture consumer may render Build, Plan, plan-ready, executing-plan, superseded, and extension-error events for verification, but this phase does not author the web interaction surface.

## Acceptance criteria

- Host tool-call tests prove that every unclassified mutation-capable tool is denied in Plan, including extension/MCP tools and shell control-token variants.
- A structured plan event produces a bounded artifact; assistant prose alone never produces `Plan ready`.
- Plan feedback invalidates the old artifact and makes its Execute action unavailable before any new artifact is accepted.
- Execution restoration failure leaves Plan restrictions active and publishes `Plan safety could not be verified` without sensitive details.
- `/plan`, `/plan on`, `/plan off`, and `/plan execute` never reach the host through phone prompt submission and never appear in the phone command catalog.

## Security & Redaction

Plan is enforced by the host, not by hidden UI controls. Built-in writes, mutating shell forms, unknown extension tools, and unknown MCP tools are denied unless explicitly classified read-only; the existing bash allowlist remains narrow. Plan artifacts use bounded redacted projection fields and a host-issued opaque token that is not derived from plan text. Artifact invalidation is authoritative on feedback and other host invalidation events. The bounded execution lease restores Plan restrictions on every terminal path, and restoration or handoff failure keeps restrictions active while emitting only the safe bounded error. `/plan` control syntax is blocked before prompt submission and cannot become transcript or model-visible content.

## Dependencies & affected areas

| Area | Files/components | Phase responsibility |
| --- | --- | --- |
| Host extension | `extensions/pi-remote-plan/src/index.ts`, new `extensions/pi-remote-plan/src/plan-artifact.ts` or equivalent adapter, `extensions/pi-remote-plan/tests/plan-mode.test.ts` | Default-deny tool classification, structured artifact/token lifecycle, lifecycle events, bounded execution lease, and guaranteed Plan restoration. |
| Relay runtime | `apps/pi-remote-relay/src/runtime/plan-status.ts`, `apps/pi-remote-relay/src/runtime/runtime-service.ts` | Consume structured mode/artifact events, increment the correct revision, and return `unknown` for malformed or unhealthy extension state. |
| Prompt boundary | `apps/pi-remote-relay/src/prompt/prompt-service.ts` | Reject a leading `/plan` token after whitespace normalization before any Pi prompt is sent. |
| Command catalog | `apps/pi-remote-relay/src/commands/command-service.ts` | Remove the extension’s Plan control command while retaining safe non-control commands. |
| Verification | `extensions/pi-remote-plan/tests/plan-mode.test.ts`, `apps/pi-remote-relay/tests/prompt.test.ts`, `tests/commands.test.ts`, `tests/authority-loop.test.ts`, plan-control/redaction tests | Prove default-deny, lifecycle invalidation, prompt/catalog isolation, and absence of internal control events from transcript/model-visible paths. |

