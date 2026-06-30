---
title: "Decision Record: Code-Graph Bug Remediation"
description: "ADRs for zero-node scan rejection, parser-error preservation, and parse diagnostics in Phase 026/007/012/004."
trigger_phrases:
  - "026/007/012/004 decisions"
  - "zero-node scan ADR"
  - "parse-error preservation ADR"
  - "parse diagnostics ADR"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/005-fix-zero-node-and-parser-issues"
    last_updated_at: "2026-05-06T06:02:52Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Recorded remediation design decisions"
    next_safe_action: "Keep implementation aligned with ADR safety contracts"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:35670aa2334623f7a8dfbfd68f30064456f013f84330ffd27df0e9174f3dce91"
      session_id: "026-007-012-005-fix-zero-node-and-parser-issues"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Code-Graph Bug Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:context -->
## 1. CONTEXT

Deep research found that the code graph can lose usable state in two places: full-scan pruning treats a zero-node candidate result as authoritative, and per-file parser runtime errors flow through normal graph replacement. The remediation has to preserve last-known-good graph content without hiding parse failures from operators.
<!-- /ANCHOR:context -->

---

<!-- ANCHOR:decisions -->
## 2. DECISIONS

### ADR-001: Reject Zero-Node Full-Scan Promotion Over Populated Graphs

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Finding** | F-002, F-008 |
| **Decision** | A full scan with 0 candidate indexed nodes and prior DB nodes > 0 is blocked before stale-file pruning and before live metadata promotion unless `forceZeroNodeReset: true` is provided. |
| **Rationale** | The prior graph is more trustworthy than an empty candidate scan when the existing graph has nodes. The explicit override keeps legitimate destructive resets possible without making wipe behavior implicit. |
| **Consequences** | Callers get a blocked response and must rerun with corrected scope or an explicit reset flag. Failed-scan metadata can still be recorded separately. |

### ADR-002: Treat Parser Runtime Errors As Diagnostics, Not Replacement Graphs

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Finding** | F-003, F-011 |
| **Decision** | `parseHealth === "error"` records a durable diagnostic and skips `upsertFile`, `replaceNodes`, and `replaceEdges` for that file. Clean and recovered parse results keep the existing atomic persistence path. |
| **Rationale** | Runtime parser failures say the new parse is unusable, not that the file has no symbols. Preserving stale-but-valid rows lets queries keep working while diagnostics tell the operator what failed. |
| **Consequences** | A file may have a stale graph plus a newer diagnostic. Status must expose the affected count so users do not mistake stale-valid rows for fully fresh parser output. |

### ADR-003: Keep Failed-Scan Metadata Separate From Live Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Finding** | F-008, F-010 |
| **Decision** | Live git head, scope, provenance, candidate manifest, and edge baseline promotion happen only when the scan is usable under the scan-health predicate. Failed scans are recorded under separate metadata. Nonfatal per-file parse diagnostics do not suppress candidate-manifest recording. |
| **Rationale** | Live metadata tells read paths what graph state is authoritative. Failed-scan metadata is useful for operators, but it must not make stale or empty candidate state look current. |
| **Consequences** | Status/debugging can inspect failed scan records while read-path freshness continues to compare against the last successful graph. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:alternatives -->
## 3. ALTERNATIVES CONSIDERED

| Option | Outcome | Reason |
|--------|---------|--------|
| Always allow zero-node scans. | Rejected | This preserves the wipe bug and makes scope mistakes destructive. |
| Never allow zero-node scans. | Rejected | Empty repositories and intentional resets need a path. |
| Store parse errors in `code_files.parse_health` only. | Rejected | That overwrites freshness without retaining messages or preserving prior graph rows. |
| Make any parse error fatal to candidate manifests. | Rejected | A single parser failure should not invalidate the whole file-set manifest. |
<!-- /ANCHOR:alternatives -->

---

<!-- ANCHOR:consequences -->
## 4. CONSEQUENCES

- The scan handler owns promotion safety before destructive pruning.
- The DB layer owns integrity safety for diagnostics and orphan edges.
- Status responses become more honest: a graph can be queryable and still report stale-but-valid files from parser errors.
- New diagnostics storage is additive and does not require a destructive migration.
<!-- /ANCHOR:consequences -->
