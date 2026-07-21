# Iteration 2: Phase 013 + OPEN QUESTION A — registered-mode count

## Focus

Iteration 2's focus was Q-006 / OPEN QUESTION A: did `6cd8ab14e4e`, `708d25acf04`, and `908efde8d8f` change the registered-mode count that phase 013's eight workstreams assume? Also locks the phase 013 verdict.

## Actions Taken

1. Read `013-mode-and-lane-migrations/spec.md` — confirmed phase 013 is a phase PARENT that fans out into eight mode-migration children: `001-deep-research`, `002-deep-review`, `003-deep-ai-council`, `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark`, `008-deep-alignment`. The spec.md handoff criteria: "every one of the eight modes is migrated and green behind its own mode gate."
2. Resolved `mode-registry.json` at baseline and HEAD with `git show <sha>:.opencode/skills/system-deep-loop/mode-registry.json` → JSON-parsed the `modes` block.
3. Resolved `hub-router.json` at baseline and HEAD the same way → compared `defaultMode`, `routerSignals` keys, and `tieBreak` array.
4. Read the commit bodies of the three routing commits (`6cd8ab14e4e`, `708d25acf04`, `908efde8d8f`) to understand the second-order changes.
5. Grepped `013-mode-and-lane-migrations/**` for routing-default assumptions (`defaultMode`, `hub-identity`, `bare advisor`, `/deep:`) → zero hits.
6. Inspected the 013 per-mode children's structure: each has `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts` subfolders — fractal typed-ledger migration phases, not router-behavior plans.

## Findings

### F2.1 — OPEN QUESTION A ANSWERED: registered-mode count is UNCHANGED at 7

At baseline `0ce43ff589`:
- `mode-registry.json` `modes` block contains **7** entries.
- `hub-router.json` `routerSignals` keys: `{agent-improvement, ai-council, alignment, model-benchmark, research, review, skill-benchmark}` — 7 keys.
- `tieBreak` array: 7 entries.

At HEAD `739b85ac57`:
- `mode-registry.json` `modes` block contains **7** entries (same names).
- `hub-router.json` `routerSignals` keys: identical 7-key set.
- `tieBreak` array: identical 7-entry order.

Phase 013's "eight modes" decomposes as **7 routing modes + 1 shared backbone** (`deep-improvement-common`). The shared backbone is reached internally by its three benchmark variants (agent/model/skill) and is NOT a routing mode in `mode-registry.json`. The decomposition is consistent at both baseline and HEAD.

**Verdict on Q-006 (count):** the registered-mode count phase 013's eight workstreams assume did NOT change. No mode was added, removed, renamed, or merged in the range. [SOURCE: `git show 0ce43ff589:.opencode/skills/system-deep-loop/mode-registry.json` vs `git show 739b85ac57:...` — both have 7 modes; `hub-router.json` `routerSignals` 7 keys at both ends; `013/spec.md` "eight modes" decomposition into 7 routing + 1 backbone.]

### F2.2 — Real second-order drift: routing DEFAULTS and SIGNAL RESTRICTIONS changed

While the count is unchanged, three routing-default premises shifted. Any phase-013 mode-migration plan (or downstream gold/test) that assumed the OLD routing behavior needs revalidation:

| Change | Commit | Old → New | Impact on phase 013 |
|--------|--------|-----------|---------------------|
| `defaultMode` flip | `908efde8d8f` | `"research"` → `null` | A zero-signal deep-loop prompt now defers to `shared/references/smart_routing.md` instead of leaning to research. Phase 013 doesn't depend on this default (its children are typed-ledger migrations), but any route-gold fixture for the migrated modes that asserted `defaultMode=research` is now stale. |
| `hub-identity` class dropped from all 7 modes | `6cd8ab14e4e` | every mode carried `hub-identity` → none do | A hub-maintenance prompt no longer fans out to all modes. Phase 013 migration tests that assumed hub-generic prompts co-fire all seven modes will fail. |
| model-benchmark + skill-benchmark signal restriction | `6cd8ab14e4e` | bare advisor alias → command-bridge-only (`/deep:model-benchmark`, `/deep:skill-benchmark`) | The deep-improvement backbone is now reachable via natural language ONLY through `agent-improvement`. Phase 013 workstreams 006 and 007 inherit this restriction; their entry-point tests need refresh. |
| typed-pair routing surface added | `708d25acf04` | (none) → `shared/references/smart_routing.md` + `leaf-manifest.json` + `resourceContractVersion` | ADDITIVE — no path phase 013 cites is broken. Adds a typed-pair contract every mode migration must honor going forward. |

[SOURCE: `git show 908efde8d8f`, `git show 6cd8ab14e4e`, `git show 708d25acf04` commit bodies; `git diff 0ce43ff589..739b85ac57 -- .opencode/skills/system-deep-loop/hub-router.json` shows `defaultMode: "research"` → `defaultMode: null` and the `defaultResource` change.]

### F2.3 — Phase 013 verdict: needs refinement (low-impact, second-order only)

