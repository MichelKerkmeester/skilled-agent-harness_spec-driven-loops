---
title: "Decision Record: sk-design Dissolution — Compiled-Routing 6-Hub Re-Activation"
description: "Architecture decisions for migrating the compiled-routing topology 7->6 and severing the mcp-tooling cross-hub judgment coupling after the sk-design hub dissolution."
trigger_phrases:
  - "sk-design dissolution routing decisions"
importance_tier: "normal"
contextType: "decision-record"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/023-sk-design-dissolution-routing-reactivation"
    last_updated_at: "2026-08-22T08:56:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded ADR-001..003 for the dissolution + re-activation"
    next_safe_action: "validate --strict, commit by explicit pathspec, push v4 + main"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-sk-design-dissolution-routing-reactivation"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Decision Record: sk-design Dissolution — Compiled-Routing 6-Hub Re-Activation

---

<!-- ANCHOR:decisions -->
## ADR-001 — Reduce the compiled-routing topology from 7 hubs to 6 (remove sk-design)

**Context.** `sk-design` has zero files in git HEAD; only 6 hubs carry `mode-registry.json`. The compiled-routing engine still encoded a 7-hub topology, so the whole fleet failed to resolve.

**Decision.** Remove `sk-design` from every topology site rather than stub or excuse it. A hub whose skill source no longer exists cannot be compiled or legacy-routed; it is dissolved, not parked.

**Consequences.** This required editing shipped runtime constants (`HUB_CHILD`, `DEFAULT_ON_HUBS`, `HUBS` in sync/guard, advisor flag set) — something the prior fleet-freshness ceremony explicitly avoided. Cross-system lockstep is enforced by `compiled-routing-foundation.vitest.ts`, which is the gate that proves all four `DEFAULT_ON_HUBS` copies and `COMPILED_ROUTING_HUBS`/`HUB_CHILD` agree at 6.

---

## ADR-002 — Sever the mcp-tooling→sk-design judgment coupling; do not repoint or resurrect

**Context.** mcp-tooling's snapshot read `sk-design/{SKILL.md,mode-registry.json}` as a cross-hub "judgment registry" (the ENOENT). Its live `mode-registry.json` `crossHubPairing` actually targets `sk-design-md-generator` for measured design-reference handoff.

**Options weighed.**
1. **Empty the pairing map** — drop the machine `crossHubPairing`, keep the handoff documented in prose.
2. **Give sk-design-md-generator a mode-registry.json** and repoint the harness — honor the pairing literally.
3. **Pause** and hand the coupling back.

**Decision.** Option 1. sk-design-md-generator is a **standalone skill** (operator-confirmed), not a hub or mode, so it correctly has no `mode-registry.json` for the compiler's judgment path to consume — repointing (option 2) would mis-model a standalone skill as a registry-bearing hub. The compiler's own contract already treats the pairing as **inert for routing** ("no live composition rule or destination... kept purely for provenance hashing"), so emptying it changes only the provenance hash.

**Consequences.** `crossHubPairing` set to `{}` and the transport-axis description softened from "mandatory cross-hub pairing" to a documented handoff. Harness judgment inputs dropped. Proven zero behavioral route-gold delta for mcp-tooling. The design-reference handoff remains documented in the transport-axis prose; it simply is not a compiled judgment pairing.

---

## ADR-003 — Re-mint through the shipped verbs; rebuild the serving root fresh rather than over the prior

**Context.** `compiled-route-sync.cjs` build-over-a-prior assumes the prior serving root is a superset of the new closure and that non-fleet activation manifests are inert "external" ones. Removing a hub violates both: it ENOENT'd on the retired sk-design closure files and rejected sk-design's leftover compiled manifest as a conflicting external manifest.

**Decision.** Refresh manifests and regenerate artifacts through the shipped `refresh` verb and per-hub `build-artifacts.cjs` (never hand-edit a manifest), then rebuild the serving root via a **no-prior** `compiled-route-sync` build (delete the stale root first).

**Consequences.** No rollback dir is retained (no-prior build); git is the rollback, and the fleet served all-legacy throughout, so the swap changed no live behavior until the coherent 6-hub closure was installed. The engine's `sync` algorithm was not modified — only invoked from a clean root. A future first-class "retire a hub" path in the sync tool would remove the need for the clean-root workaround.
<!-- /ANCHOR:decisions -->
