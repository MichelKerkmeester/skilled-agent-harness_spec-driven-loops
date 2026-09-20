---
title: "Implementation Plan: sk-design Dissolution — Compiled-Routing 6-Hub Re-Activation"
description: "Migrate the compiled-routing topology 7->6 after the sk-design hub dissolution, then re-run the shipped freshness ceremony for the 6 surviving hubs and prove the whole gate green with zero routing-behavior movement."
trigger_phrases:
  - "sk-design dissolution routing plan"
  - "compiled routing 6 hub migration plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/023-sk-design-dissolution-routing-reactivation"
    last_updated_at: "2026-08-22T08:56:00Z"
    last_updated_by: "claude-code"
    recent_action: "Ceremony complete; whole gate 794/0"
    next_safe_action: "validate --strict, commit, push v4 + main"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-sk-design-dissolution-routing-reactivation"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: sk-design Dissolution — Compiled-Routing 6-Hub Re-Activation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Follow the shipped freshness-ceremony lane (precedent: `034-compiled-routing-fleet-freshness`) with one addition it never made — a topology reduction. The `sk-design` hub is removed from the engine (7→6), the mcp-tooling cross-hub judgment coupling to sk-design is severed, and the 6 surviving hubs are re-minted and re-promoted. Hard rules inherited from the precedent: shipped `refresh`/`sync` verbs only (no hand-edited manifest), every canary delta adjudicated in writing before gold moves, every gate checked by exit code. Only hub-topology constants change; no engine algorithm is touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `compiled-routing-foundation.vitest.ts` — four `DEFAULT_ON_HUBS` copies + `COMPILED_ROUTING_HUBS`/`HUB_CHILD` agree at 6.
- All 6 canaries `validate-canary.cjs` → REAL-GREEN (byte-identical recompile).
- Zero behavioral route-gold delta (per-scenario HEAD-vs-regen diff).
- `compiled-route-sync --verify` → all 6 resolve, 0 reads under `.opencode/specs`.
- `compiled-route-guard.cjs` → exit 0, 6/6 fresh.
- `compiled-route-manifest.test.cjs` → all pass; `run-node-tests.mjs` → 0 fail.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The engine gates compiled serving on flag + manifest `servingAuthority: compiled` + serve-time identity (`effectivePolicyHash` + `generation`). A dissolved hub cannot satisfy any of these, so it is removed from the fixed topology rather than parked. The topology is duplicated across a runtime resolver, an authored resolver, an advisor flag source and its dist; a cross-system foundation test enforces their lockstep. mcp-tooling's snapshot embeds a cross-hub "judgment registry" that the compiler treats as inert-for-routing provenance only; with its target dissolved and un-compilable, the coupling is removed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **P1 — Topology 7→6:** drop sk-design from runtime+authored `HUB_CHILD`/`DEFAULT_ON_HUBS`, sync/guard `HUBS`, advisor flag, cutover order; empty mcp-tooling `crossHubPairing` + harness judgment inputs; retire sk-design subtrees. Gate: foundation vitest.
- **P2 — Freshness ceremony:** regenerate artifacts, `refresh` ×6, re-baseline 6 canaries (re-pin drifted `AUTHORED_*_DIGESTS`), adjudicate deltas in `ceremony-deltas.md`. Gate: 6/6 canary green.
- **P3 — Promote:** fresh no-prior `compiled-route-sync` build → `--verify` → guard. Gate: guard exit 0.
- **P4 — Test contract + battery:** flip test `7→6`, run manifest test + vitest battery + fleet parity + whole node gate. Gate: 0 fail.
- **P5 — Reconcile + ship:** docs, `validate --strict`, commit by explicit pathspec, push v4 + main.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Objective, exit-code-checked at every step. Baseline captured before any change (`evidence/baseline.txt`). Behavioral safety proven by a per-scenario route-gold diff between HEAD and the regenerated gold (action/selectionKind/targets/intents), not by canary self-consistency alone. Lane C parity is proven through the 6 GREEN per-hub canaries (which consume the fleet parity lib). The authoritative whole gate is `run-node-tests.mjs`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The shipped `refresh` / `compiled-route-sync` / `compiled-route-guard` / per-hub `build-artifacts.cjs` / `validate-canary.cjs` tooling, behaving as the 034 precedent recorded.
- The committed skill tree as the source of truth for which hubs exist (6, by `mode-registry.json` presence).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every leg is reversible. The topology + coupling edits are a single commit, revertible with `git revert`. Retired subtrees restore with `git restore`. The serving root was rebuilt no-prior (git is the rollback: `git restore .opencode/bin/lib/compiled-routing`). Because the fleet served all-legacy throughout, an abort at any point leaves live routing unchanged from baseline.
<!-- /ANCHOR:rollback -->
