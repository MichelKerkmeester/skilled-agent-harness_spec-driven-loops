# Improvement Iteration 001 — Routing & registry evolution

- **Model**: opus-4.8 (claude2, read-only)
- **Seat**: i01
- **top_pick**: Codegen the derivable projection maps from mode-registry.json with a --check CI gate (paired with a registry-agnostic drift-guard) — drift becomes impossible by construction, the inert-gap closes for alias-fold + projection maps, and all invariants (no runtime read, MCP-free, regex-in-code, one identity) are preserved; lexical regex is honestly the one part codegen cannot author.
- **improvements**: 5

## Analysis

I have a complete, evidence-grounded picture. Here is my analysis.

---

## Routing & Registry Evolution — Improvement Research (i01/5)

### What the architecture actually is (verified)

The registry at `mode-registry.json` is the declarative source of truth, but it is **consumed by nothing at runtime** — only the drift-guard test reads it (`routing-registry-drift-guard.vitest.ts:45`). The advisor routes off two hand-maintained literals: Python `DEEP_ROUTING_MODE_BY_KEY` (`skill_advisor.py:2320-2324`) and TS `DEEP_MODE_BY_CANONICAL` (`aliases.ts:96-101`), plus regex pattern groups (`skill_advisor.py:2326-2366`) and two alias dicts (`skill_advisor.py:228-262`, `aliases.ts:5-48`). The drift-guard's `registryProjection()` (`routing-registry-drift-guard.vitest.ts:47-56`) **already computes exactly what a codegen step would emit** — it just *asserts* equality instead of *writing* the file.

This is the key leverage insight: the projection function exists; flipping it from "assert" to "generate" is nearly free, and it directly answers the angle's question — **consume the registry at BUILD time, not runtime.** That keeps every invariant the documented rationale defends (`skill_creation.md:1087-1088`): no hot-path I/O, no cross-skill import coupling, regex weights stay in code.

### Honest scoping of the KNOWN GAP

The "inert until hand-wired" gap is narrower than it looks, and codegen closes it only partially:

- **`metadata` + `command-bridge` modes are NOT inert** — they need no advisor-map entry at all (`skill_creation.md:1075-1076`). The gap only touches `lexical` and `alias-fold`.
- **`alias-fold` modes are 100% derivable** from the registry → codegen fully closes them.
- **`lexical` modes are only partially derivable**: the projection maps + TS aliases are derivable, but the weighted regex (`DEEP_ROUTING_LEXICAL_PATTERNS`/`STRUCTURAL_PATTERNS`) is deliberately *not* in the registry (`skill_creation.md:1088`), so a new lexical mode will **always** need a human to author its discriminating regex. Codegen cannot change that — and shouldn't try (moving weighted regex to JSON is correctly listed as a NEVER, `skill_creation.md:1103`).

So: codegen removes the cross-language map/alias hand-edits and the drift-guard-goes-RED failure mode, but a lexical mode still needs hand-written regex. I want to be precise about that rather than oversell.

### The real evolution blocker (latent, not yet triggered)

The drift-guard asserts **exact equality against ONE hardcoded registry path**: `expect(py.DEEP_ROUTING_MODE_BY_KEY).toEqual(registryProjection(['lexical']))` (`routing-registry-drift-guard.vitest.ts:82`, path pinned at `:32`). The advisor's projection map is a **single global table**, and `parent-skill-check.cjs:300-301` explicitly concedes 4b is "canonical-only" and every new parent skill must **hand-copy a whole new per-skill drift-guard vitest**. The moment a *second* parent skill declares a `lexical`/`alias-fold` mode, the global Python map becomes a superset of the canonical projection and `.toEqual` **fails by construction**. The current guard architecture cannot host a second routed parent skill at all. At N=1 this is dormant; it is the thing that makes "leave as-is" a deferral, not a resolution.

### Ranked improvements

**I1 — Codegen the derivable projection maps from the registry, with a `--check` CI gate (TOP PICK, P1).**
Emit Python `DEEP_ROUTING_MODE_BY_KEY`+`DEEP_ROUTING_SKILLS` and TS `DEEP_MODE_BY_CANONICAL`+deep-alias groups as committed *generated* literals (with a "generated — do not edit" header). The generator reuses the existing projection logic (`routing-registry-drift-guard.vitest.ts:47-56`); CI runs it in `--check` mode and fails on staleness, replacing the assert-equal guard with generate-then-verify. Drift becomes impossible by construction. *Effort M, risk low-med* (must satisfy formatter/linter on generated source; one-time migration of current literals). *Preserves invariants* — literals still live in advisor code (no runtime registry read), regex stays hand-authored. Variant worth a ruling: emit a JSON sidecar inside the advisor's own dir loaded at import-time (dedups Python/TS into one source) — cleaner, but touches the *letter* of "maps are code literals," so it needs an explicit invariant-spirit sign-off.

