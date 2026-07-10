---
title: "Feature Specification: Headroom Utilization Phase Parent"
description: "Phase parent for researching whether and how the vendored Headroom context-compression layer can be utilized alongside our spec-kit / skill-advisor / code-graph / deep-loop stack."
trigger_phrases:
  - "029 headroom utilization"
  - "headroom context compression"
  - "utilize headroom"
  - "headroom integration research"
  - "headroom proxy mcp wrap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-headroom-utilization"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Opened implementation phases 002-006, one per research-recommended quick win"
    next_safe_action: "Start 002 (cache audit) and 003 (exclusion guard) — zero/low dependency"
    blockers: []
    key_files:
      - "spec.md"
      - "001-research/spec.md"
      - "external/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-headroom-utilization-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Headroom Utilization Phase Parent

## How to read this packet

Use this root `spec.md` as the current phase map. The vendored upstream project lives under `external/` (the full [Headroom](https://github.com/chopratejas/headroom) repo: a local-first context-compression layer for LLM agents). Detailed research and any adoption planning live in the phase children listed below.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-28 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
We have vendored the Headroom project under `external/`. Headroom is a local-first context-compression layer for LLM agents that ships in four forms — a Python/TypeScript library (`compress()`), an OpenAI/Anthropic-compatible HTTP proxy (`headroom proxy`), an MCP server (`headroom_compress` / `headroom_retrieve` / `headroom_stats`), and a one-command agent wrap (`headroom wrap claude|codex|opencode|...`) — plus cross-agent memory, a `headroom learn` failure-miner, output-token reduction, a CacheAligner for KV-cache stability, and the bundled RTK shell-output compressor. It is unproven whether, where, and how any of these surfaces can be utilized alongside our own stack (the spec-kit Memory MCP, the skill advisor, the code graph, the deep-loop workflows, the `cli-*` executors, and the Claude/Codex/OpenCode runtimes) without breaking determinism, cache assumptions, structured-metadata fidelity, or constitutional gates.

### Purpose
Provide the root purpose, child map, and cross-packet boundary for packet 029. This parent routes to the research child that produces an evidence-based answer to "how could we utilize Headroom, and does it work with our systems?" — and, if adoption is warranted, to any downstream planning/implementation children.

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. Detailed work lives in the phase children below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for packet 029 phase children.
- Holding the vendored `external/` Headroom corpus as the research subject.
- A phase-documentation map pointing to the research child (and any later planning children).

### Out of Scope
- Installing, wiring, or running Headroom against the live stack (research-only at this stage).
- Editing the vendored `external/` upstream sources.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Create | parent | Root purpose and child map |
| `description.json` | Create | parent | Search metadata for the parent |
| `graph-metadata.json` | Create | parent | Child identity and parent graph metadata |
| `001-research/spec.md` | Create | 001 | Headroom-utilization research charter |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research/` | 20-iteration deep-research pass (GPT-5.5 xhigh, cli-codex; 8 survey + 12 perfect-fit validation) over `external/` + our stack: integration-fit matrix across spec-kit memory / skill-advisor / code-graph / deep-loop / cli-* / runtimes, risk register, and a proven perfect-fit integration spec | Complete |
| 002 | `002-cache-stability-audit/` | Rec #1 — audit hook/prompt prefixes for cache-busting volatile tokens (UUID/ISO-8601/JWT/hex-hash) and relocate them after the stable prefix. Zero Headroom dependency | Planned |
| 003 | `003-compression-exclusion-guard/` | Rec #2 — build the reusable `DENY_PATH`/`DENY_KEYS` + citation/hash guard utility that any compression must pass through | Planned |
| 004 | `004-cachealigner-detector/` | Rec #3+#4 — isolated telemetry-off Headroom install + run CacheAligner detector-only over captured prompts | Planned |
| 005 | `005-rtk-shell-output-trial/` | Rec #5 — trial the bundled RTK shell-output shortener on noisy commands; measure savings + fidelity; adopt/skip | Planned |
| 006 | `006-compress-pilot/` | Rec #6 — scoped offline `compress()` pilot behind the 003 guard on one copied artifact; measured savings + citation survival (depends on 003, 004) | Planned |

### Phase Transition Rules

- Child 001 is research-only: it reports findings and a recommendation; it does not install or wire Headroom.
- Children 002–006 are the implementation phases for the 001 recommendations (one per quick-win rec), all currently Planned. Suggested order: 002 + 003 (zero/low dependency) → 004 (install + detector) → 005 (RTK) → 006 (compress pilot, depends on 003 + 004).
- The vendored `external/` tree is read-only research material; it is never edited in place.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| root | 001-research | Research charter authored | `001-research/spec.md` lists key questions, non-goals, stop conditions |
| 001-research | decision | Loop converged or hit 20 iterations | `001-research/research/research.md` exists with cited findings + recommendation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for parent wiring. The substantive questions live in `001-research/spec.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research child**: `001-research/`
- **Vendored subject**: `external/` (Headroom upstream)
- **Graph metadata**: `graph-metadata.json`
