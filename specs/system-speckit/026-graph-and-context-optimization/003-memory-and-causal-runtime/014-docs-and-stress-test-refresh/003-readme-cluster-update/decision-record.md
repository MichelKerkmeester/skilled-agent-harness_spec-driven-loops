---
title: "Decision Record: README cluster update [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/decision-record]"
description: "Decisions for the README cluster refresh: keep the scope docs-only, preserve the verified 36-tool mk-spec-memory count, and document the front-proxy error codes with precise -32001 LIVE semantics."
trigger_phrases:
  - "readme cluster update decisions"
  - "003 readme cluster update ADR"
  - "readme tool-count preservation decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored ADRs for the docs-only cluster refresh"
    next_safe_action: "None binding; sibling 004 stress-test durability domain"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/README.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Decision Record: README Cluster Update

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Documentation-only scope (no runtime/behavior change)

<!-- ANCHOR:adr-001-context -->
### Context
The README cluster lags the deployed runtime in four concrete places (the `SPECKIT_BACKEND_ONLY` gate, the v28->v30 schema narrative, the MCP front-proxy recycle/error-code surface, and the sk-git worktree convention). The shipped behavior already exists in source; only the docs are stale.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
Refresh the three artifact files (`README.md`, `mcp_server/README.md`, `ENV_REFERENCE.md`) with additive, surgical prose keyed to verified source anchors. No source, schema, or behavior is changed. Each load-bearing claim carries a file:line citation so the docs resist future drift.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
- **Rewrite the cluster for consistency** — rejected: violates surgical-edit discipline and risks introducing inaccuracies into already-correct sections.
- **Defer to the feature catalog (sibling 002)** — rejected: the README cluster is the operator entrypoint and must summarize/link the catalog, per the parent Phase Handoff Criteria.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
- (+) Operators can discover the backend-only gate, the schema progression, and the recycle/error-code contract from docs alone.
- (+) Fully revertable; no runtime risk.
- (−) Prose must be re-verified against source if the runtime changes again — mitigated by inline file:line citations.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Lens Check
- **Clarity:** additive subsections in the existing format read cleanly.
- **Systems:** docs-only; no dependency edges change.
- **Bias:** fixes the four real doc gaps, not hypothetical ones.
- **Sustainability:** citations keep the prose traceable.
- **Scope:** three files only; no sibling/parent writes.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes
Edits land in `README.md` (env row, §3.2 schema subsection, front-proxy subsection, error-code note, sk-git cross-ref, footer), `mcp_server/README.md` (parity rows), and `ENV_REFERENCE.md` (one infrastructure row).
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Preserve the verified 36-tool mk-spec-memory count

### Context
The README states a `36-tool` count for the mk-spec-memory server. A nearby cross-server surface (`layer-definitions.ts`) lists `43`, which can tempt a "correction". The live tool registry is `TOOL_DEFINITIONS` in `tool-schemas.ts`.

### Decision
Verify the live count before any edit and leave `36` unchanged. `TOOL_DEFINITIONS` has exactly 36 entries — the correct number for the mk-spec-memory server. The `43` in `layer-definitions.ts` counts a different (cross-server layer) surface. The fix is adding the new BEHAVIORS to prose, never bumping the number.

### Alternatives Considered
- **Change 36 -> 43 to "match" `layer-definitions.ts`** — rejected: those count different surfaces; the live mk-spec-memory registry is 36.
- **Drop the number entirely** — rejected: the count is a useful operator signal and is accurate.

### Consequences
- (+) The README stays factually correct for the server it documents.
- (+) New behaviors (checkpoint-v2, enrichment marker, front-proxy) are surfaced without a misleading count change.
- (−) Future readers may re-raise the 36-vs-43 question — mitigated by an explicit note that the two count different surfaces.

### Five-Lens Check
- **Clarity:** one count, one surface, clearly scoped.
- **Systems:** no API surface changes; count reflects the live registry.
- **Bias:** resists the wrong-number "correction" trap.
- **Sustainability:** the registry is the single source of truth.
- **Scope:** number untouched; only prose behaviors added.

### Implementation Notes
`TOOL_DEFINITIONS` count confirmed at 36 (`tool-schemas.ts`). README occurrences of `36-tool` left as-is; new behaviors appended to the relevant prose.

---

## ADR-003: Document the front-proxy error codes with precise -32001 LIVE semantics

### Context
The MCP front-proxy (`launcher-session-proxy.cjs`) freezes two typed errors: `RETRYABLE_RECYCLE_ERROR = { code: -32001, data: { retryable: true } }` (L18-22) and `PROTOCOL_MISMATCH_ERROR = { code: -32002, data: { retryable: false } }` (L23-26). Separately, the memory index vector-drain outage path stopped surfacing its own `-32001` class. A naive doc could wrongly state "-32001 was removed".

### Decision
Document `-32001` precisely: it is STILL LIVE as the launcher retryable recycle error; only the index vector-drain *outage* path stopped emitting its own `-32001` class. Document `-32002` as the non-retryable protocol fail-closed (terminal CLOSED). Document `E429` as the legacy index rate-limit class that the coalescing scan contract replaced with a `coalesced:true` success envelope.

### Alternatives Considered
- **Say "-32001 removed"** — rejected: factually wrong; the launcher still emits it for retryable recycles.
- **Omit the error codes** — rejected: operators need the recycle/reconnect contract to interpret transient failures.

### Consequences
- (+) Operators can distinguish a retryable recycle (`-32001`) from a fail-closed protocol mismatch (`-32002`) and the legacy `E429`.
- (+) The precise framing prevents a recurring "was it removed?" misread.
- (−) Requires the reader to hold two `-32001` contexts (launcher recycle vs. former index class) — addressed by stating the distinction explicitly.

### Five-Lens Check
- **Clarity:** each code gets one crisp meaning.
- **Systems:** maps the launcher proxy contract to operator-visible behavior.
- **Bias:** corrects the tempting but wrong "removed" claim.
- **Sustainability:** cites the frozen error objects by line.
- **Scope:** an error-code note + a front-proxy subsection.

### Implementation Notes
Error-code note added to `README.md`; front-proxy recycle contract added to `README.md` and `mcp_server/README.md`. Both cite `launcher-session-proxy.cjs` (L18-26) and `bridgeStdioThroughSessionProxy` in `mk-spec-memory-launcher.cjs`.
