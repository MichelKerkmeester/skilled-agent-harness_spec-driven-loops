---
title: "Checklist: 035 CocoIndex MCP Reliability"
description: "Verification checklist for the CocoIndex MCP reliability diagnostic packet."
trigger_phrases:
  - "035 checklist"
  - "cocoindex mcp reliability checklist"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/035-cocoindex-mcp-reliability"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Recorded diagnostic evidence and validation result"
    next_safe_action: "Follow-up fix packet"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 035 CocoIndex MCP Reliability

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| [P0] | Hard blocker | Must pass or packet is FAIL/PARTIAL |
| [P1] | Required | Must pass or documented with evidence |
| [P2] | Optional | Can defer with reason |

Evidence format: command exit code, summary line, status count, file path, or file:line reference.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Gate 3 answer supplied for 035 packet path.
  - Evidence: user dispatch pre-bound `GATE_3_ANSWER=E-Phase-035`.
- [x] CHK-002 [P0] Diagnostic-only scope is acknowledged.
  - Evidence: `spec.md > Out of Scope`.
- [x] CHK-003 [P0] Memory MCP tools are not called.
  - Evidence: execution used local shell reads/searches only.
- [x] CHK-004 [P0] SpawnAgent is not used.
  - Evidence: no sub-agent calls; final trace `SPAWN_AGENT_USED=no`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No CocoIndex source code is modified.
  - Evidence: only `.opencode/specs/.../035-cocoindex-mcp-reliability/` is authored for this packet.
- [x] CHK-011 [P0] MCP wrapper path is cited.
  - Evidence: `server.py:74-177` creates FastMCP `search`; `server.py:139-151` performs refresh/search executor calls.
- [x] CHK-012 [P0] Daemon client path is cited.
  - Evidence: `client.py:115-158` sends search and waits for `SearchResponse`; `client.py:184-190` has unbounded `_send()`.
- [x] CHK-013 [P0] Daemon handler path is cited.
  - Evidence: `daemon.py:565-630` receives/decodes/sends responses; `daemon.py:670-729` dispatches requests.
- [x] CHK-014 [P0] msgspec protocol boundary is cited.
  - Evidence: `protocol.py:169-190` defines msgpack encoders/decoders.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] CocoIndex launcher path checked.
  - Evidence: `.opencode/bin` contains no `cocoindex-launcher.cjs`; `cli.py:497-512` exposes `ccc mcp`.
- [x] CHK-021 [P0] Local daemon files checked.
  - Evidence: `~/.cocoindex_code/daemon.pid` contained `59617`; `daemon.sock` existed.
- [x] CHK-022 [P0] Local daemon logs checked.
  - Evidence: `~/.cocoindex_code/daemon.log*` total about 936 MiB; current log has repeated `client disconnected before response could be sent`.
- [x] CHK-023 [P0] Client-disconnect evidence quantified.
  - Evidence: `rg "client disconnected before response could be sent" ... | wc -l` returned `28595`.
- [x] CHK-024 [P1] `/tmp/cocoindex*` artifacts checked.
  - Evidence: watcher log converged at `116495` rows after `1083s`; watcher PID file existed.
- [x] CHK-025 [P1] Baseline process pressure attempt documented.
  - Evidence: `ps -ef | grep -i cocoindex` failed with `operation not permitted`; daemon PID `os.kill(pid, 0)` raised `PermissionError`.
- [x] CHK-026 [P1] Lightweight daemon status attempt documented.
  - Evidence: `ccc status` failed with `Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.spawn-lock'`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class.
  - Evidence: timeout behavior classified as `cross-consumer`; msgspec decode behavior classified as `matrix/evidence` pending payload capture.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed or deferred with reason.
  - Evidence: `-32001` producer not found in CocoIndex source or local Python MCP package; host MCP client remains outside visible scope.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - Evidence: no source helpers, policies, schemas, response fields, or tests changed in this diagnostic packet.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests when applicable.
  - Evidence: not applicable; no security/path/parser/redaction fix implemented.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - Evidence: matrix axes documented as MCP timeout layer, daemon IPC layer, msgspec decode layer, and query latency layer; row count not applicable to docs-only diagnosis.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - Evidence: not applicable; no tests or source changes executed against env/global-state behavior.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range.
  - Evidence: no fix SHA because no source fix; evidence pinned to local file:line refs and command outputs in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No network access is required.
  - Evidence: all investigation used local files and logs.
- [x] CHK-031 [P0] No secrets or credentials are read or modified.
  - Evidence: commands target source files, daemon logs, and packet docs.
- [x] CHK-032 [P0] No daemon stress load is generated.
  - Evidence: repeated MCP query load deferred to follow-up packet.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Level-2 packet docs created.
  - Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`.
- [x] CHK-041 [P0] Failure modes captured precisely.
  - Evidence: `spec.md > Problem Statement`.
- [x] CHK-042 [P0] Candidate root causes listed.
  - Evidence: `implementation-summary.md > Key Decisions` and `Known Limitations`.
- [x] CHK-043 [P0] Diagnostic-only limitation captured.
  - Evidence: `implementation-summary.md > Known Limitations`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Packet lives at requested 035 path.
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/035-cocoindex-mcp-reliability/`.
- [x] CHK-051 [P0] `description.json` has `specId="035"` and requested parent chain.
  - Evidence: created in packet root.
- [x] CHK-052 [P0] `graph-metadata.json` has parent `014-local-embeddings-migration`.
  - Evidence: `parent_id="system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation"`.
- [x] CHK-053 [P0] `manual.depends_on` points at 032.
  - Evidence: `graph-metadata.json`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-060 [P0] Strict validation exits 0.
  - Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/035-cocoindex-mcp-reliability --strict` exit 0.
- [x] CHK-061 [P0] Required final stdout binding trace can be filled completely.
  - Evidence: all required values are known.
- [x] CHK-062 [P1] Packet status is marked PASS, PARTIAL, or FAIL based on evidence.
  - Evidence: `PHASE_035_STATUS=PASS`; diagnostic reproduction itself is `partial`.
<!-- /ANCHOR:summary -->
