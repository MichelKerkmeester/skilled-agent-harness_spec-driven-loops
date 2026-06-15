# Improvement Iteration 003 — Runtime backend & 2-skill split

- **Model**: opus-4.8 (claude2, read-only)
- **Seat**: i03
- **top_pick**: Give deep-loop-runtime its own package.json and replace the 8 deep system-spec-kit node_modules reach-ins with bare specifiers, making the 'frozen MCP-free' runtime genuinely self-contained
- **improvements**: 5

## Analysis

I now have a complete, evidence-anchored picture. Here is my principal-architect assessment of the backend boundary.

---

# Improvement Research — Angle i03/5: The Runtime Backend & the 2-Skill Split

## Verdict up front

The `deep-loop-workflows` (hub) / `deep-loop-runtime` (backend) split is **sound and mostly near-optimal**. The consumer/foundation separation is clean, the one-identity invariant holds (verified: exactly one `graph-metadata.json` under each skill), MCP-free is the right call, and the execution-vs-synthesis seam placement is *principled and documented*, not arbitrary. I would not churn the split itself.

There is **one genuine, high-leverage weakness**: the runtime is "isolated" in name (no MCP surface) but is **not self-contained in its dependency graph**. It is parasitic on `system-spec-kit`'s internal `node_modules` layout through 8 deep relative paths, and it is the *only* deep-loop skill with no `package.json` of its own. That is where the improvement budget should go.

---

## What's near-optimal (be honest — don't touch)

**1. The execution-vs-synthesis boundary is a stated principle, not an accident.**
The two re-export seams articulate a real distinction:
- `lib/deep-loop/artifact-root.cjs:4-9` — *"backend plumbing consumed by every graph-backed reducer… the runtime owns the seam so consumers depend on the backend"* → lives in **runtime**.
- `shared/synthesis/resource-map.cjs:4-9` — *"workflow output rendering, NOT runtime backend plumbing, so it lives here… rather than in deep-loop-runtime"* → lives in **workflows/shared**.

The rule is coherent: *execution-path topology resolution* → runtime; *output/synthesis rendering* → workflows. Both re-export the single implementation from `system-spec-kit` (`review-research-paths.cjs` and `resource-map/extract-from-evidence.cjs`), so neither forks logic. This is good design — the re-export-seam pattern keeps one source of truth while pointing each consumer's dependency at the layer it conceptually belongs to. **Leave it.**

**2. MCP-free is correct and should stay frozen.** The README FAQ (`README.md:164-166`) and SKILL NEVER rule (`SKILL.md:201`) justify it: no marshalling round-trip, one hardened implementation. No evidence argues for reintroducing MCP. The "frozen" stability contract on *convergence behavior + MCP surface* is reasonable.

**3. The one-identity keystone holds.** `find` confirms exactly one `graph-metadata.json` per parent skill. No nested markers in mode packets or `shared/`.

---

## The improvement target: the runtime isn't actually self-contained

The runtime's own `graph-metadata.json:9-14` declares `depends_on: system-spec-kit` with context *"imports zod, better-sqlite3, TSX loader… from system-spec-kit paths."* This coupling is **acknowledged by design** — but it's implemented as the most brittle possible form:

- `lib/coverage-graph/coverage-graph-db.ts:3` → `import Database from '../../../system-spec-kit/mcp_server/node_modules/better-sqlite3/lib/index.js'`
- `lib/deep-loop/executor-config.ts:3` and `prompt-pack.ts:3` → `import { z } from '../../../system-spec-kit/mcp_server/node_modules/zod/index.js'`
- `deep-context/scripts/loop-lock.cjs:20-21`, plus the 4 core scripts (`query/status/upsert/convergence.cjs`) → in-process `require()` of `system-spec-kit/scripts/node_modules/tsx/dist/cjs/index.cjs`

`ls` confirms `deep-loop-runtime/node_modules/` contains **only a `.vite` cache** — no `package.json`, no real deps. Meanwhile `system-spec-kit` ships **four** `package.json` files (root, `mcp_server`, `scripts`, `shared`). So the runtime is the anomaly: every other skill manages deps via its own manifest; the runtime reaches across a sibling's *internal* `node_modules/.../lib/index.js` paths.

**Why this matters (the failure mode "frozen MCP-free" leaves open):** "MCP-free" removed the *runtime-call* coupling but deepened a *filesystem-layout* coupling. If `system-spec-kit` upgrades `better-sqlite3` (currently pinned `12.10.0`), moves `mcp_server`, or a package-manager change alters hoisting, all 8 reach-ins and every consumer test break — with opaque `MODULE_NOT_FOUND` cascades across 4 mode packets, not one clear signal.

