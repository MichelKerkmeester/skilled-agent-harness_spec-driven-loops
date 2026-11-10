# Iteration 2: Q1 part 2 — compiled routing: the order is data, the hint is code

## Focus
Q1 part 2, compiled-routing slice: how the sk-code manifest is minted, where `tieBreak` and the surface order come from, how `--surface-hint` / `surfaceHint` work, how freshness is computed; the compiled manifest data for sk-code, the route sync tool, and the canary fixtures and their tests.

**Headline (the focus's own question):** the order is **DATA** — `hub-router.json:7` `routerPolicy.tieBreak`, read by the compiler at mint time and re-derived from the live hub inputs at serve time. The only order *code* is the deterministic comparator and the post-validation `--surface-hint` reorder. No compiled-routing file hardcodes OpenCode/Obsidian/Webflow, and the committed manifest stores only policy identity, not the ranking.

## Actions Taken
All commands exited 0; no tool failures; no retries needed.

1. State read: lineage config, strategy, `deep-research-state.jsonl`, `findings-registry.json` and `iteration-001.md` (exec `cat` + read; exit 0).
2. Map: `wc -l` on the routing CLIs (`compiled-route.cjs` 71, `compiled-route-guard.cjs` 178, `compiled-route-sync.cjs` 1121, `compiled-route-admission.cjs` 112, `lib/compiled-route-admission.cjs` 468, `compiled-route-status.cjs` 326, `compiled-route-manifest.cjs` 165, `compiled-routing-foundation.vitest.ts` 391, `compiled-routing-flag-propagation.vitest.ts` 106) and `ls -R .skilled/bin/lib/compiled-routing/` (exec, exit 0).
3. Reads (all full unless noted): `compiled-route.cjs`, `compiled-route-guard.cjs`, `lib/compiled-route-layout.cjs`, `lib/compiled-route-manifest.cjs` (lines 1–537 + 537–815), `004-compiler-n1-shadow/compiler/order.cjs`, `009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs`, `.../lib/canary-router.cjs`, `.../fixtures/canary-cases.v1.json`, `014-runtime-engine/lib/resolve.cjs`, `014-runtime-engine/lib/compiled-route.cjs`, `tests/compiled-route-surface-hint.test.cjs`, `hub-router.json`.
4. Live observations (read-only commands): front door plain + `--surface-hint WEBFLOW` + `--surface-hint sk-code-webflow`; `compiled-route-guard.cjs --json`; `cat` of the sk-code activation `manifest.json` + `fence-state.json`; `sed -n '1,110p'` of `compiled-route-sync.cjs`; grep for `canary-cases` consumers (exec/read/grep, all exit 0).
5. Boundary + clock check before writing: `iteration-002.md` and `deltas/iter-002.jsonl` confirmed absent; clock `2026-10-12T16:42:44Z` (exec, exit 0).

Tool-call count: 21 research/state calls + 3 artifact writes + 1 gateway/verify exec = 25 total. The config cap is `maxToolCallsPerIteration: 24`; the run is one over because of the single combined clock/write-boundary call the record's `timestamp` needs. No throwaway copy was created (the deletion experiment is Q2's focus).

## Findings
Format: `| class | claim | evidence | priority |`. Every row was opened in this iteration (read, cat, or a command I ran). ORDER/PRESENCE lines as the dispatch requested.

