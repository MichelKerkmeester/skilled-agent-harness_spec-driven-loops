---
title: "Implementation Outcome: Migrate manual.* into Typed Edges (Gated)"
description: "Shipped: manual.* migrated into symmetric typed edges across all 10 carrying roots (drift closed, dangling targets hub-remapped, three reverse-enhances drops justified), unknown-key lint added to the fleet gate, corpus byte-identical in both regimes."
trigger_phrases:
  - "manual to edges migration outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/008-manual-to-edges-migration"
    last_updated_at: "2026-07-29T19:30:19Z"
    last_updated_by: "claude-code"
    recent_action: "Migrated manual fields to symmetric edges"
    next_safe_action: "Phase 009 signal-quality"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-manual-to-edges-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Lint placement: CI-gate only (ci-skill-root-metadata.cjs + fixtures); the skill-graph-db.ts fail-closed runtime half deferred as an unguarded live-daemon risk."
      - "related_to targets already carried by another edge type: skipped, per the no-new-duplicates rule."
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Migrate manual.* into Typed Edges (Gated)

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | 2026-07-29 |
| **Track** | sk-doc |
| **Execution model** | Orchestrator (recon/gates/corpus/commits) + GPT-5.6 SOL high implementer (build + one bounded symmetry fix) + GPT-5.6 LUNA xhigh adversarial reviewer |
| **Gated by** | 006 routing-accuracy CI gate (landed first, used for the pre/post captures) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The dead `graph-metadata.manual.*` block is gone from all 10 carrying roots, with its authored relationships preserved in the typed `edges.*` schema the scorer actually reads — as **symmetric** edges, per the compiler's (previously undocumented) bilateral-siblings / depends-prerequisite rule. The confirmed live drift closed: `cli-external-orchestration` now carries `edges.depends_on → system-spec-kit` (0.7) with its `prerequisite_for` counterpart. Two authored targets that are not fleet roots were remapped to their owning hubs (`cli-opencode → cli-external-orchestration`, `mcp-chrome-devtools → mcp-tooling`); three one-way siblings whose relationship the graph already carries via a reverse `enhances` edge were dropped with justification rather than symmetrized into new duplicate pairs. A `GRAPH_METADATA_UNKNOWN_KEY` lint in the fleet gate now fails any root whose `graph-metadata.json` carries a top-level key outside the confirmed allowlist (8 schema keys + `deprecated`/`importance_tier`/`enhance_when`), with malformed JSON surfacing as a violation rather than a crash, and regression fixtures proving both the failure and the no-false-positive cases.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator built the full migration table from live inspection (every `manual` target × existing-edge status across all 10 roots) before any dispatch, so the executor ran a deterministic operation list. SOL (high) executed the 12-file migration; the compiler then failed with 7 symmetry errors — a rule the spec never mentioned — caught because the orchestrator re-checks the compiler **by exit code** (an earlier `tail`-based check had masked exactly this class of failure). One bounded fix dispatch added the 3 symmetric counterparts and executed the 3 justified drops, with the compiler's PASSED verdict required in the executor's own return. LUNA (xhigh) adversarially reviewed the full diff: migration completeness, edge validity, lint, and fixtures all CONFIRMED-CLEAN; its two findings adjudicated as a concurrent session's out-of-scope WIP and the four **pre-existing** multi-type pairs the migration did not introduce.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**Symmetry via drops, not duplicates.** Where the reverse direction already existed as `enhances`, symmetrizing a new sibling would have introduced a duplicate `(source,target)` pair — so the one-way sibling was dropped and the relationship left to the existing edge. **CI-only lint.** The `skill-graph-db.ts` runtime half of the unknown-key check is deferred: a fail-closed parse in the live daemon's scan path could brick advisor ingest on a shared runtime — the opposite of a guarded rollout. **sqlite rebuild deferred to 012**, whose charter is the daemon-reindex proof; the fallback scorer regime (filesystem projection) already exercises the migrated edges and was corpus-verified.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `skill_graph_compiler.py --validate-only` → exit 0, VALIDATION PASSED, **zero symmetry warnings** (checked by exit code).
- Fleet gate 11/11 **with the new lint active** (the 4 legitimate-extra roots pass live); derived freshness 11/11; contract test green incl. the two new fixtures.
- Doctors exit 0 (sk-code, sk-doc, system-deep-loop); four-file routing vitest set 31/31.
- **Corpus byte-identical pre/post in BOTH regimes**: warm 0.5692/0.9843/TT108-FT3-FF1 (sqlite pre-migration by design); no-sqlite fallback 0.5333/0.9843/TT101-FT3-FF1 (**this regime reads the migrated edges** — the graph-causal lane change moved nothing on the pinned corpus). CI floors unchanged.
- `manual` key: zero carriers fleet-wide; zero duplicate pairs introduced (grouped scan over the JSON source of truth); no diff under `system-skill-advisor/**`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The live `skill-graph.sqlite` still reflects pre-migration edges until the daemon reindexes — deliberate, owned by phase 012's daemon-reindex proof (the warm-regime corpus will be re-checked there; if reindexing shifts warm-regime numbers, that phase owns the reconciliation). Four pre-existing multi-type `(source,target)` pairs remain, documented and untouched under scope lock. `validate.sh --strict` remains blocked repo-wide by a concurrent session's in-flight pi-hook build; verified by the direct gates above.
<!-- /ANCHOR:limitations -->
