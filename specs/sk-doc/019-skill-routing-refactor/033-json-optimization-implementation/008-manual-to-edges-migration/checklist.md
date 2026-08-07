---
title: "Checklist: Migrate manual.* into Typed Edges (Gated)"
description: "QA checklist for the O5 routing-changing migration of graph-metadata.manual.* into edges.*, gated behind the 006 routing-accuracy CI gate."
trigger_phrases:
  - "manual to edges migration checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/008-manual-to-edges-migration"
    last_updated_at: "2026-07-29T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Migrate manual.* into Typed Edges (Gated)

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. All items stay `[ ]` until the migration executes (Planned phase, gated on 006).

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] 006 gate landed + runnable before any edit [evidence: 006 Complete on origin; its runner produced this phase's pre/post captures]
- [x] CHK-002 [P1] Pre-migration baseline captured [evidence: per-root manual×edges migration table + both-regime corpus numbers; sqlite row counts ride 012's reindex]
- [x] CHK-003 [P1] EdgeSourceKind provenance confirmed distinct + untouched [evidence: executor fenced from system-skill-advisor/** entirely; zero diff there]
- [x] CHK-004 [P1] Allowlist recorded [evidence: tasks T-05 — 8 schema keys + deprecated/importance_tier/enhance_when, from direct 11-root key-set inspection]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-005 [P0] depends_on migrated in-band, nothing silently dropped [evidence: cli-external-orchestration→system-spec-kit(0.7) + symmetric prerequisite_for; all other depends_on targets already carried; LUNA angle 2 CONFIRMED-CLEAN]
- [x] CHK-006 [P0] related_to migrated/skipped in-band, every target accounted for [evidence: siblings at 0.4; skips justified by existing edges; two hub-remaps + three reverse-enhances drops recorded in tasks T-07; LUNA angle 2/4 CONFIRMED-CLEAN]
- [x] CHK-007 [P0] Drift reconciled [evidence: cli-external-orchestration edges.depends_on carries system-spec-kit, bilateral]
- [x] CHK-008 [P1] manual gone from all 10 [evidence: fleet grep — zero carriers]
- [x] CHK-009 [P1] Zero duplicate pairs introduced [evidence: grouped scan over graph-metadata edges (sqlite's source of truth) — the 4 multi-type pairs found all pre-date the migration and are documented, untouched; sqlite-side query rides 012]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-010 [P0] Lint fails on reintroduced manual [evidence: synthetic-root fixture → GRAPH_METADATA_UNKNOWN_KEY; contract test green]
- [x] CHK-011 [P0] No false positives on the 4 legitimate-extra roots [evidence: fleet gate 11/11 with the lint active — those 4 roots pass live; importance_tier fixture passes]
- [x] CHK-012 [P0] Corpus: zero regression vs baseline [evidence: BOTH regimes byte-identical (warm 0.5692/0.9843/108-3-1; fallback — which reads the migrated filesystem projection — 0.5333/0.9843/101-3-1); no floor change needed]
- [x] CHK-013 [P1] Fleet gate 0 errors post [evidence: checked=11 passed=11 failed=0]
- [x] CHK-014 [P1] Compiler scan 0 errors; sqlite refresh deferred [evidence: skill_graph_compiler --validate-only exit 0, zero symmetry warnings; the live daemon's skill-graph.sqlite rebuild is 012's daemon-reindex proof — the fallback-regime corpus already verifies the migrated edges' routing effect]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-015 [P1] Every manual target accounted for [evidence: reconciliation table in tasks T-03/T-07 — migrated, already-carried, hub-remapped, or dropped-with-justification; LUNA migration-completeness angle CONFIRMED-CLEAN]
- [x] CHK-016 [P2] Dangling targets resolved by documented decision [evidence: cli-opencode and mcp-chrome-devtools are not fleet roots (compiler rejects unknown targets) — remapped to their owning hubs cli-external-orchestration and mcp-tooling]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-017 [P1] No credentials/unrelated files touched [evidence: diff = 10 root JSONs + gate + contract test + packet docs; concurrent session's WIP excluded from the commit]
- [x] CHK-018 [P1] lib/cross-skill-edges/ untouched [evidence: zero diff under system-skill-advisor/**; LUNA angle 7 CONFIRMED-CLEAN]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-019 [P1] Continuity reflects the completed migration [evidence: spec Status Complete + amendment; tasks/checklist evidence-marked; implementation-summary final]
- [x] CHK-020 [P2] Rollback executable [evidence: data-only JSON edits in one commit — `git revert` restores prior manual/edges exactly; no derived state to unwind (sqlite refresh intentionally not run)]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-021 [P1] Only the named files touched [evidence: git diff scoped to the 10 roots + gate + contract test + packet docs]
- [x] CHK-022 [P2] No stray files [evidence: dispatch artifacts confined to the session scratchpad; DB-mask trap-restores verified]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-flight checks | 4 | 4/4 |
| Roots migrated (manual→edges) | 10 | 10/10 |
| Lint checks | 2 | 2/2 |
| Regression / fleet-gate checks | 3 | 3/3 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
