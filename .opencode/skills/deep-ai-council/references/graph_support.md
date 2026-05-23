---
title: "AI Council Graph Support"
description: "Derived council graph support boundaries, MCP tool surface, and recovery rules."
trigger_phrases:
  - "deep-ai-council graph support"
  - "council graph"
  - "council_graph tools"
  - "derived council graph"
importance_tier: "normal"
contextType: "reference"
---

# AI Council Graph Support

Dedicated council graph support is available as a derived MCP projection. It does not replace packet-local `ai-council/**` artifacts or append-only state.

---

## 1. OVERVIEW

The graph is a prompt-safe structural index over council deliberation artifacts. It stores council-specific nodes and edges so synthesis, audit, and convergence checks can answer structural questions without overloading deep-loop research/review graph semantics.

Authoritative state remains:

- `ai-council/ai-council-state.jsonl`
- `ai-council/seats/**`
- `ai-council/deliberations/**`
- `ai-council/critiques/**`
- `ai-council/council-report.md`

If graph rows disagree with artifacts, the artifacts win and graph rows should be rebuilt.

---

## 2. TOOL SURFACE

Dedicated MCP tools use the `council_graph_*` prefix:

- `council_graph_upsert` writes derived nodes and edges.
- `council_graph_query` reads unresolved disagreements, evidence chains, decision support, convergence blockers, and hot nodes.
- `council_graph_status` reports readiness, counts, schema version, and current signals.
- `council_graph_convergence` computes council-specific convergence decisions.

Do not use `deep_loop_graph_*` for council data. Those tools are scoped to research/review coverage graphs.

---

## 3. NODE AND EDGE MODEL

Node kinds:

- `SESSION`
- `ROUND`
- `SEAT`
- `CLAIM`
- `EVIDENCE`
- `DISAGREEMENT`
- `DECISION`
- `RECOMMENDATION`

Relation kinds:

- `PARTICIPATES_IN`
- `PROPOSES`
- `SUPPORTS`
- `CONTRADICTS`
- `DERIVES_FROM`
- `AGREES_WITH`
- `RESOLVES`
- `ESCALATES`
- `EVIDENCE_FOR`
- `RECOMMENDS`

Every graph row should include prompt-safe provenance when available: `artifactPath`, `contentHash`, `roundId`, and bounded `metadata`.

Prompt-safe query output only returns allowlisted scalar metadata fields: `confidence`, `confidenceScore`, `planConfidence`, `severity`, `priority`, and `status`. Free-form metadata remains stored as derived data for reducers, but query responses redact arbitrary keys and truncate long strings.

---

## 4. CONVERGENCE SIGNALS

Council graph convergence evaluates:

- `agreementRatio`
- `dissentDensity`
- `evidenceDepth`
- `unresolvedCriticalDisagreements`
- `decisionConfidence`

An empty graph returns `STOP_BLOCKED`, not false-safe success. Critical unresolved disagreements also block stop approval.

---

## 5. RECOVERY AND ROLLBACK

The graph is replayable derived state.

Safe recovery path:

1. Keep `ai-council/**` artifacts unchanged.
2. Delete or ignore stale `council-graph.sqlite` rows scoped to the affected `specFolder` and `sessionId` only.
3. Replay derived nodes and edges from packet-local artifacts.
4. Re-run `council_graph_status` and `council_graph_convergence`.

`council_graph_status` reports the bounded cleanup contract in its `recovery` payload so callers do not need to infer whether artifacts or derived rows are authoritative.

Never rewrite historical `ai-council-state.jsonl` rows to fit the graph.

---

## 6. CROSS-REFERENCES

- State format: `references/state_format.md`
- Folder layout: `references/folder_layout.md`
- Convergence signals: `references/convergence_signals.md`
- MCP implementation: `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/`
