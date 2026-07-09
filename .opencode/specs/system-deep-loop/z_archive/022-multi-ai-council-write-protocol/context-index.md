# Context Index: Multi-AI Council Write Protocol

> Migration bridge for the archived Multi-AI Council output, persistence, deferral,
> write-authority, and main-agent write-enforcement phase folders.

<!-- SPECKIT_TEMPLATE_SOURCE: context-index | v1.0 -->

---

<!-- ANCHOR:migration-bridge -->
## Migration Bridge

These folders were grouped because their `description.json` `lastUpdated` timestamps span `2026-06-23T03:49:49.877Z` to `2026-06-23T03:49:50.182Z`, a roughly 300ms window, and their narrative order is output-protocol -> persistence -> deferrals -> write-authority -> main-agent-write-enforcement.

| Original Phase | New Home | Status | Notes |
|----------------|----------|--------|-------|
| `system-deep-loop/z_archive/015-multi-ai-council-output-protocol` | `system-deep-loop/z_archive/022-multi-ai-council-write-protocol/001-multi-ai-council-output-protocol` | DONE; CHK-022/023 deferred | `description.json.lastUpdated` = `2026-06-23T03:49:49.877Z`; first phase in the output-protocol -> persistence -> deferrals -> write-authority -> main-agent-write-enforcement narrative order. |
| `system-deep-loop/z_archive/016-multi-ai-council-persistence` | `system-deep-loop/z_archive/022-multi-ai-council-write-protocol/002-multi-ai-council-persistence` | DONE | `description.json.lastUpdated` = `2026-06-23T03:49:49.975Z`; second phase in the output-protocol -> persistence -> deferrals -> write-authority -> main-agent-write-enforcement narrative order. |
| `system-deep-loop/z_archive/017-multi-ai-council-deferrals` | `system-deep-loop/z_archive/022-multi-ai-council-write-protocol/003-multi-ai-council-deferrals` | Completed 2026-05-06; completion_pct 95 | `description.json.lastUpdated` = `2026-06-23T03:49:49.993Z`; third phase in the output-protocol -> persistence -> deferrals -> write-authority -> main-agent-write-enforcement narrative order. |
| `system-deep-loop/z_archive/018-multi-ai-council-write-authority` | `system-deep-loop/z_archive/022-multi-ai-council-write-protocol/004-multi-ai-council-write-authority` | Blocked | `description.json.lastUpdated` = `2026-06-23T03:49:50.160Z`; fourth phase in the output-protocol -> persistence -> deferrals -> write-authority -> main-agent-write-enforcement narrative order. |
| `system-deep-loop/z_archive/019-multi-ai-council-main-agent-write-enforcement` | `system-deep-loop/z_archive/022-multi-ai-council-write-protocol/005-multi-ai-council-main-agent-write-enforcement` | Code-complete; awaiting live sandbox-smoke verification | `description.json.lastUpdated` = `2026-06-23T03:49:50.182Z`; fifth phase in the output-protocol -> persistence -> deferrals -> write-authority -> main-agent-write-enforcement narrative order. |
<!-- /ANCHOR:migration-bridge -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

- Keep rows scoped to phase-folder movement or identity changes.
- Keep migration and grouping rationale in this file, not in the parent `spec.md`.
<!-- /ANCHOR:author-instructions -->