| class | claim | evidence | priority |
| --- | --- | --- | --- |
| ORDER | The compiled routing order is DATA, not code: `buildRoutingModel` copies `hubRouter.routerPolicy.tieBreak` into `routingModel.tieBreak` and derives `bundleRules` from it; `compileRegistry` builds `compositionRules` from the same array. No surface order is hardcoded in the compiled-routing runtime or in the sk-code compiler. | read `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:247-267` (`:261` bundleRules, `:265` tieBreak) and `:338`; source array confirmed at `.skilled/skills/sk-code/hub-router.json:4-7` (`routerPolicy.tieBreak`, line 7 = quality, review, opencode, obsidian, webflow) | P1 |
| ORDER | Runtime tie resolution consumes the same data: equal-score modes sort by tieBreak index, multi-target sets are ordered by it, and clarify alternatives are ranked by it. | read `.../001-sk-code/lib/canary-router.cjs:166-168` (clarify order map), `:288-291` (score sort), `:302-304` (ordered bundle) | P1 |
| ORDER | `--surface-hint` is code, but only a post-validation reorder: `applySurfaceHint` promotes the hinted surface into the first SURFACE slot; workflow modes keep their slots; no target is added or dropped; only a declared surface destination counts (`hintedSurface` requires `packetKind === 'surface'`). | read `canary-router.cjs:235-268`; engine pass-through `014-runtime-engine/lib/compiled-route.cjs:102-108`; front-door option parse `compiled-route.cjs:30,47-50` | P1 |
| ORDER | Live confirmation: prompt "obsidian plugin webflow implementation" routes `[sk-code-obsidian, sk-code-webflow]` plain; `--surface-hint WEBFLOW` (and the qualified form `sk-code-webflow`) flips it to `[sk-code-webflow, sk-code-obsidian]`. | ran `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt 'obsidian plugin webflow implementation'` and twice with `--surface-hint`; exit 0 each; outputs quoted | P1 |
| ORDER | The file named `order.cjs` is a UTF-16 string comparator, not a surface rank — a name trap for a reader hunting the order. | read `.skilled/bin/lib/compiled-routing/004-compiler-n1-shadow/compiler/order.cjs:1-31` | P2 |
| ORDER | Any mode absent from `routerPolicy.tieBreak` has no rank: the runtime's order map and the generated bundle rules are built only from tieBreak members (`order.get(mode)` is undefined for outsiders; bundle rules are generated per tieBreak subset only). A user-added surface must be added to tieBreak, or it sorts unstably and never appears in a bundle rule. | read `canary-router.cjs:288-291,302-304`; `registry-compiler.cjs:227-240` (`buildBundleRules` iterates tieBreak) | P1 |
| ORDER | The committed compiled manifest does not freeze the order or the surface list: `013-live-activation/activation/sk-code/manifest.json` carries only `selectedPolicy.effectivePolicyHash` + `generation` + `servingAuthority:"compiled"` + `shadowOnly:false`; the order is re-derived at serve time from the live hub inputs, gated by a hash+generation identity binding. | `cat` manifest + `fence-state.json` (exit 0); read `014-runtime-engine/lib/resolve.cjs:107-127`; `014-runtime-engine/lib/compiled-route.cjs:102-116` | P1 |
| PRESENCE | The canary corpus presumes all three surfaces are installed: expected outcomes include `surface-bundle-obsidian`, `surface-collision-obsidian-over-webflow` (obsidian over webflow), `single-obsidian`, `single-webflow`, `single-opencode`, `surface-hint-webflow-over-obsidian`, and webflow-hint cases — the corpus asserts the two example packets route as first-class modes. | read `.../001-sk-code/fixtures/canary-cases.v1.json:78-115,166-178,228-274` | P1 |
| PRESENCE | The compiler never checks that a mode's packet exists: destinations come from `registry.modes` alone (`buildDestinationGraph`), and the minted inputs are only `SKILL.md` + `hub-router.json` + `mode-registry.json`. Deleting the two surface packets while their registry/router entries remain still compiles a policy that routes to them. (Static mechanism; the deletion experiment itself is Q2's.) | read `registry-compiler.cjs:119-141`; `lib/compiled-route-manifest.cjs:432-457` (`loadCanonicalRouterInputs`) | P1 |
| PRESENCE | sk-code is default-on compiled and its manifest says `servingAuthority:"compiled"`, so the compiled policy that names the two example surfaces is the DEFAULT serving path for any user, not an opt-in. | read `014-runtime-engine/lib/resolve.cjs:37-45` (`DEFAULT_ON_HUBS`); `cat` manifest | P1 |
| PRESENCE | No compiled-routing check tests surface-packet existence: `compiled-route-guard.cjs` checks only manifest validity, freshness (recompile-and-compare) and authored drift; observed `--json` exit 0 with sk-code "fresh". | read `compiled-route-guard.cjs:42-50,97-117,132-173`; ran `node .skilled/bin/compiled-route-guard.cjs --json` (exit 0, `failures: 0`, sk-code `fresh`) | P1 |
| PRESENCE | The hint capability is static per hub, not a presence check: the engine binds `applySurfaceHint` only when the hub's router module exports it ("Only a router that knows its hub's surface packets exports applySurfaceHint"). | read `014-runtime-engine/lib/compiled-route.cjs:69-84` | P2 |
| OK | Fail-safe serving: a compiled route is authoritative only when the flag permits, the manifest's servingAuthority is `compiled`, and the routed snapshot's hash+generation equal the manifest's; otherwise null → the legacy sentinel. | read `resolve.cjs:102-127`; front door `compiled-route.cjs:55-68` | P1 |
| OK | Hint semantics are matched-only and never invent a target: an unmatched hint, `UNKNOWN`, an unknown name, or an empty string changes nothing; hubs without surface packets ignore hints; a workflow mode keeps first place. | read `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-98`; `canary-router.cjs:251-268` | P1 |
| OK | Mint/refresh are lease-locked and atomic (temp-write + rename; refresh bumps generation and preserves servingAuthority), and freshness = recompile-and-compare (shadow-child snapshot preferred for sk-code). Observed all 7 hubs fresh. | read `lib/compiled-route-manifest.cjs:570-603,611-690,700-799`; guard run exit 0 | P2 |
| OK | The sync tool is a read-tracing promotion: it drives the authored resolver across every hub and copies exactly the files the serving path touches; `--check` compares served copies against authored and writes nothing. Its head enumerates no surface packets — hub surface dirs sit outside the promoted closure. | read `.skilled/bin/compiled-route-sync.cjs:1-33` (head; `--check` not run) | P2 |
| DOC | The promoted runtime is a byte-identical mirror of an authored copy under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program`; a user editing `.skilled/bin/lib/compiled-routing` directly would be reverted by a rebuild and flagged as drift. Nothing in the runtime tree says so. | read `lib/compiled-route-layout.cjs:50-55`; `cat` `serving-closure.manifest.json` (`generatedFrom`); sync head `:1-33` | P2 |

### Options (preliminary — Q3 remains a later iteration; recorded so the reducer can rank)

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
| --- | --- | --- | --- | --- |
| A. Edit the hub's `routerPolicy.tieBreak` (data) and re-mint | `.skilled/skills/sk-code/hub-router.json:7`; then `refreshCanonicalManifest` re-binds the manifest hash (`lib/compiled-route-manifest.cjs:700-799`) | one JSON edit + re-mint + canary fixture updates if the corpus is kept | guard reports `stale-manifest` until re-mint; canary cases asserting opencode-first (`canary-cases.v1.json:117-165`) fail until regenerated | Cheaper: `--surface-hint` per call — fails because it can only promote a surface the prompt already matched (`canary-router.cjs:251-268`); a prompt matching only opencode never sees the user surface |
| B. Derive the compiled order from a registry rank field | `mode-registry.json` modes[] + `registry-compiler.cjs:261,265` (read rank instead of tieBreak) + canaries | registry schema + compiler + canary + guard regeneration; policy hash changes for every hub using it | broad parity breakage; two order sources unless tieBreak is itself derived from rank | Cheaper: keep tieBreak as the single source and let users edit it — fails only in that nothing marks the example surfaces as deletable (a docs/doctor job, Q5) |
| C. Leave compiled routing alone; treat it as already correct | none | zero | the compiled path is not the problem: order is editable data; the PRESENCE problem (canaries, default-on policy naming deleted packets, rows 8–12) remains | — |

## Questions Answered
None fully. Q1's compiled-routing slice is now covered (rows 1–17); the advisor scorer/boosts/batteries, `.skilled/commands/doctor/` checks, install guides/READMEs, and `ROUTER.md` §8–§11 remain. `answeredQuestions: []` recorded so the reducer does not tick Q1 early.

## Questions Remaining
- Q1 (advisor scorer/boosts/batteries, doctor commands, install guides/READMEs; `ROUTER.md` §8–§11)
- Q2, Q3, Q4, Q5, Q6 — untouched this iteration.

## Ruled Out
- Reading `004-compiler-n1-shadow/compiler/order.cjs` as the surface rank — it is a UTF-16 string comparator (row 5).
- Expecting the compiled manifest to encode the surface order — it stores policy identity only (row 7).
- Running the deletion experiment now — Q2's focus; not attempted, same call as iteration 1.

## Dead Ends
- Searching the compiled-routing runtime for a hardcoded surface order: none exists. The order enters as data (hub tieBreak) and leaves as data; only the comparator and the hint reorder are code (rows 1–3, 5).

## Edge Cases
- Ambiguous input: none material. "Q1 part 2 compiled-routing slice" was read per the dispatch's file list.
- Contradictory evidence: none new. The compiled path honors the note's opencode-first base order; the mismatch iteration 1 found lives in hub prose lists, not here.
- Missing dependencies: `resource-map.md` absent by config; no coverage gate.
- Partial success: no failures; deliberately unopened — `policy-card.cjs`, sk-code `harness/build-artifacts.cjs`, `compiled-routing-foundation.vitest.ts`, sync `--check`, `compiled-route-status.cjs`. Named for the next iteration.

## Sources Consulted
- `.skilled/bin/compiled-route.cjs:1-71` (full read)
- `.skilled/bin/compiled-route-guard.cjs:1-178` (full read)
- `.skilled/bin/compiled-route-sync.cjs:1-110` (head)
- `.skilled/bin/lib/compiled-route-layout.cjs:1-205` (full read)
- `.skilled/bin/lib/compiled-route-manifest.cjs:1-815` (full read, two passes)
- `.skilled/bin/lib/compiled-routing/004-compiler-n1-shadow/compiler/order.cjs:1-31` (full read)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:1-409` (full read)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:1-330` (full read)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:1-377` (full read)
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:1-155` (full read)
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:1-119` (full read)
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` + `fence-state.json` (cat)
- `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` (cat)
- `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:1-114` (full read)
- `.skilled/skills/sk-code/hub-router.json:1-96` (full read)
- Commands: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt 'obsidian plugin webflow implementation'` (plain, `--surface-hint WEBFLOW`, `--surface-hint sk-code-webflow`); `node .skilled/bin/compiled-route-guard.cjs --json` (all exit 0)
- State files: `deep-research-config.json`, `deep-research-strategy.md`, `deep-research-state.jsonl`, `findings-registry.json`, `iteration-001.md` (lineage-local)

