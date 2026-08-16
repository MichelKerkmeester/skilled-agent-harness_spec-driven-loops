# Checklist — Phase 4 — Plan-ready card, review sheet, and atomic execution

- [ ] Only a live, newest, valid structured artifact enables Review and Execute; cached or superseded artifacts remain history-only.
- [ ] Review opens with safe initial focus and four explicit actions; every dismissal path cancels without changing mode or executing.
- [ ] `execute_plan` is one atomic operation bound to the reviewed plan and current runtime revision; invalid, stale, replayed, expired, non-Plan, non-idle, and non-foreground requests invoke no host tools.
- [ ] Host publishes `Executing plan` only after successful handoff, never labels it read-only, and returns to Plan restrictions after success, cancellation, and failure.
- [ ] Plan feedback disables the old Execute action immediately, and a retained artifact after leaving Plan cannot execute.
- [ ] No ticket, token, raw plan, raw tool arguments, path, principal, hostname, or internal control event appears in transcript, URL, cache, notification, error, or diagnostics.
- [ ] The token remains in live-session memory only and is absent from rendering, copying, logging, persistence, replay, and sync.
- [ ] Required security review approves the atomic validator, execution lease, partial-failure restoration, invalidation policy, and redaction boundary before real Execute exposure.
- [ ] `npm run typecheck` passes.
- [ ] The protocol, relay, and extension test command passes.
- [ ] The focused web test command passes for card, review sheet, leave sheet, and runtime tests.
- [ ] The full fixture covers plan-ready, review, execute-pending, executing-plan, failure, and restored-Plan states with true `390px` CDP screenshots in light and dark mode for card, review, and executing state.
- [ ] The scoped phase diff contains only the intended plan UI, runtime/relay validation, host handoff, security tests, and fixture changes.