**I2 — Make the drift-guard registry-agnostic (P1).**
Glob all `mode-registry.json` files and assert the **union** of their lexical/alias-fold projections equals the advisor map (superset-tolerant), replacing the single-path `.toEqual` (`routing-registry-drift-guard.vitest.ts:32,82`). This removes the per-skill-test hand-step (`parent-skill-check.cjs:300-301`) — the *other* half of the KNOWN GAP — and de-risks the N=2 cliff. *Effort S-M, risk med* (changes equality→union semantics; the global Python map must become a keyed union across registries). *Preserves invariants.* Pairs with I1: together, one generator + one generic guard cover N parent skills with zero per-skill hand-work.

**I3 — Add a JSON Schema for `mode-registry.json` (P2).**
The structural rules (routingClass/discriminator/backendKind enums) are duplicated as ad-hoc literals across `parent-skill-check.cjs:35-48`, the drift-guard test, and `create_parent_skill_auto.yaml` step_5. A single schema deduplicates them, lets the generator (I1) validate input, and lets the scaffolder emit a schema-valid registry by construction. *Effort S, risk low, preserves invariants.*

**I4 — Guard or unify the Python/TS alias-value divergence (P2).**
The two alias sets genuinely differ — Python carries `deep:start-research-loop` (`skill_advisor.py:239`), TS/registry carries `spec_kit:deep-research` (`aliases.ts:16`) — yet the drift-guard checks only that the Python *key* exists, never the values (`routing-registry-drift-guard.vitest.ts:106`). So the Python alias **values are entirely unguarded**; a `spec_kit:deep-research` prompt resolves a mode in TS but misses the Python alias set (lexical regex would still catch it, masking the inconsistency). Either codegen both sets from one registry field or add a value-level guard. *Effort S, risk low.* Open question: is the divergence load-bearing or just unmaintained drift the guard was written to tolerate?

**I5 — Close the scaffolder loop: replace the "inert" warning with "run the generator" (P2).**
Once I1+I2 land, `create_parent_skill_auto.yaml:320-332` ("hand-add Python/TS maps + write a per-skill drift-guard test") collapses to "run the registry generator; the generic guard already covers you." This is the concrete user-facing closure of the KNOWN GAP and is almost entirely downstream of I1+I2. *Effort S, risk low.*

### Honest verdict

At **N=1 parent skill, the C-plus design is near-optimal** and clearly well-reasoned — the arguments against runtime-reading and against regex-in-JSON (`skill_creation.md:1087-1088,1102-1103`) are correct, and I would not touch them. My recommendation is **not** "C-plus is wrong"; it's "the projection-half of C-plus is one cheap generator away from being drift-proof *and* multi-skill-ready, and the cost to build it is low precisely because the projection function already exists." Build I1+I2 now as low-regret insurance against the N=2 cliff; do **not** over-build toward runtime registry consumption.

