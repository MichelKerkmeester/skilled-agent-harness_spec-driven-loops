---
title: "Implementation Outcome: Ingest command-metadata.json into Command Routing"
description: "Planned record of deriving TS and Python COMMAND_BRIDGES from command-metadata.json behind a shadow-mode-first, corpus-gated rollout, with a 3-way drift-guard and denser command-metadata/leaf-aliases e2e tests. Not yet implemented."
trigger_phrases:
  - "command bridges generator outcome"
  - "command metadata ingestion outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/011-command-metadata-ingestion"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on 006 (skill_graph_compiler.py + score-routing-corpus.py wired into routing-registry-drift.yml)"
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "030-json-optimization-implementation/011-command-metadata-ingestion"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Backfill system-spec-kit's missing command-metadata.json as a prerequisite, or ship this phase against the documented allow-list residual?"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Ingest command-metadata.json into Command Routing

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Delivered** | Not yet — Planned, blocked on 006 |
| **Track** | sk-doc |
| **Opportunities addressed** | O7 (command-metadata ingestion) + O10 (denser command-metadata/leaf-aliases e2e tests), per 029 research §3 |
| **Blast radius** | High — live rewire of `projection.ts` (advisor's hottest file) and `skill_advisor.py`'s `COMMAND_BRIDGES` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A single canonical command-bridge projection derived from the fleet's 7 `command-metadata.json` files (22 entries today) plus a documented allow-list for the two commands not yet backed by JSON (`/speckit:*`, `/memory:save` — `system-spec-kit` has no `command-metadata.json`). That projection will generate both the TS `COMMAND_BRIDGES` array in `mcp-server/lib/scorer/projection.ts` (replacing 6 hand-authored, coarse entries) and the Python `COMMAND_BRIDGES` dict in `mcp-server/scripts/skill_advisor.py` (replacing 16 hand-authored, fine-grained entries plus the `COMMAND_BRIDGE_OWNER_NORMALIZATION` map) — closing a count-and-granularity drift between the two that exists today and is confirmed against the live tree. A new drift-guard vitest will assert all three sources (JSON, generated TS, generated Python) agree, failing loud with named ids the moment any of them is edited without regenerating the others. Denser `command-metadata`/`leaf-aliases` e2e tests will replace the current thin coverage (2 vitest files that check bridge-id resolution but not live routing behavior) with one routing assertion per JSON-declared command.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Because `projection.ts` is edited by concurrently-running advisor sessions, the cutover will ship as two separate commits per the program parent's guarded-rollout rule (REQ-006): a shadow-mode landing commit (generator, both GENERATED blocks produced and diffed, drift-guard, e2e tests — live routing untouched), followed only after a zero-diff shadow comparison and a zero-regression `score-routing-corpus.py` run by a live-cutover commit that swaps both `COMMAND_BRIDGES` call sites to the generated blocks. The two new Python CLI flags (`--emit-command-bridges`, `--check-command-bridges`, `--dump-command-bridges`) will mirror the script's existing, already-proven `--emit-routing-projection`/`--check-routing-projection`/`--dump-routing-maps` machinery rather than inventing a new generation mechanism.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Derive from `command-metadata.json` rather than hand-reconciling the TS and Python arrays directly, so future command additions only require one authored JSON entry instead of three hand-edits. Keep `system-spec-kit`'s missing `command-metadata.json` out of this phase's scope and cover the gap with a documented allow-list instead, so the routing-rewire blast radius stays isolated to the advisor's two `COMMAND_BRIDGES` call sites rather than expanding into another hub's H-class metadata authoring. Ship the cutover as two separate commits (shadow-mode landing, then live cutover) specifically because `projection.ts` is the hottest, most concurrently-used file in the advisor — an in-place single-commit swap was rejected as too high-blast for a file this central.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet run — this packet is Planned. When implemented, verification will include: the new drift-guard vitest passing clean and failing loud on an injected-drift fixture; per-entry e2e assertions for all 22 JSON-declared commands plus equivalent `leaf-aliases.json` coverage; `score-routing-corpus.py` showing zero regression against the pinned baseline hash across the cutover; `--check-command-bridges` reporting both generated blocks fresh; and `validate.sh <folder> --strict` reporting Errors:0.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

This phase does not backfill `system-spec-kit`'s missing `command-metadata.json` — the `/speckit:*` and `/memory:save` bridges stay covered by a documented allow-list, not a JSON source, until a separate fast-follow addresses that hub's own H-class metadata gap. This phase also does not touch the existing choreography-consumption use of `command-metadata.json` (command-authoring tooling reading `choreography[]`) — it adds an advisor-routing consumer alongside it, per the sol-high/glm-high disagreement recorded in `spec.md` §6, rather than claiming the prior consumption path was itself broken. Blocked on 006 landing first so this phase's drift-guard and corpus-gate run in CI rather than only locally.
<!-- /ANCHOR:limitations -->
