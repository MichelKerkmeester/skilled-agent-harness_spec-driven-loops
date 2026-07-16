---
title: "Implementation Summary: Phase 1: research"
description: "Completed /deep:research fan-out over the Aside browser developer surface: 10/10 iterations across three lineages, canonical synthesis and consolidated resource map compiled, one hard cross-lineage conflict preserved for operator decision."
trigger_phrases:
  - "aside research summary"
  - "mcp-aside phase 001 summary"
  - "aside fan-out results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/001-research"
    last_updated_at: "2026-07-16T15:05:07Z"
    last_updated_by: "claude"
    recent_action: "Compiled canonical research.md + resource-map.md from 3 completed lineages"
    next_safe_action: "Author mcp-aside-devtools packet in phase 002 from research/research.md"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/research/research.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/research/resource-map.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/research/deep-research-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Dual aside UTCP manuals for parallelism (glm) vs single manual (sol elimination) — settle with a two-client isolation test before registering a second manual"
    answered_questions:
      - "Does Aside ship a standalone CLI? Yes — agentic `aside` CLI + deterministic REPL + `aside mcp` stdio server; backendKind cli-plus-mcp stands"
      - "Aside MCP tool inventory? Live-probed: exactly one `repl` tool (protocol 2024-11-05, listChanged:true — rediscover at runtime)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Phase 1: research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Completed** | 2026-07-16 |
| **Level** | 1 |
| **Phase** | 1 of 4 |
| **Successor** | ../002-skill-authoring/ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

A completed deep-research fan-out over the Aside browser developer surface — 10/10 iterations, forced depth (`--stop-policy=max-iterations`):

- `research/research.md` — canonical 17-section synthesis with Cross-Lineage Reconciliation Ledger, Eliminated Alternatives (22 rows), Divergence Map, 13 open questions, Convergence Report appendix.
- `research/resource-map.md` — consolidated from sol + luna lineage maps (glm emitted none).
- `research/deep-research-findings-registry.json` + `research/fanout-attribution.md` — merged via fanout-merge.cjs across 3 lineages; 10 deduplicated key findings, convergence score 0.727 (telemetry only).
- `research/lineages/{sol,glm,luna}/` — full per-lineage loop state (config, state JSONL, deltas, iterations, dispatch receipts).

Key findings feeding phase 002: Aside's surface is three-layered (agentic `aside "<prompt>"` CLI, deterministic `aside repl`, `aside mcp` stdio server) — CLI-primary + Code Mode MCP fallback confirmed, `backendKind: cli-plus-mcp` stands; live MCP probe found exactly ONE tool (`repl`, protocol 2024-11-05, credential-free stdio, `listChanged: true` → runtime rediscovery required); auth is account-based with first-class permission tiers (Read-only / Guard / Full-access); install is a curl installer, macOS-only baseline; a drop-in `aside` UTCP manual is drafted (sol/glm byte-identical).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

One fan-out run via the deep-research command workflow (`fanout-run.cjs`, concurrency 3), then registry merge (`fanout-merge.cjs`) and orchestrator-compiled synthesis:

| Lineage | Executor | Iterations | Duration | Result |
|---------|----------|------------|----------|--------|
| sol | cli-codex gpt-5.6-sol xhigh fast | 5/5 | ~24.8 min | fulfilled, 27.9KB synthesis |
| glm | cli-opencode zai-coding-plan/glm-5.2 max | 2/2 | ~17.6 min | fulfilled, 18KB synthesis |
| luna | cli-codex gpt-5.6-luna max fast | 3/3 | ~18.5 min | fulfilled via isolated-CODEX_HOME solo rerun |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Codex lineages ran `sandboxMode: danger-full-access`** — `workspace-write` blocks network (verified empirically: curl silent-fail vs HTTP 200) and web access was load-bearing for this topic; the lineage-prompt write boundary held (no writes observed outside lineage dirs).
- **Luna rerun under scoped `CODEX_HOME` with `project_doc_max_bytes=0`** — the in-pool luna lineage terminal-failed after 6 exit-0 compliance-halts (Gate-3 doc-halt, self-invocation false positive) caused by codex auto-ingesting repo AGENTS.md; disabling project-doc ingestion for lineage workers fixed it. Subsequent runs (009/010) launch with this from the start.
- **Human-review stop before phase 002 pre-waived** — the operator selected auto-continue at plan approval.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- Lineage completion verified from the orchestration ledger and final run summaries (sol/glm fulfilled in-pool; luna rerun `status: fulfilled`, `summary.failed: 0`).
- All 10 iteration files + per-lineage state JSONL present; merge reported `merged_lineages: 3, key_findings: 10`.
- Synthesis agent spot-verified the headline live-probe claim against `lineages/luna/iterations/iteration-001.md` before compiling.
- `tasks.md` 10/10 `[x]`; phase folder re-validated after close-out.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- **Unresolved cross-lineage conflict (operator decision needed):** single vs dual `aside` UTCP manuals for parallel clients — glm recommends dual, sol eliminates it; settle with a two-client isolation test before registering any second manual.
- The Aside MCP tool inventory is version-pinned (one `repl` tool at CLI 1.26.626.1517); the packet must rediscover tools at runtime rather than hardcode.
- Base-dir reducer (`reduce-state.cjs --emit-resource-map`) does not apply to fan-out layout (no base state log); the resource map was consolidated from lineage maps instead.
- 13 open questions remain in `research/research.md` §Open Questions; phase 002 must mark unconfirmed surface facts as UNKNOWN rather than invent them.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: `spec.md` · **Plan**: `plan.md` · **Tasks**: `tasks.md`
- **Canonical research**: `research/research.md`
<!-- /ANCHOR:cross-refs -->
