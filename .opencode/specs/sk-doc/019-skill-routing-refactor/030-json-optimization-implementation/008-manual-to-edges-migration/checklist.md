---
title: "Checklist: Migrate manual.* into Typed Edges (Gated)"
description: "QA checklist for the O5 routing-changing migration of graph-metadata.manual.* into edges.*, gated behind the 006 routing-accuracy CI gate."
trigger_phrases:
  - "manual to edges migration checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/008-manual-to-edges-migration"
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
- [ ] CHK-001 [P0] 006 routing-accuracy CI gate confirmed landed and runnable before any edit [evidence: 006 packet status + routing-accuracy corpus runner invocation]
- [ ] CHK-002 [P1] Pre-migration baseline captured for all 10 roots (`manual`/`edges` content + `skill_edges` row counts by type) [evidence: baseline snapshot / `skill-graph` scan output]
- [ ] CHK-003 [P1] Unrelated `EdgeSourceKind = 'manual'` provenance concept (`lib/cross-skill-edges/types.ts`) read and confirmed distinct from `graph-metadata.manual.*` [evidence: file read notes]
- [ ] CHK-004 [P1] Top-level-key allowlist built and recorded (base schema + 4 confirmed-legitimate extras: `deprecated`, `importance_tier` ×2, `enhance_when`) [evidence: allowlist recorded in tasks.md T-05]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-005 [P0] All 10 roots' `manual.depends_on` migrated into `edges.depends_on`, weight in `[0.7, 1.0]`, no target silently dropped [evidence: per-root diff vs. `WEIGHT_BANDS` at `skill-graph-db.ts:167`]
- [ ] CHK-006 [P0] All 10 roots' `manual.related_to` migrated into `edges.siblings` (or skipped as already-present under another edge type), weight in `[0.4, 0.6]`, no target silently dropped [evidence: per-root diff vs. `skill-graph-db.ts:170`]
- [ ] CHK-007 [P0] `cli-external-orchestration` live drift reconciled: `edges.depends_on` now includes `system-spec-kit` [evidence: `cli-external-orchestration/graph-metadata.json` diff]
- [ ] CHK-008 [P1] Top-level `manual` key removed from all 10 roots [evidence: key listing across all `.opencode/skills/*/graph-metadata.json` shows no `manual` key]
- [ ] CHK-009 [P1] No duplicate `(source_id, target_id)` pair introduced across edge types [evidence: `skill_edges` grouped-count query, all counts = 1]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-010 [P0] Unknown-key lint added and fails on a reintroduced `manual` key [evidence: regression fixture + lint failure output]
- [ ] CHK-011 [P0] Unknown-key lint does not false-positive on the 4 confirmed-legitimate extra-key roots (`sk-code`, `sk-design`, `system-deep-loop`, `system-skill-advisor`) [evidence: lint pass output for those 4 roots]
- [ ] CHK-012 [P0] Post-migration routing-accuracy corpus run (006 gate) shows no unapproved regression vs. the CHK-002 baseline [evidence: routing-accuracy before/after diff report]
- [ ] CHK-013 [P1] `ci-skill-root-metadata.cjs` passes 0 errors fleet-wide after migration [evidence: script output]
- [ ] CHK-014 [P1] Fleet-wide `skill-graph` scan passes 0 errors and `skill-graph.sqlite` reflects the migrated edges [evidence: scan output + `skill_edges` row diff vs. CHK-002 baseline]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-015 [P1] Every one of the 10 roots' `manual.*` content is accounted for — migrated or explicitly justified as dropped, never silently lost [evidence: per-root before/after reconciliation table]
- [ ] CHK-016 [P2] Any `manual.*` target with no matching skill (dangling reference) flagged and resolved with a documented decision rather than silently migrated [evidence: reconciliation notes, if applicable]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-017 [P1] No credentials, secrets, or unrelated fleet files touched [evidence: `git diff --stat` scoped to the 10 root JSON files + lint change + this packet's docs]
- [ ] CHK-018 [P1] No file under `lib/cross-skill-edges/` modified (unrelated `EdgeSourceKind` provenance concept untouched) [evidence: `git diff --stat`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-019 [P1] Packet continuity (`spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) reflects the completed migration and its verification evidence [evidence: `implementation-summary.md` final state]
- [ ] CHK-020 [P2] Rollback plan re-verified as executable (a dry-run or documented equivalence that `git revert` restores the prior `manual.*`/`edges.*` state) [evidence: rollback verification notes]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-021 [P1] Only the 10 `graph-metadata.json` roots, the lint change, and this packet's docs are touched — no adjacent skill files modified [evidence: `git diff --stat`]
- [ ] CHK-022 [P2] No stray scratch/temp files committed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-flight checks | 4 | 0/4 |
| Roots migrated (manual→edges) | 10 | 0/10 |
| Lint checks | 2 | 0/2 |
| Regression / fleet-gate checks | 3 | 0/3 |

**Verification Date**: Pending (Planned — awaiting 006 gate)
<!-- /ANCHOR:summary -->