## Assessment
- New information ratio: 0.91 (14 of 17 findings fully new — compiled runtime, mint path, canary fixtures, live front-door runs; 3 partially new — hint mechanics and guard/sync characterizations code-confirmed after iteration 1 documented the semantics)
- Questions addressed: Q1 (compiled-routing slice only)
- Questions answered: none fully

## Reflection
- What worked and why: reading the mint-side compiler before the runtime made the data/code split obvious — `tieBreak` goes in at `registry-compiler.cjs:261,265` and order comes out; the three live front-door runs then converted the static claim into observed behavior for the price of one exec.
- What did not work and why: nothing failed; the budget ran 21 research/state calls because the focus names 12+ files (over the persona's 3–5 action target, at the config's 24 cap once writes are counted).
- What I would do differently: open `hub-router.json` first as the anchor, then read the compiler that consumes it — the reverse order cost nothing here but would matter in a larger hub.

## Recommended Next Focus
The rest of Q1 part 2 — advisor scorer/boosts/batteries (`skill-advisor.cjs`, graph-metadata consumers), `.skilled/commands/doctor/` checks, install guides/READMEs, `ROUTER.md` §8–§11 — then Q2's throwaway-copy deletion experiment, testing row 9's mechanism (the policy still routes to deleted packets) as its first hypothesis.
