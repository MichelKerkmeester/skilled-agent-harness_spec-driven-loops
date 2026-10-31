# Iteration 5 — RQ4: Dependencies — recursive load closure vs advisor edge handling

Focus: the extension's root-plus-recursive-dependency loading, and whether the advisor acts on
`depends_on`/`enhances` at recommendation time or should return a dependency bundle.

## Findings

### F5-1 — The advisor acts on dependency edges only as score propagation, never as a bundle

- **Orchestrator mechanism** [CONFIRMED]: `resolveDependencyGraph` walks a DFS closure from the
  root — order, edges, missing set and cycles are all reported
  (`context/pi-skill-orchestrator-main/src/dependencies.ts:50-93`); dependencies are exempt from
  scope limits (`context/pi-skill-orchestrator-main/docs/dependencies.md:9`); one `skill` tool call
  returns root + closure (`context/pi-skill-orchestrator-main/src/index.ts:736-746`,
  `details.loaded`/`missing`/`cycles`).
- **Advisor counterpart** [CONFIRMED]: `depends_on` edges exist as *authored* metadata
  (`.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/metadata-loader.ts:119-135`)
  and enter scoring only as graph-causal multipliers — `enhances` 0.55, `siblings`/`depends_on`
  0.35, `prerequisite_for` 0.30, `conflicts_with` -0.35, BFS depth 2 / breadth 4
  (`.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:83-85`;
  `runtime/lib/scorer/lanes/graph-causal.ts:28-30`). Neither the brief builder nor the recommend
  handler mentions dependencies, bundles or companions [CONFIRMED by absence — no match for
  `depend|bundle|companion` in `runtime/lib/skill-advisor-brief.ts` or
  `runtime/handlers/advisor-recommend.ts`]; the brief carries at most two skill labels
  (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts:409-433`).
- **Proposed change**: do **not** return a dependency bundle in the brief. The 80-token cap could
  not hold it honestly, and the skill body — which the loading runtime reads anyway — carries its
  own dependency instructions (the framework's loading rules name the owner docs per skill).
- **Benefit**: keeps the brief single-decision; avoids spending tokens on information the body
  restates.
- **Cost**: none.
- **Risk**: a root whose closure surprises the model costs one extra discovery step; bounded by the
  body's own guidance.
- **Verdict: REJECT** (dependency bundle in the brief) — bundle loading is a runtime/loading-layer
  behavior; the brief's job is the single best root pick.

### F5-2 — Negation-aware derivation beats bare authored edges for graph truth

- **Orchestrator mechanism** [CONFIRMED]: automatic dependency detection scans bodies for five
  reference shapes (`context/pi-skill-orchestrator-main/src/dependencies.ts:23-38`) and explicitly
  ignores negated references ("Do not use X", "Never call skill(X)")
  (`dependencies.ts:8-21`, `docs/dependencies.md:25-30`; guarantee at
  `tests/dependencies.test.mjs:91`).
- **Advisor counterpart** [CONFIRMED]: edge authoring is semi-automatic only for `enhances`
  (`.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/detect-inbound-enhances.ts:1-4`,
  composite scoring at `:142-160`); `depends_on` entries are hand-authored and validated on load
  (`metadata-loader.ts:123-135`). Nothing re-derives `depends_on` from body text, so an outdated
  authored edge keeps injecting a 0.35 multiplier into fusion.
- **Proposed change**: add a `depends_on` derivation assist in the cross-skill-edges tooling that
  reuses the extension's conservative reference patterns plus the negation guard, emitting
  candidates for review the way `detectInboundEnhances` does — not silent auto-patch.
- **Benefit**: graph-causal weights track reality; stale edges stop inflating sibling skills.
- **Cost**: one detector module mirroring `dependencies.ts:4-38` logic; runs in the existing
  `skill_graph_propagate_enhances`-style maintenance pass
  (`.skilled/skills/system-skill-advisor/ARCHITECTURE.md:29`).
- **Risk**: pattern-based detection can over-fire on prose mentions ("the sk-git skill" in docs);
  the extension's own conservative patterns plus candidate-review output bound this.
- **Verdict: ADAPT** — borrow the detection heuristics and the negation guard into edge
  *maintenance*, keeping human review before any graph write.

### F5-3 — Missing/cycle reporting is a model-visible contract the advisor lacks

- **Orchestrator mechanism** [CONFIRMED]: load results report `missing` and `cycles` alongside
  `loaded` (`context/pi-skill-orchestrator-main/src/index.ts:740-746`), and a body read failure
  propagates instead of being silently skipped
  (`tests/dependencies.test.mjs:65`; `docs/dependencies.md:34`).
- **Advisor counterpart** [CONFIRMED]: the graph BFS silently stops at missing targets (traversal
  over what exists; `advisor-scorer.md:85` describes depth/breadth bounds but no missing-edge
  report); the brief has no channel for graph health.
- **Proposed change**: none in the brief. Optionally surface graph-health gaps through the
  existing `advisor_status` trust surface (`.skilled/skills/system-skill-advisor/ARCHITECTURE.md:29`)
  so operators see broken edges, not the model.
- **Benefit**: operator-visible graph rot; model prompt stays clean.
- **Cost**: one status field.
- **Risk**: none material.
- **Verdict: ADAPT** — move the missing/cycle honesty to the trust surface where the advisor's
  operator reads, rather than into model context.

## Ruled out this iteration

- Autonomous edge auto-patching (writing `depends_on` straight into metadata) — the existing
  `enhances` flow already stages candidates with human apply
  (`cross-skill-edges/apply-graph-metadata-patch.ts:75-119`); silent writes would violate that
  contract and the phase's read-only stance.
- Whether the *loading runtime* should auto-load `depends_on` closures — a runtime question
  (the extension implements it for Pi; other runtimes differ), out of the advisor's surface.

## Claim ledger

| Claim | Status | What would confirm |
|-------|--------|--------------------|
| Dependency closure loads with root in one call; missing/cycles reported | CONFIRMED | — (`dependencies.ts:50-93`, `index.ts:736-746`) |
| Advisor uses edges only as score multipliers; no bundle anywhere | CONFIRMED | — (`graph-causal.ts:28-30`, absence grep over brief/handler) |
| `depends_on` edges are hand-authored only | CONFIRMED | — (`metadata-loader.ts:119-135`; only `enhances` has a detector) |
| Stale `depends_on` edges measurably inflate wrong recommendations | INFERRED | Replay fusion with/without suspect edges on a labelled prompt set |
| Negation-aware body scanning would improve edge derivation | INFERRED | Run the extension's detector over the advisor's skill corpus and count review candidates that humans accept |
