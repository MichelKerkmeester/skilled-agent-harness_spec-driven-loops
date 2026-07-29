---
title: "Implementation Outcome: Derived Regenerator + Fleet Migration + Freshness Gate"
description: "Planned record — not yet executed. Describes what the skill-root derived regenerator, the 11-root fleet migration, and the new CI freshness gate will build once phases 001/002 land."
trigger_phrases:
  - "derived regenerator migration outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/003-derived-regenerator-migration"
    last_updated_at: "2026-07-29T09:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on phase 001 (canonical derived-schema decision) and phase 002 (schema implementation) — not yet landed"
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "030-json-optimization-implementation-003-derived-regenerator-migration-20260729"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the TS anti-stuffing fields (provenance_fingerprint/demotion/trust_lane/sanitizer_version) join the canonical merge is owned by 001/002, not this phase."
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Derived Regenerator + Fleet Migration + Freshness Gate

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Delivered** | Not yet — implementation not started |
| **Track** | sk-doc |
| **Depends On** | Phase 001 (canonical `derived` schema/producer decision), Phase 002 (schema implementation) |
| **Blast Radius** | HIGH — writes all 11 live skill-root `graph-metadata.json` files the running skill-advisor reads for real-time routing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A skill-root analog to the spec-folder `backfill-graph-metadata` regenerator (`regenerate-skill-derived.cjs`) that derives `key_files`/`source_docs`/`entities`/`trigger_phrases`/`key_topics` from each skill's own corpus (SKILL.md, README.md, declared source docs), while preserving authored `causal_summary` and the TS-side `lifecycle_status`/`redirect_from`/`redirect_to` capabilities per the phase-001 canonical-schema decision. Once built, it migrates all 11 existing skill roots — `cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit` — to the canonical shape in one reviewed, atomic pass. A new `ci-skill-derived-freshness.cjs` gate, mirroring the existing `ci-leaf-manifest-freshness.cjs` regenerate-and-byte-diff pattern, closes the freshness gap by wiring into `routing-registry-drift.yml` so this surface can never drift silently again.

This is the direct implementation of the highest-leverage, 3/3-lineage-agreed finding from the `029-skill-json-optimization-research` packet (`research/research.md` §3 O1): the `derived` block currently has two incompatible writers — the Python compiler's validator requires `key_topics`/`entities`/`causal_summary`/`key_files`/`source_docs`, while the TS sync writer produces an entirely different shape and replaces the whole `derived` object rather than merging, silently destroying the Python-required fields if it ever runs against a live root.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three phases: (1) Setup — consume the phase 001/002 canonical schema as an input contract, inventory the 11 current roots, snapshot for rollback. (2) Implementation — build the regenerator with corpus-based extraction and typed-entity derivation, dry-run and review diffs across all 11 roots, run the fleet migration, build and wire the CI freshness gate. (3) Verification — confirm 0 validator errors across the fleet, confirm idempotency, confirm the CI gate catches drift (and doesn't false-positive on the clean fleet), execute the post-migration daemon/SQLite reindex, and rehearse the rollback path. No phase 2 write happens until phase 1's dry-run review and the phase 001/002 dependency are both satisfied.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

The regenerator will merge additively into `derived` rather than replace the whole object — this is the specific defect being fixed (`sync.ts:131-135`'s full-object replace is what currently makes the TS writer destructive against the Python-shaped fleet). `causal_summary` stays purely authored and is never machine-generated or overwritten, since it is the one field in the block that encodes human judgment rather than corpus-derivable fact. The migration writes atomically per root and validates before each commit, so a fleet-wide operation can fail partway without ever leaving a corrupt file. The new CI gate is additive-only (one new script, one new workflow step) so it can be reverted independently of the data migration if it ever proves too strict.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet run — this packet is Planned. Verification will follow `checklist.md`: `skill_graph_compiler.py`'s `validate_derived_metadata` must report 0 errors across all 11 migrated roots; a second regenerator run must produce 0 additional writes; `ci-skill-derived-freshness.cjs` must fail against a deliberately staled fixture and pass against the clean fleet; the daemon/SQLite reindex must be executed and confirmed post-migration; the rollback path must be rehearsed on at least one fixture root before the fleet-wide write. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` will be run before any completion claim, per the project's Completion Verification Rule.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

This phase does not decide the canonical `derived` schema/producer authority — that is phase 001's decision, consumed here as an input contract. It does not fix `init_skill.py`'s incomplete scaffold `derived` block (missing `key_files`/`entities`/`causal_summary`) beyond noting it as a follow-up; that belongs to the scaffold-journey work (O2) in a later phase. It does not touch intent-signal quality (O6), `command-metadata.json` ingestion (O7), or the compiler/routing-accuracy CI wiring (O4, already scaffolded as sibling phase `006-ci-compiler-accuracy-gates`). Blast radius is HIGH: all 11 target files are live inputs to the running skill-advisor's routing, so no `--write` runs before the dry-run diff is reviewed and the rollback path is rehearsed.
<!-- /ANCHOR:limitations -->