===RESEARCH-JSON===
{"angle":"Routing & registry evolution (beyond C-plus)","improvements":[{"title":"Codegen the derivable projection maps (Python DEEP_ROUTING_MODE_BY_KEY/DEEP_ROUTING_SKILLS + TS DEEP_MODE_BY_CANONICAL + deep-alias groups) from mode-registry.json with a --check CI gate","rationale":"The drift-guard already computes the exact projection (registryProjection); flipping assert→generate makes drift impossible by construction, eliminates cross-language hand-edits, and answers the angle: consume the registry at BUILD time, not runtime. Regex weights stay in code by design.","evidence":"routing-registry-drift-guard.vitest.ts:47-56,82; skill_advisor.py:2320-2324; aliases.ts:96-101; skill_creation.md:1087-1088","effort":"M","risk":"low","preserves_invariants":true,"priority":"P1"},{"title":"Make the drift-guard registry-agnostic (glob all mode-registry.json, assert the union; superset-tolerant)","rationale":"Today the guard asserts exact equality against one hardcoded canonical registry path, and a 2nd parent skill with lexical/alias-fold modes breaks .toEqual by construction and needs a hand-copied per-skill test. Generalizing removes the per-skill-test hand-step and de-risks the N=2 cliff.","evidence":"routing-registry-drift-guard.vitest.ts:32,82; parent-skill-check.cjs:300-301","effort":"M","risk":"med","preserves_invariants":true,"priority":"P1"},{"title":"Add a JSON Schema for mode-registry.json consumed by the generator + parent-skill-check.cjs","rationale":"routingClass/discriminator/backendKind enums are duplicated as ad-hoc literals across the checker, the drift-guard test, and the scaffolder YAML; one schema deduplicates them and lets the scaffolder emit a valid registry by construction.","evidence":"parent-skill-check.cjs:35-48; create_parent_skill_auto.yaml:297-299","effort":"S","risk":"low","preserves_invariants":true,"priority":"P2"},{"title":"Guard or unify the Python/TS alias-value divergence","rationale":"Python and TS alias VALUES differ (deep:start-research-loop vs spec_kit:deep-research) but the drift-guard checks only Python key presence, leaving alias values entirely unguarded — a latent inconsistency masked by lexical regex.","evidence":"skill_advisor.py:239; aliases.ts:16; routing-registry-drift-guard.vitest.ts:106","effort":"S","risk":"low","preserves_invariants":true,"priority":"P2"},{"title":"Replace the scaffolder's 'inert until hand-wired' warning with 'run the generator'","rationale":"Once codegen + generic guard exist, the scaffolder's advisor_map_sync_note collapses from a 3-step cross-language hand-edit into one generator run — the concrete user-facing closure of the KNOWN GAP.","evidence":"create_parent_skill_auto.yaml:315,320-332","effort":"S","risk":"low","preserves_invariants":true,"priority":"P2"}],"top_pick":"Codegen the derivable projection maps from mode-registry.json with a --check CI gate (paired with a registry-agnostic drift-guard) — drift becomes impossible by construction, the inert-gap closes for alias-fold + projection maps, and all invariants (no runtime read, MCP-free, regex-in-code, one identity) are preserved; lexical regex is honestly the one part codegen cannot author.","open_questions":["Is the Python/TS alias-value divergence (skill_advisor.py:239 vs aliases.ts:16) load-bearing, or unmaintained drift the guard was written to tolerate?","Is the team committed to N=1 parent skill, or is a second routed parent skill on the roadmap? That single fact decides whether I1+I2 are P1 insurance or premature.","For the generator output, emit committed Python/TS source literals (preserves the letter of 'maps are code') or an import-time JSON sidecar in the advisor's own dir (dedups both languages but needs an explicit invariant-spirit ruling)?"]}
===END===

## Improvements (structured)

```json
[
  {
    "title": "Codegen the derivable projection maps (Python DEEP_ROUTING_MODE_BY_KEY/DEEP_ROUTING_SKILLS + TS DEEP_MODE_BY_CANONICAL + deep-alias groups) from mode-registry.json with a --check CI gate",
    "rationale": "The drift-guard already computes the exact projection (registryProjection); flipping assert\u2192generate makes drift impossible by construction, eliminates cross-language hand-edits, and answers the angle: consume the registry at BUILD time, not runtime. Regex weights stay in code by design.",
    "evidence": "routing-registry-drift-guard.vitest.ts:47-56,82; skill_advisor.py:2320-2324; aliases.ts:96-101; skill_creation.md:1087-1088",
    "effort": "M",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P1"
  },
  {
    "title": "Make the drift-guard registry-agnostic (glob all mode-registry.json, assert the union; superset-tolerant)",
    "rationale": "Today the guard asserts exact equality against one hardcoded canonical registry path, and a 2nd parent skill with lexical/alias-fold modes breaks .toEqual by construction and needs a hand-copied per-skill test. Generalizing removes the per-skill-test hand-step and de-risks the N=2 cliff.",
    "evidence": "routing-registry-drift-guard.vitest.ts:32,82; parent-skill-check.cjs:300-301",
    "effort": "M",
    "risk": "med",
    "preserves_invariants": true,
    "priority": "P1"
  },
  {
    "title": "Add a JSON Schema for mode-registry.json consumed by the generator + parent-skill-check.cjs",
    "rationale": "routingClass/discriminator/backendKind enums are duplicated as ad-hoc literals across the checker, the drift-guard test, and the scaffolder YAML; one schema deduplicates them and lets the scaffolder emit a valid registry by construction.",
    "evidence": "parent-skill-check.cjs:35-48; create_parent_skill_auto.yaml:297-299",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P2"
  },
  {
    "title": "Guard or unify the Python/TS alias-value divergence",
    "rationale": "Python and TS alias VALUES differ (deep:start-research-loop vs spec_kit:deep-research) but the drift-guard checks only Python key presence, leaving alias values entirely unguarded \u2014 a latent inconsistency masked by lexical regex.",
    "evidence": "skill_advisor.py:239; aliases.ts:16; routing-registry-drift-guard.vitest.ts:106",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P2"
  },
  {
    "title": "Replace the scaffolder's 'inert until hand-wired' warning with 'run the generator'",
    "rationale": "Once codegen + generic guard exist, the scaffolder's advisor_map_sync_note collapses from a 3-step cross-language hand-edit into one generator run \u2014 the concrete user-facing closure of the KNOWN GAP.",
    "evidence": "create_parent_skill_auto.yaml:315,320-332",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P2"
  }
]
```
