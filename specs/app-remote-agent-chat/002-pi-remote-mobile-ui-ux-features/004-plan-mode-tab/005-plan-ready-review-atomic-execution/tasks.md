# Tasks — Phase 4 — Plan-ready card, review sheet, and atomic execution

- [ ] Add `apps/pi-remote-web/src/PlanReadyCard.tsx` to render only the newest valid structured artifact and expose `Review plan`; disable or remove Execute for superseded, cached, stale, or unconfirmed artifacts.
- [ ] Add `apps/pi-remote-web/src/PlanReviewSheet.tsx` as a full-height React Aria modal with redacted complete content, initial focus on `Keep planning`, inert background, focus restoration, safe Escape/backdrop/browser-Back cancellation, and explicit `Execute reviewed plan`.
- [ ] Extend `apps/pi-remote-web/src/LeavePlanSheet.tsx` for the Plan-ready `Leave without running` path and ensure the retained artifact is non-executable after confirmed exit.
- [ ] Extend `apps/pi-remote-web/src/runtime.ts`, `src/state.ts`, and `src/App.tsx` with plan artifact lifecycle, plan feedback invalidation, review-sheet state, execute-pending state, and `Executing plan`/post-run transitions; keep the token in memory only.
- [ ] Extend `apps/pi-remote-web/src/relay.ts` with `executePlan`, obtaining a fresh one-use ticket immediately before dispatch and validating the structured response; never call `submitPrompt` or `setMode(build)` as fallback.
- [ ] Complete `apps/pi-remote-relay/src/runtime/runtime-service.ts` and `src/http/server.ts` validation for `execute_plan`: ticket, foreground principal, session, runtime revision, plan ID/revision/token, current Plan mode, valid artifact, idle turn, and exact `postRunMode` atomically before handoff.
- [ ] Complete `extensions/pi-remote-plan/src/index.ts` and the plan-artifact adapter execution hooks so `executing-plan` is published only after handoff and Plan restrictions are restored after every terminal outcome.
- [ ] Add `PlanReadyCard.test.tsx`, `PlanReviewSheet.test.tsx`, `LeavePlanSheet.test.tsx`, relay integration coverage, extension handoff coverage, and end-to-end negative controls for stale/replayed/mismatched plan bindings.

