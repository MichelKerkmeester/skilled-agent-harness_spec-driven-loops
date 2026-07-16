---
title: "Resource Map: 016-last-50-commits-deep-review"
description: "Read-only evidence catalog for the 016 deep review. Paths are grouped by research angle and were analyzed, not changed, during the review."
trigger_phrases:
  - "resource map"
  - "016-last-50-commits-deep-review resource map"
  - "deep review evidence catalog"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/016-last-50-commits-deep-review"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Seeded read-only evidence catalog grouped by angle"
    next_safe_action: "None. Review packet is closed and remediation is tracked in 017"
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v2.2 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 13
- **Scope**: Read-only evidence catalog of the surface reviewed during packet 016-last-50-commits-deep-review, grouped by research angle. Every path was analyzed, not changed.
- **Generated**: 2026-06-05T00:00:00Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> This is the deep-review evidence catalog. All entries are `Analyzed` because the packet was read-only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:scripts -->
## 1. Launcher and IPC

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/bin/*-launcher.cjs` | Analyzed | OK | Launcher lease and respawn concurrency. |
| `.opencode/bin/lib/*.cjs` | Analyzed | OK | Launcher helper modules. |
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | Analyzed | OK | IPC socket bind and permission handling. |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:skills -->
## 2. Memory, Causal, Shutdown and Security

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Analyzed | OK | Memory-write angle. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/*` | Analyzed | OK | Async enrichment path. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts` | Analyzed | OK | Causal and relation inference. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts` | Analyzed | OK | Contradiction-cycle inference. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Analyzed | OK | Shutdown and lifecycle angle. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts` | Analyzed | OK | Shutdown and lifecycle angle. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | Analyzed | OK | Ingest worker lifecycle. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Analyzed | OK | Security and input angle. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:config -->
## 3. Contract, Config and Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts` | Analyzed | OK | MCP-contract angle and tool schemas. |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:notes -->
## 4. Notes

This map is the read-only evidence catalog for the 016 deep review. It groups the reviewed surface by research angle rather than by remediation stream. Tool schemas, the broader test corpus and the config and gemini-removal and docs and changelog-accuracy angles were also reviewed across the 9 angles. The path-level catalog above lists the load-bearing source files cited in `review/review-report.md`. The remediation that changed these files is cataloged in `017-last-50-commits-review-remediation/resource-map.md`.
<!-- /ANCHOR:notes -->