- **First-order drift:** NONE in phase 013 parent spec.md. The only `mode-registry.json` change in range is the `driftGuard` path string (`mcp_server` → `mcp-server`, from `cc77a1e550a`), which is metadata inside the registry — phase 013 doesn't cite it. `013/spec.md` doesn't pin any snake_case runtime paths.
- **Second-order drift:** REAL but bounded. The migration work itself (typed-ledger schema → reducers → sealed artifacts, per the per-mode children's structure) does not depend on `defaultMode`, `hub-identity`, or the signal restrictions. The drift hits ROUTING TESTS and ROUTE-GOLD FIXTURES, not the migration substrate.
- **Mode-count open question:** ANSWERED (no change; see F2.1).

Phase 013 verdict: **needs refinement**. Refinement scope: refresh route-gold fixtures and any shadow-parity tests that asserted the old routing defaults; acknowledge the command-bridge-only entry restriction in mode-migration plans 006 (model-benchmark) and 007 (skill-benchmark). The eight-workstream structure is intact.

## Questions Answered

- **Q-006** (phase 013 + open question A): ANSWERED. Mode count unchanged (7 routing + 1 backbone = 8 workstreams, well-formed at both ends). Real second-order drift on routing defaults and signal restrictions; refinement scope is test/gold refresh, not migration-substrate redesign. Phase 013 verdict = needs refinement.

## Questions Remaining

- Q-003 (phases 004-006), Q-004 (007-009), Q-005 (010-012), Q-007 (014-015), Q-008 (016-017 + packet-033 question B), Q-009 (negative control).

## Sources Consulted

- `013-mode-and-lane-migrations/spec.md:46` (handoff criteria — "every one of the eight modes is migrated and green")
- `013-mode-and-lane-migrations/spec.md:54` ("Each of the eight modes becomes an independent fractal parent...")
- `git show 0ce43ff589:.opencode/skills/system-deep-loop/mode-registry.json` vs `git show 739b85ac57:...` (7 modes at both ends)
- `git show 0ce43ff589:.opencode/skills/system-deep-loop/hub-router.json` vs `git show 739b85ac57:...` (`defaultMode: "research"` → `null`; routerSignals 7 keys unchanged; tieBreak 7 entries unchanged)
- `git show --stat 908efde8d8f`, `git show --stat 708d25acf04`, `git show --stat 6cd8ab14e4e` (commit bodies document the three second-order changes)
- `git diff 0ce43ff589..739b85ac57 -- .opencode/skills/system-deep-loop/mode-registry.json` (30-line diff: only `resourceContractVersion` added + `driftGuard` path renamed; `modes` block untouched)
- `013/{001..008}/` directory listings (each mode child has `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts` — typed-ledger migration subphases, not router-behavior plans)
- Grep for `(defaultMode|hub-identity|bare advisor|/deep:|defaultResource|smart_routing|smart-routing)` across `013/**` → zero hits (confirms migration plans don't cite routing defaults)

## Assessment

- **newInfoRatio: 0.85** — Nearly all the routing-default evidence is net-new; the only re-derived item is "7 modes at both ends" which extends iter 1's commit-bucket observation. The second-order drift inventory (F2.2) and the mode-count resolution (F2.1) are both first-time findings.
- **Novelty justification:** resolved the load-bearing OPEN QUESTION A with a direct count at both ends, AND produced a per-change second-order-drift inventory the spec's open-question framing didn't enumerate. The mode-count answer is binary and reproducible; the second-order inventory required reading three commit bodies and matching each to a phase-013 impact axis.
- **Confidence:** high. The mode-count is reproducible from documented commands. The second-order drift attributions are each tied to a named commit with a documented commit body.
- **Tool-call budget:** 6/12 used. Reserved headroom for state writes.

## Reflection

### What worked

- Reading the three routing-commit bodies BEFORE judging impact: each commit body states its effect in plain language ("flip four hubs to defaultMode null", "Drop hub-identity from all seven modes", "Restrict their signals to the exact command surfaces"). This collapsed the second-order analysis — no inference required.
- Decomposing phase 013's "eight modes" into 7 routing + 1 backbone: explained why mode-registry.json has 7 entries while phase 013 plans 8 children. The "missing" mode is `deep-improvement-common`, which is a shared substrate packet, not a routing identity.
- Grepping `013/**` for routing-default assumptions and getting zero hits: that's the negative result that confined the second-order drift to tests/gold, away from the migration substrate itself.

### What failed

- _Approach (rejected):_ "If routing commits touched the registry, the mode count must have changed." _Reason ruled out below._

### Ruled out

- _Approach:_ "Conflate `modes` count in mode-registry.json with phase 013's eight workstreams." _Reason ruled out:_ the registry counts routing identities (7); phase 013's eight = 7 routing + 1 shared backbone (`deep-improvement-common`). They are different axes. _Evidence:_ `013/spec.md:54` says each mode becomes an independent fractal parent; `013/004-deep-improvement-common/` exists as a child but `deep-improvement-common` is not a key in `mode-registry.json` `modes`.
- _Approach:_ "Treat the defaultMode flip as first-order drift." _Reason ruled out:_ no phase-013 path fails to resolve because of it; it's a behavior change, not a path break. _Evidence:_ grep for `defaultMode` in `013/**` = 0 hits.

## Recommended Next Focus

Iteration 3: Phase 004-006 drift. Phase 004 (architecture coverage + transition contract), 005 (fanout live-tools unblock — touched by `739b85ac57` itself), 006 (transition authorized-ledger core — touched by `6cd8ab14e4e` and `708d25acf04`). Resolve every runtime path each phase names against pinned HEAD; flag any premise invalidated by the typed-pair routing surface.