The seams that re-export *spec-kit domain logic* (`artifact-root`, `resource-map`, `review-research-paths`) should **stay coupled** — spec-folder topology and resource-map rendering are genuinely spec-kit-owned concepts; duplicating them would be worse, and `tests/unit/artifact-root.vitest.ts` already guards that seam with a behavioral parity test. The coupling worth reducing is the **third-party dependency resolution** (zod / better-sqlite3 / tsx), which has no business pointing at a sibling skill's install tree.

---

## Prioritized improvements

### P1 — Make `deep-loop-runtime` dependency-self-contained (top pick)
**What:** Give the runtime its own `package.json` declaring `zod`, `better-sqlite3` (pinned to the same `12.10.0` to avoid native-build/schema drift), and `tsx`. Rewrite the ~8 deep reach-ins to bare specifiers (`require('better-sqlite3')`, `import { z } from 'zod'`). Node resolution walks up from the importing file, so runtime files resolve from `runtime/node_modules` first; cross-package vitest discovery still works because tests resolve from their own location.
**Why:** Directly answers the angle's central question. Converts a "frozen, isolated" runtime that's secretly parasitic into a genuinely self-contained backend, conforming to the repo's *existing* per-skill-manifest norm (this is not a new pattern — it's making the one anomaly match the other four manifests). Removes 8 brittle `../../../system-spec-kit/mcp_server/node_modules/...` paths.
**Evidence:** `coverage-graph-db.ts:3`, `executor-config.ts:3`, `prompt-pack.ts:3`, `deep-context/scripts/loop-lock.cjs:20-21`, `graph-metadata.json:9-14`, runtime `node_modules` = only `.vite`.
**Effort:** M · **Risk:** med (native-module duplication — mitigate by pinning identical better-sqlite3 version; the two builds open *different* DB files so no lock conflict) · **Preserves invariants:** yes (no MCP, no convergence-behavior change, one graph-metadata, fixtures untouched).

### P2 — Add a cross-skill import-resolution guard test (the low-regret first step)
**What:** A small vitest that `require`s each cross-skill seam (`better-sqlite3`, `zod`, `tsx`, `review-research-paths.cjs`, `resource-map` extractor, `artifact-root.cjs`, `runtime-capabilities.cjs`) and asserts it resolves, with a message naming the expected path.
**Why:** Today only `artifact-root.vitest.ts` + `runtime-capabilities.vitest.ts` guard seams behaviorally; the zod/better-sqlite3/tsx deep paths have **only implicit** coverage (they fail buried inside unrelated tests). A guard makes any `system-spec-kit` `node_modules` reorg fail **one fast test with a clear message**. This is the de-risker for P1 and is worth doing *even if P1 is deferred* — pure safety, zero behavior change.
**Evidence:** `tests/unit/artifact-root.vitest.ts:9-11` (parity-style seam guard exists); no equivalent for the 8 node_modules reach-ins.
**Effort:** S · **Risk:** low · **Preserves invariants:** yes.

### P2/P3 — Consolidate the deep-context `loop-lock.cjs` wrapper (verify first)
**What:** `deep-context/scripts/loop-lock.cjs` (114 lines) is a tsx wrapper that loads the runtime's TS `loop-lock` — but the runtime *already* ships `scripts/loop-lock.cjs` (220 lines) as promoted "loop-lock CLI" plumbing (`SKILL.md:71`). Investigate whether context can call the runtime CLI instead of carrying its own wrapper.
**Why:** Potential redundant front-door; the promoted-plumbing whole point was to give every mode one CLI. **Treat as a hypothesis** — confirm they're truly interchangeable (the context wrapper may bind host-driven semantics the runtime CLI doesn't) before demoting.
**Evidence:** `deep-loop-runtime/scripts/loop-lock.cjs` (220) vs `deep-context/scripts/loop-lock.cjs:1-31` (114, thin wrapper).
**Effort:** S · **Risk:** low · **Preserves invariants:** yes.

### P3 — `runtime_capabilities.json` shape-conformance test
**What:** Load every mode's matrix through the runtime resolver (`runtime-capabilities.cjs`) and assert it parses to the expected shape.
**Why:** Three divergent copies exist (research/review/ai-council, distinct md5s); context + improvement ship none. Divergence is *legitimate* (per-mode capability sets), but the resolver lives in the runtime and nothing guards that all matrices satisfy its contract — silent drift risk.
**Evidence:** 3 divergent `runtime_capabilities.json` (md5 `fce5…`, `f375…`, `d572…`); resolver `lib/deep-loop/runtime-capabilities.cjs:61-73`.
**Effort:** S · **Risk:** low · **Preserves invariants:** yes.

