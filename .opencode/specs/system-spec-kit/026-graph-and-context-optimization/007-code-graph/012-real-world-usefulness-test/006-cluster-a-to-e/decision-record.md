---
title: "Decision Record: Code Graph + Advisor + Hooks Polish"
description: "ADRs for Phase 006 readiness auto-rescan, diagnostics shape, and CocoIndex seed normalization."
trigger_phrases:
  - "026/007/012/006 ADR"
  - "auto-rescan ADR"
  - "readiness diagnostics ADR"
  - "CocoIndex normalizer ADR"
importance_tier: "critical"
contextType: "decision"
---
# Decision Record: Code Graph + Advisor + Hooks Polish

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:context -->
## 1. CONTEXT

Phase 012/004 and 012/005 fixed the P0 destructive scan-promotion risks. That makes guarded read-path full-scan recovery safe to add only when the active runtime scope matches stored graph scope and parser diagnostics do not indicate an unsafe backlog. The same packet also needs operator-facing diagnostics and interop hardening for live CocoIndex MCP output.
<!-- /ANCHOR:context -->

---

<!-- ANCHOR:decisions -->
## 2. DECISIONS

### ADR-001: Enable F-018 Auto-Rescan Only Behind Scope and Parser Safety Gates

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decision** | Query and context read paths may allow inline full scans only when stored scope fingerprint matches active runtime scope and parse-error backlog is below threshold. |
| **Rationale** | Phase 012/005 added a scope-change promotion guard, so same-scope full scans are no longer the destructive mismatch path. The parser backlog gate avoids auto-promoting when the graph is already showing parser instability. |
| **Consequence** | Unsafe cases still block and ask for explicit `code_graph_scan`, but safe stale/full-scan reads can self-heal. |

### ADR-002: Readiness Diagnostics Field Shape

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decision** | Blocked readiness payloads expose `activeScope`, `storedScope`, `manifestCount`, `manifestDigest`, and `reason` alongside existing readiness/trust fields. |
| **Rationale** | Operators need to distinguish scope mismatch, manifest drift, and stale graph state without inspecting SQLite metadata manually. The schema stays additive and backward-compatible. |
| **Consequence** | Existing consumers can ignore the new fields; debugging and smoke harnesses can assert precise readiness causes. |

### ADR-003: Normalize Both CamelCase and Snake_case CocoIndex Seeds

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Decision** | `code_graph_context` accepts `file`, `filePath`, `file_path`, `range.start`, `lines.start`, `startLine`, `start_line`, and content/snippet variants, normalizing to the internal seed shape. |
| **Rationale** | Live CocoIndex MCP results are snake_case, while existing code graph consumers already use camelCase. A permissive adapter preserves current callers and enables raw MCP handoff. |
| **Consequence** | Strict-mode rejection is avoided; malformed seeds still degrade naturally when no usable path is present. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:alternatives -->
## 3. ALTERNATIVES CONSIDERED

| Option | Outcome | Reason |
|--------|---------|--------|
| Keep read paths fully blocked on `full_scan` | Rejected | It preserves a bad operator experience after the scope guard made a safe subset automatable. |
| Auto-rescan without parser backlog guard | Rejected | Parser error accumulation is a signal that automatic promotion may be unsafe. |
| Require only canonical CocoIndex snake_case | Rejected | Existing callers already send camelCase seed shapes. |
| Require only code graph camelCase | Rejected | It prevents raw live CocoIndex MCP result handoff. |
<!-- /ANCHOR:alternatives -->

---

<!-- ANCHOR:consequences -->
## 4. CONSEQUENCES

- Read paths remain fail-closed when scope or parser safety cannot be proven.
- Blocked payloads become better diagnostics surfaces without changing existing top-level statuses.
- CocoIndex docs and runtime behavior converge on snake_case as the live protocol with consumer normalization.
- Scope fingerprints move to a glob-aware format while legacy v2 data remains readable.
<!-- /ANCHOR:consequences -->
