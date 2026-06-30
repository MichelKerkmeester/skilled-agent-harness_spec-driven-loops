---
title: "Feature Specification: Registry advisorRouting block + CI drift-guard (Model A via C-plus)"
description: "Make mode-registry.json the declarative source of truth for deep-loop-workflows mode routing by adding a per-mode advisorRouting block, and close the hardcode-drift gap with a CI drift-guard test asserting the advisor's hardcoded projection maps (Python DEEP_ROUTING_MODE_BY_KEY, TS DEEP_MODE_BY_CANONICAL) equal the registry projection. C-plus mechanism: the advisor is NOT made to read the registry at runtime (avoids novel cross-skill import coupling); a test enforces parity instead."
trigger_phrases:
  - "advisorRouting drift guard"
  - "registry-driven advisor routing C-plus"
  - "deep-loop-workflows routing parity test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-parent-nested-skill-pattern/002-advisor-routing-drift-guard"
    last_updated_at: "2026-06-15T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added advisorRouting block + dump flag + drift-guard test; 19/19 green"
    next_safe_action: "Validate and commit; then Phase 4 formalization"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-002-advisor-routing-drift-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Runtime registry-read or drift-guard? C-plus drift-guard (no novel cross-skill coupling)"
---
# Feature Specification: Registry advisorRouting block + CI drift-guard (Model A via C-plus)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Phase** | 002 (parent: `117-parent-nested-skill-pattern`) |
| **Depends on** | `../research/research.md` (phase-2 recommendation) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mode-registry.json` claimed to be the single source of truth for how each deep-loop-workflows mode routes, but the advisor never read it — the mode projection was hardcoded in two places with three different cardinalities (Python `DEEP_ROUTING_MODE_BY_KEY` = 3, TS `DEEP_MODE_BY_CANONICAL` = 4, registry = 8 modes). The copies can silently drift, and the registry's `aliases[]` are natural-language phrases that do **not** contain the system-ID aliases the advisor actually keys on, so a naive "make the advisor read the registry" would regress routing.

### Purpose
Make the registry the authoritative declarative description of routing (a per-mode `advisorRouting` block), and close the drift gap with a **CI drift-guard test** rather than runtime coupling. The phase-2 research (15 iterations, adversarial pass) chose this **C-plus** mechanism over runtime-derive: the advisor's only existing import-time `json.load` is advisor-local, so reaching into a skill's registry on the hot path would be novel cross-skill coupling for no gain over a test. This phase is additive — it changes no routing behavior; the existing parity fixtures stay green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A per-mode `advisorRouting` block in `mode-registry.json` (all 8 modes): `routingClass` (lexical | alias-fold | metadata | command-bridge), `legacyAdvisorId`, `advisorDefaultMode` (agent-improvement only), `legacyAliases`, `packetSkillName`. Plus a top-level `advisorRoutingContract` legend.
- A `--dump-routing-maps` flag on `skill_advisor.py` that emits `DEEP_ROUTING_SKILLS` + `DEEP_ROUTING_MODE_BY_KEY` as JSON (consumed by the test).
- Exporting `DEEP_MODE_BY_CANONICAL` from `aliases.ts` (was module-private) so the test can compare it.
- A new drift-guard vitest (`tests/routing-registry-drift-guard.vitest.ts`).

### Out of Scope
- Making the advisor **read** `mode-registry.json` at runtime (deliberately rejected — C-plus).
- Moving the lexical regex weights (`DEEP_ROUTING_LEXICAL_PATTERNS`) into the registry (kept in Python; JSON escaping would corrupt fixture thresholds).
- Widening the 3-mode `--deep-skill-routing-json` parity contract; any behavior change to routing or convergence.
- The `ai-council` rename (grandfathered via `packetSkillName`; the standard requires folder==name only for new parent skills — a Phase-4 concern).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** Every registry mode carries an `advisorRouting` block with a valid `routingClass` and a `packetSkillName`; lexical + alias-fold modes name a `legacyAdvisorId`.
- **R2 (MUST):** The registry's `lexical` projection equals the Python `DEEP_ROUTING_MODE_BY_KEY`; the `lexical`+`alias-fold` projection equals the TS `DEEP_MODE_BY_CANONICAL`.
- **R3 (MUST):** Each routed mode's `legacyAliases` equals `SKILL_ALIAS_GROUPS[legacyAdvisorId]` (order-insensitive).
- **R4 (MUST):** Exactly one mode is flagged `advisorDefaultMode` (agent-improvement).
- **R5 (MUST):** The existing routing-parity fixtures stay green; the advisor adds no runtime registry read; exactly one `graph-metadata.json` remains under `deep-loop-workflows`.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `npx vitest run` over the drift-guard + both parity suites is green (19 tests).
- `python3 skill_advisor.py --dump-routing-maps` emits the maps and the registry projection matches them exactly.
- One `graph-metadata.json` under `deep-loop-workflows`; `skill_advisor.py` parses clean.
- `validate.sh --strict` green on this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** `../research/research.md` (the chosen model + the C-plus mechanism).

- Registry `legacyAliases` transcribed wrong → the drift-guard fails (caught immediately by R3).
- A future mode added to a hardcoded map without a registry block → the drift-guard fails (the intended behavior).

Rollback is `git restore` of the four touched files + deleting the new test; the change is additive.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **No behavior change:** routing output is byte-identical (the advisorRouting block is data nothing reads at runtime).
- **No hot-path coupling:** the advisor does not import the registry; the drift-guard runs in CI/test only.
- **Validation:** `validate.sh --strict` green before Phase 4.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A command-bridge / metadata mode has no `legacyAdvisorId` (not in either projection map) — the guard skips it from the map comparison by class.
- `model-benchmark` has its own `deep-model-benchmark` alias group but is NOT a mode-map entry; it is `command-bridge` and excluded from the projection.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Low blast-radius and additive: four files (one JSON data block, one Python flag, one TS export, one new test). The risk is transcription accuracy of `legacyAliases`/projections, fully covered by the drift-guard's own assertions.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. The mechanism (C-plus vs runtime-derive) and schema were resolved in `../research/research.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md`.
- **Research** (the recommendation): `../research/research.md`.
- **Touched code**: `mode-registry.json`, `skill_advisor.py`, `aliases.ts`, `tests/routing-registry-drift-guard.vitest.ts`.
