---
title: "Implementation Plan: Align system-skill-advisor skill id"
description: "Plan for re-keying the advisor graph id, regenerating caches, and preserving bounded parity drift."
trigger_phrases:
  - "013/009/010 plan"
  - "skill id rename plan"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/010-skill-id-field-rename"
    last_updated_at: "2026-05-14T18:20:00Z"
    last_updated_by: "codex"
    recent_action: "Plan executed"
    next_safe_action: "Commit scoped changes and update parent handover"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: Align system-skill-advisor skill id

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python, TypeScript, JSON, SQLite |
| **Framework** | Vitest, advisor MCP scripts |
| **Storage** | Tracked advisor `skill-graph.sqlite` cache plus JSON fallback |
| **Testing** | Targeted Vitest, full advisor Vitest, spec validation |

### Overview

Re-key graph metadata from `skill_advisor` to `system-skill-advisor` at the source and all generated cache surfaces. Keep public server and tool identities stable, then baseline parity tests around the one accepted TS-vs-Python drift row.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 answered for `013/009` and optional `010` packet.
- [x] Required handover, sibling summaries, compiler, health, graph, and parity files read.
- [x] Baseline failures reproduced.

### Definition of Done

- [ ] Graph-health targeted Vitest passes.
- [ ] Parity targeted Vitest passes.
- [x] Full advisor Vitest passes.
- [x] Strict validation passes for `013/009`, `013`, and `010`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Metadata-driven graph compilation with generated JSON and SQLite projections.

### Key Components

- **Source graph metadata**: skill ids and relationships under `.opencode/skills/*/graph-metadata.json`.
- **Compiler**: validates source metadata and writes `skill-graph.json`.
- **Python health shim**: loads SQLite graph state and checks discovery parity.
- **TS scorer projection**: reads SQLite graph state for live scoring tests.

### Data Flow

Skill metadata is discovered from `.opencode/skills`, compiled to JSON for static inspection, and loaded from SQLite for runtime health and scoring. All three layers must agree on the canonical id.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-skill-advisor/graph-metadata.json` | Source skill id | Rename to `system-skill-advisor` | Compiler validate |
| `skill_graph_compiler.py` | Discovery and injected advisor metadata | Point at extracted folder/id | Compiler validate and JSON export |
| `skill_advisor.py` | Health parity wrapper | Update graph-only id set | `--health` |
| Adjacent graph metadata | Inbound relationship targets | Retarget `sk-code` and `mcp-coco-index`; repair system graph symmetry | Compiler validate |
| JSON and SQLite graph caches | Runtime/generated graph state | Regenerate from source metadata | Health and Vitest |
| Parity tests | Regression guard | Pin current numeric baseline and accepted row id | Targeted Vitest |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm branch and live baseline.
- [x] Read required packet context and failing tests.
- [x] Scaffold Level 2 packet.

### Phase 2: Core Implementation

- [x] Rename graph skill id and compiler/Python references.
- [x] Retarget adjacent graph metadata.
- [x] Regenerate JSON and SQLite graph caches.
- [x] Pin accepted parity drift.

### Phase 3: Verification

- [x] Run graph-health targeted Vitest.
- [x] Run parity targeted Vitest.
- [x] Run full advisor Vitest.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/integration | Graph health and parity tests | `npx vitest run ...` |
| Package | Full advisor package | `npm test` |
| Metadata | Spec packet contract | `validate.sh --strict` |
| Runtime smoke | Python health | `python3 skill_advisor.py --health` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing advisor package tests | Internal | Green targeted | Full suite must pass before completion. |
| Tracked SQLite graph cache | Internal | Rebuilt | Stale cache would keep health degraded. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Graph health degrades, public tool ids change, or full advisor Vitest regresses.
- **Procedure**: Revert the rename commit, regenerate graph caches from the prior metadata, and rerun graph-health plus full advisor Vitest.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Gate 3 and required reads | Core |
| Core | Setup | Verify |
| Verify | Core | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Completed in-session |
| Core Implementation | Medium | Completed in-session |
| Verification | Medium | In progress |
| **Total** | | **Single dispatch** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Data Reversal

- **Has data migrations?** Yes, tracked SQLite cache is regenerated.
- **Reversal procedure**: Git revert restores the previous cache; no external data store is involved.
<!-- /ANCHOR:enhanced-rollback -->
