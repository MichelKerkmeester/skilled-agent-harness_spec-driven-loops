---
title: "Feature Specification: defaultMode Policy Implementation"
description: "Implement the vetted defaultMode recs from 021 research: keep sk-prompt, flip system-deep-loop / mcp-tooling / sk-design / cli-external to defaultMode null with a routing-helper fallback, and fix sk-design's hub-identity over-emission. Reversible, gated on route-gold, one hub at a time. Executor: GPT-5.6-SOL high fast."
trigger_phrases:
  - "default mode implementation"
  - "flip hubs to null default"
  - "sk-design hub-identity over-emission fix"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: defaultMode Policy Implementation

---

## EXECUTIVE SUMMARY

Apply the `defaultMode` recommendations synthesized in the sibling research packet (`021`). A parent hub is a pure router that defers on a zero-signal request; a non-null `defaultMode` is only a defer-time lean plus a catch-all vocabulary anchor. For four hubs that lean is a presumption (or dead metadata), so they flip to `null`; `sk-prompt` keeps its default because it genuinely anchors the `hub-identity` catch-all. When a hub cannot pick a mode, its `defaultResource` fallback should load the routing helper (the mode-map: `smart_routing.md` + `mode-registry.json`), pointing the request at how to choose — never a guessed child.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete — 4 hubs flipped, sk-design over-emission fixed, defer-routed archetype added; route-gold held all baselines |
| **Created** | 2026-07-17 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-sk-doc-router-alignment/020-router-unification-program` |
| **Executor** | GPT-5.6-SOL high fast (independently verified) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Five hubs point `defaultMode` at a child. For four of them the metadata contradicts their own authored defer behavior (or is fully vestigial), and the fallback resource carries a child bias. Separately, `sk-design` carries the `hub-identity` catch-all class on all six modes — the exact over-emission defect the fleet route-gold program cured elsewhere — which escaped detection only because sk-design has no route-gold scenarios. Purpose: reconcile the metadata to authored behavior, remove the child bias in the fallback, and fix the sk-design defect — reversibly and gated.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (config-only, this packet)
- Flip `defaultMode` → `null` on `system-deep-loop`, `mcp-tooling`, `cli-external-orchestration`, `sk-design`.
- Repoint each flipped hub's `defaultResource` → `["shared/references/smart_routing.md", "mode-registry.json"]` (the routing helper).
- `sk-design`: remove `hub-identity` from all six modes' `classes` (keep the class definition as discovery-only).
- Keep `sk-prompt` unchanged.
- Gate each change on route-gold staying green; keep reversibility values recorded below.

### Reversibility record (original values, for rollback)
| Hub | orig defaultMode | orig defaultResource |
|-----|------------------|----------------------|
| system-deep-loop | `research` | `["README.md"]` |
| mcp-tooling | `mcp-chrome-devtools` | `["mcp-chrome-devtools/SKILL.md"]` |
| cli-external-orchestration | `cli-opencode` | `["cli-opencode/SKILL.md"]` |
| sk-design | `interface` | four `shared/*` docs |

Route-gold baselines (must hold after): sdl 20/20, mcp 13/13, cli 7/7, sk-design 0/0 — all PASS.

### Out of Scope (shared-machinery / refinement follow-ups)
- The `defaultApplied` → dual-write telemetry (`configured` vs `consulted` vs `selected`) — lives in the shared scorer (`router-replay.cjs`), off-limits here.
- The "compressed presented-not-scored disambiguation card" mechanism — needs runtime/scorer support.
- `cli-external`'s runtime-detection block (auto-exclude the in-runtime CLI) — a new mechanism, deferred; the null flip is the safe first step.
- The create-skill canon third "defer-routed" archetype — handled adjacent.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-1 | Four hubs flip to `defaultMode: null` + routing-helper `defaultResource` | JSON parses; values match §3 |
| REQ-2 | sk-design `hub-identity` removed from all 6 modes' classes | router-replay on a hub-generic prompt no longer co-fires all 6 modes |
| REQ-3 | No route-gold regression | each hub holds its baseline verdict/counts |
| REQ-4 | Reversible + config-only | no shared-machinery edits; original values recorded |
| REQ-5 | Canon gains a defer-routed archetype | create-skill `parent_hub_router_schema` documents null-default defer-routed hubs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-1**: All four hubs at `defaultMode: null` with the routing-helper fallback; sk-prompt unchanged.
- **SC-2**: sk-design over-emission fixed (verified via router-replay).
- **SC-3**: Route-gold green fleet-wide, no regression.
- **SC-4**: Every change reversible from the recorded originals.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| A null flip raises disambiguation friction on a hub whose default was genuinely dominant | Low | Medium | Config-only + reversible from the recorded originals; gated on route-gold |
| Removing `hub-identity` from sk-design modes under-emits on a real hub-identity prompt | Low | Medium | Class kept as discovery-only; router-replay confirms defer, not silence |

### Dependencies

| Dependency | Status |
|------------|--------|
| 021 defaultMode research (keep-1/flip-4 recs) | Vetted; drives this packet |
| Route-gold baselines (sdl 20/20, mcp 13/13, cli 7/7, sk-design 0/0) | Green; gate for every change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- `defaultApplied` dual-write telemetry lives in the shared scorer (off-limits) — the constraint conflict is unresolved and needs an operator decision.
- Live measurement (a sol-ultra 2x4 keep-vs-null benchmark) would turn the directional confidence into measured — not yet run.
<!-- /ANCHOR:questions -->
