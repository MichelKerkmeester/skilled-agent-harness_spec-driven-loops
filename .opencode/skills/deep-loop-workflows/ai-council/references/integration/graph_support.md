---
title: "AI Council Graph Support"
description: "Derived council graph support boundaries, deep-loop-runtime CLI surface, and recovery rules."
trigger_phrases:
  - "deep-ai-council graph support"
  - "council graph"
  - "council graph runtime cli"
  - "derived council graph"
importance_tier: "normal"
contextType: "implementation"
---

# AI Council Graph Support

Dedicated council graph support is available as a derived `deep-loop-runtime` CLI projection. It does not replace packet-local `ai-council/**` artifacts or append-only state.

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

## 2. RUNTIME CLI SURFACE

Dedicated graph operations run through the shared deep-loop runtime scripts with `--loop-type council`:

- `deep-loop-runtime/scripts/upsert.cjs --loop-type council` writes derived nodes and edges.
- `deep-loop-runtime/scripts/query.cjs --loop-type council` reads unresolved disagreements, evidence chains, decision support, convergence blockers, and hot nodes.
- `deep-loop-runtime/scripts/status.cjs --loop-type council` reports readiness, counts, schema version, and current signals.
- `deep-loop-runtime/scripts/convergence.cjs --loop-type council` computes council-specific convergence decisions.

Do not use research/review graph namespaces for council data. Council has its own runtime-owned SQLite projection under `deep-loop-runtime`.

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
3. Replay derived nodes and edges from packet-local artifacts with `scripts/replay-graph-from-artifacts.cjs`, which reads `ai-council-state.jsonl` and calls the runtime `upsert.cjs --loop-type council` path across the SESSION / ROUND / SEAT / CLAIM / EVIDENCE / DISAGREEMENT / DECISION / RECOMMENDATION node kinds. Use `--dry-run` to inspect the derived payload without writing.
4. Re-run `status.cjs --loop-type council` and `convergence.cjs --loop-type council`.

The council status script reports the bounded cleanup contract in its `recovery` payload so callers do not need to infer whether artifacts or derived rows are authoritative.

Never rewrite historical `ai-council-state.jsonl` rows to fit the graph.

---

## 6. CROSS-REFERENCES

- State format: `references/structure/state_format.md`
- Folder layout: `references/structure/folder_layout.md`
- Convergence signals: `references/convergence/convergence_signals.md`
- Runtime implementation: `.opencode/skills/deep-loop-runtime/lib/council/`
- Graph replay script: `scripts/replay-graph-from-artifacts.cjs` (derives the council payload from `ai-council-state.jsonl` and writes it through `deep-loop-runtime/scripts/upsert.cjs --loop-type council`; run it after deleting stale derived rows during recovery)
- Deep-mode state hierarchy: `references/convergence/deep_mode.md`