### P3 (investigate, do not yet recommend) — shared reducer-core
**What:** Four divergent `reduce-state.cjs` (801/1072/1350/1853 lines) likely share boilerplate (JSONL read, atomic write, lock acquire). Check for a promotable common core into the runtime.
**Why / caveat:** Could be the *right* DRY or a *wrong-abstraction* trap — the hub's whole principle is "no per-mode logic flattening" (`SKILL.md:52`). Only promote a genuinely shared mechanical core, never the per-mode reducer policy.
**Effort:** M · **Risk:** med · **Preserves invariants:** yes (if limited to mechanical core).

---

## What I'd explicitly NOT do
- Do **not** reduce the `artifact-root`/`resource-map`/`review-research-paths` coupling — that's spec-kit domain logic, correctly re-exported and parity-tested. Reducing it means duplication (worse).
- Do **not** reintroduce MCP or add an `improvement` loopType — both correctly forbidden (`SKILL.md:201`, `:83`).
- Do **not** merge the two skills — the hub/runtime boundary cleanly separates advisor-discoverable UX from frozen infrastructure.

## Open questions
- Does the repo's tiny root `package.json` (286 bytes) intend a workspace? If a pnpm-workspace hoist is viable, P1's better-sqlite3 native-dup risk drops to ~zero (one hoisted copy, bare specifiers) — that's the cleaner variant and worth confirming before implementing P1.
- Is the `deep-context` loop-lock wrapper carrying host-driven semantics the runtime CLI lacks? (gates P2/P3 consolidation.)
- Cross-angle: the "C-plus" advisor-routing inertness (registry `advisorRouting` blocks dead until Python/TS maps are hand-edited) touches the registry in `workflows`, not the backend — flagging only so it isn't assumed covered here.

===RESEARCH-JSON===
{"angle":"runtime backend & 2-skill split: split is sound; real weakness is the runtime's non-self-contained dependency coupling on system-spec-kit node_modules","improvements":[{"title":"Make deep-loop-runtime dependency-self-contained via its own package.json (zod, better-sqlite3 pinned 12.10.0, tsx); replace 8 deep node_modules reach-ins with bare specifiers","rationale":"Runtime is MCP-free in name but parasitic on system-spec-kit's internal node_modules layout via brittle ../../../ paths; it is the only deep-loop skill with no manifest while system-spec-kit ships 4. A spec-kit node_modules reorg/upgrade breaks all 4 mode packets with opaque MODULE_NOT_FOUND. Self-containment conforms to the repo's existing per-skill-manifest norm.","evidence":"lib/coverage-graph/coverage-graph-db.ts:3; lib/deep-loop/executor-config.ts:3; lib/deep-loop/prompt-pack.ts:3; deep-context/scripts/loop-lock.cjs:20-21; graph-metadata.json:9-14; runtime node_modules contains only .vite","effort":"M","risk":"med","preserves_invariants":true,"priority":"P1"},{"title":"Add a cross-skill import-resolution guard test for the 8 seams (better-sqlite3, zod, tsx, review-research-paths, resource-map, artifact-root, runtime-capabilities)","rationale":"Only artifact-root and runtime-capabilities seams are guarded today; the zod/better-sqlite3/tsx deep paths have only implicit coverage and fail buried in unrelated tests. A guard makes a spec-kit layout change fail one fast, clearly-messaged test and de-risks P1.","evidence":"tests/unit/artifact-root.vitest.ts:9-11 (seam parity guard exists); no equivalent for the node_modules reach-ins","effort":"S","risk":"low","preserves_invariants":true,"priority":"P2"},{"title":"Consolidate the deep-context loop-lock.cjs wrapper onto the runtime's promoted loop-lock CLI (verify interchangeability first)","rationale":"Runtime ships scripts/loop-lock.cjs (220L) as promoted CLI plumbing, yet deep-context carries its own 114L tsx wrapper — possible redundant front-door against the promoted-plumbing intent. Treat as a hypothesis; the wrapper may bind host-driven semantics.","evidence":"deep-loop-runtime/scripts/loop-lock.cjs (220 lines) vs deep-context/scripts/loop-lock.cjs:1-31 (114-line wrapper); SKILL.md:71 lists loop-lock CLI as promoted plumbing","effort":"S","risk":"low","preserves_invariants":true,"priority":"P3"},{"title":"Add a runtime_capabilities.json shape-conformance test driving every mode's matrix through the runtime resolver","rationale":"Three divergent capability matrices exist with the resolver centralized in the runtime, but nothing guards that each matrix satisfies the resolver's contract — silent per-mode drift risk.","evidence":"3 divergent runtime_capabilities.json (md5 fce5.., f375.., d572..); resolver lib/deep-loop/runtime-capabilities.cjs:61-73","effort":"S","risk":"low","preserves_invariants":true,"priority":"P3"},{"title":"Investigate a shared reducer-core for the 4 divergent reduce-state.cjs (mechanical boilerplate only, not per-mode policy)","rationale":"Four reduce-state.cjs (801/1072/1350/1853 lines) likely share JSONL-read/atomic-write/lock boilerplate promotable to the runtime — but could be a wrong-abstraction trap against the hub's no-flattening principle, so investigate before recommending.","evidence":"reduce-state.cjs copies: deep-context 801, deep-research 1072, deep-improvement 1350, deep-review 1853; SKILL.md:52 no-per-mode-flattening principle","effort":"M","risk":"med","preserves_invariants":true,"priority":"P3"}],"top_pick":"Give deep-loop-runtime its own package.json and replace the 8 deep system-spec-kit node_modules reach-ins with bare specifiers, making the 'frozen MCP-free' runtime genuinely self-contained","open_questions":["Does the 286-byte root package.json intend a pnpm workspace? If so, a hoisted single better-sqlite3 drops P1's native-dup risk to near-zero (cleaner than a standalone runtime manifest).","Does deep-context/scripts/loop-lock.cjs carry host-driven semantics the runtime's promoted loop-lock CLI lacks? (gates the P3 consolidation)","Out-of-angle but unowned: the C-plus advisorRouting inertness lives in the workflows registry + advisor maps, not the backend — confirm another angle covers it."]}
===END===

