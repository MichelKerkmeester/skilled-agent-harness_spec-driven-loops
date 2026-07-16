---
title: "Implementation Summary: Phase 1: research"
description: "Completed /deep:research fan-out over the Mobbin MCP surface: 10/10 iterations across three first-attempt lineages, canonical synthesis with 19 merged findings and three preserved conflicts, byte-identical sol/luna UTCP manual drafts."
trigger_phrases:
  - "mobbin research summary"
  - "mcp-mobbin phase 001 summary"
  - "mobbin fan-out results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/001-research"
    last_updated_at: "2026-07-16T15:05:07Z"
    last_updated_by: "claude"
    recent_action: "Compiled canonical research.md + resource-map.md from 3 completed lineages"
    next_safe_action: "Author mcp-mobbin transport packet in phase 002 from research/research.md"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/research.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/resource-map.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/deep-research-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-mobbin-research-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Authenticated tools/list schemas, mcp-remote OAuth round trip, and exact callable name pend a live authorized session"
    answered_questions:
      - "Auth model? OAuth/DCR/PKCE via the remote MCP server — NO API key env var exists (answered in the negative)"
      - "UTCP manual shape? stdio mcp-remote bridge to https://api.mobbin.com/mcp with empty env — sol and luna drafts byte-identical"
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

A completed deep-research fan-out over the Mobbin MCP developer surface — 10/10 iterations, forced depth:

- `research/research.md` — canonical 17-section synthesis: Cross-Lineage Reconciliation Ledger, findings on tool surface / transport+install / OAuth-DCR-PKCE auth / plan gating / workflows / skills-repo structure / UTCP draft / packet inputs / sk-design pairing; Eliminated Alternatives, Divergence Map, 10 open questions, Convergence Report; 5/5 validator anchor pairs.
- `research/resource-map.md` — consolidated from sol + luna maps (glm emitted none; its sources folded in), per-row lineage attribution.
- Merged registry (3/3 lineages, 10 key findings) + `fanout-attribution.md`.

Key findings for phase 002: remote MCP at `https://api.mobbin.com/mcp` reached via stdio `mcp-remote` bridge; OAuth/DCR/PKCE auth with a live 401 probe — no API key env var (negative answer, not open); plan-gated (Free denied); 60 requests/60s; sol/luna UTCP drafts byte-identical (`name: "mobbin"`, empty env); official skills repo installable via `npx skills add mobbin/skills`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

One fan-out via the deep-research command workflow with the scoped-`CODEX_HOME` recipe; merge via `fanout-merge.cjs`; conflict-preserving orchestrator-dispatched synthesis:

| Lineage | Executor | Iterations | Duration | Result |
|---------|----------|------------|----------|--------|
| sol | cli-codex gpt-5.6-sol xhigh fast | 5/5 | ~23.9 min | fulfilled first-attempt, 33KB synthesis |
| glm | cli-opencode zai-coding-plan/glm-5.2 max | 2/2 | ~11.6 min | fulfilled first-attempt, 16.7KB synthesis |
| luna | cli-codex gpt-5.6-luna max fast | 3/3 | ~20.9 min | fulfilled first-attempt, 19.8KB synthesis |

Zero failed attempts across the pool.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **UTCP manual conflict resolved toward the stdio `mcp-remote` draft** (sol+luna, byte-identical, consistent with the repo's existing `refero` remote-MCP pattern); glm's direct streamable-http concept preserved in the Divergence Map (glm never read `.utcp_config.json`).
- **`deep` search parameter left OPEN** (client-input vs server-side readings from the same source) — deferred to live `tool_info()` after registration.
- **Plan-gating knowability resolved by stronger evidence** (first-party docs + live 401 beat glm's UNKNOWN), glm's per-plan-caps caveat retained.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- Pool exit `status: ok`, 3/3 lineages fulfilled with 5/2/3 iteration files; merge `merged_lineages: 3, key_findings: 10`.
- Synthesis agent verified the two conflict sources against lineage iteration files (`glm/iterations/iteration-002.md`, `sol/iterations/iteration-002.md`) before compiling.
- Anchor pairing grep: 10 anchor lines, 5 matched pairs.
- `tasks.md` 10/10 `[x]`; phase re-validated `--strict` at close-out.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- No live authorized session was possible in-loop: authenticated `tools/list` schemas, the mcp-remote OAuth round trip, and the exact Code Mode callable name remain open until an operator authorizes once.
- Free-tier denial semantics and per-plan caps documented from first-party docs, not exercised.
- 10 open questions in `research/research.md`; phase 002 marks unconfirmed facts UNKNOWN.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: `spec.md` · **Plan**: `plan.md` · **Tasks**: `tasks.md`
- **Canonical research**: `research/research.md`
<!-- /ANCHOR:cross-refs -->
