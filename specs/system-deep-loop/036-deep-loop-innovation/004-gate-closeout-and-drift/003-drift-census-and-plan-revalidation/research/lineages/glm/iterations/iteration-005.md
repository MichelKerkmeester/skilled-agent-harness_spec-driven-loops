# Iteration 5: Phases 010-012 drift

## Focus

Iteration 5's focus was Q-005: drift over phases 010 (novelty claims + continuity + projections — flagged medium risk from `cc77a1e550a`'s continuity-reference renames), 011 (convergence + termination + health — flagged low-medium risk from `cc77a1e550a`'s convergence-reference renames), and 012 (shared mode contracts + fixtures — flagged HIGH risk from `6cd8ab14e4e`/`708d25acf04`/`908efde8d8f` plus the skill-benchmark typed-pair series). The highest-risk pending batch; most likely to surface additional drift beyond phases 003 and 013.

## Actions Taken

1. Read `010/spec.md` — five children (semantic-communities, typed-contradiction-and-supersession, claim-continuity, next-focus-semantics, transactional-projections-and-gauges). Cited paths: `002-.../research/research-modes.md` only.
2. Read `011/spec.md` — five children (path-covering-termination, cycle-detection, independent-stopping-clocks, value-of-computation-allocation, health-and-degeneration-harness). Cited paths: `runtime/lib/council/convergence.cjs`, `002-.../research/research-modes.md`, `036/spec.md`, `manifest/phase-tree.json`.
3. Read `012/spec.md` — four children (shared-mode-interfaces, cross-mode-closures, mixed-version-fixtures, write-set-conflict-graph). Cited paths: `execution-sequencing-strategy.md`, `manifest/phase-tree.json`.
4. Resolved `runtime/lib/council/convergence.cjs` at HEAD with `git cat-file -e`.
5. Grepped phases 010/011/012 spec.md+children for snake_case path citations subject to kebab drift (`state_format|integration_points|behavior_benchmark|leaf_manifest|smart_routing|hub_router|mode_registry|mcp_server|fanout_run|deep_research|deep_review|research_modes`).
6. Verified `cc77a1e550a`'s scope on deep-loop continuity/convergence reference files via `git show --stat cc77a1e550a | grep -E "(system-deep-loop|convergence|continuity|novelty|projection)"`.

## Findings

### F5.1 — Phase 010 zero drift

Phase 010's only cited runtime/intra-packet path is `002-deep-loop-effectiveness-and-fanout/research/research-modes.md`, which resolves at HEAD. Phase 010's spec.md does not cite any `runtime/` paths, any continuity-reference files, or any `behavior_benchmark/` glob.

Phase 010's scope (semantic communities, contradiction/supersession, claim continuity, next-focus semantics, transactional projections) is a forward-looking intelligence layer over the durable substrate. None of the routing commits (`6cd8ab14e4e`, `708d25acf04`, `908efde8d8f`) or the kebab migration (`cc77a1e550a`) touch the surfaces phase 010 plans.

Iter 1 flagged phase 010 as "medium" risk because `cc77a1e550a` renamed session-continuity files. But phase 010's "claim continuity" is a different concept — it tracks claim lifecycles across iterations, not user-session continuity. The rename was over-cautiously bucketed; phase 010's actual surface is untouched.

**Phase 010 = still valid.** [SOURCE: `010/spec.md:54,56,64,66,67,68`; `git cat-file -e 739b85ac57:...research-modes.md` resolves; grep for snake_case paths in `010/**` = 0 hits.]

### F5.2 — Phase 011 zero drift; runtime anchor `council/convergence.cjs` resolves

Phase 011 cites one runtime path: `.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs`. RESOLVES at HEAD. The `council/` directory contains 10 files including convergence.cjs (the COUNCIL-specific convergence anchor phase 011 generalizes from).

`cc77a1e550a` did NOT rename `convergence.cjs` — it was already kebab-safe (no underscore). The kebab migration DID rename related deep-loop coverage-graph files (`coverage-graph/deep-loop-graph-convergence.md` and `deep-loop-graph-convergence-yaml-fire.md`), but phase 011 doesn't cite either.

Phase 011's scope (path-covering termination, cycle detection, stopping clocks, value-of-computation, health harness) generalizes from `convergence.cjs`'s council-specific logic to all modes. The anchor file is intact; the generalization work is still well-formed. None of the routing commits touch convergence/termination surfaces.

**Phase 011 = still valid.** [SOURCE: `011/spec.md:52,54,62,63,66`; `git cat-file -e 739b85ac57:...council/convergence.cjs` resolves; `git ls-tree 739b85ac57:...council/` shows convergence.cjs present; grep for snake_case paths in `011/**` = 0 hits.]

### F5.3 — Phase 012 needs refinement (HIGH risk materialized as second-order drift)

Phase 012's spec.md cites only intra-packet paths (`execution-sequencing-strategy.md`, `manifest/phase-tree.json`) — both resolve at HEAD. Phase 012 has NO direct `runtime/` path citations and zero snake_case citations. So **zero first-order drift**.

But phase 012's PREMISE — "freeze the shared mode boundary before the eight phase-013 migrations" — is now describing a DIFFERENT boundary than at baseline. The shared mode boundary includes the very files the routing commits changed:

| Boundary component | Baseline state | HEAD state | Phase 012 implication |
|---------------------|----------------|------------|----------------------|
| `mode-registry.json` | 7 modes, no `resourceContractVersion` | 7 modes + `resourceContractVersion: 1` (added by `708d25acf04`) | The freeze must now include the typed-pair resource contract version. |
| `hub-router.json` `defaultMode` | `"research"` | `null` (flipped by `908efde8d8f`) | The freeze must capture the post-flip default (null), not the baseline default. |
| `hub-router.json` `routerSignals.{model-benchmark,skill-benchmark}` | bare advisor alias OK | command-bridge-only (restricted by `6cd8ab14e4e`) | The freeze must capture the restricted signal surface, not the baseline surface. |
| `shared/references/smart_routing.md` | ABSENT | PRESENT (added by `708d25acf04`) | The freeze must include this new file as part of the boundary. |
| `leaf-manifest.json` | ABSENT | PRESENT (added by `708d25acf04`) | The freeze must include the leaf-manifest as part of the boundary. |

This is real second-order drift, but it is REFINEMENT-CLASS, not invalidation-class:

- Phase 012's spec doesn't pin the specific boundary state — it says "freeze" in the forward-looking sense. So the work is still well-formed; it must freeze the CURRENT (HEAD) boundary, which is larger than the baseline boundary by exactly the five rows above.
- The `003-mixed-version-fixtures/` child becomes more interesting: mixed-version scenarios must now span a larger delta (the routing commits are a version discontinuity inside the boundary phase 012 must freeze). The fixtures become more valuable, not less.
- The `004-write-set-conflict-graph/` child must add the new typed-pair surface to the conflict graph, since two phase-013 mode migrations could now race on `smart_routing.md` or `leaf-manifest.json` writes.

The HIGH risk rating from iter 1 materialized — but as second-order drift requiring scope expansion (acknowledge the five new boundary components), not as path breakage.

**Phase 012 = needs refinement** (second-order: shared mode boundary grew by 5 components since baseline; freeze scope and mixed-version fixtures must expand to cover them; write-set conflict graph must add the new typed-pair surface). [SOURCE: `012/spec.md:47,55,65`; `git diff 0ce43ff589..739b85ac57 -- .opencode/skills/system-deep-loop/mode-registry.json` (resourceContractVersion added); `git diff 0ce43ff589..739b85ac57 -- .opencode/skills/system-deep-loop/hub-router.json` (defaultMode flipped, signals restricted); `git show --stat 708d25acf04` adds `shared/references/smart_routing.md` + `leaf-manifest.json`.]

## Questions Answered

- **Q-005** (phases 010-012 drift): ANSWERED. Phase 010 still valid (zero drift; iter 1 over-cautious). Phase 011 still valid (zero drift; runtime anchor intact). Phase 012 needs refinement (HIGH risk materialized as second-order; the shared mode boundary phase 012 must freeze grew by 5 components since baseline).

## Questions Remaining

- Q-007 (phases 014-015), Q-008 (phases 016-017 + packet-033 question B), Q-009 (negative control — phases 004, 006, 007 all qualify).

## Sources Consulted

- `010/spec.md:54,56,64,66,67,68`
- `011/spec.md:52,54,62,63,66`
- `012/spec.md:47,55,65`
- `git cat-file -e 739b85ac57:.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs` (resolves)
- `git ls-tree 739b85ac57:.opencode/skills/system-deep-loop/runtime/lib/council/` (convergence.cjs present)
- `git show --stat cc77a1e550a | grep -E "(system-deep-loop|convergence|continuity|novelty|projection)"` (renames touched session-continuity and coverage-graph docs, NOT phase 010/011 surfaces)
- Grep for snake_case paths across `010/**`, `011/**`, `012/**` — 0 hits each
- `git diff 0ce43ff589..739b85ac57 -- mode-registry.json` (resourceContractVersion added)
- `git diff 0ce43ff589..739b85ac57 -- hub-router.json` (defaultMode + signal restrictions)
- `git show --stat 708d25acf04` (smart_routing.md + leaf-manifest.json added)

## Assessment

- **newInfoRatio: 0.70** — Higher than iter 4: F5.3 is the first new "needs refinement" verdict since iter 2's phase 013, and it required inventing a 5-row boundary-component comparison that no prior iteration produced. F5.1's "claim continuity ≠ session continuity" disambiguation is also a load-bearing distinction that protected phase 010 from a false-positive.
- **Novelty justification:** F5.3's "phase 012 must freeze a larger boundary than at baseline" is the first verdict in this loop where a phase's WORK SCOPE has to expand rather than just refresh tests or fix paths. That required enumerating every file the routing commits added or flipped inside the shared-mode boundary.
- **Confidence:** high. Reproducible from documented `git diff` commands.
- **Tool-call budget:** 4/12 used. Reserved headroom for state writes.

## Reflection

### What worked

- Inventing the boundary-component comparison table for F5.3: turned a vague "phase 012 depends on routing" intuition into a 5-row enumeration each tied to a specific commit and a specific file change. The refinement recommendation now names exactly what phase 012 must add to its freeze scope.
- Distinguishing "claim continuity" (phase 010 concept) from "session continuity" (the renamed docs): protected phase 010 from a false-positive driven by keyword matching on "continuity".
- Resolving `council/convergence.cjs` directly before judging phase 011: the file was always kebab-safe, so the kebab migration couldn't have touched it. Reading the directory listing confirmed this in one call.

### What failed

- _Nothing failed._ Iteration 5 was clean.

### Ruled out

- _Approach:_ "Treat phase 012 as invalidated because the routing commits changed mode-registry.json and hub-router.json." _Reason ruled out:_ phase 012's spec doesn't pin the boundary state; it freezes whatever the current boundary is. The work is still well-formed; only its scope expands. _Evidence:_ `012/spec.md:47` ("Shared mode interfaces are frozen") — forward-looking freeze, not backward-looking.

## Recommended Next Focus

Iteration 6: Phases 014-015 drift. Phase 014 (staged state migration + authority cutover — touched indirectly by `9259c23e313` path refs and mode-routing churn). Phase 015 (legacy writer retirement — flagged low risk; verify writer paths still exist). After iteration 6, only phases 016-017 + open question B remain before synthesis.
