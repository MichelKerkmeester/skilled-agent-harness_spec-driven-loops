<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 4 — Plan-ready card, review sheet, and atomic execution

## Summary

This phase completes the live Plan → review → bounded execution journey. It connects current structured artifacts to a redacted review surface and a separate atomic `execute_plan` handoff, then restores Plan restrictions after every terminal outcome without using the prompt channel as a privilege path.

## Problem & Goal

A Plan state is incomplete if a user cannot distinguish a current structured plan, review its redacted contents, and explicitly hand it off for bounded execution. The goal is to make only a live, newest, valid artifact executable through one atomic operation bound to the reviewed artifact and current host revisions, with safe leave, invalidation, failure, and restoration behavior.

## Scope

### In scope

- Plan artifact hydration and live events in the web client.
- `PlanReadyCard`, full-height `PlanReviewSheet`, and the extended `LeavePlanSheet`.
- Review, revise, keep-planning, leave-without-running, and explicit Execute actions.
- Web plan lifecycle, feedback invalidation, review-sheet state, execute-pending state, `Executing plan`, and post-run transitions.
- Separate `executePlan` relay call with a fresh one-use ticket and strict structured response validation.
- Atomic relay/HTTP validation of ticket, foreground principal, session, runtime revision, plan ID/revision/token, current Plan mode, valid artifact, idle turn, and exact `postRunMode`.
- Host handoff publication and bounded execution-lease restoration after success, cancellation, or failure.
- End-to-end negative controls for stale, replayed, expired, mismatched, non-Plan, non-idle, and non-foreground bindings.

### Out of scope

- New prompt-channel execution or `setMode(build)` fallback; Execute is a distinct control operation.
- Auto-execution, later-prompt approval, YOLO/auto-approve behavior, bypassing filesystem/process approvals, or durable Build after execution.
- A separate plan editor, plan-first sessions, cross-session mode, child-session execution forks, or inference from assistant prose/transcript blocks.
- Final release accessibility, device, PWA cache, and rollback sign-off; those are Phase 5.
- Any change to the fixed ink-on-parchment design system or existing read-only/ticketed security boundary.

## User-facing behavior + states

- `PlanReadyCard` shows only the newest live valid structured artifact: bounded title, redacted summary, revision, timestamp, step count, and `Review plan`. Cached, superseded, stale, or unconfirmed artifacts remain history-only and cannot enable Execute.
- `PlanReviewSheet` is a full-height React Aria modal with complete redacted artifact content, inert background, focus restoration, and initial focus on `Keep planning`, never Execute. It exposes `Keep planning`, `Revise plan`, `Leave without running`, and `Execute reviewed plan`.
- Escape, backdrop press, browser Back, swipe-down, or focus-loss dismissal cancels safely without changing mode or executing. `Revise plan` returns focus to the composer; leaving Plan retains only a non-executable transcript artifact.
- Feedback or another invalidation immediately supersedes the old artifact and disables its Execute action before a replacement is acknowledged. Execute remains pending until the atomic host response succeeds.
- The client shows `Executing plan` only after successful handoff. The host keeps ordinary approvals active, restores Plan restrictions after success/cancellation/failure, and returns to confirmed Plan; restoration failure keeps Plan restrictions active and reports a bounded safety error.
- The plan token is held in memory for the live session only and is never rendered, cached, copied, logged, or placed in a URL.

## Acceptance criteria

- Only a live, newest, valid structured artifact can enable Review and Execute; cached or superseded artifacts are history-only.
- Review opens with safe focus and four explicit actions; every dismissal path cancels without changing mode or executing.
- `execute_plan` is exactly one atomic operation bound to the reviewed plan and current runtime revision. Invalid, stale, replayed, expired, non-Plan, non-idle, or non-foreground requests invoke no host tools.
- Host publishes `Executing plan` only after successful handoff, never calls it read-only, and returns to Plan restrictions after success, cancellation, or failure.
- Plan feedback disables the old Execute action immediately, and a retained artifact after leaving Plan cannot execute.
- No ticket, token, raw plan, raw tool arguments, path, principal, hostname, or internal control event appears in the transcript, URL, cache, notification, error, or diagnostic output.

## Security & Redaction

The Execute button is only a client presentation of a live host-confirmed capability; the relay and host revalidate all bindings atomically. `execute_plan` uses a fresh one-use ticket, foreground principal, session, current runtime/plan revisions, opaque in-memory token, valid Plan artifact, idle turn, and exact `postRunMode: "plan"`; it never calls `submitPrompt` or falls back through Build. The host enables only the bounded lease after validation, retains normal approvals, and restores Plan restrictions on every terminal path. All artifact content, tool results, errors, sync/cache values, transcript projections, and diagnostics use the existing allowlisted redaction boundary; raw tokens and sensitive host fields never cross it.

## Dependencies & affected areas

| Area | Files/components | Phase responsibility |
| --- | --- | --- |
| Web plan UI | `apps/pi-remote-web/src/PlanReadyCard.tsx`, `src/PlanReviewSheet.tsx`, `src/LeavePlanSheet.tsx` | Render newest valid redacted artifact, safe full-height review, four actions, leave-without-running, focus/dismissal behavior, and Execute availability. |
| Web state/client | `apps/pi-remote-web/src/runtime.ts`, `src/state.ts`, `src/App.tsx`, `src/relay.ts` | Track artifact lifecycle/invalidation/review/execute-pending/executing/post-run state and dispatch guarded `executePlan`. |
| Relay validation | `apps/pi-remote-relay/src/runtime/runtime-service.ts`, `apps/pi-remote-relay/src/http/server.ts` | Atomically validate the ticket, principal, session, revisions, artifact binding, Plan mode, idle turn, and exact post-run mode before host handoff. |
| Host execution | `extensions/pi-remote-plan/src/index.ts`, plan-artifact adapter | Publish post-handoff executing state, run the bounded lease, and restore Plan restrictions on all outcomes. |
| Verification | Web component/runtime tests, relay integration tests, extension handoff tests, end-to-end negative controls | Prove stale/replayed/mismatched binding rejection, redaction, safe review dismissal, handoff ordering, and restoration. |