## Improvements (structured)

```json
[
  {
    "title": "Make deep-loop-runtime dependency-self-contained via its own package.json (zod, better-sqlite3 pinned 12.10.0, tsx); replace 8 deep node_modules reach-ins with bare specifiers",
    "rationale": "Runtime is MCP-free in name but parasitic on system-spec-kit's internal node_modules layout via brittle ../../../ paths; it is the only deep-loop skill with no manifest while system-spec-kit ships 4. A spec-kit node_modules reorg/upgrade breaks all 4 mode packets with opaque MODULE_NOT_FOUND. Self-containment conforms to the repo's existing per-skill-manifest norm.",
    "evidence": "lib/coverage-graph/coverage-graph-db.ts:3; lib/deep-loop/executor-config.ts:3; lib/deep-loop/prompt-pack.ts:3; deep-context/scripts/loop-lock.cjs:20-21; graph-metadata.json:9-14; runtime node_modules contains only .vite",
    "effort": "M",
    "risk": "med",
    "preserves_invariants": true,
    "priority": "P1"
  },
  {
    "title": "Add a cross-skill import-resolution guard test for the 8 seams (better-sqlite3, zod, tsx, review-research-paths, resource-map, artifact-root, runtime-capabilities)",
    "rationale": "Only artifact-root and runtime-capabilities seams are guarded today; the zod/better-sqlite3/tsx deep paths have only implicit coverage and fail buried in unrelated tests. A guard makes a spec-kit layout change fail one fast, clearly-messaged test and de-risks P1.",
    "evidence": "tests/unit/artifact-root.vitest.ts:9-11 (seam parity guard exists); no equivalent for the node_modules reach-ins",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P2"
  },
  {
    "title": "Consolidate the deep-context loop-lock.cjs wrapper onto the runtime's promoted loop-lock CLI (verify interchangeability first)",
    "rationale": "Runtime ships scripts/loop-lock.cjs (220L) as promoted CLI plumbing, yet deep-context carries its own 114L tsx wrapper \u2014 possible redundant front-door against the promoted-plumbing intent. Treat as a hypothesis; the wrapper may bind host-driven semantics.",
    "evidence": "deep-loop-runtime/scripts/loop-lock.cjs (220 lines) vs deep-context/scripts/loop-lock.cjs:1-31 (114-line wrapper); SKILL.md:71 lists loop-lock CLI as promoted plumbing",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P3"
  },
  {
    "title": "Add a runtime_capabilities.json shape-conformance test driving every mode's matrix through the runtime resolver",
    "rationale": "Three divergent capability matrices exist with the resolver centralized in the runtime, but nothing guards that each matrix satisfies the resolver's contract \u2014 silent per-mode drift risk.",
    "evidence": "3 divergent runtime_capabilities.json (md5 fce5.., f375.., d572..); resolver lib/deep-loop/runtime-capabilities.cjs:61-73",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P3"
  },
  {
    "title": "Investigate a shared reducer-core for the 4 divergent reduce-state.cjs (mechanical boilerplate only, not per-mode policy)",
    "rationale": "Four reduce-state.cjs (801/1072/1350/1853 lines) likely share JSONL-read/atomic-write/lock boilerplate promotable to the runtime \u2014 but could be a wrong-abstraction trap against the hub's no-flattening principle, so investigate before recommending.",
    "evidence": "reduce-state.cjs copies: deep-context 801, deep-research 1072, deep-improvement 1350, deep-review 1853; SKILL.md:52 no-per-mode-flattening principle",
    "effort": "M",
    "risk": "med",
    "preserves_invariants": true,
    "priority": "P3"
  }
]
```
