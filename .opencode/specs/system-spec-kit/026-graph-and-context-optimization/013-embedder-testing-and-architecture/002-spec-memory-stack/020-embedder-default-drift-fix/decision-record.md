---
title: "Decision Record: 016/002/020 Architectural Shape for Eliminating Embedder Default Drift"
description: "Why Shape C (registry-derived getCanonicalFallback helper) was chosen over Shapes A/B/D."
trigger_phrases:
  - "020 adr architectural shape"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/020-embedder-default-drift-fix"
    last_updated_at: "2026-05-23T11:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "ADR captured"
    next_safe_action: "n/a"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000020a5"
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Decision Record: 020 Embedder Default Drift Fix

<!-- ANCHOR:adr-list -->
## 1. ADRs

### ADR-001: Architectural shape for eliminating hardcoded defaults

**Status**: Accepted (2026-05-23)

**Context**: ADR-013 and ADR-014 migrated the canonical embedder to `nomic-ai/nomic-embed-text-v1.5` via registry MANIFESTS reordering + `vec_metadata.active_embedder_name` persistence. But 5 inline string defaults survived the migration, contradicting the intended "registry-driven" architecture. Two Explore agents analyzed the code paths and identified 4 candidate fixes:

- **Shape A — Delete defaults, throw on unconfigured**: forces explicit operator config; zero stale-default risk.
- **Shape B — One documented `LAST_RESORT_FALLBACK` constant** with startup-time validation against registry.
- **Shape C — `getCanonicalFallback(provider)` helper** derives from `MANIFESTS[0]`; cloud providers in a frozen table inside the same module.
- **Shape D — External `embedder.defaults.json`** loaded at runtime; maximum config decoupling.

**Decision**: Adopt **Shape C**.

**Rationale**:
- Shape A breaks first-boot UX and tests that don't set env vars — too aggressive for a hot-fix.
- Shape B keeps a hardcode (just one). Doesn't follow MANIFESTS reorders. Partial fix.
- Shape D adds a new file format + runtime read overhead + another drift surface (the JSON itself could go stale). Over-engineered for the current scope.
- Shape C makes the registry the single source of truth. Re-ordering MANIFESTS auto-updates every fallback site. The 23-assertion test guards against regression. Lowest blast radius for the change.

**Consequence**: Future drift becomes structurally impossible — adding a new winner to `MANIFESTS[0]` updates every fallback site; the test suite catches any caller that returns a banned legacy string.

---

### ADR-002: Cloud providers stay outside the MANIFESTS array

**Status**: Accepted (2026-05-23)

**Context**: When designing `getCanonicalFallback`, the question arose: should `voyage` and `openai` be added to `MANIFESTS` so the helper can be uniformly registry-driven?

**Decision**: No — keep cloud providers in a separate `CLOUD_CANONICAL` frozen table inside `registry.ts`.

**Rationale**:
- The spec-memory bake-off (016/004) was **local-first** (per ADR-014's cascade reorder). Cloud providers are out of the local-first cascade and have different operational semantics (API key gates, billing, latency).
- The `MANIFESTS` array's purpose is to drive auto-selection among local-only candidates. Adding cloud entries would muddy the contract — the cascade probe at `auto-select.ts` only ever probes `OLLAMA_PRIORITY` and `HF_LOCAL_MODEL` against the registry.
- Cloud providers have exactly ONE canonical model each (per current ADRs). The benefit of an array is amortized only when there's a ranking + cascade — both N/A for cloud.

**Consequence**: `getCanonicalFallback` branches on provider: `MANIFESTS[0]`-derived for ollama/hf-local; `CLOUD_CANONICAL[provider]` for voyage/openai. The branch is documented and the test suite covers both paths.

---

### ADR-003: Test convention — standalone assertions, not Vitest

**Status**: Accepted (2026-05-23)

**Context**: Where to place the invariant test, and which framework to use?

**Decision**: `shared/embeddings/registry.test.ts` with standalone `assert(cond, label)` helpers; runner is `node --experimental-vm-modules` against compiled output. Match the existing convention from `shared/predicates/boolean-expr.test.ts` and `shared/parsing/quality-extractors.test.ts`.

**Rationale**:
- `shared/` doesn't pull in Vitest — it's the framework-free common module shared between MCP servers. Adding Vitest as a dep just for this test would increase the shared-module surface.
- The existing standalone-assertion pattern is well-supported (two prior tests in `shared/`), debuggable, and CI-friendly (single binary, no test runner config).
- The 23 invariants are simple equality checks; no fixture setup, no mocking, no async. Vitest's value-adds (parallel, snapshot, mocking) are not needed here.

**Consequence**: Test file is purely additive — no new dev dependencies, no new test config. Run via `tsc` then `node`. Exit code surfaces pass/fail to CI.
<!-- /ANCHOR:adr-list -->
