---
title: "Implementation Outcome: Migrate manual.* into Typed Edges (Gated)"
description: "Planned record of the O5 routing-changing migration of graph-metadata.manual.* into edges.* across 10 fleet roots, gated behind the 006 routing-accuracy CI gate; not yet executed."
trigger_phrases:
  - "manual to edges migration outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/008-manual-to-edges-migration"
    last_updated_at: "2026-07-29T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "006 routing-accuracy CI gate not yet landed"
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-manual-to-edges-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Migrate manual.* into Typed Edges (Gated)

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Delivered** | Not started — gated on the 006 routing-accuracy CI gate |
| **Track** | sk-doc |
| **Roots in scope** | 10 (`cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-spec-kit`) |
| **Blast radius** | HIGH — routing-changing; `edges.*` feeds the scorer's `graph_causal` lane |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase will migrate the dead, orphaned `graph-metadata.manual.{depends_on,related_to}` field — confirmed unread by `parseSkillMetadata` (`system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:757-829`) — into the typed `edges.{depends_on,siblings}` schema that actually drives the advisor graph, across all 10 fleet roots that still carry `manual`. It will close the one confirmed live drift (`cli-external-orchestration`'s `manual.depends_on: ["system-spec-kit"]` vs. an empty `edges.depends_on`), delete `manual` fleet-wide once migrated, and add an unknown-key lint (mirroring the existing `edges.*` unknown-edge-type rejection at `skill-graph-db.ts:809-813`) so the field cannot silently return. Nothing is built yet — this document records the plan and its gate, not completed work.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three phases per `tasks.md`: Setup confirms the 006 routing-accuracy CI gate has landed and captures a pre-migration baseline (per-root `manual`/`edges` content, `skill_edges` row counts, and a routing-accuracy corpus run); Implementation migrates each root's `manual.*` entries into the matching `edges.*` type within the documented `WEIGHT_BANDS`, reconciles the `cli-external-orchestration` drift, removes `manual`, adds the lint, and rebuilds `skill-graph.sqlite`; Verification re-runs the routing-accuracy corpus and diffs it against the baseline, runs the fleet gate and a `skill-graph` scan, confirms the lint's regression fixture fails and the 4 legitimate-extra-key roots still pass, and confirms `lib/cross-skill-edges/` is untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Gate the migration behind the sibling 006 routing-accuracy CI phase rather than shipping it standalone — the touched surface (`edges.*` → `skill_edges` → `graph_causal` lane) has zero pre-existing tests, so a before/after routing-accuracy diff is the only available regression signal for a HIGH BLAST change. Map `manual.depends_on` → `edges.depends_on` and `manual.related_to` → `edges.siblings` (not a new edge type) to stay inside the existing, already-scored taxonomy rather than inventing a new one. Explicitly exclude the unrelated `EdgeSourceKind = 'manual'` provenance tag in `lib/cross-skill-edges/` from this phase's scope, since it is a different concept sharing only a field name. Keep the data migration and the lint addition independently revertible so a lint false-positive does not force reverting the already-verified edge migration.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet run — Status is Planned. Verification will follow `checklist.md`: 006 gate landed and runnable (CHK-001), pre-migration baseline captured (CHK-002), all 10 roots migrated with weights inside band and no dropped targets (CHK-005/006), the `cli-external-orchestration` drift closed (CHK-007), `manual` removed fleet-wide (CHK-008), no duplicate edges (CHK-009), the unknown-key lint both catches a reintroduced `manual` and passes the 4 legitimate-extra-key roots (CHK-010/011), a post-migration routing-accuracy diff shows no unapproved regression (CHK-012), and `ci-skill-root-metadata.cjs` plus a fleet-wide `skill-graph` scan report 0 errors (CHK-013/014). `validate.sh --strict` on this folder is expected to pass once execution completes.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

This phase cannot start Phase 1 execution until the 006 routing-accuracy CI gate exists — that dependency is a hard blocker, not a soft one, given the confirmed absence of any other test coverage on the edge/graph surface. Out of scope: the routing-neutral half of research finding O5 (`description.json` unread extras, `derived.causal_summary`) is a separate cleanup and is not touched here; the `derived` block's canonical-owner/regenerator work (O1) is a separate prerequisite phase and is not re-litigated. As with all research-derived findings, the underlying claims (the drift, the parser's ignoring of `manual`, the 10-root count) were independently re-confirmed by direct code and JSON inspection during spec authoring, not taken on the research report's word alone.
<!-- /ANCHOR:limitations -->
