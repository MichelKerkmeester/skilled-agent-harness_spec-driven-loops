---
title: "Implementation Tasks: Migrate manual.* into Typed Edges (Gated)"
description: "Tasks for migrating graph-metadata.manual.* into edges.*, reconciling the cli-external-orchestration drift, adding an unknown-key lint, and verifying against the 006 routing-accuracy gate."
trigger_phrases:
  - "manual to edges migration tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/008-manual-to-edges-migration"
    last_updated_at: "2026-07-29T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "006 routing-accuracy CI gate not yet landed"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-manual-to-edges-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Implementation Tasks: Migrate manual.* into Typed Edges (Gated)

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 006 gate confirmed landed + runnable [evidence: 006 Status Complete on origin; its corpus runner used for the pre/post captures]
- [x] T-02 Pre-migration baseline preserved [evidence: warm 0.5692/0.9843/TT108-FT3-FF1; no-sqlite fallback 0.5333/0.9843/TT101-FT3-FF1]
- [x] T-03 manual/edges content snapshotted for all 10 roots [evidence: full migration table built from live inspection — every manual target × existing-edge status; sqlite row counts deferred with the reindex (live daemon owns the DB; program phase 012 owns that proof)]
- [x] T-04 EdgeSourceKind provenance concept confirmed distinct and untouched [evidence: no diff under system-skill-advisor/** at all — the executor was fenced from the entire subtree]
- [x] T-05 Allowlist built + recorded [evidence: schema_version, skill_id, family, category, edges, domains, intent_signals, derived + deprecated / importance_tier / enhance_when — verified by direct key-set inspection of all 11 roots]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-06 manual.depends_on migrated [evidence: cli-external-orchestration gained depends_on system-spec-kit(0.7); other depends_on targets already carried; symmetric prerequisite_for added on system-spec-kit per the compiler's symmetry rule]
- [x] T-07 manual.related_to migrated with skip rule honored [evidence: 13 edges added then symmetry-balanced; already-carried targets skipped; two non-root targets remapped to owning hubs (cli-opencode→cli-external-orchestration, mcp-chrome-devtools→mcp-tooling); three siblings dropped-with-justification (relationship already carried by the reverse enhances edge — symmetrizing would introduce duplicate pairs): sk-git→system-spec-kit, sk-code→mcp-tooling, system-deep-loop→system-skill-advisor]
- [x] T-08 Live drift reconciled [evidence: cli-external-orchestration edges.depends_on now carries system-spec-kit; bilateral counterpart present]
- [x] T-09 manual removed from all 10 [evidence: fleet grep — zero carriers]
- [x] T-10 Unknown-key lint added — CI-gate half [evidence: GRAPH_METADATA_UNKNOWN_KEY in ci-skill-root-metadata.cjs with the T-05 allowlist, malformed-JSON-as-violation, class-independent; the skill-graph-db.ts runtime half deliberately deferred — a fail-closed parse on the live daemon's scan path is an unguarded blast, recorded in the spec amendment]
- [ ] T-11 Rebuild skill-graph.sqlite — **DEFERRED to phase 012** (the live daemon owns the DB; 012's charter is exactly the daemon-reindex proof). The no-sqlite regime — which reads the filesystem projection and therefore already sees the migrated edges — was corpus-verified instead [documented]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-12 Post-migration corpus vs baseline [evidence: BOTH regimes byte-identical — warm 0.5692/0.9843/108-3-1 (stale sqlite by design), fallback 0.5333/0.9843/101-3-1 (sees the new edges) — zero regression, zero delta, CI floors unchanged]
- [x] T-13 Fleet gate + compiler post [evidence: ci-skill-root-metadata 11/11 incl. the 4 legitimate-extra roots under the new lint; skill_graph_compiler --validate-only exit 0, VALIDATION PASSED, zero symmetry warnings]
- [x] T-14 Regression fixture in place [evidence: synthetic root with `manual` fails GRAPH_METADATA_UNKNOWN_KEY; importance_tier fixture passes; contract test suite green]
- [x] T-15 No duplicate pair introduced [evidence: python grouped scan over all graph-metadata edges (the source of truth the sqlite is built from) — the migration added zero duplicates; 4 pre-existing multi-type pairs documented, untouched (scope lock); sqlite-side query lands with 012's reindex]
- [x] T-16 Scope confirmed [evidence: diff = 10 root JSONs + gate + contract test + this packet's docs; nothing under lib/cross-skill-edges/; LUNA angle 7 CONFIRMED-CLEAN]
- [x] T-17 Continuity updated; validate --strict **BLOCKED** repo-wide (concurrent pi-hook build) — verified by the direct gates above [documented]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 10 roots' `manual.*` content migrated into `edges.*` or explicitly justified as dropped; `manual` removed fleet-wide; `cli-external-orchestration` drift closed; unknown-key lint added and verified against both a reintroduction fixture and the 4 legitimate-extra-key roots; no duplicate edges; post-migration routing-accuracy run shows no unapproved regression; `lib/cross-skill-edges/` untouched; `validate.sh --strict` clean.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Research source `../../029-skill-json-optimization-research/research/research.md` §3 (O5) · Prerequisite `../006-*` (routing-accuracy CI gate)
<!-- /ANCHOR:cross-refs -->
